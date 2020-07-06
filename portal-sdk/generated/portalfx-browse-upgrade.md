
<a name="upgrading-to-the-latest-browse-api"></a>
# Upgrading to the latest Browse API

Browse v2 introduces paging and a greatly-simplified API for ARM resources. Browse v2 doesn't support non-ARM assets, yet; but if you have an ARM resource, you can start with no-code Browse and build out based on your needs.

<a name="upgrading-to-the-latest-browse-api-start-with-no-code"></a>
## Start with &quot;no-code&quot;

First thing's first, replace the `Browse` and `GridColumns` nodes on your asset type definition with a new `Browse` node that has the `Type` set to `ResourceType`:

    ```xml
    <AssetType Name="MyAsset" Text="{Resource MyAsset.text, Module=ClientResources}" ...>
      <Browse Type="ResourceType" />
      <ResourceType
          ResourceTypeName="Resource.Provider/types"
          ServiceViewModel="MyAssetServiceViewModel"
          MappingViewModel="MyAssetMappingViewModel" />
    </AssetType>
    ```

Next, update the display name for our asset type to include singular/plural and uppercase/lowercase variants. These will help ensure we display the right text at the right time throughout the portal.

    ```xml
    <AssetType
        Name="MyAsset"
        SingularDisplayName="{Resource MyAsset.singular, Module=ClientResources}"
        PluralDisplayName="{Resource MyAsset.plural, Module=ClientResources}"
        LowerSingularDisplayName="{Resource MyAsset.lowerSingular, Module=ClientResources}"
        LowerPluralDisplayName="{Resource MyAsset.lowerPlural, Module=ClientResources}"
        ...>
      <Browse Type="ResourceType" />
      <ResourceType
          ResourceTypeName="Resource.Provider/types"
          ServiceViewModel="MyAssetServiceViewModel"
          MappingViewModel="MyAssetMappingViewModel" />
    </AssetType>
    ```

That's it! You can now see your resource type in the Browse hub.

<a name="upgrading-to-the-latest-browse-api-customizing-columns"></a>
## Customizing columns

No-code Browse shows the resource name, group, location, and subscription by default. To change the default columns, you'll need to opt in to custom config and define an asset view-model:

    ```xml
    <AssetType Name="MyAsset" ViewModel="MyAssetViewModel" ...>
      <Browse Type="ResourceType" UseCustomConfig="true" />
      ...
    </AssetType>
    ```

The asset view-model class implements the an generated interface to help enforce the declared functionality:

    ```ts
    class MyAssetViewModel implements ExtensionDefinition.ViewModels.ResourceTypes.MyAssetViewModel.Contract {
        public getBrowseConfig(): PromiseV<MsPortalFx.Assets.BrowseConfig> {
            return Q.resolve({
                ...
            });
        }
    }
    ```

Start by copying the column config from your grid column service view-model:

    ```ts
    this.columns([{
        id: "name",
        name: ko.observable<string>(ClientResources.myAssetNameColumn),
        itemKey: "name"
    },{
        id: "resourceGroup",
        name: ko.observable<string>(ClientResources.myAssetGroupColumn),
        itemKey: "resourceGroup"
    },{
        id: "type",
        name: ko.observable<string>(ClientResources.type),
        itemKey: "type",
        format: MsPortalFx.ViewModels.Controls.Lists.Grid.Format.HtmlBindings,
        formatOptions: {
            htmlBindingsTemplate: "<div data-bind='text: type'></div> (<div data-bind='text: subtype'></div>)"
        }
    },{
        id: "sku",
        name: ko.observable<string>(ClientResources.myAssetSkuColumn),
        itemKey: "sku",
        format: MsPortalFx.ViewModels.Controls.Lists.Grid.Format.TextLookup,
        formatOptions: {
            textLookup: {
                0: ClientResources.myAssetSkuFree,
                1: ClientResources.myAssetSkuStandard,
                2: ClientResources.myAssetSkuEnterprise
            }
        }
    },{
        id: "subscription",
        name: ko.observable<string>(ClientResources.myAssetSubscriptionColumn),
        itemKey: "subscription"
    }]);
    ```

Move the columns from your grid columns service to `BrowseConfig.columns` in your `getBrowseConfig()` function and then remove any standard columns - name, group, location, and subscription.

    ```ts
    public getBrowseConfig(): PromiseV<MsPortalFx.Assets.BrowseConfig> {
        return Q.resolve({
            columns: [{
                id: "type",
                name: ko.observable<string>(ClientResources.type),
                itemKey: "type",
                format: MsPortalFx.ViewModels.Controls.Lists.Grid.Format.HtmlBindings,
                formatOptions: {
                    htmlBindingsTemplate: "<div data-bind='text: type'></div> (<div data-bind='text: subtype'></div>)"
                }
            },{
                id: "sku",
                name: ko.observable<string>(ClientResources.myAssetSkuColumn),
                itemKey: "sku",
                format: MsPortalFx.ViewModels.Controls.Lists.Grid.Format.TextLookup,
                formatOptions: {
                    textLookup: {
                        0: ClientResources.myAssetSkuFree,
                        1: ClientResources.myAssetSkuStandard,
                        2: ClientResources.myAssetSkuEnterprise
                    }
                }
            }]
        });
    }
    ```

Browse v1 used the standard grid `Column` interface. In Browse v2, we wanted to remove confusion about what was and wasn't supported, so we created a separate interface, specific to Browse. The following grid `Column` properties are not supported in Browse v2:

* `sortFormatter`
* `filterFormatter`
* `cssClass`
* `enableEllipse`
* `fullHeight`

In Browse v1, you could only define the columns you wanted to show by default. In Browse v2, you can specify additional columns the user can optionally choose to include in the grid (coming soon). For now, let's skip that and specify the default columns:

    ```ts
    public getBrowseConfig(): PromiseV<MsPortalFx.Assets.BrowseConfig> {
        return Q.resolve({
            columns: [...],
            defaultColumns: [ResourceColumns.resourceGroup, "type", "sku"]
        });
    }
    ```

Note that you can include any of the standard columns as well as your custom columns by referencing their id. The asset type icon, resource name, and subscription are all required and included by default.

Lastly, if you include any HTML-formatted columns that rely on additional properties that aren't columns, be declare those property names separately:

    ```ts
    public getBrowseConfig(): PromiseV<MsPortalFx.Assets.BrowseConfig> {
        return Q.resolve({
            columns: [...],
            defaultColumns: [ResourceColumns.resourceGroup, "type", "sku"],
            properties: ["subtype"]
        });
    }
    ```

Don't forget to specify the additional properties! If you don't specify them, they won't be populated in the grid.

Now that you've customized the columns, we need to populate them with your supplemental data.

**Note:** In the future, we would like to support adding RP properties via Browse config without having to explicitly query for the data. Until then, please use the supplemental data API.

<a name="upgrading-to-the-latest-browse-api-specifying-supplemental-data"></a>
## Specifying supplemental data

To let Browse know you have supplemental data, you'll make one small tweak to PDL to indicate that you have supplemental data instead of just custom config:

    ```xml
    <AssetType Name="MyAsset" ViewModel="MyAssetViewModel" ...>
      <Browse Type="ResourceType" UseSupplementalData="true" />
      ...
    </AssetType>
    ```

Since your asset view-model implements a generated interface, you'll see you're missing a property and a method the next time you compile. Let's add those, now:

    ```ts
    class MyAssetViewModel implements ExtensionDefinition.ViewModels.ResourceTypes.MyAssetViewModel.Contract {
        private _container: MsPortalFx.ViewModels.ContainerContract;
        private _dataContext: any;

        public supplementalDataStream = ko.observableArray<MsPortalFx.Assets.SupplementalData>([]);

        constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: ResourceTypesArea.DataContext) {
            this._container = container;
            this._dataContext = dataContext;
        }

        public getSupplementalData(resourceIds: string[], columns: string[]): Promise {
            ...
        }

        ...
    }
    ```

Browse v2 controls the paging and will call `getSupplementalData()` with the resource ids and columns that are currently visible. **Only** query data for the visible resources and columns. **Do not query all data for all resources.**

The most efficient way to obtain and update data is to use a single query view that aggregates data on your controller. If data comes from multiple sources, also send the required data to avoid querying for more data than is actually necessary.

    ```ts
    public getSupplementalData(resourceIds: string[], columns: string[]): Promise {
        // NOTE: Do not create the view in the constructor. Initialize here to create only when needed.
        this._view = this._view || this._dataContext.myAssetQuery.createView(this._container);

        // connect the view to the supplemental data stream
        MsPortalFx.Assets.SupplementalDataStreamHelper.ConnectView(
            this._container,
            view,
            this.supplementalDataStream,
            (myAsset: MyAsset) => {
                return resourceIds.some((resourceId) => {
                    return ResourceTypesService.compareResourceId(resourceId, myAsset.id());
                });
            },
            (myAsset: MyAsset) => {
                // save the resource id so Browse knows which row to update
                var data = <MsPortalFx.Assets.SupplementalData>{ resourceId: myAsset.id() };

                // only save sku if column is visible
                if (columns.indexOf("sku") !== -1) {
                    data.sku = robot.sku();
                }

                // if the type column is visible, also add the subtype property
                if (columns.indexOf("type") !== -1) {
                    data.type = robot.type;
                    data.subtype = robot.subtype;
                }

                return data;
            });

        // send resource ids to a controller and aggregate data into one client request
        return view.fetch({ resourceIds: resourceIds });
    }
    ```


Next Steps: [Browse](portalfx-browse.md)

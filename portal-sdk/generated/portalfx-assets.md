* [Assets](#assets)
    * [Defining your asset type](#assets-defining-your-asset-type)
    * [Blades, parts, and commands](#assets-blades-parts-and-commands)
    * [Showing up in the Browse ("More services") menu](#assets-showing-up-in-the-browse-more-services-menu)
    * [Showing up in Browse > Recent](#assets-showing-up-in-browse-recent)
    * [Showing up in All Resources and resource group resources](#assets-showing-up-in-all-resources-and-resource-group-resources)
    * [Handling permissions for RBAC](#assets-handling-permissions-for-rbac)
    * [Special-casing ARM resource kinds](#assets-special-casing-arm-resource-kinds)
    * [Displaying multiple kinds together in a single browse view](#assets-displaying-multiple-kinds-together-in-a-single-browse-view)
    * [Handling deleted resources](#assets-handling-deleted-resources)
    * [Linking notifications to assets](#assets-linking-notifications-to-assets)
    * [ARM RP and resource type metadata](#assets-arm-rp-and-resource-type-metadata)


<a name="assets"></a>
## Assets

Assets are generic entities tracked within the portal. As generic entities, assets can identify subscription resources (e.g. websites),
higher-level entities (e.g. AAD directory), lower-level entities (e.g. TFS work items), or things not even remotely associated with
subscriptions (e.g. users). As an example, subscriptions, resource groups, and deployments are all tracked as assets.

Assets are used for the following experiences:

* [Notifications](portalfx-notifications.md) should be linked to an asset
* The [Browse menu](top-extensions-browse.md) lists browseable asset types
* Browse > Recent only shows assets based on the asset type specified on a blade
* The All Resources view only shows resources that have asset types that implement Browse v2
* The resource group list only shows resources that have asset types with a defined `ResourceType`
* Defining [permissions](portalfx-permissions.md) in PDL requires asset types
* References to deleted assets can be cleaned up with `notifyAssetDeleted()`
* Overriding behavior for [resource kinds](#resource-kinds)

All asset types have the following requirements:

1. The asset type blade **_must_** have a single `id` parameter that is the asset id
2. The asset type part must be the same as the blade's pinned part
3. The asset type part and blade's pinned part must open the asset type's blade
4. Must call `notifyAssetDeleted()` when the resource has been deleted or is not found

Asset types that represent Azure Resource Manager (ARM) resource types also have the following requirements:

5. The asset id **_must_** be the string resource id
6. The ARM RP manifest should include a RP, resource type, and resource kind metadata

<a name="assets-defining-your-asset-type"></a>
### Defining your asset type

To define your asset type, simply add the following snippet to PDL:

```xml
<AssetType
    Name="MyAsset"
    ServiceDisplayName="{Resource MyAsset.service, Module=ClientResources}"
    SingularDisplayName="{Resource MyAsset.singular, Module=ClientResources}"
    PluralDisplayName="{Resource MyAsset.plural, Module=ClientResources}"
    LowerSingularDisplayName="{Resource MyAsset.lowerSingular, Module=ClientResources}"
    LowerPluralDisplayName="{Resource MyAsset.lowerPlural, Module=ClientResources}"
    Keywords="{Resource MyAsset.keywords, Module=ClientResources}"
    Description="{Resource MyAsset.description, Module=ClientResources}"
    Icon="{Resource Content.MyExtension.Images.myAsset, Module=./../_generated/Svg}"
    BladeName="MyAssetBlade"
    PartName="MyAssetPart"
    IsPreview="true">
  ...
</AssetType>
```

The name can be anything, since it's scoped to your extension. You'll be typing this a lot, so keep it succinct, yet clear -- it will be used to identify asset types in telemetry.

In order to provide a modern voice and tone within the portal, asset types have 4 different display names. The portal will use the most appropriate display name given the context. If your asset type display name includes an acronym or product name that is always capitalized, use the same values for upper and lower display name properties (e.g. `PluralDisplayName` and `LowerPluralDisplayName` may both use `SQL databases`). Do not share strings between singular and plural display name properties.

* The Browse menu shows the `ServiceDisplayName` in the list of browseable asset types.  If `ServiceDisplayName` is not available, `PluralDisplayName` will be shown instead
* The All Resources blade uses the `SingularDisplayName` in the Type column, when visible
* Browse v2 uses the `LowerPluralDisplayName` when there are no resources (e.g. "No web apps to display")
* Browse v2 uses the `LowerPluralDisplayName` as the text filter placeholder

Filtering functionality within the Browse menu searches over `Keywords`.  `Keywords` is a comma-separated set of words or phrases which
allow users to search for your asset by identifiers other than than the set display names.

Remember, your part and blade should both have a single `id` input parameter, which is the asset id:

```xml
<Part Name="MyAssetPart" ViewModel="MyAssetPartViewModel" AssetType="MyAsset" AssetIdProperty="id" ...>
  <Part.Properties>
    <!-- Required. Must be the only input parameter. -->
    <Property Name="id" Source="{DataInput Property=id}" />
  </Part.Properties>
  <BladeAction Blade="MyAssetBlade">
    <BladeInput Source="id" Parameter="id" />
  </BladeAction>
  ...
</Part>

<Blade Name="MyAssetBlade" ViewModel="MyAssetBladeViewModel" AssetType="MyAsset" AssetIdProperty="id">
  <Blade.Parameters>
    <!-- Required. Must be the only input parameter. -->
    <Parameter Name="id" Type="Key" />
  </Blade.Parameters>
  <Blade.Properties>
    <Property Name="id" Source="{BladeParameter Name=id}" />
  </Blade.Properties>
  ...
</Blade>
```

If your asset type is in preview, set the `IsPreview="true"` property. If the asset type is GA, simply remove the property (the default is `false`).

<a name="assets-defining-your-asset-type-how-to-hide-or-show-your-asset-in-different-environments"></a>
#### How to hide or show your asset in different environments

You can hide or show your asset in different environments by setting the assettypeoptions extension feature flag in your config which is a rich object
structure which allows changing not only asset types, but also hiding and showing asset instances in browse and global search as well as hiding and showing
asset instances with a specific resource kind. *This supersedes the legacy hideassettypes extension feature flag.*

```json
    {
        "assettypeoptions": {
          "AzureContainerService": { "options": "HideAssetType" },
          "ContainerGroup": { "options": "HideAssetType,HideInstances" },
          "ManagedClusters": { "options": "HideAssetType" },
          "VirtualWan": { "options": "" }
        }
    }
```

The "options" value is a comma-separated list of options which will be applied to the asset type:

Options| Result
--- | ---
HideAssetType | Hides the asset type from the All services left navigation
HideInstances | Hides any instances of the asset type in browse and global search
HideAssetType,HideInstance | Hide the asset type from left navigation AND hides any instances in browse and global search
*empty string* | This will show the asset type in left navigation AND shows instances in browse and global search

The case of empty string strips off any visibility options provided in PDL. The options are applied to the asset type, essentially replacing the options in PDL.

As mentioned above, visibility of instances with a specific resource kind can also be controlled if the kind is specified in the PDL:

```json
    {
        "assettypeoptions": {
          "AzureContainerService": { "options": "HideAssetType" },
          "ContainerGroup": { "options": "HideAssetType,HideInstances" },
          "ManagedClusters": { "options": "HideAssetType" },
          "VirtualWan": { "options": "" },
          "SomeAssetWithKinds": { "kinds": { "nameofkind": { "options": "HideInstances" } } }
        }
    }
```

In this example, the instances of the asset type 'SomeAssetWithKinds' which have the kind of 'nameofkind' will be hidden. Note that the 'HideAssetType' option does
not apply to kind, only the 'HideInstances' option.

There is also no way to show hidden asset types or hide / show specific kinds using the old configuration flags, so please move to 'assettypeoptions'.

<a name="assets-defining-your-asset-type-how-to-hide-or-show-your-asset-in-different-environments-self-hosted"></a>
##### Self hosted

This now reads the config JSON file for the appropriate environment, so follow the same procedure as for the Hosting service next.

<a name="assets-defining-your-asset-type-how-to-hide-or-show-your-asset-in-different-environments-hosting-service"></a>
##### Hosting service

If you’re using the hosting service, you can do this by updating your domainname.json (e.g. portal.azure.cn.json file)

```json
    {
        "assettypeoptions": {
          "AzureContainerService": { "options": "HideAssetType" },
          "ContainerGroup": { "options": "HideAssetType,HideInstances" },
          "ManagedClusters": { "options": "HideAssetType" },
          "VirtualWan": { "options": "" },
          "SomeAssetWithKinds": { "kinds": { "nameofkind": { "options": "HideInstances" } } }
        }
    }
```

**IMPORTANT** These flags cannot be mixed with the legacy 'hideassettypes' flag. If the config provides an 'assettypeoptions' flag, 'hideassettypes' flag
will be ignored. This is one reason that using 'assettypeoptions' is preferred and use of 'hideassettypes' should be deprecated.

<a name="assets-defining-your-asset-type-how-to-hide-or-show-your-asset-in-different-environments-hosting-service-testing-your-hidden-asset"></a>
###### Testing your hidden asset

To test enable your hidden asset for testing purposes, you will need to update the hide asset feature flag to exclude the asset you want to show and ensure you have feature.canmodifyextensions set.

For the desired environment append the following feature flags.
> If you want to test showing all hidden assets, you can specify all the assets with blank options using the 'assettypeoptions' extension feature flag.

```txt
    ?microsoft_azure_mynewextension_assettypeoptions={"MyNewAsset":{"options":""},"MySecondNewAsset":{"options":""}}
    &microsoft_azure_mynewextension=true
    &feature.canmodifyextensions=true
```

For example:
https://rc.portal.azure.com/?microsoft_azure_compute_assettypeoptions={"VirtualMachine":{"options":""}}&microsoft_azure_compute=true&feature.canmodifyextensions=true

or testing the hiding of an asset can be achieved with:
https://rc.portal.azure.com/?microsoft_azure_compute_assettypeoptions={"VirtualMachine":{"options":"HideAssetType"}}&microsoft_azure_compute=true&feature.canmodifyextensions=true

<a name="assets-defining-your-asset-type-how-to-hide-or-show-your-asset-in-different-environments-how-the-options-are-applied-from-pdl-from-the-config-json-file-and-from-the-url"></a>
##### How the options are applied from PDL, from the config JSON file and from the URL

There is a definitive recipe for how visibility options are applied to asset types and kinds from the various sources of PDL, config JSON files and via
overrides on the URL. The PDL has the lowest priority and should be considered the defaults. Whatever options you apply in PDL will be already applied to
the asset type. Once the portal loads, the config JSON file for the appropriate domain is loaded and overrides are applied from there. The options flags
are replaced by the flags from config. The 'assettypeoptions' are applied if present, otherwise 'hideassettypes' are applied if present. Note that if
both are supplied, only the 'assettypeoptions' will be used. After that, the URL extension feature flag will have the highest priority and will be applied
last. Again, if the 'MyExtensionName_assettypeoptions' feature flag is in the URL, it will be applied.  Otherwise, if the 'MyExtensionName_showassettypes'
feature flag is present, it will be applied. Otherwise, if the 'MyExtensionName_hideassettypes' feature flag is present, it will be applied. Note that
the only asset types affected are those in the config or feature flag. Other asset types will not be affected:

1. PDL flags are baked into the asset type definition at compile time.
2. Config is applied:
3. If the 'assettypeoptions' is present, apply any changes, jump to step 5
4. If the 'hideassettypes' is present, apply any changes, jump to step 5 - this is considered legacy and should be replaced with assettypeoptions.
5. URL overrides are applied:
6. If the 'MyExtensionName_assettypeoptions' feature flag is present, apply any changes, jump to end
7. If the 'MyExtensionName_showassettypes' feature flag is present, apply any changes, jump to end - this is considered legacy and should be replaced with assettypeoptions.
8. If the 'MyExtensionName_hideassettypes' feature flag is present, apply any changes, jump to end - this is considered legacy and should be replaced with assettypeoptions.

As shown, if 'assettypeoptions' and 'hideassettypes' are all present in the config, the 'hideassettypes' will be ignored. The 'hideassettypes' flag is considered legacy and
should be replaced with 'assettypeoptions'.

Also, if 'assettypeoptions', 'showassettypes' and 'hideassettypes' are all present in the URL, the 'showassettypes' and 'hideassettypes' will be ignored
and if only 'showassettypes' and 'hideassettypes' are specified, 'hideassettypes' will be ignored. Both 'showassettypes' and 'hideassettypes' are both considered to be legacy
and should be replaced with 'assettypeoptions'.

<a name="assets-defining-your-asset-type-handling-empty-browse"></a>
#### Handling empty browse

The framework offers the ability to display a description and links in the case that the users filters return no results.

>NOTE: This will also display if the user visits the browse experience and they have not yet created the given resource.

![Empty browse](../media/portalfx-assets/empty-browse.png)

To opt in to this experience you need to provide a `description` and a `link`, these are properties that you provide on your Asset.

```xml
<AssetType
    Name="MyAsset"
    ...
    Description="{Resource MyAsset.description, Module=ClientResources}">
    ...
    <Link Title="{Resource MyAsset..linkTitle1, Module=ClientResources}" Uri="https://www.bing.com"/>
    <Link Title="{Resource MyAsset.linkTitle2, Module=ClientResources}" Uri="https://www.bing.com"/>
    ...
  </AssetType>
```

<a name="blades-parts-commands"></a>
<a name="assets-blades-parts-and-commands"></a>
### Blades, parts, and commands

Every blade, part, and command that represents or acts on a single asset instance should specify an `AssetType` and `AssetIdProperty`. The `AssetType` is the `Name` specified on your `<AssetType />` node and the `AssetIdProperty` is the name of the input property that contains the asset id. Remember, that should be the string resource id, if your asset is an ARM resource.

If a blade, part, or command represents or acts on multiple assets, use the primary asset type/id based on the context. For instance, when displaying information about a child asset that also obtains information about the parent, use the child's asset type/id.

<a name="assets-showing-up-in-the-browse-more-services-menu"></a>
### Showing up in the Browse (&quot;More services&quot;) menu

To show up in the Browse menu, your asset type must specify the `<Browse Type="" />` node. The `Type` informs the Browse menu
how to interact with your asset type. Learn more about [Browse integration](top-extensions-browse.md).

Services that use [resource kinds](#resource-kinds) can also be added to the Browse menu, but that must be configured by the Fx team. To do this, [create a partner request](https://aka.ms/portalfx/request) with the asset type name and kind value.

<a name="assets-showing-up-in-browse-recent"></a>
### Showing up in Browse &gt; Recent

The Recent list in the Browse menu shows asset instances that have been interacted with. The portal tracks this via the
`AssetType` and `AssetIdProperty` on each blade that is launched. See [Blades, parts, and commands](#blades-parts-commands)
above for more information.

<a name="assets-showing-up-in-all-resources-and-resource-group-resources"></a>
### Showing up in All Resources and resource group resources

The All Resources and resource group blades show all resources except alert rules, autoscale settings, and dashboards. Resources that aren't backed by an asset type use a very basic resource menu blade that exposes properties, RBAC, tags, locks, and activity log.

To implement the most basic asset type, add the asset type definition (including display names, icon, blade, and part), add `<Browse Type="ResourceType" />` for [no-code Browse](top-extensions-browse.md), and then include a `<ResourceType ResourceTypeName="" ApiVersion="" />` declaration.

<a name="assets-handling-permissions-for-rbac"></a>
### Handling permissions for RBAC

To ensure your blades, parts, and commands react to the user not having access, you can add an `AssetType`, `AssetIdProperty`, and required `Permissions` to your blades, parts, and commands. Learn more about [Permissions](portalfx-permissions.md).

<a name="resource-kinds"></a>
<a name="assets-special-casing-arm-resource-kinds"></a>
### Special-casing ARM resource kinds

The portal supports overriding the following default behaviors based on the resource kind value:

* Hiding resources in Browse and resource groups
* Displaying separate icons throughout the portal
* Launching different blades when an asset is opened
* Merging kinds to display in a single browse view


The kind value can be whatever value makes sense for your scenarios. Just add supported kinds to the `AssetType` PDL:

```xml
<AssetType ...>
  ...
  <ResourceType ...>
    <Kind Name="kind1" />
    <Kind Name="kind2" />
    <Kind Name="kind3" />
  </ResourceType>
</AssetType>
```

`Name` is the only required attribute. None of the other attributes for kinds are required. Simply specify the
behaviors you want to override from your asset type and you're done.

| Attribute | Description |
|-----------|-------------|
| Name | (Required) Kind value assigned to resource types. |
| `IsDefault` | (Optional) Ignores the `Name` value and applies overrides to the default (empty) kind value. Teams are recommended to avoid this, if possible. |
| `BladeName` | (Optional) Specifies the blade to launch when this kind is opened from a Fx resource list. |
| `CompositeDisplayName` | (Optional) Overrides the type name shown in resource lists. The `ComposityDisplayName` is a convention-based reference to multiple RESX strings. For instance, `CompositeDisplayName="MyAsset"` would map to the following 4 RESX strings: `MyAsset_plural`, `MyAsset_singular`, `MyAsset_lowerPlural`, and `MyAsset_lowerSingular`. |
| `Icon` | (Optional) Overrides the asset type's icon. |
| `IsPreview` | (Optional) Indicates a preview label should be shown in the Browse (More services) menu, if applicable. |
| `Keywords` | (Optional) Specifies the keywords to use when filtering in the Browse (More services) menu, if applicable. |
| `MarketplaceItemId` | (Optional) Specifies the Marketplace item id (aka gallery package id) to launch from the "Add" command on the resource type Browse blade, if applicable. |
| `MarketplaceMenuItemId` | (Optional) Specifies the Marketplace menu item to launch from the "Add" command on the resource type Browse blade, if applicable. |
| `ServiceDisplayName` | (Optional) Overrides the text to use in the Browse (More services) menu, if applicable. |
| `UseResourceMenu` | (Optional) Overrides the asset type's ResourceMenu options. |
| `Visibility` | (Optional) Indicates whether the kind should be hidden from resource lists. Values: `Hidden`. |

If different kinds need to opt in to a static resource menu overview item, add the `<StaticOverview />` node.

```xml
<Kind ...>
  <StaticOverview />
</Kind>
```

<a name="assets-displaying-multiple-kinds-together-in-a-single-browse-view"></a>
### Displaying multiple kinds together in a single browse view

There are two options for displaying multiple kinds as a single view. Both cases require exposing a entry for your asset.

1. Merging multiple kinds together via any of each kind's browse entry (MergedKind)
1. Exposing a logical kind (KindGroup) which acts as a single entry point for multiple kinds.

<a name="assets-displaying-multiple-kinds-together-in-a-single-browse-view-mergedkind"></a>
#### MergedKind

To expose your resources as a merged kind you need to define the kinds you wish to merge as below.

```xml
<AssetType Name="Watch">
    <ResourceType ResourceTypeName="Microsoft.Test/watches"
                  ApiVersion="2017-04-01">
      <!--
        The 'garmin-merged' kind has two merged kinds, 'garmin' and 'garmin2'. The 'garmin-merged' kind is not a real
        kind and is not emitted to the manifest as a kind, it is organizational only.
      -->
      <MergedKind Name="garmin-merged">
        <Kind Name="garmin"
              CompositeDisplayName="{Resource AssetTypeNames.Watch.Garmin, Module=ClientResources}"
              Icon="{Svg File=../../Svg/Watches/garmin.svg}"
              BladeName="GarminWatchBlade"
              PartName="GarminWatchTile" />
        <Kind Name="garmin2"
              CompositeDisplayName="{Resource AssetTypeNames.Watch.Garmin2, Module=ClientResources}"
              Icon="{Svg File=../../Svg/Watches/garmin2.svg}"
              BladeName="Garmin2WatchBlade"
              PartName="Garmin2WatchTile" />
      </MergedKind>
    </ResourceType>
  </AssetType>
```

<a name="assets-displaying-multiple-kinds-together-in-a-single-browse-view-kindgroup"></a>
#### KindGroup

To expose your resources as grouped as a single kind you will need to define the below.
Note both lg and samsung in the example below will be exposed as entries too.

```xml
<AssetType Name="Watch">
    <ResourceType ResourceTypeName="Microsoft.Test/watches"
                  ApiVersion="2017-04-01">
      <Kind Name="lg"
            CompositeDisplayName="{Resource AssetTypeNames.Watch.LG, Module=ClientResources}"
            Icon="{Svg File=../../Svg/Watches/lg.svg}"
            BladeName="LgWatchBlade"
            PartName="LgWatchTile" />
      <Kind Name="samsung"
            CompositeDisplayName="{Resource AssetTypeNames.Watch.Samsung, Module=ClientResources}"
            Icon="{Svg File=../../Svg/Watches/samsung.svg}"
            BladeName="SamsungWatchBlade"
            PartName="SamsungWatchTile" />
      <!--
        The 'android' kind group wraps the lg and samsung kinds into a single kind. The 'android' kind is an abstract
        kind. There should never be a watch with the kind set to 'android'. Instead it's used to group kinds into
        a single list. However, 'lg' watches and be seen separately, same with 'samsung' watches. The 'android' kind
        will be emitted to the manifest as a kind.
      -->
      <KindGroup Name="android"
            CompositeDisplayName="{Resource AssetTypeNames.Watch.Android, Module=ClientResources}"
            Icon="{Svg File=../../Svg/Watches/android.svg}">
        <KindReference KindName="lg" />
        <KindReference KindName="samsung" />
      </KindGroup>
    </ResourceType>
  </AssetType>
```

<a name='notify-asset-deleted'></a>
<a name="assets-handling-deleted-resources"></a>
### Handling deleted resources

The portal includes many references to assets, like pinned parts on the dashboard, recent items, and more. All references
are persisted to user settings and available when the user signs in again. When an asset is deleted, the portal needs to be
notified that these references need to be cleaned up. To do that, simply call
`MsPortalFx.UI.AssetManager.notifyResourceDeleted()` in Knockout blades or `notifyResourceDeleted()` from `@microsoft/azureportal-reactview/ResourceManagement` in React Views.

It's important to note that assets can obviously be deleted outside the portal. When an asset is deleted outside of the portal and `notifyResourceDeleted()` cannot be called, these references will not be cleaned up. When the user signs in again, they will still see pinned parts, for instance. These parts will most likely fail to load due to a 404 from your back-end service due to the asset not existing anymore. When you get a 404 for an asset id, always call `notifyResourceDeleted()` to ensure the portal has a chance to clean up.

<a name="assets-linking-notifications-to-assets"></a>
### Linking notifications to assets

To link a notification to an asset, simply include an asset reference (`AssetTriplet`) in the notification:

```ts
MsPortalFx.Hubs.Notifications.ClientNotification.publish({
    title: resx.myEvent.title,
    description: resx.myEvent.description,
    status: MsPortalFx.Hubs.Notifications.NotificationStatus.Information,
    asset: {
        extensionName: ExtensionDefinition.definitionName,
        assetType: ExtensionDefinition.AssetTypes.MyAsset.name,
        assetId: assetId
    }
});
```

Learn more about [notifications](portalfx-notifications.md).

<a name="assets-arm-rp-and-resource-type-metadata"></a>
### ARM RP and resource type metadata

Every ARM resource provider (RP) should have a default RP icon as well as a resource type icon specified in the RP manifest to support the following scenarios:

* The AAD custom role management UI uses the resource type icon for resource type actions
* Visual Studio uses the resource type icon in its list of resources
* The portal uses the RP icon when a blade isn't associated with an asset type and doesn't have an icon
* When a resource type icon isn't provided, the RP icon is used

When an icon is not specified, each experience will use the `MsPortalFx.Base.Images.Polychromatic.ResourceDefault()` icon:

<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="50px" height="50px" viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve">
    <path fill="#3999C6" d="M25.561,23.167c-0.103,0-0.197-0.03-0.288-0.083L6.011,12.045c-0.183-0.103-0.292-0.297-0.292-0.506 c0-0.203,0.108-0.395,0.292-0.496L25.149,0.075c0.182-0.1,0.405-0.1,0.579,0L44.994,11.12c0.174,0.102,0.29,0.291,0.29,0.496 c0,0.212-0.116,0.4-0.29,0.504L25.853,23.084C25.762,23.137,25.665,23.167,25.561,23.167"/>
    <path fill="#59B4D9" d="M22.792,50c-0.104,0-0.207-0.024-0.295-0.077L3.295,38.917C3.11,38.814,3,38.626,3,38.416V16.331 c0-0.207,0.11-0.397,0.295-0.506c0.176-0.1,0.401-0.1,0.586,0L23.08,26.831c0.178,0.107,0.286,0.297,0.286,0.504v22.086 c0,0.212-0.108,0.397-0.286,0.502C22.985,49.976,22.888,50,22.792,50"/>
    <path fill="#59B4D9" d="M28.225,50c-0.098,0-0.199-0.024-0.295-0.077c-0.178-0.105-0.288-0.289-0.288-0.502V27.478 c0-0.207,0.11-0.397,0.288-0.504l19.196-11.002c0.185-0.102,0.403-0.102,0.587,0c0.176,0.103,0.287,0.295,0.287,0.5v21.943 c0,0.211-0.111,0.398-0.287,0.502L28.511,49.923C28.429,49.976,28.325,50,28.225,50"/>
    <path opacity="0.5" fill="#FFFFFF" d="M28.225,50c-0.098,0-0.199-0.024-0.295-0.077c-0.178-0.105-0.288-0.289-0.288-0.502V27.478 c0-0.207,0.11-0.397,0.288-0.504l19.196-11.002c0.185-0.102,0.403-0.102,0.587,0c0.176,0.103,0.287,0.295,0.287,0.5v21.943 c0,0.211-0.111,0.398-0.287,0.502L28.511,49.923C28.429,49.976,28.325,50,28.225,50"/>
</svg>

To specify an RP icon, add the following portal metadata snippet:

```ts
{
    "namespace": "rp.namespace",
    "metadata": {
        "portal": {
            "icon": "<svg>...</svg>"
        }
    },
    ...
}
```

To specify a resource type icons, add the same snippet to each resource type definition:

```ts
{
    "namespace": "rp.namespace",
    "metadata": {
        "portal": {
            "icon": "<svg>...</svg>"
        }
    },
    ...
    "resourceTypes": [
        {
            "resourceType": "instances",
            "metadata": {
                "portal": {
                    "icon": "https://..."
                }
            },
            ...
        },
        ...
    ],
    ...
}
```

Icons can be either SVG XML or a standard HTTPS URL. SVG XML is preferred for scalability and rendering performance; however, HTTPS URLs are better if your RP manifest is too large.

To retrieve RP manifests for a subscription, call `GET /subscriptions/###/providers?$expand=metadata`.

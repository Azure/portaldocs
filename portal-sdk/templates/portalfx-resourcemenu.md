{"gitdown": "contents"}

## Resource menu

The resource menu provides a browse/manage experience for an Azure resource. It
does this by providing an app-like container for a resource, with a navigation
menu on the left. This navigation menu allows for access to all functionality
of the resource categorized into relevant groups.

### Adoption

To adopt the resource menu extensions need to upgrade to SDK version
[5.0.302.374](../generated/downloads.md) or newer.

* For migration from settings blade to the resource menu see
[Resource Menu Adoption][resourcemenuadoption]
* For a full list of the APIs used throughout see
[Resource Menu APIs][resourcemenuapis]
* See the [frequently asked questions][resourcemenufaq]
* For first time use see the rest of this document

### Responding to user feedback

As a product the main source of negative user feedback comes from horizontal
scrolling and UI movement. This is something we are trying to address across the
portal one way of doing that is removing blades from the user's journey. The
average journey depth is 3/4 blades and the average flow is Browse, Resource
blade, Settings and then some blade from settings. In most cases this will
result in the 4th blade being off screen and then scrolled into view.

### How is this different from the settings blade?

Previously every extension had to create a settings blade for every resource
they owned, that was an extra overhead, now the resource menu is a blade which
is loaded from the HubsExtension and calls into the AssetViewModel associated to
the AssetType to determine what menu items to show and what blades those items
open. Every extension and resource can leverage this blade without worrying
about getting UX consistency and avoid having to implementing the same blade
multiple times. The biggest change to the API is how dynamic items are handled.
Instead of having an observable array, the API is now a function that returns a
promise for the list of items. The main motivator for this change was to counter
usability issues with the list becoming jumpy and moving underneath the user
unpredictably. Although it is still possible to handle all the dynamic cases
that exist today by disabling the item and observably updating if the item is
enabled/disabled once the blade/inputs have been determined or delay creating
the menu object until all the dynamic items have been determined.

#### The API is slightly different in two cases

 1. Grouping was defined by aligning every item within the same group to use the
 same group id where as now we have promoted the grouping concept, further
 details about that below.
 2. Defining what blade to open was a dynamic blade selection whereas now it is
 a function supplyBladeReference().

#### What is required to enable the resource menu?

The resource menu requires:

* Opting in via the PDL AssetType
* Providing an AssetViewModel on the AssetType
* A 'getMenuConfig' method on the AssetViewModel
* Add menu items to the menu
* Verify that UX is responsive when maximized and restored

#### Opting in via the PDL AssetType

Just provide 'UseResourceMenu="true"' as a property on the AssetType PDL tag as
shown below. At some point in the future this will become the default experience
and will require an opt out if the behaviour is undesired.

```xml
<AssetType Name="MyResource"
           ...
           UseResourceMenu="true">
```

For this flag to take effect, your asset type should map to an ARM resource. You
can associate your ARM resource to your asset type by specifying the following
tags within your <AssetType> tag.

```xml
<Browse Type="ResourceType" />
<ResourceType
    ResourceTypeName="<<your-resource-type-name>>"
    ApiVersion="api-version-you-want-to-use" />
```

As an example, for Resource Groups, currently, the resource type tag is similar to below.

```xml
<ResourceType
    ResourceTypeName="Microsoft.Resources/subscriptions/resourceGroups"
    ApiVersion="2014-04-01-preview" />
```

#### Providing an AssetViewModel on the AssetType

First, if you don't have one already, create a new viewmodel for your
AssetViewModel below is a skeleton for the AssetViewModel. For more information
on assets [see the following](portalfx-assets.md)

```ts
/**
 * The MyResource view model.
 */
export class MyResourceViewModel
    implements ExtensionDefinition.ViewModels.MyResourceViewModel.Contract {

    /**
     * Initializes a new instance of the desktop view model class.
     *
     * @param container Object representing the container in the shell.
     * @param initialState Bag of properties saved to user settings via viewState.
     * @param dataContext Long lived data access object passed into all view models in the current area.
     */
    constructor(container: FxContainerContract, initialState: any, dataContext: DataContext) {
    }
}
 ```

Once the AssetViewModel has been added you will need to add a reference to it
from the AssetType in PDL.

```xml
<AssetType Name="MyResource"
           ...
           ViewModel="{ViewModel Name=MyResourceViewModel, Module=./AssetViewModels/MyResourceViewModel}">
```

#### Adding a 'getMenuConfig' method on the AssetViewModel

The method must be called 'getMenuConfig' and must follow the signature below, see [Resource Menu APIs][resourcemenuapis] for a full list of the APIs and interfaces. 

```ts
public getMenuConfig(resourceInfo: MsPortalFx.Assets.ResourceInformation): MsPortalFx.Base.PromiseV<MsPortalFx.Assets.ResourceMenuConfig> {
    return Q({});
}
```

The following object is populated and passed in, if you would like to see more properties added here feel free to reach out to [ibiza Menu Blade](mailto:ibiza-menu-blade@microsoft.com).

```ts
/**
 * The resource information for the resource menu.
 */
interface ResourceInformation {
    /**
     * The resource ID.
     */
    resourceId: string;
    /**
     * The resource or resource group.
     */
    resource: FxAzure.Subscription | FxHubsAzure.ResourceGroup | FxHubsAzure.Resource;
}

```

#### Add menu items to the menu

Once you have the skeleton of the resource menu working, the next step is to create the menu object to return in your 'getMenuConfig' method.
The menu object follows the following structure, again see [Resource Menu APIs][resourcemenuapis] for the full list of APIs.

```ts
/**
 * The resource menu configuration.
 */
interface ResourceMenuConfig {
    /**
     * The menu item groups.
     */
    groups: FxMenuBlade.MenuGroup[];
    /**
     * The ID of the default menu item.
     */
    defaultItemId: string;
    /**
     * Optional set of resource menu options.
     */
    options?: ResourceMenuOptions;
}
```

| Property        | Description |
|-----------------|-------------|
| `groups`        | Array of groups and menu items within each group that will open a blade |
| `defaultItemId` | ID of the menu item (defined in `groups`) to be selected by default |
| `options`       | Flags to show/hide common menu items |

The following options are available:

| Option                        | Exit criter | Enabled by default | Scenario |
|-------------------------------|-------------|--------------------|----------|
| `enableAlerts`                | No  | No | Create, view, and update alert rules. |
| `enableAppInsights`           | No  | No | View Application Insights monitoring. |
| `enableDiagnostics`           | No  | No | View monitoring diagnostics. |
| `enableExportTemplate`        | Yes | Resources, resource groups | Export a template of the resource group to automate redeployments. RPs must provide [template schemas](http://aka.ms/armschema) for this. Does not support classic resources. |
| `enableLocks`                 | Yes | Resources, resource groups, subscriptions | Lock resources to avoid accidental deletion and/or editing. |
| `enableLogAnalytics`          | No  | No | View OMS workspace. |
| `enableLogSearch`             | No  | No | Search logs. |
| `enableMetrics`               | No  | No | View monitoring metrics. |
| `enableProperties`            | No  | No | Generic properties blade for resources. Only includes standard ARM properties today, but may be integrated with the supplemental data, if needed. (Please file a [partner request](http://aka.ms/portalfx/request).) Does not support non-tracked resources. |
| `enableRbac`                  | Yes | All ARM resource types | Manage user/role assignments for this resource. |
| `enableSupportEventLogs`      | Yes | Resources, resource groups, subscriptions | View all operations and events |
| `enableSupportHelpRequest`    | Yes | All ARM resource types | Create a support request for this resource, resource group, or subscription. |
| `enableSupportResourceHealth` | Yes | No | Check resource for common health issues (e.g. connectivity) and recommend fixes. |
| `enableSupportTroubleshoot`   | No  | No | **Deprecated. Do not use.** Legacy support only. Moved to a new design with improved usability scores. |
| `enableSupportTroubleshootV2` | Yes | No | Troubleshoot possible availability/reliability issues (e.g. connectivity). |
| `enableTags`                  | Yes | Resources, resource groups, subscriptions | Tag resource with key/value pairs to group/organize related resources. RP must support PATCH operations to update tags. Does not support classic resources. |
| `showAppInsightsFirst`        | No  | No | View Application Insights monitoring. `enableAppInsights` must be set to `true`. |

In this case let's assume your resource has an item with the ID 'overview' and has also onboarded support, getting
export template, locks, RBAC, Activity Log, new support request, and tags automatically:

```ts
public getMenuConfig(resourceInfo: MsPortalFx.Assets.ResourceInformation): MsPortalFx.Base.PromiseV<MsPortalFx.Assets.ResourceMenuConfig> {
    return Q(
        <MsPortalFx.Assets.ResourceMenuConfig>{
            defaultItemId: "overview",
            options: {
                enableSupportTroubleshoot: true,
                enableSupportResourceHealth: true
            },
            groups: <FxMenuBlade.MenuGroup[]>[
                ...
            ]
        }
    );
}
```

Now define a group with a single item, the menu's group and item API is as follows.

```ts
/**
 * Defines a group in the menu.
 */
interface MenuGroup extends MenuItemBase {
    /**
     * The menu items in the group.
     */
    items: MenuItem[];
}

/**
 * Defines an item in a group of the menu.
 */
interface MenuItem extends MenuItemBase, FxComposition.Selectable2Options<FxComposition.BladeReference<any>> {
    /**
     * The icon associated to the menu item.
     */
    icon: FxBase.Image;
    /**
     * A value indicating whether or not the item is enabled.
     */
    enabled?: KnockoutObservableBase<boolean>;
}

/**
 * Attributes common to all items and groups in the menu.
 */
interface MenuItemBase {
    /**
     * Gets the ID for the item.
     */
    id: string;
    /**
     * The display text for the item.
     */
    displayText: string;
    /**
     * A space-delimited list of keywords associated to the item.
     */
    keywords?: string | string[];
}
```

Now given that our 'getMenuConfig' will look something like the following.

```ts
import * as ClientResources from "ClientResources";
import * as FxMenuBlade from "MsPortalFx/Composition/MenuBlade";
import * as BladeReferences from "../../../_generated/BladeReferences";

public getMenuConfig(resourceInfo: MsPortalFx.Assets.ResourceInformation): MsPortalFx.Base.PromiseV<MsPortalFx.Assets.ResourceMenuConfig> {
    return Q(
        <MsPortalFx.Assets.ResourceMenuConfig>{
            defaultItemId: "overview",
            options: {
                enableSupportTroubleshoot: true,
                enableSupportResourceHealth: true
            },
            groups: <FxMenuBlade.MenuGroup[]>[
                {
                    id: "overview_group",
                    displayText: ClientResources.ResourceMenuGroup.overview,
                    items: [
                        {
                            id: "overview",
                            displayText: ClientResources.ResourceMenu.overview,
                            enabled: ko.observable(true),
                            keywords: "overview",
                            icon: Images.MyResourceIcon,
                            supplyBladeReference: () => {
                                return new BladeReferences.MyResourceOverviewBlade({ id: resourceInfo.resourceId });
                            }
                        }
                    ]
                }
            ]
        }
    );
}
```

Now you will have a Resource menu which has one group with one item in it which opens the blade 'MyResourceOverviewBlade'.

#### Adding to the resourcemenu title and subtitle

The resource menu by default (for the overview) will show the name of the
resource as the title of the blade, and the resource type as the subtitle. When
any menu item is selected, the title gets updated to

"`<<resource name>> - <<selected menu item>>`"

Extension authors can add to the title and subtitle through the blade opened in
the content area. They can do this by implementing the `HostedInMenuBlade`
interface as follows.

```ts
export class MyResourceBlade
    extends MsPortalFx.ViewModels.Blade
    implements MsPortalFx.ViewModels.HostedInMenuBlade {

    public menuContent = {
        title: ko.observable<string>(),
        subtitle: ko.observable<string>(),
    };

    public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
        return someAsyncCall().then(data => {
            this.menuContent.title(data.title);
            this.menuContent.subtitle(data.subtitle);
        });
    }
}
```


#### Verify that UX is responsive when maximized and restored

Since the resource menu acts as a container for the blades opened by the menu items, the display state is preserved when you switch between menu items. So, you should verify that blades render acceptable UX when the resource menu is maximized and when the resource menu is restored to the specified widths.

Next Steps:

* There are samples of resources using this in the Samples Extension see the Client\ResourceTypes\Desktop\ folder, particularly the AssetViewModels\DesktopViewModel.ts
* See [Resource Menu APIs][resourcemenuapis]
{"gitdown": "include-file", "file": "../templates/portalfx-resourcemenu-api.md"}

* See the [frequently asked questions][resourcemenufaq]
{"gitdown": "include-file", "file": "../templates/portalfx-resourcemenu-faq.md"}

* [Migrate any of your current resources to use the resource menu][resourcemenuadoption]
{"gitdown": "include-file", "file": "../templates/portalfx-resourcemenu-adoption.md"}

* If there are any issues please reach out to [ibiza Menu Blade](mailto:ibiza-menu-blade@microsoft.com) 


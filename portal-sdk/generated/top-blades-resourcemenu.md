
<a name="the-resource-menu"></a>
# The Resource Menu

<a name="the-resource-menu-overview"></a>
## Overview

The resource menu provides an easy-to-use implementation of a menu blade, as specified in [top-blades-menublade.md](top-blades-menublade.md), with various common Azure resource menu items readily available. It does this by providing an app-like container for a resource, with a navigation menu on the left. This navigation menu allows an extension to access all of the functionality of the resource, categorized into relevant groups.

**What is required to enable the resource menu?**

The resource menu requires that the extension perform the following.

1. [Opt in by using an AssetType](#opt-in-by-using-an-assettype)

1. [Provide an AssetViewModel on the AssetType](#provide-an-assetviewmodel-on-the-assettype)

1. [Add a getMenuConfig method](#add-a-getmenuconfig-method)

1. [Add menu items to the menu](#add-menu-items-to-the-menu)

1. [Add ResourceMenu titles](#add-resourcemenu-titles)

1. [Validate that the UX is responsive](#validate-that-the-ux-is-responsive)

For more information about migrating an extension from the settings blade to the resource menu, see
[portalfx-resourcemenu-migration.md](portalfx-resourcemenu-migration.md).

For more information about the APIs that support the Resource menu, see [portalfx-resourcemenu-api.md](portalfx-resourcemenu-api.md).

For answers to frequently asked questions, see [portalfx-extensions-faq-resourcemenu.md](portalfx-extensions-faq-resourcemenu.md).

If there are any issues please reach out to <a href="mailto:ibiza-menu-blade@microsoft.com?subject=Issues with Resource Samples">Ibiza Menu Blade</a>.

**What does the resource menu provide that a menu blade does not?**

The resource menu is a blade which is loaded from the HubsExtension. It  calls the `AssetViewModel` that is  associated with the `AssetType` to determine what menu items to show and what blades those items open. Every extension and resource can leverage this blade without worrying about getting UX consistency and avoid having to implement the same blade multiple times. The resource menu also provides an `options` object on the `getMenuConfig` which exposes various Azure resource-related options such as `Support/Monitoring/Automation Scripts.`

<a name="the-resource-menu-overview-opt-in-by-using-an-assettype"></a>
### Opt in by using an AssetType

**NOTE**: In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory, and  `<dirParent>` is the `SamplesExtension\` directory, based on where the samples were installed when the developer set up the SDK. If there is a working copy of the sample in the Dogfood environment, it is also included.

The code for this example is located at `<dir>Client\V1\Navigation\ResourceMenuBlade\ViewModels`.

<!-- TODO:  Determine whether this is the default experience yet. -->

For the extension to use a resource menu, it should provide the `ResourceMenu` tag as an item on the `AssetType` tag in the PDL file, as in the following code.

```xml
<AssetType Name="MyResource"
           ...>
    <ResourceMenu ResourceProvidedBy="NoResource" />
</AssetType>
```

There are three options for `ResourceProvidedBy`:

|Value|Description|
|-|-|
|`NoResource`|FX will pass only the resource ID for the resource for the menu and is not expected to receive the resource from the extension. Fastest possible execution but is not valid when the asset type includes Kind tags.|
|`ProvidedByResourceMenu`|FX will pass the `ResourceInformation` structure shown below which include the resource ID and the resource data from the ARM cache (may not be the entire resource). Works quickly when launched from browse, but when pinned, the resource is loaded. If more information than what is available in the ARM cache, the other two options are better.|
|`ReturnedByExtension`|FX will pass only the resource ID (in a `ResourceInfo` structure shown below) for the resource for the menu and the extension must load and return the resource in the resulting resource menu config.|

Each of these methods implements a different interface with a different function and result:

|Value|Interface|Method signature|
|-|-|-|-|
|`NoResource`|`MsPortalFx.Assets.ResourceMenuWithNoResourceContract`|`getResourceMenuConfig(resourceId: string, menuContext?: string): MsPortalFx.Base.PromiseV<MsPortalFx.Assets.ResourceMenuConfig>`|
|`ProvidedByResourceMenu`|`MsPortalFx.Assets.ResourceMenuWithCallerSuppliedResourceContract`|`getMenuConfig(resourceInfo: MsPortalFx.Assets.ResourceInformation, menuContext?: string): MsPortalFx.Base.PromiseV<MsPortalFx.Assets.ResourceMenuConfig>`|
|`ReturnedByExtension`|`MsPortalFx.Assets.ResourceMenuWithExtensionProvidedResourceContract`|`getResourceAndMenuConfig(resourceInfo: MsPortalFx.Assets.ResourceInfo, menuContext?: string): MsPortalFx.Base.PromiseV<MsPortalFx.Assets.ExtensionSuppliedResourceInfo>`|

How to pick which option to use?

|Asset type|Use option|Reasoning|
|-|-|-|
|No Kind tags|`NoResource`|When there are no kinds on the asset type, this is the most performant option|
|Have Kind tags and need more data than what is in the ARM cache|`ReturnedByExtension`|Given that the extension needs more data than what will be passed, the extension should load and return the resource|
|Have Kind tags|`ProvidedByResourceMenu`|If no additional data for the resource is important, this is more performant than `ReturnedByExtension` in the case where the resource is launched from browse|

For this flag to take effect, the `assetType` should map to an ARM resource. The ARM resource is associated with the  `assetType` by specifying the following tags within the `<AssetType>` tag.

```xml
<Browse Type="ResourceType" />
<ResourceType
    ResourceTypeName="<<your-resource-type-name>>"
    ApiVersion="api-version-you-want-to-use" />
```

As an example, the resource type tag for resource groups is in the following code.

```xml
<ResourceType
    ResourceTypeName="Microsoft.Resources/subscriptions/resourceGroups"
    ApiVersion="2014-04-01-preview" />
```

<a name="the-resource-menu-overview-provide-an-assetviewmodel-on-the-assettype"></a>
### Provide an AssetViewModel on the AssetType

Create a new `ViewModel` for the `AssetViewModel`.  The following is a skeleton for the `AssetViewModel`. For more information on assets, see [portalfx-assets.md](portalfx-assets.md).

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

After the `AssetViewModel` has been added, there should also be a reference to it from the `AssetType` in the PDL file.

```xml
<AssetType Name="MyResource"
           ...
           ViewModel="{ViewModel Name=MyResourceViewModel, Module=./AssetViewModels/MyResourceViewModel}">
```

### Add a getResourceMenuConfig method (or appropriate method from option)

The next step in creating a ResourceMenu is to add the appropriate method using the signatures above to the `AssetViewModel` - either `getResourceMenuConfig`, `getMenuConfig` or `getResourceAndMenuConfig`.

The methods are named `getResourceMenuConfig`, `getMenuConfig` or `getResourceAndMenuConfig` and uses the following signature.  For a full list of the APIs and interfaces, see [portalfx-resourcemenu-api.md](portalfx-resourcemenu-api.md).

```ts
public getResourceMenuConfig(resourceId: string): MsPortalFx.Base.PromiseV<MsPortalFx.Assets.ResourceMenuConfig> {
    return Q({});
}
```

```ts
public getMenuConfig(resourceInfo: MsPortalFx.Assets.ResourceInformation): MsPortalFx.Base.PromiseV<MsPortalFx.Assets.ResourceMenuConfig> {
    return Q({});
}
```

```ts
public getResourceAndMenuConfig(resourceInfo: MsPortalFx.Assets.ResourceInfo): MsPortalFx.Base.PromiseV<MsPortalFx.Assets.ExtensionSuppliedResourceInfo> {
    return Q({});
}
```

The following object is populated and sent to the `getMenuConfig` method. If you would like to see more properties added here, reach out to <a href="mailto:ibiza-menu-blade@microsoft.com?subject=Resource Sample Needs More Properties ">Ibiza Menu Blade</a>.

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

The following object is populated and sent to the `getExtensionAndMenuConfig` method. If you would like to see more properties added here, reach out to <a href="mailto:ibiza-menu-blade@microsoft.com?subject=Resource Sample Needs More Properties ">Ibiza Menu Blade</a>.

```ts
/**
 * The information passed to the extension to load the resource.
 */
interface ResourceInfo {
    /**
     * The resource ID.
     */
    resourceId: string;
}

```

### Add menu items to the menu

After the resource menu skeleton is working, create the menu object to return in the menu config method, as in the following code.

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

The following properties can be returned by the `getResourceMenuConfig` or `getMenuConfig` method.

| Property        | Description |
|-----------------|-------------|
| `groups`        | Array of groups and menu items within each group that will open a blade |
| `defaultItemId` | ID of the menu item (defined in `groups`) to be selected by default |
| `options`       | Flags to show/hide common menu items |

The following options are available on the `options` property.

| Option                        | Purpose | Production-ready metrics | Enabled by default |
|-------------------------------|-------------|--------------------|----------|
| `enableAlerts`                | Create, view, and update alert rules. | No  | No |
| `enableAppInsights`           | View Application Insights monitoring. | No  | No |
| `enableDiagnostics`           | View monitoring diagnostics. | No  | No |
| `enableExportTemplate`        |  Export a template of the resource group to automate redeployments. RPs must provide [template schemas](http://aka.ms/armschema) for this. Does not support classic resources. | Yes | Resources, resource groups |
| `enableLocks`                 | Lock resources to avoid accidental deletion and/or editing. | Yes | Resources, resource groups, subscriptions |
| `enableLogAnalytics`          | View OMS workspace. | No  | No |
| `enableLogSearch`             | Search logs. | No  | No |
| `enableMetrics`               | View monitoring metrics. | No  | No |
| `enableProperties`            | Generic properties blade for resources. Only includes standard ARM properties today, but may be integrated with the supplemental data, if needed. (Please file a [partner request](http://aka.ms/portalfx/request).) Does not support non-tracked resources. | No  | No |
| `enableRbac`                  | Manage user/role assignments for this resource. | Yes | All ARM resource types |
| `enableSupportEventLogs`      | View all operations and events | Yes | Resources, resource groups, subscriptions |
| `enableSupportHelpRequest`    | Create a support request for this resource, resource group, or subscription. | Yes | All ARM resource types |
| `enableSupportResourceHealth` | Check resource for common health issues (e.g. connectivity) and recommend fixes. |Yes | No |
| `enableSupportTroubleshootV2` | Troubleshoot possible availability/reliability issues (e.g. connectivity). | Yes | No |
| `enableTags`                  | Tag resource with key/value pairs to group/organize related resources. RP must support PATCH operations to update tags. Does not support classic resources. | Yes | Resources, resource groups, subscriptions |
| `showAppInsightsFirst`        | View Application Insights monitoring. `enableAppInsights` must be set to `true`. | No  | No |

In this example, the resource contains an item with the ID 'overview' and has also onboarded to extension Support, as specified in [top-blades-settings.md#audit-logs](top-blades-settings.md#audit-logs). This support automatically makes the export template, locks, RBAC, Activity Log, new support request, and tags available to the extension.

```ts
public getResourceMenuConfig(resourceId: string): MsPortalFx.Base.PromiseV<MsPortalFx.Assets.ResourceMenuConfig> {
    return Q(
        <MsPortalFx.Assets.ResourceMenuConfig>{
            defaultItemId: "overview",
            options: {
                enableSupportTroubleshootV2: true,
                enableSupportResourceHealth: true
            },
            groups: <FxMenuBlade.MenuGroup[]>[
                ...
            ]
        }
    );
}
```

To define a menu group that contains a single item, the menu's group and item API are as follows.

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

Using the `NoResource` option, the `getResourceMenuConfig` method will resemble the following.

```ts
import * as ClientResources from "ClientResources";
import * as FxMenuBlade from "MsPortalFx/Composition/MenuBlade";
import * as BladeReferences from "../../../_generated/BladeReferences";

public getResourceMenuConfig(resourceId: string): MsPortalFx.Base.PromiseV<MsPortalFx.Assets.ResourceMenuConfig> {
    return Q(
        <MsPortalFx.Assets.ResourceMenuConfig>{
            defaultItemId: "overview",
            options: {
                enableSupportTroubleshootV2: true,
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
                                return new BladeReferences.MyResourceOverviewBlade({ id: resourceId });
                            }
                        }
                    ]
                }
            ]
        }
    );
}
```

Using the `ProvidedByResourceMenu` option, the `getMenuConfig` method will resemble the following.

```ts
import * as ClientResources from "ClientResources";
import * as FxMenuBlade from "MsPortalFx/Composition/MenuBlade";
import { BladeReferences } from "Fx/Composition";

public getMenuConfig(resourceInfo: MsPortalFx.Assets.ResourceInformation): MsPortalFx.Base.PromiseV<MsPortalFx.Assets.ResourceMenuConfig> {
    return Q(
        <MsPortalFx.Assets.ResourceMenuConfig>{
            defaultItemId: "overview",
            options: {
                enableSupportTroubleshootV2: true,
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
                                return BladeReferences.forBlade("MyResourceOverviewBlade").createReference({
                                    parameters: { id: resourceInfo.resourceId },
                                });
                            }
                        }
                    ]
                }
            ]
        }
    );
}
```

At this point, the extension has a Resource menu that contains one group, with one item in it, that  opens the `MyResourceOverviewBlade` blade.

### Add ResourceMenu titles

In this overview, the resource menu by default will show the name of the
resource as the title of the blade, and the type of resource as the subtitle. When
any menu item is selected, the title gets updated to `<<resource name>> - <<selected menu item>>`.

Developers can add to the title and subtitle through the blade that was opened in
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

### Validate that the UX is responsive

Because the resource menu acts as a container for the blades opened by the menu items, the display state is preserved when the user switches between menu items. The developer should validate that blades render the UX properly when the resource menu is maximized, and also when the resource menu is restored to the specified widths.

For an example of responsive resources, see the `<dir>Client\V1\ResourceTypes\Desktop\` folder, specifically the `...AssetViewModels\DesktopViewModel.ts` file.


## Frequently asked questions

<!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->

### The Resource menu

***What is the resource menu?***

SOLUTION:  The resource menu is a single location for all the resource's functionality. It reduces horizontal movement by promoting a consistent navigation model for all Azure resources.

* * *

### Resource menu samples

***Are there any samples I can refer to?***

SOLUTION: There are numerous samples that demonstrate how to use the resource menu.  They are located at `..<dir>\Client\ResourceTypes\Desktop\AssetViewModels\DesktopViewModel.ts`, where `<dir>` is the `SamplesExtension\Extension\` directory, based on where the samples were installed when the developer set up the SDK. 

* * *

### The Support Resource Management Group

***How do I add items to the Support/Resource Management Group?***

SOLUTION:  You can add items by using a `MenuGroupExtension`. `MenuGroupExtension` is a special kind of menu group that is  specified in the menu config object.  For more information, see 
[portalfx-resourcemenu-migration.md#creating-an-assetviewmodel](portalfx-resourcemenu-migration.md#creating-an-assetviewmodel).

* * * 

### Horizontal scrolling

***How do I reduce horizontal scrolling and UI movement in my extension?***

Horizontal scrolling and UI movement was a prime source of negative user feedback. One way of addressing this issue is to refactor the extension so that there are fewer blades on the user's journey. The average journey depth is three or four blades and the average flow is Browse, Resource blade, Settings and then some blade from Settings or Resource menu. In many cases, the fourth blade is displayed off screen and then scrolled into view.  Using a Resource blade reduces the dependency on the settings blade. In some instances, an extension no longer uses a Settings blade, thereby reducing the number of blades on the journey.

* * *

## Glossary

This section contains a glossary of terms and acronyms that are used in this document. For common computing terms, see [https://techterms.com/](https://techterms.com/). For common acronyms, see [https://www.acronymfinder.com](https://www.acronymfinder.com).

| Term                | Meaning |
| ------------------- | --- |
| screen jitter       | Re-displaying a list or blade in many places on the screen, or at different widths with every screen refresh. |

### Do NOT reject the returned promise

It is important to not reject the get menu config returned promise. If your code loads a resource or performs an operation that can fail, the 'ResourceMenuConfig' should include two observables 'fail' and 'handledError'. Then set one of these two observables for either an unhandled failure or a handled error (such as resource not found, unauthorized or similar) and resolve the promise. The FX code will then show the appropriate blade error UX. If the promise is rejected, the blade will be turned into an unknown (sad cloud) blade without additional information for the user. By providing rich fail or error information in the observables, the user gets a deeper understanding why the blade did not open normally.

Here is a full example with error handling:

```typescript

import * as Di from "Fx/DependencyInjection";
import { ArmId } from "Fx/ResourceManagement";
import * as ClientResources from "ClientResources";
import { BladeReferences } from "Fx/Composition";
import { ViewModels } from "_generated/ExtensionDefinition";
import { processSupplementalData } from "../../../Shared/ResourceData";
import { handleResourceMenuFailures } from "../../../Shared/ResourceTypesCommon";
import { DataContext, TestHelpersForSamplesExtensionOnly } from "../../ResourceTypesArea";
import { PrinterStatus } from "../PrinterData";
import { PrinterImages as Images } from "../PrinterLogos";

// NOTE: For the resource menu configuration, the menu item and group IDs ('id' property) should be unique within the
//       menu configuration, should not be localized or changed (the ID is part of the deep link for the blade within
//       the menu) and should not contain any spaces and should be lowercase. The ID is the unique identifier for the
//       groups and items.

import FxBase = MsPortalFx.Base;
import FxDiagnostics = FxBase.Diagnostics;
import FxStatusBadges = FxBase.Images.StatusBadge;
import FxContainerContract = MsPortalFx.ViewModels.ContainerContract;
import GridFormat = MsPortalFx.ViewModels.Controls.Lists.Grid.Format;
import FxAssets = MsPortalFx.Assets;
import Definition = ViewModels.ResourceTypes.PrinterViewModel;

const log = FxDiagnostics.createLog(require);
const entityResourceType = "microsoft.test/printers";

const MenuStrings = ClientResources.ResourceMenu.Printer;
const MenuKeywords = ClientResources.ResourceMenuKeyword.Printer;

/**
* Constants for the column IDs for the custom browse config.
*/
module BrowseColumns {
   "use strict";

   /**
    * The status column.
    */
   export const status = "status";

   /**
    * Constants for the properties for the status column.
    */
   export module StatusProperties {
       /**
        * The status property.
        */
       export const status = "status";
   }

   /**
    * The model column.
    */
   export const model = "model";

   /**
    * Constants for the properties for the model column.
    */
   export module ModelProperties {
       /**
        * The model property.
        */
       export const model = "model";
   }

   /**
    * The technology column.
    */
   export const technology = "technology";

   /**
    * Constants for the properties for the technology column.
    */
   export module TechnologyProperties {
       /**
        * The technology property.
        */
       export const technology = "technologyString";
   }
}

function getPrinterMenu(resourceId: string, dataContext: DataContext): FxBase.PromiseV<FxAssets.ResourceMenuConfig> {
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // EXAMPLE : Providing static menu items for a kind of resource.
   ///////////////////////////////////////////////////////////////////////////////////////////////////////////////
   // Build the menu items.
   const overviewItem: FxAssets.MenuItem = {
       id: "overview", // menu item IDs must be unique, must not be localized, should not contain spaces and should be lowercase
       displayText: MenuStrings.overview,
       enabled: ko.observable(true),
       keywords: MenuKeywords.overview.split(" "),
       icon: Images.printer,
       supplyBladeReference: () => {
           return BladeReferences.forBlade("PrinterBlade").createReference({ parameters: { id: resourceId }});
       },
   };
   // Build the resource menu config.
   const handledError = ko.observable<MsPortalFx.ViewModels.ErrorOptions>();
   const fail = ko.observable<string>();
   const menuConfig: FxAssets.ResourceMenuConfig = {
       overview: overviewItem,
       options: {
           enableRbac: true,
           enableTags: true,
       },
       groups: [],
       handledError,
       fail,
   };

   // Load the resource and update the menu items in the background.
   // In the case of this asset type, the ResourceProvidedBy for the resource menu is marked as
   // "NoResource". In this case, the AJAX call to retrieve the printer resource from ARM should
   // not be part of the menu config. In this case, the menu config should be returned as
   // quickly as possible with as many options completed as possible without the resource (such
   // as the overview menu item) and then the menu will be updated with the printer resource
   // when loaded. Therefore, the getResource() call is not being included in the returned
   // promise below to avoid blocking the UX. The UX can reveal the overview blade and partial
   // menu and when the printer is loaded and the menu is updated, the blade will adapt.
   dataContext.printerData.getResource(resourceId, "resource menu").then((_ /*printerData*/) => {
       // In production code, this code would make changes to the menu (add items, etc).
   }).catch((error) => {
       // IMPORTANT: Handle the late-failure errors using the common helper.
       if (!handleResourceMenuFailures(error, handledError, ClientResources.AssetTypeNames.Printer.lowerSingular, resourceId)) {
           fail((error && error.message) || JSON.stringify(error));
       }
   });

   return Q(menuConfig);
}

/**
* This sample demonstrates using the asset type view model to provide asset type information.
*
* IMPORTANT
* It is important to note that this class will be instantiated and disposed at the discretion of the portal, so no
* "stateful" data should be stored in this class. All stateful data belongs in the data context and caching will be
* handled by the portal code.
*/
@Di.Class("viewModel")
export class PrinterViewModel
   implements Definition.Contract {

   /**
    * This observable array is used to stream supplementary data results to the caller.
    */
   public supplementalDataStream = ko.observableArray<FxAssets.SupplementalData>([]);

   private _dataContext: DataContext;
   private _updateMap: StringMap<{ columns: string[] }>;

   /**
    * Initializes a new instance of the printer view model class.
    *
    * @param container Object representing the container in the shell.
    * @param dataContext Long lived data access object passed into all view models in the current area.
    */
   constructor(container: FxContainerContract, dataContext: DataContext) {
       this._dataContext = dataContext;
       this._updateMap = Object.create(null);
       const updateId = dataContext.printerData.registerUpdate<{ columns: string[] }>(this._updateMap, (resourceId, data) => {
           return Q(this.getSupplementalData([resourceId], data.columns)).then(MsPortalFx.noop);
       });
       container.registerForDispose(() => {
           dataContext.printerData.unregisterUpdate(updateId);
       });
   }

   /**
    * Gets the browse config.
    *
    * @return A promise which will be resolved with the browse config.
    */
   public getBrowseConfig(): FxBase.PromiseV<FxAssets.BrowseConfig> {
       // This sample shows how to include additional columns for the printer resource and sets one pre-defined
       // column and one custom column as the default columns. This ensures that without customization, these
       // columns will appear in the browse grid.
       //
       // NOTE that since the browse is resource type-based, the icon, resource name will be prepended at the start
       // of the columns and subscription will be appended at the end of the columns. Those three columns must not be
       // included in the custom config.
       return Q.resolve({
           columns: [
               // Column for the model using a custom column.
               {
                   id: BrowseColumns.model,
                   name: ko.observable<string>(ClientResources.Columns.Printer.model),
                   description: ko.observable<string>(ClientResources.Columns.Printer.modelDescription),
                   itemKey: BrowseColumns.ModelProperties.model,
                   width: ko.observable<string>("90px"),
               },

               // Column for the status using a custom column.
               {
                   id: BrowseColumns.status,
                   name: ko.observable<string>(ClientResources.Columns.Printer.status),
                   description: ko.observable<string>(ClientResources.Columns.Printer.statusDescription),
                   itemKey: BrowseColumns.StatusProperties.status,
                   width: ko.observable<string>("80px"),
                   cssClass: "fxs-hubs-gridStatusIconColumn",
                   format: GridFormat.SvgIconLookup,
                   formatOptions: {
                       svgIconLookup: {
                           [PrinterStatus.working.toLowerCase()]: {
                               svg: FxStatusBadges.Success(),
                               text: ClientResources.Status.Printer.working,
                           },
                           [PrinterStatus.jammed.toLowerCase()]: {
                               svg: FxStatusBadges.Error(),
                               text: ClientResources.Status.Printer.jammed,
                           },
                           [PrinterStatus.damaged.toLowerCase()]: {
                               svg: FxStatusBadges.Critical(),
                               text: ClientResources.Status.Printer.damaged,
                           },
                           [PrinterStatus.outOfPaper.toLowerCase()]: {
                               svg: FxStatusBadges.Warning(),
                               text: ClientResources.Status.Printer.outOfPaper,
                           },
                       },
                   },
               },

               // Column for the technology using a custom column.
               {
                   id: BrowseColumns.technology,
                   name: ko.observable<string>(ClientResources.Columns.Printer.technology),
                   description: ko.observable<string>(ClientResources.Columns.Printer.technologyDescription),
                   itemKey: BrowseColumns.TechnologyProperties.technology,
                   width: ko.observable<string>("80px"),
               },
           ],

           // The following are the default columns.
           defaultColumns: [
               BrowseColumns.model,
               BrowseColumns.status,
               BrowseColumns.technology,
           ],
       });
   }

   /**
    * Gets the supplemental data for the array of resource IDs.
    *
    * @param resourceIds The array of resource IDs for the supplemental data.
    * @param columns The array of columns for the supplemental data that is required.
    * @param refresh Optionally specify if the supplemental data needs to be refreshed for the specified resource IDs.
    * @return A promise which will be resolved when data is ready to be streamed.
    */
   public getSupplementalData(resourceIds: string[], columns: string[], refresh?: boolean): FxBase.Promise {
       return processSupplementalData(resourceIds, columns, this._updateMap, this.supplementalDataStream, this._dataContext.printerData, (printer) => {
           // ***
           // THIS IS FOR TESTING ONLY, DO NOT INCLUDE THIS IN PRODUCTION CODE.
           TestHelpersForSamplesExtensionOnly.attachPrinterValueRotator(this._dataContext, printer);
           // ***

           const supplementalData: FxAssets.SupplementalData = {
               resourceId: printer.id(),
           };
           if (columns.indexOf(BrowseColumns.model) !== -1) {
               // Add the model property.
               supplementalData[BrowseColumns.ModelProperties.model] = printer.model;
           }
           if (columns.indexOf(BrowseColumns.status) !== -1) {
               // Add the status property - observable for live value.
               supplementalData[BrowseColumns.StatusProperties.status] = ko.pureComputed(() => ((printer.status && printer.status()) || "").toLowerCase());
           }
           if (columns.indexOf(BrowseColumns.technology) !== -1) {
               // Add the technology property.
               supplementalData[BrowseColumns.TechnologyProperties.technology] = printer.technologyString;
           }
           return supplementalData;
       }, refresh);
   }

   /**
    * Gets the resource menu configuration.
    *
    * @param resourceInfo The resource ID for the menus.
    * @return A promise which will be resolved with the resource menu configuration.
    */
   public getResourceMenuConfig(resourceId: string): FxBase.PromiseV<FxAssets.ResourceMenuConfig> {
       const armId = ArmId.parse(resourceId);
       executeInDevelopmentModeOnly(() => {
           const resourceType = armId.resourceType.toLowerCase();
           if (resourceType !== entityResourceType) {
               log.error("*** mismatched resource type: <{0}>, expected: <{1}>".format(resourceType, entityResourceType));
           }
       });
       if (armId.kind === ArmId.Kind.Resource &&
           armId.resourceType.toLowerCase() === entityResourceType) {
           return getPrinterMenu(resourceId, this._dataContext);
       }
       return Q(null);
   }
}

```

Implementation the error handling:

```typescript

function defaultResponseExtractor(error: Error) {
return error && (<any>error).content && (<any>error).content.message
    || error && (<any>error).content && (<any>error).content.error && (<any>error).content.error.message
    || error && (<any>error).content && JSON.stringify((<any>error).content);
}

/**
 * Handles resource menu failures using the handledError and fail observables for "expected" failures and returns true
 * if handled.
 *
 * @param error The error from a catch clause of the call to get the resource.
 * @param handledError The observable for "expected" failures.
 * @param assetTypeName The name of the asset type for the error strings.
 * @param resourceId The resource ID for the error strings.
 */
export function handleResourceMenuFailures(
error: Error,
handledError: KnockoutObservable<MsPortalFx.ViewModels.ErrorOptions>,
assetTypeName: string,
resourceId: string,
armResponseExtractor?: (error: Error) => string,
) {
armResponseExtractor = armResponseExtractor || defaultResponseExtractor;
resourceId = MsPortalFx.encodeHtml(resourceId || "");
const statusCode = error && (<any>error).httpStatusCode;
if (statusCode && [HttpStatusCode.NotFound, HttpStatusCode.Gone].includes(statusCode)) {
    const statusMessage = MsPortalFx.encodeHtml(armResponseExtractor(error) || ResourceMenuNotice.unknownResponse);
    handledError({
        message: ResourceMenuNotice.notFoundHeader.format(assetTypeName),
        code: statusCode,
        details: MsPortalFx.replaceAll(ResourceMenuNotice.notFoundDescription.format(assetTypeName, resourceId, statusCode, statusMessage), "\n", "<br />"),
    });
    return true;
}

if (statusCode && [HttpStatusCode.Forbidden, HttpStatusCode.Unauthorized].includes(statusCode)) {
    const statusMessage = MsPortalFx.encodeHtml(armResponseExtractor(error) || ResourceMenuNotice.unknownResponse);
    handledError({
        message: ResourceMenuNotice.unauthorizedHeader.format(assetTypeName),
        code: statusCode,
        details: MsPortalFx.replaceAll(ResourceMenuNotice.unauthorizedDescription.format(assetTypeName, resourceId, statusCode, statusMessage), "\n", "<br />"),
    });
    return true;
}

if (statusCode && [0, HttpStatusCode.InternalServerError, HttpStatusCode.ServiceUnavailable].includes(statusCode)) {
    const statusMessage = MsPortalFx.encodeHtml(armResponseExtractor(error) || ResourceMenuNotice.unknownResponse);
    handledError({
        message: ResourceMenuNotice.unavailableHeader.format(assetTypeName),
        code: statusCode,
        details: MsPortalFx.replaceAll(ResourceMenuNotice.unavailableDescription.format(assetTypeName, resourceId, statusCode, statusMessage), "\n", "<br />"),
    });
    return true;
}
}

```

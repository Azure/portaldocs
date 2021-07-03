<a name="resource-menu-adoption"></a>
# Resource menu adoption

The resource menu is the navigation menu for all your resource's functionality. Since visually it's not a separate blade it ties the navigation menu and the content
directly together giving the user the sense of being in a single 'app' like container. See [Resource menu](portalfx-resourcemenu.md) for a overview of what
the resource menu is and why its worth doing.

<a name="resource-menu-adoption-migrating-from-a-settings-blade-to-a-resource-menu-blade"></a>
## Migrating from a settings blade to a resource menu blade

Adopting the resource menu requires a few steps:

1. You must be on version [5.0.302.374](../generated/downloads.md) at least
1. Opting in your asset to use the resource menu
1. Creating an AssetViewModel, if you haven't already, and adding a method to your AssetViewModel
1. Porting the current settings into the new method
1. Feature flag any old behaviour


<a name="resource-menu-adoption-migrating-from-a-settings-blade-to-a-resource-menu-blade-opting-in-your-asset-to-use-the-resource-menu"></a>
### Opting in your asset to use the resource menu

You need to add the 'ResourceMenu' entry and specify a viewmodel on your AssetType PDL tag.

``` xml
<AssetType Name="MyResource"
           ViewModel="{ViewModel Name=MyResourceViewModel, Module=./AssetViewModels/MyResourceViewModel}"
           ...>
    ...
    <ResourceMenu ResourceProvidedBy="NoResource" />
</AssetType>
```

<a name="resource-menu-adoption-migrating-from-a-settings-blade-to-a-resource-menu-blade-creating-an-assetviewmodel-if-you-haven-t-already-and-adding-a-method-to-your-assetviewmodel"></a>
### Creating an AssetViewModel, if you haven&#39;t already, and adding a method to your AssetViewModel

Now create your viewmodel and then add a 'getResourceMenuConfig' method. This method is where all the logic for determining which items to add to the menu given any dynamic dependencies.

Below is a simple menu with three items and two groups; specifying an overview item, a custom group with an item, and adding an item to a framework group. See [Resource Menu APIs][resourcemenuapis] for a full list of the APIs.

It is important to not reject the 'getResourceMenuConfig' returned promise. If your code loads a resource or performs an operation that can fail, the 'ResourceMenuConfig' should include two observables 'fail' and 'handledError'. Then set one of these two observables for either an unhandled failure or a handled error (such as resource not found, unauthorized or similar) and resolve the promise. The FX code will then show the appropriate blade error UX. If the promise is rejected, the blade will be turned into an unknown (sad cloud) blade without additional information for the user. By providing rich fail or error information in the observables, the user gets a deeper understanding why the blade did not open normally.

``` ts
import { BladeReferences } from "Fx/Composition");
import * as FxMenuBlade from "MsPortalFx/Composition/MenuBlade";
import * as ClientResources from "ClientResources";

import FxAssets = MsPortalFx.Assets;

const MenuGroupStrings = ClientResources.ResourceMenuGroup;
const MenuStrings = ClientResources.ResourceMenu;

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

    /**
     * Gets the resource menu configuration.
     *
     * @param resourceId The resource ID for the menus.
     * @return A promise which will be resolved with the resource menu configuration.
     */
    public getResourceMenuConfig(resourceId: string): MsPortalFx.Base.PromiseV<MsPortalFx.Assets.ResourceMenuConfig> {
        return Q(<MsPortalFx.Assets.ResourceMenuConfig>{
            overview: {
                id: "overview",
                displayText: MenuStrings.overview,
                keywords: ["keyword1","keyword2"],
                icon: MsPortalFx.Base.Images.Polychromatic.MyResourceImage(),
                supplyBladeReference: () => {
                    return BladeReferences.forBlade("MyResourceOverviewBlade").createReference({
                        parameters: {
                            id: resourceId
                    }});
                }
            },
            options: <MsPortalFx.Assets.ResourceMenuOptions>{
                enableRbac: true,
                enableTags: true,
                enableSupportEventLogs: true,
                enableSupportHelpRequest: true,
                enableSupportResourceHealth: true,
                enableSupportTroubleshootv2: true
            },
            groups: <FxMenuBlade.MenuGroup[]>[
                {
                    id: "overview_group",
                    displayText: MenuGroupStrings.overview,
                    items: <FxMenuBlade.MenuItem[]>[
                        {
                            id: "properties",
                            displayText: "Properties",
                            keywords: ["keyword1","keyword2"],
                            icon: MsPortalFx.Base.Images.Polychromatic.MyPropertiesImage(),
                            supplyBladeReference: () => {
                                return BladeReferences.forBlade("MyResourcePropertiesBlade").createReference({
                                    parameters: {
                                        resourceGroup: resourceId
                                }});
                            },
                            enabled: ko.observable(true)
                        }
                    ]
                },
                {
                    // There are a number of predefined framework groups items can be added to them using the following pattern
                    referenceId: FxAssets.SupportGroupId,
                    items: <FxMenuBlade.MenuItem[]>[
                        {
                            id: "alerts",
                            displayText: "Alerts",
                            keywords: ["keyword1","keyword2"],
                            icon: MsPortalFx.Base.Images.Polychromatic.Notification(),
                            supplyBladeReference: () => {
                                return new MsPortalFx.Composition.PdlBladeReference<any>(
                                    "AlertsListBlade",
                                    {
                                        targetResourceIds: [resourceId],
                                        options: { enableEvents: false }
                                    },
                                    null,
                                    null,
                                    InsightsExtensionName
                                );
                            }
                        }
                    ]
                }
            ]
        });
    }
}
 ```

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
       const armId = ArmId.parse(resourceId, true);
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

### Porting the current settings into the new method

 You can see that the API follows the settings item API very closely minus the groups and the blade references. Referencing blades within your own extension can be done via
 the first two options, if you are opening a blade outside of your extension you can use the third method.

### Feature flag any old behaviour

Once you have adopted the Resource menu you will notice throughout your experience there are a few cases which the old behaviour is no longer suitable. If that is the
case please use the following to switch on.

``` ts
MsPortalFx.isFeatureEnabled("resourcemenu")
```

One such case is the Resource summary part on the resource blade. Please add the following to the getSettingsSelection option:

``` ts
getSettingsSelection: MsPortalFx.isFeatureEnabled("resourcemenu") ? null : SettingsSelection;
```

Next Steps:

* Adopt the resource menu for all your resources
* See the [frequently asked questions][resourcemenufaq]
* There are samples of resources using this in the Samples Extension see the Client\ResourceTypes\Desktop\ folder, particularly the AssetViewModels\DesktopViewModel.ts
* If there are any issues please reach out to [ibiza Menu Blade](mailto:ibiza-menu-blade@microsoft.com)

[resourcemenuapis](portalfx-resourcemenu-api.md)
[resourcemenufaq](portalfx-resourcemenu-faq.md)
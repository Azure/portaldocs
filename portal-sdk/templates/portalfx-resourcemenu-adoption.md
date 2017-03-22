# Resource menu adoption

The resource menu is the navigation menu for all your resource's functionality. Since visually it's not a separate blade it ties the navigation menu and the content
directly together giving the user the sense of being in a single 'app' like container. See [Resource menu](portalfx-resourcemenu.md) for a overview of what
the resource menu is and why its worth doing.

## Migrating from a settings blade to a resource menu blade

Adopting the resource menu requires a few steps:

1. You must be on version [5.0.302.374](../generated/downloads.md) at least
1. Opting in your asset to use the resource menu
1. Creating an AssetViewModel, if you haven't already, and adding a method to your AssetViewModel
1. Porting the current settings into the new method
1. Feature flag any old behaviour


### Opting in your asset to use the resource menu

You need to add the 'UseResourceMenu' property and specify a viewmodel on your AssetType PDL tag.

``` xml
<AssetType Name="MyResource"
           ViewModel="{ViewModel Name=MyResourceViewModel, Module=./AssetViewModels/MyResourceViewModel}"
           ...
           UseResourceMenu="true">
```

### Creating an AssetViewModel, if you haven't already, and adding a method to your AssetViewModel

Now create your viewmodel and then add a 'getMenuConfig' method. This method is where all the logic for determining which items to add to the menu given any dynamic dependencies.
Below is a simple menu with three items and two groups; specifying an overview item, a custom group with an item, and adding an item to a framework group. See [Resource Menu APIs][resourcemenuapis] for a full list of the APIs.

``` ts
import BladeReferences = require("../../_generated/BladeReferences");
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
     * @param resourceInfo The resource ID and resource|resource group for the menus.
     * @return A promise which will be resolved with the resource menu configuration.
     */
    public getMenuConfig(resourceInfo: MsPortalFx.Assets.ResourceInformation): MsPortalFx.Base.PromiseV<MsPortalFx.Assets.ResourceMenuConfig> {
        return Q(<MsPortalFx.Assets.ResourceMenuConfig>{
            overview: {
                id: "overview",
                displayText: MenuStrings.overview,
                keywords: ["keyword1","keyword2"],
                icon: MsPortalFx.Base.Images.Polychromatic.MyResourceImage(),
                supplyBladeReference: () => {
                    return new BladeReferences.MyResourceOverviewBladeReference({
                        id: resourceInfo.resourceId
                    });
                }
            },
            options: <MsPortalFx.Assets.ResourceMenuOptions>{
                enableRbac: true,
                enableTags: true,
                enableSupportEventLogs: true,
                enableSupportHelpRequest: true,
                enableSupportResourceHealth: true,
                enableSupportTroubleshoot: true
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
                                return new BladeReferences.MyResourcePropertiesBladeReference({
                                    resourceGroup: resourceInfo.resourceId
                                });
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
                                        targetResourceIds: [resourceInfo.resourceId],
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
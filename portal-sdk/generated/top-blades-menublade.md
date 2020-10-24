
<a name="menublade"></a>
## MenuBlade

Menu blades are rendered as a menu on the left side of the screen. The Shell combines this blade with the blade that is immediately to its right. Each item that is referenced from the left menu is rendered using the same header as the menu blade, resulting in the two blades being displayed as one blade.  This is similar to the way that the resource menu blade operates.  A user can click on the double left arrow to collapse the menu pane, as in the following image.

![alt-text](../media/top-blades-menublade/menuBlade.png "Menu Blade")

The process is as follows.

1. The menu blade is displayed as a menu, or list of items that open blades when clicked
1. The menu blade is rendered to the left of the screen
1. The blades that are opened from the menu share the chrome with the menu blade

**NOTE**: In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory, and  `<dirParent>`  is the `SamplesExtension\` directory, based on where the samples were installed when the developer set up the SDK. If there is a working copy of the sample in the Dogfood environment, it is also included.

Menu blades are defined in a **TypeScript** file as shown in the following code. The code is also located at `<dir>/Client/V2/Blades/MenuBlade/SampleMenuBlade.ts`.

The following code demonstrates how to define a menu blade `ViewModel` to open two different items.

 ```typescript

@MenuBlade.Decorator()
export class SampleMenuBlade {
public title = BladeClientResources.menuBladeTitle;
public subtitle = ClientResources.samples;

public context: MenuBlade.Context<void>;

public viewModel: MenuBlade.ViewModel2;

public async onInitialize() {
    const { container } = this.context;

    this.viewModel = MenuBlade.ViewModel2.create(container, {
        groups: [
            {
                id: "default",
                displayText: BladeClientResources.menuBladeSamples,
                items: [
                    {
                        id: "controlsMenuBladeContentAreaBlade",
                        displayText: BladeClientResources.controlsMenuBladeContentAreaBladeTitle,
                        icon: null,
                        supplyBladeReference: () => {
                            return BladeReferences.forBlade("ControlsMenuBladeContentAreaBlade").createReference();
                        },
                    },
                ],
            },
        ],
        overview: {
            id: "overview",
            displayText: BladeClientResources.overviewBladeTitle,
            icon: null,
            supplyBladeReference: () => {
                return BladeReferences.forBlade("MenuBladeOverviewBlade").createReference();
            },
        },
    });
}
}

```

There are a few things to notice in the preceding code.

* Menus have an overview item. This item is the default selected item when the user loads the menu blade.
* The Menu item's `id` property is required to be unique; it  will be used in the deep link of the menu blade.
* Menus can have different groups. In this code there is a single group.
* Each menu item opens a blade, and all necessary parameters are provided.
* The menu blade ideally should not be loading data. That can be done on the child blade after the user opens the blade.

You can view a working copy of the MenuBlade in the Dogfood environment sample located at
[https://df.onecloud.azure-test.net/?SamplesExtension=true#blade/SamplesExtension/SampleMenuBlade](https://df.onecloud.azure-test.net/?SamplesExtension=true#blade/SamplesExtension/SampleMenuBlade).

<a name="menublade-optional-functionality"></a>
### Optional functionality

* Dynamically changing the default selected item

    If  you want to take the user to a different menu item by default, you can specify the `defaultId` as part of the constructor options.

* Hide the search box

    If you want to hide the search box that is shown by default, you can set the `showSearch` property to `false`.

* Menu items should also define keywords. When a user searches within the menu blade's search box, the item's `displayText` and the keywords are used to match the search terms.

* Menu items can be made to be enabled or visible dynamically by providing an optional property for either of those properties and dynamically updating the observable after defining the menu item.

* Menu items can also provide a tooltip

    This can be used to display further information on what the menu item defines, or it can also be used to explain to the user reasons why the menu item is disabled.

Menu blades also allow the user to collapse the menu pane.  This is not available programmatically to control by developers, as in the preceding image.

<a name="menublade-navigation-within-a-menu-blade"></a>
### Navigation within a menu blade

As a developer, you have various options on how to open blades when the user interacts with your experience.

When in menu blades there are some extra options exposed.

* `container.menu.switchMenuItem()`
* `container.menu.openBlade()`

For more information about those options see [top-blades-opening-and-closing.md#opening-blades-within-the-menu](top-blades-opening-and-closing.md#opening-blades-within-the-menu).
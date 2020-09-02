<a name="menu-blade"></a>
## Menu Blade

Menu blade are rendered as a menu on the left side. Each item that is referenced from the menu is rendered using the same header than the menu, resulting in the two blades showing as one (similar to what resource menu blade does).

In summary:

* Menu blade is displayed as a menu (list of items), where each items opens a blade when clicked
* The menu blade is rendered to the left of the screen
* The blades opened from the menu share the chrome with the menu blade (so both blades look as one)

Menu blades are defined in PDL as shown below:

```xml

<MenuBlade
  Name="PdlSampleMenuBlade"
  ViewModel="SampleMenuBlade" />

```

The code below shows how to define a menu blade view-model to open 4 different items:

```typescript

@Di.Class("viewModel")
export class SampleMenuBlade extends FxMenuBlade.ViewModel {
constructor(container: MsPortalFx.ViewModels.ContainerContract) {
    super(container);
    this.title(ClientResources.SampleMenuBlade.title);
    this.icon(FxImages.Gear());

    const resourceName = "roturn600";
    this.menu.groups([
        {
            id: "enginesgroup",
            displayText: ClientResources.AssetTypeNames.Engine.singular,
            items: [
                // Menu item that demonstrates opening of a blade from a different extension
                {
                    id: "browserelated",
                    displayText: ClientResources.SampleMenuBlade.relatedResources,
                    icon: null,
                    supplyBladeReference: () => {
                        return BladeReferences.forExtension("HubsExtension").forBlade("MapResourceGroupBlade").createReference({
                            parameters: { id: "/subscriptions/sub123/resourcegroups/snowtraxpxz" },
                        });
                    },
                },
                // Menu item that demonstrates opening of a parameter collector blade for a create scenario
                {
                    id: "createengine",
                    displayText: ClientResources.createEngine,
                    icon: null,
                    supplyBladeReference: () => {
                        return BladeReferences.forBlade("CreateArmEngineBlade").createReference({
                            marketplaceId: "Microsoft.NoPdlEngineV1",
                            parameters:{
                                createEngineOptions: ["600cc",
                                    "800cc",
                                    "1000cc",
                                    "1200cc",
                                    "1600cc"].join(","),
                                initialData: "1600cc",
                            },
                            onClosed:()=>{
                                // Intentionally blank. The launched blade is responsible for the create operation.
                            },
                        });
                    },
                },
                // Menu item that demonstrates opening of a parameter collector blade for a create scenario
                {
                    id: "createenginenomkt",
                    displayText: ClientResources.createNoMarketplaceEngine,
                    icon: null,
                    supplyBladeReference: () => {
                        return BladeReferences.forBlade("CreateNoMarketplaceArmEngineBlade").createReference({
                            doesProvisioning: true,
                            parameters:{
                                createEngineOptions: ["600cc",
                                    "800cc",
                                    "1000cc",
                                    "1200cc",
                                    "1600cc"].join(","),
                                initialData: "1600cc",
                            },
                        });
                    },
                },
                // Menu item that demonstrates opting out of full width.
                {
                    id: "fullwidthoptout",
                    displayText: ClientResources.SampleMenuBlade.optOut,
                    icon: null,
                    supplyBladeReference: () => {
                        return BladeReferences.forBlade("BladeWidthSmallBlade").createReference({ parameters: { bladeTitle: ClientResources.SampleMenuBlade.optOut }});
                    },
                },
                // Menu item that demonstrates a blade that can have activated width.
                {
                    id: "activationSample",
                    displayText: ClientResources.ActivationStyleBlade.title,
                    icon: null,
                    supplyBladeReference: () => {
                        return BladeReferences.forBlade("BladeWithActivationStyle").createReference();
                    },
                },
            ],
        },
        {
            id: "group2",
            displayText: "Group #2",
            items: [
                {
                    id: "unauthorizedblade",
                    displayText: ClientResources.bladeUnauthorized,
                    icon: null,
                    supplyBladeReference: () => BladeReferences.forBlade("UnauthorizedBlade").createReference(),
                },
                {
                    id: "bladeWithSummary",
                    displayText: resourceName,
                    icon: null,
                    supplyBladeReference: () => BladeReferences.forBlade("EngineBlade").createReference({
                        parameters: {
                            id: `/subscriptions/sub123/resourcegroups/snowtraxpxz/providers/Providers.Test/statefulIbizaEngines/${resourceName}`,
                    }}),
                },
            ],
        },
    ]);
    this.menu.setOptions({
        defaultId: "browserelated",
        // You can also specify an overview item over here. That would show up right at
        // the top of the menu right below the search box. See the SDKMenuBladeViewModel.ts
        // as an example. This sample intentionally doesn't specify the overview item to
        // test the case where no overview is specified.
    });
}
}

```

A few things to notice in the code above:

* Menu can have different groups. In the code above there are two groups
* Each menu item opens a blade and all necessary parameters are provided
* Menu items can integrate with EditScope and ParameterProvider (shown in "createengine" item)
* At the end of the constructor, options for the menu are set. The option set in this case defines the id of the default item.

You can see MenuBlade in action in our SampleExtension [here](https://df.onecloud.azure-test.net/?SamplesExtension=true#blade/SamplesExtension/SampleMenuBlade/bladeWithSummary)
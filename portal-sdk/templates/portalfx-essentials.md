{"gitdown": "contents"}

## Essentials panel

The essentials panel in a resource blade presents key information about the resource and displays it at the top of the blade.  It surfaces the most common information customers are looking to access for their resource, and provides a consistent UX for presenting common platform capabilities.

![The essentials panel for a website](../media/portalfx-essentials/essentials.png)

The essentials panel shows basic properties for the current resource. It also shows common platform capabilities such as:

- Resource group
- Settings
- Quickstart
- Users & Roles
- Tags
- Keys

Providing this information and access to core functionality greatly improves the consistency of the platform.

### Adding an essentials panel

The Essentials panel is to be used only on resource blades - the initial blade launched from browse for your resource. Define the `<ResourceSummary>` in PDL for the given blade:

`\SamplesExtension\Extension\Client\ResourceTypes\Engine\Engine.pdl`

```xml
<Blade Name="EngineBlade">
    <Blade.Parameters>
        <Parameter Name="id" Type="Key" />
    </Blade.Parameters>
    <ResourceSummary Name="EngineBladeResourceSummary"
                     ViewModel="EngineResourceSummaryViewModel"
                     ResourceIdSource="{BladeParameter Name=id}"
                     ItemCount="4" />
    ...
</Blade>
```

The `ResourceIdSource` property expects to be given a resource uri used to interact with Azure Resource Manager.  The view model named with the `ViewModel` property should inherit `MsPortalFx.ViewModels.Parts.ResourceSummary.ViewModel2`.  This view model follows the typical part view model pattern and enables setting up of the properties and common services.

The `ItemCount` property represents the maximum number of properties the panel can contain; if its value is too small, the Essentials panel may appear vertically clipped.

**NOTE:** The view model base class `MsPortalFx.ViewModels.Parts.ResourceSummary.ViewModel2` replaces the *non-responsive, deprecated* `MsPortalFx.ViewModels.Parts.ResourceSummary.ViewModel` class.  Do not use the old `ViewModel` class, as support for it will be removed from the framework in the future.

All of the view model code below can be found in this sample:

`\SamplesExtension\Extension\Client\ResourceTypes\Engine\ViewModels\EngineResourceSummaryViewModel.ts`

### Built-in Properties

To make the Essentials panel appear responsive, *the framework* (that is, the panel itself) populates the properties in the left-hand column.  The framework shows the rendered panel as soon as *essential* left-hand column properties are loaded, allowing the user to interact with the panel early.  Remaining properties load incrementally, showing a "---" loading indicator while they load.

In support of this goal of responsiveness, extensions have limited control over this left-hand column:

- **'Resource group' property** - With the `MsPortalFx.ViewModels.Parts.ResourceSummary.Options.noResourceGroup` option, extensions can opt-out of the 'Resource group' property.  This is useful for tenant-only services.
- **'Status' property** - The `MsPortalFx.ViewModels.Parts.ResourceSummary.Options2.status` option controls the 'Status' property.
  - Supplying `null` for this option will hide the 'Status' property entirely.
  - To show the 'Status' property (preferable), extensions supply both a `value` and an `isLoading` observable, the latter of which controls a loading indicator.  Typically, the `isLoading` observable comes from the `loading` property on the `EntityView` or `QueryView` used to load data for the Essentials panel:

```ts
// Status property
let statusValue = ko.computed(lifetime, () => {
    let status = engineView.item() && engineView.item().status();
    switch (status) {
        case EngineData.EngineStatus.Running:
            return ClientResources.engineStatusRunning;
        case EngineData.EngineStatus.OilLow:
            return ClientResources.engineStatusLowOil;
        case EngineData.EngineStatus.Seized:
            return ClientResources.engineStatusSeized;
    }
    return "unhandled status: {0}".format(status);
});
let engineView = this._engineView;
let statusIsLoading = engineView.loading;  // A loading indicator is shown while the Engine data is loading.

return <MsPortalFx.ViewModels.Parts.ResourceSummary.Options2>{
    getQuickStartSelection: getQuickStartSelection,
    getSettingsSelection: getAllSettingsSelection,
    getKeysSelection: getKeysSelection,
    collapsed: false,
    status: {
        value: statusValue,
        isLoading: statusIsLoading
    },
    staticProperties: properties
};
```

### Static Properties

*The extension* populates properties in the right-hand column of the Essentials panel.

The most responsive user experience can be attained for those properties that the extension knows *statically*.  That is, the names, visibility and placement of these properties will not vary between instances of the resource.  For such *static* properties, the extension supplies these via the `MsPortalFx.ViewModels.Parts.ResourceSummary.Options2.staticProperties` option.  Notice that such properties are constructed with an `isLoading` observable which controls the "---" loading indicator for the property.  Typically, this will be the `loading` property of an `EntityView` or `QueryView` with which the extension loads its Essentials data:

```ts
let engineView = this._engineView;
let properties: MsPortalFx.ViewModels.Parts.Properties.Property[] = [];

// Open blade property
properties.push(new MsPortalFx.ViewModels.Parts.Properties.OpenBladeProperty({
    label: ClientResources.engineNamePropertyLabel,
    displayValue: ko.computed(lifetime, () => {
        return engineView.item() && engineView.item().name();
    }),
    bladeSelection: this._bladeSelection,
    isLoading: engineView.loading  // A loading indicator is shown while the Engine data is loading.
}));

// Text property
properties.push(new MsPortalFx.ViewModels.Parts.Properties.TextProperty({
    label: ClientResources.engineModelPropertyLabel,
    value: ko.computed(lifetime, () => {
        return engineView.item() && engineView.item().model();
    }),
    isLoading: engineView.loading  // A loading indicator is shown while the Engine data is loading.
}));

// Link property
properties.push(new MsPortalFx.ViewModels.Parts.Properties.LinkProperty({
    label: ClientResources.sponsorLinkPropertyLabel,
    value: ko.observable(ClientResources.microsoftUri),
    displayValue: ko.observable(ClientResources.microsoft),
    isLoading: ko.observable(false)  // The displayed value is a static string (not loaded asynchronously).
}));

return <MsPortalFx.ViewModels.Parts.ResourceSummary.Options2>{
    getQuickStartSelection: getQuickStartSelection,
    getSettingsSelection: getAllSettingsSelection,
    getKeysSelection: getKeysSelection,
    collapsed: false,
    status: ...,
    staticProperties: properties
};
```

Static properties are displayed at the top of the right-hand column of the Essentials panel.

### Dynamic Properties

In some cases, the extension only knows to add additional properties once it has examined the loaded resource data.  Once the data has loaded, the extension adds these properties to the Essentials panel using the `MsPortalFx.ViewModels.Parts.ResourceSummary.ViewModel2.setDynamicProperties` method:

```ts
public onInputsSet(inputs: Def.InputsContract, settings: Def.SettingsContract): MsPortalFx.Base.Promise {

    return super.onInputsSet(inputs, settings).then(() => {
        return this._engineView.fetch(inputs.resourceId).then(() => {

            // Show some dynamic, purely data-driven properties based on the loaded Engine.
            let engine = this._engineView.item();
            this._updateDynamicProperties(engine);
        });
    });
}

private _updateDynamicProperties(engine: SamplesExtension.DataModels.Engine): void {
    // Create properties based on some aspect of the loaded Engine.
    let useLinkProperty = engine.displacement().indexOf("600") >= 0;
    let dynamicProperty: MsPortalFx.ViewModels.Parts.Properties.Property;
    if (useLinkProperty) {
        dynamicProperty = new MsPortalFx.ViewModels.Parts.Properties.LinkProperty({
            label: ClientResources.engineDisplacementPropertyLabel,
            value: ko.observable(ClientResources.microsoftUri),
            displayValue: engine.displacement
        });
    } else {
        dynamicProperty = new MsPortalFx.ViewModels.Parts.Properties.TextProperty({
            label: ClientResources.engineDisplacementPropertyLabel,
            value: engine.displacement
        });
    }

    this.setDynamicProperties([ dynamicProperty ]);
}
```

Dynamic properties are displayed at the bottom of the right-hand column of the Essentials panel.

**NOTE:** Dynamic properties are added to the *already-rendered* Essentials panel, which can be a jarring experience for the user.  Static properties should be used wherever possible.  Static properties are less jarring, as they will be rendered with "---" loading indicators while their values load.

### (Advanced) Customizing the layout of properties

In certain advanced scenarios, the extension may need to customize the layout of properties beyond just defining the right-hand column properties.  This is not recommended for most scenarios, as per-extension customization can easily violate the guidelines described [here](portalfx-ux-essentials.md), either today or if the guidelines are revised in the future.  For those scenarios where it is necessary to customize beyond the defaults, this can be done using the `MsPortalFx.ViewModels.Parts.ResourceSummary.Options2.layout` option.  Here, the extension can control which properties are shown as well as property ordering/placement in the left- and right-hand columns.  Consult the relevant doc comments in MsPortalFx.d.ts for details.

{"gitdown": "include-file", "file": "../templates/portalfx-ux-essentials.md"}
	

### Settings

![Settings](../media/portalfx-essentials/settings.png)

Settings in the portal should be discoverable in a consistent fashion. Each resource blade should expose a link to a `<azurefx:SettingListBlade>` blade via the first command, and via the all settings link in the essentials panel:

```ts
var getAllSettingsSelection: MsPortalFx.ViewModels.Parts.ResourceSummary.GetDynamicBladeSelection = (inputs: Def.InputsContract) => {
    return <MsPortalFx.ViewModels.DynamicBladeSelection> {
        detailBlade: ExtensionDefinition.BladeNames.engineAllSettingsBlade,
        detailBladeInputs: {
            id: inputs.resourceId
        }
    }
};
```

For convenience, the `Settings` blade automatically opens whenever a corresponding resource blade is opened.

### Quick start

![Quick start](../media/portalfx-essentials/quickstart.png)

The quick start provides a common design for helping users get started with your resources. The quick start blade must be built for each extension, using the `<azurefx:QuickStartBlade>`

```ts
var getQuickStartSelection: MsPortalFx.ViewModels.Parts.ResourceSummary.GetDynamicBladeSelection = (inputs: Def.InputsContract) => {
    return <MsPortalFx.ViewModels.DynamicBladeSelection> {
        detailBlade: ExtensionDefinition.BladeNames.engineQuickStartBlade,
        detailBladeInputs: {
            id: inputs.resourceId
        }
    }
};
```

### Users & Roles

![Users & Roles](../media/portalfx-essentials/rbac.png)

Resources support simple role based access via Azure Active Directory. Most resources support simple users & roles out of the box.

### Tags

![Tags](../media/portalfx-essentials/tags.png)

Tags provide a simple way for developers to organize their resources with lightweight key/value pairs. Most resources support tags out of the box.


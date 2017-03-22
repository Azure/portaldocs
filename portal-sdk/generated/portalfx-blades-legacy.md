
<a name="introduction-to-blades"></a>
### Introduction to Blades

A blade is the vertical container that acts as the starting point for any journey. You can define multiple blades, each containing their own collection of statically defined lenses and parts.

![Blade][blade]

Defining a blade in PDL is simple. Blades can be created in any PDL file, and they will be aggregated at compile time into the extension definition:

`\Client\Blades\Locked\Locked.pdl`

```xml
<Blade Name="LockedBlade"
       ViewModel="LockedBladeViewModel">
    <Lens>
        ...
    </Lens>
</Blade>
```

Blades use view models to drive dynamic content include titles, icons, and status.  To learn more about blades, start with the following topics:

* [Controlling blade UI](portalfx-blades-ui.md)
* [Opening blades](portalfx-blades-opening.md)
* [Blade parameters](portalfx-blades-parameters.md)
* [Blade properties](portalfx-blades-properties.md)
* [Blade outputs](portalfx-blades-outputs.md)
* [Pinning blades](portalfx-blades-pinning.md)
* [Blade Kinds](portalfx-blades-bladeKinds.md)
* [Closing blades](portalfx-blades-closing.md)

* Controlling blade UI
 
<a name="blade-ui"></a>
## Blade UI

<a name="blade-ui-controlling-blade-ui"></a>
### Controlling blade UI

Blades support a variety of APIs which make it easy to customize their behavior and experience.

<a name="blade-ui-controlling-blade-ui-title-icon"></a>
#### Title &amp; Icon

The title, subtitle, and icon of a blade can be customized with a View Model. This allows making real time changes to the title and icon based on the status of the asset. The View Model for a blade is a simple interface:

`Client\Blades\Template\ViewModels\TemplateBladeViewModels.ts`

```ts
export class TemplateBladesBladeViewModel extends MsPortalFx.ViewModels.Blade {

    constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: BladesArea.DataContext) {
        super();
        this.title(ClientResources.templateBladesBladeTitle);
        this.subtitle(ClientResources.samples);
        this.icon(MsPortalFx.Base.Images.Polychromatic.Info());
    }
}

```

In this case, the information in the view model will be hard coded. Finally, you're ready to reference the view model from PDL:

```xml
<Blade Name="TemplateBladesBlade"
       ViewModel="TemplateBladesBladeViewModel">
  <Lens>
    ...
  </Lens>
</Blade>
```

<!--
  Blade Content State
-->

<a name="blade-ui-controlling-blade-ui-blade-content-state"></a>
#### Blade Content State

Blades have the ability to display a status at the top of the UI:

![Blade Status][blade-status]

The follow states are currently available:

* None
* Success
* Warning
* Error

The content state and its label are both set in the blade view model. They can be set initially, and changed at runtime to reflect the current state of the blade. For an example of using blade content states, view the following file in the samples:

`\Client\Blades\ContentState\ViewModels\ContentStateViewModels.ts`

```ts
this.contentState(MsPortalFx.Parts.ContentState.Success);
this.contentStateDisplayText("Success!");
```

<!--
  Locking
-->

<a name="blade-ui-controlling-blade-ui-locking"></a>
#### Locking

Locking a blade will prevent users from pinning its parts to the start board, moving parts around, or resizing parts. It's particularly useful when building a list control, an input form, or a create experience.  If you need a locked blade you should use `<TemplateBlade />` as opposed to the classic `<Blade Locked="True" />`.  TemplateBlade has been designed to significantly simplify the locked blade programming model, specifically allows you to use: 

- a single TypeScript ViewModel for the entire blade and its content
- a single <TemplateBlade> PDL element that uses a html template
- significant reduction in the amount of PDL
- significant reduction in property binding complexity

For example to define a TemplateBlade with CommandBar in PDL use the following:

```xml
  <TemplateBlade Name="TemplateBladeWithCommandBar"
                 ViewModel="TemplateBladeWithCommandBarViewModel"
                 Template="{Html Source='..\Templates\SomeTemplate.html'}">
    <CommandBar />
  </TemplateBlade>
```

Contrast TemplateBlade with the classic `<Blade Locked="true"` approach:

```xml
<Blade Name="Samples" 
       Locked="True"
       ViewModel="SomeBladeVideModel">
  <Blade.Commands>
    <Command Text="{Resource saveText, Module=ClientResources}"
             ViewModel="SaveCommandViewModel">
    </Command>
  </Blade.Commands>
  <Lens Name="SomeLens">
    <CustomPart Name="SomeCustomPart"
                  Template="{Html Source='Templates\\SomeTemplate.html'}"
                  ViewModel="SomePartViewModel">
    </CustomPart>
  </Lens>
</Blade>
```

For complete examples of TemplateBlades see SamplesExtension `Client\Blades\Template\Template.pdl`

<!--
  Width
-->

<a name="blade-ui-controlling-blade-ui-width"></a>
#### Width

When creating blades, you can choose from multiple widths. The default is 'Medium':

* Small
* Medium
* Large
* XLarge
* Expandable

This is defined statically on the blade, and cannot be changed by the user. Small blades are useful for displaying lists of information. The Large and XLarge sizes are useful for blades with dense information which doesn't fit on a normal width blade (such as documentation).

`\Client\Blades\BladeWidth\BladeWidth.pdl`

```xml
<Blade Name="Samples"
       Width="Small">

    <Lens>
     ...
    </Lens>

</Blade>
```

<!--
  Initial Display State
-->

<a name="blade-ui-controlling-blade-ui-initial-display-state"></a>
#### Initial Display State

When the user opens a blade, you can choose to have it open in the normal state, or in a maximized state:

* Maximized
* Normal

Users may always choose to restore the blade to its normal supported width. This is useful for blades which contain large amounts of information.

```xml
<Blade Name="Samples"
       InitialDisplayState="Maximized">
    <Lens>
     ...
    </Lens>
</Blade>
```

[blade]: ../media/portalfx-blades/blade.png
[blade-status]: ../media/portalfx-blades/blade-status.png

* Opening blades
 
<a name="blade-opening-and-closing"></a>
# Blade opening and closing

This section describes how to open blades using the new (and recommended) container APIs as well as the older (not recommended) declarative APIs.

There is also a [live sample](http://aka.ms/portalfx/samples#blade/SamplesExtension/SDKMenuBlade/openbladeapi) available.

<a name="blade-opening-and-closing-strongly-typed-blade-reference-classes"></a>
## Strongly typed blade reference classes

When you compile your extension, a strongly typed blade reference class will be auto-generated for each blade in your system.  For example, if you have a blade called 'MyBlade', then a TypeScript class called 'MyBladeReference' will be generated in the _generated folder.  These blade reference classes can be used to open blades programmatically.
 
The BladeReference constructor accepts parameters such as Ids, as well as callback functions that allow the child blade to communicate backwards to the parent blade (shown later in the document).  Here is an example of how you would instantiate a blade reference that represents a website blade.

```javascript 
import { WebsiteBladeReference } from "../_generated/BladeReferences"; 
…
var bladeRef = new WebsiteBladeReference({
    parameters: { id: "_ARM_ID_HERE" }
});
```

Blade references are also generated for external extensions. The compiler creates a blade references module for every PDE file (Portal Definition Exports) you include.

If you want to open a blade in the a different extension you need to -
1. Ensure your project referencies the external extension's PDE file 
1. import the blade reference you desire from "../../_generated/<ExtesnionName>/BladeReference"

```javascript
import { LocationPickerV3BladeReference } from "../../_generated/HubsExtension/BladeReferences"
```

Blade references for parameter providers have a different signature that is nearly identical to the options that you provide to the ParameterCollector class.

<a name="blade-opening-and-closing-opening-blades-recommended-pattern"></a>
## Opening blades (Recommended pattern)

These methods are now available on your template blade container.

```javascript
    // opens a blade right now
    openBlade(bladeToOpen: BladeReference): Promise<boolean>; 
     
    // displays the blade placeholder right now, but shows a spinner until the given promise resolves
    openBladeAsync(promiseToDetermineBladeToOpen: Promise<BladeReference>): Promise<boolean>; 
     
    // opens a context blade right now
    openContextBlade(bladeToOpen: BladeReference): Promise<boolean>; 
     
    // displays the context blade placeholder right now, but shows a spinner until the given promise resolves
    openContextBladeAsync(promiseToDetermineBladeToOpen: Promise<BladeReference>): Promise<boolean>; 
```

Each of these methods returns a promise that generally returns true.  If there is a blade on the screen that has unsaved edits to a form, the framework will prompt the user, giving them the option to keep the unsaved blade open.  If the user chooses to continue working on their unsaved edits then the blade opening promise will return false.

For the Async methods, your code provides a promise.  If that promise fails (is rejected) then the promise returned from this API returns false.

<a name="blade-opening-and-closing-click-callbacks"></a>
## Click callbacks

In many cases, blade opening will be the result of a user interaction such as a click.  To support those scenarios many of our controls now support click callbacks.  You can use the blade opening APIs described above within these callbacks.  If the control you’re using supports highlighting the item that was clicked, such as the grid, then the highlight will be added to the click target automatically.  The highlight will be automatically cleared when the child blade closes.  Here are some examples:
 
<a name="blade-opening-and-closing-click-callbacks-button"></a>
### Button

Opens a blade when a button is clicked

```javascript
var button = new SimpleButton.ViewModel({
    // … skipping over other button options
    onClick: () => {
        container.openBlade(new SomeBladeReference(…));
    }
});
```

<a name="blade-opening-and-closing-click-callbacks-grid"></a>
### Grid

Opens a blade when a row on a grid is clicked
``` javascript 
var grid= new Grid.ViewModel<Website, WebsiteId>({
    // … skipping over other grid options
    onRowClicked: (item: Website) => {
        container.openBlade(new SomeBladeReference(/* website id likely passed as an input here */));
    }
});
```

<a name="blade-opening-and-closing-click-callbacks-custom-html"></a>
### Custom HTML

Opens a blade when an arbitrary html element is clicked.  
 
__NOTE__: The fxClick handler is new, and designed to handle the async nature of click communication between the shell and your extension
__NOTE__: You should use semantically correct HTML in order to meet accessibility requirements.

```javascript
// Your html template
<a data-bind= "fxClick: myOnClick">Click me!</a>
 
// Your template blade or part view model
public myOnClick(): void {
    container.openBlade(new SomeBladeReference(…));
}
```

If you call any of the container.open* methods from within an fxclick handler then the `ext-msportalfx-activated` class will be automatically added to the html element that was clicked.
The class will be automatically removed when the child blade is closed.

<a name="blade-opening-and-closing-click-callbacks-declarative-ways-to-open-blades-not-recommended-for-new-scenarios"></a>
### Declarative ways to open blades (Not recommended for new scenarios)

![Blade][blade]

<a name="blade-opening-and-closing-click-callbacks-declarative-ways-to-open-blades-not-recommended-for-new-scenarios-simple-blade-action-not-recommended-for-new-scenarios"></a>
#### Simple Blade Action (Not recommended for new scenarios)

The `<BladeAction>` tag provides the API required for opening a blade.  In the simplest of cases, the only required information is the name of the blade to launch:

`\SamplesExtension\Extension\Client\extension.pdl`

```xml
<Part Name="SamplesExtensionPart"
      PartKind="Button"
      ViewModel="{ViewModel Name=SamplesExtensionPartViewModel, Module=./ViewModels/SamplesViewModels}">
  <BladeAction Blade="SamplesExtensionBlade" />
</Part>
```

In the code snippet above, clicking on the part will launch the **SamplesExtensionBlade**.  The same pattern can be followed for commands:

`\SamplesExtension\Extension\Client\Commands\OpenBladeCommand\OpenBladeCommand.pdl`

```xml
<Command Kind="Blade"
       Name="OpenBladeCommand"
       Text="{Resource openBladeCommandNone, Module=ClientResources}"
       ViewModel="{ViewModel Name=OpenBladeCommand, Module=./OpenBladeCommand/ViewModels/OpenBladeCommandViewModels}">
  <BladeAction Blade="NoParameterChildBlade" />
</Command>
```

<a name="blade-opening-and-closing-click-callbacks-declarative-ways-to-open-blades-not-recommended-for-new-scenarios-passing-parameters-with-bladeinput-not-recommended-for-new-scenarios"></a>
#### Passing parameters with BladeInput (Not recommended for new scenarios)

The cases above are trivial, in that no information is passed from the part or the command to the opened blade.  This will actually be an uncommon occurrence.  Usually, at the very least an {id} will be passed from the part to the blade. To pass information while launching a blade, a `<BladeInput>` is used:

`\SamplesExtension\Extension\Client\Bindings\InputBindingsDifferentBlades\InputBindingsDifferentBlades.pdl`

```xml
<CustomPart Name="ParentPart"
            ViewModel="{ViewModel Name=InputBindingsDifferentBladesParentPartViewModel, Module=./InputBindingsDifferentBlades/ViewModels/InputBindingsDifferentBladesViewModels}"
            Template="{Html Source='Templates\\Parent.html'}">

  <BladeAction Blade="InputBindingsDifferentBladesChildBlade">
    <BladeInput Parameter="currentNumber"
                Source="selectedItem" />
  </BladeAction>
</CustomPart>
```

The sample above instructs the portal to open the `InputBindingsDifferentBladesChildBlade` blade, while passing a parameter named `currentNumber` to the blade.  The `selectedItem` property of the `InputBindingsDifferentBladesParentPartViewModel` view model will be used as the source of the argument passed to the blade.  To piece this all together:

* Blade - name of the blade to open
* Parameter - name of the blade parameter (argument) the `InputBindingsDifferentBladesChildBlade` is expecting to receive.
* Source - public observable property on the `InputBindingsDifferentBladesParentPartViewModel` view model which contains the information to pass to the new blade.
* content.* - this notes that the `selectedItem` property exists on the view model.  You may potentially also use container.*, which allows binding to properties available on the container object passed into the view model constructor.

The view model for the part which launches the blade defines the `selectedItem` property which is used for the source:

`\SamplesExtension\Extension\Client\Bindings\InputBindingsDifferentBlades\ViewModels\InputBindingsDifferentBladesViewModels.ts`

```ts
/// <reference path="../../../TypeReferences.d.ts" />
import BindingsArea = require("../../BindingsArea");
import ClientResources = require("ClientResources");

export class InputBindingsDifferentBladesParentPartViewModel {

    /**
     * List of options provided in the template.
     */
    public availableOptions: any = [1, 2, 3, 4, 5];

    /**
     * The item selected from the other blade.
     */
    public selectedItem: KnockoutObservable<number> = ko.observable(1);

    /**
     * Part view model constructor.
     */
    constructor(container: MsPortalFx.ViewModels.PartContainerContract, initialState: any, dataContext: BindingsArea.DataContext) {
        container.partTitle(ClientResources.parentPart);

        this.selectedItem.subscribe((newValue) => {
            console.info(ClientResources.selectedItemChanged);
        });
    }
}
```

<a name="blade-opening-and-closing-click-callbacks-declarative-ways-to-open-blades-not-recommended-for-new-scenarios-blade-parameters-not-recommended-for-new-scenarios"></a>
#### Blade Parameters (Not recommended for new scenarios)

Blades must explicitly declare which parameters they are required to receive.  Think of this as a function signature. There are [multiple types of parameters](portalfx-blades-parameters.md), each of which can serve a special purpose. In the examples above, a `<BladeInput>` defined a `Parameter` property - that parameter must match the name of a parameter available on the launched blade.  To learn more about blade parameters, check out the [full documentation](portalfx-blades-parameters.md).

`\SamplesExtension\Extension\Client\Bindings\InputBindingsDifferentBlades\InputBindingsDifferentBlades.pdl`

```xml
<Blade>
  ...
  <Blade.Parameters>

    <!--
      Typically a blade will have a key property (or set of key properties)
      that indicate uniqueness of the data within the blade.
     -->
    <Parameter Name="currentNumber" Type="Supplemental" />

  </Blade.Parameters>
</Blade>
```

The parameters passed to a blade can then be bound to parts, commands, or even the blade view model.  To learn more, visit [blade propertiess](portalfx-blades-properties.md).

<a name="blade-opening-and-closing-click-callbacks-declarative-ways-to-open-blades-not-recommended-for-new-scenarios-receiving-data-with-bladeoutput-not-recommended-for-new-scenarios"></a>
#### Receiving data with BladeOutput (Not recommended for new scenarios)

In some cases, you may want to pass information from the current blade back to the parent blade. Blades can define a list of output properties that flow back to the calling blade. A common use for this binding is to return data from a child blade back to a part on its parent blade.

![Typical use of blade outputs][part-settings]

In this example, the parent blade defines a `BladeAction` which passes a `currentNumber` property to the child blade. This will allow changes in the View Model on the child blade to flow back to the view model on the parent blade.

`\SamplesExtension\Extension\Client\Bindings\OutputBindings\OutputBindings.pdl`

```xml
<CustomPart Name="ParentPart"
            ViewModel="{ViewModel Name=OutputBindingsParentPartViewModel,
                                  Module=./OutputBindings/ViewModels/OutputBindingsViewModels}"
            Template="{Html Source='Templates\\Parent.html'}">

  <BladeAction Blade="OutputBindingsChildBlade">
    <BladeOutput Parameter="currentNumber"
                 Target="currentNumber" />
  </BladeAction>
</CustomPart>
```

In the code above, the `onInputsSet` method of the `OutputBindingsParentPartViewModel` will be invoked when the `currentNumber` blade parameter changes in the child blade.

* Parameter - the name of the blade parameter passed to `OutputBindingsChildBlade`

* Target - the name on the `inputs` argument passed to the `onInputsSet` method of the `OutputBindingsParentPartViewModel` view model.

> [WACOM.NOTE] When the value of a blade output changes, the `onInputsSet` method of the part view model will be invoked.  The `inputs` object will contain the value of the output binding, which may not have been available when the first time `onInputsSet` is invoked.  This is one of the cases where `onInputsSet` is called multiple times for a given view model.

Learn more about [blade outputs](portalfx-blades-outputs.md).

<a name="blade-opening-and-closing-click-callbacks-declarative-ways-to-open-blades-not-recommended-for-new-scenarios-grids-collectionparts-and-listviews"></a>
#### Grids, CollectionParts, and ListViews

Controls which are bound to a collection of elements (like the grid) can make the selection model a little more nuanced.  In most cases, the control will pass blade inputs which are defined by a property on the model object bound to the control:

`\SamplesExtension\Extension\Client\Data\MasterDetailBrowse\MasterDetailBrowse.pdl`

```xml
<Part Name="MasterBrowseListPart"
      ViewModel="{ViewModel Name=BrowseMasterListViewModel, Module=./MasterDetailBrowse/ViewModels/MasterViewModels}"
      PartKind="Grid">
  <BladeAction Blade="BrowseDetailBlade">
    <BladeInput Parameter="currentItemId"
                Source="{SelectedItem Property=id}" />
  </BladeAction>
</Part>
```

The new twist in the syntax is `Source="{SelectedItem Property=id}`.  This will identify the `id` property on the model object bound to the grid.  In this example, the `id` property is available on the `Website` model object, which is bound to the grid.  The grid only needs to declare itself as selectable:

```ts
private _websitesQueryView: MsPortalFx.Data.QueryView<SamplesExtension.DataModels.WebsiteModel, MasterDetailBrowseData.WebsiteQuery>;

...

var extensions = MsPortalFx.ViewModels.Controls.Lists.Grid.Extensions.SelectableRow,
    extensionsOptions = {
        selectableRow: {
            selectionMode: MsPortalFx.ViewModels.Controls.Lists.Grid.RowSelectionMode.Single,
            activateOnSelected: ko.observable<boolean>(true),
        }
    };

    super(this._websitesQueryView.items, extensions, <any>extensionsOptions);
```

<a name="blade-opening-and-closing-click-callbacks-declarative-ways-to-open-blades-not-recommended-for-new-scenarios-supporting-nested-selectables-not-recommended-for-new-scenarios"></a>
#### Supporting nested selectables (Not recommended for new scenarios)

In rare cases, your part may be select both by clicking the part, and by clicking on an item within the part.  The classic example of this interaction is the `CollectionPart`:

`\SamplesExtension\Extension\Client\Parts\Intrinsic\CollectionPart\CollectionPartIntrinsicInstructions.pdl`

```xml
<Part Name="SelectableCollectionPartLarge"
      PartKind="Collection"
      ViewModel="{ViewModel Name=SelectableCollectionPartViewModel, Module=./Intrinsic/ViewModels/CollectionPartViewModel}">
  <BladeAction Blade="CollectionDetailsBlade">
    <BladeInput
        Parameter="title"
        Source="rollupCount" />
  </BladeAction>
  <BladeAction
      Blade="ItemDetailsBlade"
      SelectableSource="selectableData">
    <BladeInput
        Parameter="title"
        Source="{SelectedItem Property=ssnId}" />
  </BladeAction>
</Part>
```

There are two separate `<BladeAction>` elements defined for this part.  The `CollectionDetailsBlade` is launched when the part is clicked, passing only a simple parameter which is available from the view model.  The `ItemDetailsBlade` is launched when clicking on a row in the collection part.  The `SelectableSource` defines the direct path to the selectable object on the Collection Part view model.

<a name="blade-opening-and-closing-click-callbacks-declarative-ways-to-open-blades-not-recommended-for-new-scenarios-launching-blades-from-another-extension-not-recommended-for-new-scenarios"></a>
#### Launching blades from another extension (Not recommended for new scenarios)

When using `<BladeAction>`, you're generally going to be launching blades from your own extension.  In some cases, you may [import a part from another extension](portalfx-parts-sharing.md).  Using this technique, the source of the shared part will control launching of the blade.  However - in some cases you may want to launch a blade from another extension using a part from the current extension.  This is where `BladeReference` is useful.

<a name="blade-opening-and-closing-the-pde-file"></a>
## The PDE File

You may not have noticed, but every time you build your project you're generating a .PDE file inside of the `\Client\_generated` directory. The PDE file contains a list of the parts which are exposed in the global scope, along with a few other pieces of metadata:

```json
{
  "extension": "HubsExtension",
  "version": "1.0",
  "sdkVersion": "1.0.8889.122 (rd_auxweb_n_f1(tomcox).130919-1440)",
  "schemaVersion": "0.9.1.0",
  "assetTypes": [
    {
      "name": "TagsCollection",
      "permissions": []
    }
    ...
  ],
  "parts": [
    {
      "name": "ChangeLogPart",
      "inputs": []
    },
    ...
  ],
  "blades": [
    {
      "name": "TagCollectionBlade",
      "keyParameters": [],
      "inputs": [],
      "outputs": []
    },
    ...
  ]
}
```

To share parts, blades, or asset types with another extension, **both extensions must be running in the same portal**. The sharing of parts occurs at runtime, which requires that both extensions be present within the shell for this technique to work.

<a name="blade-opening-and-closing-importing-the-pde-file"></a>
## Importing the PDE file

After you've generated the PDE file, it needs to be added to the project of the extension that wishes to consume your parts. First, add the file to your project. Next, you need to make a manual change to your .csproj file. Instead of using the `<Content>` compile action, you need to change it to `<ExtensionReference>`. Right click on your project file, and choose 'Unload Project'. Next, right click the project file again, and choose 'Edit'. Find the PDE file reference, and change the compile action:

```xml
<ExtensionReference Include="Client\References\HubsExtension.pde" />
```

Save the file, right click on your project file, and choose 'Reload Project'.


<a name="blade-opening-and-closing-importing-the-pde-file-consuming-the-blade-not-recommended-for-new-scenarios"></a>
##### Consuming the blade (Not recommended for new scenarios)

To launch the blade referenced by the PDE file, use a `<BladeAction>` as usual, but specifying the extension:

'\Client\ResourceTypes\ResourceTypes.pdl'

```xml
<BladeAction Blade="{BladeReference ResourceMapBlade, ExtensionName=HubsExtension}">
  <BladeInput
      Source="assetOwner"
      Parameter="assetOwner" />
  <BladeInput
      Source="assetType"
      Parameter="assetType" />
  <BladeInput
      Source="assetId"
      Parameter="assetId" />
</BladeAction>
```

<a name="blade-opening-and-closing-importing-the-pde-file-dynamic-blade-action-not-recommended-for-new-scenarios"></a>
#### Dynamic Blade Action (Not recommended for new scenarios)

In the examples above, the target blade to be launched is known at design time.  In some cases, the blade to launch may not be known until runtime.  To define the blade at runtime, use `<DynamicBladeAction>`:

`\SamplesExtension\Extension\Client\Blades\DynamicBlade\DynamicBlade.pdl`

```xml
<CustomPart Name="DynamicBladePart"
            ViewModel="{ViewModel Name=DynamicBladePartViewModel, Module=./DynamicBlade/ViewModels/DynamicBladePartViewModel}"
            Template="{Html Source='..\\..\\Common\\Templates\\PartWithTitle.html'}"
            InitialSize="Small">
  <DynamicBladeAction SelectableSource="container.selectable.value" />
</CustomPart>
```

Notice the `DynamicBladeAction` does not designate a target blade.  However - it does ask for the path to a `selectable` object.  Selectables are an advanced aspect of the API, which is generally abstracted for the extension developer.  In this case, we are targeting the selectable that belongs to the **entire part**.  You can also target selectables that belong to specific control view models.

The view model in this case will define the blade to launch at runtime.  When the state of the part changes, the `selectedValue` property of the selectable can be modified to accept a `DynamicBladeSelection` object:

`\SamplesExtension\Extension\Client\Navigation\DynamicBlades\ViewModels\DynamicBladesViewModels.ts`

```ts
import ExtensionDefinition = require("../../../_generated/ExtensionDefinition");

...

this._container.selectable.selectedValue(<MsPortalFx.ViewModels.DynamicBladeSelection>{
    detailBlade: ExtensionDefinition.BladeNames.bladeName,
    detailBladeInputs: {
        // If your blade expects inputs (these do not), you could pass the inputs here.
    }
});
```

The code above can be executed anytime the target blade will change.  This will not trigger the launching of the blade, simply change that blade to launch when the user clicks on the part (or command, or hotspot, etc).  The `ExtensionDefinition.BladeNames` object above contains a strongly typed list of available blades in the extension.

> [WACOM.NOTE] Dynamic blade selection should be avoided, unless there is a strict requirement for determining the blade at runtime.  Static definitions allow for better compile time checking of names and inputs.  Also, blade outputs are not supported when using dynamic blade selection.

This method can also be used to launch a blade from another extension, using the 'extension' property of `DynamicBladeSelection`.

<a name="blade-opening-and-closing-importing-the-pde-file-hotspots-not-recommended-for-new-scenarios"></a>
#### Hotspots (Not recommended for new scenarios)

When building [custom parts](portalfx-parts-custom.md), you may want to launch a blade from a div, button, or `<a>` tag. To launch a blade, start with a `pcHotSpot` binding in your HTML template:

`\SamplesExtension\Extension\Client\ParameterCollection\CollectorAsHotSpot\Templates\CompositePart.html`

```html
<div data-bind="pcHotSpot: hotSpotSelectable">
  Click me [<span data-bind='text: hotSpotValue'></span>]GB
</div>
```

The `hotSpotSelectable` property needs to be a public property on your part view model of type `MsPortalFx.ViewModels.Selectable<boolean>`:

`\SamplesExtension\Extension\Client\ParameterCollection\CollectorAsHotSpot\ViewModels\CompositePartHotSpotViewModel.ts`

```ts
/**
 * Selectable for the hot spot.
 */
public hotSpotSelectable: MsPortalFx.ViewModels.Selectable<boolean>;

constructor(container: MsPortalFx.ViewModels.PartContainerContract,
            initialState: any,
            dataContext: ParameterCollectionArea.DataContext) {

    // Initialize the alphaSelectable
    this.hotSpotSelectable = new MsPortalFx.ViewModels.Selectable<boolean>({
        isSelected: !!(initialState && initialState.alphaSelectable && initialState.alphaSelectable.isSelected),
        selectedValue: !!(initialState && initialState.alphaSelectable && initialState.alphaSelectable.isSelected)
    });
}
```

The selectable object must be referenced from your PDL, hooking up the blade action to the selectable:

`\SamplesExtension\Extension\Client\ParameterCollection\ParameterCollection.pdl`

```xml
<BladeAction Blade="ParameterProviderFormBlade" SelectableSource="hotSpotSelectable" />
```

<a name="blade-opening-and-closing-importing-the-pde-file-advanced-selection-not-recommended-for-new-scenarios"></a>
#### Advanced selection (Not recommended for new scenarios)

In some cases, you may have scenarios where the list of selectable items are not known up front.  Generally, you can point at a single selectble control or selectable set control.  Some cases are a little problematic:

* A grid that contains other grids
* A grid with hotspots inside of it
* A List view with tree views

In these rare cases, you may need to inform the shell of other controls which are not known at design time.  These controls (hotspots, grids, buttons) are generated dynamically.  For example, in this case there are many hotspot objects which will support selection:

`\SamplesExtension\Extension\Client\Bindings\DynamicSelectableRegistration\Templates\DynamicHotSpots.html`

```html
<div data-bind="foreach: hotspots">
    <div data-bind="pcHotSpot: selectable">
        <span data-bind="text: label"></span>
    </div>
</div>
```

For each hotspot generated above, the shell needs to know which blade to launch.  This is accomplished by using the `container.regsiterSelectable` API:

`\SamplesExtension\Extension\Client\Bindings\DynamicSelectableRegistration\ViewModels\DynamicHotspots.ts`

```ts
var lifetime = this._container.createChildLifetime(),
    selectable = MsPortalFx.ViewModels.Part.createSelectableViewModel(),
    id = SelectableIdPrefix + this.hotspots().length,
    label = "Hotspot #" + (this.hotspots().length + 1);

// a registered selectable requires unique id.
// the id is used to save and restore the selectable state when the journey is restored
this._container.registerSelectable(lifetime, id, selectable);

// set the blade selector which describes which blade we want to open when this hotspot is clicked
selectable.selectedValue(<MsPortalFx.ViewModels.DynamicBladeSelection>{
    detailBlade: ExtensionDefinition.BladeNames.hotspotChildBlade,
    detailBladeInputs: {
        HotspotId: label
    }
});

// finally add it to our list of hotspots that is displayed
this.hotspots.push({
    label: label,
    selectable: selectable,
    lifetime: lifetime
});
```

The same API can be applied to grids, list views, buttons, or any control that exposes a selectable or selectableSet object.



* Blade parameters
 
<a name="blade-opening-and-closing-importing-the-pde-file-blade-parameters"></a>
### Blade Parameters

Blades must explicitly declare which parameters they are required to receive.  Think of this as a function signature. There are multiple types of parameters, each of which can serve a special purpose.

<a name="blade-opening-and-closing-importing-the-pde-file-blade-parameters-key-parameters"></a>
#### Key Parameters

Key parameters define properties which act as the primary key for the blade. A common example may be "Website Id: 42" for a given blade. Often, a blade will have a single input which defines this identifier. Key properties are used as a key in the shell to save user settings like the layout of the blade, part sizes, part state, etc.

```xml
<Blade>
  ...
  <Blade.Parameters>

    <!--
      Typically a blade will have a key property (or set of key properties)
      that indicate uniqueness of the data within the blade.
     -->
    <Parameter Name="WebsiteId" Type="Key" />

  </Blade.Parameters>
</Blade>
```

<a name="blade-opening-and-closing-importing-the-pde-file-blade-parameters-neweditscope-parameters"></a>
#### NewEditScope Parameters

For parts which provide form editing capabilities, they often need to request an editScopeId. Previously, developers were required to provide a name for this input, and go through some trials to access the Id. It is now provided as a simple input which can be accessed view the `editScopeId` BladeParameter.

```xml
<Blade>
  ...
  <Blade.Parameters>
    <!--
      EditScopes are a special kind of input. They are generated from the shell,
      and are not passed via a blade binding.
    -->
    <Parameter Type="NewEditScope" />
  </Blade.Parameters>
</Blade>
```

<a name="blade-opening-and-closing-importing-the-pde-file-blade-parameters-output-parameters"></a>
#### Output Parameters

Output parameters provide the ability to receive an input from a child blade. Functionally little has changed with output bindings, but now they are a special defined type of input:

```xml
<Blade>
  ...
  <Blade.Parameters>
    <!--
      Output parameters are not set at invocation time, and cannot be keys or edit scopes.
    -->
    <Parameter Name="queryMetricId" Type="Output" />
  </Blade.Parameters>
</Blade>
```

<a name="blade-opening-and-closing-importing-the-pde-file-blade-parameters-supplemental-parameters"></a>
#### Supplemental Parameters

Supplemental parameters provide no special function, and are not a key, but are used as additional data required by the part.

```xml
<Blade>
  ...
  <Blade.Parameters>

    <!--
      Supplemental inputs provide non-key parameters from launching blade. These may
      come from a different part on the launching blade.
    -->
    <Parameter Name="checkBoxValue" Type="Supplemental" />

  </Blade.Parameters>
</Blade>
```


* Blade properties
 
<a name="blade-opening-and-closing-importing-the-pde-file-blade-properties"></a>
### Blade Properties

Blades use blade view models to manage the display information. This includes information like the title, subtitle, icon, and status. To acquire this data, often your extension will load an object by Id. Information passed into the blade as a `BladeParamter` can be passed to the blade view model via a `<Property>` element. For an example, refer to this file in the samples:

```
\Client\Hubs\Browse\Browse.pdl
```

```xml
<Blade Name="RobotBlade" ViewModel="RobotBladeViewModel">
  <Blade.Parameters>
    <Parameter Name="id" Type="Key"/>
  </Blade.Parameters>

  <Blade.Properties>
    <Property Name="name" Source="{BladeParameter Name=id}"/>
  </Blade.Properties>
  ...
</Blade>
```

In this example an `id` property is passed into the blade as a parameter, and then the `name` property is passed into the blade view model. The blade view model may subscribe to changes in this value, and update the blade information as required. For an example, refer to this file in the samples:

`\Client\Hubs\Browse\ViewModels\RobotBladeViewModel.ts`

```ts
module SamplesExtension.Hubs {
    /**
     * Represents the view model used by the robot blade.
     */
    export class RobotBladeViewModel extends MsPortalFx.ViewModels.Blade {

        /**
         * The name property is provided by an input binding to the blade.
         */
        public name = ko.observable("");

        /**
         * When the name is passed, bind it to the blade title. You could also choose
         * to grab the whole robot and use other pieces of its data (see RobotPartViewModel)
         */
        constructor(initialValue: any, dataContext: DataContext) {
            super();
            this.subtitle(SamplesExtension.Resources.Strings.hubsLensTitle);
            this.icon(MsPortalFx.Base.Images.Polychromatic.Gears());

            this.title = ko.computed((): string => {
                var title = SamplesExtension.Resources.Strings.loadingText;

                if (this.name() !== "") {
                    title = SamplesExtension.Resources.Strings.robotTitle + ": " + this.name();
                }

                return title;
            });
        }
    }
}
```

When changes are made to the `name` property on the view model, the `title` is updated on the blade.

<a name="blade-opening-and-closing-importing-the-pde-file-blade-property-bindings"></a>
### Blade Property Bindings

In most cases, parts will bind to `{BladeParameter}` values passed into the blade. In some cases, you may want to bind directly to a value on a blade view model. The most common use of this binding is to transform a value from a `{BladeParameter}` into some other form.
  Consider the following blade view model:

`\Client\Blades\Properties\ViewModels\BladePropertyViewModels.ts`

```ts
/**
 * The blade view model for blade Properties.
 */
export class BladePropertiesBladeViewModel extends MsPortalFx.ViewModels.Blade {

    /**
     * The temperature in celcius is calculated as a public property, used by a part.
     */
    public tempInCelcius: KnockoutComputed<number>;

    private _tempInFahrenheit = ko.observable(0);

    /**
     * View model constructor.
     */
    constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: DataContext) {
        super();
        this.title(SamplesExtension.Resources.Strings.bladePropertiesBladeTitle);
        this.icon(MsPortalFx.Base.Images.Polychromatic.Gears());

        this.tempInCelcius = ko.computed<number>(() => {
            return Math.round((this._tempInFahrenheit() - 32) * (5/9));
        });
    }

    /**
     * When the temperature in F is passed in, trigger the computed to calculate it in C
     */
    public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
        this._tempInFahrenheit(inputs.tempInFahrenheit);
        this.title(SamplesExtension.Resources.Strings.bladePropertiesBladeTitle + " - " + inputs.tempInFahrenheit + " deg F");
        return null;
    }
}
```

The view model accepts an input of temperature in fahrenheit, and projects a new property of temperature in celcius. A part on this blade can bind to the public `tempInCelcius` property:

`\Client\Blades\Properties\BladeProperties.pdl`

```xml
<CustomPart Name="PropertyButtonPart"
            ViewModel="PropertyButtonPart"
            Template="{Html Source='Templates\\Temperature.html'}">
  <CustomPart.Properties>
    <!--
      This part accepts an input via a public property on the blade view model.
      These bindings are called BladeProperty bindings.
    -->
    <Property Name="tempInCelcius"
              Source="{BladeProperty content.tempInCelcius}" />
  </CustomPart.Properties>
</CustomPart>
```


* Blade outputs
 
<a name="blade-opening-and-closing-importing-the-pde-file-blade-outputs"></a>
### Blade Outputs

In some cases, you may want to pass information from the current blade back to the parent blade. Blades can define a list of output properties that flow back to the calling blade. A common use for this binding is to return data from a child blade back to a part.

![Typical use of blade outputs][part-settings]

In this example, the parent blade defines a `BladeAction` which passes an `id` property to the child blade. This will allow changes in the View Model on the child blade to flow back to the view model on the parent blade.

`\SamplesExtension\Extension\Client\Bindings\OutputBindings\OutputBindings.pdl`

```xml
<CustomPart Name="ParentPart"
            ViewModel="{ViewModel Name=OutputBindingsParentPartViewModel,
                                  Module=./OutputBindings/ViewModels/OutputBindingsViewModels}"
            Template="{Html Source='Templates\\Parent.html'}">

  <BladeAction Blade="OutputBindingsChildBlade">
    <BladeOutput Parameter="currentNumber"
                 Target="currentNumber" />
  </BladeAction>
</CustomPart>
```

In the snippet above, `OutputBindingsChildBlade` will be opened with a `currentNumber` parameter.  The child blade will be responsible for setting the value on the output binding.  After that value is set, `onInputsSet` of the part will be invoked, this time with a value named `currentNumber`.





* Pinning blades 

<a name="blade-opening-and-closing-importing-the-pde-file-pinning-blades"></a>
### Pinning blades

By default, all blades and parts are 'pinnable'.  Pinning a blade creates a part on the currently active dashboard.

Every blade in the portal has a default representation. The default part for a blade uses a [button part](portalfx-parts-intrinsic-button.md).  The title, subtitle, and icon provided in the blade view model provide the data needed to create the default view.

<a name="blade-opening-and-closing-importing-the-pde-file-pinning-blades-creating-a-custom-pinned-part"></a>
#### Creating a custom pinned part

While the default pinned part is often sufficient, there are a few places where you may want to show a custom part representation.  

To use a custom pinned part, it's as easy as

`\SamplesExtension\Extension\Client\extension.pdl`

```xml
<!--
	Create a part in the <definition> element, making it available
	in the catalog.
-->
<Part Name="SDKPartType"
      ViewModel="SDKPartViewModel"
      PartKind="Button">
  <BladeAction Blade="SDKBlade"/>
</Part>

<Blade Name="SDKBlade"
  	   ViewModel="SDKBladeViewModel">
  <!--
  	The pinned part tag simply refers to a part already in the catalog.
  -->
  <PinnedPart PartType="SDKPartType" />
  ...
</Blade>
```

In the simple example above, the part in the catalog does not require inputs.  In the event that the part does require an input, the inputs must match the properties passed into the blade view model.  To learn more, check out [building pinnable parts](portalfx-parts-pinning.md).

<a name="blade-opening-and-closing-importing-the-pde-file-pinning-blades-preventing-pinning"></a>
#### Preventing pinning

There are some cases where a blade should not be pinned.  Those generally include:

* Create flows
* Editable forms
* Steps in a wizard

> [WACOM.NOTE] Users generally expect blades to be pinnable.  Only use Pinnable="False" in places where the pinned blade truly adds no value.

To prevent a blade from being pinned, set `Pinnable="False"` in the blade definition.

`\SamplesExtension\Extension\Client\Security\Security.pdl`

```xml
<Blade Name="SecuritySampleBlade"
       Pinnable="False">
  ...
```

* Closing blades

<a name="closing-blades-programatically"></a>
# Closing blades programatically

This snippet shows how to close the current blade.  This can be called from either a blade or part container.  You can optionally return untyped data to the parent blade when you close your own blade.

Check out the [blade opening sample](http://aka.ms/portalfx/samples#blade/SamplesExtension/SDKMenuBlade/openbladeapi) and you'll notice that the 'Close' button on the child blades that open is implemented using the new blade closing APIs.
 
The following metnods are now available on your template blade container.

```typescript

import { Container as BladeContainer } from "Fx/Composition/Blade";
   
// closes the current blade now, optionally passing data back to the parent
closeCurrentBlade(data?: any): Promise<boolean>; 
// closes the current child blade now, if one is present
closeChildBlade(): Promise<boolean>; 
// closes the current child context blade now, if one is present
closeContextBlade(): Promise<boolean>; 
```

The following methods are now available on your part container contract.

```typescript
// closes the current child blade now, if one is present
closeChildBlade(): Promise<boolean>; 
// closes the current child context blade now, if one is present
closeContextBlade(): Promise<boolean>; 
```

Each of these methods returns a promise that generally returns true.  If there is a blade on the screen that has unsaved edits to a form, the framework will prompt the user, giving them the option to keep the unsaved blade open.  If the user chooses to continue working on their unsaved edits then the blade closing promise will return false.

<a name="closing-blades-programatically-writing-code-that-reacts-to-a-blade-being-closed"></a>
## Writing code that reacts to a blade being closed

When opening a child blade, you can register the optional onClosed callback to be notified when the blade you've opened closes.  The child blade can send you untyped data that you can use in your callback.  Here is an example:
 
```typescript
import { BladeClosedReason } from "Fx/Composition";
...
container.openBlade(new SomeBladeReference({ … }, (reason: BladeClosedReason, data?: any) => {
        // Code that runs when the blade closes - Data will only be there if the child blade returned it
        // reason lets you differentiate between things like the user closing the blade via the close button vs. a parent blade programatically closing it
});
```



[blade]: ../media/portalfx-blades/blade.png


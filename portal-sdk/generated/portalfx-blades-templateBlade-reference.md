
<a name="templateblade-reference"></a>
### TemplateBlade Reference

TemplateBlade is the **recommended** way of authoring blades in Ibiza (which are equivalent to windows or pages in other systems) in Ibiza.

Authoring template blades require you to provide a blade definition in PDL, an HTML template, and a ViewModel. In this article we will go through the details of the PDL definition and the capabilities in the ViewModel

You can learn the basics of authoring your first template blade in [this article](portalfx-blade-templateBlade.md)

<a name="templateblade-reference-pdl"></a>
#### PDL

The snippet below shows a simple PDL definition for a basic template blade.

```xml
<TemplateBlade
            Name="MyTemplateBlade"
            ViewModel="{ ViewModel Name=MyTemplateBladeViewModel, Module=./ViewModels/MyTemplateBladeViewModel }"
            InitialDisplayState="Maximized"
            Template="{ Html Source='Templates\\MyTemplateBlade.html' }">
</TemplateBlade>
```

There are several other options when defining a TemplateBlade. Below are the most relevant ones:

Name | Description | Required?
--- | --- | ---
Name | Name of the blade. This name is used later to refer to this blade. | Yes
ViewModel | View-model supporting this blade. | Yes
Template | HTML template for the blade. | Yes
Size | Width of the blade. Defaults to *Medium*. | No
InitialDisplayState | Indicates if the blade is opened maximized or not. Default is *Normal* | No
Style | Visual style for the blade.Default is *Basic* | No
Pinnable | Flag that determines if the blade can be pinned or not. Default is *false* | No
ParameterProvider | Flag that determines if the blade is a parameter-provider. Default is *false* | No
Export | Flag that indicates if this blade is exported in your extension and therefore can be opened by other extensions. As a result, a strongly typed blade reference is created.


<a name="templateblade-reference-viewmodel"></a>
#### ViewModel

All TemplateBlades require a view-model. The sections below explain some of the key aspect to build that view-model.

<a name="templateblade-reference-viewmodel-base-class"></a>
##### Base class

All TemplateBlade extend the base class **MsPortalFx.ViewModels.Blade**.

```javascript
export class MyTemplateBladesBladeViewModel extends MsPortalFx.ViewModels.Blade
```

The base class provides access to basic functionality of the blade like setting the title, subtitle, and icon.

<a name="constructor"></a>
### Constructor

The TemplateBlade constructor receives 3 parameters:

* **container**: that is the container for the blade that provides access to Fx functionality (like lifetime management, etc.)
* **initialState**: initial state passed to the blade
* **dataContext**: data context passed into the template blade

The code snippet below shows a simple constructor for a TemplateBlade:

```typescript

constructor(container: FxViewModels.ContainerContract, initialState: any, dataContext: BladesArea.DataContext) {
    super();
    this.title(ClientResources.templateBladesBladeTitle);
    this.subtitle(ClientResources.samples);
    this.icon(MsPortalFx.Base.Images.Polychromatic.Info());
}

```

<a name="oninputset"></a>
### OnInputSet

OnInputSet gets invoked when all the inputs of your blade are set and it returns a promise that is handled by the shell.

If you don't need this functionality (e.g. you have no inputs to your blade) you don't need to implement this method.

When all your blade inputs are available onInputSet is invoked and all those inputs are passed.

```typescript

public onInputsSet(inputs: Def.TemplateBladeWithInputsAndOutputsViewModel.InputsContract): MsPortalFx.Base.Promise {
    // For this sample, show the value was received by adding it to a list.
    this.messages.push(inputs.exampleParameter);
    return null;
}

```

The code snippet below shows a more complex scenario where data is fetched based on the inputs to the blade (a promise for data load is returned)

```typescript

public onInputsSet(inputs: Def.ClientSideSortFilterGridPartViewModel.InputsContract): MsPortalFx.Base.Promise {
    // Update client-side sort/filter properties based on inputs
    this._currentSortProperty(inputs.sortProperty);
    this._currentFilterRunningStatus(inputs.filterRunningStatus);

    // Ensure the required data loads. Since this sample demonstrates client-side sorting/filtering,
    // it doesn't send any particular query to the server. It just fetches everything.
    // Since the query parameters don't change, this means it only issues an ajax request the first time
    // onInputsSet runs, and not on subsequent invocations.
    return this._websitesQueryView.fetch({});
}

```

<a name="oninputset-defining-the-signature-of-your-blade-inputs-and-outputs"></a>
#### Defining the signature of your blade (inputs and outputs)

You can define the signature of your blade as a set of input and output parameters.

To define those parameters you need to both declare them in your blade PDL definition (using the **TemplateBlade.Parameters** element) and also declare properties in your ViewModel for those parameters.

The parameters are passed to your ViewModel via **onInputSet** (which is described above).

To learn more about blade parameters, [read this article](portalfx-blade-parameters.md)

<a name="oninputset-using-commandbar"></a>
#### Using CommandBar

The CommandBar is the container for the commands (clickable toolbar above the content area in the blade) in your TemplateBlade. 

To use a command bar you need to add a **CommandBar** element to your blade PDL definition.

```xml

<TemplateBlade Name="PdlTemplateBladeWithCommandBar"
           ViewModel="{ViewModel Name=TemplateBladeWithCommandBarViewModel, Module=./Template/ViewModels/TemplateBladeViewModels}"
           Template="{Html Source='..\\..\\Blades\\Template\\Templates\\SharedTemplateBladeTemplate.html'}">
  <CommandBar />
</TemplateBlade>

```

The code below demonstrates a basic initialization example for a toolbar (adding a button and reacting to its click event)

```typescript

export class TemplateBladeWithCommandBarViewModel
extends Blade
implements Def.TemplateBladeWithCommandBarViewModel.Contract
{
/**
 * A list of messages that will be displayed in the UI.
 */
public messages = ko.observableArray<string>();

/**
 * View model for the command bar on this blade.
 */
public commandBar: Toolbars.Toolbar;

constructor(container: FxCompositionBlade.Container, initialState: any, dataContext: BladesArea.DataContext) {
    super();

    this.title(ClientResources.templateBladeWithCommandBar);

    var commandBarButton = new Toolbars.ToggleButton<boolean>();
    commandBarButton.label(ClientResources.templateBladeCommandBarToggleLabel);
    commandBarButton.icon(Images.Redo());
    commandBarButton.checked.subscribe(container,(isChecked) => {
        this.messages.push(ClientResources.templateBladeCommandBarToggleInfo.format(isChecked.toString()));
    });

    this.commandBar = new Toolbars.Toolbar(container);
    this.commandBar.setItems([commandBarButton]);
}
}

```

<a name="oninputset-advanced-topics"></a>
#### Advanced topics

Template blades can store settings, define how they behave when pinned to the dashboard, and display status, among other advanced capabilities.

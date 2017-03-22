* [Blades](#blades)
    * [Introduction to TemplateBlade](#blades-introduction-to-templateblade)
    * [TemplateBlade Reference](#blades-templateblade-reference)
    * [Constructor](#blades-constructor)
    * [OnInputSet](#blades-oninputset)
    * [TemplateBlade Advanced Options](#blades-templateblade-advanced-options)
    * [Deep linking](#blades-deep-linking)
    * [Showing a shield / loading status in your blade](#blades-showing-a-shield-loading-status-in-your-blade)
    * [Showing a notification in your blade](#blades-showing-a-notification-in-your-blade)
    * [Pinning your blade](#blades-pinning-your-blade)
    * [Storing settings for your blade](#blades-storing-settings-for-your-blade)
    * [Showing Unauthorized UI in your blade](#blades-showing-unauthorized-ui-in-your-blade)
    * [Showing Notice UI dynamically in your blade](#blades-showing-notice-ui-dynamically-in-your-blade)
* [Introduction to Blade Kinds](#introduction-to-blade-kinds)
    * [Properties Blade](#introduction-to-blade-kinds-properties-blade)
    * [Setting List Blade](#introduction-to-blade-kinds-setting-list-blade)
    * [Introduction to AppBlades](#introduction-to-blade-kinds-introduction-to-appblades)
    * [Introduction to Blades](#introduction-to-blade-kinds-introduction-to-blades)
* [Blade UI](#blade-ui)
    * [Controlling blade UI](#blade-ui-controlling-blade-ui)
* [Blade opening and closing](#blade-opening-and-closing)
    * [Strongly typed blade reference classes](#blade-opening-and-closing-strongly-typed-blade-reference-classes)
    * [Opening blades (Recommended pattern)](#blade-opening-and-closing-opening-blades-recommended-pattern)
    * [Click callbacks](#blade-opening-and-closing-click-callbacks)
        * [Button](#blade-opening-and-closing-click-callbacks-button)
        * [Grid](#blade-opening-and-closing-click-callbacks-grid)
        * [Custom HTML](#blade-opening-and-closing-click-callbacks-custom-html)
        * [Declarative ways to open blades (Not recommended for new scenarios)](#blade-opening-and-closing-click-callbacks-declarative-ways-to-open-blades-not-recommended-for-new-scenarios)
    * [The PDE File](#blade-opening-and-closing-the-pde-file)
    * [Importing the PDE file](#blade-opening-and-closing-importing-the-pde-file)
        * [Blade Parameters](#blade-opening-and-closing-importing-the-pde-file-blade-parameters)
        * [Blade Properties](#blade-opening-and-closing-importing-the-pde-file-blade-properties)
        * [Blade Property Bindings](#blade-opening-and-closing-importing-the-pde-file-blade-property-bindings)
        * [Blade Outputs](#blade-opening-and-closing-importing-the-pde-file-blade-outputs)
        * [Pinning blades](#blade-opening-and-closing-importing-the-pde-file-pinning-blades)
* [Closing blades programatically](#closing-blades-programatically)
    * [Writing code that reacts to a blade being closed](#closing-blades-programatically-writing-code-that-reacts-to-a-blade-being-closed)


<a name="blades"></a>
## Blades

Blades are the main UI container in the portal equivalent to "Windows" or "Pages" in other UX frameworks.

There are different types of blades that you can use:

Type | Description | Use For...
--- | --- | ---
**TemplateBlade** | This is the main and **recommended** authoring model for UI in the portal. The basic idea is that you provide an HTML template with your UI and a ViewModel with the logic that binds to that HTML template.<br/> [TemplateBlade walkthough](portalfx-blades-templateBlade.md) <br/>[Learn more about TemplateBlade](portalfx-blades-templateBlade-reference.md) | Creating any portal blade!
**MenuBlade** | Show a menu at the left of a blade. This blade gets combined by the Shell with the blade that its opened at its right.<br/> [Learn more about MenuBlade](portalfx-blades-menublade.md) | Left side vertical menu
**Fx Blades** | The framework provides a limited set of built-in blades that encapsulate common patterns (like properties, quick start, create forms, etc.). <br/> [Learn more about FxBlades](portalfx-blades-bladeKinds.md) | Properties, Quickstart, Coming Soon, Create  
**AppBlade** | This type of blade provides you an IFrame to host your UI enabling full flexibility and control. In this case you **won't** be able to use Ibiza Fx controls and will be fully responsible for accessibility, theming, and consistency.<br/> [Learn more about AppBlade](portalfx-blades-appblades.md) | Rehost an existing experience or create a UI not supported by the Fx
**Blade with tiles** | This is our **legacy** authoring model. In this case you author your blades as a combination of lenses and parts. Given the complexity associated with this model, we are discouraging extension authors from using it.<br>[Learn more about legacy blades](portalfx-blades-legacy.md) | Legacy


 
<a name="blades-introduction-to-templateblade"></a>
### Introduction to TemplateBlade

TemplateBlade is the recommended way of authoring blades (which are equivalent to windows or pages in other systems) in Ibiza. You can think of a TemplateBlade as an HTML page. In this case, as an author, you provide an HTML template (and optionally a CSS file) and a view-model. 

<a name="blades-introduction-to-templateblade-creating-your-first-templateblade"></a>
#### Creating your first TemplateBlade

1. Add the **blade definition** to your PDL file

```xml
<TemplateBlade
            Name="MyTemplateBlade"
            ViewModel="{ ViewModel Name=MyTemplateBladeViewModel, Module=./ViewModels/MyTemplateBladeViewModel }"
            InitialDisplayState="Maximized"
            Template="{ Html Source='Templates\\MyTemplateBlade.html' }">
</TemplateBlade>
```

1. Create a **ViewModel** TypeScript class. The code snippet shows the view-model for the template blade defined above. It just exposes two observable properties, but more complex behavior can be added when needed.

```js
export class MyTemplateBladeViewModel extends MsPortalFx.ViewModels.Blade {

    public text: KnockoutObservable<string>;
    public url: KnockoutObservable<string>;

    constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: any) {
        super();
        this.title("InfoBox");
        this.subtitle("InfoBox Playground");

        this.text = ko.observable<string>("Go to the Azure Portal");
        this.url = ko.observable<string>("http://portal.azure.com");
    }

    public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
        return null;
    }
}

```

1. Create a **template** for the blade using regular HTML and [knockout.js](http://knockoutjs.com/ "knockout.js"). The ko bindings are bound to public properties in the view-model defined above. 

```html
<div>This is an example template blade that shows a link.</div>

<a data-bind="text: text, attr: { href: url }" target="_blank"></a>
```

<a name="blades-introduction-to-templateblade-using-an-ibiza-control-in-a-template-blade"></a>
#### Using an Ibiza control in a template Blade

The example above uses plain HTML in the template. Ibiza provides an extensive **controls library** that you can use in the HTML template of your blade. In this section we will use the InfoBox control instead of a regular HTML link.

1. Update the link element in the **HTML template** to a control container.

```html
<div>This is an example template blade that shows a link.</div>

<div data-bind="pcControl:infoBox"></div>
```

1. Update the blade view-model to expose (and instatiate) the control view-model.

```javascript
export class MyTemplateBladeViewModel extends MsPortalFx.ViewModels.Blade {

    // view-model for the infoBox control
    public infoBox: MsPortalFx.ViewModels.Controls.InfoBox.BaseViewModel;

    constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: any) {
        super();
        this.title("InfoBox");
        this.subtitle("InfoBox Playground");

        // initialization of the InfoBox view-model
        this.infoBox = new MsPortalFx.ViewModels.Controls.InfoBox.LinkViewModel(container, {
            text: ko.observable<string>('Go to the Azure Portal'),
            image: ko.observable(MsPortalFx.Base.Images.Info()),
            clickableLink: ko.observable(MsPortalFx.ViewModels.Part.createClickableLinkViewModel(ko.observable<string>('http://portal.azure.com'))
        });
    }

    public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
        return null;
    }
}
```

<a name="blades-introduction-to-templateblade-passing-parameters-to-a-templateblade"></a>
#### Passing parameters to a TemplateBlade

Blades can receive input **parameters**. Those parameters are defined as part of the signature for the blade (optional). In this section we will add an "id" input parameter to our template blade.

1. Define the signature of the blade in the PDL definition

```xml
<TemplateBlade
            Name="MyTemplateBlade"
            ViewModel="{ ViewModel Name=MyTemplateBladeViewModel, Module=./ViewModels/MyTemplateBladeViewModel }"
            Template="{ Html Source='Templates\\MyTemplateBlade.html' }">
    <TemplateBlade.Parameters>
        <Parameter Name="id" />
    </TemplateBlade.Parameters>
</TemplateBlade>
```

2. Define the signature in the view-model

```javascript
import Def = ExtensionDefinition.ViewModels.Resource.MyTemplateBladeViewModel;

export class MyTemplateBladeViewModel extends MsPortalFx.ViewModels.Blade {

    // this property is part of the blade signature and is passed into onInputSet
    public id: KnockoutObservable<string>;

    public infoBox: MsPortalFx.ViewModels.Controls.InfoBox.BaseViewModel;

    constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: any) {
        super();
        this.title("InfoBox");
        this.subtitle("InfoBox Playground");

        this.infoBox = new MsPortalFx.ViewModels.Controls.InfoBox.LinkViewModel(container, {
            text: ko.observable<string>('Go to the Azure Portal'),
            image: ko.observable(MsPortalFx.Base.Images.Info()),
            clickableLink: ko.observable(MsPortalFx.ViewModels.Part.createClickableLinkViewModel(ko.observable<string>('http://portal.azure.com'))
        });
    }

    public onInputsSet(inputs: Def.InputsContract): MsPortalFx.Base.Promise {
        // write the input property to the console
        console.log(inputs.id);
        return null;
    }
}
```

<a name="blades-introduction-to-templateblade-adding-commands-to-a-templateblade"></a>
#### Adding commands to a TemplateBlade
Template blades can have **commands** at the top. In order to add the commands, you need to add a toolbar to your TemplateBlade and then define its contents in the TemplateBlade's view-model.

1. Add a **CommmandBar** element to your PDL template
```xml
<TemplateBlade
            Name="MyTemplateBlade"
            ViewModel="{ ViewModel Name=MyTemplateBladeViewModel, Module=./ViewModels/MyTemplateBladeViewModel }"
            Template="{ Html Source='Templates\\MyTemplateBlade.html' }">
    <TemplateBlade.Parameters>
        <Parameter Name="id" />
    </TemplateBlade.Parameters>
    <CommandBar />
</TemplateBlade>
```

1. Instantiate the **CommandBar** in the view-model

```javascript
import Def = ExtensionDefinition.ViewModels.Resource.MyTemplateBladeViewModel;

export class MyTemplateBladeViewModel extends MsPortalFx.ViewModels.Blade {

    public id: KnockoutObservable<string>;
    public infoBox: MsPortalFx.ViewModels.Controls.InfoBox.BaseViewModel;

    // toolbar view-model
    public commandBar: MsPortalFx.ViewModels.ToolbarContract;

    constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: any) {
        super();
        this.title("InfoBox");
        this.subtitle("InfoBox Playground");

        this.infoBox = new MsPortalFx.ViewModels.Controls.InfoBox.LinkViewModel(container, {
            text: ko.observable<string>('Go to the Azure Portal'),
            image: ko.observable(MsPortalFx.Base.Images.Info()),
            clickableLink: ko.observable(MsPortalFx.ViewModels.Part.createClickableLinkViewModel(ko.observable<string>('http://portal.azure.com'))
        });

        // initialize the toolbar
        var button = new Toolbars.OpenLinkButton("http://azure.com");
        button.label("azure.com");
        button.icon(MsPortalFx.Base.Images.Hyperlink());
        this.commandBar = new Toolbars.Toolbar(container);
        this.commandBar.setItems( [ button ] );
    }

    public onInputsSet(inputs: Def.InputsContract): MsPortalFx.Base.Promise {
        return null;
    }
}
```

<a name="blades-introduction-to-templateblade-adding-buttons-at-the-bottom-of-template-blade"></a>
#### Adding buttons at the bottom of template blade

Blades can have buttons that are docked to their bottom area. In this section we will show how to add them to our blade.

1. Add an **ActionBar** element in your PDL template. The ActionBar is a container of buttons that is docked to the bottom of the blade.

```xml
<TemplateBlade
            Name="MyTemplateBlade"
            ViewModel="{ ViewModel Name=MyTemplateBladeViewModel, Module=./ViewModels/MyTemplateBladeViewModel }"
            Template="{ Html Source='Templates\\MyTemplateBlade.html' }">
    <TemplateBlade.Parameters>
        <Parameter Name="id" />
    </TemplateBlade.Parameters>
    <ActionBar ActionBarKind="Generic" />
</TemplateBlade>
```

1. Instantiate the **ActionBar** in the view-model

```javascript
    export class MyTemplateBladeViewModel extends MsPortalFx.ViewModels.Blade {

        public id: KnockoutObservable<string>;
        public infoBox: MsPortalFx.ViewModels.Controls.InfoBox.BaseViewModel;

        // define the actionBar view-demol
        public actionBar: MsPortalFx.ViewModels.ActionBars.GenericActionBar.ViewModel;

        constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: any) {
            super();
            this.title("InfoBox");
            this.subtitle("InfoBox Playground");

            this.infoBox = new MsPortalFx.ViewModels.Controls.InfoBox.LinkViewModel(container, {
                text: this.text,
                image: ko.observable(MsPortalFx.Base.Images.Info()),
                clickableLink: ko.observable(MsPortalFx.ViewModels.Part.createClickableLinkViewModel(this.url))
            });

            // initialize the ActionBar
            this.actionBar = new MsPortalFx.ViewModels.ActionBars.GenericActionBar.ViewModel(container);
            this.actionBar.actionButtonClick = () => {
                console.log("Clicked!!!");
            };
        }

        public onInputsSet(inputs: Def.InputsContract): MsPortalFx.Base.Promise {
            return null;
        }
    }
```

<a name="blades-introduction-to-templateblade-making-your-blade-full-screen"></a>
#### Making your blade full screen

If you want your blade to open using the full screen, just add InitialState="Maximized" to the PDL definition of your blade, as shown below:

```xml
<TemplateBlade
            Name="MyTemplateBlade"
            ViewModel="{ ViewModel Name=MyTemplateBladeViewModel, Module=./ViewModels/MyTemplateBladeViewModel }"
            InitialDisplayState="Maximized"
            Template="{ Html Source='Templates\\MyTemplateBlade.html' }">
</TemplateBlade>
```

<a name="blades-introduction-to-templateblade-showing-a-ui-shield-while-loading-data"></a>
#### Showing a UI shield while loading data

Sometimes you may want to prevent interaction with your blade while initializing it. In those cases, you can add a shield. The shield can be fully transparent or opaque. In all cases, a loading indicator UX is displayed in the blade. The code below shows how to set an opaque filter in your blade.

```javascript
constructor(container: FxCompositionBlade.Container, initialState: any, dataContext: BladesArea.DataContext) {
    super();

    var operation = Q.defer<any>();

    // show the shield while the operation promise is not resolved
    container.operations.add(operation.promise, { blockUi: true, shieldType: MsPortalFx.ViewModels.ShieldType.Opaque });

    // wait for 3 seconds and resolved the promise (which will remove the shield)
    window.setTimeout(() => { operation.resolve(); }, 3000);
}
```
 
<a name="blades-templateblade-reference"></a>
### TemplateBlade Reference

TemplateBlade is the **recommended** way of authoring blades in Ibiza (which are equivalent to windows or pages in other systems) in Ibiza.

Authoring template blades require you to provide a blade definition in PDL, an HTML template, and a ViewModel. In this article we will go through the details of the PDL definition and the capabilities in the ViewModel

You can learn the basics of authoring your first template blade in [this article](portalfx-blade-templateBlade.md)

<a name="blades-templateblade-reference-pdl"></a>
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


<a name="blades-templateblade-reference-viewmodel"></a>
#### ViewModel

All TemplateBlades require a view-model. The sections below explain some of the key aspect to build that view-model.

<a name="blades-templateblade-reference-viewmodel-base-class"></a>
##### Base class

All TemplateBlade extend the base class **MsPortalFx.ViewModels.Blade**.

```javascript
export class MyTemplateBladesBladeViewModel extends MsPortalFx.ViewModels.Blade
```

The base class provides access to basic functionality of the blade like setting the title, subtitle, and icon.

<a name="blades-constructor"></a>
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

<a name="blades-oninputset"></a>
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

<a name="blades-oninputset-defining-the-signature-of-your-blade-inputs-and-outputs"></a>
#### Defining the signature of your blade (inputs and outputs)

You can define the signature of your blade as a set of input and output parameters.

To define those parameters you need to both declare them in your blade PDL definition (using the **TemplateBlade.Parameters** element) and also declare properties in your ViewModel for those parameters.

The parameters are passed to your ViewModel via **onInputSet** (which is described above).

To learn more about blade parameters, [read this article](portalfx-blade-parameters.md)

<a name="blades-oninputset-using-commandbar"></a>
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

<a name="blades-oninputset-advanced-topics"></a>
#### Advanced topics

Template blades can store settings, define how they behave when pinned to the dashboard, and display status, among other advanced capabilities.

 
<a name="blades-templateblade-advanced-options"></a>
### TemplateBlade Advanced Options

<a name="blades-deep-linking"></a>
### Deep linking

"Deep linking" is the feature where the portal URL is updated when a blade is opened (giving the user a URL to directly navigate to the new blade).
By design only certain blades are deep linkable. Blades that aren't deep linkable are those that can't be opened independent of some parent 
blade or part, like blades that return values to their caller. Think of these non-deep linkable blades as web pages in the middle of an website's
check-out experience.

One of the easiest ways to make your blade deep linkable is to mark your TemplateBlade as pinnable. See more information about pinning [here](#pinning-your-blade).

<a name="blades-showing-a-shield-loading-status-in-your-blade"></a>
### Showing a shield / loading status in your blade

Sometimes you may want to prevent interaction with your blade while initializing it. In those cases, you can add a shield. The shield can be fully transparent or opaque. In all cases, a loading indicator UX is displayed in the blade. 

The code snippet below shows an extreme example where a filter is applied on a timer and it changes from opaque to transparent).

```typescript

export class TemplateBladeWithShieldViewModel
extends Blade
implements Def.TemplateBladeWithShieldViewModel.Contract
{
/**
 * The blade's title.
 */
public title: KnockoutObservable<string>;

/**
 * TextBox form field.
 */
public myTextBox: TextBox.ViewModel;

private _timerHandle: number;

constructor(container: FxCompositionBlade.Container, initialState: any, dataContext: BladesArea.DataContext) {
    super();

    this.title(ClientResources.templateBladeWithShield);

    const translucent = MsPortalFx.ViewModels.ShieldType.Translucent;
    const opaque = MsPortalFx.ViewModels.ShieldType.Opaque;
    var isTranslucent = true;

    var op = () => {
        var operation = Q.defer<any>();
        var shieldType = isTranslucent ? translucent : opaque;
        container.operations.add(operation.promise, { blockUi: true, shieldType: shieldType });

        isTranslucent = !isTranslucent;
        window.setTimeout(() => { operation.resolve(); }, 3000);
    };

    op();

    window.setInterval(op, 5000);

    // TextBox
    var textBoxOptions = <TextBox.Options>{
        label: ko.observable(ClientResources.formsSampleBasicTextBox)
    };
    this.myTextBox = new TextBox.ViewModel(container, textBoxOptions);
}

/**
 * Clean up any resources.
 */
public dispose(): void {
    window.clearInterval(this._timerHandle);
}
}

```

<a name="blades-showing-a-notification-in-your-blade"></a>
### Showing a notification in your blade

Blades can display a status bar at their top that contains both text and a background color that can be used to convey information and status to users. For example, when validation fails in a form a red bar with a message can be displayed at the top of the blade.

This area is clickable and can either open a new blade or an external url.

This capability is exposed through the **statusBar** member in the Blade base class (using `this.statusBar(myStatus)` in your blade view-model).

```typescript

if (newContentState !== MsPortalFx.ViewModels.ContentState.None) {
    statusBar = {
        text: newDisplayText,
        state: newContentState,
        selection: stateDetailsBladeSelection,
        onActivated: onActivated
    }
}

this.statusBar(statusBar);

```

<a name="pinning-your-blade"></a>
<a name="blades-pinning-your-blade"></a>
### Pinning your blade

You can mark your blades as able to be pinned to the dashboard by setting `Pinnable="true"` in the TemplateBlade's PDL definition.

By default blades are pinned as button parts to the dashboard.

If you desire to provide a different part represention you need to indicate that in the PDL definition of your blade.

<a name="blades-storing-settings-for-your-blade"></a>
### Storing settings for your blade

You can store settings associated with a blade. Those settings need to be declared both in the PDL definition of your blade and in the view-model.

The code below shows how to define the settings in PDL using the `TemplateBlade.Settings` element.

```xml

<TemplateBlade Name="PdlTemplateBladeWithSettings"
               ViewModel="{ViewModel Name=TemplateBladeWithSettingsViewModel, Module=./Template/ViewModels/TemplateBladeViewModels}"
               Template="{Html Source='Templates\\TemplateBladeWithSettings.html'}">
  <TemplateBlade.Settings>
    <Setting Property="colorSettingValue" />
    <Setting Property="fontSettingValue" />
  </TemplateBlade.Settings>
</TemplateBlade>

```

Once the settings are declared, you need to define them in your view-model too.

```typescript

// These are required by the portal presently.  Re: Part Settings, the Part below works exclusively in terms of
// 'configuration.updateValues' to update settings values and 'onInputsSet(..., settings)' to receive settings values.
public colorSettingValue = ko.observable<BackgroundColor>();
public fontSettingValue = ko.observable<FontStyle>();

```

The settings are retrieved through the blade container.

```typescript

const configuration = container.activateConfiguration<Settings>();
this.configureHotSpot = new HotSpotViewModel(container, {
    supplyBladeReference: () => {
        const bladeRef = new PdlTemplateBladeWithSettingsConfigurationReference<BladeConfiguration, BladeConfiguration>({
            // The Configuration values are sent to the Provider Blade to be edited by the user.
            supplyInitialData: () => {
                return configuration.getValues();
            },

            // The edited Configuration values are returned from the Provider Blade and updated in this Part.
            // Any edits will cause 'onInputsSet' to be called again, since this is the method where the Part receives a new, consistent
            // set of inputs/settings.
            receiveResult: (result) => {
                configuration.updateValues(result);
            }
        });

        bladeRef.metadata = {
            isContextBlade: true
        };

        return bladeRef;
    }
});

```

The settings are also passed to onInputsSet.

```typescript

public onInputsSet(inputs: Def.TemplateBladeWithSettingsViewModel.InputsContract, settings: Def.TemplateBladeWithSettingsViewModel.SettingsContract): MsPortalFx.Base.Promise {
    // Any changes to the  Configuration values (see 'updateValues' above) will cause 'onInputsSet' to be called with the
    // new inputs/settings values.
    this._colorSetting(settings && settings.content && settings.content.colorSettingValue || BackgroundColor.Default);
    this._fontSetting(settings && settings.content && settings.content.fontSettingValue || FontStyle.Default);

    return null;
}

```

<a name="blades-showing-unauthorized-ui-in-your-blade"></a>
### Showing Unauthorized UI in your blade

You can set your blade to Unauthorized UI using the **unauthorized** member of the blade container.

The code below does this statically, but it can also be done dynamically (e.g. based on a condition after data is loaded).

```typescript

constructor(container: MsPortalFx.ViewModels.ContainerContract,
            initialState: any,
            dataContext: BladesArea.DataContext) {
    super();
    this.title(ClientResources.bladeUnauthorized);
    this.subtitle(ClientResources.bladesLensTitle);

    /**
     * This call marks the Blade as unauthorized, which should display a specialized UI.
     */
    container.unauthorized();
}

```

<a name="blades-showing-notice-ui-dynamically-in-your-blade"></a>
### Showing Notice UI dynamically in your blade

You can set your blade to Notice UI using **enableNotice** member of the blade container.

This can be done statically (e.g. in the constructor) or dynamically. In the example below, the blade is set to Notice UI if the **id** input parameter has a given value.

```typescript

public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
    this.title(inputs.id);

    if (inputs.id === "42" || inputs.id === "43") {
        // to simulate the response from service and enable notice accordingly.
        return Q.delay(1000).then(() => {
            this._container.enableNotice({
                noticeTitle: ClientResources.comingSoonTitle,
                noticeHeader: ClientResources.comingSoon.format(inputs.id),
                noticeDescription: ClientResources.comingSoonDescription,
                noticeCallToActionText: ClientResources.comingSoonAction,
                noticeCallToActionUri: ClientResources.microsoftUri,
                noticeImageType: MsPortalFx.ViewModels.Controls.Notice.ImageType.ComingSoon
            });
        });
    } else {
        return null;
    }
}

```
 ## Menu Blade

Menu blade are rendered as a menu on the left side. Each item that is referenced from the menu is rendered using the same header than the menu, resulting in the two blades showing as one (similar to what resource menu blade does).

In summary:

* Menu blade is displayed as a menu (list of items), where each items opens a blade when clicked
* The menu blade is rendered to the left of the screen
* The blades opened from the menu share the chrome with the menu blade (so both blades look as one)

Menu blades are defined in PDL as shown below:

```xml

<MenuBlade
  Name="SampleMenuBlade"
  ViewModel="SampleMenuBlade" />

```

The code below shows how to define a menu blade view-model to open 4 different items:

```typescript

export class SampleMenuBlade extends FxMenuBlade.ViewModel {
    constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: DataContext) {
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
                            return new HubsBladeReferences.MapResourceGroupBladeReference({
                                id: "/subscriptions/sub123/resourcegroups/snowtraxpxz",
                            });
                        },
                    },
                    // Menu item that demonstrates opening of a parameter collector blade for a create scenario
                    {
                        id: "createengine",
                        displayText: ClientResources.createEngine,
                        icon: null,
                        supplyBladeReference: () => {
                            return new BladeReferences.CreateEngineV3BladeReference({
                                supplyInitialData: () => {
                                    return {
                                        model: "Azure Engine 3.0",
                                    };
                                },
                                supplyProviderConfig: () => {
                                    return {
                                        provisioningConfig: {
                                            provisioningEnabled: true,
                                            galleryCreateOptions: CreateEngine.galleryCreateOptions,
                                            startboardProvisioningInfo: CreateEngine.startboardProvisioningInfo,
                                        },
                                        createEngineOptions: CreateEngine.createEngineOptions,
                                    };
                                },
                                receiveResult: result => {
                                    // Intentionally blank. The launched blade is responsible for the create operation.
                                }
                            });
                        },
                    },
                    // Menu item that demonstrates opting out of full width.
                    {
                        id: "fullwidthoptout",
                        displayText: ClientResources.SampleMenuBlade.optOut,
                        icon: null,
                        supplyBladeReference: () => {
                            return new BladeReferences.BladeWidthSmallBladeReference({bladeTitle: ClientResources.SampleMenuBlade.optOut});
                        },
                    },
                    // Menu item that demonstrates a blade that can have activated width.
                    {
                    id: "activationSample",
                        displayText: ClientResources.ActivationStyleBlade.title,
                        icon: null,
                        supplyBladeReference: () => {
                            return new BladeReferences.BladeWithActivationStyleReference();
                        },
                    }
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
                        supplyBladeReference: () => new BladeReferences.UnauthorizedBladeReference(),
                    },
                    {
                        id: "bladeWithSummary",
                        displayText: resourceName,
                        icon: null,
                        supplyBladeReference: () => new BladeReferences.EngineBladeReference({
                            id: `/subscriptions/sub123/resourcegroups/snowtraxpxz/providers/Providers.Test/statefulIbizaEngines/${resourceName}`,
                        }),
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
 
 
<a name="introduction-to-blade-kinds"></a>
## Introduction to Blade Kinds
Blade Kinds are common implementations of Blade experience which offer consistent UI and are easily implemented. Blade Kinds provide a simplified programming model with a closed UI. 

All you need to provide is the ViewModel. Advantages you receive beyond is simplicity; when the Blade Kinds are updated, you can use the updates and the layout without having to change your implementation.

Defining a Blade using a Blade Kind in PDL is a simplified version of the typical Blade PDL. All you need is to define multiple view models, typically a view model for the blade and a view model for the part.

```xml
<azurefx:QuickStartBlade ViewModel="" PartViewModel=""/>
```

To learn more about each of the Blade Kinds, start with the following topics:

- [QuickStart Blade](portalfx-blades-bladeKinds-quickStart.md)
- [Properties Blade](portalfx-blades-bladeKinds-properties.md)
- [Notice Blade](portalfx-blades-bladeKinds-notice.md)
- [Setting List Blade](portalfx-blades-bladeKinds-settingList.md)

 ### QuickStart Blade
The QuickStart blade that provides a Blade which gives users a convenient way to learn how to use your service. Every services should have a QuickStart Blade.

![Demo](../media/portalfx-bladeKinds/QuickStartBlade.PNG)

Defining a QuickStart Blade requires only a view model to define the blade and a view model to define the part.

The PDL to define a QuickStart Blade:

`\Client\Blades\BladeKind\BladeKinds.pdl`

```xml
<azurefx:QuickStartBlade Name="QuickStartBlade"
                        ViewModel="{ViewModel Name=QuickStartBladeViewModel, Module=./BladeKind/ViewModels/BladeKindsViewModels}"
                        PartViewModel="{ViewModel Name=InfoListPartViewModel, Module=./BladeKind/ViewModels/InfoListPartViewModel}"
                        Parameter="info"/>
```
The TypeScript view model to define the Blade view model:

`\Client\Blades\BladeKind\ViewModels\BladeKindsViewModels.ts`

```ts
/**
 * The quick start blade view model for blade kinds.
 */
export class QuickStartBladeViewModel extends MsPortalFx.ViewModels.Blade {
    /**
     * Blade view model constructor.
     *
     * @param container Object representing the blade in the shell.
     * @param initialState Bag of properties saved to user settings via viewState.
     * @param dataContext Long lived data access object passed into all view models in the current area.
     */
    constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: BladesArea.DataContext) {
        super();
        this.title(ClientResources.quickStartBladeTitle);
        this.subtitle(ClientResources.bladesLensTitle);
        this.icon(MsPortalFx.Base.Images.Polychromatic.Info());
    }

    /**
     * Invoked when the Part's inputs change.
     */
    public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
        this.subtitle(inputs.info.text);
        return null; // No need to load anything
    }
}
```

The TypeScript view model to define the part view model:


`\Client\Blades\BladeKind\ViewModels\InfoListPartViewModel.ts`


```ts
/**
 * This sample uses the base class implementation. You can also implement the
 * interface MsPortalFx.ViewModels.Parts.InfoList.ViewModel.
 */
export class InfoListPartViewModel extends MsPortalFx.ViewModels.Parts.InfoList.ViewModel {
    private _text: KnockoutObservableBase<string>;
    private _bladeWithInputs: KnockoutObservableBase<MsPortalFx.ViewModels.DynamicBladeSelection>;

    /**
     * Initialize the part.
     */
    constructor(container: MsPortalFx.ViewModels.PartContainerContract, initialState: any, dataContext: BladesArea.DataContext) {
        super(initialState);

        this._text = ko.observable<string>("");

        var thirdBladeDisplayValue = ko.pureComputed(() => {
            return "{0} {1}".format(ExtensionDefinition.BladeNames.thirdBlade + ClientResources.sendingValue, this._text());
        });

        var infoListDesc1 = ko.pureComputed(() => {
            return "{0} - {1}".format(this._text(), ClientResources.infoListDesc1);
        });

        this._bladeWithInputs = ko.observable<MsPortalFx.ViewModels.DynamicBladeSelection>({
            detailBlade: ExtensionDefinition.BladeNames.thirdBlade,
            detailBladeInputs: {}
        });

        // add a section to open an external webpage.
        this.addSection(
            this._text,
            infoListDesc1,
            ClientResources.htmlSiteMSDNAddress,
            MsPortalFx.Base.Images.HeartPulse());

        // add a section to open a blade.
        this.addSection(
            ExtensionDefinition.BladeNames.firstBlade,
            ClientResources.infoListDesc3, {
                detailBlade: ExtensionDefinition.BladeNames.firstBlade,
                detailBladeInputs: {}
            }, MsPortalFx.Base.Images.Polychromatic.Browser());

        // add a secion that can have a list of links.
        this.addSection(
            ClientResources.infoListTitle2,
            ClientResources.infoListDesc2,
            [
                new Vm.Parts.InfoList.Link(
                    ClientResources.htmlSiteMicrosoftName,
                    ClientResources.htmlSiteMicrosoftAddress
                    ),
                new Vm.Parts.InfoList.Link(
                    ClientResources.targetBlade2Title,
                    {
                        detailBlade: ExtensionDefinition.BladeNames.secondBlade,
                        detailBladeInputs: {}
                    }
                    ),
                new Vm.Parts.InfoList.Link(
                    ClientResources.htmlSiteBingName,
                    ClientResources.htmlSiteBingAddress
                    ),
                new Vm.Parts.InfoList.Link(
                    thirdBladeDisplayValue,
                    this._bladeWithInputs
                    )
            ]);
    }

    /**
     * All sections should be added in the constructor, and should be updated via observables.
     */
    public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
        var text = inputs.info.text;

        this._text(text);

        // update the blade binding with inputs value
        this._bladeWithInputs({
            detailBlade: ExtensionDefinition.BladeNames.thirdBlade,
            detailBladeInputs: {
                id: text
            }
        });


        return null; // No need to load anything
    }
}
```

 
<a name="introduction-to-blade-kinds-properties-blade"></a>
### Properties Blade

The Properties blade that provides a Blade which gives users a convenient way access the properties of your service. 

![Demo](../media/portalfx-bladeKinds/PropertiesBlade.PNG)

Defining a Properties Blade requires only a view model to define the blade and a view model to define the part.

The PDL to define a Properties Blade:

`\Client\Blades\BladeKind\BladeKinds.pdl`

```xml
  <azurefx:PropertiesBlade Name="PropertiesBlade"
                           ViewModel="{ViewModel Name=PropertiesBladeViewModel, Module=./BladeKind/ViewModels/BladeKindsViewModels}"
                           PartViewModel="{ViewModel Name=PropertiesPartViewModel, Module=./BladeKind/ViewModels/PropertiesPartViewModel}"
                           Parameter="info"/>
```
The TypeScript view model to define the Blade view model:

`\Client\Blades\BladeKind\ViewModels\BladeKindsViewModels.ts`

```ts
/**
 * The properties blade view model for blade kinds.
 */
export class PropertiesBladeViewModel extends MsPortalFx.ViewModels.Blade {
    /**
     * Blade view model constructor.
     *
     * @param container Object representing the blade in the shell.
     * @param initialState Bag of properties saved to user settings via viewState.
     * @param dataContext Long lived data access object passed into all view models in the current area.
     */
    constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: BladesArea.DataContext) {
        super();
        this.title(ClientResources.propertiesBladeTitle);
        this.icon(MsPortalFx.Base.Images.Polychromatic.Info());
    }

    /**
     * Invoked when the Part's inputs change.
     */
    public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
        this.subtitle(inputs.info.text);
        return null; // No need to load anything
    }
}
```

The TypeScript view model to define the part view model:


`\Client\Blades\BladeKind\ViewModels\PropertiesPartViewModel.ts`


```ts
/**
 * Properties part view model.
 */
export class PropertiesPartViewModel extends MsPortalFx.ViewModels.Parts.Properties.ViewModel {
    private _text: KnockoutObservableBase<string>;
    private _bladeWithInputs: KnockoutObservableBase<MsPortalFx.ViewModels.DynamicBladeSelection>;

    constructor(container: MsPortalFx.ViewModels.PartContainerContract, initialState: any, dataContext: BladesArea.DataContext) {
        super(initialState);

        var longTextProperty = new MsPortalFx.ViewModels.Parts.Properties.TextProperty(ClientResources.textPropertyLabel, ko.observable<string>(ClientResources.textPropertyValue));
        longTextProperty.wrappable(true);

        this._text = ko.observable<string>("");

        this.addProperty(longTextProperty);
        this.addProperty(new MsPortalFx.ViewModels.Parts.Properties.LinkProperty(ClientResources.linkPropertyLabel, ClientResources.microsoftUri, ClientResources.linkPropertyValue));

        this.addProperty(new MsPortalFx.ViewModels.Parts.Properties.OpenBladeProperty(
            ExtensionDefinition.BladeNames.firstBlade,
            ExtensionDefinition.BladeNames.firstBlade, {
                detailBlade: ExtensionDefinition.BladeNames.firstBlade,
                detailBladeInputs: {}
            }));

        this.addProperty(new MsPortalFx.ViewModels.Parts.Properties.CopyFieldProperty(ClientResources.copyFieldPropertyLabel, this._text));

        this.addProperty(new MsPortalFx.ViewModels.Parts.Properties.OpenBladeProperty(
            ExtensionDefinition.BladeNames.secondBlade,
            ExtensionDefinition.BladeNames.secondBlade, {
                detailBlade: ExtensionDefinition.BladeNames.secondBlade,
                detailBladeInputs: {}
            }));

        this.addProperty(new MsPortalFx.ViewModels.Parts.Properties.CallbackProperty(ClientResources.callbackPropertyLabel, ClientResources.callbackPropertyValue, () => {
            alert(this._text());
        }));

        this._bladeWithInputs = ko.observable<MsPortalFx.ViewModels.DynamicBladeSelection>({
            detailBlade: ExtensionDefinition.BladeNames.thirdBlade,
            detailBladeInputs: {}
        });

        var thirdBladeDisplayValue = ko.pureComputed(() => {
            return ExtensionDefinition.BladeNames.thirdBlade + ClientResources.sendingValue + this._text();
        });

        this.addProperty(new MsPortalFx.ViewModels.Parts.Properties.OpenBladeProperty(
            ExtensionDefinition.BladeNames.thirdBlade,
            thirdBladeDisplayValue,
            this._bladeWithInputs
        ));

        var multiLinks = ko.observableArray<MsPortalFx.ViewModels.Parts.Properties.Link>([
            {
                text: ClientResources.htmlSiteMicrosoftName,
                uri: ClientResources.htmlSiteMicrosoftAddress
            },
            {
                text: ClientResources.htmlSiteBingName,
                uri: ClientResources.htmlSiteBingAddress
            },
            {
                text: ClientResources.htmlSiteMSDNName,
                uri: ClientResources.htmlSiteMSDNAddress
            }
        ]);

        this.addProperty(new MsPortalFx.ViewModels.Parts.Properties.MultiLinksProperty(ClientResources.multiLinksPropertyLabel, multiLinks));
    }

    /**
     * All properties should be added in the constructor, and use observables to update properties.
     */
    public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
        var text = inputs.info.text;

        this._text(text);

        // update the blade binding with inputs value
        this._bladeWithInputs({
            detailBlade: ExtensionDefinition.BladeNames.thirdBlade,
            detailBladeInputs: {
                id: text
            }
        });

        return null;
    }
}

```

 ### Notice Blade
The Notice blade that provides a Blade which gives you a convenient way to display a announcements to your users, such as coming soon features. 

![Demo](../media/portalfx-bladeKinds/NoticeBlade.PNG)

Defining a notice Blade requires only a view model to define the blade and a view model to define the part.

The PDL to define a Properties Blade:

`\Client\Blades\BladeKind\BladeKinds.pdl`

```xml
  <azurefx:NoticeBlade Name="NoticeBlade"
                       ViewModel="{ViewModel Name=NoticeBladeViewModel, Module=./BladeKind/ViewModels/BladeKindsViewModels}"
                       PartViewModel="{ViewModel Name=NoticePartViewModel, Module=./BladeKind/ViewModels/NoticePartViewModel}"
                       Parameter="info"/>
```
The TypeScript view model to define the Blade view model:

`\Client\Blades\BladeKind\ViewModels\BladeKindsViewModels.ts`

```ts
/**
 * The notice blade view model for blade kinds.
 */
export class NoticeBladeViewModel extends MsPortalFx.ViewModels.Blade {
    /**
     * Blade view model constructor.
     *
     * @param container Object representing the blade in the shell.
     * @param initialState Bag of properties saved to user settings via viewState.
     * @param dataContext Long lived data access object passed into all view models in the current area.
     */
    constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: BladesArea.DataContext) {
        super();
        this.title(ClientResources.noticeBladeTitle);
    }

    /**
     * Invoked when the Part's inputs change.
     */
    public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
        this.subtitle(inputs.info.text);
        return null; // No need to load anything
    }
}
```

The TypeScript view model to define the part view model:

`\Client\Blades\BladeKind\ViewModels\NoticePartViewModel.ts`

```ts
/**
 * Notice part view model.
 */
export class NoticePartViewModel extends MsPortalFx.ViewModels.Controls.Notice.ViewModel {
    /**
     * View model constructor.
     *
     * @param container Object representing the part in the shell.
     * @param initialState Bag of properties saved to user settings via viewState.
     * @param dataContext Long lived data access object passed into all view models in the current area.
     */
    constructor(container: MsPortalFx.ViewModels.PartContainerContract, initialState: any, dataContext: BladesArea.DataContext) {
        super();

        this.title(ClientResources.comingSoonTitle);
        this.description(ClientResources.comingSoonDescription);
        this.callToActionText(ClientResources.comingSoonAction);
        this.callToActionUri(ClientResources.microsoftUri);
        this.imageType(MsPortalFx.ViewModels.Controls.Notice.ImageType.ComingSoon);
    }

    /**
     * Update header based on service name.
     *
     * @param inputs Collection of inputs passed from the shell.
     * @returns A promise that needs to be resolved when data loading is complete.
     */
    public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
        var serviceName = inputs.info.serviceName,
            header = ClientResources.comingSoon.format(serviceName);

        this.header(header);

        return null;
    }
}
```

 
<a name="introduction-to-blade-kinds-setting-list-blade"></a>
### Setting List Blade

The Setting List Blade that provides a Blade which gives you a convenient way to display give your users access to a list of your service's settings.

![Demo](../media/portalfx-bladeKinds/SettingListBlade.PNG)

Defining a Settings Blade requires only a view model to define the blade and a view model to define the part.

The PDL to define a Settings Blade:

`\Client\Blades\BladeKind\BladeKinds.pdl`

```xml
  <azurefx:SettingListV2Blade Name="SettingListBlade"
                            ViewModel="{ViewModel Name=SettingListBladeViewModel, Module=./BladeKind/ViewModels/BladeKindsViewModels}"
                            PartViewModel="{ViewModel Name=SettingListPartViewModel, Module=./BladeKind/ViewModels/SettingListPartViewModel}"
                            Parameter="id"/>
```

The TypeScript view model to define the Blade view model:

`\Client\Blades\BladeKind\ViewModels\BladeKindsViewModels.ts`

```ts
/**
 * The setting list blade view model for blade kinds.
 */
export class SettingListBladeViewModel extends MsPortalFx.ViewModels.Blade {
    /**
     * Blade view model constructor.
     *
     * @param container Object representing the blade in the shell.
     * @param initialState Bag of properties saved to user settings via viewState.
     * @param dataContext Long lived data access object passed into all view models in the current area.
     */
    constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: BladesArea.DataContext) {
        super();
        this.title(ClientResources.settingListBlade);
    }

    public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
        this.subtitle(inputs.id);
        return null; // No need to load anything
    }
}
```

The TypeScript view model to define the part view model:

`\Client\Blades\BladeKind\ViewModels\SettingListPartViewModel.ts`

```ts
/**
 * The view model of the setting list part.
 */
export class SettingListPartViewModel extends MsPortalFx.ViewModels.Parts.SettingList.ViewModelV2 {
    private _propertySettingBladeInputs: KnockoutObservableBase<any>;
    private _keySettingBladeInputs: KnockoutObservableBase<any>;

    constructor(container: MsPortalFx.ViewModels.PartContainerContract, initialState: any, dataContext: BladesArea.DataContext) {
        this._propertySettingBladeInputs = ko.observable({});
        this._keySettingBladeInputs = ko.observable({});

         super(container, initialState, this._getSettings(container),
            {
             enableRbac: true,
             enableTags: true,
             groupable: true
            });
    }

    public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
        var id = inputs.id;
        this.resourceId(id);

        this._propertySettingBladeInputs({ id: id });
        this._keySettingBladeInputs({ id: id });

        return null; // No need to load anything
    }

    private _getSettings(): MsPortalFx.ViewModels.Parts.SettingList.Setting[] {
        var propertySetting = new MsPortalFx.ViewModels.Parts.SettingList.Setting("property", ExtensionDefinition.BladeNames.propertySettingBlade, this._propertySettingBladeInputs),
            keySetting = new MsPortalFx.ViewModels.Parts.SettingList.Setting("key", ExtensionDefinition.BladeNames.keySettingBlade, this._keySettingBladeInputs);

        propertySetting.displayText(ClientResources.propertySetting);
        propertySetting.icon(MsPortalFx.Base.Images.Polychromatic.Controls());
        propertySetting.keywords([ClientResources.user]);

        keySetting.displayText(ClientResources.keySetting);
        keySetting.icon(MsPortalFx.Base.Images.Polychromatic.Key());

        return [propertySetting, keySetting];
    }
}
```

<a name="introduction-to-blade-kinds-setting-list-blade-framework-settings"></a>
#### Framework settings

One of the goals of the Azure portal is standardizing key interaction patterns across different types of resources so customers can learn them once and apply them everywhere. There a few setting items which are consistent across most resources, to make that process easier the framework will automatically add certain settings but also allow optting in for any which we don't automatically add. All the Framework added settings can always be opted out, by specifying the opt in option as "false". Currently their are only two settings, RBAC and Audit logs (Events), which are added automatically. They are only added if a valid resource id has been specified within the "resourceId()" property on the settingsList viewmodel. The best way to set this is from within the onInputsSet call.

```ts
export class SettingListPartViewModel extends MsPortalFx.ViewModels.Parts.SettingList.ViewModelV2 {
    ...

     public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
        var id = inputs.id;
        this.resourceId(id);

        return null
    }
}
```

<a name="introduction-to-blade-kinds-setting-list-blade-tags-rbac"></a>
#### Tags/RBAC

[Tags] [/documentation/articles/portalfx-tags/] and RBAC (Users) are the most common settings although we don't automatically add Tags, its extremely easy to opt in. We are looking to automatically add Tags in the future, for now if your resource supports tagging please opt in. To opt in set the following in the options parameter of the super call to the SettingsList viewmodel.

```ts
export class SettingListPartViewModel extends MsPortalFx.ViewModels.Parts.SettingList.ViewModelV2 {
    constructor(container: MsPortalFx.ViewModels.PartContainerContract, initialState: any, dataContext: BladesArea.DataContext) {
         super(container, initialState, this._getSettings(container),
            {
             enableRbac: true,
             enableTags: true,
             groupable: true
            });
    }
}
```

<a name="introduction-to-blade-kinds-setting-list-blade-support-settings"></a>
#### Support settings

Troubleshooting and support are one of these key experiences. We'd like to provide customers with a consistent gesture so for every resource they can assess its health, check the audit logs, get troubleshooting information, or open a support ticket. Every resource should on-board with Support and opt in to the support settings, see the [on-boarding process] [supportOnboarding]. For any questions regarding the process please reach out to the support adoption alias <AzSFAdoption@microsoft.com>

Enabling the support settings takes slightly more effort due to coordination and validation required with the support extension. For each of the settings you first need to opt in following the same pattern as before through the options parameter within the super call to the SettingsList ViewModel.

```ts
export class SettingListPartViewModel extends MsPortalFx.ViewModels.Parts.SettingList.ViewModelV2 {
    constructor(container: MsPortalFx.ViewModels.PartContainerContract, initialState: any, dataContext: BladesArea.DataContext) {
         super(container, initialState, this._getSettings(container),
            {
             enableSupportHelpRequest: true,
             enableSupportTroubleshoot: true,
             enableSupportResourceHealth: true,
             enableSupportEventLogs: true,
             groupable: true
            });
    }
}
```

Then to test it use the following extension side feature flags, depending on which settings you are testing, **please ensure your extension name is in lower case.**

* ?<extensionname>_troubleshootsettingsenabled=true
* ?<extensionname>_healthsettingsenabled=true
* ?<extensionname>_requestsettingsenabled=true

*Example: ?microsoft_azure_classic_compute_requestsettingsenabled=true*

Next steps:

* [Onboard to support](https://microsoft.sharepoint.com/teams/WAG/EngSys/Supportability/_layouts/15/WopiFrame.aspx?sourcedoc={7210704b-64db-489b-9143-093e020e75b4}&action=edit&wd=target%28%2F%2FCustomerEnablement.one%7Cf42af409-12ab-4ae0-ba49-af361116063b%2FAt%20How-to%20for%20PGs%7C92cd2c56-c400-4a6d-a455-63ef92290ae9%2F%29)



[part]: ../media/portalfx-bladeKinds/BladeKindsIntro.png
 
<a name="introduction-to-blade-kinds-introduction-to-appblades"></a>
### Introduction to AppBlades

AppBlade provides you with an IFrame where you can render your content, resulting in maximum flexibility at the expense of additional developer responsibilities.

We recommend consider using AppBlade when:

* You have an existing experience that you want to bring to Ibiza without having to re-implement it
* You want to implement user interactions and/or experiences that are not supported by the components in Ibiza framework
* You have an experience that needs to be re-hosted in several environments

When using AppBlade you are responsible for:

* **Accessibility**: you are reponsible for making your blade accessible up to Microsoft standards
* **Theming**: you are responsible for responding to theming behavior
* **Consistent Look & feel**: you are responsible for coming up with a visual design that is consistent with the rest of Ibiza
* **Controls**: since you can't use Ibiza Fx controls you need to build your own controls or use available alternatives 

<a name="introduction-to-blade-kinds-introduction-to-appblades-creating-your-first-appblade"></a>
#### Creating your first AppBlade

1. Add the **blade definition** to your PDL file

    ```xml
    <AppBlade Name="MicrosoftDocs"
            ViewModel="{ViewModel Name=MicrosoftDocsBladeViewModel, Module=./Summary/ViewModels/MicrosoftDocsBladeViewModel}"
            InitialDisplayState="Maximized">
    </AppBlade>
    ```

1. Create a **ViewModel** TypeScript class. The code snippet below shows the view-model for the template blade defined above. In this case, it is showing the docs.microsoft.azure.com into an AppBlade in Ibiza portal.

    ```javascript
    export class MicrosoftDocsBladeViewModel extends MsPortalFx.ViewModels.AppBlade.ViewModel {
        constructor(container: FxViewModels.ContainerContract, initialState: any, dataContext: any) {

            super(container, {
                source: 'https://docs.microsoft.com/'
            });

            this.title("docs.microsoft.com");
        }
    }
    ```

The source location for the contents of the IFrame is passed to the container using the **source** property in the **FxBlade.Options** (second parameter in the code snippet above).

<a name="introduction-to-blade-kinds-introduction-to-appblades-using-the-ibiza-command-bar-in-your-appblade"></a>
#### Using the Ibiza command bar in your AppBlade

You can use the Ibiza command bar in your AppBlade and leverage the framework support while getting some consistency in the experience. In this case, you need to add a **CommandBar** to your PDL and configure it in your **ViewModel**. This is **optional**.

Using the CommandBar is the same than in any other existing scenarios. The code snippet below shows an example of setting a CommandBar in your AppBlade view-model.

```typescript

// You can add command bars to app blades.
this.commandBar = new Toolbar(container);
this.commandBar.setItems([this._openLinkButton()]);

```

```typescript

private _openLinkButton(): Toolbars.OpenLinkButton {
    var button = new Toolbars.OpenLinkButton("http://microsoft.com");

    button.label(ClientResources.ToolbarButton.openLink);
    button.icon(MsPortalFx.Base.Images.Hyperlink());

    return button;
}

```


<a name="introduction-to-blade-kinds-introduction-to-appblades-exchanging-messages-between-your-iframe-and-the-ibiza-fx"></a>
#### Exchanging messages between your IFrame and the Ibiza Fx

The AppBlade ViewModel is hosted in the same hidden IFrame where your extension is loaded. The contents of the AppBlade are hosted in another IFrame that is visible in the screen.

Both IFrames (your UI and your Ibiza extension) can communicate via **postMessage**.

The following sections demonstrate how to exchange messages between both IFrames

<a name="introduction-to-blade-kinds-introduction-to-appblades-sending-and-receiving-messages-from-ibiza"></a>
#### Sending and Receiving messages from Ibiza

<a name="introduction-to-blade-kinds-introduction-to-appblades-sending-and-receiving-messages-from-ibiza-listen-to-a-message"></a>
##### Listen to a message

You can listen to messages using the **on** method in the **AppBlade** view-model.

The code snippet below demonstrates how to listen to a message from your IFrame in your Ibiza extension view-model.

```typescript

// This is an example of how to listen for messages from your iframe.
this.on("getAuthToken", () => {
    // This is an example of how to post a message back to your iframe.
    MsPortalFx.Base.Security.getAuthorizationToken().then((token) => {
        let header = token.header;
        let message = new FxAppBlade.Message("getAuthTokenResponse", header);

        this.postMessage(message);
    });
});

```

<a name="introduction-to-blade-kinds-introduction-to-appblades-post-a-message"></a>
#### Post a message

You can post messages to you IFrame using the **postMessage** method in the **AppBlade** view-model.

The code snippet below demonstrates how to send a message from your Ibiza extension view-model to your IFrame.

```typescript

// This is another example of how to post a message back to your iframe.
this.postMessage(new FxAppBlade.Message("favoriteAnimal", "porcupine"));

```

<a name="introduction-to-blade-kinds-introduction-to-appblades-post-theming-information"></a>
#### Post theming information

When using a template blade, you are responsible for implementing theming in your IFrame. The code snippet below demonstrates how to pass the current selected theme by the user to your IFrame using **postMessage** (which is the same technique used in the section above).

```typescript

// Get theme class and pass it to App Blade
MsPortalFx.Services.getSettings().then(settings => {
    let theme = settings["fxs-theme"];
    theme.subscribe(container, theme =>
        this.postMessage(new FxAppBlade.Message("theme", theme.name))
    ).callback(theme());
});

```

<a name="introduction-to-blade-kinds-introduction-to-appblades-sending-and-receiving-messages-from-your-iframe"></a>
#### Sending and Receiving messages from your IFrame

<a name="introduction-to-blade-kinds-introduction-to-appblades-sending-and-receiving-messages-from-your-iframe-listen-to-a-message"></a>
##### Listen to a message

You can listen to incoming messages by adding an event listener to your window, as shown in the snippet below:

```xml

window.addEventListener("message", receiveMessage, false);

```

Then, provide a handler for the incoming message. In the example below, the **receiveMessage** method handles three different incoming message types (including reacting to theming changes in the portal) 

```xml

// The message format is { signature: "pcIframe", data: "your data here" }
function receiveMessage(event) {
    // It is critical that we only allow trusted messages through. Any domain can send a message event and manipulate the html.
    // It is recommended that you enable the commented out check below to get the portal URL that is loading the extension.
    // if (event.origin.toLowerCase() !== trustedParentOrigin) {
    //     return;
    // }

    if (event.data["signature"] !== "FxAppBlade") {
        return;
    }
    var data = event.data["data"];
    var kind = event.data["kind"];

    if (!data) {
        return;
    }

    var postMessageContainer = document.getElementById("post-message-container");
    var divElement = document.createElement("div");
    divElement.className = "post-message";

    var message;

    switch (kind) {
        case "getAuthTokenResponse":
            message = data;
            divElement.style.background = "yellow";
            break;
        case "favoriteAnimal":
            message = "My favorite animal is: " + data;
            divElement.style.background = "pink";
            break;
        case "theme":
            message = "The current theme is: " + data;
            divElement.style.background = "lightblue";
            break;
    }

    var textNode = document.createTextNode(message);

    divElement.appendChild(textNode);
    postMessageContainer.appendChild(divElement);
}

```

<a name="introduction-to-blade-kinds-introduction-to-appblades-sending-and-receiving-messages-from-your-iframe-post-a-message"></a>
##### Post a message

You can post messages back to the portal using **postMessage**. There is a required message that your IFrame needs to send back to the portal to indicate that it is ready to receive messages.

The code snippet below shows how to post that first required message and also how to send another additional message.

```xml

if (window.parent !== window) {
    // This is a required message. It tells the shell that your iframe is ready to receive messages.
    window.parent.postMessage({
        signature: "FxAppBlade",
        kind: "ready"
    }, shellSrc);

    // This is an example of a post message.
    window.parent.postMessage({
        signature: "FxAppBlade",
        kind: "getAuthToken"
    }, shellSrc);
}

```

 
<a name="introduction-to-blade-kinds-introduction-to-blades"></a>
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




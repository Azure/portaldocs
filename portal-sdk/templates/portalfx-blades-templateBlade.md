<properties title="" pageTitle="Blades" description="" authors="adamabdelhamed" />

### Introduction to TemplateBlade

TemplateBlade is the recommended way of authoring blades (which are equivalent to windows or pages in other systems) in Ibiza. You can think of a TemplateBlade as an HTML page. In this case, as an author, you provide an HTML template (and optionally a CSS file) and a view-model. 

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
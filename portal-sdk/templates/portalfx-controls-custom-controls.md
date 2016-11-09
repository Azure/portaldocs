## Custom Controls (preview)

Basically custom controls feature:
- Enable partners to use custom controls along with ibiza framework controls.
- Enable partners to fulfil their custom controls need without taking a dependency on Ibiza team
- Enable partners to use Ibiza to write targeted forms controls
- Enable partners use controls written using other frameworks in their extension
- Enable partners to share controls across extensions

### When to use Custom Controls



### How to use custom controls?

Building a custom custom controls can be broken into 2 parts

#### Implement Custom Controls contract in your controls

```ts
  /**
     * Defines the contract for extension authored custom control.
     */
    export interface Contract<TOptions> {
        /**
         * Context properties that will be setup by shell for extension authored custom control.
         * Context object will be set before onInitialize method is called.
         */
        context: Context<TOptions>;

        /**
         * Initialize method will be called by the shell after setting up the context properties on the custom control.
         * Extension author should resolve the promise once the data is fetched and control is ready to render.
         * In the event that control can be revealed with partial data, call revealContent on the container object present in the context.
         */
        onInitialize(): Q.Promise<any>;

        /**
         * Optionally pass in a dispose method which will be invoked when the control is disposed.
         */
        dispose?(): void;
    }
```

#### Define options contract for Custom Controls 

```ts    
    declare module SamplesExtension.BreadCrumb {
    
        export interface BreadCrumb {
            /**
            * Name of the BreadCrumb item. 
            */
            name: string;
        }
        export interface Options {
            breadCrumbs?: KnockoutObservableArray<BreadCrumb>;
            onBreadCrumbClick?: (breadCrumb: BreadCrumb) => void;
        }
    }
```

#### Define control PDL 

 - Name of the control
 - Implementation Module it resides in
 - Options Contract 
 - Share your control?
 - Form field?
 - Style Sheets

```xml
<Definition xmlns="http://schemas.microsoft.com/aux/2013/pdl"
              Area="Preview">
 
     <!--Set Export="true" only if extension author wants to share the control and allow another partner extension to consume this control.-->
     <Control
         Name="BreadCrumb"
         ModuleId="Preview/CustomControls/BreadCrumb/BreadCrumb"
         OptionsContract="SamplesExtension.BreadCrumb.Options"
         Export="true">
 
         <StyleSheet Source="{Css Source='./BreadCrumb.css'}" />
     </Control>
</Definition>
```
  
 
### Consuming Custom Control

Once you have built your custom control, you can consume the control in yur experienc in 3 steps

#### Define your template blade
You need to identify the blade that carries custom controls by setting custom control property to true as shown below:

```xml
<Definition xmlns="http://schemas.microsoft.com/aux/2013/pdl"
            Area="Preview">

<TemplateBlade Name="FileExplorerSampleInstructions"
                ViewModel="{ViewModel Name=FileExplorerSampleBladeViewModel, Module=../Preview/CustomControlUsage/FileExplorerSample/ViewModels/FileExplorerSampleViewModels}"
                Template="{Html Source='Templates\\FileExplorerSampleInstructions.html'}"
                HasCustomControls="true" />
</Definition>
```

#### Refer your custom control in template

You can refer your custom control just like normal pcControl reference.

```xml
<div data-bind='pcControl: breadCrumb'></div>
<div data-bind='pcControl: fileExplorerVM'></div>
```

#### In blade ViewModel use control reference to create control view model

```ts
    this.breadCrumb = ControlReferences.BreadCrumb.createViewModel(container, {
            breadCrumbs: ko.observableArray(SampleData.getBreadCrumbs(SampleData.srcFolder)),
            onBreadCrumbClick: (breadCrumb) => {
                updateFileExplorerItems(breadCrumb.name);
            }
    });
```

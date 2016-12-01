## Custom controls

### IMPORTANT NOTE:
- This feature is not yet enabled in production environment i.e. you cannot go to production as of now with custom control on your blade. This will enabled soon however, so you can start implmentation work now.
- As this is a preview feature both 'feature.customcontrols=true' and 'clientOptimizations=bundle' need to be specified in the portal's query string to enable custom controls.
- Custom controls is not enabled on sovereign\govt clouds. Custom controls feature will not work on these clouds.

### Sections:
- [Custom control overview](#custom-control-overview)
- [Building a custom control](#custom-control-building)
   - [Build your control](#custom-control-build-it)
   - [Package the control in the ibiza framework](#custom-control-package-control)
- [Consuming a custom control](#custom-control-consuming)
- [Making a custom control that participate in validation](#custom-control-validation)
- [Advanced topics](#custom-control-advanced)
  - [Requiring non-AMD scripts from your custom control widget](#custom-control-non-amd-scripts)
- [Known issues](#custom-control-known-issues)
- [Fixed issues not yet in production branch](#custom-control-not-in-prod)

<a name="custom-control-overview"></a>
### Custom control overview

Today if you want to build an ibiza extenison you are provided with Rich framework built in controls. Sometimes you may have a scenario for richer user experience where you need a custom cotrol.
In this case today, we give you 2 options: 
- You get complete Iframe at blade level to build controls,but with limitation that you cannot use any ibiza control within that blade
- You can contribute a framwork control into our repo, but here you will have to maaintain and develop this control using our review process.

To overcome this hurdles we came up with solution **Custom Control**
Basically custom controls feature:
- Enable partners to use custom controls along with ibiza framework controls.
- Enable partners to fulfill their custom controls need without taking a dependency on Ibiza team
- Enable partners to use Ibiza to write targeted forms controls
- Enable partners use controls written using other frameworks in their extension
- Enable partners to share controls across extensions


<a name="custom-control-building"></a>
### Building a custom control

Building a custom control is can be divided into 3 easy steps:
1. Build your control
    Today there are lot of open source libraries that enable you to build custom controls with great features. Build your custom control using such open source libraries.
2. Package it in ibiza framework
    You will need to package your package your control for Shell to understand and render it into your experience. The steps are mentioned (here)[].
3. Consume your control in your extension
    Once you have packaged your control, you will consume that control into your extension for having rich customer experience. How to consume your custom control is mentioend [here]()

<a name="custom-control-build-it"></a>
#### Building your control
Develop your control however you like. Once you have a control working on a standalone HTML page or something then the next step is to itegrate it into the portal.

<a name="custom-control-package-control"></a>
#### Package the control in the ibiza framework
Once you have a working control there are just a few steps needed to package it in the framework:

##### Implement Custom Controls contract in your controls
Create a <Your Control name>.ts file, which should import and implement `Fx/Composition/CustomControl` contracts which are shown below. Your module along with custom control contract will have your control template and control specific functionality. 

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

##### Define options contract for Custom Controls 
Once you have defined Custom Control contracts, you will need to create the options for your controls. This is basically the set of options your control will need from Shell when rendered in your extenions. 
You will create the <Your Control Name>Contracts.d.ts file which will have the options required for your controls. Below shows the example where we pass name as an option:
```ts    
    declare module <YourExtensionName>.BreadCrumb {
    
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

##### Define control PDL
Once you have defined the options and contract for your controls, next you define is PDL with below fields:
 - `Name` the name of your control
 - `ModuleId` pointer to your control implementation
 - `OptionsContract` pointer to the options contract definition
 - `Export` set this to true if you wish to share your control across extensions. You can basically provide the options contract file and the PDE of your control to differernt extensions and they can render the control without re-writing it.
  - `IsFormField`(Optional) - set this to true if your control needs to behave like ibiza form field. The details are provided [here]().
 - `StyleSheet` (Optional) - point this to your control style sheet.

```xml
<Definition xmlns="http://schemas.microsoft.com/aux/2013/pdl"
              Area="Preview">
 
     <!--Set Export="true" only if extension author wants to share the control and allow another partner extension to consume this control.-->
     <Control
         Name="BreadCrumb"
         ModuleId="Preview/CustomControls/BreadCrumb/BreadCrumb"
         OptionsContract="<YourExtensionName>.BreadCrumb.Options"
         Export="true">
 
         <StyleSheet Source="{Css Source='./BreadCrumb.css'}" />
     </Control>
</Definition>
```
  
<a name="custom-control-consuming"></a>
### Consuming a custom control

Once you have built your custom control, you can consume the control in yur experience in 3 steps:

##### Define your template blade
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

##### Refer your custom control in template

You can refer your custom control just like normal pcControl reference.

```xml
<div data-bind='pcControl: breadCrumb'></div>
<div data-bind='pcControl: fileExplorerVM'></div>
```

##### In blade ViewModel use control reference to create control view model

```ts
    this.breadCrumb = ControlReferences.BreadCrumb.createViewModel(container, {
            breadCrumbs: ko.observableArray(SampleData.getBreadCrumbs(SampleData.srcFolder)),
            onBreadCrumbClick: (breadCrumb) => {
                updateFileExplorerItems(breadCrumb.name);
            }
    });
```

<a name="custom-control-validation"></a>
### Making a custom control that participate in validation
Your scenario may require you to develop a control that you wish to use in forms section of the blade along with other Ibiza form controls. Ibiza has the internal validation patterns for rest of the controls and if you wish that your control should behave 
similarly you will need to do 2 small changes in your control implmentation:

1. In Your PDL define the control as form field i.e.
`IsFormField="true"`

2. Your options contract module should inherit module `Fx/Controls/CustomControl/FormField` to make sure Shell identifies it as form field on your blade:
```
declare module "<YourExtensionName>/NumericSpinner" {
    import * as FormField from "Fx/Controls/CustomControl/FormField";

    /**
     * Specifies the options for NumericSpinner 
     */
    export interface Options extends FormField.Options<number> {
    }
}
```

<a name="custom-control-advanced"></a>
### Advanced topics

<a name="custom-control-non-amd-scripts"></a>
#### Requiring non-AMD scripts from your custom control widget
If you're using 3rd party libraries to develop your control you may find the library was not developed to be loaded by RequireJS. You can still use require's config settings to load the file 
as a dependency of your widget.

<a name="custom-control-known-issues"></a>
### Known issues
Currently certain controls do not work with the custom controls infrastructure. You will not be able to use custom controls if your blade contains any of the following. You can use 
the bugs to track the progress of any fixes:

- (OAuth button)[http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=7301218]
- (File upload control)[http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=7300948]
- (File download control)[http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=7301179]
- (Progress bar)[http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=7301223]


If you have other comments or find additional issues you can log a bug [here](http://vstfrd:8080/Azure/RD/AAPT%20-%20Ibiza%20-%20Partner%20Requests/_workItems/create/RDTask?%5BSystem.Title%5D=%5BCustom+Controls%5D+%3CYour+Ask%3E&%5BSystem.Description%5D=%3Cdiv%3E%3Cdiv%3ETeam+Name%3C%2Fdiv%3E%3Cdiv%3EExtension+Contact%3C%2Fdiv%3E%3Cdiv%3E%3Cspan+style%3D%22font-weight%3Abold%3B%22%3E%26lt%3BPUT+YOUR+PRIMARY+CONTACT+HERE%26gt%3B%3C%2Fspan%3E%3C%2Fdiv%3E%3Cdiv%3E%3Cb%3E%3Cbr%3E%3C%2Fb%3E%3C%2Fdiv%3E%3Cdiv%3EIbiza+Contact%3Cdiv%3E%3Cspan+style%3D%22font-weight%3Abold%3B%22%3E%3C%2Fspan%3E%3C%2Fdiv%3E%3C%2Fdiv%3E%3C%2Fdiv%3E%3Cdiv%3E%26lt%3BDescribe+Scenario%26gt%3B%3C%2Fdiv%3E&%5BSystem.Tags%5D=ClickStop2&%5BMicrosoft.VSTS.Common.ActivatedBy%5D=Shrey+Shirwaikar+%3CREDMOND%5Cshresh%3E&%5BMicrosoft.VSTS.Common.Priority%5D=&%5BMicrosoft.VSTS.Common.Triage%5D=Not+Triaged&%5BMicrosoft.VSTS.Scheduling.CompletedWork%5D=&%5BMicrosoft.VSTS.Scheduling.BaselineWork%5D=3&%5BMicrosoft.RD.KeywordSearch%5D=cs2&%5BMicrosoft.Azure.IssueType%5D=Dev+Work&%5BMicrosoft.Azure.WorkStatus%5D=In+Review&%5BMicrosoft.VSTS.Common.BacklogPriority%5D=130&%5BMicrosoft.VSTS.Common.StackRank%5D=2&%5BMicrosoft.Azure.ApprovedDate%5D=Thu+Jul+28+2016+22%3A00%3A50+GMT-0700+(Pacific+Daylight+Time)) 
or contact shresh\adamab.

<a name="custom-control-not-in-prod"></a>
### Custom control issues not yet in fixed in production
The following fixes are available in MPAC but not the production branch. The best thing to do would be test in MPAC right now but available workarounds are listed below the issue.

- [7474062: [CustomControls] CreateActionBar hits null ref exception in a custom controls blade](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=7474062)
  - Use GenericActionBar or FormActionBar instead of CreateActionBar
- [7602850: [Custom Controls] Have custom control domain mapping done for SDK instal in iisexpress scenario](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=7602850)
  - Config can be updated to empty string as work around
- [6903952: [Custom Controls] Have extension reqirejs config module mapping when clientOptimization is false.](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=6903952)
  - You can use bundle option for now
- Issues around ProxiedObservablesV2
  - Use feature flag 'feature.pov2=false' to turn off ProxiedObservablesV2 feature
- [6921706: [Custom Controls] Custom controls should receive the calling extension name](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=6921706)
- [7301109: [Custom Control][Drop Down] Clicking outside the drop down doesn't collapse the drop down](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=7301109)
- [7201412: [Custom Controls] Docked\Validation balloon support for custom controls](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=7201412)

Other issues not yet fixed in MPAC/DF:

- [7915036: [Custom Control] Show a better error experience when custom controls are used in an unlocked blade](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=7915036)

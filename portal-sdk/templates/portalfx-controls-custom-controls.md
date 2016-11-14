## Build Your Own Control

Today if you want to build an ibiza extenison you are provided with Rich framework built in controls. Sometimes you may have a scenario for richer user experience where you need a custom cotrol.
In this case today, we give you 2 options: 
- You get complete Iframe at blade level to build controls,but with limitation that you cannot use any ibiza control within that blade
- You can contribute a framwork control into our repo, but here you will have to maaintain and develop this control using our review process.

To overcome this hurdles we came up with solution **Custom Control**
Basically custom controls feature:
- Enable partners to use custom controls along with ibiza framework controls.
- Enable partners to fulfil their custom controls need without taking a dependency on Ibiza team
- Enable partners to use Ibiza to write targeted forms controls
- Enable partners use controls written using other frameworks in their extension
- Enable partners to share controls across extensions


### How to use custom controls?

Building a custom control is can be divided into 3 easy steps:
1. Build your control
    Today there are lot of open source libraries that enable you to build custom controls with great features. Build your custom control using such open source libraries.
2. Package it in ibiza framework
    You will need to package your package your control for Shell to understand and render it into your experience. The steps are mentioned (here)[].
3. Consume your control in your extension
    Once you have packaged your control, you will consume that control into your extension for having rich customer experience. How to consume your custom control is mentioend [here]()


### Things to know
- Feature is not prod enabled yet i.e. you cannot go to production as of now with custom control on your blade. (This will enabled soon, so you can start implmentation work)
- Currently Custom controls is not enabled on sovereign\govt clouds. Custom controls feature will not work on these clouds.
- There are 2 Ibiza controls that dont work with custom controls and we are working on getting this fixed as per scenario requirements. So if you have any scenario which require these controls with custom controls please contact us asap.
    -OAuth button
    - File upload\Download

### Reach out to us

You can reach out to us if you
    - Find a bug with custom control
    - Feature requests
File a bug [here](http://vstfrd:8080/Azure/RD/AAPT%20-%20Ibiza%20-%20Partner%20Requests/_workItems/create/RDTask?%5BSystem.Title%5D=%5BCustom+Controls%5D+%3CYour+Ask%3E&%5BSystem.Description%5D=%3Cdiv%3E%3Cdiv%3ETeam+Name%3C%2Fdiv%3E%3Cdiv%3EExtension+Contact%3C%2Fdiv%3E%3Cdiv%3E%3Cspan+style%3D%22font-weight%3Abold%3B%22%3E%26lt%3BPUT+YOUR+PRIMARY+CONTACT+HERE%26gt%3B%3C%2Fspan%3E%3C%2Fdiv%3E%3Cdiv%3E%3Cb%3E%3Cbr%3E%3C%2Fb%3E%3C%2Fdiv%3E%3Cdiv%3EIbiza+Contact%3Cdiv%3E%3Cspan+style%3D%22font-weight%3Abold%3B%22%3E%3C%2Fspan%3E%3C%2Fdiv%3E%3C%2Fdiv%3E%3C%2Fdiv%3E%3Cdiv%3E%26lt%3BDescribe+Scenario%26gt%3B%3C%2Fdiv%3E&%5BSystem.Tags%5D=ClickStop2&%5BMicrosoft.VSTS.Common.ActivatedBy%5D=Shrey+Shirwaikar+%3CREDMOND%5Cshresh%3E&%5BMicrosoft.VSTS.Common.Priority%5D=&%5BMicrosoft.VSTS.Common.Triage%5D=Not+Triaged&%5BMicrosoft.VSTS.Scheduling.CompletedWork%5D=&%5BMicrosoft.VSTS.Scheduling.BaselineWork%5D=3&%5BMicrosoft.RD.KeywordSearch%5D=cs2&%5BMicrosoft.Azure.IssueType%5D=Dev+Work&%5BMicrosoft.Azure.WorkStatus%5D=In+Review&%5BMicrosoft.VSTS.Common.BacklogPriority%5D=130&%5BMicrosoft.VSTS.Common.StackRank%5D=2&%5BMicrosoft.Azure.ApprovedDate%5D=Thu+Jul+28+2016+22%3A00%3A50+GMT-0700+(Pacific+Daylight+Time)).

You can also catch the PM contact for Custom controls (shresh\adamab)

###Package it in ibiza framework

Once you have identified your control, you will need to package it in a way that ibiza framework idetified this as a control to render. This can be done in 3 easy steps:


#### Implement Custom Controls contract in your controls

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

#### Define options contract for Custom Controls 
Once you have defined Custom Control contracts, you will need to create the options for your controls. This is basically the set of options your control will need from Shell when rendered in your extenions. 
You will create the <Your Control Name>Contracts.d.ts file which will have  options required for your controls. Below shows the example where we pass name as sample options the :
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

#### Define control PDL 

Once you have defined the options and contract  for your controls, next you define is PDL with below fields:
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
### Custom Control as Form field
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
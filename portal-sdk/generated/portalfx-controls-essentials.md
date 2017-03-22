<a name="essentials-control"></a>
## Essentials control

The essentials control is used for showing resource information with multiple properties.
First 5 items in left pane of the essentials are obtained by calling Azure Resource Manager APIs with given resource id.
More items can be specified in constructor or can be added dynamically later in both left and right panes.
It has flexibility to customize layout and showing items without resource id.
When there are more than 5 items in any panes, only first 5 items in each panes will be shown and rest of the items can be revealed when **View All** is clicked.

![Essentials][essentials-sample]

<a name="essentialsOptions"></a>
<a name="essentials-control-options"></a>
### Options
- [Default](#defaultEssentials) (Most common use case)
- [Custom Layout](#customLayoutEssentials)
- [Non-Resource](#nonResourceEssentials)

<a name="essentialsTypes"></a>
<a name="essentials-control-types"></a>
### Types
- [Properties](#essentialsProperties)
- [Items](#essentialsItems)

<a name="essentialsFeatures"></a>
<a name="essentials-control-features"></a>
### Features
- [Resource Blade Open/Close Callbacks](#essentialsCallbacks)
- [Add Dynamic Properties](#essentialsDynamicProps)

<br><br>

---

<br>

<a name="essentialsProperties"></a>
<a name="essentials-control-types"></a>
### Types

<a name="essentials-control-types-type-of-properties"></a>
#### Type of Properties

<a name="essentials-control-types-type-of-properties-text"></a>
##### Text
```typescript
{
    label: "Sample Label",
    value: "Sample Value"
}
```
<a name="essentials-control-types-type-of-properties-link"></a>
##### Link
```typescript
{
    lable: "Sample Label",
    value: "Bing.com",
    onClick: new ClickableLink(ko.observable("http://www.bing.com"))
}
```
<a name="essentials-control-types-type-of-properties-customlink"></a>
##### CustomLink
```typescript
{
    label: "Sample Label",
    value: "Click to do something",
    onClick: () => {
        something();
    }
}
```

<a name="essentials-control-types-type-of-properties-built-in-builtinproperties"></a>
##### <a href="#builtInProperties">Built-In</a>
<br>
<a name="builtInProperties"></a>
<a name="essentials-control-types-built-in-properties"></a>
#### Built-In Properties

```typescript
/**
 * Built-In properties those can be obtained from resource data.
 */
const enum BuiltInType {
    /**
     * Built-in resource group property.
     */
    ResourceGroup = 1,

    /**
     * Built-in status property.
     */
    Status,

    /**
     * Built-in location property.
     */
    Location,

    /**
     * Built-in subscription name property.
     */
    SubscriptionName,

    /**
     * Built-in subscription id property.
     */
    SubscriptionId
}
```
<br>
<a name="essentialsItems"></a>
<a name="essentials-control-type-of-items"></a>
### Type of Items
<a name="essentials-control-type-of-items-item"></a>
#### Item
  A label with a property
```typescript
{
	label: "Sample Label",
    value: "Sample Value"
}
```

<a name="essentials-control-type-of-items-multi-line-item"></a>
#### Multi-line Item
A label with multiple [properties](#essentialsProperties)
```typescript
{
    label: "Sample Label",
    lines: [
    	{
            value: "text only"
        },
        {
            value: "Bing.com",
            onClick: new ClickableLink(ko.observable("http://www.bing.com"))
        }
    ]
}
```

<a name="essentials-control-options"></a>
### Options
<a name="defaultEssentials"></a>
<a name="essentials-control-options-default"></a>
#### Default

To use the essentials, compose a template blade that hosts the essentials control, then use it from your extension.

You can control the behavior of the essentials via initialization [options](#essentialsOptions) and provided [feature](#essentialsFeatures) functions.

**Step 1**: Define the Html template for your part:

`\Client\V1\Controls\Essentials\Templates\Essentials.html`

**Step 2**: Create a viewmodel to bind your control to `DefaultEssentialsViewModel` implements the viewmodel for the editor.

`\Client\V1\Controls\Essentials\ViewModels\DefaultEssentialsViewModel.ts.`

```typescript

/**
* ViewModel class for the Default Essentials blade.
*/
export class DefaultEssentialsViewModel
   extends MsPortalFx.ViewModels.Blade
   implements Def.DefaultEssentialsViewModel.Contract {

   /**
    * View model for the essentials.
    * This sample is showing the scenario that resourceId is known in "onInputSet".
    * Defining null observable in constructor and then populate the observable with the essentialsVM in "onInputSet" with the resourceId.
    * Non-observable approach can be found in "NonResourceEssentialsViewModel".
    */
   public vm: KnockoutObservable<EssentialsVM>;

   /**
    * Expand/Collapse State for the essentials.
    */
   public expanded: KnockoutObservable<boolean>;

   private _container: BladeContainer;

   /**
    * Creates the view model for the blade with an essentials control.
    *
    * @param container The container view model.
    * @param initialState The initial state of the view model.
    * @param context The context for the Blades area.
    */
   constructor(container: BladeContainer, initialState: any, dataContext: ControlsArea.DataContext) {
       super();
       this.title(ClientResources.essentialsDefaultEssentials);
       this.subtitle(ClientResources.controls);
       this._mockAPI();

       this.vm = ko.observable(null);
       this._container = container;
       this.expanded = ko.observable<boolean>();
   }

   /**
    * Read from the blade settings and set "expand" state value for the essentials.
    */
   public onInputsSet(inputs: Def.DefaultEssentialsViewModel.InputsContract, settings: Def.DefaultEssentialsViewModel.SettingsContract): MsPortalFx.Base.Promise {
       this._initializeControl(this._container);
       this._container.revealContent();
       if (settings && settings.content && typeof settings.content.expanded === "boolean") {
           this.expanded(settings.content.expanded);
       } else {
           // Expanded by Default
           this.expanded(true);
       }
       //essentials#addDynamicProps
       // Sample AJAX Action
       return sampleAJAXFunction.call(this)
           .then((properties: (Item | MultiLineItem)[]) => {
               this.vm().addDynamicProperties(properties.slice(0, 2), properties.slice(2, 4));
           });
       //essentials#addDynamicProps
   }

   /**
    * Initializes the Essentials.
    */
   private _initializeControl(container: BladeContainer): void {
       const resourceId = "/subscriptions/sub123/resourcegroups/snowtraxpsx/providers/Microsoft.Test/snowmobiles/snowtraxpsx600";
       const essentialsVM = new EssentialsVM(container, {
           resourceId: resourceId,
           expanded: this.expanded,
           additionalRight: [{
               label: ClientResources.essentialsItem,
               value: ClientResources.essentialsSampleString
           }, {
               label: ClientResources.essentialsItem,
               value: "Bing.com",
               onClick: new ClickableLink(ko.observable("http://www.bing.com"))
           }, {
               label: ClientResources.essentialsMultiLineItem,
               lines: [{
                   value: ClientResources.essentialsSampleString
               }, {
                   value: "Bing.com",
                   onClick: new ClickableLink(ko.observable("http://www.bing.com"))
               }]
           }],
           //essentials#bladeCallbacks
           onBladeOpen: (origin: BuiltInType) => {
               switch (origin) {
                   case BuiltInType.ResourceGroup:
                       this.vm().modifyStatus(ClientResources.essentialsResourceGroupOpened);
                       break;
                   case BuiltInType.SubscriptionName:
                       this.vm().modifyStatus(ClientResources.essentialsSubscriptionOpened);
                       break;
               }
           },
           onBladeClose: (origin: BuiltInType) => {
               switch (origin) {
                   case BuiltInType.ResourceGroup:
                       this.vm().modifyStatus(ClientResources.essentialsResourceGroupClosed);
                       break;
                   case BuiltInType.SubscriptionName:
                       this.vm().modifyStatus(ClientResources.essentialsSubscriptionClosed);
                       break;
               }
           }
           //essentials#bladeCallbacks
       });
       this.vm(essentialsVM);
   }
   
```

**Step 3**: Now you can consume your part from an extension by referencing it in the PDL:

`\Client\V1\Controls\Essentials\Essentials.pdl`

```xml

<TemplateBlade Name="DefaultEssentials"
               Style="Basic"
               ViewModel="{ViewModel Name=DefaultEssentialsViewModel, Module=./Essentials/ViewModels/DefaultEssentialsViewModel}"
               Template="{Html Source='Templates\\Essentials.html'}"
               Pinnable="True">
  <TemplateBlade.Settings>
      <Setting Property="expanded" />
  </TemplateBlade.Settings>
</TemplateBlade>

```

<a name="customLayoutEssentials"></a>
<a name="essentials-control-options-custom-layout"></a>
#### Custom Layout

To use the essentials, compose a template blade that hosts the essentials control, then use it from your extension.

Custom layout essentials allows you to change layout orders of built-in properties and any other properties freely.

You can control the behavior of the essentials via initialization [options](#essentialsOptions) and provided [feature](#essentialsFeatures) functions.

**Step 1**: Define the Html template for your part:

`\Client\V1\Controls\Essentials\Templates\Essentials.html`

**Step 2**: Create a viewmodel to bind your control to `CustomLayoutEssentialsViewModel` implements the viewmodel for the editor.

`\Client\V1\Controls\Essentials\ViewModels\CustomLayoutEssentialsViewModel.ts.`

```typescript

/**
* ViewModel class for the Custom Layout Essentials blade.
*/
export class CustomLayoutEssentialsViewModel
   extends MsPortalFx.ViewModels.Blade
   implements Def.CustomLayoutEssentialsViewModel.Contract {

   /**
    * View model for the essentials.
    * This sample is showing the scenario that resourceId is known in "onInputSet".
    * Defining null observable in constructor and then populate the observable with the essentialsVM in "onInputSet" with the resourceId.
    * Non-observable approach can be found in "NonResourceEssentialsViewModel".
    */
   public vm: KnockoutObservable<EssentialsVM>;

   /**
    * Expand/Collapse State for the essentials.
    */
   public expanded: KnockoutObservable<boolean>;

   private _container: BladeContainer;

   /**
    * Creates the view model for the blade with an essentials control.
    *
    * @param container The container view model.
    * @param initialState The initial state of the view model.
    * @param context The context for the Blades area.
    */
   constructor(container: BladeContainer, initialState: any, dataContext: ControlsArea.DataContext) {
       super();
       this.title(ClientResources.essentialsCustomLayoutEssentials);
       this.subtitle(ClientResources.controls);
       this._mockAPI();

       this.vm = ko.observable(null);
       this._container = container;
       this.expanded = ko.observable<boolean>();
   }

   /**
    * Read from the blade settings and set "expand" state value for the essentials.
    */
   public onInputsSet(inputs: Def.CustomLayoutEssentialsViewModel.InputsContract, settings: Def.CustomLayoutEssentialsViewModel.SettingsContract): MsPortalFx.Base.Promise {
       this._initializeControl(this._container);
       this._container.revealContent();
       if (settings && settings.content && typeof settings.content.expanded === "boolean") {
           this.expanded(settings.content.expanded);
       } else {
           // Expanded by Default
           this.expanded(true);
       }

       // Sample AJAX Action
       return sampleAJAXFunction.call(this)
           .then((properties: (Item | MultiLineItem)[]) => {
               this.vm().addDynamicProperties(properties.slice(0, 2), properties.slice(2, 4));
           });
   }

   /**
    * Initializes the Essentials.
    */
   private _initializeControl(container: BladeContainer): void {
       const resourceId = "/subscriptions/sub123/resourcegroups/snowtraxpsx/providers/Microsoft.Test/snowmobiles/snowtraxpsx600";
       const essentialsVM = new EssentialsVM(container, {
           resourceId: resourceId,
           left: [
               BuiltInType.Status,
               {
                   label: ClientResources.essentialsItem,
                   value: ClientResources.essentialsSampleString
               },
               BuiltInType.ResourceGroup,
               {
                   label: ClientResources.essentialsDynamicChangeStatus,
                   value: ClientResources.essentialsStatusWillBeChanged,
                   onClick: () => {
                       this.vm().modifyStatus(`${++clickCounter} ${ClientResources.essentialsTimesClicked}!`);
                   }
               },
               {
                   label: ClientResources.essentialsItem,
                   value: "Bing.com",
                   onClick: new ClickableLink(ko.observable("http://www.bing.com"))
               }
           ],
           right: [
               BuiltInType.Location,
               {
                   label: ClientResources.essentialsItem,
                   value: ClientResources.essentialsSampleString
               },
               BuiltInType.SubscriptionId,
               BuiltInType.SubscriptionName
           ],
           expanded: this.expanded,
           onBladeOpen: (origin: BuiltInType) => {
               switch (origin) {
                   case BuiltInType.ResourceGroup:
                       this.vm().modifyStatus(ClientResources.essentialsResourceGroupOpened);
                       break;
                   case BuiltInType.SubscriptionName:
                       this.vm().modifyStatus(ClientResources.essentialsSubscriptionOpened);
                       break;
               }
           },
           onBladeClose: (origin: BuiltInType) => {
               switch (origin) {
                   case BuiltInType.ResourceGroup:
                       this.vm().modifyStatus(ClientResources.essentialsResourceGroupClosed);
                       break;
                   case BuiltInType.SubscriptionName:
                       this.vm().modifyStatus(ClientResources.essentialsSubscriptionClosed);
                       break;
               }
           }
       });
       this.vm(essentialsVM);
   }
   
```

**Step 3**: Now you can consume your part from an extension by referencing it in the PDL:

`\Client\V1\Controls\Essentials\Essentials.pdl`

```xml

<TemplateBlade Name="CustomLayoutEssentials"
               Style="Basic"
               ViewModel="{ViewModel Name=CustomLayoutEssentialsViewModel, Module=./Essentials/ViewModels/CustomLayoutEssentialsViewModel}"
               Template="{Html Source='Templates\\Essentials.html'}"
               Pinnable="True">
  <TemplateBlade.Settings>
    <Setting Property="expanded" />
  </TemplateBlade.Settings>
</TemplateBlade>

```

<a name="nonResourceEssentials"></a>
<a name="essentials-control-options-non-resource"></a>
#### Non-Resource

To use the essentials, compose a template blade that hosts the essentials control, then use it from your extension.

Non-resource essentials allows you to use the essentials without a resource id. You change layout orders of all properties freely.

You can control the behavior of the essentials via initialization [options](#essentialsOptions) and provided [feature](#essentialsFeatures) functions.

**Step 1**: Define the Html template for your part:

`\Client\V1\Controls\Essentials\Templates\Essentials.html`

**Step 2**: Create a viewmodel to bind your control to `NonResourceEssentialsViewModel` implements the viewmodel for the editor.

`\Client\V1\Controls\Essentials\ViewModels\NonResourceEssentialsViewModel.ts.`

```typescript

/**
* ViewModel class for the Non-Resource Essentials blade.
*/
export class NonResourceEssentialsViewModel
   extends MsPortalFx.ViewModels.Blade
   implements Def.NonResourceEssentialsViewModel.Contract {

   /**
    * View model for the essentials.
    */
   public vm: EssentialsVM;

   /**
    * Expand/Collapse State for the essentials.
    */
   public expanded: KnockoutObservable<boolean>;

   /**
    * Custom Status.
    */
   public customStatus: KnockoutObservable<string> = ko.observable(null);

   /**
    * Creates the view model for the blade with an essentials control.
    *
    * @param container The container view model.
    * @param initialState The initial state of the view model.
    * @param context The context for the Blades area.
    */
   constructor(container: BladeContainer, initialState: any, dataContext: ControlsArea.DataContext) {
       super();
       this.title(ClientResources.essentialsNonResourceEssentials);
       this.subtitle(ClientResources.controls);
       this._initializeControl(container);
       container.revealContent();
   }

   /**
    * Read from the blade settings and set "expand" state value for the essentials.
    */
   public onInputsSet(inputs: Def.NonResourceEssentialsViewModel.InputsContract, settings: Def.NonResourceEssentialsViewModel.SettingsContract): MsPortalFx.Base.Promise {
       if (settings && settings.content && typeof settings.content.expanded === "boolean") {
           this.expanded(settings.content.expanded);
       } else {
           // Expanded by Default
           this.expanded(true);
       }

       // Sample AJAX Action
       return sampleAJAXFunction.call(this)
           .then((properties: (Item | MultiLineItem)[]) => {
               this.vm.addDynamicProperties(properties.slice(0, 2), properties.slice(2, 4));
           });
   }

   /**
    * Initializes the Essentials.
    */
   private _initializeControl(container: BladeContainer): void {
       this.expanded = ko.observable<boolean>();
       this.vm = new EssentialsVM(container, {
           left: [
               {
                   label: ClientResources.essentialsItem,
                   value: ClientResources.essentialsSampleString
               },
               {
                   label: ClientResources.essentialsDynamicChangeStatus,
                   value: ClientResources.essentialsStatusWillBeChanged,
                   onClick: () => {
                       this.customStatus(`${++clickCounter} ${ClientResources.essentialsTimesClicked}!`);
                   }
               },
               {
                   label: ClientResources.essentialsItem,
                   value: "Bing.com",
                   onClick: new ClickableLink(ko.observable("http://www.bing.com"))
               },
               {
                   label: ClientResources.essentialsItem,
                   value: ClientResources.essentialsSampleString
               },
               {
                   label: ClientResources.essentialsItem,
                   value: ClientResources.essentialsSampleString
               }
           ],
           right: [
               {
                   label: ClientResources.essentialsCustomStatus,
                   value: this.customStatus
               },
               {
                   label: ClientResources.essentialsItem,
                   value: "Bing.com",
                   onClick: new ClickableLink(ko.observable("http://www.bing.com"))
               },
               {
                   label: ClientResources.essentialsItem,
                   value: "Bing.com",
                   onClick: new ClickableLink(ko.observable("http://www.bing.com"))
               },
               {
                   label: ClientResources.essentialsItem,
                   value: ClientResources.essentialsSampleString
               },
               {
                   label: ClientResources.essentialsItem,
                   value: ClientResources.essentialsSampleString
               }
           ],
           expanded: this.expanded
       });
   }
}

```

**Step 3**: Now you can consume your part from an extension by referencing it in the PDL:

`\Client\V1\Controls\Essentials\Essentials.pdl`

```xml

<TemplateBlade Name="NonResourceEssentials"
               Style="Basic"
               ViewModel="{ViewModel Name=NonResourceEssentialsViewModel, Module=./Essentials/ViewModels/NonResourceEssentialsViewModel}"
               Template="{Html Source='Templates\\Essentials.html'}"
               Pinnable="True">
  <TemplateBlade.Settings>
    <Setting Property="expanded" />
  </TemplateBlade.Settings>
</TemplateBlade>

```

<a name="essentials-control-features"></a>
### Features

<a name="essentialsCallbacks"></a>
<a name="essentials-control-features-resource-blade-open-close-callbacks"></a>
#### Resource Blade Open/Close Callbacks

Resource blade open/close callback functions are provided and can be used for logging telemetry or some other needed tasks.

Note that this feature is not available in `NonResource` essentials.

`\Client\V1\Controls\Essentials\ViewModels\DefaultEssentialsViewModel.ts.`

```typescript

onBladeOpen: (origin: BuiltInType) => {
    switch (origin) {
        case BuiltInType.ResourceGroup:
            this.vm().modifyStatus(ClientResources.essentialsResourceGroupOpened);
            break;
        case BuiltInType.SubscriptionName:
            this.vm().modifyStatus(ClientResources.essentialsSubscriptionOpened);
            break;
    }
},
onBladeClose: (origin: BuiltInType) => {
    switch (origin) {
        case BuiltInType.ResourceGroup:
            this.vm().modifyStatus(ClientResources.essentialsResourceGroupClosed);
            break;
        case BuiltInType.SubscriptionName:
            this.vm().modifyStatus(ClientResources.essentialsSubscriptionClosed);
            break;
    }
}

```

<a name="essentialsDynamicProps"></a>
<a name="essentials-control-features-add-dynamic-properties"></a>
#### Add Dynamic Properties

`\Client\V1\Controls\Essentials\ViewModels\DefaultEssentialsViewModel.ts.`

```typescript

// Sample AJAX Action
return sampleAJAXFunction.call(this)
    .then((properties: (Item | MultiLineItem)[]) => {
        this.vm().addDynamicProperties(properties.slice(0, 2), properties.slice(2, 4));
    });

```

As the above code shows, the sample AJAX response contains 4 properties. First 2 items are added to left pane and last 2 items are added to right pane.


[essentials-sample]: ../media/portalfx-controls/essentials.png

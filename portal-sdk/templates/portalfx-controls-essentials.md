## Essentials control

The essentials control is used for showing resource information with multiple properties.
First 5 items in left pane of the essentials are obtained by calling Azure Resource Manager APIs with given resource id.
More items can be specified in constructor or can be added dynamically later in both left and right panes.
It has flexibility to customize layout and showing items without resource id.
When there are more than 5 items in any panes, only first 5 items in each panes will be shown and rest of the items can be revealed when **View All** is clicked.

![Essentials][essentials-sample]

<a name="essentialsOptions"></a>
### Options
- [Default](#defaultEssentials) (Most common use case)
- [Custom Layout](#customLayoutEssentials)
- [Non-Resource](#nonResourceEssentials)

<a name="essentialsTypes"></a>
### Types
- [Properties](#essentialsProperties)
- [Items](#essentialsItems)

<a name="essentialsFeatures"></a>
### Features
- [Resource Blade Open/Close Callbacks](#essentialsCallbacks)
- [Add Dynamic Properties](#essentialsDynamicProps)

<br><br>

---

<br>

<a name="essentialsProperties"></a>
### Types

#### Type of Properties

##### Text
```typescript
{
    label: "Sample Label",
    value: "Sample Value"
}
```
##### Link
```typescript
{
    lable: "Sample Label",
    value: "Bing.com",
    onClick: new ClickableLink(ko.observable("http://www.bing.com"))
}
```
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

##### [Built-In](#builtInProperties)
<br>
<a name="builtInProperties"></a>
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
### Type of Items
#### Item
  A label with a property
```typescript
{
	label: "Sample Label",
    value: "Sample Value"
}
```

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

### Options
<a name="defaultEssentials"></a>
#### Default

To use the essentials, compose a template blade that hosts the essentials control, then use it from your extension.

You can control the behavior of the essentials via initialization [options](#essentialsOptions) and provided [feature](#essentialsFeatures) functions.

**Step 1**: Define the Html template for your part:

`\Client\V1\Controls\Essentials\Templates\Essentials.html`

**Step 2**: Create a viewmodel to bind your control to `DefaultEssentialsViewModel` implements the viewmodel for the editor.

`\Client\V1\Controls\Essentials\ViewModels\DefaultEssentialsViewModel.ts.`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/V1/Controls/Essentials/ViewModels/DefaultEssentialsViewModel.ts","section":"essentials#defaultEssentialsViewModel"}

**Step 3**: Now you can consume your part from an extension by referencing it in the PDL:

`\Client\V1\Controls\Essentials\Essentials.pdl`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/V1/Controls/Essentials/Essentials.pdl","section":"essentials#defaultpdl"}

<a name="customLayoutEssentials"></a>
#### Custom Layout

To use the essentials, compose a template blade that hosts the essentials control, then use it from your extension.

Custom layout essentials allows you to change layout orders of built-in properties and any other properties freely.

You can control the behavior of the essentials via initialization [options](#essentialsOptions) and provided [feature](#essentialsFeatures) functions.

**Step 1**: Define the Html template for your part:

`\Client\V1\Controls\Essentials\Templates\Essentials.html`

**Step 2**: Create a viewmodel to bind your control to `CustomLayoutEssentialsViewModel` implements the viewmodel for the editor.

`\Client\V1\Controls\Essentials\ViewModels\CustomLayoutEssentialsViewModel.ts.`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/V1/Controls/Essentials/ViewModels/CustomLayoutEssentialsViewModel.ts","section":"essentials#customLayoutEssentialsViewModel"}

**Step 3**: Now you can consume your part from an extension by referencing it in the PDL:

`\Client\V1\Controls\Essentials\Essentials.pdl`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/V1/Controls/Essentials/Essentials.pdl","section":"essentials#custompdl"}

<a name="nonResourceEssentials"></a>
#### Non-Resource

To use the essentials, compose a template blade that hosts the essentials control, then use it from your extension.

Non-resource essentials allows you to use the essentials without a resource id. You change layout orders of all properties freely.

You can control the behavior of the essentials via initialization [options](#essentialsOptions) and provided [feature](#essentialsFeatures) functions.

**Step 1**: Define the Html template for your part:

`\Client\V1\Controls\Essentials\Templates\Essentials.html`

**Step 2**: Create a viewmodel to bind your control to `NonResourceEssentialsViewModel` implements the viewmodel for the editor.

`\Client\V1\Controls\Essentials\ViewModels\NonResourceEssentialsViewModel.ts.`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/V1/Controls/Essentials/ViewModels/NonResourceEssentialsViewModel.ts","section":"essentials#nonResourceEssentialsViewModel"}

**Step 3**: Now you can consume your part from an extension by referencing it in the PDL:

`\Client\V1\Controls\Essentials\Essentials.pdl`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/V1/Controls/Essentials/Essentials.pdl","section":"essentials#nonresourcepdl"}

### Features

<a name="essentialsCallbacks"></a>
#### Resource Blade Open/Close Callbacks

Resource blade open/close callback functions are provided and can be used for logging telemetry or some other needed tasks.

Note that this feature is not available in `NonResource` essentials.

`\Client\V1\Controls\Essentials\ViewModels\DefaultEssentialsViewModel.ts.`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/V1/Controls/Essentials/ViewModels/DefaultEssentialsViewModel.ts","section":"essentials#bladeCallbacks"}

<a name="essentialsDynamicProps"></a>
#### Add Dynamic Properties

`\Client\V1\Controls\Essentials\ViewModels\DefaultEssentialsViewModel.ts.`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/V1/Controls/Essentials/ViewModels/DefaultEssentialsViewModel.ts","section":"essentials#addDynamicProps"}

As the above code shows, the sample AJAX response contains 4 properties. First 2 items are added to left pane and last 2 items are added to right pane.


[essentials-sample]: ../media/portalfx-controls/essentials.png

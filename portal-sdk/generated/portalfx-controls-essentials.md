<a name="essentials-control"></a>
## Essentials control

The essentials control is used for showing resource information with multiple properties.
First 5 items in left pane of the essentials are obtained by calling Azure Resource Manager APIs with given resource id.
More items can be specified in constructor or can be added dynamically later in both left and right panes.
It has flexibility to customize layout of properties in a column, to show properties for non-ARM resources, to responsively redistribute properties into 1 or 3+ columns when the Blade width shrinks or expands.
When there are more than 5 items in any panes, only first 5 items in each panes will be shown and rest of the items can be revealed when **See more** is clicked.

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
- [Responsive Columns](#responsiveEssentials)

<br><br>

---

<br>

<a name="essentialsProperties"></a>
<a name="essentials-control-types-1"></a>
### Types

<a name="essentials-control-types-1-type-of-properties"></a>
#### Type of Properties

<a name="essentials-control-types-1-type-of-properties-text"></a>
##### Text
```typescript
{
    label: "Sample Label",
    value: "Sample Value"
}
```
<a name="essentials-control-types-1-type-of-properties-link"></a>
##### Link
```typescript
{
    lable: "Sample Label",
    value: "Bing.com",
    onClick: new ClickableLink(ko.observable("http://www.bing.com"))
}
```
<a name="essentials-control-types-1-type-of-properties-customlink"></a>
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

<a name="essentials-control-types-1-type-of-properties-built-in-builtinproperties"></a>
##### <a href="#builtInProperties">Built-In</a>
<br>
<a name="builtInProperties"></a>
<a name="essentials-control-types-1-built-in-properties"></a>
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

<a name="essentials-control-options-1"></a>
### Options
<a name="defaultEssentials"></a>
<a name="essentials-control-options-1-default"></a>
#### Default

To use the essentials, compose a template blade that hosts the essentials control, then use it from your extension.

You can control the behavior of the essentials via initialization [options](#essentialsOptions) and provided [feature](#essentialsFeatures) functions.

`\Client\V2\Controls\Essentials\EssentialsDefaultBlade.ts`

```typescript

/**
 * View model for the essentials.
 */
public essentials: Essentials.ResourceLayoutContract;

/**
 * Creating an essentials and using data-loading for the blade.
 * Note that it is returning a Promise of AJAX calling function.
 */
public async onInitialize() {
    let clickCounter = 0;

    await mockAPI(2);

    // Create an essentials
    this._initializeControl();

    const { container } = this.context;

    // Once the Essentials control is instantiated, this Blade contains enough UI that it can remove the blocking loading indicator
    container.revealContent();
    
```

...

```typescript

/**
 * Initializes the Essentials control.
 */
private _initializeControl(): void {
    const bladeLink: BladeLink = {
        bladeReference: BladeReferences.forBlade("NoParameterChildBlade").createReference(),
    };
    const resourceLink: ResourceLink = {
        resourceId: "/subscriptions/sub123/resourceGroups/accounts/providers/Microsoft.test/accounts/Peter",
    };
    this.essentials =  Essentials.createDefaultResourceLayout(this.context.container, {
        resourceId: "/subscriptions/sub123/resourcegroups/servertest/providers/Microsoft.test/virtualservers/default1",
        includeTags: true,
        additionalRight: [{
            label: ClientResources.essentialsItem,
            value: ClientResources.essentialsSampleString,
            icon: {
                image: MsPortalFx.Base.Images.SmileyHappy(),
                position: Essentials.IconPosition.Right,
            },
        }, {
            label: ClientResources.essentialsItem,
            value: "Bing.com",
            onClick: new ClickableLink(ko.observable("http://www.bing.com")),
        }, {
            label: ClientResources.essentialsItem,
            value: "Blade Link",
            onClick: bladeLink,
        }, {
            label: ClientResources.essentialsItem,
            value: "Resource Link",
            onClick: resourceLink,
        }, {
            label: ClientResources.essentialsMultiLineItem,
            lines: [{
                value: ClientResources.essentialsLongString,
            }, {
                value: "Bing.com",
                onClick: new ClickableLink(ko.observable("http://www.bing.com")),
                icon: {
                    image: MsPortalFx.Base.Images.SmileyHappy(),
                    position: Essentials.IconPosition.Left,
                },
            }],
        }],
        //essentials#bladeCallbacks
        onBladeOpen: (origin: Essentials.BuiltInType) => {
            switch (origin) {
                case Essentials.BuiltInType.ResourceGroup:
                    this.essentials.modifyStatus(ClientResources.essentialsResourceGroupOpened);
                    break;
                case Essentials.BuiltInType.SubscriptionName:
                    this.essentials.modifyStatus(ClientResources.essentialsSubscriptionOpened);
                    break;
            }
        },
        onBladeClose: (origin: Essentials.BuiltInType) => {
            switch (origin) {
                case Essentials.BuiltInType.ResourceGroup:
                    this.essentials.modifyStatus(ClientResources.essentialsResourceGroupClosed);
                    break;
                case Essentials.BuiltInType.SubscriptionName:
                    this.essentials.modifyStatus(ClientResources.essentialsSubscriptionClosed);
                    break;
            }
        },
        //essentials#bladeCallbacks
    });
}

```

<a name="customLayoutEssentials"></a>
<a name="essentials-control-options-1-custom-layout"></a>
#### Custom Layout

To use the essentials, compose a template blade that hosts the essentials control, then use it from your extension.

Custom layout essentials allows you to change layout orders of built-in properties and any other properties freely.

You can control the behavior of the essentials via initialization [options](#essentialsOptions) and provided [feature](#essentialsFeatures) functions.

`\Client\V2\Controls\Essentials\EssentialsCustomLayoutBlade.ts`

```typescript

/**
 * View model for the essentials.
 */
public essentials: Essentials.ResourceLayoutContract;

/**
 * Creating an essentials and not using data-loading for the blade.
 */
public async onInitialize() {

    // Create an essentials
    this._initializeControl();

    const { container } = this.context;

    // Once the Essentials control is instantiated, this Blade contains enough UI that it can remove the blocking loading indicator
    container.revealContent();
    
```

...

```typescript

/**
 * Initializes the Essentials control.
 */
private _initializeControl(): void {
    let clickCounter = 0;
    this.essentials =  Essentials.createCustomResourceLayout(this.context.container, {
        resourceId: "/subscriptions/sub123/resourcegroups/servertest/providers/Microsoft.test/virtualservers/default1",
        left: [
            Essentials.BuiltInType.Status,
            {
                label: ClientResources.essentialsItem,
                value: ClientResources.essentialsSampleString,
            },
            Essentials.BuiltInType.ResourceGroup,
            {
                label: ClientResources.essentialsDynamicChangeStatus,
                value: ClientResources.essentialsStatusWillBeChanged,
                onClick: () => {
                    this.essentials.modifyStatus(`${++clickCounter} ${ClientResources.essentialsTimesClicked}!`);
                },
            },
            {
                label: ClientResources.essentialsItem,
                value: "Bing.com",
                onClick: new ClickableLink(ko.observable("http://www.bing.com")),
            },
        ],
        right: [
            Essentials.BuiltInType.Location,
            {
                label: ClientResources.essentialsItem,
                value: ClientResources.essentialsSampleString,
            },
            Essentials.BuiltInType.SubscriptionId,
            Essentials.BuiltInType.SubscriptionName,
        ],
        onBladeOpen: (origin: Essentials.BuiltInType) => {
            switch (origin) {
                case Essentials.BuiltInType.ResourceGroup:
                    this.essentials.modifyStatus(ClientResources.essentialsResourceGroupOpened);
                    break;
                case Essentials.BuiltInType.SubscriptionName:
                    this.essentials.modifyStatus(ClientResources.essentialsSubscriptionOpened);
                    break;
            }
        },
        onBladeClose: (origin: Essentials.BuiltInType) => {
            switch (origin) {
                case Essentials.BuiltInType.ResourceGroup:
                    this.essentials.modifyStatus(ClientResources.essentialsResourceGroupClosed);
                    break;
                case Essentials.BuiltInType.SubscriptionName:
                    this.essentials.modifyStatus(ClientResources.essentialsSubscriptionClosed);
                    break;
            }
        },
    });
}

```

<a name="nonResourceEssentials"></a>
<a name="essentials-control-options-1-non-resource"></a>
#### Non-Resource

To use the essentials, compose a template blade that hosts the essentials control, then use it from your extension.

Non-resource essentials allows you to use the essentials without a resource id. You change layout orders of all properties freely.

You can control the behavior of the essentials via initialization [options](#essentialsOptions) and provided [feature](#essentialsFeatures) functions.

`\Client\V2\Controls\Essentials\EssentialsNonResourceBlade.ts`

```typescript

/**
 * View model for the essentials.
 */
public essentials: Essentials.NonResourceLayoutContract;

/**
 * Custom Status.
 */
private _customStatus: KnockoutObservable<string> = ko.observable(null);

/**
 * Creating an essentials and not using data-loading for the blade.
 */
public async onInitialize() {
    // Create an essentials
    this._initializeControl();

    const { container } = this.context;

    // Once the Essentials control is instantiated, this Blade contains enough UI that it can remove the blocking loading indicator
    container.revealContent();
    
```

...

```typescript

/**
 * Initializes the Essentials control.
 */
private _initializeControl(): void {
    let clickCounter = 0;
    this.essentials = Essentials.createNonResourceLayout(this.context.container, {
        left: [
            {
                label: ClientResources.essentialsItem,
                value: ClientResources.essentialsSampleString,
            },
            {
                label: ClientResources.essentialsDynamicChangeStatus,
                value: ClientResources.essentialsStatusWillBeChanged,
                onClick: () => {
                    this._customStatus(`${++clickCounter} ${ClientResources.essentialsTimesClicked}!`);
                },
            },
            {
                label: ClientResources.essentialsItem,
                value: "Bing.com",
                onClick: new ClickableLink(ko.observable("http://www.bing.com")),
            },
            {
                label: ClientResources.essentialsItem,
                value: ClientResources.essentialsSampleString,
            },
            {
                label: ClientResources.essentialsItem,
                value: ClientResources.essentialsSampleString,
            },
        ],
        right: [
            {
                label: ClientResources.essentialsCustomStatus,
                value: this._customStatus,
            },
            {
                label: ClientResources.essentialsItem,
                value: "Bing.com",
                onClick: new ClickableLink(ko.observable("http://www.bing.com")),
            },
            {
                label: ClientResources.essentialsItem,
                value: "Bing.com",
                onClick: new ClickableLink(ko.observable("http://www.bing.com")),
            },
            {
                label: ClientResources.essentialsItem,
                value: ClientResources.essentialsSampleString,
            },
            {
                label: ClientResources.essentialsItem,
                value: ClientResources.essentialsSampleString,
            },
        ],
    });
}

```

<a name="essentials-control-features-1"></a>
### Features

<a name="essentialsCallbacks"></a>
<a name="essentials-control-features-1-resource-blade-open-close-callbacks"></a>
#### Resource Blade Open/Close Callbacks

Resource blade open/close callback functions are provided and can be used for logging telemetry or some other needed tasks.

Note that this feature is not available in `NonResource` essentials.

`\Client\V2\Controls\Essentials\EssentialsDefaultBlade.ts`

```typescript

onBladeOpen: (origin: Essentials.BuiltInType) => {
    switch (origin) {
        case Essentials.BuiltInType.ResourceGroup:
            this.essentials.modifyStatus(ClientResources.essentialsResourceGroupOpened);
            break;
        case Essentials.BuiltInType.SubscriptionName:
            this.essentials.modifyStatus(ClientResources.essentialsSubscriptionOpened);
            break;
    }
},
onBladeClose: (origin: Essentials.BuiltInType) => {
    switch (origin) {
        case Essentials.BuiltInType.ResourceGroup:
            this.essentials.modifyStatus(ClientResources.essentialsResourceGroupClosed);
            break;
        case Essentials.BuiltInType.SubscriptionName:
            this.essentials.modifyStatus(ClientResources.essentialsSubscriptionClosed);
            break;
    }
},

```

<a name="essentialsDynamicProps"></a>
<a name="essentials-control-features-1-add-dynamic-properties"></a>
#### Add Dynamic Properties

`\Client\V2\Controls\Essentials\EssentialsDefaultBlade.ts`

```typescript

// Generate array of Essentials.Item | Essentials.MultiLineItem from the results
const items: ((Essentials.Item | Essentials.MultiLineItem)[]) = results.map((data: any): Essentials.Item | Essentials.MultiLineItem => {
    switch (data.type) {
        case "connectionString": {
            const connectionString = ko.observable(ClientResources.essentialsConnectionStringValue);
            return {
                label: data.label,
                value: connectionString,
                onClick: () => {
                    connectionString(data.value);
                },
            };
        }
        case "text":
            return {
                label: data.label,
                value: data.value,
                icon: {
                    image: MsPortalFx.Base.Images.SmileyHappy(),
                    position: Essentials.IconPosition.Right,
                },
            };
        case "url":
            return {
                label: data.label,
                value: data.value,
                onClick: new ClickableLink(ko.observable(data.url)),
            };
        case "changeStatus":
            return {
                label: data.label,
                value: data.value,
                onClick: () => {
                    this.essentials.modifyStatus(`${++clickCounter} ${ClientResources.essentialsTimesClicked}!`);
                },
            };
    }
    
```

As the above code shows, the sample AJAX response contains 4 properties. First 2 items are added to left pane and last 2 items are added to right pane.
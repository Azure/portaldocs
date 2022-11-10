<a name="microsoft-common-selector"></a>
# Microsoft.Common.Selector
* [Microsoft.Common.Selector](#microsoft-common-selector)
    * [Description](#microsoft-common-selector-description)
    * [Definitions:](#microsoft-common-selector-definitions)
    * [UI Sample](#microsoft-common-selector-ui-sample)
    * [Sample Snippet](#microsoft-common-selector-sample-snippet)
    * [Selector Control commonly used with BladeInvokeControl](#microsoft-common-selector-selector-control-commonly-used-with-bladeinvokecontrol)

<a name="microsoft-common-selector-description"></a>
## Description
The Selector component enables a user to select items defined by using BladeInvokeControl.
<a name="microsoft-common-selector-definitions"></a>
## Definitions:
<a name="microsoft-common-selector-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
<<<<<<< HEAD
|name|True|Name of the instance.
|type|True|Enum permitting the value: "Microsoft.Common.Selector"
|label|True|Display name of the instance.
|link|False|Link of the instance.
|toolTip|False|
|keyPath|True|KeyPath to display data from <code>value</code> property of Selector control
|barColor|False|Customize the barColor by supplying a valid Hex Color code. Ex. #7fba00
|descriptionKeyPath|False|KeyPath to display data in the description section from <code>value</code> property of Selector control
|value|True|When using the BladeInvokeControl, it would be the output of the BladeInvokeControl
|constraints|False|If `constraints.required` is evaluated to `true`, then it requires user to select at least one item to validate successfully. The default value is `false`.
|defaultValue|True|default value of the selectorControl. DefaultValue should contain keyPath and DescriptionKeyPath(Optional). Default value also supports re-setting the default value if `defaultValue.resetTrigger` is evaluated as **true**.
|valueMapping|False|Value Mapping of output value
|visible|False|Specify the visibility of the element. Value can be a boolean or an expression(string)
=======
|name|True|
|type|True|
|label|True|
|link|False|
|toolTip|False|
|keyPath|True|
|barColor|False|
|descriptionKeyPath|False|
|value|True|
|constraints|False|
|defaultValue|True|
|valueMapping|False|
|visible|False|
>>>>>>> dev
|fx.feature|False|
<a name="microsoft-common-selector-ui-sample"></a>
## UI Sample
![alt-text](../media/dx/controls/Microsoft.Common.Selector-default.png "default selector UI")
![alt-text](../media/dx/controls/Microsoft.Common.Selector-withBladeInvokeControl.png "After picking data from BladeInvokeControl UI")
<a name="microsoft-common-selector-sample-snippet"></a>
## Sample Snippet
  ## Example for Microsoft.Common.Selector

```json
{
    "type": "Microsoft.Common.Selector",
    "name": "vmDisk",
    "label": "Virtual Machine disk size",
    "valueMapping": [
        {
        "value": "4",
        "displayName": "4 GiB"
        },
        {
        "value": "8",
        "displayName": "8 GiB"
        },
        {
        "value": "512",
        "displayName": "512 GiB"
        }
    ],
    "keyPath": "diskSizeGB",
    "descriptionKeyPath": "subText",
    "defaultValue": {
        "diskSizeGB": 4,
        "subText": 250
    },
    "value": "[steps('step1').diskSize.transformed.sku]",
    "visible": "[contains(resources().name, 'e')]"
}
```

<a name="microsoft-common-selector-selector-control-commonly-used-with-bladeinvokecontrol"></a>
## Selector Control commonly used with BladeInvokeControl

```json
{
    "type": "Microsoft.Solutions.BladeInvokeControl",
    "name": "diskSize",
    "transforms": {
        "sku": "{\"diskSizeGB\": join(' ',[`Disk Size:`, @.to_string(diskSizeGB), `GiB`]), \"subText\": join(', ', [@.to_string(iops), join(' ', [@.to_string(throughput), `throughput`]), @.to_string(sku)])}"
    },
    "openBladeStatus": "[steps('step1').vmDisk.changing]",
    "defaultValue": {
        "diskSizeGB": 8
    },
    "bladeReference": {
        "name": "ChangeDiskSizeBlade",
        "extension": "Microsoft_Azure_Compute",
        "parameters": {
        "location": "eastus",
        "subscription": "[steps('step1').resourceScope.subscription.subscriptionId]",
        "isUltraSsdEnabled": false,
        "minimumDiskSize": 1,
        "maximumDiskSize": 30000,
        "diskConfiguration": {
            "sku": "Premium_LRS",
            "diskSizeGB": 4,
            "iops": 400,
            "throughput": 4
        }
        },
        "inFullScreen": true
    }
}
```


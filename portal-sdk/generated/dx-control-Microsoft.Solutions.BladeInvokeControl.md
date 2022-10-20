<a name="microsoft-solutions-bladeinvokecontrol"></a>
# Microsoft.Solutions.BladeInvokeControl
* [Microsoft.Solutions.BladeInvokeControl](#microsoft-solutions-bladeinvokecontrol)
    * [Description](#microsoft-solutions-bladeinvokecontrol-description)
    * [Definitions:](#microsoft-solutions-bladeinvokecontrol-definitions)
    * [UI Sample](#microsoft-solutions-bladeinvokecontrol-ui-sample)
    * [Sample Snippet](#microsoft-solutions-bladeinvokecontrol-sample-snippet)
    * [Sample output](#microsoft-solutions-bladeinvokecontrol-sample-output)
    * [defaultValue before selecting different option](#microsoft-solutions-bladeinvokecontrol-defaultvalue-before-selecting-different-option)
    * [after selecting different diskSize: for example, 16GiB](#microsoft-solutions-bladeinvokecontrol-after-selecting-different-disksize-for-example-16gib)

<a name="microsoft-solutions-bladeinvokecontrol-description"></a>
## Description
BladeInvokeControl let user to invoke another blade from different control element. Cannot be used alone. Commonly used with other controls, such as Microsoft.Common.Selector.
<a name="microsoft-solutions-bladeinvokecontrol-definitions"></a>
## Definitions:
<a name="microsoft-solutions-bladeinvokecontrol-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|name|True|Name of the instance.
|type|True|Enum permitting the value: "Microsoft.Solutions.BladeInvokeControl"
|openBladeStatus|True|Configuration of when to enable BladeInvokeControl
|bladeReference|True|blade reference using BladeInvokeControl. See [here](dx-bladeReferenceWithFullScreen.md) for more information
|defaultValue|False|defaultValue in BladeInvokeControl
|transforms|False|Use JMES path query in BladeInvokeControl to transform data
|fx.feature|False|
<a name="microsoft-solutions-bladeinvokecontrol-ui-sample"></a>
## UI Sample
![alt-text](../media/dx/controls/Microsoft.Solutions.BladeInvokeControl-inFullScreen.png "in full screen UI")  
![alt-text](../media/dx/controls/Microsoft.Solutions.BladeInvokeControl-inContextPane.png "in context pane UI")  
<a name="microsoft-solutions-bladeinvokecontrol-sample-snippet"></a>
## Sample Snippet
  ## Microsoft.Solutions.BladeInvokeControl usually cannot use itself only. Commonly used with other controls, such as Microsoft.Common.Selector

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
        "inFullScreen": false
   }
}

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

<a name="microsoft-solutions-bladeinvokecontrol-sample-output"></a>
## Sample output
  
<a name="microsoft-solutions-bladeinvokecontrol-defaultvalue-before-selecting-different-option"></a>
## defaultValue before selecting different option

```json
{
    "diskSizeGB": 8
}
```

<a name="microsoft-solutions-bladeinvokecontrol-after-selecting-different-disksize-for-example-16gib"></a>
## after selecting different diskSize: for example, 16GiB

```json
{
    "sku": "Premium_LRS",
    "diskSizeGB": 16,
    "iops": 120,
    "throughput": 25,
    "maxValueOfMaxShares": 3,
    "ultraReadOnlyValues": {
        "minRoIops": 10,
        "minRoThroughput": 10,
        "maxRoIops": 4000,
        "maxRoThroughput": 2000
    },
    "defaultPerformanceTier": {
        "minSize": 8,
        "maxSize": 16,
        "tier": "P3",
        "maxIops": 120,
        "maxThroughput": 25,
        "maxValueOfMaxShares": 3,
        "maxBurstIops": 3500,
        "maxBurstThroughput": 170
    }
}
```


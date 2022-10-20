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

```json
{
    "name": "storageSelector",
    "type": "Microsoft.Solutions.ResourceSelector",
    "label": "Select storage accounts",
    "resourceType": "Microsoft.Storage/storageAccounts",
    "toolTip": "Select a storage account",
    "scope": {
        "subscriptionId": "[steps('basics').resourceScope.subscription.subscriptionId]",
        "location": "[steps('basics').resourceScope.location.name]"
    },
    "constraints": {
        "required": true
    },
    "visible": true
}
```

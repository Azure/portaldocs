```json
{
    "name": "keyVaultCertificateSelection",
    "type": "Microsoft.KeyVault.KeyVaultCertificateSelector",
    "visible": true,
    "toolTip": "Select certificate",
    "scope": {
        "subscriptionId": "[steps('basics').resourceScope.subscription.subscriptionId]",
        "location": "[steps('basics').resourceScope.location.name]"
    },
    "label": "KeyVault certificates selection"
}
```

```json
{
    "name": "element1",
    "type": "Microsoft.Network.PublicIpAddressCombo",
    "label": {
      "publicIpAddress": "Public IP address",
      "domainNameLabel": "Domain name label"
    },
    "toolTip": {
      "publicIpAddress": "",
      "domainNameLabel": ""
    },
    "defaultValue": {
      "publicIpAddressName": "ip01",
      "domainNameLabel": "mydomain"
    },
    "constraints": {
      "required": {
        "domainNameLabel": true
      }
    },
    "scope": {
        "subscriptionId": "[steps('basics').resourceScope.subscription.subscriptionId]",
        "resourceGroupName": "[steps('basics').resourceScope.resourceGroup.name]",
        "location": "[steps('basics').resourceScope.location.name]"
    },
    "options": {
      "hideNone": false,
      "hideDomainNameLabel": false,
      "hideExisting": false,
      "zone": 3
    },
    "visible": true
}
```

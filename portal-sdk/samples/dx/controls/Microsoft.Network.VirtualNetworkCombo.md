```json
{
    "name": "element1",
    "type": "Microsoft.Network.VirtualNetworkCombo",
    "label": {
      "virtualNetwork": "Virtual network",
      "subnets": "Subnets"
    },
    "toolTip": {
      "virtualNetwork": "",
      "subnets": ""
    },
    "defaultValue": {
      "name": "vnet01",
      "addressPrefixSize": "/16"
    },
    "constraints": {
      "minAddressPrefixSize": "/16"
    },
    "options": {
      "hideExisting": false
    },
    "scope": {
        "subscriptionId": "[steps('basics').resourceScope.subscription.subscriptionId]",
        "resourceGroupName": "[steps('basics').resourceScope.resourceGroup.name]",
        "location": "[steps('basics').resourceScope.location.name]"
    },
    "subnets": {
      "subnet1": {
        "label": "First subnet",
        "defaultValue": {
          "name": "subnet-1",
          "addressPrefixSize": "/24"
        },
        "constraints": {
          "minAddressPrefixSize": "/24",
          "minAddressCount": 12,
          "requireContiguousAddresses": true
        }
      },
      "subnet2": {
        "label": "Second subnet",
        "defaultValue": {
          "name": "subnet-2",
          "addressPrefixSize": "/26"
        },
        "constraints": {
          "minAddressPrefixSize": "/26",
          "minAddressCount": 8,
          "requireContiguousAddresses": true
        }
      }
    },
    "visible": true
  }
```

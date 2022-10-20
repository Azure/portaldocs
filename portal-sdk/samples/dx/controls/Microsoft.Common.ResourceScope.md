### Default ResourceScope control
```json
{
  "name": "resourceScope",
  "type": "Microsoft.Common.ResourceScope"
}
```

 
### ResourceScope control with all possible customizations
```json
{
  "name": "resourceScope",
  "type": "Microsoft.Common.ResourceScope",
  "instanceDetailsLabel": "Cloud Service Details",
  "subscription": {
     "constraints": {
        "validations": [
           {
             "isValid": "[equals(1,1)]",
             "message": "invalid subscription selection"
           },
           {
             "permission": "Microsoft.Network/applicationGateways/read",
             "message": "User does not have permission on this Subscription"
           }
        ]
      },
      "resourceProviders": [
         "Microsoft.Compute"
      ]
  },
  "resourceGroup": {
     "constraints": {
        "validations": [
           {
              "isValid": "[equals(1,1)]",
              "message": "invalid resource group selection"
           }
        ]
     },
     "allowExisting": true
  },
  "resourceName": {
     "label": "Name",
     "toolTip": "Use only allowed characters",
     "constraints": {
        "validations": [
           {
              "isValid": "[equals(1,1)]",
              "message": "invalid resource group selection"
           },
           {
              "regex": "^[a-z0-9A-Z]{1,30}$",
              "validationMessage": "invalid resource name"
           }
        ]
     }
  },
  "location": {
     "label": "Name",
     "toolTip": "Use only allowed characters",
     "resourceTypes": [
        "Microsoft.Compute/virtualMachines"
     ],
     "allowedValues": [
        "eastus",
        "westus2"
     ]
  }
}
```

### Example

The following is an example of the `Microsoft.Common.ServicePrincipalSelector` control. The `defaultValue` property sets `principalId` to `<default guid>` as a placeholder for a default application identifier GUID.

```json
{
  "$schema": "https://schema.management.azure.com/schemas/0.1.2-preview/CreateUIDefinition.MultiVm.json#",
  "handler": "Microsoft.Azure.CreateUIDef",
  "version": "0.1.2-preview",
  "parameters": {
    "basics": [],
    "steps": [
      {
        "name": "SPNcontrol",
        "label": "SPNcontrol",
        "elements": [
          {
            "name": "ServicePrincipal",
            "type": "Microsoft.Common.ServicePrincipalSelector",
            "label": {
              "password": "Password",
              "certificateThumbprint": "Certificate thumbprint",
              "authenticationType": "Authentication Type",
              "sectionHeader": "Service Principal"
            },
            "toolTip": {
              "password": "Password",
              "certificateThumbprint": "Certificate thumbprint",
              "authenticationType": "Authentication Type"
            },
            "defaultValue": {
              "principalId": "<default guid>",
              "name": "(New) default App Id"
            },
            "constraints": {
              "required": true,
              "regex": "^[a-zA-Z0-9]{8,}$",
              "validationMessage": "Password must be at least 8 characters long, contain only numbers and letters"
            },
            "options": {
              "hideCertificate": false
            },
            "visible": true
          }
        ]
      }
    ],
    "outputs": {
      "appId": "[steps('SPNcontrol').ServicePrincipal.appId]",
      "objectId": "[steps('SPNcontrol').ServicePrincipal.objectId]",
      "password": "[steps('SPNcontrol').ServicePrincipal.password]",
      "certificateThumbprint": "[steps('SPNcontrol').ServicePrincipal.certificateThumbprint]",
      "newOrExisting": "[steps('SPNcontrol').ServicePrincipal.newOrExisting]",
      "authenticationType": "[steps('SPNcontrol').ServicePrincipal.authenticationType]"
    }
  }
}
```

### Example output

The `appId` is the Id of the application registration that you selected or created. The `objectId` is an array of object Ids for the service principals configured for the selected application registration.

When no selection is made from the control, the `newOrExisting` property value is **new**:

```json
{
  "appId": {
    "value": "<default guid>"
  },
  "objectId": {
    "value": ["<default guid>"]
  },
  "password": {
    "value": "<password>"
  },
  "certificateThumbprint": {
    "value": ""
  },
  "newOrExisting": {
    "value": "new"
  },
  "authenticationType": {
    "value": "password"
  }
}
```

When **Create new** or an existing application is selected from the control the `newOrExisting` property value is **existing**:

```json
{
  "appId": {
    "value": "<guid>"
  },
  "objectId": {
    "value": ["<guid>"]
  },
  "password": {
    "value": "<password>"
  },
  "certificateThumbprint": {
    "value": ""
  },
  "newOrExisting": {
    "value": "existing"
  },
  "authenticationType": {
    "value": "password"
  }
}
```
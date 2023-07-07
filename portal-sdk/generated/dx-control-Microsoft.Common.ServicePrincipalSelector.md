<a name="microsoft-common-serviceprincipalselector"></a>
# Microsoft.Common.ServicePrincipalSelector
* [Microsoft.Common.ServicePrincipalSelector](#microsoft-common-serviceprincipalselector)
    * [Description](#microsoft-common-serviceprincipalselector-description)
    * [Guidance](#microsoft-common-serviceprincipalselector-guidance)
        * [Use default application or create new](#microsoft-common-serviceprincipalselector-guidance-use-default-application-or-create-new)
        * [Use existing application](#microsoft-common-serviceprincipalselector-guidance-use-existing-application)
    * [Definitions:](#microsoft-common-serviceprincipalselector-definitions)
    * [UI Sample](#microsoft-common-serviceprincipalselector-ui-sample)
    * [Sample Snippet](#microsoft-common-serviceprincipalselector-sample-snippet)
        * [Example output](#microsoft-common-serviceprincipalselector-sample-snippet-example-output)

<a name="microsoft-common-serviceprincipalselector-description"></a>
## Description

A control that lets users select an existing [service principal](https://learn.microsoft.com/azure/active-directory/develop/app-objects-and-service-principals#service-principal-object) or register a new application. When you select **Create New**, you follow the steps to register a new application. When you select an existing application, the control provides a textbox to input a password or certificate thumbprint.

<a name="microsoft-common-serviceprincipalselector-guidance"></a>
## Guidance
You can use a default application, create a new application, or use an existing application.

<a name="microsoft-common-serviceprincipalselector-guidance-use-default-application-or-create-new"></a>
### Use default application or create new

The default view is determined by the values in the `defaultValue` property and the **Service Principal Type** is set to **Create New**. If the `principalId` property contains a valid globally unique identifier (GUID), the control searches for the application's `objectId`. The default value applies if the user doesn't make a selection from the control.

If you want to register a new application, select **Change selection** and the **Register an application dialog box** is displayed. Enter **Name**, **Supported account type**, and select the **Register** button.

![UI sample of a ServicePrincipalSelector control](../media/dx/controls/dx-control-Microsoft.Common.ServicePrincipalSelector.png)

After you register a new application, use the **Authentication Type** to enter a password or certificate thumbprint.

![UI sample of a ServicePrincipalSelector control in the Create New scenario specifying Authentication Type](../media/dx/controls/dx-control-Microsoft.Common.ServicePrincipalSelector-authenticationType.png)

<a name="microsoft-common-serviceprincipalselector-guidance-use-existing-application"></a>
### Use existing application

To use an existing application, choose **Select Existing** and then select **Make selection**. Use the **Select an application** dialog box to search for the application's name. From the results, select the the application and then the **Select** button. After you select an application, the control displays the **Authentication Type** to enter a password or certificate thumbprint.

![UI sample of a ServicePrincipalSelector in the Select Existing Application scenario](../media/dx/controls/dx-control-Microsoft.Common.ServicePrincipalSelector-selectExisting.png)

<a name="microsoft-common-serviceprincipalselector-definitions"></a>
## Definitions:
<a name="microsoft-common-serviceprincipalselector-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|name|True|The name of the instance
|type|True|Enum permitting the value: "Microsoft.Common.ServicePrincipalSelector"
|label|False|The label object defines the display text for the control and has four properties: <code>password</code>, <code>certificateThumbprint</code>, <code>authenticationType</code> and <code>sectionHeader</code>. <br><br>1) <code>label.password</code> defines the display text for the password entry box when "Password" is selected as the desired authentication type <br><br>2) <code>label.certificateThumbprint</code> defines the display text for the certificate thumbprint entry box when "Certificate Thumbprint" is selected as the desired authentication type<br><br>3) <code>label.authenticationType</code> defines the label text to display when choosing an authentication type <br><br>4) <code>label.sectionHeader</code> defines the text displayed for the header of the ServicePrincipalSelector control
|toolTip|False|The toolTip object has three properties: <code>password</code>, <code>certificateThumbprint</code>, and <code>authenticationType</code>. <br><br> For each property, <code>propertyName.toolTip</code> is the text to display when hovering over the tooltip icon next to the label for the respective property. Tooltip icon will only be displayed if text is a non-empty value.
|defaultValue|False|The defaultValue object has two properties: <code>principalId</code> and <code>name</code>. The default value applies if the user doesn't make a selection from the control. <br><br>1) <code>defaultValue.principalId</code> defines the Service Principal object to display as the default selection for the control. If <code>defaultValue.principalId</code> contains a valid globally unique identifier (GUID), the control searches for the application's <code>objectId</code>. Otherwise, you can set <code>defaultValue.principalId</code> to <code>\<default guid\></code> as a placeholder for a default application identifier GUID. <br><br>2) <code>defaultValue.name</code> defines the display text for the name of the default application defined in <code>defaultValue.principalId</code>
|visible|False|If **true** the control will display, otherwise it will be hidden.
|options|False|The options object has one property: <code>hideCertificate</code>. <code>options.hideCertificate</code> specifies whether or not the certificate thumbprint option should be made available.
|constraints|False|The constraints object has three properties: <code>required</code>, <code>regex</code>, and <code>validationMessage</code>. This object defines the regex constraints for password validation. <br><br>1) <code>constraints.required</code> specifies whether there are any constraints required for password validation. <br><br>2) <code>constraints.regex</code> specifies the constraints on password validation as a regular expression. For example, these can be constraints on the length or types of characters in the password. <br><br>3) <code>constraints.validationMessage</code> defines the text to display if the input in the password box does not meet the constraints required to be a valid password.
|fx.feature|False|
<a name="microsoft-common-serviceprincipalselector-ui-sample"></a>
## UI Sample
![alt-text](../media/dx/controls/dx-control-Microsoft.Common.ServicePrincipalSelector.png "UI sample of a ServicePrincipalSelector control")  
![alt-text](../media/dx/controls/dx-control-Microsoft.Common.ServicePrincipalSelector-authenticationType.png "UI sample of a ServicePrincipalSelector control in the Create New scenario specifying Authentication Type")  
![alt-text](../media/dx/controls/dx-control-Microsoft.Common.ServicePrincipalSelector-selectExisting.png "UI sample of a ServicePrincipalSelector in the Select Existing Application scenario")  
<a name="microsoft-common-serviceprincipalselector-sample-snippet"></a>
## Sample Snippet
How to specify a ServicePrincipalSelector
```json

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
  
```
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

<a name="microsoft-common-serviceprincipalselector-sample-snippet-example-output"></a>
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

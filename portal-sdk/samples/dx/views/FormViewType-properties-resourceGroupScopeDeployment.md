
### Top level resource create scenario

This flow is implemented through Form with *deployment* action.

You need to include resourceScope control into first step/first element in your form steps. Add all other elements and steps which are required, when control required scope – pass resourceScope control outputs.

In deployment element specify deployment kind and needed properties, also references to the resourceScope control, set all deployment parameters, supply relative path to your deployment template.

Sample: FormBladeCreate.Dx.jsonc

```json

{
  "$schema": "../../../Definitions/dx.schema.json",
  "view": {
    "kind": "Form",
    "properties": {
      "title": "Create Dx Ibiza Engine resource",
      "steps": [
        {
          "name": "step1",
          "label": "Basics",
          "description": "Add a description of your service here to quickly introduce your service to customers. Also add a Learn More link that links to documentation or Azure's marketing site for your resource type. [Learn more](https://azure.microsoft.com/)",
          "elements": [
            {
              "type": "Microsoft.Common.ResourceScope",
              "name": "resourceScope",
              "resourceName": {
                "label": "Engine name",
                "constraints": {
                  "validations": [
                    {
                      "regex": "^[A-Za-z0-9]{0,6}$",
                      "message": "Name should contain alphanumeric characters only, up to 6 symbols"
                    }
                  ]
                },
                "toolTip": "Name should contain alphanumeric characters only, up to 6 symbols"
              }
            }
          ]
        },
        {
          "name": "tags",
          "label": "Tags",
          "elements": [
            {
              "name": "tagsByResource",
              "type": "Microsoft.Common.TagsByResource",
              "resources": [
                "Providers.Test/statefulIbizaEngines"
              ]
            }
          ]
        }
      ],
      "deployment": {
        "kind": "ResourceGroup",
        "resourceGroupId": "[steps('step1').resourceScope.resourceGroup.id]",
        "parameters": {
          "name": "[steps('step1').resourceScope.resourceName]",
          "location": "centralus"
        },
        "template":
        {
          "file": "../../UiDef/DxExtensionResource/DeploymentTemplate.json"
        }
      }
    }
  }
}
```

#### example of deployment.onSubmit example

This allows a sequence of custom blade to open (as context blade) on user click “submit” to start deployment. Each element in onSubmit array defines an blade reference with condition, input, output and transforms that can updates the deployment parameters that gets sent to ARM.

```json
{
"deployment": {
    "kind": "ResourceGroup",
    "resourceGroupId": "[steps('basics').resourceGroup.value.resourceId]",
    "location": "[if(equals('New', steps('basics').resourceGroup.modeName), steps('basics').location.name, steps('basics').resourceGroup.value.location)]",
    "onSubmit": [
        {
            "condition": "[equals(length(parameters('msAppId')), 0)]",
            "blade": {
                "name": "ConvergedAppRegisterBlade",
                "inContextPane": true,
                "parameters": {
                    "name": "[steps('basics').resourceName]",
                    "hideButton": true
                },
                "outputItem": "app",
                "transforms": {
                    "parameters": "{msAppId:appId,msAppPassword:appPassword}"
                }
            }
        }
    ],
    "parameters": {
        "botId": "[steps('basics').resourceName]",
        "sku": "[steps('basics').botSku]",
        "msAppId": "[coalesce(steps('basics').existingApp.botAppId, '')]",
        "msAppPassword": "[coalesce(steps('basics').existingApp.botAppPassword, '')]"
    },
    "template": {
        "file": "./createWithComposer.json"
    }
}
```
#### Child resources create scenario

To author a Form that implements child resource create you need to have parameters and resources properties defined in Form. All places where you need to specify control scope, or deployment input referencing parent resource properties please use resources() function and corresponding output.

For example:

Form takes resourceId in parameters, specifies apiversion in resources, passes parent resource resourcegroup, name and location to the deployment parameters.

```json
{
    "$schema": "../../../Definitions/dx.schema.json",
    "view": {
        "kind": "Form",
        "parameters": [
            {
                "name": "id",
                "type": "key"
            }
        ],
        "resources": [
            {
                "id": "[parameters('id')]",
                "apiVersion": "2020-03-01-preview"
            }
        ],
        "steps": [
        ],
        "deployment": {
            "kind": "ResourceGroup",
            "resourceGroupId": "[resources().resourceGroupId]",        
            "parameters": {
                "name": "[steps('step1').textbox]",
                "location": "[resources().location]",
                "omsLogAnalyticsWorkspaceName": "[resources().name]"
            },
            "template": {
                "file": "./SavedSearchDeploymentTemplate.json"
            }
        }
    }
}
```

To open this blade in your create flow – add this blade reference in your child resource asset definition as “create” and pass {resourceId} (this is reserved special parameter) – this will reference effectively parent resource Id to the create.

Sample:

```json
{
    "$schema": "../../Definitions/dx.schema.json",
    "stringSource": "Resources/MyAssetStrings.resjson",
    "proxyAssetType": {
        "name": "MyDxChildResource",
        "resourceType": {
        "name": "Microsoft.OperationalInsights/Workspaces/savedSearches",
        "apiVersion": "2020-03-01-preview"
    },
    "displayNames": {
    },
    "icon": "MsPortalFx.Base.Images.Polychromatic.Dashboard", 
    "create": {
        "blade": {
        "name": "SavedSearchCreate_Dx",
        "parameters": {
        "id": "{resourceId}"
        }
    }
},
```

<a name="formviewtype"></a>
# FormViewType

* [FormViewType](#formviewtype)
  * [Description](#formviewtype-description)
  * [Sections](#formviewtype-sections)
  * [Properties Section](#formviewtype-properties-section)
    * [Option 1](#formviewtype-properties-section-option-1)
    * [Option 2](#formviewtype-properties-section-option-2)
    * [Option 3](#formviewtype-properties-section-option-3)
  * [UI Sample](#formviewtype-ui-sample)
  * [Sample Snippet](#formviewtype-sample-snippet)
    * [formViewType details](#formviewtype-sample-snippet-formviewtype-details)
    * [Top level resource create scenario](#formviewtype-sample-snippet-top-level-resource-create-scenario)
    * [Executing ARM request (command) for a resource](#formviewtype-sample-snippet-executing-arm-request-command-for-a-resource)

<a name="formviewtype-description"></a>
## Description

The declarative form view lets you author a form in the portal. Form view can be used as a full screen blade, or in a context pane. A form view can be used for the following three scenarios:

1. Deploy an ARM template (Option 1 in the Properties section below).
1. Perform an ARM call (Option 2 in the Properties section below).
1. Return a list of output to the caller blade. (Option 3 in the Properties section below).

Form view supports tabbed forms, sequential forms (wizards) and simple forms without tabs. When used to deploy an ARM template, it provides the last review and create tab and the post-create experience automatically. You can specify form parameters, resources, title as on any other blade. Forms is a more advanced, newer version of CreateUiDefinition with significant additional capabilities.

<a name="formviewtype-sections"></a>
## Sections

| Name | Required | Description
| ---|:--:|:--:|
|kind|True|Enum permitting the value: "Form"
|export|False|Designation for blade sharing across extensions. If set to `true` then it is available to be used by other extensions.
|contextPaneWidth|False|See [here](dx-enum-contextPaneWidth.md ) for the available options
|parameters|False|Defines the parameters to be passed into a declarative blade, that then can be accessed using the parameters function. See [View parameters](dx-viewTypeParameters.md) for more.
|resources|False|The resources section takes an ARM resource id and apiVersion, which in turn makes a ARM GET request to retrieve the resource details. You can use the resources() function to retrieve the resource payload at runtime.
|dataSources|False|Supports Graph API. Use it to pre-load graph API before the view is rendered. See [here](dx-viewTypeDataSources.md) for **dataSources** property.
|messages|False|Display a banner at the top of the view. See [here](dx-enum-viewTypeMessages-items-kind.md) for details.
|commands|False|The commands section defines the Commands in the command bar.See [here](dx-viewTypeCommands.md) for **commands** property.
|properties|True|The properties section defines the form that needs to be rendered. The tabs needed, the controls in each tab etc. are defined in the properties section.
|outputs|False|Outputs to return a property bag back to the caller blade.
|fx.feature|False|

<a name="formviewtype-properties-section"></a>
## Properties Section

<a name="formviewtype-properties-section-option-1"></a>
### Option 1

<a name="formviewtype-properties-section-option-1-an-object-with-the-following-properties"></a>
##### An object with the following properties

| Name | Required | Description
| ---|:--:|:--:|
|isWizard|False|If true, each step needs to be validated before moving on to next step.
|title|True|Title/header of the Form View displayed at the top of page
|steps|True|To customize step(s) of the Form View. See [here](dx-view-formViewType-properties-formSteps.md) for **steps** property.
|deployment|True|Please include resourceScope control into first step/first element in your form steps. Specify deployment kind and needed properties, also references to the resourceScope control, set all deployment parameters, supply relative path to your deployment template. See [here](dx-view-formViewType-properties-formDeployment.md) for **deployment** property.
|fx.feature|False|

<a name="formviewtype-properties-section-option-2"></a>
### Option 2

<a name="formviewtype-properties-section-option-2-an-object-with-the-following-properties-1"></a>
##### An object with the following properties

| Name | Required | Description
| ---|:--:|:--:|
|isWizard|False|If true, each step needs to be validated before moving on to next step.
|title|True|Title/header of the Form View displayed at the top of page
|primaryButtonLabel|False|Customize primary button display name that is used to start deployment
|steps|True|To customize tab(s) of the Form View. See [here](dx-view-formViewType-properties-formSteps-formStepsWithoutResourceScope.md) for **steps** property.
|armRequest|True|See [here](dx-view-formViewType-properties-formArmRequest.md) for **armRequest** property.
|fx.feature|False|

<a name="formviewtype-properties-section-option-3"></a>
### Option 3

<a name="formviewtype-properties-section-option-3-an-object-with-the-following-properties-2"></a>
##### An object with the following properties

| Name | Required | Description
| ---|:--:|:--:|
|isWizard|False|If true, each step needs to be validated before moving on to next step.
|title|True|Title/header of the Form View displayed at the top of page
|primaryButtonLabel|False|Customize primary button display name that is used to start deployment
|steps|True|To customize tab(s) of the Form View. See [here](dx-view-formViewType-properties-formSteps-formStepsWithoutResourceScope.md) for **steps** property.
|fx.feature|False|

<a name="formviewtype-ui-sample"></a>
## UI Sample

![alt-text](../media/dx/views/formViewType.png "form view UI")

<a name="formviewtype-sample-snippet"></a>
## Sample Snippet

<a name="formviewtype-sample-snippet-formviewtype-details"></a>
### formViewType details

<a name="formviewtype-sample-snippet-formviewtype-details-example-json"></a>
#### example json

``` json
{
  "$schema": "<relative path to dx.schema.json>",
  "view": {
    "kind": "Form",
    "dataSources": [
      {
        "kind": "graph",
        "name": "graph",
        "path": "v1.0/me?$select=displayName,id,mail"
      }
    ],
    "resources": [
      {
        "id": "/subscriptions/7b216101-32eb-4063-aaa3-78a58a87ffb1/resourceGroups/testRG1/providers/Microsoft.Compute/virtualMachines/test1VM",
        "apiVersion": "2017-03-30"
      }
    ],
    "commands": [
      {
        "kind": "RefreshCommand",
        "id": "refreshCommandId",
        "displayName": "refreshCommand",
        "icon": "MsPortalFx.Base.Images.Refresh"
      }
    ],
    "properties": {
      "title": "Test Form View",
      "steps": [
        {
          "name": "basics",
          "label": "Basics",
          "elements": [
            {
              "name": "resourceScope",
              "type": "Microsoft.Common.ResourceScope"
            },
            {
              "name": "textBoxUsingDataSource",
              "type": "Microsoft.Common.TextBox",
              "label": "text box with DataSource",
              "placeholder": "",
              "defaultValue": "[dataSources('graph').displayName]",
              "toolTip": "Use only allowed characters",
              "constraints": {
                "required": true,
                "regex": "^[a-z0-9A-Z]{1,30}$",
                "validationMessage": "Only alphanumeric characters are allowed, and the value must be 1-30 characters long."
              },
              "visible": true
            },
            {
              "name": "textBoxUsingResource",
              "type": "Microsoft.Common.TextBox",
              "label": "text box with Resource",
              "placeholder": "",
              "defaultValue": "[resources().name]",
              "toolTip": "Use only allowed characters",
              "constraints": {
                "required": true,
                "regex": "^[a-z0-9A-Z]{1,30}$",
                "validationMessage": "Only alphanumeric characters are allowed, and the value must be 1-30 characters long."
              },
              "visible": true
            }
          ]
        },
        {
          "name": "tags",
          "label": "Tags",
          "elements": [
            {
              "name": "tagsByResource",
              "type": "Microsoft.Common.TagsByResource",
              "resources": [
                "Microsoft.Storage/storageAccounts",
                "Microsoft.Compute/virtualMachines"
              ]
            }
          ]
        }
      ],
      "deployment": {
        "parameters": {
          "tagsByResource": "[steps('tags').tagsByResource]"
        },
        "kind": "ResourceGroup",
        "location": "[steps('basics').resourceScope.location.name]",
        "resourceGroupId": "[steps('basics').resourceScope.resourceGroup.id]",
        "template": {
          "file": "<ARM deployment template relative path>"
        }
      }
    }
  }
}
```

<a name="formviewtype-sample-snippet-top-level-resource-create-scenario"></a>
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

<a name="formviewtype-sample-snippet-top-level-resource-create-scenario-example-of-deployment-onsubmit-example"></a>
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

<a name="formviewtype-sample-snippet-top-level-resource-create-scenario-child-resources-create-scenario"></a>
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
    "steps": [],
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
    "displayNames": {},
    "icon": "MsPortalFx.Base.Images.Polychromatic.Dashboard", 
    "create": {
      "blade": {
        "name": "SavedSearchCreate_Dx",
        "parameters": {
          "id": "{resourceId}"
        }
      }
    }
  }
}
```

<a name="formviewtype-sample-snippet-executing-arm-request-command-for-a-resource"></a>
### Executing ARM request (command) for a resource

If you need to add a command to execute, for example, POST action for your resource, you need to add a command to your view and reference Form blade that implements ARM request scenario.

Supported methods: PUT, POST, PATCH

Patch is available from SDK 6.724.0.5. parameters

Form sample:

Takes resource id in parameters, specifies apiversion for the resource in resources, says armrequest as an action, constructs path using resources() function, passes body using Form inputs (could be any function, resources(), steps()…)

FormBladeArmRequest.Dx.json:

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
        "apiVersion": "2014-04-01"
      }
    ],
    "properties": {
      "title": "Form blade: please fill in values",
      "steps": [
      ],
      "armRequest": {
        "path": "[concat(resources().id, '/actionName?api-version=2014-04-01')]",
        "method": "POST",
        "body": "[parse(concat('{\"location\":', string(resources().location), '}'))]"
      }
    }
  }
}
```

Command:

If you parent blade is a declarative blade: add the below into commands section.

```json
{
  "icon": "MsPortalFx.Base.Images.ArrowUp",
  "id": "formarmrequestCommand",
  "kind": "OpenBladeCommand",
  "displayName": {
    "property": "formArmRequest"
  },
  "blade": {
    "name": "FormBladeArmRequest_Dx",
    "inContextPane": true,
    "parameters": {
      "id": "[parameters('id')]"
    }
  }
}
```

From SDK 7.4.0.5 you may customize primary button label(optional) in view properties. Default label is “Submit”.

```json
"properties": {
  "primaryButtonLabel": "Execute ARM request",
}
```

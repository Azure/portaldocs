
### formViewType details

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
      },
```
From SDK 7.4.0.5 you may customize primary button label(optional) in view properties. Default label is “Submit”.

```json
"properties": {
    "primaryButtonLabel": "Execute ARM request",
}
```

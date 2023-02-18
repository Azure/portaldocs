### Executing Cloud Shell commands using form based parameters


If you need to add a list of cloud shell commands to execute, for example, in bash environment, you need to add commands to your view and reference Form blade that implements Cloud Shell scenario.

Supported shell environments: bash, powershell

Form sample:

Says **cloudShell** as an action, defines **kind** of Cloud Shell environment to execute in, constructs array of **commands** passing **name** of command, and an array of **arguments** (can be optional) that the command expects. An argument is constructed using **property**, and **value** (can be optional) using Form inputs (could be any function, resources(), steps()…)

FormBladeCloudShell.Dx.json:

```json
{
    "$schema": "../../../Definitions/dx.schema.json",
    "view": {
        "kind": "Form",
        "properties": {
            "primaryButtonLabel": "Run Shell Commands",
            "steps": [
                {
                    "name": "arguments",
                    "label": "Cloud Shell arguments",
                    "elements": [
                        {
                            "name": "name",
                            "type": "Microsoft.Common.TextBox",
                            "label": "Resource name",
                            "defaultValue": "",
                            "visible": true
                        }
                    ]
                }
            ],
            "cloudShell": {
                "kind": "bash",
                "commands": [
                    {

                        "name": "az",
                        "arguments": [
                            {
                                "property": "resource"
                            },
                            {
                                "property": "list"
                            },
                            {
                                "property": "--name ",
                                "value": "[steps('arguments').name]"
                            }
                        ]
                    }
                ]
            }
        }
    }
}
```
Command:

If your parent blade is a declarative blade: add the below into commands section.

```json
      {
        "icon": "MsPortalFx.Base.Images.ArrowUp",
        "id": "formcloudshellCommand",
        "kind": "OpenBladeCommand",
        "displayName": {
          "property": "formCloudShell"
        },
        "blade": {
          "name": "FormBladeCloudShell_Dx",
          "inContextPane": true
        }
      },
```
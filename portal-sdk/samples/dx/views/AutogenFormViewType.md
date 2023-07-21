### AutogenFormViewType details
To Convert to FormBlade, place ARM template file path under view.properties.deployment.template.file

#### example json

```json
{
  "$schema": "../../../Definitions/dx.schema.json",
  "view": {
    "kind": "AutogenForm",
    "properties": {
      "title": "Create Dx Ibiza Engine resource",
      "deployment": {
        "kind": "ResourceGroup",
        "template": {
          "file": "{ARM template file path}"
        }
      }
    }
  }
}

```

```json

{
  "$schema": "../../../Definitions/dx.schema.json",
  "view": {
    "kind": "AutogenForm",
    "parameters": [
        {
            "name": "parentId",
            "type": "key"
        }
    ],
    "resources": [
        {
            "id": "[parameters('parentId')]",
            "apiVersion": "0000-00-00"
        }
    ],
    "properties": {
      "title": "Create Dx Ibiza Engine resource",
      "deployment": {
        "kind": "ResourceGroup",
        "primaryResourceId": "[resources().id]",
        "templateParametersDefaultValueOverrides": {
          "profileName": "[resourceId(resources().id).name]"
        },
        "template": {
          "file": "{ARM template file path}"
        }
      }
    }
  }
}
```

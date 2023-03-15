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
      "kind": "Deployment",
      "template": {
        "file": "../../UiDef/DxExtensionResource/DeploymentTemplate.json"
      }
    }
  }
}

```


### Example 1

```json
{
    "name": "vmName",
    "type": "Microsoft.Common.TextBox",
    "label": "Application name",
    "toolTip": "Assign a name to your Azure application",
    "defaultValue": "",
    "constraints": {
        "required": true,
        "regex": "[a-z][a-z0-9-]{2,5}[a-z0-9]$",
        "validationMessage": "Must be 3-5 characters."
    }
}
```

### Example 2

```json
{
  "name": "nameInstance",
  "type": "Microsoft.Common.TextBox",
  "label": "Name",
  "defaultValue": "contoso123",
  "toolTip": "Use only allowed characters",
  "placeholder": "",
  "multiLine": false,
  "constraints": {
    "required": true,
    "validations": [
      {
        "regex": "^[a-z0-9A-Z]{1,30}$",
        "message": "Only alphanumeric characters are allowed, and the value must be 1-30 characters long."
      },
      {
        "isValid": "[startsWith(steps('resourceConfig').nameInstance, 'contoso')]",
        "message": "Must start with 'contoso'."
      }
    ]
  },
  "visible": true
}
```

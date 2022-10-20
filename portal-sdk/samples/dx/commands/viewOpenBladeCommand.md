#### OpenBladeCommand

Use: Browse Commands, View Commands

Views: {resourceid} can be used to reference the resource id of the contextual resource.

```json
{
    "icon": "MsPortalFx.Base.Images.ArrowUp",
    "id": "formarmrequestCommand",
    "kind": "OpenBladeCommand",
    "displayName": {
        "property": "formArmRequest"
    },
    "blade": {
        "name": "FormBladeArmRequest_Dx",
        "parameters": {
        "id": "[parameters('id')]"
        }
    }
},
{
    "icon": "MsPortalFx.Base.Images.Book",
    "id": "formreadonlyCommand",
    "kind": "OpenBladeCommand",
    "displayName": {
        "property": "formReadonly"
    },
    "blade": {
        "name": "FormBladeReadonly_Dx",
        "parameters": {
        "id": "[parameters('id')]"
        },
        "inContextPane": true
    }
},
```

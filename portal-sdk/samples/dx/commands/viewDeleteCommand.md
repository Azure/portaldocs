
#### DeleteCommand

Use: View Commands

```json
{
    "kind": "DeleteCommand",
    "id": "deleteCommand",
    "displayName": {
        "property": "delete"
    },
    "icon": "MsPortalFx.Base.Images.Delete",
    "confirmation": {
        "title": {
        "property": "deleteResourceTitle"
        },
        "message": {
        "property": "deleteResourceMessage"
        },
        "dependentResources": [
            {
                "apiVersion": "2021-02-01-preview",
                "resourceType": "Microsoft.Network/networkSecurityPerimeters/profiles/accessRules",
                "icon": {
                    "file": "../../Content/SVG/PerimeterAccessRules.svg"
                }
            }
        ]
    },
    "definition": {
        "apiVersion": "2014-04-01"
    }
},
```

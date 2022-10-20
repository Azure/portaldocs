
#### OpenMarketplaceCommandWithContent

Use: Browse Commands, View Commands
Has to be used under MenuCommand

Views: {resourceid} can be used to reference the resource id of the contextual resource.

```json
{
    "kind": "MenuCommand",
    "id": "OpenCreateCommandId",
    "displayName": "openCreate",
    "icon": "MsPortalFx.Base.Images.AddTeamMember",
    "commands": [
        {
            "kind": "OpenBladeCommand",
            "id": "OpenBladeCommandId1",
            "displayName": "openBlade",
            "ariaLabel": "openBlade",
            "content": "content:Second line description",
            "icon": "MsPortalFx.Base.Images.Save",
            "blade": {
                "name": "MarkdownView_Dx",
                "parameters": {
                    "foo": "foo"
                },
                "inContextPane": true
            }
        },
        {
            "kind": "OpenMarketplaceCommand",
            "id": "OpenMarketplaceCommandId1",
            "displayName": "openMarketplace",
            "icon": "MsPortalFx.Base.Images.Save",
            "content": "content:Second line description",
            "marketplaceItemId": "Microsoft.WindowsServer2016Datacenter-ARM",
            "disabled": false
        }
    ]
},
```

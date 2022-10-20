
#### MenuCommand

Use: Browse Commands, View Commands

Browse acceptable child commands:
* OpenBladeCommand

View acceptable child commands:

* [viewOpenBladeCommand](dx-viewTypeCommands-viewOpenBladeCommand.md)or [viewOpenBladeCommandWithContent](dx-viewTypeCommands-viewOpenBladeCommandWithContent.md)
* [viewOpenMarketplaceCommand](dx-viewTypeCommands-viewOpenMarketplaceCommand.md) or [viewOpenMarketplaceCommandWithContent](dx-viewTypeCommands-viewOpenMarketplaceCommandWithContent.md)
* [viewArmCommand](dx-viewTypeCommands-viewArmCommand.md)
* [viewDeleteCommand](dx-viewTypeCommands-viewDeleteCommand.md)
* [viewMoveCommand](dx-viewTypeCommands-viewMoveCommand.md)
* [viewRefreshCommand](dx-viewTypeCommands-viewRefreshCommand.md)

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

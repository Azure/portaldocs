<a name="viewtypecommands-viewopenmarketplacecommandwithcontent"></a>
# viewTypeCommands-viewOpenMarketplaceCommandWithContent
* [viewTypeCommands-viewOpenMarketplaceCommandWithContent](#viewtypecommands-viewopenmarketplacecommandwithcontent)
    * [Definitions:](#viewtypecommands-viewopenmarketplacecommandwithcontent-definitions)
    * [UI Sample](#viewtypecommands-viewopenmarketplacecommandwithcontent-ui-sample)
    * [Sample Snippet](#viewtypecommands-viewopenmarketplacecommandwithcontent-sample-snippet)

<a name="viewtypecommands-viewopenmarketplacecommandwithcontent-definitions"></a>
## Definitions:
<a name="viewtypecommands-viewopenmarketplacecommandwithcontent-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|kind|False|Enum permitting the value: "OpenMarketplaceCommand"
|id|False|Id of the command
|displayName|False|Display name of the command
|ariaLabel|False|label of the command used for screen reader users.
|content|False|Second line description of the command
|tooltip|False|tooltip of the command
|icon|False|Icon to display with the command
|marketplaceItemId|True|A marketplace item id to open through this command
|disabled|False|Disables the command when it evaluates to true. When disabled, the command is not clickable and is greyed out.
|fx.feature|False|
<a name="viewtypecommands-viewopenmarketplacecommandwithcontent-ui-sample"></a>
## UI Sample
![alt-text](../media/dx/commands/viewOpenMarketplaceCommandWithContent.png "viewOpenMarketplaceCommandWithContent UI")  
<a name="viewtypecommands-viewopenmarketplacecommandwithcontent-sample-snippet"></a>
## Sample Snippet
  
<a name="viewtypecommands-viewopenmarketplacecommandwithcontent-sample-snippet-openmarketplacecommandwithcontent"></a>
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


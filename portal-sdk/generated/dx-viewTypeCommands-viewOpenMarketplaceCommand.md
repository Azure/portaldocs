<a name="viewtypecommands-viewopenmarketplacecommand"></a>
# viewTypeCommands-viewOpenMarketplaceCommand
* [viewTypeCommands-viewOpenMarketplaceCommand](#viewtypecommands-viewopenmarketplacecommand)
    * [Definitions:](#viewtypecommands-viewopenmarketplacecommand-definitions)
    * [UI Sample](#viewtypecommands-viewopenmarketplacecommand-ui-sample)
    * [Sample Snippet](#viewtypecommands-viewopenmarketplacecommand-sample-snippet)

<a name="viewtypecommands-viewopenmarketplacecommand-definitions"></a>
## Definitions:
<a name="viewtypecommands-viewopenmarketplacecommand-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|kind|False|Enum permitting the value: "OpenMarketplaceCommand"
|id|False|Id of the command
|displayName|False|Display name of the command
|ariaLabel|False|label of the command used for screen reader users.
|tooltip|False|tooltip of the command
|icon|False|Icon to display with the command
|marketplaceItemId|True|A marketplace item id to open through this command
|disabled|False|Disables the command when it evaluates to true. When disabled, the command is not clickable and is greyed out.
|fx.feature|False|
<a name="viewtypecommands-viewopenmarketplacecommand-ui-sample"></a>
## UI Sample
![alt-text](../media/dx/commands/viewOpenMarketplaceCommand.png "viewOpenMarketplaceCommand UI")  
<a name="viewtypecommands-viewopenmarketplacecommand-sample-snippet"></a>
## Sample Snippet
  
<a name="viewtypecommands-viewopenmarketplacecommand-sample-snippet-openmarketplacecommand"></a>
#### OpenMarketplaceCommand

Use: Browse Commands, View Commands

```json
{
    "kind": "OpenMarketplaceCommand",
    "id": "OpenMarketplaceId1",
    "displayName": "openMarketplace",
    "icon": "MsPortalFx.Base.Images.Save",
    "marketplaceItemId": "Microsoft.WindowsServer2016Datacenter-ARM",
    "disabled": false
}
```


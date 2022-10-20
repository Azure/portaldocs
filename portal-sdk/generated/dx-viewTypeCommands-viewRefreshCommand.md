<a name="viewtypecommands-viewrefreshcommand"></a>
# viewTypeCommands-viewRefreshCommand
* [viewTypeCommands-viewRefreshCommand](#viewtypecommands-viewrefreshcommand)
    * [Definitions:](#viewtypecommands-viewrefreshcommand-definitions)
    * [UI Sample](#viewtypecommands-viewrefreshcommand-ui-sample)
    * [Sample Snippet](#viewtypecommands-viewrefreshcommand-sample-snippet)

<a name="viewtypecommands-viewrefreshcommand-definitions"></a>
## Definitions:
<a name="viewtypecommands-viewrefreshcommand-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|kind|False|Enum permitting the value: "RefreshCommand"
|id|True|Id of the command
|displayName|True|Display name of the command
|ariaLabel|False|label of the command used for screen reader users.
|tooltip|False|tooltip of the command
|icon|False|Icon to display with the command
|fx.feature|False|
<a name="viewtypecommands-viewrefreshcommand-ui-sample"></a>
## UI Sample
![alt-text](../media/dx/commands/viewRefreshCommand.png "viewRefreshCommand UI")  
<a name="viewtypecommands-viewrefreshcommand-sample-snippet"></a>
## Sample Snippet
  
<a name="viewtypecommands-viewrefreshcommand-sample-snippet-refreshcommand"></a>
#### RefreshCommand

Use: View Commands

```json
{
    "kind": "RefreshCommand",
    "id": "refreshCommandId",
    "displayName": "refreshCommand",
    "icon": "MsPortalFx.Base.Images.Refresh"
}
```


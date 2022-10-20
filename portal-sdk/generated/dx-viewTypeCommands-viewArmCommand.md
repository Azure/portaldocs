<a name="viewtypecommands-viewarmcommand"></a>
# viewTypeCommands-viewArmCommand
* [viewTypeCommands-viewArmCommand](#viewtypecommands-viewarmcommand)
    * [Definitions:](#viewtypecommands-viewarmcommand-definitions)
    * [UI Sample](#viewtypecommands-viewarmcommand-ui-sample)
    * [Sample Snippet](#viewtypecommands-viewarmcommand-sample-snippet)

<a name="viewtypecommands-viewarmcommand-definitions"></a>
## Definitions:
<a name="viewtypecommands-viewarmcommand-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|kind|False|Enum permitting the value: "ArmCommand"
|id|True|Id of the command
|displayName|True|Display name of the command
|ariaLabel|False|Label of the command used for screen reader users.
|tooltip|False|tooltip of the command
|icon|False|Icon to display with the command
|disabled|False|Disables the command when it evaluates to true. When disabled, the command is not clickable and is greyed out.
|confirmation|False|Confirmation message box that appears when clicking command
|definition|True|See [here](dx-viewArmCommand-properties-definition.md) for more on definition.
|fx.feature|False|
<a name="viewtypecommands-viewarmcommand-ui-sample"></a>
## UI Sample
![alt-text](../media/dx/commands/viewArmCommand.png "viewArmCommand UI")  
<a name="viewtypecommands-viewarmcommand-sample-snippet"></a>
## Sample Snippet
  #### ArmCommand

Use: View Commands

Only Post is supported for the httpMethod, use DeleteCommand for delete.

{resourceid} can be used to reference the resource id of the contextual resource.

```json
{
    "kind": "ArmCommand",
    "id": "command1",
    "displayName": "schemaCommand",
    "icon": "MsPortalFx.Base.Images.Delete",
    "confirmation": {
        "title": "schemaConfirmationTitle",
        "message": "schemaConfirmationMessage"
    },
    "definition": {
        "httpMethod": "post",
        "uri": "{resourceid}/schema?api-version=2020-03-01-preview"
    },
"disabled": false
},
{
    "kind": "ArmCommand",
    "id": "startButtonID",
    "displayName": "start",
    "icon": "MsPortalFx.Base.Images.Start",
    "disabled": "[equals(resources('vmInstanceView').properties.instanceView.statuses.1.code, 'PowerState/running')]",
    "definition": {
    "httpMethod": "post",
    "uri": "{resourceid}/start?api-version=2020-12-01"
    }
},
{
    "kind": "ArmCommand",
    "id": "restartButtonID",
    "displayName": "restart",
    "icon": "MsPortalFx.Base.Images.Redo",
    "disabled": "[contains(resources('vmInstanceView').properties.instanceView.statuses.1.code, '/deallocated')]",
    "definition": {
    "httpMethod": "post",
    "uri": "{resourceid}/restart?api-version=2020-12-01"
}

```


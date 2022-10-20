<a name="viewtypecommands-viewopenbladecommand"></a>
# viewTypeCommands-viewOpenBladeCommand
* [viewTypeCommands-viewOpenBladeCommand](#viewtypecommands-viewopenbladecommand)
    * [Definitions:](#viewtypecommands-viewopenbladecommand-definitions)
    * [UI Sample](#viewtypecommands-viewopenbladecommand-ui-sample)
    * [Sample Snippet](#viewtypecommands-viewopenbladecommand-sample-snippet)

<a name="viewtypecommands-viewopenbladecommand-definitions"></a>
## Definitions:
<a name="viewtypecommands-viewopenbladecommand-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|kind|False|Enum permitting the value: "OpenBladeCommand"
|id|False|Id of the command
|displayName|False|Display name of the command
|ariaLabel|False|label of the command used for screen reader users.
|tooltip|False|tooltip of the command
|icon|False|Icon to display with the command
|blade|True|See [here](dx-bladeReferenceWithContextPane.md) for more on bladeReferenceWithContextPane.
|disabled|False|Disables the command when it evaluates to true. When disabled, the command is not clickable and is greyed out.
|fx.feature|False|
<a name="viewtypecommands-viewopenbladecommand-ui-sample"></a>
## UI Sample
![alt-text](../media/dx/commands/viewOpenBladeCommand.png "viewOpenBladeCommand UI")  
<a name="viewtypecommands-viewopenbladecommand-sample-snippet"></a>
## Sample Snippet
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


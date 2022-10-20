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

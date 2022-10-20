<a name="viewtypecommands"></a>
# viewTypeCommands
* [viewTypeCommands](#viewtypecommands)
    * [Description](#viewtypecommands-description)
    * [Guidance](#viewtypecommands-guidance)
    * [Definitions:](#viewtypecommands-definitions)
        * [An array of items, where each item is of the type:](#viewtypecommands-definitions-an-array-of-items-where-each-item-is-of-the-type)

<a name="viewtypecommands-description"></a>
## Description
Array of command items to render in the command bar of the view.
<a name="viewtypecommands-guidance"></a>
## Guidance

<a name="viewtypecommands-guidance-viewtypecommands-1"></a>
#### ViewTypeCommands

A command bar is an array of commands. Each command in the command bar should be of one of the following types -

* [viewOpenBladeCommand](dx-viewTypeCommands-viewOpenBladeCommand.md)
* [viewOpenMarketplaceCommand](dx-viewTypeCommands-viewOpenMarketplaceCommand.md)
* [viewMenuCommand](dx-viewTypeCommands-viewMenuCommand.md)
* [viewArmCommand](dx-viewTypeCommands-viewArmCommand.md)
* [viewDeleteCommand](dx-viewTypeCommands-viewDeleteCommand.md)
* [viewMoveCommand](dx-viewTypeCommands-viewMoveCommand.md)
* [viewRefreshCommand](dx-viewTypeCommands-viewRefreshCommand.md)


For `viewMenuCommand` command, you can define a dropdown (array) of commands of the following types -
* [viewOpenBladeCommandWithContent](dx-viewTypeCommands-viewOpenBladeCommandWithContent.md)
* [viewOpenMarketplaceCommandWithContent](dx-viewTypeCommands-viewOpenMarketplaceCommandWithContent.md)
* [viewArmCommand](dx-viewTypeCommands-viewArmCommand.md)
* [viewDeleteCommand](dx-viewTypeCommands-viewDeleteCommand.md)
* [viewMoveCommand](dx-viewTypeCommands-viewMoveCommand.md)
* [viewRefreshCommand](dx-viewTypeCommands-viewRefreshCommand.md)
 
<a name="viewtypecommands-definitions"></a>
## Definitions:
<a name="viewtypecommands-definitions-an-array-of-items-where-each-item-is-of-the-type"></a>
### An array of items, where each item is of the type:
<a name="viewtypecommands-definitions-an-array-of-items-where-each-item-is-of-the-type-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|kind|True|See [here](dx-enum-viewCommandKinds-kind.md) for more on Command kinds.
|fx.feature|False|
|id|True|Id of the command
|displayName|True|Display name of the command
|ariaLabel|False|label of the command used for screen reader users.
|tooltip|False|tooltip of the command
|icon|True|Icon to display with the command
|blade|True|See [here](dx-bladeReferenceWithContextPane.md) for more on bladeReferenceWithContextPane.
|disabled|False|Disables the command when it evaluates to true. When disabled, the command is not clickable and is greyed out.

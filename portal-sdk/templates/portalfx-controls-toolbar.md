
## Toolbar control
![Toolbar][toolbar]

The toolbar control provides an easy way to connect user-initiated commands with other controls. Toolbars can be added on custom part templates with the following html:

```html
<div data-bind="pcToolbar: toolbarVM" >
```

### Toolbar items
Toolbars are made up of toolbar items. Most toolbar items are buttons. Toolbar button types can do the following:

* Perform a command
* Open a link
* Open a blade
* Open a list
* Open a dialog
* Toggle on/off

All toolbar buttons have icons and labels.

```ts
var commandButtonViewModel: FxToolbars.CommandButton<string> = new FxToolbars.CommandButton<string>();
commandButtonViewModel.label(ClientResources.toolbarCommitCommand);
commandButtonViewModel.icon(Image.Commit());
```

A simple command button also takes a command context, and a command.

```ts               
commandButtonViewModel.commandContext(ClientResources.toolbarCommitCommand);
commandButtonViewModel.command = new TestCommand({ resultTextBox: this.textBoxVM, itemViewModel: commandViewModel });
```

Items can then be bulk added to your toolbar.

```ts
var items: FxToolbars.ToolbarItemContract[] = [];
items.push(commandButtonViewModel);
...

this.toolbarVM = new MsPortalFx.ViewModels.Toolbars.Toolbar();
this.toolbarVM.setItems(items);
```

A full sample of a part toolbar can be found here:
`\Client\Controls\Toolbar\ViewModels\ToolbarViewModels.ts`

[toolbar]: ../media/portalfx-ui-concepts/toolbar.png
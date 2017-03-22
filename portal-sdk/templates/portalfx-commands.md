
### Introduction to Commands
Commands provide a way by which users can complete an action. Samples of common commands include:

* Restarting a website
* Saving settings on a form
* Launching an external URL

They are surfaced in multiple forms through the portal:

* Blades via the command bar
* Parts via context menu
* Lists via context menu

Commands have the ability to execute code, show dialogs, track progress, open blades, and open external URLs.

#### Commands on Blades

Blade commands provide a prominent area in the design to allow users to
perform common actions.

![Commands on a blade][commands-on-a-blade]

To define a blade command, the first step is to create the command definition
in PDL. A command can be directly attached to a given blade. All commands
define a string resource key for their text, and a view model that describes
their behavior:

`\Client\Commands\SimpleBladeCommand\SimpleBladeCommand.pdl`

```xml
<Blade Name="SimpleBladeCommandBlade"
       ViewModel="SimpleBladeCommandBladeViewModel">
    <!-- Blade commands -->
    <Blade.Commands>
      <Command Text="SamplesExtension.Resources.Strings.simpleBladeCommandTextResourceKey"
               ViewModel="SimpleBladeCommandViewModel" />
    </Blade.Commands>
</Blade>
```

PDL describes the definition for the command, the view model describes the _behavior_. The simplest command view model only needs to implement the
`execute()` method:

`\Client\Commands\SimpleBladeCommand\ViewModels\SimpleBladeCommandViewModels.ts`


```ts
/**
 * Simple blade command view model.
 */
export class SimpleBladeCommandViewModel extends MsPortalFx.ViewModels.Command {

    /**
     * Command view model constructor.
     */
    constructor(container: MsPortalFx.ViewModels.ContainerContract,
                initialValue: any,
                dataContext: DataContext) {
        super();
    }

    public execute(): void {
        console.log(SamplesExtension.Resources.Strings.bladeCommandMessage);
    }
}
```

#### Command Groups

In the sample above, a `Command` element is defined inside of the blade.
Oftentimes, extension developers will want to use the same set of commands in
multiple contexts (on a blade and on the context menu of a part). To use the
same set of commands in multiple places, use the `CommandGroup` element in
PDL:

`\Client\Scenarios\ContactManagement\ContactManagement.pdl`

```xml
<Definition xmlns="[http://schemas.microsoft.com/aux/2013/pdl&quot](http://schemas.microsoft.com/aux/2013/pdl&quot)"
            Area="Scenarios">

  <!-- Command group associated to Contact assets -->
  <CommandGroup Name="ContactCommands">
    <Command Name="BlockContact"
             Text="SamplesExtension.Resources.Strings.blockText"
             ViewModel="BlockContactCommand">
        <Property Name="id" Source="{DataInput Property=id}" />
    </Command>
    <Command Name="DeleteContact"
             Text="SamplesExtension.Resources.Strings.deleteCommandTextResourceKey"
             ViewModel="DeleteContactCommand">
        <Property Name="id" Source="{DataInput Property=id}" />
    </Command>
  </CommandGroup>
  ...
</Definition>
```

The `CommandGroup` is created inside of the definition element, and can be
applied to other blades or parts. CommandGroups are referenced by blades and
parts using a `CommandGroupReference` element:

`\Client\Scenarios\ContactManagement\ContactManagement.pdl`

```xml
<Blade Name="ContactHomeBlade"
       ViewModel="ContactHomeBladeViewModel">

  <Blade.Parameters>
    <Parameter Name="id" Type="Key" />
  </Blade.Parameters>

  <CommandGroupReference Name="ContactCommands">
    <CommandBindings Command="BlockContact">
      <Binding Property="id" Source="{BladeParameter id}" />
    </CommandBindings>
    <CommandBindings Command="DeleteContact">
      <Binding Property="id" Source="{BladeParameter id}" />
    </CommandBindings>
  </CommandGroupReference>
  ...
</Blade>
```

CommandGroupReferences may also be referenced by parts:

`\Client\Commands\Delete\DeleteCommand.pdl`

```xml
<CustomPart Name="DeleteCommandDetailsPart"
            ViewModel="DeleteCommandDetailsPartViewModel"
            Template="{Html Source='Templates\Car.html'}">
  <CustomPart.Properties>
    <Property Name="id" Source="{BladeParameter Name=id}" />
  </CustomPart.Properties>
  <CommandGroupReference Name="CarCommands" />
</CustomPart>
```

Command group references allow for greater reuse of commands between both
blades and parts.

#### Command Bindings

In most cases, commands will operate on a specific piece of data. For example,
the user may want to restart the website with the id '42'. Information that
needs to be passed into a command is done through a `binding`. The bindings
use by commands are the same as bindings used by parts - information is bound
from a blade parameter, or another part on the same blade. In the following
sample, a binding is used to read an `id` field from a blade parameter, which
is then passed into the `onInputsSet()` method of the view model:

`\Client\Scenarios\ContactManagement\ContactManagement.pdl`

```xml
<Blade Name="ContactHomeBlade"
       ViewModel="ContactHomeBladeViewModel">

  <Blade.Parameters>
    <Parameter Name="id" Type="Key" />
  </Blade.Parameters>

  <CommandGroupReference Name="ContactCommands">
    <CommandBindings Command="BlockContact">
      <Binding Property="id" Source="{BladeParameter id}" />
    </CommandBindings>
    <CommandBindings Command="DeleteContact">
      <Binding Property="id" Source="{BladeParameter id}" />
    </CommandBindings>
  </CommandGroupReference>
  ...
</Blade>
```


The bindings used by commands operate in the same method as bindings on parts.
The `id` property for the `BlockContact` command will be passed in (along with
all other inputs to the command) into the `onInputsSet()` method of the view
model:

`\Client\Scenarios\ContactManagement\ViewModels\ContactCommandsViewModels.ts`

```ts
export class BlockContactCommand extends MsPortalFx.ViewModels.Command {

    private _id: KnockoutObservable<any> = ko.observable();
    ...

    /**
     * Creates a new instance of the command view model.
     */
    constructor(container: MsPortalFx.ViewModels.ContainerContract,
                initialState: any,
                dataContext: DataContext) {
        super();
        ...
    }

    /**
     * Invoked when the Commands input properties change.
     */
    public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
        this._id(inputs.id);
        return null; // No need to load anything
    }
    ...
```

In the code above, the `id` parameter is read from the inputs object, and
applied as a class variable. The `execute` method then can operate based on
the available inputs.

## Commands on Parts

While blades expose commands via the command bar, parts expose commands
through the right click context menu:

The snippet above shows how to create a `CommandGroup` element that can be
referenced from multiple blades and _multiple parts_. The `Blade`, `Part`, and
`CustomPart` elements all support the use of a `CommandGroupReference` element
which binds an existing command group into the current part:

`\Client\Commands\Dialogs\CommandDialogs.pdl`

```xml
<CustomPart Name="CommandDialogsSimplePart"
            ViewModel="CommandDialogsSimplePartViewModel"
            Template="{Html Source='Templates\PartWithContextMenu.html'}">

  <!--Association to command group at part level happens here-->
  <CommandGroupReference Name="commandDialogsGroup" />
</CustomPart>
```

The view model on a part level command will behave consistently with any other
type of command.

### Commands on List Items

In many cases, the same entity is visualized by a blade, a part, and a row in
a grid:

![Commands on a list item][commands-on-a-list-item]

Commands are attached to items in a list via `commandGroup` property which
must be present on the _model_ object bound into the grid. For example, the
`Contact` object should contain a `commandGroup` property along with its other
standard public members. If you're using generated interfaces, this property
can be added to your C# model class:

`\SamplesExtension.DataModels\Contact.cs`

```cs
[TypeMetadataModel(typeof(Contact), "SamplesExtension.DataModels")]
public class Contact
{
    /// <summary>
    /// Gets or sets the unique identifier of the contact.
    /// </summary>
    [Key]
    public int Id { get; set; }

    /// <summary>
    /// Gets or sets the contact name.
    /// </summary>
    public string Name { get; set; }

    ...

    /// <summary>
    /// Gets or sets the command group associated to the contact.
    /// </summary>
    public string CommandGroup { get; set; }
}
```

The `commandGroup` property referenced in the model needs to match a
`CommandGroup` element declared in the `Definition` element of a PDL file.

#### Sharing Commands
Commands can be shared between command groups and between extensions.

In order to share a command it must be marked as exported in PDL.

```xml
<CommandGroup>
  <Command Name="MyExportedCommand" Export="true">
    <!-- The shared command declares its expected inputs -->
    <Property Name="commandInput" Source="{DataInput Property=input}" />
  </Command>
</CommandGroup>
```

The consuming `CommandGroup` can use the `CommandReference` tag to import a shared command.

```xml
<CommandGroup>
  <CommandReference Name="MyImportedCommand" CommandType="MyExportedCommand" Extension="ExportingExtension">
    <!-- The command reference must satisfy all expected inputs -->
    <Binding Property="commandInput" Source="{Constant myInput}" />
  </CommandReference>
</CommandGroup>
```

Note that the `Extension` attribute in the `CommandReference` can be omitted if the exported command exists in the same extension.

#### Sharing Commands Restrictions

- Only `Commands` declared in `CommandGroups` are allowed to be exported.
- *All* input properties declared on a `Command` must be re-declared on its `CommandReference` with a default value (using a `Constant` binding). This is a limitation of the compiler that will be addressed some time in the future.

### Dialogs

For many commands, especially destructive operations, you may want to prompt
the user before continuing. Commands support dialogs to provide this
functionality:

![Command dialogs][command-dialogs]

Dialogs are entirely managed inside of the command view model. The
`MsPortalFx.ViewModels.Command` base view model class provides a `dialog()`
method which raises the prompt. This method accepts an
`MsPortalFx.ViewModels.MessageBox` instance. The UI for a dialog is controlled
by the shell. The following sets of buttons are provided:

* Abort / Retry / Ignore
* Ok
* Ok / Cancel
* Retry / Cancel
* Yes / No
* Yes / No / Cancel

The `dialog()` method is usually invoked from the `execute()` method in the
command view model:

`\Client\Commands\Dialogs\ViewModels\CommandDialogsViewModels.ts`

```ts
public execute(): void {
    var confirmationMessageBox = new MsPortalFx.ViewModels.MessageBox(
        "Are you sure you want to stop the site?",
        "The site has been stopped.",
        MsPortalFx.ViewModels.MessageBoxButtons.YesNo);
    this.dialog(confirmationMessageBox);
}
```

Ideally the strings provided above are localized resources. When the user
clicks on one of the command buttons, the `dialogClick()` method is invoked on
the command view model. The method accepts a
`MsPortalFx.ViewModels.DialogResult` argument, which notes the result of the
user action.

`\Client\Commands\Dialogs\ViewModels\CommandDialogsViewModels.ts`

```ts
public dialogClick(result: MsPortalFx.ViewModels.DialogResult): void {
    // Figure out which is the current message box
    var currentDialog = this.dialog();

    // Take action according to the current message box and the clicked message box button
    switch (currentDialog) {
        case this._confirmationMessageBox:
            if (result === MsPortalFx.ViewModels.DialogResult.Yes) {
                // Disable the command to prevent further interaction
                this.enabled(false);

                // stop the site
                this._stopIt();
            } else {
                // reset command
                this.status(MsPortalFx.ViewModels.CommandStatus.None);
            }
            break;
        case this._successMessageBox:
            // only button is OK button so command is done executing
            this.status(MsPortalFx.ViewModels.CommandStatus.None);
    }
}
```

### Showing Progress

Some commands can be long running operations. To provide feedback to the user,
commands may also display progress:

Progress dialogs are displayed using the same `dialog()` method used by
message boxes. Instead of passing the `MessageBox` to the `dialog()` method, a
`MsPortalFx.ViewModels.ProgressBox` object is created and passed to the
method:

`\Client\Commands\Dialogs\ViewModels\CommandDialogsViewModels.ts`

```ts
public execute(): void {
    var progressBox = new MsPortalFx.ViewModels.ProgressBox(
        "Stopping",
        "Stopping the site ...");
    this.dialog(progressBox);
}
```

The current progress and text can be adjusted on the

`\Client\Commands\Dialogs\ViewModels\CommandDialogsViewModels.ts`

```ts
progressBox.text("Still working ...");
progressBox.completionPercentage(20);
```

### Opening URLs

Command can be configured to open a new browser tab and navigate to a URL. The
`Kind` attribute of the `Command` element must be set to `Url`:

`\Client\Commands\UrlCommand\UrlCommand.pdl`

```xml
<Command Kind="Url"
         Text="SamplesExtension.Resources.Strings.uriCommandTitle"
         ViewModel="UriCommandViewModel" />
```

The `MsPortalFx.ViewModels.UriCommand` base view model class provides a simple
way of choosing the URL for this command. Unlike the
`MsPortalFx.ViewModels.Command` class, there are no dialog or execute method.
The `navigateUri` property informs the shell which URL should be launched when
the user clicks on the command:

`\Client\Commands\UrlCommand\ViewModels\UrlCommandViewModels.ts`

```ts
export class UriCommandViewModel extends MsPortalFx.ViewModels.UriCommand {

    /**
     * Load any required data using this.bindings, and update navigateUri if needed
     */
    constructor(container: MsPortalFx.ViewModels.ContainerContract,
                initialValue: any,
                dataContext: DataContext) {
        super();

        // Specify the  Uri to launch when clicking the button. It will be a common pattern
        // to use info in this.bindings to load sub data, and change this after the view is
        // ready.
        this.navigateUri(SamplesExtension.Resources.Strings.microsoftUri);
        this.icon(MsPortalFx.Base.Images.Link());
    }
}
```

### Opening Blades

Commands can also open a blade, continuing the users' journey. Launching a blade from a command uses the same mechanics as launching a blade from a part:

`\Client\Commands\OpenBladeCommand\OpenBladeCommand.pdl`

This sample demonstrates opening a blade which accepts no blade parameters:

```xml
<Command Kind="Blade"
       Name="OpenBladeCommand"
       Text="{Resource openBladeCommandNone, Module=ClientResources}"
       ViewModel="{ViewModel Name=OpenBladeCommand, Module=./OpenBladeCommand/ViewModels/OpenBladeCommandViewModels}">
  <BladeAction Blade="NoParameterChildBlade" />
</Command>
```

This sample demonstrates opening a blade which accepts a single blade input parameter:

```xml
<Command Kind="Blade"
        Name="OpenBladeCommandWithInput"
        Text="{Resource openBladeCommandInput, Module=ClientResources}"
        ViewModel="{ViewModel Name=OpenBladeCommandWithInput, Module=./OpenBladeCommand/ViewModels/OpenBladeCommandViewModels}">
  <BladeAction Blade="InputParameterChildBlade">
    <BladeInput Source="{Constant 'This is my input string'}"
                 Parameter="inputString" />
  </BladeAction>
</Command>
```

This sample demonstrates opening a blade which passes back a single blade output parameter:

```xml
<Command Kind="Blade"
         Name="OpenBladeCommandWithOutput"
         Text="{Resource openBladeCommandOutput, Module=ClientResources}"
         ViewModel="{ViewModel Name=OpenBladeCommandWithOutput, Module=./OpenBladeCommand/ViewModels/OpenBladeCommandViewModels}">
  <BladeAction Blade="OutputParameterChildBlade">
    <BladeOutput Target="currentNumber"
                 Parameter="outputNumber" />
  </BladeAction>
</Command>
```

Commands may include a `BladeAction` element, which designates a blade, and an
optional set of bindings. The syntax for bindings is entirely consistent with
parts. The `MsPortalFx.ViewModels.OpenBladeCommand` view model base class
provides a simple way of setting up the view model:

`\Client\Commands\OpenBladeCommand\ViewModels\OpenBladeCommandViewModels.ts`

```ts
export class OpenBladeCommandViewModel extends MsPortalFx.ViewModels.OpenBladeCommand {
    constructor(container: MsPortalFx.ViewModels.CommandContainerContract,
                initialValue: any,
                dataContext: DataContext) {
        super(container);
        this.icon(MsPortalFx.Base.Images.Link());
    }
}
```

[commands-on-a-blade]: ../media/portalfx-commands/commandBar.png
[commands-on-a-list-item]: ../media/portalfx-commands/commandList.png
[command-dialogs]: ../media/portalfx-commands/commandDialog.png

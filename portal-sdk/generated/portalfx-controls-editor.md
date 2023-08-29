
<a name="editor"></a>
### Editor

Editor control in the FX SDK is a wrapper for the "Monaco" editor which supports various languages, syntax highligting, intellisense, real-time syntax checking and validation.

![Editor][editor-code]

<a name="editor-editor-basics"></a>
#### Editor Basics

To use the editor, compose a part that hosts the editor control, then use it from your extension.

You can control the behavior and features of the editor via initialization `options`.

**Step 1**: Define the Html template for your part:

`\Client\V1\Controls\Editor\Templates\EditorInstructions.html`

**Step 2**: Create a viewmodel to bind your control to. SampleEditorViewModel implements the viewmodel for the editor.

`\Client\V1\Controls\Editor\ViewModels\EditorViewModels.ts.`

```typescript


/**
* ViewModel class for the editor sample part.
*/
@Di.Class("viewModel")
export class EditorInstructionsPartViewModel
   implements Def.EditorInstructionsPartViewModel.Contract {

   /**
    * View model for the editor.
    */
   public editorVM: Editor.EditorContract;

   /**
    * View model for the save button.
    */
   public saveButton: Button.Contract;

   /**
    * Creates a new instance of the EditorInstructionsPartViewModel class.
    *
    * @param container The view model for the part container.
    */
   constructor(container: MsPortalFx.ViewModels.PartContainerContract) {

       // Initialize the editor view model.  If we were getting the data from teh data context, we would pass it in here.
       this.editorVM = Editor.createEditor(container, {
           contentType: Editor.ContentType.JavaScript,
           content: [
               "function test1(name, job) {",
               "    alert('Welcome ' + name + ', the ' + job);",
               "}",
               "",
               "function test2() {",
               "    var x = '', i = 0;",
               "    for (i = 0; i < 10; i++) {",
               "        if (i == 3) {",
               "            continue;",
               "        }",
               "        x = x + 'The number is ' + i;",
               "    }",
               "    document.getElementById('demo').innerHTML = x;",
               "}",
           ].join("\n"),
           enhancedScrollbar: true,
           tabSize: 4,
           wrappingColumn: 0,
       });

       // Initialize the save button and wire it up such that it saves the content of the editor.
       this.saveButton = Button.create(container, {
           text: ClientResources.Editor.save,
           onClick: () => {
               this.editorVM.save().then(() => {
                   // Here is where you would put code that is executed after any changes have been written back to the content property on the viewmodel.
               });
           },
       });
   }
}

```

**Step 3**: Now you can consume your part from an extension by referencing it in the PDL:

`\Client\V1\Controls\Editor\Editor.pdl`

```xml

<CustomPart Name="b_EditorInstructions_part1"
            ViewModel="{ViewModel Name=EditorInstructionsPartViewModel, Module=./Editor/ViewModels/EditorViewModels}"
            InitialSize="FullWidthFitHeight"
            Template="{Html Source='Templates\\EditorInstructions.html'}" />

```

[editor-code]: ../media/portalfx-controls/editor-code.png

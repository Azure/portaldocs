
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
* ViewModel class for the editor sample.
*/
export class SampleEditorViewModel extends MsPortalFx.ViewModels.Controls.Documents.Editor.ViewModel { // tslint:disable-line:deprecation
   /**
    * Editor view model constructor.
    */
   constructor(lifetimeManager: MsPortalFx.Base.LifetimeManager) {
       // Mock up sample javascript file content.
       const content =
           [
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
           ].join("\n");

       // Set up whether or not to show line numbers and what the tab size is in the editor.
       const options = {
               lineNumbers: false,
               enhancedScrollbar: true,
               tabSize: 4,
               wrappingColumn: 0,
           };

       // Initialize the editor with the above content and options, as well as set the type to be JavaScript.
       super(lifetimeManager, MsPortalFx.ViewModels.Controls.Documents.Editor.ContentType.JavaScript, content, options);
   }
}

/**
* ViewModel class for the editor sample part.
*/
@Di.Class("viewModel")
export class EditorInstructionsPartViewModel
   implements Def.EditorInstructionsPartViewModel.Contract {

   /**
    * View model for the editor.
    */
   public editorVM: any;

   /**
    * View model for the save button.
    */
   public saveButton: Button.Contract;

   /**
    * Creates a new instance of the EditorInstructionsPartViewModel class.
    *
    * @param container The view model for the part container.
    * @param dataContext The data context.
    */
   constructor(container: MsPortalFx.ViewModels.PartContainerContract) {

       // Initialize the editor view model.  If we were getting the data from teh data context, we would pass it in here.
       this.editorVM = new SampleEditorViewModel(container);

       // Initialize the save button and wire it up such that it saves the content of the editor.
       this.saveButton = Button.create(container, {
           text: ClientResources.Editor.save,
           onClick: () => {
               this.editorVM.save.execute().then(() => {
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

<a name="editor-editor-with-custom-language"></a>
#### Editor with Custom Language

Custom language can be used by declaring inherited Editor control viewmodel with rules and suggestions.

**Step 1**: Define the Html template for your part:

`\Client\V1\Controls\Editor\Templates\CustomLanguageEditor.html`

**Step 2**: Create a viewmodel to bind your control to. SampleEditorViewModel implements the viewmodel for the editor.

`\Client\V1\Controls\Editor\ViewModels\CustomLanguageEditorViewModels.ts.`

/**
 * ViewModel class for the custom language editor sample part.
 */
export class CustomLanguageEditorPartViewModel {

    /**
     * View model for the editor.
     */
    public editor: Editor.ViewModel;

    /**
     * Creates a new instance of the EditorInstructionsPartViewModel class.
     *
     * @param container The view model for the part container.
     * @param initialState The initial state for the part.
     * @param dataContext The data context.
     */
    constructor(
        container: MsPortalFx.ViewModels.PartContainerContract,
        initialState: any,
        dataContext: ControlsArea.DataContext) {

        // Initialize the editor view model.  If we were getting the data from teh data context, we would pass it in here.
        this.editor = new CustomLanguageEditorViewModel(container);

        // create the initial markers
        this.updateMarkers(this.editor.content());

        // whenever the code in the editor changes process it and set the markers
        this.editor.content.subscribe(container, this.updateMarkers.bind(this));

        // perform auto save every 500ms to update markers as the user edits the text
        this.editor.autoSaveTimeout(500);
    }

    /**
     * try to match the given pattern in the provided line, if matched construct a marker for that line
     */
    private processTerm(line: string, lineIndex: number, termPattern: string, severity: MsPortalFx.ViewModels.Controls.Documents.Editor.MarkerSeverity): MsPortalFx.ViewModels.Controls.Documents.Editor.EditorMarker {

        // try to match the pattern
        var termIndex = line.indexOf(termPattern);
        if (termIndex === -1) {
            return null;
        }

        // we found the pattern in the line so we create a marker which uses the defined severity and the rest of the text
        // from the pattern location in the line to the end as the message
        return <MsPortalFx.ViewModels.Controls.Documents.Editor.EditorMarker> {
            message: line.substring(termIndex + termPattern.length),
            severity: severity,
            range: <MsPortalFx.ViewModels.Controls.Documents.Editor.EditorRange> {
                startLineNumber: lineIndex + 1,
                startColumn: termIndex + 1,
                endLineNumber: lineIndex + 1,
                endColumn: termIndex + termPattern.length + 1
            }
        };
    }

    /**
     * updates the markers according to the text content
     */
    private updateMarkers(value: string): void {

        // split the text into lines and process each to add an annotation to it
        var markers = value
            .split("\n")
            .map((line: string, index: number): MsPortalFx.ViewModels.Controls.Documents.Editor.EditorMarker => {

                var term = this.processTerm(line, index, "[error]", MsPortalFx.ViewModels.Controls.Documents.Editor.MarkerSeverity.Error);
                if (term !== null) {
                    return term;
                }

                term = this.processTerm(line, index, "[notice]", MsPortalFx.ViewModels.Controls.Documents.Editor.MarkerSeverity.Warning);
                if (term !== null) {
                    return term;
                }

                term = this.processTerm(line, index, "[info]", MsPortalFx.ViewModels.Controls.Documents.Editor.MarkerSeverity.Info);
                if (term !== null) {
                    return term;
                }

                return null;
            })
            .filter(marker => marker !== null);

        // update the markers
        this.editor.markers(markers);
    }
}

**Step 3**: Now you can consume your part from an extension by referencing it in the PDL:

`\Client\V1\Controls\Editor\Editor.pdl`

```xml
<CustomPart Name="b_EditorInstructions_part1"
                  ViewModel="{ViewModel Name=EditorInstructionsPartViewModel, Module=./Editor/ViewModels/EditorViewModels}"
                  InitialSize="FullWidthFitHeight"
                  Template="{Html Source='Templates\\EditorInstructions.html'}" />
```

<properties title="" pageTitle="Editor" description="" authors="sewatson" />

### Editor

Editor control in the FX SDK is a wrapper for the "Monaco" editor which supports various languages, syntax highligting, intellisense, real-time syntax checking and validation.

![Editor][editor-code]

#### Editor Basics

To use the editor, compose a part that hosts the editor control, then use it from your extension.

You can control the behavior and features of the editor via initialization `options`. 

**Step 1**: Define the Html template for your part:

`\Client\Controls\Editor\Templates\EditorInstructions.html`

**Step 2**: Create a viewmodel to bind your control to. SampleEditorViewModel implements the viewmodel for the editor.

`\Client\Controls\Editor\ViewModels\EditorViewModels.ts.`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/Controls/Editor/ViewModels/EditorViewModels.ts","section":"editor#sampleEditorViewModel"}

**Step 3**: Now you can consume your part from an extension by referencing it in the PDL:

`\Client\Controls\Editor\EditorInstructions.pdl`

{"gitdown":"include-section","file":"../Samples/SamplesExtension/Extension/Client/Controls/Editor/Editor.pdl","section":"editor#custompart"}

[editor-code]: ../media/portalfx-controls/editor-code.png
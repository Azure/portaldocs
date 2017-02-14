<properties title="" pageTitle="Forms - Loading, editing and saving data" description="" authors="andrewbi" />

## Loading, editing and saving data

The code for this example comes from the 'basic form' sample in SamplesExtension. The code lives in:
`\Client\Forms\Samples\Basic\FormsSampleBasic.pdl`
`\Client\Forms\Samples\Basic\Templates\FormSampleBasic.html`
`\Client\Forms\Samples\Basic\ViewModels\FromsSampleBasicBlade.ts`

We start by getting an edit scope via a `MsPortalFx.Data.EditScopeView` object. In this sample we'll read and write
data to the server directly via `ajax()` calls but you can also get an edit scope view from other data cache objects
if the data you have is already on the client.

We'll load/save our data by creating an `EditScopeCache` object and defining two functions. `supplyExistingData` will
read the data from the server & `saveEditScopeChanges` will write it back:

{"gitdown": "include-section", "file":"../Samples/SamplesExtension/Extension/Client/V1/Forms/Samples/Basic/ViewModels/FormsSampleBasicBlade.ts", "section": "forms#editScopeCache"}

Note the server returns strings but the model type we're using (`WebsiteModel`) is defined as:

```ts
interface WebsiteModel {
    id: KnockoutObservable<number>;
    name: KnockoutObservable<string>;
    running: KnockoutObservable<boolean>;
}
```

So during both save and load of the data we have to do some transforming to make it match the model type.

The control view models actually take a reference to a `Form.ViewModel` so we need to create a form and pass it the
reference to the edit scope:

{"gitdown": "include-section", "file":"../Samples/SamplesExtension/Extension/Client/V1/Forms/Samples/Basic/ViewModels/FormsSampleBasicBlade.ts", "section": "forms#formViewModel"}

For this form we'll just display one textbox that lets the user edit the name of the 
website:

{"gitdown": "include-section", "file":"../Samples/SamplesExtension/Extension/Client/V1/Forms/Samples/Basic/ViewModels/FormsSampleBasicBlade.ts", "section": "forms#controls"}

We render the form using a section. If you add a list of controls to the section's children observable array they will be laid out one after the
other on the blade so it's often an easy way to get the standard look of most forms in the portal. Alternatively you could hand author the HTML 
for the form by binding each control into HTML template for the blade.

This sample also includes two commands at the top of the blade to save/discard. Commands are used since the design for this blade is
to stay open after a save/discard operation. If the blade was to close after save/discard then we would recommend using an action bar
at the bottom of the blade. The commands check to make sure the edit scope has been populated before they enable themselves via
the 'canExecute' computed we create. They also keep themselves disabled during save operations via an observable named `_saving`
that the part maintains:

{"gitdown": "include-section", "file":"../Samples/SamplesExtension/Extension/Client/V1/Forms/Samples/Basic/ViewModels/FormsSampleBasicBlade.ts", "section": "forms#commands"}

Since we're using the edit scope the save/disard commands can just call the `saveChanges()` or `revertAll()` methods on edit scope 
to trigger the right action.

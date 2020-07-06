
<a name="loading-editing-and-saving-data"></a>
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

```typescript

const editScopeCache = EditScopeCache.createNew<WebsiteModel, number>({
    supplyExistingData: (websiteId) => {
        return FxBaseNet.ajax<any>({
            uri: Util.appendSessionId(MsPortalFx.Base.Resources.getAppRelativeUri("/api/Websites/" + websiteId)), // this particular endpoint requires sessionId to be in query string
            type: "GET",
            dataType: "json",
            cache: false,
            contentType: "application/json",
        }).then((data) => {
            // after you get the data from the ajax query you can do whatever transforms
            // you want in it to turn it into the model type you've defined
            return {
                id: data.id,
                name: data.name,
                running: data.running,
            };
        });
    },
    saveEditScopeChanges: (websiteId, editScope) => {
        // get the website from the edit scope
        const website = editScope.root;

        // if you need to do conversion on the data before posting to server you can do that
        // all we need to do here is turn the knockout object into json
        const serializableWebsite = ko.toJSON(website);

        this._saving(true);
        return FxBaseNet.ajaxExtended({
            uri: Util.appendSessionId(MsPortalFx.Base.Resources.getAppRelativeUri("/api/Websites/" + websiteId)),
            type: "POST",
            dataType: "json",
            cache: false,
            contentType: "application/json",
            data: serializableWebsite,
        }).then(() => {
            // Instruct the EditScope to accept the user-authored, client-side changes as the new state of the
            // EditScope after the 'saveChanges' has completed successfully.
            // ('AcceptClientChanges' is the default behavior.  This promise could also be resolved with 'null' or 'undefined'.)
            return {
                action: Data.AcceptEditScopeChangesAction.AcceptClientChanges,
            };
        }).finally(() => {
            this._saving(false);
        });
    },
});

```

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

```typescript

this._form = new Form.ViewModel<WebsiteModel>(this._ltm);
this._form.editScope = this._editScopeView.editScope;

```

For this form we'll just display one textbox that lets the user edit the name of the
website:

```typescript

const websiteName = new TextBox.ViewModel(
    this._ltm,
    this._form,
    this._form.createEditScopeAccessor(data => data.name),
    {
        label: ko.observable(ClientResources.masterDetailEditWebsiteNameLabel),
        validations: ko.observableArray([
            new FxViewModels.RequiredValidation(ClientResources.masterDetailEditWebsiteNameRequired),
        ]),
        valueUpdateTrigger: ValueUpdateTrigger.Input, // by default textboxes only update the value when the user moves focus. Since we don't do any expensive validation we can get updates on keypress
    });

// Section
this.section = Section.create(this._ltm, {
    children: ko.observableArray<any>([
        websiteName,
    ]),
});

```

We render the form using a section. If you add a list of controls to the section's children observable array they will be laid out one after the
other on the blade so it's often an easy way to get the standard look of most forms in the portal. Alternatively you could hand author the HTML
for the form by binding each control into HTML template for the blade.

This sample also includes two commands at the top of the blade to save/discard. Commands are used since the design for this blade is
to stay open after a save/discard operation. If the blade was to close after save/discard then we would recommend using an action bar
at the bottom of the blade. The commands check to make sure the edit scope has been populated before they enable themselves via
the 'canExecute' computed we create. They also keep themselves disabled during save operations via an observable named `_saving`
that the part maintains:

```typescript

// set up save command
const saveCommand = new Toolbars.CommandButton();
saveCommand.label(ClientResources.saveText);
saveCommand.icon(FxBase.Images.Save());
saveCommand.command = {
    canExecute: ko.pureComputed(() => {
        // user can save when edit scope is dirty and we're not in the middle of a save operation
        const editScope = this._editScopeView.editScope();
        const editScopeDirty = !!editScope ? editScope.dirty() : false;
        return !this._saving() && editScopeDirty;
    }),
    execute: (): FxBase.Promise => {
        return this._editScopeView.editScope().saveChanges();
    },
};

// set up discard command
const discardCommand = new Toolbars.CommandButton();
discardCommand.label(ClientResources.discardText);
discardCommand.icon(MsPortalFx.Base.Images.Delete());
discardCommand.command = {
    canExecute: ko.pureComputed(() => {
        // user can save when edit scope is dirty and we're not in the middle of a save operation
        const editScope = this._editScopeView.editScope();
        const editScopeDirty = !!editScope ? editScope.dirty() : false;
        return !this._saving() && editScopeDirty;
    }),
    execute: (): FxBase.Promise => {
        this._editScopeView.editScope().revertAll();
        return null;
    },
};

this.commandBar = new Toolbars.Toolbar(this._ltm);
this.commandBar.setItems([saveCommand, discardCommand]);

```

Since we're using the edit scope the save/disard commands can just call the `saveChanges()` or `revertAll()` methods on edit scope
to trigger the right action.

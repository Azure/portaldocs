
<a name="legacy-editscopes"></a>
## Legacy EditScopes

**NOTE**:  EditScopes are becoming obsolete and should not be used. It is recommended that extensions be developed without edit scopes, as specified in [top-extensions-controls.md](top-extensions-controls.md). For more information about forms without editScopes, see [top-editscopeless-forms.md](top-editscopeless-forms.md) and [portalfx-controls-dropdown.md#migration-to-the-new-dropdown](portalfx-controls-dropdown.md#migration-to-the-new-dropdown).

Edit scopes provide a standard way of managing edits over a collection of input fields, blades, and extensions. They provide many common functions that would otherwise be difficult to orchestrate, like the following:

  * Track changes in field values across a form
  * Track validation of all fields in a form
  * Provide a way to discard all changes in a form
  * Persist unsaved changes from the form to the cloud
  * Simplify merging changes from the server into the current edit

This document is organized into the following sections.

* [The EditScope Data Model](#the-editscope-data-model)

* [The EditScope Cache](#the-editscope-cache)

* [EditScope ViewModels](#editscope-viewmodels)

* [Loading the EditScope](#loading-the-editscope)

* [EditScope and AJAX](#editscope-and-ajax)

For more information about edit scopes and managing unsaved edits, watch the video located at
[https://aka.ms/portalfx/editscopes](https://aka.ms/portalfx/editscopes).

**NOTE**: In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory, and  `<dirParent>`  is the `SamplesExtension\` directory, based on where the samples were installed when the developer set up the SDK.

* * *

<a name="legacy-editscopes-the-editscope-data-model"></a>
### The EditScope Data Model

The `EditScope`, is a change-tracked, editable model. Every piece of data, or `entity' object, is tracked by the EditScope. Extension developers define entities at a granularity that suits the scenario, making it easy to determine what data in the EditScope/Form data model was created, edited, or deleted by the user.

Parts or blades may request an `EditScope`, but the most typical usage is in a blade. A blade can define a `BladeParameter` with a `type` of `NewEditScope`, which  informs the Shell that the  blade is asking for a new `editScope` object. Within the rest of the blade, that parameter that specifies the `editScope` object can be attached to an `editScopeId` property on any part. This allows any part or command in  the blade to read from the same editScopeId, which is common when a command needs to save information.  The `parameterProvider` instantiates and initializes an `EditScope`, so all that needs to be done is to connect the form's `EditScope` to the `parameterProvider's` `EditScope`.

After the `EditScope` is instantiated, initialized and loaded, entities can only be added  and removed from the EditScope by using EditScope methods. Unfortunately, extensions cannot add a new 'entity' object or remove an existing 'entity' from the EditScope by using observable changes. If an extension tries to make an observable change that introduces an 'entity' object into the EditScope, it will  encounter the error message described in [portalfx-extensions-status-codes.md#unknown-entity-typed-object-array](portalfx-extensions-status-codes.md#unknown-entity-typed-object-array).

<a name="legacy-editscopes-the-editscope-data-model-editscope-entity-arrays"></a>
#### EditScope entity arrays

The EditScope entity array is a hierarchy of 'entity' objects.  When the EditScope's `root` is an object, this object is considered an 'entity' by default. The EditScope becomes a hierarchy of entities when the EditScope includes an array of 'entity' objects. The extension supplies metadata for the type of the array items. For example, the  `T` in `KnockoutObservableArray<T>` contains the type.  Therefore, an object is treated by EditScope as an 'entity' when type metadata associated with the object is marked as an 'entity' type, or some EditScope object includes a property that is 'entity'-typed.

EditScope 'entity' arrays were designed to meet the following requirements.

* User edits are serialized so that journey-switching works with unsaved Form edits. For editing large arrays, the Portal should not serialize array edits by persisting two full copies of the array.

* In the UI, the Portal indicates which array items were created/updated/deleted by the user.

* Adding and removing data from an array is revertable for some scenarios. In some cases, data that has been removed from an array is rendered with strike-through styling.

Consequently, EditScope 'entity' arrays behave differently than JavaScript arrays. The most important factors are that 'Creates' are kept out-of-band and that 'Deletes' are non-destructive.

In an `EditScope` entity array, created/updated/deleted items are tracked individually by `EditScope`. Any edits that were made by the user and collected in an `EditScope` are saved in the storage for the browser session, which is managed by the Shell. These managed changes allow the extension to warn customers that they might lose data if they navigate away from the form without saving their changes.

Also, rows can be added or removed from an editable grid, but the corresponding adds/removes may not be immediately viewable from the `EditScope` array.

 The parameter that specifies the `editScope` object can be attached to an `editScopeId` property, therefore the  `editScopeId`  can be used by the `viewModel`  to load the `editScope` from the cloud, which attaches the modelled data to the view for display.

The properties that are associated with the entity's 'id' are specified in the following examples.

The TypeScript sample is located at  `<dir>\Client\V1\Forms\Scenarios\ChangeTracking\Models\EditableFormData.ts`. This code is also included in the following working copy.

 ```typescript

MsPortalFx.Data.Metadata.setTypeMetadata("GridItem", {
properties: {
    key: null,
    option: null,
    value: null,
},
entityType: true,
idProperties: [ "key" ],
});

```

The C# sample is located at `<dirParent>\SamplesExtension.DataModels/Person.cs`. This code is also included in the following working copy.




The following enumerations simplify the conversation between the `EditScope` and the `EditScopeCache`.

* [The AcceptEditScopeChangesAction enum](#the-accepteditscopechangesaction-enum)

The following properties simplify working with `EditScope` entity arrays.

* [The trackEdits property](#the-trackedits-property)

The following methods are used with `EditScope` entity arrays.

* [The getCreated and addCreated methods](#the-getcreated-and-addcreated-methods)

* [The markForDelete method](#the-markfordelete-method)

* [The getEntityArrayWithEdits method](#the-getentityarraywithedits-method)

* [The applyArrayAsEdits method](#the-applyarrayasedits-method)

* * *

#### The AcceptEditScopeChangesAction enum

These enumerated values allow the extension to specify conditions like the following.

* The EditScopeCache is to implicitly reload the EditScope data as part of completing the 'save' operation.

* The EditScope's data is to be reverted or cleared as part of completing the 'save' operation, which is also known as the "create new record" UX scenario.

For more information about each enum value, see the jsdoc comments around `MsPortalFx.Data.AcceptEditScopeChangesAction`, in Visual Studio or any code editor.

#### The trackEdits property

 Some properties on the EditScope Form model are only for presentation instead of for editing. In these instances, the extension can opt out of tracking user edits for the specified read-only properties, as in the following example.

In TypeScript:

    MsPortalFx.Data.Metadata.setTypeMetadata("Employee", {
        properties: {
            accruedVacationDays: { trackEdits: false },
            ...
        },
        ...
    });

In C#:

    [TypeMetadataModel(typeof(Employee))]
    public class Employee
    {
        [TrackEdits(false)]
        public int AccruedVacationDays { get; set; }

        ...
    }

Extensions can supply type metadata to configure an `EditScope` as follows.

* When using `ParameterProvider`, send the `editScopeMetadataType` option to the `ParameterProvider` constructor.

* When using `EditScopeCache`, send the `entityTypeName` option to `MsPortalFx.Data.EditScopeCache.createNew`.

Extensions can pass the type name used to register type metadata to either of these options by using `MsPortalFx.Data.Metadata.setTypeMetadata`.

#### The getCreated and addCreated methods

These methods allow the extension to add new, 'created' entity objects. The `getCreated` method returns a distinct, out-of-band array that collects all 'created' entities corresponding to a given 'entity' array. The `addCreated` method is a helper method that places a new 'entity' object in this getCreated array.

#### The markForDelete method

The `markForDelete` mthod allows an extension to delete an 'entity' from the `EditScope` as a non-destructive operation. This allows the extension to render 'deleted' edits with strike-through or similar styling. Calling this method puts the associated 'entity' in a deleted state, although the deletion is not yet saved.

#### The getEntityArrayWithEdits method

To see the actual state of an EditScope `EntityArray`, use the `getEntityArrayWithEdits` EditScope method. The `getEntityArrayWithEdits` EditScope method returns the following types of arrays.

* An array that includes 'created' entities and does not include 'deleted' entities

* Discrete arrays that individually capture 'created', 'updated' and 'deleted' entities

This method is used in the `mapOutgoingDataForCollector` callback of the `ParameterProvider` when returning an edited array to some ParameterCollector, as in the following code.

 ```typescript

this.parameterProvider = new MsPortalFx.ViewModels.ParameterProvider<ServerConfig[], KnockoutObservableArray<ServerConfig>>(container, {
    editScopeMetadataType: ServerConfigMetadata.name,
    mapIncomingDataForEditScope: (incoming) => {
        return ko.observableArray(incoming);  // Editable grid can only bind to an observable array.
    },
    mapOutgoingDataForCollector: (outgoing) => {
        const editScope = this.parameterProvider.editScope();

        // Use EditScope's 'getEntityArrayWithEdits' to return an array with all created/updated/deleted items.
        return editScope.getEntityArrayWithEdits<ServerConfig>(outgoing).arrayWithEdits;
    },
});

```

In the UI, the FX renders an indication of what array items were created/updated/deleted.

The following example converts an array of strings into an 'entity' array for consumption by an editable grid.  When modeling your data as an 'entity' array, the editable grid can only be bound to an `EditScope` 'entity' array.

<!-- TODO:  Determine whether Grid and Grid2 are both in use. -->

 ```typescript

const wrapperTypeMetadataName = "ParameterProviderWithEditableStringsBladeViewModel_StringWrapperType";
MsPortalFx.Data.Metadata.setTypeMetadata(wrapperTypeMetadataName, {
name: wrapperTypeMetadataName,
properties: {
    value: null,
},
entityType: true,
});

export interface StringWrapperType {
value: KnockoutObservable<string>;
}

```

The following example demonstrates converting data to an 'entity' array for consumption by an editable grid.

 ```typescript

this.parameterProvider = new MsPortalFx.ViewModels.ParameterProvider<string[], KnockoutObservableArray<StringWrapperType>>(container, {
    editScopeMetadataType: wrapperTypeMetadataName,
    mapIncomingDataForEditScope: (incoming) => {
        // Editable grid only accepts an array of editable entities (that is, objects and not strings).
        const wrappedStrings = incoming.map((str) => {
            return {
                value: ko.observable(str),
            };
        });
        return ko.observableArray(wrappedStrings);  // Editable grid can only bind to an observable array.
    },
    mapOutgoingDataForCollector: (outgoing) => {
        const editScope = this.parameterProvider.editScope();

        // Use EditScope's 'getEntityArrayWithEdits' to return an array with all created/updated/deleted items.
        const entityArrayWithEdits = editScope.getEntityArrayWithEdits<StringWrapperType>(outgoing);

        // Unwrap each string to produce the expected string array.
        return entityArrayWithEdits.arrayWithEdits.map((wrapper) => {
            return wrapper.value();
        });
    },
});

```

<a name="legacy-editscopes-the-editscope-data-model-the-applyarrayasedits-method"></a>
#### The applyArrayAsEdits method

The `applyArrayAsEdits` method simplifies applying edits to an existing `EditScope` entity array. It accepts a new array of 'entity' objects. The `EditScope` will compare  this new array to  the existing `EditScope` array items, determine which 'entity' objects are created/updated/deleted, and then records the corresponding user edits.

This is often performed in a ParameterCollector's `receiveResult` callback, as in the following example.

```ts
// The parameter provider takes care of instantiating and initializing an edit scope for you,
// so all we need to do is point our form's edit scope to the parameter provider's edit scope.
this.editScope = this.parameterProvider.editScope;
```

 The  following example uses a discrete array that individually capture 'created', 'updated' and 'deleted' entities.

 ```typescript

this.itemsCollector = new MsPortalFx.ViewModels.ParameterCollector<ServerConfig[]>(container, {
    selectable: this.itemsSelector.selectable,
    supplyInitialData: () => {
        const editScope = this._editScopeView.editScope();

        // Use EditScope's 'getEntityArrayWithEdits' to develop an array with all created/updated/deleted items
        // in this entity array.
        return editScope.getEntityArrayWithEdits<ServerConfig>(editScope.root.serverConfigs).arrayWithEdits;
    },
    receiveResult: (result: ServerConfig[]) => {
        const editScope = this._editScopeView.editScope();

        // Use EditScope's 'applyArrayWithEdits' to examine the array returned from the Provider Blade
        // and apply any differences to our EditScope entity array in terms of created/updated/deleted entities.
        editScope.applyArrayAsEdits(result, editScope.root.serverConfigs);
    },
});

```

The  following example uses an array that includes 'created' entities and does not include 'deleted' entities.

 ```typescript

this.parameterProvider = new MsPortalFx.ViewModels.ParameterProvider<ServerConfig[], KnockoutObservableArray<ServerConfig>>(container, {
    editScopeMetadataType: ServerConfigMetadata.name,
    mapIncomingDataForEditScope: (incoming) => {
        return ko.observableArray(incoming);  // Editable grid can only bind to an observable array.
    },
    mapOutgoingDataForCollector: (outgoing) => {
        const editScope = this.parameterProvider.editScope();

        // Use EditScope's 'getEntityArrayWithEdits' to return an array with all created/updated/deleted items.
        return editScope.getEntityArrayWithEdits<ServerConfig>(outgoing).arrayWithEdits;
    },
});

```

<a name="legacy-editscopes-the-editscope-cache"></a>
### The EditScope Cache

The `EditScopeCache` class is less commonly used. It loads and manages instances of `EditScope`.  Typically, the blade uses an `EditScopeView`, as specified in  `editScopeCache.createView(...)`, to load or acquire the EditScope,  connect the cache to the view and then display it on the blade.  If the extension uses an `EditScopeCache` component to manage its `EditScope`, the extension should initialize the `EditScope` data in the `supplyNewData` and `supplyExistingData` callbacks that are sent to the `EditScopeCache`.

 The `EditScopeCache` is  used for the following scenarios.

 * **Save/Revert blade**: The  'Save' and 'Revert changes' commands in the CommandBar of the blade typically keep the blade open so the user can perform successive edit and save cycles without closing and reopening the form.

 * **Document editing**: In the document-editing scenario, the user can make edits to a single EditScope/Form model across multiple parent-child blades.  The parent blade sends its `inputs.editScopeId` input to any child blade that edits the same model as the parent Blade. The child blade uses this `inputs.editScopeId` in its call to `editScopeView.fetchForExistingData(editScopeId)` to fetch the EditScope of the parent Blade.

<a name="legacy-editscopes-the-editscope-cache-the-saveeditscopechanges-method"></a>
#### The saveEditScopeChanges method

When using an EditScopeCache, the `saveEditScopeChanges` callback supplied by the extension is called to push `EditScope` edits to a server. This callback returns a `Promise` that should be resolved when the 'save' **AJAX** call completes. This call completes occurs after the server accepts the user's edits.

When the extension resolves this `Promise`, it can supply a value that instructs the EditScope to reset itself to a clean/unedited state. If no such value is returned during `promise` resolution, then the `EditScope` is reset by default.  This means using the user's client-side edits as the new, clean/unedited EditScope state. This works for many scenarios.

There are other scenarios where the default `saveEditScopeChanges` behavior does not work, like the following.

* During 'save', the server produces new data values that need to be merged into the EditScope.

* For "create new record" scenarios, after 'save', the extension should clear the form, so that the user can enter a new record.

For these cases, the extension will resolve the `saveEditScopeChanges` promise with a value from the `AcceptEditScopeChangesAction` enum.

 <!--TODO:  The following sample code does not exist by this name.  -->
 For an example of loading an edit scope from a data context, view the sample that is located at `<dir>\Client\Data\MasterDetailEdit\MasterDetailEditData.ts`.
 <!--TODO:  The previous sample code does not exist by this name.  -->

The following code creates a new `EditScopeCache`, which is bound to the `DataModels.WebsiteModel` object type. It uses an `editScope` within a form.  The `fetchForExistingData()` method on the cache provides a `promise`, which informs the `ViewModel` that the `EditScope` is loaded and available.

```ts
this.editScopeCache = MsPortalFx.Data.EditScopeCache.create<DataModels.WebsiteModel, number>({
    entityTypeName: DataModels.WebsiteModelType,
    supplyExistingData: (websiteId: number) => {
        var deferred = $.Deferred<JQueryDeferredV<DataModels.WebsiteModel>>();

        this.initializationPromise.then(() => {
            var website = this.getWebsite(websiteId);
            if (website) {
                deferred.resolve(website);
            } else {
                deferred.reject();
            }
        });
        return deferred;
    }
});
```

<a name="legacy-editscopes-editscope-viewmodels"></a>
### EditScope ViewModels

In most cases, editable forms include commands that act upon data that is displayed in those forms. Data is made available to the command by binding a value from a part `ViewModel` to a command `ViewModel`, or the `editScopeId` requested by the blade can be bound to the part and the command. The extension can instantiate an `EditScope` by using a `MsPortalFx.Data.EditScopeView` object. The `EditScopeView` object makes edited data available at `editScopeView.editScope().root` after the `editScope()` observable is populated. When the data to view and edit is already located on the client, an `EditScopeView` can also be obtained from other data cache objects.

The data in the `editScope` includes original values and saved edits. The method to access inputs on a part is the `onInputsSet` method. In the constructor, a new `MsPortalFx.Data.EditScopeView` object is created from the `dataContext`. The `EditScopeView` provides a stable observable reference to an `EditScope` object. The `editScopeId` will be sent in as a member of the `inputs` object when the part is bound.

An example of loading an edit scope is in the following code. The sample is also located at `<dir>\Client\V1\MasterDetail\MasterDetailEdit\ViewModels\DetailViewModels.ts`.

<!-- TODO: Determine whether this inline code should be replaced when the samples code is replaced and linked in gitHub, or whether the links to the SDK samples are sufficient. -->

 ```typescript

/**
 * Initializes the website detail form.
 */
constructor(container: MsPortalFx.ViewModels.PartContainerContract, dataContext: MasterDetailArea.DataContext, _mock: AjaxMock) {
    super(container);

    this._editScopeView = dataContext.editScopeCache.createView(container);

    // Initialize editScope of the base class.
    this.editScope = this._editScopeView.editScope;

    // Setup editable form.
    this._initializeForm(container);
}

```

 In the following example, the `editScopeView` is refreshed with new data from the data context.

 ```typescript

/**
 * Invoked when the Part's inputs change.
 */
public onInputsSet(inputs: Def.DetailPartViewModel.InputsContract): Promise<any> {
    // Acquires edit scope seeded with an item with id currentItemId.
    return this._editScopeView.fetchForExistingData(inputs.editScopeId, inputs.currentItemId);
}

```

<a name="legacy-editscopes-loading-the-editscope"></a>
### Loading the EditScope

The code that loads the `EditScope` is largely related to data loading, so the data context is the preferred location for the code.

Form fields require a binding to one or more observables. Consequently, they have two constructor overloads. Extension developers can configure this binding by supplying a path from the root of the `EditScope/Form` model down to the observable to which the form field should bind. They can do this by selecting one of the two form field constructor variations.

* The `EditScopeAccessor` is the preferred methodology because it is verified at compile time.

* The string-typed path methodology is discouraged because it is not compile-time verified.

The `EditScopeAccessor` methodology is preferred for the following reasons.

* The supplied lambda will be compile-time verified. This code is more maintainable, for example, when the property names on the Form model types are changed.

* There are advanced variations of `EditScopeAccessor` that enable less-common scenarios like binding multiple `EditScope` observables to a single form field.

<a name="legacy-editscopes-loading-the-editscope-the-editscopeaccessor"></a>
#### The EditScopeAccessor

In the `EditScopeAccessor`, the form field `ViewModel` constructor accepts an `EditScopeAccessor`, wraps a compile-time verified lambda, and returns the `EditScope` observable to which the Form field should bind, as in the code located at     `<dir>/Client/V1/Forms/Scenarios/FormFields/ViewModels/FormFieldsFormIntegratedViewModels.ts` and in the following code.

 ```typescript

this.textBoxSimpleAccessor = new (MsPortalFx.ViewModels.Forms.TextBox.ViewModel as any)(
    container,
    this,
    this.createEditScopeAccessor<string>((data) => { return data.state; }),
    textBoxSimpleAccessorOptions);

```

  There are other forms that demonstrate translating model data for presentation to the user, as in the code located at       `<dir>/Client/V1/Forms/Scenarios/FormFields/ViewModels/FormFieldsFormIntegratedViewModels.ts`. It is also in the following code.

 ```typescript

this.textBoxReadWriteAccessor = new (MsPortalFx.ViewModels.Forms.TextBox.ViewModel as any)(
    container,
    this,
    this.createEditScopeAccessor<string>(<MsPortalFx.ViewModels.Forms.EditScopeAccessors.Options<FormIntegratedFormData.FormIntegratedFormData, string>>{
        readFromEditScope: (data: FormIntegratedFormData.FormIntegratedFormData): string => {
            return data.state2().toUpperCase();
        },
        writeToEditScope: (data: FormIntegratedFormData.FormIntegratedFormData, newValue: string): void => {
            data.state2(newValue);
        },
    }),
    textBoxReadWriteAccessorOptions);

```

<a name="legacy-editscopes-loading-the-editscope-string-typed-path-methodology"></a>
#### String typed path methodology

The string-typed path methodology can be used instead of the `EditScopeAccessor`.  The string-typed path is discouraged because it is not compile-time verified. The form field `ViewModel` constructor accepts a string-typed path that contains the location of the `EditScope` observable to which the Form field should bind, as in the code located at    `<dir>/Client/V1/Forms/Scenarios/FormFields/ViewModels/FormFieldsFormIntegratedViewModels.ts`. It is also in the following code.

 ```typescript

this.textBoxViewModel = new (MsPortalFx.ViewModels.Forms.TextBox.ViewModel as any)(container, this, "name", textBoxOptions);

```

The following code creates a new set of form field objects and binds them to the `editScope`. The sample is located at  `<dir>\Client\V1\MasterDetail\MasterDetailBrowse\ViewModels\DetailViewModels.ts` and in the following code.

```ts
private _initializeForm(): void {

        // Form fields.
        var websiteNameFieldOptions = <MsPortalFx.ViewModels.Forms.TextBoxOptions>{
            label: ko.observable(ClientResources.masterDetailEditWebsiteNameLabel),
            validations: ko.observableArray([
                new MsPortalFx.ViewModels.RequiredValidation(ClientResources.masterDetailEditWebsiteNameRequired),
                new MsPortalFx.ViewModels.RegExMatchValidation("^[a-zA-Z _]+$", ClientResources.masterDetailEditWebsiteNameValidation)
            ]),
            emptyValueText: ko.observable(ClientResources.masterDetailEditWebsiteNameInitial),
            labelPosition: ko.observable(MsPortalFx.ViewModels.Forms.LabelPosition.Left)
        };

        this.websiteNameField = new MsPortalFx.ViewModels.Forms.TextBox(this._container, this, "name", websiteNameFieldOptions);

        var isRunningFieldOptions = <MsPortalFx.ViewModels.Forms.OptionsGroupOptions<boolean>>{
            label: ko.observable(ClientResources.masterDetailEditRunningLabel),
            options: ko.observableArray([
                {
                    text: ko.observable(ClientResources.masterDetailEditRunningOn),
                    value: true
                },
                {
                    text: ko.observable(ClientResources.masterDetailEditRunningOff),
                    value: false
                }
            ]),
            labelPosition: ko.observable(MsPortalFx.ViewModels.Forms.LabelPosition.Left)
        };

        this.isRunningField = new MsPortalFx.ViewModels.Forms.OptionsGroup(this._container, this, "running", isRunningFieldOptions);

        var generalSectionOptions = <MsPortalFx.ViewModels.Forms.SectionOptions>{
            children: ko.observableArray([
                this.websiteNameField,
                this.isRunningField
            ]),
            style: ko.observable(MsPortalFx.ViewModels.Forms.SectionStyle.Wrapper),
        };

        this.generalSection = new MsPortalFx.ViewModels.Forms.Section(this._container, generalSectionOptions);
    }
```

<!--TODO: Determine whether there are other documents that discuss form fields, like validation.  -->

For more information about form fields, see [top-extensions-controls.md](top-extensions-controls.md).

### EditScope and AJAX

An extension can read and write data to the server directly by using **AJAX** calls. It loads and saves data by creating an `EditScopeCache` object and defining two functions. The `supplyExistingData` function reads the data from the server, and the `saveEditScopeChanges` function writes it back.

The code for this example is associated with the basic form sample. It is located at
* `<dir>\Client\V1\Forms\Samples\Basic\FormsSampleBasic.pdl`
* `<dir>\Client\V1\Forms\Samples\Basic\Templates\FormSampleBasic.html`
* `<dir>\Client\V1\Forms\Samples\Basic\ViewModels\FormsSampleBasicBlade.ts`

The code instantiates an `EditScope` by using a `MsPortalFx.Data.EditScopeView` object. When the data to manipulate is already located on the client, an `EditScopeView` can also be obtained from other data cache objects, as in the following example.

 ```typescript

const editScopeCache = EditScopeCache.createNew<WebsiteModel, number>({
    supplyExistingData: (websiteId) => {
        return FxBaseNet.ajax<any>({
            uri: MsPortalFx.Base.Resources.getAppRelativeUri("/api/Websites/" + websiteId), // this particular endpoint requires sessionId to be in query string
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
            uri: MsPortalFx.Base.Resources.getAppRelativeUri("/api/Websites/" + websiteId),
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

Then, the code transforms the data to make it match the model type. The server returns strings, but the `WebsiteModel` type that is used is defined in the following code.

  ```ts
   interface WebsiteModel {
      id: KnockoutObservable<number>;
      name: KnockoutObservable<string>;
      running: KnockoutObservable<boolean>;
  }
  ```

Therefore, the save and load functions have to transform the data to make it match the `WebsiteModel` model type. The control `viewModels` require a reference to a `Form.ViewModel`, so the code creates a form and sends the reference to the `editScope` to it, as in the following example.

 ```typescript

this._form = new Form.ViewModel<WebsiteModel>(this._ltm);
this._form.editScope = this._editScopeView.editScope;

```

This form displays one textbox that allows the user to edit the name of the website, as specified in the following code.

 ```typescript

const websiteName = new (TextBox.ViewModel as any)(
    this._ltm,
    this._form,
    this._form.createEditScopeAccessor(data => data.name),
    {
        label: ko.observable(ClientResources.masterDetailEditWebsiteNameLabel),
        validations: ko.observableArray([
            new FxViewModels.RequiredValidation(ClientResources.masterDetailEditWebsiteNameRequired),
        ]),
        // TODO, #9968182, Remove this before associated control implementation is removed.
        valueUpdateTrigger: (ValueUpdateTrigger as any).Input, // by default textboxes only update the value when the user moves focus. Since we don't do any expensive validation we can get updates on keypress
    });

// Section
this.section = Section.create(this._ltm, {
    children: ko.observableArray<any>([
        websiteName,
    ]),
});

```

The form is rendered using a section. The code loads all the controls that should be displayed into the `children` observable array of the section. This positions the controls sequentially on a blade, by default, so it is an easy way to standardize the look of forms in the Portal. An alternative to the default positioning is to manually author the HTML for the form by binding each control into an HTML template for the blade.

This sample includes two commands at the top of the blade that save or discard data. Commands are used because this blade stays open after a save/discard operation. If the blade were to close after the operation, then there would be an action bar at the bottom of the blade to use instead.

The commands check to make sure that the `EditScope` has been populated previous to enabling themselves by using the `canExecute` portion of the `ko.pureComputed` code.

The commands also keep themselves disabled during save operations by using a `_saving` observable that the blade maintains, as in the code located at `<dir>\Client\V1\Forms\Samples\Basic\ViewModels\FormsSampleBasicBlade.ts`.

<!-- TODO:  Determine whether this is the sample that is causing the npm run docs build to blow up. -->

 ```typescript

// set up save command
const saveCommand = new Toolbars.CommandButton();
saveCommand.label(ClientResources.saveText);
saveCommand.icon(FxBase.Images.Save());
saveCommand.command = {
    canExecute: ko.pureComputed(() => {
        // user can save when edit scope is dirty and we're not in the middle of a save operation
        const editScope = this._editScopeView.editScope();
        const editScopeDirty = editScope ? editScope.dirty() : false;
        return !this._saving() && editScopeDirty;
    }),
    execute: (): Promise<any> => {
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
        const editScopeDirty = editScope ? editScope.dirty() : false;
        return !this._saving() && editScopeDirty;
    }),
    execute: (): Promise<any> => {
        this._editScopeView.editScope().revertAll();
        return null;
    },
};

this.commandBar = new Toolbars.Toolbar(this._ltm);
this.commandBar.setItems([saveCommand, discardCommand]);

```

Because the `EditScope` is being used, the save/discard commands can just call the `saveChanges()` or `revertAll()` methods on the edit scope to trigger the right action.

For more information, see [https://knockoutjs.com/documentation/computed-writable.html](https://knockoutjs.com/documentation/computed-writable.html).

#### Editscope request

The following sample PDL file demonstrates requesting an `editScope`.  The sample is also located at `<dir>\Client\V1\MasterDetail\MasterDetailEdit\MasterDetailEdit.pdl`.  The `valid` element is using the `section` object of the form to determine if the form is currently valid.

```xml
<!-- Display detail blade with an edit scope. Blade consists of a form and commands.-->
<Blade Name="DetailBlade"
       ViewModel="DetailBladeViewModel">
    <Blade.Parameters>
        <Parameter Name="currentItemId" Type="Key" />
        <Parameter Type="NewEditScope" />
        <Parameter Name="formValid" Type="Output" />
    </Blade.Parameters>

    <Lens Title="SamplesExtension.Resources.Strings.masterDetailEditDetailTitle">
        <CustomPart Name="DetailPart"
                    ViewModel="DetailPartViewModel"
                    Template="{Html Source=&#039;Templates\\WebsitesDetail.html&#039;}"
                    InitialSize="HeroWideFitHeight">
        <CustomPart.Properties>
            <!-- Generated by the shell. -->
            <Property Name="editScopeId"
                      Source="{BladeParameter editScopeId}" />
            <!-- Output parameter indicating whether the form is valid. -->
            <Property Name="valid"
                      Source="{BladeParameter formValid}"
                      Direction="Output" />
            <!-- Master passes an id of object that will be used to seed the edit scope. -->
            <Property Name="currentItemId"
                      Source="{BladeParameter currentItemId}" />
        </CustomPart.Properties>
      </CustomPart>
    </Lens>
</Blade>
```


<a name="editscope-faq"></a>
## EditScope FAQ

For an end-to-end overview of EditScope and how it's used in the Azure Portal FX, please refer to the video and accompanying PowerPoint presentation here:
[Forms: Working with Edit Scopes](portalfx-forms-working-with-edit-scopes.md)

When applying EditScope to common Form scenarios, here is a quick reference with answers to frequently-asked questions.

<a name="editscope-faq-q-my-users-see-the-discard-change-pop-up-even-when-they-ve-made-no-changes-on-my-form-blade-what-s-wrong-here"></a>
### Q: My users see the &#39;discard change?&#39; pop-up, even when they&#39;ve made no changes on my Form Blade. What&#39;s wrong here?

The EditScope '`root`' property returns an object or array that includes uses of Knockout observables (`KnockoutObservable<T>` and `KnockoutObservableArray<T>`). Any observable located within the EditScope is designed to be modified/updated **only by the user**, via Form fields that are bound to EditScope observables. Importantly, these EditScope observables *were not designed* to be modified directly from extension TypeScript code. If extension code modifies an observable *during Form/Blade initialization*, the EditScope will record this *as a user edit*, and this "accidental edit" will trigger the 'discard changes?' pop-up when the user tries to close the associated Blade.

Rather than initializing the EditScope by programmatically modifying/updating EditScope observables, use these alternative techniques:
* If the extension uses a ParameterProvider component to manage its EditScope, initialize the EditScope data in the '`mapIncomingData[Async]`' callback supplied to ParameterProvider.
* If the extension uses an EditScopeCache component to manage its EditScope, initialize the EditScope data in the '`supplyNewData`' and '`supplyExistingData`' callbacks supplied to EditScopeCache.
* If neither of the above techniques suits the scenario, the '`editScope.resetValue()`' method can be used to set a new/initial value for an EditScope observable in a way that *is not recorded as a user edit* (although this only works for observables storing primitive-typed values).


<a name="editscope-faq-q-i-need-to-integrate-my-form-with-an-editscope-where-do-i-get-the-editscope-from"></a>
### Q: I need to integrate my Form with an EditScope. Where do I get the EditScope from?

This varies *according to the UX design* being developed. Extensions choose between using a ParameterProvider component or EditScopeCache component as follows:

**Use ParameterProvider** for this common UX scenario:
* **Pop-up/dialog-like Form** - The Blade makes use of an ActionBar with an 'Ok'-like button that commits user edits. Here, typically, when the user commits their edits, the Blade is implicitly closed (like a conventional UI pop-up/dialog).

**Use EditScopeCache** for these common UX scenarios:
* **Save/Revert Blade** - The Blade has discrete 'Save' and 'Revert changes' commands in the Blade's CommandBar. Typically, these commands will keep the Blade open so the user can perform successive edit/save cycles in the same Blade (without closing/reopening the Form Blade).
* **Document editing** - The user can make edits to the same EditScope/Form model across *multiple parent/child Blades*. Here, the parent Blade will pass its '`inputs.editScopeId`' input to any child Blade used to edit the same model as the parent Blade. The child Blade will use this '`inputs.editScopeId`' in its call to '`editScopeView.fetchForExistingData(editScopeId)`' to fetch the same EditScope utilized by the parent Blade. Scenarios like these resemble document editing.

When using ParameterProvider, the Blade will make use of '`parameterProvider.editScope`' to access the loaded/initialized EditScope.
When using EditScopeCache, in the view model the Blade will make use of an EditScopeView (see '`editScopeCache.createView(...)`') to load/acquire the EditScope.


<a name="editscope-faq-q-form-fields-have-two-constructor-overloads-which-should-i-use-what-is-an-editscopeaccessor"></a>
### Q: Form fields have two constructor overloads, which should I use? What is an EditScopeAccessor?

Form fields require a binding to one or more EditScope observables. Extension developers configure this binding by supplying - essentially - *a path from the root* of the EditScope/Form model down to the observable to which the Form field should bind. They can do this by selecting one of the two Form field constructor variations:

* **EditScopeAccessor** (preferred, compile-time verified) - The Form field view model constructor accepts an EditScopeAccessor, wrapping *a compile-time verified lambda* returning the EditScope observable to which the Form field should bind:

```typescript

this.textBoxSimpleAccessor = new (MsPortalFx.ViewModels.Forms.TextBox.ViewModel as any)(
    container,
    this,
    this.createEditScopeAccessor<string>((data) => { return data.state; }),
    textBoxSimpleAccessorOptions);

```

* **String-typed path** (discouraged, not compile-time verified) - The Form field view model constructor accepts a *string-typed path* locating the EditScope observable to which the Form field should bind:

```typescript

this.textBoxViewModel = new (MsPortalFx.ViewModels.Forms.TextBox.ViewModel as any)(container, this, "name", textBoxOptions);

```

The EditScopeAccessor variant here (the first variant) is preferred for a couple of reasons:

* The supplied lambda will be compile-time verified. This code will be more maintainable when - for instance - the property names on the Form model types are changed.
* There are advanced variations of EditScopeAccessor that enable less-common scenarios like: binding *multiple* EditScope observables to a single Form field, translating Form model data for presentation to the user, etc.:

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


<a name="editscope-faq-q-when-do-i-need-to-worry-about-type-metadata-portalfx-data-typemetadata-md-for-my-editscope"></a>
### Q: When do I need to worry about <a href="portalfx-data-typemetadata.md">type metadata</a> for my EditScope?

For many of the most common, simple Form scenarios, there is *no need* to describe the EditScope/Form model in terms of type metadata. Generally speaking, supplying type metadata is the way to turn on *advanced* FX behavior, in much the same way that - in .NET - developers apply custom attributes to their .NET types to tailor .NET FX behavior for the types.

Re: EditScope and Forms, extensions supply type metadata for the following scenarios:

<a name="editable-grid"></a>
<a name="entity-type"></a>
* **Editable grid** - Today's editable grid was developed to work exclusively with EditScope 'entity' arrays. An EditScope 'entity' array is one where created/updated/deleted array items are tracked individually by EditScope. To grant this special treatment to an array in the EditScope/Form model, supply type metadata for the type of the array items (for the `T` in `KnockoutObservableArray<T>`). In the following, the type is marked as an "entity type" and, additionally, the property/properties that constitute the entity's 'id' are specified:

In TypeScript:

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

In C#:

```csharp

[TypeMetadataModel(typeof(Person), "DataModels")]
[EntityType]
public class Person
{
    /// <summary>
    /// Gets or sets the SSN of the person.
    /// The "Id" attribute will be serialized to TypeScript/JavaScript as part of type metadata, and will be used
    /// by MsPortalFx.Data.DataSet in its "merge" method to merge data by identity.
    /// </summary>
    [Id]
    public int SsnId { get; set; }
    
```

<a name="track-edits"></a>
* **Opting out of edit tracking** - There are Form scenarios where some properties on the EditScope/Form model are not meant for editing but are - possibly - for presentation only. In this situation, the extension can instruct EditScope to *not track* user edits for such EditScope/Form model properties, like so:

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

Extensions can supply type metadata to configure their EditScope as follows:

* When using ParameterProvider, supply the '`editScopeMetadataType`' option to the ParameterProvider constructor.
* When using EditScopeCache, supply the '`entityTypeName`' option to '`MsPortalFx.Data.EditScopeCache.createNew`'.

To either of these, extensions pass the type name used when registering the type metadata via '`MsPortalFx.Data.Metadata.setTypeMetadata`'.


<a name="editscope-faq-q-the-user-added-removed-rows-from-my-editable-grid-but-i-don-t-see-the-corresponding-adds-removes-in-my-editscope-array-what-gives"></a>
### Q: The user added/removed rows from my editable grid, but I don&#39;t see the corresponding adds/removes in my EditScope array.  What gives?

EditScope 'entity' arrays were designed with a few requirements in mind:
* The user's edits need to be serialized so that Journey-switching works with unsaved Form edits. For editing large arrays, the FX should not serialize array edits by persisting two full copies of the (could-be-large) array.
* In the UI, the FX will want to render an indication of what array items were created/updated/deleted. In some cases, array removes need to be rendered with strike-through styling.
* Array adds/remove need to be revertable for some scenarios.

The resulting EditScope design was to make EditScope 'entity' arrays behave differently than regular JavaScript arrays.  Importantly:
* 'Creates' are kept out-of-band
* 'Deletes' are non-destructive

To conveniently see the *actual* state of an EditScope 'entity' array, use the '`getEntityArrayWithEdits`' EditScope method. This returns:
* An array that includes 'created' entities and doesn't include 'deleted' entities
* Discrete arrays that individually capture 'created', 'updated' and 'deleted' entities

This '`getEntityArrayWithEdits`' is particularly useful in ParameterProvider's '`mapOutgoingDataForCollector`' callback when returning an edited array to some ParameterCollector:

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

<a name="apply-array-as-edits"></a>
And there is a corresponding '`applyArrayAsEdits`' EditScope method that simplifies applying edits to an existing EditScope 'entity' array. This is often done in a ParameterCollector's '`receiveResult`' callback:

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

This pair of EditScope methods significantly simplifies working with EditScope 'entity' arrays.


<a name="editscope-faq-q-some-of-my-form-data-is-not-editable-how-do-i-keep-editscope-from-tracking-changes-for-this-data"></a>
### Q: Some of my Form data is not editable. How do I keep EditScope from tracking changes for this data?

See [mention of '`trackEdits`'](#track-edits) above re: configuring an EditScope via type metadata.


<a name="editscope-faq-q-my-form-data-is-just-key-value-pairs-how-do-i-model-a-dictionary-stringmap-in-editscope-why-can-t-i-just-use-a-javascript-object-like-a-property-bag"></a>
### Q: My Form data is just key/value-pairs. How do I model a Dictionary/StringMap in EditScope? Why can&#39;t I just use a JavaScript object like a property bag?

<a name="only-observable-changes"></a>
Like all models and view models treated by the Azure Portal FX, once the object/array is instantiated and returned to the FX in the course of rendering UI, any subsequent mutation of that object/array should be done by changing/mutating Knockout observables. Azure Portal controls and Knockout HTML template-rendering both subscribe to these observables and re-render only when these observables change value.

This poses a challenge to the common JavaScript programming technique of treating a JavaScript object as a property bag of key/value-pairs. If an extension merely adds/removes keys from a model or view model object, the FX will not be aware of these changes. Importantly, EditScope will not recognize these changes as user edits and - in fact - such key adds/removes will put EditScope edit-tracking in an inconsistent state.

So, how does an extension model a Dictionary/StringMap/property bag when using the Azure Portal FX (and EditScope specifically)?

The pattern to follow here, simply, is to develop the Dictionary/StringMap/property bag as an observable array of key/value-pairs, like `KnockoutObservableArray<{ key: string; value: TValue; }>`.

Often, additionally, it is important to let users edit the Dictionary/StringMap/property bag using *an editable grid*. In such cases, it is important to describe the array of key/value-pairs as an 'entity' array since editable grid can only be bound to an EditScope 'entity' array. See [above](#editable-grid) re: how to develop type metadata to use the array with editable grid.

Here's a sample that does something similar, converting - in this case - an array of strings into an 'entity' array for consumption by editable grid.

<a name="editscope-faq-q-my-form-data-is-just-key-value-pairs-how-do-i-model-a-dictionary-stringmap-in-editscope-why-can-t-i-just-use-a-javascript-object-like-a-property-bag-modeling-your-data-as-an-entity-array"></a>
#### Modeling your data as an &#39;entity&#39; array

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

<a name="editscope-faq-q-my-form-data-is-just-key-value-pairs-how-do-i-model-a-dictionary-stringmap-in-editscope-why-can-t-i-just-use-a-javascript-object-like-a-property-bag-converting-your-data-to-an-entity-array-for-consumption-by-editable-grid"></a>
#### Converting your data to an &#39;entity&#39; array for consumption by editable grid

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


<a name="editscope-faq-q-what-do-i-return-from-saveeditscopechanges-i-don-t-understand-the-different-values-of-the-accepteditscopechangesaction-enum"></a>
### Q: What do I return from &#39;saveEditScopeChanges&#39;? I don&#39;t understand the different values of the &#39;<code>AcceptEditScopeChangesAction</code>&#39; enum.

When creating an EditScopeCache, the '`saveEditScopeChanges`' callback supplied by the extension is called to push EditScope edits to a server/backend. This callback returns a Promise that should be resolved when the 'save' AJAX call completes (once the server/backend accepts the user's edits).

When the extension resolves this Promise, it can supply a value that instructs the EditScope how reset itself *to a clean/unedited state*. If no such value is returned during Promise resolution, then - by default - the EditScope is reset by taking the user's client-side edits and considering these values to be the new, clean/unedited EditScope state. This works for many scenarios.

That said, there are scenarios where the default '`saveEditScopeChanges`' behavior *doesn't* work, like:
* During 'save', the server/backend produces *new data values* that need to be merged into the EditScope.
* For "create new record" scenarios, after 'save', the user is to have their form cleared, so they can enter a new record.

For these cases, the extension will resolve their '`saveEditScopeChanges`' Promise with a value from the '`AcceptEditScopeChangesAction`' enum. Values of this enum allow the extension to specify - for instance - that:
* The EditScopeCache is to implicitly reload the EditScope data as part of completing the 'save' operation.
* The EditScope's data is to be reverted/cleared as part of completing the 'save' operation (the "create new record" UX scenario).
* ...etc.

See the jsdoc comments around '`MsPortalFx.Data.AcceptEditScopeChangesAction`' for comprehensive documentation for each enum value.

<a name="editscope-faq-q-what-do-i-return-from-saveeditscopechanges-i-don-t-understand-the-different-values-of-the-accepteditscopechangesaction-enum-caveat-anti-pattern"></a>
#### Caveat / anti-pattern

There is an important anti-pattern to avoid here re: '`saveEditScopeChanges`'. If the AJAX call that saves the user's edits fails, the extension should merely **reject** the '`saveEditScopeChanges`' Promise (which is natural to do with Q Promise-chaining/piping). The extension *should not* resolve their Promise with '`AcceptEditScopeChangesAction.DiscardClientChanges`', since this will lose the user's Form edits (a data-loss bug).


<a name="editscope-faq-common-error-entity-typed-object-array-is-not-known-to-this-edit-scope"></a>
### Common error: &quot;Entity-typed object/array is not known to this edit scope...&quot;

EditScope data follows a particular data model. In short, the EditScope is a hierarchy of 'entity' objects. By default, when the EditScope's '`root`' is an object, this object is considered an 'entity'. The EditScope becomes a hierarchy of 'entities' when:
* the EditScope includes an array of 'entity' objects
* some EditScope object includes a property that is 'entity'-typed

An object is treated by EditScope as an 'entity' when type metadata associated with the object is marked as an 'entity' type (see [here](#entity-type) and the EditScope video/PPT [here](portalfx-forms-working-with-edit-scopes.md) for more details).

Every 'entity' object is tracked by the EditScope as being created/updated/deleted. Extension developers define 'entities' at a granularity that suit their scenario, making it easy to determine what in their larger EditScope/Form data model has been user-edited.

Now, regarding the error above, once the EditScope is initialized/loaded, 'entities' can be introduced and removed from the EditScope only via EditScope APIs. It is an unfortunate design limitation of EditScope that extensions cannot simply make an observable change to add a new 'entity' object or remove an existing 'entity' from the EditScope. If an extension tries to do an observable add (make an observable change that introduces an 'entity' object into the EditScope), they'll encounter the error discussed here.

To correctly (according to the EditScope design) add or remove an 'entity' object into/out of an EditScope, here are APIs that are useful:
* ['`applyArrayAsEdits`'](#apply-array-as-edits) - This API accepts a new array of 'entity' objects. The EditScope proceeds to diff this new array against the existing EditScope array items, determine which 'entity' objects are created/updated/deleted, and then records the corresponding user edits.
* '`getCreated/addCreated`' - These APIs allow for the addition of new, 'created' entity objects. The '`getCreated`' method returns a distinct, out-of-band array that collects all 'created' entities corresponding to a given 'entity' array. The '`addCreated`' method is merely a helper method that places a new 'entity' object in this '`getCreated`' array.
* '`markForDelete`' - 'Deleting' an 'entity' from the EditScope is treated as a non-destructive operation. This is so that - if the extension chooses - they can render 'deleted' (but unsaved) edits with strike-through styling (or equivalent). Calling this '`markForDelete`' method merely puts the associated 'entity' in a 'deleted' state.

<a name="editscope-faq-common-error-entity-typed-object-array-is-not-known-to-this-edit-scope-common-error-scenario"></a>
#### Common error scenario

Often, extensions encounter this "Entity-typed object/array is not known to this edit scope..." error as a side-effect of modeling their data as 'entities' binding with [editable grid](#editable-grid) in some ParameterProvider Blade.  Then, commonly, the error is encountered when applying the array edits in a corresponding ParameterCollector Blade.  Here are two schemes that can be useful to avoid this error:
* Use the ['`applyArrayAsEdits'`](#apply-array-as-edits) EditScope method mentioned above to commit array edits to an EditScope.
* Define type metadata for this array *twice* - once only for editing the data in an editable grid (array items typed as 'entities'), and separately for committing to an EditScope in the ParameterCollector Blade (array items typed as not 'entities').


<a name="editscope-faq-common-error-encountered-a-property-foo-on-an-editable-object-that-is-not-present-on-the-original-object"></a>
### Common error: &quot;Encountered a property &#39;foo&#39; on an editable object that is not present on the original object...&quot;

As discussed [above](#only-observable-changes), the extension should mutate the EditScope/Form model by making observable changes and by calling EditScope APIs. For any object residing in the EditScope, merely adding/removing keys cannot be detected by EditScope (or by the FX at large) and, consequently, edits cannot be tracked. When an extension *attempts* to add/remove keys from an EditScope object, this puts the EditScope edit-tracking in an inconsistent state. When the EditScope detects such an inconsistency, it issues the error above to encourage the extension developer to use (exclusively) observable changes and EditScope APIs to mutate/change the EditScope/Form model.


<a name="integrating-forms-with-commands"></a>
## Integrating Forms with Commands

In most cases, editable forms are accompanied by commands which act upon those forms. There are two ways form data are made available to the command:

  * Part property bindings - a value from a part view model on a blade may be bound into the command view model
  * Edit scope loading - the editScopeId requested by the blade can be bound to a part and a command. By sharing an Id, they can act on the same object.

The most common use of part to command binding is sharing the `dirty` or `valid` properties of a form with a command view model. The command view model can choose to enable/disable save buttons based on validity, or enable/disable a discard button when edits are made. For an example of using a binding
between a part and command, view the `SaveItemCommand` class in the following sample:

`\Client\Data\MasterDetailEdit\ViewModels\DetailViewModels.ts`

```ts
this._editScopeView = dataContext.masterDetailEditSample.editScopeCache.createView(container);
this.enabled = ko.computed((): boolean => {
    // EditScopeId and currentItemId have to be already acquired, editscope dirty and the form valid to
    // command be enabled.
    return !this._editScopeView.loading() &&
        this._editScopeView.editScope() &&
        this._editScopeView.editScope().dirty() &&
        !this._editScopeView.editScope().saving() &&
        this._formValid();
});
```

In this snippet, the `enabled` property of the command is toggled based on the validity of the form. Inputs to this command include:

  * **editScopeId** \- loaded via a "NewEditScope" blade parameter
  * **currentItemId** \- loaded via a "Key" blade parameter
  * **formValid** \- loaded via the part containing a form on the blade

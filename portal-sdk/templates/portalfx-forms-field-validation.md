
## Field Validation

Validating input is one of the primary benefits of the forms API. Many simple and complex validators are available out of the box:

  * Required
  * Contains
  * Not Contains
  * Contains Characters
  * Not Contains Characters
  * Has Digit
  * Has Letter
  * Has Upper Case Letter
  * Has Lower Case Letter
  * Has Punctuation
  * Equals
  * Length Range
  * Min Length
  * Max Length
  * Numeric
  * Range
  * Min Value
  * Max Value
  * RegEx
  * Custom
  * Continuous Update

Validators also provide automatic error messages inside of a balloon control:

![Form Validation][form-validation]

For an example of each of these validators in action, view the following file in the samples:

`\Client\Forms\Samples\Validations\ViewModels\FormValidationsViewModels.ts`

Validators are added to the form objects that are available on the view model:

```ts
var nameTextboxOptions  = <MsPortalFx.ViewModels.Forms.TextBox.Options>{
      label: ko.observable(ClientResources.required),
      validations: ko.observableArray([
          new MsPortalFx.ViewModels.RequiredValidation(ClientResources.pleaseEnterSomeText)
      ])
  };
  this.nameTextbox  = new MsPortalFx.ViewModels.Forms.TextBox.ViewModel(
      this._container, this, "requiredFieldValue", nameTextboxOptions );
```

[form-validation]: ../media/portalfx-forms-field-validation/formValidation.png

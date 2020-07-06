
<a name="using-fx-controls-in-editscope-backed-forms"></a>
## Using Fx/Controls in EditScope backed forms

The new controls are compatible with EditScope backed controls. 
This document provides a step by step process for  adding a Fx/Controls/TextBox to EditScope based control.

For the step-by-step process we will use EngineV3 sample that is shipped as part of samples extension.
If you are not familiar with the sample , please refer to the [link](https://df.onecloud.azure-test.net/#blade/SamplesExtension/SampleMenuBlade/createengine).

<a name="using-fx-controls-in-editscope-backed-forms-goal"></a>
### Goal
Replace the ** Name ** TextBox control with editscopeless control

<a name="using-fx-controls-in-editscope-backed-forms-adding-textbox-controls"></a>
### Adding TextBox Controls

If you want to try this sample, you can try the following changes in `CreateEngineBladeViewModel` Samples Extension.

1. Import modules

All new controls are located in `Fx/Controls` namespace.

```ts 
import * as TextBox from "Fx/Controls/TextBox";
import * as Validations from "Fx/Controls/Validations"
```

2. Modify textBox type

Change the control type for Engine Name so that it is using the latest (editscopeless) TextBox

```ts
/**
* The view model for the form element for the engine name.
**/
public engineName: TextBox.Contract;
```


3. Modify Control Initilization

The `engineName` is initialized inside the `_initializeFormFields` function. In order to leverage the new controls we will change the Control to use latest controls.
Controls inside the `Fx/Controls` namespace use factory pattern for initialization.


```ts
this.engineName = TextBox.create(container, {
    label: ClientResources.engineNameColumn,
    subLabel: ClientResources.sampleSubLabel,
    placeHolderText: ClientResources.enterEngineName,
    validations: ko.observableArray([
        new Validations.Required(ClientResources.emptyFirstName),
        new Validations.RegExMatchValidation("^[a-zA-Z]+", ClientResources.startsWithLetterValidationMessage),
        // The 'Reserved Resource Name Validator' makes sure the engine name is not a trademark or reserved word.
        new Validations.ReservedResourceNameValidator(resourceType)
    ])
});
```

4. Modify the logic to see initial data in EditScope

In this particular sample, ocne the data is recieved we invoke `_mapIncomingDataForEditScope` to initialize the data in editScope.
Since the new controls are not tied to editscope, we will need to set the value explicitly for the control.

In order to initialize the value of textbox, add the following line of code after you have initialized `dataModel`.

```ts
this.engineName.value(data.name || "");
```

5. Modifying the action bar valid computation

We need to modify computation logic for valid state of action bar.

In order to modify the `valid` computaiton, we need to get rid of existing log used to validate action bar.
And, add the logic to compute validation using the editScope along with validation for new textbox

```ts
ko.computed<boolean>(container, () => {
            this.actionBar.valid(this.valid() && this.engineName.valid());
});
```


6. Modify ARM provisioner to use value from new control

The `_supplyTemplateDeploymentOptions` is responsble for providing ARM provisioner with the template deployment options.
Since the form is not backed by editscope we need to change the way value of Engine name is passed to the template.


```ts
var engineName = this.engineName.value(); 
```


At this point you have all the changes required for EditScope backed form to work with editscope-less controls.



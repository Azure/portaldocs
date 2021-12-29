<a name="portal-forms"></a>
# Portal Forms

<a name="portal-forms-overview"></a>
## Overview

Form controls are a subset of controls that allow users to input information.  These controls provide a consistent API surface for managing validation, dirty states, and user input.  They also provide a consistent layout structure.

Everything that applies to controls also applies to form controls, as specified in [top-extensions-controls.md](top-extensions-controls.md).

<a name="portal-forms-overview-form-control-view-model-contract"></a>
### Form control view model contract

The following properties and methods are present on all form controls.

**value**: The value property is bound to the value shown in the control. You can subscribe to it in order to respond to user input, and you can set it to update the widget's value programmatically. This property is configurable.

**disabled**: Setting this property to `true` stops the user from entering data into the control.  It will also prevent validation from running, because if validation fails, there is no way for the user to correct the value of this control.  This property also shows the user that the control is disabled by changing the styling and aria attributes. This property is configurable.

**dirty**: The dirty property is bound to the edit state of the control.  It is changed from `false` to `true` if the user changes the `value` property by interacting with the control.  Setting the `value` property programmatically will not affect the `dirty` state of the control. Additionally, when a blade is closed, and there are dirty fields present, a popup is displayed that warns the user that they might lose their input.  This alert is suppressed when the blade is closed programmatically with the blade close APIs, and data is sent back to the parent blade.  Additionally, developers can control the behavior of this alert by using the `Context.Form.ConfigureAlertOnClose` method, where context is the blade context object. This property is configurable.

  **NOTE**: The framework never resets this property from `true` back to `false`, because the framework does not track the original values of the control.  To set or reset this property programmatically, just write to it as you would any other observable.

**validations**: Validations are run whenever the control value changes, when the validations array changes, or whenever the extension calls `triggerValidation` programmatically.  If the validations fail, the control will be marked as invalid, and the validation message will be shown below the control.  In addition, if this collection contains a "Required" validation, a red asterisk will be displayed next to the label of the control that signifies to users that a value is required to proceed. This property is configurable.

>**NOTE**: The extension can programmatically trigger validation on all visible form fields by using  `context.Form.TriggerValidation`, where context is the blade context object.

**validationResults**: This property is a reflection of the current state of all validations on the control. This property is read-only and is not configurable.

**valid**: This property reflects the current validation state of the control. This property is read-only and is not configurable.

**label, subLabel, infoBalloonContent**: These properties allow the extension to display information that describes the control.  These properties will only appear in the control if their values were set.  The label property is displayed above or to the right of the control.  The subLabel is typically shown below and to the left of the control.  The info balloon will be shown next to the label.  See the [Form Layout](#form-layout) on how to change layout.  Configuring these properties will also display information in accessible ways by using aria attributes. If a \`subLabel\` is supplied, also provide the \`arialLabel\` property with the \`label\` and \`subLabel\` values concatenated in a meaningful way for accessibility. The subLabel is meant for suffixing or adding short, concise, inline helper text and it will be grayed out in disabled scenarios. Do not add whole controls in the subLabel as the framework cannot support hierarchical labelling, contrasting, or proper accessibility and usability for that usage.

**triggerValidation**: This method runs all validations on the control.  It will return a `promise` with the overall valid state of the control after validation has completed. This property is read-only and is not configurable.

>**NOTE**: triggerValidation should be called with the boolean `true` if it is called in the callback of a user triggered operation (and only when user triggered). This will ensure the focus is moved to the first invalid form control if any are found invalid.

<a name="portal-forms-form-control-input-options"></a>
## Form control input options

All configurable properties on the control, like `value`, `validations`, or `dirty`, are options that can be sent as either observables or non-observables.  Observable values are best used when one observable is already present and you do not want to set up the two-way binding. For example, you could send the same observable as the `disabled` property to multiple forms, and then disable all of the forms at once by setting that observable only once. For more information about observables, see [portalfx-blades-viewmodel.md#observable-and-non-observable-values](portalfx-blades-viewmodel.md#observable-and-non-observable-values).

>**NOTE**:  For the most part, sending in non-observables is recommended because it makes extension code more readable and less verbose.

**suppressDirtyBehavior**: This is used when the form control is not being used for saving data. When this flag is set to true, the control will not mark itself as `dirty` when the value is changed.  This will prevent dirty styling, and prevent this control from triggering the alert when blades are closed.  For example, if you have a slider that controls the zoom level of a view, information like the slider position is lost when the blade is closed, but that setting is not relevant.

>**NOTE**: This property is not configurable after creation of the control.

<a name="portal-forms-form-control-input-options-form-layout"></a>
### Form Layout

Because form controls are often grouped together, it is important to keep the layout of the controls consistent. Consequently, most form layout is controlled by using sections. For more information about sections, see  [https://aka.ms/portalfx/playground](https://aka.ms/portalfx/playground).

The section has two properties that allow for layout control. They are as follows.

**leftLabelPosition**: When this property is set to `true`, the labels of child form controls are placed to the left of the control, instead of above the control.  The controls themselves are aligned vertically, a few pixels to the right of the longest label.

**LeftLabelWidth**: When this property is set to `true`, the labels of the child form controls are placed to the left of the control, instead of above the control.  The control labels have a fixed width that is set to the number of pixels that was sent to the control.

<a name="portal-forms-form-control-input-options-legacy-integration"></a>
### Legacy Integration

If you are working with blades that use legacy concepts like `editScope`, you can still use the new form controls by sending the `editScope` observable to the blade options as the `value` property. This results in the `editScope` being updated when the control is updated, and vice versa.

>**NOTE**:  EditScopes are becoming obsolete.  It is recommended that extensions and forms be developed without edit scopes, as specified in [portalfx-editscopeless-procedure.md](portalfx-editscopeless-procedure.md).

<a name="portal-forms-form-control-input-options-form-topics"></a>
### Form Topics

There are a number of subtopics in the forms topic.  Sample source code is included in subtopics that discuss the various Azure SDK API items.

| API Topic                        | Document                                                                                     |
| -------------------------------- | -------------------------------------------------------------------------------------------- |
| Integrating Forms with Commands  | [top-forms-integrating-with-commands.md](top-forms-integrating-with-commands.md)   |
| Form Field Validation            | [top-forms-field-validation.md](top-forms-field-validation.md)                     |

For more information about how forms and parameters interact with an extension, see [portalfx-parameter-collection-overview.md](portalfx-parameter-collection-overview.md).

For more information about forms with editScopes, see [portalfx-legacy-editscopes.md](portalfx-legacy-editscopes.md).

For more information about forms without editScopes, see [portalfx-editscopeless-overview.md](portalfx-editscopeless-overview.md).


<a name="portal-forms-frequently-asked-questions"></a>
## Frequently asked questions

<a name="portal-forms-frequently-asked-questions-should-i-use-an-action-bar-or-a-commands-toolbar-on-my-form"></a>
### Should I use an action bar or a commands toolbar on my form?

It depends on the scenario that drives the UX. If the form will capture some data from the user and expect the blade to be closed after submitting the changes, then use an action bar, as specified in [design-patterns-resource-create.md](design-patterns-resource-create.md).  However, if the form will edit or update some data, and expect the user to make multiple changes before the blade is closed, then use commands, as specified in [portalfx-commands.md](portalfx-commands.md). 

* Action Bar

  The action bar will have one button whose label is something like "OK", "Create", or "Submit". The blade should automatically close immediately after the action bar button is clicked. Users can abandon the form by clicking the Close button that is located at the top right of the application bar. Developers can use a `ParameterProvider` to simplify the code, because it provisions the `editScope` and implicitly closes the blade based on clicking on the action bar. 

  Alternatively, the action bar can contain two buttons, like "OK" and "Cancel", but that requires further configuration. The two-button method is not recommended because the "Cancel" button is made redundant by the Close button.

* Commands
  
  Typically, the two commands at the top of the blade are the "Save" command and the "Discard" command. The user can make edits and click "Save" to commit the changes. The blade should show the appropriate UX for saving the data, and will stay on the screen after the data has been saved. The user can make further changes and click "Save" again. The user can also discard their changes by clicking "Discard". Once the user is satisfied with the changes, they can close the blade manually.
  
* * * 


<a name="portal-forms-glossary"></a>
## Glossary

 This section contains a glossary of terms and acronyms that are used in this document. For common computing terms, see [https://techterms.com/](https://techterms.com/). For common acronyms, see [https://www.acronymfinder.com](https://www.acronymfinder.com).

| Term                 | Meaning |
| ---                  | --- |
| compile-time verified lambda | A lambda expression that is verified at compile time.  |
| eirty | The contents of a textbox or similar object have been changed from the time that they were originally displayed or instantiated. Related to the most recent value of a variable or observable. |
| DOM              | Document Object Model   |
| journey  | A user-defined collection of Azure blades to which the user has navigated in order to accomplish a specific goal or task. A set of experiences, each of which has its own goals, that combine to result in a greater level of competency or knowledge. |
| lambda expression | An anonymous function that is used to create delegates or expression tree types. |
| observable | Special Knockout or JavaScript objects that can notify subscribers or other code about changes, and can automatically detect dependencies.  |
| observable array | An observable that allows code to to detect and respond to changes on  a collection of things.   |
| promise | An object that is returned from asynchronous processing which binds together the results of multiple asynchronous operations.  This is in accordance with a contract that async operation(s) will either complete successfully or will have been rejected. | 
| property bag | A container that contains different types of object properties. Allows the   addition of properties without modifying the server side object, and with minimal changes to the client code.|
| validation |  The process of ensuring that form or field contents are within the specified constraints for an application.  This includes items like field length or numeric checks. |
| AMD                   | |
| EditScope             | An Azure SDK object that provides a standard way of managing edits over a collection of input fields, blades, and extensions. |
| ParameterCollector    | A collection of Parameter and Parameter-derived objects that are used by data source controls in advanced data-binding scenarios. |


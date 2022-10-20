<a name="view-formviewtype-formcontrolswithoutresourcescope"></a>
# view-formViewType-formControlsWithoutResourceScope
* [view-formViewType-formControlsWithoutResourceScope](#view-formviewtype-formcontrolswithoutresourcescope)
    * [Description](#view-formviewtype-formcontrolswithoutresourcescope-description)
    * [Definitions:](#view-formviewtype-formcontrolswithoutresourcescope-definitions)

<a name="view-formviewtype-formcontrolswithoutresourcescope-description"></a>
## Description
form controls without resourceScope. See [formControls](dx-view-formViewType-formControls.md).
<a name="view-formviewtype-formcontrolswithoutresourcescope-definitions"></a>
## Definitions:
<a name="view-formviewtype-formcontrolswithoutresourcescope-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|name|True|Name of the instance.
|type|True|Enum permitting the value: "Microsoft.Common.CheckBox".
|label|True|Display text for the control
|defaultValue|False|Default value, set `true` for Checkbox to be `checked` upon loading the control. If not set, the defaultValue is set to `false` (un-checked). Default value also supports re-setting the default value if `defaultValue.resetTrigger` is evaluated as **true**.
|toolTip|False|Display text when hovered over the tooltip icon
|constraints|False|See [here](dx-control-Microsoft.Common.CheckBox-constraints.md) for more on constraints.
|visible|False|When visible is evaluated to *true* then the control will be displayed, otherwise it will be hidden.  Default value is **true**.
|fx.feature|False|

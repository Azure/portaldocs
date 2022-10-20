<a name="view-formviewtype-properties-formsteps-formstep"></a>
# view-formViewType-properties-formSteps-formStep
* [view-formViewType-properties-formSteps-formStep](#view-formviewtype-properties-formsteps-formstep)
    * [Definitions:](#view-formviewtype-properties-formsteps-formstep-definitions)

<a name="view-formviewtype-properties-formsteps-formstep-definitions"></a>
## Definitions:
<a name="view-formviewtype-properties-formsteps-formstep-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|name|True|Name of the step/tab instance
|label|True|Display name of the step/tab
|description|False|Description of the step/tab
|elements|True|List of form controls to be rendered in the step. <br> See [formControls](dx-view-formViewType-formControls.md). <br> If using, always put Microsoft.Common.ResourceScope as a first item.
|fx.feature|False|

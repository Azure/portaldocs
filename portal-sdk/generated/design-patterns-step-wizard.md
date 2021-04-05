<a name="step-wizard"></a>
# Step Wizard

Last updated Dec 2020 (see [change logs](#change-logs))

The Step Wizard pattern provides guidelines for a set of sequential steps to perform a task. This pattern is not recommended for Azure resource creation, refer to [Create a Resource pattern](design-patterns-resource-create.md). 

<a name="step-wizard-context"></a>
## Context
Users need to complete a set of steps to perform a task in Azure. 

<a name="step-wizard-problem"></a>
## Problem
To perform a task in Azure, users need an intuitive and consistent way to provide complex information in sequential steps. 

<a name="step-wizard-solution"></a>
## Solution
The Step Wizard design pattern offers an approach that enables users to walk through a series of steps in sequential order. The experience uses a full screen page with tabs to separate related configuration steps and guide users during the process. 

<a name="step-wizard-solution-also-known-as"></a>
### Also known as
* Sequential wizard 
* Wizard 

<a name="step-wizard-examples"></a>
## Examples

<a name="step-wizard-examples-example-images"></a>
### Example images
<a name="step-wizard-examples-example-images-step-wizard-with-the-first-tab"></a>
#### Step wizard with the first tab
<div style="max-width:800px">
<img alttext="example-first.png" src="../media/design-patterns-step-wizard/example-first.png"  />
</div>

<a name="step-wizard-examples-example-images-step-wizard-with-the-middle-tab"></a>
#### Step wizard with the middle tab
<div style="max-width:800px">
<img alttext="example-middle.png" src="../media/design-patterns-step-wizard/example-middle.png"  />
</div>
 
<a name="step-wizard-examples-example-images-step-wizard-with-the-last-tab"></a>
#### Step wizard with the last tab
<div style="max-width:800px">
<img alttext="example-last.png" src="../media/design-patterns-step-wizard/example-last.png"  />
</div>

<a name="step-wizard-examples-example-uses"></a>
### Example uses
Configure backup in the Backup Center. Go to Backup Center in Azure portal, click on add backup button, choose datasource type “Azure Database for PostgreSQL servers”, and click proceed button. 

<a name="step-wizard-use-when"></a>
## Use when
Step Wizard pattern should be used for sequential tasks that the next steps are dependent on the previous steps.

<a name="step-wizard-anatomy"></a>
## Anatomy
<div style="max-width:800px">
<img alttext="anatomy.png" src="../media/design-patterns-step-wizard/anatomy.png"  />
</div>
 
The Step Wizard pattern is a full-screen experience that offers the following features:
1.	Title
2.	Badges
3.	Tabs
4.	Labels and corresponding fields
5.	Footer navigation buttons

<a name="step-wizard-behavior"></a>
## Behavior
<a name="step-wizard-behavior-labels-and-corresponding-fields"></a>
### Labels and corresponding fields
Labels should be kept concise and not provide instructions, for example: "Machine name".

<a name="step-wizard-behavior-validation"></a>
### Validation
Validations are done at every step of the wizard. If there is at least one validation error in one step, the wizard should block users from advancing to the next step.
<div style="max-width:800px">
<img alttext="validation.png" src="../media/design-patterns-step-wizard/validation.png"  />
</div>
 
<a name="step-wizard-behavior-tabs"></a>
### Tabs
Tabs and corresponding sections are used to organize sequential content. Tabs are disabled until users reach the given step of the process. Once active, users can interact with the content on that tab.

<a name="step-wizard-behavior-badges"></a>
### Badges
Badges are used to make it easy for the user to understand the state of the given step. The badge variants show users when the step is active, disabled, finished, or when there’s an error.
<a name="step-wizard-behavior-badges-light-theme-badges"></a>
#### Light theme badges
<div style="max-width:800px">
<img alttext="light-theme.png" src="../media/design-patterns-step-wizard/light-theme.png"  />
</div>
 
<a name="step-wizard-behavior-badges-dark-theme-badges"></a>
#### Dark theme badges
<div style="max-width:800px">
<img alttext="dark-theme.png" src="../media/design-patterns-step-wizard/dark-theme.png"  />
</div>

<a name="step-wizard-do"></a>
## Do
* Put fields in steps in order of a natural task flow
* Mark required fields with red asterisk
* Include info bubbles if there are input fields that may not be immediately familiar
* Primary action button should only appear in the last step and the label should reinforce the action (Move, Save, etc)

<a name="step-wizard-don-t"></a>
## Don&#39;t
* Don't use this pattern for non-sequential tasks
* Don't use this pattern to create Azure resources – there is a specific pattern for Azure resources
* Don't put labels on buttons
* Don't include lengthy and unclear explanation text. The text should only be used to clarify and set expectations in a few short sentences.

<a name="step-wizard-related-design-guidelines"></a>
## Related design guidelines
* [Design Guidelines](top-design.md)
* [Create a Resource](design-patterns-resource-create.md)

<a name="step-wizard-research-and-usability"></a>
## Research and usability

<a name="step-wizard-telemetry"></a>
## Telemetry

<a name="step-wizard-for-developers"></a>
## For developers
Developers can use the following information to get started implementing this pattern

<a name="step-wizard-for-developers-tips-and-tricks"></a>
### Tips and tricks
* Set a maximimum width of 700px for the page area that contains input fields
* Set the spacing between the items in the footer is 12px
* To show the labels and input field on the same line, include your controls in a Section and set the leftLabelPosition option to true
* For input fields that may not be immediately familiar, include an info balloon (InfoBalloon)

<a name="step-wizard-for-developers-related-documentation"></a>
### Related documentation

* [Azure Design Template ](https://www.figma.com/file/SkCj1C9nh5lZTuIz0uhcY2/Azure-Portal-Pattern-Templates?node-id=525%3A0)
* [Design guidelines](top-design.md)
* [Top Extensions Create](top-extensions-create.md)
* [Portal Forms](top-extensions-forms.md)
* [Developing Forms](portalfx-forms.md)

<a name="step-wizard-change-logs"></a>
## Change logs

<a name="step-wizard-change-logs-dec-2020"></a>
### Dec 2020
* Updated UI design

<a name="step-wizard-change-logs-jul-2019"></a>
### Jul 2019
* Published

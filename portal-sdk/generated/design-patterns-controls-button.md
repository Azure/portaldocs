# Button

 
<a name="basics"></a>
### Basics
Buttons are best used to enable a user to commit a change or complete steps in a task. They are typically found inside forms, dialogs, panels or pages. An example of their usage is confirming the deletion of a resource in a confirmation dialog.


<!-- TODO get an IMAGE to embed here -->


<!-- TODO get an SAMPLE CODE to embed here -->

 
<a name="when-to-use"></a>
### When to use
When considering their place in a layout, contemplate the order in which a user will flow through the UI. As an example, in a form, the individual will need to read and interact with the form fields before submiting the form. Therefore, as a general rule, the button should be placed at the bottom of the UI container (a dialog, panel, or page) which holds the related UI elements.

While buttons can technically be used to navigate a user to another part of the experience, this is not recommended unless that navigation is part of an action or their flow.


 
<a name="best-practices"></a>
### Best practices

<a name="best-practices-do"></a>
#### Do

* Make sure the label conveys a clear purpose of the button to the user.
* Button labels must describe the action the button will perform and should include a verb. Use concise, specific, self-explanatory labels, usually a single word.
* Buttons should always include a noun if there is any room for interpretation about what the verb operates on.
* Consider the affect localization will have on the button and what will happen to components around it.
* If the button’s label content is dynamic, consider how the button will resize and what will happen to components around it.
* Use only a single line of text in the label of the button.
* Expose only one or two buttons to the user at a time, for example, "Accept" and "Cancel". If you need to expose more actions to the user, consider using checkboxes or radio buttons from which the user can select actions, with a single command button to trigger those actions.
* Show only one primary button that inherits theme color at rest state. In the event there are more than two buttons with equal priority, all buttons should have neutral backgrounds.
* "Submit", "OK", and "Apply" buttons should always be styled as primary buttons. When "Reset" or "Cancel" buttons appear alongside one of the above, they should be styled as secondary buttons.
* Default buttons should always perform safe operations. For example, a default button should never delete.
* Use task buttons to cause actions that complete a task or cause a transitional task. Do not use buttons to toggle other UX in the same context. For example, a button may be used to open an interface area but should not be used to open an additional set of components in the same interface.

<a name="best-practices-don-t"></a>
#### Don&#39;t

* Don't use generic labels like "Ok," especially in the case of an error; errors are never "Ok."
* Don’t place the default focus on a button that destroys data. Instead, place the default focus on the button that performs the "safe act" and retains the content (i.e. "Save") or cancels the action (i.e. "Cancel").
* Don’t use a button to navigate to another place, use a link instead. The exception is in a wizard where "Back" and "Next" buttons may be used.
* Don’t put too much text in a button - try to keep the length of your text to a minimum.
* Don't put anything other than text in a button.


 
<a name="developer-tips-and-tricks"></a>
### Developer tips and tricks



<a name="developer-tips-and-tricks-interactive-control-and-sample-source-code"></a>
#### Interactive control and sample source code
Go to the playground site to use the latest control and get source code for your project.  [Learn more about playground](./top-extensions-controls-playground.md).

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/Button_create_Playground" target="_blank">Button in the interactive controls playground</a>



 
<a name="related-info"></a>
### Related info

* <a href="https://www.figma.com/file/Bwn8rmUOYtnPRwA3JoQTBn/Azure-Portal-Toolkit?node-id=3019%3A285" target="_blank">Button in Azure Portal Toolkit (Figma)</a>

* [Azure design guidance](http://aka.ms/portalfx/design)



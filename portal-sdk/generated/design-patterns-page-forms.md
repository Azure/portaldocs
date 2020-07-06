# Forms
Forms are the manner in which we gather and validate user input.

<a name="context"></a>
## Context
Users enter information to manage Azure resources.

<a name="problem"></a>
## Problem
Users want to enter information to create, configure and manage resources.  Users file support tickets and provide feedback by entering information in the portal.

<a name="solution"></a>
## Solution
The portal offers several variations of forms with consistent field layout and form validation to ensure users can easily enter information and understand whether that info is valid.  The form variations are dialogs, context panes, full screen blades and wizards.  Well designed forms enable users to increase the speed and accuracy of input and lead to successful form completion.

<a name="solution-also-known-as"></a>
### Also known as

<a name="examples"></a>
## Examples

<a name="examples-example-images"></a>
### Example images
<!-- TODO UX better images with highlight of the element -->

<a name="examples-dialog"></a>
### Dialog
<div style="max-width:800px">
<img alttext="Forms example - dialog" src="../media/design-patterns-page-forms/forms-dialog.png"  />
</div>

<a name="examples-context-pane-read-only"></a>
### Context Pane (read only)
<div style="max-width:800px">
<img alttext="Forms example - narrow context pane" src="../media/design-patterns-page-forms/forms-context-pane-narrow.png"  />
</div>

<a name="examples-context-pane-with-input-form"></a>
### Context Pane (with input form)
<div style="max-width:800px">
<img alttext="Forms example - wide context pane" src="../media/design-patterns-page-forms/forms-context-pane.png"  />
</div>

<a name="examples-full-screen-blade"></a>
### Full screen blade
<div style="max-width:800px">
<img alttext="Forms example - full screen blade" src="../media/design-patterns-page-forms/forms-full-screen-blade.png"  />
</div>

<a name="examples-full-screen-blade-from-resource-menu"></a>
### Full screen blade from resource menu
<div style="max-width:800px">
<img alttext="Forms example - full screen blade from resource menu" src="../media/design-patterns-page-forms/forms-full-screen-blade-from-menu.png"  />
</div>

<a name="examples-wizard"></a>
### Wizard
<div style="max-width:800px">
<img alttext="Forms example" src="../media/design-patterns-page-forms/forms.png"  />
</div>

<a name="examples-example-uses"></a>
### Example uses
* Dialog: Stopping a VM
* Context pane: Tagging a VM
* Full screen page: Moving a VM to a different resource group
* Full screen page from resource menu: Editing VM diagnostic settings
* Wizard: Creating a VM [Free account virtual machine](https://portal.azure.com/#create/microsoft.freeaccountvirtualmachine)

<a name="use-when"></a>
## Use when
Choose among these available options when designing experiences for the user to enter information.

* Dialogs are used for very simple input/acknowledgment and appear next to the user click target
* Context panes are used when more space is needed and the input form does not need to invoke any child blades.  Context panes appear on the rightside of the screen, vary in width and float over other content.
* Full screen blades are used when the input form needs the space or will invoke a child blade
* Full screen blades from resource menu are used when the input form is invoked directly from the resource's resource menu and serves the purpose of showing the current information and the edit experience for that information
* Wizard is a type of full screen blade with tabs across the top and is used to guide a user as they provide input when creating azure resources

<a name="anatomy"></a>
## Anatomy
<!-- TODO get anatomy for dialog and context pane Use common numbers for elements -->
<div style="max-width:800px">
<img alttext="Form anatomy" src="../media/design-patterns-page-forms/form-anatomy.png"  />
</div>

A form can contain:
1. Labels and corresponding input fields
2. Buttons or another call to action
3. Error messaging
4. Field and Form validation

<a name="behavior"></a>
## Behavior
As the user enters information, field content is validated.  Upon form submission, the entire form is validated.

<a name="behavior-validation"></a>
### Validation

<a name="behavior-validation-placeholder-text"></a>
#### Placeholder text
Include placeholder text can be formatted in two ways:
1. As an instruction

<div style="max-width:300px; margin-left:25px">
<img alttext="Placeholder instruction" src="../media/design-patterns-page-forms/placeholder_text.png"  />
</div>

2. As an example of valid input format

<div style="max-width:150px; margin-left:25px">
<img alttext="Placeholder example" src="../media/design-patterns-page-forms/placeholder-email.png"  />
</div>

<a name="behavior-validation-field-validation"></a>
#### Field validation
Don’t make users guess field (TextBox) or password (PasswordBox) requirements. Instead, enable field validations for TextBox and PasswordBox in your experience.  You can enable the showValidationsAsPopup option to give the user feedback as they type.

* TextBox [design-patterns-controls-TextBox.md](design-patterns-controls-TextBox.md)
* PasswordBox [design-patterns-controls-PasswordBox.md](design-patterns-controls-PasswordBox.md)

<div style="max-width:300px">
<img alttext="Form validation" src="../media/design-patterns-page-forms/form-validation.png"  />
</div>

<a name="behavior-validation-error-messaging"></a>
#### Error messaging
Provide highly visible and specific error messages.

<a name="behavior-control-recommendations"></a>
### Control recommendations
Visit the control guidance to help you in selecting the right control for your page
* Controls guidance [design-patterns-controls.md](design-patterns-controls.md)

<a name="behavior-button-recommendations"></a>
### Button recommendations
The buttons for submitting and canceling a form should follow these recommendations.  The sections for each type of form follow this list and call out any special casing for that form type.  Sometimes a forms blade is invoked from multiple places.  For example, the `Tag resource` blade is invoked from a resource menu on most Azure resource and also invoked in a context pane from the essentials control.  In this case, the `Tag resource` blade is designed as a fullscreen blade form opened from a resource menu and does not follow the recommendations of a typical context blade form.

* Buttons are at the bottom of the page in a non-scrollable docked area
* Use a single `Close` button if experience is informational only
* Use `Yes` and `No` buttons for destructive actions and include a confirmation question in the dialog - "Delete this VM?"
* Use the "action name", like **Move**, **Save**, **Attach**, **Add**, for the submit button and `Cancel` as the button to close the dialog
* Use `Ok` and `Cancel` as a last resort if a better action name is not apparent

<!-- TODO Should the "submit" buttons for forms always be active, so that user can get form validation -->
<!-- TODO Edit columns uses `Apply` and `Reset`, no close button -->
<!-- TODO Tag resource uses toolbar, no close button -->

<a name="behavior-button-recommendations-dialog-command-buttons"></a>
#### Dialog - command buttons
Follow the button recommendations above
<!-- TODO Should clicking away from dialog cause it to close?  It does for Stop/Delete VM (Yes, No) but not the Attach/Detach nic example -->

<a name="behavior-button-recommendations-context-pane-command-buttons"></a>
#### Context pane - command buttons
* Use buttons at the bottom. Follow button recommendations above
* Don't use a toolbar at the top
    * If context pane contains a grid, attach grid actions to the grid with a grid-level toolbar

<a name="behavior-button-recommendations-fullscreen-blade-form-command-buttons"></a>
#### Fullscreen blade form - command buttons
* Use buttons at the bottom. Follow button recommendations above
* Use a toolbar at the top only if page represents a more fully featured management experience like the Manage alert rules experience ( `VM > Alerts > Manage alert rules` )
    * All buttons go in the toolbar using the naming conventions above
    * No `Close` button, the blade has an `X` in the upper right corner to close it

<a name="behavior-button-recommendations-fullscreen-blade-from-opened-from-a-resource-menu-command-buttons"></a>
#### Fullscreen blade from opened from a resource menu - command buttons
* Use a toolbar at the top of the page when the form is opened from a resource menu like the Tags experience ( `VM > Tags` ) and the VM diagnostic settings experience ( `VM > Diagnostics settings` )
* All actions go in the toolbar using the naming conventions above
* No `Close` button, the blade has an `X` in the upper right corner to close it


<a name="behavior-button-recommendations-create-wizard-command-buttons-see-the-resource-create-pattern-design-patterns-resource-create-md-for-details"></a>
#### Create wizard command buttons - see the <a href="design-patterns-resource-create.md">resource create pattern</a> for details


<a name="do"></a>
## Do
-   Use inline labels and fields for full screen pages and stacked labels and fields for narrow blades.  This behavior is controlled by the Section leftLabelPosition option

-   Mark required fields with a red asterisk * to distinguish them from optional fields

-   Include info balloons (InfoBalloon) if there are input fields that may not be immediately familiar

-   Left align the input fields on the page. Jagged edges are difficult to skim

-   Visually group related labels and fields. [Labels should be close to the fields](https://www.nngroup.com/articles/form-design-white-space/) they describe (immediately above the field for context panes or next to the field for long forms). Avoid ambiguous spacing where labels are equidistant from multiple fields.

<a name="don-t"></a>
## Don&#39;t

-   Don't phrase labels as questions. Keep labels short and sweet.

-   Don't include fields that stretch across the full width of the page.

-   Avoid buttons for clearing a form. The risk of accidental deletion outweighs the unlikely need to start over.


<a name="related-design-guidelines"></a>
## Related design guidelines

* Controls guidance [design-patterns-controls.md](design-patterns-controls.md)
* InfoBalloon [design-patterns-controls-InfoBalloon.md](design-patterns-controls-InfoBalloon.md)
* PasswordBox [design-patterns-controls-PasswordBox.md](design-patterns-controls-PasswordBox.md)
* TextBox [design-patterns-controls-TextBox.md](design-patterns-controls-TextBox.md)
* Section [design-patterns-controls-Section.md](design-patterns-controls-Section.md)
* Full screen [design-patterns-page-fullscreen.md](design-patterns-page-fullscreen.md)
* Create a Resource [design-patterns-resource-create.md](design-patterns-resource-create.md)
* Design guidelines [top-design.md](top-design.md)


<a name="research-and-usability"></a>
## Research and usability

<a name="telemetry"></a>
## Telemetry

<a name="for-developers"></a>
# For developers
Developers can use the following information to get started implementing this pattern

<a name="for-developers-tips-and-tricks"></a>
## Tips and tricks
* To show the labels and input field on the same line - include your controls in a Section and set the leftLabelPosition option to true.


<a name="for-developers-related-documentation"></a>
## Related documentation
* Dialog [top-extensions-dialogs.md](top-extensions-dialogs.md)
* Context Pane [top-extensions-context-panes.md](top-extensions-context-panes.md)
* Forms [top-extensions-forms.md](top-extensions-forms.md)
* Forms [portalfx-forms.md](portalfx-forms.md)

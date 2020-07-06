* [Accessibility](#accessibility)
    * [What the framework provides](#accessibility-what-the-framework-provides)
    * [Troubleshooting issues:](#accessibility-troubleshooting-issues)
    * [Testing for accessibility](#accessibility-testing-for-accessibility)
    * [Basic accessibility checklist:](#accessibility-basic-accessibility-checklist)
    * [Best Practices](#accessibility-best-practices)
    * [References](#accessibility-references)


<a name="accessibility"></a>
# Accessibility

Accessibility is about making the portal usable by people who have limitations that prevent or impede the use of conventional user interfaces. For some situations, accessibility requirements are imposed by law. However, Microsoft requires all blocking accessibility issues to be addressed regardless of legal requirements so the portal caters to the largest possible audience. The framework team has taken an inclusive design approach in incorporating keyboard, programmatic, and visual design support throughout the portal. Extensions are responsible for any graphics, styling, and custom HTML templates they provide.

<a name="accessibility-what-the-framework-provides"></a>
## What the framework provides

<a name="accessibility-what-the-framework-provides-the-framework-provides-reusable-tiles-parts-forms-and-controls-that-are-fully-accessible"></a>
#### The framework provides reusable  tiles/parts, forms, and controls that are fully accessible.

* Using the Form creation helper, your form will be fully accessible.

* All portal:
  * Chrome
  * Panes
  * Sidebar
  * Top nav
  * Context menus
  * Widgets

* Keyboard shortcuts are provided and are listed within the help menu in the portal. The shortcuts must work when using your extension content.

* A fully accessible default theme (Blue)
  _**NOTE:** When using that theme, the contrast ratio for all text must meet <a href="http://www.interactiveaccessibility.com/web-accessibility-guidelines">AAA guidelines</a>._

* The Portal supports HighContrast mode and should display controls and chrome accordingly.

<a name="accessibility-what-the-framework-provides-focus-management-is-handled-by-the-framework-and-must-follow-those-rules-unless-focus-is-changed-by-the-user-first"></a>
#### Focus management is handled by the framework and must follow those rules (unless focus is changed by the user first):

* Focus moves to newly opened blade in the content section
     _**NOTE:** Currently focus is on first focusable element however further usability testing will be required to determine final design._

* Focus moves to context pane when opened

* Focus should move freely across all elements visible in the Portal, except in the following cases:
		* ContextMenu captures focus in a loop
		* DropMenu captures focus in a loop


<a name="accessibility-troubleshooting-issues"></a>
## Troubleshooting issues:
- <a href="http://vstfrd:8080/Azure/RD/_workitems#path=Shared+Queries%2FAUX%2FIbiza%2FAccessibility%2FIbiza+Accessibility+-+Triaged+Active&_a=query">***Known issues*** </a>

- **Is this a control owned by the framework?**
	`	<a href="http://aka.ms/portalfx/accessibility/bug">File a framework bug (internal only)</a>
- **Missing text or labels?**
	Use the attribute TITLE to add a description that is shown on hover. If still not possible, use aria-label as last resort. <a href="http://www.w3schools.com/html/html_attributes.asp">Learn more about HTML attributes.</a>

- **Contrast too low?**
    Use the <a href="http://leaverou.github.io/contrast-ratio/">WCAG color contrast tool</a> to adjust colors

<a name="accessibility-testing-for-accessibility"></a>
## Testing for accessibility

* **High-contrast**
  Native support for IE/Edge with Windows High Contrast Mode (WHCM).
  Other browsers do not support WHCM natively, and neither other OS system, therefore a custom theme is provided in the settings pane of the portal.
	_**NOTE:** The custom theme is a good approximation of WCHM behavior and can be used to quickly verify your compliance. To properly verify though, please use High Contrast settings option 2 with Edge._

* **Screen reader**
  Either combination of NVDA/Firefox or Narrator/Edge
	_**NOTE:** At this time, Chrome seems to ignore some aria properties and the native widgets are not all properly accessible._

* **Accessibility audit**
  <a href="http://www.deque.com/products/axe/">aXe</a>: <a href="http://bitly.com/aXe-Chrome">Chrome plugin</a>, <a href="http://bit.ly/aXe-Firefox">Firefox plugin</a>, <a href="https://github.com/dequelabs/axe-core">axe-core</a> (unit testing)


<a name="accessibility-basic-accessibility-checklist"></a>
## Basic accessibility checklist:
Before testing

- Extension should be updating to SDK version 788 or more recent.

- Extension should update to use supported controls.
https://df.onecloud.azure-test.net/#blade/SamplesExtension/SDKMenuBlade/controls
*Exceptions: (DiffEditor, DatePolyFills, PairedTimeline) are not supported by Framework*

- Extension should ensure theming support in both Light and Dark mode when using custom colors

- Extension should not interfere with High Contrast theming.
	*Common mistake*: Using a `<div>` instead of an `<a>` for a link

- When introducing user actionable areas that are not based on supported controls, extension should use `fxClick` as documented. `click` binding is not supported.

- Extensions creating custom implementation of supported controls should be identified.

- Image and logos that are part of the Narrator Items mode should be labelled properly, or marked as aria-hidden if not significant.

- Review all controls and ensure that labels are being used. If labels are omitted then use aria labels in the viewmodel.

- Verify keyboard accessibility of your blade content and forms. Navigate to your content in the portal and ensure focus is captured to your content in the expected way (autofocus on open provided by the framework)

- Verify your content follows [responsive design](top-design-responsive.md)

After Testing report is given to extension
- Ibiza provides a list of common pattern that are not issues with justifications
- Ibiza provides a list of external product bugs that are not issues to fix with justifications and bug links

<a name="accessibility-best-practices"></a>
## Best Practices
* Design and code with accessibility in mind

* Use portal tiles/parts, forms, and controls whenever possible, as those are designed to be accessible

* Use HTML semantics when using custom HTML <a href="http://www.w3schools.com/html/html5_semantic_elements.asp">Web semantics</a>
	For example, don't create a button with a styled DIV tag. Use the BUTTON tag instead.

* Avoid using aria-*
	If you find yourself using those attributes, review your design and try to use HTML semantics as much as possible.


* Provide concise, meaningful instructions for user input

* Scrub your content for consistent terminology and iconography before releasing it to the public

* Always use multiple sensory cues to convey information. Never use the position, orientation, size, shape, or color  of a UI element alone to communicate important information to the user

<a name="accessibility-references"></a>
## References

* <a href="https://www.1eswiki.com/wiki/Trusted_Tester_with_Keros#What_is_Trusted_Tester.3F">What is Trusted Tester? (internal only)</a>
* <a href="https://www.1eswiki.com/wiki/Trusted_Tester_with_Keros#What_is_Keros.3F">What is Keros? (internal only)</a>
* <a href="https://www.1eswiki.com/wiki/Trusted_Tester_with_Keros#What_is_Keros.3F">Baseline accessibility assessment (internal only)</a>
* <a href="https://www.1eswiki.com/wiki/Trusted_Tester_with_Keros#Full_MAS_compliance_assessment">Full MAS compliance assessment (internal only)</a>
* <a href="http://leaverou.github.io/contrast-ratio/">WCAG color contrast tool</a>
* <a href="http://webaim.org/articles/">WebAIM Accessibility</a>
* <a href="http://www.interactiveaccessibility.com/web-accessibility-guidelines">AAA guidelines</a>
* <a href="http://www.w3schools.com/html/html_attributes.asp">HTML Attributes</a>
* <a href="https://www.paciellogroup.com/blog/2014/08/using-the-tabindex-attribute/">Natural tab order</a>
* <a href="http://www.w3schools.com/html/html5_semantic_elements.asp">Web semantics</a>

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

* The Portal must support HighContrast mode and should display controls and chrome accordingly

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
- <a href="http://vstfrd:8080/Azure/RD/_workitems#path=Shared+Queries%2FAUX%2FIbiza%2FAccessibility%2FAll+D+and+F+bugs&_a=query">***Known issues*** </a> 

- **Is this a control owned by the framework?**   
		<a href="http://aka.ms/portalfx/accessibility/bug">File a framework bug (internal only)</a>
- **Missing text or labels?**   
	Use the attribute TITLE to add a description that is shown on hover. If still not possible, use aria-label as last resort. <a href="http://www.w3schools.com/html/html_attributes.asp">Learn more about HTML attributes.</a>

- **Contrast too low?**   
    Use the <a href="http://leaverou.github.io/contrast-ratio/">WCAG color contrast tool</a> to adjust colors

<a name="accessibility-testing-for-accessibility"></a>
## Testing for accessibility

* **High-contrast**  
  IE or Firefox with Windows in High Contrast Mode Black on White.  
	_**NOTE:** Chrome does not support High Contrast natively, and extensions apply filters that are not properly accessible._

* **Screen reader**  
  Either combination of NVDA/Firefox or Narrator/Edge  
	_**NOTE:** At this time, Chrome seems to ignore some aria properties and the native widgets are not all properly accessible._

* **Accessibility audit**
  <a href="http://www.deque.com/products/axe/">aXe</a>: <a href="http://bitly.com/aXe-Chrome">Chrome plugin</a>, <a href="http://bit.ly/aXe-Firefox">Firefox plugin</a>, <a href="https://github.com/dequelabs/axe-core">axe-core</a> (unit testing)


<a name="accessibility-basic-accessibility-checklist"></a>
## Basic accessibility checklist:

1. Ensure there is accessible name (required) and description (optional) for content and interactive UI elements in your extension.

2. Verify keyboard accessibility of your blade content and forms.  
  - Navigate to your content in the portal and ensure focus is captured to your content in the expected way (autofocus on open provided by the framework)  
  - Ensure the <a href="https://www.paciellogroup.com/blog/2014/08/using-the-tabindex-attribute/">tab order is natural</a> while navigating the blade content
  - Verify that portal provided keyboard shortcuts are functional within your provided content  
3. Visually verify your UI to ensure:  
  - Text contrast meets <a href="http://www.interactiveaccessibility.com/web-accessibility-guidelines">AAA guidelines</a>  
	Color contrast ratio- The updated Section 508 of the Americans with Disability Act, as well as other legislation, requires that the default color contrasts between text and its background must be 5:1. For large text (18-point font sizes, or 14 points and bolded), the required default contrast is 3:1.   
  - Elements render as designed in the high-contrast themes  
  - Color must not be the only means of conveying information  
	Color dependence is defined as using color as the sole means to convey information. For example, a single indicator that is green for 'on', orange for 'standby', and red for 'off' is color dependent. When color is the only means to convey information, people who are color blind, and people who cannot see, do not have access to the same information that others have. The status or function that is being conveyed by color also needs to be available in a textual format that can be viewed by all, and can be read by screen reader software. This requirement does not mean that color cannot be used; it means that color cannot be the only means of conveying the information.   
4. Run accessibility tools, address reported issues, and verify the screen reading experience.   
  - <a href="https://www.1eswiki.com/wiki/Trusted_Tester_with_Keros" >Baseline accessibility assessment (internal only)</a>


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


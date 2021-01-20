* [Accessibility](#accessibility)
    * [What the framework provides](#accessibility-what-the-framework-provides)
    * [Troubleshooting issues:](#accessibility-troubleshooting-issues)
    * [Testing for accessibility](#accessibility-testing-for-accessibility)
    * [Basic accessibility checklist:](#accessibility-basic-accessibility-checklist)
    * [Best Practices](#accessibility-best-practices)
    * [References](#accessibility-references)
    * [Accessibility Planning](#accessibility-accessibility-planning)
        * [Alternate Text- (tag AltText)](#accessibility-accessibility-planning-alternate-text-tag-alttext)
        * [Aria-attribute- (tag Aria-attr)](#accessibility-accessibility-planning-aria-attribute-tag-aria-attr)
        * [Contrast-Ratio – (tag Contrastratio)](#accessibility-accessibility-planning-contrast-ratio-tag-contrastratio)
        * [High Contrast- (tag Highcontrast)](#accessibility-accessibility-planning-high-contrast-tag-highcontrast)
        * [Focus-management- (tag Focus-management)](#accessibility-accessibility-planning-focus-management-tag-focus-management)
        * [Keyboard Accessibility – (tag KeyboardAccess)](#accessibility-accessibility-planning-keyboard-accessibility-tag-keyboardaccess)
        * [Grid- (tag Grid)](#accessibility-accessibility-planning-grid-tag-grid)
        * [ListView- (tag ListView)](#accessibility-accessibility-planning-listview-tag-listview)


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
  Native support for Internet Explorer/Microsoft Edge with Windows High Contrast Mode (WHCM).
  Other browsers do not support WHCM natively, and neither other OS system, therefore a custom theme is provided in the settings pane of the portal.
	_**NOTE:** The custom theme is a good approximation of WCHM behavior and can be used to quickly verify your compliance. To properly verify though, please use High Contrast settings option 2 with Microsoft Edge._

* **Screen reader**
  Either combination of NVDA/Firefox or Narrator/Microsoft Edge
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

<a name="accessibility-accessibility-planning"></a>
## Accessibility Planning

As we continue to work through our accessibility backlog we would like to streamline the process as best we can to be as efficient as possible. Below is a template to help guide you through what tags to use as bugs are filed. Most (95%) of bugs will fall into one of the 8 issues below. All bugs that you feel are framework issues should be assigned to Paymon Parsadmehr. If you feel a bug falls into more than one category, please add all corresponding tags to the bug. If you feel the bug does not fit into any of the buckets please reach out to Paymon Parsadmehr to assess issue. As we resolve each bucket we will send out updates for folks to be aware of progress as well as regress testing updates from vendor teams. Please reach out to (paparsad) if there are any other questions or concerns.


Below are the tagging rules as well as examples of each bug class.
<a name="accessibility-accessibility-planning-alternate-text-tag-alttext"></a>
### Alternate Text- (tag AltText)
  Screen reader reads the text content, but the output is not helpful, or the output needs to be more descriptive, or no output is read except the control type.
1.   Example: Screen reader cursor is on a part and all the part content is read instead of expected text.
1.   Example: Screen reader cursor is on an option picker control and all the options are read instead of a label.
1.   Bug example: [RDBug 8105335](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=8105335):Azure API Management Service: More Services: Name Property is Empty for "Search the Market Place" edit box

**Alternate Text** will require downstream code changes. This is our top priority at the  moment. Will send updates as we release SDK’s with updated controls.

<a name="accessibility-accessibility-planning-aria-attribute-tag-aria-attr"></a>
### Aria-attribute- (tag Aria-attr)
  Functionality not exposed to screen readers. Examples: expandable, multi-selectable, item position and index, etc.
1.  Bug example: [RDBug 8259873](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=8259873): Accessibility: MAS40B: Inspect: "Name" property is empty for 'Create' group.[Scenario: Creating NameSpace]


<a name="accessibility-accessibility-planning-contrast-ratio-tag-contrastratio"></a>
### Contrast-Ratio – (tag Contrastratio)
Contrast ratio of text color against background is insufficient (high contrast is a different issue).
1.   Example: Text does not have a contrast ratio of at least 7:1 on button in the “Azure” theme.
1.   Bug example: [RDBug 8091694](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=8091694):[Accessibility] Luminosity contrast ratio is less than 4.5:1 for "Support" link in feedback pane under "Blue Alt" theme

<a name="accessibility-accessibility-planning-high-contrast-tag-highcontrast"></a>
### High Contrast- (tag Highcontrast)
All issues related to High Contrast mode.
1.   Example: Focus not visible while using High Contrast Black-on-White mode in Microsoft Edge on buttons.
1.  Bug example: [RDBug 8133287](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=8133287):Ibiza Portal: Accessibility: High Contrast - Black: Data Lake: All Resources: Previous Page button is not visible in High Contrast - Black Theme

<a name="accessibility-accessibility-planning-focus-management-tag-focus-management"></a>
### Focus-management- (tag Focus-management)
Focus set at an unexpected place, or focus is lost, or focus is trapped.
1.   Example: Focus lost when switching value in dropdown via keyboard.
1.   Example: Cannot focus away from button once it captures focus.
1.  Bug example: [RDBug 8679020](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=8679020):[Keyboard Navigation - KeyVault -Select Principle ] Focus order is not logical on the "Select Principle" blade.

<a name="accessibility-accessibility-planning-keyboard-accessibility-tag-keyboardaccess"></a>
### Keyboard Accessibility – (tag KeyboardAccess)
Activation and interaction via keyboard not working as expected or is inconsistent, or the item cannot be accessed via keyboard.
1.   Example: Cannot tab to button.
1.   Example: Cannot activate button with spacebar key.
1.  Bug example: [RDBug 8220516](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=8220516):[Ibiza Portal]: Accessibility: MAS36: KB: Unable to access the Add to Favorites button (star button) for (Service Bus, Event Hubs, Relays) when navigated from "More Services -> Search Filter -> Service Bus/Event Hubs/Relays".

<a name="accessibility-accessibility-planning-grid-tag-grid"></a>
### Grid- (tag Grid)
All issues related to Grid, regardless of the previous issues mentioned.
1.  Example: Grid does not expose the column header on the cell (would be Aria-attr, yet triages as Grid).
1.  Bug example: [RDBug 8882413](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=8882413):Ibiza Portal:[B2A][E2A][E2E][V2A]Accessibility: Inspect :MAS40B: Name property is Inappropriate for column header items in 'Jobs' page of Azure portal.

<a name="accessibility-accessibility-planning-listview-tag-listview"></a>
### ListView- (tag ListView)
All issues related to ListView, regardless of the previous issues mentioned.
1. Example: ListView does not read any content when focus is set on an element (would be AltText, yet triage as ListView).
1. Bug example: [RDBug 8133284](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=8133284):ibiza portal: Usability: Narrator: Intune Data Lake: New: Narrator announces Contains 0 items for a list of 3 or more items



Additional guidance
1.   Some of the bugs you got may contain multiple issues described in them (Ex: scenario 1, scenario 2). Please separate those issues in separate bugs. Bugs with multiple issues cannot be resolved reliably.
1.   Ensure the attachments(img, png) files contain screenshots with highlighted problem areas. Videos alone have not been helpful.
1.   Screen reader issues (AltText and Aria-attr labels) should be reported from testing with Microsoft Edge using Narrator, or Firefox using NVDA. Other combinations will be deferred.
1.   Screen reader fixes will be done for Microsoft Edge using Narrator on Windows 10 Creators Update, and Firefox with NVDA. Regression testing should take those consideration into account, we will inform the vendors team of this.
1.   Iframes are not a part of the scope and do not have any dependencies on the framework. Extensions are advised to test these scenarios on their own and are responsible for fixes.
1.   Some legacy controls will be deprecated and extensions will need to move to the updated version of the control in order to meet accessibility standards due to cost issues.

**updating legacy controls will require extension code changes. We are working on a list of these controls and will share by end of the April.

1.   Use the following [bug template](http://vstfrd:8080/Azure/RD/_workItems/create/RDBug?%5BSystem.Title%5D=Accessibility%3A+MAS%23+%3A++%5Btitle+for+bug%5D&%5BSystem.Description%5D=%3Cp%3E%3Cstrong%3EScenario+%3A%3C%2Fstrong%3E%26nbsp%3B%3C%2Fp%3E%3Cp%3E%3Cb%3EBlade+Name%3A%3C%2Fb%3E%26nbsp%3B%3C%2Fp%3E%3Cp%3E%3Cbr%3E%3Cb%3EAdd+One+Screenshot%3C%2Fb%3E%3C%2Fp%3E%3Cp%3E%3Cb%3E%3C%2Fb%3E%3Cbr%3E%3C%2Fp%3E%3Cdiv%3E%3Cp+style%3D'color%3Argb(34%2C+34%2C+34)%3Bfont-family%3A%22Segoe+UI%22%2C+%22Helvetica+Neue%22%2C+Helvetica%2C+Arial%2C+Verdana%3B'%3E%3Cstrong%3ERepro+Steps%3A%3C%2Fstrong%3E%3C%2Fp%3E%3Cp+style%3D'color%3Argb(34%2C+34%2C+34)%3Bfont-family%3A%22Segoe+UI%22%2C+%22Helvetica+Neue%22%2C+Helvetica%2C+Arial%2C+Verdana%3B'%3E%3Cbr%3E%3C%2Fp%3E%3Cp+style%3D'color%3Argb(34%2C+34%2C+34)%3Bfont-family%3A%22Segoe+UI%22%2C+%22Helvetica+Neue%22%2C+Helvetica%2C+Arial%2C+Verdana%3B'%3E%3Cbr%3E%3C%2Fp%3E%3Cp+style%3D'color%3Argb(34%2C+34%2C+34)%3Bfont-family%3A%22Segoe+UI%22%2C+%22Helvetica+Neue%22%2C+Helvetica%2C+Arial%2C+Verdana%3B'%3E%3Cspan+style%3D%22line-height%3A14.26px%3Bfont-size%3A10pt%3B%22%3E%3Cstrong%3EExpected+Result%3A%3C%2Fstrong%3E%3C%2Fspan%3E%3C%2Fp%3E%3Cp+style%3D'color%3Argb(34%2C+34%2C+34)%3Bfont-family%3A%22Segoe+UI%22%2C+%22Helvetica+Neue%22%2C+Helvetica%2C+Arial%2C+Verdana%3B'%3E%3Cbr%3E%3C%2Fp%3E%3Cp+style%3D'color%3Argb(34%2C+34%2C+34)%3Bfont-family%3A%22Segoe+UI%22%2C+%22Helvetica+Neue%22%2C+Helvetica%2C+Arial%2C+Verdana%3B'%3E%3Cbr%3E%3C%2Fp%3E%3Cp+style%3D'color%3Argb(34%2C+34%2C+34)%3Bfont-family%3A%22Segoe+UI%22%2C+%22Helvetica+Neue%22%2C+Helvetica%2C+Arial%2C+Verdana%3B'%3E%3Cstrong%3EActual+Result%3A%3C%2Fstrong%3E%3C%2Fp%3E%3Cp+style%3D'color%3Argb(34%2C+34%2C+34)%3Bfont-family%3A%22Segoe+UI%22%2C+%22Helvetica+Neue%22%2C+Helvetica%2C+Arial%2C+Verdana%3B'%3E%3Cbr%3E%3C%2Fp%3E%3Cp+style%3D'color%3Argb(34%2C+34%2C+34)%3Bfont-family%3A%22Segoe+UI%22%2C+%22Helvetica+Neue%22%2C+Helvetica%2C+Arial%2C+Verdana%3B'%3E%3Cstrong%3ENarrator+Behavior%3A%3C%2Fstrong%3E%3C%2Fp%3E%3Cp+style%3D'color%3Argb(34%2C+34%2C+34)%3Bfont-family%3A%22Segoe+UI%22%2C+%22Helvetica+Neue%22%2C+Helvetica%2C+Arial%2C+Verdana%3B'%3E%3Cb%3E%3C%2Fb%3E%3Cbr%3E%3C%2Fp%3E%3Cp+style%3D'color%3Argb(34%2C+34%2C+34)%3Bfont-family%3A%22Segoe+UI%22%2C+%22Helvetica+Neue%22%2C+Helvetica%2C+Arial%2C+Verdana%3B'%3E%3Cstrong%3ESuggested+Fix%3A%3C%2Fstrong%3E%3Cbr%3E%3C%2Fp%3E%3Cp+style%3D'color%3Argb(34%2C+34%2C+34)%3Bfont-family%3A%22Segoe+UI%22%2C+%22Helvetica+Neue%22%2C+Helvetica%2C+Arial%2C+Verdana%3B'%3E%3Cbr%3E%3C%2Fp%3E%3Cp+style%3D'color%3Argb(34%2C+34%2C+34)%3Bfont-family%3A%22Segoe+UI%22%2C+%22Helvetica+Neue%22%2C+Helvetica%2C+Arial%2C+Verdana%3B'%3E%3Cbr%3E%3C%2Fp%3E%3Cp+style%3D'color%3Argb(34%2C+34%2C+34)%3Bfont-family%3A%22Segoe+UI%22%2C+%22Helvetica+Neue%22%2C+Helvetica%2C+Arial%2C+Verdana%3B'%3E%3Cbr%3E%3C%2Fp%3E%3Cp+style%3D'color%3Argb(34%2C+34%2C+34)%3Bfont-family%3A%22Segoe+UI%22%2C+%22Helvetica+Neue%22%2C+Helvetica%2C+Arial%2C+Verdana%3B'%3E%3Cbr%3E%3C%2Fp%3E%3Cp+style%3D'color%3Argb(34%2C+34%2C+34)%3Bfont-family%3A%22Segoe+UI%22%2C+%22Helvetica+Neue%22%2C+Helvetica%2C+Arial%2C+Verdana%3B'%3E%3Cbr%3E%3C%2Fp%3E%3C%2Fdiv%3E&%5BSystem.Tags%5D=A11YMAS%3B+Accessibility%3B+Aria-attr%3B+ASR%3B+Bug-Activated%3B+HubsResource%3B+Ibiza%3B+MAS40B%3B+SEPOConfirmation%3B+V2A%3B+Wipro%3B+Wipro-Ibiza&%5BMicrosoft.VSTS.Common.ActivatedBy%5D=Paymon+Parsadmehr+%3CNORTHAMERICA%5Cpaparsad%3E&%5BMicrosoft.VSTS.Common.Priority%5D=1&%5BMicrosoft.Rd.HowFound%5D=Other&%5BMicrosoft.Azure.AreaIdValidation%5D=SelectedAreaIdIsValid&%5BMicrosoft.Azure.IssueType%5D=Code+Defect&%5BMicrosoft.VSTS.Common.StackRank%5D=1&%5BSystem.AreaPath%5D=RD%5CAzure+App+Plat%5CAzurePortal%5CFx) to file bugs


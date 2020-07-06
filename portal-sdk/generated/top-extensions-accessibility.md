<a name="accessibility"></a>
## Accessibility

Accessibility is about making the portal usable by people who have limitations that prevent or impede the use of conventional user interfaces. For some situations, accessibility requirements are imposed by law. However, Microsoft requires all blocking accessibility issues to be addressed regardless of legal requirements so the portal caters to the largest possible audience. The Framework team has taken an inclusive design approach in incorporating keyboard, programmatic, and visual design support throughout the Portal. Extensions are responsible for any graphics, styling, and custom HTML templates they provide.

What the framework provides-

1. The Framework provides reusable tiles, parts, forms, and controls that are fully accessible. Using the Form creation helper, your form will be fully accessible.
    * All Portal:
	    * Chrome
	    * Panes
	    * Sidebar
	    * Top nav
	    * Context menus
	    * Widgets

    * Keyboard shortcuts are provided and are listed within the Help Menu in the Portal. The shortcuts must work when using your extension content.
    * A fully accessible default theme (Blue). When using the blue theme, the contrast ratio for all text must meet the AAA guidelines that are located [here](http://www.interactiveaccessibility.com/web-accessibility-guideline).
    * The Portal supports `HighContrast` mode and should display controls and chrome accordingly.

1. Focus management is handled by the Framework and follows those rules, unless the focus is changed by the user first.
   * Focus moves to newly opened blade in the content section.
   * Focus moves to context pane when opened.
   * Focus should move freely across all elements visible in the Portal, except in the following cases:
	    * ContextMenu captures focus in a loop
        * DropMenu captures focus in a loop

NOTE: Currently, the focus is on the first focusable element.

<a name="accessibility-accessibility-checklist"></a>
### Accessibility Checklist

There are items for accessibility whose absence may result in bugs for the Framework team. In an effort to reduce the number of bugs, some guidelines are listed below - 

1. Extensions should update to SDK version 1240 or more recent.

1. Extension should update to use supported controls. An inventory of the latest, fully supported controls is located [here](http://aka.ms/portalfx/playground).
    NOTE: `DiffEditor`, `DatePolyFills`, and `PairedTimeline` are not supported by Framework.

1. Extensions should ensure theming support in both Light and Dark mode when using custom colors.

1. Extension should not interfere with High Contrast theming. A common mistake is to use a `<div>` element instead of an `<a>` element for a link.

1. When introducing user-actionable areas that are not based on supported controls, extension should use the `fxClick` knockout binding as documented. The `click` knockout binding is not supported.

1. Extensions that create custom implementation of supported controls should be identified.

1. Images and logos that are part of the Narrator Items mode should be labelled properly, or marked as `aria-hidden` if not significant.

1. Review all controls and ensure that labels are being used. If labels are omitted, then use aria labels in the `ViewModel`.
    NOTE: The aria-label is one tool used by assistive technologies like screen readers. However, it is not natively supported on browsers and has no effect on them. It will not be of use to the population that is served by WCAG, except screen reader users.
    
1. Verify keyboard accessibility of your blade content and forms. Navigate to your content in the Portal and ensure focus is captured to your content in the expected way. Autofocus on open provided by the framework.

1. Screen items have titles that are displayed on hover. If text or labels are missing from the screen, use the `TITLE` attribute to display them. If the `TITLE` attribute cannot display the information, use `aria-label`. For more information about HTML attributes, see [http://www.w3schools.com/html/html_attributes.asp](http://www.w3schools.com/html/html_attributes.asp).

1. Screen contrast has a minimum value. If the contrast is too low, use the WCAG color contrast tool that is located at [http://leaverou.github.io/contrast-ratio/](http://leaverou.github.io/contrast-ratio/) to adjust colors.

<a name="accessibility-before-testing"></a>
### Before testing

1. KEROS testing
    - Use Keros tool to address accessibility issues: Here's what you need to get started:
    - Install it from the Chrome store.
    - Watch a three minute video to learn about running a FastPass, using automated checks, and testing tab stops.
	- Questions: if you or someone from your team believes Keros is producing a false positive, contact (KerosSupport)

1. Email [C+E Accessibility Core Team](mailto:ceacc@microsoft.com?cc=paparsad@microsoft.com) to confirm that KEROS testing has been completed and that issues have been resolved.

1. C+E accessibility team will schedule vendor testing.

1. Vendor testing occurs. Vendors will open bugs directly to extension team's backlog.

1. Follow Bug triage process.

1. After all bugs are in Closed State extension team can go to GA.


C&E accessibility team governs all extensions compliance status and coordinates all vendor testing. Any questions regarding accessibility compliance should be routed to [C+E Accessibility Core Team](mailto:ceacc@microsoft.com). 

<a name="accessibility-testing-for-accessibility"></a>
### Testing for accessibility

When testing extensions, a report is created and made available to the extension team.

- Ibiza provides a list of common patterns that are not issues, with justifications/explanations
- Ibiza provides a list of external product bugs that are not issues to fix with justifications and bug links.

<a name="accessibility-high-contrast"></a>
### High-contrast

Windows High Contrast Mode (WHCM) has native support for Internet Explorer and Edge. Other browsers do not support WHCM natively, and neither do other operating systems, therefore a custom theme is provided in the settings pane of the Portal.

NOTE: The custom theme is a good approximation of WHCM behavior and can be used to quickly verify compliance. To properly verify, use High Contrast settings option 2 with Edge.

<a name="accessibility-screen-reader"></a>
### Screen reader

Compliance with Narrator/Edge are screen reader requirements.

<a name="accessibility-accessibility-test-engines"></a>
### Accessibility test engines

The following Websites provide accessibility test engines.

| Name                                                                                       	| Purpose                                                	|
|--------------------------------------------------------------------------------------------	|--------------------------------------------------------	|
| [aXe: the Accessibility Engine](http://www.deque.com/products/axe/)                        	| An open source rules library for accessibility testing 	|
| [Accessibility testing in Chrome Developer Tools](http://bitly.com/aXe-Chrome)             	| Chrome plugin                                          	|
| [aXe Developer Tools](http://bit.ly/aXe-Firefox)                                           	| Firefox plugin                                         	|
| [Accessibility engine for automated Web UI testing](https://github.com/dequelabs/axe-core) 	| axe-core (unit testing)                                	|

<a name="accessibility-troubleshooting-issues"></a>
### Troubleshooting issues

After developing and testing an extension for accessibility, if there are still issues, they may be known by the Framework team. Review [this site](http://vstfrd:8080/Azure/RD/_workitems#path=Shared+Queries%2FAUX%2FIbiza%2FAccessibility%2FIbiza+Accessibility+-+Triaged+Active&_a=query) to determine whether there are any known issues. If this is a new issue, you can file a Framework bug [here](http://aka.ms/portalfx/accessibility/bug) on controls owned by the Framework.

<a name="accessibility-accessibility-planning"></a>
### Accessibility Planning

Ibiza has streamlined the process of handling accessibility issues. When we resolve bugs, we send out updates for folks to be aware of progress, in addition to regressing testing updates from vendor teams. Please reach out to [ibiza-accessibility@microsoft.com](ibiza-accessibility@microsoft.com) if there are any other questions or concerns.

1. If a scenario results in multiple issues, you should separate those issues in separate bugs. Bugs with multiple issues cannot be resolved reliably.

1. Ensure that attachments, like .img, and .png files, contain screenshots with highlighted problem areas. Videos alone have not been helpful.

1. Screen reader issues, like alt-text and aria-attr labels, should be reported from testing with Edge using Narrator, or Firefox using NVDA. Other combinations will be deferred.

1. Screen reader fixes will be done for Edge using Narrator on Windows 10 Creators Update, and Firefox with NVDA. Regression testing should take those consideration into account.

1. Iframes are outside of the scope of the Framework, and do not have any dependencies on the Framework. Developers are responsible for testing and fixing these scenarios.

1. Legacy controls are being deprecated, and extensions should move to the updated version of the control in order to meet accessibility standards. A list of legacy controls is located [here](/portal-sdk/generated/top-extensions-samples-controls-deprecated.md).

1. Use [this bug template](http://vstfrd:8080/Azure/RD/_workItems#_a=new&witd=RDBug&%5BSystem.AssignedTo%5D=Paymon%20Parsadmehr%20%3CNORTHAMERICA%5Cpaparsad%3E&%5BSystem.Description%5D=%3Cp%3E%3Cb%3EUpdate%26nbsp%3Bthe%20following%20fields%20and%20erase%20these%20instructions%3A%3C%2Fb%3E%3C%2Fp%3E%3Cp%3E1-%20Change%20TITLE%3C%2Fp%3E%3Cp%3E2-%20Add%20proper%20TAGS%20%28see%20email%29%3C%2Fp%3E%3Cp%3E3-%20Ensure%20FILE%20ATTACHMENTS%20include%20a%20screenshot%20circling%20the%20issue%20area%20with%20brief%20text.%20Videos%20aren%27t%20sufficient.%20Please%20don%27t%20use%20zip%20files.%3C%2Fp%3E%3Cp%3E4-%20Update%20DESCRIPTION%20with%20repro%20to%20problem%20area%20and%20expected%20behavior.%20No%20MAS%20description%2C%20no%20sample.%20Just%20repro%20and%20expectation.%3C%2Fp%3E&%5BMicrosoft.Rd.HowFound%5D=Acceptance&%5BMicrosoft.Azure.IssueType%5D=Code%20Defect&%5BSystem.AreaPath%5D=RD%5CAzure%20App%20Plat%5CAzurePortal%5CFx&%5BSystem.IterationPath%5D=RD%5CAzure%20App%20Plat%5CIbiza%5CNext) to file bugs with the Azure team.

<a name="accessibility-bug-tagging"></a>
### Bug Tagging

About 95% of issues can be separated into eight categories. All bugs that you feel are framework issues need to be assigned to [Paymon Parsadmehr](mailto:paparsad@microsoft.com). If you feel that a bug falls into more than one category, please add all corresponding tags to the bug. If the bug does not fit any category, reach out to [Paymon Parsadmehr](mailto:paparsad@microsoft.com) to assess the issue.

The following is a description of the eight tags and their categories. There are also examples of each bug class to help you determine what tags to use if you still need to file a bug.

1. Alternate Text

    **ERROR:** Screen reader reads the text content, but the output is not helpful, or the output needs to be more descriptive, or no output is read except the control type.

    **TAG:** `AltText`
    
    - Example: Screen reader cursor is on a part and all the part content is read instead of expected text.
    - Example: Screen reader cursor is on an option picker control and all the options are read instead of a label.
    - Bug example: [RDBug 8105335](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=8105335): Azure API Management Service: More Services: Name Property is Empty for "Search the Market Place" edit box
    
    NOTE: Fixing bugs in this category may require downstream code changes. This is a top priority for the Ibiza team. We will send updates as we release SDK’s with updated controls.

1. Aria-attribute

    **ERROR:** Functionality not exposed to screen readers.
    
    **TAG:** `Aria-attr`
    
    - Bug example: [RDBug 8259873](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=8259873): Accessibility: MAS40B: Inspect: "Name" property is empty for 'Create' group.[Scenario: Creating NameSpace]

1. Contrast-Ratio

    **ERROR:** Contrast ratio of text color against background is insufficient (high contrast is a different issue).
    
    **TAG:** `ContrastRatio`
    
    - Example: Text does not have a contrast ratio of at least 7:1 on button in the “Azure” theme.
    - Bug example: [RDBug 8091694](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=8091694): [Accessibility] Luminosity contrast ratio is less than 4.5:1 for "Support" link in feedback pane under "Blue Alt" theme

1. High Contrast

    **ERROR:** All issues related to High Contrast mode.
    
    **TAG:** `Highcontrast`
    
    - Example: Focus not visible while using High Contrast Black-on-White mode in Edge on buttons.
    - Bug example: [RDBug 8133287](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=8091694): Ibiza Portal: Accessibility: High Contrast - Black: Data Lake: All Resources: Previous Page button is not visible in High Contrast - Black Theme

1. Focus-management

    **ERROR:** Focus set at an unexpected place, or focus is lost, or focus is trapped.
    
    **TAG:** `Focus-management`
    
    - Example: Focus lost when switching value in dropdown via keyboard.
    - Example: Cannot focus away from button once it captures focus.
    - Bug example: [RDBug 8679020](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=8679020): [Keyboard Navigation - KeyVault -Select Principle ] Focus order is not logical on the "Select Principle" blade.

1. Keyboard Accessibility

    **ERROR:** Activation and interaction via keyboard not working as expected or is inconsistent, or the item cannot be accessed via keyboard.
    
    **TAG:** `KeyboardAccess`
    
    - Example: Cannot tab to button.
    - Example: Cannot activate button with spacebar key.
    - Bug example: [RDBug 8220516](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=8220516): [Ibiza Portal]: Accessibility: MAS36: KB: Unable to access the Add to Favorites button (star button) for (Service Bus, Event Hubs, Relays) when navigated from "More Services -> Search Filter -> Service Bus/Event Hubs/Relays".

1. Grid

    **ERROR:** All issues related to Grid, regardless of the previous issues mentioned.
    
    **TAG:** `Grid`
    
    - Example: Grid does not expose the column header on the cell (would be Aria-attr, yet triages as Grid).
    - Bug example: [RDBug 8882413](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=8882413): Ibiza Portal:[B2A][E2A][E2E][V2A]Accessibility: Inspect :MAS40B: Name property is Inappropriate for column header items in 'Jobs' page of Azure Portal.

1. ListView

    **ERROR:** All issues related to ListView, regardless of the previous issues mentioned.
    
    **TAG:** `ListView`
    
    - Example: ListView does not read any content when focus is set on an element (would be AltText, yet triage as ListView).
    - Bug example: [RDBug 8133284](http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=8133284): Ibiza Portal: Usability: Narrator: Intune Data Lake: New: Narrator announces Contains 0 items for a list of 3 or more items

<a name="accessibility-for-more-information"></a>
### For more information

For more information about developing extensions with accessibility, see the following publications - 

- [Trusted Tester with Keros (internal only)](https://www.1eswiki.com/wiki/Trusted_Tester_with_Keros#What_is_Trusted_Tester.3F)
- [What is Keros? (internal only) Baseline accessibility assessment (internal only)](https://www.1eswiki.com/wiki/Trusted_Tester_with_Keros#What_is_Keros.3F)
- [Full MAS compliance assessment (internal only)](https://www.1eswiki.com/wiki/Trusted_Tester_with_Keros#Full_MAS_compliance_assessment)
- [WCAG color contrast tool](http://leaverou.github.io/contrast-ratio/)
- [WebAIM Accessibility](http://webaim.org/articles/)
- [AAA guidelines](http://www.interactiveaccessibility.com/web-accessibility-guidelines)
- [Natural tab order](https://www.paciellogroup.com/blog/2014/08/using-the-tabindex-attribute/)
- [Web semantics](http://www.w3schools.com/html/html5_semantic_elements.asp)

<a name="accessibility-best-practices"></a>
### Best Practices

1. Design and code your extension with accessibility in mind

1. Use Portal tiles/parts, forms, and controls whenever possible, as those are designed to be accessible

1. Use HTML semantics when using custom HTML, as described in http://www.w3schools.com/html/html5_semantic_elements.asp. For example, create buttons with the BUTTON tag instead of a styled DIV tag.

1. Avoid using aria-* attributes. If you find yourself using those attributes, review your design and try to use HTML semantics as much as possible.

1. Provide concise, meaningful instructions for user input.

1. Scrub your content for consistent terminology and iconography before releasing it to the public

1. Always use multiple sensory cues to convey information. Never use the position, orientation, size, shape, or color of a UI element alone to communicate important information to the user.

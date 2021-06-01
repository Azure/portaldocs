* [Accessibility](#accessibility)
    * [What the framework provides](#accessibility-what-the-framework-provides)
        * [Knockout and React views controls](#accessibility-what-the-framework-provides-knockout-and-react-views-controls)
        * [Declarative views](#accessibility-what-the-framework-provides-declarative-views)
        * [Portal theming](#accessibility-what-the-framework-provides-portal-theming)
        * [Keyboard access](#accessibility-what-the-framework-provides-keyboard-access)
        * [Focus management](#accessibility-what-the-framework-provides-focus-management)
        * [Special screen reader announcements](#accessibility-what-the-framework-provides-special-screen-reader-announcements)
        * [Responsive design support](#accessibility-what-the-framework-provides-responsive-design-support)
    * [Troubleshooting and handling bugs assigned from accessibility testing team](#accessibility-troubleshooting-and-handling-bugs-assigned-from-accessibility-testing-team)
        * [Always resolve bugs, never transfer](#accessibility-troubleshooting-and-handling-bugs-assigned-from-accessibility-testing-team-always-resolve-bugs-never-transfer)
        * [Steps for resolution](#accessibility-troubleshooting-and-handling-bugs-assigned-from-accessibility-testing-team-steps-for-resolution)
        * [Resources](#accessibility-troubleshooting-and-handling-bugs-assigned-from-accessibility-testing-team-resources)
    * [Testing content for accessibility compliance](#accessibility-testing-content-for-accessibility-compliance)


<a name="accessibility"></a>
# Accessibility

Accessibility is about making the portal usable by everyone. There are many resources available at Microsoft to help on guidance, testing, and reporting. For terseness, this document assumes basic knowledge on the topic. Please refer to the [Microsoft Accessibility resources website](aka.ms/enable) for details if needed.

This document focuses on how the framework enables content owner to implement accessible UI, and how to address bugs that are filed from the accessibility testing team.

<a name="accessibility-what-the-framework-provides"></a>
## What the framework provides

<a name="accessibility-what-the-framework-provides-knockout-and-react-views-controls"></a>
### Knockout and React views controls

In Knockout and React views, the framework provides reusable and accessible controls. The documentation of each framework covers how to use the APIs of each control to maximize the accessible exposure. Note that controls have specific supported usage scenarios. Guidance is published in the documentation about those scenarios.

>**NOTE**: Using controls in non-supported scenarios are to be ensure accessible by content owners.

<a name="accessibility-what-the-framework-provides-declarative-views"></a>
### Declarative views

The Declarative views are fully supported as accessible.

<a name="accessibility-what-the-framework-provides-portal-theming"></a>
### Portal theming

All portal themes, including high contrast emulations, are accessible. Refer to the Knockout and React views documentation on how to adapt to themeing changes.

>**NOTE**: The high contrast themes of the portal are emulations of the actual Windows High Contrast Mode (WHCM). To ensure proper behavior, please test conformance using Microsoft Edge with WHCM turned on.

<a name="accessibility-what-the-framework-provides-keyboard-access"></a>
### Keyboard access

The portal framework manages focus on navigation. Interactive elements, including controls, will manage keyboard access for most scenarios in both Knockout and React views.

In Knockout views, content owners can add special interactivity via the `fxclick` API. The `fxclick` API will add the proper keyboard binding support based on the element calculated role.

>**NOTE**: While the `fxclick` API will manage tabbability, it will not manage accessible role and attributes. Content owners should ensure they either use a proper semantic element like `button` or assign a `role` attribute, while also managing any relevant `aria-*` attributes for that role.

<a name="accessibility-what-the-framework-provides-focus-management"></a>
### Focus management

Focus management is handled mostly automatically. There are times where extension will need to manage focus if they perform certain operations that requires so.

* [Managing focus in Knockout views](https://df.onecloud.azure-test.net/?SamplesExtension=true#blade/SamplesExtension/SDKMenuBlade/extensionfocus)
* In React views, content owner should use the DOM API.

<a name="accessibility-what-the-framework-provides-special-screen-reader-announcements"></a>
### Special screen reader announcements

There are scenarios where the screen reader should get additional callouts for operations triggered by the extension.

* [Adding announcements in Knockout views](https://df.onecloud.azure-test.net/?SamplesExtension=true#blade/SamplesExtension/SDKMenuBlade/announceapi)
* In React views, please refer to the API documentation of the UI framework used.

<a name="accessibility-what-the-framework-provides-responsive-design-support"></a>
### Responsive design support

The portal support responsive UI principles that allow maximum content from extension to be visible and usable at all times. Please refer to the [responsive design documentation](top-design-responsive.md) for more details.

<a name="accessibility-troubleshooting-and-handling-bugs-assigned-from-accessibility-testing-team"></a>
## Troubleshooting and handling bugs assigned from accessibility testing team

<a name="accessibility-troubleshooting-and-handling-bugs-assigned-from-accessibility-testing-team-always-resolve-bugs-never-transfer"></a>
### Always resolve bugs, never transfer

The accessibility testing team is responsible for tracking all accessibility issues of the ecosystem for fixes and responsible parties. As such, bugs opened on a team need to be resolved back to the accessibility testing team and should not be transferred. Transferring the bug will not remove it to count against the extension compliance bar.

<a name="accessibility-troubleshooting-and-handling-bugs-assigned-from-accessibility-testing-team-steps-for-resolution"></a>
### Steps for resolution

Follow these questions to resolve accessibility bugs filed against the content.

*Is the bug located in content owned by another extension?*

Determine the extension owner, and add a comment to the bug discussion to that effect. Resolve the bug as external to that extension.

*Is the bug related to using a screen reader?*

The bug should contain description that this was tested with specific combinations. The supported combinations are Mozilla Firefox with NVDA, Google Chrome with JAWS, and Microsoft Edge with Narrator. Any other combinations are invalid. The bug should also state which combinations fail and which do not fail. If there are successful combinations, while one fails, this is usually an indication the issues is external to the browser/screen reader combo. Proceed with the additional questions below for completeness. You may resolve the bug as external to the tooling afterward.

*Is the bug related to using portal SDK controls or UI elements?*

Determine which control the bug relates to. Controls have supported usage scenarios, and provide APIs to cover most accessibility concerns like missing labels or state management. Determine if you are using the controls for supported scenarios, and ensure all APIs entry point that can help solve the issue have been investigated and used. If there is nothing as the content owner you can do, add a comment to the bug discussion to that effect and mention the control used or the portal element. Resolve the bug as external to the framework.

*Is the bug not covered by any questions above?*

The bug is most likely fixable by the content owner.

<a name="accessibility-troubleshooting-and-handling-bugs-assigned-from-accessibility-testing-team-resources"></a>
### Resources

There are many answers available for accessibility on Ibiza that can be searched from [Questions tagged 'ibiza-accessibility' on StackOverflow@Microsoft](https://stackoverflow.microsoft.com/posts/tagged/6752). If you cannot find an answer, please post a new question with the `ibiza-accessibility` tag.

<a name="accessibility-testing-content-for-accessibility-compliance"></a>
## Testing content for accessibility compliance

The test framework `msportalfx-test` supports regression testing that matches the automated check done with the Accessibility Insights tool. Refer to the documentation of the test framework on usage. Content should also add any additional tests they may need to cover their compliance level.

## Exit criteria & quality metrics

In order to meet customer expectations and continue to increase customer satisfaction, the following quality metrics
are tracked for every extension:

1. Performance
2. Reliability
3. Usability
4. Accessibility
6. Feature adoption

### Performance (Stakeholder: [Sean Watson](mailto:ibiza-perf@microsoft.com))

**All blades must meet the required blade reveal time of <4 seconds for the 80th percentile** before being enabled in
PROD. Extensions must be enabled in MPAC to start tracking performance. Resource and Create blades are tracked
explicitly. All other blades are rolled up into **Weighted Experience Score (WxP), which must be >80**. WxP
determines the percentage of blade usage that meets the performance bar.

Blade reveal time is the time it takes for all the parts above to fold to call revealContent() (load 1st level data)
or to resolve onInputSet() promises, whichever is earlier.

MPAC and PROD performance is included in weekly status emails and each team is expected to investigate regressions.

See also:
- [Dashboard](http://aka.ms/portalfx/dashboard/extensionperf)
    - [Join auxdatapartners](http://igroup/join/auxdatapartners) for access
- [Checklist](/portal-sdk/generated/index-portalfx-extension-monitor.md#performance-checklist)
- [Portal COP](/portal-sdk/generated/index-portalfx-extension-monitor.md#portalcop)
- [Best pracitces](/portal-sdk/generated/index-portalfx-extension-monitor.md#performance-best-practices)
- [#ibiza-performance on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-performance)
- [Ask a question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-performance)


### Reliability (Stakeholder: [Sean Watson](mailto:ibiza-reliability@microsoft.com))

Every extension, blade, and part must meet the **reliability SLA**. Extension, resource blade, and Create blade
reliability metrics must be met before your extension will be enabled in PROD. Extensions must be enabled in MPAC to
start tracking reliability.

MPAC and PROD reliability is included in weekly status emails and each team is expected to investigate regressions.

See also:
- [#ibiza-performance on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-performance)
- [Ask a question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-performance)


### Usability (Stakeholder: [Angela Moulden](ibiza-usability@microsoft.com))

Each service must define the critical, P0 scenarios for their business. These scenarios must be usability tested to
ensure 80% success rates and an experience score of 80 (based on a short survey). Usability must be measured by
testing at least 10 participants.


### Accessibility (Stakeholder: [Paymon Parsadmehr](ibiza-accessibility@microsoft.com))

Similar to the usability bar, every service must meet the Microsoft standards for accessibility.

- [Accessibility documentation](/portal-sdk/generated/index-portalfx-extension-accessibility.md)
- [#ibiza-accessibility on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-accessibility)
- [Ask a question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-accessibility)


### Feature adoption

All extensions are required to complete the following before being enabled in PROD. None are required to be enabled
in MPAC. Track status on the [feature adoption sign-off dashboard](http://aka.ms/portalfx/dashboard/featureadoption/signoff)
(doesn't include menu blade for services [as opposed to resources], deployment success rates, Create dropdowns/PCv3, or
Browse menu placement).

1. **Menu blade** (aka resource menu; Stakeholders: [Sean Watson, Edison Park](mailto:ibiza-menu-blade@microsoft.com))

    All services must implement the menu blade instead of the Settings pattern. ARM resources should opt in to the
    resource menu for a simpler, streamlined menu.

    Every service must include the following menu items:
    - Resource health -- Check the health of any resource from the resource blade via settings (Stakeholder: Bernardo Alfredo Munoz)
    - Troubleshoot -- Have a [Troubleshoot link](onenote:https://microsoft.sharepoint.com/teams/WAG/EngSys/Supportability/SiteAssets/Supportability%20Notebook/CustomerEnablement.one#Overview&section-id={6468807B-191F-4A37-BB00-C9C0F820459D}&page-id={B7A17DE5-7A04-4193-B1EB-CFD811F233B8}&end) in the resource menu to surface self-help solutions on common issues (Stakeholder: [AzSFAdoption](AzSFAdoption@microsoft.com))
    - Create support request -- Be able to create a support request from the menu (Stakeholder: Ganga Narayanan)

    See also:
    - [#ibiza-blades-parts on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-blades-parts) for menu blade questions
    - [#ibiza-resources on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-resources) for resource menu questions
    - [Ask a menu blade question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-blades-parts)
    - [Ask a resource menu question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-resources)

2. **Create success** (Stakeholder: [Paymon Parsadmehr](mailto:ibiza-create@microsoft.com))

    Every Create blade must meet the create success rate standard. For latest numbers see Power BI. 
    If create workflow success drops 5% over a rolling 24h period with 50+ creates, a sev 2 incident will be filed.
    This covers every error that causes Creates to fail after the user clicks the Create button. Extensions/RPs are responsible for validating all inputs to ensure the user cannot click the create button unless that create will be successful. 
    Services that use template deployment must opt in to RP registration checks, deployment validation, and required permission checks to avoid common errors.

    See also:
    - [#ibiza-create on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-create)
    - [Ask a question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-create)
 
3. **Activity logs** (Stakeholder: [Rajesh Ramabathiran](mailto:ibiza-activity-logs@microsoft.com))

    Activity/event/operation/audit logs must be available from the menu for all services. Subscription-based resources
    (not just tracked resources) get this for free when implementing the resource menu. All other services are
    required to add the equivalent experience for their service.

4. **Create blades** (Stakeholder: [Michael Flanakin, Paymon Parsadmehr](mailto:ibiza-create@microsoft.com))

    All Create blades must be a single blade. Do not use wizards or picker blades. Use form sections and dropdowns.
    Subscription-based resources must use the built-in subscription, resource group, location, and pricing dropdowns;
    especially in Create blades. These each cover common scenarios that will save time and avoid deployment failures.

    See also:
    - [Create documentation](/portal-sdk/generated/index-portalfx-extension-development.md#common-scenarios-building-create-experiences)
    - [#ibiza-create on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-create)
    - [Ask a question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-create)

5. **PCv3** (Stakeholder: [Paymon Parsadmehr](mailto:ibiza-create@microsoft.com))

    Use Parameter Collector v3, especially for Create blades. Do not use v1 or v2 anywhere. The newer version has
    improved APIs, performance, and telemetry.

    See also:
    - [Parameter collection documentation](/portal-sdk/generated/index-portalfx-extension-development.md#introduction-to-parameter-collection)
    - [#ibiza-forms on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-forms)
    - [Ask a question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-forms)
 
6. **Automation options from Create** (Stakeholder: [Paymon Parsadmehr](mailto:ibiza-create@microsoft.com))

    Every service should expose a way to get scripts to automate provisioning. Automation options should include CLI,
    PowerShell, .NET, Java, Node, Python, Ruby, PHP, and REST (in that order). Tracked resources that use the
    built-in template deployment API are opted in by default.

7. **Browse menu placement** (Stakeholder: [Edison Park](mailto:ibiza-browse@microsoft.com))

    All services must be added to a specific category in the Browse/Services menu (under favorites on the left).
    Categorization will be the same as it is for azure.com’s products menu. The Fx team needs to know what asset
    types will be added to ensure your service is placed in the correct categories. (Asset type names are defined in
    extension PDL.)

    See also:
    - [Browse documentation](/portal-sdk/generated/index-portalfx-extension-development.md#common-scenarios-building-browse-experiences)
    - [Asset documentation](/portal-sdk/generated/index-portalfx-extension-development.md#resource-management-assets)
    - [#ibiza-browse on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-browse)
    - [Ask a question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-browse)

The following features are required for all subscription-based resources:

1. **Deployment validation** (Stakeholder: [Paymon Parsadmehr](mailto:ibiza-create@microsoft.com))

    The following validation must be included:
    - Opt in to RP registration checks on the subscription dropdown
    - Specify required permissions on the resource group dropdown
    - Opt in to deployment validation

    See also:
    - [#ibiza-create on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-create)
    - [Ask a question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-create)

2. **Resource move** (Stakeholder: [Edison Park](mailto:ibiza-resourceMove@microsoft.com))

    Being able to move your resource from one subscription or resource group to another.

    See also:
    - [Documentation](/documentation/articles/portalfx-resourcemove)
    - [Dashboard](http://aka.ms/portalfx/resourcemove/dashboard)
    - [#ibiza-resources on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-resources)
    - [Ask a question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-resources)

3. **Create from Browse** (Stakeholder: [Edison Park](mailto:ibiza-browse@microsoft.com))

    Have an "Add" command in the Browse blade for that resource.

    See also:
    - [Browse documentation](/documentation/articles/portalfx-browse)
    - [Asset documentation](/documentation/articles/portalfx-assets)
    - [#ibiza-browse on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-browse)
    - [Ask a question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-browse)

4. **Context menu commands in Browse** (Stakeholder: [Edison Park](mailto:ibiza-browse@microsoft.com))

    Within the Browse blade, your resource specific commands should be available on right-click or when the user
    clicks on the "...".

    Have an "Add" command in the Browse blade for that resource.

    See also:
    - [Browse documentation](/documentation/articles/portalfx-browse)
    - [#ibiza-browse on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-browse)
    - [Ask a question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-browse)

5. **Show all resource properties in the Browse column chooser**

    Within the Browse blade, you should have all your resource specific columns available in the column chooser to
    allow users to see data they need.

    See also:
    - [Browse documentation](/documentation/articles/portalfx-browse)
    - [#ibiza-browse on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-browse)
    - [Ask a question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-browse)

6. **Export template / RP schema**

    ARM RPs must provide a schema for all tracked and nested resource types to ensure they support the export template
    capability. Export template is enabled by default from the resource menu.

    See also:
    - [RP schema documentation](http://aka.ms/rpschema)

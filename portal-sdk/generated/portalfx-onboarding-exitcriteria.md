* [Exit criteria & quality metrics](#exit-criteria-quality-metrics)
    * [Performance (Stakeholder: [Sean Watson](mailto:ibiza-perf@microsoft.com))](#exit-criteria-quality-metrics-performance-stakeholder-sean-watson-mailto-ibiza-perf-microsoft-com)
    * [Reliability (Stakeholder: [Sean Watson](mailto:ibiza-reliability@microsoft.com))](#exit-criteria-quality-metrics-reliability-stakeholder-sean-watson-mailto-ibiza-reliability-microsoft-com)
    * [Usability (Stakeholder: [Angela Moulden](ibiza-usability@microsoft.com))](#exit-criteria-quality-metrics-usability-stakeholder-angela-moulden-ibiza-usability-microsoft-com)
    * [Accessibility (Stakeholder: [Paymon Parsadmehr](ibiza-accessibility@microsoft.com))](#exit-criteria-quality-metrics-accessibility-stakeholder-paymon-parsadmehr-ibiza-accessibility-microsoft-com)
    * [Create success (Stakeholder: [Paymon Parsadmehr](mailto:ibiza-create@microsoft.com))](#exit-criteria-quality-metrics-create-success-stakeholder-paymon-parsadmehr-mailto-ibiza-create-microsoft-com)
    * [Resource move (Stakeholder: [Edison Park](mailto:ibiza-resourceMove@microsoft.com))](#exit-criteria-quality-metrics-resource-move-stakeholder-edison-park-mailto-ibiza-resourcemove-microsoft-com)


<a name="exit-criteria-quality-metrics"></a>
## Exit criteria &amp; quality metrics

In order to meet customer expectations and continue to increase customer satisfaction, the following quality metrics
are tracked for every extension:

1. Performance
2. Reliability
3. Usability
4. Accessibility
5. Create success
6. Resource move (ARM subscription-based services only)

<a name="exit-criteria-quality-metrics-performance-stakeholder-sean-watson-mailto-ibiza-perf-microsoft-com"></a>
### Performance (Stakeholder: <a href="mailto:ibiza-perf@microsoft.com">Sean Watson</a>)

**All blades must meet the required blade reveal time of <4 seconds for the 80th percentile** before being enabled in
PROD. Extensions must be enabled in MPAC to start tracking performance. Resource and Create blades are tracked
explicitly. All other blades are rolled up into **Weighted Experience Score (WxP), which must be >80**. WxP
determines the percentage of blade usage that meets the performance bar.

Blade reveal time is the time it takes for all the parts above to fold to call revealContent() (load 1st level data)
or to resolve `onInputSet()` promises, whichever is earlier.

MPAC and PROD performance is included in weekly status emails and each team is expected to investigate regressions.

See also:
- [Dashboard](http://aka.ms/portalfx/dashboard/extensionperf)
    - [Join auxdatapartners](http://igroup/join/auxdatapartners) for access
- [Checklist](/portal-sdk/generated/index-portalfx-extension-monitor.md#performance-checklist)
- [Portal COP](/portal-sdk/generated/index-portalfx-extension-monitor.md#portalcop)
- [Best pracitces](/portal-sdk/generated/index-portalfx-extension-monitor.md#performance-best-practices)
- [#ibiza-performance on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-performance)
- [Ask a question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-performance)


<a name="exit-criteria-quality-metrics-reliability-stakeholder-sean-watson-mailto-ibiza-reliability-microsoft-com"></a>
### Reliability (Stakeholder: <a href="mailto:ibiza-reliability@microsoft.com">Sean Watson</a>)

Every extension, blade, and part must meet the **reliability SLA**. Extension, resource blade, and Create blade
reliability metrics must be met before your extension will be enabled in PROD. Extensions must be enabled in MPAC to
start tracking reliability.

MPAC and PROD reliability is included in weekly status emails and each team is expected to investigate regressions.

See also:
- [#ibiza-performance on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-performance)
- [Ask a question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-performance)


<a name="exit-criteria-quality-metrics-usability-stakeholder-angela-moulden-ibiza-usability-microsoft-com"></a>
### Usability (Stakeholder: <a href="ibiza-usability@microsoft.com">Angela Moulden</a>)

Each service must define the critical, P0 scenarios for their business. These scenarios must be usability tested to
ensure 80% success rate and an 80% experience score (based on a short survey). Usability must be measured by testing
with at least 10 participants.


<a name="exit-criteria-quality-metrics-accessibility-stakeholder-paymon-parsadmehr-ibiza-accessibility-microsoft-com"></a>
### Accessibility (Stakeholder: <a href="ibiza-accessibility@microsoft.com">Paymon Parsadmehr</a>)

Similar to the usability bar, every service must meet the Microsoft standards for accessibility for their critical, P0
scenarios. Teams within C+E should work with the C+E Accessibility team to verify accessibility.

_**NOTE:** Accessibility is a **non-blocking** requirement today, but it will be blocking in CY2017._

- [Accessibility documentation](/portal-sdk/generated/index-portalfx-extension-accessibility.md)
- [#ibiza-accessibility on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-accessibility)
- [Ask a question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-accessibility)


<a name="exit-criteria-quality-metrics-create-success-stakeholder-paymon-parsadmehr-mailto-ibiza-create-microsoft-com"></a>
### Create success (Stakeholder: <a href="mailto:ibiza-create@microsoft.com">Paymon Parsadmehr</a>)

Every Create blade must meet the create success rate. For Create SLA check the Power BI Dashboard. If success drops 5% on a rolling 24h period with 50+ Creates, a
sev 2 incident will be filed. This covers every error that causes Creates to fail after the user clicks the Create
button. Extensions/RPs are responsible for validating all inputs to ensure the Create isn't submitted unless that
Create will be successful. This applies to all services, whether using ARM or not.

Services that use ARM template deployment must opt in to [RP registration checks, deployment validation, and required
permission checks](http://aka.ms/portalfx/create#validation) to avoid common issues and help improve your success rates.

_**NOTE:** Create success rates are a **non-blocking** requirement, but opting into applicable validation is required
for preview/GA (for ARM-based services). Any blades with a success rate below 99% will result in sev 2 incidents based
on the above logic._

See also:
- [Create validation](http://aka.ms/portalfx/create#validation)
- [#ibiza-create on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-create)
- [Ask a question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-create)


<a name="exit-criteria-quality-metrics-resource-move-stakeholder-edison-park-mailto-ibiza-resourcemove-microsoft-com"></a>
### Resource move (Stakeholder: <a href="mailto:ibiza-resourceMove@microsoft.com">Edison Park</a>)

ARM-based services must allow customers to move resources between subscriptions and resource groups.

See also:
- [Documentation](portalfx-resourcemove.md)
- [Dashboard](http://aka.ms/portalfx/resourcemove/dashboard)
- [#ibiza-resources on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-resources)
- [Ask a question](https://stackoverflow.microsoft.com/questions/ask?tags=ibiza-resources)

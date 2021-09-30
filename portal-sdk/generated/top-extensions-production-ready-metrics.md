<a name="production-ready-metrics-and-quality-metrics"></a>
## Production Ready Metrics and Quality Metrics

The Portal team has established standard quality metrics that help you determine if your extension is ready to be made available to the general public (public preview or GA). You are expected to meet this criteria before shipping and maintain high quality over time.

The metrics are reported as part of an executive summary every Friday. Extensions that fail to meet the criteria are flagged in the report and may be asked to come to the regular executive product syncs to discuss their quality issues.

* [Performance](#performance)
* [Reliability](#reliability)
* [Usability](#usability)
* [Accessibility](#accessibility)
* [Localization](#localization)
* [Create Success Rate](#create-success-rate)
* [Resource move](#resource-move)

<a name="production-ready-metrics-and-quality-metrics-performance"></a>
### Performance

All blades must meet the required blade reveal time of < 4 seconds for the 80th percentile and < 8 seconds for the 95th percentile before being enabled in PROD. Extensions must be enabled in MPAC, the internal environment, to start tracking performance. Resource and Create blades are tracked explicitly. All blades are rolled up into Weighted Experience Score (WxP), which must be greater than 80. WxP determines the percentage of blade usage that meets the performance bar.

**BladeFullReady** is the time it takes a blade to fully load. Your blades should load faster than 4 seconds at the 95th percentile.

You should see at least 100 loads of the UX (extension/blade/tiles) to get a reliable signal. If you cannot generate that traffic authentically in the expected timeframe, please hold a bug bash to increase the traffic.

You can measure your current numbers by running the following query which targets the Partner table in the Azportal cluster.

```json
BladePerformanceIncludingNetwork(ago(1d), now())
| where Extension == "Microsoft_Azure_Compute"
```

There is also a Power BI Dashboard located at [https://aka.ms/portalfx/dashboard/extensionperf](https://aka.ms/portalfx/dashboard/extensionperf).

For more information about performance and reliability, see the following resources:

  * Telemetry Access for access

    [portalfx-telemetry-getting-started.md](portalfx-telemetry-getting-started.md)

  * Query - including test/dev traffic

    [https://aka.ms/portalfx/perfsignoff](https://aka.ms/portalfx/perfsignoff)

* Checklist

    [portalfx-performance.md](performance.md)

<a name="production-ready-metrics-and-quality-metrics-reliability"></a>
### Reliability

Every extension meets the reliability Service Level Agreement (SLA). There are some reliability metrics to meet previous to enabling the extension in the production environment; however, extensions must be enabled in MPAC in order to start tracking reliability. Meeting the reliability bar is a requirement for public preview or GA.

MPAC and PROD reliability are included in weekly status emails and each team is expected to investigate regressions.

We require at least 100 loads of the UX (extension/blade/tiles) to get a signal. If you cannot generate that traffic authentically in the expected timeframe, please hold a bug bash to increase traffic.

To calculate the performance and reliability of your extension, use the query located at [https://aka.ms/portalfx/perfsignoff](https://aka.ms/portalfx/perfsignoff).

```json
    // First parameter startDate
    // Second parameter timeSpan
    // Third parameter includeTestTraffic - set this to `false` if you are already in public preview
    GetExtensionPerfReliability(now(),7d,true)
    | where extension == "<extensionName>"
```

If any of the reliability numbers of the extension are below the bar, please investigate and resolve the related issues.

<a name="production-ready-metrics-and-quality-metrics-usability"></a>
### Usability

Each service or extension defines the critical P0 scenarios for their business. The extension is tested using these usability scenarios, with at least ten participants. A success rate of 80% and an experience score of 80% are required for a passing usability score.

If you do not have access to a user research team, then please contact the <a href="mailto:ibiza-onboarding@microsoft.com?subject=Need User Research Team">Portal team</a> for assistance.

<a name="production-ready-metrics-and-quality-metrics-accessibility"></a>
### Accessibility

The accessibility bar is similar to the usability bar, and every service must meet the accessibility standards that are tested in their critical P0 scenarios. C+E teams should work with the core C + E accessibility team.

**NOTE**: Accessibility, like security review, is a blocking requirement.

For more information about accessibility, see [portalfx-accessibility.md](portalfx-accessibility.md).

<a name="production-ready-metrics-and-quality-metrics-localization"></a>
### Localization

Nearly 70% of Azure users are from outside of the United States. Therefore, it is important to make Azure a globalized product. There are a few requirements under the "Internationalization" criteria that your service is required to support.  This is the same set of languages that are supported by Azure Portal for GA. For more information about internationalization requirements, see [https://aka.ms/AzureGR](https://aka.ms/AzureGR). For onboarding localization, please reach out to Bruno Lewin and the Internationalization team at <a href="mailto:ibiza-interntnl@microsoft.com?subject=Onboarding localization">Internationalization team</a>.

<a name="production-ready-metrics-and-quality-metrics-create-success-rate"></a>
### Create Success Rate

The user's ability to purchase or create Azure resources is a critical scenario for the product. Users fill out a form to create a resource, validation passes, and they click the create button. When a user gets to this point, we expect the create operation to succeed at least 99% of the time.

Extensions and Resource Providers (RPs) are responsible for validating all inputs to ensure the Create is not submitted unless that Create will be successful. This applies to all services.

Services that use ARM template deployment and other ARM-based services should also validate resource provider registration, permissions, and deployment to avoid common issues and improve extension success rates.

<!--TODO: Locate or create Query
-->
You can measure your current success rates on create blades that are live by using the following query.

You can also see the current stats in PowerBI located at [https://aka.ms/portalfx/successrates](https://aka.ms/portalfx/successrates).

For more information about creating success, see [portalfx-create.md#validation](portalfx-create.md#validation).

<a name="resource-move"></a>
## Resource move

ARM-based services allow customers to move resources between subscriptions and resource groups. You should support this in the UX.

For more information on resource moves, see the following resources.

* Documentation

    [portalfx-resourcemove.md](portalfx-resourcemove.md)

* Status Dashboard in PowerBI

    [https://aka.ms/portalfx/resourcemove/dashboard](https://aka.ms/portalfx/resourcemove/dashboard)

<a name="telemetry"></a>
# Telemetry
* [Getting Started](portalfx-telemetry-getting-started.md#getting-started)
    * [Pre-requisites](portalfx-telemetry-getting-started.md#pre-requisites)
    * [Kusto Cluster Information](portalfx-telemetry-getting-started.md#kusto-cluster-information)
    * [User Access and Permissions](portalfx-telemetry-getting-started.md#user-access-and-permissions)
    * [Programmatic Access](portalfx-telemetry-getting-started.md#programmatic-access)
    * [FAQ](portalfx-telemetry-getting-started.md#faq)
    * [Resources](portalfx-telemetry-getting-started.md#resources)
    * [Contact Links](portalfx-telemetry-getting-started.md#contact-links)

* [Kusto Telemetry](portalfx-telemetry-kusto-databases.md#kusto-telemetry)

* [Portal Telemetry Overview](portalfx-telemetry.md#portal-telemetry-overview)
    * [Logging](portalfx-telemetry.md#logging)
    * [Available Power BI Dashboards](portalfx-telemetry.md#available-power-bi-dashboards)
    * [Collecting Feedback From Your Users](portalfx-telemetry.md#collecting-feedback-from-your-users)

* [How to verify live Telemetry](portalfx-telemetry-live-telemetry.md#how-to-verify-live-telemetry)
    * [Using Console Logs](portalfx-telemetry-live-telemetry.md#using-console-logs)
    * [Using Fiddler](portalfx-telemetry-live-telemetry.md#using-fiddler)

* [Extension Client Errors](portalfx-telemetry-extension-errors.md#extension-client-errors)
    * [How to log errors](portalfx-telemetry-extension-errors.md#how-to-log-errors)
    * [How to analyze client errors](portalfx-telemetry-extension-errors.md#how-to-analyze-client-errors)

* [Create Telemetry](portalfx-telemetry-create.md#create-telemetry)
    * [Create Flow Telemetry Dashboards](portalfx-telemetry-create.md#create-flow-telemetry-dashboards)
    * [Create Flow table](portalfx-telemetry-create.md#create-flow-table)
    * [Create Flow Functions](portalfx-telemetry-create.md#create-flow-functions)


<a name="create-troubleshooting"></a>
# Create Troubleshooting
* [Create Troubleshooting](portalfx-create-troubleshooting.md#create-troubleshooting)
    * [Overview](portalfx-create-troubleshooting.md#overview)
    * [Types of Create Failures](portalfx-create-troubleshooting.md#types-of-create-failures)
    * [Debugging Alerts](portalfx-create-troubleshooting.md#debugging-alerts)


<a name="performance"></a>
# Performance
* [Performance Overview](top-extensions-performance.md#performance-overview)
    * [Extension-loading performance](top-extensions-performance.md#extension-loading-performance)
    * [Blade performance](top-extensions-performance.md#blade-performance)
    * [Part performance](top-extensions-performance.md#part-performance)
    * [How to assess your performance](top-extensions-performance.md#how-to-assess-your-performance)
* [Performance Frequently Asked Questions (FAQ)](top-extensions-performance.md#performance-frequently-asked-questions-faq)
    * [My Extension 'load' is above the bar, what should I do](top-extensions-performance.md#my-extension-load-is-above-the-bar-what-should-i-do)
    * [My Blade 'FullReady' is above the bar, what should I do](top-extensions-performance.md#my-blade-fullready-is-above-the-bar-what-should-i-do)
    * [My Part 'Ready' is above the bar, what should I do](top-extensions-performance.md#my-part-ready-is-above-the-bar-what-should-i-do)
    * [My WxP score is below the bar, what should I do](top-extensions-performance.md#my-wxp-score-is-below-the-bar-what-should-i-do)
    * [Is there any way I can get further help](top-extensions-performance.md#is-there-any-way-i-can-get-further-help)
* [Performance best practices](top-extensions-performance.md#performance-best-practices)
    * [Checklist](top-extensions-performance.md#checklist)
    * [Operational best practices](top-extensions-performance.md#operational-best-practices)
    * [Coding best practices](top-extensions-performance.md#coding-best-practices)
    * [General best practices](top-extensions-performance.md#general-best-practices)
* [Using the Portals ARM Token](top-extensions-performance.md#using-the-portals-arm-token)
    * [Changes required](top-extensions-performance.md#changes-required)
* [Extension load shim dependencies (removing shims)](top-extensions-performance.md#extension-load-shim-dependencies-removing-shims)
    * [How to fix shim usage](top-extensions-performance.md#how-to-fix-shim-usage)
* [Performance profiling](top-extensions-performance.md#performance-profiling)
    * [How to profile your scenario](top-extensions-performance.md#how-to-profile-your-scenario)
    * [Identifying common slowdowns](top-extensions-performance.md#identifying-common-slowdowns)
    * [Verifying a change](top-extensions-performance.md#verifying-a-change)
* [V2 targets](top-extensions-performance.md#v2-targets)
    * [Prerequisites](top-extensions-performance.md#prerequisites)
    * [Get your extension building with tsconfig.json](top-extensions-performance.md#get-your-extension-building-with-tsconfig-json)
    * [Get extension building using V2 targets](top-extensions-performance.md#get-extension-building-using-v2-targets)
    * [Enabling CloudBuild support](top-extensions-performance.md#enabling-cloudbuild-support)
    * [Common errors](top-extensions-performance.md#common-errors)
    * [Breaking changes between V1 and V2 targets](top-extensions-performance.md#breaking-changes-between-v1-and-v2-targets)
* [Dependency injected view models](top-extensions-performance.md#dependency-injected-view-models)
    * [Prerequistes](top-extensions-performance.md#prerequistes)
    * [Migration steps](top-extensions-performance.md#migration-steps)
    * [Pull Request Samples](top-extensions-performance.md#pull-request-samples)
* [Fast extension load](top-extensions-performance.md#fast-extension-load)
    * [Prerequistes](top-extensions-performance.md#prerequistes-1)
    * [Migration steps](top-extensions-performance.md#migration-steps-1)
    * [Pull Request Samples](top-extensions-performance.md#pull-request-samples-1)


<a name="reliability"></a>
# Reliability
* [Overview](portalfx-reliability.md#overview)
    * [Extension reliability](portalfx-reliability.md#extension-reliability)
    * [Blade reliability](portalfx-reliability.md#blade-reliability)
    * [Part reliability](portalfx-reliability.md#part-reliability)
    * [Assessing extension reliability](portalfx-reliability.md#assessing-extension-reliability)
    * [Checklist](portalfx-reliability.md#checklist)
* [Reliability Frequently Asked Questions (FAQ)](portalfx-reliability.md#reliability-frequently-asked-questions-faq)
    * [My Extension is below the reliability bar, what should I do](portalfx-reliability.md#my-extension-is-below-the-reliability-bar-what-should-i-do)
    * [My Blade is below the reliability bar, what should I do](portalfx-reliability.md#my-blade-is-below-the-reliability-bar-what-should-i-do)
    * [My Part is below the reliability bar, what should I do](portalfx-reliability.md#my-part-is-below-the-reliability-bar-what-should-i-do)


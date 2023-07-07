* [Performance Overview](#performance-overview)
    * [Extension-loading performance](#performance-overview-extension-loading-performance)
    * [Blade performance](#performance-overview-blade-performance)
        * [Lighthouse](#performance-overview-blade-performance-lighthouse)
        * [BladeFullReady](#performance-overview-blade-performance-bladefullready)
        * [Network requests](#performance-overview-blade-performance-network-requests)
    * [Part performance](#performance-overview-part-performance)
    * [How to assess your performance](#performance-overview-how-to-assess-your-performance)
        * [Extension-loading](#performance-overview-how-to-assess-your-performance-extension-loading)
        * [Lighthouse query](#performance-overview-how-to-assess-your-performance-lighthouse-query)
        * [BladeFullReady query](#performance-overview-how-to-assess-your-performance-bladefullready-query)
        * [Network requests query](#performance-overview-how-to-assess-your-performance-network-requests-query)
        * [Part](#performance-overview-how-to-assess-your-performance-part)
* [Performance Frequently Asked Questions (FAQ)](#performance-frequently-asked-questions-faq)
    * [My Extension 'load' is above the bar. What should I do?](#performance-frequently-asked-questions-faq-my-extension-load-is-above-the-bar-what-should-i-do)
    * [My Lighthouse score is below the bar. What should I do?](#performance-frequently-asked-questions-faq-my-lighthouse-score-is-below-the-bar-what-should-i-do)
    * [My network request is shown as "`[UNNAMED]`". What should I do?](#performance-frequently-asked-questions-faq-my-network-request-is-shown-as-unnamed-what-should-i-do)
    * [My Blade 'FullReady' is above the bar. What should I do?](#performance-frequently-asked-questions-faq-my-blade-fullready-is-above-the-bar-what-should-i-do)
    * [My Part 'Ready' is above the bar. What should I do?](#performance-frequently-asked-questions-faq-my-part-ready-is-above-the-bar-what-should-i-do)
    * [Performance office hours](#performance-frequently-asked-questions-faq-performance-office-hours)


<a name="performance-overview"></a>
# Performance Overview

Portal performance from a customer's perspective is seen as all experiences throughout the product.
As an extension author you have a duty to uphold your experience to the performance bar at a minimum.

For all our performance metrics we measure using real user monitoring (RUM) from production only traffic.

| Area               | Goal                       | Telemetry Action   | How is it measured? |
| ------------------ | -------------------------- | ------------------ | ------------------- |
| Extension          | < 2 secs @ 95th percentile | ExtensionLoad      | The time it takes for your extension's home page to be loaded and initial scripts, the `initialize` call to complete within your Extension definition file  |
| Blade - MsPortalFx | < 4 secs @ 95th percentile | BladeFullReady     | The time it takes for the blade's `onInitialize` or `onInputsSet` to resolve and all the parts on the blade to become ready |
| Blade - ReactView  | > 90  @ 5th percentile     | BladeLighthouse    | Using standard performance insights, see below for the full details. |
| Network requests   | < 1 secs @ 95th percentile | ClientAjax (table) | The time it takes for the client to complete the request. This is only measure for interactive requests. |
| Part               | < 4 secs @ 95th percentile | PartReady          | Time it takes for the part to be rendered and then the part's OnInputsSet to resolve |

<a name="performance-overview-extension-loading-performance"></a>
## Extension-loading performance

Extension-loading performance effects both Blade and Part performance, as your extension is loaded and unloaded as and when it is required.
In the case where a user is visiting your resource blade for the first time, the Fx will load up your extension and then request the view model, consequently your Blade/Part performance is affected.
If the user were to browse away from your experience and browse back before your extension is unloaded, obviously the user's second visit will be faster, as they don't pay the cost of loading the extension.

<a name="performance-overview-blade-performance"></a>
## Blade performance

Depending on the authoring model, blade performance is measured by either the Lighthouse metrics or BladeFullReady.

<a name="performance-overview-blade-performance-lighthouse"></a>
### Lighthouse

Lighthouse performance score is a weighted average of the metric scores ranging from 0 - 100. (> 90 being a good score).

> The Portal team does not set goals for each discrete metric. Rather, the goal is achieve a Lighthouse score > 90 @ 5th percentile.

Lighthouse is a de facto industry standard, composed of multiple, user-centric metrics:

| Aspect | Metric | Units |
| ------ | ------ | ----- |
| How fast to render initial content (static and shimmers)? | [First Contentful Paint (FCP)](https://web.dev/fcp/) | Seconds from t<sub>0</sub> |
| How fast to render main content (loaded data)? | [Largest Contentful Paint (LCP)](https://web.dev/lcp/) | Seconds from t<sub>0</sub> |
| Does UI shift during rendering? | [Cumulative Layout Shift (CLS)](https://web.dev/cls/) | Custom units |
| When is the UI responsive to user interaction? | [Time to Interactive (TTI)](https://web.dev/tti/) | Seconds from t<sub>0</sub> |
| Is the UI ever unresponsive to user interaction? | [Total Blocking Time (TBT)](https://web.dev/tbt/) | Seconds (absolute) |
| <Not implemented, lab-only measurement> | [~~Speed Index (SI)~~](https://web.dev/si/) | Custom units |

Note: __Speed Index is not include in the Azure portal calculations because it is intrinsically a lab-measured metric__

The metrics are weighted slightly different to the standard Lighthouse calculations due to the lack of the 6th (SI) metric.

| Audit | Weight |
| ----- | ------ |
| FCP   | 11%    |
| LCP   | 28%    |
| TTI   | 11%    |
| TBT   | 33%    |
| CLS   | 17%    |

You can see the function used to calculate the Ligthhouse score here: https://aka.ms/portalfx/kusto/lighthousefunction
The per page (view or blade) lighthouse score is a 5th percentile calculation of all individual loads of a given page (view or blade).
You can see all lighthouse scores for the last 7 days here: https://aka.ms/portalfx/kusto/lighthouse

<a name="performance-overview-blade-performance-lighthouse-why-lighthouse"></a>
#### Why Lighthouse?

The Lighthouse approach is an evolution on the Portal's previous performance measures.
When assessing page (view or blade) performance, performance can be broken down in to various aspects; capturing the page's total loading time, the customer's perceived loading time, UI stability, and more..
There is no single metric that captures everything and BladeFullReady only captures the initial page's loading time as deemed by the extension author.
Moving towards a weighted approach based on various metrics allows us to better represent the various approaches to delivering our customers a 'fast' experience.

<a name="performance-overview-blade-performance-bladefullready"></a>
### BladeFullReady

BladeFullReady can be broken down into 4 stages:

1. If the extension isn't loaded, load the extension
1. Download and parse the required dependencies for the blade
1. Execute and wait for the blade's `onInitialize()` promise to resolve
1. Process promise resolution from the main thread and complete the initial rendering of the Blade.

All of these perf costs are represented under the one `BladeFullReady` action and the full end to end duration is tracked under the `duration` column.

For an additional breakdown of the time spent you can inspect a native performance profile or the `data` column of the `BladeFullReady` telemetry event to find the following properties:

| Stage | Native marker identifier | Data property name | Description |
| ----- | ------------------------ | -------- | ----------- |
| 0 | ExtLoadBladeBundles | bundleLoadingTime | The async time spent requiring the BladeDefinition (which today is co-bundled with the Blade class’ module). This covers the time downloading and processing your Blade’s bundles. |
| 1 | ExtInstantiateBladeClass | Not Tracked | The async time spent diContainer.getAsync’ing the Blade class. This and the following ‘ExtBladeOnInitializeSync’ show up as insignificantly small, which itself can help refocus on larger time-slices. |
| 2 | ExtBladeOnInitializeSync | Not Tracked | The sync time spent in the Blade’s ‘onInitialize’ method. |
| 3 | ExtBladeOnInitializeAsync | onInitializeAsyncTime | The async time from the point ‘onInitialized’ is called to the point where the Promise returned from ‘onInitialize’ is resolved. All these are measured in the extension web worker. |
| * | ExtBladePrepareFirstAjax | prepareFirstAjaxTime | The time spent from the point ‘onInitialized’ is called to the point where the first ajax call is sent from the extension web worker.  This is fuzzy because the FX ajax client isn’t explicitly bound to a Blade, but inaccuracies should be outlier cases and should be easy to exclude based on knowledge of the Blade. |

If your blade is a FrameBlade or AppBlade there is an additional initialization message from your iframe to your viewmodel which is also tracked, see the samples extension [framepage.js](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FAcceptanceTests%2FExtensions%2FSamplesExtension%2FExtension%2FContent%2FScripts%2Fframepage.js&version=GBproduction&_a=contents) for an example of what messages are required.

<a name="performance-overview-blade-performance-network-requests"></a>
### Network requests

> This KPI is only held for interactive network requests. Interactive is defined as after initial load.

The goal of the network request tracking is to proxy customer task or interaction performance.

This time is strictly measuring from the start to the end of the request as processed by the client. This is to best represent what the customer is experiencing.

<a name="performance-overview-part-performance"></a>
## Part performance

Similar to Blade performance, Part performance is spread across a couple of areas:

1. Part's constructor
1. Part's 'onInitialize' or 'onInputsSet'

If your part is a FramePart there is an additional initialization message from your iframe to your viewmodel which is also tracked, see the samples extension [framepage.js](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FAcceptanceTests%2FExtensions%2FSamplesExtension%2FExtension%2FContent%2FScripts%2Fframepage.js&version=GBproduction&_a=contents) for an example of what messages are required.

All of these perf costs are represented under the one `PartReady` action.

<a name="performance-overview-how-to-assess-your-performance"></a>
## How to assess your performance

There are two methods to assess your performance:

1. Visit the IbizaFx provided PowerBi report [Extension performance/reliability report](https://aka.ms/portalfx/dashboard/extensionperf)
1. Run Kusto queries locally to determine your numbers, see below for the individual queries

> If you have permission issues with either the PowerBi dashboard or Kusto cluster follow the [telemetry onboarding guide](portalfx-telemetry-getting-started.md)

<a name="performance-overview-how-to-assess-your-performance-extension-loading"></a>
### Extension-loading

[database('Framework').ExtensionPerformance(ago(1h), now())](https://dataexplorer.azure.com/clusters/azportalpartner/databases/Framework?query=H4sIAAAAAAAAA0tJLElMSixO1VB3K0rMTS3PL8pW19RzrShJzSvOzM8LSC1Kyy/KTcxLTtVITM/XMMzQ1FHIyy/X0NQEAGFlXZU6AAAA)

ExtensionPerformance will return a table with the following columns:

- Extension
  - The name of the extension
- Loads
  - How many times the extension was loaded within the given date range
- 50th, 80th, 95th
  - The time it takes for your extension to initialize. This is captured under the `ExtensionLoad` action in telemetry
- HostingServiceloads
  - The number of loads from the hosting service
- UsingTheHostingService
  - If the extension is predominantly using the hosting service in production

<a name="performance-overview-how-to-assess-your-performance-lighthouse-query"></a>
### Lighthouse query

[database('Framework').LighthousePerformance(ago(1h), now(), "")](https://dataexplorer.azure.com/clusters/azportalpartner/databases/Framework?query=H4sIAAAAAAAAA0tJLElMSixO1VB3K0rMTS3PL8pW19TzyUzPKMnILy1ODUgtSssvyk3MS07VSEzP1zDM0NRRyMsv1wBSSkqaAOolKsg/AAAA)

> You can filter the lighthouse performance by passing in the blade/extension identifier as the third parameter

LighthousePerformance will return a table with the following columns:

- name
  - The view identifier, includes the extension name
- OverallScore
  - This is the metric that the view is measure against
- Lighthouse_Loads
  - How many loads were recorded for that view

Then there is a section of investigation metrics, which can be used to prioritise areas of investment.
These are gathered by assessing any load which was worse than the 5th percentile OverallScore, then taking the 50th percentile of that sample.

- FirstContentfulPaint
- LargestContentfulPaint
- TimeToInteractive
- TotalBlockingTime
- CumulativeLayoutShift
- Lighthouse_Details
  - This provideds a breakdown of insights for each metric;
    - Value
    - Score
    - Potential gain
    - Utilised %
    - Max potential score
  - Using the `Potential gain` you can prioritise which metric to invest in to improve your overall score

<a name="performance-overview-how-to-assess-your-performance-bladefullready-query"></a>
### BladeFullReady query

[database('Framework').BladePerformance(ago(1h), now())](https://dataexplorer.azure.com/clusters/azportalpartner/databases/Framework?query=H4sIAAAAAAAAA0tJLElMSixO1VB3K0rMTS3PL8pW19RzyklMSQ1ILUrLL8pNzEtO1UhMz9cwzNDUUcjLL9fQ1AQAzYNSCDYAAAA=)

The subtle difference with the standard `BladeFullReady` marker is that if the blade is opened within a resource menu blade we will attribute the time it takes to resolve the `getMenuConfig` promise as the resource menu blade is loaded to the 95th percentile of the 'BladeFullReady' duration. This is attributed using a proportional calculation based on the number of times the blade is loaded inside the menu blade.

For example, a blade takes 2000ms to complete its `BladeFullReady` and 2000ms to return its `getMenuConfig`.
It is only loaded once (1) in the menu blade out of its 10 loads. Its overall reported FullDuration would be 2200ms.

BladePerformance will return a table with the following columns:

- FullBladeName, Extension, BladeName
  - Blade/Extension identifiers
- BladeCount
  - The number of blade loads within the given date range
- InMenuLoads
  - The number of in menu blade loads within the given date range
- PctOfMenuLoads
  - The percentage of in menu blade loads within the given date range
- Samples
  - The number of loads which were tracking the number of XHR requests
- StaticMenu
  - If the `getMenuConfig` call returns within < 10ms, only applicable to ResourceMenu cases
- MenuConfigDuration95
  - The 95th percentile of the `getMenuConfig` call
- LockedBlade
  - If the blade is locked, ideally blades are now template blades or no-pdl
  - All no-pdl and template blades are locked, pdl blades can be made locked by setting the locked property to true
- FullDuration50, 80, 95, 99
  - The time it takes for the `BladeFullReady` + (`PctOfMenuLoads` * the `getMenuConfig` to resolve)

<a name="performance-overview-how-to-assess-your-performance-network-requests-query"></a>
### Network requests query

[database('Framework').InteractiveNetworkPerformance(ago(1d), now(), "Extension/YOUR_EXTENSION_NAME/Blade/YOUR_BLADE_NAME")](https://dataexplorer.azure.com/clusters/azportalpartner/databases/Framework?query=H4sIAAAAAAAAA0tJLElMSixO1VB3K0rMTS3PL8pW19TzzCtJLUpMLsksS/VLLQEJBqQWpeUX5SbmJadqJKbnaximaOoo5OWXawApJdeKktS84sz8PP1I/9CgeNeIEFe/YE9/v3g/R19XfaecxJRUiIyTj6OLK1hUSRMAZejGz3oAAAA=)

Update or remove the BladeName filter to match your needs, only use your extension name or only scope to a single blade.

InteractiveNetworkPerformance will return a table with the following columns:

- Date
  - End date for the rolling 7 days calculation
- Extenion, BladeName
  - Extension/Blade identifier
- Name
  - Identifier for the network request
- Occurrences
  - Number of times the request was issued (Note: Batch requests are expanded from 1 to N, increasing the occurrences count by N vs 1)
- Requests
  - Number of unique requests (Note: Batched requests count as 1)
- BladeInstances
  - Total number of unique blades
- UniqueCustomers
  - Total number of unique customers
- 50th, 80th, 95th, 99th
  - The percentile duration time recorded for the given request
- KPI Classification
  - The KPI is measured against the 95th percentile duration - Green: <= 1s, Yellow: <= 2s, and Red: > 2s

<a name="performance-overview-how-to-assess-your-performance-part"></a>
### Part

[database('Framework').PartPerformance(ago(1h), now())](https://dataexplorer.azure.com/clusters/azportalpartner/databases/Framework?query=H4sIAAAAAAAAA0tJLElMSixO1VB3K0rMTS3PL8pW19QLSCwqCUgtSssvyk3MS07VSEzP1zDM0NRRyMsv19AEAHCIw240AAAA)

PartPerformance will return a table with the following columns:

- FullPartName, Extension, PartName
  - Part/Extension identifiers
- PartCount
  - How many times the part was loaded within the given date range
- 50th, 80th, 95th, 99th
  - The time it takes for your part to resolve its `onInputsSet` or `onInitialize` promise. This is captured under the `PartReady` action in telemetry
- RedScore
   Number of violations for tracked bars

<a name="performance-frequently-asked-questions-faq"></a>
# Performance Frequently Asked Questions (FAQ)

<a name="performance-frequently-asked-questions-faq-my-extension-load-is-above-the-bar-what-should-i-do"></a>
## My Extension &#39;load&#39; is above the bar. What should I do?

1. Profile what is happening in your extension load. [Profile your scenario](performance-profiling.md)
1. Are you using the Portal's ARM token? If no, verify if you can use the Portal's ARM token and if yes, follow: [Using the Portal's ARM token](https://learn.microsoft.com/azure/azure-resource-manager/resource-manager-api-authentication)
1. Are you on the hosting service? If no, migrate to the hosting service: [Hosting service documentation](portalfx-extension-hosting-service.md#extension-hosting-service)
    - If you are, have you enabled prewarming?
        - Follow https://aka.ms/portalfx/docs/prewarming to enable prewarming for your extension load.
1. Are you using obsolete bundles?
    - If yes, remove your dependency to them and then remove the obsolete bitmask. This is a blocking download before your extension load. See below for further details.
1. See our [best practices](performance-best-practices.md)

<a name="performance-frequently-asked-questions-faq-my-lighthouse-score-is-below-the-bar-what-should-i-do"></a>
## My Lighthouse score is below the bar. What should I do?

See [Improving Lighthouse scores](react-lighthouse-tips.md).

<a name="performance-frequently-asked-questions-faq-my-network-request-is-shown-as-unnamed-what-should-i-do"></a>
## My network request is shown as &quot;<code>[UNNAMED]</code>&quot;. What should I do?

See [Naming network requests](top-extensions-data-ajax.md#naming-network-requests).

<a name="performance-frequently-asked-questions-faq-my-blade-fullready-is-above-the-bar-what-should-i-do"></a>
## My Blade &#39;FullReady&#39; is above the bar. What should I do?

1. Assess what is happening in your Blades's `onInitialize` (no-PDL) or constructor and `onInputsSet` (PDL). [Profile your scenario](performance-profiling.md)
    1. Can that be optimized?
1. If there are any AJAX calls;
    1. Can they use batch? If so, migrate over to use the [batch api](https://aka.ms/portalfx/docs/batch).
    1. Wrap them with custom telemetry and ensure they you aren't spending a large amount of time waiting on the result. If you are to do this, please only log one event per blade load, this will help correlate issues but also reduce unneccesary load on telemetry servers.
1. Are you using an old PDL "Blade containing Parts"? How many parts are on the blade?
    - If there is only a single part, if you're not using a no-pdl blade or `<TemplateBlade>` migrate your current blade to a no-pdl blade.
    - If there are multiple parts, migrate over to use a no-pdl blade.
    - Ensure to support any old pinned parts when you migrate.
1. Does your blade open within a resource menu blade?
    - If it does, ensure the `getMenuConfig` call is returned statically/synchronously (< 10ms). You can make use of the enabled/disabled observable property on menu items, if you need to asynchronously determine to enable a menu item.
1. See our [best practices](performance-best-practices.md)

<a name="performance-frequently-asked-questions-faq-my-part-ready-is-above-the-bar-what-should-i-do"></a>
## My Part &#39;Ready&#39; is above the bar. What should I do?

1. Assess what is happening in your Part's `onInitialize` (no-PDL) or constructor and `onInputsSet` (PDL), including time taken in any async operations associated with the returned Promise. [Profile your scenario](performance-profiling.md)
    1. Can that be optimized?
1. If there are any AJAX calls;
    1. Can they use batch? If so, migrate over to use the [batch api](https://aka.ms/portalfx/docs/batch).
    1. Wrap them with custom telemetry and ensure they you aren't spending a large amount of time waiting on the result. If you are to do this, please only log one event per part load, this will help correlate issues but also reduce unneccesary load on telemetry servers.
1. See our [best practices](performance-best-practices.md)

<a name="performance-frequently-asked-questions-faq-performance-office-hours"></a>
## Performance office hours

Sure! Book in some time in the Azure performance office hours.

Don't forget to include context for the meeting, which blade or view you're wanting to optimise.

- __When?__  Wednesdays from 13:00 to 16:00
- __Where?__ Teams meeting
- __Contacts:__ Azure Portal Performance Office Hours (apperfofficehours)
- __Goals__
  - Help extensions to meet the performance bar
  - Help extensions to measure performance
  - Help extensions to understand their current performance status
- __How to book time__: Send a meeting request with the following
  - TO: apperfofficehours;
  - Subject: YOUR_EXTENSION_NAME: Azure performance office hours
  - Location: Teams meeting

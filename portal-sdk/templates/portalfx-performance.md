{"gitdown": "contents"}

## Overview

Portal performance from a customers perspective is seen as all experiences throughout the product. 
As an extension author you have a duty to uphold your experience to the performance bar at a minimum.

| Area      | Sub-Area                   | 80th Percentile Bar | Telemetry Action         | How is it measured? |
| --------- | -------------------------- | ------------------- | ------------------------ | ------------------- |
| Blade     | Revealed                   | See Power BI        | BladeRevealed            | Time it takes for the blade's OnInputsSet to resolve and all the parts on the blade and above the fold to reveal |
| Blade     | FullRevealed               | N/A                 | BladeFullRevealed        | Same as Revealed but all the parts on the blade to reveal |
| Part      | Revealed                   | See Power BI        | PartRevealed             | Time it takes for the part to be rendered and then the part's OnInputsSet to resolve or earlyReveal to be called |
| WxP       | N/A                        | See Power BI        | N/A                      | An overall experience score, calculated by weighting blade usage and the blade revealed time |

<!--| Extension | Initial Extension Response | TODO                | InitialExtensionResponse | TODO |
| Extension | Manifest Load              | TODO                | ManifestLoad             | TODO |
| Extension | Initialization             | TODO                | InitializeExtensions     | TODO | -->

## Extension performance

Extension performance effects both Blade and Part performance, as your extension is loaded and unloaded as and when it is required.
In the case a user is visiting your resource blade for the first time, the Fx will load up your extension and then request the view model, consequently your Blade/Part
performance is effected.
If the user were to browse away from your experience and browse back before your extension is unloaded obviously second visit will be faster, as they don't pay the cost
of loading the extension.

## Blade performance

Blade performance is spread across a couple of main areas:

1. Blade's constructor
1. Blade's OnInputsSet
1. Any Parts within the Blade become revealed

All of which are encapsulated under the one BladeRevealed action.

## Part performance

Similar to Blade performance, Part performance is spread across a couple of areas:

1. Part's constructor
1. Part's OnInputsSet

All of which are encapsulated under the one PartRevealed action.

## WxP score

The WxP score is a per extension Weight eXPerience score (WxP). It is calculated by the as follows:

```txt

WxP = (BladeViewsMeetingTheBar * 80thPercentileBar) / ((BladeViewsMeetingTheBar * 80thPercentileBar) + ∑(BladeViewsNotMeetingTheBar * ActualLoadTimePerBlade))

```

| Blade   | 80th Percentile Times | Usage Count | Meets 80th Percentile Bar? |
| ------- | --------------------- | ----------- | -------------------------- |
| Blade A | 1.2                   | 1000        | Yes                        |
| Blade B | 5                     | 500         | No                         |
| Blade C | 6                     | 400         | No                         |

```txt

WxP = (BladeViewsMeetingTheBar * 80thPercentileBar) / ((BladeViewsMeetingTheBar * 80thPercentileBar) + ∑(BladeViewsNotMeetingTheBar * ActualLoadTimePerBlade)) %
    = (4 * 1000) / ((4 * 1000) + ((5 * 500) + (6 * 400))) %
    = 44.94%

```

As you can see the model penalizes the number of views which don’t meet the bar and also the count of those.

## How to assess your performance

There is two methods to assess your performance:

1. Visit the IbizaFx provided PowerBi report*
1. Run Kusto queries locally to determine your numbers

    (*) To get access to the PowerBi dashboard reference the [Telemetry onboarding guide][TelemetryOnboarding], then access the following [Extension performance/reliability report][Ext-Perf/Rel-Report]

The first method is definitely the easiest way to determine your current assessment as this is maintained on a regular basis by the Fx team.
You can, if preferred, run queries locally but ensure you are using the Fx provided Kusto functions to calculate your assessment.

## Performance Checklist

- [Configure CDN][portalfx-cdn]
- [Extension HomePage Caching](portalfx-extension-homepage-caching)
- [Persistent Caching of scripts across extension updates](portalfx-extension-persistent-caching-of-scripts)
- [Run portalcop to identify and resolve common performance issues](portalfx-performance-portalcop)
- [Optimize number CORS preflight requests to ARM using invokeApi](index-portalfx-extension-development.md#optimize-number-cors-preflight-requests-to-arm-using-invokeapi)
- [Improve part responsiveness with revealContent](index-portalfx-extension-development.md#portalfx-parts-revealContent)
- [Best practices](#performance-best-practices)

## Performance Frequently Asked Questions (FAQ)

<!--### My Extension 'InitialExtensionResponse' is above the bar, what should I do

TODO

### My Extension 'ManifestLoad' is above the bar, what should I do

TODO

### My Extension 'InitializeExtensions' is above the bar, what should I do

TODO -->

### My Blade 'Revealed' is above the bar, what should I do

1. Assess what is happening in your Blades's constructor and OnInputsSet.
1. Can that be optimized?
1. If there are any AJAX calls, wrap them with custom telemetry and ensure they you aren't spending a large amount of time waiting on the result.
1. Check the Part's on the Blade revealed times using [Extension performance/reliability report][Ext-Perf/Rel-Report], select your Extension and Blade on the filters.
1. How many parts are on the blade?
    - If there's only a single part, if you're not using a `<TemplateBlade>` migrate your current blade over.
    - If there's a high number of parts (> 3), consider removing some of the parts

### My Part 'Revealed' is above the bar, what should I do

1. Assess what is happening in your Part's constructor and OnInputsSet.
1. Can that be optimized?
1. If there are any AJAX calls, wrap them with custom telemetry and ensure they you aren't spending a large amount of time waiting on the result.
1. Do you have partial data before the OnInputsSet is fully resolved? If yes, then you can reveal early, display the partial data and handle loading UI for the individual components 

### My WxP score is below the bar, what should I do

Using the [Extension performance/reliability report][Ext-Perf/Rel-Report] you can see the WxP impact for each individual blade. Although given the Wxp calculation,
if you are drastically under the bar its likely a high usage blade is not meeting the performance bar, if you are just under the bar then it's likely it's a low usage
blade which is not meeting the bar.

## Performance best practices

{"gitdown": "include-file", "file": "../templates/portalfx-performance-bestpractices.md"}

## Configuring CDN

{"gitdown": "include-file", "file": "../templates/portalfx-cdn.md"}

## Extension HomePage Caching

{"gitdown": "include-file", "file": "../templates/portalfx-extension-homepage-caching.md"}

## Persistent Caching of scripts across extension updates

{"gitdown": "include-file", "file": "../templates/portalfx-extension-persistent-caching-of-scripts.md"}

## Run portalcop to identify and resolve common performance issues

{"gitdown": "include-file", "file": "../templates/portalfx-performance-portalcop.md"}

## Performance alerting

Coming soon please reach out to sewatson if you are interested.

[TelemetryOnboarding]: <portalfx-telemetry-getting-started>
[Ext-Perf/Rel-Report]: <http://aka.ms/portalfx/dashboard/extensionperf>
[portalfx-cdn]: <portalfx-cdn>
<a name="steps-to-improve-the-lighthouse-score-for-your-reactview"></a>
# Steps to improve the Lighthouse score for your ReactView

<a name="steps-to-improve-the-lighthouse-score-for-your-reactview-identify-a-target-reactview"></a>
## Identify a target ReactView
You can determine a ReactView to target for performance optimization based on either the weekly performance report email sent to your team or by using the Kusto query at https://aka.ms/portalfx/kusto/lighthouse.  In either case, you'll see a list of your ReactViews and the Lighthouse scores for each, covering the previous 7 days.  Often, you'll pick the ReactView with the lowest Lighthouse score to target for improvement.

<a name="steps-to-improve-the-lighthouse-score-for-your-reactview-identify-the-metric-with-most-unrealized-score"></a>
## Identify the metric with most unrealized score

The query result for the Kusto query at https://aka.ms/portalfx/kusto/lighthouse contains a column named "Lighthouse_Details" that can be used to determine the Lighthouse metric to focus on for optimization (see the "Potential gain" property below):

```
{
	"Score": 51.4,
	"Classification": "Yellow",
	"FCP": {
		"Value": "3476.9217721478567",
		"Score": 0.36,
		"Potential gain": 10.64,
		"Utilised %": 3.23,
		"Max potential score": 11
	},
	"LCP": {
		"Value": "3959.6654865688811",
		"Score": 4.96,
		"Potential gain": 23.04,
		"Utilised %": 17.73,
		"Max potential score": 28
	},
	"TTI": {
		"Value": "5997.5498714684045",
		"Score": 2.97,
		"Potential gain": 8.03,
		"Utilised %": 27,
		"Max potential score": 11
	},
	"TBT": {
		"Value": "203.95012283672762",
		"Score": 26.17,
		"Potential gain": "6.8299999999999983",
		"Utilised %": 79.3,
		"Max potential score": 33
	},
	"CLS": {
		"Value": "0.036170551082809033",
		"Score": 16.94,
		"Potential gain": "0.059999999999998721",
		"Utilised %": 99.66,
		"Max potential score": 17
	}
}
```

For the ReactView pictured above, it's the "largest contentful paint" (LCP) metric that - if optimized - will yield the most significant improvement to the ReactView's Lighthouse score.

<a name="steps-to-improve-the-lighthouse-score-for-your-reactview-learn-about-the-identified-metric"></a>
## Learn about the identified metric

The Lighthouse website at https://web.dev/lighthouse-performance contains resources that can be used to learn about each individual metric as well as techniques that can be used to improve each metric for your ReactView:

| Metric | URL |
| ------ | --- |
| FCP | https://web.dev/fcp/, https://web.dev/first-contentful-paint/ |
| LCP | https://web.dev/lcp/, https://web.dev/lighthouse-largest-contentful-paint/ |
| CLS | https://web.dev/cls/ |
| TTI | https://web.dev/tti/, https://web.dev/interactive/ |
| TBT | https://web.dev/tbt/, https://web.dev/lighthouse-total-blocking-time/ |

Separately, you can consult the ["Best practices"](#best-practices-to-improve-lighthouse-scores) in this document.

<a name="steps-to-improve-the-lighthouse-score-for-your-reactview-in-performance-profiles-identify-the-bottleneck-s-impacting-the-metric"></a>
## In performance profiles, identify the bottleneck(s) impacting the metric

A performance profiler/viewer tailored to ReactViews is available as part of the Portal's developer tools.  Here, navigate to your target ReactView, click CTRL-ALT-d (CMD-OPT-d on Mac) and click "React Tools: Perf".  Once there, you'll see your Lighthouse metrics rendered on a timeline view for the rendering of your ReactView.  Also, you'll see a sunburst diagram that visually depicts the same information available in the "Lighthouse_Details" Kusto query column.

While the Portal's ReactView performance profiler/viewer offers a tailored, simplified view of your ReactView rendering performance, Chrome's "Performance" tab will be more familiar to some.  The one significant limitation of the timeline view in the "Performance" tab is that it contains so much information.  The "Performance" tab treats the main window (the Portal "Shell"), extension web workers and ReactView IFrames.  It can be hard to navigate and hard to use as the basis for diagnosing performance bottlenecks.

Also, note that since ReactViews are rendered in IFrames, the Lighthouse metrics displayed in the "Performance" tab **will not be relevant to any ReactView**.  Rather, the Lighthouse metrics values displayed in the "Performance" tab describe the initial page load for the Azure Portal itself.  Instead, covering your ReactView, you'll find performance markers reflecting relevant Lighthouse metrics ("first contentful paint", "largest contentful paint", "time to interactive").

<a name="steps-to-improve-the-lighthouse-score-for-your-reactview-develop-fix-confirm-with-local-profiling"></a>
## Develop fix, confirm with local profiling

Once you've developed a fix (often, following ["best practices"](#best-practices-to-improve-lighthouse-scores) below), it's often useful to verify the fix by doing ad hoc A/B testing on your local development machine.

<a name="steps-to-improve-the-lighthouse-score-for-your-reactview-optional-flight-the-fix-using-exp-assess-fix"></a>
## (Optional) Flight the fix using ExP, assess fix

Certain performance fixes for Lighthouse are low-hanging fruit, where there is little doubt that the fix will have a significant impact on Lighthouse scores.  For instance, many ReactViews follow the pattern of delaying rendering until data is loaded.  In these cases "first contentful paint" times are typically horrible.  The simple fix of rendering **something** statically (like form field labels, column headers) and shimmering all dynamically-rendered UI will almost certainly improve LCP significantly.  A performance fix like this can be treated like a bug fix.

In other cases, the expected Lighthouse improvement might only be a couple of points and it is not 100% certain that the fix will have the desired effect (and not a performance regression).  In such cases, it might be necessary to treat the performance fix like an experiment.  You can use the ExP platform to define an experiment and you can evaluate your performance fix using ExP scorecards.  For more information, see the [ExP site](https://microsoft.sharepoint.com/teams/Ibizaexperimentation).  Scorecards in particular will identify statitistically-significant changes to Lighthouse metrics stemming from your performance fix.

<a name="best-practices-to-improve-lighthouse-scores"></a>
# Best practices to improve Lighthouse scores

Below is a living list of techniques that have proven useful to improve Lighthouse scores.  It's meant to supplement learnings found on https://web.dev/lighthouse-performance.

<a name="best-practices-to-improve-lighthouse-scores-add-shimmering"></a>
## Add shimmering

**Targets** - FCP

Many ReactViews follow the non-optimal pattern of delaying rendering until data has been loaded.  As you'd expect, "first contentful paint" times for such ReactViews are terrible.  A quick and significant fix for "first contentful paint" is to:
- Render statically what content you can (form field labels, list column headers, property names on property pages, etc)
- Shimmer any UI that is dynamically loaded/rendered

There is a variety of FX/Fluent support here for shimmering:
- https://developer.microsoft.com/en-us/fluentui#/controls/web/detailslist/shimmer
- The "Shimmer" component in the "azureportal-reactview" package

<a name="best-practices-to-improve-lighthouse-scores-optimize-network"></a>
## Optimize network

**Targets** - LCP, TTI, TBT

Some strategies for optimizing network are common to all web pages, including ReactViews:
- Initiate network calls earlier - Ideally parallelized with UI bundle downloads
- Remove request chaining - That is, a network request that relies on data returned from some previous network request
- Eliminate requests - Some network requests are in service of UI that isn't shown to the user directly (dropdown items, 2nd page of list data).  These can often be eliminated or deferred until user interaction.
- Press service/backend teams for performance improvements

Some techniques are specific to Azure Portal.  One is to add a "data fetcher" module for your ReactView whose purpose is:
- to yield a smaller, faster-loading bundle with better caching performance (since presumably its source code updates less frequently)
- to issue network requests in parallel with UI bundle downloading

To add a "data fetcher" for your ReactView, factor your data-loading logic into a file/module named "<Blade/ViewName>.DataFetcher.ts".  Export from the module a "fetchData" function that receives the Blade's/View's parameters and issues necessary network requests.  Model the result in another export that can be retrieved by code in the corresponding "<Blade/ViewName>.ReactView.tsx" file or any file in your UI bundles.

"Data fetcher" modules can also be used for data-fetching that isn't strictly a network request.  For instance, some FX APIs (like `Az.getIcon(...)`, `Az.getAuthorizationToken(...)`, etc) do the equivalent of data-fetching.  If you've identified these calls from your ReactView as being the bottleneck responsible for suboptimal "largest contentful paint", "time to interactive" and "total blocking time" values, then relocating these to a "data fetcher" can have a positive impact.

<a name="best-practices-to-improve-lighthouse-scores-examine-post-render-cpu-and-network"></a>
## Examine post-render CPU and network

**Targets** - TTI, TBT

In the ReactViews performance profiler/visualizer, it is quite straightforward to spot the cause of high "time to interactive" / "total blocking time" values:
- Spans of time where there are > 2 network requests active are depicted in dark blue.
- Long tasks that prolong "time to interactive" are depicted in dark orange.

For the latter of these, a developer will want to understand what JavaScript of theirs is responsible for the long task.  This can't be depicted directly in the ReactViews performance profiler/visualizer, but there is a simple way to determine this from a Chrome performance profile:
- Profile your ReactView load using the Chrome "Performance" tab
- Once the ReactView is loaded, open the ReactView performance profiler/visualizer (click CTRL-ALT-d (Windows) or CMD-OPT-d on Mac, then click "React Tools: Perf")
- Identify the dark orange long task you need insight into.  Note the duration of the long task.
- In your Chrome performance profile, look for that same long task - one that shares the same duration -  in the timeline view.  Long tasks are identifiable with red triangles in the upper-left of the task.
- Once you've located the long task in the Chrome performance profile, you can explore the JavaScript function names to determine the nature of the long task and how it relates to loading your ReactView.

With respect to UI, here are common situations where TTI/TBT can have overly high values (and these are often fixable):
- Icons pop-in after view is initially rendered
- A list might render the first page of off-screen list rows, anticipating a quick page up/down
- Any background data-loading

<a name="best-practices-to-improve-lighthouse-scores-investigate-non-max-cls-values"></a>
## Investigate non-max CLS values

**Targets CLS**

Bad "cumulative layout shift" scores are fairly rare in Azure Portal.  Don't focus on CLS unless there is significant "Potential gain" (identifiable as described [here](#identify-the-metric-with-most-unrealized-score)).

For ReactViews with persistently high CLS scores, the cause of these are typically identifiable with the naked eye.  As an example/reference, one case that was recently identified is one where list columns resize to fit cell content width once the content has finished loading.

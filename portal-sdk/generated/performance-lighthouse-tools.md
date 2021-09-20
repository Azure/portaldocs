<a name="profiling-lighthouse-performance"></a>
# Profiling Lighthouse performance

<a name="profiling-lighthouse-performance-overview"></a>
## Overview

The profiler runs on the exact instance of the load you're currently viewing. It's advised to attempt to replicate the 95th percentile environment for your experience before loading your ReactView to assess.
For example, throttling your network to fast 3g and/or throttling your CPU - although that is depending on the device/infrastructure you're using.

1. Navigate to the view/page before your experience, such that your experience is one-click away
1. Throttle your environment, if needed
1. Navigate to the experience you wish to profile
1. Wait for the experience to load
1. Open the profiler via 'CTRL + ALT + D' or 'CMD + OPT + D', and select the 'perf' option from the viewers debug box.

<a name="profiling-lighthouse-performance-step-by-step"></a>
## Step-by-step

Unlike standard approach to performance analysis Lighthouse analysis requires custom tooling which can be accessed with 'CTRL + ALT + D' or 'CMD + OPT + D' depending on the operating system.

Once the debug tools are opened, use the 'perf' entry point to open the Lighthouse profiler.

![Lighthouse debug entry point][LighthouseDebug]

> It may take a few moments to open the profiler if you attempt to access it shortly after initial load.

The profiler has various functionality

1. An event timeline view, noting First Contentful Paint (FCP), Largest Contentful Paint (LCP), and Time to Interactivate (TTI)
1. A visual representation of the current instance's Lighthouse score and a per metric breakdown.
1. A vertical splitter allowing for the profiler to be increased/decreased in size
1. Show/Collapse all children options allowing for a deeper view of the timeline processes.
    - If you only want to explorer a single event deeper you can 'double click' in to expand it's dependencies.

It also supports zooming and dragging of the viewer to assess specific areas.

![Lighthouse debug entry point][LighthouseProfiler]

[LighthouseDebug]: ../media/portalfx-performance/performance-lighthouse-tools-debug.png
[LighthouseProfiler]: ../media/portalfx-performance/performance-lighthouse-tools-profiler-overview.png

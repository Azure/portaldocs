<a name="performance-profiling"></a>
# Performance profiling

<a name="performance-profiling-how-to-profile-your-scenario"></a>
## How to profile your scenario

1. Open a browser and load portal using `https://portal.azure.com/?clientOptimizations=bundle&feature.nativeperf=true​`
    - `clientOptimizations=bundle` will allow you to assess which bundles are being downloaded in a user friendly manner
    - `feature.nativeperf=true` will expose native performance markers within your profile traces, allowing you to accurately match portal telemetry markers to the profile
1. Go to a blank dashboard​
1. Clear cache (hard reset), remove all application data and reload the portal​
1. Use the browsers profiling timeline to throttle both network and CPU, this best reflects the 95th percentile scenario, then start the profiler
1. Walk through your desired scenario
    - Switch to the desired dashboard
    - Deep link to your blade, make sure to keep the feature flags in the deep link. Deeplinking will isolate as much noise as possible from your profile
1. Stop the profiler
1. Assess the profile

<a name="performance-profiling-identifying-common-slowdowns"></a>
## Identifying common slowdowns

1. Blocking network calls
    - Fetching data - We've seen often that backend services don't have the same performance requirements as the front end experience, because of which you may need to engage your backend team/service to ensure your front end experience can meet the desired performance bar.
    - Required files - Downloading more than what is required, try to minimise your total payload size.
1. Heavy rendering and CPU from overuse of UI-bound observables
    - Are you updating the same observable repeatedly in a short time frame? Is that reflected in the DOM in any way? Do you have computeds listening to a large number of observables?

<a name="performance-profiling-verifying-a-change"></a>
## Verifying a change

To correctly verify a change you will need to ensure the before and after are instrumented correctly with telemetry. Without that you cannot truly verify the change was helpful.
We have often seen what seems like a huge win locally transition into a smaller win once it's in production, we've also seen the opposite occur too.
The main take away is to trust your telemetry and not profiling, production data is the truth.

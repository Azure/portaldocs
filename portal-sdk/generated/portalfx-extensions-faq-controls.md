<a name="faqs-for-extension-controls"></a>
## FAQs for Extension Controls

   <!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->

<a name="faqs-for-extension-controls-how-to-use-a-monitorchartpart-from-legacy-blade"></a>
### How to use a MonitorChartPart from Legacy Blade

***My extension is still using legacy blades (locked or unlocked). Is this still applicable to me? If yes, do I get the benefits mentioned above?***

SOLUTION: Even if you are not using template blades, you can reference the MonitorChartPart from the Hubs extension, as specified in [portalfx-controls-monitor-chart-v2.md#legacy-blade-usage](portalfx-controls-monitor-chart-v2.md#legacy-blade-usage).

If there is an Insights/Monitoring Metrics part on your blade already, you can reference the part from Hubs extension instead of referencing the metrics part from Insights/Monitoring extension. Because the Hubs extension is always loaded when you load the portal, it will be loaded before the user loads your extension blade. Hence, you will not load an additional extension and get significant performance benefits. However, for the best performance, we strongly recommend that your extension should use the [Monitor Chart control](portalfx-controls-monitor-chart-v2.md) directly on a template blade. For more information about migrating to template blades, see [portalfx-no-pdl-programming.md](portalfx-no-pdl-programming.md).

* * * 

<a name="faqs-for-extension-controls-changing-the-metrics-time-range-chart-type"></a>
### Changing the metrics/time range/chart type

***Can the users change the metrics/time range/chart type of the charts shown in the overview blade?***

SOLUTION: No, users cannot customize what is displayed in the overview blade. For customizations, users can click on the chart, navigate to Azure Monitor, make changes the chart if needed, and then pin it to the dashboard. The dashboard contains all the charts that users want to customize and view.

This means the extension has a consistent story.

1. View the metrics in overview blade

1. Explore the metrics in Azure Monitor

1. Track and monitor metrics in the Azure Dashboard

Removing customizations from blades also provides more reliable blade performance.
    
* * * 

<a name="faqs-for-extension-controls-controls-playground-questions"></a>
### Controls playground questions

DESCRIPTION:  If I run into any problems using the controls playground or the new control `ViewModels`, who do I ask? 

SOLUTION: For control `ViewModel` issues, please post on StackOverflow.  For specific playground extension issues or general playground extension feedback, please reach out to <a href="ibizacontrols@microsoft.com?subject=StackOverflow: Playground Controls and ViewModels">ibizacontrols@microsoft.com</a>.

* * *

<a name="faqs-for-extension-controls-adding-code-to-the-controls-playground"></a>
### Adding code to the controls playground

DESCRIPTION:  Why can’t I type code directly into the controls playground editor?

SOLUTION: The controls playground does not execute code provided by the user due to security concerns.  We are looking into how we can mitigate that, but for now, the code snippet is for your reference only.

* * *

<a name="faqs-for-extension-controls-missing-playground-controls"></a>
### Missing playground controls

DESCRIPTION: Why aren’t all of the new controls in the playground?

SOLUTION:  The code for the playground extension is generated from `Fx.d.ts`.  Some of the controls require additional configuration.

* * *

<a name="faqs-for-extension-controls-playground-controls-are-not-localized"></a>
### Playground controls are not localized

DESCRIPTION: Why is it that the controls playground does not provide localization?

SOLUTION: Localization is done at build times, so none of the string inputs are localized.  Instead, the strings are sent  in non-localized forms so that copy/pasted code compiles and runs without requiring additional work.

* * *

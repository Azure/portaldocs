# QuotaGauge

 
<a name="basics"></a>
### Basics
QuotaGauge displays the status of a current value relative to a quota (limit) and total.  When the current value exceeds the quota value, the QuotaGauge displays an error indicator.


<!-- TODO get an IMAGE to embed here -->

<!-- TODO get an SAMPLE CODE to embed here -->

 
<a name="when-to-use"></a>
### When to use
The SDK offers a set data visualization controls.  Choose the one that is most suitable to your need.
* **AreaChart** - displays quantitative data like a LineChart with the area between axis and the lines filled with colors.
* **BarChart** - displays categorical data using rectangular bars of proportional length to represent values.
* **Donut** - displays proportional data as part of a whole.
* **LineChart** - displays a series of data points connected by straight line segments.
* **Map** - displays data with longitude and latitude coordinates on a world map.
* **Metrics** - displays a single value for a set of metrics
* **MonitorChartV2** - displays the metrics for your resource and inherently knows how to fetch data for your resource.
* **QuotaGauge** - displays the current value relative to a quota (limit) and total.
* **ScatterChart** - displays a plot of data points without any connecting lines
* **SingleMetric** - displays a single value for a metric
* **SingleValueGauge** - displays the status of a current value relative to an optional total.  



 
<a name="best-practices"></a>
### Best practices
Use the QuotaGauge to show a current value in relation to a quota (limit) and total.  For example, the user may want to understand how much money they have spent in relation to their budget (quota) and projected total.

<a name="best-practices-do"></a>
#### Do

* Ensure the quota (limit) value for the data being displayed makes sense


<a name="best-practices-don-t"></a>
#### Don&#39;t

* Don't use QuotaGauge if there is no natural (quota) - use the SingleValueGauge instead



 
<a name="developer-tips-and-tricks"></a>
### Developer tips and tricks



<a name="developer-tips-and-tricks-interactive-control-and-sample-source-code"></a>
#### Interactive control and sample source code
Go to the playground site to use the latest control and get source code for your project.  [Learn more about playground](./top-extensions-controls-playground.md).

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/QuotaGauge_create_Playground" target="_blank">QuotaGauge in the interactive controls playground</a>




 
<a name="related-info"></a>
### Related info

* <a href="https://www.figma.com/file/Bwn8rmUOYtnPRwA3JoQTBn/Azure-Portal-Toolkit?node-id=3759%3A411280" target="_blank">Data visualization in Azure Portal Toolkit (Figma)</a>

* [Azure design guidance](http://aka.ms/portalfx/design)



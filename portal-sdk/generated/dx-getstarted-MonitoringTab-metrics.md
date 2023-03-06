<a name="getstarted-monitoringtab-metrics"></a>
# getstarted-MonitoringTab-metrics
* [getstarted-MonitoringTab-metrics](#getstarted-monitoringtab-metrics)
    * [Definitions:](#getstarted-monitoringtab-metrics-definitions)
        * [An array of items, where each item is of the type:](#getstarted-monitoringtab-metrics-definitions-an-array-of-items-where-each-item-is-of-the-type)

<a name="getstarted-monitoringtab-metrics-definitions"></a>
## Definitions:
<a name="getstarted-monitoringtab-metrics-definitions-an-array-of-items-where-each-item-is-of-the-type"></a>
### An array of items, where each item is of the type:
<a name="getstarted-monitoringtab-metrics-definitions-an-array-of-items-where-each-item-is-of-the-type-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|id|True|Defines the metric id. See [here](dx-getstarted-MonitoringTab-guidance.md) for more information.
|aggregationType|True|Defines the metric aggregation type. See [here](dx-getstarted-MonitoringTab-guidance.md) for more information.
|resourceMetadata|True|<code>resourceMetadata.id</code> defines the resource id (can be passed in as a parameter to the blade).
|namespace|False|Defines the namespace for the metric. See [here](dx-getstarted-MonitoringTab-guidance.md) for more information.
|visible|False|When visible is evaluated to *true* then the control will be displayed, otherwise it will be hidden.  Default value is **true**.
|fx.feature|False|

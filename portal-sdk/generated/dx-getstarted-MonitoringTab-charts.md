<a name="getstarted-monitoringtab-charts"></a>
# getstarted-MonitoringTab-charts
* [getstarted-MonitoringTab-charts](#getstarted-monitoringtab-charts)
    * [Definitions:](#getstarted-monitoringtab-charts-definitions)
        * [An array of items, where each item is of the type:](#getstarted-monitoringtab-charts-definitions-an-array-of-items-where-each-item-is-of-the-type)

<a name="getstarted-monitoringtab-charts-definitions"></a>
## Definitions:
<a name="getstarted-monitoringtab-charts-definitions-an-array-of-items-where-each-item-is-of-the-type"></a>
### An array of items, where each item is of the type:
<a name="getstarted-monitoringtab-charts-definitions-an-array-of-items-where-each-item-is-of-the-type-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|title|True|Title of the chart
|metrics|True|An array of items, where each item defines the following: <br>1) <code>id</code> <br>2) <code>aggregationType</code>: See [here](dx-enum-getStartedMonitoringMetric-aggregationType.md) for a list of allowed aggregation types. <br>3) <code>resourceMetadata</code>: <code>resourceMetadata.id</code> defines the resource id(can be passed in as a parameter to the blade).
|fx.feature|False|

<a name="view-dashboardviewtype-metricsitem"></a>
# view-dashboardViewType-metricsItem
* [view-dashboardViewType-metricsItem](#view-dashboardviewtype-metricsitem)
    * [Definitions:](#view-dashboardviewtype-metricsitem-definitions)

<a name="view-dashboardviewtype-metricsitem-definitions"></a>
## Definitions:
<a name="view-dashboardviewtype-metricsitem-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|aggregationType|True|The aggregation type to use for the metric. See [here](dx-enum-dashboardSchemaQueryTileMetricsItem-type.md) for more on aggregation types.
|name|True|The name of the metric.
|namespace|False|Additional information used to determine the metrics provider. Only needed for certain providers, when not specified, chart uses a fixed default for each metric type.
|resourceMetadata|True|Information that identifies the resource to which the metric belongs to. See [here](dx-view-dashboardViewType-metricsItemResource.md) for more information.
|fx.feature|False|

<a name="getstarted-monitoringtab"></a>
# getstarted-MonitoringTab
* [getstarted-MonitoringTab](#getstarted-monitoringtab)
    * [Description](#getstarted-monitoringtab-description)
    * [Guidance](#getstarted-monitoringtab-guidance)
    * [Definitions:](#getstarted-monitoringtab-definitions)
    * [UI Sample](#getstarted-monitoringtab-ui-sample)
    * [Sample Snippet](#getstarted-monitoringtab-sample-snippet)

<a name="getstarted-monitoringtab-description"></a>
## Description
The Monitoring view is used to display the most useful resource-specific charts and metrics.
<a name="getstarted-monitoringtab-guidance"></a>
## Guidance
The metrics are derived from Azure Monitor.

Metrics can be defined as such
```
{
    "id": "Percentage CPU",
    "aggregationType": "Sum",
    "resourceMetadata": {
        "id": "[parameters('id')]"
    }
}
```
And the `id` and `aggregationType` must match what is available in Azure Monitor's `Metric` and `Aggregation`

![alt-text](../media/portalfx-cuid/MetricsMonitoring.png "Declarative Resource Overview")
 
<a name="getstarted-monitoringtab-definitions"></a>
## Definitions:
<a name="getstarted-monitoringtab-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|kind|True|Enum permitting the value: "Monitoring".
|charts|True|See [here](dx-getstarted-MonitoringTab-charts.md) for more on charts
|default|False|If default is true, then set this tab as default tab. Only the first tab with valid default value will be set as default.
|fx.feature|False|
<a name="getstarted-monitoringtab-ui-sample"></a>
## UI Sample
![alt-text](../media/dx/views/MonitoringTab.png )  
<a name="getstarted-monitoringtab-sample-snippet"></a>
## Sample Snippet
  To add the Monitoring view, add the following example to the properties.tabs section in the [Declarative Resource Overview schema](portalfx-declarative-overview.md#declarative-resource-overview-schema)

```json
{
    "kind": "Monitoring",
    "charts": [
        {
            "title": "CPU (average)",
            "metrics": [
                {
                    "id": "Percentage CPU",
                    "aggregationType": "Avg",
                    "resourceMetadata": {
                        "id": "[parameters('id')]"
                    }
                }
            ]
        }
    ]
}
```


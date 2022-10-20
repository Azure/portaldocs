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

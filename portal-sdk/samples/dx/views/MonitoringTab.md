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

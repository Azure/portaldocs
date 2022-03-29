Monitoring view can be configured to display in two ways -

1. As a full screen blade opened from a resource menu
2. As a tab in a resource overview (GetStarted view)

<a name="as-a-full-screen-blade-opened-from-a-resource-menu"></a>
### As a full screen blade opened from a resource menu

To add the Monitoring view to be opened from a resource menu blade, add Properties definition (see `Properties definition samples` section) to the `properties.charts.items` as seen in the Monitoring view schema below.

```json
{
  "$schema": "../../../Definitions/dx.schema.json",
  "stringSource": "Resources/MyStrings.resjson",
  "view": {
    "kind": "Monitoring",
    "export": true,
    "parameters": [],
    "resources": [
      {
        "id": "[parameters('id')]",
        "apiVersion": "2020-06-01"
      }
    ],
    "essentials": {},
    "commands": [],
    "properties": {
      "title": "Monitoring Example",
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
  }
}
```

<a name="as-a-tab-in-a-resource-overview-getstarted-view"></a>
### As a tab in a resource overview (GetStarted view)

To add the Monitoring view as a tab in a resource overview, add the `Monitoring Tab` (see example) to the `properties.tabs` section as seen in the Resource Overview (GetStarted) schema below

```json
{
  "$schema": "../../Definitions/dx.schema.json",
  "stringSource": "Resources/MyStrings.resjson",
  "view": {
    "kind": "GetStarted",
    "export": true,
    "parameters": [
      {
        "name": "id",
        "type": "key"
      }
    ],
    "resources": [
      {
        "id": "[parameters('id')]",
        "apiVersion": "2014-04-01"
      }
    ],
    "essentials": {},
    "commands": [],
    "properties": {
        "title": "title",
        "tabs": [
        ]
    }
  }
}
```

<a name="as-a-tab-in-a-resource-overview-getstarted-view-monitoring-tab-example"></a>
#### <code>Monitoring Tab</code> example

Add Properties definition (see `Properties definition samples` section) to the `charts.items` as seen in the Monitoring tab schema below. For each chart, you can define a title and metrics.

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

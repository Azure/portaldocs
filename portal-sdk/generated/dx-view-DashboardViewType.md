<a name="dashboardviewtype"></a>
# DashboardViewType
* [DashboardViewType](#dashboardviewtype)
    * [Description](#dashboardviewtype-description)
    * [Guidance](#dashboardviewtype-guidance)
        * [As a full screen blade opened from a resource or asset menu](#dashboardviewtype-guidance-as-a-full-screen-blade-opened-from-a-resource-or-asset-menu)
        * [Export Command](#dashboardviewtype-guidance-export-command)
    * [Sections](#dashboardviewtype-sections)
    * [Properties Section](#dashboardviewtype-properties-section)
    * [UI Sample](#dashboardviewtype-ui-sample)

<a name="dashboardviewtype-description"></a>
## Description
The Dashboard view lets you create a DashboardV2 like view with multiple tiles in it. It also supports pages. This is currently in Private Preview.
<a name="dashboardviewtype-guidance"></a>
## Guidance
Dashboard view can be configured as following -

1. As a full screen blade opened from a resource or asset menu

<a name="dashboardviewtype-guidance-as-a-full-screen-blade-opened-from-a-resource-or-asset-menu"></a>
### As a full screen blade opened from a resource or asset menu

To add the Dashboard view to be opened from a resource or asset menu blade, add Properties definition (See `Properties definition samples` section) to the `properties.pages` as seen in the Dashboard view schema below.

```json
{
  "$schema": "../../Definitions/dx.schema.json",
  "stringSource": "../Resources/MyStrings.resjson",
  "view": {
    "kind": "Dashboard",
    "export": true,
    "parameters": [
      {
        "name": "subIdVM",
        "type": "key"
      },
      {
        "name": "subIdKV",
        "type": "key"
      }
    ],
    "properties": {
      "title": "Dx Sample Dashboard",
      "pages": [
        {
          "title": "Page 1",
          "tiles": [
            {
              "data": {
                  "kind": "arg",
                  "query": "summarize ResourceCount=count() by type | order by ResourceCount | extend ['Resource count']=ResourceCount, ['Resource type']=type | project ['Resource type'], ['Resource count'] | take 10"
              },
              "visualization": {
                  "type": "pie"
              },
              "title": "Top 10 resource counts by type",
              "subtitle": "Azure Resource Graph",
              "type": "QueryTile",
              "layout": {
                  "x": 0,
                  "y": 0,
                  "width": 11,
                  "height": 5
              }
            },
            {
              "data": {
                "source": "uri",
                "uri": "https://raw.githubusercontent.com/microsoft/vscode/main/README.md"
              },
              "title": "Microsoft Github",
              "subtitle": "VS Code read me",
              "type": "MarkdownTile",
              "layout": {
                "x": 11,
                "y": 0,
                "width": 10,
                "height": 5
              }
            },
            {
              "data": {
                  "kind": "app-insights",
                  "metrics": [
                      {
                        "namespace": "microsoft.compute/virtualmachines",
                        "name": "Disk Read Bytes",
                        "aggregationType": "avg",
                        "resourceMetadata": {
                          "id": "[parameters('subIdVM')]"
                        }
                      }
                  ],
                  "usedParameters": [
                    "startTime",
                    "endTime",
                    "timeGranularity"
                  ]
              },
              "visualization": {
                "type": "line"
              },
              "title": "VM Average Disk Read Bytes",
              "subtitle": "Monitoring metrics",
              "type": "QueryTile",
              "layout": {
                "x": 0,
                "y": 5,
                "width": 11,
                "height": 4
              }
            },
            {
              "data": {
                "resourceId": "[parameters('subIdKV')]"
              },
              "type": "ResourceTile",
              "layout": {
                "x": 11,
                "y": 5,
                "width": 6,
                "height": 4
              }
            }
          ]
        },
        {
          "title": "Page 2",
          "tiles": []
        }
      ],
      "parameters": [
        {
          "title": "Time range",
          "kind": "timeRange",
          "parameterNames": [
            "startTime",
            "endTime"
          ],
          "defaultValues": [
            "lastMonth"
          ],
          "showOnPages": [
            "0"
          ]
        },
        {
          "title": "Time granularity",
          "kind": "timeGranularity",
          "parameterNames": [
            "timeGranularity",
            ""
          ],
          "defaultValues": [
            "1Day"
          ],
          "showOnPages": [
            "0"
          ]
        }
      ]
    }
  }
}
```

<a name="dashboardviewtype-guidance-export-command"></a>
### Export Command

To assist authoring the Dashboard view, there is an export view command available on the command bar of a DashboardV2. It will export a Dashboard view json of a configured DashboardV2.
 
<a name="dashboardviewtype-sections"></a>
## Sections
| Name | Required | Description
| ---|:--:|:--:|
|kind|True|Enum permitting the value: "Dashboard"
|export|False|Designation for blade sharing across extensions. If set to `true` then it is available to be used by other extensions.
|parameters|False|Defines the parameters to be passed into a declarative blade, that then can be accessed using the parameters function. See [View parameters](dx-viewTypeParameters.md) for more.
|properties|True|See [here](dx-view-dashboardViewType-properties.md) for more on properties.
|fx.feature|False|
<a name="dashboardviewtype-properties-section"></a>
## Properties Section
<a name="dashboardviewtype-properties-section-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|title|True|The title of the DashboardV2.
|pages|True|List of dashboard pages available in the DashboardV2. See [here](dx-view-dashboardViewType-pages.md) for more information.
|parameters|False|List of parameters that are used in the DashboardV2. See [here](dx-view-dashboardViewType-parameters.md) for more information.
|fx.feature|False|
<a name="dashboardviewtype-ui-sample"></a>
## UI Sample
![alt-text](../media/dx/views/DashboardViewType.png "UI Sample")  

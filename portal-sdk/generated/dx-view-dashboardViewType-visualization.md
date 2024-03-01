<a name="view-dashboardviewtype-visualization"></a>
# view-dashboardViewType-visualization
* [view-dashboardViewType-visualization](#view-dashboardviewtype-visualization)
    * [Definitions:](#view-dashboardviewtype-visualization-definitions)
        * [Option 1](#view-dashboardviewtype-visualization-definitions-option-1)
        * [Option 2](#view-dashboardviewtype-visualization-definitions-option-2)

<a name="view-dashboardviewtype-visualization-definitions"></a>
## Definitions:
<a name="view-dashboardviewtype-visualization-definitions-option-1"></a>
### Option 1
<a name="view-dashboardviewtype-visualization-definitions-option-1-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|type|True|The type of chart to use for displaying tile data. See [here](dx-enum-dashboardSchemaVisualization-type.md) for more on chart types.
|options|False|Options used to further customize the visualization type. More details soon.
|fx.feature|False|
<a name="view-dashboardviewtype-visualization-definitions-option-2"></a>
### Option 2
<a name="view-dashboardviewtype-visualization-definitions-option-2-an-object-with-the-following-properties-1"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|type|True|The type of chart to use for displaying tile data. Enum permitting the value: "snapshot"
|options|False|Options used to further customize the visualization type. More details soon.
|fx.feature|False|

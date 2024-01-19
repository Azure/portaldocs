<a name="view-dashboardviewtype-querytiledata"></a>
# view-dashboardViewType-queryTileData
* [view-dashboardViewType-queryTileData](#view-dashboardviewtype-querytiledata)
    * [Definitions:](#view-dashboardviewtype-querytiledata-definitions)
        * [Option 1](#view-dashboardviewtype-querytiledata-definitions-option-1)
        * [Option 2](#view-dashboardviewtype-querytiledata-definitions-option-2)
        * [Option 3](#view-dashboardviewtype-querytiledata-definitions-option-3)

<a name="view-dashboardviewtype-querytiledata-definitions"></a>
## Definitions:
<a name="view-dashboardviewtype-querytiledata-definitions-option-1"></a>
### Option 1
<a name="view-dashboardviewtype-querytiledata-definitions-option-1-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|kind|True|The ARG data source of the query tile. Enum permitting the value: "arg"
|query|True|The valid ARG query used to fetch the data.
|usedParameters|False|Parameter names that are applied to the tile. It can be used within the query.
|fx.feature|False|
<a name="view-dashboardviewtype-querytiledata-definitions-option-2"></a>
### Option 2
<a name="view-dashboardviewtype-querytiledata-definitions-option-2-an-object-with-the-following-properties-1"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|kind|True|The Metrics data source of the query tile. Enum permitting the value: "app-insights"
|metrics|True|The list of metrics to display. See [here](dx-view-dashboardViewType-metricsItem.md) for more information.
|usedParameters|False|Parameter names that are applied to the tile. It can be used within the query.
|fx.feature|False|
<a name="view-dashboardviewtype-querytiledata-definitions-option-3"></a>
### Option 3
<a name="view-dashboardviewtype-querytiledata-definitions-option-3-an-object-with-the-following-properties-2"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|kind|True|The recent resources data source of the query tile. Enum permitting the value: "recent-resources"
|usedParameters|False|Parameter names that are applied to the tile. It can be used within the query.
|fx.feature|False|

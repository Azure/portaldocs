<a name="view-dashboardviewtype-tiles"></a>
# view-dashboardViewType-tiles
* [view-dashboardViewType-tiles](#view-dashboardviewtype-tiles)
    * [Definitions:](#view-dashboardviewtype-tiles-definitions)
        * [Option 1](#view-dashboardviewtype-tiles-definitions-option-1)
        * [An array of items, where each item is of the type:](#view-dashboardviewtype-tiles-definitions-an-array-of-items-where-each-item-is-of-the-type)
        * [Option 2](#view-dashboardviewtype-tiles-definitions-option-2)
        * [An array of items, where each item is of the type:](#view-dashboardviewtype-tiles-definitions-an-array-of-items-where-each-item-is-of-the-type-1)
        * [Option 3](#view-dashboardviewtype-tiles-definitions-option-3)
        * [An array of items, where each item is of the type:](#view-dashboardviewtype-tiles-definitions-an-array-of-items-where-each-item-is-of-the-type-2)
        * [Option 4](#view-dashboardviewtype-tiles-definitions-option-4)
        * [An array of items, where each item is of the type:](#view-dashboardviewtype-tiles-definitions-an-array-of-items-where-each-item-is-of-the-type-3)
        * [Option 5](#view-dashboardviewtype-tiles-definitions-option-5)
        * [An array of items, where each item is of the type:](#view-dashboardviewtype-tiles-definitions-an-array-of-items-where-each-item-is-of-the-type-4)
        * [Option 6](#view-dashboardviewtype-tiles-definitions-option-6)
        * [An array of items, where each item is of the type:](#view-dashboardviewtype-tiles-definitions-an-array-of-items-where-each-item-is-of-the-type-5)

<a name="view-dashboardviewtype-tiles-definitions"></a>
## Definitions:
<a name="view-dashboardviewtype-tiles-definitions-option-1"></a>
### Option 1
<a name="view-dashboardviewtype-tiles-definitions-an-array-of-items-where-each-item-is-of-the-type"></a>
### An array of items, where each item is of the type:
<a name="view-dashboardviewtype-tiles-definitions-an-array-of-items-where-each-item-is-of-the-type-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|type|True|Enum permitting the value: "MarkdownTile"
|title|True|The title of the tile.
|subtitle|False|The subtitle of the tile.
|layout|True|Determines the tile size and location of the tile on the page. See [here](dx-view-dashboardViewType-tileLayout.md) for more information.
|visible|False|Hide or show the tile based on the parameter values. See [here](dx-view-dashboardViewType-visible.md) for more information.
|highlight|False|Highlight the tile based on the parameter values. See [here](dx-view-dashboardViewType-highlight.md) for more information.
|actions|False|Actions available on the tile. See [here](dx-view-dashboardViewType-actions.md) for more information.
|data|True|The data that determines the content of the markdown tile. See [here](dx-view-dashboardViewType-markdownTileData.md) for more information.
|fx.feature|False|
<a name="view-dashboardviewtype-tiles-definitions-option-2"></a>
### Option 2
<a name="view-dashboardviewtype-tiles-definitions-an-array-of-items-where-each-item-is-of-the-type-1"></a>
### An array of items, where each item is of the type:
<a name="view-dashboardviewtype-tiles-definitions-an-array-of-items-where-each-item-is-of-the-type-1-an-object-with-the-following-properties-1"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|type|True|Enum permitting the value: "QueryTile"
|title|True|The title of the tile.
|subtitle|False|The subtitle of the tile.
|layout|False|Determines the tile size and location of the tile on the page. See [here](dx-view-dashboardViewType-tileLayout.md) for more information.
|visible|False|Hide or show the tile based on the parameter values. See [here](dx-view-dashboardViewType-visible.md) for more information.
|highlight|False|Highlight the tile based on the parameter values. See [here](dx-view-dashboardViewType-highlight.md) for more information.
|actions|False|Actions available on the tile. See [here](dx-view-dashboardViewType-actions.md) for more information.
|data|True|The data that determines the content of the query tile. See [here](dx-view-dashboardViewType-queryTileData.md) for more information.
|visualization|True|The visual configuration used to render the query tile content. See [here](dx-view-dashboardViewType-visualization.md) for more information.
|fx.feature|False|
<a name="view-dashboardviewtype-tiles-definitions-option-3"></a>
### Option 3
<a name="view-dashboardviewtype-tiles-definitions-an-array-of-items-where-each-item-is-of-the-type-2"></a>
### An array of items, where each item is of the type:
<a name="view-dashboardviewtype-tiles-definitions-an-array-of-items-where-each-item-is-of-the-type-2-an-object-with-the-following-properties-2"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|type|True|Enum permitting the value: "ResourceTile"
|layout|True|Determines the tile size and location of the tile on the page. See [here](dx-view-dashboardViewType-tileLayout.md) for more information.
|visible|False|Hide or show the tile based on the parameter values. See [here](dx-view-dashboardViewType-visible.md) for more information.
|highlight|False|Highlight the tile based on the parameter values. See [here](dx-view-dashboardViewType-highlight.md) for more information.
|actions|False|Actions available on the tile. See [here](dx-view-dashboardViewType-actions.md) for more information.
|data|True|The data that determines the content of the resource tile. See [here](dx-view-dashboardViewType-resourceTileData.md) for more information.
|fx.feature|False|
<a name="view-dashboardviewtype-tiles-definitions-option-4"></a>
### Option 4
<a name="view-dashboardviewtype-tiles-definitions-an-array-of-items-where-each-item-is-of-the-type-3"></a>
### An array of items, where each item is of the type:
<a name="view-dashboardviewtype-tiles-definitions-an-array-of-items-where-each-item-is-of-the-type-3-an-object-with-the-following-properties-3"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|type|True|Enum permitting the value: "ArcSnapshotTile"
|title|True|The title of the tile.
|subtitle|False|The subtitle of the tile.
|layout|False|Determines the tile size and location of the tile on the page. See [here](dx-view-dashboardViewType-tileLayout.md) for more information.
|visible|False|Hide or show the tile based on the parameter values. See [here](dx-view-dashboardViewType-visible.md) for more information.
|highlight|False|Highlight the tile based on the parameter values. See [here](dx-view-dashboardViewType-highlight.md) for more information.
|actions|False|Actions available on the tile. See [here](dx-view-dashboardViewType-actions.md) for more information.
|data|True|The data that determines the content of the arc snapshot tile. See [here](dx-view-dashboardViewType-arcSnapshotTileData.md) for more information
|visualization|True|The visual configuration used to render the tile content. See [here](dx-view-dashboardViewType-visualization.md) for more information.
|fx.feature|False|
<a name="view-dashboardviewtype-tiles-definitions-option-5"></a>
### Option 5
<a name="view-dashboardviewtype-tiles-definitions-an-array-of-items-where-each-item-is-of-the-type-4"></a>
### An array of items, where each item is of the type:
<a name="view-dashboardviewtype-tiles-definitions-an-array-of-items-where-each-item-is-of-the-type-4-an-object-with-the-following-properties-4"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|type|True|Enum permitting the value: "PolicyTile"
|title|True|The title of the tile.
|subtitle|False|The subtitle of the tile.
|layout|True|Determines the tile size and location of the tile on the page. See [here](dx-view-dashboardViewType-tileLayout.md) for more information.
|visible|False|Hide or show the tile based on the parameter values. See [here](dx-view-dashboardViewType-visible.md) for more information.
|highlight|False|Highlight the tile based on the parameter values. See [here](dx-view-dashboardViewType-highlight.md) for more information.
|actions|False|Actions available on the tile. See [here](dx-view-dashboardViewType-actions.md) for more information.
|data|True|The data that determines the content of the policy tile. See [here](dx-view-dashboardViewType-policyTileData.md) for more information
|fx.feature|False|
<a name="view-dashboardviewtype-tiles-definitions-option-6"></a>
### Option 6
<a name="view-dashboardviewtype-tiles-definitions-an-array-of-items-where-each-item-is-of-the-type-5"></a>
### An array of items, where each item is of the type:
<a name="view-dashboardviewtype-tiles-definitions-an-array-of-items-where-each-item-is-of-the-type-5-an-object-with-the-following-properties-5"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|type|True|Enum permitting the value: "NavigationTile"
|title|True|The title of the tile.
|subtitle|False|The subtitle of the tile.
|layout|True|Determines the tile size and location of the tile on the page. See [here](dx-view-dashboardViewType-tileLayout.md) for more information.
|visible|False|Hide or show the tile based on the parameter values. See [here](dx-view-dashboardViewType-visible.md) for more information.
|highlight|False|Highlight the tile based on the parameter values. See [here](dx-view-dashboardViewType-highlight.md) for more information.
|actions|False|Actions available on the tile. See [here](dx-view-dashboardViewType-actions.md) for more information.
|data|True|The data that determines the content of the navigation tile. See [here](dx-view-dashboardViewType-navigationTileData.md) for more information
|fx.feature|False|

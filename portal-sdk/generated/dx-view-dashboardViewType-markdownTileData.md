<a name="view-dashboardviewtype-markdowntiledata"></a>
# view-dashboardViewType-markdownTileData
* [view-dashboardViewType-markdownTileData](#view-dashboardviewtype-markdowntiledata)
    * [Definitions:](#view-dashboardviewtype-markdowntiledata-definitions)
        * [Option 1](#view-dashboardviewtype-markdowntiledata-definitions-option-1)
        * [Option 2](#view-dashboardviewtype-markdowntiledata-definitions-option-2)

<a name="view-dashboardviewtype-markdowntiledata-definitions"></a>
## Definitions:
<a name="view-dashboardviewtype-markdowntiledata-definitions-option-1"></a>
### Option 1
<a name="view-dashboardviewtype-markdowntiledata-definitions-option-1-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|source|True|The source of the markdown tile content. Either inline or uri.
|content|True|The inline content that is shown on the markdown tile. It supports plain text, __Markdown__, and even limited HTML.
|fx.feature|False|
<a name="view-dashboardviewtype-markdowntiledata-definitions-option-2"></a>
### Option 2
<a name="view-dashboardviewtype-markdowntiledata-definitions-option-2-an-object-with-the-following-properties-1"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|source|True|The source of the markdown tile content. Either inline or uri.
|uri|True|The uri to get the markdown content from to display within the tile.
|fx.feature|False|

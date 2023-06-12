<a name="view-databrowseviewtype-properties"></a>
# view-dataBrowseViewType-properties
* [view-dataBrowseViewType-properties](#view-databrowseviewtype-properties)
    * [Definitions:](#view-databrowseviewtype-properties-definitions)

<a name="view-databrowseviewtype-properties-definitions"></a>
## Definitions:
<a name="view-databrowseviewtype-properties-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|title|True|Display title text for the DataBrowse view
|description|False|Display description text for the DataBrowse view
|fx.feature|False|
|ariaLabel|True|label of the command used for screen reader users.
|data|True|Data property accepts an array, and can be static or dynamic. In both cases, the data must map to the columns specified. You can specify a JMES path query in the `transforms` to manage the data. See [here](dx-view-databrowseViewType-data.md) for more information.
|columns|True|Define the column to be shown in the DataBrowse view. See [here](dx-view-databrowseViewType-columns.md) for more information.

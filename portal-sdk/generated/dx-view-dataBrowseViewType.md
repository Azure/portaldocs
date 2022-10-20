<a name="databrowseviewtype"></a>
# DataBrowseViewType
* [DataBrowseViewType](#databrowseviewtype)
    * [Description](#databrowseviewtype-description)
    * [Sections](#databrowseviewtype-sections)
    * [Properties Section](#databrowseviewtype-properties-section)

<a name="databrowseviewtype-description"></a>
## Description
The Data Browse view is used to display the array data in a table.
<a name="databrowseviewtype-sections"></a>
## Sections
| Name | Required | Description
| ---|:--:|:--:|
|kind|True|Enum permitting the value: "DataBrowse"
|export|False|Designation for blade sharing across extensions. If set to `true` then it is available to be used by other extensions.
|contextPaneWidth|False|See [here](dx-enum-contextPaneWidth.md ) for the available options
|parameters|False|Defines the parameters to be passed into a declarative blade, that then can be accessed using the parameters function. See [View parameters](dx-viewTypeParameters.md) for more.
|resources|False|The resources section takes an ARM resource id and apiVersion, which in turn makes a ARM GET request to retrieve the resource details. You can use the resources() function to retrieve the resource payload at runtime.
|dataSources|False|Supports Graph API. Use it to pre-load graph API before the view is rendered. See [here](dx-viewTypeDataSources.md) for **dataSources** property.
|messages|False|Display a banner at the top of the view. See [here](dx-enum-viewTypeMessages-items-kind.md) for details.
|essentials|False|Defines Essentials section for the view
|commands|False|The commands section defines the Commands in the command bar.See [here](dx-viewTypeCommands.md) for **commands** property.
|properties|True|
|fx.feature|False|
<a name="databrowseviewtype-properties-section"></a>
## Properties Section
<a name="databrowseviewtype-properties-section-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|title|True|
|description|False|
|fx.feature|False|
|ariaLabel|True|label of the command used for screen reader users.
|data|True|Data property accepts an array, and can be static or dynamic. In both cases, the data must map to the columns specified. You can specify a JMES path query in the `transforms` to manage the data.
|columns|True|Define the column to be shown in the DataBrowse view

<a name="dashboardviewtype"></a>
# DashboardViewType
* [DashboardViewType](#dashboardviewtype)
    * [Description](#dashboardviewtype-description)
    * [Sections](#dashboardviewtype-sections)
    * [Properties Section](#dashboardviewtype-properties-section)

<a name="dashboardviewtype-description"></a>
## Description
The Dashboard view lets you create a dashboard like view with multiple tiles in it. It also supports pages. This is currently in Private Preview.
<a name="dashboardviewtype-sections"></a>
## Sections
| Name | Required | Description
| ---|:--:|:--:|
|kind|True|
|export|False|Designation for blade sharing across extensions. If set to `true` then it is available to be used by other extensions.
|parameters|False|Defines the parameters to be passed into a declarative blade, that then can be accessed using the parameters function. See [View parameters](dx-viewTypeParameters.md) for more.
|messages|False|Display a banner at the top of the view. See [here](dx-viewTypeMessages.md) for details.
|properties|True|
|fx.feature|False|
<a name="dashboardviewtype-properties-section"></a>
## Properties Section
<a name="dashboardviewtype-properties-section-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|title|True|
|pages|True|
|parameters|False|
|fx.feature|False|

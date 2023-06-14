<a name="galleryviewtype"></a>
# GalleryViewType
* [GalleryViewType](#galleryviewtype)
    * [Sections](#galleryviewtype-sections)
    * [Properties Section](#galleryviewtype-properties-section)
        * [Option 1](#galleryviewtype-properties-section-option-1)
        * [Option 2](#galleryviewtype-properties-section-option-2)

<a name="galleryviewtype-sections"></a>
## Sections
| Name | Required | Description
| ---|:--:|:--:|
|kind|True|
|export|False|Designation for blade sharing across extensions. If set to `true` then it is available to be used by other extensions.
|contextPaneWidth|False|See [here](dx-enum-contextPaneWidth.md ) for the available options
|parameters|False|Defines the parameters to be passed into a declarative blade, that then can be accessed using the parameters function. See [View parameters](dx-viewTypeParameters.md) for more.
|resources|False|The resources section takes an ARM resource id and apiVersion, which in turn makes a ARM GET request to retrieve the resource details. You can use the resources() function to retrieve the resource payload at runtime.
|dataSources|False|Supports Graph API. Use it to pre-load graph API before the view is rendered. See [here](dx-viewTypeDataSources.md) for **dataSources** property.
|messages|False|Display a banner at the top of the view. See [here](dx-viewTypeMessages.md) for details.
|essentials|False|Defines Essentials section for the view
|commands|False|The commands section defines the Commands in the command bar.See [here](dx-viewTypeCommands.md) for **commands** property.
|properties|False|The properties section defines the form that needs to be rendered. The tabs needed, the controls in each tab etc. are defined in the properties section.
|fx.feature|False|
<a name="galleryviewtype-properties-section"></a>
## Properties Section
<a name="galleryviewtype-properties-section-option-1"></a>
### Option 1
<a name="galleryviewtype-properties-section-option-1-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|title|True|Title of the Marketplace Gallery view
|mode|True|
|marketplaceQueryParams|False|
|fx.feature|False|
<a name="galleryviewtype-properties-section-option-2"></a>
### Option 2
<a name="galleryviewtype-properties-section-option-2-an-object-with-the-following-properties-1"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|title|True|
|elements|True|
|fx.feature|False|

<a name="view-autogenformviewtype-properties-deployment"></a>
# view-autogenFormViewType-properties-deployment
* [view-autogenFormViewType-properties-deployment](#view-autogenformviewtype-properties-deployment)
    * [Definitions:](#view-autogenformviewtype-properties-deployment-definitions)

<a name="view-autogenformviewtype-properties-deployment-definitions"></a>
## Definitions:
<a name="view-autogenformviewtype-properties-deployment-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|kind|True|enum "ResourceGroup", "Subscription", "ManagementGroup", "Tenant"
|primaryResourceId|False|Supply primaryResourceId to pick up parentResource deployment scope information
|templateParametersDefaultValueOverrides|False|Supply parameters to override in template.file parameters
|template|True|Supply relative path to your deployment template using template.file
|fx.feature|False|

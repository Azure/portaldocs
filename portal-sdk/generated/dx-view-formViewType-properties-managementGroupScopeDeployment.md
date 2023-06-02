<a name="view-formviewtype-properties-managementgroupscopedeployment"></a>
# view-formViewType-properties-managementGroupScopeDeployment
* [view-formViewType-properties-managementGroupScopeDeployment](#view-formviewtype-properties-managementgroupscopedeployment)
    * [Definitions:](#view-formviewtype-properties-managementgroupscopedeployment-definitions)

<a name="view-formviewtype-properties-managementgroupscopedeployment-definitions"></a>
## Definitions:
<a name="view-formviewtype-properties-managementgroupscopedeployment-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|kind|True|enum "ManagementGroup"
|managementGroupId|True|Specify managementGroupId for deployment
|location|True|Specify location for deployment
|parameters|True|Specify all deployment parameters
|template|True|Supply relative path to your deployment template using template.file
|postCreate|False|Specify all postCreate to allow post deployment customization
|fx.feature|False|

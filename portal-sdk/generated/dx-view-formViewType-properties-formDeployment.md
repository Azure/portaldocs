<a name="view-formviewtype-properties-formdeployment"></a>
# view-formViewType-properties-formDeployment
* [view-formViewType-properties-formDeployment](#view-formviewtype-properties-formdeployment)
    * [Guidance](#view-formviewtype-properties-formdeployment-guidance)
        * [deployment examples](#view-formviewtype-properties-formdeployment-guidance-deployment-examples)
    * [Definitions:](#view-formviewtype-properties-formdeployment-definitions)
        * [Option 1](#view-formviewtype-properties-formdeployment-definitions-option-1)
        * [Option 2](#view-formviewtype-properties-formdeployment-definitions-option-2)
        * [Option 3](#view-formviewtype-properties-formdeployment-definitions-option-3)
        * [Option 4](#view-formviewtype-properties-formdeployment-definitions-option-4)

<a name="view-formviewtype-properties-formdeployment-guidance"></a>
## Guidance

<a name="view-formviewtype-properties-formdeployment-guidance-deployment-examples"></a>
### deployment examples

* \[Option1\] : [here](dx-view-formViewType-properties-resourceGroupScopeDeployment.md) for **resourceGroupScopeDeployment** property.
* \[Option2\] : [here](dx-view-formViewType-properties-subscriptionScopeDeployment.md) for **subscriptionScopeDeployment** property.
* \[Option3\] : [here](dx-view-formViewType-properties-managementGroupScopeDeployment.md) for **managementGroupScopeDeployment** property.
* \[Option4\] : [here](dx-view-formViewType-properties-tenantScopeDeployment.md) for **tenantScopeDeployment** property.
 
<a name="view-formviewtype-properties-formdeployment-definitions"></a>
## Definitions:
<a name="view-formviewtype-properties-formdeployment-definitions-option-1"></a>
### Option 1
<a name="view-formviewtype-properties-formdeployment-definitions-option-1-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|kind|True|enum "ResourceGroup"
|location|False|Specify location for deployment
|onSubmit|False|Specify onSubmit action after deployment. This allows a sequence of custom blade to open (as context blade) on user click primary button to start deployment. 
|resourceGroupId|True|Specify resourceGroupId
|parameters|True|Specify all deployment parameters
|template|True|Supply relative path to your deployment template using template.file
|primaryResourceId|False|Specify primary resource id used in deployment
|fx.feature|False|
<a name="view-formviewtype-properties-formdeployment-definitions-option-2"></a>
### Option 2
<a name="view-formviewtype-properties-formdeployment-definitions-option-2-an-object-with-the-following-properties-1"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|kind|True|enum "Subscription"
|subscriptionId|True|Specify subscriptionId for deployment
|location|True|Specify location for deployment
|parameters|True|Specify all deployment parameters
|template|True|Supply relative path to your deployment template using template.file
|fx.feature|False|
<a name="view-formviewtype-properties-formdeployment-definitions-option-3"></a>
### Option 3
<a name="view-formviewtype-properties-formdeployment-definitions-option-3-an-object-with-the-following-properties-2"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|kind|True|enum "ManagementGroup"
|managementGroupId|True|Specify managementGroupId for deployment
|location|True|Specify location for deployment
|parameters|True|Specify all deployment parameters
|template|True|Supply relative path to your deployment template using template.file
|fx.feature|False|
<a name="view-formviewtype-properties-formdeployment-definitions-option-4"></a>
### Option 4
<a name="view-formviewtype-properties-formdeployment-definitions-option-4-an-object-with-the-following-properties-3"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|kind|True|enum "Tenant"
|location|True|Specify location for deployment
|parameters|True|Specify all deployment parameters
|template|True|Supply relative path to your deployment template using template.file
|fx.feature|False|

Applicable to **deployment scenario only**.

Microsoft.Common.ResourceScope control **has to be included** into your Form view if you are implementing top level resource deployment scenario. This control should be included as a **first element** in your **first step** in steps section.

ResourceScope control provides resource scope selectors and resource name field as one control. ResourceScope will parse your deployment template and show the proper scope selectors along with the resource name textbox. Resource name is included in all scenarios.

| Level of the deployment | Selectors included |
| --- | --- |
| Resource group | subscription/resourceGroup/location |
| Subscription | subscription and location |
| Management group | managementGroup and location |
| Tenant | location picker only, deployment will be run within current tenant |

The ResourceScope control will change based on the scope schema defined in the ARM template - these are supported scopes:
- [Resource Group - Deploy resources to resource groups - Azure Resource Manager | Microsoft Docs](https://learn.microsoft.com/azure/azure-resource-manager/templates/deploy-to-resource-group?tabs=azure-cli#schema)
- [Subscription - Deploy resources to subscription - Azure Resource Manager | Microsoft Docs](https://learn.microsoft.com/azure/azure-resource-manager/templates/deploy-to-subscription?tabs=azure-cli#schema)
- [Management Group - Deploy resources to management group - Azure Resource Manager | Microsoft Docs](https://learn.microsoft.com/azure/azure-resource-manager/templates/deploy-to-management-group?tabs=azure-cli#schema)
- [Tenant - Deploy resources to tenant - Azure Resource Manager | Microsoft Docs](https://learn.microsoft.com/azure/azure-resource-manager/templates/deploy-to-tenant?tabs=azure-cli#schema)

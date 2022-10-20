ResourceScope control exposes the following outputs that could be used across your Form view.

| Assuming your Form view contains steps where the name of the first step is &quot;step1&quot; and the name of ResourceScope control is &quot;resourceScope&quot; | Sample Value |
| --- | --- |
| [steps(&#39;step1&#39;).resourceScope.resourceGroup.id] | /subscriptions/12345678-100d-43cf-8dc4-1ce6ba8efa7d/resourceGroups/testrg |
| [steps(&#39;step1&#39;).resourceScope.resourceGroup.name] | testrg |
| [steps(&#39;step1&#39;).resourceScope.resourceGroup.location] | eastus |
| [steps(&#39;step1&#39;).resourceScope.resourceGroup.mode] | New or Existing |
| [steps(&#39;step1&#39;).resourceScope.subscription.id] | /subscriptions/12345678-100d-43cf-8dc4-1ce6ba8efa7d |
| [steps(&#39;step1&#39;).resourceScope.subscription.subscriptionId] | 12345678-100d-43cf-8dc4-1ce6ba8efa7d |
| [steps(&#39;step1&#39;).resourceScope.subscription.displayName] | Scuffy Playground 1 |
| [steps(&#39;step1&#39;).resourceScope.subscription.tenantId] | 12345678-100d-43cf-8dc4-1ce6ba8efa7d
 |
| [steps(&#39;step1&#39;).resourceScope.managementGroup.id] | /providers/Microsoft.Management/managementGroups/testmg |
| [steps(&#39;step1&#39;).resourceScope.managementGroup.name] | testmg |
| [steps(&#39;step1&#39;).resourceScope.managementGroup. displayName] | Test management group |
| [steps(&#39;step1&#39;).resourceScope.location.name] | eastus |
| [steps(&#39;step1&#39;).resourceScope.location.displayName] | (US) East US |
| [steps(&#39;step1&#39;).resourceScope.resourceName] | testResource |

For ResourceScopeDataModel.ResourceGroupOutput, the 'modeName' property maps numeric 'mode' value to string literal 'Existing' | 'New'. Example snippet:
```json
{
    "location": {
        "label": "New resource group location",
        "visible": "[equals('New', steps('basics').resourceScope.resourceGroup.modeName)]",
    },
}
```

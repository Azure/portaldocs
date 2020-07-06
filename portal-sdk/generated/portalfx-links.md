
<a name="deep-links"></a>
# Deep links

Use deep links to jump directly into your extension within the portal. Each deep link consists of the portal URL (e.g. https://portal.azure.com), target directory domain name or tenant id (e.g. microsoft.com), a route prefix (i.e. asset, resource, blade, browse, or marketplace), and the actual deep link target.

<a name="deep-links-blades"></a>
## Blades

To link to blades, the route prefix is `blade` followed by the owning extension then the blade name:

`https://portal.azure.com/#blade/{extension}/{blade}`

Blade inputs are serialized in consecutive name/value pairs, the below example has a single input `resourceType` and the value passed in is `Microsoft.Resources/resources`

For instance: 

https://portal.azure.com/#blade/HubsExtension/Resources/resourceType/Microsoft.Resources%2Fresources

<a name="deep-links-blades-menu-blades"></a>
### Menu Blades

Similar to blades, Menu blades follow the same `blade` prefix. 
Although a difference a menu blade deep link is they allow for a menu item identifier. If this is specified the given menu item will be selected,
if not then it will default to the overview item or the first item in the menu.

`https://portal.azure.com/#blade/{extension}/{blade}/{menuItemId}`

For instance:
https://portal.azure.com/#blade/Microsoft_Azure_Support/HelpAndSupportBlade/overview


<a name="deep-links-resources"></a>
## Resources

To link to a ARM resource, all you need is the ARM resource id. Tenant resources and nested resources are not supported.

`https://portal.azure.com/#@{directory}/resource/{resource id}`

For instance:

https://portal.azure.com/#@microsoft.onmicrosoft.com/resource/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/foo/providers/microsoft.web/sites/bar

ARM resources are built using a menu blade, so they also follow the menu blade deeplinking format - you can provide a menu item to be selected 
as the final parameter.

`https://portal.azure.com/#@{directory}/resource/{resource id}/{menuItemId}`

For instance:

https://portal.azure.com/#@microsoft.onmicrosoft.com/resource/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/foo/providers/microsoft.web/sites/bar/monitoring

<a name="deep-links-create-blades"></a>
## Create blades

To link to Create blade, include the package id:

`https://portal.azure.com/#create/{package id}`

For instance:
https://portal.azure.com/#create/Microsoft.WindowsServer2016Datacenter-ARM


<a name="deep-links-marketplace-item-details-blades"></a>
## Marketplace item details blades

To link to the Marketplace item details blade for your package, add "/preview" to the end of your Create blade link:

`https://portal.azure.com/#create/{package id}/preview`

For instance:
https://portal.azure.com/#create/Microsoft.WindowsServer2016Datacenter-ARM/preview


<a name="deep-links-assets"></a>
## Assets

To link to assets, include the extension name, asset type, and asset id.
`https://portal.azure.com/#asset/{extension}/{asset type}/{asset id}`

For instance:
https://portal.azure.com/#asset/Microsoft_Azure_KeyVault/Secret/https://mykeyvaultname.vault.azure.net/secrets/secretName/id
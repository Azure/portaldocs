
<a name="deep-links"></a>
# Deep links

Use deep links to jump directly into your extension within the portal. Each deep link consists of the portal URL (e.g. https://portal.azure.com), target directory domain name or tenant id (e.g. microsoft.com), deep link type prefix (i.e. asset, resource, blade, browse, or marketplace), and the actual deep link target.


<a name="deep-links-resources"></a>
## Resources

To link to resources, all you need is the resource id. Currently, only subscription resources are supported. Tenant resources and nested resources are not supported.

> `https://portal.azure.com/{directory}#resource{resource id}`

For instance...

> [https://portal.azure.com/microsoft.com#resource/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/foo/providers/microsoft.web/sites/bar]()


<a name="deep-links-blades"></a>
## Blades

To link to blades, include the extension and blade name:

> `https://portal.azure.com/{directory}#blade/{extension}/{blade}`

For instance...

> [https://portal.azure.com/microsoft.com#blade/HubsExtension/HelpAndSupportBlade]()

Blade inputs are serialized in consecutive name/value pairs:

> [https://portal.azure.com/microsoft.com#blade/HubsExtension/BrowseAllBladeWithType/type/HubsExtension_Tag]()

<!--
TODO: micflan: Finish implementing Browse links

<a name="deep-links-browse-blades-coming-soon"></a>
## Browse blades (coming soon)

To link to Browse v2 blades, include the resource type:

> `https://portal.azure.com/{directory}#browse/{resource type}`

For instance...

> [https://portal.azure.com/microsoft.com#browse/microsoft.search/searchServices]()

Additionally, you can also link to the following Browse blades:

* `#browse/all`
* `#browse/resourcegroups`
* `#browse/subscriptions`
* `#browse/tags`
-->


<a name="deep-links-create-blades"></a>
## Create blades

To link to Create blade, include the package id:

> `https://portal.azure.com/{directory}#create/{package id}`

For instance...

> [https://portal.azure.com/microsoft.com#create/NewRelic.NewRelicAccount]()


<a name="deep-links-marketplace-item-details-blades"></a>
## Marketplace item details blades

To link to the Marketplace item details blade for your package, add "/preview" to the end of your Create blade link:

> `https://portal.azure.com/{directory}#create/{package id}/preview`

For instance...

> [https://portal.azure.com/microsoft.com#create/NewRelic.NewRelicAccount/preview]()


<a name="deep-links-assets"></a>
## Assets

To link to assets, include the extension name, asset type, and asset id.

> `https://portal.azure.com/{directory}#asset/{extension}/{asset type}/{asset id}`

For instance...

> [https://portal.azure.com/microsoft.com#asset/Microsoft_Azure_Billing/BillingSubscriptionBrowseService/00000000-0000-0000-0000-000000000000]()




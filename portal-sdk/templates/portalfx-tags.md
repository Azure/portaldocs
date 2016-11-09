<properties title="" pageTitle="Resource tags" description="" authors="flanakin,justbe" />

## Resource Tags

In the full Azure portal, subscriptions are the only way to organize and group resources. In the preview portal, [resource groups](http://azure.microsoft.com/en-us/documentation/articles/azure-preview-portal-using-resource-groups) allow you to manage related resources as a single unit, which became even more valuable with [role-based access control](portalfx-permissions). Now, you can  tag resources with name/value pairs to categorize and view resources across resource groups and, within the portal, across subscriptions.

To get started, open any resource in the preview portal, click tag icon in Essentials to add or remove tags for that resource, and click the tag to view all resources and resource groups with the same tag. Pin the tag blade to the Startboard to access it quickly and easily, or use the Browse hub to navigate to any tags across all your subscriptions. You can also [manage tags using Azure PowerShell](http://go.microsoft.com/fwlink/?linkid=394765&clcid=0x4090) or by using the [Azure Resource Manager REST API reference](http://msdn.microsoft.com/en-us/library/azure/dn790568.aspx).

For more information, read the full [Tags documentation](http://azure.microsoft.com/en-us/documentation/articles/azure-preview-portal-using-tags).

![Tags make it easy to categorize and organize resources][tags]

**NOTE:** The Tags blade uses an HTTP PATCH operation to save tags to your resource provider (RP) using the last API version defined in your RP manifest for that resource type. To use an explicit API version, include it in the resource id you specify in the part/blade (e.g. /subscriptions/###/resourceGroups/xxx/providers/Microsoft.Cache/redis/xxx?api-version=2015-01-01).

[tags]: ../media/portalfx-tags/tags.png
<a name="developing-extensions-for-azure-resources-vs-non-azure-resources"></a>
# Developing Extensions for Azure Resources vs. Non-Azure Resources

<a name="developing-extensions-for-azure-resources-vs-non-azure-resources-azure-resources"></a>
## Azure Resources

The SDK has several framework features that make it easier to implement UX that is consistent across all resource types.  Most of these features are free once you've implemented the [Asset Model](portalfx-assets.md).

- [Browse](portalfx-browse.md) - Integrates your resource type into the portal's main menu that categorizes and lists resources.
- [Resource Menu](portalfx-resourcemenu.md) - Provides a base implementation of a menu blade, with standard resource features (e.g. RBAC, Locks, Audit Logs) automatically injected into the menu. 
- Search - Azure resources are automatically integrated into the potal's global search
- [Tile Gallery Integration](portalfx-ux-tile-gallery.md) - Exposes tiles for your resource in the portal's tile gallery

The majority of the docs apply to these types of extensions.  The next few sections talk about building the less common, but still awesome, non Azure resource based extension.

<a name="developing-extensions-for-azure-resources-vs-non-azure-resources-non-azure-resources"></a>
## Non-Azure Resources

If you are developing an extension that is not acting as a front end for a standard Azure Resource Provider then this section describes a general strategy for designing such an extension. It also calls out which capabilities are not available to these types of extensions.

__Time Saving Note__ - If you are developing this type of extension then your life will be better if all blades in your extension are built using [template blades](portalfx-blades-templateBlade.md).  If you are using `<Blade>` then you should ask youself why. That is a legacy part of the SDK.

<a name="developing-extensions-for-azure-resources-vs-non-azure-resources-non-azure-resources-marketplace-integration"></a>
### Marketplace integration

You do not need to have an Azure resource provider to [integrate with the marketplace and the portal's create flows](portalfx-create.md).

<a name="developing-extensions-for-azure-resources-vs-non-azure-resources-non-azure-resources-browse-service-entry-point"></a>
### Browse (Service entry point)

The [Browse](portalfx-browse.md) experience can serve as a user's main entry point to your non-resource extension. You have two options:

1. Use the [asset model](permalink-asset-type-non-arm), which lets you define your browsable asset even though it is not an Azure resource. This option is good if __your service conceptually exposes a single, top level, list of entities (e.g. Accounts, Workspaces, etc.)__.
2. Use the [custom browse](permalink-browse-custom-blade) option in browse.  __This option is useful if your service has many top level capabilities__. If you choose this option then it's highly recommended that you use a [menu blade](portalfx-blades-menublade.md) to expose your service's capabilities. The [Azure Security Center](https://portal.azure.com/#blade/Microsoft_Azure_Security/SecurityMenuBlade) experience shows this pattern in production.

<a name="developing-extensions-for-azure-resources-vs-non-azure-resources-non-azure-resources-menu-blades"></a>
### Menu blades

[Menu blades](portalfx-blades-menublade.md) are a framework component that can be used to build blades that have a menu on the left and content on the right.  The look and feel of these blades is exactly like the resource menu blades that Azure resources have, except that the menu blade will not have items injected automatically. Usability and customer feedback has shown that this way of exposing features is more effective than previous patterns.

<a name="developing-extensions-for-azure-resources-vs-non-azure-resources-non-azure-resources-dashboard-integration"></a>
### Dashboard integration

If you are interested in contributing tiles (a.k.a. parts) to the dashboard via the [tile gallery](portalfx-ux-tile-gallery.md) you can do that, even if your service is not Azure based. Note that these non-Azure tiles will all be shown in the 'General' pivot.  The other pivots only support Azure resources. Note that the dashboard sharing feature requires an Azure subscription.  Users without an Azure subscription can have multiple, private dashboards.

<a name="developing-extensions-for-azure-resources-vs-non-azure-resources-non-azure-resources-portal-capabilities-that-require-being-backed-by-an-arm-resource"></a>
### Portal capabilities that require being backed by an ARM resource

Non-Azure resource based extensions cannot use the following framework features:

1. __Server side notifications__ - These come from the Azure event service, which only supports Azure resources.
1. __Shared dashboards__ - Requires an Azure subscription.
1. __Global Search__ - Global search is implemented by querying ARM APIs
1. __No-code browse__ - No-code browse leverages ARM to lower the amount of code to write for browse.  You can still implement browse, but it requires writing more code.

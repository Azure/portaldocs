{"gitdown": "contents"}

## Installation

From nuget package manager console

```
Install-Package Microsoft.Portal.Extensions.Hubs -Source https://msazure.pkgs.visualstudio.com/_packaging/Official/nuget/v3/index.json -Version <Version_Number>
```

*Note:* you will need to update the <Version_Number> with the latest version number from [here](https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.extensions.hubs)

# Parts

## ResourceTagsPart

This part should not be used directly. Using the ResourceSummaryPart (essentials) will include showing tags for your resource.

## ResourceFilterPart

To use this part contact Umair Aftab <ibiza-hubs@microsoft.com>.

## PricingTierLauncherV3

* [See live sample](http://aka.ms/portalfx/samples#blade/SamplesExtension/PricingV3Blade)
* See sample code  file://%userprofile%/documents/PortalSDK/FrameworkPortal/Extensions/SamplesExtension/Extension/Client/Hubs/PricingV3

## SpecPickerListViewPartV3

To use this part contact Sam Armstrong <ibiza-hubs@microsoft.com>.

## PricingTierLauncher

To use this part contact Sam Armstrong <ibiza-hubs@microsoft.com>.

## ServicesHealthPart

To use this part contact Ifeanyi Echeruo <ibiza-hubs@microsoft.com>.

## AzureServiceHealthPart

To use this part contact Ifeanyi Echeruo <ibiza-hubs@microsoft.com>.

## SpecPickerListViewPart

To use this part contact Sam Armstrong <ibiza-hubs@microsoft.com>.

## DiagnosticsTile

To use this part contact Michael Flanakin <ibiza-hubs@microsoft.com>.

## FeedbackTile

To use this part contact Michael Flanakin <ibiza-hubs@microsoft.com>.

## WhatsNewTile

To use this part contact Guruprasad Airy <ibiza-hubs@microsoft.com>.

## LegalTermsSubscriptionProgrammaticAccessTilePart

INTERNAL - Do not use.

## GalleryLauncherPart

DEPRECATED - Do not use. Legacy part. This part uses the old parameter collection API and is no
longer supported.

## BrowseResourceListPart

This part represents a browse V2 grid list for a specific resource type.  This is usually not used directly and is
used by the BrowseResourceBlade.  However, it can use referenced if the inputs are provided.  The inputs include
the 'bladeId' which is used to identify the owner blade and is used to communicate query errors from the browse data
layer with the blade.  The 'resourceType' input is the fully qualified resource type (ie, "Microsoft.Web/sites") for
the resources that should appear in the list.  The 'selectedSubscriptions' input is an array of selected subscriptions
that filters the list and is generally the output from the ResourceFilterPart.subscriptions property.  The
'subscriptionsFiltered' input is a flag to indicate the selectedSubscriptions input is currently filtered.  The
'filter' input is the text filter for the resources that should appear in the list and is generally the output from
the ResourceFilterPart.filter property.  The optional 'scope' input is the scope for the resources that should appear
in the list and can be a fully qualified subscription ID (/subscriptions/..subID..) to show only the resources from
the given subscription, a resource group ID (/subscriptions/..subID../resourcegroups/..resgroupID..) to show only the
resources contained in the given resource group or a resource ID
(/subscriptions/..subID../resourcegroups/..resgroupID../providers/..provider../..type../..resID..) to show only the
nested resources under the given resource.

## BrowseResourceListPartWithCookie

This part represents a BrowseResourceListPart with an additional cookie input.  Currently this is not used and is a
placeholder when custom data sources are added to browse V2.

## ResourceGroupMapPart

This part represents a resource group map list part to be used on a blade.
This part is deprecated and the MapResourceGroupListPart should be used instead.

## ResourceMapPart

This part represents a resource map list part to be used on a blade.
This part is deprecated and the MapResourceGroupListPart should be used instead.
* See sample code file://%userprofile%/documents/PortalSDK/FrameworkPortal/Extensions/SamplesExtension/Extension/Client/ResourceTypes/Snowmobile/Snowmobile.pdl

## MapResourceGroupListPart

This part represents a resource group map list part to be used on a blade.  The inputs for this part include the 'id'
input which is the resource group ID or resource ID for the map.  This part can take either ID and produce the
resource group map list.

## BrowseServiceListPart

This part represents a browse V1 grid list.  The 'assetTypeId' input represents the extension and asset type for the
assets to be shown in the list.

## BrowseServiceListPartWithCookie

This part represents a browse V1 grid list.  The 'assetTypeId' input represents the extension and asset type for the
assets to be shown in the list.  The 'cookie' input is an opaque cookie value that is passed directly to the browse
service view model when retrieving items.
* See sample code file://%userprofile%/documents/PortalSDK/FrameworkPortal/Extensions/SamplesExtension/Extension/Client/Hubs/BrowseReuse/BrowseReuse.pdl

# Blades

## DeployFromTemplateBlade

To use this blade contact Guruprasad Airy <ibiza-hubs@microsoft.com>.

## TemplateEditorBlade

To use this blade contact Guruprasad Airy <ibiza-hubs@microsoft.com>.

## ParametersEditorBlade

To use this blade contact Guruprasad Airy <ibiza-hubs@microsoft.com>.

## ResourceGroupPickerV3Blade

To use this blade contact Guruprasad Airy <ibiza-hubs@microsoft.com>.

## SubscriptionPickerV3Blade

To use this blade contact Guruprasad Airy <ibiza-hubs@microsoft.com>.

## LocationPickerV3Blade

To use this blade contact Guruprasad Airy <ibiza-hubs@microsoft.com>.

## SettingsBlade

To use this blade contact Rachana Mhetre <ibiza-hubs@microsoft.com>.

## DeploymentDetailsBlade

To use this blade contact Guruprasad Airy <ibiza-hubs@microsoft.com>.

## ResourceGroupMapBlade

This blade is used to represent a resource group map standalone blade.  The 'id' input represents a resource group ID.
The blade will show the resource group map list for the resource group.

## BrowseResourceBlade

This blade represents a Browse V2 blade for a specific resource type.  The 'resourceType' input is used to control
which type of resources will appear in the BrowseResourceListPart on the blade.  The optional 'scope' input is the
scope for the resources that should appear in the list and can be a fully qualified subscription ID
(/subscriptions/..subID..) to show only the resources from the given subscription, a resource group ID
(/subscriptions/..subID../resourcegroups/..resgroupID..) to show only the resources contained in the given resource
group or a resource ID (/subscriptions/..subID../resourcegroups/..resgroupID../providers/..provider../..type../..resID..)
to show only the nested resources under the given resource.

Normal browse resource blade:
* [See live sample](http://aka.ms/portalfx/samples#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.Test%2Fhosts)

Scoped browse resource blade:
* [See live sample](http://aka.ms/portalfx/samples#blade/HubsExtension/BrowseResourceBlade/resourceType/Microsoft.test%2Fhosts/scope/%2Fsubscriptions%2Fsub123%2Fresourcegroups%2Fservicetest)
* See sample code file://%userprofile%/documents/PortalSDK/FrameworkPortal/Extensions/SamplesExtension/Extension/Client/Hubs/ScopedBrowse/ViewModels/ScopedBrowseLauncherPartViewModel.ts
* See sample code file://%userprofile%/documents/PortalSDK/FrameworkPortal/Extensions/SamplesExtension/Extension/Client/Hubs/ScopedBrowse/ScopedBrowse.pdl

## BrowseAllResourcesBlade

This blade represents a Browse V2 blade for all resource types.  The optional 'scope' input is the scope for the
resources that should appear in the list and can be a fully qualified subscription ID (/subscriptions/..subID..) to
show only the resources from the given subscription, a resource group ID
(/subscriptions/..subID../resourcegroups/..resgroupID..) to show only the resources contained in the given resource
group or a resource ID (/subscriptions/..subID../resourcegroups/..resgroupID../providers/..provider../..type../..resID..)
to show only the nested resources under the given resource.

Normal browse all resources blade:
* [See live sample](http://aka.ms/portalfx/samples#blade/HubsExtension/BrowseAllResourcesBlade)

Scoped browse all resources blade:
* [See live sample](http://aka.ms/portalfx/samples#blade/HubsExtension/BrowseAllResourceBlade/scope/%2Fsubscriptions%2Fsub123%2Fresourcegroups%2Fservicetest)
* See sample code file://%userprofile%/documents/PortalSDK/FrameworkPortal/Extensions/SamplesExtension/Extension/Client/Hubs/ScopedBrowse/ViewModels/ScopedBrowseLauncherPartViewModel.ts
* See sample code file://%userprofile%/documents/PortalSDK/FrameworkPortal/Extensions/SamplesExtension/Extension/Client/Hubs/ScopedBrowse/ScopedBrowse.pdl

## BrowseAllFilteredResourcesBlade

This blade represents a Browse V2 blade for all resource types with a pre-populated filter.  The 'scope' input is the
same as with the 'BrowseAllResourcesBlade' and the 'filter' input contains the initial text filter for the blade.

## BrowseResourceGroupBlade

This blade represents a Browse V2 blade for resource groups.  The 'resourceType' input must be
'Microsoft.Resources/subscriptions/resources'.  The optional 'scope' input is the scope for the resources groups that
should appear in the list and should only be a fully qualified subscription ID (/subscriptions/..subID..) to show only
the resource groups from the given subscription.

Normal browse resource blade:
* [See live sample](http://aka.ms/portalfx/samples#blade/HubsExtension/BrowseResourceGroupBlade/resourceType/Microsoft.Resources%2Fsubscriptions%2Fresourcegroups)

Scoped browse resource blade:
* [See live sample](http://aka.ms/portalfx/samples#blade/HubsExtension/BrowseResourceGroupBlade/resourceType/Microsoft.Resources%2Fsubscriptions%2Fresourcegroups/scope/%2Fsubscriptions%2Fsub123)
* See sample code file://%userprofile%/documents/PortalSDK/FrameworkPortal/Extensions/SamplesExtension/Extension/Client/Hubs/ScopedBrowse/ViewModels/ScopedBrowseLauncherPartViewModel.ts
* See sample code file://%userprofile%/documents/PortalSDK/FrameworkPortal/Extensions/SamplesExtension/Extension/Client/Hubs/ScopedBrowse/ScopedBrowse.pdl

## MapResourceGroupBlade

This blade is used to represent a resource group map standalone blade.  The 'id' input represents a resource group ID
or a resource ID.  The blade will show the resource group map list for the resource group or the resource group for
the resource depending on input.

# Commands

## MoveResourceCommand

To use this command contact Guruprasad Airy <ibiza-hubs@microsoft.com>.

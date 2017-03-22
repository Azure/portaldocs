* [Installation](#installation)
* [Parts](#parts)
    * [ResourceTagsPart](#parts-resourcetagspart)
    * [ResourceFilterPart](#parts-resourcefilterpart)
    * [PricingTierLauncherV3](#parts-pricingtierlauncherv3)
    * [SpecPickerListViewPartV3](#parts-specpickerlistviewpartv3)
    * [PricingTierLauncher](#parts-pricingtierlauncher)
    * [ServicesHealthPart](#parts-serviceshealthpart)
    * [AzureServiceHealthPart](#parts-azureservicehealthpart)
    * [SpecPickerListViewPart](#parts-specpickerlistviewpart)
    * [DiagnosticsTile](#parts-diagnosticstile)
    * [FeedbackTile](#parts-feedbacktile)
    * [WhatsNewTile](#parts-whatsnewtile)
    * [LegalTermsSubscriptionProgrammaticAccessTilePart](#parts-legaltermssubscriptionprogrammaticaccesstilepart)
    * [GalleryLauncherPart](#parts-gallerylauncherpart)
    * [BrowseResourceListPart](#parts-browseresourcelistpart)
    * [BrowseResourceListPartWithCookie](#parts-browseresourcelistpartwithcookie)
    * [ResourceGroupMapPart](#parts-resourcegroupmappart)
    * [ResourceMapPart](#parts-resourcemappart)
    * [MapResourceGroupListPart](#parts-mapresourcegrouplistpart)
    * [BrowseServiceListPart](#parts-browseservicelistpart)
    * [BrowseServiceListPartWithCookie](#parts-browseservicelistpartwithcookie)
* [Blades](#blades)
    * [DeployFromTemplateBlade](#blades-deployfromtemplateblade)
    * [TemplateEditorBlade](#blades-templateeditorblade)
    * [ParametersEditorBlade](#blades-parameterseditorblade)
    * [ResourceGroupPickerV3Blade](#blades-resourcegrouppickerv3blade)
    * [SubscriptionPickerV3Blade](#blades-subscriptionpickerv3blade)
    * [LocationPickerV3Blade](#blades-locationpickerv3blade)
    * [SettingsBlade](#blades-settingsblade)
    * [DeploymentDetailsBlade](#blades-deploymentdetailsblade)
    * [ResourceGroupMapBlade](#blades-resourcegroupmapblade)
    * [BrowseResourceBlade](#blades-browseresourceblade)
    * [BrowseAllResourcesBlade](#blades-browseallresourcesblade)
    * [BrowseAllFilteredResourcesBlade](#blades-browseallfilteredresourcesblade)
    * [BrowseResourceGroupBlade](#blades-browseresourcegroupblade)
    * [MapResourceGroupBlade](#blades-mapresourcegroupblade)
* [Commands](#commands)
    * [MoveResourceCommand](#commands-moveresourcecommand)


<a name="installation"></a>
## Installation

From nuget package manager console

```
Install-Package Microsoft.Portal.Extensions.Hubs -Source https://msazure.pkgs.visualstudio.com/_packaging/Official/nuget/v3/index.json -Version <Version_Number>
```

*Note:* you will need to update the <Version_Number> with the latest version number from [here](https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.extensions.hubs)

<a name="parts"></a>
# Parts

<a name="parts-resourcetagspart"></a>
## ResourceTagsPart

This part should not be used directly. Using the ResourceSummaryPart (essentials) will include showing tags for your resource.

<a name="parts-resourcefilterpart"></a>
## ResourceFilterPart

To use this part contact Umair Aftab <ibiza-hubs@microsoft.com>.

<a name="parts-pricingtierlauncherv3"></a>
## PricingTierLauncherV3

* [See live sample](http://aka.ms/portalfx/samples#blade/SamplesExtension/PricingV3Blade)
* See sample code  file://%userprofile%/documents/PortalSDK/FrameworkPortal/Extensions/SamplesExtension/Extension/Client/Hubs/PricingV3

<a name="parts-specpickerlistviewpartv3"></a>
## SpecPickerListViewPartV3

To use this part contact Sam Armstrong <ibiza-hubs@microsoft.com>.

<a name="parts-pricingtierlauncher"></a>
## PricingTierLauncher

To use this part contact Sam Armstrong <ibiza-hubs@microsoft.com>.

<a name="parts-serviceshealthpart"></a>
## ServicesHealthPart

To use this part contact Ifeanyi Echeruo <ibiza-hubs@microsoft.com>.

<a name="parts-azureservicehealthpart"></a>
## AzureServiceHealthPart

To use this part contact Ifeanyi Echeruo <ibiza-hubs@microsoft.com>.

<a name="parts-specpickerlistviewpart"></a>
## SpecPickerListViewPart

To use this part contact Sam Armstrong <ibiza-hubs@microsoft.com>.

<a name="parts-diagnosticstile"></a>
## DiagnosticsTile

To use this part contact Michael Flanakin <ibiza-hubs@microsoft.com>.

<a name="parts-feedbacktile"></a>
## FeedbackTile

To use this part contact Michael Flanakin <ibiza-hubs@microsoft.com>.

<a name="parts-whatsnewtile"></a>
## WhatsNewTile

To use this part contact Guruprasad Airy <ibiza-hubs@microsoft.com>.

<a name="parts-legaltermssubscriptionprogrammaticaccesstilepart"></a>
## LegalTermsSubscriptionProgrammaticAccessTilePart

INTERNAL - Do not use.

<a name="parts-gallerylauncherpart"></a>
## GalleryLauncherPart

DEPRECATED - Do not use. Legacy part. This part uses the old parameter collection API and is no
longer supported.

<a name="parts-browseresourcelistpart"></a>
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

<a name="parts-browseresourcelistpartwithcookie"></a>
## BrowseResourceListPartWithCookie

This part represents a BrowseResourceListPart with an additional cookie input.  Currently this is not used and is a
placeholder when custom data sources are added to browse V2.

<a name="parts-resourcegroupmappart"></a>
## ResourceGroupMapPart

This part represents a resource group map list part to be used on a blade.
This part is deprecated and the MapResourceGroupListPart should be used instead.

<a name="parts-resourcemappart"></a>
## ResourceMapPart

This part represents a resource map list part to be used on a blade.
This part is deprecated and the MapResourceGroupListPart should be used instead.
* See sample code file://%userprofile%/documents/PortalSDK/FrameworkPortal/Extensions/SamplesExtension/Extension/Client/ResourceTypes/Snowmobile/Snowmobile.pdl

<a name="parts-mapresourcegrouplistpart"></a>
## MapResourceGroupListPart

This part represents a resource group map list part to be used on a blade.  The inputs for this part include the 'id'
input which is the resource group ID or resource ID for the map.  This part can take either ID and produce the
resource group map list.

<a name="parts-browseservicelistpart"></a>
## BrowseServiceListPart

This part represents a browse V1 grid list.  The 'assetTypeId' input represents the extension and asset type for the
assets to be shown in the list.

<a name="parts-browseservicelistpartwithcookie"></a>
## BrowseServiceListPartWithCookie

This part represents a browse V1 grid list.  The 'assetTypeId' input represents the extension and asset type for the
assets to be shown in the list.  The 'cookie' input is an opaque cookie value that is passed directly to the browse
service view model when retrieving items.
* See sample code file://%userprofile%/documents/PortalSDK/FrameworkPortal/Extensions/SamplesExtension/Extension/Client/Hubs/BrowseReuse/BrowseReuse.pdl

<a name="blades"></a>
# Blades

<a name="blades-deployfromtemplateblade"></a>
## DeployFromTemplateBlade

To use this blade contact Guruprasad Airy <ibiza-hubs@microsoft.com>.

<a name="blades-templateeditorblade"></a>
## TemplateEditorBlade

To use this blade contact Guruprasad Airy <ibiza-hubs@microsoft.com>.

<a name="blades-parameterseditorblade"></a>
## ParametersEditorBlade

To use this blade contact Guruprasad Airy <ibiza-hubs@microsoft.com>.

<a name="blades-resourcegrouppickerv3blade"></a>
## ResourceGroupPickerV3Blade

To use this blade contact Guruprasad Airy <ibiza-hubs@microsoft.com>.

<a name="blades-subscriptionpickerv3blade"></a>
## SubscriptionPickerV3Blade

To use this blade contact Guruprasad Airy <ibiza-hubs@microsoft.com>.

<a name="blades-locationpickerv3blade"></a>
## LocationPickerV3Blade

To use this blade contact Guruprasad Airy <ibiza-hubs@microsoft.com>.

<a name="blades-settingsblade"></a>
## SettingsBlade

To use this blade contact Rachana Mhetre <ibiza-hubs@microsoft.com>.

<a name="blades-deploymentdetailsblade"></a>
## DeploymentDetailsBlade

To use this blade contact Guruprasad Airy <ibiza-hubs@microsoft.com>.

<a name="blades-resourcegroupmapblade"></a>
## ResourceGroupMapBlade

This blade is used to represent a resource group map standalone blade.  The 'id' input represents a resource group ID.
The blade will show the resource group map list for the resource group.

<a name="blades-browseresourceblade"></a>
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

<a name="blades-browseallresourcesblade"></a>
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

<a name="blades-browseallfilteredresourcesblade"></a>
## BrowseAllFilteredResourcesBlade

This blade represents a Browse V2 blade for all resource types with a pre-populated filter.  The 'scope' input is the
same as with the 'BrowseAllResourcesBlade' and the 'filter' input contains the initial text filter for the blade.

<a name="blades-browseresourcegroupblade"></a>
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

<a name="blades-mapresourcegroupblade"></a>
## MapResourceGroupBlade

This blade is used to represent a resource group map standalone blade.  The 'id' input represents a resource group ID
or a resource ID.  The blade will show the resource group map list for the resource group or the resource group for
the resource depending on input.

<a name="commands"></a>
# Commands

<a name="commands-moveresourcecommand"></a>
## MoveResourceCommand

To use this command contact Guruprasad Airy <ibiza-hubs@microsoft.com>.

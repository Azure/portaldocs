* [Sharing your PDE with other teams](#sharing-your-pde-with-other-teams)
* [Getting started with the Select Members Blade](#getting-started-with-the-select-members-blade)
* [What is the Select Member Blade?](#what-is-the-select-member-blade)
* [Downloading the PDE](#downloading-the-pde)
* [Example Collector](#example-collector)
* [PDL Changes](#pdl-changes)
* [Configuration Options](#configuration-options)
* [searchCriteria Values](#searchcriteria-values)
* [Pre-selecting Members](#pre-selecting-members)
* [Installation](#installation)
* [Consumption](#consumption)
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
    * [Installation](#commands-installation)
    * [Consumption](#commands-consumption)
    * [Getting started with Azure Monitoring](#commands-getting-started-with-azure-monitoring)
    * [Installation](#commands-installation)
    * [Consumption](#commands-consumption)


 <h1 name="portalfx-extension-sharing-pde"></h1>
  <h1 name="portalfx-pde-publish"></h1>
 <properties title="" pageTitle="Distributing a PDE using NuGet" description="" authors="nickha" />

<tags
    ms.service="portalfx"
    ms.workload="portalfx"
    ms.tgt_pltfrm="portalfx"
    ms.devlang="portalfx"
    ms.topic="distribute-pde"
    ms.date="04/18/2016"
    ms.author="nickha"/>    

<a name="sharing-your-pde-with-other-teams"></a>
## Sharing your PDE with other teams

The following guidelines have been created to ensure a consistent and easy to consume developer experience across all partner teams that need to share their PDE.

To share your PDE with other teams please follow these guidelines: 

- Create a NuGet
    
    - use the consistent naming convention Microsoft.Portal.Extensions.&lt;Name&gt;
    - the *.pde file is to be delivered under /Client/_extensions/&lt;Name&gt; 
  
    The following nuproj snippet can be used to customimze for your extensions NuGet creation. Most teams name it Microsoft.Portal.Extensions.&lt;Name&gt; to be consistent with the produced package name
    
    ```xml

    <?xml version="1.0" encoding="utf-8"?>
    <Project ToolsVersion="4.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <Import Project="$(EnvironmentConfig)" />
    
    <PropertyGroup>
        <Id>Microsoft.Portal.Extensions.Name</Id>
        <Title>Microsoft Portal Extension Name</Title>
        <Description>Provides the Microsoft Portal Name PDE</Description>
        <Summary>Provides the Microsoft Portal Name PDE</Summary>
        <Tags>Microsoft Azure Cloud Portal Framework Name  PDE</Tags>
    </PropertyGroup>
    
    <ItemGroup>
        <!-- update the following to pull the PDE from your official build-->
        <Content Include="$(RepoRoot)\src\SDK\Extensions\HubsExtension\TypeScript\HubsExtension\HubsExtension.pde">
        <TargetPath>Client\_extensions\Name</TargetPath>
        </Content>
        <!-- include an install.ps1 to both set appropriate build action on pde and to pop documents-->
        <File Include="$(REPOROOT)\RDPackages\NuGet\Microsoft.Portal.Extensions.Name\Install.ps1" >
        <TargetPath>Tools\Install.ps1</TargetPath>
        </File>
    </ItemGroup>
    <!-- update the following as needed aka.ms/onebranch -->
    <Import Project="$(PkgNuProj)\NuProj.Targets" />
    <Import Project="..\Portal.Common.NuGet.props" />
    <PropertyGroup>
        <GenerateSymbolPackage>false</GenerateSymbolPackage>
    </PropertyGroup>
    </Project>

    ```
    
- Include in the nuproj a Install.ps1 that will:

    - set the correct build action on PDE 
    - and open documentation on how to consume the exposed content.  

    Customize the following Install.ps1 script

    ```powershell

    param($installPath, $toolsPath, $package, $project)
    
    # set the build action for the pde to ExtensionResource
    $item = $project.ProjectItems.Item("Client").ProjectItems.Item("_extensions").ProjectItems.Item("Your Folder Name that nuproj puts the pde in").ProjectItems.Item("SomeExtension.pde") 
    $item.Properties.Item("ItemType").Value = "ExtensionReference"
    # open the documentation for consuming exposed content from the pde. use an aka.ms link so you can change out the target content without having to republish
    $DTE.ItemOperations.Navigate("http://aka.ms/portalfx/somepde")
    
    ```
 
- Now that the NuGet is created as part of your build you need to create a document for consuming the content exposed by the PDE

    - [Check your access to the doc repo portalfx-docs-pr](https://github.com/Azure/portalfx-docs-pr)
	
        - if you don’t have access follow the instructions [here](http://aka.ms/azuregithub) to enable 2FA on your github account and link your microsoft account
		- Then through [here](http://aka.ms/azuregithub) request access to portalfx-docs-pr

- The resulting NuGet is to be published from your official builds to [http://wanuget/Official/](http://wanuget/Official/). See OneBranch guidance to [publish your package](https://microsoft.sharepoint.com/teams/WAG/EngSys/Implement/OneBranch/Publish%20your%20package.aspx)
 <h1 name="portalfx-pde-adrbac"></h1>
 <properties title="" pageTitle="Using the Select Member Blade" description="" authors="admeyerms" />

<tags
    ms.service="portalfx"
    ms.workload="portalfx"
    ms.tgt_pltfrm="portalfx"
    ms.devlang="portalfx"
    ms.topic="select-members-usage-doc"
    ms.date="10/29/2015"
    ms.author="admeyerms"/>    

<a name="getting-started-with-the-select-members-blade"></a>
## Getting started with the Select Members Blade

<a name="what-is-the-select-member-blade"></a>
## What is the Select Member Blade?

The Select Member Blade is a tool intended to unify "member selection" scenarios across the portal by separating the process of selection from the action being taken on those members. This means the hosting extension will be responsible for making any changes to the back-end data after the members have been returned by the Select Member Blade. Note that currently, a "member" can refer to any User, Group, or Service Principal within the current tenant's context. The Select Member Blade is built using the ParameterCollection Framework v3.0. This means the Select Member Blade is a "provider" and that to use it, you will need to write a "collector" which calls it. An example of this can be found in the next section. To better understand the basics of how passing data with this framework works, see the examples of its usage in the Samples extension provided with the Azure SDK. 

![Select Member Blade](../media/portalfx-pde-aadrbac/SMBimg.PNG)

<a name="downloading-the-pde"></a>
## Downloading the PDE

The .pde you need to reference can be found by downloading the Microsoft.Portal.Extensions.AAD.nuget from \\\wanuget\nugetpackages\dev and extracting the contents. (the .pde will be found under /Content/_extensions/AAD)

<a name="example-collector"></a>
## Example Collector

    // This interface is used to define the inputs from the collector.
    export interface SelectMemberInputs {
        memberIds: KnockoutObservable<string>;
    }
  
    // This interface is used to define the config from the collector.
    export interface SelectMemberConfig {
        isSingleSelect: boolean;
        isInviteEnabled: boolean;
        searchCriteria: string[];
    }
  
    /**
     * This is an example of a command which calls into the select member blade
     */
    export class TestSelectMemberV3CommandViewModel extends MsPortalFx.ViewModels.OpenBladeCommand implements VMD.Contract {
       
      // collector
      public selectMemberCollector: MsPortalFx.ViewModels.ParameterCollector<SelectMemberInputs>;
      
      // inputs
      private _memberIds = ko.observable("");
      
      // configuration values
      private _isSingleSelect = ko.observable(true);
      private _isInviteEnabled = ko.observable(true);
      private _searchCriteria = ko.observableArray<string>([]);
  
      // blade parameter values (these are passed via the blade params, not via the PCv3 framework.)
      public title = "Choose Members";
      public subtitle = "Select Member Blade";
  
      constructor(_container: MsPortalFx.ViewModels.CommandContainerContract, initialState: any, dataContext: SharedArea.DataContext) {
          super(_container);
          this.icon(MsPortalFx.Base.Images.Polychromatic.Key());
          
          this.selectMemberCollector = new MsPortalFx.ViewModels.ParameterCollector<SelectMemberInputs>(_container, {
              supplyInitialData: () => {
                  return <SelectMemberInputs> {
                      // this is where you would pass in an array of pre-selected members, if you desire.
                      memberIds: ko.observable("")                  
                  };
              },
              receiveResult: (result: SelectMemberInputs) => {
                  // this is what will happen when the user finishes selecting members and the blade closes.
                  this._performActionOnMembers(result.memberIds());
              },
              supplyProviderConfig: () => {
                  return <SelectMemberConfig> {
                      isSingleSelect: this._isSingleSelect(),
                      isInviteEnabled: this._isInviteEnabled(),
                      searchCriteria: this._searchCriteria()
                  };
              }
          });
      }
  
      // normally, you would perform some action on the returned members here. In this example, just dump the payload into the log.
      private _performActionOnMembers(membersAsJson: string) {
          log.verbose(membersAsJson);
      }
  
      public onInputsSet(inputs: VMD.InputsContract): MsPortalFx.Base.Promise {
          // these inputs are coming from another part
          this._isSingleSelect(inputs.isSingleSelect);
          this._isInviteEnabled(inputs.isInviteEnabled);

          // remove all elements of the array
          this._searchCriteria = ko.observableArray<string>(["IncludeAllUsers", "IncludeOnlySecurityGroups", "ExcludeMSAUsers"]);
  
          return null;
      }
    }

<a name="pdl-changes"></a>
## PDL Changes

The following is an example of the PDL changes needed to use the blade. Note that "title" and "subtitle" will actually set 

the title and subtitle which appear on the selectMember blade.

```xml
<!--This is a test collector for the selectMemberv3 blade-->
    <Command Name ="TestSelectMemberV3Command"
             Kind ="Blade"
             Text ="{Resource testSelectMemberV3CommandTitle, Module=ClientResources}"
             ViewModel ="TestSelectMemberV3CommandViewModel">
      <BladeAction Blade ="{BladeReference SelectMemberV3, ExtensionName=Microsoft_Azure_AD}"
                   ParameterCollector ="selectMemberCollector">
        <BladeInput Parameter="title" Source="title" />
        <BladeInput Parameter="subtitle" Source="subtitle" />
      </BladeAction>
      <Property Name="isSingleSelect" Source="{PartProperty Part=SomeOtherPart, Property=isSingleSelect}"/>
      <Property Name="isInviteEnabled" Source="{PartProperty Part=SomeOtherPart, Property=isInviteEnabled}"/>
    </Command>
```

<a name="configuration-options"></a>
## Configuration Options

The Select Member Blade has several available options for configuration. 
- isSingleSelect: if true, only one member may be selected at a time. if false, multiple members may be selected (no limit)
- isInviteEnabled: if true, users may invite external users to the current tenant via a command button on the blade. If false, the command button will not be enabled, preventing this behavior.
- searchCriteria: this is an array of strings which are associated with various settings for the blade. The acceptable settings are listed in the next section. Note that these settings are cumulative, and as many can be applied as wanted.

<a name="searchcriteria-values"></a>
## searchCriteria Values

- IncludeAllUsers: this query includes all users (guest and non-guest users)
- IncludeOnlySecurityGroups: this query includes security groups
- IncludeServicePrincipals: this query includes service principals
- ExcludeMSAUsers: this query excludes MSA users (they will be disabled and not selectable)

<a name="pre-selecting-members"></a>
## Pre-selecting Members

Pre-selecting members allows you to indicate which members are already in the role for which you are selecting members. For example, if you are selecting an admin, you may want to indicate which members are already admins to avoid choosing them again. This is accomplished by passing a JSON-serialized array of strings in the collector's supplyInitialData function (see the example collector above). Each string in the array should contain the GUID of the User/Group/Service Principal which should be marked as pre-selected by the Select Member Blade.

 <h1 name="portalfx-pde-billing"></h1>
 <properties title="" pageTitle="Using the Billing PDE" description="" authors="nickha" />

<tags
    ms.service="portalfx"
    ms.workload="portalfx"
    ms.tgt_pltfrm="portalfx"
    ms.devlang="portalfx"
    ms.topic="pde-billing"
    ms.date="04/18/2016"
    ms.author="nickha"/>    

<a name="installation"></a>
## Installation

From nuget package manager console

```
Install-Package Microsoft.Portal.Extensions.Billing -Source https://msazure.pkgs.visualstudio.com/DefaultCollection/_packaging/Official/nuget/v3/index.json -Version <Version_Number>
```

*Note:* you will need to update the <Version_Number> with the latest version number from [here](https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.extensions.billing)

<a name="consumption"></a>
## Consumption

- No docs have been provided to auxdocs that detail consumption. In the interim please reach out to [Mayur Oberoi](mailto:mayuro@microsoft.com) or [Ruchi Chopra](mailto:ruchic@microsoft.com) for consumption guidelines.
 <h1 name="portalfx-hubsextension-pde"></h1>
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

 <h1 name="portalfx-pde-azureinsights"></h1>
 ## Getting started with Azure Insights

<a name="commands-installation"></a>
## Installation

From nuget package manager console

```
Install-Package Microsoft.Portal.Extensions.Insights -Source https://msazure.pkgs.visualstudio.com/DefaultCollection/_packaging/Official/nuget/v3/index.json -Version 5.10.0.43
```

*Note:* you will need to update the version snippet with the latest from [here](https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.extensions.insights)

<a name="commands-consumption"></a>
## Consumption

- ETA for the consumption docs is 8/12/2016. In the interim please reach out to [Ibiza Activity Logs](mailto:ibiza-activity-logs@microsoft.com) for consumption guidelines.
 <h1 name="portalfx-pde-monitoring"></h1>
 <properties title="" pageTitle="Getting started with Azure Monitoring" description="" authors="nagan" />

<tags
    ms.service="portalfx"
    ms.workload="portalfx"
    ms.tgt_pltfrm="portalfx"
    ms.devlang="portalfx"
    ms.topic="azure-monitoring-usage-doc"
    ms.date="05/24/2016"
    ms.author="nagan"/>    

<a name="commands-getting-started-with-azure-monitoring"></a>
## Getting started with Azure Monitoring

<a name="commands-installation"></a>
## Installation

From nuget package manager console

```
Install-Package Microsoft.Portal.Extensions.Monitoring -Source https://msazure.pkgs.visualstudio.com/DefaultCollection/_packaging/Official/nuget/v3/index.json -Version 1.0.26.0
```

*Note:* you will need to update the version snippet with the latest from [here](https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.extensions.monitoring)

<a name="commands-consumption"></a>
## Consumption

- ETA for the consumption docs is 8/12/2016. In the interim please reach out to Rajesh Ramabathiran rajram@microsoft.com;thompham@microsoft.com; for consumption guidelines.



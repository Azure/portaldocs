<properties title="" pageTitle="Gallery Package Development and Debugging" description="" authors="nickharris" />

<tags
	ms.service="portalfx"
	ms.workload="portalfx"
	ms.tgt_pltfrm="portalfx"
	ms.devlang="portalfx"
	ms.topic="get-started-article"
	ms.date="02/11/2016"
	ms.author="1store"/>	

{"gitdown": "include-file", "file": "./includes/gallery-header.md"}

# Gallery Package Development and Debugging

[This video](/portal-sdk/generated/index-videos.md#devtest-side-loading-gallery-packages-in-prod) demonstrates how to configure a Gallery Package for a F5 Debug Experience on localhost using Test in Prod

## How to test a Gallery Package with F5 Debug Experience using Test in Prod

1. Install the following two NuGet Packages onto your web project.   Note: The MSI ships with and sets up a package source in visual studio that will contain the NuGet packages. If using CoreXT see CoreXT specifics at end of file.
  1. Microsoft.Azure.Gallery.Common
  1. Microsoft.Azure.Gallery.AzureGalleryUtility
1.	By default the Microsoft.Azure.Gallery.AzureGalleryUtlity.targets, injected into your webprojects csproj, will look for your gallery package definition under your $(SolutionDir)/GalleryPackages.  Copy your gallery package(s) into $(SolutionDir)/GalleryPackages.  Create as many folders for as many gallery packages as you would like there.  The target will find them all.
1.	Build your solution to generate the *.azpkg files.
1.	Add the App_Data/GalleryPackages/*.azpkg folders and files to your solution.  On the *.azpkg files set the Build action to Content, Copy if newer.
1.	F5 your solution and side load your application using Test in Prod syntax.  
1.	Click into Marketplace and see your Side Loaded gallery package under Local Development.
That’s it, for those of you who are using CoreXT.  Here are a few gotchas.

## Testing in production

Gallery items can be uploaded to production behind a hide key or subscription GUID filter. Only users who specify the hide key via query parameter or have access to the subscription will see the package in Marketplace. Specify filters in your package's <a href="/documentation/articles/gallery-items">manifest</a>.
To access your item behind a hide key, pass the following query parameter when navigating to Portal:  ?microsoft_azure_marketplace_ItemHideKey=YOURHIDEKEY
Multiple hide keys can be used via a comma separated list: ?microsoft_azure_marketplace_ItemHideKey=KEY1,KEY2,KEY3

> [WACOM.NOTE] Hide keys and subscription filters are not to be used for flighting or beta features. It is for testing your package in production before going public.


## CoreXT considerations

1. If you do not check in your .sln file you can override the folder to search for gallery packages by defining
<GalleryPackagesSourceFolder /> in your web projects csproj anywhere prior to the import of Microsoft.Azure.Gallery.AzureGalleryUtility.targets

```  
<PropertyGroup>
    <GalleryPackagesSourceFolder>$(ProjectDir)GalleryPackages</GalleryPackagesSourceFolder>
  </PropertyGroup>
```

1. if you are using CoreXT simply updating the global package.config is not sufficient.  Microsoft.Azure.Gallery.AzureGalleryUtility injects a targets file into your csproj and Microsoft.Azure.Galllery.Common adds a reference to a required *.dll

```   
 <Reference Include="Microsoft.Azure.Gallery.Common">
      <HintPath$(PkgMicrosoft_Azure_Gallery_Common)\lib\net45\Microsoft.Azure.Gallery.Common.dll</HintPath>
  </Reference> 
  ...
  <Import Project="$(PkgMicrosoft_Azure_Gallery_Common)\build\Microsoft.Azure.Gallery.AzureGalleryUtility.targets"            Condition="Exists('$(PkgMicrosoft_Azure_Gallery_Common)\build\Microsoft.Azure.Gallery.AzureGalleryUtility.targets')" />
```

# Legacy OneBox Development approach
Steps to get package working in one box:

1. Copy package (*.azpkg) to the following locations
  1. "%USERPROFILE%\Documents\PortalSDK\FrameworkPortal\Extensions\HubsExtension\App_Data\Gallery"
  1. "%PROGRAMFILES(x86)%\Microsoft SDKs\PortalSDK\FrameworkPortal\Extensions\HubsExtension\App_Data\Gallery"
1. Launch portal and goto gallery blade.
1. Goto to the "local development" category.
1. You should see your package in both menu items.
 
For updates:

1. Overwrite the package file (in the above locations).
1. Goto the gallery -> local development UI (if UI already open just move away to another category and come back to see updates).


<a name="nuget-packages-for-extension-dependencies"></a>
# NuGet packages for Extension Dependencies

NuGet has been selected to provided a simple way to both deliver and update portal framework assemblies, tools, test framework and extension PDE files. All extensions created with the Visual Studio portal project template use many of the NuGet packages listed here.  To get started you will need a Package Source

<a name="nuget-packages-for-extension-dependencies-package-sources"></a>
## Package Sources

NuGet uses a package source to retrieve NuGet Packages.  The portal NuGet packages are not currently distributed on public nuget.org and as such have been made available from the following sources

- C:\Program Files (x86)\Microsoft SDKs\PortalSDK\Packages

	Until the sdk is made publicly available this is the prefered package source for external partners. The Portal.msi installs the NuGet packages to C:\Program Files (x86)\Microsoft SDKs\PortalSDK\Packages and sets up a package source named PortalSDK that can immediately be consumed from Visual Studio.

- [https://msblox.pkgs.visualstudio.com/DefaultCollection/_packaging/IbizaPortal/nuget/v3/index.json](https://msblox.pkgs.visualstudio.com/DefaultCollection/_packaging/IbizaPortal/nuget/v3/index.json)

	This is the prefered package source for internal partners.  NuGets that are delivered to this feed will match the latest bits deployed to production. Internal teams using onebox will need to ensure [https://msblox.pkgs.visualstudio.com/DefaultCollection/_packaging/IbizaPortal/nuget/v3/index.json) is listed as a package source within enlistmentroot\.config\corext*.config
    
  * Note that this feed requires Nuget v3+.  We recommend using [Nuget 3.3+](http://dist.nuget.org/index.html) with the [VSTS credential provider](https://www.visualstudio.com/en-us/docs/package/get-started/nuget/auth#vsts-credential-provider)
  * If you are using nuget v2, then you can use the following Nuget v2 url instead: https://msblox.pkgs.visualstudio.com/DefaultCollection/_packaging/IbizaPortal/nuget/v2.  You may be required to create a [Personal Access Token](https://www.visualstudio.com/en-us/docs/package/get-started/nuget/auth#personal-access-tokens) in order to get access.  
  * If you get an error about not being able to find the Microsoft.Azure.Gallery.Common nupkg dependency then please add the [WaNuget official](http://wanuget/Official/nuget) feed.  If you are unable to access to the feed then you will need to use the nupkg bundled in the Portal.msi.
  
<a name="nuget-packages-for-extension-dependencies-nuget-packages"></a>
## NuGet Packages

The following NuGet packages are available:

<a name="nuget-packages-for-extension-dependencies-nuget-packages-dev"></a>
### Dev

- **Microsoft.Portal.Framework**

	Delivers framework assemblies Microsoft.Portal.Azure.dll, Microsoft.Portal.Core.dll and Microsoft.Portal.Framework.dll

- **Microsoft.Portal.Security.AadCore**

	Delivers AAD module used for auth Microsoft.Portal.AadCore.dll

- **Microsoft.Portal.TypeMetadata**

	This nuget provides both runtime and compile time components that drive reflection-style features for the Azure Portal SDK.  This includes the compile time generation of C# model interfaces into TypeScript interfaces, and the injection of type information into the portal at runtime.

<a name="nuget-packages-for-extension-dependencies-nuget-packages-tools"></a>
### Tools

- **Microsoft.Portal.Tools**

	Delivers PDC, .target files, d.ts and TypeScript compiler.

- **Microsoft.Portal.Azure.Website**

	Provides the Authenticated Developer Portal Website with Hubs and Billing Extensions.

- **Microsoft.Portal.Azure.WebsiteNoAuth**

	Provides the Unauthenticated Developer Portal Website

- **Microsoft.Azure.Gallery.AzureGalleryUtility**

	Provides a utility to package, upload and update gallery marketplace items

<a name="nuget-packages-for-extension-dependencies-nuget-packages-test"></a>
### Test

- **Microsoft.Portal.TestFramework**

	Delivers the Portal TestFramework allowing you to UI based test cases with Selenium and Visual Studio - [to learn more about consuming the test framework see](https://auxdocs.azurewebsites.net/en-us/documentation/articles/portalfx-testing-ui-test-cases)

<a name="nuget-packages-for-extension-dependencies-pde-extensions"></a>
## PDE Extensions

See all available PDE's shipped as NuGet packages [here](portalfx.md#pde)

<a name="nuget-packages-for-extension-dependencies-sharing-your-extension-pde"></a>
## Sharing your extension PDE

To learn how to share your PDE using NuGet see the guidance [here](portalfx-pde-publish.md)


<a name="deploy"></a>
# Deploy
* [Deploy](#deploy)
    * [Overview](#deploy-overview)
        * [Portal](#deploy-overview-portal)
        * [Portal deployment schedule](#deploy-overview-portal-deployment-schedule)
    * [Before deploying extension](#deploy-before-deploying-extension)
        * [1. For extensions onboarding Ibiza: Enable/disable extensions](#deploy-before-deploying-extension-1-for-extensions-onboarding-ibiza-enable-disable-extensions)
        * [2. Extension "stamps"](#deploy-before-deploying-extension-2-extension-stamps)
        * [3. Understand extension runtime compatibility](#deploy-before-deploying-extension-3-understand-extension-runtime-compatibility)
    * [Deploying extension UI](#deploy-deploying-extension-ui)
    * [Deploying extension controllers](#deploy-deploying-extension-controllers)
    * [Legacy/DIY deployments](#deploy-legacy-diy-deployments)
    * [Resiliency and failover](#deploy-resiliency-and-failover)
    * [Extension Hosting Service](#deploy-extension-hosting-service)
        * [Onboarding](#deploy-extension-hosting-service-onboarding)
        * [Extract deployment artifacts as part of build](#deploy-extension-hosting-service-extract-deployment-artifacts-as-part-of-build)
        * [Running and Testing the extension](#deploy-extension-hosting-service-running-and-testing-the-extension)
        * [Config.json](#deploy-extension-hosting-service-config-json)
        * [How deployment using stages work](#deploy-extension-hosting-service-how-deployment-using-stages-work)
        * [Config.json Properties:](#deploy-extension-hosting-service-config-json-properties)
    * [stage(1-5):](#deploy-stage-1-5)
* [Steps needed to deploy using the hosting service](#steps-needed-to-deploy-using-the-hosting-service)
    * [Monitoring and Logging](#steps-needed-to-deploy-using-the-hosting-service-monitoring-and-logging)
    * [Monitoring](#steps-needed-to-deploy-using-the-hosting-service-monitoring)
    * [FAQ](#steps-needed-to-deploy-using-the-hosting-service-faq)
    * [Using the CDN](#steps-needed-to-deploy-using-the-hosting-service-using-the-cdn)
    * [Creating the CDN account](#steps-needed-to-deploy-using-the-hosting-service-creating-the-cdn-account)
    * [Configuring your CDN service](#steps-needed-to-deploy-using-the-hosting-service-configuring-your-cdn-service)
    * [Configuring your extension](#steps-needed-to-deploy-using-the-hosting-service-configuring-your-extension)
    * [Configuring the Prefix](#steps-needed-to-deploy-using-the-hosting-service-configuring-the-prefix)
    * [Reading the prefix from configuration](#steps-needed-to-deploy-using-the-hosting-service-reading-the-prefix-from-configuration)
    * [IIS / ASP.NET Configuration](#steps-needed-to-deploy-using-the-hosting-service-iis-asp-net-configuration)
    * [Invalidating content on the CDN](#steps-needed-to-deploy-using-the-hosting-service-invalidating-content-on-the-cdn)
    * [Configuring versioning of your Extensioon](#steps-needed-to-deploy-using-the-hosting-service-configuring-versioning-of-your-extensioon)
    * [Updating extensions](#steps-needed-to-deploy-using-the-hosting-service-updating-extensions)
    * [Implications of changing the version](#steps-needed-to-deploy-using-the-hosting-service-implications-of-changing-the-version)
    * [FAQ](#steps-needed-to-deploy-using-the-hosting-service-faq)


<a name="deploy-overview"></a>
## Overview

The Azure Portal uses a decentralized model of deployment that consists of several components that work together to
provide the end-to-end experience, each deployed to separate endpoints:

- **Portal** \- web application that hosts the shell
- **Extensions** \- each extension is a web application that is loaded by the portal
- **ARM** \- public API for Azure that accepts calls from the portal, Azure SDK, and command line
- **Resource providers** \- provide resource-specific APIs for management operations (e.g. read, write, delete)

![Portal / Extension architecture][deployment-architecture]

<a name="deploy-overview-portal"></a>
### Portal

The portal is deployed to all [public Azure regions](http://azure.microsoft.com/regions) and uses geographical
load-balancing via Azure Traffic Manager (using the "Performance" profile).
(For more information about Azure Traffic Manager, see their
[introduction](https://azure.microsoft.com/en-us/documentation/articles/traffic-manager-overview/).)

Deploying in this fashion means that users can take advantage of a server closer to them, reducing latency and improving
the overall experience of using the portal.

The portal also takes advantage of the [Azure CDN](https://azure.microsoft.com/en-us/documentation/articles/cdn-overview/)
for static resources (images, scripts, etc.). This shifts the location of the most-downloaded files even closer to the user.

<a name="deploy-overview-portal-deployment-schedule"></a>
### Portal deployment schedule

The portal is deployed continuously. On any given day, multiple bug fixes, new features, and API changes may be deployed
to production. When a new version of the portal is deployed to production, the corresponding version of the SDK is
automatically released to the [download center](downloads.md). The download center contains the change log for the given
release, including bug fixes, new features, and a log of breaking changes.

<a name="deploy-before-deploying-extension"></a>
## Before deploying extension

1. For extensions onboarding Ibiza: Enable/disable extensions
1. Extension "stamps"
1. Understand extension runtime compatibility

<a name="deploy-before-deploying-extension-1-for-extensions-onboarding-ibiza-enable-disable-extensions"></a>
### >
<li>For extensions onboarding Ibiza: Enable/disable extensions</li>
<

New extensions are disabled by default. This will hide the extension from users (it won't show up in the portal at all)
until it's ready for general use.

To temporarily enable a disabled extension (for your session only), add an extension override in the portal URL:
`https://portal.azure.com?Microsoft_Azure_DevTestLab=true` (where `Microsoft_Azure_DevTestLab` is the name of the
extension as registered with the portal). Conversely, you can temporarily disable an extension by setting it to `false`.

You can use temporary enablement in conjunction with a Gallery Item Hidekey (if you have one) to also temporarily show
your item in the "Create New" experience while your extension is enabled. Just combine the parameters. Following the
previous example, if your hidekey is `DevTestLabHidden`, then you can combine it with the above to produce a single URL
to enable both the extension and the Gallery item:
`https://portal.azure.com?Microsoft_Azure_DevTestLab=true&microsoft_azure_marketplace_ItemHideKey=DevTestLabHidden`.

To permanently enable an extension (e.g. if it's ready for general use), please contact the portal team.

<a name="deploy-before-deploying-extension-2-extension-stamps"></a>
### >
<li>Extension &quot;stamps&quot;</li>
<

Every extension can deploy one or more "stamps" based on their testing requirements. In Azure parlance, a "stamp" is an
instance of a service in a region. The "main" stamp is used for production and is the only one the portal will be
configured for. Additional stamps can be accessed using a URI format specified in extension config.

For example, this might be an extension configuration:

```json
{
    name: "Microsoft_Azure_DevTestLab",
    uri: "//main.devtest.ext.azure.com",
    uriFormat: "//{0}.devtest.ext.azure.com"
}
```

When users go to the portal, it will load the `Microsoft_Azure_DevTestLab` extension from the URL
`https://main.devtest.ext.azure.com` (the portal always uses HTTPS).

To use a secondary, test stamp, specify the `feature.canmodifystamps` flag in addition to a parameter matching the name
of your extension as registered in the portal. For instance,
`https://portal.azure.com?feature.canmodifystamps=true&Microsoft_Azure_DevTestLab=perf` would replace the `{0}` in the
`uriFormat` string with `perf` and attempt to load the extension from there (making the extension URL
`https://perf.devtest.ext.azure.com`). Note that you must specify the flag `feature.canmodifystamps=true` in order to
override the stamp.

<a name="deploy-before-deploying-extension-3-understand-extension-runtime-compatibility"></a>
### >
<li>Understand extension runtime compatibility</li>
<

Extensions do not need to be recompiled and redeployed with every release of the SDK.

**For SDK build 5.0.302.258 and later**
Extensions are guaranteed 120 days of *runtime* backward compatibility after deployment. This means that an extension
which is compiled against the build version 5.0.302.258 and later of the SDK will be valid for 120 days - at which point
the extension must be upgraded to continue functioning in production.

**For SDK build older than 5.0.302.258**
Extensions are guaranteed 90 days of *runtime* backward compatibility after deployment. This means that an extension
which is compiled against the build version older than 5.0.302.258 of the SDK will be valid for 90 days - at which point
the extension must be upgraded to continue functioning in production.

To upgrade an extension, the extension author must download the latest version of the SDK, fix any breaking compile-time
changes, and redeploy the extension.

<a name="deploy-deploying-extension-ui"></a>
## Deploying extension UI

[Deploying through Extension Hosting Service](portalfx-extension-hosting-service.md)

<a name="deploy-deploying-extension-controllers"></a>
## Deploying extension controllers

Each extension is responsible for deploying their controllers and setting up load-balancing across whatever regions
make sense.

We recommend that extensions deploy controllers broadly across all regions in an active-active configuration and use a
technology, such as [Azure Traffic Manager](https://azure.microsoft.com/en-us/documentation/articles/traffic-manager-overview/)
with a "Performance" profile, to direct the user to the server closest to them. This will give users the best
experience, especially if the extension communicates with an RP that is also deployed broadly across regions. (Since ARM
is deployed in every region, this means that that traffic for a user will stay entirely within one region, reducing
latency.)

<a name="deploy-legacy-diy-deployments"></a>
## Legacy/DIY deployments

If you choose to deploy extension UI through legacy / DIY deployments, make sure you understand that
1.	You will be responsible for deploying to all regions
1.	You will be responsible for deploying service to every new data center
1.	You will be responsible for MDS setup, upgrade, Security pack upgrade and other infrastructure tasks
1.	If you are planning to use CDN to serve extension UI then understand that when CDN goes down (and they do) then the fallback will be not pleasing to your users.
1.	You will be responsible for setting up Persistent storage so that users do not see reliability drop during extension deployment
1.	You will be responsible for setting up infrastructure to rollback in case of live-site issues
1.	You are signing up for on-call / live site rotation for deployment infrastructure.

Each extension is responsible for deploying both UI and Controllers as well as setting up load-balancing across whatever regions make sense.
In general, it is best to set up servers in every region. That said, there is some flexibility. If your content is primarily static and all of your controller access is ARM via CORS then CDN can work well. *** The caveat is that when the CDN goes down (and they do) then the fallback will be not pleasing to your users. ***

We recommend that extensions deploy  broadly across all regions in an active-active configuration and use a technology, such as [Azure Traffic Manager](https://azure.microsoft.com/en-us/documentation/articles/traffic-manager-overview/) with a "Performance" profile, to direct the user to the server closest to them. This will give users the best experience, especially if the extension communicates with an RP that is also deployed broadly across regions. (Since ARM is deployed in every region, this means that that traffic for a user will stay entirely within one region, reducing latency.)

We also recommend that extensions use a CDN, such as Azure CDN, to move the most commonly-downloaded resources as close to the end user as possible. For more information about using Azure CDN with extensions, see [Configuring CDN and understanding Extension Versioning](portalfx-cdn.md).

<a name="deploy-resiliency-and-failover"></a>
## Resiliency and failover

Having a presence in all geographies is important for good performance.
We see much higher latencies and reliability issues when servers are not geo-located with their users.
(For more tips, see the [performance page](portalfx-performance.md).)

In order to deploy to all regions:
1.	Use [Extension Hosting Service](portalfx-extension-hosting-service.md) to deploy UI
1.	Deploy Controllers to all regions

In general, it is best to set up servers in every region.
That said, there is some flexibility.
If your content is primarily static and all of your controller access is ARM via CORS then CDN can work well.
***The caveat is that when the CDN goes down (and they do) then the fallback will be not pleasing to your users.***

If you have controllers in your extension server, it depends on how they are used.
Usually messages across long distances suffer more from latency than throughput.
This means if you have a steady stream of data, such as uploading a file, the distance isn’t as noticeable as when you have lots of messages, such as individual calls to get status on lots of storage accounts.
In this example the upload step would be more of a "delay expected" moment that is infrequent where the status messages are needed right away and very often.
In the first case, you can probably get away with fewer servers, but in the second case geo-locating them will be very important.

[deployment-architecture]: ../media/portalfx-deployment/deployment.png

* [Deploy](#deploy)
    * [Overview](#deploy-overview)
        * [Portal](#deploy-overview-portal)
        * [Portal deployment schedule](#deploy-overview-portal-deployment-schedule)
    * [Before deploying extension](#deploy-before-deploying-extension)
        * [1. For extensions onboarding Ibiza: Enable/disable extensions](#deploy-before-deploying-extension-1-for-extensions-onboarding-ibiza-enable-disable-extensions)
        * [2. Extension "stamps"](#deploy-before-deploying-extension-2-extension-stamps)
        * [3. Understand extension runtime compatibility](#deploy-before-deploying-extension-3-understand-extension-runtime-compatibility)
    * [Deploying extension UI](#deploy-deploying-extension-ui)
    * [Deploying extension controllers](#deploy-deploying-extension-controllers)
    * [Legacy/DIY deployments](#deploy-legacy-diy-deployments)
    * [Resiliency and failover](#deploy-resiliency-and-failover)
    * [Extension Hosting Service](#deploy-extension-hosting-service)
        * [Onboarding](#deploy-extension-hosting-service-onboarding)
        * [Extract deployment artifacts as part of build](#deploy-extension-hosting-service-extract-deployment-artifacts-as-part-of-build)
        * [Running and Testing the extension](#deploy-extension-hosting-service-running-and-testing-the-extension)
        * [Config.json](#deploy-extension-hosting-service-config-json)
        * [How deployment using stages work](#deploy-extension-hosting-service-how-deployment-using-stages-work)
        * [Config.json Properties:](#deploy-extension-hosting-service-config-json-properties)
    * [stage(1-5):](#deploy-stage-1-5)
* [Steps needed to deploy using the hosting service](#steps-needed-to-deploy-using-the-hosting-service)
    * [Monitoring and Logging](#steps-needed-to-deploy-using-the-hosting-service-monitoring-and-logging)
    * [Monitoring](#steps-needed-to-deploy-using-the-hosting-service-monitoring)
    * [FAQ](#steps-needed-to-deploy-using-the-hosting-service-faq)
    * [Using the CDN](#steps-needed-to-deploy-using-the-hosting-service-using-the-cdn)
    * [Creating the CDN account](#steps-needed-to-deploy-using-the-hosting-service-creating-the-cdn-account)
    * [Configuring your CDN service](#steps-needed-to-deploy-using-the-hosting-service-configuring-your-cdn-service)
    * [Configuring your extension](#steps-needed-to-deploy-using-the-hosting-service-configuring-your-extension)
    * [Configuring the Prefix](#steps-needed-to-deploy-using-the-hosting-service-configuring-the-prefix)
    * [Reading the prefix from configuration](#steps-needed-to-deploy-using-the-hosting-service-reading-the-prefix-from-configuration)
    * [IIS / ASP.NET Configuration](#steps-needed-to-deploy-using-the-hosting-service-iis-asp-net-configuration)
    * [Invalidating content on the CDN](#steps-needed-to-deploy-using-the-hosting-service-invalidating-content-on-the-cdn)
    * [Configuring versioning of your Extensioon](#steps-needed-to-deploy-using-the-hosting-service-configuring-versioning-of-your-extensioon)
    * [Updating extensions](#steps-needed-to-deploy-using-the-hosting-service-updating-extensions)
    * [Implications of changing the version](#steps-needed-to-deploy-using-the-hosting-service-implications-of-changing-the-version)
    * [FAQ](#steps-needed-to-deploy-using-the-hosting-service-faq)


<a name="deploy-extension-hosting-service"></a>
## Extension Hosting Service

Teams deploying UI for extensions with the classic cloud service model typically have to invest significant time upfront to onboard to MDS, setup compliant deployments across all geo's, configure cdn, storage and implement caching optimizations in their extension, the Extension Host is designed to mitigate this cost.  Simply put, the Extension Hosting Service is designed to allow you to focus on building your extension not on deployment infrastructure.   

It does this by providing:

1. Simple Deployments and hosting out of the box that
    1. Safe Deployment
    1. Geodistributes the extension to all data centers
    1. CDN configured
    1. Use portal's MDS so no need to onboard to MDS
    1. Persistent caching, index page caching, manifest caching and all other optimizations that are implemented along the way.
1. Enhanced Monitoring
    1. Removes need for on call rotation for hosting specific issues as portal is now hosting. On call still required for dev code livesite issues
    1. We will provide full visibility into the health and activity for your extension
1. Reduced COGS
    1. No hosting COGS
    1. Reduced development cost – focus on building the domain specifics of your extension rather than spending time on figuring out deployment

<a name="deploy-extension-hosting-service-server-side-code"></a>
#### Server Side Code

If your extension has server-side code, you will need to do some pre-requisite work before on-boarding Extension Hosting service:
1.	In most cases Controllers are legacy and it is easy to get rid of Controllers. One advantage of getting rid of controllers is that all your Clients such Ibiza and powershell will now have consistent experience.
    In order to get rid of controllers you can follow either of these approach:
    1.	If the functionality is already available from another service
    1.	By Hosting serverside code within existing RP

1.	If getting rid of Controllers is not a short terms task, you can change the relative controller URLs to absolute URLS. 
    The Controllers will deploy a new server-only service that will be behind Traffic Manager.

    Here is a sample Code Flow: http://codeflow/Client/CodeFlow2010.application?server=http://codeflow/Services/DiscoveryService.svc&review=chanchak-40c91e05a8554d4fbda73f1aa98ae25b
    
    
<a name="deploy-extension-hosting-service-sdk-version"></a>
#### SDK Version
Use Portal SDK 5.0.302.454 or above

For the extension to be hostable by the hosting service some artifacts need to be generated at build time. Those artifacts will only be generated if using a recent SDK version.

<a name="deploy-extension-hosting-service-how-it-works"></a>
#### How it works
The hosting service consists of two components: 

* Content unbundler:
The content unbundler is a tool that can be run against the extension assemblies to extract static content and bundles. The tool will generate a folder with a name same as the extension version. The folder will contain all content required to serve the extension.
The tool can also generate a zip file of the content that has the name as the version of the extension. The hosting service runtime expects the content to be in a zip file.

* The Runtime: 
The runtime component of the hosting service is hosted inside an Azure Cloud Service. When an extension onboards, a publicly accessible endpoint is provided by the extension developer which will contain the contents that the hosting service should serve. For the hosting service to pick them up, it will look for a file called config.json that has a specific schema described below. The hosting service will download the config file, look into it to figure out which zip files it needs to download. There can be multiple versions of the extension referenced in config.json. The hosting service will download them and unpack them on the local disk. After it has successfully downloaded and expanded all versions of the extension referenced in config.json, it will write config.json to disk.
For performance reasons, once a version is downloaded, it will not be downloaded again. 

<a name="deploy-extension-hosting-service-onboarding"></a>
### Onboarding
Extensions that intend to use extension hosting service should publish the extracted deployment artifacts (zip file) that are generated during the build along with config.json to a public endpoint. 

Make sure that all the zip files and config.json are at the same level.

Once you have these files available on a public endpoint, file a request to register this endpoint using the following link:

<https://aka.ms/extension-hosting-service/onboarding>


<a name="deploy-extension-hosting-service-extract-deployment-artifacts-as-part-of-build"></a>
### Extract deployment artifacts as part of build

<a name="deploy-extension-hosting-service-extract-deployment-artifacts-as-part-of-build-content-unbundler"></a>
#### Content Unbundler
Install Microsoft.Portal.Tools.ContentUnbundler to your extensions webproject.csproj.  If you installed via Visual Studio, NuGet package manager or NuGet.exe it will automatically add the following target.  If using CoreXT global packages.config you will have to add the target to your .csproj manually 

```xml
<Import Project="$(PkgMicrosoft_Portal_Tools_ContentUnbundler)\build\Microsoft.Portal.Tools.ContentUnbundler.targets" />
```

<a name="deploy-extension-hosting-service-extract-deployment-artifacts-as-part-of-build-build-configuration"></a>
#### Build configuration
Override any of the default configuration items for your build environment

* _ContentUnbundlerSourceDirectory_: Defaults to $(OutputPath). This needs to be set to the directory of the build output of your web project that contains your web.config and /bin dir  
* _ContentUnbundlerOutputDirectory_: Defaults to $(OutputPath). This is the output directory content unbundler will place the unbundled content, under this directory ContentUnbundler will create a folder name HostingSvc.
* _ContentUnbundlerRunAfterTargets_: Defaults to AfterBuild. This is used to sequence when the RunContentUnbundler target will run.  The value of this property will be used to set the RunContentUnbundler targets AfterTargets property. 
* _ContentUnbundlerExtensionRoutePrefix_: The prefix name of your extension e.g scheduler that is supplied as part of onboarding to the extension host.
* _ContentUnbundlerZipOutput_: Defaults to false. set to true to zip the unbunduled output that can be used for deployment.
    
For example this is the customized configuration for scheduler extension in CoreXT

```xml
  <PropertyGroup>
    <ContentUnbundlerSourceDirectory>$(WebProjectOutputDir.Trim('\'))</ContentUnbundlerSourceDirectory>
    <ContentUnbundlerOutputDirectory>$(BinariesBuildTypeArchDirectory)\HostingSvc</ContentUnbundlerOutputDirectory>
    <ContentUnbundlerExtensionRoutePrefix>scheduler</ContentUnbundlerExtensionRoutePrefix>
    <ContentUnbundlerZipOutput>true</ContentUnbundlerZipOutput>
  </PropertyGroup>
```
Outside of CoreXT, the default settings in the targets file should work for most cases. The only property that needs to be overriden is ContentUnbundlerExtensionRoutePrefix 

```xml
  <PropertyGroup>
    <ContentUnbundlerExtensionRoutePrefix>scheduler</ContentUnbundlerExtensionRoutePrefix>
  </PropertyGroup>
```

<a name="deploy-extension-hosting-service-extract-deployment-artifacts-as-part-of-build-isdevelopmentmode"></a>
#### IsDevelopmentMode
Set IsDevelopmentMode to False for versioned builds 

The extension host requires deployments of your extension to be versioned. To ensure that the ContentUnbundler output is versioned set the  *.IsDevelopmentMode AppSetting in your web.config to false.

```xml
    <add key="Microsoft.Portal.Extensions.SchedulerExtension.ApplicationConfiguration.IsDevelopmentMode" value="false"/>
```

If you wish to achieve this only on release builds a [web.Release.config transform](http://go.microsoft.com/fwlink/?LinkId=125889) can be used.

<a name="deploy-extension-hosting-service-extract-deployment-artifacts-as-part-of-build-environment-specific-configuration-files"></a>
#### Environment specific configuration files

Environment configuration files server 2 purposes:

* Make the extension available in target environment
* Override settings for target environment

The environment specific configuration files need to follow these conventions

* The files need to be placed under **\Content\Config\**
* The file should be set as en EmbeddedResource, otherwise the file will not be included in the output that gets generated by the content unbundler.
* The files need to be named with the following convention: &lt;host&gt;.&lt;domain&gt;.json (e.g. portal.azure.com.json, ms.portal.azure.com.json)
* The more generic the domain name, the more environments it covers. For example, it's enough to have a portal.azure.com.json. It will work with all portal production environments i.e *.portal.azure.com.
* The file content is a json object with key/value pairs for settings to be overriden. If there are no settings that needs to be overridden, the file should contain an empty json object.

Example:

The portal framework expects the settings to be in the format of Microsoft.Azure.MyExtension.MySetting. The framework will propagate setting to the client in the format of mySetting. So to be able to provide a value for this setting, the config file should be something like

```xml
<add key="Microsoft.Azure.MyExtension.MySetting" value="myValue" />
```

The configuration file would like like:

```json
{
    "mySetting": "myValue"      
}
```

A configuration file should be provided for all the environments where the extension is expected to be loaded. Currently, the portal exists in the below environments:

* Dogfood: Host name is **df.onecloud.azure-test.net**. Configuration file name should be df.onecloud.azure-test.net.json
* Production: Production has 3 stamps
	1. RC 
	1. MPAC 
	1. PROD **portal.azure.com**
	
	One single configuration file is enough for all these 3 stamps. portal.azure.com.json will cover all 3 of them.
* Mooncake: Host name is **portal.azure.cn**. Configuration file name should be portal.azure.cn.json
* Blackforest: Host name is **portal.microsoftazure.de**. Configration file name should be portal.microsoftazure.de.json
* Fairfax: Host name is **portal.azure.us**. Configuration file name should be portal.azure.us.json

<a name="deploy-extension-hosting-service-extract-deployment-artifacts-as-part-of-build-speeding-up-dev-test-cycles-optional"></a>
#### Speeding up dev/test cycles (Optional)
The default F5 experience for extension development remains unchanged however with the addition of the ContentUnbundler target some teams perfer to optimize to only run it on official builds or when they set a flag to force it to run.  The following example demonstrates how the Azure Scheduler extension is doing this within CoreXT.

```xml
<PropertyGroup>
    <ForceUnbundler>false</ForceUnbundler>
</PropertyGroup>
<Import Project="$(PkgMicrosoft_Portal_Tools_ContentUnbundler)\build\Microsoft.Portal.Tools.ContentUnbundler.targets" 
        Condition="'$(IsOfficialBuild)' == 'true' Or '$(ForceUnbundler)' == 'true'" />
```

<a name="deploy-extension-hosting-service-running-and-testing-the-extension"></a>
### Running and Testing the extension
<a name="deploy-extension-hosting-service-running-and-testing-the-extension-deploying-an-extension-s-version-zip"></a>
#### Deploying an extension&#39;s version.zip

Deploying your extension using the hosting service is as simple as pushing a couple of files to a publicly accessible endpoint, the simplest being a storage account.

The zip file that is generated by the build needs to be pushed to a storage account along with a configuration file that the hosting service will use to determine what versions it needs to pull down and serve.

<a name="deploy-extension-hosting-service-config-json"></a>
### Config.json
In addition to the zip files, the hosting service expects a config file in the storage account. This config file is used to specify the versions that hosting service needs to download, process and serve.
The file should be called config.json and should have the below structure:

```json
    {
        "$version": "3",
        "stage1": "1.0.0.5",
        "stage2": "1.0.0.4",
        "stage3": "1.0.0.3",
        "stage4": "1.0.0.2",
        "stage5": "1.0.0.1",
        "friendName": "2.0.0.0"
    }
```

The configuration file gives extension owners the ability to deploy new versions of the extension using safe deployment practices.
Deployment can be done in stages. Each stage maps to one or more regions. The hosting service provides a default configuration for stages. In the future extension owners will be able to provide a custom stage definition.
Below is the default stage definition:
```json
    {
        "stage1": [
            "centraluseuap"
        ],
        "stage2": [
            "westcentralus"
        ],
        "stage3": [
            "southcentralus"
        ],
        "stage4": [
            "westus"
        ],
        "stage5": [
            "*"
        ],
        "$sequence": [
            "stage1",
            "stage2",
            "stage3",
            "stage4",
            "stage5"
        ]
    }
```

<a name="deploy-extension-hosting-service-how-deployment-using-stages-work"></a>
### How deployment using stages work
The stage definition defines what regions belong to which stages. Extension owners provide versions to be served for each of the stages in their config.json file.
When the portal requests an extension, it passes along the region of the portal that served the user.
The hosting service will read the region passed in by the portal, and uses it to figure out what stage it belongs to using the default stage definition.
It then uses config.json to find the version that maps to the stage and serve it.
For example, according to the config.json defined above, if region westcentralus is requested, version 1.0.0.4 will be served.

<a name="deploy-extension-hosting-service-config-json-properties"></a>
### Config.json Properties:

Property names in the Config.json are case sensitive.

<a name="deploy-extension-hosting-service-config-json-properties-version"></a>
#### $version:
This is the version of the current config.json schema. This should always have the value of 3.
<a name="deploy-stage-1-5"></a>
## stage(1-5):
The stages as defined by the default stage definition. The only required stage is stage5, which is the default stage for regions that do not belong to a specific stage.
If the default stage is not defined in config.json, the config file is considered invalid and will not be processed.

<a name="deploy-stage-1-5-friendly-names"></a>
#### Friendly Names
Any properties that appear in config.json that are not defined in the stage definition are considered friendly names. The friendly name should be alphanumeric. The friendly name allows you to load that specific version in the portal for testing purposes by using the extension feature flag.
In the example above, version 1.0.0.0 is the active version. To load version 1.0.3.0, it can be passed to the portal as below
https://portal.azure.com?feature.canmodifystamps=true&Microsoft_Azure_Scheduler=FriendlyName3


<a name="steps-needed-to-deploy-using-the-hosting-service"></a>
# Steps needed to deploy using the hosting service
1. Create a storage account  
    **Note** The deployment script provided only supports **ARM storage accounts**. However, the hosting service is agnostic of how the storage account was created and supports both Classic and ARM storage accounts.
1. Register the storage account with the hosting service
1. Deploy version.zip to storage account using the powershell
    * Deployment process is being updated
    * New deployment script to be provided soon

<a name="steps-needed-to-deploy-using-the-hosting-service-testing-an-extension-version"></a>
#### Testing an extension version

The extension in the Hosting Service will have a URL following this format
https://myextension.hosting.portal.azure.net/myextension

This URL can be used to side-load the extension and test it before making it active.

<a name="steps-needed-to-deploy-using-the-hosting-service-before-being-active-in-production"></a>
#### Before being active in Production
To test an extension loaded from the Hosting Service before it is live in Production, The following step is required:

* If the extension does not exist yet, register it in the Portal as inactive

```json
    {
        "name": "My_Extension_Name",
        "uri": "//myextension.hosting.portal.azure.net/myextension",
        "uriFormat": "//myextension.hosting.portal.azure.net/myextension/{0}",
        "disabled": true,
        ...
    },
```

* If the extension is already registered but being migrated to the hosting service, update the resitration in the portal

```json
    {
        "name": "My_Extension_Name",
        "uri": "//main.myextension.ext.azure.com/",
        "uriFormat": "//myextension.hosting.portal.azure.net/myextension/{0}",
        ...
    },
```

* If the extension is already hosted on the Hosting Service, there are no changes required to be able to side-load it.

<a name="steps-needed-to-deploy-using-the-hosting-service-side-loading-the-extension"></a>
#### Side-loading the extension
Any version of the extension deployed to the hosting service can then be loaded by using the following URL:
https://portal.azure.com?feature.canmodifystamps=true&my_extension_name=FriendlyName2

where FriendlyName2 can be replaced by any friendly name of the extension that is not yet active


<a name="steps-needed-to-deploy-using-the-hosting-service-making-an-extension-version-active"></a>
#### Making an extension version active
1. Using the same script as the one used for deploying, any version can be made active
    * Making a version active does not require a build or deployment
    * New deployment script to be provided soon
1. Viewing the active versions
    * The versions available in the Hosting Service can be seen by going to the following URL: http://hosting.portal.azure.net/api/diagnostics

<a name="steps-needed-to-deploy-using-the-hosting-service-monitoring-and-logging"></a>
### Monitoring and Logging
<a name="steps-needed-to-deploy-using-the-hosting-service-monitoring-and-logging-logging"></a>
#### Logging
 The portal provides a way for extensions to log to MDS using a feature that can be enabled in the extension.

 More information about the portal logging feature can be found here [https://auxdocs.azurewebsites.net/en-us/documentation/articles/portalfx-telemetry-logging](https://auxdocs.azurewebsites.net/en-us/documentation/articles/portalfx-telemetry-logging)

 The logs generated by the extension when this feature is enabled can be found in a couple of tables in the portal's MDS account

Trace Events

>https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/Azportal/databases/AzurePortal?query=ExtEvents%7Cwhere+PreciseTimeStamp%3Eago(10m)

>ExtEvents | where PreciseTimeStamp >ago(10m)

Telemetry Events


>https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/Azportal/databases/AzurePortal?query=ExtTelemetry%7Cwhere+PreciseTimeStamp%3Eago(10m)

>ExtTelemetry | where PreciseTimeStamp >ago(10m)

<a name="steps-needed-to-deploy-using-the-hosting-service-monitoring"></a>
### Monitoring
 There are two categories of issues that needs to be monitored for each extension and that partners can act on.

 * Portal loading and running the extension

    The portal already has alerts setup to notify extensions of when it fails to load the extension for any reason. More work is being done to monitor other issues like blade load failures and part load failures.

 * Hosting Service downloading and service the extension

    The hosting service will ping the endpoint where it expects to find the extension bits every minute. It will then download any new configurations and verions it finds. If it fails to download or process the downloaded files it log these as errors in its own MDS tables.
    We are working on setting up alerts and monitors for such issues. Currently we get notified if any errors or warnings are generated by the hosting service. 
    You can access the logs of the hosting service using the below link
    https://jarvis-west.dc.ad.msft.net/53731DA4

<a name="steps-needed-to-deploy-using-the-hosting-service-faq"></a>
### FAQ

<a name="steps-needed-to-deploy-using-the-hosting-service-faq-when-i-build-my-project-the-output-zip-is-called-hostingsvc-zip-rater-then-some-version-zip"></a>
#### When I build my project the output zip is called HostingSvc.zip rater then <some version>.zip

The primary cause of this issue is that your web.config appSetting for IsDevelopmentMode is true.  It needs to be set to `false`, most do this using a web.Release.config transform. For example

```xml
    <?xml version="1.0" encoding="utf-8"?>

    <!-- For more information on using web.config transformation visit http://go.microsoft.com/fwlink/?LinkId=125889 -->

    <configuration xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform">
      <appSettings>
        <!-- dont forget to ensure the Key is correct for your specific extension -->
        <add key="Microsoft.Portal.Extensions.Monitoring.ApplicationConfiguration.IsDevelopmentMode" value="false" xdt:Transform="SetAttributes" xdt:Locator="Match(key)"/>
      </appSettings>
    </configuration>

```

You can find more details on transforms [here](http://www.asp.net/mvc/overview/deployment/visual-studio-web-deployment/web-config-transformations)


<a name="steps-needed-to-deploy-using-the-hosting-service-using-the-cdn"></a>
### Using the CDN
Extension authors may choose to use a CDN to serve static images, scripts, and stylesheets. The Azure Portal SDK does not require the use of a CDN, or the use of a particular CDN. However, extensions served from Azure can take advantage of the built-in CDN capabilities in the SDK.

<a name="steps-needed-to-deploy-using-the-hosting-service-creating-the-cdn-account"></a>
### Creating the CDN account
Follow this guide to set up your CDN account:

<a href="http://www.windowsazure.com/en-us/documentation/articles/cdn-how-to-use/" target="_blank">http://www.windowsazure.com/en-us/documentation/articles/cdn-how-to-use/</a>

<a name="steps-needed-to-deploy-using-the-hosting-service-configuring-your-cdn-service"></a>
### Configuring your CDN service
After creating your CDN, there are a few options that need to be set.
- Make sure HTTP and HTTPS are enabled by clicking the "Enable HTTPS" command.
- Make sure query string status is enabled by clicking the "Enable Query String" command.

<a name="steps-needed-to-deploy-using-the-hosting-service-configuring-your-extension"></a>
### Configuring your extension
To take advantage of the CDN capabilities in the Portal SDK, there are a few pieces that must be configured.

<a name="steps-needed-to-deploy-using-the-hosting-service-configuring-the-prefix"></a>
### Configuring the Prefix
After setting up your CDN, you will receive a url which can be used to access your content. It will be in the form:

    //<MyCDNNamespace>.vo.msecnd.net/

This is the prefix for your CDN service. Your production service should be configured to use this prefix. In your local web.config, can set this with the following `appSetting`:

```xml
<add key="Microsoft.Portal.Extensions.SamplesExtension.ApplicationConfiguration.CdnPrefix" 
     value="//<MyCDNNamespace>.vo.msecnd.net/" />
```

Notice that neither `http` nor `https` are used in the url. This is important. It allows your page to request content based on the current protocol of the request. Oftentimes, this setting will be blank in web.config, and instead configured in a `cscfg` for a cloud service.

<a name="steps-needed-to-deploy-using-the-hosting-service-reading-the-prefix-from-configuration"></a>
### Reading the prefix from configuration

To read any FX configuration, you must have a class which inherits from `ApplicationContext`. This class needs to include a `CdnPrefix` property:

```
\SamplesExtension\Configuration\CustomApplicationContext.cs
```

```cs
[Export(typeof(ApplicationContext))]
internal class CustomApplicationContext : ApplicationContext
{
    private ApplicationConfiguration configuration;

    [ImportingConstructor]
    public CustomApplicationContext(ApplicationConfiguration configuration)
    {
        this.configuration = configuration;
    }

    public override bool IsDevelopmentMode
    {
        get
        {
            return this.configuration.IsDevelopmentMode;
        }
    }

    public override string CdnPrefix
    {
        get
        {
            return this.configuration.CdnPrefix;
        }
    }
}
```

This class will assign properties which are available in your `web.config` or `*.cscfg`. To read the values from those files, create a C# class which inherits from `ConfigurationSettings` and exports `ApplicationConfiguration`:

    \SamplesExtension\Configuration\ApplicationConfiguration.cs

```cs
[Export(typeof(ApplicationConfiguration))]
public class ApplicationConfiguration : ConfigurationSettings
{
    /// <summary>
    /// Gets a value indicating whether development mode is enabled.
	/// Development mode turns minification off
    /// </summary>
    /// <remarks>
	/// Development mode turns minification off. 
	/// It also disables any caching that be happening.
	/// </remarks>
    [ConfigurationSetting]
    public bool IsDevelopmentMode
    {
        get;
        private set;
    }

    /// <summary>
    /// Gets a value indicating a custom location where browser should 
	/// find cache-able content (rather than from the application itself).
    /// </summary>
    [ConfigurationSetting]
    public string CdnPrefix
    {
        get;
        private set;
    }
}
```

<a name="steps-needed-to-deploy-using-the-hosting-service-iis-asp-net-configuration"></a>
### IIS / ASP.NET Configuration
Files are pushed to the CDN using the following process:

- The browser makes a request to a given CDN-able address (ex: http://exampleCDN.vo.msecnd.net/Content/jquery.js).
- If the file is already cached on the CDN, it is returned.
- If the file is not cached, the CDN service *makes a request* to the origin server for the resource (ex: http://myextension.cloudapp.net/CDN/Content/jquery.js)
- The file is cached, and returned to the client.

To enable this workflow, the CDN must be able to make an HTTP request to your extension. This would normally not be an issue, but some CDNs will make an HTTP __1.0__ request. HTTP 1.0 technically does not support gzip/deflated content, so IIS does not enable compression by default. To turn this on, the `noCompressionForHttp10` setting in `<httpCompression>` must be set to `false`:

<a href="http://www.iis.net/configreference/system.webserver/httpcompression" target="_blank">http://www.iis.net/configreference/system.webserver/httpcompression</a>

The url used for the request is in the following form:

`http://myextension.cloudapp.net/CDN/Content/jquery.js`

The */CDN/* portion of this url is inserted after the host address, and before the rest of the route for requested content. The request handling code in the SDK automatically handles incoming requests of the form /CDN/Content/... and /Content/...   

<a name="steps-needed-to-deploy-using-the-hosting-service-invalidating-content-on-the-cdn"></a>
### Invalidating content on the CDN

- Amd Bundles are invalidated using a **hash** of the file content i.e https://hubs-s3-portal.azurecomcdn.net/AzureHubs/Content/Dynamic/AmdBundleDefinition_**83A1A15A39494B7BB1F704FDB5F32596D4498792**.js?root=*HubsExtension/ServicesHealth/ServicesHealthArea
- static content is invalidated using the **extension version** i.e  https://hubs-s3-portal.azurecomcdn.net/AzureHubs/Content/**5.0.202.7608987.150717-1541**/Images/HubsExtension/Tour_Tile_Background_Normal.png

When you release to ensure that users are served the latest static content, as opposed to stale content,  you need to configure versioning.

<a name="steps-needed-to-deploy-using-the-hosting-service-configuring-versioning-of-your-extensioon"></a>
### Configuring versioning of your Extensioon


<a name="steps-needed-to-deploy-using-the-hosting-service-updating-extensions"></a>
### Updating extensions

The portal shell relies on environment version for making runtime decisions, e.g.:

- invalidating cached manifests
- invalidating static content served indirectly via CDN or from directly from your extension

By default this value is populated based on the version attributes present in the extension assembly.
First the runtime tries to find the `AssemblyInformationalVersionAttribute` attribute and get the value from there.
If this attribute isn't defined in the assembly, the runtime searches for the `AssemblyFileVersion` attribute and gets the value from this attribute.
You can check the version of your extensions by typing in `window.fx.environment.version` in the browser console from the extension frame.

You should ensure that while building your extension assembly, the version number is correctly stamped and updated on every build. The assembly version is added to your assembly by specifying the assembly level attribute as shown below.

```cs
[assembly: System.Reflection.AssemblyFileVersion("5.0.0.56")]
[assembly: System.Reflection.AssemblyInformationalVersionAttribute("5.0.0.56 (COMPUTER.150701-1627)")]
```
You can also override this behavior by deriving from the `ApplicationContext` class and MEF-exporting the derived class as `[Export(typeof(ApplicationContext))]` and overriding the getter for the Version property on the class. If you do this, please ensure that the overridden getter returns a constant value for a specific build.

see [AssemblyVersionAttribute](https://msdn.microsoft.com/en-us/library/system.reflection.assemblyversionattribute(v=vs.110).aspx)
see [AssemblyInformationalVersionAttribute](https://msdn.microsoft.com/en-us/library/system.reflection.assemblyinformationalversionattribute(v=vs.110).aspx)
see (Azure internal teams only) [OneBranch versioning](https://microsoft.sharepoint.com/teams/WAG/EngSys/Implement/OneBranch/Version%20Properties.aspx)

Once configured content will be served directly from your extension, or via CDN if configured, using a URL segment such as /Content/<Version> e.g /Content/**5.0.0.56**/Scripts, Content/**5.0.0.56**/Images.

<a name="steps-needed-to-deploy-using-the-hosting-service-implications-of-changing-the-version"></a>
### Implications of changing the version

You should not introduce breaking changes in your server code (e.g. incompatibility between client and server code). Instead leave a compatibile version of the old code around on the server for a few days, monitor its usage to ensure that customers/browsers are no longer accessing it (i.e all users have switched to the newer version of your code - likely by refreshing the portal), and then delete the code.
This can easily be accomplished by making new controllers/methods instead of making breaking changes to existing ones.
If you do end up in a situation where you make a breaking change, users will likely see a broken experience until they reload the portal.
You will need to contact the portal team in order to find a way to get past this issue.


<a name="steps-needed-to-deploy-using-the-hosting-service-faq"></a>
### FAQ

- I am not seeing paths w/ versioning during debug.
    - Ensure IsDevelomentMode in your *.config is set to false



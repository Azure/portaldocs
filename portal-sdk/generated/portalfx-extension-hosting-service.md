* [Extension Hosting Service](#extension-hosting-service)
    * [Onboarding](#extension-hosting-service-onboarding)
    * [Extract deployment artifacts as part of build](#extension-hosting-service-extract-deployment-artifacts-as-part-of-build)
    * [Running and Testing the extension](#extension-hosting-service-running-and-testing-the-extension)
    * [Config.json](#extension-hosting-service-config-json)
    * [How deployment using stages work](#extension-hosting-service-how-deployment-using-stages-work)
    * [Config.json Properties:](#extension-hosting-service-config-json-properties)
* [stage(1-5):](#stage-1-5)
* [Steps needed to deploy using the hosting service](#steps-needed-to-deploy-using-the-hosting-service)
    * [Monitoring and Logging](#steps-needed-to-deploy-using-the-hosting-service-monitoring-and-logging)
    * [Monitoring](#steps-needed-to-deploy-using-the-hosting-service-monitoring)
    * [FAQ](#steps-needed-to-deploy-using-the-hosting-service-faq)


<a name="extension-hosting-service"></a>
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

<a name="extension-hosting-service-server-side-code"></a>
#### Server Side Code

If your extension has server-side code, you will need to do some pre-requisite work before on-boarding Extension Hosting service:
1.	In most cases Controllers are legacy and it is easy to get rid of Controllers. One advantage of getting rid of controllers is that all your Clients such Ibiza and powershell will now have consistent experience.
    In order to get rid of controllers you can follow either of these approach:
    1.	If the functionality is already available from another service
    1.	By Hosting serverside code within existing RP

1.	If getting rid of Controllers is not a short terms task, you can change the relative controller URLs to absolute URLS. 
    The Controllers will deploy a new server-only service that will be behind Traffic Manager.

    Here is a sample Code Flow: http://codeflow/Client/CodeFlow2010.application?server=http://codeflow/Services/DiscoveryService.svc&review=chanchak-40c91e05a8554d4fbda73f1aa98ae25b
    
    
<a name="extension-hosting-service-sdk-version"></a>
#### SDK Version
Use Portal SDK 5.0.302.454 or above

For the extension to be hostable by the hosting service some artifacts need to be generated at build time. Those artifacts will only be generated if using a recent SDK version.

<a name="extension-hosting-service-how-it-works"></a>
#### How it works
The hosting service consists of two components: 

* Content unbundler:
The content unbundler is a tool that can be run against the extension assemblies to extract static content and bundles. The tool will generate a folder with a name same as the extension version. The folder will contain all content required to serve the extension.
The tool can also generate a zip file of the content that has the name as the version of the extension. The hosting service runtime expects the content to be in a zip file.

* The Runtime: 
The runtime component of the hosting service is hosted inside an Azure Cloud Service. When an extension onboards, a publicly accessible endpoint is provided by the extension developer which will contain the contents that the hosting service should serve. For the hosting service to pick them up, it will look for a file called config.json that has a specific schema described below. The hosting service will download the config file, look into it to figure out which zip files it needs to download. There can be multiple versions of the extension referenced in config.json. The hosting service will download them and unpack them on the local disk. After it has successfully downloaded and expanded all versions of the extension referenced in config.json, it will write config.json to disk.
For performance reasons, once a version is downloaded, it will not be downloaded again. 

<a name="extension-hosting-service-onboarding"></a>
### Onboarding
Extensions that intend to use extension hosting service should publish the extracted deployment artifacts (zip file) that are generated during the build along with config.json to a public endpoint. 

Make sure that all the zip files and config.json are at the same level.

Once you have these files available on a public endpoint, file a request to register this endpoint using the following link:

<https://aka.ms/extension-hosting-service/onboarding>


<a name="extension-hosting-service-extract-deployment-artifacts-as-part-of-build"></a>
### Extract deployment artifacts as part of build

<a name="extension-hosting-service-extract-deployment-artifacts-as-part-of-build-content-unbundler"></a>
#### Content Unbundler
Install Microsoft.Portal.Tools.ContentUnbundler to your extensions webproject.csproj.  If you installed via Visual Studio, NuGet package manager or NuGet.exe it will automatically add the following target.  If using CoreXT global packages.config you will have to add the target to your .csproj manually 

```xml
<Import Project="$(PkgMicrosoft_Portal_Tools_ContentUnbundler)\build\Microsoft.Portal.Tools.ContentUnbundler.targets" />
```

<a name="extension-hosting-service-extract-deployment-artifacts-as-part-of-build-build-configuration"></a>
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

<a name="extension-hosting-service-extract-deployment-artifacts-as-part-of-build-isdevelopmentmode"></a>
#### IsDevelopmentMode
Set IsDevelopmentMode to False for versioned builds 

The extension host requires deployments of your extension to be versioned. To ensure that the ContentUnbundler output is versioned set the  *.IsDevelopmentMode AppSetting in your web.config to false.

```xml
    <add key="Microsoft.Portal.Extensions.SchedulerExtension.ApplicationConfiguration.IsDevelopmentMode" value="false"/>
```

If you wish to achieve this only on release builds a [web.Release.config transform](http://go.microsoft.com/fwlink/?LinkId=125889) can be used.

<a name="extension-hosting-service-extract-deployment-artifacts-as-part-of-build-environment-specific-configuration-files"></a>
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

<a name="extension-hosting-service-extract-deployment-artifacts-as-part-of-build-speeding-up-dev-test-cycles-optional"></a>
#### Speeding up dev/test cycles (Optional)
The default F5 experience for extension development remains unchanged however with the addition of the ContentUnbundler target some teams perfer to optimize to only run it on official builds or when they set a flag to force it to run.  The following example demonstrates how the Azure Scheduler extension is doing this within CoreXT.

```xml
<PropertyGroup>
    <ForceUnbundler>false</ForceUnbundler>
</PropertyGroup>
<Import Project="$(PkgMicrosoft_Portal_Tools_ContentUnbundler)\build\Microsoft.Portal.Tools.ContentUnbundler.targets" 
        Condition="'$(IsOfficialBuild)' == 'true' Or '$(ForceUnbundler)' == 'true'" />
```

<a name="extension-hosting-service-running-and-testing-the-extension"></a>
### Running and Testing the extension
<a name="extension-hosting-service-running-and-testing-the-extension-deploying-an-extension-s-version-zip"></a>
#### Deploying an extension&#39;s version.zip

Deploying your extension using the hosting service is as simple as pushing a couple of files to a publicly accessible endpoint, the simplest being a storage account.

The zip file that is generated by the build needs to be pushed to a storage account along with a configuration file that the hosting service will use to determine what versions it needs to pull down and serve.

<a name="extension-hosting-service-config-json"></a>
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

<a name="extension-hosting-service-how-deployment-using-stages-work"></a>
### How deployment using stages work
The stage definition defines what regions belong to which stages. Extension owners provide versions to be served for each of the stages in their config.json file.
When the portal requests an extension, it passes along the region of the portal that served the user.
The hosting service will read the region passed in by the portal, and uses it to figure out what stage it belongs to using the default stage definition.
It then uses config.json to find the version that maps to the stage and serve it.
For example, according to the config.json defined above, if region westcentralus is requested, version 1.0.0.4 will be served.

<a name="extension-hosting-service-config-json-properties"></a>
### Config.json Properties:

Property names in the Config.json are case sensitive.

<a name="extension-hosting-service-config-json-properties-version"></a>
#### $version:
This is the version of the current config.json schema. This should always have the value of 3.
<a name="stage-1-5"></a>
## stage(1-5):
The stages as defined by the default stage definition. The only required stage is stage5, which is the default stage for regions that do not belong to a specific stage.
If the default stage is not defined in config.json, the config file is considered invalid and will not be processed.

<a name="stage-1-5-friendly-names"></a>
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

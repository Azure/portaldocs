**NOTE**: The hosting service docs are being migrated to <https://eng.ms/docs/products/azure-portal-framework-ibizafx/deployments/top-extensions-hosting-service>. This document may be out of date.

<a name="extension-hosting-service"></a>
## Extension Hosting Service

Teams deploying UI for extensions with the self-host model typically have to invest significant time upfront to onboard to MDS, setup compliant deployments across all data centers, configure CDN, storage, and implement caching optimizations in their extension. The cost of setting up and maintaining this infrastructure can be high. By leveraging the extension hosting service, extension developers can host their extension UI in all data centers without investing heavily in the deployment infrastructure. This is the primary reason more than 50% of the extensions have decided to migrate from legacy DIY deployment to extension hosting service.

<a name="extension-hosting-service-why-use-extension-hosting-service"></a>
### Why use extension hosting service

1. Simple Deployments and hosting out of the box.
    - Safe Deployment
    - Geodistributes the extension to all data centers
    - Use portal's MDS so no need to onboard to MDS
    - Persistent caching, index page caching, manifest caching and all other optimizations that are implemented along the way.
    - Test multiple versions at once using friendly names.

1. Enhanced Monitoring
    - Removes need for on call rotation for hosting specific issues as portal is now hosting. On call is still required for dev code livesite issues.
    - We will provide full visibility into the health and activity for your extension.

1. Reduced COGS
    - No hosting COGS.
    - Reduced development cost – focus on building the domain specifics of your extension rather than spending time on figuring out deployment

<a name="extension-hosting-service-how-the-hosting-service-works"></a>
### How the Hosting Service works

This section provides a quick 30-sec overview of how you deploy an extension using the hosting service.

1. Microsoft.Portal.Tools.targets generates a zip that has all the static files in your extension that are required by the Extension Hosting Service.
1. You upload the zip file generated in Step #1 to a public read-only storage account owned by your team.
1. Hosting service polls the storage account, detects the new version and downloads the zip file in each data center within 30 minutes and starts serving the new version to customers around the world.

<a name="extension-hosting-service-step-by-step-onboarding"></a>
### Step-by-Step Onboarding

<a name="extension-hosting-service-step-by-step-onboarding-step-1-generate-hosting-service-versioned-zip-file"></a>
#### Step 1: Generate Hosting Service versioned zip file

When enabled the build will generate a zip file for the extension with a name same as the extension version. The zip will contain all content required to serve the extension.

Note: Legacy Content Unbundler steps can be found in [this document](top-extensions-hosting-service-legacy-contentunbundler.md)

<a name="extension-hosting-service-step-by-step-onboarding-step-1-generate-hosting-service-versioned-zip-file-build-configuration"></a>
##### Build configuration

 Microsoft.Portal.Tools.targets provides the following properties to control hosting service output generation.  The properties have default values that you can override in your Extension.csproj file to meet the needs of your extension.
- `HostingServiceCreateDeploymentArtifacts`: defaults is undefined. Set to  `true` to generate versioned hosting service zip file.
- `HostingServiceRoutePrefix`: Defaults to `$(MSBuildProjectName)`. The prefix name of your extension e.g scheduler that is supplied as part of onboarding to the extension host.
- `HostingServicePackageOutputRootDir`: Defaults to `$(OutDir)`. This is the output directory in which the build create a HostingSvc directory with generated zip file.

For example this is the customized configuration for playground extension in CoreXT

```xml
<PropertyGroup>
    <HostingServiceCreateDeploymentArtifacts>$(IsOfficialBuild)</HostingServiceCreateDeploymentArtifacts>
    <HostingServiceRoutePrefix>[YourExtensionNameInHostingService]<</HostingServiceRoutePrefix>
</PropertyGroup>
 ```
`[YourExtensionNameInHostingService]` should be replaced by an alphanumeric string that will be used when registering the extension in the hosting service. This string will be used to create the extension host name as well. Once the extension is registered in the hosting service, this value should not be changed.

Outside of CoreXT, you may want to set `HostingServiceCreateDeploymentArtifacts` to default to true as IsOfficialBuild will not be defined.  Note to change the output path of the build output use `HostingServiceCreateDeploymentArtifacts`.

**Note:** Ev2 deployment rollout spec generation is enabled by default. To control Ev2 generation  Microsoft.Portal.Tools.targets provides the following properties.

- `HostingServiceEv2ExportTemplates`: Defaults to `true`. When true will generate ev2 deployment artifacts to `HostingServiceEv2ServiceGroupRootSourceDir`.
- `HostingServiceEv2OutputRootDir`: Defaults to `$(HostingServicePackageOutputRootDir)`. Root directory where generated Ev2 Rollout specs will placed.
- `HostingServiceEv2ServiceGroupRootReplacementsFilePath`: Defaults to `$(MSBuildProjectDirectory)\ServiceGroupRootReplacements.json`.
- `HostingServiceEv2ServiceGroupRootSourceDir`: Defaults to `$(MSBuildThisFileDirectory)\Ev2\ServiceGroupRoot`. Use to change the default templates used for Ev2 spec generation.

#### Step 2: Configure Build Version

The zip file generated during the build should be named as `<ExtensionPageVersion>.zip`, where `<ExtensionPageVersion>` is the current version number of your build.

You will need to set up some MSBuild directives in your Extension.csproj to populate the ExtensionPageVersion MSBuild property. If you are on CoreXT, you can try the following lines of code.

```xml

  <Target Name="SetExtensionPageVersion"
          BeforeTargets="CompilePdl" >
    <PropertyGroup>
      <ExtensionPageVersion>$(BuildVersion).$([System.DateTime]::Now.ToString("yyMMdd-HHmm"))</ExtensionPageVersion>
    </PropertyGroup>
  </Target>

```

If you are using a build system other then CoreXT replace `$(BuildVersion)` with the variable your build solution uses for your build version.

#### Step 3: Update `IsDevelopmentMode` to `false`

IsDevelopment mode must be set to `false` to assign correct build version to the zip file.

Update `IsDevelopmentMode` in `web.config` to `false.`

```xml
    <add key="Microsoft.Portal.Extensions.<YourExtension>.ApplicationConfiguration.IsDevelopmentMode" value="false"/>
```

Here is an example of the monitoring extension -

```xml
    <add key="Microsoft.Portal.Extensions.MonitoringExtension.ApplicationConfiguration.IsDevelopmentMode" value="false"/>
```

If you wish to achieve this only on release builds a [`web.Release.config`](https://go.microsoft.com/fwlink/?LinkId=125889) transform can be used.

#### Step 4: Environment specific configuration files

In order to load your extension in specific environments, you will need to provide environment specific configuration files in the `[extension root]\Content\Config` directory.

**NOTE:**
- The files need to be placed under `[extension root]\Content\Config`.
- Each file should have its build action set to `Content`; otherwise, the file will not be included in the generated ZIP file.
- The files need to be named with the following convention: `[host].[domain].json` (e.g. `portal.azure.com.json`, `ms.portal.azure.com.json`).
- A `default.json` file is required. It will contain environment values that will be made available to the client.  `default.json` is common to all cloud specific configs.  If the same key is found in a cloud specific config, it will get overridden by the value from the cloud specific config.  If you are migrating off the old ContentUnbundler build process see [https://aka.ms/portalfx/removecuvideo](https://aka.ms/portalfx/removecuvideo) for detauls of how to author your `default.json`.

Here are example for each environment. For now, just add this empty file with a build action of content:
1. **Default** configuration file should be named `default.json`.

    ```xml
    <Content Include="Content\Config\default.json" />
    ```

1. **Dogfood:** Configuration file name should be `df.onecloud.azure-test.net.json`.

    ```xml
    <Content Include="Content\Config\df.onecloud.azure-test.net.json" />
    ```

1. **Production:** Configuration file name should be `portal.azure.com.json`.

    ```xml
    <Content Include="Content\Config\portal.azure.com.json" />
    ```

	Production environment has 3 stamps -

    1. RC - rc.portal.azure.com
    1. MPAC - ms.portal.azure.com
    1. PROD - portal.azure.com

	One single configuration file is enough for all three stamps; however, you can add additional configurations for each host if you want a specific configuration for each host.

    If you add a file named `ms.portal.azure.com.json`, for example, the settings in there will be used for MPAC. If that file does not exist, it will fall back to reading settings from `portal.azure.com.json`.

1. **Mooncake:** (portal.azure.cn) - Configuration file name should be `portal.azure.cn.json`.

    ```xml
    <Content Include="Content\Config\portal.azure.cn.json" />
    ```

1. **Fairfax:** (portal.azure.us) - Configuration file name should be `portal.azure.us.json`.

    ```xml
    <Content Include="Content\Config\portal.azure.us.json" />
    ```

Environment configuration files server 2 purposes -

1. Make the extension available in target environment. Override settings for target environment. If there are no settings that needs to be overridden, the file should contain an empty json object.

1. The file content is a json object with key/value pairs for settings to be overridden from default.json.

When the portal requests an extension, it passes the portal host name as a query string parameter to the extension. The hosting service reads this query string parameter and checks if the extension has provided a configuration file for that portal host name. If it does then the hosting service will load that file and will merge the settings defined in the file with the settings that are included in `Content\Config\default.json` file. If a file does not exist for the portal host name, the hosting service will respond with a 400 bad request response code.

##### Updating content of config file

The portal framework expects the settings to be in the format of `Microsoft.Azure.MyExtension.MySetting`. The framework will propagate setting to the client in the format of `mySetting`. So to be able to provide a value for this setting, the `web.config` file should be something like -

```xml
<add key="Microsoft.Azure.MyExtension.MySetting" value="myValue" />
```

The equivalent configuration file would like like:

```json
{
    "mySetting": "myValue"
}
```

For example, if you have backend controllers that you would like to call from the client, you would add a property to your `ApplicationConfiguration` C# class that is called `ControllerEndpoint`.

You can find more information about propagating configuration to the client where [here](/portal-sdk/generated/portalfx-load-configuration.md). Once you do that, you can provide a value to that property for each cloud by adding the property name in camel casing to the environment specific config file.

```json
{
   "controllerEndpoint":"https://mycontrollerendpoint.mybackendhostname.net"
}
```

#### Step 6: Upload safe deployment config

You will need to author this file.

- Property names in the `config.json` are case sensitive.
- File name `config.json` is case sensitive.

In addition to the zip files, the hosting service expects a config file in the storage account. This config file is used to specify the versions that hosting service needs to download, process and serve. The file should be called `config.json` and should have the below structure:

```json
{
    "$version": "3",
    "stage1": "1.0.0.5",
    "stage2": "1.0.0.4",
    "stage3": "1.0.0.3",
    "stage4": "1.0.0.2",
    "stage5": "1.0.0.1",
    "friendlyName": "2.0.0.0"
}
```

**`$version`:** This is a mandatory attribute and should always be defined in the `config.json`. This is the version of the current `config.json` schema. Hosting service requires extension developers to use the latest version i.e. 3.

**stage(1-5):** stage(1-5) are mandatory attributes and should always be defined in the `config.json` with a valid version number associated with it. Safe deployment requires that extensions should be rolled out to all data centers in a staged manner. Out of the box hosting service provides extension the capability to rollout extension in 5 stages. From extension developer's point of view the stages correspond to datacenters:

- stage1: "Virtual" stage (does not correspond to any real region - see note below)
- stage2: westcentralus
- stage3: southcentralus
- stage4: westus
- stage5: All other public azure regions

This essentially means that if a user request the extension to be loaded in portal, then, based on the nearest data center, portal will decide which version of extension to load. For example, based on the above mentioned `config.json` if a user from Central US region requests to load `Microsoft_Azue_MyExtension` then hosting service will load the stage 1 version i.e. 1.0.0.5 to the user. However, if a user from Singapore loads the extension then the user will be served 1.0.0.1 of the extension.

_Note on stage1:_ This used to be a stage for Central US EUAP, but since the portal no longer deploys there, this stage has no real region associated with it. Instead, you can use this region as part of your deployment verification by leveraging the "stage1" stamp name with some portal feature flags to test your changes before they are exposed to any users. E.g. https://canary.portal.azure.com?feature.canmodifystamps=true&YourExtensionName=stage1 (where `YourExtensionName` is the name of your extension).

**`$customStageDefinition`:** The hosting service provides a default rollout stages as described above. If those do not meet your requirements, you can modify them by supplying a custom stage definition file for your extension. To tell the hosting service that it should use a custom stage definition for your extension, set this property to true in your `config.json` file.

Once this property is set to true, the hosting service will expect that a json file with the name `stagedefinintion.json` exists in your storage account, and will try to fetch it.

For example, https://mybizaextensionprod.blob.core.windows.net/extension/stagedefinition.json

If the fetch fails for any reason, the hosting service will fail to sync the extension.

***`Custom stage definition file`***
The custom stage definition file is a json file that should conform to the below schema

```json
{
    "stagename":["array of ARM region names"],
    "allregionsstagename":["*"],
    "$sequence":["stagename","allregionsstagename"]
}
```
An example is the default stage definition that the hosting service provides

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
The $sequence property should be an array of strings that contain the stage names. This will dictate the order of the rollout. So for example, if the $sequence property is defined as ["myfirststage","mysecondstage","mythirdstage"], then when a new version is deployed, the version will go to the myfirststage stage, and so on.

Each array item defined in the $sequence array should correspond to a property with the same name in the JSON object. Each of those properties should be an array of ARM region names to which that stage maps to. For example, in the default stage definition, stage1 is defined as ["centraluseuap"].
The last item in the $sequence array should always be assigned an array of a single element that contains `*`. This means that when a version is assigned to the last stage, it is deployed to all Azure regions. For example, in the default stage definition provided by hosting service, stage5 is the last stage and has ["*"] as its value.

The stages defined in your `config.json` file should match the stage names defined in your `stagedefinition.json` file.


For national clouds, there are default stage definition defines only 2 stages as outlined below -

**Mooncake:**

- stage1: chinanorth
- stage2: All other mooncake regions

**Fairfax:**

- stage1: usgovcentral
- stage2: All other fairfax regions

In addition to the stages, you can add custom names to versions that you want to test but not serve to customers. We call them friendly names. You can define up to a 100 friendly names in the `config.json`. If more than 100 friendly names are defined in the config, the hosting service will fail to sync the extension and an IcM incident will be created against the owning team. Friendly names should point to valid versions of your extension, and those versions should exist in the storage account.

Each of the properties defined in your config (stages and friendly names) get a unique url that you can use to access the version that it points to. For example, to load the version that is in stage1 above, the url would be -

[https://myextension.hosting.portal.azure.net/myextension/stage1?l=en&trustedAuthority=portal.azure.com](https://myextension.hosting.portal.azure.net/myextension/stage1?l=en&trustedAuthority=portal.azure.com)

To load version 2.0.0.0 the url would be -

[https://myextension.hosting.portal.azure.net/myextension/friendlyname?l=en&trustedAuthority=portal.azure.com](https://myextension.hosting.portal.azure.net/myextension/friendlyname?l=en&trustedAuthority=portal.azure.com)

#### Step 6: Creating and configuration a storage account

Extensions that intend to use extension hosting service should publish the packaged deployment artifacts (zip file) that are generated during the build along with `config.json` to a public read only container in a storage account. Make sure that all the zip files and `config.json` are at the same level.

Since the hosting service requires a single storage account to hold all the extension deployment artifacts, this constitutes a single point of failure where if the storage account is down for any reason, the extension cannot be updated. To overcome this limitation, the storage team built a feature allowing storage account owners to fail over to a secondary region in case the primary region that hosts the storage account is down.

You can find more information about the feature and how to onboard here https://azure.microsoft.com/en-us/blog/account-failover-now-in-public-preview-for-azure-storage/

#### Step 7: Registering your extension with the hosting service

Once you have these files available on a public endpoint, file a request to register this endpoint using the following [link](https://aka.ms/extension-hosting-service/onboarding).

To onboard the extension, please provide the following information in the task:

1. Extension Name.

    For example, Microsoft_Azure_Test

1. Public read-only endpoint for Dogfood.

    For example, [https://mybizaextensiondf.blob.core.windows.net/extension](https://mybizaextensiondf.blob.core.windows.net/extension)

1. Public read-only endpoint for PROD.

    For example, [https://mybizaextensionprod.blob.core.windows.net/extension](https://mybizaextensionprod.blob.core.windows.net/extension)

Please submit your onboarding request [here](https://mybizaextensionprod.blob.core.windows.net/extension).

| Environment 	| SLA (in business days) 	|
|-------------	|------------------------	|
| DOGFOOD     	| 5 days                 	|
| MPAC        	| 7 days                 	|
| PROD        	| 12 days                	|
| FAIRFAX     	| 15 days                	|
| MOONCAKE    	| 15 days                	|

#### Step 8: Migrating extensions that use server side controllers

If your extension uses server side controllers, there is some extra work that needs to be done to make your extension ready for hosting in the hosting service.

1. In most cases Controllers are legacy and it is easy to get rid of Controllers. One advantage of getting rid of controllers is that all your clients such as Ibiza and powershell will now have a consistent experience. In order to get rid of controllers you can follow either of these approach:
    - If the functionality is already available from another service.
    - By Hosting serverside code within existing RP

1. If getting rid of Controllers is not a short terms task, you can deploy UI through hosting service by modifying the relative controller URLs used in client code to absolute URLS. [Here](https://msazure.visualstudio.com/One/_git/AzureUX-CloudServices/commit/ac183c0ec197de7c7fd3e1eee1f7b41eb5f2dc8b) is a sample Pull-request for cloud services extension. Post this code change, you can deploy the as a server-only service that will be behind Traffic Manager.


### Registering the extension in Azure Portal

To load your extension in Portal it must be registered in the portal config. More details on updating the portal config are [here](https://aka.ms/portalfx/onboarding).

### Moving from self-host deployment to the hosting service

To minimize the probability of regression, use the following procedure to migrate an extension from custom deployment to the hosting service.

1. Change the uri format to use the hosting service in the PROD environment. An example of a pull request for modifying the uriFormat parameter is located [here](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/c22b81463cab1d0c6b2c1abc803bc25fb2836aad?refName=refs%2Fheads%2Fdev).

    ```json
    {
        name: "Microsoft_Azure_MyExtension",
        uri: "//selfhost.net/myextension",
        uriFormat: "//myextension.hosting.portal.azure.net/myextension/{0}",
        feedbackEmail: "azureux-myextension@microsoft.com",
    }
    ```

1. Migrate your extension's configuration to hosting service format in dogfood: Example pull request for this change is located [here](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx/pullrequest/1606743?_a=overview) for Microsoft_Azure_AD extension.

    ```json
    {
        name: "Microsoft_Azure_MyExtension",
        hostingServiceName: "myextension",
        feedbackEmail: "azureux-myextension@microsoft.com",
    }
    ```

1. Make the same change for your production config into Portal's dev branch. This change will deploy to rc.portal.azure.com and ms.portal.azure.com automatically. Monitor these environments for any issues while it bakes there.

1. Once everything is stable, cherry-pick the changes to Portal's production branch to make the change live in production (portal.azure.com).

1. [Optional] Make the same changes in the various other clouds Fairfax, Mooncake, etc.

### Deploying a new version of an extension

If you are using safe deployment then it is likely that you want to rollout a new version to a specific stage.

1. If the version to be published is not in the storage account -
    - Push the .zip file to storage account registered with hosting service.
    - Update specific stage in config.json to this verion

1. If the version to be published is in the storage account -
    - Update specific stage in config.json to this verion

**NOTE:** Publishing a version to specific stage in safe deployment does not require a new build.

### Hosting Service diagnostics

The versions available in the Hosting Service can be seen by going to the following URL:

| Environment 	| Hosting Service URL                                                                                                            	|
|-------------	|--------------------------------------------------------------------------------------------------------------------------------	|
| DOGFOOD     	| [https://hosting.onecloud.azure-test.net/api/diagnostics](https://hosting.onecloud.azure-test.net/api/diagnostics)             	|
| MPAC        	| [https://ms.hosting.portal.azure.net/api/diagnostics](https://ms.hosting.portal.azure.net/api/diagnostics)                     	|
| PROD        	| [https://hosting.portal.azure.net/api/diagnostics](https://hosting.portal.azure.net/api/diagnostics)                           	|
| FAIRFAX     	| [https://hosting.azureportal.usgovcloudapi.net/api/diagnostics](https://hosting.azureportal.usgovcloudapi.net/api/diagnostics) 	|
| MOONCAKE    	| [https://hosting.azureportal.chinacloudapi.cn/api/diagnostics](https://hosting.azureportal.chinacloudapi.cn/api/diagnostics)   	|

Each extension gets its own diagnostics endpoint, by adding the extension name to the path before `/api`. For example - [https://hosting.portal.azure.net/myextension/api/diagnostics](https://hosting.portal.azure.net/myextension/api/diagnostics)

### Friendly names and sideloading

Friendly name allows you to test new versions of your extension before rolling them out to customers. You can side load the version associated with the friendly name in the portal by specifying a couple of feature flags. For example, in the config above, if you want to load version 2.0.0.0 in the portal, you could using the below url -

[https://portal.azure.com?feature.canmodifystamps=true&Microsoft_Azure_MyExtension=friendlyname](https://portal.azure.com?feature.canmodifystamps=true&Microsoft_Azure_MyExtension=friendlyname)

- `feature.canmodifystamps=true` is required for side-loading.
- replace `Microsoft_Azure_MyExtension` with unique name of extension defined in `extension.pdl`.

When those feature flags are passed to the portal, the portal will use the friendly name that is specified in the query string in combination with the value of the `uriFormat` property for that extension to generated a url that is unique for that friendly name.

For example, based on the portal url above and the uriFormat defined, the portal will use the below url to load the extension
`https://myextension.hosting.portal.azure.net/myextension/friendlyname?l=en&trustedAuthority=portal.azure.com&....`

### Monitoring

There are two categories of issues that needs to be monitored for each extension and that partners can act on.

 - Portal loading and running the extension - The portal already has alerts setup to notify extensions of when it fails to load the extension for any reason. More work is being done to monitor other issues like blade load failures and part load failures.

- Hosting Service downloading and service the extension - The hosting service will ping the endpoint where it expects to find the extension bits every minute. It will then download any new configurations and verions it finds. If it fails to download or process the downloaded files it log these as errors in its own MDS tables. We are working on setting up alerts and monitors for such issues. Currently we get notified if any errors or warnings are generated by the hosting service. You can access the logs of the hosting service using [this](https://jarvis-west.dc.ad.msft.net/53731DA4) link.

### Alerting

If the hosting service fails to sync an extension, an IcM incident will be created against the owning team. The hosting service could fail to sync an extension for multiple reasons.

- Storage account is unavailable
- `config.json` contains an invalid JSON object.
- Some versions that are referenced in `config.json` do not exist in the storage account.
- Validation for one or more versions failed during sync.

When you receive an incident, take a look at the error messages that appear in the log. If the error is caused by a change that you made, please fix the issue and wait for 15 minutes to give the hosting service time to pick up the new changes. If you think the error is related to the hosting service, route the incident back to our team.

If the error is caused by an outage (for example storage outage or datacenter outage), wait until the root cause incident is resolved and then resolve the incident that was created against your team.

### FAQ

**When I build my project the output zip is called HostingSvc.zip rater then <BUILD_VERSION>.zip.**

The primary cause of this issue is that your `web.config` appSetting for `IsDevelopmentMode` is true. It needs to be set to false, most do this using a `web.Release.config` transform. For example -

```xml
<?xml version="1.0" encoding="utf-8"?>
<!-- For more information on using web.config transformation visit https://go.microsoft.com/fwlink/?LinkId=125889 -->
    <configuration xmlns:xdt="http://schemas.microsoft.com/XML-Document-Transform">
        <appSettings>
            <!-- dont forget to ensure the Key is correct for your specific extension -->
        <add key="Microsoft.Portal.Extensions.Monitoring.ApplicationConfiguration.IsDevelopmentMode" value="false" xdt:Transform="SetAttributes" xdt:Locator="Match(key)"/>
        </appSettings>
    </configuration>
```

**How does hosting service serve my extension?**

The runtime component of the hosting service is hosted inside an Azure Cloud Service. When an extension onboards, a publicly accessible endpoint is provided by the extension developer which will contain the contents that the hosting service should serve. For the hosting service to pick them up, it will look for a file called config.json that has a specific schema described below. The hosting service will download the config file, look into it to figure out which zip files it needs to download. There can be multiple versions of the extension referenced in config.json. The hosting service will download them and unpack them on the local disk. After it has successfully downloaded and expanded all versions of the extension referenced in config.json, it will write config.json to disk. For performance reasons, once a version is downloaded, it will not be downloaded again.

**How much time does hosting service takes to rollout a new version of extension to the relevant stage?**

Hosting service takes about 30 minutes to publish the latest version to all DCs.

**Some customers of my extension are hitting the old UX even after deploying the latest package. Is there a bug in hosting service?**

No this is not a bug. All clients will not get the new version as soon as it gets deployed. The new version is only served when the customer refreshes the portal. We have seen customers that keep the portal open for long periods of time. In such scenarios, when customer loads the extension they are going to get the old version that has been cached. We have seen scenarios where customers did not refresh the portal for 2 weeks.


**What happens if instead of publishing new version to my storage account I replace the zip file?**

Hosting service will only serve the new versions of zip file. If you replace version `1.0.0.0.zip` with a new version of `1.0.0.0.zip` then hosting service will not detect. It is required that you publish new zip file with a different version number. For example `2.0.0.0.zip` and update `config.json` to reflect that hosting service should service new version of extension.

Sample config.json for version 2.0.0.0 -

```json
{
    "$version": "3",
    "stage1": "2.0.0.0",
    "stage2": "2.0.0.0",
    "stage3": "2.0.0.0",
    "stage4": "2.0.0.0",
    "stage5": "2.0.0.0",
}
```
NOTE: This samples depicts that all stages are serving version 2.0.0.0

**Do I need to register a new storage account everytime I need to upload zip file?**

No. Registering storage account with hosting service is one-time process. This enabled hosting service to know where to get the latest version of your extension.

**What happens if there is an outage in the region that hosts the storage account?**

If the region that hosts the storage account is experiencing an outage that is making the storage account inaccessible, the extension will not be impacted. The hosting service will continue serving content without any issues.

This will however prevent new versions of the extension from being deployed. The solution for this is to configure the storage account for manual failover. [Step 7: Creating and configuration a storage account](#Step-7:-Creating-and-configuration-a-storage-account) has more information on how to configure the storage account to allow for manual failover.

**How can I ask questions about hosting service?**

You can ask questions on Stackoverflow with the tag [`ibiza-deployment`](https://stackoverflow.microsoft.com/questions/tagged/ibiza-deployment).

**NOTE**: The hosting service docs are being migrated to <https://eng.ms/docs/products/azure-portal-framework-ibizafx/deployments/top-extensions-hosting-service-ev2> This document may be out of date.

<a name="ev2-integration-with-hosting-service"></a>
## Ev2 Integration with hosting service

**NOTE**: This section of the document assumes that the reader has reviewed the hosting service document located at [top-extensions-hosting-service.md](top-extensions-hosting-service.md).

**NOTE**: This section is only relevant to extension developers who are using OneBranch VSRM and Ev2 for deployment, or who plan to migrate to OneBranch VSRM and Ev2 for deployment.

If you are not familiar with OneBranch VSRM and Ev2, it is recommended that you read the documentation provided by their teams. If you have any questions about these systems please reach out to the respective teams.

* Onboard VSRM: [https://aka.ms/portalfx/vsrm](https://aka.ms/portalfx/vsrm)
* Onboard Express V2: [https://aka.ms/ev2](https://aka.ms/ev2)
* Migrate WARM to VSRM: [https://aka.ms/portalfx/warmmigratetovsrm](https://aka.ms/portalfx/warmmigratetovsrm)
* Onboard WARM (deprecated): [https://aka.ms/warm](https://aka.ms/warm)

<a name="ev2-integration-with-hosting-service-why-deploy-using-ev2"></a>
### Why deploy using Ev2
Deploying an extension with hosting requires extension developers to upload the zip file that was generated during the build to a  storage account that is read-only to the public.

Since Ev2 does not provide an API to upload the zip file, setting up the deployment infrastructure can become an unmanageable task. The deployment process is simplified  by leveraging the Ev2 extension that was developed by the Ibiza team. The Ev2 extension allows the upload of the zip file to a storage account in a way that is compliant.

<a name="ev2-integration-with-hosting-service-configuring-builds-for-ev2-based-deployments"></a>
### Configuring Builds for Ev2 based deployments

In the basic scenario Microsoft.Portal.Tools.targets will generate Ev2 templates. This includes the rollout spec, service model schema and parameter files. The procedure is as follows.

1. Configure Build

    Microsoft.Portal.Tools.targets provides the following properties to control hosting service output generation.  The properties have default values that you can override in your Extension.csproj file to meet the needs of your extension.

    - `HostingServiceCreateDeploymentArtifacts`: defaults is undefined. Set to  `true` to generate versioned hosting service zip file.
    - `HostingServiceRoutePrefix`: Defaults to `$(MSBuildProjectName)`. The prefix name of your extension e.g scheduler that is supplied as part of onboarding to the extension host.
    - `HostingServicePackageOutputRootDir`: Defaults to `$(OutDir)`. This is the output directory in which the build create a HostingSvc directory with generated zip file.
    - `HostingServiceEv2ExportTemplates`: Defaults to `true`. When true will generate ev2 deployment artifacts to `HostingServiceEv2ServiceGroupRootSourceDir`.
    - `HostingServiceEv2OutputRootDir`: Defaults to `$(HostingServicePackageOutputRootDir)`. Root directory where generated Ev2 Rollout specs will placed.
    - `HostingServiceEv2ServiceGroupRootReplacementsFilePath`: Defaults to `$(MSBuildProjectDirectory)\ServiceGroupRootReplacements.json`.
    - `HostingServiceEv2ServiceGroupRootSourceDir`: Defaults to `$(MSBuildThisFileDirectory)\Ev2\ServiceGroupRoot`. Use to change the default templates used for Ev2 spec generation.

    For example this is the customized configuration for playground extension in CoreXT

    ```xml
    <PropertyGroup>
        <HostingServiceCreateDeploymentArtifacts>$(IsOfficialBuild)</HostingServiceCreateDeploymentArtifacts>
        <HostingServiceRoutePrefix>[YourExtensionNameInHostingService]<</HostingServiceRoutePrefix>
        <HostingServiceEv2ExportTemplates>true</HostingServiceEv2ExportTemplates>
    </PropertyGroup>
    ```

    `[YourExtensionNameInHostingService]` should be replaced by an alphanumeric string that will be used when registering the extension in the hosting service. This string will be used to create the extension host name as well. Once the extension is registered in the hosting service, this value should not be changed.  Outside of CoreXT, you may want to set `HostingServiceCreateDeploymentArtifacts` to default to true as IsOfficialBuild will not be defined.  Note to change the output path of the built zip use `HostingServiceCreateDeploymentArtifacts`.  To change the outputpath of Generated Ev2Artifacts set `HostingServiceEv2OutputRootDir`.

1. Add a ServiceGroupRootReplacements.json file to the root of your project (right next to your web.config file).

    The `ServiceGroupRootReplacements.json` is a JSON file that defines few properties which are used to generate artifacts that can be used to deploy the extension using Ev2. You can define multiple objects in this file, each of those objects will map to an environment to which  you would like to deploy your extension. Below are the properties that should be added to those objects.

    **ServiceGroupRootReplacementsVersion**: The schema version of the json file. The current value is 3.

    **AzureSubscriptionId**: The Id of the subscription that contains the storage account.

    **CertKeyVaultUri**: The Key Vault uri that contains the certificate required by Ev2. This will require you to set up Key Vault.

    **ContactEmail**: The contact email of the extension owners.

    **TargetStorageCredentialsKeyVaultUri**: The Key Vault Uri that contains the storage account connection string, account key, or SASToken. This will require you to set up Key Vault.

    **StorageAccountCredentialsType**: The type of credential provided in the `TargetStorageCredentialsKeyVaultUri` property.  Valid values are "SASToken", "ConnectionString", or "AccountKey". A SASToken is the preferred type to use because it is a managed secret, meaning that Key Vault will manage the secret rotation.

    **TargetContainerName**: The name of the blob container to which to upload the zip files.

    **PortalExtensionName**: The name of the extension as it is registered in the portal, for example, `Microsoft_Azure_Compute`.

    **FriendlyNames**: A string array that contains friendly names that are managed.

    **MonitorDuration**: The time to wait between each stage of a deployment, specified in hours and days.  Also known as bake time.  The minimum allowed value is 30 minutes (PT30M).

    **SkipSafeDeployment**: A boolean value that will generate Ev2 templates that will allow you to deploy your extension without following the Safe Deployment Procedures. This is the type of deployment to use during a break-glass situation.

    **HotfixDeployment**: A boolean value that will generate Ev2 templates that will allow you to deploy your extension as a Hotfix.

    **HotfixMonitorDuration**: The time to wait between each stage of a hotfix deployment, specified in hours and days.  Also known as bake time.  The minimum allowed value is 30 minutes (PT30M).

    **LastKnownGoodSupport**: A boolean value that will generate Ev2 templates that will enable keeping track of the last two deployments that completed the SDP process. If **HotfixDeployment** is also enabled, the last two completed Hotfix deployments will also be tracked.

    **StagePreview**: A boolean value that will generate Ev2 templates that will enable flighting a different extension version in MPAC portal vs Production portal.

    Add `ServiceGroupRootReplacements.json` to the extension csproj, as in the following example.

    ```json
    <Content Include="ServiceGroupRootReplacements.json">
        <CopyToOutputDirectory>PreserveNewest</CopyToOutputDirectory>
    </Content>
    ```

    The following file is an example of a `ServiceGroupRootReplacements.json` file.

    ```json
    {
        "production": {
            "ServiceGroupRootReplacementsVersion": 3,
            "AzureSubscriptionId": "<SubscriptionId>",
            "CertKeyVaultUri": "https://sometest.vault.azure.net/secrets/PortalHostingServiceDeploymentCertificate",
            "StorageAccountCredentialsType": "<ConnectionString | AccountKey | SASToken>",
            "TargetStorageCredentialsKeyVaultUri": "<https://sometest.vault.azure.net/secrets/PortalHostingServiceStorageConnectionString | https://sometest.vault.azure.net/secrets/PortalHostingServiceStorageAccountKey | https://sometest.vault.azure.net/secrets/PortalHostingServiceStorage-SASToken>",
            "TargetContainerName": "hostingservice",
            "ContactEmail": "youremail@microsoft.com",
            "PortalExtensionName": "Microsoft_Azure_Monitoring",
            "FriendlyNames": [ "friendlyname_1", "friendlyname_2", "friendlyname_3" ]
        },
        "mooncake": {
            "ServiceGroupRootReplacementsVersion": 3,
            "AzureSubscriptionId": "<SubscriptionId>",
            "CertKeyVaultUri": "https://sometest.vault.azure.cn/secrets/PortalHostingServiceDeploymentCertificate",
            "StorageAccountCredentialsType": "<ConnectionString | AccountKey | SASToken>",
            "TargetStorageCredentialsKeyVaultUri": "<https://sometest.vault.azure.cn/secrets/PortalHostingServiceStorageConnectionString | https://sometest.vault.azure.cn/secrets/PortalHostingServiceStorageAccountKey | https://sometest.vault.azure.cn/secrets/PortalHostingServiceStorage-SASToken>",
            "TargetContainerName": "hostingservice",
            "ContactEmail": "youremail@microsoft.com",
            "PortalExtensionName": "Microsoft_Azure_Monitoring",
            "FriendlyNames": [ "friendlyname_1", "friendlyname_2", "friendlyname_3" ]
        }
    }
    ```

    Other environments that are supported:

    1. Test i.e. Dogfood

    1. Production

    1. Fairfax

    1. Mooncake

Note: If using a non standard path for ServiceGroupRootReplacements set build property `HostingServiceEv2ServiceGroupRootReplacementsFilePath` to the non standard location.  This already defaults toDefaults to `$(MSBuildProjectDirectory)\ServiceGroupRootReplacements.json`.

<a name="ev2-integration-with-hosting-service-configuring-key-vault"></a>
### Configuring Key Vault

The following procedure describes how to set up the Key Vault that is required by the  `ServiceGroupRootReplacements.json` file, as specified in [#configuring-builds-for-Ev2-based-deployments](#configuring-builds-for-Ev2-based-deployments).

1. Set up Key Vault

    During deployment, the zip file from the official build will be copied to the storage account that was provided when onboarding to the hosting service.  To do this, Ev2 and the hosting service needs two secrets:

    1. The certificate that Ev2 will use to call the hosting service to initate a deployment.

        **NOTE**: You can use any valid certificate as Hosting Service Ev2 extension ignores this certificate but it is still required by Ev2 itself. The extension is validated based on an allowed list of storage accounts and the storage credential you supply by using the   `PortalExtensionName`, `TargetStorageCredentialsKeyVaultUri` and `TargetContainerName` settings.

    2. The credentials to the target storage account where the extension will be deployed. This can be in the form of a SAS token, storage connection string, or account key.

1. Onboard to Key Vault

    The official guidance from Ev2 is located at [https://aka.ms/portalfx/ev2keyvault](https://aka.ms/portalfx/ev2keyvault). Environments that are supported are the Dogfood test environment and the Production environment. Follow the instructions to:

    1. Create a Key Vault.

    1. Grant Ev2 read access to your Key Vault via a compound identity.

    1. Create a Key Vault managed certificate.

    The storage secret can be implemented a few different ways. The recommended approach is to use a SAS token generated from a Key Vault Managed Storage Account. You can find instructions in the next section. Alternate unmanaged approaches are a storage connection string or an account key.

    ```
    The format of the storage connection string is the default form `DefaultEndpointsProtocol=https;AccountName={0};AccountKey={1};EndpointSuffix={3}`, which is the format provided from `portal.azure.com`.
    ```

1. Setup a Key Vault Managed Storage Account and SAS token

    You can find additional guidance and instructions at [https://aka.ms/portalfx/ev2keyvaultsastoken](https://aka.ms/portalfx/ev2keyvaultsastoken).

    ```
    PowerShell example

    $regenerationPeriod = [System.Timespan]::FromDays(365)

    Add-AzureKeyVaultManagedStorageAccount -VaultName $keyVaultName -AccountName $storageAccountName -AccountResourceId $storageAccount.Id -ActiveKeyName $storageAccountKey -RegenerationPeriod $regenerationPeriod

    $sctx = New-AzureStorageContext -StorageAccountName $storageAccountName -Protocol Https -StorageAccountKey $storageAccountKey

    $start = [System.DateTime]::Now.AddDays(-1)

    $end = [System.DateTime]::Now.AddMonths(1)

    $at = "sv=2018-03-28&ss=b&srt=sco&sp=rwl&se=2020-05-05T00:00:00Z&spr=https"

    $validityPeriod = [System.Timespan]::FromDays(10)

    Set-AzureKeyVaultManagedStorageSasDefinition -AccountName $storageAccountName -VaultName $keyVaultName -Name "Ev2DeploymentSas" -TemplateUri $at -SasType 'account' -ValidityPeriod $validityPeriod
    ```

<a name="ev2-integration-with-hosting-service-initiate-a-test-deployment"></a>
### Initiate a test deployment

You can quickly run a test deployment from a local build, previous to onboarding to WARM, by using the `New-AzureServiceRollout` commandlet.  Be sure that you are not testing in production, i.e, that the target storage account in the key vault that is being used is not the production storage account, and the **-RolloutInfra** switch is set to `Test`.  The following is an example of the PowerShell command.

```
New-AzureServiceRollout -ServiceGroupRoot E:\dev\vso\AzureUX-PortalFX\out\ServiceGroupRoot -RolloutSpec E:\dev\vso\AzureUX-PortalFX\out\ServiceGroupRoot\RolloutSpec.P1D.json -RolloutInfra Test -Verbose -WaitToComplete
```

Replace `\<RolloutSpec>` with the path to `RolloutSpec.P1D.json` in the build.

**NOTE**: The Ev2 Json templates perform either a 24-hour or a 6-hour rollout to each stage within the hosting service's safe deployment stages. Currently, the gating health check endpoint returns `true` in all cases, so really the check only provides a time gated rollout.  This means that you need to validate the health of the deployment in each stage, or cancel the deployment using the `Stop-AzureServiceRollout` command if something goes wrong. Once a stop is executed, you need to rollback the content to the previous version using the `New-AzureServiceRollout` command.  This document will be updated once health check rules are defined and enforced.  If you would like to implement your own health check endpoint you can customize the Ev2 json specs that are located in the NuGet.

To perform a production deployment as specified in [https://aka.ms/portalfx/howtodeploy](https://aka.ms/portalfx/howtodeploy), or deployment by using VSRM that is specified in [https://onebranch.visualstudio.com/onebranch/_wiki/wikis/OneBranch.wiki/936/Release](https://onebranch.visualstudio.com/onebranch/_wiki/wikis/OneBranch.wiki/936/Release), we assume that you have already onboarded to OneBranch VSRM. If not please see the OneBranch VSRM onboarding guidance located at [https://aka.ms/portalfx/vsrm](https://aka.ms/portalfx/vsrm).

For Ev2 specific questions please visit [https://ev2docs.azure.net](https://ev2docs.azure.net) or reach out to <a href="mailto:ev2sup@microsoft.com">ev2sup@microsoft.com</a>.

<a name="ev2-integration-with-hosting-service-what-output-is-generated"></a>
### What output is generated?

The preceding  configuration will result in a build output as required by Ev2 and the hosting service. The following  is a sample of the output that gets generated.

  ```
  out\retail-amd64\ServiceGroupRoot
  \HostingSvc\1.2.1.0.zip
  \buildver.txt
  \Production.RolloutSpec.PT6H.json
  \Production.RolloutSpec.P1D.json
  \Production.RolloutSpec.Stage1.json
  \Production.RolloutSpec.Stage2.json
  \Production.RolloutSpec.Stage3.json
  \Production.RolloutSpec.Stage4.json
  \Production.RolloutSpec.Stage5.json
  \Production.RolloutSpec.WithHealthCheck.Stage1.json
  \Production.RolloutSpec.WithHealthCheck.Stage2.json
  \Production.RolloutSpec.WithHealthCheck.Stage3.json
  \Production.RolloutSpec.WithHealthCheck.Stage4.json
  \Production.RolloutSpec.WithHealthCheck.Stage5.json
  \Production.RolloutSpec.HealthCheckOnly.json
  \Production.RolloutSpec.SetFriendlyName.friendlyname_1.json
  \Production.RolloutSpec.SetFriendlyName.friendlyname_2.json
  \Production.RolloutSpec.SetFriendlyName.friendlyname_3.json
  \Production.RolloutSpec.RemoveFriendlyName.friendlyname_1.json
  \Production.RolloutSpec.RemoveFriendlyName.friendlyname_2.json
  \Production.RolloutSpec.RemoveFriendlyName.friendlyname_3.json
      \Production\Production.ServiceModel.PT6H.json
      \Production\Production.ServiceModel.P1D.json
      \Production\Production.RolloutParameters.PT6H.json
      \Production\Production.RolloutParameters.P1D.json
      \Production\Production.ServiceModel.Stage1.json
      \Production\Production.ServiceModel.Stage2.json
      \Production\Production.ServiceModel.Stage3.json
      \Production\Production.ServiceModel.Stage4.json
      \Production\Production.ServiceModel.Stage5.json
      \Production\Production.ServiceModel.HealthCheckOnly.json
      \Production\Production.RolloutParameters.Stage1.json
      \Production\Production.RolloutParameters.Stage2.json
      \Production\Production.RolloutParameters.Stage3.json
      \Production\Production.RolloutParameters.Stage4.json
      \Production\Production.RolloutParameters.Stage5.json
      \Production\Production.RolloutParameters.HealthCheckOnly.json
      \Production\Production.RolloutParameters.WithHealthCheck.Stage1.json
      \Production\Production.RolloutParameters.WithHealthCheck.Stage2.json
      \Production\Production.RolloutParameters.WithHealthCheck.Stage3.json
      \Production\Production.RolloutParameters.WithHealthCheck.Stage4.json
      \Production\Production.RolloutParameters.WithHealthCheck.Stage5.json
      \Production\Production.ServiceModel.SetFriendlyName.friendlyname_1.json
      \Production\Production.ServiceModel.SetFriendlyName.friendlyname_2.json
      \Production\Production.ServiceModel.SetFriendlyName.friendlyname_3.json
      \Production\Production.RolloutParameters.SetFriendlyName.friendlyname_1.json
      \Production\Production.RolloutParameters.SetFriendlyName.friendlyname_2.json
      \Production\Production.RolloutParameters.SetFriendlyName.friendlyname_3.json
      \Production\Production.ServiceModel.RemoveFriendlyName.friendlyname_1.json
      \Production\Production.ServiceModel.RemoveFriendlyName.friendlyname_2.json
      \Production\Production.ServiceModel.RemoveFriendlyName.friendlyname_3.json
      \Production\Production.RolloutParameters.RemoveFriendlyName.friendlyname_1.json
      \Production\Production.RolloutParameters.RemoveFriendlyName.friendlyname_2.json
      \Production\Production.RolloutParameters.RemoveFriendlyName.friendlyname_3.json
  ```

<a name="ev2-integration-with-hosting-service-specify-ev2-bake-time"></a>
### Specify Ev2 bake time

The Ev2 template files that are shipped are now formatted to accept customized monitor durations, which is the time to wait between each stage of a deployment, also known as bake time. To accommodate this, the files have been renamed from `Blackforest.RolloutParameters.PT6H.json` to
`Blackforest.RolloutParameters.{MonitorDuration}.json`.

The monitor duration can be specified by updating the  `ServiceGroupRootReplacements.json` file to include a new array called "MonitorDuration", as in the following example.

  ```json
  {
      "production": {
          "ServiceGroupRootReplacementsVersion": 3,
          "AzureSubscriptionId": "<SubscriptionId>",
          "CertKeyVaultUri": "https://sometest.vault.azure.net/secrets/PortalHostingServiceDeploymentCertificate",
          "StorageAccountCredentialsType": "<ConnectionString | AccountKey | SASToken>",
          "TargetStorageCredentialsKeyVaultUri": "<https://sometest.vault.azure.net/secrets/PortalHostingServiceStorageConnectionString | https://sometest.vault.azure.net/secrets/PortalHostingServiceStorageAccountKey>",
          "TargetContainerName": "hostingservice",
          "ContactEmail": "youremail@microsoft.com",
          "PortalExtensionName": "Microsoft_Azure_Monitoring",
          "FriendlyNames": [ "friendlyname_1", "friendlyname_2", "friendlyname_3" ],
          "MonitorDuration": [ "PT30M", "PT1H" ],
      }
  }
  ```

If no monitor durations are specified, then the Ev2 generation will default to 6 hours (PT6H) and 1 day (P1D).

<a name="ev2-integration-with-hosting-service-last-known-good-support"></a>
### Last Known Good Support

The Ev2 templates support generating SDP and Hotfix deployment files that include Last Known Good (LKG) support. LKG support enables keeping track of the last two deployments that completed the SDP deployment process.

Enabling LKG support, along with HotfixDeployment, enables keeping track of the last two completed Hotfix deployments. Additionally, when LKG support is enabled, LKG Revert is supported.

LKG support is enabled by adding the key/value pair "LastKnownGoodSupport": "true"

More information about LKG and other improvements
[https://msit.microsoftstream.com/video/22893a4c-975c-4aed-b01e-bfd5c61e73b5?st=1065](https://msit.microsoftstream.com/video/22893a4c-975c-4aed-b01e-bfd5c61e73b5?st=1065)


**How does LKG work**

After final stage or hotfix deployment has satisfied the monitoring duration, the build is promoted to LastKnownGoodBuild / LastHotfixBuild.

If LastKnownGoodBuild or LastHotfixBuild has an existing value, this existing value (version) will be promoted (copied) to PreviousLastKnownGoodBuild / PreviousLastHotfixBuild.

**How does LKG Revert work**

LKG revert is a mechanism to quickly revert your extension version back to a previously known good verion without requiring a redeployment of the specific build. LKG Revert can revert all stages to the version from LastKnownGoodBuild, LastHotfixBuild, PreviousLastKnownGoodBuild, or PreviousLastHotfixBuild.

An LKG revert will update the stages sequentially with no delay between stages.

<a name="ev2-integration-with-hosting-service-skipping-safe-deployment"></a>
### Skipping safe deployment

Ev2 templates support generating deployment files that do not include a delay between stages.  This can be enabled by adding the key/value pair `"SkipSafeDeployment": "true" ` in the corresponding environment in the `ServiceGroupRootReplacements.json` file.  The following example adds the SkipSafeDeployment key/value pair to the extension named `Microsoft_MyExtension` in the **Production** environment.

  ```json
  {
      "production": {
          "ServiceGroupRootReplacementsVersion": 2,
          "AzureSubscriptionId": "<SubscriptionId>",
          "CertKeyVaultUri": "https://sometest.vault.azure.net/secrets/PortalHostingServiceDeploymentCertificate",
          "StorageAccountCredentialsType": "<ConnectionString | AccountKey | SASToken>",
          "TargetStorageCredentialsKeyVaultUri": "<https://sometest.vault.azure.net/secrets/PortalHostingServiceStorageConnectionString | https://sometest.vault.azure.net/secrets/PortalHostingServiceStorageAccountKey>",
          "TargetContainerName": "hostingservice",
          "ContactEmail": "youremail@microsoft.com",
          "PortalExtensionName": "Microsoft_Azure_Monitoring",
          "FriendlyNames": [ "friendlyname_1", "friendlyname_2", "friendlyname_3" ],
          "SkipSafeDeployment": "true"
      }
  }
  ```

<a name="ev2-integration-with-hosting-service-friendly-name-removal"></a>
### Friendly name removal

To remove a friendly name, just run an Ev2 deployment with the `Rolloutspec.RemoveFriendlyName.<friendlyName>.json` file.


<a name="ev2-integration-with-hosting-service-health-checks"></a>
### Health Checks

**NOTE**: The health check docs are being migrated to <https://eng.ms/docs/products/azure-portal-framework-ibizafx/deployments/health-checks>. This document may be out of date.

**What is a Health Check**

Health checks determine the health of your service to be either Healthy, Unhealthy, or Unknown. Ev2 templates support generating health checks for SDP and Hotfix deployment files, as well as deployment files that include Last Known Good (LKG). To learn more about health checks, refer to https://ev2docs.azure.net/features/service-artifacts/actions/health-checks/overview.html#how-health-checks-work.

**How to add a Health Check**

Health checks can be specified by adding the object `"MDMHealthResources"` in the corresponding environment in the `ServiceGroupRootReplacements.json` file. `"MDMHealthResources"` is a dictionary that maps deployment type to an array of `resourceType` names that match the Portal provided health checks resourceType's. When adding the list of specified health checks, note that the specified health check must match a `resourceType` in the list of Portal provided health checks. A `FormatException` will get thrown if a health check is specified that is not a supported health check.

**How to Specify the Deployment Type for a Health Check**

 Health checks can be specified for SDP, Hotfix, or both. The deployment types and health check names are not case sensitive.
 Defining health checks for SDP will add the specified health checks to artifacts that follow the naming convention: {Environment}.RolloutParameters.{MonitorDuration}.json, {Environment}.RolloutParameters.HealthCheckOnly.json, {Environment}.RolloutParameters.Stage{Number}.json, or {Environment}.RolloutParameters.SetFriendlyName.{Name}.json. Friendly Name and Stage specific health checks can be further modified. See the documentation below for more information on how to modify health checks for stages and friendly names.
 Defining health checks for Hotfix will add the specified health checks to artifacts that follow the naming convention {Environment}.RolloutParameters.HotfixDeployment.{MonitorDuration}.json.

**Choosing the Duration of the Health Check**

The `"MonitorTimeInMinutes"` is read from the `ServiceGroupRootReplacements.json` file as `"MonitorDuration"` or `"HotfixMonitorDuration"`, depending on the deployment type. If either `"MonitorDuration"` or `"HotfixMonitorDuration"` is not defined, the respective default values `["P1D", "PT6H"]` or `["PT6H"]` will be used.

**How to Specify the Extension Name and Version in Health Checks**

 Health checks are based on `Extension Version`, which is passed in as the `PageVersion`, and `"PortalExtensionName"`, which is defined in the `ServiceGroupRootReplacements.json` file.

**Choosing not to use Health Checks**

 If health checks are not defined in the `ServiceGroupRootReplacements.json` file, SDP and Hotfix deployment files will default to using the "EHSExtension" health check. Similarly, if health checks are only specified for either SDP or Hotfix in the `ServiceGroupRootReplacements.json` file, the missing deployment type will default to using the "EHSExtension" health check.

**Supported Health Checks**
The current list of Portal provided health checks can be found here: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=/src/SDK/tools/Ev2Generator/ServiceGroupRootTemplate/Deploy/SupportedHealthChecks.json. Currently, there are 21 supported health checks, including the EHSExtension health check. The description for each health check is as follows:

| Health Check Name | Description |
| ------------------ | ------- |
| Blade_90thLoadTime_LessThan4S_PT30M | Checks that the 90th percentile of blade loads are less than 4 seconds. The lookback period is 30 minutes.   |
| Blade_95thLoadTime_LessThan4S_PT30M | Checks that the 95th percentile of blade loads are less than 4 seconds. The lookback period is 30 minutes.   |
| Blade_99thLoadTime_LessThan4S_PT30M | Checks that the 99th percentile of blade loads are less than 4 seconds. The lookback period is 30 minutes.   |
| BladeLoad_90PercentSuccessRate_PT30M | Checks that the success rate of all blade loads is at least 90%. The lookback period is 30 minutes. |
| BladeLoad_95PercentSuccessRate_PT30M | Checks that the success rate of all blade loads is at least 95%. The lookback period is 30 minutes. |
| Blade_90thLoadTime_LessThan4S_PT24H | Checks that the 90th percentile of blade loads are less than 4 seconds. The lookback period is 24 hours.
| Blade_95thLoadTime_LessThan4S_PT24H | Checks that the 95th percentile of blade loads are less than 4 seconds. The lookback period is 24 hours.
| Blade_99thLoadTime_LessThan4S_PT24H | Checks that the 99th percentile of blade loads are less than 4 seconds. The lookback period is 24 hours.
| BladeLoad_90PercentSuccessRate_PT24H | Checks that the success rate of all blade loads is at least 90%. The lookback period is 24 hours.
| BladeLoad_95PercentSuccessRate_PT24H | Checks that the success rate of all blade loads is at least 95%. The lookback period is 24 hours.
| Extension_90thLoadTime_LessThan4S_PT30M | Checks that the 90th percentile of extension loads are less than 4 seconds. The lookback period is 30 minutes. |
| Extension_95thLoadTime_LessThan4S_PT30M | Checks that the 95th percentile of extension loads are less than 4 seconds. The lookback period is 30 minutes. |
| Extension_99thLoadTime_LessThan4S_PT30M | Checks that the 99th percentile of extension loads are less than 4 seconds. The lookback period is 30 minutes. |
| ExtensionLoad_90PercentSuccessRate_PT30M | Checks that the success rate of all extension loads is at least 90%. The lookback period is 30 minutes. |
| ExtensionLoad_95PercentSuccessRate_PT30M | Checks that the success rate of all extension loads is at least 95%. The lookback period is 30 minutes. |
| Extension_90thLoadTime_LessThan4S_PT24H | Checks that the 90th percentile of extension loads are less than 4 seconds. The lookback period is 24 hours.
| Extension_95thLoadTime_LessThan4S_PT24H | Checks that the 95th percentile of extension loads are less than 4 seconds. The lookback period is 24 hours.
| Extension_99thLoadTime_LessThan4S_PT24H | Checks that the 99th percentile of extension loads are less than 4 seconds. The lookback period is 24 hours.
| ExtensionLoad_90PercentSuccessRate_PT24H | Checks that the success rate of all extension loads is at least 90%. The lookback period is 24 hours.
| ExtensionLoad_95PercentSuccessRate_PT24H | Checks that the success rate of all extension loads is at least 95%. The lookback period is 24 hours.
| EHSExtension | Checks that the Portal has at least two extensions emitting metrics. The lookback period is 5 minutes. This monitor should always report healthy. |


The following sample ServiceGroupRootReplacement.json file adds the MDMHealthResources dictionary in the **Production** and **Mooncake** environments.

```json
{
    "Production": {
        "ServiceGroupRootReplacementsVersion": 3,
        "AzureSubscriptionId": "<SubscriptionId>",
        "CertKeyVaultUri": "https://sometest.vault.azure.net/secrets/PortalHostingServiceDeploymentCertificate",
        "StorageAccountCredentialsType": "<ConnectionString | AccountKey | SASToken>",
        "TargetStorageCredentialsKeyVaultUri": "<https://sometest.vault.azure.net/secrets/PortalHostingServiceStorageConnectionString | https://sometest.vault.azure.net/secrets/PortalHostingServiceStorageAccountKey | https://sometest.vault.azure.net/secrets/PortalHostingServiceStorage-SASToken>",
        "TargetContainerName": "hostingservice",
        "ContactEmail": "youremail@microsoft.com",
        "PortalExtensionName": "Microsoft_Azure_Monitoring",
        "FriendlyNames": [ "friendlyname_1", "friendlyname_2", "friendlyname_3" ],
        "MDMHealthResources":
        {
            "SDP" : [
                "EHSExtension" ,
                "Extension_90thLoadTime_LessThan4S_PT30M"
            ]
        }
    },
    "Mooncake": {
        "ServiceGroupRootReplacementsVersion": 3,
        "AzureSubscriptionId": "<SubscriptionId>",
        "CertKeyVaultUri": "https://sometest.vault.azure.cn/secrets/PortalHostingServiceDeploymentCertificate",
        "StorageAccountCredentialsType": "<ConnectionString | AccountKey | SASToken>",
        "TargetStorageCredentialsKeyVaultUri": "<https://sometest.vault.azure.cn/secrets/PortalHostingServiceStorageConnectionString | https://sometest.vault.azure.cn/secrets/PortalHostingServiceStorageAccountKey | https://sometest.vault.azure.cn/secrets/PortalHostingServiceStorage-SASToken>",
        "TargetContainerName": "hostingservice",
        "ContactEmail": "youremail@microsoft.com",
        "PortalExtensionName": "Microsoft_Azure_Monitoring",
        "FriendlyNames": [ "friendlyname_1", "friendlyname_2", "friendlyname_3" ],
        "HotfixDeployment": "true",
        "HotfixMonitorDurations" : [ "PT30M", "P1D" ],
        "MDMHealthResources":
        {
            "Hotfix": [
                "Blade_99thLoadTime_LessThan4S_PT30M" ,
                "ExtensionLoad_95PercentSuccessRate_PT30M"
            ],
            "SDP" : [
                "Extension_90thLoadTime_LessThan4S_PT30M" ,
                "Blade_95thLoadTime_LessThan4S_PT30M",
                "BladeLoad_90PercentSuccessRate_PT30M"
            ]
        }
    }
}
```

**Custom Health Checks**

**What are custom health checks?**

Custom health checks are partner defined health checks that are not part of the Portal provided health checks. Ev2 templates supports generating customized health checks for SDP and Hotfix deployment files, as well as for deployment files that include Last Known Good (LKG) support.

**How to add custom Health Checks**

The custom health check file can be defined by passing in the `HostingServiceEv2CustomHealthChecksDir` parameter. This parameter does not default to anything. Custom health checks can be specified the same way Portal provided health checks are. The array of specified health checks can be a mix of custom health checks and Portal provided health checks. A `FormatException` will get thrown if the specified health check is not a Portal provided or custom health check.

**How to Specify the Extension Name and Version in Custom Health Checks**

Similar to Portal provided health checks, custom health checks are based on `Extension Version`, which is passed in as the `PageVersion`, and `"PortalExtensionName"`, which is defined in the `ServiceGroupRootReplacements.json` file.

**How to Specify the dimensions for Custom Health Checks**

Custom health check dimensions can be defined by adding the `CustomHealthCheckReplacements` dictionary object to the `ServiceGroupRootReplacements.json` file. `CustomHealthCheckReplacements` are used to replace the dimensions in the custom health check file. For more information about Ev2 health checks, refer to https://ev2docs.azure.net/features/service-artifacts/actions/health-checks/geneva-health-check/mdmhealthcheck.html#health-resources.

The following sample custom health check file defines custom health checks from two different monitoring accounts:

```json
[
    {
        "monitoringAccountName": "Account_1",
        "healthResources": [
            {
                "resourceType" : "Custom_1",
                "dimensions":
                {
                    "extension_name" : "{PortalExtensionName}",
                    "extension_version" : "{ExtensionVersion}",
                    "dimension1": "{dimension1}",
                }
            }
        ]
    },
    {
        "monitoringAccountName": "Account_2",
        "healthResources": [
            {
                "resourceType" : "Custom_2",
                "dimensions":
                {
                    "dimension1": "{dimension1}",
                    "dimension2": "{dimension2}",
                }
            },
            {
                "resourceType" : "Custom_3",
                "dimensions":
                {
                    "dimension1": "{dimension1}",
                    "dimension2": "{dimension2}",
                    "dimension3": "{dimension3}"
                }
            }
        ]
    }
]
```
The following example adds the MDMHealthResources dictionary in the **Production** and **Mooncake** environments with custom health checks from the above example file. Additionally, dimensions from custom health checks are defined.

```json
{
    "Production": {
        "ServiceGroupRootReplacementsVersion": 3,
        "AzureSubscriptionId": "<SubscriptionId>",
        "CertKeyVaultUri": "https://sometest.vault.azure.net/secrets/PortalHostingServiceDeploymentCertificate",
        "StorageAccountCredentialsType": "<ConnectionString | AccountKey | SASToken>",
        "TargetStorageCredentialsKeyVaultUri": "<https://sometest.vault.azure.net/secrets/PortalHostingServiceStorageConnectionString | https://sometest.vault.azure.net/secrets/PortalHostingServiceStorageAccountKey | https://sometest.vault.azure.net/secrets/PortalHostingServiceStorage-SASToken>",
        "TargetContainerName": "hostingservice",
        "ContactEmail": "youremail@microsoft.com",
        "PortalExtensionName": "Microsoft_Azure_Monitoring",
        "FriendlyNames": [ "friendlyname_1", "friendlyname_2", "friendlyname_3" ],
        "MDMHealthResources":
        {
            "SDP" : [
                "EHSExtension" ,
                "Extension_90thLoadTime_LessThan4S_PT30M",
                "Custom_1",
                "Custom_3"
            ]
        },
        "CustomHealthCheckReplacements" :
        {
            "dimension1": "1",
            "dimension2": "2",
            "dimension3": "3"
        }
    },
    "Mooncake": {
        "ServiceGroupRootReplacementsVersion": 3,
        "AzureSubscriptionId": "<SubscriptionId>",
        "CertKeyVaultUri": "https://sometest.vault.azure.cn/secrets/PortalHostingServiceDeploymentCertificate",
        "StorageAccountCredentialsType": "<ConnectionString | AccountKey | SASToken>",
        "TargetStorageCredentialsKeyVaultUri": "<https://sometest.vault.azure.cn/secrets/PortalHostingServiceStorageConnectionString | https://sometest.vault.azure.cn/secrets/PortalHostingServiceStorageAccountKey | https://sometest.vault.azure.cn/secrets/PortalHostingServiceStorage-SASToken>",
        "TargetContainerName": "hostingservice",
        "ContactEmail": "youremail@microsoft.com",
        "PortalExtensionName": "Microsoft_Azure_Monitoring",
        "FriendlyNames": [ "friendlyname_1", "friendlyname_2", "friendlyname_3" ],
        "HotfixDeployment": "true",
        "HotfixMonitorDurations" : [ "PT30M", "P1D" ],
        "MDMHealthResources":
        {
            "Hotfix": [
                "Custom_2"
            ],
            "SDP" : [
                "Extension_90thLoadTime_LessThan4S_PT30M" ,
                "Blade_95thLoadTime_LessThan4S_PT30M"
            ]
        },
        "CustomHealthCheckReplacements" :
        {
            "dimension1": "a",
            "dimension2": "b"
        }
    }
}
```
In this example ServiceGroupRootReplacement.json file, we are defining replacements for both the **Mooncake** and **Production** environments. In **Production**, we are specifying health checks for SDP deployments. These health checks are a mix of custom health checks and Portal provided health checks. The two custom health checks that are specified (Custom_1 and Custom_3) are defined in the custom health check file. The values for the dimensions (dimension_1, dimension_2, and dimension_3) are specified as '1', '2', and '3' respectively for **Production** deployments. The dimension `extension_name` is specified as 'Microsoft_Azure_Monitoring' as determined in the ServiceGroupRootReplacements.json file under the `PortalExtensionName` parameter. The `extension_version` dimension is configured in your .csproj build file as the value of the GenerateEv2ContentTask parameter `ExtensionPageVersion`.

In **Mooncake**, we are specifying health checks for SDP and Hotfix deployments. The list of health checks for Hotfix contains custom health checks. The custom health check that is specified (Custom_2) is defined in the custom health check file. The values for the dimensions (dimension_1 and dimension_2) are specified as 'a' and 'b' respectively for **Mooncake** deployments.

**Health Checks for Stages**

**How to add health checks for all Stages**

As mentioned above, stage health checks can be specified by adding the object `"MDMHealthResources"` in the corresponding environment in the `ServiceGroupRootReplacements.json` file and specifying the wanted health checks under "SDP". Health Checks listed under SDP will be added to all {Environment}.RolloutParameters.Stage{Number}.json files. In the event that "SDP" health checks are defined and Stage specific health checks are defined, the Stage specific health checks will be used. "SDP" health checks are only used for stages in the event that a Stage specific health check has not been defined.

**How to specify a health check for a specific stage**

If you would like to add different health checks for specific stages, that can be done by modifying the `MDMHealthResources` dictionary in the `ServiceGroupRootReplacements.json` file. Simply add a key corresponding to the Stage number (ex. "Stage3") followed by a list of the health checks that should be added to that Stage. These health checks can be Supported Health Checks, Custom Health Checks, or a mix of both (as long as the custom health checks are defined correctly as explained above).

**Choosing not to use Health Checks in Stages**

You will notice that there are two different types of RolloutSpec's corresponding to each unique Environemnt and Stage. These RolloutSpec types are follow the naming convention {Environment}.RolloutSpec.WithHealthCheck.Stage{Number}.json, and {Environment}.RolloutSpec.Stage{Number}.json. The "WithHealthCheck" RolloutSpec include actions that deploy the Extension, and then run the health check. The RolloutSpec without the mention of "HealthCheck" only deploys the Extension. There is also one "HealthCheckOnly" RolloutSpec per environment that does not deploy an Extension and only runs the health check defined under SDP in the `"MDMHealthResources"` dictionary.

**Health Checks for Friendly Names**

**How to add health checks for a Friendly Name**

Friendly Name health checks can be specified by adding the object `"MDMHealthResources"` in the corresponding environment in the `ServiceGroupRootReplacements.json` file and specifying the wanted health checks under "SDP". Health Checks listed under SDP will be added to all {Environment}.RolloutParameters.SetFriendlyName.{Name}.json files. In the event that "SDP" health checks are defined and Friendly Name specific health checks are defined, the Friendly Name specific health checks will be used. "SDP" health checks are only used for friendly names in the event that a Friendly Name specific health check has not been defined.

**How to specify a health check for a specific stage**

If you would like to add different health checks for specific friendly names, that can be done by modifying the `MDMHealthResources` dictionary in the `ServiceGroupRootReplacements.json` file. Simply add a key corresponding to the Friendly Name (ex. "friendlyname_1") followed by a list of the health checks that should be added to that Friendly Name. These health checks can be Supported Health Checks, Custom Health Checks, or a mix of both (as long as the custom health checks are defined correctly as explained above).

**Choosing not to use Health Checks in Stages**

You will notice that there are two different types of RolloutSpec's corresponding to each unique Environemnt and Friendly Name. These RolloutSpec types are follow the naming convention {Environment}.RolloutSpec.WithHealthCheck.SetFriendlyName.{Name}.json, and {Environment}.RolloutSpec.SetFriendlyName.{Name}.json. The "WithHealthCheck" RolloutSpec include actions that deploy the Extension, and then run the health check. The RolloutSpec without the mention of "HealthCheck" only deploys the Extension.

The following example adds the MDMHealthResources dictionary in the **Production** and **Mooncake** environments with Stage specific health checks and Friendly Name specific health checks. The custom health checks are as defined in the previous CustomHealthCheck.json example file.

```json
{
    "Production": {
        "ServiceGroupRootReplacementsVersion": 3,
        "AzureSubscriptionId": "<SubscriptionId>",
        "CertKeyVaultUri": "https://sometest.vault.azure.net/secrets/PortalHostingServiceDeploymentCertificate",
        "StorageAccountCredentialsType": "<ConnectionString | AccountKey | SASToken>",
        "TargetStorageCredentialsKeyVaultUri": "<https://sometest.vault.azure.net/secrets/PortalHostingServiceStorageConnectionString | https://sometest.vault.azure.net/secrets/PortalHostingServiceStorageAccountKey | https://sometest.vault.azure.net/secrets/PortalHostingServiceStorage-SASToken>",
        "TargetContainerName": "hostingservice",
        "ContactEmail": "youremail@microsoft.com",
        "PortalExtensionName": "Microsoft_Azure_Monitoring",
        "FriendlyNames": [ "friendlyname_1", "friendlyname_2", "friendlyname_3" ],
        "MDMHealthResources":
        {
            "SDP" : [
                "EHSExtension" ,
                "Extension_90thLoadTime_LessThan4S_PT30M",
                "Custom_1",
                "Custom_3"
            ],
            "Stage1" : ["Custom_1", "EHSExtension"],
            "Stage2" : ["Extension_90thLoadTime_LessThan4S_PT24H", "Blade_95thLoadTime_LessThan4S_PT30M"],
            "friendlyname_1" : ["Custom_1", "Extension_90thLoadTime_LessThan4S_PT24H" ]
        },
        "CustomHealthCheckReplacements" :
        {
            "dimension1": "1",
            "dimension2": "2",
            "dimension3": "3"
        }
    },
    "Mooncake": {
        "ServiceGroupRootReplacementsVersion": 3,
        "AzureSubscriptionId": "<SubscriptionId>",
        "CertKeyVaultUri": "https://sometest.vault.azure.cn/secrets/PortalHostingServiceDeploymentCertificate",
        "StorageAccountCredentialsType": "<ConnectionString | AccountKey | SASToken>",
        "TargetStorageCredentialsKeyVaultUri": "<https://sometest.vault.azure.cn/secrets/PortalHostingServiceStorageConnectionString | https://sometest.vault.azure.cn/secrets/PortalHostingServiceStorageAccountKey | https://sometest.vault.azure.cn/secrets/PortalHostingServiceStorage-SASToken>",
        "TargetContainerName": "hostingservice",
        "ContactEmail": "youremail@microsoft.com",
        "PortalExtensionName": "Microsoft_Azure_Monitoring",
        "FriendlyNames": [ "friendlyname_1", "friendlyname_2", "friendlyname_3" ],
        "HotfixDeployment": "true",
        "HotfixMonitorDurations" : [ "PT30M", "P1D" ],
        "MDMHealthResources":
        {
            "Hotfix": [
                "Custom_2"
            ],
            "SDP" : [
                "Extension_90thLoadTime_LessThan4S_PT30M" ,
                "Blade_95thLoadTime_LessThan4S_PT30M"
            ],
            "Stage2" : ["Custom_2", "Blade_95thLoadTime_LessThan4S_PT24H", "EHSExtension"],
            "friendlyname_3" : ["Custom_2", "Extension_90thLoadTime_LessThan4S_PT24H" ]
        },
        "CustomHealthCheckReplacements" :
        {
            "dimension1": "a",
            "dimension2": "b"
        }
    }
}
```

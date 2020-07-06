<a name="portal-extension-configuration"></a>
# Portal Extension Configuration

<a name="portal-extension-configuration-overview"></a>
## Overview

You must register and configure your extension with the Ibiza team for your extension to be available in the Portal. We rely on you to manage your own configuration in the Portal repository. For internal partners, this is done via pull requests, as specified in [top-extensions-publishing.md](top-extensions-publishing.md). External partners use the procedures that are located in [top-external-onboarding.md](top-third-party-onboarding.md).

External partners should also read this guide to understand the capabilities that Portal can provide for extensions by using configuration. However, external partner requests should be submitted by sending an email to <a href="mailto:ibizafxpm@microsoft.com?subject=<Onboarding Request ID> Add <extensionName> extension to the Portal&body=Extension name: <Company>_<BrandOrSuite>_<ProductOrComponent> <br><br> URLs: <br><br> PROD:  main.<extensionName>.ext.contoso.com <br><br> Contact info: <br><br> Business Contacts:<br><br> Dev leads: <br><br> PROD on-call email: <br><br>">ibizafxpm@microsoft.com</a> instead of using the internal sites that are in this document. For more information for external partners, see [top-external-onboarding.md](top-external-onboarding.md).

The following links describe what a configuration file is and how to use it in different situations.

[Configuration file locations and structure](#configuration-file-locations-and-structure)

[Extension stamps and safe deployment](#extension-stamps-and-safe-deployment)

<a name="portal-extension-configuration-overview-configuration-file-locations-and-structure"></a>
### Configuration file locations and structure

The extension configuration files contain information for all extensions registered in the Azure Portal. They are located in the Portal repository in the `src/RDPackages/OneCloud/` directory that is located at [https://aka.ms/portalfx/onecloud](https://aka.ms/portalfx/onecloud).

The configuration file for each environment that the Portal supports is in the following format.
 
 `Extensions.<EnvironmentName>.json`
 
where 

**EnvironmentName**: the name of the environment in which the extension configuration file will be located.  For example, ```Extensions.Prod.json``` contains the configuration for all extensions in the Production environment, and  `Extensions.dogfood.json` contains the configuration for all extensions in the Dogfood environment.

The following code is a typical extension configuration file.

```json
{
     name: "Microsoft_Azure_Demo",
     uri: "//demo.hosting.portal.azure.net/demo",
     uriFormat: "//demo.hosting.portal.azure.net/demo/{0}",
     feedbackEmail: "azureux-demo@microsoft.com",
     cacheability: "manifest",
     disabled: false,
}
```

Its options are as follows.

* **name**:  Required. The name for the extension, as specified in the `Client\extension.pdl` file of the extension project.
    
    <!--TODO: for more information about the extension.pdl file, see ...  although the pdl file is related, it is really a separate subject -->

  Typically, the ```extension.pdl``` file looks like the following.
    ```json
      <?xml version="1.0" encoding="utf-8" ?>
      <Definition xmlns="http://schemas.microsoft.com/aux/2013/pdl">
      <Extension Name="Microsoft_Azure_Demo" Version="1.0" EntryPointModulePath="Program"/>
      </Definition>
    ```
  The only option that the file contains that is relevant to extensions is as follows.

  **Extension Name**:  the name of the extension in the following format:  ```<Company>_<BrandOrSuite>_<ProductOrComponent>```

    Examples:  ```Contoso_Azure_<extensionName>``` , ```Nod_Publishers_Azure_<extensionName> ```

  If the extension is in preview mode then the preview tag should also be added, as in the following example. 

    ```<Extension Name="Microsoft_Azure_Demo" Version="1.0" Preview="true" EntryPointModulePath="Program"/>```
 
* **uri**: Required. The uniform resource identifier for the extension. This consists of the uri of the provider, followed by a forward slash, followed by the directory or path that contains the extension. 
   
   * Hosting service uri
 
      The following example contains the ```uri``` for an extension that is hosted by an extension hosting service.
    
      ```json
      uri: "//demo.hosting.portal.azure.net/demo",
      ```

      In the preceding example,  ```demo.hosting.portal.azure.net``` is the address of the provider and the second occurrence of ```demo``` is the directory or path that contains the extension.
   
   * Custom Deployment Hosting uri

      The following example contains the ```uri``` for teams who own their own custom deployments.
    
      ```json
      uri: "//main.demo.ext.azure.com",
      ```

      In the preceding example, ```main.demo.ext.azure.com```  is the address of the provider of the extension.

      **NOTE**: For extensions that are not using the hosting service, we recommend that the `uri` follow the standard CNAME pattern, as specified in [portalfx-extensions-cnames.md](portalfx-extensions-cnames.md). 

  When the user loads the extension in the Portal, it is loaded from the `uri` specified in the extension configuration. To update the ```uri```, send a pull request as specified in [top-extensions-publishing.md](top-extensions-publishing.md). Additional extension configurations can be loaded by specifying the configuration name in the  `uri` and specifying the feature flag `feature.canmodifystamps=true`. For more information about feature flags, see [portalfx-extensions-feature-flags.md](portalfx-extensions-feature-flags.md).

* **uriFormat**: Required. The `uri` for the extension, followed by a forward slash, followed by a parameter marker that specifies the environment from which to load the extension.
    
  * Hosting service uriFormat

    The following code contains the `uriFormat` for an extension that is hosted by a hosting service.
    
    ```json
      uriFormat: "//demo.hosting.portal.azure.net/demo/{0}",
    ```

    In the preceding example,  ```demo.hosting.portal.azure.net``` is the address of the extension, ```demo``` is the name of the directory or path that contains the extension, and ``` {0} ``` is the parameter marker that will contain the value to substitute into the name string. The substitution specifies the environment from which to load the extension.

  * Custom deployment Hosting uriFormat

    The following code describes the ```uriFormat``` parameter for extensions that have not yet onboarded a hosting service.

    ```json
      uri: "//main.demo.ext.azure.com",
      uriFormat: "//{0}.demo.ext.azure.com",
    ```

    In the preceding example, ```main.demo.ext.azure.com``` is the address of the provider,  ```demo.ext.azure.com``` is the address of the extension, and ``` {0} ``` is the parameter marker that will contain the value to substitute into the name string. The substitution specifies the environment from which to load the extension. For example, if the parameter contains a value of "perf", then the uriFormat would be     ```uriFormat: "//perf.demo.ext.azure.com",```.

      **NOTE**: We recommend that the `uriFormat` follow  the standard CNAME pattern, as specified in  [portalfx-extensions-cnames.md](portalfx-extensions-cnames.md). 

  To update the `uriFormat`, send a pull request as specified in [top-extensions-publishing.md](top-extensions-publishing.md).
    
* **feedbackEmail**: Required. This is an email-based feedback mechanism. The Azure team directs extension feedback to this email when the extension is configured in its environment. When internal users visit ms.portal.azure.com they see a special **send feedback** button.  Whenever a user clicks that button while on one of your blades, the feedback is directed to this email.  To update the feedback email, send a pull request as specified in [top-extensions-publishing.md](top-extensions-publishing.md).

* **cacheability**: Required. Enables caching of the extension on your extension server or on the client. The default value is "manifest".
      
  If custom deployment is being used, then you will need to do some work before the value of the `cacheability` attribute can be set to ```manifest```. Otherwise, the extension will reduce the performance of Azure Portal.

  **NOTE**: Setting the value of the `cacheability` attribute to `manifest` is a requirement for registering the extension into the Portal.  For assistance with caching, send a pull request as specified in [top-extensions-publishing.md](top-extensions-publishing.md).
    
  For more information about caching, see [portalfx-extension-homepage-caching.md](portalfx-extension-homepage-caching.md).

* **disabled**: Optional. Registers the extension configuration into the Portal in hidden mode.  A value of  `true` disables an extension, and a value of `false` enables the extension for display. The default value is `false`. Ideally you would not disable your extension. Even if you want to hide your UX for a private preview or testing then there are ways to do this from within the extension, as specified in [top-extensions-developmentPhases.md](top-extensions-developmentPhases.md). To temporarily enable a disabled extension in private preview for this test session only, add an extension override in the Portal URL, as in the following example.
  
  ```
	https://portal.azure.com?Microsoft_Azure_Demo=true
  ```
  where `Microsoft_Azure_Demo` is the name of the extension as registered with the Portal.

  Conversely, the extension can temporarily be disabled for a session by changing this configuration attribute to a value of `false`. The extension cannot be temporarily enabled or disabled in the production environment.
  
  For more information about enabling and disabling extensions, see [portalfx-extensions-configuration-procedure.md#managing-the-configuration-of-the-extension](portalfx-extensions-configuration-procedure.md#managing-the-configuration-of-the-extension).  

  **NOTE**: If you disable your extension, you will need to add a future pull request to enable it later.  To get those changes deployed in a timely fashion and plan accordingly, see the [portalfx-extensions-svc-lvl-agreements.md](portalfx-extensions-svc-lvl-agreements.md).

* **flightUris**: Optional.  The uri concatenated to a friendly name in order to flight traffic to another stamp, as in the following example.  

  `//demo.hosting.portal.azure.net/demo/MPACFlight`

  For more information about MPAC flighting, see [portalfx-flighting.md#mpac-flighting](portalfx-flighting.md#mpac-flighting).
 
 <!--TODO: Update portalfx-extensions-migrate-existing-to-extensioncontrollerbase.md when it is determined that this flag should be here and/or in the feature flags document. -->
 
 * **scriptoptimze**: Leverage the performance optimizations in the base controller. A value of `true`  , whereas a value of `false` .

 For more information about loading extension configuration files, see [portalfx-extensions-testing-in-production-overview.md#loading-customized-extensions](portalfx-extensions-testing-in-production-overview.md#loading-customized-extensions).

<a name="portal-extension-configuration-overview-extension-stamps-and-safe-deployment"></a>
### Extension stamps and safe deployment

The Azure Portal uses five different extension configuration files to manage the extension configuration. Because the hosting service provides a mechanism for deploying extensions using safe deployment practices, the Portal will load the version of the extension that is based on the region from where the customer is accessing the Portal. For more details, see the Hosting Service documentation located at [top-extensions-hosting-service.md](top-extensions-hosting-service.md).

If the custom deployment registration format is used, then the Portal will always serve the stamp that is registered in the ```uri```. For more informaton about mapping the extension configurations to the correct Portal environment, see [portalfx-extensions-cnames.md](portalfx-extensions-cnames.md).

Additional configurations can be accessed by using the ```uriFormat``` parameter that is specified in the extension config file.

To use a secondary configuration, specify the `feature.canmodifystamps` flag, and add a parameter that matches the name of the extension as registered in the Portal, as in the following example.

```json
name: "Microsoft_Azure_Demo",
uri: "//main.demo.ext.azure.com",
uriFormat: "//{0}.demo.ext.azure.com",
. . .
https://portal.azure.com?feature.canmodifystamps=true&Microsoft_Azure_Demo=perf 
```

 The Portal  will replace the ```{0}``` in the ```uriFormat``` string with ```perf```, and attempt to load the ```Microsoft_Azure_Demo``` extension from the ```https://perf.demo.ext.azure.com``` URL. The Portal always uses the  HTTPS protocol.

To override the configuration, specify the flag ```feature.canmodifystamps=true ```.  To specify an extension that is located in a specific stage, or that is associated with a specific build, use  `feature.canmodifystamps=true&<extensionName>=<StageName_Or_BuildNumber>`, where

**extensionName**: the name of the extension

 **StageName_Or_BuildNumber**:   The stage name or build number that is deployed to a specific stage, for example, stagename `stage1` or   `1d0d8d31` for  BuildNumber of 1.0.8.31. 
 
 **NOTE**: The dots in the build number are replaced with the letter "d".
 
<a name="portal-extension-configuration-process-details"></a>
## Process Details

To add an extension to the Portal, send a pull request, as specified in [top-extensions-publishing.md](top-extensions-publishing.md). 

To enable an extension, remove the `disabled` parameter from the json file that contains the description of the extension.

![alt-text](../media/portalfx-extensions-configuration/json-file.png "Updated Json File")

 The pull request allows you to compare the current file and the proposed proposed changes to ensure that the enabling of the extension is correct previous to creating the pull request, as in the following example.

![alt-text](../media/portalfx-extensions-configuration/json-comparison.png "Json File Comparison")

An example of a pull request that puts the extension immediately into the enabled state is located at [https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx/pullrequest/909233?_a=overview](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx/pullrequest/909233?_a=overview).

An example of a pull request that enables the `HDInsight` extension in the Mooncake environment and increases the extension test is located at [https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/062ccb2ed5c5a8a086877e2d61dd6009242f17fc?refName=refs%2Fheads%2Fdev](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/062ccb2ed5c5a8a086877e2d61dd6009242f17fc?refName=refs%2Fheads%2Fdev).

The following is an example of a pull request for registering a `Scheduler` extension in the Fairfax environment.
[https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/459608f61d5c36864affafe6eb9d230655f67a29?refName=refs%2Fheads%2Fdev](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx/commit/459608f61d5c36864affafe6eb9d230655f67a29?refName=refs%2Fheads%2Fdev).

<a name="portal-extension-configuration-process-details-service-level-agreements-for-deployment"></a>
### Service Level Agreements for deployment

As per the safe deployment mandate, all the configuration changes are treated as code changes. Consequently, they use similar deployment processes.

All changes that are checked in to the dev branch will be deployed in the following order: Dogfood -> RC -> MPAC -> PROD-> National Clouds (BlackForest, FairFax, and Mooncake). The table located at in [top-extensions-svc-lvl-agreements.md](top-extensions-svc-lvl-agreements.md) specifies the amount of time allowed to complete the deployment.

<a name="portal-extension-configuration-process-details-expediting-deployment"></a>
### Expediting deployment

To deploy expedited changes, developers can send a pull request for each branch in the Portal repository, i.e., Dogfood, MPAC and Production. How to send the pull request is specified in  [top-extensions-publishing.md](top-extensions-publishing.md).

Typically, all pull requests are for the Dev branch. When a pull request for an environment is marked as complete, the specified commit can be cherry-picked from that environment and included in a pull request for the next branch. The dev branch is followed by the **Dogfood** branch, which in turn is followed by the **MPAC** branch and finally the production branch.

If the pull request is not sent in the specified order, or if the commit message is changed, then unit test failure may occur. In this case, the changes that are associated with the extension will be reverted without notice.

The SLA for deploying configuration changes to all regions in the Production Environment is in the table specified in [top-extensions-svc-lvl-agreements.md](top-extensions-svc-lvl-agreements.md).

As per the safe deployment mandate, deployment to production environment is performed in stages, where each stage is a logical grouping of regions. There are five stages in the production environment. There is a 24-hour wait period between promoting the build from one batch to another. This implies that the minimum time to deploy a change in all regions in Production branch is five days. 

<a name="portal-extension-configuration-process-details-receiving-notifications-when-changes-are-deployed"></a>
### Receiving notifications when changes are deployed

After the commit has been associated with a workitem, the developer will receive a notification when the config change is deployed to each region.

When the development team wants to subscribe to these changes, ask them to make a comment on the workitem. After they have made changes, they will start receiving the notifications.

<a name="portal-extension-configuration-frequently-asked-questions"></a>
## Frequently asked questions

<a name="portal-extension-configuration-frequently-asked-questions-ssl-certs"></a>
### SSL certs

***How do I use SSL certs?***

Instructions are located at [portalfx-extensions-faq-debugging.md#sslCerts](portalfx-extensions-faq-debugging.md#sslCerts).

* * *

<a name="portal-extension-configuration-frequently-asked-questions-loading-different-versions-of-an-extension"></a>
### Loading different versions of an extension

***How do I load different versions of an extension?***

Understanding which extension configuration to modify is located at [portalfx-extensions-configuration-overview.md#understanding-which-extension-configuration-to-modify](portalfx-extensions-configuration-overview.md#understanding-which-extension-configuration-to-modify).

<properties title="" pageTitle="Domain based configuration" description="" authors="dbrankin" />

<tags
  ms.service="portalfx"
  ms.workload="portalfx"
  ms.tgt_pltfrm="portalfx"
  ms.devlang="portalfx"
  ms.topic="get-started-article"
  ms.date="05/02/2016"
  ms.author="dbrankin"/>

## Domain based configuration

Domain based configuration allows Shell and Extensions to dynamically obtain settings based on the URL that the user used to access the portal.
For example, a user accessing the portal on contoso.portal.azure.com can see different values for (domain based) settings than a user on the 
more traditional portal.azure.com URL.

While domain based configuration is not technically required in order to support national clouds, there is great overlap between settings that
need to change for community clouds and it is often easier to store settings such as a links over to domain based configuration. Settings such 
as ARM endpoints would not normally be candidates for domain based configuration.

Additionally, domain based configuration includes support for expanding links from link redirection / shortener services such as Microsoft's 
FwLink and aka.ms services.

**Note:** Domain based configuration is based on the domain (host address) of the Shell, not of the Extension. 
Extensions do not need to support additional host names themselves in order to take advantage of domain based configuration.

For a discussion about when to use domain based configuration settings over vanilla configuration settings, please see 
[Domain based configuration: Expected design pattern](/documentation/articles/portalfx-domain-based-configuration-pattern)

The Shell provides two APIs to support domain based configuration:

### MsPortalFx.Settings.getSharedSettings()
Selected values from Shell are exposed through an RPC call so that:
 1. Extensions do not all have to hold their own copy of commonly defined values, such as the support URL, and 
 1. Changes to these shared settings do not require simultaneous redeployment of extensions.
 
The first call by the extension to this API results in an RPC call from the extension to Shell. After that, the results are served from a cache.
 
The `MsPortalFx.Settings.getSharedSettings()` API returns the following structure (defined in src\SDK\Framework\TypeScript\MsPortalFx\SharedSettings.d.ts). 
At the time of writing (1/26/2016), the root of this object is empty (reserved for future use) except for a links property containing the following settings:

**Links collection:**

Element Name          |Description
----------------------|-----------
accountsPortal        |Link to the Accounts portal.
classicPortal         |Link to the Classic portal.
createSupportRequest  |Link to the create support request UI.
giveFeedback          |Link to the feedback UI.
helpAndSupport        |Link to the help and support UI.
learnRelatedResources |Link to the learn related resources help topic.
manageSupportRequests |Link to the manage support request UI.
privacyAndTerms       |Link to the privacyAndTerms UI.
resourceGroupOverview |Link to resource groups overview.

**Notes:**

1. Links can be full URLs (i.e. external links), a URL fragment (i.e. blade link), or `String.Empty` (feature is not supported for that
   user / tenant / environment). It is the consumer's job to support all three formats if they take a dependency.

1. Links are automatically expanded according to the user's domain, tenant, and language preferences.
 
 
### TrustedAuthorityHost
Server-side `PortalContext.TrustedAuthorityHost` returns the host name under which the extension was loaded. For example, if 
Extension A may need to know if it's being called from portal.azure.com or Contoso.azure.com. In the first case TrustedAuthorityHost 
will be portal.azure.com and in the second, contoso.azure.com. 
 
**Note:** If the extension needs to change its configuration based on the domain of the caller, the recommended pattern is to use 
domain based configuration (which is designed specifically for this sort of work) rather than coding directly against values returned
 by PortalContext.TrustedAuthorityHost.



<tags
  ms.service="portalfx"
  ms.workload="portalfx"
  ms.tgt_pltfrm="portalfx"
  ms.devlang="portalfx"
  ms.topic="get-started-article"
  ms.date="05/02/2016"
  ms.author="dbrankin"/>

<a name="national-community-clouds"></a>
## National / community clouds

While Public Azure is available globally, Microsoft offers national and community clouds in several countries/regions for compliance and commerical reasons.

National clouds (sometimes called sovereign clouds) are 'cookie-cutter' deployments of the Public Azure hardware and services that differ from
Public Azure mainly in terms of configuration and access policies. Users access national clouds through URLs specific to each national cloud, and
each Cloud is a physically separate, ring-fenced deployment.

Community clouds on the other hand run on the Public Azure bits (i.e. on the same IP address and machines as portal.azure.com) and provide
vanity URL, extension filtering, and rebranding functionality to selected partners. In community clouds, the servers are making decisions
dynamically based on the URL used to access them.

**Note:** [Microsoft Azure Government](https://azure.microsoft.com/en-us/features/gov/) is implemented as a national cloud rather than a community cloud.

When writing your application, it is important to take into account that your code needs to comply with and work in all these environments to be deployed
there. Typical items to watch for are:

1. Hard-coded links of any type

1. Links to Classic Portal

1. Links to Support

1. Links to Pricing information

1. Extensions must allow access from all community cloud URLs (*.portal.azure.com in Public Azure) they are enabled in

These issues are discussed in more detail below. Many of these are best resolved through the
[Domain based configuration](portalfx-domain-based-configuration.md) pattern.

<a name="national-community-clouds-hard-coded-links"></a>
### Hard-coded links
Hardcoding URLs into source code is generally considered an anti-pattern as these can't be easily maintained. The recommended practice is to store
these in configuration settings.

In the specific case of national and community clouds, hard-coded links cause considerable problems when trying to deploy the same code to different
Clouds as external links (to SDKs, extension specific pricing pages, support, etc) are rarely the same between national clouds.
Extensions already need to support national cloud specific configuration settings, so moving the links to the configuration file allows extension authors
to leverage their existing national cloud deployment strategy.

<a name="national-community-clouds-hard-coded-links-hard-coded-links-in-resource-resx-files"></a>
##### Hard-coded Links in resource (resx) files
Links in resx files are also considered to be hardcoded and typically do not reflect the user's language selection within the portal. It should be
noted that while services such as Microsoft's FwLink service can be configured to return different URLs based on the user's preferred language, this
must not be used to point forward links to the corresponding cloud. A Chinese language user on portal.azure.com should get
the global Accounts portal in Chinese, whereas a Chinese langauge user on portal.azure.cn should get the Chinese Accounts portal in Chinese.

<a name="national-community-clouds-links-to-classic-portal"></a>
### Links to Classic Portal
Not all clouds (notably Azure Germany) have a vClassic portal deployment.

**Note:** Linking to the global Azure Managmentment portal (portal.azure.com) from these environments is not acceptable. Leaving aside potential
legal & contractual concerns, the public portal does not have access to this user's national clouds subscriptions (and often does not have access
to the user's tenant).

<a name="national-community-clouds-links-to-support"></a>
### Links to Support
Links to Support (Create new tickets, Manage tickets, Troubleshoot, etc) have limited or no support in several Clouds. In these clouds the Support
extension is either physically absent (or disabled) and the corresponding UI options disabled or routed to external webpages.

<a name="national-community-clouds-extensions-must-allow-access-from-that-deployments-community-urls"></a>
### Extensions must allow access from that deployments Community URLs
Extensions maintain an allow list (via their `Microsoft.Portal.Framework.FrameworkConfiguration.AllowedParentFrame` setting) as to what domains
they can be referenced from. This needs to hold the correct value for the targeted Cloud. Additionally, if the environment supports additional
Community clouds, those clouds must either be a subdomain under an already allowed domain. For example, the a value of portal.azure.com also
enables access from contoso.portal.azure.com and fujitsu.portal.azure.com.

Cloud        |Type     |AllowedParentFrame
-------------|---------|------------------
Public       |National |portal.azure.com
China        |National |portal.azure.cn
Germany      |National |portal.microsoftazure.de
US Government|National |portal.azure.us
Fujitsu A5   |Community|fujitsu.portal.azure.com

**Note:** Clouds that are yet to be publically announced have been excluded from the above table.

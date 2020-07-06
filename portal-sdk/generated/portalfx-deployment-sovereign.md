<properties pageTitle="Deployments" description="Deployments" services="portalfx" documentationCenter="portalfx" authors="flanakin,spaoliello" />

<a name="national-sovereign-clouds"></a>
## National/sovereign clouds
<a name="national-sovereign-clouds-overview"></a>
### Overview

Sovereign clouds (aka "national clouds") are instances of Azure restricted to a particular group of users. This group may consist of one geopolitical boundary (e.g. country) or legal boundary (e.g. public sector).

To get started in a sovereign cloud, talk to the Azure Global Ecosystems team or use the link to their wikis below.

<a name="per-cloud-information"></a>
## Per-cloud information

| Cloud          | Portal domain            | Extension domain        | More information |
|----------------|--------------------------|-------------------------|------------------|
| (Public Azure) | portal.azure.com         | *.ext.azure.com         |       (N/A)      |
| Blackforest    | portal.microsoftazure.de | *.ext.microsoftazure.de | [Blackforest wiki](http://aka.ms/blackforest) |
| Mooncake       | portal.azure.cn          | *.ext.azure.cn          | [Mooncake wiki](http://aka.ms/mooncake/)    |
| Fairfax        | portal.azure.us          | *.ext.azure.us          | [Fairfax wiki](http://aka.ms/fairfax/)     |


<a name="per-cloud-information-common-gotchas"></a>
### Common gotchas

<a name="per-cloud-information-allowedparentframe"></a>
### AllowedParentFrame
When you deploy your extension to a different cloud, you must explicitly allow the portal in that cloud to load your extension.
This is controlled in your config. Look for a setting called `Microsoft.Portal.Framework.FrameworkConfiguration.AllowedParentFrame`. It should be a JSON array of domains that can load your extension (i.e. list of portal domains for a given cloud).

E.g. for Blackforest you might have this in your CSCFG:
```
<add key="Microsoft.Portal.Framework.FrameworkConfiguration.AllowedParentFrame" value="['portal.microsoftazure.de']" />
```

If you don't set it correctly, the browser will refuse to load your extension with an error in the console similar to `Refused to display (extension URL) in a frame because an ancestor violates the following Content Security Policy directive: (some frame-ancestors URL)`

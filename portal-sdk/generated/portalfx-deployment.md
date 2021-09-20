* [Overview](#overview)
    * [Portal](#overview-portal)
    * [Portal deployment schedule](#overview-portal-deployment-schedule)
* [Before deploying extension](#before-deploying-extension)
    * [1\. For extensions onboarding Ibiza: Enable/disable extensions](#before-deploying-extension-for-extensions-onboarding-ibiza-enable-disable-extensions)
    * [2\. Extension "stamps"](#before-deploying-extension-extension-stamps)
    * [3\. Understand extension runtime compatibility](#before-deploying-extension-understand-extension-runtime-compatibility)
* [Deploying extension UI](#deploying-extension-ui)
* [Deploying extension controllers](#deploying-extension-controllers)
* [Legacy/DIY deployments](#legacy-diy-deployments)
* [Resiliency and failover](#resiliency-and-failover)


<a name="overview"></a>
## Overview

The Azure Portal uses a decentralized model of deployment that consists of several components that work together to
provide the end-to-end experience, each deployed to separate endpoints:

- **Portal** \- web application that hosts the shell
- **Extensions** \- each extension is a web application that is loaded by the portal
- **ARM** \- public API for Azure that accepts calls from the portal, Azure SDK, and command line
- **Resource providers** \- provide resource-specific APIs for management operations (e.g. read, write, delete)

![Portal / Extension architecture][deployment-architecture]

<a name="overview-portal"></a>
### Portal

The portal is deployed to all [public Azure regions](http://azure.microsoft.com/regions) and uses geographical
load-balancing via Azure Traffic Manager (using the "Performance" profile).
(For more information about Azure Traffic Manager, see their
[introduction](https://azure.microsoft.com/en-us/documentation/articles/traffic-manager-overview/).)

Deploying in this fashion means that users can take advantage of a server closer to them, reducing latency and improving
the overall experience of using the portal.

The portal also takes advantage of the [Azure CDN](https://azure.microsoft.com/en-us/documentation/articles/cdn-overview/)
for static resources (images, scripts, etc.). This shifts the location of the most-downloaded files even closer to the user.

<a name="overview-portal-deployment-schedule"></a>
### Portal deployment schedule

The portal is deployed continuously. On any given day, multiple bug fixes, new features, and API changes may be deployed
to production. When a new version of the portal is deployed to production, the corresponding version of the SDK is
automatically released to the [download center](/portal-sdk/generated/downloads.md). The download center contains the change log for the given
release, including bug fixes, new features, and a log of breaking changes.

<a name="before-deploying-extension"></a>
## Before deploying extension

1. For extensions onboarding Ibiza: Enable/disable extensions
1. Extension "stamps"
1. Understand extension runtime compatibility

<a name="before-deploying-extension-for-extensions-onboarding-ibiza-enable-disable-extensions"></a>
### 1. For extensions onboarding Ibiza: Enable/disable extensions

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

<a name="before-deploying-extension-extension-stamps"></a>
### 2. Extension &quot;stamps&quot;

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

<a name="before-deploying-extension-understand-extension-runtime-compatibility"></a>
### 3. Understand extension runtime compatibility

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

<a name="deploying-extension-ui"></a>
## Deploying extension UI

[Deploying through Extension Hosting Service](portalfx-extension-hosting-service.md)

<a name="deploying-extension-controllers"></a>
## Deploying extension controllers

Each extension is responsible for deploying their controllers and setting up load-balancing across whatever regions
make sense.

We recommend that extensions deploy controllers broadly across all regions in an active-active configuration and use a
technology, such as [Azure Traffic Manager](https://azure.microsoft.com/en-us/documentation/articles/traffic-manager-overview/)
with a "Performance" profile, to direct the user to the server closest to them. This will give users the best
experience, especially if the extension communicates with an RP that is also deployed broadly across regions. (Since ARM
is deployed in every region, this means that that traffic for a user will stay entirely within one region, reducing
latency.)

<a name="legacy-diy-deployments"></a>
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

<a name="resiliency-and-failover"></a>
## Resiliency and failover

Having a presence in all geographies is important for good performance.
We see much higher latencies and reliability issues when servers are not geo-located with their users.
(For more tips, see the [performance page](performance.md).)

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

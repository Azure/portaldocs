* [Overview](#overview)
* [Extension performance](#extension-performance)
* [Blade performance](#blade-performance)
* [Part performance](#part-performance)
* [WxP score](#wxp-score)
* [How to assess your performance](#how-to-assess-your-performance)
* [Performance Checklist](#performance-checklist)
* [Performance Frequently Asked Questions (FAQ)](#performance-frequently-asked-questions-faq)
    * [My Extension 'ManifestLoad' is above the bar, what should I do](#performance-frequently-asked-questions-faq-my-extension-manifestload-is-above-the-bar-what-should-i-do)
    * [My Extension 'InitializeExtensions' is above the bar, what should I do](#performance-frequently-asked-questions-faq-my-extension-initializeextensions-is-above-the-bar-what-should-i-do)
    * [My Blade 'Revealed' is above the bar, what should I do](#performance-frequently-asked-questions-faq-my-blade-revealed-is-above-the-bar-what-should-i-do)
    * [My Part 'Revealed' is above the bar, what should I do](#performance-frequently-asked-questions-faq-my-part-revealed-is-above-the-bar-what-should-i-do)
    * [My WxP score is below the bar, what should I do](#performance-frequently-asked-questions-faq-my-wxp-score-is-below-the-bar-what-should-i-do)
* [Performance best practices](#performance-best-practices)
    * [Writing fast extensions](#performance-best-practices-writing-fast-extensions)
* [Configuring CDN](#configuring-cdn)
    * [Using the CDN](#configuring-cdn-using-the-cdn)
    * [Creating the CDN account](#configuring-cdn-creating-the-cdn-account)
    * [Configuring your CDN service](#configuring-cdn-configuring-your-cdn-service)
    * [Configuring your extension](#configuring-cdn-configuring-your-extension)
    * [Configuring the Prefix](#configuring-cdn-configuring-the-prefix)
    * [Reading the prefix from configuration](#configuring-cdn-reading-the-prefix-from-configuration)
    * [IIS / ASP.NET Configuration](#configuring-cdn-iis-asp-net-configuration)
    * [Invalidating content on the CDN](#configuring-cdn-invalidating-content-on-the-cdn)
    * [Configuring versioning of your Extensioon](#configuring-cdn-configuring-versioning-of-your-extensioon)
    * [Updating extensions](#configuring-cdn-updating-extensions)
    * [Implications of changing the version](#configuring-cdn-implications-of-changing-the-version)
    * [FAQ](#configuring-cdn-faq)
* [Extension HomePage Caching](#extension-homepage-caching)
    * [Server side caching of extension home pages](#extension-homepage-caching-server-side-caching-of-extension-home-pages)
    * [Client-side caching of extension home pages](#extension-homepage-caching-client-side-caching-of-extension-home-pages)
    * [Implications of client side caching](#extension-homepage-caching-implications-of-client-side-caching)
    * [How this works](#extension-homepage-caching-how-this-works)
    * [How to test your changes](#extension-homepage-caching-how-to-test-your-changes)
    * [Co-ordinating these changes with the portal](#extension-homepage-caching-co-ordinating-these-changes-with-the-portal)
* [Persistent Caching of scripts across extension updates](#persistent-caching-of-scripts-across-extension-updates)
    * [Making sure that scripts are available across extension updates](#persistent-caching-of-scripts-across-extension-updates-making-sure-that-scripts-are-available-across-extension-updates)
    * [Example implementation as done in HubsExtension](#persistent-caching-of-scripts-across-extension-updates-example-implementation-as-done-in-hubsextension)
    * [Verfiying that persistent caching is working](#persistent-caching-of-scripts-across-extension-updates-verfiying-that-persistent-caching-is-working)
* [Run portalcop to identify and resolve common performance issues](#run-portalcop-to-identify-and-resolve-common-performance-issues)
* [PortalCop](#portalcop)
    * [Installing PortalCop](#portalcop-installing-portalcop)
    * [Running PortalCop](#portalcop-running-portalcop)
* [Performance alerting](#performance-alerting)


<a name="overview"></a>
## Overview

Portal performance from a customers perspective is seen as all experiences throughout the product. 
As an extension author you have a duty to uphold your experience to the performance bar at a minimum.

| Area      | Sub-Area                   | 80th Percentile Bar | Telemetry Action         | How is it measured? |
| --------- | -------------------------- | ------------------- | ------------------------ | ------------------- |
| Blade     | Revealed                   | See Power BI        | BladeRevealed            | Time it takes for the blade's OnInputsSet to resolve and all the parts on the blade and above the fold to reveal |
| Blade     | FullRevealed               | N/A                 | BladeFullRevealed        | Same as Revealed but all the parts on the blade to reveal |
| Part      | Revealed                   | See Power BI        | PartRevealed             | Time it takes for the part to be rendered and then the part's OnInputsSet to resolve or earlyReveal to be called |
| WxP       | N/A                        | See Power BI        | N/A                      | An overall experience score, calculated by weighting blade usage and the blade revealed time |

<!--| Extension | Initial Extension Response | TODO                | InitialExtensionResponse | TODO |
| Extension | Manifest Load              | TODO                | ManifestLoad             | TODO |
| Extension | Initialization             | TODO                | InitializeExtensions     | TODO | -->

<a name="extension-performance"></a>
## Extension performance

Extension performance effects both Blade and Part performance, as your extension is loaded and unloaded as and when it is required.
In the case a user is visiting your resource blade for the first time, the Fx will load up your extension and then request the view model, consequently your Blade/Part
performance is effected.
If the user were to browse away from your experience and browse back before your extension is unloaded obviously second visit will be faster, as they don't pay the cost
of loading the extension.

<a name="blade-performance"></a>
## Blade performance

Blade performance is spread across a couple of main areas:

1. Blade's constructor
1. Blade's OnInputsSet
1. Any Parts within the Blade become revealed

All of which are encapsulated under the one BladeRevealed action.

<a name="part-performance"></a>
## Part performance

Similar to Blade performance, Part performance is spread across a couple of areas:

1. Part's constructor
1. Part's OnInputsSet

All of which are encapsulated under the one PartRevealed action.

<a name="wxp-score"></a>
## WxP score

The WxP score is a per extension Weight eXPerience score (WxP). It is calculated by the as follows:

```txt

WxP = (BladeViewsMeetingTheBar * 80thPercentileBar) / ((BladeViewsMeetingTheBar * 80thPercentileBar) + ∑(BladeViewsNotMeetingTheBar * ActualLoadTimePerBlade))

```

| Blade   | 80th Percentile Times | Usage Count | Meets 80th Percentile Bar? |
| ------- | --------------------- | ----------- | -------------------------- |
| Blade A | 1.2                   | 1000        | Yes                        |
| Blade B | 5                     | 500         | No                         |
| Blade C | 6                     | 400         | No                         |

```txt

WxP = (BladeViewsMeetingTheBar * 80thPercentileBar) / ((BladeViewsMeetingTheBar * 80thPercentileBar) + ∑(BladeViewsNotMeetingTheBar * ActualLoadTimePerBlade)) %
    = (4 * 1000) / ((4 * 1000) + ((5 * 500) + (6 * 400))) %
    = 44.94%

```

As you can see the model penalizes the number of views which don’t meet the bar and also the count of those.

<a name="how-to-assess-your-performance"></a>
## How to assess your performance

There is two methods to assess your performance:

1. Visit the IbizaFx provided PowerBi report*
1. Run Kusto queries locally to determine your numbers

    (*) To get access to the PowerBi dashboard reference the [Telemetry onboarding guide][TelemetryOnboarding], then access the following [Extension performance/reliability report][Ext-Perf/Rel-Report]

The first method is definitely the easiest way to determine your current assessment as this is maintained on a regular basis by the Fx team.
You can, if preferred, run queries locally but ensure you are using the Fx provided Kusto functions to calculate your assessment.

<a name="performance-checklist"></a>
## Performance Checklist

- [Configure CDN][portalfx-cdn]
- [Extension HomePage Caching](portalfx-extension-homepage-caching)
- [Persistent Caching of scripts across extension updates](portalfx-extension-persistent-caching-of-scripts)
- [Run portalcop to identify and resolve common performance issues](portalfx-performance-portalcop)
- [Optimize number CORS preflight requests to ARM using invokeApi](index-portalfx-extension-development.md#optimize-number-cors-preflight-requests-to-arm-using-invokeapi)
- [Improve part responsiveness with revealContent](index-portalfx-extension-development.md#portalfx-parts-revealContent)
- [Best practices](#performance-best-practices)

<a name="performance-frequently-asked-questions-faq"></a>
## Performance Frequently Asked Questions (FAQ)

<!--### My Extension 'InitialExtensionResponse' is above the bar, what should I do

TODO

<a name="performance-frequently-asked-questions-faq-my-extension-manifestload-is-above-the-bar-what-should-i-do"></a>
### My Extension &#39;ManifestLoad&#39; is above the bar, what should I do

TODO

<a name="performance-frequently-asked-questions-faq-my-extension-initializeextensions-is-above-the-bar-what-should-i-do"></a>
### My Extension &#39;InitializeExtensions&#39; is above the bar, what should I do

TODO -->

<a name="performance-frequently-asked-questions-faq-my-blade-revealed-is-above-the-bar-what-should-i-do"></a>
### My Blade &#39;Revealed&#39; is above the bar, what should I do

1. Assess what is happening in your Blades's constructor and OnInputsSet.
1. Can that be optimized?
1. If there are any AJAX calls, wrap them with custom telemetry and ensure they you aren't spending a large amount of time waiting on the result.
1. Check the Part's on the Blade revealed times using [Extension performance/reliability report][Ext-Perf/Rel-Report], select your Extension and Blade on the filters.
1. How many parts are on the blade?
    - If there's only a single part, if you're not using a `<TemplateBlade>` migrate your current blade over.
    - If there's a high number of parts (> 3), consider removing some of the parts

<a name="performance-frequently-asked-questions-faq-my-part-revealed-is-above-the-bar-what-should-i-do"></a>
### My Part &#39;Revealed&#39; is above the bar, what should I do

1. Assess what is happening in your Part's constructor and OnInputsSet.
1. Can that be optimized?
1. If there are any AJAX calls, wrap them with custom telemetry and ensure they you aren't spending a large amount of time waiting on the result.
1. Do you have partial data before the OnInputsSet is fully resolved? If yes, then you can reveal early, display the partial data and handle loading UI for the individual components 

<a name="performance-frequently-asked-questions-faq-my-wxp-score-is-below-the-bar-what-should-i-do"></a>
### My WxP score is below the bar, what should I do

Using the [Extension performance/reliability report][Ext-Perf/Rel-Report] you can see the WxP impact for each individual blade. Although given the Wxp calculation,
if you are drastically under the bar its likely a high usage blade is not meeting the performance bar, if you are just under the bar then it's likely it's a low usage
blade which is not meeting the bar.

<a name="performance-best-practices"></a>
## Performance best practices


<!-- THIS FILE IS REFERENCED IN THE portalfx-performance SECTION PLEASE START ALL HEADINGS WITH H3S -->

<a name="performance-best-practices-writing-fast-extensions"></a>
### Writing fast extensions

When writing extensions, there are a few patterns you can follow to make sure you're getting the most performance out
the browser and the portal.

<a name="performance-best-practices-writing-fast-extensions-use-amd"></a>
#### Use AMD

In the early days of the Azure Portal SDK, it was common to write extensions that bundled all scripts into a single file at
compilation time. This generally happens if you use reference statements in your classes:

<a name="performance-best-practices-writing-fast-extensions-use-amd-deprecated-synatx"></a>
##### [DEPRECATED SYNATX]

```ts

/// <reference path="../TypeReferences.d.ts" />
/// <reference path="WebsiteSelection.ts" />
/// <reference path="../Models/Website.ts" />
/// <reference path="../DataContexts/DataContexts.ts" />

module RemoteExtension {
    export class WebsitesBladeViewModel extends MsPortalFx.ViewModels.Blade {
    ...
    }
}

```

In the example above, modules are imported using `<reference>` elements.
This includes those scripts into a single script file at compile time, leading to a relatively large file which needs to be downloaded
every time your extension projects UI.

Since that time, we've introduced support for using [Asynchronous Module Definition (AMD)](http://requirejs.org/docs/whyamd.html).
Instead of bundling all scripts into a single monolithic file, the portal is now capable of downloading only the files needed to
project the current UI onto the screen. This makes it faster to unload and reload an extension, and provides for generally better
performance in the browser.  In this case, by using AMD, the following files will only be loaded at runtime as they're required
(instead of one large bundle):

<a name="performance-best-practices-writing-fast-extensions-use-amd-correct-synatx"></a>
##### [CORRECT SYNATX]

```ts

import SecurityArea = require("../SecurityArea");
import ClientResources = require("ClientResources");
import Svg = require("../../_generated/Svg");

export class BladeViewModel extends MsPortalFx.ViewModels.Blade {
    ...
}

```

This leads to faster load time, and less memory consumption in the browser. You can learn more about the TypeScript module loading
system in the [official language specification](http://www.typescriptlang.org/docs/handbook/modules.html).

<a name="performance-best-practices-writing-fast-extensions-use-querycache-and-entitycache"></a>
#### Use QueryCache and EntityCache

When performing data access from your view models, it may be tempting to make data calls directly from the `onInputsSet` function.
By using the QueryCache and EntityCache, you can control access to data through a single component.
A single ref-counted cache can hold data across your entire extension.  This has the benefits of:

- Reduced memory consumption
- Lazy loading of data
- Less calls out to the network
- Consistent UX for views over the same data.

> Developers should use QueryCache and EntityCache for data access.
These classes provide advanced caching and ref-counting.
Internally, these make use of Data.Loader and Data.DataSet (which will be made FX-internal in the future).

To learn more, visit [Querying for data](portalfx-data-query.md).

<a name="performance-best-practices-writing-fast-extensions-avoid-unnecessary-data-reloading"></a>
#### Avoid unnecessary data reloading

As users navigate through the Ibiza UX, they will frequently revisit often-used resources within a short period of time.
They might visit their favorite Website Blade, browse to see their Subscription details, and then return to configure/monitor their
favorite Website. In such scenarios, ideally, the user would not have to wait through loading indicators while Website data reloads.

To optimize for this scenario, use the `extendEntryLifetimes` option common to QueryCache and EntityCache.

```ts

public websitesQuery = new MsPortalFx.Data.QueryCache<SamplesExtension.DataModels.WebsiteModel, any>({
    entityTypeName: SamplesExtension.DataModels.WebsiteModelType,
    sourceUri: MsPortalFx.Data.uriFormatter(Shared.websitesControllerUri),
    supplyData: (method, uri, headers, data) => {
        // ...
    },
    extendEntryLifetimes: true
});

```

QueryCache/EntityCache contain numerous cache entries, each of which are ref-counted based on not-disposed instances of
QueryView/EntityView. When a user closes a Blade, typically a cache entry in the corresponding QueryCache/EntityCache will be removed,
since all QueryView/EntityView instances will have been disposed. In the scenario where the user *revisits* their Website Blade,
the corresponding cache entry will have to be reloaded via an ajax call, and the user will be subjected to loading indicators on
the Blade and its Parts.

With `extendEntryLifetimes`, unreferenced cache entries will be *retained for some amount of time*, so when a corresponding Blade
is reopened, data for the Blade and its Parts will already be loaded and cached.  Here, calls to `this._view.fetch()` from a Blade
or Part view model will return a resolved Promise, and the user will not see long-running loading indicators.

(Note - The time that unreferenced cache entries are retained in QueryCache/EntityCache is controlled centrally by the FX
 and the timeout will be tuned based on telemetry to maximize cache efficiency across extensions.)

For your scenario to make use of `extendEntryLifetimes`, it is **very important** that you take steps to keep your client-side
QueryCache/EntityCache data caches **consistent with server data**.
See [Reflecting server data changes on the client](portalfx-data-query.md) for details.


<a name="performance-best-practices-writing-fast-extensions-use-paging-for-large-data-sets"></a>
#### Use paging for large data sets

When working with a large data set, extension authors should use the paging features of the grid.
Paging allows deferred loading of rows, so even with a large dataset responsiveness can be maintained.
Additionally it means many rows might not need to be loaded at all. To learn more about paging with grids,
you can check out the samples:

`\Client\Controls\Grid\ViewModels\PageableGridViewModel.ts`

<a name="performance-best-practices-writing-fast-extensions-use-map-and-filter-to-reduce-size-of-rendered-data"></a>
#### Use &quot;map&quot; and &quot;filter&quot; to reduce size of rendered data

Often, it is useful to use the [Knockout projections](https://github.com/stevesanderson/knockout-projections) to shape and filter model data loaded using QueryView and EntityView (see [Shaping and filtering data](portalfx-data-projections.md)).

Significant performance improvements can achieved by reducing the number and size of the model objects bound to controls like grids, lists, charts:

    `\Client\Controls\Grid\ViewModels\SelectableGridViewModel.ts`

```ts

// Wire up the contents of the grid to the data view.
this._view = dataContext.personData.peopleQuery.createView(container);
var projectedItems = this._view.items
    .filter((person: SamplesExtension.DataModels.Person) => { return person.smartPhone() === "Lumia 520"; })
    .map((person: SamplesExtension.DataModels.Person) => {
        return <MappedPerson>{
            name: person.name,
            ssnId: person.ssnId
        };
    });

var personItems = ko.observableArray<MappedPerson>([]);
container.registerForDispose(projectedItems.subscribe(personItems));


```

In this example, `map` is used to project new model objects containing only those properties required to fill the columns of the grid.  Additionally, `filter` is used to reduce the size of the array to just those items that will be rendered as grid rows.

<a name="performance-best-practices-writing-fast-extensions-benefits-to-ui-rendering-performance"></a>
#### Benefits to UI-rendering performance

Using the selectable grid SDK sample we can see the benefits to using `map` to project objects with only those properties required by a grid row:

![Using knockout projections to map an array][mapping]
[mapping]: ../media/portalfx-performance/mapping.png

There is almost a 50% reduction in time with these optimizations, but also note that at 300 items it is still over 1.5s. Mapping to just the 2 columns in that selectable grid sample reduces the message size by 2/3 by using the technique described above. This reduces the time needed to transfer the view model as well as reducing memory usage.



<a name="configuring-cdn"></a>
## Configuring CDN


<a name="configuring-cdn-using-the-cdn"></a>
### Using the CDN
Extension authors may choose to use a CDN to serve static images, scripts, and stylesheets. The Azure Portal SDK does not require the use of a CDN, or the use of a particular CDN. However, extensions served from Azure can take advantage of the built-in CDN capabilities in the SDK.

<a name="configuring-cdn-creating-the-cdn-account"></a>
### Creating the CDN account
Follow this guide to set up your CDN account:

<a href="http://www.windowsazure.com/en-us/documentation/articles/cdn-how-to-use/" target="_blank">http://www.windowsazure.com/en-us/documentation/articles/cdn-how-to-use/</a>

<a name="configuring-cdn-configuring-your-cdn-service"></a>
### Configuring your CDN service
After creating your CDN, there are a few options that need to be set.
- Make sure HTTP and HTTPS are enabled by clicking the "Enable HTTPS" command.
- Make sure query string status is enabled by clicking the "Enable Query String" command.

<a name="configuring-cdn-configuring-your-extension"></a>
### Configuring your extension
To take advantage of the CDN capabilities in the Portal SDK, there are a few pieces that must be configured.

<a name="configuring-cdn-configuring-the-prefix"></a>
### Configuring the Prefix
After setting up your CDN, you will receive a url which can be used to access your content. It will be in the form:

    //<MyCDNNamespace>.vo.msecnd.net/

This is the prefix for your CDN service. Your production service should be configured to use this prefix. In your local web.config, can set this with the following `appSetting`:

```xml
<add key="Microsoft.Portal.Extensions.SamplesExtension.ApplicationConfiguration.CdnPrefix" 
     value="//<MyCDNNamespace>.vo.msecnd.net/" />
```

Notice that neither `http` nor `https` are used in the url. This is important. It allows your page to request content based on the current protocol of the request. Oftentimes, this setting will be blank in web.config, and instead configured in a `cscfg` for a cloud service.

<a name="configuring-cdn-reading-the-prefix-from-configuration"></a>
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

<a name="configuring-cdn-iis-asp-net-configuration"></a>
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

<a name="configuring-cdn-invalidating-content-on-the-cdn"></a>
### Invalidating content on the CDN

- Amd Bundles are invalidated using a **hash** of the file content i.e https://hubs-s3-portal.azurecomcdn.net/AzureHubs/Content/Dynamic/AmdBundleDefinition_**83A1A15A39494B7BB1F704FDB5F32596D4498792**.js?root=*HubsExtension/ServicesHealth/ServicesHealthArea
- static content is invalidated using the **extension version** i.e  https://hubs-s3-portal.azurecomcdn.net/AzureHubs/Content/**5.0.202.7608987.150717-1541**/Images/HubsExtension/Tour_Tile_Background_Normal.png

When you release to ensure that users are served the latest static content, as opposed to stale content,  you need to configure versioning.

<a name="configuring-cdn-configuring-versioning-of-your-extensioon"></a>
### Configuring versioning of your Extensioon


<a name="configuring-cdn-updating-extensions"></a>
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

<a name="configuring-cdn-implications-of-changing-the-version"></a>
### Implications of changing the version

You should not introduce breaking changes in your server code (e.g. incompatibility between client and server code). Instead leave a compatibile version of the old code around on the server for a few days, monitor its usage to ensure that customers/browsers are no longer accessing it (i.e all users have switched to the newer version of your code - likely by refreshing the portal), and then delete the code.
This can easily be accomplished by making new controllers/methods instead of making breaking changes to existing ones.
If you do end up in a situation where you make a breaking change, users will likely see a broken experience until they reload the portal.
You will need to contact the portal team in order to find a way to get past this issue.


<a name="configuring-cdn-faq"></a>
### FAQ

- I am not seeing paths w/ versioning during debug.
    - Ensure IsDevelomentMode in your *.config is set to false



<a name="extension-homepage-caching"></a>
## Extension HomePage Caching


<a name="extension-homepage-caching-server-side-caching-of-extension-home-pages"></a>
### Server side caching of extension home pages

With the (5.0.302.85 or later) version of the SDK  extension home pages can be cached (to different levels).
This should help get slightly better load time especially from browsers that have high latency.
Below are two example URLs from the portal running in production:

```
https://yourextension.contoso.com/
    ?extensionName=Your_Extension
    &shellVersion=5.0.302.85%20(production%23444e261.150819-1426)
    &traceStr=
    &sessionId=ece19d8501fb4d2cbe10db84b844c55b
    &l=en.en-us
    &trustedAuthority=portal.azure.com%3A
    #ece19d8501fb4d2cbe10db84b844c55b
```

You will notice that for the extension, the sessionId is passed in the query string part of the URL.
This makes the extension essentially un-cacheable (because even if it was, we would generate a unique URL on each access essentially busting any cache – browser or server).
If you enable server side caching of extension home pages, the URL will become:

```
https://yourextension.contoso.com/
    ?extensionName=Your_Extension
    &shellVersion=5.0.302.85%20(production%23444e261.150819-1426)
    &traceStr=
    &l=en.en-us
    &trustedAuthority=portal.azure.com%3A
    #ece19d8501fb4d2cbe10db84b844c55b
```

Notice that the sessionId is no longer present in the query string (only in the fragment).
This allows the extension server to serve up the same version of the page to a returning browser (HTTP 304).

You need to do some work to enable caching on your extension server.

1.  There is a property `Cacheability` on your implementation of the `Microsoft.Portal.Framework.ExtensionDefinition` class.

1.  By default its value is `ExtensionIFrameCacheability.None`

1.  At the very least you should be able to set it to `ExtensionIFrameCacheability.Server`

Making this change assumes that you do not change the way your home page is rendered dynamically (different output for different requests).
It assumes that if you do change the output, you only do so by also incrementing the value of Microsoft.Portal.Framework.ApplicationContext.Version.
Note: In this mode, if you make live updates to your extension without bumping the version, some chunk of your customers may not see those for a while because of caching.


<a name="extension-homepage-caching-client-side-caching-of-extension-home-pages"></a>
### Client-side caching of extension home pages

The above version of the feature only enables server side caching.
But there could be even more benefits if we could somehow cache on the client (avoid the network call altogether).

So we have added support for caching extension home pages in the browser itself.
This can allow your extension to load with *ZERO* network calls from the browser (for a returning user).
We believe that this should give us further performance and reliability improvements (fewer network calls => fewer network related errors).

To enable this, here are the steps you need to take:

1.  Move to a version of the SDK newer than 5.0.302.121.

1.  Implement [persistent caching of your scripts](portalfx-extension-persistent-caching-of-scripts.md).
    You should do this any way to improve extension reliability.
    If you do not do this, you will see higher impact on reliability as a result of home page caching.

1.  Ensure that your implementation of `Microsoft.Portal.Framework.ApplicationContext.GetPageVersion()` returns a *stable* value per build of your extension.
    We implement this for your extension by default for you by using the version of your assembly.
    If this value changes between different servers of the same deployment, the home page caching will not be very effective.
    Also if this value does not change between updates to your extension, then existing users will continue to load the previous version of your extension even after you update.

1.  In your implementation of `Microsoft.Portal.Framework.ExtensionDefinition` update this property:

    ```cs
    public override ExtensionIFrameCacheability Cacheability
    {
        get
        {
            return ExtensionIFrameCacheability.Manifest;
        }
    }
    ```

1.  <a href="mailto:ibizafxpm@microsoft.com?subject=[Manifest Caching] on &lt;ExtensionName&gt; &body=Hi, we have enabled manifest caching on &lt;ExtensionName&gt; please make the appropriate portal change">Contact the Portal team</a>
     or submit a [Work Item Request](https://aka.ms/cachemanifest) so we can update the value from our side.  
    Sorry about this step.
    We added it to ensure backward compatibility.
    When all extensions have moved to newer SDKs, we can eliminate it.

<a name="extension-homepage-caching-implications-of-client-side-caching"></a>
### Implications of client side caching

1.  An implication of this change is that when you roll out an update to your extension, it might take a couple of hours for it to reach all your customers.
    But the reality is that this can occur even with the existing deployment process.
    If a user has already loaded your extension in their session, they will not really get your newer version till they F5 anyway.
    So extension caching adds a little more latency to this process.

1.  If you use this mechanism, you cannot use extension versioning to roll out breaking changes to your extension.
    Instead, you should make server side changes in a non-breaking way and keep earlier versions of your server side code running for a few days.

We believe that the benefits of caching and fast load time generally outweigh these concerns.

<a name="extension-homepage-caching-how-this-works"></a>
### How this works

We periodically load your extensions (from our servers) to get their manifests.
We call this "manifest cache". The cache is updated every few minutes.
This allows us to start up the portal without loading every extension to find out very basic information about it (like its name and its browse entry/entries, etc.)
When the extension is actually interacted with, we still load the latest version of its code, so the details of the extension should always be correct (not the cached values).
So this works out as a reasonable optimization.
With the newer versions of the SDK, we include the value of GetPageVersion() of your extension in its manifest.
We then use this value when loading your extension into the portal (see the pageVersion part of the query string below).
So your extension URL might end up being something like:

```
https://YourExtension.contoso.com/
    ?extensionName=Your_Extension
    &shellVersion=5.0.302.85%20(production%23444e261.150819-1426)
    &traceStr=
    &pageVersion=5.0.202.18637347.150928-1117
    &l=en.en-us
    &trustedAuthority=portal.azure.com%3A
    #ece19d8501fb4d2cbe10db84b844c55b
```

On the server side, we match the value of pageVersion with the current value of ApplicationContext.GetPageVersion().
If those values match, we set the page to be browser cacheable for a long time (1 month).
If the values do not match we set no caching at all on the response.
The no-caching case could happen during an upgrade, or if you had an unstable value of ApplicationContext.GetPageVersion()).
This should provide a reliable experience even when through updates.
When the caching values are set, the browser will not even make a server request when loading your extension for the second time.

You will notice that we include the shellVersion also in the query string of the URL.
This is just there to provide a mechanism to bust extension caches if we needed to.

<a name="extension-homepage-caching-how-to-test-your-changes"></a>
### How to test your changes

You can verify the behavior of different caching modes in your extension by launching the portal with the following query string:

```
https://portal.azure.com/
    ?Your_Extension=cacheability-manifest
    &feature.canmodifyextensions=true
```

This will cause the extension named "Your_Extension" to load with "manifest" level caching (instead of its default setting on the server.
You also need to add "feature.canmodifyextensions=true" so that we know that the portal is running in test mode.  

To verify that the browser serves your extension entirely from cache on subsequent requests:

- Open F12 developer tools, switch to the network tab, filter the requests to only show "documents" (not JS, XHR or others).
- Then navigate to your extension by opening one of its blades, you should see it load once from the server.
- You will see the home page of your extension show up in the list of responses (along with the load time and size).
- Then F5 to refresh the portal and navigate back to your extension. This time when your extension is served up, you should see the response served with no network activity. The response will show "(from cache)".  If you see this manifest caching is working as expected.

<a name="extension-homepage-caching-co-ordinating-these-changes-with-the-portal"></a>
### Co-ordinating these changes with the portal

Again, if you do make some of these changes, you still need to coordinate with the portal team to make sure that we make corresponding changes on our side too.
Basically that will tell us to stop sending your extension the sessionId part of the query string in the URL (otherwise caching does not help at all).
Sorry about this part, we had to do it in order to stay entirely backward compatible/safe.


<a name="persistent-caching-of-scripts-across-extension-updates"></a>
## Persistent Caching of scripts across extension updates

<properties
    title=""
    pageTitle="Performance - Persistent Caching of scripts across extension updates" 
    description=""
    authors="madjos" />

<a name="persistent-caching-of-scripts-across-extension-updates-making-sure-that-scripts-are-available-across-extension-updates"></a>
### Making sure that scripts are available across extension updates

One problem that can impact reliability of extensions is scripts failing to load.
And one corner case where this problem can occur is when update your extensions.

Suppose you have V1 of your extension deployed to production and it references a script file /Content/Script_A_SHA1.js We add the SHA1 to ensure maximum cacheability of the script.
Now a user visits the portal and starts interacting with your V1 extension.
They haven’t yet started loading Script_A_SHA1.js perhaps because it is only used by a different blade.
At this time you update the extension server to V2.
The update includes a change to Script_A so now its URL becomes /Content/Script_A_SHA2.js.
Now when the user does visit that blade, Script_A_SHA1.js is no longer on your server and the request to fetch it from the browser will most likely result in a 404.
The use of a CDN might reduce the probability of this occurring. And you should use a CDN.
But these user actions can occur over several hours and the CDN does not guarantee keeping data around (for any duration let alone hours).
So this problem can/does still occur.

To avoid this issue, you can implement a class that derives from `Microsoft.Portal.Framework.IPersistentContentCache`

On your extension server. The simplest way to do this is to derive from `Microsoft.Portal.Framework.BlobStorageBackedPersistentContentCache` 

And MEF export your implementation. That is decorate it with:

```cs 
[Export(typeof(Microsoft.Portal.Framework.IPersistentContentCache))]
```

You just need to provide it a storage account connection string that can be used to store the scripts.
Keep the storage account the same across upgrades of your extension.

We save all your JavaScript, CSS, and image files (basically anything under /Content/...) in this cache to make upgrades smoother.

The storage account is a third layer cache.
Layer 1 is CDN.
Layer 2 is in memory in your extension server.
So it should get hit very rarely and once read, it should warm up the other layers.
So we don't think you need to geo-distribute this layer.
If we detect that it is getting hit too often, we will come up with a geo-distribution strategy.
If you do use one account per region to handle this, you will need to find a way to synchronize them.
You could do this by using a custom implementation of the `Microsoft.Portal.Framework.IPersistentContentCache` interface.

<a name="persistent-caching-of-scripts-across-extension-updates-example-implementation-as-done-in-hubsextension"></a>
### Example implementation as done in HubsExtension

```cs 

using System;
using System.ComponentModel.Composition;
using Microsoft.Portal.Framework;

namespace <your.extension.namespace>
{
    /// <summary>
    /// The configuration for hubs content caching.
    /// </summary>
    [Export(typeof(HubsBlobStorageBackedContentCacheSettings))]
    internal class HubsBlobStorageBackedContentCacheSettings : ConfigurationSettings
    {
        /// <summary>
        /// Gets the hubs content cache storage connection string.
        /// </summary>
        [ConfigurationSetting(DefaultValue = "")]
        public SecureConfigurationConnectionString StorageConnectionString
        {
            get;
            private set;
        }
    }

    /// <summary>
    /// Stores content in blob storage as block blobs.
    /// Used to ensure that cached content is available to clients
    /// even when the extension server code is newer/older than the content requested.
    /// </summary>
    [Export(typeof(IPersistentContentCache))]
    internal class HubsBlobStorageBackedContentCache : BlobStorageBackedPersistentContentCache
    {
        /// <summary>
        /// /// Creates an instance of the cache.
        /// </summary>
        /// <param name="applicationContext"> Application context which has environment settings.</param>
        /// <param name="settings"> The content cache settings to use.</param>
        /// <param name="tracer"> The tracer to use for any logging.</param>
        [ImportingConstructor]
        public HubsBlobStorageBackedContentCache(
            ApplicationContext applicationContext,
            HubsBlobStorageBackedContentCacheSettings settings,
            ICommonTracer tracer)
            :base(settings.StorageConnectionString.ToString(), "HubsExtensionContentCache", applicationContext, tracer)
        {
        }
    }
}

```

web.config

```xml

    <add key="<your.extension.namespace>.HubsBlobStorageBackedContentCacheSettings.StorageConnectionString" value="" />

```

<a name="persistent-caching-of-scripts-across-extension-updates-verfiying-that-persistent-caching-is-working"></a>
### Verfiying that persistent caching is working

- Deploy a version of your extension. Examine the scripts it loads, they will be of the form `prefix<sha hash>suffix.js`
- Use a blob explorer of your preference and verify that the scripts have been written to blob storage.
- Then make changes to TS files in your solution, build and deploy a new version of your extension.
- Look for scripts that have the same prefix and suffix but a different hash.
- For those scripts try to request the original URL (from step 1) from your extension server (not via the cdn).
- The script should still get served, but this time it is coming from the persistent cache.

<a name="run-portalcop-to-identify-and-resolve-common-performance-issues"></a>
## Run portalcop to identify and resolve common performance issues

<a name="portalcop"></a>
## PortalCop
The Portal Framework team has built a tool called PortalCop that can help reduce code size and remove redundant RESX entries.

<a name="portalcop-installing-portalcop"></a>
### Installing PortalCop

Run the following command in the NuGet Package Manager Console.

```
Install-Package PortalFx.PortalCop -Source https://msazure.pkgs.visualstudio.com/DefaultCollection/_packaging/Official/nuget/v3/index.json -Version 1.0.0.339
```

Or run the following in a Windows command prompt.

```
nuget install PortalFx.PortalCop -Source https://msazure.pkgs.visualstudio.com/DefaultCollection/_packaging/Official/nuget/v3/index.json -Version 1.0.0.339
```

<a name="portalcop-running-portalcop"></a>
### Running PortalCop

<a name="portalcop-running-portalcop-namespace-mode"></a>
#### Namespace Mode

NOTE: If you do not use AMD, please do not run this mode in your codebase.

If there are nested namespaces in code (for example A.B.C.D) the minifier will only reduce the top level (A) name, leaving all remaining names uncompressed.

Example of uncompressible code and minified version
        MsPortalFx.Base.Utilities.SomeFunction(); -> a.Base.Utilities.SomeFunction();

As you implement your extension using our Framework, you may have done some namespacing import to help achieve better minification, like this:
        Import FxUtilities = MsPortalFx.Base.Utilities;

which yields a better minified version
        FxUtilities.SomeFunction(); -> a.SomeFunction();

In the Namespace mode, the PortalCop tool will normalize imports to the Fx naming convention. It won’t collide with any predefined names you defined. Using this tool, we achieved up to 10% code reduction in most of the Shell codebase.

Review the changes after running the tool. Especially, be wary of string content changes. The tool does string mapping, not syntax based replacement.
 
```
   portalcop Namespace
```

<a name="portalcop-running-portalcop-resx"></a>
#### Resx

To reduce code size and save on localization costs, you can use the PortalCop RESX mode to find unused/redundant resx strings. 

```
To list unused strings:
   portalcop Resx
   
To list and clean *.resx files:
    portalcop Resx AutoRemove
```

Constraints:

- The tool may incorrectly flag resources as being un-used if your extension uses strings in unexpected formats. 
  For example, if you try to dynamically read from resx based on string values.
    
  Utils.getResourceString(ClientResources.DeploymentSlots, slot)));
  export function getResourceString(resources: any, value: string): string {
        var key = value && value.length ? value.substr(0, 1).toLowerCase() + value.substr(1) : value;
        return resources[key] || value;
   }

- You need to review the changes after running the tool and make sure that they are valid because of the above constraint.
- If using the AutoRemove option, you need to open up the RESX files in VisualStudio to regenerate the Designer.cs files.
- If you find any more scenarios that the tool incorrectly identifies as unused please report to [Ibiza Fx PM](mailto:ibizafxpm@microsoft.com)


<a name="performance-alerting"></a>
## Performance alerting

Coming soon please reach out to sewatson if you are interested.

[TelemetryOnboarding]: <portalfx-telemetry-getting-started>
[Ext-Perf/Rel-Report]: <http://aka.ms/portalfx/dashboard/extensionperf>
[portalfx-cdn]: <portalfx-cdn>
* [Working with data](#working-with-data)
    * [Master details browse scenario](#working-with-data-master-details-browse-scenario)
        * [The MasterDetail Area and DataContext](#working-with-data-master-details-browse-scenario-the-masterdetail-area-and-datacontext)
        * [The websites QueryCache and EntityCache](#working-with-data-master-details-browse-scenario-the-websites-querycache-and-entitycache)
        * [Implementing the master view](#working-with-data-master-details-browse-scenario-implementing-the-master-view)
        * [Implementing the detail view](#working-with-data-master-details-browse-scenario-implementing-the-detail-view)
        * [A bird's-eye view of Data](#working-with-data-master-details-browse-scenario-a-bird-s-eye-view-of-data)
        * [Shared data access using **DataContext**](#working-with-data-master-details-browse-scenario-shared-data-access-using-datacontext)
        * [Organizing your extension source code into **Areas**](#working-with-data-master-details-browse-scenario-organizing-your-extension-source-code-into-areas)
        * [Developing a **DataContext** for your Area](#working-with-data-master-details-browse-scenario-developing-a-datacontext-for-your-area)
        * [Using **DataCache** to load and cache data](#working-with-data-master-details-browse-scenario-using-datacache-to-load-and-cache-data)
        * [**DataView** is for memory management](#working-with-data-master-details-browse-scenario-dataview-is-for-memory-management)
        * [Summary](#working-with-data-master-details-browse-scenario-summary)
    * [Querying for data](#working-with-data-querying-for-data)
    * [Loading Data](#working-with-data-loading-data)
        * [Controlling the AJAX call with `supplyData`](#working-with-data-loading-data-controlling-the-ajax-call-with-supplydata)
        * [Optimize number CORS preflight requests to ARM using invokeApi](#working-with-data-loading-data-optimize-number-cors-preflight-requests-to-arm-using-invokeapi)
        * [Reusing loaded/cached data with `findCachedEntity`](#working-with-data-loading-data-reusing-loaded-cached-data-with-findcachedentity)
        * [Ignore redundant data with `cachedAjax()`](#working-with-data-loading-data-ignore-redundant-data-with-cachedajax)
        * [Making authenticated AJAX calls](#working-with-data-loading-data-making-authenticated-ajax-calls)
    * [Using DataViews](#working-with-data-using-dataviews)
    * [Observable map & filter](#working-with-data-observable-map-filter)
    * [Shaping and filtering data](#working-with-data-shaping-and-filtering-data)
        * [Understanding observable map() and mapInto()](#working-with-data-shaping-and-filtering-data-understanding-observable-map-and-mapinto)
        * [Using Knockout projections](#working-with-data-shaping-and-filtering-data-using-knockout-projections)
        * [Chaining uses of `map` and `filter`](#working-with-data-shaping-and-filtering-data-chaining-uses-of-map-and-filter)
        * [Anti-patterns and best practices](#working-with-data-shaping-and-filtering-data-anti-patterns-and-best-practices)
    * [Auto-refreshing client-side data (a.k.a. 'polling')](#working-with-data-auto-refreshing-client-side-data-a-k-a-polling)
    * [Data merging](#working-with-data-data-merging)
        * [Data merging **caveats**](#working-with-data-data-merging-data-merging-caveats)
    * [Explicitly/proactively reflecting server data changes on the client](#working-with-data-explicitly-proactively-reflecting-server-data-changes-on-the-client)
        * [Refreshing or updating a **QueryCache/EntityCache**](#working-with-data-explicitly-proactively-reflecting-server-data-changes-on-the-client-refreshing-or-updating-a-querycache-entitycache)
        * [Refreshing a **QueryView/EntityView**](#working-with-data-explicitly-proactively-reflecting-server-data-changes-on-the-client-refreshing-a-queryview-entityview)
    * [Querying for virtualized data](#working-with-data-querying-for-virtualized-data)
    * [Before Getting Started](#working-with-data-before-getting-started)
    * [Type metadata](#working-with-data-type-metadata)
        * [Authored type metadata](#working-with-data-type-metadata-authored-type-metadata)
        * [C# to TypeScript code generation approach](#working-with-data-type-metadata-c-to-typescript-code-generation-approach)
    * [FAQ](#working-with-data-faq)
        * [I onboarded to TypeMetadata a long time ago and have been told to onboard to the ExtensionLoad Optimized route.](#working-with-data-faq-i-onboarded-to-typemetadata-a-long-time-ago-and-have-been-told-to-onboard-to-the-extensionload-optimized-route)
    * [Data atomization](#working-with-data-data-atomization)


<a name="working-with-data"></a>
# Working with data

- Master/details browse - How to share data across a parent blade that shows a list of 
resources and a child blade that shows details about an individual resource 

	
<a name="working-with-data-master-details-browse-scenario"></a>
## Master details browse scenario

The code for this example comes from the 'master detail browse' sample in SamplesExtension. The code lives in:
`\Client\MasterDetail\MasterDetailArea.ts`
`\Client\MasterDetail\MasterDetailBrowse\MasterDetailBrowse.pdl`
`\Client\MasterDetail\MasterDetailBrowse\MasterDetailBrowseData.ts`
`\Client\MasterDetail\MasterDetailBrowse\ViewModels\DetailViewModels.ts`
`\Client\MasterDetail\MasterDetailBrowse\ViewModels\MasterViewModels.ts`

The scenario modeled by this sample is one in which we want to retreive information from the server (a list of websites) and
visualize this data across multiple blades. We'll cache the data from the server using a QueryCache and then use that QueryCache
to visualize the websites across two blades. The first blade will show the list of websites in a grid. When the user activates
one of those websites we'll open a second blade to show more details about the activated website. The data for both blades will
be from the QueryCache we create. That saves us from having to query the server again when the second blade is opened and means
when data in the QueryCache is updated that update is reflected across all blades at the same time. This ensures the user is always
presented with a consistent view of the data.

<a name="working-with-data-master-details-browse-scenario-the-masterdetail-area-and-datacontext"></a>
### The MasterDetail Area and DataContext
The portal uses a concept calls an Area to hold the QueryCache and other data objects that will be shared across multiple blades.
To create an Area create a folder named for the area you're creating (`MasterDetail` in this case) inside your extension's `Client` folder.
Inside the folder create a typescript file with the area name that ends in `Area` (so `MasterDetailArea.ts` in our example).
This file holds a DataContext class. This DataContext is the class that will be passed to all the view models associated with the area.
The DataContext for the MasterDetail Area contains the following:

```typescript

/**
* Context for data samples.
*/
@Di.Class()
export class DataContext {
   /**
    * This QueryCache will hold all the website data we get from the website controller.
    */
   public websitesQuery: QueryCache<WebsiteModel, WebsiteQueryParams>;

   /**
    * Provides a cache that will enable retrieving a single website.
    */
   public websiteEntities: EntityCache<WebsiteModel, number>;

   /**
    * Provides a cache for persisting edits against a website.
    */
   public editScopeCache: EditScopeCache<WebsiteModel, number>;

```

The QueryCache and the EntityCache are the two memebers relevant for the browse scenario we're going over. The DataContext also
contains an EditScopeCache which is used in the master detail edit scenario.

If you're creating a new Area one more step that needs to be done is to edit your `Program.ts` file to create the DataContext when your
extension is loaded. Find the `initializeDataContexts` method and then use the `setDataContextFactory` method to set the DataContext like so:

```typescript
        this.viewModelFactories.V1$$MasterDetail().setDataContextFactory<typeof MasterDetailV1>(
            "./V1/MasterDetail/MasterDetailArea",
            (contextModule) => new contextModule.DataContext());
```

<a name="working-with-data-master-details-browse-scenario-the-websites-querycache-and-entitycache"></a>
### The websites QueryCache and EntityCache
Now that we've gone over the DataContext that is be available to all blades in the Area let's go over the data caches we'll use
in the master/detail browse scenario.

The first is the QueryCache. We use a QueryCache to cache a list of items as opposed to an EntityCache which caches a single item.

```typescript

this.websitesQuery = new QueryCache<WebsiteModel, WebsiteQueryParams>({
    entityTypeName: WebsiteModelMetadata.name,

    // when fetch() is called on the cache the params will be passed to this function and it
    // should return the right URI for getting the data
    sourceUri: (params: WebsiteQueryParams): string => {
        let uri = MsPortalFx.Base.Resources.getAppRelativeUri("/api/Websites");

        // if runningStatus is null we should get all websites
        // if a value was provided we should get only websites with that running status
        if (params.runningStatus !== null) {
            uri += "?$filter=Running eq " + params.runningStatus;
        }

        // this particular controller expects a sessionId as well but this is not the common case.
        // Unless your controller also requires a sessionId this can be omitted
        return Util.appendSessionId(uri);
    },
});

```

When we create the QueryCache to hold the websites we specify two things:

1. The name of entityType for a website. The QueryCache needs to know the shape of the data contained in it (which is defined by the
entity type) to handle the data appropriately.

2. A function that, given a set of parameters passed to a `fetch` call, returns the URI to populate the cache. In this case `runningStatus`
is the only parameter we have to deal with. Based on it's presense we'll modify the URI to query for the correct data.

For this sample that's all we need to do to configure the QueryCache. The QueryCache will be populated as we create Views over the cache
and call fetch() on them.

The other cache used in this sample is the EntityCache:

```typescript

this.websiteEntities = new EntityCache<WebsiteModel, number>({
    entityTypeName: WebsiteModelMetadata.name,

    // uriFormatter() is a function that helps you fill in the parameters passed by the fetch()
    // call into the URI used to query the backend. In this case websites are identified by a number
    // which uriFormatter() will fill into the id spot of this URI. Again this particular endpoint
    // requires the sessionId parameter as well but yours probably doesn't.
    sourceUri: FxData.uriFormatter(Util.appendSessionId(MsPortalFx.Base.Resources.getAppRelativeUri("/api/Websites/{id}")), true),

    // this property is how the EntityCache looks up a website from the QueryCache. This way we share the same
    // data object across multiple views and make sure updates are reflected across all blades at the same time
    findCachedEntity: {
        queryCache: this.websitesQuery,
        entityMatchesId: (website, id) => {
            return website.id() === id;
        },
    },
});

```

When creating the EntityCache for this example we specify three things:

1. The entityType name again so the cache can reason over the data.

2. The `sourceUri` property. Again this is a function that given the parameters from a `fetch()` call will return the URI the cache
should use to get the data. In this case we've used the `MsPortalFx.Data.uriFormatter()` helper method. This method will handle
the business of filling one or more parameters into the URI provided to it. In this case we only have one parameter, the `id` parameter,
which will be filled into the part of the URI containing `{id}`.

3. The `findCachedEntity` property. This is an optional property that allows us to look up an entity from the QueryCache rather than
going to the server and creating a second copy of the website data on the client. The two properties here are the QueryCache to use
and a function that given a item from the QueryCache will return say whether this is the object requested by the parameters to the
fetch call.

<a name="working-with-data-master-details-browse-scenario-implementing-the-master-view"></a>
### Implementing the master view
Now let's get in to how to visualize the data in the caches. The first step is to make sure the PDL that defines the blades
specifies the right Area so your view models receive your DataContext. In the `<Definition>` tag at the top of the PDL file
include an Area attribute whose value corresponds to the name of your Area:

```xml

<Definition xmlns="http://schemas.microsoft.com/aux/2013/pdl"
Area="V1/MasterDetail">

```

The view model for the websites list is in `\Client\MasterDetail\MasterDetailBrowse\ViewModels\MasterViewModels.ts`. You'll notice
one of the first things the blade does is create a view on the QueryCache:

```typescript

this._websitesQueryView = dataContext.websitesQuery.createView(container);

```

The view is how you call `fetch()` to populate the QueryCache and also how you view the items returned by the fetch call. Note that
you may have multiple views over the same QueryCache. This happens when you have multiple blades on the screen at the same time
visualizing data from the same cache. The advantage of using views is it allows the QueryCache to handle the caching/refreshing/evicting
of data for you.

There are two controls on this blade and they both make use of the view we created. The grid visualizes the data in the QueryCache and
the OptionGroup control that allows the user to pick whether they want to see only websites that are in a running state, websites in
a stopped state or both. We'll start by looking at how the grid is hooked up to the QueryCache then we'll examine how the OptionGroup
control works.

We pass the view's observable `items` array to the grid constructor as the `items` parameter:

```typescript

this.grid = new Grid.ViewModel<WebsiteModel, number>(this._lifetime, this._websitesQueryView.items, extensions, extensionsOptions);

```

It's okay that we haven't issued a `fetch()` on the QueryCache yet. Whenever the first `fetch` (or any subsequent fetch) is issued
the view's `items` array will be observably updated which will populate the grid with the results.

As is standard practice we'll call the view's `fetch` method on the blade's `onInputsSet()` and return the promise:

```typescript

/**
 * Invoked when the blade's inputs change
 */
public onInputsSet(): MsPortalFx.Base.Promise {
    return this._websitesQueryView.fetch({ runningStatus: this.runningStatus.value() });
}

```

That's enough to populate the QueryCache with items from the server and show them in the grid.

Now let's look at the OptionsGroup. We initialize the control and then subscribe to it's value property:

```typescript

this.runningStatus.value.subscribe(this._lifetime, (newValue) => {
    this.grid.loading(true);
    this._websitesQueryView.fetch({ runningStatus: newValue })
        .finally(() => {
            this.grid.loading(false);
        });
});

```

In the subscription we do the following:

1. Put the grid in a loading mode while we get the new data.
2. Request the new data by calling `fetch()` on the data view with new parameters.
3. Wait until fetch is done and take the grid out of loading mode.

There's no need to try to get the results of the fetch and replace the items in the grid because we've pointed the grid's items
array to the items array of the view. The view will update it's items array as soon as the fetch is complete.

If you look through the rest of the code you'll see we've configured the grid to activate any of the websites when they're clicked on.
We'll pass the 'id' of the website that is activated to the details blade as an input.

<a name="working-with-data-master-details-browse-scenario-implementing-the-detail-view"></a>
### Implementing the detail view
The detail view will use the EntityCache (which we hooked up to our QueryCache) from the DataContext to display the details of a
website. Once you understand what's going on in the master blade you should have a pretty good handle of what's going on here.
The blade starts by creating an view on the EntityCache:

```typescript

this._websiteEntityView = dataContext.websiteEntities.createView(container);

```

Then in the `onInputsSet` we call `fetch` passing the ID of the website we want the data for:

```typescript

/**
 * Invoked when the blade's inputs change.
 */
public onInputsSet(inputs: Def.BrowseDetailViewModel.InputsContract): MsPortalFx.Base.Promise {
    return this._websiteEntityView.fetch(inputs.currentItemId);
}

```

When the fetch is completed the data will be available in the view's `item` property. This blade uses the `text` data-binding in it's
HTML template to show the name, id and running status of the website but obviously you could do whatever you want with the item.

- [Overview](portalfx-data-overview.md)
- [Configuring the data cache](portalfx-data-configuringdatacache.md)
- [Loading data](portalfx-data-loadingdata.md)
- [Consuming data](portalfx-data-dataviews.md)
- [Shaping data](portalfx-data-projections.md)
- [Refreshing cached data](portalfx-data-refreshingdata.md)
- [Virtualized data for the grid](portalfx-data-virtualizedgriddata.md)
- [Typemetadata](portalfx-data-typemetadata.md)
- Advanced topics
    - [Data atomization](portalfx-data-atomization.md)

- Overview
	## Overview

The design of the Azure Portal UX provides unique challenges in regards to data access. Many Blades and Parts may be displayed at the same time, each instantiating a new view model instance, each view model often needing access to the same or related data. To optimize for these interesting data-access patterns, Azure Portal extensions follow a specific design pattern that consists of:

* **Data-management** - [DataContexts](#data-overview-data-context), [DataCaches](#data-overview-data-cache), [DataViews](#data-overview-data-view)
* **Code organization** - [Areas](#data-overview-areas)

<a name="working-with-data-master-details-browse-scenario-a-bird-s-eye-view-of-data"></a>
### A bird&#39;s-eye view of Data

It can be difficult from documentation alone to piece together how the various Data concepts collectively achieve the goals of efficient data-loading/updating and effective memory-management for an extension. Here is a quick, animated walk-through of how the pieces fit together and how this design relates to the Azure Portal's adaptation of the conventional MVVM pattern for extension Blades and Parts.

[Data architecture PowerPoint](https://auxdocs.blob.core.windows.net/media/DataArchitecture.pptx)

What follows is the next level of detail behind these concepts and how to apply them to an Azure Portal extension.

<a name="data-overview-data-context"></a>
<a name="working-with-data-master-details-browse-scenario-shared-data-access-using-datacontext"></a>
### Shared data access using <strong>DataContext</strong>

For each [Area](#data-overview-areas) in an extension, there is a **singleton DataContext** instance that supports access to shared data (that is, data [loading](portalfx-data-loadingdata.md), [caching](portalfx-data-configuringdatacache.md), [refreshing and updating](portalfx-data-refreshingdata.md)) for the Blades and Parts implemented in that Area. Wherever muliple Blades and Parts make use of common server data, the DataContext is an ideal place to locate data loading/updating logic for an extension Area.

When a Blade or Part view model is instantiated, its constructor is supplied with a reference to the DataContext singleton instance for the associated extension Area.  In the Blade or Part view model constructor, the view model accesses the data required by that Blade or Part.

```typescript

constructor(container: MsPortalFx.ViewModels.ContainerContract, dataContext: MasterDetailArea.DataContext) {
    super();

    this.title(ClientResources.masterDetailEditMasterBladeTitle);
    this.subtitle(ClientResources.masterDetailEditMasterBladeSubtitle);

    this._view = dataContext.websitesQuery.createView(container);
    
```

The benefits of centralizing data access in a singleton DataContext include:

  * **Caching/Sharing** - The DataContext singleton instance will live as long as the extension is loaded in the browser, so when a Blade is opened (and, consequently, a new Blade view model is instantiated), data required by the new Blade will often *already be loaded and cached in the DataContext*, as required by some previously opened Blade or rendered Part. Not only will this cached data be available *immediately* - optimizing rendering performance, perceived responsiveness - but also *no new AJAX calls* are unnecessary to load the data for the newly-opened Blade - reducing server load and COGs.
  * **Consistency** - It is very common for multiple Blades and Parts to render the same data (just in different detail, with different presentation). Moreover, there are situations where such Blades/Parts can be seen on the screen at the same time - or separated in time only by a single user navigation. In such cases, the user will expect to see all their Blades and Parts depicting the *exact same state of the user's data*. An effective way to achieve this consistency is to load only *a single copy of the data*, which is what DataContext is designed to do.
  * **Fresh data** - Users expect to see data in Blades and Parts that always reflects the state of their data in the cloud (and not stale or out-of-date data). Another benefit of loading and caching data in a single location is that the cached data can be regularly updated to accurately reflect the state of server data. See more details on refreshing data [here](portalfx-data-refreshingdata.md).

<a name="data-overview-areas"></a>
<a name="working-with-data-master-details-browse-scenario-organizing-your-extension-source-code-into-areas"></a>
### Organizing your extension source code into <strong>Areas</strong>

Areas provide an easy way to partition your extension source code, making it simpler to develop an extension with a sizable team. Areas are largely a scheme for organizing extension source code, but they do impact how DataContexts are used in an extension. In the same way that extensions employ Areas in a way that collects related Blades and Parts, each Area also maintains *the data* required by these Blades and Parts. Every extension Area gets a distinct DataContext singleton, and the DataContext typically loads/caches/updates data of a few model types necessary to support the Area's Blades and Parts.

An area is defined in your extension by taking a few steps:

  * Create a folder in your `Client\` directory. The name of that folder is the name of your area.
  * In the root of that folder, create a DataContext (see below) named `[AreaName]Area.ts`, where `[AreaName]` is the name of the folder you just created. For example, the DataContext for the 'Security' area in the sample is located at `\Client\Security\SecurityArea.ts`.

A typical extension resembles:

![Extensions can host multiple areas][extension-areas]

From a code organization standpoint, you can think of an Area as little more than a project-level folder. However, it becomes quite important when you start segmenting out data operations within your extension.

<a name="working-with-data-master-details-browse-scenario-developing-a-datacontext-for-your-area"></a>
### Developing a <strong>DataContext</strong> for your Area

Typically, the DataContext associated with a particular Area is instantiated from the '`initialize()`' method of '`\Client\Program.ts`', the entry point of your extension:

```typescript
        this.viewModelFactories.V1$$MasterDetail().setDataContextFactory<typeof MasterDetailV1>(
            "./V1/MasterDetail/MasterDetailArea",
            (contextModule) => new contextModule.DataContext());
```

There is a single DataContext class per Area. That class is - by convention - to be named '`[AreaName]Area.ts`'. For example, the 'MasterDetail' area of the samples has a '`MasterDetailArea.ts`' file created at the following location:

`\Client\MasterDetail\MasterDetailArea.ts`

```typescript

/**
* Context for data samples.
*/
@Di.Class()
export class DataContext {
   /**
    * This QueryCache will hold all the website data we get from the website controller.
    */
   public websitesQuery: QueryCache<WebsiteModel, WebsiteQueryParams>;

   /**
    * Provides a cache that will enable retrieving a single website.
    */
   public websiteEntities: EntityCache<WebsiteModel, number>;

   /**
    * Provides a cache for persisting edits against a website.
    */
   public editScopeCache: EditScopeCache<WebsiteModel, number>;

```

You may notice that the DataContext class does not dictate the use of any FX base class or interface. In practice, the members of a DataContext class are typically:

* **DataCache classes** - The Azure Portal FX DataCache classes (`QueryCache`, `EntityCache` and the less-common `EditScopeCache`) are a simple and full-featured way of loading/caching data used by Blade and Part view models.
* **CRUD methods** (create, replace, update, delete) - Commands available on Blades and Parts often modify server data. These commands should be implemented in terms of methods on the DataContext class, where each method can issue AJAX calls and [reflect server changes](portalfx-data-refreshingdata.md) in associated DataCaches.

<a name="data-overview-data-cache"></a>
<a name="working-with-data-master-details-browse-scenario-using-datacache-to-load-and-cache-data"></a>
### Using <strong>DataCache</strong> to load and cache data

The DataCache classes are a convenient way to load and cache data required by Blade and Part view models. These are designed to match typical data consumption requirements of Blade and Part view models:

* **QueryCache** - Loads data of type `Array<T>` according to an extension-specified `TQuery` type. `QueryCache` is useful for loading data for *list-like views* like Grid, List, Tree, Chart, etc..
* **EntityCache** - Loads data of type `T` according to some extension-specified `TId` type. `EntityCache` is useful for loading data into property views and *single-record views*.
* (Less commonly used) **EditScopeCache** - Loads and manages instances of EditScope, which is a change-tracked, editable model [for use in Forms](portalfx-forms-working-with-edit-scopes.md).

From an API perspective these DataCache classes all share the same API and usage patterns:

* **Step 1** - In a DataContext, the extension **creates and [configures](portalfx-data-configuringdatacache.md) DataCache instances**. Briefly, configuration includes:

    * How to load data when it is missing from the cache
    * How to implicitly refresh cached data, to keep it consistent with server state
    * Etc.

```typescript

this.websiteEntities = new MsPortalFx.Data.EntityCache<WebsiteModel, number>({
    entityTypeName: WebsiteModelMetadata.name,
    sourceUri: MsPortalFx.Data.uriFormatter(Util.appendSessionId(DataShared.websiteByIdUri), true),
    findCachedEntity: {
        queryCache: this.websitesQuery,
        entityMatchesId: (website, id) => {
            return website.id() === id;
        },
    },
});

```

* **Step 2** - In its constructor, each Blade and Part view model **creates a DataView** with which to load and refresh data for the Blade/Part.

```typescript

this._websiteEntityView = dataContext.websiteEntities.createView(container);

```

* **Step 3** - When the Blade/Part view model receives its parameters in '`onInputsSet`', the view model **calls '`dataView.fetch()`'** to load data.

```typescript

/**
 * Invoked when the blade's inputs change
 */
public onInputsSet(): MsPortalFx.Base.Promise {
    return this._websitesQueryView.fetch({ runningStatus: this.runningStatus.value() });
}

```

A detailed walk-through of a scenario employing these concepts can be found [here](portalfx-data-masterdetailsbrowse.md).

<a name="data-overview-data-view"></a>
<a name="working-with-data-master-details-browse-scenario-dataview-is-for-memory-management"></a>
### <strong>DataView</strong> is for memory management

**Memory management is very important in the Azure Portal, as memory overuse by N different extensions has been found to impact the user-perceived responsiveness of the Azure Portal.**

Each DataCache instance manages a set of *cache entries*, and DataCache includes automatic mechanisms to manage the number of cache entries present at a given time. This is important because DataCaches in an Area's DataContext will live as long as an extension is loaded, supporting potentially many Blades and Parts that will come and go as the user navigates in the Azure Portal.

When a view model calls '`fetch(...)`' on its DataView, this '`fetch(...)`' call implicitly forms a ref-count to a DataCache cache entry, *pinning* the entry in the DataCache as long as the Blade/Part view model itself is alive (or, rather, hasn't been '`dispose()`'d by the FX). When all Blade/Part view models are disposed that hold ref-counts (indirectly, via DataView) to the same cache entry, the DataCache can elect to evict/discard the cache entry. In this way, the DataCache can manage its size *automatically* (without explicit extension code).

<a name="working-with-data-master-details-browse-scenario-summary"></a>
### Summary

For more information on using the data APIs in the portal framework, read the documentation on [working with data](portalfx-data.md).

Next Steps: Learn about [DataCaches](portalfx-data-configuringdatacache.md).

[extension-areas]: ../media/portalfx-data-context/area.png

- Configuring the data cache
    
<a name="working-with-data-querying-for-data"></a>
## Querying for data

Multiple parts or services in your extension will rely on the same set of data. In the case of queries, this may be a list of results. In the case of a details blade, it may be a single entity. In either case, it's critical to ensure that all parts reading a given set of data do the following:

- use a single HTTP request to access that data
- read from a single cache of data in memory
- release that data from memory when it is no longer required

These are all features `MsPortalFx.Data.QueryCache` and `MsPortalFx.Data.EntityCache` provide. `QueryCache` is used to query for a collection of data. `EntityCache` is used to load an individual entity. QueryCache takes a generic parameter for the type of object stored in its cache, and a type for the object that defines the query (in the example below, `WebsiteQuery`). The following code will create a QueryCache which polls the `sourceUri` endpoint on a timed interval:

`\Client\Data\MasterDetailBrowse\MasterDetailBrowseData.ts`

```ts
export interface WebsiteQuery {
    runningStatus: boolean;
}

public websitesQuery = new MsPortalFx.Data.QueryCache<DataModels.WebsiteModel, WebsiteQuery>({
    entityTypeName: DataModels.WebsiteModelType,
    sourceUri: MsPortalFx.Base.Resources.getAppRelativeUri("/api/Websites?runningStatus={0}"),
    poll: true
});
```

Each parameter used in query cache works as follows:

- *DataModels.WebsiteModel* - Model type for the website. This is usually auto-generated (see TypeMetadata section below).
- *WebsiteQuery* - Type that defines the parameters for the query. This often will include sort order, filter parameters, paging data, etc.
- *entityTypeName* - Provides the name of the metadata type. This is usually auto-generated (see TypeMetadata section below).
- *sourceUri* - Provides the endpoint which will accept the HTTP request.
- *poll* - A boolean which determines whether entries in this cache should be refreshed on a timer.  You can use it in conjunction with property pollInterval can be used to override the default poll interval and pollPreservesClientOrdering can be used to preserve the client's existing record order when polling as opposed to using the order from the server response.
- *supplyData* - Allows you to override the logic used to perform an AJAX request. Allows for making the AJAX call, and post-processing the data before it is placed into the cache.

- Loading data
    
<a name="working-with-data-loading-data"></a>
## Loading Data

<a name="working-with-data-loading-data-controlling-the-ajax-call-with-supplydata"></a>
### Controlling the AJAX call with <code>supplyData</code>

In the simple case, the QueryCache is given a simple `sourceUri` attribute which it uses to form a request. This request is sent via a `GET`, with a default set of headers. In some cases, developers may wish to manually make the request.  This can be useful for a few scenarios:

- The request needs to be a `POST` instead of `GET`
- You need to send custom HTTP headers with the request
- The data needs to be processed on the client before placing it inside of the cache

To override the code that makes the request, use the `supplyData` method:

`\Client\Data\SupplyData\SupplyData.ts`

```ts
public websitesQuery = new MsPortalFx.Data.QueryCache<SamplesExtension.DataModels.WebsiteModel, any>({
    entityTypeName: SamplesExtension.DataModels.WebsiteModelType,
    sourceUri: MsPortalFx.Data.uriFormatter(Shared.websitesControllerUri),

    // Overriding the supplyData function and supplying our own logic used to perform an ajax
    // request.
    supplyData: (method, uri, headers, data) => {
        // Using MsPortalFx.Base.Net.ajax to perform our custom ajax request
        return MsPortalFx.Base.Net.ajax({
            uri: uri,
            type: "GET",
            dataType: "json",
            cache: false,
            contentType: "application/json"
        }).then((response: any) => {
            // Post processing the response data of the ajax request.
            if (Array.isArray(response) && response.length > 5) {
                return response.slice(5);
            }
            else {
                return response;
            }
        });
    }
});
```

<a name="working-with-data-loading-data-optimize-number-cors-preflight-requests-to-arm-using-invokeapi"></a>
### Optimize number CORS preflight requests to ARM using invokeApi

If you use CORS to call ARM directly from your extension, you will notice that the browser actually makes two network calls for every one Ajax call in your client code. Here is a before and after example:

<a name="working-with-data-loading-data-optimize-number-cors-preflight-requests-to-arm-using-invokeapi-before-using-invokeapi"></a>
#### Before using invokeApi:

```ts
    public resourceEntities = new MsPortalFx.Data.EntityCache<DataModels.RootResource, string>({
        entityTypeName: ExtensionTemplate.DataModels.RootResourceType,
        sourceUri: MsPortalFx.Data.uriFormatter(endpoint + "{id}?" + this._armVersion, false),
        supplyData: (httpMethod: string, uri: string, headers?: StringMap<any>, data?: any, params?: any) => {
            return MsPortalFx.Base.Net.ajax({
                uri: uri,
                type: httpMethod || "GET",
                dataType: "json",
                traditional: true,
                headers: headers,
                contentType: "application/json",
                setAuthorizationHeader: true,
                cache: false,
                data: data
            })
        }
    });

```

This results in a CORS preflight request for each unique uri.  For example, if the user were to browse to two separate resource `aresource` and `otherresource` it would result in the following requests

```
Preflight 
    Request
        URL:https://management.azure.com/subscriptions/74b34cf3-8c42-46d8-ac89-f18c83815ea3/resourceGroups/testresourcemove/providers/Microsoft.PortalSdk/rootResources/aresource?api-version=2014-04-01&_=1447122511837 
        Method:OPTIONS
        Accept: */*
    Response
        HTTP/1.1 200 OK
        Access-Control-Allow-Methods: GET,POST,PUT,DELETE,PATCH,OPTIONS,HEAD
        Access-Control-Allow-Origin: *
        Access-Control-Max-Age: 3600
    Request
        URL:https://management.azure.com/subscriptions/74b34cf3-8c42-46d8-ac89-f18c83815ea3/resourceGroups/somerg/providers/Microsoft.PortalSdk/rootResources/otherresource?api-version=2014-04-01&_=1447122511837 
        Method:OPTIONS
        Accept: */*
    Response
        HTTP/1.1 200 OK
        Access-Control-Allow-Methods: GET,POST,PUT,DELETE,PATCH,OPTIONS,HEAD
        Access-Control-Allow-Origin: *
        Access-Control-Max-Age: 3600

Actual CORS request to resource
    Request
        https://management.azure.com/subscriptions/74b34cf3-8c42-46d8-ac89-f18c83815ea3/resourceGroups/somerg/providers/Microsoft.PortalSdk/rootResources/aresource?api-version=2014-04-01&_=1447122511837  HTTP/1.1
        Method:GET
    Response
        HTTP/1.1 200 OK
        ...some resource data..
    Request
        https://management.azure.com/subscriptions/74b34cf3-8c42-46d8-ac89-f18c83815ea3/resourceGroups/somerg/providers/Microsoft.PortalSdk/rootResources/otherresource?api-version=2014-04-01&_=1447122511837  HTTP/1.1
        Method:GET
    Response
        HTTP/1.1 200 OK
        ...some otherresource data..
```

As you can see this is making one preflight request per each MsPortalFx.Base.Net.ajax request. In the extreme case, if network latency were the dominant factor this would be a 50% overhead.

<a name="working-with-data-loading-data-optimize-number-cors-preflight-requests-to-arm-using-invokeapi-after-applying-the-invokeapi-optimization"></a>
#### After applying the invokeApi optimization

To apply the invokeApi optimization ensure you:

1. supply the invokeApi option directly to your MsPortalFx.Base.Net.ajax({...}) option.  This allows us to use a fixed endpoint https://management.azure.com/api/invoke to issue all the requests to. The actual path and query string are actually passed as a header "x-ms-path-query". At the "api/invoke" endpoint, ARM reconstructs the original URL on the server side and processes the request in its original form. 
1. remove cache:false.  This avoids emitting a unique timestamp (e.g &_=1447122511837) on every request which would invalidate the single uri benefit invokeApi provides.

The following demonstrates the application of this optimization

```ts
    public resourceEntities = new MsPortalFx.Data.EntityCache<DataModels.RootResource, string>({
        entityTypeName: ExtensionTemplate.DataModels.RootResourceType,
        sourceUri: MsPortalFx.Data.uriFormatter(endpoint + "{id}?" + this._armVersion, false),
        supplyData: (httpMethod: string, uri: string, headers?: StringMap<any>, data?: any, params?: any) => {
            return MsPortalFx.Base.Net.ajax({
                uri: uri,
                type: httpMethod || "GET",
                dataType: "json",
                traditional: true,
                headers: headers,
                contentType: "application/json",
                setAuthorizationHeader: true,
                invokeApi: "api/invoke",
                data: data
            })
        }
    });    
```

and results in the following requests:

```
Preflight 
    Request
        URL: https://management.azure.com/api/invoke HTTP/1.1
        Method:OPTIONS
        Accept: */*
        Access-Control-Request-Headers: accept, accept-language, authorization, content-type, x-ms-client-request-id, x-ms-client-session-id, x-ms-effective-locale, x-ms-path-query
        Access-Control-Request-Method: GET

    Response
        HTTP/1.1 200 OK
        Cache-Control: no-cache, no-store
        Access-Control-Max-Age: 3600
        Access-Control-Allow-Origin: *
        Access-Control-Allow-Methods: GET,POST,PUT,DELETE,PATCH,OPTIONS,HEAD
        Access-Control-Allow-Headers: accept, accept-language, authorization, content-type, x-ms-client-request-id, x-ms-client-session-id, x-ms-effective-locale, x-ms-path-query

Actual Ajax Request
    Request
        URL: https://management.azure.com/api/invoke
        x-ms-path-query: /subscriptions/74b34cf3-8c42-46d8-ac89-f18c83815ea3/resourceGroups/somerg/providers/Microsoft.PortalSdk/rootResources/aresource?api-version=2014-04-01
        Method:GET      
    Response
        HTTP/1.1 200 OK
        ...some aresource data..
    Request
        URL: https://management.azure.com/api/invoke
        x-ms-path-query: /subscriptions/74b34cf3-8c42-46d8-ac89-f18c83815ea3/resourceGroups/somerg/providers/Microsoft.PortalSdk/rootResources/otherresource?api-version=2014-04-01
        Method:GET
    Response
        HTTP/1.1 200 OK
        ...some otherresource data..
```
In the above you will note that:

1. the preflight request is cached for an hour
1. the request is now always for a single resource https://management.azure.com/api/invoke. Because all requests now go through this single endpoint it results in a single preflight request that is used for all subsequent requests - a great improvement on the previous approach that illustrated one preflight per request.
1. the x-ms-path-query preserves the request for the original path segments, query string and hash from the query cache

Within the Portal implementation itself, we have applied this optimization to the Hubs extension and have observed about 15% gains for the scenarios we tested (resources and resource-groups data load) with normal network latency. As latencies get higher, the benefits should be greater.

<a name="working-with-data-loading-data-reusing-loaded-cached-data-with-findcachedentity"></a>
### Reusing loaded/cached data with <code>findCachedEntity</code>

Browsing resources is a very common activity in the new Azure Portal.  Here, columns in the resource list should be loaded using a `QueryCache<TEntity, ...>`.  When the user activates a resource list item, the details shown in the resource Blade should be loaded using an `EntityCache<TEntity, ...>`, where `TEntity` is often shared between these two data caches.  To show details of a resource, rather than issue an ajax call to load the resource details model into `EntityCache`, use the `findCachedEntity` option to locate this already loaded entity in some other `QueryCache` (or even nested in some other `EntityCache`):

```ts
this.websiteEntities = new MsPortalFx.Data.EntityCache<SamplesExtension.DataModels.WebsiteModel, number>({
    entityTypeName: SamplesExtension.DataModels.WebsiteModelType,
    sourceUri: MsPortalFx.Data.uriFormatter(DataShared.websiteByIdUri),
    findCachedEntity: {
        queryCache: this.websitesQuery,
        entityMatchesId: (website, id) => {
            return website.id() === id;
        }
    }
});

``` 

<a name="working-with-data-loading-data-ignore-redundant-data-with-cachedajax"></a>
### Ignore redundant data with <code>cachedAjax()</code>

If the call to `MsPortalFx.Base.Net.ajax()` is replaced with `MsPortalFx.Base.Net.cachedAjax()` then a hash is generated on the server providing change detection.  This not only saves network bandwidth it also saves client side processing.

This capability is built into the SDK as a server side filter that will be switched on when the header `x-ms-cache-tag` is present.  This value is a SHA256 hash of the return data plus the query information.  Please note that if using a backend server that is not utilizing the SDK then this filter may not be available by default and the calculation may need to be implemented by the service provider.

The calculation should ensure uniqueness of the query and result, logically speaking:

`x-ms-cache-tag = sha256(method + URL + query string + query body + result)`

If the `RequestHeader.x-ms-cache-tag` == `ResponseHeader.x-ms-cache-tag` then do not return any data and instead return the status `304` `NOT MODIFIED`.

When using `cachedAjax()` the return data is always wrapped in the following interface:

```ts
export interface AjaxCachedResult<T> {
    cachedAjax?: boolean;
    data?: T;
    modified?: boolean;
    textStatus?: string;
    jqXHR?: JQueryXHR<T>;
}
```

The parameters are:

- `cachedAjax` serves as a signature to let the `dataLoader` know that this return result was from `cachedAjax()` instead of `ajax()`.
- `data` contains the returned data or `null` if the data was not modified.
- `modified` indicates that this is a different result from the previous query and that the `data` attribute represents the current value.
- `textStatus` is a human readable success status indicator.
- `jqXHR` is the ajax result object containing further details for the call.

The following example shows the same `supplyData` override using `cachedAjax()`:

```ts
public websitesQuery = new MsPortalFx.Data.QueryCache<SamplesExtension.DataModels.WebsiteModel, any>({
    entityTypeName: SamplesExtension.DataModels.WebsiteModelType,
    sourceUri: MsPortalFx.Data.uriFormatter(Shared.websitesControllerUri),

    // Overriding the supplyData function and supplying our own logic used to perform an ajax
    // request.
    supplyData: (method, uri, headers, data) => {
        // Using MsPortalFx.Base.Net.cachedAjax to perform our custom ajax request
        return MsPortalFx.Base.Net.cachedAjax({
            uri: uri,
            type: "GET",
            dataType: "json",
            cache: false,
            contentType: "application/json"
        }).then((response: MsPortalFx.Base.Net.AjaxCachedResult<any>) => {
            // Post processing the response data of the ajax request.
            if (response.modified && Array.isArray(response.data) && response.data.length > 5) {
                return response.data = response.data.slice(5);
            }
            return response;
        });
    }
});
```

In this example when `response.modified` is equal to false then no merge operation is performed.

<a name="working-with-data-loading-data-making-authenticated-ajax-calls"></a>
### Making authenticated AJAX calls

For most services, developers will make Ajax calls from the client to the server. Often the server will act as a proxy, making another call to a back end API (such as ARM) which requires authentication. When bootstrapping extensions, the portal will pass a JWT token to the extension. That same token can be included in the HTTP headers of a request to ARM, providing end to end authentication. To help make those authenticated calls, the portal includes an API which performs Ajax requests similar to the jQuery `$.ajax()` library named `MsPortalFx.Base.Net.ajax()`. If you're using QueryCache or EntityCache, this class is used by default. However, it can also be used independently:

`\Client\Data\Loader\LoaderSampleData.ts`

```ts
var promise = MsPortalFx.Base.Net.ajax({
    uri: "/api/websites/list",
    type: "GET",
    dataType: "json",
    cache: false,
    contentType: "application/json",
    data: JSON.stringify({ param: "value" })
});
```

- Consuming data
    
<a name="working-with-data-using-dataviews"></a>
## Using DataViews

The `QueryView` and `EntityView` both serve the purposes of presenting data from the cache to the view model, and providing reference counting. A DataView is created from the `createView` method of a QueryCache or EntityCache:

`\Client\Data\MasterDetailBrowse\ViewModels\MasterViewModels.ts`

```ts
this._websitesQueryView = dataContext.masterDetailBrowseSample.websitesQuery.createView(container);
```

In the sample above, the `container` object acts as a *lifetime object*. Lifetime objects inform the cache when a given view is currently being displayed on the screen. This allows the shell to make several adjustments for performance:

- Adjust polling interval when the part is not on the screen
- Automatically dispose of data when the blade containing the part is closed

Creating a DataView does not result in a data load operation from the server. The server is only queried when the `fetch` operation of the view is invoked:

`\Client\Data\MasterDetailBrowse\ViewModels\MasterViewModels.ts`

```ts
public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
    return this._websitesQueryView.fetch({ runningStatus: inputs.filterRunningStatus.value });
}
```

The `runningStatus` is a filter which will be applied to the query. This allows several views to be created over a single cache, each presenting a potentially different data set.

<a name="working-with-data-observable-map-filter"></a>
## Observable map &amp; filter

In many cases, you may want to shape your data to fit the view you are binding to. There are many cases where this is useful:

- Shaping data to match the contract of a control (data points of a chart, for instance)
- Adding a computed property to a model object
- Filtering data on the client based on a property

The recommended approach to these cases is to use the `map` and `filter` methods found in the <a href="https://github.com/stevesanderson/knockout-projections" target="_blank">Knockout projections</a> library, included in the SDK.

See [Shaping and filtering your data](./portalfx-data-projections.md) for more details.

<!--
    Base.Net.Ajax
-->

- Shaping data
    <a name="data-shaping"></a>
<a name="working-with-data-shaping-and-filtering-data"></a>
## Shaping and filtering data

<a name="working-with-data-shaping-and-filtering-data-understanding-observable-map-and-mapinto"></a>
### Understanding observable map() and mapInto()

When working with data in a QueryCache the most common operation you'll want to do is reshape all the items in the cache into a format that is better for displaying in the UI. Let's look at example that shows how knockout observable versions of `map()` and `mapInto()` can be used to accomplish this and some pitfalls to watch out for.

The sample we'll look at will take a QueryCache of `Robot` objects. The data model for a `Robot` looks like:

<!-- this is generated so I couldn't put comments in to do an include-section -->
```ts
interface Robot {
    name: KnockoutObservable<string>;
    status: KnockoutObservable<string>;
    model: KnockoutObservable<string>;
    manufacturer: KnockoutObservable<string>;
    os: KnockoutObservable<string>;
    specId: KnockoutObservable<string>;
}
```

What we want to do is put each robot in a grid with three columns. The two columns (name and status) will be the same data as that of the model but the third column will be a combination of properties from the model object in the QueryCache. We'll combine the model and manufacturer observables into a single property. The interface for the data to show in the grid is then:

```typescript

/**
* Details for the shaped data that is bound to the grid.
*/
export interface RobotDetails {
   name: KnockoutObservableBase<string>;
   status: KnockoutObservableBase<string>;
   modelAndMfg: KnockoutObservableBase<string>;
}

```

A naive implementation of this might go something like this (ignore the lines about `projectionId` and `_logMapFunctionRunning()` for now. They're used for logging in the sample we'll get to in a sec):

```typescript

const projectedItems = this._view.items.map<RobotDetails>(this._currentProjectionLifetime, (_ /* itemLifetime */, robot) => {
    const projectionId = this._uuid++;
    this._logMapFunctionRunning(projectionId, robot);
    return <RobotDetails>{
        name: ko.observable(robot.name()),
        status: ko.observable(robot.status()),
        modelAndMfg: ko.observable("{0}:{1}".format(robot.model(), robot.manufacturer())),
    };
});

```

Without knowing too much about map() this looks like a fairly reasonable implementation. We know `robot.name()` has the name of the robot and `robot.model()` and `robot.manufacturer()` will give us the model and manufacturer values. The `RobotDetails` interface we're using to model the data in the grid requires observables for it's `name` and `modelAndMfg` properties so we'll throw the strings we get from the QueryCache model into a pair of observables and call it done.

Well, not quite. Let's open up a sample and see why this causes problems. In samples extension search for the __Understanding map() and mapInto()__ sample. When the blade opens up click on the __Buggy Map__ button to load the grid with a data projection code shown above. You should see something like the following show up in the __log stream__ control at the bottom of the blade:

```
Creating buggy map() projection
Creating a projection (projection id=4, robot=Bolt)
Creating a projection (projection id=5, robot=Botly)
Creating a projection (projection id=6, robot=Spring)
Creating a projection (projection id=7, robot=MetalHead)
```

Let's talk about what's happening here. We've created the projection shown above and passed it to the grid. Since there are four items in the QueryCache the projection will run four times, once on each object. Everytime we run the mapping function on an item in the grid this sample creates a new ID for the resulting `RobotDetails` object. You can see the robot names and the ID we generated for the details object in the output above.

Activate the first time in the grid so the child blade opens then what we're going to do is simulate the QueryCache getting an updated property value (generally by polling the server) for that activated item. You can do this by clicking on the 'update status' command at the top of the blade. When you click you'll see that the status for the 'Bolt' robot was updated but the child blade closed. Why did it do that? It's still the same item in the QueryCache, we've just updated one of it's properties. And you can see the top row of the grid is still an item with a name of 'Bolt'. The answer can be found in the __log__ at the bottom of the blade:

```
Updating robot status to 'processor' (robot='Bolt')
Creating a projection (projection id=8, robot=Bolt)
```

You'll notice after the status observable updates the map's projection function runs and computes __a different projected item__. The object with projectionId === 4 is gone and has been replaced with a new item with projectionId === 8. This is the reason the child blade closed. The item that was in selectableSet's activatedItems observable array no longer exists in the grid's list of items. It has been replaced by an item with the same `name` and `modelAndMfg` but a new `status`.

To understand why the map does this you need to understand a little how map() works. When the mapping function you supply runs knockout is watching to see what observable values are read and it then takes a dependency on those values (just like ko.pureComputed or ko.reactor). If any of those values change knockout knows the generated item is now out of date because the source for that item has changed. How does the map function generate an update-to-date projection? The only way it can, by running the mapping function again. This can be especially bad if you do something expensive in your mapping function.

The same thing happens if you update the model property of the top item (by clicking the 'update model' command):

```
Updating model to 'into' (robot=Bolt)
Creating a projection (projection id=10, robot=Bolt)
```

Reason is the same. During our mapping function we wrote:

```
modelAndMfg: ko.observable("{0}:{1}".format(robot.model(), robot.manufacturer()))
```

Which means the map projection will run again anytime robot.model() is observably updated. This causes the old item to be removed from the grid and an entirely new item to be added.

This obviously isn't what we want so how do we write projections that don't do this? In the case of a property we want to pass through straight from the data model to the grid model (like the `status` property in this example) you simply pass the observable. Don't get the current string value out of the observable and shove it into a different observable. So this line from our mapping function:

```
status: ko.observable(robot.status()),
```

becomes this:

```
status: robot.status,
```

We can't take the same approach with the `modelAndMfg` property however since we need to combine multiple properties from the data model to produce one property on the grid model. For cases like this you should use a ko.pureComputed() like so:

```
modelAndMfg: ko.pureComputed(() => {
    return "{0}:{1}".format(robot.model(), robot.manufacturer());
})
```

This prevents the map() from taking a dependency on robot.model() and robot.manufacturer() because __the pureComputed() function takes the dependency on robot.model() and robot.manufacturer()__. Since the pureComputed() we created will update whenever model() or manufacturer() updates ko.map knows it will not need to rerun your mapping function to keep the projection object up-to-date when those observables change in the source model.

A correct implemenation of the map above then looks like (again ignore uuid and the logging functions):

```typescript

const projectedItems = this._view.items.map<RobotDetails>(this._currentProjectionLifetime, (_ /* itemLifetime */, robot) => {
    const projectionId = this._uuid++;
    this._logMapFunctionRunning(projectionId, robot);
    return <RobotDetails>{
        name: robot.name,
        status: robot.status,
        modelAndMfg: ko.pureComputed(() => {
            this._logComputedRecalculating(projectionId, robot);
            return "{0}:{1}".format(robot.model(), robot.manufacturer());
        }),
    };
});

```

You can click on the 'Proper map' button in the sample and perform the same actions to see the difference. Now updating a property on the opened grid item no longer results in a rerunning of your map function. Instead changes to `status` are pushed directly to the DOM and changes to `model` cause the pureComputed to recalculate but importantly __do not change the object in grid.items()__.

Now that you understand how `map()` works we can introduce `mapInto()`. Here's the code the same projection implemented with mapInto():

```typescript

const projectedItems = this._view.items.mapInto<RobotDetails>(this._currentProjectionLifetime, (_ /* itemLifetime */, robot) => {
    const projectionId = this._uuid++;
    this._logMapFunctionRunning(projectionId, robot);
    return <RobotDetails>{
        name: robot.name,
        status: robot.status,
        modelAndMfg: ko.pureComputed(() => {
            this._logComputedRecalculating(projectionId, robot);
            return "{0}:{1}".format(robot.model(), robot.manufacturer());
        }),
    };
});

```

You can see how it reacts by clicking on the 'Proper mapInto' button and then add/remove/update the items. The code and behavior are the exact same. So how are map() and mapInto() different? We can see with a buggy implementation of a projection using mapInto():

```typescript

const projectedItems = this._view.items.mapInto<RobotDetails>(this._currentProjectionLifetime, (_ /* itemLifetime */, robot) => {
    const projectionId = this._uuid++;
    this._logMapFunctionRunning(projectionId, robot);
    return <RobotDetails>{
        name: ko.observable(robot.name()),
        status: ko.observable(robot.status()),
        modelAndMfg: ko.observable("{0}:{1}".format(robot.model(), robot.manufacturer())),
    };
});

```

This is the same as our buggy implementation of map() we wrote earlier. Hit the 'Buggy mapInto' button and then play around with updating status() and model() of the top row while that row is activated. You'll notice, unlike map(), that the child blade doesn't close however you'll also notice that when the source data in the QueryCache changes __the observable changes are not present in the projected object__. The reason for this is mapInto() ignores any observables that use in the mapping function you supply. It is therefore guaranteed that a projected item will stay the same item as long as the source item is around but if you write your map incorrectly it isn't guaranteed the projected data is update to date.

So to summarize:

Function | Projection always guaranteed up to date | Projected object identity will not change
--- | --- | ---
map() | Yes | No
mapInto() | No | Yes

However if the projection is done correctly both functions should work identically.

<a name="working-with-data-shaping-and-filtering-data-using-knockout-projections"></a>
### Using Knockout projections

In many cases extension authors will want to shape and filter data as it is loaded via QueryView and EntityView.

[Knockout projections](https://github.com/stevesanderson/knockout-projections) provide a simple way to efficiently perform `map` and `filter` functions over an observable array of model objects.  This allows you to add new computed properties to model objects, exclude unneeded properties on model objects, and generally change the structure of an object that is inside an array.  If used correctly, the Knockout projections library does this efficiently by only executing the developer-supplied mapping/filtering function when new data is added to the array and when data is modified. The Knockout projections library is included by default in the SDK.  You can learn more by [reading this blog post](http://blog.stevensanderson.com/2013/12/03/knockout-projections-a-plugin-for-efficient-observable-array-transformations/).

The samples extension includes an example of using a __projected array__ to bind to a grid:

`\Client\Data\Projection\ViewModels\ProjectionBladeViewModel.ts`

```typescript

this._view = dataContext.robotData.robotsQuery.createView(container);

// As items are added or removed from the underlying items array,
// individual changed items will be re-evaluated to create the computed
// value in the resulting observable array.
const projectedItems = this._view.items.mapInto<RobotDetails>(container, (_ /* itemLifetime */, robot) => {
    return <RobotDetails>{
        name: robot.name,
        computedName: ko.pureComputed(() => {
            return "{0}:{1}".format(robot.model(), robot.manufacturer());
        }),
    };
});

this.grid = new Grid.ViewModel<RobotDetails, string>(
    container,
    projectedItems,
    Grid.Extensions.SelectableRow);

```

<a name="working-with-data-shaping-and-filtering-data-chaining-uses-of-map-and-filter"></a>
### Chaining uses of <code>map</code> and <code>filter</code>

Often, it is convenient to chain uses of `map` and `filter`:
<!-- the below code no longer lives in samples extension anywhere -->
```ts
// Wire up the contents of the grid to the data view.
this._view = dataContext.personData.peopleQuery.createView(container);
var projectedItems = this._view.items
    .filter((person: SamplesExtension.DataModels.Person) => {
        return person.smartPhone() === "Lumia 520";
    })
    .map((person: SamplesExtension.DataModels.Person) => {
        return <MappedPerson>{
            name: person.name,
            ssnId: person.ssnId
        };
    });

var personItems = ko.observableArray<MappedPerson>([]);
container.registerForDispose(projectedItems.subscribe(personItems));
```

This filters to only Lumia 520 owners and then maps to just the columns the grid uses.  Additional pipeline stages can be added with more map/filters/computeds to do more complex projections and filtering.

<a name="working-with-data-shaping-and-filtering-data-anti-patterns-and-best-practices"></a>
### Anti-patterns and best practices

**Do not** unwrap observables directly in your mapping function - When returning a new object from the function supplied to `map`, you should **avoid unwrapping observables** directly in the mapping function, illustrated by `computedName` here:

```ts
var projectedItems = this._view.items.map<RobotDetails>({
    mapping: (robot: SamplesExtension.DataModels.Robot) => {
        return <RobotDetails>{
            name: robot.name,

            // DO NOT DO THIS!  USE A COMPUTED INSTEAD!
            computedName: "{0}:{1}".format(robot.model(), robot.manufacturer());
        };
    },
    ...
```

The `computedName` property above is the source of a common bug where **"my grid loses selection when my QueryCache refreshes"**.  The reason for this is subtle.  If you unwrap observables in your mapping function, you will find that - each time the observable changes - your mapping function will be invoked again, (inefficiently) *generating an entirely new object*.  Since the Azure Portal FX's selection machinery presently relies on JavaScript object identity, selection tracked relative to the *old object* will be lost when this object is replaced by the *new object* generated by your mapping function.  Ignoring bugs around selection, generating new objects can lead to UI flicker and performance problems, as more UI is re-rendered than is necessary to reflect data changes.

**Do** follow these two patterns to avoid re-running of mapping functions and to avoid unnecessarily generating new output objects:

* **Reuse observables from the input object** - Above, the `name` property above simply reuses - in the projected output object - an observable *from the input object*
* **Use `ko.computed()` for new, computed properties** - The `computedName` property above uses a Knockout `computed` and unwraps observables *in the function defining the `computed`*.  With this, only the `computedName` property is recomputed when the input `robot` object changes.

**Do** use `map` and `filter` to reduce the size of the data you are binding to a control - See [Use map and filter to reduce size of rendered data](/portal-sdk/generated/index-portalfx-extension-monitor.md#use-map-and-filter-to-reduce-size-of-rendered-data).

**Do not** use `subscribe` to project\shape data - An extreme anti-pattern would be to not use `map` at all when projecting/shaping data for use in controls:

```ts
// DO NOT DO THIS!
this._view.items.subscribe((items) => {
    var mappedItems: MappedPerson[] = [];
    for (var i = 0; i < items.length; i++) {
        // create a new mapped person for every item
        mappedItems.push({
            name: items[i].name,
            model: robot.model()
        });
    }

    this.selectableGridViewModel.items(mappedItems);
});
```

There are two significant problems with `subscribe` used here:

* Whenever `this._view.items` changes, an *entirely new array containing entirely new objects* will be generated.  Your scenario will suffer from the cost of serializing/deserializing this new array to the grid control and from the cost of fully re-rendering your grid.
* Whenever the `robot.model` observable changes, this change *will not be reflected in the grid*, since no code has subscribed to this `robot.model` observable.

- Refreshing cached data
    
<a name="refresh-implicitrefresh"></a>
<a name="working-with-data-auto-refreshing-client-side-data-a-k-a-polling"></a>
## Auto-refreshing client-side data (a.k.a. &#39;polling&#39;)

In many scenarios, users expect to see their rendered data update implicitly as server data changes. This is fairly straightforward to accomplish by configuring your QueryCache/EntityCache to include 'polling'.

```typescript

public robotsQuery = new MsPortalFx.Data.QueryCache<Robot, any>({
    entityTypeName: RobotMetadata.name,
    sourceUri: () => Util.appendSessionId(RobotData._apiRoot),
    poll: true,
});

```

Additionally, the extension can customize the polling interval by using the '`pollingInterval`' option. By default, the polling interval is 60 seconds. It can be customized down to a minimum of 10 seconds. The minimum is enforced to avoid server load that might result from some accidental, overly aggressive change to '`pollingInterval`' by an extension developer. (There have been cases where even this 10 second minumum has caused customer impact due to increased server load.)

<a name="refresh-datamerging"></a>
<a name="working-with-data-data-merging"></a>
## Data merging

For Azure Portal UI to be responsive, it is often important - when data changes - to avoid rerendering entire Blades and Parts. Rather, in most cases, it is better to make *granular* data changes so that FX controls and Knockout HTML templates can rerender *only small portions* of Blade/Part UI. In many common cases of refreshing data, the newly-loaded server data *precisely matches* already-cached data, and in this case *no UI rerendering happens*.

When QueryCache/EntityCache data is refreshed - either *implicitly* as [above](#refresh-implicitrefresh) or *explicitly* as described [here](#refresh-explicitrefresh) - newly-loaded server data is added to already-cached, client-side data through a process called "data merging":

* The newly-loaded server data is compared to already-cached data
* Differences between newly-loaded and already-cached data are detected. For instance, "property <X> on object <Y> changed value" and "the Nth item in array <Z> was removed".
* The differences are applied to the already-cached data, via changes to Knockout observables.

For many scenarios, "data merging" requires no configuration and is simply an implementation detail of ['polling'](#refresh-implicitrefresh) and [explicitly requested '`refresh`'](#refresh-explicitrefresh). In some scenarios, there are gotcha's to look out for...

<a name="working-with-data-data-merging-data-merging-caveats"></a>
### Data merging <strong>caveats</strong>

<a name="working-with-data-data-merging-data-merging-caveats-supply-type-metadata-for-arrays"></a>
#### Supply type metadata for arrays

When detecting changes between items in an already-loaded array and a newly-loaded array, the "data merging" algorithm requires some per-array configuration. Specifically, the "data merging" algorithm - without configuration - doesn't know how to match items between the old and new arrays. Without configuration, the algorithm considers each already-cached array item as 'removed' (since it matches no item in the newly-loaded array) and every newly-loaded array item as 'added' (since it matches no item in the already-cached array). This effectively replaces *the entire cached array's contents*, even in those cases where the server data hasn't changed. This can often be the cause of performance problems in your Blade/Part (poor responsiveness, hanging), even while users - sadly - see no pixel-level UI problems.

To proactively warn you of these potential performance problems, the "data merge" algorithm will log warnings to the console that resemble:

```
Base.Diagnostics.js:351 [Microsoft_Azure_FooBar]  18:55:54
MsPortalFx/Data/Data.DataSet Data.DataSet: Data of type [No type specified] is being merged without identity because the type has no metadata. Please supply metadata for this type.
```

Any array cached in your QueryCache/EntityCache must be configured for "data merging" by using [type metadata](portalfx-data-typemetadata.md). Specifically, for each `Array<T>`, the extension has to supply type metadata for type `T` that describes the "id" properties for that type (see examples of this [here](portalfx-data-typemetadata.md)). With this "id" metadata, the "data merging" algorithm can match already-cached and newly-loaded array items and can merge these *in-place* (with no per-item array remove/add). With this, when the server data doesn't change, each cached array item will match a newly-loaded server item, each will merge in-place with no detected chagnes, and the merge will be a no-op for the purposes of UI rerendering.

<a name="working-with-data-data-merging-data-merging-caveats-data-merge-failures"></a>
#### Data merge failures

As "data merging" proceeds, differences are applied to the already-cached data via Knockout observable changes. When these observables are changed, Knockout subscriptions are notified and Knockout `reactors` and `computeds` are reevaluated. Any associated (often extension-authored) callback here **can throw an exception** and this will halt/preempt the current "data merge" cycle. When this happens, the "data merging" algorithm issues an error resembling:

```
Data merge failed for data set 'FooBarDataSet'. The error message was: ...
```

Importantly, this error is not due to bugs in the data-merging algorithm. Rather, some JavaScript code (frequently extension code) is causing an exception to be thrown. This error should be accompanied with a JavaScript stack trace that extension developers can use to isolate and fix such bugs.

<a name="working-with-data-data-merging-data-merging-caveats-entityview-item-observable-doesn-t-change-on-refresh"></a>
#### EntityView &#39;<code>item</code>&#39; observable doesn&#39;t change on refresh?

Occasionally, extension developers are surprised that the EntityView '`item`' observable does not change (doesn't notify subscribers) when the EntityView/EntityCache is refreshed (either [implicitly](#refresh-implicitrefresh) or [explicitly](#refresh-explicitrefresh)) and, consequently, code like this doesn't work as expected:

```ts
entityView.item.subscribe(lifetime, () => {
    const item = entityView.item();
    if (item) {
        // Do something with 'newItem' after refresh.
        doSomething(item.customerName());
    }
});
```

This is because the "data merge" algorithm doesn't *replace* already-cached objects (unless such an object is an array item). Rather, objects are merged *in-place*, to optimize for limited/no UI re-rendering when data changes (see [here](#refresh-datamerging) for details).

A better coding pattern to follow is to use `ko.reactor` and `ko.computed` as below:

```ts
ko.reactor(lifetime, () => {
    const item = entityView.item();
    if (item) {
        // Do something with 'newItem' after refresh.
        doSomething(item.customerName());
    }
});
```

With this, the supplied callback will be called both when the '`item`' observable changes (when the data first loads) and also when any properties on the entity change (like '`customerName`' above).

<a name="refresh-explicitrefresh"></a>
<a name="working-with-data-explicitly-proactively-reflecting-server-data-changes-on-the-client"></a>
## Explicitly/proactively reflecting server data changes on the client

As server data changes, there are scenario where the extension should *take explicit steps* to keep their QueryCache and EntityCache data consistent with the server. In terms of UX, explicit refreshing of a QueryCache/EntityCache is necessary in scenarios like:

* **User makes server changes** - User initiates some action and, as a consequence, the extension issues an AJAX call that *changes server data*. As a best-practice, this AJAX call is typically issued from an extension DataContext.

```typescript

public updateRobot(robot: Robot): FxBase.PromiseV<any> {
    return FxBaseNet.ajax({
        uri: Util.appendSessionId(RobotData._apiRoot + robot.name()),
        type: "PUT",
        contentType: "application/json",
        data: ko.toJSON(robot),
    }).then(() => {
        // This will refresh the set of data that is available in the underlying data cache.
        this.robotsQuery.refreshAll();
    });
}

```

In this scenario, since the AJAX call will be issued from a DataContext, refreshing data in QueryCaches/EntityCaches will be done using QueryCache/EntityCache methods directly. See ["Refreshing/updating a QueryCache/EntityCache"](#refresh-datacache) below.

<a name="refresh-dataview-sample"></a>
* **User clicks 'Refresh' command** - (Less common) The user clicks on some 'Refresh'-like command on a Blade or Part, implemented in that Blade/Part's view model.

```ts
class RefreshCommand implements MsPortalFx.ViewModels.Commands.Command<void> {
    private _websiteView: MsPortalFx.Data.EntityView<Website>;

    public canExecute: KnockoutObservableBase<boolean>;

    constructor(websiteView: MsPortalFx.Data.EntityView<Website>) {
        this.canExecute = ko.computed(() => {
            return !websiteView.loading();
        });

        this._websiteView = websiteView;
    }

    public execute(): MsPortalFx.Base.Promise {
        return this._websiteView.refresh();
    }
```

In this scenario, since the data being refreshed is that data rendered *in a specific Blade/Part*, refreshing data in the associated QueryCache/EntityCache is best done in terms of QueryView/EntityView methods (for that QueryView/EntityView in use by the Blade/Part view model). See ["Refreshing a QueryView/EntityView"](#refresh-dataview) below.

<a name="refresh-datacache"></a>
<a name="working-with-data-explicitly-proactively-reflecting-server-data-changes-on-the-client-refreshing-or-updating-a-querycache-entitycache"></a>
### Refreshing or updating a <strong>QueryCache/EntityCache</strong>

There are a number of methods available on QueryCache/EntityCache that make it straightforward and efficient to keep client-side cached data consistent with server data. Which of these is appropriate varies by scenario, and these are discussed individually below.

To understand the design behind this collection of methods and how to select the appropriate method to use, it's important to understand a bit about the DataCache/DataView design (in detail [here](portalfx-data-configuringdatacache.md)). Specifically, QueryCache/EntityCache is designed as a collection of *cache entries*. In some cases, where there are multiple active Blades and Parts, a given QueryCache/EntityCache might contain *many cache entries*. So, below, you'll see '`refreshAll`' - which issues N AJAX calls to refresh all N entries of a QueryCache/EntityCache - as well as alternative, per-cache-entry methods that allow for *more granular, often more efficient* refreshing of QueryCache/EntityCache data.

<a name="working-with-data-explicitly-proactively-reflecting-server-data-changes-on-the-client-refreshing-or-updating-a-querycache-entitycache-refreshall"></a>
#### &#39;<code>refreshAll</code>&#39;

As mentioned above, this method will issue an AJAX call (either using the '`supplyData`' or '`sourceUri`' option supplied to the QueryCache/EntityCache) for each entry currently held in the QueryCache/EntityCache.  Upon completion, each AJAX result is [merged](#refresh-datamerging) onto its corresponding cache entry.

```typescript

public updateRobot(robot: Robot): FxBase.PromiseV<any> {
    return FxBaseNet.ajax({
        uri: Util.appendSessionId(RobotData._apiRoot + robot.name()),
        type: "PUT",
        contentType: "application/json",
        data: ko.toJSON(robot),
    }).then(() => {
        // This will refresh the set of data that is available in the underlying data cache.
        this.robotsQuery.refreshAll();
    });
}

```

If the (optional) '`predicate`' parameter is supplied to the '`refreshAll`' call, then only those entries for which the predicate returns 'true' will be refreshed.  This '`predicate`' feature is useful when the extension undestands the nature of the server data changes and can - based on this knowledge - chose to *not* refresh QueryCache/EntityCache entries whose server data hasn't changed.

<a name="refresh-datacache-refresh"></a>
<a name="working-with-data-explicitly-proactively-reflecting-server-data-changes-on-the-client-refreshing-or-updating-a-querycache-entitycache-refresh"></a>
#### &#39;<code>refresh</code>&#39;

The '`refresh`' method is useful when the server data changes are known to be specific to a single cache entry (a single query in the case of QueryCache, a single entity 'id' in the case of EntityCache).

```typescript

const promises: Q.Promise<void>[] = [];
this.enginesQuery.refresh({}, null);
MsPortalFx.makeArray(engines).forEach((engine) => {
    promises.push(Q(this.engineEntities.refresh(engine, null)));
});
return Q.all(promises);

```

```typescript

public updateEngine(engine: EngineModel): Q.Promise<void> {
   let promise: Q.Promise<any>;
   if (useFrameworkPortal) {
       // Using framework portal (NOTE: this is not allowed against ARM).
       // NOTE: do NOT use invoke API since it doesn't handle CORS.
       promise = Q(FxBaseNet.ajaxExtended<any>({
           headers: { accept: applicationJson },
           isBackgroundTask: false,
           setAuthorizationHeader: true,
           setTelemetryHeader: "Update" + entityType,
           type: "PATCH",
           uri: appendSessionId(EngineData._apiRoot + "&api-version=" + entityVersion),
           data: ko.toJSON(convertToResource(engine)),
           contentType: applicationJson,
           useFxArmEndpoint: true,
       }));
   } else {
       // Using local controller.
       promise = FxBaseNet.ajax({
           type: "PATCH",
           uri: appendSessionId(EngineData._apiRoot + "?id=" + engine.id()),
           data: ko.toJSON(convertToArmResource(engine)),
           contentType: applicationJson,
       });
   }

   return promise.then(() => {
       if (useFrameworkPortal) {
           // This will refresh the set of data that is available in the underlying data cache.
           EngineData._debouncer.execute([this._getEngineId(engine)]);
       } else {
           // This will refresh the set of data that is available in the underlying data cache.
           // The {} params let the cache know to re-fetch any data that matches these parameters.
           // In the case of this contrived scenario, we always fetch all data.  In the future we
           // will add a way to refresh all (or selective) caches for a given type.  The second param
           // manages lifetime, which is not needed in this case.
           this.enginesQuery.refresh({}, null);
       }
   });
    }
    
```

Using '`refresh`', only *a single AJAX call* will be issued to the server.

<a name="working-with-data-explicitly-proactively-reflecting-server-data-changes-on-the-client-refreshing-or-updating-a-querycache-entitycache-applychanges"></a>
#### &#39;<code>applyChanges</code>&#39;

In some scenarios, AJAX calls to the server to refresh cached data can be *avoided entirely*. For instance, the user may have fully described the server data changes by filling out a Form on a Form Blade. In this case, the necessary QueryCache/EntityCache changes are known *by the extension directly* without having to make an AJAX call to their server. This use of '`applyChanges`' can be a nice optimization to avoid some AJAX traffic to your servers.

**Example - Adding an item to a QueryCache entry**

```typescript

public createRobot(robot: Robot): FxBase.PromiseV<any> {
    return FxBaseNet.ajax({
        uri: Util.appendSessionId(RobotData._apiRoot),
        type: "POST",
        contentType: "application/json",
        data: ko.toJSON(robot),
    }).then(() => {
        // This will refresh the set of data that is displayed to the client by applying the change we made to
        // each data set in the cache.
        // For this particular example, there is only one data set in the cache.
        // This function is executed on each data set selected by the query params.
        // params: any The query params
        // dataSet: MsPortalFx.Data.DataSet The dataset to modify
        this.robotsQuery.applyChanges((_ /* params */, dataSet) => {
            // Duplicates on the client the same modification to the datacache which has occurred on the server.
            // In this case, we created a robot in the ca, so we will reflect this change on the client side.
            dataSet.addItems(0, [robot]);
        });
    });
}

```

**Example - Removing an item to a QueryCache entry**

```typescript

public deleteRobot(robot: Robot): FxBase.PromiseV<any> {
    return FxBaseNet.ajax({
        uri: Util.appendSessionId(RobotData._apiRoot + robot.name()),
        type: "DELETE",
    }).then(() => {
        // This will notify the shell that the robot is being removed.
        MsPortalFx.UI.AssetManager.notifyAssetDeleted(ExtensionDefinition.AssetTypeNames.robot, robot.name());

        // This will refresh the set of data that is displayed to the client by applying the change we made to
        // each data set in the cache.
        // For this particular example, there is only one data set in the cache.
        // This function is executed on each data set selected by the query params.
        // params: any The query params
        // dataSet: MsPortalFx.Data.DataSet The dataset to modify
        this.robotsQuery.applyChanges((_ /* params */, dataSet) => {
            // Duplicates on the client the same modification to the datacache which has occurred on the server.
            // In this case, we deleted a robot in the cache, so we will reflect this change on the client side.
            dataSet.removeItem(robot);
        });
    });
}

```

Similar to '`refreshAll`', the '`applyChanges`' method accepts a function that is called for each cache entry currently in the QueryCache/EntityCache, allowing the extension to update only those cache entries known to be effected by the server changes made by the user.

<a name="working-with-data-explicitly-proactively-reflecting-server-data-changes-on-the-client-refreshing-or-updating-a-querycache-entitycache-forceremove"></a>
#### &#39;<code>forceRemove</code>&#39;

A subtlety of QueryCache/EntityCache is that it can hold onto cache entries for some time *after the last Blade/Part has been closed/unpinned*. This design supports the common scenario where a user closes a Blade (for instance) and immediately reopens it.

Now, when the server data for a given cache entry *has been entirely deleted*, then the extension will want to forcibly remove corresponding entries from their QueryCache (less common) and EntityCache (more common). The '`forceRemove`' method does just this.

```typescript

public deleteComputer(computer: Computer): FxBase.PromiseV<any> {
    return FxBaseNet.ajax({
        uri: Util.appendSessionId(ComputerData._apiRoot + computer.name()),
        type: "DELETE",
    }).then(() => {
        // This will notify the shell that the computer is being removed.
        MsPortalFx.UI.AssetManager.notifyAssetDeleted(ExtensionDefinition.AssetTypeNames.computer, computer.name());

        // This will refresh the set of data that is displayed to the client by applying the change we made to
        // each data set in the cache.
        // For this particular example, there is only one data set in the cache.
        // This function is executed on each data set selected by the query params.
        // params: any The query params
        // dataSet: MsPortalFx.Data.DataSet The dataset to modify
        this.computersQuery.applyChanges((_ /* params */, dataSet) => {
            // Duplicates on the client the same modification to the datacache which has occurred on the server.
            // In this case, we deleted a computer in the cache, so we will reflect this change on the client side.
            dataSet.removeItem(computer);
        });

        // This will force the removal of the deleted computer from this EntityCache.  Subsequently, any Part or
        // Blades that use an EntityView to fetch this deleted computer will likely receive an expected 404
        // response.
        this.computerEntities.forceRemove(computer.name());
    });
}

```

Once called, the corresponding cache entry will be removed. If the user were to - somehow - open a Blade or drag/drop a Part that tried to load the deleted data, the QueryCache/EntityCache would try to create an entirely new cache entry, and - presumably - it would fail to load the corresponding server data. In such a case, by design, the user would see a 'data not found' user experience in that Blade/Part.

When using '`forceRemove`', the extension will also - typically - want to take steps to ensure that any existing Blades/Parts are no longer making use of the removed cache entry (via QueryView/EntityView). When the extension notifies the FX of a deleted ARM resource via '`MsPortalFx.UI.AssetManager.notifyAssetDeleted()`' (see [here](portalfx-assets.md) for details), the FX will automatically show 'deleted' UX in any corresponding Blades/Parts. If the user clicked some 'Delete'-style command on a Blade to trigger the '`forceRemove`', often the extension will elect to *programmatically close the Blade* with the 'Delete' command (in addition to making associated AJAX and '`forceRemove`' calls from their DataContext).

<a name="refresh-dataview"></a>
<a name="working-with-data-explicitly-proactively-reflecting-server-data-changes-on-the-client-refreshing-a-queryview-entityview"></a>
### Refreshing a <strong>QueryView/EntityView</strong>

In some Blades/Parts, there can be a specific 'Refresh' command that is meant to refresh only that data visible in the given Blade/Part. In this scenario, it is the QueryView/EntityView that serves as a reference/pointer to that Blade/Part's data, and it's with that QueryView/EntityView that the extension should refresh the data.  (See a sample [here](#refresh-dataview-sample)).

When '`refresh`' is called, a Promise is returned that reflects the progress/completion of the corresponding AJAX call. In addition, the '`isLoading`' observable property of QueryView/EntityView also changes to 'true' (useful for controlling UI indications that the refresh is in progress, like temporarily disabling the clicked 'Refresh' command).

At the QueryCache/EntityCache level, in response to the QueryView/EntityView '`refresh`' call, an AJAX call will be issued for the corresponding QueryCache/EntityCache cache entry, precisely in the same manner that would happen if the extension called QueryCache/EntityCache's '`refresh`' method with the associated cache key (see [here](#refresh-datacache-refresh)).

<a name="working-with-data-explicitly-proactively-reflecting-server-data-changes-on-the-client-refreshing-a-queryview-entityview-queryview-entityview-refresh-caveat"></a>
#### QueryView/EntityView &#39;<code>refresh</code>&#39; <strong>caveat</strong>

There is one subtety to the '`refresh`' method available on QueryView/EntityView that sometimes trips up extension developers. You will notice that '`refresh`' accepts no parameters. This is because '`refresh`' was designed to refresh *already-loaded data*. An initial call to QueryView/EntityView's '`fetch`' method establishes a cache entry in the corresponding QueryCache/EntityCache that includes the URL information with which to issue an AJAX call when '`refresh`' is later called.

Sometimes, extensions developers feel it is important - when a Blade opens or a Part is first displayed - to *implicitly refresh* the Blade's/Part's data (in cases where the data may have already been loaded/cached for use in some previously viewed Blade/Part). To make this so, they'll sometimes call QueryView/EntityView's '`fetch`' and '`refresh`' methods in succession. This is a minor anti-pattern that should probably be avoided. This "refresh my data on Blade open" pattern trains the user to open Blades to fix stale data (even close and then immediately reopen the same Blade) and can often be a symptom of a missing 'Refresh' command or [auto-refreshing data](#refresh-implicitrefresh) that's configured with too long a polling interval.

- Virtualized data for the grid
    
<a name="working-with-data-querying-for-virtualized-data"></a>
## Querying for virtualized data

If your back end is going to return significant amounts of data, you should consider using the `DataNavigator` class provided by the framework. There are two models for querying virtualized data from the server:

1. __"Load more" model__: With this model, a page of data is loaded, the user scrolls to the bottom, and then the next page of data is loaded.  There is no way to scroll to "page 5", and all data is represented in a timeline.  This works best with APIs that provide continuation tokens, or timeline based data.

2. __Paged model__: The classic paged model provides either a pager control, or a virtualized scrollbar which represents the paged data.  It works best with back end APIs that have a skip/take style data virtualization strategy.

Both of these use the existing `QueryCache` and the `MsPortalFx.Data.RemoteDataNavigator` entities to orchestrate virtualization.


<a name="working-with-data-querying-for-virtualized-data-load-more-continuation-token"></a>
#### Load more / continuation token

![Load more grid][loadmore-grid]

The 'load more' approach requires setting up a `QueryCache` with a navigation element.  The navigation element describes the continuation token model:

`\SamplesExtension\Extension\Client\Controls\ProductData.ts`

```ts
this.productsCache = new MsPortalFx.Data.QueryCache<SamplesExtension.DataModels.Product, ProductQueryParams>({
    entityTypeName: SamplesExtension.DataModels.ProductType,
    sourceUri: MsPortalFx.Data.uriFormatter(ProductData.QueryString),
    navigation: {
        loadByContinuationToken: (
            suppliedQueryView: MsPortalFx.Data.QueryView<SamplesExtension.DataModels.Product, ProductQueryParams>,
            query: ProductQueryParams,
            reset: boolean,
            filter: string): MsPortalFx.Base.Promise => {

            var token = reset ? "" :
                (suppliedQueryView.metadata() ?
                suppliedQueryView.metadata().continuationToken :
                "");

            return suppliedQueryView.fetch({ token: token, categoryId: query.categoryId });
        }
    },
    processServerResponse: (response: any) => {
        return <MsPortalFx.Data.DataCacheProcessedResponse>{
            data: response.products,
            navigationMetadata: {
                totalItemCount: response.totalCount,
                continuationToken: response.continuationToken
            }
        };
    }
});
```

In the view model, use the `Pageable` extension for the grid, with the `Sequential` type. Instead of the `createView` API on the QueryCache, use the `createNavigator` API which integrates with the virtualized data system:


`\SamplesExtension\Extension\Client\Controls\Grid\ViewModels\PageableGridViewModel.ts`

```ts
constructor(container: MsPortalFx.ViewModels.PartContainerContract,
            initialState: any,
            dataContext: ControlsArea.DataContext) {

    // create the data navigator from the data context (above)
    this._sequentialDataNavigator = dataContext.productDataByContinuationToken.productsCache.createNavigator(container);

    // Define the extensions you wish to enable.
    var extensions = MsPortalFx.ViewModels.Controls.Lists.Grid.Extensions.Pageable;

    // Define the options required to have the extensions behave properly.
    var pageableExtensionOptions = {
        pageable: {
            type: MsPortalFx.ViewModels.Controls.Lists.Grid.PageableType.Sequential,
            dataNavigator: this._sequentialDataNavigator
        }
    };

    // Initialize the grid view model.
    this.sequentialPageableGridViewModel = new MsPortalFx.ViewModels.Controls.Lists.Grid
        .ViewModel<SamplesExtension.DataModels.Product, ProductSelectionItem>(
            null, extensions, pageableExtensionOptions);

    // Set up which columns to show.  If you do not specify a formatter, we just call toString on
    // the item.
    var basicColumns: MsPortalFx.ViewModels.Controls.Lists.Grid.Column[] = [
        {
            itemKey: "id",
            name: ko.observable(ClientResources.gridProductIdHeader)
        },
        {
            itemKey: "description",
            name: ko.observable(ClientResources.gridProductDescriptionHeader)
        },
    ];
    this.sequentialPageableGridViewModel.showHeader = true;

    this.sequentialPageableGridViewModel.columns =
        ko.observableArray<MsPortalFx.ViewModels.Controls.Lists.Grid.Column>(basicColumns);

    this.sequentialPageableGridViewModel.summary =
        ko.observable(ClientResources.basicGridSummary);

    this.sequentialPageableGridViewModel.noRowsMessage =
        ko.observable(ClientResources.nobodyInDatabase);
}


public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
    return this._sequentialDataNavigator.setQuery({ categoryId: inputs.categoryId });
}
```

<a name="working-with-data-querying-for-virtualized-data-pageable-skip-take-grid"></a>
#### Pageable / skip-take grid

![Pageable grid][pageable-grid]

The pageable approach requires setting up a `QueryCache` with a navigation element.  The navigation element describes the skip-take behavior:

`\SamplesExtension\Extension\Client\Controls\ProductPageableData.ts`

```ts
var QueryString = MsPortalFx.Base.Resources
    .getAppRelativeUri("/api/Product/GetPageResult?skip={skip}&take={take}");

var productsCache = new MsPortalFx.Data.QueryCache<SamplesExtension.DataModels.Product, ProductPageableQueryParams>({

    entityTypeName: SamplesExtension.DataModels.ProductType,
    sourceUri: MsPortalFx.Data.uriFormatter(ProductPageableData.QueryString),
    navigation: {
        loadBySkipTake: (
            suppliedQueryView: MsPortalFx.Data.QueryView<SamplesExtension.DataModels.Product, ProductPageableQueryParams>,
            query: ProductPageableQueryParams,
            skip: number,
            take: number,
            filter: string): MsPortalFx.Base.Promise => {

                return suppliedQueryView.fetch({ skip: skip.toString(), take: take.toString(), categoryId: query.categoryId });
        }
    },
    processServerResponse: (response: any) => {
        return <MsPortalFx.Data.DataCacheProcessedResponse>{
            data: response.products,
            navigationMetadata: {
                totalItemCount: response.totalCount,
                continuationToken: response.continuationToken
            }
        };
    }
});
```

In the view model, use the `Pageable` extension for the grid, with the `Pageable` type. Instead of the `createView` API on the QueryCache, use the `createNavigator` API which integrates with the virtualized data system:


`\SamplesExtension\Extension\Client\Controls\Grid\ViewModels\PageableGridViewModel.ts`

```ts
constructor(container: MsPortalFx.ViewModels.PartContainerContract,
            initialState: any,
            dataContext: ControlsArea.DataContext) {

    this._pageableDataNavigator = dataContext.productDataBySkipTake.productsCache.createNavigator(container);

    // Define the extensions you wish to enable.
    var extensions = MsPortalFx.ViewModels.Controls.Lists.Grid.Extensions.Pageable;

    // Define the options required to have the extensions behave properly.
    var pageableExtensionOptions = {
        pageable: {
            type: MsPortalFx.ViewModels.Controls.Lists.Grid.PageableType.Pageable,
            dataNavigator: this._pageableDataNavigator,
            itemsPerPage: ko.observable(20)
        }
    };

    // Initialize the grid view model.
    this.pagingPageableGridViewModel = new MsPortalFx.ViewModels.Controls.Lists.Grid
        .ViewModel<SamplesExtension.DataModels.Product, ProductSelectionItem>(
            null, extensions, pageableExtensionOptions);

    // Set up which columns to show.  If you do not specify a formatter, we just call toString on
    // the item.
    var basicColumns: MsPortalFx.ViewModels.Controls.Lists.Grid.Column[] = [
        {
            itemKey: "id",
            name: ko.observable(ClientResources.gridProductIdHeader)
        },
        {
            itemKey: "description",
            name: ko.observable(ClientResources.gridProductDescriptionHeader)
        },
    ];

    this.pagingPageableGridViewModel.showHeader = true;

    this.pagingPageableGridViewModel.columns =
        ko.observableArray<MsPortalFx.ViewModels.Controls.Lists.Grid.Column>(basicColumns);

    this.pagingPageableGridViewModel.summary =
        ko.observable(ClientResources.basicGridSummary);

    this.pagingPageableGridViewModel.noRowsMessage =
        ko.observable(ClientResources.nobodyInDatabase);
}

public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
    return this._pageableDataNavigator.setQuery({ categoryId: inputs.categoryId });
}
```

[loadmore-grid]: ../media/portalfx-data/loadmore-grid.png
[pageable-grid]: ../media/portalfx-data/pageable-grid.png

- Typemetadata
    


<a name="working-with-data-before-getting-started"></a>
## Before Getting Started

- Extension authors are advised to use https://aka.ms/portalfx/batch instead of using QueryCache/EntityCache and TypeMetadata. If you have a valid scenario for using these TypeMetadata documentation follows.
- If you onboarded to TypeMetadata along time ago please apply the ExtensionLoad optimization for TypeMetadata described in [this video](https://msit.microsoftstream.com/video/5c2f3aac-b0a2-4a06-a0d1-cc13ed1aaa4b?st=1491)

<a name="working-with-data-type-metadata"></a>
## Type metadata

When performing merge operations, the DataSet library will need to know a little bit about the schema of your model objects. For example, in the case of a Computer, we want to know the property which defines the primary key of that object. This information which describes the object, and all of its properties is referred to in the portal as *type metadata*.

<a name="working-with-data-type-metadata-authored-type-metadata"></a>
### Authored type metadata

You may choose to write your own metadata to describe model objects. This is recommended if you have not C# service tier that are called by the client i.e there are not client to server contracts to maintain.

The follow snippets demonstrate how to author the datamodel, typemetadata and registration of that typemetadata for a Computer that contains a collection of ComputerComponents.

`ComputerComponent.ts`
```ts
    export interface ComputerComponent {
        name: KnockoutObservable<string>;
        display: KnockoutObservable<string>;
        componentType: KnockoutObservable<number>;
        model: KnockoutObservable<string>;
        manufacturer: KnockoutObservable<string>;
        status: KnockoutObservable<number>;
    }

    export const ComputerComponentMetadata: MsPortalFx.Data.Metadata.Metadata = {
        name: "SamplesExtension.DataModels.ComputerComponent",
        properties: {
            name: {},
            display: {},
            componentType: {},
            model: {},
            manufacturer: {},
            status: {}
        },
        idProperties: [
            name
        ],
        entityType: false,
        hasGloballyUniqueId: false
    };

    MsPortalFx.Data.Metadata.setTypeMetadata(ComputerComponentMetadata.name, ComputerComponentMetadata);

```

`Computer.ts`

```ts
    /// <amd-dependency path="./ComputerComponent" />
    import { ComputerComponent } from "./ComputerComponent";

    export interface Computer {
        name: KnockoutObservable<string>;
        display: KnockoutObservable<string>;
        model: KnockoutObservable<string>;
        manufacturer: KnockoutObservable<string>;
        components: KnockoutObservableArray<ComputerComponent>;
    }

    export const ComputerMetadata: MsPortalFx.Data.Metadata.Metadata = {
        name: "SamplesExtension.DataModels.Computer",
        properties: {
            name: {},
            display: {},
            model: {},
            manufacturer: {},
            components: {
                isArray: true,
                itemType: "SamplesExtension.DataModels.ComputerComponent"
            }
        },
        idProperties: [
            name
        ],
        entityType: false,
        hasGloballyUniqueId: false
    };

    MsPortalFx.Data.Metadata.setTypeMetadata(ComputerMetadata.name, ComputerMetadata);
```

*Note:*  the first line above with the trippleslash amd dependency is required to ensure that ComputerComponent registers its own typemetadata before computer registers its own typemetadata `/// <amd-dependency path="./ComputerComponent" />`.

- The `name` property refers to the type name of the model object.
- The `idProperties` property refers to one of the properties defined below that acts as the primary key for the object.
- The `properties` object contains a property for each property on the model object.
- The `itemType` property allows for nesting complex object types, and refers to a registered name of a metadata object. (see `setTypeMetadata`).
- The `isArray` property informs the shell that the `components` property will be an array of computercomponent objects.

The `setTypeMetadata()` method will register your metadata with the system, making it available in the data APIs.

As an example, below demonstrates how to configure QueryCache to consume the TypeMetadata via the entityTypeName property.

```ts

    import { Computer, ComputerMetadata } from "./SamplesExtension/DataModels/Computer";
...
    public computersQuery = new MsPortalFx.Data.QueryCache<Computer, any>({
        entityTypeName: ComputerMetadata.name,
        sourceUri: () => Util.appendSessionId(ComputerData._apiRoot),
    });

```

<a name="working-with-data-type-metadata-c-to-typescript-code-generation-approach"></a>
### C# to TypeScript code generation approach

As described above Type metadata can be manually authored. However, for developers that have a service tier developed using C# with a contract that must be maintained with the consuming clients TypeScript code we provide a codegen path to make this easer.

- Generation of type metadata and registration from C# to TypeScript at build time
- Generation of TypeScript model interfaces from C# model objects

Both of these features allow you to write your model objects once in C#, and then let the compiler generate interfaces and data for use at runtime.

<a name="working-with-data-type-metadata-c-to-typescript-code-generation-approach-step-1-create-datamodel-project"></a>
#### Step 1: Create DataModel project

To use type metadata generation, you need to keep your model objects (aka Data Transfer Objects / DTOs) in a separate .NET project from your extension. For an example, check out the `SamplesExtension.DataModels` project included in the SDK. The class library project used to generate models requires the following dependencies:

- System.ComponentModel.Composition
- Microsoft.Portal.TypeMetadata.  Note: this assembly can be found in the Microsoft.Portal.TypeMetadata NuGet package.

At the top of any C# file using the `TypeMetadataModel` annotation, the following namespaces must be imported:

- `Microsoft.Portal.TypeMetadata`

<a name="working-with-data-type-metadata-c-to-typescript-code-generation-approach-step-2-configure-typemetadata-generation"></a>
#### Step 2: Configure TypeMetadata generation

- Open the client project (not your datamodels project) i.e Extension.csproj,  Add the following to `Extension.csproj`

```xml

<PropertyGroup>
 <PortalEmitTypeMetadataTypeScript>true</PortalEmitTypeMetadataTypeScript>
  <PortalEmitTypeMetadataTypeScriptTargetFolder>Client</PortalEmitTypeMetadataTypeScriptTargetFolder>
  <BladeReferencesCodegenMode>Definitions</BladeReferencesCodegenMode>
  <PartReferencesCodegenMode>Definitions</PartReferencesCodegenMode>
</PropertyGroup>

```

*Note*: `PortalEmitTypeMetadataTypeScriptTargetFolder` can be used to control the output path of the generated type metadata.

- Open the  './Extension.DataModels/AssemblyInfo.cs file under the  Extension.DataModels project and add the `Microsoft.Portal.TypeMetadata.IgnoreRuntimeTypeMetadataGeneration` attribute

```cs

﻿//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//-----------------------------------------------------------------------------

using Microsoft.Portal.TypeMetadata;

[assembly: IgnoreRuntimeTypeMetadataGeneration()]

```
*Note*: This attribute ensures that no typesMetadata blob is generated at runtime and embedded in the home/index response thus bloating ExtensionLoad.

<a name="working-with-data-type-metadata-c-to-typescript-code-generation-approach-step-2-add-typemetadata"></a>
#### Step 2: Add TypeMetaData
For an example of a model class which generates the TypeScript shown in the [Authored type metadata](#authored-type-metadata) section see the following


`SamplesExtension.DataModels/ComputerComponent.cs`

```cs

﻿//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//-----------------------------------------------------------------------------
using Microsoft.Portal.TypeMetadata;

namespace Microsoft.Portal.Extensions.SamplesExtension.DataModels
{
    /// <summary>
    /// Representation of a computer component used by the hubs/browse sample.
    /// </summary>
    [TypeMetadataModel(typeof(ComputerComponent), "DataModels")]
    [Indexable]
    public class ComputerComponent
    {
        /// <summary>
        /// Gets or sets the name of the computer component.
        /// </summary>
        [Id]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the display text of the computer component.
        /// </summary>
        public string Display { get; set; }

        /// <summary>
        /// Gets or sets the type of the computer component.
        /// </summary>
        public ComponentType ComponentType { get; set; }

        /// <summary>
        /// Gets or sets the model of the computer component.
        /// </summary>
        public string Model { get; set; }

        /// <summary>
        /// Gets or sets the manufacturer of the computer component.
        /// </summary>
        public string Manufacturer { get; set; }

        /// <summary>
        /// Gets or sets the status of the computer component.
        /// </summary>
        public ComponentStatus Status { get; set; }
    }

    /// <summary>
    /// The component type for the computer component.
    /// </summary>
    public enum ComponentType
    {
        /// <summary>
        /// Processor component.
        /// </summary>
        Processor,

        /// <summary>
        /// Memory component.
        /// </summary>
        Memory,

        /// <summary>
        /// Video card component.
        /// </summary>
        VideoCard,

        /// <summary>
        /// Drive component.
        /// </summary>
        Drive
    }

    /// <summary>
    /// The component status for the computer component.
    /// </summary>
    public enum ComponentStatus
    {
        /// <summary>
        /// Component is normal (success state).
        /// </summary>
        Normal,

        /// <summary>
        /// Component is defective (error state).
        /// </summary>
        Defective,

        /// <summary>
        /// Component is in overheating state (warning).
        /// </summary>
        Overheating
    }
}


```

`SamplesExtension.DataModels/Computer.cs`

```cs

﻿//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//-----------------------------------------------------------------------------
using System.Collections.Generic;
using Microsoft.Portal.TypeMetadata;

namespace Microsoft.Portal.Extensions.SamplesExtension.DataModels
{
    /// <summary>
    /// Representation of a computer used by the hubs/browse sample.
    /// </summary>
    [TypeMetadataModel(typeof(Computer), "DataModels")]
    [Indexable]
    public class Computer
    {
        /// <summary>
        /// Gets or sets the name of the computer.
        /// </summary>
        [Id]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the display text of the computer.
        /// </summary>
        public string Display { get; set; }

        /// <summary>
        /// Gets or sets the model of the computer.
        /// </summary>
        public string Model { get; set; }

        /// <summary>
        /// Gets or sets the manufacturer of the computer.
        /// </summary>
        public string Manufacturer { get; set; }

        /// <summary>
        /// Gets or sets the collection of computer component of the computer.
        /// </summary>
        public IEnumerable<ComputerComponent> Components { get; set; }
    }
}


```

In the samples above, the `[TypeMetadataModel]` data attribute designates this class as one which should be included in the type generation. The first parameter to the data attributes notes the type we're targeting (this is always the same as the class you are decorating). The second attribute provides the TypeScript namespace for the model generated object. If you do not specify a namespace, the .NET namespace of the model object will be used. The `[Id]` attribute on the name field designates the name property as the primary key field of the object. This is required when performing merge operations from data sets and edit scopes.

<a name="working-with-data-type-metadata-c-to-typescript-code-generation-approach-step-3-reference-the-datamodels-project-from-your-client-project"></a>
#### Step 3: Reference the datamodels project from your client project.

- Add a Project reference from Extension.csproj to Extension.DataModels.csproj
- Build to generate datamodels and typemetadata
- Include generated models in your csproj if not already done so.  Within the Extension.csproj this is simply

```xml
<ItemGroup>
    <None Include="Client\**\*.ts" />
</ItemGroup>
```

alternatively you can include them in your extension project in Bisual Studio by selecting the "Show All Files" option in the Solution Explorer. Right click on the `\Client\_generated` directory in the solution explorer and choose "Include in Project".

<a name="working-with-data-type-metadata-c-to-typescript-code-generation-approach-step-4-consume-generated-typemetadata-as-needed"></a>
#### Step 4: Consume generated typemetadata as needed

The following provides a brief example of how to comsume the generated typemetadata and datamodels

using within a QueryCache

```ts

    import { Computer, ComputerMetadata } from "_generated/SamplesExtension/DataModels/Computer";
    ...

    public computersQuery = new MsPortalFx.Data.QueryCache<Computer, any>({
        entityTypeName: ComputerMetadata.name,
        sourceUri: () => Util.appendSessionId(ComputerData._apiRoot),
    });

```

In many cases, you'll want to instantiate an instance of the given type. One way to accomplish this is to create a TypeScript class which implements the generated interface. However, this defeats the point of automatically generating the interface. The framework provides a method which allows generating an instance of a given interface:

```ts
    const empty = MsPortalFx.Data.Metadata.createEmptyObject(ComputerMetadata.name);
```

<a name="working-with-data-faq"></a>
## FAQ

<a name="working-with-data-faq-i-onboarded-to-typemetadata-a-long-time-ago-and-have-been-told-to-onboard-to-the-extensionload-optimized-route"></a>
### I onboarded to TypeMetadata a long time ago and have been told to onboard to the ExtensionLoad Optimized route.

[See detailed steps in this video](https://msit.microsoftstream.com/video/5c2f3aac-b0a2-4a06-a0d1-cc13ed1aaa4b?st=1491)


- Advanced topics
    - Data atomization     
    
<a name="working-with-data-data-atomization"></a>
## Data atomization

Atomization fulfills two main goals: 

1. Enables several data views to be bound to one data entity, thus giving smooth, consistent experience to user, where two views representing the same asset are always in sync. 
1. Minimizes memory trace.

Atomization can be switched only for entities, which have globally unique IDs (per type) in our metadata system. In case of such entity, add a third attribute to its TypeMetadataModel attribute in C#:

```cs

[TypeMetadataModel(typeof(Robot), "SamplesExtension.DataModels", true /* Safe to unify entity as Robot IDs are globally unique. */)]

```

Attribute is not inherited and has to be set to true for all types, which should be atomized. Atomization is switched off by default. Atomization should work out of the box in the simpliest case, all entities within extension will use the same atomization context - default one.

It is possible to select a different atomization context for a given entity cache/query cache:

```cs

var cache = new MsPortalFx.Data.QueryCache<ModelType, QueryType>({
    ...
    atomizationOptions: {
        atomizationContextId: "string-id"
    }
    ...
});

```

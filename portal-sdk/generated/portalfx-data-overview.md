<a name="overview"></a>
## Overview

The design of the Azure Portal UX provides unique challenges in regards to data access. Many Blades and Parts may be displayed at the same time, each instantiating a new view model instance, each view model often needing access to the same or related data. To optimize for these interesting data-access patterns, Azure Portal extensions follow a specific design pattern that consists of:

* **Data-management** - [DataContexts](#data-overview-data-context), [DataCaches](#data-overview-data-cache), [DataViews](#data-overview-data-view)
* **Code organization** - [Areas](#data-overview-areas)

<a name="overview-a-bird-s-eye-view-of-data"></a>
### A bird&#39;s-eye view of Data

It can be difficult from documentation alone to piece together how the various Data concepts collectively achieve the goals of efficient data-loading/updating and effective memory-management for an extension. Here is a quick, animated walk-through of how the pieces fit together and how this design relates to the Azure Portal's adaptation of the conventional MVVM pattern for extension Blades and Parts.

[Data architecture PowerPoint](https://auxdocs.blob.core.windows.net/media/DataArchitecture.pptx)

What follows is the next level of detail behind these concepts and how to apply them to an Azure Portal extension.

<a name="data-overview-data-context"></a>
<a name="overview-shared-data-access-using-datacontext"></a>
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
<a name="overview-organizing-your-extension-source-code-into-areas"></a>
### Organizing your extension source code into <strong>Areas</strong>

Areas provide an easy way to partition your extension source code, making it simpler to develop an extension with a sizable team. Areas are largely a scheme for organizing extension source code, but they do impact how DataContexts are used in an extension. In the same way that extensions employ Areas in a way that collects related Blades and Parts, each Area also maintains *the data* required by these Blades and Parts. Every extension Area gets a distinct DataContext singleton, and the DataContext typically loads/caches/updates data of a few model types necessary to support the Area's Blades and Parts.

An area is defined in your extension by taking a few steps:

  * Create a folder in your `Client\` directory. The name of that folder is the name of your area.
  * In the root of that folder, create a DataContext (see below) named `[AreaName]Area.ts`, where `[AreaName]` is the name of the folder you just created. For example, the DataContext for the 'Security' area in the sample is located at `\Client\Security\SecurityArea.ts`.

A typical extension resembles:

![Extensions can host multiple areas][extension-areas]

From a code organization standpoint, you can think of an Area as little more than a project-level folder. However, it becomes quite important when you start segmenting out data operations within your extension.

<a name="overview-developing-a-datacontext-for-your-area"></a>
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
<a name="overview-using-datacache-to-load-and-cache-data"></a>
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
<a name="overview-dataview-is-for-memory-management"></a>
### <strong>DataView</strong> is for memory management

**Memory management is very important in the Azure Portal, as memory overuse by N different extensions has been found to impact the user-perceived responsiveness of the Azure Portal.**

Each DataCache instance manages a set of *cache entries*, and DataCache includes automatic mechanisms to manage the number of cache entries present at a given time. This is important because DataCaches in an Area's DataContext will live as long as an extension is loaded, supporting potentially many Blades and Parts that will come and go as the user navigates in the Azure Portal.

When a view model calls '`fetch(...)`' on its DataView, this '`fetch(...)`' call implicitly forms a ref-count to a DataCache cache entry, *pinning* the entry in the DataCache as long as the Blade/Part view model itself is alive (or, rather, hasn't been '`dispose()`'d by the FX). When all Blade/Part view models are disposed that hold ref-counts (indirectly, via DataView) to the same cache entry, the DataCache can elect to evict/discard the cache entry. In this way, the DataCache can manage its size *automatically* (without explicit extension code).

<a name="overview-summary"></a>
### Summary

For more information on using the data APIs in the portal framework, read the documentation on [working with data](portalfx-data.md).

Next Steps: Learn about [DataCaches](portalfx-data-configuringdatacache.md).

[extension-areas]: ../media/portalfx-data-context/area.png

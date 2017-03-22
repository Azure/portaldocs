
<!-- THIS FILE IS REFERENCED IN THE portalfx-performance SECTION PLEASE START ALL HEADINGS WITH H3S -->

<a name="writing-fast-extensions"></a>
### Writing fast extensions

When writing extensions, there are a few patterns you can follow to make sure you're getting the most performance out
the browser and the portal.

<a name="writing-fast-extensions-use-amd"></a>
#### Use AMD

In the early days of the Azure Portal SDK, it was common to write extensions that bundled all scripts into a single file at
compilation time. This generally happens if you use reference statements in your classes:

<a name="writing-fast-extensions-use-amd-deprecated-synatx"></a>
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

<a name="writing-fast-extensions-use-amd-correct-synatx"></a>
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

<a name="writing-fast-extensions-use-querycache-and-entitycache"></a>
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

<a name="writing-fast-extensions-avoid-unnecessary-data-reloading"></a>
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


<a name="writing-fast-extensions-use-paging-for-large-data-sets"></a>
#### Use paging for large data sets

When working with a large data set, extension authors should use the paging features of the grid.
Paging allows deferred loading of rows, so even with a large dataset responsiveness can be maintained.
Additionally it means many rows might not need to be loaded at all. To learn more about paging with grids,
you can check out the samples:

`\Client\Controls\Grid\ViewModels\PageableGridViewModel.ts`

<a name="writing-fast-extensions-use-map-and-filter-to-reduce-size-of-rendered-data"></a>
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

<a name="writing-fast-extensions-benefits-to-ui-rendering-performance"></a>
#### Benefits to UI-rendering performance

Using the selectable grid SDK sample we can see the benefits to using `map` to project objects with only those properties required by a grid row:

![Using knockout projections to map an array][mapping]
[mapping]: ../media/portalfx-performance/mapping.png

There is almost a 50% reduction in time with these optimizations, but also note that at 300 items it is still over 1.5s. Mapping to just the 2 columns in that selectable grid sample reduces the message size by 2/3 by using the technique described above. This reduces the time needed to transfer the view model as well as reducing memory usage.


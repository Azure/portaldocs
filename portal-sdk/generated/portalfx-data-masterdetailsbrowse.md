
<a name="master-details-browse-scenario"></a>
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

<a name="master-details-browse-scenario-the-masterdetail-area-and-datacontext"></a>
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

<a name="master-details-browse-scenario-the-websites-querycache-and-entitycache"></a>
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
        return uri;
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
    sourceUri: FxData.uriFormatter(MsPortalFx.Base.Resources.getAppRelativeUri("/api/Websites/{id}"), true),

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

<a name="master-details-browse-scenario-implementing-the-master-view"></a>
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
public onInputsSet(): Promise<any> {
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

<a name="master-details-browse-scenario-implementing-the-detail-view"></a>
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
public onInputsSet(inputs: Def.BrowseDetailViewModel.InputsContract): Promise<any> {
    return this._websiteEntityView.fetch(inputs.currentItemId);
}

```

When the fetch is completed the data will be available in the view's `item` property. This blade uses the `text` data-binding in it's
HTML template to show the name, id and running status of the website but obviously you could do whatever you want with the item.
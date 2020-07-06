
<a name="querying-for-data"></a>
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

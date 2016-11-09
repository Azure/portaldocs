<properties title="" pageTitle="Querying for data" description="" authors="bradolenick" />

## Loading Data 

### Controlling the AJAX call with `supplyData`

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

### Optimize number CORS preflight requests to ARM using invokeApi

If you use CORS to call ARM directly from your extension, you will notice that the browser actually makes two network calls for every one Ajax call in your client code. Here is a before and after example:

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

### Reusing loaded/cached data with `findCachedEntity`

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

### Ignore redundant data with `cachedAjax()`

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

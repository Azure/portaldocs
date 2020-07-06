<a name="making-authenticated-ajax-calls"></a>
## Making authenticated AJAX calls

Extensions typically make AJAX calls to fetch data that is rendered in a blade/part. In most cases, these are made from the `onInitialize()` method. In some cases, extensions elect to factor the AJAX data loading out of their blade/part class, often using FX's dependency injection support to allow for mocking of data-loading.

Note that we no longer recommend using QueryCache/EntityCache as a best practice. They were developed when blades were composed of multiple parts and the parts shared data.

The best practice today is to use the `Fx/Ajax` module directly from your blade/part and if calling ARM, use the batch helpers in that module. For most services, calls will need to be authenticated by setting a  JWT token in the Authorization header. Here is a sample -

```typescript

const controllerUri = new UriBuilder(FxBase.Resources.getAppRelativeUri("/api/LoadData"));
controllerUri.query.setParameters({
    resourceId: parameters.resourceId,
    apiVersion: "2018-01-01",
});

const loadDataFromServer = ajax<ResourceEvent>({
    setAuthorizationHeader: true,
    type: "GET",
    uri: controllerUri.toString(),
});

```

By setting the value `setAuthorizationHeader` to true as shown in the example above, a token for ARM is included in the outgoing request.

However, some extensions may need to call other endpoints which need other tokens. If you do need tokens to call other resources (for example, resource can be Graph or KeyVault), please work with the onboarding team. Once onboarded to call a specific resource, you can use the resource name that is specified in the portal config to use a token for that resource when calling that :

```typescript

const graphUri = new UriBuilder(getEndpoints().graph);
graphUri.setRelativePath(parameters.objectId);
graphUri.query.setParameter("api-version", "1.6");

const loadDataFromGraph = ajax<UserDetails>({
    setAuthorizationHeader: {
        resourceName: "graph",
    },
    type: "GET",
    uri: graphUri.toString(),
});

```

<a name="making-authenticated-ajax-calls-making-batch-calls-to-arm"></a>
### Making batch calls to ARM

Extensions that call ARM should always batch their requests. This results in fewer `options` calls than the api/invoke method, and also reduces the number of concurrent network requests. As many as 20 calls can be batched into a single request. The framework automatically attaches the ARM token for batch requests. Note that the batch helper is tailored to call ARM (and only supports their batch contract).

To batch multiple requests as one, use the batch helpers that are located in the Fx/Ajax module, as in the following code -

```typescript

const loadDataFromARM = batch<Resource>({
    type: "GET",
    uri: parameters.resourceId,
    setTelemetryHeader: "DataLoadForTemplateBlade",
});

```

The portal automatically debounces multiple requests made with batch() into a single batch request. The default timeout is 100ms. However, extensions can choose to debounce on the next Javascript execution cycle instead of waiting 100 ms. There are additional options that can be set when calling batch as noted below.

If you have a fixed set of URIs that you would like to batch together, you can use the `batchMultiple` helper.

```ts
import { batchMultiple} from "Fx/Ajax";

return batchMultiple({
    batchRequests: [
       {
           uri: "https://management.azure.com/subscriptions/test/resourcegroups?api-version=2014-04-01-preview",
            httpMethod: "GET",
       },
       {
           uri: "https://management.azure.com/subscriptions/test/resourcegroups?api-version=2014-04-01-preview",
            httpMethod: "PUT",
            content: {
                  tags: { a: "b",  c:"d" },
            },
       },
    ],
}).then((batchResponse) => {
    return batchResponse.content;
});

```
<a name="making-authenticated-ajax-calls-additional-options-on-the-batch-helper"></a>
### Additional options on the batch helper

```ts
/**
 * The request options.
 */
export const enum RequestOptions {
    /**
     * Default behavior.
     *    - Defaults to foreground request
     *    - Calls are batched to ARM every 100 ms
     *    - Any ServerTimeout (503) failures for foreground GET requests
     *      are automatically retried by calling the API directly wihtout batch
     *    - Responses are not cached
     */
    None = 0,

    /**
     * Make the batch call on the next tick.
     * DebounceNextTick takes precedence over Debounce100Ms.
     */
    DebounceNextTick = 1,

    /**
     * Include the request in a batch call that is made after a 100ms delay.
     * Debounce100Ms takes precedence over DebounceOneMinute
     */
    Debounce100ms = 2, // DebounceNextTick << 1,

    /**
     * Sets this request to run in the background.
     * Background requests are batched every 60 seconds.
     */
    DebounceOneMinute = 4, // Debounce100ms << 1,

    /**
     * Forces a retry for any failure returned (statusCode >= 400) regardless of the HTTP method.
     */
    RetryForce = 8, // DebounceOneMinute << 1,

    /**
     * Skips the default retry.
     * SkipRetry takes precedence over ForceRetry if both are set.
     */
    RetrySkip = 16, // RetryForce << 1,

    /**
     * Caches the response for GET requests for 10 seconds.
     */
    ResponseCacheEnabled = 32, // RetrySkip << 1,

    /**
     * Skips caching the response for GET requests.
     */
    ResponseCacheSkip = 64, // ResponseCacheEnabled << 1,

    /**
     * Skips retry when a forbidden gateway error is received.
     */
    RetrySkipOnForbidden = 128, // ResponseCacheSkip << 1,
}
```

The retry and response caching options can be set for all requests by calling `FxAjax.initialize` method. They can also be overridden for each batch request by setting appropriate options.
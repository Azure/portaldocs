<a name="batch"></a>
# Batch

If you're calling ARM you should always batch your request.
This reduces an extra 'options' calls compared to invoke. It will also reduce the number of concurrent network requests at any given time as you can batch upto 20 calls into a single request.

To batch multiple requests as one, you need a batch call not an api/invoke. The batch helpers are in the 'Fx/Ajax' module, see below for further details.

Here is a sample:

```typescript
import * as Batch from "Fx/Ajax";

// In the supplyData method
return Batch.batch({
    uri: "https://management.azure.com/subscriptions/test/resourcegroups?api-version=2014-04-01-preview",
    type: "GET",
    // Add other properties as appropriate
}).then((batchResponse) => {
    return batchResponse.content;
});
```

> Note:
> - The portal will automatically batch multiple requests made with `batch()` together within a single batch requests.
> - The URI passed to the batch call must be an absolute URI
> - The response from a batch call is slightly different from the regular ajax call. The response will be of the form:
> - The max number of requests in a batch call is 20
> - Allowed methods are - GET, POST, DELETE, HEAD without a request body

<a name="batch-batch-api"></a>
## Batch API

```typescript
/**
 * Calls the API by batching multiple requests together.
 * Use this API if you have a single AJAX request but there is potential for batching this
 * with other requests.
 *
 * There are a few limitations when using this:
 *   - All requests must have absolute URIs
 *   - The max number of requests in a batch call is 20
 *   - Supports tenant level operations (/subscriptions, /resources, /locations, /providers, /tenants)
 *   - Allowed methods are - GET, POST, DELETE, HEAD without a request body
 *
 * @param settings The settings to use to call batch.
 * @return A promise for the batch call.
 */
export function batch<T>(settings: BatchSettings, serverAuthority?: string): Q.Promise<BatchResponseItem<T>>

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
}

/**
 * The settings for the batch call.
 */
export interface BatchSettings {
    /**
     * The request options.
     */
    options?: RequestOptions;

    /**
     * The telemetry header to set.
     */
    setTelemetryHeader?: string;

    /**
     * The http method to use. Defaults to GET.
     */
    type?: string;

    /**
     * The URI to call.
     */
    uri: string;
}

export interface BatchResponseItem<T> {
    /**
    * The response content. Can be success or failure.
    */
    content: T;

    /**
    * The response headers.
    */
    headers: StringMap<string>;

    /**
    * The response status code.
    */
    httpStatusCode: number;
}
```

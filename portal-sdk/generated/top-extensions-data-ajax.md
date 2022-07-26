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

// <docsBatchLoadData>
const loadDataFromARM = batch<Resource>({
    type: "GET",
    uri: parameters.resourceId,
    setTelemetryHeader: "DataLoadForTemplateBlade",
});
// </docsBatchLoadData>

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

<a name="naming-network-requests"></a>
## Naming network requests

Performance of network requests is very often key to user-perceived UI responsiveness.  For this reason, the Portal team has set KPI goals regarding the performance of extension-initiated network requests (see [here](performance.md#network-requests) for details).  To track progress against these KPIs, Portal telemetry includes performance data on all network requests.  See [here](performance.md#network-requests-query) for details on the telemetry or try the "`ClientAjax`" telemetry table.

If you examine the telemetry that supports the KPIs (see weekly performance KPI emails or examine the supporting telemetry directly), you'll often see network requests for your Blade/ReactView named with "`[UNNAMED]`".  This occurs for network requests where:
- the developer did not explicitly supply a logical name for the request
- a name could not be inferred (for instance, based on URLs to known endpoints like Azure Resource Manager)

For context, here is an example where the developer explicitly supplies a name:

```typescript

// <docsBatchLoadData>
const loadDataFromARM = batch<Resource>({
    type: "GET",
    uri: parameters.resourceId,
    setTelemetryHeader: "DataLoadForTemplateBlade",
});
// </docsBatchLoadData>

```

Performance measurements of "`[UNNAMED]`" network requests are not useful.  If your Blade/ReactView makes multiple such unnamed network requests, then these will be conflated in telemetry under the single "`[UNNAMED]`" name.  Likewise, in cases where these don't meet KPI goals, "`[UNNAMED]`" network requests are not actionable by a developer to go fix.

So, based on weekly performance KPI reports you receive or based on examining this performance telemetry directly, here is how to address "`[UNNAMED]`" network requests, as a first step towards ensuring your network requests meet performance KPI goals.

<a name="naming-network-requests-step-1-identify-in-source-code-where-unnamed-network-requests-are-initiated"></a>
### Step 1 - Identify in source code where unnamed network requests are initiated

<a name="naming-network-requests-step-1-identify-in-source-code-where-unnamed-network-requests-are-initiated-option-a-using-fixajaxnames-diagnostic-mode"></a>
#### Option A - Using &#39;fixajaxnames&#39; diagnostic mode

Here are the steps to take to identify in your source code where unnamed network requests are initiated:

- Navigate to the Portal, including in the query string "?feature.fixajaxnames=true&trace=diagnostics"
- In the Portal, navigate to the Blade/ReactView in question (identified in weekly performance KPI reports or in telemetry)
- In the developer console, look for information messages alerting you to unnamed network requests:
```
Supply a logical name for the ajax call to '<URL>' for inclusion in telemetry.
```
- For each, examine the associated stack trace to identify the function in your source code where the network request is initiated.

```
Supply a logical name for the ajax call to '<URL>' for inclusion in telemetry. Stack:
    at AjaxCaller._executeAjaxCall (https://portal.azure.com/Content/Dynamic/H2gJAaaFiXqe.js?-type=MsPortalFx1:13439:96)
    at AjaxCaller.ajaxExtended (https://portal.azure.com/Content/Dynamic/H2gJAaaFiXqe.js?-type=MsPortalFx1:13144:37)
    at Object.ajaxExtended (https://portal.azure.com/Content/Dynamic/H2gJAaaFiXqe.js?-type=MsPortalFx1:13758:34)
    at ajaxExtended (https://portal.azure.com/Content/Dynamic/r6uQ-uyhV6oV.js?-type=MsPortalFxStable&bundlingKind=DefaultPartitioner&jQueryNext=false&polyfill=false&preorder=true:22000:23)
    at makeRequestFunc (https://afd.hosting.portal.azure.net/iam/Content/Dynamic/M0whDYowRfP2.js?-type=DefaultPartitioner&bundlingKind=DefaultPartitioner&root=*_generated/Blades/ActiveDirectoryMenuBlade:1154:48)
    at DefaultHttpHandler.send (https://afd.hosting.portal.azure.net/iam/Content/Dynamic/M0whDYowRfP2.js?-type=DefaultPartitioner&bundlingKind=DefaultPartitioner&root=*_generated/Blades/ActiveDirectoryMenuBlade:1183:20)
    at MezzoUrlTransformingHttpHandler.send (https://afd.hosting.portal.azure.net/iam/Content/Dynamic/M0whDYowRfP2.js?-type=DefaultPartitioner&bundlingKind=DefaultPartitioner&root=*_generated/Blades/ActiveDirectoryMenuBlade:1089:31)
    at HttpClient.request (https://afd.hosting.portal.azure.net/iam/Content/Dynamic/M0whDYowRfP2.js?-type=DefaultPartitioner&bundlingKind=DefaultPartitioner&root=*_generated/Blades/ActiveDirectoryMenuBlade:312:45)
    at HttpClient.post (https://afd.hosting.portal.azure.net/iam/Content/Dynamic/M0whDYowRfP2.js?-type=DefaultPartitioner&bundlingKind=DefaultPartitioner&root=*_generated/Blades/ActiveDirectoryMenuBlade:383:25)
    at makeSmallMsGraphBatchRequest (https://afd.hosting.portal.azure.net/iam/Content/Dynamic/M0whDYowRfP2.js?-type=DefaultPartitioner&bundlingKind=DefaultPartitioner&root=*_generated/Blades/ActiveDirectoryMenuBlade:1361:23)
    at makeMsGraphBatchRequest (https://afd.hosting.portal.azure.net/iam/Content/Dynamic/M0whDYowRfP2.js?-type=DefaultPartitioner&bundlingKind=DefaultPartitioner&root=*_generated/Blades/ActiveDirectoryMenuBlade:1392:16)
    at makeMsGraphV1BatchRequest (https://afd.hosting.portal.azure.net/iam/Content/Dynamic/M0whDYowRfP2.js?-type=DefaultPartitioner&bundlingKind=DefaultPartitioner&root=*_generated/Blades/ActiveDirectoryMenuBlade:1401:16)
    at MassMsGraphBatchBuilder._sendBatchRequests (https://afd.hosting.portal.azure.net/iam/Content/Dynamic/hufEi5IqO41p.js?-type=DefaultPartitioner&bundlingKind=DefaultPartitioner&root=*_generated/Blades/UserProfileV2Blade:2147:73)
    at MassMsGraphBatchBuilder.calculateIcons (https://afd.hosting.portal.azure.net/iam/Content/Dynamic/hufEi5IqO41p.js?-type=DefaultPartitioner&bundlingKind=DefaultPartitioner&root=*_generated/Blades/UserProfileV2Blade:2208:25)
    at fetchIcons (https://afd.hosting.portal.azure.net/iam/Content/Dynamic/hufEi5IqO41p.js?-type=DefaultPartitioner&bundlingKind=DefaultPartitioner&root=*_generated/Blades/UserProfileV2Blade:2309:60)
    at https://afd.hosting.portal.azure.net/iam/Content/Dynamic/Mxf_Z5-eRrqm.js?-type=DefaultPartitioner&bundlingKind=DefaultPartitioner&root=*_generated/Blades/DeletedUsersListBladeV3:275:76
```

Here, it is quite likely that '`fetchIcons`' is the location where a name would be explicitly supplied.  Here, ultimately, the name needs to be included in the call to the FX '`ajaxExtended`' API, so the intervening functions would also need to updated to translate the name down to the '`ajaxExtended`' FX API call.

<a name="naming-network-requests-step-1-identify-in-source-code-where-unnamed-network-requests-are-initiated-option-b-consulting-scrubbeduri-in-azure-portal-telemetry"></a>
#### Option B - Consulting &#39;scrubbedUri&#39; in Azure Portal telemetry

If option A above proves difficult for any reason, another option to diagnose unnamed network requests is to make use of the 'scrubbedUri' column in the following query result:

[database('Framework').UnnamedNetworkRequests(ago(1d), now(), "Extension/Microsoft_Intune_DeviceSettings/Blade/DeviceManagementOverviewBlade")](https://dataexplorer.azure.com/clusters/azportalpartner/databases/Framework?query=H4sIAAAAAAAAAyWJwQrCMBAFf0V6aQJi8BdEBQ9VUDyXtXmGoN1gdpv4+VY9DTPjSelGAtPuM42oKT9au7oyz+KP0G844zVBVAyFZNbeLhecqpnR7N4KlpjYdXHISdJd+wPrxOi3KHHABaqRg7jNkzzcP3bEFDCC9VSQS0T93cZ+AITHF22NAAAA)

Here, you should see sigificant duplication in the '`scrubbedUri`' column.  Hopefully, based on the URIs in this column, you'll be able to identify in your source code the location where you issue such network requests.

<a name="naming-network-requests-step-2-update-the-source-code-to-explicitly-specify-a-name-for-the-network-request"></a>
### Step 2 - Update the source code to explicitly specify a name for the network request

Now that you've identified where in your source code to explicitly supply a name for a network request, *how* you supply that name will vary based on what AJAX API you're using.

<a name="naming-network-requests-step-2-update-the-source-code-to-explicitly-specify-a-name-for-the-network-request-knockoutjs-blades-parts"></a>
#### KnockoutJS Blades/Parts

If you're updating a KnockoutJS Blade (PDL, no-PDL), you're almost certainly using the AJAX APIs included in the "`Fx/Ajax`" module (preferred) or the "`MsPortalFx.Base.Net2`" namespace (older).  In any of these cases, you'll update your FX API call to include the "`setTelemetryHeader`" option:

```typescript

// <docsBatchLoadData>
const loadDataFromARM = batch<Resource>({
    type: "GET",
    uri: parameters.resourceId,
    setTelemetryHeader: "DataLoadForTemplateBlade",
});
// </docsBatchLoadData>

```

<a name="naming-network-requests-step-2-update-the-source-code-to-explicitly-specify-a-name-for-the-network-request-reactviews"></a>
#### ReactViews

If you're updating a ReactView, you're either using an FX API for your network requests or you're using native browser APIs ("`fetch`" or "`XmlHttpRequest`").

If you're using an FX API, supply the name as follows:

| API name | option |
| -------- | ------ |
| `batch`, `batchMultiple` | `setTelemetryHeader` |
| `corsFetch`, `fetch` | `commandName` |

In your ReactView, if you're using native browser APIs directly, you'll supply a request header with a name defined in the ReactViews package like so:

```
import * as Ajax from "@microsoft/azureportal-reactview/Ajax";

fetch(<URL>, {
    headers: {
        [Ajax.HeaderNames.CommandName]: <REQUEST_NAME>,
    }
});
```

<a name="naming-network-requests-step-2-update-the-source-code-to-explicitly-specify-a-name-for-the-network-request-calling-batch-apis"></a>
#### Calling &#39;batch&#39; APIs

When calling ARM 'batch', the best practice is to use an FX API ('`batch`'/'`batchMultiple`' in "`Fx/Ajax`" for KnockoutJS, in "`@microsoft/azureportal-reactview/Ajax`" for ReactViews), where there is explicit API support for naming individual items in your batch.

When calling MSGraph 'batch', there is no similar FX API support.  In this case, you'll be developing your batch items manually and supplying these as the request body for your MSGraph 'batch' call.  To name each batch item, add the '`x-ms-command-name`' request header to the batch item itself (in ReactViews, using the '`HeaderNames.CommandName`' string-typed constant from "`@microsoft/azureportal-reactview/Ajax`" for the header name).  Then, as long as you're following the approach above when issuing your MsGraph 'batch' request (see [here](#knockoutjs-bladesparts) for KnockoutJS, [here](#reactviews) for ReactViews), your batch items will each carry names in the Portal's "`ClientAjax`" telemetry table.

<a name="naming-network-requests-step-3-verify-in-telemetry"></a>
### Step 3 - Verify in telemetry

Once you've updated and deployed the changes that would supply names for your network requests, monitor the weekly performance reports or the telemetry directly to ensure that "`[UNNAMED]`" names are cleaned up as intended.  Use the Kusto query [here](performance.md#network-requests-query).  You should be able to identify rows whose "`source`" value contains the name you explicitly supply in your Blade/ReactView source code.  If you've fixed all unnamed requests, over time the weekly performance KPI reports should no longer contain "`[UNNAMED]`" entries.

<a name="extension-client-errors"></a>
# Extension Client Errors

What we refer to as 'Client Errors' are essentially any JavaScript (“client side”) error which is either thrown (but uncaught) or logged directly using the Portal SDK provided logging methods.

Errors thrown by extension code are logged to Kusto cluster `azportalpartner` database `AzurePortal` table `ExtEvents`.

For every error, we capture the error information and serialize it to a [Standardized Error Schema format](https://github.com/Azure/portaldocs/blob/main/portal-sdk/generated/portalfx-telemetry-extension-errors.md#standardized-error-schema) which is available in the `json` column of the `ExtEvents` table.

[Open in Kusto Web Explorer](https://dataexplorer.azure.com/clusters/azportalpartner/databases/AzurePortal?query=H4sIAAAAAAAAA21OMU4DQRDr8wqXe9KKJPRHFwkkCiSOCiE0unMum3C7y8yGBInHs0cKCpjCmpE9tjfnsvlgLLb4wmlHJR6UfTB2YeJjkSnjBjImt941C9SROIDzx33FN7QtrrFcIsQh9FJooGpSODGknJMZB5SEk2gMcfz1iKm4O+topVPZbkPvjkbtPjNvQyweyvdjJZ80NM0cUPWo9hUu8to3a9qzL38ae/BcGC2k6CFK8ejTQI+JZjLW5dKxRRY1vu4tRTdD87x6ufrhPOb7H0WNLXIg1qtvg9mS9DoBAAA=)

```sql
ExtEvents
| where PreciseTimeStamp > ago(1h)
    and eventLevel == 2 // indicates error (as oppossed to warning)
    and not(IsTestTraffic(userTypeHint, requestUri)) // not test traffic
| project PreciseTimeStamp, extension, area, code, message, error = parse_json(json)[0].error, json = parse_json(json)
| take 10
```

<a name="extension-client-errors-how-to-log-errors"></a>
## How to log errors

**Uncaught errors**

Uncaught errors from your extension are automatically bubbled up to the top-level Portal global error handler and then routed to the Kusto ExtEvents table.

**Caught errors**

To log your own runtime client errors, you can can log your caught runtime error using the [Log.Error API](https://github.com/Azure/portaldocs/blob/dev/portal-sdk/generated/portalfx-telemetry.md#logging-errorswarnings-to-extevents-table).

**Log.Error API Reference**

```typescript
/**
 * Log error information.
 *
 * @param entry <Error | string> The message to log.
 * @param code <number> The message code.
 * @param restArgs <any[]> Extra information to log with the message.
*/
error(entry: LogMessage, code?: number, ...restArgs: any[]): void;
```

**Log.Error API Example Usage:**

```typescript
var log = new MsPortalFx.Base.Diagnostics.Log("fileName_or_codeArea");
log.error(errorOrString, code, restArgs);
```

If an error object is passed in either the `errorOrString` or `restArgs` arguments (you can pass any number of arguments after code and then they all be included as `restArgs`), then we will automatically serialize the error object to the `json` column.

Any **none** error objects which are passed as arguments will also be included in `restArgs`, but will be output **'as-is'** to the `json` column.

Note: ExtEvents `json` column is output type is `dynamic` and the format is an array of json object, where each object is an argument that was passed as `restArgs` to the `log.Error` api.

<a name="extension-client-errors-how-to-log-errors-standardized-error-schema"></a>
### Standardized Error Schema

*Note: Your extension's client errors which are logged following best practices will be serialized into the standardized schema into the JSON column of the ExtEvents table.*

- schemaVersion: (Portal use only) Version of schema applied
- extractionType: (Portal use only) The error extraction method used based on the determined error type.
- message: A description of the error if one is available or has been set.
- name: An unlocalized error identifier which represents the type of error if one is available or has been set.
- innerError: The schema representation of the inner error that caused this error if one is available or has been set.
- stack: The stack property that provides a trace of which functions were called if available.
- data: Information associated with the error that can be proxied if available.
- httpStatusCode: The HTTP status code for errors relating to network calls if one is available.
- blade: The blade context for the blade which logged the error.

<a name="extension-client-errors-how-to-log-errors-best-practices"></a>
### Best practices

To ensure that the error information from the caught error is correctly captured and serialized to your extension client error logs in `ExtEvents`, please ensure to satisfy at least one of the following requirements:

1. Log the error object instead of just a string message
  - Bad: `Log.error(“Unable to open the pod-bay doors”)`
  - Good: `Log.error(new FxError(“Unable to open the pod-bay doors”))`

Simply wrapping the text in an `Error` or `FxError` will improve the error logging by injecting additional properties such as the stack and allow the error information to be serialized into the `JSON` column of the `ExtEvents` table using our standardized schema.

2.	Or, add the error object to the extraData argument (3rd argument, after code):
  - Also good: `Log.error(“Unable to open the pod-bay doors”, 401, new FxError(“User not authorized to open pod-bay doors”))`

<a name="extension-client-errors-how-to-log-errors-knockout-blades-example-code-snippets"></a>
### Knockout Blades - Example code snippets:

*Note: It is not a requirement, but it is strongly recommended that you also use the Portal SDK provided error class called FxError. This error class has additional properties and functionality that will greatly improve not only your errors but also the likelihood that we are able to correctly serialize your custom errors into the standardized format.*

**Basic**

```typescript
import { FxError } from "Fx/Errors";
const Log = new MsPortalFx.Base.Diagnostics.Log("fileName_or_codeArea");
Log.error(new FxError(`Something bad happened`));
```

**Logging a caught error and providing more context**

```typescript
import { FxError } from "Fx/Errors";
const Log = new MsPortalFx.Base.Diagnostics.Log("fileName_or_codeArea");
try {
    doSomething();
} catch (err) {
    Log.error(new FxError({
        message: "doSomething did something bad",
        innerErrors: [err]
    }));
}
```

**Maintain control over message and code columns of ExtEvent table to be the message you prefer**

```typescript
import { FxError } from "Fx/Errors";
const Log = new MsPortalFx.Base.Diagnostics.Log("fileName_or_codeArea");
try {
    doSomething();
} catch (err) {
    Log.error(
        "Error message", // extension provided error message
        505, // extension provided error code
        new FxError({
            innerErrors: [err]
        })
    );
}
```

<a name="extension-client-errors-how-to-log-errors-react-blades-example-code-snippets"></a>
### React Blades - Example code snippets:

*Note: It is recommended that you log Javascript built-in Error objects. Any additional properties added to them will not be serialized or recognized and will be ignored.*

**Basic logging error**

```typescript
import * as Az from "./Az";
Az.log([{
    timestamp: Date.now(),
    level: Az.LogEntryLevel.Error,
    area: "<BladeName>.ReactView",
    message: new Error("Something bad happened"),
}]));
```

**Logging a caught error**

```typescript
import * as Az from "./Az";
try {
    doSomething();
} catch (err) {
    Az.log([{
        timestamp: Date.now(),
        level: Az.LogEntryLevel.Error,
        area: "<BladeName>.ReactView",
        message: err, // You can log the error object as the message and it will be serialized into debug info for telemetry and alerts
    }]));
}
```

**Logging a caught error and providing more context**

```typescript
import * as Az from "./Az";
try {
    doSomething();
} catch (err) {
    Az.log([{
        timestamp: Date.now(),
        level: Az.LogEntryLevel.Error,
        area: "<BladeName>.ReactView",
        message: "doSomething did something bad", // provide specific context information with a string message
        args: [err] // Add the original error object to the args array and it will be serialized into its debug info for telemetry and alerts
    }]));
}
```

<a name="extension-client-errors-how-to-analyze-client-errors"></a>
## How to analyze client errors

**Extension Errors dashboard** gives you the ability to look into the errors and warnings thrown by your extension.

To view the Extension Errors PowerBi dashboard follow this link: [Extension Errors PowerBi dashboard](https://aka.ms/portalfx/dashboard/ExtensionErrors)

<a name="extension-client-errors-how-to-analyze-client-errors-prerequisites"></a>
### Prerequisites

**NOTE:** Note that your extension's errors/warnings will be tracked in this dashboard only if you have previously [onboarded to ExtTelemetry/ExtEvents tables](portalfx-telemetry.md).

<a name="extension-client-errors-how-to-analyze-client-errors-prerequisites-getting-access-to-the-extension-errors-dashboard"></a>
#### Getting access to the Extension Errors Dashboard

In order to get access to the Extension Errors Dashboard, ensure you have telemetry access. [See the Telemetry getting started](portalfx-telemetry-getting-started.md#permissions)

<a name="extension-client-errors-how-to-analyze-client-errors-where-to-look-for-error-warning-spikes"></a>
### Where to look for error/warning spikes

"Errors by Environment" and "Warnings by Environment" are the charts that you need to monitor. You should check to see if there are any significant spikes in the report.

There are three charts on each column:

- Affected Users % = this is the percentage of users which had >= 1 error divided by the total number of users which were using the portal. This chart is very useful to detect changes in the error percentage pattern.
- Affected Users Count = the total number of users which had an error thrown by the portal.
- Error Count = the total number of errors thrown by the portal.

In order to hide irrelevant spikes (where the portal is used by less than 10 users), you can select the option "Show Data" -> "Where total users > 10".

<a name="extension-client-errors-how-to-analyze-client-errors-find-the-cause-of-error-warning-spikes"></a>
### Find the cause of error/warning spikes

If you want to analyze a spike, you can drill down into the top errors thrown by your extension in a specific hour by going to the "1 Hour Error Drilldown" chart.

You can drill down into the errors thrown by the extension by using the following functions from Kusto (AzurePortal database):

- query to get the error counts for a specific environment between a startTime and an endTime, grouped by a specific time granularity (e.g. 1 hour):

```sql
GetExtensionErrorCounts(datetime("2016-07-25 00:00:00"), datetime("2016-07-26 00:00:00"), "Compute", "Error", "portal.azure.com", 1h)
| where clientVersion == "4.12.102.0 (82a67ee.160722-1641)"
```

- query to get the top 10 errors from last hour, independent of client version:

```sql
Top10ExtErrorsFromLastHour("Compute", "Error", "portal.azure.com")
```

- query to get a complete list of all the error messages for a specific environment that follow a message pattern between a startTime and an endTime:

```sql
GetExtensionErrorsByAggregatedErrorMessage(datetime("2016-07-25 18:15:00"), datetime("2016-07-26 18:30:00"), "Compute", "Error", "portal.azure.com", 'message: Script error')
| where clientVersion == "4.12.102.0 (82a67ee.160722-1641)"
| take 1000
```

Query hints:

- You can select all the error messages between startTime and endTime by using "*" when looking for the error message. Otherwise, you can search by the entire aggregated error message or just by a part of it (e.g. 'message: Script error').
- ErrorType can be: "Error", "Warning" or "Verbose".

Another useful chart is the "Last 24 Hours Error Summary", which shows the errors thrown by the an extension aggregated for the last 24 hours.

**NOTE:** We aggregate the error messages by omitting the text which is within double quotes (") or single quotes ('). We consider those parts to be the dynamic part of the message (e.g. an id, a timestamp, etc.). For example, a message like [Could not find part "PartName1"] will be treated as [Could not find part ""]. Please use this format for all the logged error messages if you want them to be aggregated by our queries.

<a name="extension-client-errors-how-to-analyze-client-errors-additional-information"></a>
### Additional information

- All time stamps shown in this dashboard are UTC time stamps.
- Currently, we automatically refresh the dashboard 8 times per day (the maximum number of scheduled refreshes allowed by PowerBI), during working hours: 8:00 AM, 9:30 AM, 11:00 AM, 12:30 PM, 2:00 PM, 3:30 PM, 5:00 PM and 6:30 PM (Pacific Time).

<a name="extension-client-errors-references"></a>
## References

<a name="extension-client-errors-references-client-error-global-error-handler-code-lookup-table"></a>
### Client Error Global Error Handler Code Lookup Table

*Note: Your extension's client errors which are uncaught will be caught by the global error handler. This is a reference for the number value used in the code column of the ExtEvents table.*

| code | text |
|---|---|
| 1 | UnhandledPromise |
| 2 | WindowOnError |
| 3 | LastError |
| 4 | NoisyError |

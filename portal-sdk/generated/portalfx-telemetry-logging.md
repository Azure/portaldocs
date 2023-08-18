<a name="logging"></a>
# Logging

The SDK provides TypeScript and .NET libraries to assist with logging.

<a name="logging-enabling-extensions-to-log-to-portal-mds-tables"></a>
#### Enabling extensions to log to portal MDS tables

This feature can be enabled by setting 'EnablePortalLogging' to true in the extensiondefinition. When this is turned on, all extension traces and telemetry are logged to the portal MDS tables.

`\SamplesDefinition.cs`

```cs
 [Export(typeof(ExtensionDefinition))]
    internal class SamplesExtensionDefinition : ExtensionDefinition
    {
        [ImportingConstructor]
        public SamplesExtensionDefinition(ArmConfiguration armConfiguration, ApplicationConfiguration applicationConfiguration)
        {
            this.EnablePortalLogging = true;
        }
```

The feature is turned on by default for serverless extension.

<a name="logging-enabling-extensions-to-log-ajax-errors-automatically-through-base-net"></a>
#### Enabling extensions to log Ajax errors automatically through Base.net

Ajax errors logging can be enabled through the required 'TraceAjaxErrors' property in extensiondefinition. When this is turned on, ajax calls made through the Base.net ajax methods will log all HTTP 5xx errors to the extension's ClientEvents MDS table.

The new attribute is added to the Extension Definition like this:
```cs
public override bool TraceAjaxErrors
{
    get
    {
        return true;
    }
}
```

<a name="logging-logging-from-the-client"></a>
#### Logging from the Client

When working on the client side of your extension, you may use your own
logging infrastructure, or opt into the provided APIs. The provided API allows
you to write messages which will appear in the browser console. In addition to
displaying in the console, the portal manages batching these messages and
provides an API to send them to the server. You can find an example of this
in:

`\Client\Diagnostics\Logging\ViewModels\LoggingViewModels.ts`

```ts
MsPortalFx.Base.Diagnostics.Log.writeEntry(
    MsPortalFx.Base.Diagnostics.LogEntryLevel.Error,
    "Area of your application",
    "The message you would like to log",
    "Extra parameter 1",
    "Extra parameter 2");
```

The code above will submit a new log entry as an error, include the area of
the site, the log message, and (n) parameters. You can also retreive logged
entries using the `MsPortalFx.Base.Diagnostics.LoggetEntries` method.


<a name="logging-logging-from-the-client-manually-accepting-log-requests"></a>
##### Manually accepting log requests

These messages are sent to `/api/ClientTrace?timeStamp={timestamp}`, which is
by default managed by the framework. If custom handling of traces is required,
the URL is configurable. To change the default trace endpoint, start by
modifying your extension's web.config to point to your own endpoint:

`web.config (appSettings section)`

```xml
<add key="Microsoft.Portal.Extensions.SamplesExtension.ApplicationConfiguration.ClientTraceUri"
     value="~/MyController/MyTraceAction" />
```

Now update the `ApplicationConfiguration.cs` class to include a
`ClientTraceUri` property:

`\Configuration\ApplicationConfiguration.cs`

```cs
[ConfigurationSetting]
public AppRelativePath ClientTraceUri
{
    get;
    private set;
}
```

Now update the `CustomApplicationContext.cs` class to include a
`ClientTraceUri` property:

`\Configuration\CustomApplicationContext.cs`

```cs
public override AppRelativePath ClientTraceUri
{
    get
    {
        return this.configuration.ClientTraceUri;
    }
}
```

The end result of these configuration changes will be updating the
`fx.environment.clientTraceUri` property available on the client of the
extension at runtime. The request will include a JSON body which includes an
array of traces. A typical payload takes the following structure:

```json
[
    {
        "timestamp": 1389849966392,
        "level": 0,
        "area": "Performance",
        "message": "This is an example trace event.",
        "args": [
            "extra arg 1",
            12345,
            "you can have many of these"
        ]
    }
]
```

If using a non-.NET backend, you will need to create an endpoint which
receives JSON in the body, and can accept these requests.

<a name="logging-logging-from-the-client-alerting-microsoft-internal-only"></a>
##### Alerting (Microsoft Internal Only)

The Portal team manages alerts for when your extension fails to load.  The Extension Load Failure alert will create an ICM incident which we will route to your team based on the [spreadsheet here](https://aka.ms/portalfx/partners).

If you are using MDS logging, you can create additional alerts for your extension through the [Geneva Monitoring system](https://jarvis-west.dc.ad.msft.net/?page=documents&section=f787c5ad-c22e-48aa-898a-1a042632f9d1&id=8a22767c-90e3-4fe6-9ea5-e421422d0e2c).  Please ensure that any alerts created are initially routed to your team (not the Portal team).

If you are using AppInsights, then please contact the [AppInsights team](mailto:VSAIDiscussion@microsoft.com).


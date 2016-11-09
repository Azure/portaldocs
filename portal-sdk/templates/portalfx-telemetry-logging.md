# Logging

{"gitdown": "include-file", "file": "./includes/portalfx-logging-from-typescript-and-dotnet.md"}

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

{"gitdown": "include-file", "file": "./includes/portalfx-internal-writing-to-mds.md"}

{"gitdown": "include-file", "file": "./includes/portalfx-internal-alerting.md"}
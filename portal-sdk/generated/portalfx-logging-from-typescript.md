The SDK provides TypeScript and .NET libraries to assist with logging.

<a name="enabling-extensions-to-log-to-portal-mds-tables"></a>
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

<a name="enabling-extensions-to-log-ajax-errors-automatically-through-base-net"></a>
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

<a name="logging-from-the-client"></a>
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

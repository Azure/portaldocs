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

<a name="logging-on-the-server"></a>
#### Logging on the Server

When using the MsPortalFx client API, messages are automatically batched and
sent to the server. If using the provided `Microsoft.Portal.Framework` DLL,
the endpoint is automatically included in your application. Trace events sent
to the provided endpoint will be automatically logged to ETW.

<a name="logging-on-the-server-logging-from-c"></a>
##### Logging from C#

In addition to managing trace events from TypeScript, there is framework
support for logging to ETW from .NET as well. To define a list of events, see
the sample at:

`\Tracing\Tracing.cs`

```cs
/// <summary>
/// Event ids for the events. This is the ETW event id.
/// </summary>
public enum EventIds
{
    /// <summary>
    /// Denotes that a website has been deleted
    /// </summary>
    WebsiteDeleted = 1,
}

/// <summary>
/// Basic tracing in the sample extension.
/// </summary>
[EventSourceDefinition("Microsoft-Portal-Extensions-SamplesExtension", Guid = "763D3D57-E01F-4DD1-BD1E-4FE96054F7A4")]
public interface IBasicTracing
{
    /// <summary>
    /// Trace the deletion of a website.
    /// </summary>
    [EventDefinition((int)EventIds.WebsiteDeleted, EventLevel.Verbose, "The website with '{0}' was deleted.")]
    void WebsiteDeleted(int id);
}
```

After defining all of the possible events, you can log new events. To use
logger, export your class and use the importing constructor below that
includes an instance of the interface created above. For example:

`\Controllers\WebsitesController.cs`

```cs
/// <summary>
/// WebsitesController class.
/// </summary>
[Export]
[PartCreationPolicy(CreationPolicy.NonShared)]
public class WebsitesController : ApiController
{
    private IBasicTracing tracing;

    /// <summary>
    /// Initializes a new instance of the WebsitesController class.
    /// </summary>
    [ImportingConstructor]
    public WebsitesController(IBasicTracing tracing)
    {
        this.tracing = tracing;
    }

    /// <summary>
    /// Deletes specific entity from the repository.
    /// </summary>
    /// <param name="id">Entity id.</param>
    /// <returns>A <see cref="HttpResponseMessage" /> with the response.</returns>
    /// <example>Hit /api/nameOfController/id with DELETE verb.</example>
    [HttpDelete]
    public async Task<HttpResponseMessage> DeleteWebsite(int id)
    {
        WebsiteModel model;
        HttpResponseMessage response;

        if (this.Repository.TryRemove(id, out model))
        {
            this.tracing.WebsiteDeleted(id);
            response = Request.CreateResponse(HttpStatusCode.OK, model);
        }
        else
        {
            response = Request.CreateResponse(HttpStatusCode.NotFound);
        }

        // Fake running some heavy operations by waiting before returning result.
        await Task.Delay(this.operationDelay);

        return response;
    }
}
```
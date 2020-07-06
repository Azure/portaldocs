
<a name="using-the-cdn"></a>
### Using the CDN
Extension authors may choose to use a CDN to serve static images, scripts, and stylesheets. The Azure Portal SDK does not require the use of a CDN, or the use of a particular CDN. However, extensions served from Azure can take advantage of the built-in CDN capabilities in the SDK.

<a name="creating-the-cdn-account"></a>
### Creating the CDN account
Follow this guide to set up your CDN account:

<a href="http://www.windowsazure.com/en-us/documentation/articles/cdn-how-to-use/" target="_blank">http://www.windowsazure.com/en-us/documentation/articles/cdn-how-to-use/</a>

<a name="configuring-your-cdn-service"></a>
### Configuring your CDN service
After creating your CDN, there are a few options that need to be set.
- Make sure HTTP and HTTPS are enabled by clicking the "Enable HTTPS" command.
- Make sure query string status is enabled by clicking the "Enable Query String" command.

<a name="configuring-your-extension"></a>
### Configuring your extension
To take advantage of the CDN capabilities in the Portal SDK, there are a few pieces that must be configured.

<a name="configuring-the-prefix"></a>
### Configuring the Prefix
After setting up your CDN, you will receive a url which can be used to access your content. It will be in the form:

    //<MyCDNNamespace>.vo.msecnd.net/

This is the prefix for your CDN service. Your production service should be configured to use this prefix. In your local web.config, can set this with the following `appSetting`:

```xml
<add key="Microsoft.Portal.Extensions.SamplesExtension.ApplicationConfiguration.CdnPrefix" 
     value="//<MyCDNNamespace>.vo.msecnd.net/" />
```

Notice that neither `http` nor `https` are used in the url. This is important. It allows your page to request content based on the current protocol of the request. Oftentimes, this setting will be blank in web.config, and instead configured in a `cscfg` for a cloud service.

<a name="reading-the-prefix-from-configuration"></a>
### Reading the prefix from configuration

To read any FX configuration, you must have a class which inherits from `ApplicationContext`. This class needs to include a `CdnPrefix` property:

```
\SamplesExtension\Configuration\CustomApplicationContext.cs
```

```cs
[Export(typeof(ApplicationContext))]
internal class CustomApplicationContext : ApplicationContext
{
    private ApplicationConfiguration configuration;

    [ImportingConstructor]
    public CustomApplicationContext(ApplicationConfiguration configuration)
    {
        this.configuration = configuration;
    }

    public override bool IsDevelopmentMode
    {
        get
        {
            return this.configuration.IsDevelopmentMode;
        }
    }

    public override string CdnPrefix
    {
        get
        {
            return this.configuration.CdnPrefix;
        }
    }
}
```

This class will assign properties which are available in your `web.config` or `*.cscfg`. To read the values from those files, create a C# class which inherits from `ConfigurationSettings` and exports `ApplicationConfiguration`:

    \SamplesExtension\Configuration\ApplicationConfiguration.cs

```cs
[Export(typeof(ApplicationConfiguration))]
public class ApplicationConfiguration : ConfigurationSettings
{
    /// <summary>
    /// Gets a value indicating whether development mode is enabled.
	/// Development mode turns minification off
    /// </summary>
    /// <remarks>
	/// Development mode turns minification off. 
	/// It also disables any caching that be happening.
	/// </remarks>
    [ConfigurationSetting]
    public bool IsDevelopmentMode
    {
        get;
        private set;
    }

    /// <summary>
    /// Gets a value indicating a custom location where browser should 
	/// find cache-able content (rather than from the application itself).
    /// </summary>
    [ConfigurationSetting]
    public string CdnPrefix
    {
        get;
        private set;
    }
}
```

<a name="iis-asp-net-configuration"></a>
### IIS / ASP.NET Configuration
Files are pushed to the CDN using the following process:

- The browser makes a request to a given CDN-able address (ex: http://exampleCDN.vo.msecnd.net/Content/jquery.js).
- If the file is already cached on the CDN, it is returned.
- If the file is not cached, the CDN service *makes a request* to the origin server for the resource (ex: http://myextension.cloudapp.net/CDN/Content/jquery.js)
- The file is cached, and returned to the client.

To enable this workflow, the CDN must be able to make an HTTP request to your extension. This would normally not be an issue, but some CDNs will make an HTTP __1.0__ request. HTTP 1.0 technically does not support gzip/deflated content, so IIS does not enable compression by default. To turn this on, the `noCompressionForHttp10` setting in `<httpCompression>` must be set to `false`:

<a href="http://www.iis.net/configreference/system.webserver/httpcompression" target="_blank">http://www.iis.net/configreference/system.webserver/httpcompression</a>

The url used for the request is in the following form:

`http://myextension.cloudapp.net/CDN/Content/jquery.js`

The */CDN/* portion of this url is inserted after the host address, and before the rest of the route for requested content. The request handling code in the SDK automatically handles incoming requests of the form /CDN/Content/... and /Content/...   

<a name="invalidating-content-on-the-cdn"></a>
### Invalidating content on the CDN

- Amd Bundles are invalidated using a **hash** of the file content i.e https://hubs-s3-portal.azurecomcdn.net/AzureHubs/Content/Dynamic/AmdBundleDefinition_**83A1A15A39494B7BB1F704FDB5F32596D4498792**.js?root=*HubsExtension/ServicesHealth/ServicesHealthArea
- static content is invalidated using the **extension version** i.e  https://hubs-s3-portal.azurecomcdn.net/AzureHubs/Content/**5.0.202.7608987.150717-1541**/Images/HubsExtension/Tour_Tile_Background_Normal.png

When you release to ensure that users are served the latest static content, as opposed to stale content,  you need to configure versioning.

<a name="configuring-versioning-of-your-extensioon"></a>
### Configuring versioning of your Extensioon


<a name="updating-extensions"></a>
### Updating extensions

The portal shell relies on environment version for making runtime decisions, e.g.:

- invalidating cached manifests
- invalidating static content served indirectly via CDN or from directly from your extension

By default this value is populated based on the version attributes present in the extension assembly.
First the runtime tries to find the `AssemblyInformationalVersionAttribute` attribute and get the value from there.
If this attribute isn't defined in the assembly, the runtime searches for the `AssemblyFileVersion` attribute and gets the value from this attribute.
You can check the version of your extensions by typing in `window.fx.environment.version` in the browser console from the extension frame.

You should ensure that while building your extension assembly, the version number is correctly stamped and updated on every build. The assembly version is added to your assembly by specifying the assembly level attribute as shown below.

```cs
[assembly: System.Reflection.AssemblyFileVersion("5.0.0.56")]
[assembly: System.Reflection.AssemblyInformationalVersionAttribute("5.0.0.56 (COMPUTER.150701-1627)")]
```
You can also override this behavior by deriving from the `ApplicationContext` class and MEF-exporting the derived class as `[Export(typeof(ApplicationContext))]` and overriding the getter for the Version property on the class. If you do this, please ensure that the overridden getter returns a constant value for a specific build.

see [AssemblyVersionAttribute](https://msdn.microsoft.com/en-us/library/system.reflection.assemblyversionattribute(v=vs.110).aspx)
see [AssemblyInformationalVersionAttribute](https://msdn.microsoft.com/en-us/library/system.reflection.assemblyinformationalversionattribute(v=vs.110).aspx)
see (Azure internal teams only) [OneBranch versioning](https://microsoft.sharepoint.com/teams/WAG/EngSys/Implement/OneBranch/Version%20Properties.aspx)

Once configured content will be served directly from your extension, or via CDN if configured, using a URL segment such as /Content/<Version> e.g /Content/**5.0.0.56**/Scripts, Content/**5.0.0.56**/Images.

<a name="implications-of-changing-the-version"></a>
### Implications of changing the version

You should not introduce breaking changes in your server code (e.g. incompatibility between client and server code). Instead leave a compatibile version of the old code around on the server for a few days, monitor its usage to ensure that customers/browsers are no longer accessing it (i.e all users have switched to the newer version of your code - likely by refreshing the portal), and then delete the code.
This can easily be accomplished by making new controllers/methods instead of making breaking changes to existing ones.
If you do end up in a situation where you make a breaking change, users will likely see a broken experience until they reload the portal.
You will need to contact the portal team in order to find a way to get past this issue.


<a name="faq"></a>
### FAQ

- I am not seeing paths w/ versioning during debug.
    - Ensure IsDevelomentMode in your *.config is set to false


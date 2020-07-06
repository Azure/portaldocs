
<a name="global-asax-cs-changes"></a>
## Global.asax.cs changes

To leverage the functionality in the ExtensionControllerBase class for your extension controller, the PrecompiledMvcViewEngine provided in the framework must be enabled.

The recommended way for doing this is to make your MVC HttpAppliction derive from the ExtensionApplicationBase class.

By doing this, the aforementioned view engine is automatically registered. Once you have done this, if you had any code in the Application_Start handler, you should override the ApplicationStartHandler method, and put it in there.

Note, keep the call to the base method as the enabling of the PrecompiledMvcViewEngine is done there.

So, your Global.asax.cs would look something like this.


```cs
/// <summary>
/// The http application for the extension.
/// </summary>
public class MvcApplication : ExtensionApplicationBase
{
    /// <summary>
    /// This method allows for execution of code on Application_Start.
    /// </summary>
    protected override void ApplicationStartHandler()
    {
        // remove the below call to the base method if you do not want to register the <c>PrecompiledMvcViewEngine</c> view engine.
        base.ApplicationStartHandler();

        AreaRegistration.RegisterAllAreas();
        WebApiConfig.Register(GlobalConfiguration.Configuration);
        FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
        RouteConfig.RegisterRoutes(RouteTable.Routes);
    }
}
```

<a name="homecontroller"></a>
## HomeController

The home controller of each extension defines the index view used to host the extension in an Iframe in the Azure Portal.

You should now inherit from the `Microsoft.Portal.FrameworkExtensionControllerBase` class to leverage built-in functionality provided by the framework.

Here's what a typical controller might look like.

```cs
[Export]
[PartCreationPolicy(CreationPolicy.NonShared)]
public class HomeController : ExtensionControllerBase
{
    /// <summary>
    /// Initializes a new instance of the HomeController class.
    /// </summary>
    [ImportingConstructor]
    public HomeController(ExtensionDefinition definition)
        : base(definition)
    {
    }
}
```

As you can see the controller above requires an extension definition which you can provide using MEF.
This extension definition should extend the ExtensionDefinition class provided by the framework. Below is a sample of what this would look like.

```cs
[Export(typeof(ExtensionDefinition))]
internal class SamplesExtensionDefinition : ExtensionDefinition
{
    [ImportingConstructor]
    public SamplesExtensionDefinition(ArmConfiguration armConfiguration)
    {
        this.PreInitializeBundles = new[] { new SamplesExtensionScripts() };
        this.ExtensionConfiguration = new Dictionary<string, object>()
        {
            { "armEndpoint", armConfiguration.ArmEndpoint }
        };
    }

    public override string GetTitle(PortalRequestContext context)
    {
        return ClientResources.samples;
    }
}
```

<a name="homecontroller-premanifestbundles"></a>
### PreManifestBundles
These are the bundles that will be loaded before the manifest is loaded. As an example, you should add the bundles for your non AMD resources over here, since they may be required by the extension manifest.

<a name="homecontroller-preinitializebundles"></a>
### PreInitializeBundles
These are the bundles that will be loaded before the extension is initialized. Any non AMD scripts that are required for the extension to function properly should be specified here so that they are loaded before the shell tries to initialize the extension.

<a name="homecontroller-extensionconfiguration"></a>
### ExtensionConfiguration
This is a dictionary for extension-specific configuration. You can add new items to this dictionary and they will be available to you on the client-side.

If you can only provide this configuration when the request is being made (e.g. if it is dependent on the request context), you can override this dictionary and provide a getter which is evaluated only when needed, at which point the request context should be available.

<a name="enabling-this-functionality-in-your-development-environment"></a>
## Enabling this functionality in your development environment
You also need to specify the "scriptoptimze=true" feature flag in your extensions JSON to leverage the performance optimizations in the base controller.

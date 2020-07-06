
<a name="support-stamping-the-extension-version-at-compile-time"></a>
### Support stamping the extension version at compile time


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


<a name="pdl-versioning"></a>
### PDL Versioning
Two build settings have been added to allow the extension version to be stamped at build time.   They are ExtensionVersion and ExtensionDescription.

Here is a usage sample in a extension *.csproj file

```xml
<PropertyGroup>
  <ExtensionVersion>1.0.0.0</ExtensionVersion>
  <ExtensionDescription>This extension build configuration is $(Configuration)</ExtensionDescription>
</PropertyGroup>
```

<a name="content-versioning"></a>
### Content Versioning
In order for the shell to provide browser caching, the recommendation is for everything under content(except svgs) to be an embedded resource. The getContentUri API works with embedded resources and enables versioning of content so content gets cached for a particular build.

```xml
<EmbeddedResource Include="Content\SamplesExtension\Scripts\MsPortalFxDocs.js" />
```

<a name="allowing-which-portal-can-load-the-extension"></a>
### Allowing which portal can load the extension
Each extension `web.config` includes an `AllowedParentFrame` app setting that specifies the list of trusted hosts that can load the extension iframe. In production, this should be set to `['portal.azure.com']` explicitly; however, for debugging purposes, you can also set it to `['*']` to allow other clients.

```xml
<!-- production -->
<add key="Microsoft.Portal.Framework.FrameworkConfiguration.AllowedParentFrame" value="['portal.azure.com']" />

<!-- test -->
<add key="Microsoft.Portal.Framework.FrameworkConfiguration.AllowedParentFrame" value="['*']" />
```

<a name="questions"></a>
### Questions?

Ask questions on: [https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza).
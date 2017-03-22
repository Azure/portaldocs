
### Support stamping the extension version at compile time

{"gitdown": "include-file", "file": "portalfx-versioning-extensions.md"}

### PDL Versioning
Two build settings have been added to allow the extension version to be stamped at build time.   They are ExtensionVersion and ExtensionDescription.

Here is a usage sample in a extension *.csproj file

```xml
<PropertyGroup>
  <ExtensionVersion>1.0.0.0</ExtensionVersion>
  <ExtensionDescription>This extension build configuration is $(Configuration)</ExtensionDescription>
</PropertyGroup>
```

### Content Versioning
In order for the shell to provide browser caching, the recommendation is for everything under content(except svgs) to be an embedded resource. The getContentUri API works with embedded resources and enables versioning of content so content gets cached for a particular build.

```xml
<EmbeddedResource Include="Content\SamplesExtension\Scripts\MsPortalFxDocs.js" />
```

### Allowing which portal can load the extension
Each extension `web.config` includes an `AllowedParentFrame` app setting that specifies the list of trusted hosts that can load the extension iframe. In production, this should be set to `['portal.azure.com']` explicitly; however, for debugging purposes, you can also set it to `['*']` to allow other clients.

```xml
<!-- production -->
<add key="Microsoft.Portal.Framework.FrameworkConfiguration.AllowedParentFrame" value="['portal.azure.com']" />

<!-- test -->
<add key="Microsoft.Portal.Framework.FrameworkConfiguration.AllowedParentFrame" value="['*']" />
```

### Questions?

Ask questions on: [https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza).
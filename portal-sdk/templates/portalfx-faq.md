
## Frequently Asked Questions

### Getting Started

#### Q: I want to create a new extension. How do I start?

A: To contribute an extension to the portal, you don't need to clone our repository; extensions can be built in their own source code trees.
You can write an extension using the [Ibiza SDK](http://aka.ms/portalfx/docs), deploy it to your own machine, and load it into the portal at runtime.
When you're ready to register your extension in the preview or production environments, reach out to Ibiza team on: [https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza).

See also: [How the portal works](portalfx-howitworks.md)

#### Q: I'm stuck. Where can I find help?

A: There are a few ways to get help:

* Read the [documentation](https://auxdocs.azurewebsites.net/)
* Read or experiment with the samples that come with the SDK. You can find them under `\My Documents\PortalSDK\FrameworkPortal\Extensions\SamplesExtension`
* Read the [debugging guide](portalfx-debugging.md)
* Reach out to Ibiza team on: [https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza).

#### Q: Which browsers are supported?

A: Currently the portal supports:

* Internet Explorer -> Version 11
* Edge -> Latest version
* Firefox -> Latest version
* Chrome -> Latest version
* Safari -> Latest version

### Technical Questions

#### Q: How do I show different commands for a blade based on the parameters passed to that blade?

A: This is not possible with PDL-based Commands, but is possible with TypeScript-based commands.
The "Toolbar" APIs demonstrate this today; call `commandBar.setItems([...])` to supply the list of commands at run-time.

See also: `SamplesExtension\Extension\Client\Blades\Toolbar\Toolbar.pdl`

### Common Issues

#### Error/Symptoms: Receive 500 Internal Server Error when loading the extension. "*Unable to find AMD modules '_generated/Manifest'*" is logged by the extension.

* Make sure your JavaScript files are embedded as resources in your extension assembly. To see embedded resources, open the assembly in Reflector or some similar tool and explore resources. You should see:
  `<YourExtensionNamespace>/Content/ … /_generated/Manifest.js` and many other resources like that one (dots and slashes might be replaced with each other).
* If those resources are embedded, make sure you have the following attribute in your assembly:
  `[assembly: AllowEmbeddedContent("<YourExtensionNamespace>")]` which tells us to look for your JavaScript as an embedded resource with this prefix.

#### Error: Form should not allow edits until an EditScope is loaded.

* This error is commonly the result of making an observable change to `EditScope` data that is not due to the user making edits in the UI.
  For example, writing to `EditScope` observables when a view model is initializing (in an attempt to establish default values).
  Instead, extensions should use the `mapIncomingDataForEditScope` option when instantiating `ParameterProvider` in order to establish initial values in the `EditScope`.

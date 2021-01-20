
<a name="frequently-asked-questions"></a>
## Frequently Asked Questions

<a name="frequently-asked-questions-getting-started"></a>
### Getting Started

<a name="frequently-asked-questions-getting-started-q-i-want-to-create-a-new-extension-how-do-i-start"></a>
#### Q: I want to create a new extension. How do I start?

A: To contribute an extension to the portal, you don't need to clone our repository; extensions can be built in their own source code trees.
You can write an extension using the [Ibiza SDK](http://aka.ms/portalfx/docs), deploy it to your own machine, and load it into the portal at runtime.
When you're ready to register your extension in the preview or production environments, reach out to Ibiza team on: [https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza).

See also: [How the portal works](portalfx-howitworks.md)

<a name="frequently-asked-questions-getting-started-q-i-m-stuck-where-can-i-find-help"></a>
#### Q: I&#39;m stuck. Where can I find help?

A: There are a few ways to get help:

* Read the [documentation](https://auxdocs.azurewebsites.net/)
* Read or experiment with the samples that come with the SDK. You can find them under `\My Documents\PortalSDK\FrameworkPortal\Extensions\SamplesExtension`
* Read the [debugging guide](portalfx-debugging.md)
* Reach out to Ibiza team on: [https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza).

<a name="frequently-asked-questions-getting-started-q-which-browsers-are-supported"></a>
#### Q: Which browsers are supported?

A: Currently the portal supports:

* Internet Explorer -> Version 11
* Microsoft Edge -> Latest version
* Firefox -> Latest version
* Chrome -> Latest version
* Safari -> Latest version

<a name="frequently-asked-questions-technical-questions"></a>
### Technical Questions

<a name="frequently-asked-questions-technical-questions-q-how-do-i-show-different-commands-for-a-blade-based-on-the-parameters-passed-to-that-blade"></a>
#### Q: How do I show different commands for a blade based on the parameters passed to that blade?

A: This is not possible with PDL-based Commands, but is possible with TypeScript-based commands.
The "Toolbar" APIs demonstrate this today; call `commandBar.setItems([...])` to supply the list of commands at run-time.

See also: `SamplesExtension\Extension\Client\Blades\Toolbar\Toolbar.pdl`

<a name="frequently-asked-questions-common-issues"></a>
### Common Issues

<a name="frequently-asked-questions-common-issues-error-symptoms-receive-500-internal-server-error-when-loading-the-extension-unable-to-find-amd-modules-_generated-manifest-is-logged-by-the-extension"></a>
#### Error/Symptoms: Receive 500 Internal Server Error when loading the extension. &quot;<em>Unable to find AMD modules &#39;_generated/Manifest&#39;</em>&quot; is logged by the extension.

* Make sure your JavaScript files are embedded as resources in your extension assembly. To see embedded resources, open the assembly in Reflector or some similar tool and explore resources. You should see:
  `<YourExtensionNamespace>/Content/ … /_generated/Manifest.js` and many other resources like that one (dots and slashes might be replaced with each other).
* If those resources are embedded, make sure you have the following attribute in your assembly:
  `[assembly: AllowEmbeddedContent("<YourExtensionNamespace>")]` which tells us to look for your JavaScript as an embedded resource with this prefix.

<a name="frequently-asked-questions-common-issues-error-form-should-not-allow-edits-until-an-editscope-is-loaded"></a>
#### Error: Form should not allow edits until an EditScope is loaded.

* This error is commonly the result of making an observable change to `EditScope` data that is not due to the user making edits in the UI.
  For example, writing to `EditScope` observables when a view model is initializing (in an attempt to establish default values).
  Instead, extensions should use the `mapIncomingDataForEditScope` option when instantiating `ParameterProvider` in order to establish initial values in the `EditScope`.

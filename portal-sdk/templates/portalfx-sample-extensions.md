
## Samples extension

The samples extension provides an individual sample for each feature available in the framework.  The samples are organized into distinct areas:

![Samples extension][samples]

After installing the SDK, the local instance of the portal will open with the samples extension pre-registered.  You can open the solution file for the extension to view how specific parts of the API behave:

```
[My Documents]\PortalSDK\FrameworkPortal\Extensions\SamplesExtension\SamplesExtension.sln
```

If you are using IntelliMirror, you you find the samples and the portal in this location:

```
%LOCALAPPDATA%\PortalSDK\FrameworkPortal\Extensions\SamplesExtension\SamplesExtension.sln
```

If you make edits to the samples, you can refresh the portal to see your changes. Each sample demonstrates a single usage of the API.  It's great for detailed information on any one API.

This extension also includes a collection of integration tests which use our test framework to validate SDK scenarios.  You can use these tests as an example to build your own selenium tests for your extension.

> If you need help beyond the documentation and samples, reach out to Ibiza team on: [https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza).

[samples]: ../media/samples.png

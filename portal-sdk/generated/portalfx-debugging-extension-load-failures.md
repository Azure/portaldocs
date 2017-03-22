* [Debugging extension load failures](#debugging-extension-load-failures)
    * [Extension failure states](#debugging-extension-load-failures-extension-failure-states)


<a name="debugging-extension-load-failures"></a>
## Debugging extension load failures

<a name="debugging-extension-load-failures-extension-failure-states"></a>
### Extension failure states
Extensions could failures are logged along with an associated failure code.  This error code is printed out as part of the error message logged by the client trace controller.
Below is a list of the failure codes and what they mean:

<a name="debugging-extension-load-failures-extension-failure-states-firstresponsenotreceived"></a>
#### FirstResponseNotReceived
This error state means that the shell loaded the extension URL obtained from the config into an IFrame, however there wasn't any response from the extension.

<a name="debugging-extension-load-failures-extension-failure-states-firstresponsenotreceived-possible-causes-and-resolution"></a>
##### Possible causes and resolution
1. Verify that the extension is correctly hosted and accessible from the browser.
2. Your extension should have code injected in your layout.cshtml which includes a postMessage call. Verify that this code gets executed.

<a name="debugging-extension-load-failures-extension-failure-states-manifestnotreceived"></a>
#### ManifestNotReceived
This error state means that the bootstrap logic was completed, however the extension did not return a manifest to the shell. The shell waits for a period of time (currently 40 seconds as of 2014/10/06) and then timed out.

<a name="debugging-extension-load-failures-extension-failure-states-manifestnotreceived-possible-causes-and-resolution"></a>
##### Possible causes and resolution
1. Verify that the extension is correctly hosted and accessible from the browser.
2. In case your extension is using AMD modules, verify that your manifest.js file is accessible from the browser. Under default settings it should be present at /Content/Scripts/_generated/manifest.js

<a name="debugging-extension-load-failures-extension-failure-states-invalidextensionname"></a>
#### InvalidExtensionName
This error state means that the name of the extension specified in the extensions JSON in config doesn't match the name of the extension in the extension manifest.

<a name="debugging-extension-load-failures-extension-failure-states-invalidextensionname-possible-causes-and-resolution"></a>
##### Possible causes and resolution
Verify what the correct name of the extension should be, and if the name in config is incorrect, update it.
If the name in the manifest is incorrect, contact the relevant extension team to update `<Extension>` tag in their PDL with the right extension name and recompile.

<a name="debugging-extension-load-failures-extension-failure-states-invalidindicateloaded"></a>
#### InvalidIndicateLoaded
This means, that the manifest for an extension was received at an invalid time. e.g. if the manifest was already obtained or the extension was already loaded.

<a name="debugging-extension-load-failures-extension-failure-states-invalidindicateloaded-possible-causes-and-resolution"></a>
##### Possible causes and resolution
Report this issue to the framework team for investigation.

<a name="debugging-extension-load-failures-extension-failure-states-invalidmanifest"></a>
#### InvalidManifest
This error state means that the manifest that was received from an extension was invalid, i.e. it had validation errors.
Scan the error logs for all the validation errors in the extension manifest and fix them.

<a name="debugging-extension-load-failures-extension-failure-states-invaliddefinition"></a>
#### InvalidDefinition
This error state means that the definition that was received from an extension was invalid, i.e. it had validation errors

<a name="debugging-extension-load-failures-extension-failure-states-invaliddefinition-possible-causes-and-resolution"></a>
##### Possible causes and resolution
Scan the error logs for all the validation errors in the extension definition and fix them.

<a name="debugging-extension-load-failures-extension-failure-states-failedtoinitialize"></a>
#### FailedToInitialize
This error state means that the extension failed to initialize one or more calls to methods on the extension's entry point class failing

<a name="debugging-extension-load-failures-extension-failure-states-failedtoinitialize-possible-causes-and-resolution"></a>
##### Possible causes and resolution
Scan all the relevant error messages during the timeframe of the failure.
These errors should have information about what exactly failed while trying to initialize the extension e.g. the initialize endpoint, the getDefinition endpoint, etc.

<a name="debugging-extension-load-failures-extension-failure-states-toomanyrefreshes"></a>
#### TooManyRefreshes
This error state means that the extension try to reload itself within the IFrame multiple times. The error should specify the number of times it refreshed before the extension was disabled

<a name="debugging-extension-load-failures-extension-failure-states-toomanyrefreshes-possible-causes-and-resolution"></a>
##### Possible causes and resolution
Scan the errors to see if there are any other relevant error messages during the time frame of the failure.

<a name="debugging-extension-load-failures-extension-failure-states-toomanybootgets"></a>
#### TooManyBootGets
This error state means that the extension try to send the bootGet message to request for Fx scripts multiple times. The error should specify the number of times it refreshed before the extension was disabled

<a name="debugging-extension-load-failures-extension-failure-states-toomanybootgets-possible-causes-and-resolution"></a>
##### Possible causes and resolution
Scan the errors to see if there are any other relevant error messages during the time frame of the failure.

<a name="debugging-extension-load-failures-extension-failure-states-timedout"></a>
#### TimedOut
This error signifies that the extension failed to load after the predefined timeout (currently 40 seconds).

<a name="debugging-extension-load-failures-extension-failure-states-timedout-possible-causes-and-resolution"></a>
##### Possible causes and resolution
Scan the errors to see if there are any other relevant error messages during the time frame of the failure.

{"gitdown": "contents"}

## Debugging

Occasionally you may run into a little bit of trouble while developing your
extension. When that happens, here are a few tips that help get you back on
track.

### Using the Debug Tool

The portal contains a debug tool to aid with extension development. The keyboard
shortcut **CTRL+ALT+D** toggles the visibility of the debug tool. When visible,
the tool overlays stickys onto each blade and part in the portal. A sticky is
also pinned to the bottom right of the portal.

![Settings](../media/portalfx-debugging/debugMode.png)

The bottom right sticky provides useful information and functionality such as: -

- The version of the portal
- Client optimizations - provides a way to toggle client optimizations such as
minification and bundling.
- User Settings
    * "Dump" logs all user settings to the console.
    * "Clear" resets a user's startboard and all other customizations. Clicking
"Clear" is equivalent to clicking Settings -> Discard modifications.
    * "Save" is solely for automated Selenium testing purposes.
- Telemetry Flush (we send telemetry to server in batches). Solely for automated Selenium testing purposes.
- Portal Services dump. Solely for shell team runtime debugging.
- Enabled features - provides a list of features that are currently enabled.
- Loaded extensions - provides a list of all extensions that are currently
loaded and their load times. Clicking an extension name will log information to
the console including the extension definition and manifest.

The stickys places on each blade and part provide the following: -
- The name and owning extension - clicking on this logs debug information to the
console including the composition instance, view model and definition.
- The revealed time and all other perf information logged by that part/blade
- View model
    * "Dump" the view model to the console for debugging purposes
showing its name, parent extension and load time. You can click that div to log
more information to the console such as the part or blade definition, view model
name and inputs.
    * "Track" the view model observables
- Deep link to the blade if applicable


### Toggling optimizations (turn on/off bundling and minification)

You can disable bundling and minification (for debugging).

The following modes are available
* **true:** all optimizations are enabled
* **false:** all optimizations are turned off
* **bundle:** files are bundled together however not minified - this mode
enables you to benefit from debugging non-minified code with friendly names and
at the same time have a reasonably fast portal on most browsers.
* **minify:** files are minified however not bundled

To set the optimizations mode for the portal and all extensions:

    https://portal.azure.com/?clientoptimizations=<value>

To set the optimization mode for a specific extension only:

    https://portal.azure.com/?<YourExtension>_clientoptimizations=<value>

You can also use IsDevelopmentMode setting on your server to alter the default
optimization settings for your extension.

### Restore default settings

The portal manages tracking the state of the desktop for users as they
navigate through the portal. This includes storing information that includes
the list of opened blades, active journeys, part selection status, and various
other states of the portal. At development time, it's often necessary to clear
this information. If new parts are not appearing on a blade or the startboard
as expected, this is often the cause.

You can reset settings in settings pane (that can be opened by clicking on settings icon in nav bar):

![Settings](../media/portalfx-debugging/settings.png)

Next, click the 'Restore default settings':

![Restore default settings](../media/portalfx-debugging/restoreDefaultSettings.png)

The portal will refresh, and user settings will be cleared.

### Checking for console errors

The portal logs a great deal of useful information into the browser developer
console. Often this surfaces common errors and problems. To open up the
console, hit the F12 key on your keyboard. After entering the developer tools in your browser, locate and
open the `console`:

![Browser console](../media/portalfx-debugging/browserConsole.png)

_The following examples demonstrate using the browser tools in Internet
Explorer. There are similar debugging tools in other popular browsers. In
Internet Explorer, the console will not start logging messages unless it is
already opened. After opening the console, you may need to refresh the portal
to see all messages._

After opening the console and refreshing the portal, do a quick visual scan of
the console log. Errors are written to the log in red:

![Browser console error](../media/portalfx-debugging/consoleError.png)

As of 9/14/2016 the best, and fastest, Developer Tools are provided by Google Chrome.

#### Trace Modes

Often the errors present in the console can lead you down the path of fixing your issues. In addition to viewing the standard errors displayed in the console, it's often useful to load the portal in trace mode. Trace mode is
enabled by appending one of the following flags to the end of your querystring.  For example: [https://portal.azure.com/?trace=diagnostics](https://portal.azure.com/?trace=diagnostics) will enable verbose debugging information in the console.

There are also a variety of other tracing mechanisms available:

- **?trace=usersettings** => Show all writes and reads to the user settings service.  Great for debugging issues that require a 'reset desktop'.
- **?trace=partsettings.viewModelOrPartName** => Show writes and reads of part settings for a specific part. Can use the viewmodel name or the part name to filter trace.
- **?trace=desktop** => Log all shell desktop operations.  Useful for reporting errors to the alias.
- **?trace=diagnostics** => Display the debug hub, and add verbose tracing.
- **?trace=inputsset.log.viewModelOrPdlName** => Log in console when onInputsSet is about to be called on extension side. Can use the viewmodel name or the part/blade name to filter trace.
- **?trace=inputsset.debug.viewModelOrPdlName** => Breaks into debugger when onInputsSet is about to be called on extension side. Can use the viewmodel name or the part/blade name to filter trace.
- **?trace=inputsset.verbose.viewModelOrPdlName** => Logs in console every time shell evalutates whether onInputsSet should be called. Can use the viewmodel name or the part/blade name to filter trace.
- **?trace=inputsset.log.WebsiteBlade,inputsset.log.CommandViewModel** => Further refine which view model to trace.

#### Diagnostic Switches

In addition to tracing, there are a variety of diagnostic switches that may be helpful when debugging:

- **?clientOptimizations=false** => Turns off bundling and minification of JavaScript to make debugging easier. Note this will apply to both the portal and extensions source. During development if you want to speed up portal load during your dev test cycles you can to turn off bundling and minification for your extension only.  To do this do not specify clientOptimizations but rather set the *IsDevelopmentMode appSetting in your web.config to true (Note: do not set IsDevelopmentMode to true on deployed extensions in production, use clientOptimizations instead).
- **?feature.canmodifyextensions** => Used by [testing in production](portalfx-testinprod.md)
- **?feature.canmodifystamps** => Used by [custom deployment environments](portalfx-deployment.md)
- **?feature.consoletelemetry=true** => Logs most telemetry events to the browser console
- **?feature.customportal=false** => Turns off automatic redirection for users in the microsoft.com tenant
- **?feature.verbosediagnostics=all** => Includes default diagnostics and all filtered diagnostics in the `Ctrl+Alt+A` popup
- **?feature.verbosediagnostics=permissions** => Includes default diagnostics and the permissions entry in the `Ctrl+Alt+A` popup
- **?feature.verbosediagnostics=assets** => Includes default diagnostics and the assets/assetManagement entries in the `Ctrl+Alt+A` popup
- **?feature.verbosediagnostics=desktop** => Includes default diagnostics and the desktop entry in the `Ctrl+Alt+A` popup
- **?nocdn=true** => Bypasses the CDN when loading resources for the *portal only*
- **?nocdn=force** => Bypasses the CDN when loading resources for portal and *all extensions*
- **?microsoft_azure_marketplace_ItemHideKey=GalleryItemName** => Shows unpublished items in the gallery

### Ensuring your extension is loaded

You can check if your extension is loaded in debug panel (**CTRL+ALT+D**)
by clicking 'Loaded extensions':

![Loaded extensions](../media/portalfx-debugging/loadedExtensions.png)

If the extension throws an error while trying to load your extension, try
clicking on the url in the console. That will lead to the location on your
machine where the extension is running. You should see either a blank web
page, or something similar to this:

![Blank page returned by an extension](../media/portalfx-debugging/extensionPageError.png)

If you see the graphic above, your extension is available for the shell to
load. If your extension is not loaded, or if your extension site is not
running, visit the [Creating Extensions](portalfx-creating-extensions.md)
and the [Debugging extension failures](portalfx-debugging-extension-load-failures.md) guides.

### Debugging JavaScript

Most modern browsers include tools that make it easy (and fun!) to debug
JavaScript. To understand how the JavaScript debugging tools work in Chrome, visit the [Chrome DevTools Overview](https://developer.chrome.com/devtools). For Microsoft Edge: check [F12 tools guide](https://developer.microsoft.com/en-us/microsoft-edge/platform/documentation/f12-devtools-guide/debugger/).

In most cases, you will be debugging code that is part of your extension. To
locate your sources, press **CTRL+P** and search for your extension by name: [YourExtension]ScriptsCore.js, and open the file. You
may also search all available source files using **CTRL+SHIFT+F**.

![Using the debug tools](../media/portalfx-debugging/debugScript.png)

To debug a specific view model, search for the code by class name. You can now
set breakpoints, add watch variables, and step through your code as described
in the [How to step through your code](https://developers.google.com/web/tools/chrome-devtools/debug/breakpoints/step-code).

To learn more about debugging JavaScript check [Debugging tools for the Web](https://vimeo.com/157292748).

### Debugging the data stack

If you're having trouble figuring out why your edit scope changes aren't showing up in your query cache or why a row in the grid was 
suddenly updated here are tips on how to debug the data stack:

* If you're working with a QueryCache or an EntityCache you can use the `dump()` method to inspect the contents of the cache at any 
point. By default it will print the data to the console but you can get the data returned as objects using `dump(true)` so you can 
do things like `queryCache.dump(true)[0].name()`.

* The edited data contained in an EditScope is accessible via the `root` property on the EditScope (if you're using an EditScopeView
then it's available at `editScopeView.editScope().root` after the editScope() observable is populated). You can view the original data 
as well using the `getOriginal()` method so to view the original root object you can do `editScope.getOriginal(editScope.root)`.

### Debugging Knockout

#### ko.dataFor and $0

We use Knockout. A lot. All of our UI that comes from view models is bound through Knockout.  As a result, when something doesn't appear to be correct on the screen, generally something has gone wrong either in the ViewModel, or in framework code.  Let's take a look at what to do when we first encounter something odd in the UI.

One of the most useful commands when debugging knockout UI:

```
ko.dataFor(element)
```

This command will get back the object bound to the element via KO.

As a very relevant aside, did you know about $0?  In most modern browsers, $0 will return the currently selected element in the elements pane.

So to access what the object bound to the UI is (which is often your ViewModel*) and examine/observe it at runtime, select the element in the elements pane, and then run the following command:

```
ko.dataFor($0)
```

For intellisense support you can do the same thing, but assign it to a variable.

```
var viewModel = ko.dataFor($0)
```

[See the ko.dataFor video in the debugging section for more details](/portal-sdk/generated/index-videos.md#debugging)

*It's not actually your ViewModel, but rather a copy of your ViewModel in the shell side of the iframe kept in sync with your ViewModel in your iframe via something called the Proxy Observable (PO).  See the [aux docs architecture here](portalfx-howitworks.md).   For now, it's probably best to recognize that it's not the same ViewModel, but can be treated mostly as such.  Most bugs I've encountered don't involve issues in the PO layer.  We'll cover that how to look at errors across iframes in a later post.

#### KnockoutObservable.subscribe and debugger

In the previous section, we talked about how to get ahold of your ViewModel object using ko.dataFor. That's all well and good, but often we're not as interested in what is in our data, but rather what caused our data to change.

Fortunately, there is a pretty straightforward trick to figure out where changes have come from. All you need to do is subscribe to the observable for any changes. The subscribe API in Knockout takes a callback that allows you to execute code.

As another relevant aside, do you know about the JavaScript [debugger](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/debugger) keyword?  Basically it tells browsers to break when it's hit.

First, grab your ViewModel via ko.dataFor:

```
var myProperty = ko.dataFor($0).observablePropertyICareAbout;
```

Then, subscribe to it:

```
myProperty.subscribe(function (value) { debugger; })
```

What this basically does is says "whenever this property changes, break". Once you hit your injected breakpoint, you can examine your call stack, and see what caused this to trigger. The variable ```value``` is the new value being set to your observable.

[See the KnockoutObservable.subscribe and debugger video in the debugging section for more details](/portal-sdk/generated/index-videos.md#debugging)

### Crossing the iframe boundary

In previous sections we ignored that there are multiple iframes and just assumed everything was in a single iframe. In reality, both iframes can, and do change, values in response to one another.  Below, we'll be taking a look at how to figure out where changes are coming from when they come from a different iframe. Note: Unlike the previous two parts, this is very portal specific. Before going any further, it's important to have at least a [high level understanding of how our portal is set up](portalfx-howitworks.md#getting-started-how-the-portal-works).

Firstly, you'll need to load the portal with diagnostics turned on (?trace=diagnostics).  Without this flag, we don't capture callstacks across iframes for perf reasons.  If doing this in a non-dev environment, it helps to turn off client optimizations as well (clientOptimizations=false), otherwise you'll be debugging minified code.

Next, you'll need to break at a point where an observable is changing:

```
ko.dataFor($0).observablePropertyICareAbout.subscribe(function (value) { debugger; })
```

At that point, you can leverage the framework to see what the callstack across iframes is via the following call:

```
MsPortalFx.Base.Rpc.Internal.messageContext.callStack
```

NOTE: Do not put this line of code anywhere in your actual source.  It will not run properly without diagnostics turned on (ie: It won’t work in prod).

This will return the combined callstack of your current frame to the bottom of the stack on the other iframe side.  Note: This only traverses the iframe boundary once.  Also, it's not a real callstack as the call across the iframe is async, so to go further back, you'll need to set a breakpoint on the other iframe and repeat the process until you find the code you are looking for.

[See the Crossing the iframe boundary video in the debugging section for more details](/portal-sdk/generated/index-videos.md#debugging)

Further reading:
1. [http://www.knockmeout.net/2013/06/knockout-debugging-strategies-plugin.html](http://www.knockmeout.net/2013/06/knockout-debugging-strategies-plugin.html)
1. [https://app.pluralsight.com/library/courses/knockout-tips/table-of-contents](https://app.pluralsight.com/library/courses/knockout-tips/table-of-contents)

### Fixing 520 Errors

When the portal encounters a part it cannot render, it will render a 520
error:

![HTTP 520 error](../media/portalfx-debugging/failure.png)

This can happen for a variety of reasons. To debug a 520 error, follow these
steps:

- Check the browser console, and look for errors.
- Click on the failed part. With some types of errors, this will add a stack trace to the browser console.
- Double check your Knockout template for correct syntax.
- Ensure all variables referenced on the template are available as public properties on the corresponding view model class.
- Reset the desktop state.
- Enable first chance exceptions in the JavaScript debugger.
- Set break points inside of the view model constructor, and ensure no errors are thrown.

<a name="production"></a>
### Debugging in production

To debug and test your local extension against the production portal (or any deployed environment), refer to [testing in production](portalfx-testinprod.md).

<a name="gettinghelp"></a>
### Getting Help

If you're stuck, ask for help!

- Read the [documentation](https://github.com/Azure/portaldocs). (yes, this documentation)
- Check out the samples. They're installed with the SDK! You can find them under `\My Documents\PortalSDK\FrameworkPortal\Extensions\SamplesExtension`
- Reach out to Ibiza team on: [https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza).

Next steps: [Deploying your extension](portalfx-deployment.md)


### FAQ

#### I have set ApplicationContext.Version for my extension, how do I check what version of my extension is currently loaded in shell?

- Go to the portal where your extension is hosted or side loaded
- Press F12 in the browser and select the console tab
- Set the current frame dropdown to that of your extension
- In the console type fx.environment.version and hit enter to see the version of your extension on the client

	![select extension iframe in debug tools](../media/portalfx-debugging/select-extension-iframe.png)

- In addition, any request you make to your extension, including ajax calls, should also return the version on the server in the response.

	![Response Headers from extension show version](../media/portalfx-debugging/)response-headers-show-version.png]

 Its important to note that there can be a difference in the fx.environment.version on the client and the version in the x-ms-version returned from the server e.g the user starts a session and the extension is updated/deployed while the user's session is still active.

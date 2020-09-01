<a name="introduction"></a>
# Introduction

Some teams need to reach Azure customers by rehosting already-developed/deployed web UI in the Azure Portal.  Other teams plan to build "portable web UI" that they will host and display in both the Azure Portal and in other Microsoft sites/apps.

This document describes a technique to integrate such web UI following a few additive steps.  It imposes minimal constraints on how that UI is developed (save expected constraints like performance, reliability, theming, accessibility).  Once integrated, teams can make elect to make incremental investments to more deeply integrate their UI into the Azure Portal (to link to/from other Azure Portal UI, to make use of standard Azure Portal chrome, etc.).

From a 10,000-foot perspective, you will be integrating your web UI as one or more Azure Portal Blades (each the equivalent of a page of UI).  For each Blade:
- You'll serve from your site a new HTML page, responsible for rendering the Blade's UI (reusing already-developed/hosted static JavaScript/HTML/CSS bundles);
- The HTML page will load an additional '`Az`' FX script and call its '`Az.initialized()`' to signal to the Azure Portal when rendering is complete.

```typescript

import * as Az from "Az";

```

    // ...

```typescript

Az.initialized();

```

This '`Az`' script is a new, [UMD](https://github.com/umdjs/umd) module/library that provides a minimal **hosting API** for your Blade UI.  Your Blade's HTML page will load this new library from a URI passed as part of the IFrame '`src`' URI.  You'll obtain TypeScript type definitions for the new '`Az`' API via the '`@types/Az`' NPM package (TODO: Add links throughout to NPM packages).

The API itself resembles the 'container' API exposed to conventional Blades and Parts and includes: authentication tokens, theming, Blade-opening/navigation, CommandBar, dialogs, etc.  You can explore the breadth of these APIs in [this sample page](https://df.onecloud.azure-test.net/#blade/SampleAzExtension/SampleBlade).

Although this new '`Az`' API is quite rich, only the '`Az.initialized()`' function must be used.  All other APIs are optional and can be used selectively to integrate more deeply with the Azure Portal.

<a name="performance-a-warning"></a>
# Performance - A warning

Following this technique, your web UI will be displayed in the browser using a child `<iframe>` element.  The choice of `<iframe>` is key to keeping your site loosely coupled with the Azure Portal site.

Initializing a child `<iframe>` can be costly and **will slow your end-to-end Blade-rendering performance** relative to displaying your web UI on its native site (that is, not rehosted in the Azure Portal).

All Azure Portal Blades ('`Az`' Blades included) are required to meet performance goals for 'BladeFullReady' rendering time (see [here](./portalfx-performance-overview.md#blade-performance)).  This is particularly difficult for '`Az`' Blades, given the cost of a child `<iframe>`.

Some (hopefully helpful) advice to be successful with '`Az`' Blades:
- **Do not** assume that your web UI will render as fast in the Azure Portal as it does standalone.  Budget for Azure Portal-specific performance analysis/optimization.
- **Do not** try to encapsulate an entire SPA website as a Blade (including client-side JavaScript routers and in-page navigation support).
    - Rather, consider deconstructing your SPA site and its pages/components into N discrete Blades, each of which can presumably load/render faster than a heavy SPA homepage.  Link between these Blades using '`Az.openBlade(...)`'.  Another benefit of this approach is out-of-the-box integration with the Azure Portal's navigation system (including updating the address bar on every navigation).

See [here]() for more help analyzing the performance of your '`Az`' Blade.

<a name="step-by-step-integration"></a>
# Step-by-step integration

<a name="step-by-step-integration-locally-developing-and-testing-your-blade"></a>
## Locally developing and testing your Blade

There are a couple simple steps required to quickly develop an HTML page that you can see rendered as a Blade in the Azure Portal.

<a name="step-by-step-integration-locally-developing-and-testing-your-blade-step-a-return-an-html-page-for-your-blade"></a>
### <strong>Step A</strong> - Return an HTML page for your Blade

First, you'll make additions to your site to return an HTML page for the Blade that you wish to integrate into the Azure Portal.  This HTML page can be a simple Blade-specific wrapper around already-built/deployed configuration of ReactJS components (for instance).  The Azure Portal will load the HTML page into a child IFrame with a '`src`' URI of the form:

    <EXTENSION_BASE_URI>/az/<EXTENSION_VERSION>/blades/<BLADE_NAME>.<DISPLAY_LANGUAGE>.html#<BLADE_PARAMETERS>

where:
* `<EXTENSION_BASE_URI>` - The base URI for your site.  During development, this is typically a '`localhost`' URI of your locally-hosted site (see "Test your new Blade" [below](#step-c---test-your-new-blade)).  Once deployed, this URI will be registered in the Azure Portal's extensions.json file (see "Register your site's URI" [below](#step-e---register-your-sites-uri)).
* `<EXTENSION_VERSION>` - The version of your site used throughout the user's current session. This version string will be returned as part of metadata describing your site (see [here](#step-f---return-json-metadata-about-your-ui)).
* `<BLADE_NAME>` - A name of your choosing that identifies the Blade for which you're rendering UI.
* `<DISPLAY_LANGUAGE>` - The display language for the user's current Portal session.
* `<BLADE_PARAMETERS>` - Parameters passed "by the caller" of the Blade.
  * **NOTE** - As the encoding of these Blade parameters is an implementation detail and subject to change, these parameters should not be accessed directly from the IFrame's URI.  Rather these parameters should be accessed using the `Az.getParameters()` API (which encapsulates serialization/deserialization details).
  * For Blades, the caller is some other TypeScript code using the FX Blade-opening APIs (and supplying Blade parameters) or the user employing a deep-link URI (that includes encoded Blade parameters) to your Blade.

**NOTE** - The new HTML page must be accessible by the Azure Portal origin via [CORs](https://en.wikipedia.org/wiki/Cross-origin_resource_sharing).  This is because - as a performance optimization - the Portal will attempt to prefetch the HTML page via HTTP, so the HTML page is often present in the user's browser cache by the time the Blade's child `<iframe>` element is added, reducing IFrame initialization cost.

Such a Blade can be opened programmatically from TypeScript/JavaScript like so:

```typescript

import { PdlBladeReference as BladeReference } from "Fx/Composition/Selectable";

```

// ...

```typescript

container.openBlade(new BladeReference(
    "SampleBlade",
    "SampleAzExtension",
    {
        parameters: {
            fruit: "apple",
            color: "red",
        },
        onClosed: (reason, data) => {
            if (reason === BladeClosedReason.ChildClosedSelf && data && data.someReturnedData) {
                this.previouslyReturnedValue(data.someReturnedData.toString());
            }
            log.debug("AzBlade closed.");
        },
    }));

```

or deep-linked via a standard Portal #blade URL (whose format is consistent across all supported Blade variants):

    https://df.onecloud.azure-test.net#blade/SampleAzExtension/SampleBlade/fruit/apple/color/red

The associated IFrame's '`src`' URI is translated from the Portal's #blade URL.  For this very Blade (simplified for illustration) the IFrame '`src`' URI would resemble:

    https://df.onecloud.azure-test.net/SampleAzExtension/az/1.0.0.0/blades/SampleBlade.en.html#fruit/apple/color/red

<a name="initialize-az"></a>
As for the HTML page itself, you'll make simple Ibiza-specific additions to download and initialize the '`Az`' hosting library.  The additions are illustrated here (using the '`ejs`' JavaScript templating library):

```xml

<script type="text/javascript">window.azPortalTrustedOrigin = "<%- trustedPortalOrigin %>";</script>
<script type="text/javascript" src="<%= azScriptUrl %>"></script>

```

Here, query parameters are utilized as follows:
| Query parameter | '`ejs`' template parameter shown | Usage |
| --- | --- | --- |
| `trustedAuthority` | `trustedPortalOrigin` | The origin of the Azure Portal site that is loading this HTML page into a child IFrame.  Only messages from this origin will be intercepted and processed by the '`Az`' library running in your IFrame.  For security, this '`trustedAuthority`' URI value should be validated as described [later](#step-d---secure-your-blade-html-pages). |
| `azscript` | `azScriptUrl` | The URI from which the '`Az`' JavaScript bundle will be loaded.  For security, this '`azscript`' URI value should be validated as described [later](#step-d---secure-your-blade-html-pages). |

<a name="step-by-step-integration-locally-developing-and-testing-your-blade-step-b-in-your-html-page-render-your-ui"></a>
### <strong>Step B</strong> - In your HTML page, render your UI

Now, in your HTML page, you'll (typically) evaluate JavaScript that renders the UI of your Blade using your choice of UI FX/library (like ReactJS, AngularJS, etc.).  When your UI is fully-rendered, you must call '`Az.initialized()`'.  This signals to the Azure Portal to:
- Remove loading indicators for your Blade
- Record standard rendering-time telemetry for the Blade

Beyond '`Az.initialied()`', the '`Az`' library contains APIs that allow for deeper integration with the Azure Portal.  TypeScript definitions for these APIs (including JSDOC comments, Intellisense support) are included in the '`@types\Az`' NPM package included as part of the SDK.  You can explore the breadth of these APIs in [this sample page](https://df.onecloud.azure-test.net/#blade/SampleAzExtension/SampleBlade).

<a name="step-by-step-integration-locally-developing-and-testing-your-blade-step-c-test-your-new-blade"></a>
### <strong>Step C</strong> - Test your new Blade

Now, you're ready to view and debug your Blade as integrated into the Azure Portal.  If you're already familiar with ["test in prod" features](./top-extensions-production-testing.md) of the Azure Portal, you'll see that loading your Blade into the Azure Portal to view and debug is straightforward.

From the browser's address bar, you can supply:

    https://df.onecloud.azure-test.net/?feature.canmodifyextensions=true#blade/SampleAzExtension/SampleBlade&testExtensions={"SampleAzExtension":{"uri":"https://localhost:4409","azExtension":true}}

or, alternatively, you can register your site via your browser's debug console, to simplify the deep-link URI to your new Blade and allow for non-localhost 'uri' values:

    MsPortalImpl.Extension.registerTestExtension({
        name: "SampleAzExtension",
        uri: "https://localhost:4409",
        azExtension: true
    });

    https://df.onecloud.azure-test.net/?feature.canmodifyextensions=true#blade/SampleAzExtension/SampleBlade

Here, you would replace:
* '`SampleAzExtension`' with your extension name
* '`SampleBlade`' with your Blade name
* '`https://localhost:4409`' with the localhost URI where your site is hosted locally

<a name="step-by-step-integration-round-out-your-blade-for-deployment"></a>
## Round out your Blade for deployment

<a name="step-by-step-integration-round-out-your-blade-for-deployment-step-d-secure-your-blade-html-pages"></a>
### <strong>Step D</strong> - Secure your Blade HTML pages

[Above](#initialize-az), you saw how the '`trustedAuthority`' and '`azscript`' query parameters are used to initialize the '`Az`' library in your Blade HTML page.  These query parameters should be validated before your HTML page proceeds to load data and render UI.

This validation is best done on your web server, gating the response to the HTTP request for your HTML page.  The '`trustedAuthority`' and '`azscript`' query parameters should be validated to be relative to the Portal origin where your site is expected to show UI.  Typically, this validation varies per-environment for your site.  For instance, your production environment should accept URIs from the 'portal.azure.com' origin.  Your PPE environment might accept URIs only from 'df.onecloud.azure-test.net' (the Azure Portal dogfood environment).  This might resemble:

```typescript

// Ensure the Az script is loaded only from the Azure Portal (and isn't some untrusted script).
const azScriptUrl = req.query && (typeof req.query["azscript"] === "string") && req.query["azscript"] as string;
if (!isUrlOnTrustedAzurePortalDomain(azScriptUrl, isDevelopmentMode)) {
    return renderError();
}

// Validate that 'trustedAuthority' is an Azure Portal domain.
const trustedAuthorityParam = req.query && (typeof req.query["trustedAuthority"] === "string") && req.query["trustedAuthority"] as string;
if (!isUrlOnTrustedAzurePortalDomain(trustedAuthorityParam, isDevelopmentMode)) {
    return renderError();
}

```

As an additional security measure, the HTTP response for your HTML page should include the ['`Content-Security-Policy`' response header](https://en.wikipedia.org/wiki/Content_Security_Policy).  This might resemble:

```typescript

// Return CSP (https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP) allowing only the Azure Portal
// and the site itself to frame this page (or IFrames nested within the page).
const siteOrigin = `${req.protocol}://${req.get("host")}`;
res.set("Content-Security-Policy", `frame-ancestors ${trustedAuthorityParam} siteOrigin`);

```

This response header causes the browser to reject this HTML page unless loaded into a parent IFrame on the specified trusted domain.

<a name="step-by-step-integration-round-out-your-blade-for-deployment-step-e-register-your-site-s-uri"></a>
### <strong>Step E</strong> - Register your site&#39;s URI

Next, you'll need to register your site with the Azure Portal (in its various environments).  Here, you'll make additions to the Azure Portal 'extensions.json' following [this process](./top-extensions-publishing.md#another-way-to-send-a-pull-request), resembling:

    {
      "name": "YourExtensionName",
      "uri": "https://yoursite.com",
      "azExtension": true
    }

...where you'll replace '`YourExtensioneName`' and '`https://yoursite.com`' accordingly.  The '`azExtension: true`' property indicates that this "extension" is to be treated differently, meaning that its UI metadata will be loaded via '`/az/extension.json`' described next.

<a name="step-by-step-integration-round-out-your-blade-for-deployment-step-f-return-json-metadata-about-your-ui"></a>
### <strong>Step F</strong> - Return JSON metadata about your UI

The Azure Portal requires metadata about your UI and its entry points.  Return this metadata as a JSON response to requests for '`<EXTENSION_BASE_URI>/az/extension.json`' from your site.  The shape of the JSON response is described by TypeScript type definitions in the '`@types\AzExtension`' NPM package.  The JSON should contain:

- `version` - The string-typed version for your site's current deployment. This value will be included in your IFrame's '`src`' URI, enabling optimal browser caching of your Blade's static resources (your HTML page, JavaScript bundles, SVGs, etc). This also ensures that all Bladess displayed in a single user session are loaded from the same version of your site.
- `sdkVersion` - TypeScript definition files for '`Az`' and '`AzExtension`' are distributed as NPM packages.  This '`sdkVersion`' value is the version of the NPM package(s) you're using.  The Ibiza team uses the SDK version string you supply here to communicate future breaking API changes to your team.  If you use the TypeScript definitions from the '`@types\azextension`' NPM to validate your server TypeScript code, you'll find these TypeScript types force you to include the correct '`sdkVersion`' here.
- `localized` - A map from locale ids (for instance, 'en') to localized static resources (see the '`@types\AzExtension`' NPM package for details).
- `redirects` - An array of redirect items, each of which describes how to redirect navigation targetd at an old, retired Blade (often in another extension) to open instead an '`Az`' Blade hosted on your site.

<a name="step-by-step-integration-round-out-your-blade-for-deployment-step-g-optional-make-your-html-page-debuggable"></a>
### <strong>Step G</strong> - (Optional) Make your HTML page debuggable

This is an optional step that makes your Blades easily debuggable with browser debug tools.  The Azure Portal's '`clientOptimizations`' query parameter can be used to control bundling and minification of JavaScript bundles as they're loaded into the browser.  This functionality can work for the JavaScript bundles used in your Blade HTML pages too.  If you are hosting your own Blade HTML pages, you should sample the '`clientOptimizations`' query parameter passed in the IFrame '`src`' URI and return scripts accordingly:

* '`true`' (default if '`clientOptimizations`' is not supplied) - Scripts should be bundled and minified.
* '`false`' - Scripts should not be bundled or minified.
* '`bundle`' - Scripts should only be bundled but not minified.

<a name="step-by-step-integration-round-out-your-blade-for-deployment-step-h-optional-flighting-your-extension-in-the-portal-s-mpac-environment"></a>
### <strong>Step H</strong> - (Optional) Flighting your extension in the Portal&#39;s &quot;mpac&quot; environment

You'll make additions to your '`extensions.json`' entry (see [above](#step-e---register-your-sites-uri)) following the standard scheme for Azure Portal extensions (described [here](./top-extensions-flighting.md)).

The deployment/stamp that you designate as your 'mpac' flight will receive slightly altered IFrame URIs, where the '`<EXTENSION_BASE_URI>`' (see [here](#step-a---return-an-html-page-for-your-blade)) reflects the '`uriFormat`' added to your '`extensions.json`' entry.

<a name="reference"></a>
# Reference
<a name="reference-query-parameters"></a>
## Query parameters
The IFrame '`src`' URI for your Blade's HTML page will contain the following query parameters, along with their intended use:
* '`azscript`' - The Azure Portal URI from which your HTML page should load the '`Az`' JavaScript bundle.  See [here](#initialize-az) for more details.
* '`trustedAuthority`' - The HTTP origin of the Azure Portal that is loading your HTML page in an IFrame.  See [here](#initialize-az) for more details.
* '`clientOptimizations`' - An indication of whether JavaScript bundles should be bundled and minified.  See [here](#step-g---optional-make-your-html-page-debuggable) for more details.
* '`version`' - The version string that your site returns as the '`version`' property on the response to the '`<EXTENSION_BASE_URI>/az/extension.json`' request of your site (see [here](#step-f---return-json-metadata-about-your-ui)).  For optimal browser caching of static resources related to your Bladess, your static resources (JavaScript bundles, SVGs, etc) can be named according to the '`version`' value.  This same '`version`' value will be supplied to every Blade IFrame across a given user session.
* '`extensionName`' - The name under which your site's URI is registered in the Portal's '`extensions.json`' files (see [here](#step-e---register-your-sites-uri)).  Can be included in logging / telemetry.

<a name="reference-performance-telemetry"></a>
## Performance telemetry
Adapt this Kusto query to analyze the 'BladeFullReady' performace of an '`Az`' Blade:

    let bladeName = "<YOUR_BLADE_NAME>";  // Like "Extension/Microsoft_Azure_Monitoring_Logs/Blade/LogsBlade"
    let warmOnly = false;  // When 'true', this measures only N>1th Blade-openings in a session (fully cached).
    let environment = "https://ms.portal.azure.com";
    let BladeFullReady_Duration_Max = 60000;  // Exclude outrageously high BFR times.
    let perc = 95;
    let clientEvents = (action1:string) { ClientTelemetry | where toint(extract("5.0.[13]02.([0-9]*)", 1, clientVersion)) >= 9851 | where action == action1 | where name contains bladeName | where userTypeHint == "" | extend contextId = tostring(todynamic(context).Blade.instanceId), fxVersion = toint(extract("5.0.[13]02.([0-9]*)", 1, clientVersion)), openedBy = tostring(todynamic(data).openedByBladeName), cold = tostring(todynamic(data).includesExtensionLoadTime), extensionVersion = toint(extract("(?:[0-9]\\.)+([0-9]+)", 1, tostring(todynamic(data).extVersion))) };
    let extEvents = (action1:string) { ExtTelemetry | where action == action1 | where userTypeHint == "" | extend contextId = tostring(todynamic(context).Blade.instanceId) };
    (clientEvents("BladeFullReady")
    | where actionModifier == "complete"
    | where duration < BladeFullReady_Duration_Max
    | where requestUri contains environment
    | where fxVersion >= 10301  // Supporting FX telemetry markers were added in this FX version.
    | where (warmOnly != true) or (cold == "false")
    | where extensionVersion > 0  // Some extension version strings aren't .-delimited semvers.
    | project BladeFullReady_Start = clientTime - round(duration), BladeFullReady_Duration = round(duration), BladeFullReady_Complete = clientTime, contextId, fxVersion, openedBy, cold, extensionVersion )
    | join (clientEvents("IFrameAddedToDom") | project IFrameAddedToDom_Mark = clientTime, contextId) on contextId
    | join (clientEvents("IFrameInitializedMessageReceived") | project IFrameInitializedMessageReceived_Mark = clientTime, contextId) on contextId
    | join (extEvents("AzRender") | where actionModifier == "complete" | project AzRender_Start = clientTime - duration, AzRender_Duration = duration, AzRender_Complete = clientTime, contextId) on contextId
    | where AzRender_Complete < BladeFullReady_Complete  // I've seen AzRender twice for a given BladeFullReady.  Refreshing the IFrame?
    | project BladeFullReady_Duration, AddIFrameToDOM_Duration = IFrameAddedToDom_Mark - BladeFullReady_Start, IFrameLoading_Duration = AzRender_Start - IFrameAddedToDom_Mark, AzRender_Duration, LostAfter_Duration = IFrameInitializedMessageReceived_Mark - AzRender_Complete, ResolveBladeFullReady_Duration = BladeFullReady_Complete - IFrameInitializedMessageReceived_Mark, fxVersion, openedBy, cold, extensionVersion
    | summarize count(), BladeFullReady = round(percentile(BladeFullReady_Duration, perc)), AddIFrameToDOM = round(percentile(AddIFrameToDOM_Duration, perc)), LoadIFrame = round(percentile(IFrameLoading_Duration, perc)), RenderInIFrame = round(percentile(AzRender_Duration, perc))
    by extensionVersion
    //by fxVersion

Here:
| Column | Definition |
| --- | --- |
| BladeFullReady | Reflects the Portal-standard 'BladeFullReady' rendering-time measurement. |
| AddIFrameToDom | Step 1 - Time spent loading FX feature bundles (if necessary) and evaluating JavaScript leading to placing the `<iframe>` element in the DOM. The FX is accountable for this time. |
| LoadIFrame | Step 2 - Time spent by the browser downloading the Blade's HTML homepage, downloading and evaluating the `Az` script.  This scales reliably with the size of your HTML homepage.  This time can be reduced by trimming down your HTML page to a simple stub that loads the '`Az`' script and any JavaScript essential to rendering (and reducing the size of this script too). |
| RenderInIFrame | Step 3 - Remaining time spent in the IFrame until the call to '`Az.initialized()`' is made. Can be reduced by eliminating unnecessary static bundles (JavaScript, etc), reducing and/or optimizing backend calls, etc. |

<a name="wrap-up"></a>
# Wrap-up

Feedback always welcome.
Post to [internal StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-az) with questions and difficulties.

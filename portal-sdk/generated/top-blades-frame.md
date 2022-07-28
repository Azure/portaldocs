<a name="frame-blades"></a>
## Frame Blades

FrameBlades provide an alternative programming model for developing UI in Ibiza. This alternative gives the extension author full control over the DOM via an IFrame. Fx controls cannot be used within FrameBlades.

Because Frame blades do not use Ibiza Fx controls, extension developers are fully responsible for accessibility, theming, and consistency.

While this programming model results in maximum flexibility, it  also adds a significant burden of accessibility, theming, and consistency on the developer.   We recommend using Frame blades under the following conditions.

* An existing web experience needs to be migrated to Ibiza without being re-implemented
* An existing web experience needs to be hosted in many environments where Ibiza is just one of the hosts
* Developers want to implement user interactions and experiences that are not supported by Ibiza Framework components. For example, you need to build a very rich, custom UX that is not likely to be reused across services.

When using AppBlade, developers are responsible for the following.

* Accessibility

    Making the blade accessible, as specified in [portalfx-accessibility.md](portalfx-accessibility.md)

* Theming

    The extension's UI should always reflect the user's currently selected theme, and should react dynamically when the user changes themes

* Consistent Look & feel

    Designing a visual experience that is consistent with the rest of Ibiza

* Controls

    Building your own controls, or using available alternatives to Ibiza Fx controls

To create a FrameBlade, you need to create 3 artifacts.

**NOTE**: In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory, and  `<dirParent>`  is the `SamplesExtension\` directory, based on where the samples were installed when the developer set up the SDK. If there is a working copy of the sample in the Dogfood environment, it is also included.

1. Register the FrameBlade with your extension by creating a TypeScript class with the @FrameBlade decorator. The samples extension file for this is located at `<dir>/Client/V2/Blades/FrameBlade/SampleFrameBlade.ts` and in the following example.

```typescript

/**
* View model for a FrameBlade.
*/
@FrameBlade.Decorator({
   reflowReady: true,
})
export class SampleFrameBlade {
   public title = ClientResources.sampleFrameBladeTitle;
   public subtitle: string;  // This FrameBlade doesn't make use of a subtitle.
   public context: FrameBlade.Context<void>;

   constructor(
       private readonly _container: FrameBlade.Container
   ) {
   }

   /*
    * View model for the frame blade.
    */
   public viewModel: FrameBlade.ViewModelV2Contract;

   public async onInitialize() {
       const viewModel = this.viewModel = FrameBlade.createViewModel(this._container, {
           src: MsPortalFx.Base.Resources.getContentUri("/Content/SamplesExtension/framebladepage.html"),
           onReceiveMessage: (message: FramePage.Message) => {
               switch (message.messageType) {
                   // This is an example of how to listen for messages from your iframe.
                   case FramePage.MessageType.OpenBlade:
                       // In this sample, opening a sample child blade.
                       this._container.openBlade(BladeReferences.forBlade("OpenBladeApiChildBlade").createReference());
                       break;
                   default:
                       break;
               }
           },
       });

       // This is an example of how to post a message back to your iframe.
       // Send initialization information to iframe.
       MsPortalFx.Base.Security.getAuthorizationToken().then((token) => {
           // Post initialization info from FrameControl to your iframe.
           viewModel.postMessage({ messageType: FramePage.MessageType.InitInfo, value: { authToken: token.header, resourceId: "testResourceId" } });
       });

       
```

2. Create an html page that will serve as the main contents of your iframe.  The samples extension file for this is located at `<dir>/Content/SamplesExtension/framebladepage.html` and in the following example.

```html
﻿<!DOCTYPE html>
<html>

<head>
    <title>Frame Blade</title>
    <meta charset="utf-8" />
</head>

<body>
    <h1 class="fxs-frame-header" style="margin: 0;">Frame Blade</h1>
    <div class="fxs-frame-token"></div>
    <div class="fxs-frame-content"></div>
    <div class="fxs-frame-documentation-link">More information and best practices for FrameBlades can be found in our <a
            href="https://github.com/Azure/portaldocs/blob/master/portal-sdk/generated/top-blades-frameblade.md"
            target="_blank">documentation
            page</a>.</div>
    <button class="fxs-frame-button" type="button">Open Blade</button>
    <!-- Define frameSignature and allowed origin list -->
    <script>
        var frameSignature = "FxFrameBlade";
        var allowedParentFrameAuthorities = ["df.onecloud.azure-test.net", "portal.azure.com"];
    </script>
    <script src="../Scripts/IFrameSample/FramePage.js"></script>
    <script src="../Scripts/IFrameSample/IdleBehavior.js"></script>
</body>

</html>

```

3. Create a script that will communicate with your extension by using post messages. This is how your extension can get the auth token, respond to theme changes, notify when it is idle, and other tasks. The samples extension file for this is located at `<dir>/Content/Scripts/framepage.js`, and is also in the following example.

```js
(function() {
    "use strict";

    // ---------------------------------------------------------------------------------------------
    // ------------------------------------- Helper Functions --------------------------------------
    // ---------------------------------------------------------------------------------------------

    // var frameSignature = ...;  Defined by .html page that loaded this script.

    // Capture the client session ID to use to correlate user actions and events within this
    // client session.
    let sessionId = location.hash.substr(1);

    let queryMap = (function() {
        let query = window.location.search.substring(1);
        let parameterList = query.split("&");
        let map = {};
        for (let i = 0; i < parameterList.length; i++) {
            let pair = parameterList[i].split("=");
            map[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
        }
        return map;
    })();

    function getQueryParameter(name) {
        return queryMap[name] || "";
    }

    function postMessageToParent(kind) {
        window.parent.postMessage({
            signature: frameSignature,
            kind: kind,
        }, trustedParentOrigin);
    }

    // ---------------------------------------------------------------------------------------------
    // --------------------------------------- Security Code ---------------------------------------
    // ---------------------------------------------------------------------------------------------

    // Get the below trusted origins from configuration to include the origin of the portal in
    // which the page needs to be iframe'd.
    let allowedParentFrameAuthorities = ["localhost:55555", "portal.azure.com"];
    let trustedParentOrigin = (function () {
        // Capture the client session ID to use to correlate user actions and events within this client session.
        let sessionId = location.hash.substr(1);
        // Parse query string
        let parentOriginFromQueryString = (new URLSearchParams(window.location.search)).get("trustedAuthority") || "";
        let parentTrustedAuthority = (parentOriginFromQueryString.split("//")[1] || "").toLowerCase();
        let isTrustedOrigin = allowedParentFrameAuthorities.some(function (allowedOrigin) {
            // Verify that the requested trusted authority is an allowed origin.
            if (allowedOrigin === parentTrustedAuthority) {
                return true;
            }
            // Verify that the requested trusted authority is a subdomain of an allowed origin.
            let subdomainSuffix = "." + allowedOrigin; // Eg. ".portal.azure.com"
            return parentTrustedAuthority.length > subdomainSuffix.length && parentTrustedAuthority.slice(-subdomainSuffix.length) === subdomainSuffix;
        });

        if (!isTrustedOrigin) {
            // Allow localhost for testing/development scenarios.
            if (parentTrustedAuthority.indexOf("localhost:") !== 0) {
                let errorMessage = "The origin '" + parentTrustedAuthority + "' is not trusted.";
                global.console.error(errorMessage + " Session: " + sessionId);
                throw new Error(errorMessage);
            }
        }

        return parentOriginFromQueryString;
    })();

    // ---------------------------------------------------------------------------------------------
    // -------------------------------- Handshake Code with Portal ---------------------------------
    // ---------------------------------------------------------------------------------------------

    window.addEventListener("message", function(evt) {
        // It is critical that we only allow trusted messages through. Any domain can send a
        // message event and manipulate the html.
        if (evt.origin.toLowerCase() !== trustedParentOrigin) {
            return;
        }

        let msg = evt.data;

        // Check that the signature of the message matches that of frame parts.
        if (!msg || msg.signature !== frameSignature) {
            return;
        }

        // Handle different message kinds.
        if (msg.kind === "frametitle") {
            makeViewPresentableToUser(msg);
        } else if (msg.kind === "framecontent") {
            document.getElementsByClassName("fxs-frame-content")[0].innerText = msg.data;
        } else if (msg.kind === "getAuthTokenResponse") {
            document.getElementsByClassName("fxs-frame-token")[0].innerText = "Token: " + msg.data;
        } else {
            console.warn(sessionId, "Message not recognized.", msg);
        }
    }, false);

    // ---------------------------------------------------------------------------------------------
    // -------------------------------- Code to reveal view to user --------------------------------
    // ---------------------------------------------------------------------------------------------

    function makeViewPresentableToUser(msg) {
        document.getElementsByClassName("fxs-frame-header")[0].innerText = msg.data;
        document.head.getElementsByTagName("title")[0].innerText = msg.data;

        // Post message 'revealcontent' to the parent to indicate that the part is now in a state to
        // dismiss the opaque spinner and reveal content.
        postMessageToParent("revealcontent");

        completeInitialization();
    }

    // ---------------------------------------------------------------------------------------------
    // ------------------------------ Code to complete initialization ------------------------------
    // ---------------------------------------------------------------------------------------------

    function completeInitialization() {
        // Mimic an async operation that takes 2 seconds.
        Q.delay(2000).then(() => {
            // Post message the 'initializationcomplete' to the parent to indicate that the part is
            // now ready for user interaction.
            postMessageToParent("initializationcomplete");
        });
    }

    // Send a post message indicate that the frame is ready to start initialization.
    postMessageToParent("ready");

    // This is an example of posting the 'getAuthToken' event to Portal.
    postMessageToParent("getAuthToken");

})();

```

4. To ensure that the portal behaves correctly when idle, so the user is automatically logged out after a period of inactivity they have specified, you'd need to add the following code to the script mentioned above:

```ts
// Send message to indicate to parent that we are idle
window.addEventListener("blur", () => {
    window.parent.postMessage(
        {
            signature: window.frameSignature,
            kind: "frameidle",
        },
        "*"
    );
});

// Send message to indicate to parent that we are active
window.addEventListener("focus", () => {
    window.parent.postMessage(
        {
            signature: window.frameSignature,
            kind: "framebusy",
        },
        "*"
    );
});

```


<a name="changing-ui-themes"></a>
## Changing UI themes

When using a FrameBlade, extension developers can implement themes. Typically, the user selects a theme, which in turn is sent to the UI IFrame. The following code snippet demonstrates how to pass the selected theme to the UI IFrame using the **postMessage** method.

```typescript

// Get theme class and pass it to App Blade
MsPortalFx.Services.getSettings().then(settings => {
    const theme = settings["fxs-theme"];
    theme.subscribe(container, theme =>
        this.postMessage(new FxAppBlade.Message("theme", theme.name))
    ).callback(theme());
});

```

On the iframe side you can respond to the message just like you would respond to the auth token message. You can then adjust your css accordingly.

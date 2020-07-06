<a name="frequently-asked-questions"></a>
## Frequently asked questions


<!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->

<a name="frequently-asked-questions-portal-never-shows-up"></a>
### Portal never shows up

***When sideloading via the query string or fragment or via F5 the tab with the portal never shows up.***

SOLUTION: 

Check that your browser's popup blocker is not blocking the second tab from being loaded.

* * *

<a name="frequently-asked-questions-extension-will-not-sideload"></a>
### Extension will not sideload

***My Extension fails to side load and I get an ERR_INSECURE_RESPONSE in the browser console***

![ERR_INSECURE_RESPONSE](../media/portalfx-productiontest/errinsecureresponse.png)

In this case the browser is trying to load the extension but the SSL certificate from localhost is not trusted.

SOLUTION:

Install/trust the certificate.

Please checkout the stackoverflow post: [https://stackoverflow.microsoft.com/questions/15194/ibiza-extension-unable-to-load-insecure](https://stackoverflow.microsoft.com/questions/15194/ibiza-extension-unable-to-load-insecure)

Items that are specifically status codes or error messages can be located in [portalfx-extensions-status-codes.md](portalfx-extensions-status-codes.md).

* * *

<a name="frequently-asked-questions-sandboxed-iframe-security"></a>
### Sandboxed iframe security

***I get an error 'Security of a sandboxed iframe is potentially compromised by allowing script and same origin access'. How do I fix this?***

You need to allow the Azure Portal to frame your extension URL. For more information, see[portalfx-deployment-sovereign.md#allowedparentframe](portalfx-deployment-sovereign.md#allowedparentframe).

* * *


<a name="frequently-asked-questions-sideloading-in-chrome"></a>
### Sideloading in Chrome

***Ibiza sideloading in Chrome fails to load parts***
    
Enable the `allow-insecure-localhost` flag, as described in [https://stackoverflow.microsoft.com/questions/45109/ibiza-sideloading-in-chrome-fails-to-load-parts](https://stackoverflow.microsoft.com/questions/45109/ibiza-sideloading-in-chrome-fails-to-load-parts)

* * *

<a name="frequently-asked-questions-where-are-the-faq-s-for-general-extension-debugging"></a>
### Where are the FAQ&#39;s for general extension debugging?

The FAQs for debugging extensions is located at [portalfx-extensions-faq-debugging.md](portalfx-extensions-faq-debugging.md).

* * *

<a name="frequently-asked-questions-are-gallery-packages-sideloaded"></a>
### Are gallery packages sideloaded?

When configured correctly gallery packages from the extension running on localhost are sideloaded and made available in the portal at  `+ Create a resource >  see all > Local Development`  if your gallery packages are not showing up there see [https://github.com/Azure/portaldocs/blob/master/gallery-sdk/generated/index-gallery.md#gallery-package-development-and-debugging](https://github.com/Azure/portaldocs/blob/master/gallery-sdk/generated/index-gallery.md#gallery-package-development-and-debugging).

* * *

<a name="frequently-asked-questions-how-do-i-mark-automated-tests-as-test-synthetic-traffic-so-that-it-does-not-show-up-in-reporting"></a>
### How do I mark automated tests as test/synthetic traffic so that it does not show up in reporting?

Automated tests that run against a production environment should be marked as test/synthetic traffic. Use one of the following options to accomplish this.

1. Add the TestTraffic phrase to the userAgentString field. Replace TeamName and Component in the following example with the appropriate values, without the angle brackets.
TestTraffic-<TeamName>-<Component>

1. Set the query string parameter to feature.UserType=test. This setting excludes test traffic from our reports.

* * *

<a name="frequently-asked-questions-i-need-to-load-my-extension-from-a-domain-other-than-localhost"></a>
### I need to load my extension from a domain other than localhost

We recommend that you sideload using localhost, as specified in [top-extensions-sideloading.md#step-1](top-extensions-sideloading.md#step-1). But if you do have scenarios where you need to sideload the extension that is  not running on localhost, or is mapped by using a `hosts` file to a named domain, use the `registerTestExtension` API. 

To do so use the following instead of Step 1.

While sideloading using a query string and fragment is only supported for extensions running on `localhost`, registering an extension with the `registerTestExtension` API can be used for both `localhost` and other domains.

To load an extension, extension developers can use the following approach.

1. Sign in to a production account at https://portal.azure.com?feature.canmodifyextensions=true

1. Click F12 to open the Developer Tools in the browser

1. Run one of the following commands in the browser console to register a custom extension.

    ```typescript
    // use this command if the changes should persist 
    //  until the user restores default settings or
    //  executes MsPortalImpl.Extension.unregisterTestExtension("<extensionName>")
    MsPortalImpl.Extension.registerTestExtension({ 
    name: "<extensionName>", 
    uri: "https://<endpoint>:<portNumber>" }
    );
    ```
    Or, 
        
    ```typescript
    // use this command if the extension should be registered 
    //   only for the current Portal load
    MsPortalImpl.Extension.registerTestExtension({
    name: "<extensionName>",
    uri: "https://<endpoint>:<portNumber>" }, 
    <temporary>);
    ```
    
    where

    * **extensionName**: Matches the name of the extension, without the angle brackets, as specified in the <Extension> element in the `extension.pdl` file.

    * **portNumber**: Optional. The port number where the extension is hosted on the endpoint that serves the extension, as in the following example: `https://localhost:44300/`.
        
    * **temporary**: Optional. Boolean value that registers the extension in the Portal for a specific timeframe. A value of `true` means that the registered extension will persist only for the current session. A value of `false` means that the registered extension is valid across sessions. This state is saved in the browser's local storage. The default value is `false`. 

    Example

    To register an extension named `Microsoft_Azure_Demo` that is running on `https://somemachinename` for sideloading in user settings that  persist for the current user across multiple sessions, use: 

    ``` typescript
        MsPortalImpl.Extension.registerTestExtension({ name: "Microsoft_Azure_Demo", uri: "https://somemachinename" });
    ``` 
    
    To register an extension running on some other domain, or to register an extension that was mapped by using a hosts file to some domain, use the following code.  Note that supplying `,true` will register the extension only for the current session.

    ```
        MsPortalImpl.Extension.registerTestExtension({ name:  "<extensionName>", uri: "https://some.hosts.mapped.domain"}, true);
    ```

1. Reload the portal by navigating to `https://portal.azure.com?feature.canmodifyextensions=true&clientOptimizations=false`. 

**NOTE**: The `hosts` file is located at `c:\windows\system32\drivers\etc\hosts`.

* * * 

<a name="frequently-asked-questions-can-i-sideload-into-onestb"></a>
### Can I sideload into onestb?

Onebox-stb has been deprecated. Please do not use it. Instead sideload directly into df, mpac or production.

* * *

<a name="frequently-asked-questions-how-can-i-side-load-my-extension-with-obsolete-bundles"></a>
### How can I side load my extension with obsolete bundles?

See [https://aka.ms/portalfx/obsoletebundles](https://aka.ms/portalfx/obsoletebundles).

* * *
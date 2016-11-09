<properties title="" pageTitle="Testing in production" description="" authors="flanakin" />

## Testing in production

Extensions can be registered on a per-user basis on production deployments. This can be used to test a new extension or existing extension on a developer's machine with production credentials. To register a custom extension supply both of the following in the query string feature.canmodifyextensions and testExtensions in the following form:

* [https://portal.azure.com/?feature.canmodifyextensions=true#?testExtensions={"YourExtensionName":"https://localhost:1234/"}](https://portal.azure.com/?feature.canmodifyextensions=true#?testExtensions={"YourExtensionName":"https://localhost:1234/"})

  The `feature.canmodifyextensions=true` feature flag is required to support loading untrusted extensions for security purposes. The `YourExtensionName` must match the name in the `<Extension>` element in PDL and the `uri` refers to the extension endpoint. The actual uri host must be localhost. The protocol you use (HTTP vs HTTPS) must match the protocol of the Shell you’re loading your extension into (so for the production Shell, your extension must be on HTTPS), otherwise browsers won’t allow the two to communicate. (see below)

To avoid this being a phishing risk, we enforce that your extension must be hosted on localhost (any port, but no other hostname). If you need to use a different hostname than localhost, the existing registerTestExtension API is still available and may be used as follows:

* Sign in to a production account at [https://portal.azure.com?feature.canmodifyextensions=true](https://portal.azure.com?feature.canmodifyextensions=true)
* Hit F12 to open the developer tools in the browser
* Run the following command to register your custom extension:

```ts
  // use this if you want the change to be permanent until the user has resets settings or executes MsPortalImpl.Extension.unregisterTestExtension("YourExtensionName")
  MsPortalImpl.Extension.registerTestExtension({ name: "YourExtensionName", uri: "https://someserver:59344" });

  //use this if you want the extension to be registered only for the current portal load. 
  MsPortalImpl.Extension.registerTestExtension({ name: "YourExtensionName", uri: "https://someserver:59344" }, true);
```
  
* Navigate to [https://portal.azure.com?feature.canmodifyextensions=true&clientOptimizations=false](https://portal.azure.com?feature.canmodifyextensions=true&clientOptimizations=false)

  * For other useful switches, please refer to the [debugging guide](/documentation/articles/portalfx-debugging)

The registered extension will be saved to user settings, and available in future sessions. When using the portal in this mode, you will see a banner letting you know the state of the configured extensions has been changed:

![Local extensions](../media/portalfx-testinprod/localExtensions.png)

## Marking automated tests as test/synthetic traffic

Automated tests that run against a production environment need to be marked as test/synthetic traffic.  In order to accomplish this, you can do one of the following:

* Add the TestTraffic phrase to your userAgentString.  Replace `<TeamName>` and `<Component>` with appropriate values.

```ts
  TestTraffic-<TeamName>-<Component>
```

* Set the query string parameter

```ts
  feature.UserType=test
```

This allows us to exclude test traffic from our reports.

### FAQ

#### My Extension fails to side load and I get an ERR_INSECURE_RESPONSE in the browser console

![ERR_INSECURE_RESPONSE](../media/portalfx-testinprod/errinsecureresponse.png)

In this case the browser is trying to load the extension but the SSL certificate from localhost is not trusted the solution is to install/trust the certificate.

#### I get an error 'Security of a sandboxed iframe is potentially compromised by allowing script and same origin access'. How do I fix this?

You need to allow the Azure Portal to frame your extension URL. For more information, [click here](/documentation/articles/portalfx-creating-extensions#_allowing-which-portal-can-load-the-extension)

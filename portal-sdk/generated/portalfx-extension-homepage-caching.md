<a name="enabling-home-page-caching-removing-cacheability-none"></a>
### Enabling home page caching (removing &#39;cacheability: &quot;none&quot;&#39;)

<a name="enabling-home-page-caching-removing-cacheability-none-new-extensions"></a>
#### New extensions

All new extensions can skip this, they should already have home page caching enabled.

<a name="enabling-home-page-caching-removing-cacheability-none-hosting-service-extensions"></a>
#### Hosting service extensions

All extensions onboarded to the hosting service also have this home page caching enabled by default.

<a name="enabling-home-page-caching-removing-cacheability-none-if-you-still-need-to-enable-home-page-caching"></a>
#### If you still need to enable home page caching

To enable this, here are the steps you need to take:

1.  Implement [persistent caching of your scripts](portalfx-extension-persistent-caching-of-scripts.md).
1.  Ensure that your implementation of `Microsoft.Portal.Framework.ApplicationContext.GetPageVersion()` returns a *stable* value per build of your extension.
    - We implement this for your extension by default for you by using the version of your assembly.
    If this value changes between different servers of the same deployment, the home page caching will not be very effective.
    - Also if this value does not change between updates to your extension, then existing users will continue to load the previous version of your extension even after you update.
1.  Once you have deployed and verified your extension. Send a pull request to the portal's dev branch removing the cachability setting from your extensions configuration. http://aka.ms/portalfx/extensionsprodjson

<a name="how-home-page-caching-works"></a>
### How home page caching works

We periodically get your manifest from your extension via our servers (every few minutes).
The manifest contains the page version, we then use this value when loading your extension into the portal (see the pageVersion part of the query string below).
So your extension URL might end up being something like:

```
https://YourExtension.contoso.com/
    ?pageVersion=5.0.202.18637347.150928-1117
    &l=en.en-us
    &trustedAuthority=portal.azure.com
```

On the server side, we match the value of pageVersion with the current value of `ApplicationContext.GetPageVersion()`.
If those values match, we set the page to be browser cacheable indefinitely.
If the values do not match, we force it to be uncached.
When the caching values are set, the browser will not even make a server request when loading your extension for the second time.

<a name="how-to-test-your-changes"></a>
### How to test your changes

You can verify the behavior of different caching modes in your extension by launching the portal with the following query string:

```
https://ms.portal.azure.com/?YOUR_EXTENSION_NAME-cacheability=manifest&feature.canmodifyextensions=true
```

And then load your extensions experience (a part/blade).

This will cause the extension named "Your_Extension" to load with "manifest" level caching (instead of its default setting on the server.
You also need to add "feature.canmodifyextensions=true" so that we know that the portal is running in test mode.  

To verify that the browser serves your extension entirely from cache on subsequent requests:

- Open F12 developer tools, switch to the network tab, filter the requests to only show "documents" (doc).
- Then navigate to your extension by opening one of its blades, you should see it load once from the server.
- You will see the home page of your extension show up in the list of responses (along with the load time and size).
- Then F5 to refresh the portal and navigate back to your extension. This time when your extension is served up, you should see the response served with no network activity. The response will show "(from cache)".  If you see this manifest caching is working as expected.

<a name="co-ordinating-these-changes-with-the-portal"></a>
### Co-ordinating these changes with the portal

Again, once you have deployed and verified your extension. Send a pull request to the portal's dev branch removing the cachability setting from your extensions configuration. http://aka.ms/portalfx/extensionsprodjson


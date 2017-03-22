
### Server side caching of extension home pages

With the (5.0.302.85 or later) version of the SDK  extension home pages can be cached (to different levels).
This should help get slightly better load time especially from browsers that have high latency.
Below are two example URLs from the portal running in production:

```
https://yourextension.contoso.com/
    ?extensionName=Your_Extension
    &shellVersion=5.0.302.85%20(production%23444e261.150819-1426)
    &traceStr=
    &sessionId=ece19d8501fb4d2cbe10db84b844c55b
    &l=en.en-us
    &trustedAuthority=portal.azure.com%3A
    #ece19d8501fb4d2cbe10db84b844c55b
```

You will notice that for the extension, the sessionId is passed in the query string part of the URL.
This makes the extension essentially un-cacheable (because even if it was, we would generate a unique URL on each access essentially busting any cache – browser or server).
If you enable server side caching of extension home pages, the URL will become:

```
https://yourextension.contoso.com/
    ?extensionName=Your_Extension
    &shellVersion=5.0.302.85%20(production%23444e261.150819-1426)
    &traceStr=
    &l=en.en-us
    &trustedAuthority=portal.azure.com%3A
    #ece19d8501fb4d2cbe10db84b844c55b
```

Notice that the sessionId is no longer present in the query string (only in the fragment).
This allows the extension server to serve up the same version of the page to a returning browser (HTTP 304).

You need to do some work to enable caching on your extension server.

1.  There is a property `Cacheability` on your implementation of the `Microsoft.Portal.Framework.ExtensionDefinition` class.

1.  By default its value is `ExtensionIFrameCacheability.None`

1.  At the very least you should be able to set it to `ExtensionIFrameCacheability.Server`

Making this change assumes that you do not change the way your home page is rendered dynamically (different output for different requests).
It assumes that if you do change the output, you only do so by also incrementing the value of Microsoft.Portal.Framework.ApplicationContext.Version.
Note: In this mode, if you make live updates to your extension without bumping the version, some chunk of your customers may not see those for a while because of caching.


### Client-side caching of extension home pages

The above version of the feature only enables server side caching.
But there could be even more benefits if we could somehow cache on the client (avoid the network call altogether).

So we have added support for caching extension home pages in the browser itself.
This can allow your extension to load with *ZERO* network calls from the browser (for a returning user).
We believe that this should give us further performance and reliability improvements (fewer network calls => fewer network related errors).

To enable this, here are the steps you need to take:

1.  Move to a version of the SDK newer than 5.0.302.121.

1.  Implement [persistent caching of your scripts](portalfx-extension-persistent-caching-of-scripts.md).
    You should do this any way to improve extension reliability.
    If you do not do this, you will see higher impact on reliability as a result of home page caching.

1.  Ensure that your implementation of `Microsoft.Portal.Framework.ApplicationContext.GetPageVersion()` returns a *stable* value per build of your extension.
    We implement this for your extension by default for you by using the version of your assembly.
    If this value changes between different servers of the same deployment, the home page caching will not be very effective.
    Also if this value does not change between updates to your extension, then existing users will continue to load the previous version of your extension even after you update.

1.  In your implementation of `Microsoft.Portal.Framework.ExtensionDefinition` update this property:

    ```cs
    public override ExtensionIFrameCacheability Cacheability
    {
        get
        {
            return ExtensionIFrameCacheability.Manifest;
        }
    }
    ```

1.  <a href="mailto:ibizafxpm@microsoft.com?subject=[Manifest Caching] on &lt;ExtensionName&gt; &body=Hi, we have enabled manifest caching on &lt;ExtensionName&gt; please make the appropriate portal change">Contact the Portal team</a>
     or submit a [Work Item Request](https://aka.ms/cachemanifest) so we can update the value from our side.  
    Sorry about this step.
    We added it to ensure backward compatibility.
    When all extensions have moved to newer SDKs, we can eliminate it.

### Implications of client side caching

1.  An implication of this change is that when you roll out an update to your extension, it might take a couple of hours for it to reach all your customers.
    But the reality is that this can occur even with the existing deployment process.
    If a user has already loaded your extension in their session, they will not really get your newer version till they F5 anyway.
    So extension caching adds a little more latency to this process.

1.  If you use this mechanism, you cannot use extension versioning to roll out breaking changes to your extension.
    Instead, you should make server side changes in a non-breaking way and keep earlier versions of your server side code running for a few days.

We believe that the benefits of caching and fast load time generally outweigh these concerns.

### How this works

We periodically load your extensions (from our servers) to get their manifests.
We call this "manifest cache". The cache is updated every few minutes.
This allows us to start up the portal without loading every extension to find out very basic information about it (like its name and its browse entry/entries, etc.)
When the extension is actually interacted with, we still load the latest version of its code, so the details of the extension should always be correct (not the cached values).
So this works out as a reasonable optimization.
With the newer versions of the SDK, we include the value of GetPageVersion() of your extension in its manifest.
We then use this value when loading your extension into the portal (see the pageVersion part of the query string below).
So your extension URL might end up being something like:

```
https://YourExtension.contoso.com/
    ?extensionName=Your_Extension
    &shellVersion=5.0.302.85%20(production%23444e261.150819-1426)
    &traceStr=
    &pageVersion=5.0.202.18637347.150928-1117
    &l=en.en-us
    &trustedAuthority=portal.azure.com%3A
    #ece19d8501fb4d2cbe10db84b844c55b
```

On the server side, we match the value of pageVersion with the current value of ApplicationContext.GetPageVersion().
If those values match, we set the page to be browser cacheable for a long time (1 month).
If the values do not match we set no caching at all on the response.
The no-caching case could happen during an upgrade, or if you had an unstable value of ApplicationContext.GetPageVersion()).
This should provide a reliable experience even when through updates.
When the caching values are set, the browser will not even make a server request when loading your extension for the second time.

You will notice that we include the shellVersion also in the query string of the URL.
This is just there to provide a mechanism to bust extension caches if we needed to.

### How to test your changes

You can verify the behavior of different caching modes in your extension by launching the portal with the following query string:

```
https://portal.azure.com/
    ?Your_Extension=cacheability-manifest
    &feature.canmodifyextensions=true
```

This will cause the extension named "Your_Extension" to load with "manifest" level caching (instead of its default setting on the server.
You also need to add "feature.canmodifyextensions=true" so that we know that the portal is running in test mode.  

To verify that the browser serves your extension entirely from cache on subsequent requests:

- Open F12 developer tools, switch to the network tab, filter the requests to only show "documents" (not JS, XHR or others).
- Then navigate to your extension by opening one of its blades, you should see it load once from the server.
- You will see the home page of your extension show up in the list of responses (along with the load time and size).
- Then F5 to refresh the portal and navigate back to your extension. This time when your extension is served up, you should see the response served with no network activity. The response will show "(from cache)".  If you see this manifest caching is working as expected.

### Co-ordinating these changes with the portal

Again, if you do make some of these changes, you still need to coordinate with the portal team to make sure that we make corresponding changes on our side too.
Basically that will tell us to stop sending your extension the sessionId part of the query string in the URL (otherwise caching does not help at all).
Sorry about this part, we had to do it in order to stay entirely backward compatible/safe.

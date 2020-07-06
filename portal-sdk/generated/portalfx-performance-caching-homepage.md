
<a name="performance-caching"></a>
## Performance caching

<a name="performance-caching-server-side-caching-of-extension-home-pages"></a>
### Server side caching of extension home pages

As of SDK version 5.0.302.85, extension home pages can be cached to different levels on the server.  This results in improved load time, especially from browsers that have high latency. The following is an example of a Portal URL in the production environment.

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

The sessionId is sent in the query string for the extension URL. This makes the extension essentially un-cacheable, because a unique URL is generated on each access. This essentially breaks any caching, whether it occurs on the client browser or on the extension server.

If server-side caching of extension home pages is enabled, the URL becomes the following.

```
https://yourextension.contoso.com/
    ?extensionName=Your_Extension
    &shellVersion=5.0.302.85%20(production%23444e261.150819-1426)
    &traceStr=
    &l=en.en-us
    &trustedAuthority=portal.azure.com%3A
    #ece19d8501fb4d2cbe10db84b844c55b
```

Notice that the sessionId is no longer present in the query string. This allows the extension server to serve the same version of the page to a returning browser (HTTP 304).

Also, examine the implementation of the `Microsoft.Portal.Framework.ExtensionDefinition` class.  In the class, there is a property named `Cacheability`. By default its value is `ExtensionIFrameCacheability.None`.  To enable homepage caching on the extension server, the implementation should set it to `ExtensionIFrameCacheability.Server`.

Making this change assumes that home page rendering does not change, because there would be different outputs for different requests. It also assumes that when the output changes, it also increments the value of `Microsoft.Portal.Framework.ApplicationContext.Version`.

**NOTE**: In this mode, if live updates are made to the extension without incrementing the version, some   customers may not see the changes for some time because of data that was previously cached.

<a name="performance-caching-client-side-caching-of-extension-home-pages"></a>
### Client-side caching of extension home pages

Additional benefits are derived from caching if an extension can cache on the client, and omit another network call.

Consequently, the Azure team has added support for caching extension home pages in the browser itself. The performance of an extension can be improved  by changing  how the extension uses caches. This allows the extension to load with as few as zero network calls from the browser for a returning user.

It also serves as a basis for further performance and reliability improvements, because fewer network calls also results in fewer network related errors.

Perform the following steps to enable this.

1.  Install a version of the SDK more recent than 5.0.302.121.

1.  Implement persistent caching of your scripts as specified in [portalfx-performance-caching-scripts.md](portalfx-performance-caching-scripts.md). Without it, there may be a higher impact on reliability as a result of home page caching.

1.  Ensure that the implementation of `Microsoft.Portal.Framework.ApplicationContext.GetPageVersion()` returns a stable value for each build of the extension.  This is implemented by default by using the version of the assembly. Home page caching will not be very effective if this value changes for different servers that are using the same deployment.  Also, if this value stays the same for several updates to an extension, then existing users will continue to load the previous version of an extension even if an update is deployed.

1. Update the following property in the implementation of `Microsoft.Portal.Framework.ExtensionDefinition`.

    ```cs
    public override ExtensionIFrameCacheability Cacheability
    {
        get
        {
            return ExtensionIFrameCacheability.Manifest;
        }
    }
    ```

1. To ensure backward compatibility, contact the <a href="mailto:ibizafxpm@microsoft.com?subject=[Manifest Caching] on &lt;extensionName&gt; &body=Hi, we have enabled manifest caching on &lt;extensionName&gt; please make the appropriate Portal change."> Portal team</a>  or submit a Work Item Request at the site located at  [https://aka.ms/cachemanifest](https://aka.ms/cachemanifest) so we can update our copy of the value.  

<!-- TODO: Determine whether the following sentence is still required.
    When all extensions have moved to newer SDKs, we can eliminate it.
-->

<a name="performance-caching-implications-of-client-side-caching"></a>
### Implications of client side caching

The benefits of caching and fast load time generally outweigh the following implications.

1. One implication of client-side caching is that it might take a few hours for an extension update to reach all your customers. However, this occurs even with the existing deployment process. If a user has already loaded an  extension in their browser session, they will not receive the new version until they refresh the browser by hitting the F5 key. Therefore, extension caching adds a small amount of latency to this process.

1. If the extension uses client side caching, versioning cannot be used to roll out breaking changes to the deployed extension. Instead, server side changes should be developed in a non-breaking way, and earlier versions of server-side code should be kept running for a few days.

<a name="performance-caching-how-client-side-caching-works"></a>
### How client side caching works

<a name="performance-caching-how-client-side-caching-works-manifest-caching"></a>
#### Manifest caching

Azure  periodically loads extensions (from our servers) to obtain their manifests. This is also known as the "manifest cache" that is updated every few minutes. This allows Azure  to start the Portal without loading every extension to find its  basic information.

<!-- TODO: Determine whether we still need the list of basic information. 
 Like its name and its browse entry/entries, etc.
 -->

When the extension is requested by a user, the latest version of its code is loaded. Therefore, the details of the extension are always at least as correct as the cached values. Consequently, client side caching serves as a reasonable optimization.

<a name="performance-caching-how-client-side-caching-works-pageversion"></a>
#### PageVersion

Newer versions of the SDK include the value of `GetPageVersion()` in the extension manifest.
The Portal uses this value when loading the extension into the Portal, as in the following query string.

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

On the server side, the value of `pageVersion` is matched with the current value of `ApplicationContext.GetPageVersion()`. If those values match, Azure sets the page to be browser cacheable for one month. If the values do not match, no caching is set on the response. A mismatch could occur during an upgrade, or if there was an unstable value of `ApplicationContext.GetPageVersion())`.

This use of the `pageVersion` values provides a reliable experience even when updating an extension.
When the caching values are set, the browser will not make a server request when loading the extension for the second time.

<!-- TODO: Determine whether there is a difference between "bust" and "break".
-->
**NOTE**: The `shellVersion` is included in the query string of the URL to provide a mechanism to bust extension caches as appropriate.

<a name="performance-caching-how-to-test-changes"></a>
### How to test changes

The behavior of different caching modes in an extension can be verified  by launching the Portal with the following query string.

```
https://portal.azure.com/
    ?<extensionName>=cacheability-manifest
    &feature.canmodifyextensions=true
```

This will cause the extension named "extensionName", without the angle brackets, to load with manifest-level caching instead of its default server setting.
The value "feature.canmodifyextensions=true" is added to the query string to make the Portal run in test mode.  

To verify that the browser serves the  extension entirely from the cache on subsequent requests, perform the following steps.

* Open F12 developer tools, switch to the network tab, and filter the requests to only show "documents".
* Navigate to the extension by opening one of its blades. You  should see it load once from the server.
* The home page of the  extension will be displayed  in the list of responses, along with its  load time and size.
*  Click F5 to refresh the Portal and navigate back to the extension. This time when the extension is served, you should see the response served with no network activity. The response will display from  the cache.  If you see this, manifest caching is working as expected.

<a name="performance-caching-coordinating-extension-updates-with-the-portal-team"></a>
### Coordinating extension updates with the Portal team

If you make some of these changes, you need to coordinate with the 
 <a href="mailto:ibizafxpm@microsoft.com?subject=[Caching Updates] on &lt;extensionName&gt; &body=Hi, we have enabled client-side caching on &lt;extensionName&gt; please make the appropriate Portal change."> Portal team</a> to make sure that we make corresponding changes for backward compatibility and safe deployment. When we receive this email, we  will stop sending your extension the sessionId part of the query string in the URL.

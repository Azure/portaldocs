<properties
    title=""
    pageTitle="Performance - Persistent Caching of scripts across extension updates" 
    description=""
    authors="madjos" />

<a name="making-sure-that-scripts-are-available-across-extension-updates"></a>
### Making sure that scripts are available across extension updates

One problem that can impact reliability of extensions is scripts failing to load.
And one corner case where this problem can occur is when update your extensions.

Suppose you have V1 of your extension deployed to production and it references a script file /Content/Script_A_SHA1.js We add the SHA1 to ensure maximum cacheability of the script.
Now a user visits the portal and starts interacting with your V1 extension.
They haven’t yet started loading Script_A_SHA1.js perhaps because it is only used by a different blade.
At this time you update the extension server to V2.
The update includes a change to Script_A so now its URL becomes /Content/Script_A_SHA2.js.
Now when the user does visit that blade, Script_A_SHA1.js is no longer on your server and the request to fetch it from the browser will most likely result in a 404.
The use of a CDN might reduce the probability of this occurring. And you should use a CDN.
But these user actions can occur over several hours and the CDN does not guarantee keeping data around (for any duration let alone hours).
So this problem can/does still occur.

To avoid this issue, you can implement a class that derives from `Microsoft.Portal.Framework.IPersistentContentCache`

On your extension server. The simplest way to do this is to derive from `Microsoft.Portal.Framework.BlobStorageBackedPersistentContentCache` 

And MEF export your implementation. That is decorate it with:

```cs 
[Export(typeof(Microsoft.Portal.Framework.IPersistentContentCache))]
```

You just need to provide it a storage account connection string that can be used to store the scripts.
Keep the storage account the same across upgrades of your extension.

We save all your JavaScript, CSS, and image files (basically anything under /Content/...) in this cache to make upgrades smoother.

The storage account is a third layer cache.
Layer 1 is CDN.
Layer 2 is in memory in your extension server.
So it should get hit very rarely and once read, it should warm up the other layers.
So we don't think you need to geo-distribute this layer.
If we detect that it is getting hit too often, we will come up with a geo-distribution strategy.
If you do use one account per region to handle this, you will need to find a way to synchronize them.
You could do this by using a custom implementation of the `Microsoft.Portal.Framework.IPersistentContentCache` interface.

<a name="example-implementation-as-done-in-hubsextension"></a>
### Example implementation as done in HubsExtension

```cs 

using System;
using System.ComponentModel.Composition;
using Microsoft.Portal.Framework;

namespace <your.extension.namespace>
{
    /// <summary>
    /// The configuration for hubs content caching.
    /// </summary>
    [Export(typeof(HubsBlobStorageBackedContentCacheSettings))]
    internal class HubsBlobStorageBackedContentCacheSettings : ConfigurationSettings
    {
        /// <summary>
        /// Gets the hubs content cache storage connection string.
        /// </summary>
        [ConfigurationSetting(DefaultValue = "")]
        public SecureConfigurationConnectionString StorageConnectionString
        {
            get;
            private set;
        }
    }

    /// <summary>
    /// Stores content in blob storage as block blobs.
    /// Used to ensure that cached content is available to clients
    /// even when the extension server code is newer/older than the content requested.
    /// </summary>
    [Export(typeof(IPersistentContentCache))]
    internal class HubsBlobStorageBackedContentCache : BlobStorageBackedPersistentContentCache
    {
        /// <summary>
        /// /// Creates an instance of the cache.
        /// </summary>
        /// <param name="applicationContext"> Application context which has environment settings.</param>
        /// <param name="settings"> The content cache settings to use.</param>
        /// <param name="tracer"> The tracer to use for any logging.</param>
        [ImportingConstructor]
        public HubsBlobStorageBackedContentCache(
            ApplicationContext applicationContext,
            HubsBlobStorageBackedContentCacheSettings settings,
            ICommonTracer tracer)
            :base(settings.StorageConnectionString.ToString(), "HubsExtensionContentCache", applicationContext, tracer)
        {
        }
    }
}

```

web.config

```xml

    <add key="<your.extension.namespace>.HubsBlobStorageBackedContentCacheSettings.StorageConnectionString" value="" />

```

<a name="verfiying-that-persistent-caching-is-working"></a>
### Verfiying that persistent caching is working

- Deploy a version of your extension. Examine the scripts it loads, they will be of the form `prefix<sha hash>suffix.js`
- Use a blob explorer of your preference and verify that the scripts have been written to blob storage.
- Then make changes to TS files in your solution, build and deploy a new version of your extension.
- Look for scripts that have the same prefix and suffix but a different hash.
- For those scripts try to request the original URL (from step 1) from your extension server (not via the cdn).
- The script should still get served, but this time it is coming from the persistent cache.
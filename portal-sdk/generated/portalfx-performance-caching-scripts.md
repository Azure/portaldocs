
<a name="persistent-caching-for-scripts"></a>
## Persistent caching for scripts

One problem that affects extension reliability is that scripts may fail to load, especially after extensions have been updated.

For example, version 1 of an extension uses a script file named `/Content/Script_A_SHA1.js`. A user visits the Portal and interacts with the extension. The script named `Script_A_SHA1.js` is not loaded because the user has not visited the blade that uses it.

**NOTE**: The `SHA` suffix was added to ensure maximum cacheability of the script.

Then, the extension is updated on the server, and the version 2 changes Script_A so that its URL becomes `/Content/Script_A_SHA2.js`.

Now, when the user visits the blade that uses the script, Script_A_SHA1.js is no longer on the server. Requests for it will probably  result in a 404 "Not found" error.

The use of a Content Delivery Network(CDN) might reduce the probability of encountering a 404.  However, user actions can occur over several hours, and the CDN does not guarantee keeping data available for any duration, therefore this problem might still occur.

This issue can be avoided or reduced by implementing a persistent content cache. To facilitate extension upgrades, Azure Portal provides a cache that can be used to store the contents of the `.../Content/` folder. All of the JavaScript, CSS, scripts, and image files for the extension are stored in this cache to make upgrades smoother. The extension requires a connection string that specifies the storage account that contains this cache.  This allows caching to be performed in the following layers.

1. Layer 1 is Content Delivery Network.
1. Layer 2 is the memory in the extension server.
1. Layer 3 is the storage account.

The Layer 3 cache should get hit somewhat rarely and after it is read, the retrieved content will temporarily be located in the higher layers.

<!-- TODO: Based on hosting and extension configuration, determine whether the following sentence is accurate. 
So we don't think you need to geo-distribute this layer.
-->

If Azure determines that Layer 3 is getting hit too often, the Ibiza team may change the geo-distribution strategy.

The storage account should be the same across all upgrades of the extension, which includes geo-distribution across regions when the extension is deployed. For more information about extension configuration and geo-distribution, see [top-extensions-hosting-service-advanced.md](top-extensions-hosting-service-advanced.md).

An extension can make sure that scripts are available across extension updates by using a class that derives from `Microsoft.Portal.Framework.IPersistentContentCache` on the extension server. To do this, derive a class from `Microsoft.Portal.Framework.BlobStorageBackedPersistentContentCache` and [MEF](portalfx-extensions-glossary-performance.md)-export your implementation. If one account per region is used to handle the geo-distribution strategy, they can be synchronized by using a custom implementation of the `Microsoft.Portal.Framework.IPersistentContentCache` interface, similar to the one in the following code.

```cs 
[Export(typeof(Microsoft.Portal.Framework.IPersistentContentCache))]
```

The class itself resembles the following implementation as developed in **HubsExtension**.

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

The `web.config` file includes the following information.

```xml

    <add key="<your.extension.namespace>.HubsBlobStorageBackedContentCacheSettings.StorageConnectionString" value="" />

```

<a name="persistent-caching-for-scripts-velidating-that-persistent-caching-is-working"></a>
### Velidating that persistent caching is working

To validate that  persistent caching is working, perform the following steps.

1. Deploy a version of your extension. Make a list of the scripts that it loads, whose names are of the form `<sha hash><suffix>.js`.
1. Use any blob explorer or editor to validate that the scripts have been written to blob storage.
1. Make changes to the TS files in the solution, then build and deploy a new version of the extension.
1. Look for scripts that have the same prefix and suffix but a different hash.
1. For each of those scripts, try to request the original URL from step 1 to validate whether it loads from the extension server instead of the CDN.
1. The script should still get served, but this time should load from the persistent cache.
<properties title="" pageTitle="Domain based configuration - Design pattern" description="" authors="dbrankin" />

<tags ms.service="portalfx"
      ms.workload="portalfx"
      ms.tgt_pltfrm="portalfx"
      ms.devlang="portalfx"
      ms.topic="get-started-article"
      ms.date="05/02/2016"
      ms.author="dbrankin" />

## Expected design pattern
The partner identifies the functionality that needs to change based on domain. If the change is only required at the 
deployment level (i.e. national clouds, such as China, Germany, Government, etc) normal config should be 
used with no dynamic tests at runtime. Examples of configuration falling into this category are things like ARM and RP URLs, 
AAD client application IDs, etc.

If on the other hand the same deployment has to support multiple domains (i.e. community clouds, such as Fujitsu A5),
domain based configuration should be used, with the selection being based on the Trusted Authority for the caller.

For those that wish to jump ahead, this [example](/documentation/articles/portalfx-domain-based-configuration-example) 
shows all the code required to wire up domain based configuration server side. Additional code is required to push values 
down to the browser, and the recommended pattern for this is covered below.

## Built in support
See also [Shell RPC call](/documentation/articles/portalfx-domain-based-configuration) and
[PortalContext.TrustedAuthorityHost](/documentation/articles/portalfx-domain-based-configuration)

## Expected design pattern
Partners (extension authors) are of free to do what they want with respect to domain based configuration, but the following is the
pattern recommend we recommend and best support.

The partner identifies the functionality that needs to change based on domain. If the change is only required at the deployment level
(e.g. Global vs China vs Germany vs Govenment) normal config should be used with no dynamic tests at runtime. Examples of
configuration falling into this category are things like ARM and RP URLs, AAD client application IDs, etc.

If on the other hand the same deployment has to support multiple domains (e.g. Global supporting Fujitsu A5),
domain based configuration should be used, with the selection being based on the Trusted Authority for the caller.

## Domain based configuration
Once the partner has identified their configuration, they create a supporting `DictionaryConfiguration` class as per the
[DictionaryConfiguration documentation](/documentation/articles/portalfx-dictionaryconfiguration). The dictionary key will
be the `TrustedAuthorityHost` (i.e. the host name the Shell was loaded under), which is available at run time via `PortalContext`.

By convention, we append `DomainBasedConfiguration` to the end of the class name (`ErrorApplicationDomainBasedConfiguration`,
`HubsDomainBasedConfiguration`, (portal) `WebsiteDomainBasedConfiguration`, etc). However, this is purely a convention and is
not enforced (or required).

This [example](/documentation/articles/portalfx-domain-based-configuration-example) shows all the code required to wire up
domain based configuration.

## Exporting domain based configuration values to the client
See [How to expose config settings for consumption in the client](/documentation/articles/portalfx-load-configuration) for an
overview of exposing config settings to the client.

In many cases, the domain based configuration is needed in client side TypeScript. While the extension developer is free to do this any
 way they want, we recommend the following for extensions following our recommended practices / templates:

1. In ExtensionExtensionDefinition.cs, add your configuration class to your ImportContructor and save it away for later use

2. Override `IReadOnlyDictionary&lt;string, object&gt; GetExtensionConfiguration(PortalRequestContext context)` 
and use this to extend the environmental object being returned to the client. For example:

```cs
    public override IReadOnlyDictionary<string, object> GetExtensionConfiguration(PortalRequestContext context)
    {
        var extensionConfig = base.GetExtensionConfiguration(context);
        var settings = this.myConfig.GetSettings(context.TrustedAuthorityHost, CultureInfo.CurrentUICulture);

        var mergedConfig = new Dictionary<string, object>()
        {
            {"links", settings.Links},
            {"someSetting", settings.someSetting},
        };

        mergedConfig.AddRange(extensionConfig);

    return mergedConfig;
}
```

3. Update `ExtensionFxEnvironment.d.ts` to include TypeScript definitions for the new values you are downloading to the client.


## Anti-patterns

### Do not use PortalContext.TrustedAuthorityHost directly
Do not write code like this:

```cs
if (PortalContext.TrustedAuthorityHost.startsWith("contoso"))
{
    // We're in contoso.portal.azure.com, contoso-df.portal.azure.com, contoso.onestb.cloudapp.net etc
    ...
}
```

This is an anti-pattern for several reasons:

1. The code becomes peppered with Cloud specific 'if' blocks that are hard to test, maintain, and find. This increases in complexity
   as the number of supported Clouds increases.

1. If another cloud comes online requiring some (or all) of the same logic, the code has to be updated.

Instead, use the domain based configuration to create a setting that varies by PortalContext.TrustedAuthorityHost.

### Do not change PDL on the fly / by Feature Flag
Never change the PDL your extension severs up based on the host of the caller or a feature flag that changes between callers. 

1. The Shell caches your PDL on behalf of the client and the same PDL bundle is delivered to all community clouds. 

1. When the Shell directly requests the PDL from each extension, it does so on its own behalf and not on behalf of any specific user. 
   In such cases, PortalContext.TrustedAuthorityHost is a constant.

1. Changing the default feature flags sent to the extension requires Shell config changes and redeployment.
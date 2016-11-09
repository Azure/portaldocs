<properties title="" pageTitle="Extension flags" description="" authors="flanakin" />

[Portal Fx](/documentation/sections/portalfx) > [Deployments](/documentation/sections/portalfx#deploy) > Extension flags

# Extension flags

Extension flags are specially-formatted querystring parameters passed from the portal to extensions and their controllers. Extension flags are not shared across extensions - they are only accessible by the extension they are defined for. Extension flags cannot be used to hide blades, parts, or commands. They can only be used to enable/disable programmatic code (e.g. form elements, HTML template components).

Extension flags have the following rules:

* Must be formatted as `{extension}_{flag}` (e.g. `microsoft_azure_compute_someflag`)
* Can have any non-empty value (e.g. `?microsoft_azure_compute_someflag=true`)
* Should be lower case
* Cannot include an underscore (_) in the flag name (e.g. `microsoft_azure_compute_some_flag` will not work)

Use the `MsPortalFx.isFeatureEnabled` and  `MsPortalFx.getFeatureValue` APIs to access feature values in TypeScript:

E.g. 1

https://portal.azure.com?microsoft_azure_compute_someflag=true

```ts
if (MsPortalFx.isFeatureEnabled("someflag"))
{
    // turn on new feature
}
```

E.g. 2

https://portal.azure.com?microsoft_azure_compute_someotherflag=value1

```ts
switch (MsPortalFx.getFeatureValue("someotherflag"))
{
    case "value1":
        // behavior 1
        break;
    case "value2":
        // behavior 1
        break;
    default:
        // default behavior
        break;
}
```

## Enabling for all users in an environment
Feature flags can be enabled for all users in one or more deployments through the configuration of an extension. This can be achieved as follows: -

In your `ApplicationConfiguration` class, add the following property.

```cs
[ConfigurationSetting]
public CaseInsensitiveReadOnlyDictionary<IReadOnlyDictionary<string, string>> DefaultQueryString
{
    get;
    private set;
}
```

In your derived app context class (probably called CustomApplicationContext) override the GetDefaultQueryString method


```cs
public override IReadOnlyDictionary<string, string> GetDefaultQueryString(string host)
{
    return this.configuration.DefaultQueryString.GetValueOrDefault(host);
}
```

Finally, in your config files (web.config/cscfg), add the following entry
```
<Setting name="Microsoft.StbPortal.Website.Configuration.ApplicationConfiguration.DefaultQueryString" value="{
    '*': {
        'websitesextension_supportsettingsenabled':'true',
        'websitesextension_troubleshootsettingsenabled':'true'
    },
    'prod.websitesextension.com': {
        'websitesextension_requestsettingsenabled':'true'
    },
    'dogfood.websitesextension.com': {
        'websitesextension_healthsettingsenabled':'true'
    }
  }" />
```

Using * implies that a request to the extension will enable those features no matter what the domain is.
Feature flags associated with the domain name of the environment i.e. the domain name of the incoming requests, will take precedence over the feature flags in '*'.


When using `MsPortalFx.Base.Net.ajax()`, extension flags are also passed to your controller. Ensure your controllers extend `Microsoft.Portal.Framework.ApiControllerBase` and use the `RequestFlags` dictionary to check:

```cs
if (RequestFlags.TryGetValue("microsoft_azure_compute_someflag", out value) && value == "true")
{
    // turn on feature here
}
```

Also, if you want to enable this for all users, you can enable this by configuring the `ApplicationContext` to specify a list of default query string parameters by overriding the `GetDefaultQueryString` method.

```cs
public override IReadOnlyDictionary<string, string> GetDefaultQueryString(string host)
{
    // read the default query string parameters from config and return.
}
```

This will make these feature flags available in client-code for all users.

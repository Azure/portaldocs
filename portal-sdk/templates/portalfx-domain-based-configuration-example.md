<properties title="" pageTitle="Domain based configuration - example & sample code" description="" authors="dbrankin" />

<tags ms.service="portalfx"
      ms.workload="portalfx"
      ms.tgt_pltfrm="portalfx"
      ms.devlang="portalfx"
      ms.topic="get-started-article"
      ms.date="05/02/2016"
      ms.author="dbrankin" />

## Domain based configuration example & sample code

### Example consumption

```cs
[ImportingConstructor]
public MyConsumingClass(PortalContext portalContext, MyConfiguration myConfiguration)
{
    this.portalContext = portalContext;
    this.myConfiguration = myConfiguration;
}
...
public void DoSomthing()
{
    var settings = this.myConfiguration.Get(this.portalContext.TrustedAuthorityHost, CultureInfo.CurrentUICulture);
    if (settings.ShowPricing) {...};
    string expandedUrl = settings.GettingStarted;
}
```

### Example configuration and settings classes

```cs
namespace Microsoft.MyExtension.Configuration
{
    [Export]
    public class MyConfiguration : DictionaryConfiguration<MySettings>
    {
    }

    /// <summary>Configuration that can vary by the domain by which the user accesses the portal (or some other string)</summary>
    public class MySettings
    {
        [JsonProperty]
        public string LinkTemplate { get; private set; }
 
        [JsonProperty]
        public MyLinks Links { get; private set; }
 
        [JsonProperty]
        public bool ShowPricing{ get; private set; }
    }

    /// <summary>Links don't have to be a separate class, I just like to group them separately to other settings</summary>
    public class MyLinks
    {
        [JsonProperty, Link]
        public string GettingStarted { get; private set; }
 
        [JsonProperty, Link]
        public string Support { get; private set; }
  
        [JsonProperty, Link]
        public string TermsAndConditions { get; private set; }
    }
}
```

### Corresponding example config settings
This example supports a deployment returning different run-time configuration values for the above settings class depending on whether the portal was accessed through
portal.azure.com, example.microsoft.com, fujitsu.portal.azure.com, or hostfileoverride.com.

With a config block like this:

```xml
<add key="Microsoft.MyExtension.Configuration.MyConfiguration.Settings" value="{
    'default': {
        'linkTemplate': 'https://go.microsoft.com/fwLink/?LinkID={linkId}&amp;clcid=0x{lcid}',
        'links': {
            'gettingStarted': '111111',
            'support': '#create/Microsoft.Support',
            'termsAndConditions': 'https://microsoft.com',
        },
        'ShowPricing': true,
    },
    'fujitsu.portal.azure.com' : {
        'links': {
            'gettingStarted': '222222',
            'support': '',
            'termsAndConditions': 'https://fujitsu.com',
        },
        'ShowPricing': false,
    },
    'example.microsoft.com': {
        'ShowPricing': false,
    }
    }"/>
```

then a call like this:

```cs
    var config = this.myConfiguration.Get(this.portalContext.TrustedAuthorityHost, CultureInfo.CurrentUICulture);
``` 

would give these results:

URL user used to access the portal|User's culture|config.showPricing|config.links.gettingStarted|config.links.support|config.links.termsAndConditions
----------------------------------|--------------|------------------|---------------------------|--------------------|-------------------------------
portal.azure.com        |en-us  |true |https://go.microsoft.com/fwLink/?LinkID=111111&clcid=0x409|#create/Microsoft.Support|https://microsoft.com
portal.azure.com        |zh-hans|true |https://go.microsoft.com/fwLink/?LinkID=111111&clcid=0x4|#create/Microsoft.Support|https://microsoft.com
fujitsu.portal.azure.com|en-us  |false|https://go.microsoft.com/fwLink/?LinkID=222222&clcid=0x409||https://fujitsu.com
example.micrtosoft.com  |en-us  |false|https://go.microsoft.com/fwLink/?LinkID=111111&clcid=0x409|#create/Microsoft.Support|https://microsoft.com
hostFileOverride.com    |en-us  |true |https://go.microsoft.com/fwLink/?LinkID=111111&clcid=0x409|#create/Microsoft.Support|https://microsoft.com
 
***Note:** Only the URL the portal is accessed through matters. The URL the extension is accessed through does not change.

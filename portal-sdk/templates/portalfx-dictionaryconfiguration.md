
<tags ms.service="portalfx"
      ms.workload="portalfx"
      ms.tgt_pltfrm="portalfx"
      ms.devlang="portalfx"
      ms.topic="get-started-article"
      ms.date="05/02/2016"
      ms.author="dbrankin" />

## DictionaryConfiguration class
The `DictionaryConfiguration` class allows strongly-typed JSON blobs to be defined in the configuration file and selected between based 
on an arbitrary (case-insensitive) string key. For example, it is used in the Shell and Hubs to select between domain specific 
configuration sets.

The boilerplate for this is pretty straightforward, and devs may wish to just jump straight to the 
[example](portalfx-domain-based-configuration-example.md) code. 

The developer needs to create two configuration classes: 

1. A stand-alone settings class. An instance of this class will hold the setting values associated with a specific key and user culture, and

2. A configuration class (derived from `DictionaryCollection`) that manages and exposes the instances.

Like other configuration classes, these config classes will be auto-magically wired-up and populated from the config based on namespace, 
class name, and the Settings property name. For example, if the namespace is `Microsoft.MyExtension.Configuration` and the 
configuration class is `MyConfiguration`, then the configuration setting name must be 
`Microsoft.MyExtension.Configuratation.MyConfiguration.Settings`.

Instances of configuration classes are normally obtained through MEF constructors, and this is unchanged for 
`StringDictionaryConfiguration` and its sub-classes.

At runtime, the strongly typed settings for a specific key is obtained through the `GetSettings` method inherited by your configuration 
class, i.e. `T settings = configClass.GetSettings(string key, CultureInfo culture)` method. `Culture` is optional, and is used when expanding
settings that are marked with the special `[Link]` attribute. If culture is not specified, it defaults to `CultureInfo.CurrentUICulture`.

### The configuration class:
This is almost a no-code operation.
Create a class that derives from `StringDictionaryConfiguration&lt;T&gt;`, where T is the type of the
settings class. Don't forget to mark the class as MEF exportable if you intend to make the config available to interested code in the normal fashion.

For example:

```cs
namespace Microsoft.MyExtension.Configuration{    [Export]    public class MyConfiguration : DictionaryConfiguration<MySettings>    {    }
}
```

### The settings class
The settings class is a plain old data transport object. However, as we are using the configuration system 
`ConfigurationSettingKind.Json` option, all properties to be populated from the JSON blob in the configuration file must be
marked as `[JsonProperty]` else they will not be deserialized and will be left null.

<table>
    <thead><tr><th>Example settings class</th><th>Example config*</th></tr></thead>
    <tr>
        <td>
            <pre>
namespace Microsoft.MyExtension.Configuration
{
    public class MySettings
    {
        [JsonProperty]
        public bool ShowPricing { get; private set; }
    }
}
            </pre>
        </td>
        <td>
<pre>
&lt;add key="Microsoft.MyExtension.Configuration.MyConfiguration.Settings" value="{
    'default': {
        'showPricing': true
    },
    'someOtherKey' : {
        'showPricing': false
    }
}" /&gt;
</pre>
        </td>
    </tr>
</table>
*It's the configuration class name that appears in the config, not the settings class's namespace Microsoft.MyExtension.Configuration

**Note:**

1. The deserializer will handle camel-case to pascal-case conversion provided you follow JSON property name conventions in the
config file and C# conventions in the configuration classes.

1. Nested objects are fully supported (e.g. Billing.EA.ShowPricing. See the example code for an example of this)

#### Use of the [Link] attribute
If the property is marked `[Link]` then link expansion logic will be applied in the following

If the string is numeric, it will be expanded according to the format string specified in the `LinkTemplate` property at the root of 
the object. Occurrences of `{linkId}` in the string will be expanded to the numeric value. If no LinkTemplate property is specified, 
the value will be left unexpanded.

1. Occurrences in the string of `{lcid}` will be replaced with the hex representation of the user's preferred .NET LCID value (for example,
   409 for US English)

2. Occurrences in the string of `{culture}` will be replaced with the user's preferred .NET culture code (for example, en-US for US English).

A LinkTemplate value of `https://go.microsoft.com/fwLink/?LinkID={linkId}&amp;clcid=0x{lcid}` is the correct template for FwLinks.

An exception will be thrown if the target of a `[Link]` attribute is not in one of the follow string formats

1. Numeric (e.g. '12345' )

1. A URL hash-fragment (e.g. #create\Microsoft.Support)

1. A http or https URL

#### The 'default' key
If no exact match is found for the specified key (or the caller passes null), Get returns the settings associated with a key whose name 
is literally `default`.

### Setting inheritance
`DictionaryConfiguration` supports a simplistic one-level inheritance model to avoid having to repeat unchanged settings in 'subclassed' config. 
If a property inside the settings for a non-default key is missing (or explicitly set to null) the value for that property 
is set to the value from the default key. For example:

``` xml
    <add key="Microsoft.Portal.Framework.WebsiteDomainBasedConfiguration.Settings" value="{
        'default': { 'setting1': 'A1', 'setting2': 'A2' },
        'config2': { 'setting1': 'B1', 'setting2': 'B2' },
        'config3': { 'setting1': 'C1' },
        'config4': { 'setting1': null },
    }"/>
```

Will return:

Key    |Setting 1|Setting 2|Notes
Default|A1       |A2       |
Config1|A1       |A1       |Since there is no config1 entry, the default is returned
Config2|B1       |B2       |Both values were overridden
Config3|C1       |A2       |Only setting1 was overridden
Config4|A1       |A2       |Assigning null is the same as skipping the property
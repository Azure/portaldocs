{"gitdown": "contents"}

<tags
    ms.service="portalfx"
    ms.workload="portalfx"
    ms.tgt_pltfrm="portalfx"
    ms.devlang="portalfx"
    ms.topic="get-started-article"
    ms.date="12/26/2015"
    ms.author="lixinxu"/>    

## How to expose config settings for consumption in the client

Configuration settings are commonly used to control an application's behavior. For example, using timeout values, page size, endpoints, ARM version number, etc. Using the .NET framework, managed code can load config easily but in the case of portal extensions most of the extensions implementation is JavaScript running on client side.  By allowing the client code in extensions to gain access to configuration settings the portal framework provides a way to get the configuration and expose it in `window.fx.environment`. The following steps detail how it works:

1. Portal framework will initialize the instance of the class ApplicationConfiguration (it is under Configuration folder in your project). It will try to populate all properties by finding configuration in web.config appSettings section. 
For each property, portal framework will use the key "{ApplicationConfiguration class full name}.{property name}" unless you give a different name in the associated "ConfigurationSetting" attribute applied that property in your ApplicationConfiguration.

1. Portal framework will create an instance of "window.fx.environment" for client script. It uses the mapping in ExtensionConfiguration dictionary which created by Definition.cs under the Controllers folder.

1. Client script loads the configuration from "window.fx.environment" which implements the interface "FxEnvironment". To declare the new configuration entry, the file FxEnvironmentExtensions.d.ts under Definitions folder should be updated for each property you want exposed to the client.

# Step by step walkthrough
Suppose you created a portal extension called "MyExtension" the following steps describe how to add a new configuration called "PageSize".

1. Open the "ApplicationConfiguration.cs" file under "Configuration" folder.

1. Add a new property called "PageSize"

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Configuration/ArmConfiguration.cs", "section": "config#configurationsettings"}

1. Save the file

1. You will notice the namespace is "Microsoft.Portal.Extensions.MyExtension". So the full name of the class is "Microsoft.Portal.Extensions.MyExtension.ApplicationConfiguration". Since the property is "PageSize" so the configuration key should be "Microsoft.Portal.Extensions.MyExtension.ApplicationConfiguration.PageSize".

1. Open web.config of your extension.

1. Locate the "appSettings" section. Add a new entry for PageSize

    ```xml
    ...
      <appSettings>
            ...
            <add key="Microsoft.Portal.Extensions.MyExtension.ApplicationConfiguration.PageSize" value="20"/>
      </appSettings>
      ...
    ```

1. Save and close the web.config file

1. Open "Definition.cs" from "Controllers" folder. Add a new mapping in "ExtensionConfiguration" property

    ```csharp
        /// <summary>
        /// Initializes a new instance of the <see cref="Definition"/> class.
        /// </summary>
        /// <param name="applicationConfiguration">The application configuration.</param>
        [ImportingConstructor]
        public Definition(ApplicationConfiguration applicationConfiguration)
        {
            this.ExtensionConfiguration = new Dictionary<string, object>()
            {
                ...
                { "pageSize", applicationConfiguration.PageSize },
            };
            ...
        }
    ```

1. Open "FxEnvironmentExtensions.d.ts" file from "Definitions" folder and add "pageSize" property in the environment interface

    ```ts
        interface FxEnvironment {
            ...
            pageSize?: number;
        } 
    ```

1. Now new configuration entry has been defined. To use the configuration, add the code like this in script:

    ```JavaScript
        var pageSize = window.fx.environment && window.fx.environment.pageSize || 10;
    ```

If you have any questions, reach out to Ibiza team on: [https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza).

An extended version of the above is used to transfer domain based configuration (such as correctly formatted FwLinks) to the client.
For details and examples, please see [Domain based configuration](portalfx-domain-based-configuration.md).
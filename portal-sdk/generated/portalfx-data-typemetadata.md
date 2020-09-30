


<a name="before-getting-started"></a>
## Before Getting Started

- Extension authors are advised to use https://aka.ms/portalfx/batch instead of using QueryCache/EntityCache and TypeMetadata. If you have a valid scenario for using these TypeMetadata documentation follows.
- If you onboarded to TypeMetadata along time ago please apply the ExtensionLoad optimization for TypeMetadata described in [this video](https://msit.microsoftstream.com/video/5c2f3aac-b0a2-4a06-a0d1-cc13ed1aaa4b?st=1491)

<a name="type-metadata"></a>
## Type metadata

When performing merge operations, the DataSet library will need to know a little bit about the schema of your model objects. For example, in the case of a Computer, we want to know the property which defines the primary key of that object. This information which describes the object, and all of its properties is referred to in the portal as *type metadata*.

<a name="type-metadata-authored-type-metadata"></a>
### Authored type metadata

You may choose to write your own metadata to describe model objects. This is recommended if you have not C# service tier that are called by the client i.e there are not client to server contracts to maintain.

The follow snippets demonstrate how to author the datamodel, typemetadata and registration of that typemetadata for a Computer that contains a collection of ComputerComponents.

`ComputerComponent.ts`
```ts
    export interface ComputerComponent {
        name: KnockoutObservable<string>;
        display: KnockoutObservable<string>;
        componentType: KnockoutObservable<number>;
        model: KnockoutObservable<string>;
        manufacturer: KnockoutObservable<string>;
        status: KnockoutObservable<number>;
    }

    export const ComputerComponentMetadata: MsPortalFx.Data.Metadata.Metadata = {
        name: "SamplesExtension.DataModels.ComputerComponent",
        properties: {
            name: {},
            display: {},
            componentType: {},
            model: {},
            manufacturer: {},
            status: {}
        },
        idProperties: [
            name
        ],
        entityType: false,
        hasGloballyUniqueId: false
    };

    MsPortalFx.Data.Metadata.setTypeMetadata(ComputerComponentMetadata.name, ComputerComponentMetadata);

```

`Computer.ts`

```ts
    /// <amd-dependency path="./ComputerComponent" />
    import { ComputerComponent } from "./ComputerComponent";

    export interface Computer {
        name: KnockoutObservable<string>;
        display: KnockoutObservable<string>;
        model: KnockoutObservable<string>;
        manufacturer: KnockoutObservable<string>;
        components: KnockoutObservableArray<ComputerComponent>;
    }

    export const ComputerMetadata: MsPortalFx.Data.Metadata.Metadata = {
        name: "SamplesExtension.DataModels.Computer",
        properties: {
            name: {},
            display: {},
            model: {},
            manufacturer: {},
            components: {
                isArray: true,
                itemType: "SamplesExtension.DataModels.ComputerComponent"
            }
        },
        idProperties: [
            name
        ],
        entityType: false,
        hasGloballyUniqueId: false
    };

    MsPortalFx.Data.Metadata.setTypeMetadata(ComputerMetadata.name, ComputerMetadata);
```

*Note:*  the first line above with the trippleslash amd dependency is required to ensure that ComputerComponent registers its own typemetadata before computer registers its own typemetadata `/// <amd-dependency path="./ComputerComponent" />`.

- The `name` property refers to the type name of the model object.
- The `idProperties` property refers to one of the properties defined below that acts as the primary key for the object.
- The `properties` object contains a property for each property on the model object.
- The `itemType` property allows for nesting complex object types, and refers to a registered name of a metadata object. (see `setTypeMetadata`).
- The `isArray` property informs the shell that the `components` property will be an array of computercomponent objects.

The `setTypeMetadata()` method will register your metadata with the system, making it available in the data APIs.

As an example, below demonstrates how to configure QueryCache to consume the TypeMetadata via the entityTypeName property.

```ts

    import { Computer, ComputerMetadata } from "./SamplesExtension/DataModels/Computer";
...
    public computersQuery = new MsPortalFx.Data.QueryCache<Computer, any>({
        entityTypeName: ComputerMetadata.name,
        sourceUri: () => Util.appendSessionId(ComputerData._apiRoot),
    });

```

<a name="type-metadata-c-to-typescript-code-generation-approach"></a>
### C# to TypeScript code generation approach

As described above Type metadata can be manually authored. However, for developers that have a service tier developed using C# with a contract that must be maintained with the consuming clients TypeScript code we provide a codegen path to make this easer.

- Generation of type metadata and registration from C# to TypeScript at build time
- Generation of TypeScript model interfaces from C# model objects

Both of these features allow you to write your model objects once in C#, and then let the compiler generate interfaces and data for use at runtime.

<a name="type-metadata-c-to-typescript-code-generation-approach-step-1-create-datamodel-project"></a>
#### Step 1: Create DataModel project

To use type metadata generation, you need to keep your model objects (aka Data Transfer Objects / DTOs) in a separate .NET project from your extension. For an example, check out the `SamplesExtension.DataModels` project included in the SDK. The class library project used to generate models requires the following dependencies:

- System.ComponentModel.Composition
- Microsoft.Portal.TypeMetadata.  Note: this assembly can be found in the Microsoft.Portal.TypeMetadata NuGet package.

At the top of any C# file using the `TypeMetadataModel` annotation, the following namespaces must be imported:

- `Microsoft.Portal.TypeMetadata`

<a name="type-metadata-c-to-typescript-code-generation-approach-step-2-configure-typemetadata-generation"></a>
#### Step 2: Configure TypeMetadata generation

- Open the client project (not your datamodels project) i.e Extension.csproj,  Add the following to `Extension.csproj`

```xml

<PropertyGroup>
 <PortalEmitTypeMetadataTypeScript>true</PortalEmitTypeMetadataTypeScript>
  <PortalEmitTypeMetadataTypeScriptTargetFolder>Client</PortalEmitTypeMetadataTypeScriptTargetFolder>
  <BladeReferencesCodegenMode>Definitions</BladeReferencesCodegenMode>
  <PartReferencesCodegenMode>Definitions</PartReferencesCodegenMode>
</PropertyGroup>

```

*Note*: `PortalEmitTypeMetadataTypeScriptTargetFolder` can be used to control the output path of the generated type metadata.

- Open the  './Extension.DataModels/AssemblyInfo.cs file under the  Extension.DataModels project and add the `Microsoft.Portal.TypeMetadata.IgnoreRuntimeTypeMetadataGeneration` attribute

```cs

﻿//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//-----------------------------------------------------------------------------

using Microsoft.Portal.TypeMetadata;

[assembly: IgnoreRuntimeTypeMetadataGeneration()]

```
*Note*: This attribute ensures that no typesMetadata blob is generated at runtime and embedded in the home/index response thus bloating ExtensionLoad.

<a name="type-metadata-c-to-typescript-code-generation-approach-step-2-add-typemetadata"></a>
#### Step 2: Add TypeMetaData
For an example of a model class which generates the TypeScript shown in the [Authored type metadata](#authored-type-metadata) section see the following


`SamplesExtension.DataModels/ComputerComponent.cs`

```cs

﻿//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//-----------------------------------------------------------------------------
using Microsoft.Portal.TypeMetadata;

namespace Microsoft.Portal.Extensions.SamplesExtension.DataModels
{
    /// <summary>
    /// Representation of a computer component used by the hubs/browse sample.
    /// </summary>
    [TypeMetadataModel(typeof(ComputerComponent), "DataModels")]
    [Indexable]
    public class ComputerComponent
    {
        /// <summary>
        /// Gets or sets the name of the computer component.
        /// </summary>
        [Id]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the display text of the computer component.
        /// </summary>
        public string Display { get; set; }

        /// <summary>
        /// Gets or sets the type of the computer component.
        /// </summary>
        public ComponentType ComponentType { get; set; }

        /// <summary>
        /// Gets or sets the model of the computer component.
        /// </summary>
        public string Model { get; set; }

        /// <summary>
        /// Gets or sets the manufacturer of the computer component.
        /// </summary>
        public string Manufacturer { get; set; }

        /// <summary>
        /// Gets or sets the status of the computer component.
        /// </summary>
        public ComponentStatus Status { get; set; }
    }

    /// <summary>
    /// The component type for the computer component.
    /// </summary>
    public enum ComponentType
    {
        /// <summary>
        /// Processor component.
        /// </summary>
        Processor,

        /// <summary>
        /// Memory component.
        /// </summary>
        Memory,

        /// <summary>
        /// Video card component.
        /// </summary>
        VideoCard,

        /// <summary>
        /// Drive component.
        /// </summary>
        Drive
    }

    /// <summary>
    /// The component status for the computer component.
    /// </summary>
    public enum ComponentStatus
    {
        /// <summary>
        /// Component is normal (success state).
        /// </summary>
        Normal,

        /// <summary>
        /// Component is defective (error state).
        /// </summary>
        Defective,

        /// <summary>
        /// Component is in overheating state (warning).
        /// </summary>
        Overheating
    }
}


```

`SamplesExtension.DataModels/Computer.cs`

```cs

﻿//-----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//-----------------------------------------------------------------------------
using System.Collections.Generic;
using Microsoft.Portal.TypeMetadata;

namespace Microsoft.Portal.Extensions.SamplesExtension.DataModels
{
    /// <summary>
    /// Representation of a computer used by the hubs/browse sample.
    /// </summary>
    [TypeMetadataModel(typeof(Computer), "DataModels")]
    [Indexable]
    public class Computer
    {
        /// <summary>
        /// Gets or sets the name of the computer.
        /// </summary>
        [Id]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the display text of the computer.
        /// </summary>
        public string Display { get; set; }

        /// <summary>
        /// Gets or sets the model of the computer.
        /// </summary>
        public string Model { get; set; }

        /// <summary>
        /// Gets or sets the manufacturer of the computer.
        /// </summary>
        public string Manufacturer { get; set; }

        /// <summary>
        /// Gets or sets the collection of computer component of the computer.
        /// </summary>
        public IEnumerable<ComputerComponent> Components { get; set; }
    }
}


```

In the samples above, the `[TypeMetadataModel]` data attribute designates this class as one which should be included in the type generation. The first parameter to the data attributes notes the type we're targeting (this is always the same as the class you are decorating). The second attribute provides the TypeScript namespace for the model generated object. If you do not specify a namespace, the .NET namespace of the model object will be used. The `[Id]` attribute on the name field designates the name property as the primary key field of the object. This is required when performing merge operations from data sets and edit scopes.

<a name="type-metadata-c-to-typescript-code-generation-approach-step-3-reference-the-datamodels-project-from-your-client-project"></a>
#### Step 3: Reference the datamodels project from your client project.

- Add a Project reference from Extension.csproj to Extension.DataModels.csproj
- Build to generate datamodels and typemetadata
- Include generated models in your csproj if not already done so.  Within the Extension.csproj this is simply

```xml
<ItemGroup>
    <None Include="Client\**\*.ts" />
</ItemGroup>
```

alternatively you can include them in your extension project in Bisual Studio by selecting the "Show All Files" option in the Solution Explorer. Right click on the `\Client\_generated` directory in the solution explorer and choose "Include in Project".

<a name="type-metadata-c-to-typescript-code-generation-approach-step-4-consume-generated-typemetadata-as-needed"></a>
#### Step 4: Consume generated typemetadata as needed

The following provides a brief example of how to comsume the generated typemetadata and datamodels

using within a QueryCache

```ts

    import { Computer, ComputerMetadata } from "_generated/SamplesExtension/DataModels/Computer";
    ...

    public computersQuery = new MsPortalFx.Data.QueryCache<Computer, any>({
        entityTypeName: ComputerMetadata.name,
        sourceUri: () => Util.appendSessionId(ComputerData._apiRoot),
    });

```

In many cases, you'll want to instantiate an instance of the given type. One way to accomplish this is to create a TypeScript class which implements the generated interface. However, this defeats the point of automatically generating the interface. The framework provides a method which allows generating an instance of a given interface:

```ts
    const empty = MsPortalFx.Data.Metadata.createEmptyObject(ComputerMetadata.name);
```

<a name="faq"></a>
## FAQ

<a name="faq-i-onboarded-to-typemetadata-a-long-time-ago-and-have-been-told-to-onboard-to-the-extensionload-optimized-route"></a>
### I onboarded to TypeMetadata a long time ago and have been told to onboard to the ExtensionLoad Optimized route.

[See detailed steps in this video](https://msit.microsoftstream.com/video/5c2f3aac-b0a2-4a06-a0d1-cc13ed1aaa4b?st=1491)

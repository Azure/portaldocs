
<a name="type-metadata"></a>
## Type metadata
When performing merge operations, the DataSet library will need to know a little bit about the schema of your model objects. For example, in the case of a Website, we want to know the property which defines the primary key of that object. This information which describes the object, and all of its properties is referred to in the portal as *type metadata*. Type metadata can be manually coded using existing libraries. However, for developers using C#, we provide two features that make this easier:

- Generation of type metadata from C# to TypeScript at build time
- Generation of TypeScript model interfaces from C# model objects

Both of these features allow you to write your model objects once in C#, and then let the compiler generate interfaces and data for use at runtime.

To use type metadata generation, you need to keep your model objects (aka Data Transfer Objects / DTOs) in a separate .NET project from your extension. For an example, check out the `SamplesExtension.DataModels` project included in the SDK. The class library project used to generate models requires the following dependencies:

- System.ComponentModel.DataAnnotations
- System.ComponentModel.Composition
- Microsoft.Portal.TypeMetadata

`Microsoft.Portal.TypeMetadata` can be found at the following location:
`%programfiles(x86)%\Microsoft SDKs\PortalSDK\Libraries\Microsoft.Portal.TypeMetadata.dll`

At the top of any C# file using the `TypeMetadataModel` annotation, the following namespaces must be imported:

- `System.ComponentModel.DataAnnotations`
- `Microsoft.Portal.TypeMetadata`

For an example of a model class which generates TypeScript, open the following sample:

```cs
// \SamplesExtension.DataModels\Robot.cs

using System.ComponentModel.DataAnnotations;
using Microsoft.Portal.TypeMetadata;

namespace Microsoft.Portal.Extensions.SamplesExtension.DataModels
{
    /// <summary>
    /// Representation of a robot used by the browse sample.
    /// </summary>
    [TypeMetadataModel(typeof(Robot), "SamplesExtension.DataModels")]
    public class Robot
    {
        /// <summary>
        /// Gets or sets the name of the robot.
        /// </summary>
        [Key]
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the status of the robot.
        /// </summary>
        public string Status { get; set; }

        /// <summary>
        /// Gets or sets the model of the robot.
        /// </summary>
        public string Model { get; set; }

        /// <summary>
        /// Gets or sets the manufacturer of the robot.
        /// </summary>
        public string Manufacturer { get; set; }

        /// <summary>
        /// Gets or sets the Operating System of the robot.
        /// </summary>
        public string Os { get; set; }
    }
}
```

In the sample above, the `[TypeMetadataModel]` data attribute designates this class as one which should be included in the type generation. The first parameter to the data attributes notes the type we're targeting (this is always the same as the class you are decorating). The second attribute provides the TypeScript namespace for the model generated object. If you do not specify a namespace, the .NET namespace of the model object will be used. The `[Key]` attribute on the name field designates the name property as the primary key field of the object. This is required when performing merge operations from data sets and edit scopes.

<a name="type-metadata-setting-options"></a>
### Setting options

By default, the generated files will be placed in the `\Client\_generated` directory. They will still need to be explicitly included in the csproj for your extension. The TypeScript interface generation and metadata generation are both controlled via properties in your extension's csproj file. The `SamplesExtension.DataModels` project is already configured to generate models. 

Dependent on the version of the SDK you use the following changes are required to your project:

 * From Release 4.15 forward all you need to do is reference your DataModels project and ensure your datamodels are marked with the appropriate TypeMetadataModel attribute  
 * Versions prior to 4.15 require the following change to add this capability to another .NET project, the following changes need to be made to the extension (not model) csproj file:

    `SamplesExtension.csproj`

```xml
<ItemGroup>
    <GenerateInterfacesDataModelAssembly
        Include="..\SamplesExtension.DataModels\bin\$(Configuration)\Microsoft.Portal.Extensions.SamplesExtension.DataModels.dll" />
</ItemGroup>
```

    The addition of `GenerateInterfaces` to the existing `CompileDependsOn` element will ensure the `GenerateInterfaces`         target is executed with the appropriate settings. The `AssemblyPaths` property notes the path on disk where the model        project assembly will be placed during a build.

<a name="type-metadata-using-the-generated-models"></a>
### Using the generated models

Make sure that the generated TypeScript files are included in your csproj. The easiest way to include new models in your extension project is to the select the "Show All Files" option in the Solution Explorer of Visual Studio. Right click on the `\Client\_generated` directory in the solution explorer and choose "Include in Project". Inside of the `\Client\_generated` folder you will find a file named by the fully qualified namespace of the interface. In many cases, you'll want to instantiate an instance of the given type. One way to accomplish this is to create a TypeScript class which implements the generated interface. However, this defeats the point of automatically generating the interface. The framework provides a method which allows generating an instance of a given interface:

```ts
MsPortalFx.Data.Metadata.createEmptyObject(SamplesExtension.DataModels.RobotType)
```

<a name="type-metadata-non-generated-type-metadata"></a>
### Non-generated type metadata

Optionally, you may choose to write your own metadata to describe model objects. This is only recommended if not using a .NET project to generate metadata at compile time. In place of using the generated metadata, you can set the `type` attribute of your `DataSet` to `blogPostMetadata`. The follow snippet manually describes a blog post model:

```ts
var blogPostMetadata: MsPortalFx.Data.Metadata.Metadata = {
    name: "Post"
    idProperties: ["id"],
    properties: {
        "id": null,
        "post": null,
        "comments": { itemType: "Comment", isArray: true },
    }
};

var commentMetadata: MsPortalFx.Data.Metadata.Metadata = {
    name: "Comment"
    properties: {
        "name": null,
        "post": null,
        "date": null,
    }
};

MsPortalFx.Data.Metadata.setTypeMetadata("Post", blogPostMetadata);
MsPortalFx.Data.Metadata.setTypeMetadata("Comment", commentMetadata);
```

- The `name` property refers to the type name of the model object.
- The `idProperties` property refers to one of the properties defined below that acts as the primary key for the object.
- The `properties` object contains a property for each property on the model object.
- The `itemType` property allows for nesting complex object types, and refers to a registered name of a metadata object. (see `setTypeMetadata`).
- The `isArray` property informs the shell that the `comments` property will be an array of comment objects.

The `setTypeMetadata()` method will register your metadata with the system, making it available in the data APIs.

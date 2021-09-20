<a name="v2-targets"></a>
# V2 targets

The Azure Portal SDK ships a "V2" targets that is designed to work with CloudBuild. The Azure Portal team and some of the larger extension partners teams have already enabled CloudBuild for their repositories to using the V2 targets. The key value proposition of the V2 targets are:

- Support for compile-on-save of TypeScript files that works with both Visual Studio and VSCode.
- A highly reliable incremental compilation engine that can significantly reduce local development build times.
- Support automatically serving content files that are compressed using max Brotli compression. This feature will help extension performance at the 95th percentile where network latency and throughput dominates.

Below are the steps to switch to the V2 targets. A video of the migration steps can be found here: https://msit.microsoftstream.com/video/49879891-7735-44c0-9255-d32162b78ed5?st=1349

<a name="v2-targets-prerequisites"></a>
## Prerequisites

- Get your extension working with at least Ibiza SDK 5.0.302.6501. The V2 targets are under active development are continuously being improved. Ideally get your extension working with the latest SDK.

<a name="v2-targets-get-your-extension-building-with-tsconfig-json"></a>
## Get your extension building with tsconfig.json

- Fully build your extension to get all of the code-generated files (eg. TypeScript files generated from PDL) generated.

- Delete any generate d.ts files generated in `$(ProjectDir)Client\Definitions`. You do not have to do anything to files outside of the Client folder.
- Add a tsconfig.json to the root of the project with the following content. '''Do not deviate unless you know what you are doing.

```json
  {
    "compileOnSave": true,
    "compilerOptions": {
      "baseUrl": "Client",
      "declaration": true,
      "experimentalDecorators": true,
      "forceConsistentCasingInFileNames": true,
      "inlineSources": true,
      "module": "amd",
      "moduleResolution": "node",
      "noEmitHelpers": true,
      "noImplicitAny": true,
      "noImplicitThis": true,
      "paths": {
        "*": [
          "*"
        ]
      },
      "outDir": "Output/Content/Scripts",
      "rootDir": "Client",
      "removeComments": false,
      "sourceMap": true,
      "target": "es5",
      "types": []
    },
    "include": [
      "Client/**/*"
    ]
  }
```

- If the framework d.ts files (e.g. MsPortalFx.d.ts) for your extension are in `$(ProjectDir)\Definitions`, the tsconfig.json "include" setting will not include these files. To include these files for compilation, create the file `$(ProjectDir)Client\TypeReferences.d.ts` and add reference tags to these files. You can also include these files by specifying them in the include section of the tsconfig.json.
- Run tsc.exe TypeScript compiler that is shipped with the Portal SDK with the project folder as current directory. This will compile the TypeScript files using the tsconfig.json file.
- You may see new errors because the TypeScript compiler is more strict in checking code when using a tsconfig file. Fix any errors that you see. You may need to remove `/// <reference path="" />` lines from all TypeScript files to fix certain errors.
- If you see a casing mismatch error, you may need to use "git mv" to rename and change the casing of the file.

<a name="v2-targets-get-extension-building-using-v2-targets"></a>
## Get extension building using V2 targets

- Remove all `<TypeScriptCompile>` elements from the csproj. Do not remove the `<SvgTs>` tags. If you use Visual Studio and want to see TypeScript files in the Solution Explorer, you should instead change the element names to None or Content.
- Remove all TypeScript and PDL MSBuild properties from the csproj. These include:

```xml
  <PropertyGroup>
    <TypeScriptExperimentalDecorators>true</TypeScriptExperimentalDecorators>
    <PortalDefinitionTargetFolder>Client</PortalDefinitionTargetFolder>
    <PortalDefinitionContentName>.</PortalDefinitionContentName>
    <PortalDefinitionWriteAmd>true</PortalDefinitionWriteAmd>
    <EmbeddedTypeScriptResourcePrefixReplace>Client\</EmbeddedTypeScriptResourcePrefixReplace>
    <EmbeddedTypeScriptResourcePrefix>Content\Scripts\</EmbeddedTypeScriptResourcePrefix>
  </PropertyGroup>
  <PropertyGroup Condition="'$(Configuration)' == 'Debug'" Label="TypeScriptConfigurationsDebug">
    <TypeScriptNoImplicitAny>true</TypeScriptNoImplicitAny>
    <TypeScriptTarget>ES5</TypeScriptTarget>
    <TypeScriptRemoveComments>false</TypeScriptRemoveComments>
    <TypeScriptSourceMap>true</TypeScriptSourceMap>
    <TypeScriptGeneratesDeclarations>false</TypeScriptGeneratesDeclarations>
    <TypeScriptModuleKind>AMD</TypeScriptModuleKind>
  </PropertyGroup>
  <PropertyGroup Condition="'$(Configuration)' == 'Release'">
    <TypeScriptNoImplicitAny>true</TypeScriptNoImplicitAny>
    <TypeScriptTarget>ES5</TypeScriptTarget>
    <TypeScriptRemoveComments>true</TypeScriptRemoveComments>
    <TypeScriptSourceMap>true</TypeScriptSourceMap>
    <TypeScriptGeneratesDeclarations>false</TypeScriptGeneratesDeclarations>
    <TypeScriptModuleKind>AMD</TypeScriptModuleKind>
  </PropertyGroup>
```

- Add a content tag for the tsconfig.json file to the .csproj:

```xml
  <Content Include="tsconfig.json" />
```

- Switch the old tools target to the new tools target ("v2") in the .csproj. The new import targets looks something like:

```xml
  <Import Project="$(PkgMicrosoft_Portal_Tools)\build\Microsoft.Portal.Tools.targets" />
```

<a name="v2-targets-enabling-cloudbuild-support"></a>
## Enabling CloudBuild support

- Add the following to the csproj inside an ItemGroup if you have any `<Svg>` tags in the csproj. This tag informs CloudBuild that Svg MsBuild Items are consider inputs to the project.

```xml
  <AvailableItemName Include="Svg">
     <Visible>False</Visible>
  </AvailableItemName>
```

<a name="v2-targets-common-errors"></a>
## Common errors

- Make sure that the `Microsoft.Portal.Tools.targets` is imported after the C# and WebApplication targets. The ordering should look like something before.

```xml
  <Import Project="$(MSBuildToolsPath)\Microsoft.CSharp.targets" />
  <Import Project="$(MSBuildExtensionsPath32)\Microsoft\VisualStudio\v15.0\WebApplications\Microsoft.WebApplication.targets" />
  <Import Project="$(NuGetPath_Microsoft_Portal_Tools)\build\Microsoft.Portal.Tools.targets" Condition="Exists('$(NuGetPath_Microsoft_Portal_Tools)\build\Microsoft.Portal.Tools.targets')" />
```

<a name="v2-targets-breaking-changes-between-v1-and-v2-targets"></a>
## Breaking changes between V1 and V2 targets

- The output location of pde files has been changed from `$(ProjectDir)Client` to `$(OutDir)`.

<a name="onboarding-an-existing-extension-to-reactviews"></a>
# Onboarding an existing extension to ReactViews

ReactViews use an NPM based toolchain and a completely separate build pipeline from a traditional extension for generating assets,
however, these assets will continue to be dropped into the same output folder in order to be packaged for hosting service consumption.
To do this, we'll do the following:

1. [Create a folder](#create-a-folder) nested under your Client or TypeScript folder. All your ReactView code will live in this folder.
2. [Install the packages](#install-the-packages) azureportal-reactview and azureportal-reactview-tools from the AzurePortal registry.
3. [Create your build script](#create-your-build-script) which may be out of the box configuration, or a custom case.
4. [Integrate](#integrate) the ReactView build with the Knockout build.
5. [Validate](#validate) that you can load the Test ReactView.

<a name="onboarding-an-existing-extension-to-reactviews-create-a-folder"></a>
## Create a folder

Create a folder within your Client or TypeScript folder, which is side by side with your extension's existing code.
Typically, this folder is called ReactViews or React with a nested folder called Views.
If you know you need a model, create the nested structure otherwise just use a single folder called ReactViews.
Within this folder run `npm init -y` which will create a `package.json` file.

Finally, in your extension's root tsconfig.json file, add the new folder to the exclude entry. It will look something like:

```javascript
{
    "exclude": [
        "Client/React/Views/**/*"
    ]
}
```

<a name="onboarding-an-existing-extension-to-reactviews-install-the-packages"></a>
## Install the packages

Next to the `package.json` create a new file called `.npmrc`, this file will contain
the information connecting you to the AzurePortal registry. The contents should be:

```ini
registry=https://msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm/registry/
always-auth=true
allow-same-version=true
```

The next step is to authenticate with the feed, and install the packages. You can do this with the following npm commands (run from within the same folder):

```sh
npm install -g vsts-npm-auth --registry https://registry.npmjs.com --always-auth false
vsts-npm-auth -R -config .npmrc
npm install --save @microsoft/azureportal-reactview
npm install --save-dev @microsoft/azureportal-reactview-tools
```

<a name="onboarding-an-existing-extension-to-reactviews-create-your-build-script"></a>
## Create your build script

As stated earlier, ReactView assets are generated entirely independently, using both Webpack and TypeScript.
In order to successfully integrate with the MsPortalFx build pipeline, we provide tools that come with default webpack and typescript configuration. This tool is included as part of the `@microsoft/azureportal-reactview-tools` package. These instructions assume you are using v1.0.9 or above of the `@microsoft/azureportal-reactview-tools` package.

There are two ways to customize the build,
one is passing command-line arguments to the CLI `reactview-build`. The second option is to add a `reactbuild.config.js` script where you can customize your build using the Node API.

Your extension may not need any customizations if:

- Your ClientResource strings all end in "Resources" (e.g OverviewResources, ClientResources, CreateResources)
- Your folders nested and setup as described in [Create a folder](#create-a-folder).
- You don't require any custom Webpack loaders/plugins besides style-loader

Regardless of how you choose to customize the build, the first step is to copy the `tsconfig.extension.json` file from the `@microsoft/azureportal-reactview-tools` package into your new ReactView folder, and rename it to `tsconfig.json`.

Additionally, let's copy the `HelloWorld.ReactView.tsx` file from [here][HelloWorld ReactView], so we can test our build with it. Don't worry about the contents for now.

[HelloWorld ReactView]: https://msazure.visualstudio.com/One/_git/AzureUX-TemplateExtension?path=%2Fsrc%2FDefault%2FExtension%2FClient%2FReactViews%2FHelloWorld.ReactView.tsx

<a name="onboarding-an-existing-extension-to-reactviews-create-your-build-script-setup-your-build-scripts-in-package-json"></a>
### Setup your build scripts in package.json

Within your `package.json` file, you should have the following 3 script entries:

```JSON
{
    "scripts": {
        "build": "reactview-build",
        "build:dev": "reactview-build --development",
        "watch": "reactview-build --watch --development"
    }
}
```

<a name="onboarding-an-existing-extension-to-reactviews-create-your-build-script-specify-your-build-output-folder"></a>
### Specify your build output folder

Identify the output folder of your existing MsPortalFx base code relative to the ReactView folder. If it is anything other than `../../Output/Content/Scripts` then you will need to customize your build.

You can specify a custom output location using a CLI argument OR in a custom build script.

<a name="onboarding-an-existing-extension-to-reactviews-create-your-build-script-specify-your-build-output-folder-option-1-using-cli-arguments"></a>
#### Option 1. Using CLI arguments

For all 3 script commands in package.json, you can add a `--outputDirectory` argument with the custom location following it. This would look like:

```JSON
{
    "scripts": {
        "build": "reactview-build --outputDirectory ../custom/location/ReactViews",
        "build:dev": "reactview-build --development --outputDirectory ../custom/location/ReactViews",
        "watch": "reactview-build --watch --development --outputDirectory ../custom/location/ReactViews"
    }
}
```

Note the disadvantage of the CLI argument approach is that the arguments must be repeated and kept in-sync among all script entries.

<a name="onboarding-an-existing-extension-to-reactviews-create-your-build-script-specify-your-build-output-folder-option-2-using-a-custom-build-script"></a>
#### Option 2. Using a custom build script

In the same directory as your package.json file, you can create a `reactbuild.config.js` file. This script will be run at the beginning of each build, allowing you to customize the webpack configuration.

At the beginning of the file, you'll add these 2 lines:
```javascript
const { getReactViewBuild } = require("@microsoft/azureportal-reactview-tools/webpack.config");
const builder = getReactViewBuild();
```

Then you can invoke methods on your builder to customize your build. These customizations will kick in for all of the script commands, allowing you to customize *in addition to* any CLI arguments that were passed in the script.

To set the output directory, you would add the following line to your config file:
```javascript
builder.setOutputDirectory("../custom/location/ReactViews");
```

<a name="onboarding-an-existing-extension-to-reactviews-create-your-build-script-running-the-build"></a>
### Running the build

After ensuring that your output directory is set correctly, running `npm run build` should output:

```text
Starting reactview-build...
Finished reactview-build without errors!
Wrote files to: [The output directory you configured]
```

If you encounter build errors, you should be able to find answers on your favorite search engine. The number one issue that teams encounter is
around import statements. Webpack demands that your imports be in one of the following shapes (most to least preferred):

```typescript
import { x, y } from "someModule"; // This enables webpack to tree shake everything except x and y
import someDefault from "someModule"; // This is a default import, also allows proper tree shaking
import * as something from "someModule"; // This imports everything from a module and can break tree shaking
```

The following are examples of import staments that generally have to be rewritten:

```typescript
const { x, y } = require("someModule"); // This should be converted to the first option above
import something = require("someModule"); // this should be converted to the third option above
```

These odd style of imports are most often used with open source libraries that were hand converted to AMD modules or client resource files.

Otherwise, head to the directory was configured, and check if `HelloWorld.ReactView.js` was emitted. If not, try running `npm run build -- --traceOutput` to see where each file is being emitted with more verbosity.

If the file, is there, everything is working as expected! [Skip to integration](#integrate).

<a name="onboarding-an-existing-extension-to-reactviews-create-your-build-script-additional-node-api-build-options"></a>
### Additional Node API build options

Below is a list of the APIs you can invoke within your `reactbuild.config.js` script:

- `addExternal`: Add an external entry to the webpack config "externals" property
- `addFallbacks`: Adds one or more resolve.fallback items, used when normal resolving fails.
- `addPackageAlias`: Add an alias to webpack (useful for helping webpack work with path configurations in tsconfigs)
- `addPlugin`: Add a webpack plugin to the webpack config "plugins" property.
- `addRule`: Adds a module rule to the webpack config
- `disableVersioningPlugin`: Disables the versioning plugin used for react and fluentui
- `enableDataFetcher`: Enable data fetcher for performance optimization
- `enableMonacoEditor`: Sets the languages that the Monaco Editor webpack plugin will support. Must use [react-monaco-editor](https://github.com/react-monaco-editor/react-monaco-editor) package.
- `enablePathAliasResolver`: Enable auto alias & path resolver
- `enableResJsonSupport`: Enable resjson support
- `enableTokenPrefetcher`: Enable custom token prefetcher for performance optimization
- `profile`: Enable webpack profiling plugin
- `setDevServerConfigPath`: Sets the devServerConfig path, required for FastRefresh to work.
- `setDevtool`: Sets Webpack's devtool property. Typically set to an appropriate value based on the presence of the --development CLI argument.
- `setFluentUIMajorVersion`: Sets major version of FluentUI to use. Default is 8.
- `setMode`: Sets Webpack's mode. Typically done via the --development CLI argument in the appropriate scripts
- `setOutputDirectory`: Sets the output directory.
- `setPublicPath`: Sets the relative public path for webpack loaders
- `setReactMajorVersion`: Sets major version of React to use. Default is 17.
- `setStatsFile`: Set path of generated stats file
- `setTsConfigFile`: Sets tsconfig file used by TypeScript compilation

Example `reactbuild.config.js`:

```javascript
const { getReactViewBuild } = require("@microsoft/azureportal-reactview-tools/webpack.config");
const builder = getReactViewBuild();

builder.setOutputDirectory("../../Output/Content/Scripts/ReactViews");
builder.setDevServerConfigPath('../../devServerConfig.json');

builder.addExternal(/Resources$/);

builder.addPackageAlias("react", "./node_modules/react");
builder.addPackageAlias("react-dom", "./node_modules/react-dom");
```

<a name="onboarding-an-existing-extension-to-reactviews-integrate"></a>
## Integrate

Integrating the ReactView build into your MsPortalFx build requires three additions within your `Extension.csproj`.

Add a reference to the new `tsconfig.json` file, this is needed to enable the precompiler parsing step for blade references etc.:

```xml
<Content Include="Client\ReactViews\tsconfig.json" />
```

Add a custom target to call `npm run build` within your folder. Many teams create a conditional step for calling `npm run build:dev` like so:

```xml
<Target Name="ReactViewBuild" BeforeTargets="GenerateContentPackage" AfterTargets="CompileTypescriptWithTSConfig">
    <Exec
        WorkingDirectory="$(MSBuildThisFileDirectory)/Client/ReactViews"
        Condition="'$(Configuration)|$(Platform)' == 'Debug|AnyCPU'"
        Command="npm run build:dev" />
    <Exec
        WorkingDirectory="$(MSBuildThisFileDirectory)/Client/ReactViews"
        Condition="'$(Configuration)|$(Platform)' == 'Release|AnyCPU'"
        Command="npm run build" />
</Target>
```

Note: Portal team does not provide an npm/node executable to use at build time, you may have to go through extra steps depending on your configuration to ensure they are available.

Run a clean build of your extension, and fix any build breaks as needed before heading to the next step.

<a name="onboarding-an-existing-extension-to-reactviews-validate"></a>
## Validate

Once your build worked, you should be able to build and sideload your extension using whichever method your team prefers (e.g `ap serve`),
and navigate to the added HelloWorld.ReactView by going to the deeplink: `#blade/[ExtensionName]/HelloWorld.ReactView` (e.g `#blade/Microsoft_Azure_Compute/HelloWorld.Reactview`).
You should see a view load that has some texts and a textbox.

If that's what you see, then head to the [Guides](react-index.md/#guides) to start building and migrating experiences!

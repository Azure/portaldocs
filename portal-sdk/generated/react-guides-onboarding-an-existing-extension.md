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
In order to successfully integrate with the MsPortalFx build pipeline, we provide tools that come with default webpack and typescript configuration.
This tool is included as part of the `@microsoft/azureportal-reactview-tools` package. There are two ways to consume the build,
one is using the CLI `reactview-build` which provides a working out of the box solution for most teams. The second option, for advanced scenarios, is to use the Node API.

Your extension is most likely compatible with the CLI if:

- Your ClientResource strings all end in "Resources" (e.g OverviewResources, ClientResources, CreateResources)
- Your folders nested and setup as described in [Create a folder](#create-a-folder).
- You don't require any custom Webpack loaders/plugins besides style-loader

You can always migrate from CLI to Node interface easily, migrating back may not work as easily. If you can use the CLI, it is the recommended approach.

Regardless of which method you choose, the first step is to copy the `tsconfig.extension.json` file from the `@microsoft/azureportal-reactview-tools` package. into your new ReactView folder, and rename it to `tsconfig.json`.

Additionally, let's copy the `Test.ReactView.tsx` file from [here][Test ReactView], so we can test our build with it. Don't worry about the contents for now.

[Test ReactView]: https://msazure.visualstudio.com/One/_git/AzureUX-TemplateExtension?path=%2Fsrc%2FDefault%2FExtension%2FClient%2FReactViews%2FTest.ReactView.tsx

<a name="onboarding-an-existing-extension-to-reactviews-onboarding-to-cli-based-build"></a>
## Onboarding to CLI Based Build

Identify the output folder of your existing MsPortalFx base code relative to the ReactView folder.
It might be something like: `../../Output/Content/Scripts/`, append the current folder structure to that to maintain the shape.
Within your `package.json` file, add the following script entries, substituting this new directory where appropriate:

```javascript
{
    "scripts": {
        "build": "reactview-build --outputDirectory ../../Output/Content/Scripts/ReactViews/",
        "build:dev": "reactview-build --development --outputDirectory ../../Output/Content/Scripts/ReactViews/",
        "watch": "reactview-build --watch --development --outputDirectory ../../Output/Content/Scripts/ReactViews/"
    }
}
```

After saving the file, running `npm run build` should output:

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

Otherwise, head to the directory was configured, and check if `Test.ReactView.js` was emitted. If not, try running `npm run build -- --traceOutput` to see where each file is being emitted with more verbosity.

If the file, is there, everything is working as expected! [Skip to integration](#integrate).

<a name="onboarding-an-existing-extension-to-reactviews-onboarding-to-the-node-api-based-build"></a>
## Onboarding to the Node API based build

If the above steps did not work for you, or you have a custom scenario there is a custom Node API surface that can enable a wider variety of scenarios.

To start, make a javascript file called `reactbuild.js` next to your package.json file. Within this file put the following contents:

```javascript
const path = require("path");
const reactTools = require("@microsoft/azureportal-reactview-tools/webpack.config");
const builder = new reactTools.ReactViewBuild(process.cwd(),path.resolve([relative path to your output directory]));
// customizations here, in this example we've named our Resource files as ending in Strings
builder.addExternal(/Strings$/);
// customizations end
builder.runWebPack(); // pass true in to watch
```

Apply customizations as needed, we support the following. Most of them have thorough documentation on their site:

- `setMode`: sets Webpack's mode
- `setDevtool`: set's Webpack's devtool property
- `addExternal`: add an extern to webpack
- `addPackageAlias`: add an alias to webpack (useful for helping webpack work with path configurations in tsconfigs)

Most notably, there is the `getConfig` method, that will return the underlying raw webpack configuration.
If you call this method and make modifications, you are effectively 'voiding the warranty'.
While this gives a nice path to arbitrary customizations, be aware that if something breaks the portal may not provide support.

Once your customizations have been applied, save the file and add aliases to the `package.json` as needed, something like this.
You will likely want to enhance your script to take parameters for watch, and development build support:

```javascript
{
    "scripts": {
        "build": "node ./buildreact.js"
    }
}
```

Finally, run `npm run build` and tweak config as needed until no errors are returned, and the `Test.ReactView.js` file is emitted in the output directory.
For the most part, the errors are not portal specific and can be solved using your favorite search engine.

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
and navigate to the added Test.ReactView by going to the deeplink: `#blade/[ExtensionName]/Test.ReactView` (e.g `#blade/Microsoft_Azure_Compute/Test.Reactview`).
You should see a view load that has just a piece of text stating that you have successfully onboarded to ReactViews.

If that's what you see, then head to the [Guides](react-index.md/#guides) to start building and migrating experiences!

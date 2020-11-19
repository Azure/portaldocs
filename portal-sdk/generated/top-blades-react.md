<a name="reactviews"></a>
# ReactViews

* [ReactViews](#reactviews)
    * [What is a ReactView](#reactviews-what-is-a-reactview)
        * [Why build a ReactView](#reactviews-what-is-a-reactview-why-build-a-reactview)
        * [Breaking Change](#reactviews-what-is-a-reactview-breaking-change)
    * [What is Az](#reactviews-what-is-az)
    * [Getting Started](#reactviews-getting-started)
        * [Create a folder](#reactviews-getting-started-create-a-folder)
        * [Install the packages](#reactviews-getting-started-install-the-packages)
        * [Create your build script](#reactviews-getting-started-create-your-build-script)
            * [Onboarding to CLI Based Build](#reactviews-getting-started-create-your-build-script-onboarding-to-cli-based-build)
            * [Onboarding to the Node API based build](#reactviews-getting-started-create-your-build-script-onboarding-to-the-node-api-based-build)
        * [Integrate](#reactviews-getting-started-integrate)
        * [Validate](#reactviews-getting-started-validate)
    * [Guides](#reactviews-guides)
    * [Knockout to React controls](#reactviews-knockout-to-react-controls)
    * [Libraries Explained](#reactviews-libraries-explained)
        * [Redux and React-Redux](#reactviews-libraries-explained-redux-and-react-redux)
            * [What is Redux](#reactviews-libraries-explained-redux-and-react-redux-what-is-redux)
            * [What is React-Redux](#reactviews-libraries-explained-redux-and-react-redux-what-is-react-redux)
            * [When should you use Redux](#reactviews-libraries-explained-redux-and-react-redux-when-should-you-use-redux)
            * [How do we use Redux](#reactviews-libraries-explained-redux-and-react-redux-how-do-we-use-redux)
            * [Common pitfalls / complaints](#reactviews-libraries-explained-redux-and-react-redux-common-pitfalls-complaints)
        * [Lodash](#reactviews-libraries-explained-lodash)
        * [NPM Modules](#reactviews-libraries-explained-npm-modules)
            * [Performance](#reactviews-libraries-explained-npm-modules-performance)
            * [FluentUI Libraries](#reactviews-libraries-explained-npm-modules-fluentui-libraries)
            * [Accessibility, Security, Support, and Reliability](#reactviews-libraries-explained-npm-modules-accessibility-security-support-and-reliability)
            * [Custom Webpack Plugins](#reactviews-libraries-explained-npm-modules-custom-webpack-plugins)
    * [Additional Features](#reactviews-additional-features)
        * [React Dev Tools](#reactviews-additional-features-react-dev-tools)
        * [Localization](#reactviews-additional-features-localization)
    * [Getting Support](#reactviews-getting-support)
        * [Stack overflow](#reactviews-getting-support-stack-overflow)
        * [Teams](#reactviews-getting-support-teams)
        * [User voice](#reactviews-getting-support-user-voice)
        * [Filing bugs](#reactviews-getting-support-filing-bugs)
    * [Contribution](#reactviews-contribution)
    * [Internal Technical Details](#reactviews-internal-technical-details)
        * [Prewarming the IFrames](#reactviews-internal-technical-details-prewarming-the-iframes)
        * [Scaffolding](#reactviews-internal-technical-details-scaffolding)
    * [Frequently asked questions (FAQ)](#reactviews-frequently-asked-questions-faq)
        * [Do I still need to follow the previous UX best practices](#reactviews-frequently-asked-questions-faq-do-i-still-need-to-follow-the-previous-ux-best-practices)
        * [Can I include Knockout controls inside of a ReactView](#reactviews-frequently-asked-questions-faq-can-i-include-knockout-controls-inside-of-a-reactview)
        * [Can I include a ReactView inside a Knockout blade](#reactviews-frequently-asked-questions-faq-can-i-include-a-reactview-inside-a-knockout-blade)
        * [My call is failing due to cors errors](#reactviews-frequently-asked-questions-faq-my-call-is-failing-due-to-cors-errors)
        * [Why not build my own React experience in a frame](#reactviews-frequently-asked-questions-faq-why-not-build-my-own-react-experience-in-a-frame)
    * [Known Gaps](#reactviews-known-gaps)
        * [Root components are required to be class components](#reactviews-known-gaps-root-components-are-required-to-be-class-components)
        * [Charting component](#reactviews-known-gaps-charting-component)
        * [Form authoring](#reactviews-known-gaps-form-authoring)
        * [Parts](#reactviews-known-gaps-parts)


<a name="reactviews-what-is-a-reactview"></a>
## What is a ReactView

ReactViews are the Azure Portal Framework's approach to a modern web development experience. There are two parts to this: runtime and tooling. Runtime
wise, your code will run in a visible IFrame, with full access to the DOM and no layer of Portal supplied sanitizations or restrictions. Tooling wise,
almost everything has been converted to be a more open toolchain: the components and APIs ship as an NPM package, bundling with webpack, ability to NPM
install most packages, and testing with most popular open source frameworks (jest, react-testing-library, enzyme).

<a name="reactviews-what-is-a-reactview-why-build-a-reactview"></a>
### Why build a ReactView

ReactViews are the current recommended approach for building new experiences. That being said, there are still gaps we're actively working on closing;
For a list of gaps take a look at the [known gaps](#known-gaps) below. Unless there's a blocking gap, your team is highly encouraged to build all new
experiences as ReactViews. They combine the performance, reliability, security, and consistency of traditional knockout blades with the flexibility of
framed experiences.

<a name="reactviews-what-is-a-reactview-breaking-change"></a>
### Breaking Change

ReactViews do not have access to MsPortalFx or Fx modules. Additionally, jQuery, knockout, and Q are not loaded or accessible from within your
ReactView. You may load your own versions of these libraries if you need them, but the framework does not provide them for you out of the box. Many
teams have made significant investments in the traditional Template blade and MsPortalFx world, for those teams we provide a construct called a
ReactModel that runs within your extension and has access to redux primitives as a way of facilitating communication between your ReactView and the
MsPortalFx context.

<a name="reactviews-what-is-az"></a>
## What is Az

Az (imported as @microsoft/azureportal-reactview/Az) is a set of APIs that is provided as a fill in for general Portal interactions, Template blade
authors can generally view Az as being the substitute for container APIs. Additionally, there are a handful of other APIs on Az around subscriptions,
feature flags, and logging. In the long run we will split out the non-container functionality into separate modules. We're actively working on creating
those before such a breaking change takes place. For more info on Az APIs, take a look at the [full documentation](#portalfx-react-az.md).

<a name="reactviews-getting-started"></a>
## Getting Started

If you are a new extension, then following the [getting started guide](top-extensions-getting-started.md) will create an extension that's already onboarded to ReactViews. 
Once you've created your new extension you can skip the getting started section.

Otherwise, if you are on a traditional extension this guide will onboard you to the latest set of ReactView tooling.

ReactViews use an NPM based toolchain and a completely separate build pipeline from a traditional extension for generating assets,
however, these assets will continue to be dropped into the same output folder in order to be packaged for hosting service consumption.
To do this, we'll do the following:

1. [Create a folder](#create-a-folder) nested under your Client or TypeScript folder. All your ReactView code will live in this folder.
2. [Install the packages](#install-the-packages) azureportal-reactview and azureportal-reactview-tools from the AzurePortal registry.
3. [Create your build script](#create-your-build-script) which may be out of the box configuration, or a custom case.
4. [Integrate](#integrate) the ReactView build with the Knockout build.
5. [Validate](#validate) that you can load the Test ReactView.

<a name="reactviews-getting-started-create-a-folder"></a>
### Create a folder

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

<a name="reactviews-getting-started-install-the-packages"></a>
### Install the packages

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

<a name="reactviews-getting-started-create-your-build-script"></a>
### Create your build script

As stated earlier, ReactView assets are generated entirely independently, using both Webpack and TypeScript.
In order to successfully integrate with the MsPortalFx build pipeline, we provide tools that come with default webpack and typescript configuration.
This tool is included as part of the `@microsoft/azureportal-reactview-tools` package. There are two ways to consume the build,
one is using the CLI `reactview-build` which provides a working out of the box solution for most teams. The second option, for advanced scenarios, is to use the Node API.

Your extension is most likely compatible with the CLI if:

- Your ClientResource strings all end in "Resources" (e.g OverviewResources, ClientResources, CreateResources)
- Your folders nested and setup as described in [Create a folder](#create-a-folder).
- You don't require any custom Webpack loaders/plugins besides style-loader

You can always migrate from CLI to Node interface easily, migrating back may not work as easily. If you can use the CLI, it is the recommended approach.

Regardless of which method you choose, the first step is to copy the `tsconfig.extension.json` file into your new ReactView folder, and rename it to `tsconfig.json`.

Additionally, let's copy the `Test.ReactView.tsx` file from [here][Test ReactView], so we can test our build with it. Don't worry about the contents for now.

[Test ReactView]: https://msazure.visualstudio.com/One/_git/AzureUX-TemplateExtension?path=%2Fsrc%2FDefault%2FExtension%2FClient%2FReactViews%2FTest.ReactView.tsx

<a name="reactviews-getting-started-create-your-build-script-onboarding-to-cli-based-build"></a>
#### Onboarding to CLI Based Build

Identify the output folder of your existing MsPortalFx base code relative to the ReactView folder.
It might be something like: `../../Output/`, append the current folder structure to that to maintain the shape.
Within your `package.json` file, add the following script entries, substituting this new directory where appropriate:

```javascript
{
    "scripts": {
        "build": "reactview-build --outputDirectory ../../Output/ReactViews/",
        "build:dev": "reactview-build --development --outputDirectory ../../Output/ReactViews/",
        "watch": "reactview-build --watch --development --outputDirectory ../../Output/ReactViews/"
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

<a name="reactviews-getting-started-create-your-build-script-onboarding-to-the-node-api-based-build"></a>
#### Onboarding to the Node API based build

If the above steps did not work for you, or you have a custom scenario there is a custom Node API surface that can enable a wider variety of scenarios.

To start, make a javascript file called `reactbuild.js` next to your package.json file. Within this file put the following contents:

```javascript
const path = require("path");
const reactTools = require("@microsoft/azureportal-reactview-tools/webpack.config");
const builder = new reactTools.ReactViewBuild(process.cwd(),path.resolve([relative path to your output directory]));
// customizations here, in this example we've named our Resource files as ending in Strings
reactViewConfig.addExternal(/Strings$/);
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

<a name="reactviews-getting-started-integrate"></a>
### Integrate

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

Finally, disable the `ProcessCss` target:

```xml
<Target Name="ProcessCss" />
```

Run a clean build of your extension, and fix any build breaks as needed before heading to the next step.

<a name="reactviews-getting-started-validate"></a>
### Validate

Once your build worked, you should be able to sideload your extension using whichever method your team prefers (e.g `ap serve`),
and navigate to the added Test.ReactView by going to the deeplink: `#blade/[ExtensionName]/Test.ReactView` (e.g `#blade/Microsoft_Azure_Compute/Test.Reactview`).
You should see a view load that has just a piece of text stating that you have successfully onboarded to ReactViews.

If that's what you see, then head to the [Guides](#guides) to start building and migrating experiences!

<a name="reactviews-guides"></a>
## Guides

Before following the guides below, please ensure your package version is updated to the latest version.
- Guide: [Creating a new ReactView experience](top-react-guides-new.md)
- Guide: [Unit Testing a ReactView](top-blades-react-unit-testing.md)

<a name="reactviews-knockout-to-react-controls"></a>
## Knockout to React controls

If you're migrating an existing Knockout based blade to a ReactView you'll find that the FluentUI components aren't mapped one to one with the Knockout controls offering.
You can use the mapping table [here](react-knockout-controls-mapping.md), to find the appropriate components.

<a name="reactviews-libraries-explained"></a>
## Libraries Explained

<a name="reactviews-libraries-explained-redux-and-react-redux"></a>
### Redux and React-Redux

<a name="reactviews-libraries-explained-redux-and-react-redux-what-is-redux"></a>
#### What is Redux

Redux is an open source library used to simplify state handling at a multi-component level; you can think of it as an efficient global React state that multiple components can take dependencies on.

Portal uses normal redux with the addition of decorators, so you can refer to the [official redux documentation](https://redux.js.org).

<a name="reactviews-libraries-explained-redux-and-react-redux-what-is-react-redux"></a>
#### What is React-Redux

React Redux is the official React binding for Redux. It lets your React components read data from a Redux store, and dispatch actions to the store to update data.

<a name="reactviews-libraries-explained-redux-and-react-redux-when-should-you-use-redux"></a>
#### When should you use Redux

As per the official Redux documentation: [`don't use Redux until you have problems with vanilla React.`](https://redux.js.org/faq/general#when-should-i-use-redux).

In general, use Redux when you have reasonable amounts of data changing over time, you need a single source of truth, and you find that approaches like keeping everything in a top-level React component's state are no longer sufficient.

However, it's also important to understand that using Redux comes with tradeoffs.

It's not designed to be the shortest or fastest way to write code.

It's intended to help answer the question "When did a certain slice of state change, and where did the data come from?", with predictable behavior.

It does so by asking you to follow specific constraints in your application: store your application's state as plain data, describe changes as plain objects, and handle those changes with pure functions that apply updates immutably.

This is often the source of complaints about "boilerplate".

These constraints require effort on the part of a developer, but also open up a number of additional possibilities (such as store persistence and synchronization).

<a name="reactviews-libraries-explained-redux-and-react-redux-how-do-we-use-redux"></a>
#### How do we use Redux

To explain how using redux and using react-redux works, we'll go through the following sample code
```tsx
import * as Az from "Az";
import * as React from "react";
import { createStore } from "redux";
import * as ClientResources from "ClientResources";
import { Fabric } from "OfficeFabric/Fabric";
import { Text } from "OfficeFabric/Text";
import { TextField } from "OfficeFabric/TextField";
import { Decorator, ReactReduxConnect } from "ReactView/ReactView";

interface StoreState {
    text: string;
}

@ReactReduxConnect.Decorator<StoreState>(state => { return { text: state.text }; })
class TextLabel extends React.Component<{ text?: string }, {}> {
    public render() {
        return <Text>{this.props.text}</Text>;
    }
}

interface SetTextAction {
    type: "SetText";
    text: string;
}

function setText(text: string): SetTextAction {
    return {
        type: "SetText",
        text,
    };
}

@ReactReduxConnect.Decorator<StoreState>(null, { setText })
class TextBox extends React.Component<{ setText?: typeof setText }, {}> {
    public render() {
        return <TextField onChange={(_, val) => this.props.setText(val)} />;
    }
}

const store = createStore((state: StoreState = { text: "Default" }, action: SetTextAction) => {
    switch (action.type) {
        case "SetText":
            // Using spread syntax on state to copy all previous state properties and update only the
            // one we care about so redux sends only "changed" signals to react components that need it
            return { ...state, text: action.text };
        default:
            return state;
    }
});

/**
    * This is a blade that does not have a corresponding model but instead keeps all of it's business login view side.
* This is a good place to start for simpler expereriences where the increased complexity of having your business
* logic live in a model is not necessary/needed for performance or simplicity.
*/
@Decorator<{}, {}, StoreState, SetTextAction>({
    store,
    viewReady: (state) => !!state.text,
})
export class ModelFree extends React.Component<{}, {}> {
    public constructor(props: {}) {
        super(props);
        Az.setTitle(ClientResources.reactViewTitle);
    }

    public render() {
        return (
            <Fabric>
                <TextBox />
                <TextLabel />
            </Fabric>
        );
    }
}
```

```typescript
import { createStore } from "redux";
```
> We import the `createStore` function from the `"redux"` module to create the redux store that will be used in multiple components.

```typescript
import { Text } from "OfficeFabric/Text";
import { TextField } from "OfficeFabric/TextField";
```
> Those two import statements are importing two Fluent UI controls, the Text control (simply displays text) and the TextField control (an editable textbox).

```typescript
import { Decorator, ReactReduxConnect } from "ReactView/ReactView";
```
> Here we import the root `Decorator` and the `ReactReduxConnect` decorators from the `"ReactView"` module
>
> The root decorator, unlike the `ReduxFree` decorator, uses redux and react-redux while the `ReactReduxConnect` decorator is used to replicate redux `connect` functionality when handling multiple components using the same store.

```typescript
interface StoreState {
    text: string;
}
```
> The interface representing the data in our redux store; here all we want to share between components is the TextField's text content, so that's the only property we define here.

```tsx
@ReactReduxConnect.Decorator<StoreState>(state => { return { text: state.text }; })
class TextLabel extends React.Component<{ text?: string }, {}> {
    public render() {
        return <Text>{this.props.text}</Text>;
    }
}
```
> Here we define a label component, which is simply going to be an Fluent UI `Text` control with our store's text property for content.
>
> The `ReactReduxConnect` decorator uses our Store interface as a generic argument, and the fist parameter, named `mapStateToProps`, is a function taking in the redux state and outputting and object with the subset of properties that this component cares about; here, that's the `"text"` property.
>
> Note that the component's properties interface is the same as what was returned by the function passed in as the first argument of the decorator; in reality the decorator has multiple optinal arguments and they all participate in shaping properties and states for the decorated component, please refer to the full typings and official [react-redux connect documentation](https://react-redux.js.org/api/connect) for more details.

```typescript
interface SetTextAction {
    type: "SetText";
    text: string;
}
function setText(text: string): SetTextAction {
    return {
        type: "SetText",
        text,
    };
}
```
> Here we have a combination of a redux action interface and a redux action creator; this is standard redux code and you can find more information about it offical [redux action documentation](https://redux.js.org/basics/actions/) but in short redux store mutations are done via actions which are composed of a type and new values(s) keyed under the same name(s) as the store properties.

```tsx
@ReactReduxConnect.Decorator<StoreState>(null, { setText })
class TextBox extends React.Component<{ setText?: typeof setText }, {}> {
    public render() {
        return <TextField onChange={(_, val) => this.props.setText(val)} />;
    }
}
```
> Here we have our second component, the `TextField` which will set the text value used in our other component.
>
> The decorator uses two arguments, the first one (`mapStateToProps`) being null since this component does not need to read anything from the redux store and the second one (`mapDispatchToProps`) being an object with all actions creators this component will use, which in this case is the `setText` action.
>
> Note how the component's properties, because of the use of the `ReactReduxConnect` decorator, map to `mapDispatchToProps`.

```typescript
const store = createStore((state: StoreState = { text: "Default" }, action: SetTextAction) => {
    switch (action.type) {
        case "SetText":
            // Using spread syntax on state to copy all previous state properties and update only the
            // one we care about so redux sends only "changed" signals to react components that need it
            return { ...state, text: action.text };
        default:
            return state;
    }
});
```
> This is where we instantiate our redux store; see official [redux createStore documentation](https://redux.js.org/api/createstore/). The function passed in is our reducer.
>
> The first argument of the reducer is the store's state, which is initialized with a default value in declaration.
>
> The second argument is an action, which will have been created by one of our action creators - in more complicated cases we would intersect multiple action types, but here we can simply use `SetTextAction` directly.
>
> The body of the reducer function is where we will branch on the action type and then generate a new state based on which action was used. In this case, the switch case only has two routes; the `"SetText"` action type, where we generate a new state with the same properties for everything and a new `text` property value, and `default`, where we just return the default (or passed in) state value.

```tsx
@Decorator<{}, {}, StoreState, SetTextAction>({
    store,
    viewReady: (state) => !!state.text,
})
export class ModelFree extends React.Component<{}, {}> {
    public constructor(props: {}) {
        super(props);
        Az.setTitle(ClientResources.reactViewTitle);
    }

    public render() {
        return (
            <Fabric>
                <TextBox />
                <TextLabel />
            </Fabric>
        );
    }
}
```
> Finally, we have our blade component. It is registered with the root decorator from the `ReactView` module, which takes 4 generic arguemnts; component properties (which this one does not have), the component's state (which this does not have either), a redux store interface and an interface containing all possible redux actions - again, in more complicated cases we would interset multiple action types, but here we can simply use `SetTextAction` directly.
>
> In addition to the `viewReady` property, we also need to pass in our redux store. The rest is pretty straightforward; we initialize the view's title in is constructor, and the render function returns a Fabric-rooted list of the components interacting with each other via the redux store.

<a name="reactviews-libraries-explained-redux-and-react-redux-common-pitfalls-complaints"></a>
#### Common pitfalls / complaints

Reducing boilerplate

- One of the most common complaints about redux is the amount of boilerplate
- [redux-toolkit](https://redux.js.org/redux-toolkit/overview) has a few utilities to reduce boilerplate for actions, reducer and selector creation
- [redux docs](https://redux.js.org/recipes/reducing-boilerplate) has a good section on this

Not over-subscribing

- Over subscribing to the redux store is a common performance issue that can be hard to diagnose.
- Every redux connected component will re render when the state its selecting in `mapStateToProps` is updated
- A few ways to get around this are:
- Connected components should only select the state they need
- Find a balance between: lots of small connected components / connected parent container components that pass state as props to children
- Avoid unnecessary state updates

Don't put everything in global store

Violating immutability requirements

- All redux state updates need to be immutable. This means that a reducer should never directly modify state, and always return new state based on the current state
- Violating this usually manifests in weird bugs or react components not updating

Middleware with AsyncStore

Redux/React-Redux external documentation

- [redux](https://redux.js.org/introduction/core-concepts)
- [react-redux](https://react-redux.js.org/api/connect)

<a name="reactviews-libraries-explained-lodash"></a>
### Lodash

Lodash is a utility library that helps when working with arrays, objects, and strings in JavaScript. It's included with ReactViews to fill the gaps left by the removal of the Util functions with MsPortalFx.
Because it is included from the portal, the library's caching is shared across all extensions which generally reduces the performance overhead of having to load the library.

Lodash is commonly imported as an _, like so:

```typescript
import _ from "lodash";
```

You can then call various helpful functions, such as chunk:

```typescript
_.chunk(['a', 'b', 'c', 'd'], 3);
// => [['a', 'b', 'c'], ['d']]
```

You can see all the various functionality in the [Lodash documentation](Lodash Docs).

<a name="reactviews-libraries-explained-npm-modules"></a>
### NPM Modules

With ReactView's build system being based on Webpack, it enables your team to use almost any library you can find without having to modify the library. That being said, there's several considerations to take
before adding a library into your extension:

<a name="reactviews-libraries-explained-npm-modules-performance"></a>
#### Performance

Using many libraries will bloat the size of your code that customers need to download before they can run it. This can have a significant impact on your load times, make sure you use tree shakeable libraries where
possible over monolithic libraries. A good example is using a library like `luxon` over its predecessor `momentjs`. `Luxon` was built with tree shaking in mind, and helps keep the bundle sizes smaller. Additonally,
ensure your import statements are conducive to tree shaking:

```typescript
import * as everything from "someModule"; // Not tree shakeable (everything from someModule will be loaded)
import { specific } from "someModule"; // tree shakeable (only code pertaining to 'specific' will be loaded)
```

<a name="reactviews-libraries-explained-npm-modules-fluentui-libraries"></a>
#### FluentUI Libraries

All ReactViews from all extensions load fluentui libraries from the portal server, this enables much higher cache hit ratios and therefore much higher performance for customers. To leverage this, imports from `@fluentui/*`,
`office-ui-fabric-react/*`, and `@uifabric/*` need to use specific imports as stated above. Concretely, that means importing components should be done like this:

```typescript
import { TextField } from "@fluentui/react/lib/TextField";
```

and not like this:

```typescript
import { TextField } from "@fluentui/react"; // Don't import this way
```

This is easy to adhere to within your code, however if you bring in other libraries, they may not follow this guideline. Although the libraries should work, they will force you to download large chunks of libraries that would
otherwise be able to receive shared caching. In addition, they won't get free updates of minor versions of fluent for bug fixes, or hotfixes for security bugs. It is recommended to use libraries like this only if absolutely
necessary.

<a name="reactviews-libraries-explained-npm-modules-accessibility-security-support-and-reliability"></a>
#### Accessibility, Security, Support, and Reliability

These four factors are another important consideration before using a library. The portal has a high bar for accessibility that any UI library you use will have to meet, or you will have to enhance in order to meet. Additionally,
the portal supports browsers back to Internet Explorer 11, and any library used must support at least that far back. Finally, consider support and security of any library that you use. A dependency that seems easy to use now,
may never get updates to security bugs, or may have bugs that cause your ReactView to not load in certain scenarios.

<a name="reactviews-libraries-explained-npm-modules-custom-webpack-plugins"></a>
#### Custom Webpack Plugins

With ReactViews we offer complete freedom over the build system, including installing arbitrary webpack plugins. However, due to the nature of Webpack, we cannot support arbitrary webpack plugins. If you choose to go this route,
and something breaks it is likely our response will be to remove the plugin and find a different solution.

<a name="reactviews-additional-features"></a>
## Additional Features

<a name="reactviews-additional-features-react-dev-tools"></a>
### React Dev Tools

React dev tools via browser extension does not currently work with ReactViews, due to limitations around IFrames. Instead, we have included the dev tools built into each IFrame. To use them, ensure you have loaded the portal with
`clientoptimizations=bundle` or `clientoptimiziations=false`, click within the experience and use the shortcut `ctrl + alt + d`. The dev tools should show up, if you see yellow boxes, your focus was likely set outside of the ReactView.

More improvements are still being worked on in this space, including resize. If you have suggestions, please submit them on [User Voice](#user-voice).

> Note: React dev tools is currently not supported in IE.
<a name="reactviews-additional-features-localization"></a>
### Localization

Within ReactViews there's two parts to localization. For strings, localization is handled the same way as for traditional Knockout blades. Simply import your resource files after the .d.ts files have been generated, and at runtime
we will hand your code the correct version of the file depending on the locale the user has selected. For other localization, such as timezones and currency, we recommend installing a third party library to help localize. For time,
our recommended library is `luxon` and is what we use within the portal. For numbers, we recommend using the built in browser internationalization APIs.

<a name="reactviews-getting-support"></a>
## Getting Support

There are various methods to get support with ReactViews. Please use the channel most appropriate based on the context.

<a name="reactviews-getting-support-stack-overflow"></a>
### Stack overflow

Any issues or common questions please post to our [Stack overflow][React StackOverflow]. Using the tag `ibiza-react` to ensure the question
gets the right attention.

<a name="reactviews-getting-support-teams"></a>
### Teams

Feel free to engage the Azure Portal - React development community and ReactView development team on our [Teams channel][React Teams link].
If your posting issues or common questions please use Stack overflow first.

<a name="reactviews-getting-support-user-voice"></a>
### User voice

For any feature requests file the suggestion/request on our [User Voice][React UserVoice]. Mark the suggestion with either `ibiza-react`, if the
request is generic, or `ibiza-react-controls`, if the request is for specific components additions or features.

Feel free to cross-post the idea to the ReactView Teams channel to get more awareness.

<a name="reactviews-getting-support-filing-bugs"></a>
### Filing bugs

If you experience any functional or styling bugs while developing your ReactView experience which you believe is caused by the framework please initially post to
our Stack overflow (process documented above). If you're certain this is a framework bug and you have a shareable reproduction please file the bug directly using
[https://aka.ms/portalfx/reactbug][React Bug].

<a name="reactviews-contribution"></a>
## Contribution

If you discover a bug or feature gap in the existing offerings and you're willing to contribute to address the need, please follow the below process.

If the contribution is a generic component which is not Azure specific, you'll probably want to contribute it directly to FluentUI. In that case follow their process [FluentUI Contribution][Fluent UI Contribution].
Once you've done so, inform the [React Team - Contributions channel][React Teams link] and we'll work to pick up the latest changes.

If the contribution is Azure specific, you have two options depending on how many extensions will be adopting the contribution.

1. Small number of extensions
   1. Create and share an NPM package that is built using the `azureportal-reactview` tooling.
   2. For internal NPM publishing guidance see [internal NPM publishing][NPM internal publishing]
2. Large number of extensions
   1. Start a conversation on the [React Team - Contributions channel][React Teams link] outlining the contribution's requirements and needs.
   2. If the contribution is approved, create a PR against the `azureportal-reactview` package directly and work with the core team to integrate the change.
   3. If the contribution is declined, follow the process for the smaller number of extensions contribution.

[Fluent UI Contribution]: https://github.com/microsoft/fluentui/blob/master/packages/react/README.md#contribute-to-fluent-ui-react
[NPM internal publishing]: https://docs.opensource.microsoft.com/content/releasing/npm.html?q=node%20module

<a name="reactviews-internal-technical-details"></a>
## Internal Technical Details

ReactViews are built to enable teams to build experiences in React while maintaining the portal's high bar for consistency, performance, and accessibility. There are two main methods for achieving this:

<a name="reactviews-internal-technical-details-prewarming-the-iframes"></a>
### Prewarming the IFrames

Every ReactView is loaded in a sandboxed IFrame, this IFrame is fully owned and controlled by the portal. Further, the domain for all ReactViews is identical across a given environment. This enables the portal to use
a shared pool of frames that can be spun up before the user needs one (and before we know which extension or experience the user needs next). The frame is spun up, but kept hidden from the user. While it is spun up we
load in a variety of code that you will need, including: `React`, `redux`, `react-redux`, as well as a handful of the most common `@fluentui/react` controls. When the user wants to load an experience, we use the name
such as "Example.ReactView" and search within your extenion's require config to find the containing module's URL. We pass this into the frame, which downloads and then executes the module. Because of the heavy sandboxing,
we are able to prevent any other extension's experience from impacting yours.

<a name="reactviews-internal-technical-details-scaffolding"></a>
### Scaffolding

Because we own the frame, we are able to setup scaffolding for both theming and consistency. Additionally, since the code for the theme is actually shipped from the portal, we can issue updates to the theme without requiring
extensions to manually update the package to receive them. This ensures that the customer sees consistent theming across all ReactViews, and reduces the differences between a Knockout base experience and a React one.

<a name="reactviews-frequently-asked-questions-faq"></a>
## Frequently asked questions (FAQ)

<a name="reactviews-frequently-asked-questions-faq-do-i-still-need-to-follow-the-previous-ux-best-practices"></a>
### Do I still need to follow the previous UX best practices

Yes. ReactViews have only enabled a different authoring model, the Azure Portal's stance on UX best practices and patterns doesn't change with this.

<a name="reactviews-frequently-asked-questions-faq-can-i-include-knockout-controls-inside-of-a-reactview"></a>
### Can I include Knockout controls inside of a ReactView

No. ReactViews are a separate iframe with a different architecture model than Knockout.

<a name="reactviews-frequently-asked-questions-faq-can-i-include-a-reactview-inside-a-knockout-blade"></a>
### Can I include a ReactView inside a Knockout blade

No. ReactViews are a full screen experience and can not be hosted inside a Knockout blade.

<a name="reactviews-frequently-asked-questions-faq-my-call-is-failing-due-to-cors-errors"></a>
### My call is failing due to cors errors

Due to sandbox restrictions ReactViews don't expose the ability to customise the request headers.
Instead your service will need to respond with `allow *`

<a name="reactviews-frequently-asked-questions-faq-why-not-build-my-own-react-experience-in-a-frame"></a>
### Why not build my own React experience in a frame

Traditionally, teams that wanted to build with more modern tools in the Portal used FrameBlades or Az Extensions. However, both consistency and performance are very big problems in those worlds. Consistency as a problem is fairly straightforward: Portal controls aren't available, Portal styling can update and change without warning, themes can dynamically change, self owned accessibility story, and so on. Performance is a more complex problem, while React and Webpack and other modern tools can make your React app somewhat fast, it cannot compete with the traditional Template blades in terms of speed. This is because those frameworks must load and execute in the hot path, once loaded they are faster than Knockout but they've started the race from significantly further back. ReactViews solved this problem by having React and a handful of other libraries preloaded in an iFrame off screen, when a ReactView needs to be loaded the only cost in the hot path is downloading and executing your React components and dependencies. Further, since controls are shared between extensions the caching rate is substantially higher than they would be in non-shared frames.

<a name="reactviews-known-gaps"></a>
## Known Gaps

<a name="reactviews-known-gaps-root-components-are-required-to-be-class-components"></a>
### Root components are required to be class components

Unfortunately a class component is required in order to make use of the decorators today.
In the future we may be able to provide an alternative path.

<a name="reactviews-known-gaps-charting-component"></a>
### Charting component

Currently there is no base charting component offered by the Azure Portal Framework or FluentUI.
We're actively working to provide that component, if you have a need for charting in the short term
please use a third party library such as D3.

<a name="reactviews-known-gaps-form-authoring"></a>
### Form authoring

Authoring forms in FluentUi is a little more hands on than with Knockout.
The main difference is unlike the Knockout offering there is no container like component in order to easily check for validility.

<a name="reactviews-known-gaps-parts"></a>
### Parts

ReactViews currently only support authoring blade-like experiences. There is no part development support currently.

[React UserVoice]: https://aka.ms/portalfx/request/react
[React Bug]: https://aka.ms/portalfx/reactbug
[React Teams link]: https://aka.ms/portalfx/reactteam
[React StackOverflow]: https://aka.ms/portalfx/ask/react

> # IMPORTANT: The React Views are not ready for production use yet and are currently offered for internal previews by early adopters.
> - [Join the 'Azure Portal React Views Early Adopters' DL](https://idwebelements/GroupManagement.aspx?Group=ibizareactblades&Operation=join) for updates
> - Use [`ibiza-react` tag on Microsoft StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/20863) for questions
---
<a name="react-views"></a>
# React Views

  - [What it is](#what-it-is)
  - [How it works](#how-it-works)
    - [Runtime](#runtime)
    - [Build-time](#build-time)
    - [Performance](#performance)
      - [Why it's performant](#why-it's-performant)
      - [How performance is measured](#how-performance-is-measured)
  - [Getting started](#getting-started)
    - [Step 1: tsconfig.json](#step-1-tsconfigjson)
    - [Step 2: Sample View](#step-2-sample-view)
    - [Step 3: Building](#step-3-building)
  - [Beyond getting started](#beyond-getting-started)
    - [Redux](#redux)
    - [Migration and integration with legacy Portal code](#migration-and-integration-with-legacy-portal-code)
    - [Dependencies](#dependencies)
      - [Open source](#open-source)
      - [Portal-specific](#portal-specific)
      - [Adding your own](#adding-your-own)
        - [Samples](#samples)
    - [Styling](#styling)
      - [View padding](#view-padding)
    - [Debugging](#debugging)
      - [Hot reloading](#hot-reloading)
  - [Known limitations](#known-limitations)
    - [Storage](#storage)
    - [Service Workers](#service-workers)
    - [Blade inputs / outputs](#blade-inputs--outputs)
    - [Hot reloading limitations](#hot-reloading-limitations)
  - [Troubleshooting](#troubleshooting)

<a name="react-views-what-it-is"></a>
## What it is

Once released **React Views** will become the new standard to build experiences in the Azure Portal.

It combines the freedom of running React code in a visible iframe with the performance offered by the Portal framework; it makes Portal development as close to normal web development as possible without the cost and drawbacks of building and hosting a fully-custom solution.

<a name="react-views-how-it-works"></a>
## How it works

<a name="react-views-how-it-works-runtime"></a>
### Runtime

During Portal startup, an iframe is injected with a Portal-defined home page containing React open source libraries and all the information needed to consume [Fluent UI (formerly known as Office UI Fabric) components](https://developer.microsoft.com/fluentui#/controls/web) and framework-provided utilities.

Upon navigating to a React View, the corresponding extension's `requireConfig` (JSON blob containing script locations) is fetched and injected in the prewarmed iframe. The requested view's code is then downloaded and executed in the iframe.

Once your view is loaded, a new iframe is injected in preparation for the next React View navigation.

<a name="react-views-how-it-works-build-time"></a>
### Build-time

The React Views build works by setting up a second TypeScript build in your project.

Once you have created the new tsconfig.json according to documentation and have a copy of the latest SDK's ReactView.d.ts, views are written by creating `*.ReactView.tsx` files containing a ReactView decorator on a React component.

You can import framework controls, Fluent UI controls or your own AMD modules from that view file; the Portal will bundle all AMD JavaScript files it finds and build the requireConfig that will be fetched and injected in your iframe at runtime.

<a name="react-views-how-it-works-performance"></a>
### Performance

<a name="react-views-how-it-works-performance-why-it-s-performant"></a>
#### Why it&#39;s performant

Two main reasons make React Views more performant than generic iframe solutions;

* The Portal controls the iframe's homepage and the core OSS libraries, which allows the injection of generic iframes that can be used for any React View and ensures reusability of libraries that only have to be downloaded and parsed once but can be used in all React experiences.
  
* Writing your React component(s) as AMD modules, your experience will use the optimized Portal bundling algorithm, module loader and hosting solution.

<a name="react-views-how-it-works-performance-how-performance-is-measured"></a>
#### How performance is measured

Performance measurements are integrated with React's render logic; you'll provide a function to be evaluated after every render of your view's main component, and that function returning true will determine when your experience is considered ready.

In addition to that measurement showing up as a native marker in a performance profile, please note that that React and Fluent UI component performance markers have been preserved and will also show up in profiles. Moreover, React Views are fully compatible with [official React dev tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi). For more information about debugging and optimizing the performance of your experience, please refer to the [official Portal performance documentation](https://github.com/Azure/portaldocs/blob/master/portal-sdk/generated/top-extensions-performance.md).

<a name="react-views-getting-started"></a>
## Getting started

This section contains instructions on how to set up React Views in an existing extension.

**If you're creating a brand new extension**, please follow the instructions to create a new extension from a [template extension](https://github.com/Azure/portaldocs/blob/master/portal-sdk/generated/top-extensions-getting-started.md).
Once you've done so, you'll have the file structure that we're trying to build in this section and can skip to the [Beyond getting started](#beyond-getting-started) section. 

<a name="react-views-getting-started-step-1-tsconfig-json"></a>
### Step 1: tsconfig.json

The first step to onboard React Views is to create the TypeScript build that will compile your React Views as part of your full Extension build.

In your extensions repo, create a new folder under the same location your current TypeScript code resides - for example, our current TypeScript code living in `/src/TypeScript/`, we'll create `/src/TypeScript/ReactViews/`.

Create a new file called `tsconfig.json` - for this example we'll create
```
/src/TypeScript/ReactViews/tsconfig.json.
```
And add it to our extension's `csproj` file as follows;
```xml
<Content Include="TypeScript\ReactViews\tsconfig.json" />
```
Then copy the following JSON to the `tsconfig.json` file:
```json
{
  "compileOnSave": true,
  "compilerOptions": {
    "baseUrl": ".",
    "composite": true,
    "declaration": true,
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "forceConsistentCasingInFileNames": true,
    "inlineSources": true,
    "jsx": "react",
    "module": "amd",
    "noEmitHelpers": true,
    "noImplicitAny": true,
    "noImplicitThis": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "paths": {
      "*": [
        "*"
      ]
    },
    "outDir": "../<path_to_extension_outdir>/Output/Content/Scripts",
    "rootDir": ".",
    "removeComments": false,
    "sourceMap": true,
    "target": "es5",
    "lib": [
      "dom",
      "es2015.promise",
      "es2015.iterable",
      "es5",
      "scripthost"
    ]
  },
  "include": [
    "../<path_to_SDK_definitions>/ReactView.d.ts",
    "**/*"
  ]
}
```

Notes about the above content:
* Uses `"react"` jsx
* Compiles your TypeScript to AMD modules
* Sets a few best practices compiler flags
* Targets ES5 for Internet Explorer 11 compatibility
* Includes:
    - `**/*.*` to compile everything under this directory
    - `ReactView.d.ts`, the single .d.ts file containing all typings for framework-provided libraries (React, Fluent UI, Portal-specific controls, etc.)

**You then need to change two properties:**
* `outDir`: Make this the same outDir as your full extension build, which will usually mean copying what's in your outer build's `tsconfig.json` ([SamplesExtension example](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FSamplesExtension%2FExtension%2Ftsconfig.json)) plus traversing up a few more directories ([SamplesExtension React example](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FSamplesExtension%2FExtension%2FClient%2FReact%2FViews%2Ftsconfig.json))
* `include`: Make sure you point to the copy of `ReactView.d.ts` where you put the Portal's latest SDK definition files

Note that depending on how your build consumes Portal SDK definition files, you may have to go through some extra steps to copy `ReactView.d.ts`.
Copying can be done in a few different ways: an `xcopy` command in your repo init script, an msbuild copy task, or just manually copying them over and committing them into the repository.
The `ReactView.d.ts` file is located in the `ReactView` folder, one directory higher than the other `.d.ts` files (`ReactView` directory as a sibling of the `Definitions` folder).
- If referencing is done with a `TypeReferences` file (or some other way that specifies each `.d.ts` file individually from another folder than the typescript folder), then the `ReactView.d.ts` file can be copied into the same folder as the other `.d.ts` files.
- If referencing is done with an includes directive, that uses `*.d.ts`, then you need to copy the `ReactView.d.ts` file to a different folder within your repo.
- If you commit the files directly into your TypeScript folder, then you need to copy the `ReactView.d.ts` file directly into the view folder you created above.

Additionally, if you are adding React Views to an existing extension, you'll want to add your `ReactViews` folder to the `exclude` list of your existing `tsconfig.json`;
```json
{
  /*...*/
  "exclude": [
    "ReactViews/**/*"
  ]
}
```

<a name="react-views-getting-started-step-2-sample-view"></a>
### Step 2: Sample View

Now we are ready to create our first React View.

In a subdirectory of where your tsconfig.json file is, create a new file following the pattern `*.ReactView.tsx` - for this example we'll create
```
/src/TypeScript/ReactViews/Sample.ReactView.tsx
```
Copy the following TypeScript code in your sample view file;

```tsx
import * as Az from "Az";
import * as React from "react";
import * as ClientResources from "ClientResources";
import * as ReactView from "ReactView/ReactView";
import { Fabric } from "OfficeFabric/Fabric";

interface ComponentState {
    sessionId: string;
}

/**
 * This blade is the simplest possible react blade, and represents a possible initial
 * starting point for a blade that just wants to display static content to the user.
 */
@ReactView.ReduxFree.Decorator<{}, ComponentState>({
    viewReady: (state) => !!state.sessionId,
})
export class StaticContent extends React.Component<{}, ComponentState> {
    public constructor(props: {}) {
        super(props);
        Az.setTitle(ClientResources.reactViewTitle);
        this.state = { sessionId: "" };

        Az.getSessionId().then(sessionId => this.setState({ sessionId }));
    }

    public render() {
        return <Fabric>{this.state.sessionId}</Fabric>;
    }
}
```

Here's a breakdown of what every line does.

```typescript
import * as Az from "Az";
```
For those familiar with legacy Portal code, this `"Az"` module is the equivalent of `container` APIs.

`Az` is a framework library used to interact with the Portal; if you want to open a different blade, set your view's title, put your view in error state, etc., you do so by importing the `Az` library and calling the relevant `Az.*` method.

```typescript
import * as React from "react";
```
This is the framework-provided React library, provided and imported as an AMD module. It contains classes like React.Component, the class we will be extending for our view component.
Note that the Portal uses stock React with the addition of decorators, so you can refer to the official [react documentation](https://reactjs.org/docs/getting-started.html).

```typescript
import * as ReactView from "ReactView/ReactView";
```
This will import the ReactView module containing decorators used to register your blade at build-time and render it at runtime. Experienced React developers will notice we don't import the react-dom library; this is because the framework calls `ReactDom.render` for you internally when you decorate your class with any of the view decorators found in this module.

```typescript
import * as ClientResources from "ClientResources";
```
This imports resources built from your `*.resx` files; for this sample we simply used an existing resx file called `ClientResources.resx`. If you are unfamiliar with the process of creating resources for the Portal, please refer to the [official documentation on this topic](https://github.com/Azure/portaldocs/blob/master/README.md#localization-and-globalization) or feel free to skip this step and, **for the purpose of running this sample only**, use a hardcoded string in the `Az.setTitle` call below.

```typescript
import { Fabric } from "OfficeFabric/Fabric";
```
This imports the root Fabric component from the Fluent UI library. React Views should always use a `<Fabric>` node at the root of their template for consistency reasons since it will provide theming and boilerplate CSS for your experience.

More controls can be found under the `"OfficeFabric/"` namespace; React Views support all controls found on the official [Fluent UI documentation](https://developer.microsoft.com/fluentui#/controls/web) and these can be discovered simply by autocompletion (all typings are defined in `ReactView.d.ts`) or in the aforementioned docs.

```typescript
interface ComponentState {
    sessionId: string;
}
```
As is standard in React, we define the interface of our React component's state. Here we will only be using a single state property, a string we will use to store the Portal's session ID that we will be fetching asynchronously.

```typescript
/**
 * This blade is the simplest possible react blade, and represents a possible initial
 * starting point for a blade that just wants to display static content to the user.
 */
@ReactView.ReduxFree.Decorator<{}, ComponentState>({
    viewReady: (state) => !!state.sessionId,
})
export class StaticContent extends React.Component<{}, ComponentState> {
```
This is our blade component. Defined as extending `React.Component`, it has to be a class component because it needs to be decorated, and TypeScript doesn't support decorating functions yet - experienced devs who would rather use Functional Components can still do so by using a one-line class component rendering their Functional Component.

The decorator used here is `ReactView.ReduxFree.Decorator`. It takes two generic arguments - one for your component's properties, one for your component's state. Here, we used `{}` for properties since we have none and we used the `ComponentState` interface from earlier as the component's state.

The recommended approach when building a view is to use the root decorator, `ReactView.Decorator`; it takes a few extra parameters that will be explained in its own section and makes use of a Redux store and the `react-redux` library, a popular state management library that will help you write more complicated, multi-component blades.

All React View decorators require the `viewReady` property as an input. This property is a function that takes your component's state as an input and outputs a boolean asserting if your blade is ready. We run this function after each execution of your component's `render` function to determine if your blade is ready to be shown to the user or if a subsequent render is still needed before we remove the loading indicator overlay. In our sample case, we asynchronously fetch the session ID before displaying it, so `viewReady` returns false until `state.sessionId` is defined.

```typescript
public constructor(props: {}) {
    super(props);
    Az.setTitle(ClientResources.reactViewTitle);
    this.state = { sessionId: "" };

    Az.getSessionId().then(sessionId => this.setState({ sessionId }));
}
```
Our React component constructor. After the TypeScript-mandated super call, we use `Az.setTitle` to set the blade's title, which is defined in `ClientResources.reactViewTitle` (for the purpose of this sample, a `"ReactViewTitle"` key has been added to our `ClientResources.resx` file with value `"Static Content"`).

The next line initializes the React component's state to its default value, a property with a single property initialized to an empty string. Note that when run against this default state, our decorator's `viewReady` function will evaluate to false.

The last line in our constructor fetches data we want to display, in this case through the asynchronous `Az.getSessionId()` API. Once we have it, we will call React's `component.setState` function to update our state.

```tsx
public render() {
    return <Fabric>{this.state.sessionId}</Fabric>;
}
```
Our React component `render` function. We return a `<Fabric>` root node for consistency and theming as explained above, and then we simply make it's content the session ID we stored in the component's state. This render function will, by React's design, run on component instantiation and on every property or state change, and after every iteration we will run the `viewReady` function to determine when to remove the loading indicator overlay from the blade.

<a name="react-views-getting-started-step-3-building"></a>
### Step 3: Building

Once the above two files have been created, we can build our extension and the `requireConfig` needed to load our view will be compiled by the Portal's bundling algorithm. If you have any issues with the build at this point, please refer to the troubleshooting section.

Assuming you went through the build [instructions to sideload your extension](https://github.com/Azure/portaldocs/blob/master/portal-sdk/generated/top-extensions-getting-started.md), you can now navigate to your new React View in the Portal. Once the loading indicator is gone, your view's title should show up along with a session ID hash in the view's content.

<a name="react-views-beyond-getting-started"></a>
## Beyond getting started

<a name="react-views-beyond-getting-started-redux"></a>
### Redux

Using redux is the framework-recommended way to write any non-trivial React component.

Redux is an open source library used to simplify state handling at a multi-component level; you can think of it as an efficient global React state that multiple components can take dependencies on.

Portal uses normal redux with the addition of decorators, so you can refer to the [official redux documentation](https://redux.js.org).

To explain how using redux and using react-redux works, we'll go through the following sample code with emphasis on content that differs from the first sample.
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
We import the `createStore` function from the `"redux"` module to create the redux store that will be used in multiple components.

```typescript
import { Text } from "OfficeFabric/Text";
import { TextField } from "OfficeFabric/TextField";
```
Those two import statements are importing two Fluent UI controls, the Text control (simply displays text) and the TextField control (an editable textbox).

```typescript
import { Decorator, ReactReduxConnect } from "ReactView/ReactView";
```
Here we import the root `Decorator` and the `ReactReduxConnect` decorators from the `"ReactView"` module. The root decorator, unlike the `ReduxFree` decorator, uses redux and react-redux while the `ReactReduxConnect` decorator is used to replicate redux `connect` functionality when handling multiple components using the same store.

```typescript
interface StoreState {
    text: string;
}
```
The interface representing the data in our redux store; here all we want to share between components is the TextField's text content, so that's the only property we define here.

```tsx
@ReactReduxConnect.Decorator<StoreState>(state => { return { text: state.text }; })
class TextLabel extends React.Component<{ text?: string }, {}> {
    public render() {
        return <Text>{this.props.text}</Text>;
    }
}
```
Here we define a label component, which is simply going to be an Fluent UI `Text` control with our store's text property for content.

The `ReactReduxConnect` decorator uses our Store interface as a generic argument, and the fist parameter, named `mapStateToProps`, is a function taking in the redux state and outputting and object with the subset of properties that this component cares about; here, that's the `"text"` property. Note that the component's properties interface is the same as what was returned by the function passed in as the first argument of the decorator; in reality the decorator has multiple optinal arguments and they all participate in shaping properties and states for the decorated component, please refer to the full typings and official [react-redux connect documentation](https://react-redux.js.org/api/connect) for more details.

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
Here we have a combination of a redux action interface and a redux action creator; this is standard redux code and you can find more information about it offical [redux action documentation](https://redux.js.org/basics/actions/) but in short redux store mutations are done via actions which are composed of a type and new values(s) keyed under the same name(s) as the store properties.

```tsx
@ReactReduxConnect.Decorator<StoreState>(null, { setText })
class TextBox extends React.Component<{ setText?: typeof setText }, {}> {
    public render() {
        return <TextField onChange={(_, val) => this.props.setText(val)} />;
    }
}
```
Here we have our second component, the `TextField` which will set the text value used in our other component. The decorator uses two arguments, the first one (`mapStateToProps`) being null since this component does not need to read anything from the redux store and the second one (`mapDispatchToProps`) being an object with all actions creators this component will use, which in this case is the `setText` action. Note how the component's properties, because of the use of the `ReactReduxConnect` decorator, map to `mapDispatchToProps`.

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
This is where we instantiate our redux store; see official [redux createStore documentation](https://redux.js.org/api/createstore/). The function passed in is our reducer. The first argument of the reducer is the store's state, which is initialized with a default value in declaration. The second argument is an action, which will have been created by one of our action creators - in more complicated cases we would intersect multiple action types, but here we can simply use `SetTextAction` directly. The body of that function is where we will branch on the action type and then generate a new state based on which action was used. In this case, the switch case only has two routes; the `"SetText"` action type, where we generate a new state with the same properties for everything and a new `text` property value, and `default`, where we just return the default (or passed in) state value.

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
Finally, we have our blade component. It is registered with the root decorator from the `ReactView` module, which takes 4 generic arguemnts; component properties (which this one does not have), the component's state (which this does not have either), a redux store interface and an interface containing all possible redux actions - again, in more complicated cases we would interset multiple action types, but here we can simply use `SetTextAction` directly. In addition to the `viewReady` property, we also need to pass in our redux store. The rest is pretty straightforward; we initialize the view's title in is constructor, and the render function returns a Fabric-rooted list of the components interacting with each other via the redux store.


<a name="react-views-beyond-getting-started-migration-and-integration-with-legacy-portal-code"></a>
### Migration and integration with legacy Portal code

We understand that most developers coming here will have existing extensions, with some having significant amounts of existing code that would be hard to port to React Views.

To ease migration of such complex experiences backed by code that relies heavily on `MsPortalFx` framework functionality, React Views provide a way to run code in your extension's web worker, along will all non-React-View code, that can communicate with your React View. Such code is called React Models. A React Model is an AMD module that will be dynamically required in your web worker's context at the same time as your React View code is injected in the iframe. The way to communicate between the two is via a redux store called the `asyncStore`. An async store is a redux store created in your iframe for which changed are proxied to a copy living in your React model's code and vice versa.

Refer to the (Migrated.ReactView)[https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FSamplesExtension%2FExtension%2FClient%2FReact%2FViews%2FMigrated.ReactView.tsx&version=GBdev] and (Migrated.ReactModel)[https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FSamplesExtension%2FExtension%2FClient%2FReact%2FModels%2FMigrated.ReactModel.ts&version=GBdev] samples for the following explanations.

You'll notice how there is no functional difference between React Views component code whether it uses a model or not. The only difference is that for correctness reasons, store types are split out in a `Common.d.ts` interface file which is built both by the React TypeScript build (from the tsconfig.json file created in a previous section) and the outer Extension build; that's because the React Model file will be built by the outer build.

Here are more details on the model's implementation.

```typescript
export = class MigratedModel extends MsPortalFx.Models.React<TagsState, TagsAction> {
```
A React model's export has to be a class extending `MsPortalFx.Models.React`. The generic parameters are the shared store's interface and an interface for all the store actions.

```typescript
constructor(options: MsPortalFx.Models.Options<TagsState, TagsAction>) {
    super(options);
```
The constuctor has a single argument with two properties;
* `options.lifetime`, which is a lifetime object to which you can hook all disposables in your code (the lifetime itself will be disposed on blade disposal)
* `options.asyncStore`, a promise that will be resolved with your proxied redux store

```typescript
options.asyncStore.then((store) => {
    // Update tags when subscriptions change
    let previousSubscriptions: string[] = null;
    const updateTags = function () {
        const currentState = store.getState();
        const currentSubscriptions = currentState.subscriptionIds;
        if (previousSubscriptions !== currentSubscriptions || currentState.forceRefresh) {
            previousSubscriptions = currentSubscriptions;
            store.dispatch(setTags([ClientResources.newYork, ClientResources.maryland, ClientResources.washington].map(value => ({
                name: ClientResources.comingSoonAction,
                value,
            }))));
        }
    };
    updateTags();
    store.subscribe(updateTags);

    // Send over tagsHelpUri
    store.dispatch(setHelpUri());
});
```
Here we get the redux store by waiting on options.asyncStore.

Then we fall into fully stock redux patterns (see official [redux subscribe documentation](https://redux.js.org/api/store/#subscribelistener)), since the React model does not use react-redux as it runs outside of the iframe. The code above subscribes to store changes, inspects the state of the store and will trigger actions based on the aformentioned state. Changes to the store are then commited through store.dispatch, to which we pass the result of an action creator.

As mentioned above, changes to the store are two-way proxied between web worker and iframe contexts; this is how you can run `MsPortalFx` code model-side and commit the result of such code back to the store, which the view will then be able to use.


<a name="react-views-beyond-getting-started-dependencies"></a>
### Dependencies

A growing collection of framework components and utilities can be found at root level or under the `"ReactView/"` module namespace. At release, list is as follows:

<a name="react-views-beyond-getting-started-dependencies-open-source"></a>
#### Open source

* `"react"`
Stock react library. [See official documentation](https://reactjs.org/docs/getting-started.html).
* `"redux"`
Stock redux library. [See official documentation](https://redux.js.org/).
* `"react-redux"`
Stock react-redux library. [See official documentation](https://react-redux.js.org/).
* `"OfficeFabric/"`
Fluent UI (formerly known as Office UI Fabric) controls are found under this namespace.  [See official documentation](https://developer.microsoft.com/fluentui#/controls/web).
* `"lodash"`
Stock lodash library. [See official documentation](https://lodash.com/docs/). **Please note this library is fairly heavy**, so for performance reasons it should not be used if it's only imported for one or two functions; please note that tree shaking is impossible to apply here for your bundles since for performance reasons, a download of lodash should be a cache hit, and said download can only be a cache hit if everyone downloads the exact same script when they require lodash.

<a name="react-views-beyond-getting-started-dependencies-portal-specific"></a>
#### Portal-specific

* `"Az"`
Az library, meant to provide all APIs needed to communicate with the Portal's Shell (otherwise known as container APIs in traditional blades) like setting a view's title, opening a blade, showing notifications, getting session information, etc. [See documentation](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FAzFramework%2FTypeScript%2FAz.Typings.d.ts&version=GBdev&_a=contents).
* `"ReactView/ReactView"`
Root module for React Views containing all decorators used to register blades or connect components. [See sample usage](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FSamplesExtension%2FExtension%2FClient%2FReact%2FViews%2FMigrated.ReactView.tsx&version=GBdev&_a=contents).
* `"ReactView/Essentials"`
React version of the Essentials control. [See sample usage](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FSamplesExtension%2FExtension%2FClient%2FReact%2FViews%2FEssentials.ReactView.tsx&version=GBdev&_a=contents).
* `"ReactView/CommandBar"`
React version of traditional blades' command bar. [See sample usage](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FHubsExtension%2FExtension%2FTypeScript%2FHubsExtension%2FReact%2FViews%2FResourcesWithTag.ReactView.tsx&version=GBdev&_a=contents).
* `"ReactView/BladeLink"`
React component allowing you to generate an `<a>` tag with an href pointing to a specified blade. [See sample usage](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FSamplesExtension%2FExtension%2FClient%2FReact%2FViews%2FReceivesReturnedData.ReactView.tsx&version=GBdev&_a=contents).
* `"ReactView/StatusBar"`
React version of traditional blades' status bar. [See sample usage](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FHubsExtension%2FExtension%2FTypeScript%2FHubsExtension%2FReact%2FViews%2FRStatusBar.ReactView.tsx&version=GBdev&_a=contents).
* `"ReactView/Dialog"`
React version of blade dialogs. [See sample usage](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FSamplesExtension%2FExtension%2FClient%2FReact%2FViews%2FAzSamples.ReactView.tsx&version=GBdev&_a=contents).
* `"ReactView/FrameworkIcon"`
React component allowing you to display Portal framework icons. [See sample usage](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FHubsExtension%2FExtension%2FTypeScript%2FHubsExtension%2FReact%2FViews%2FResourcesWithTag.ReactView.tsx&version=GBdev&_a=contents).
* `"ReactView/LocationDropdown"`
React version of the LocationDropDown control. [See sample usage](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FSamplesExtension%2FExtension%2FClient%2FReact%2FViews%2FMigrated.ReactView.tsx&version=GBdev&_a=contents).
* `"ReactView/ResourceGroupDropdown"`
React version of the ResourceGroupDropdown control. [See sample usage](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FSamplesExtension%2FExtension%2FClient%2FReact%2FViews%2FMigrated.ReactView.tsx&version=GBdev&_a=contents).
* `"ReactView/SubscriptionDropdown"`
React version of the SubscriptionDropdown control (single-select, pick an Azure subscription). [See sample usage](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FHubsExtension%2FExtension%2FTypeScript%2FHubsExtension%2FReact%2FViews%2FResourcesWithTag.ReactView.tsx&version=GBdev&_a=contents).
* `"ReactView/SubscriptionFilter"`
React version of the ResourceFilter control's Subscriptions component (multi-select, impacts which subscriptions are used throughout the Portal). [See sample usage](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FSamplesExtension%2FExtension%2FClient%2FReact%2FViews%2FMigrated.ReactView.tsx&version=GBdev&_a=contents).

* `"ReactView/Resources"`
Provides two methods, `getContentUri` and `getAbsoluteUri` which mirror `MsPortalFx.getContentUri` and `MsPortalFx.getAbsoluteUri` respectively.
* `"ReactView/Ajax"`
Network helper module. **Please note that for standard network requests, you can use the browser's [fetch](https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch) API**; this module provides the "getEndpoints", "batch" and "batchMultiple" methods used to talk to ARM (Azure Resource Manager), mirroring "Fx/Batch" functionality.
* `"ReactView/Styling"`
Module used for CSS-in-JS component styling. Provides one method, `getClassNames`, which takes a list of classes with associated CSS properties and returns an object with generated class names to be used in the `className` attributes of your React components. [See sample usage](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FSamplesExtension%2FExtension%2FClient%2FReact%2FViews%2FStyling.ReactView.tsx&version=GBdev&_a=contents).
* `"ReactView/Provisioning"`
Provisioning is now done through this module. The API has been built to mirror functionality that used to be provided by `this.context.provisioning` in template blades after using the `TemplateBlade.DoesProvisioning` decorator. Note that the `ReactView.DoesProvisioning` decorator still has to be present on a blade component in addition to the use of the new module. [See sample usage](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FSamplesExtension%2FExtension%2FClient%2FReact%2FViews%2FCreateCustomRobot.ReactView.tsx&version=GBdev&_a=contents).

<a name="react-views-beyond-getting-started-dependencies-adding-your-own"></a>
#### Adding your own

React Views support any JavaScript with the requirement that it is AMD; this is a strict requirement for performance reasons.

If a library ships an AMD version, then just having the files in repo (then copied to outdir) means the bundler will pick them up and you can import them via path-based module ID.

Please note that if the library expects ambient Node.js-style imports to work, they might not at runtime; the Portal uses path-based AMD module resolution, not Node.js module resolution.
Manually fixing this yourself may not be a trivial task since JavaScript will throw at runtime, not build time.

If the library does not ship an AMD version, then you will have to modify it yourself to enable this, either via a custom build step or modifying the files yourself in your repository.
There isn't a universal trick to turn arbitrary JavaScript into an asynchronous module, but in the end you need an importable module - one that's defined with the AMD syntax:
```javascript
define([ /* dependencies */ ], function() { /* definition */ }
```

For all those reasons, we encourage developers to use pre-bundled versions of OSS libraries they want to rely on; such libraries can commonly be found on free open source software repositories like https://cdnjs.com and will require no (if already AMD) or little (if already a module) modification to be consumed as AMD modules by the Portal.
The most common modification will be turning a UMD module into an AMD one; this can be done by replacing
```javascript
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['exports'], factory);
    } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
        // CommonJS
        factory(exports);
    } else {
        // Browser globals
        factory((root.commonJsStrict = {}));
    }
}(this, function (exports) {
    exports.action = function () {};
}));
```
with
```javascript
define(['exports'], function (exports) {
    exports.action = function () {};
});
```

<a name="react-views-beyond-getting-started-dependencies-adding-your-own-samples"></a>
##### Samples
| Library | React View | Code changes |
|---------|------------|--------------|
| Luxon.js | [Link](https://df.onecloud.azure-test.net/#blade/SamplesExtension/ReactViewsBlade/reactLuxon) | [Link](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx/pullrequest/2855250) |

<a name="react-views-beyond-getting-started-styling"></a>
### Styling

You can use your own CSS classes to customize View to your needs. The sample is located at `<dir>\Client\React\Views\Styling.ReactView.tsx`, with essential steps also included below:

1. Import the `getClassNames` facility:

 ```typescript

import { getClassNames } from "@microsoft/azureportal-reactview/Styling";

```

2. Define your classes with custom rules:

 ```typescript

const classNames = getClassNames({
one: {
    color: "red",
    border: "1px solid red",
},
two: {
    color: "purple",
    border: "1px solid purple",
},
three: {
    color: "green",
    border: "1px solid green",
},
});

```

3. Use the defined classes in your `render` method:

 ```typescript

public render() {
    return <>
        <Fabric>
            <Text className={classNames.one}>{ClientResources.reactStyled}</Text>
            <Text className={classNames.two}>{ClientResources.hello}</Text>
            <Text className={classNames.three}>{this.state.name}</Text>
        </Fabric>
    </>;
}

```

#### View padding

View has default padding pre-applied for consistency with other portal experiences. You can apply the `reactview-nodefaultpadding` class to not use the standard padding.

### Debugging
Debugging React Views with [official React Developer Tools](https://github.com/facebook/react/tree/master/packages/react-devtools#react-devtools) is supported only when portal is loaded with `&clientOptimizations=false` or `&clientOptimizations=bundle` flags.
Use the tools within your browsers:
 - [Chrome extension](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
 - [Edge add-on](https://microsoftedge.microsoft.com/addons/detail/gpphkfbcpidddadnkolkpfckpihlkkil)
 - [Firefox add-on](https://addons.mozilla.org/firefox/addon/react-devtools/)

You can also use [official Redux Developer Tools](https://github.com/reduxjs/redux-devtools) to power up your Redux development workflow with enhanced state debugging capabilities like time-travel action replay and more (the same `&clientOptimizations=false` or `&clientOptimizations=bundle` flags are needed)!

#### Hot reloading
To enable hot reloading make sure that:
1. you have ["compile on save" configured locally](https://github.com/Azure/portaldocs/blob/master/portal-sdk/generated/portalfx-extensions-faq-debugging.md#compile-on-save)
2. you have `&feature.reactreload=true` and `&clientOptimizations=false` flags added onto the URL that you're side loading against

Please, be aware of [Hot reloading limitations](#hot-reloading-limitations).

## Known limitations

### Storage

Since the framework controls the home page of React Views, every view shares the same origin, so some limitations have to apply to code they can run for security reasons. One of those limitations is browser storage; since every React View shares the same storage, malicious code could pollute storage for everyone, so access to built-in `localStorage` and `sessionStorage` has been blocked and replaced with identical APIs manipulating in-memory storage. This means code relying on such storage will work and won't throw, but any logic relying on data expected to persist past the view's lifetime will not behave as expected. As for `IndexedDB`, access to it has also been blocked and no in-memory replacement is currently available for it.

### Service Workers

Similarly to storage limitations, since the framework controls the home page of React Views, every view shares the same origin so Service Workers can't work securely in React Views and the API is blocked.

### Blade inputs / outputs

React Views handle blade inputs via prop typings; simply add a `parameters` member to your blade component's properties interface and blade-opening APIs will now have the appropriate parameter typings. A current limitation of this is that your `parameters` typings must be fully declared inline, meaning you can't just set that to be an interface or an imported type;
```typescript
// Won't work
interface BladeParameters {
    id: string;
}
interface Props {
    parameters: BladeParameters;
}

// Will work
interface Props {
    parameters: {
        id: string;
    }
}
```

The same applies to outputs, which are typed through a `closeView` member on your blade component's properties interface. `closeView` is a function used to close your blade, and as such the output parameter is the first argument of that function;
```typescript
// Won't work
interface BladeOutput {
    id: string;
}
interface Props {
    closeView: (parameter: BladeOutput) => void;
}

// Will work
interface Props {
    closeView: (parameter: { id: string }) => void;
}
```

<a name="react-views-beyond-getting-started-hot-reloading-limitations"></a>
### Hot reloading limitations
- Extension needs to be on Portal SDK of version 5.0.303.4271 or higher.

- At this point hot reloading is not working for incremental controls updates.

<a name="react-views-troubleshooting"></a>
## Troubleshooting

Please reach out to us about any issue you may face consuming React Views on the [internal stackoverflow](http://aka.ms/portalfx/ask/react).

Common issues will be indexed here as we are made aware of them.
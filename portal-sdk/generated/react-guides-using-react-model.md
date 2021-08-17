<a name="using-react-model"></a>
# Using React Model

This guide assumes you have familiarized yourself with the basics of ReactViews, Redux (if applicable), and onboarding an extension to use ReactViews.
If not, check out [Onboarding an existing extension](react-guides-onboarding-an-existing-extension.md).

Some recommended Redux reading before starting with ReactModels:
- [Using subscribe listener](https://redux.js.org/api/store#subscribelistener)
- [Using dispatch](https://redux.js.org/api/store#dispatchaction)

When onboarding an existing extension to ReactViews, you will often have old services and utilities that work well, but they will be unusable within your ReactViews, due to their separate compile step and `tsconfig.json`.
With ReactModel, we have a means of connecting ReactViews to other framework code.

<a name="using-react-model-reactmodel-considerations"></a>
## ReactModel Considerations

Please remember that the recommended path is to use pure ReactView for the best benefits.
Since ReactModels are exposed to your other extension code, it introduces the possibility of pulling in extraneous external dependencies into your ReactView.
For example, if you pull in some classes that reference other dependencies that you don't actually need for your ReactView, it will still pull _all_ the dependencies, and it could considerably impact your load times.

Additionally, ReactModel will require a significant amount of boilerplate for _each_ blade that needs one.

<a name="using-react-model-how-it-works"></a>
## How it Works

ReactModels interact with ReactViews via the Redux store - this means you will have to set up Redux for your ReactViews.
Your ReactModel will be compiled via the outer `tsconfig.json`, so they will need to be in a separate directory from your ReactViews.
The framework handles connecting your ReactView's Redux store to its associated React model via a simple contract, the file names must match.
- e.g. `Example.ReactView.tsx` -> `Example.ReactModel.ts`

Your ReactModel will have access to the same `store` object as your ReactView, providing your means for communicating between the two.
Your ReactView will follow the typical Redux action and reducer flow, while your ReactModel will follow a subscription pattern, listening for events and monitoring state.

<a name="using-react-model-getting-setup"></a>
## Getting Setup

This guide will assume you've followed a similar file structure as [Onboarding an existing extension](react-guides-onboarding-an-existing-extension.md).

Let's start with a very simple ReactView with Redux setup.
In your `React\Views` directory, create a new ReactView called `Example.ReactView.tsx`

```tsx
import * as React from "react";
import * as Redux from "redux";
import * as ReactView from "@microsoft/azureportal-reactview/ReactView";
import { versionId } from "@microsoft/azureportal-reactview/major-version/1";

interface StoreState {
    text: string;
}

const initialState: StoreState = { text: "Default" };

export const store = Redux.createStore((state: StoreState = initialState, action: Redux.AnyAction) => {
    switch (action.type) {
        case "SetText":
            return { ...state, text: action.text };
        case "ResetState":
            return { ...initialState };
        default:
            return state;
    }
});

interface ExampleProps {
  text: string;
}

@ReactView.Decorator<{}, {}, StoreState>({
    store,
    viewReady: (state) => !!state.text,
    versionId,
})
@ReactView.ReactReduxConnect.Decorator<StoreState>(state => ({ text: state.text }))
export class Example extends React.Component<ExampleProps, {}> {
    public render() {
        return (
          <div>
            <p>{this.props.text}</p>
          </div>
        );
    }
}
```

<a name="using-react-model-wiring-up-reactmodel"></a>
## Wiring up ReactModel

Adjacent to your `React\Views` directory, make a new directory `React\Models`, and create a file `Example.ReactModel.ts`.
From here, you have access to all your old extension code, as well as framework controls.

```ts
import * as Redux from "redux";

interface StoreState {
  text: string;
}

export = class ExampleModel extends MsPortalFx.Models.React<StoreState, Redux.AnyAction> {
  constructor(options: MsPortalFx.Models.Options<StoreState, Redux.AnyAction>) {
    super(options);

    options.asyncStore.then((store) => {
      console.log(store.getState());
    });
  }
}
```

<a name="using-react-model-updating-store-state-from-reactmodel"></a>
## Updating Store State from ReactModel

With access to the store object, you can directly dispatch updates to the store.

```ts
const setTextAction = {
  type: "SetText",
  text: "New text"
};
store.dispatch(setTextAction);
```

Typically, you will need to trigger some sort of external side effect from our ReactView, meaning you need a way to communicate that trigger to the ReactModel.
Using `store.subscribe()`, you can observe state properties to determine when to trigger a call.

```tsx
// React\Views\Example.ReactView.tsx
interface StoreState {
    text: string;
    fetchServiceText: boolean;
}

const initialState: StoreState = {
  text: "Default",
  fetchServiceText: false,
};

export const store = Redux.createStore((state: StoreState = initialState, action: Redux.AnyAction) => {
  switch (action.type) {
    case "SetText":
      return { ...state, text: action.text };
    case "ResetState":
      return { ...initialState };
    case "SetFetchServiceText":
      return { ...state, fetchServiceText: action.fetchServiceText };
    default:
      return state;
  }
});

const setFetchServiceText = (fetchServiceText: boolean) => ({
    type: "SetFetchServiceText",
    fetchServiceText,
});

interface ExampleProps {
  text: string;
  setFetchServiceText: typeof setFetchServiceText;
}

@ReactView.Decorator<{}, {}, StoreState>({
    store,
    viewReady: (state) => !!state.text,
    versionId,
})
@ReactView.ReactReduxConnect.Decorator<StoreState>(
  state => ({ text: state.text }),
  { setFetchServiceText },
})
export class Example extends React.Component<ExampleProps, {}> {
  componentDidMount() {
    this.props.setFetchServiceText(true);
  }

  public render() {
    return (
      <div>
        <p>{this.props.text}</p>
      </div>
    );
  }
}
```

In our ReactModel, we set a subscription to the Store which conditionally starts an asynchronous flow.
This subscription will fire _any time_ the state changes, so you may need a secondary check to prevent duplicate requests.
In the below example, we used a class property, but closure or other patterns are fine.

```ts
import * as Redux from "redux";

interface StoreState {
  text: string;
  fetchServiceText: boolean;
}

export = class ExampleModel extends MsPortalFx.Models.React<StoreState, Redux.AnyAction> {
  private _isFetching = false;

  constructor(options: MsPortalFx.Models.Options<StoreState, Redux.AnyAction>) {
    super(options);

    options.asyncStore.then((store) => {
      store.subscribe(() => {
        const shouldFetchText = store.getState().fetchServiceText;
        if (shouldFetchText && !this._isFetching) {
          this._isFetching = true;
          const setTextAction = {
            type: "SetText",
            text: "This is from our timeout, simulating a service response",
          };
          const setFetchServiceTextAction = {
            type: "SetFetchServiceText",
            fetchServiceText: false,
          }

          // Simulating an asynchronous result
          setTimeout(() => {
            store.dispatch(setTextAction);
            store.dispatch(setFetchServiceTextAction);
            this._isFetching = false;
          }, 1000);
        }
      });
    });
  }
}
```

You may notice that we've had to duplicate our `StoreState` interface, and the action types are duplicated strings.
To solve this duplicity issue, we use a paradigm called Contracts.
While we are not able to directly share code between the two separate `tsconfig.json` files, we can still share `*.d.ts` files as declaration files are not included as part of compilation.

<a name="using-react-model-making-react-contracts"></a>
## Making React Contracts

Sibling to the `React\Models` directory, make a new one called `React\Contracts` and add the file `React\Contracts\Example.Contract.d.ts`.

Here, extract the `StoreState` interface from the ReactModel and the ReactView and export it from the contract file.

```ts
export interface StoreState {
  text: string;
}
```

<a name="using-react-model-react-contract-recommendations"></a>
## React Contract Recommendations

In addition to the Redux store state, the contract file is an excellent spot to place your Redux actions.
Create an exported union type of each of your actions to get Intellisense support for (discriminating unions)[https://www.typescriptlang.org/docs/handbook/unions-and-intersections.html#discriminating-unions] in your reducer's switch statement.

```ts
// React\Contracts\Example.Contract.d.ts
import * as Redux from "redux";

export interface StoreState {
  text: string;
}

export interface SetTextAction extends Redux.AnyAction {
  type: "SetText";
  text: string;
}

export interface ResetAction extends Redux.AnyAction {
  type: "ResetState";
}

export type MyExtensionAction = SetTextAction | ResetAction;
```

Next, update your inner `tsconfig.json` to include this Redux in the path.

```json
{
  "compilerOptions": {
    // ... other options
    "paths": {
      // ... other paths
      "redux": [
        "node_modules/redux/"
      ],
    }
  }
}
```

```tsx
// React\Views\Example.ReactView.tsx
import * as React from "react";
import * as Redux from "redux";
import * as ReactView from "@microsoft/azureportal-reactview/ReactView";
import { versionId } from "@microsoft/azureportal-reactview/major-version/1";
import { StoreState, MyExtensionAction } from "../Contracts/Example.Contract";

const initialState: StoreState = { text: "Default" };

export const store = Redux.createStore((state: StoreState = initialState, action: MyExtensionAction) => {
    switch (action.type) {
        case "SetText":
            return { ...state, text: action.text };
        case "ResetState":
            return { ...initialState };
        default:
            return state;
    }
});

@ReactView.Decorator<{}, {}, StoreState>({
    store,
    viewReady: (state) => !!state.text,
    versionId,
})
@ReactView.ReactReduxConnect.Decorator<StoreState>(state => ({ text: state.text }))
export class Example extends React.Component<{}, {}> {
    public render() {
        return (
          <div>
            <p>{this.props.text}</p>
          </div>
        );
    }
}
```

<a name="using-react-model-other-caveats"></a>
## Other Caveats

<a name="using-react-model-other-caveats-react-contract-limitations"></a>
### React Contract Limitations

In some cases, some TS structures may cause dependency issues when added to your Contract files.
For instance, a fairly straightforward improvement would be to use an enum for the action types like so:

```ts
export enum ActionType {
  SetText = "SetText",
  ResetState = "ResetState",
}

export interface SetTextAction {
  type: ActionType.SetText;
  text: string;
}
```

Attempting to import this enum in your ReactView and rebuilding the project, you may find that you will hit `Module not found` errors.

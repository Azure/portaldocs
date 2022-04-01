<a name="root-functional-components"></a>
# Root functional components

* [Root functional components](#root-functional-components)
    * [What are they](#root-functional-components-what-are-they)
    * [How are they different](#root-functional-components-how-are-they-different)
        * [How to specify parameters](#root-functional-components-how-are-they-different-how-to-specify-parameters)
        * [How to set the ReturnsData contract](#root-functional-components-how-are-they-different-how-to-set-the-returnsdata-contract)
        * [How to signify viewReady](#root-functional-components-how-are-they-different-how-to-signify-viewready)
        * [Higher-order components and additional configuration](#root-functional-components-how-are-they-different-higher-order-components-and-additional-configuration)
            * [ForExport](#root-functional-components-how-are-they-different-higher-order-components-and-additional-configuration-forexport)
            * [ContextPaneWidth](#root-functional-components-how-are-they-different-higher-order-components-and-additional-configuration-contextpanewidth)
            * [DoesProvisioning](#root-functional-components-how-are-they-different-higher-order-components-and-additional-configuration-doesprovisioning)


_Available starting `SDK v9.64.1.5` and `@microsoft/azureportal-reactview v1.50.0`._

<a name="root-functional-components-what-are-they"></a>
## What are they
_Functional components_ are some of the more common components that will come across while working in React. These are simply JavaScript functions.
We can create a _functional component_ to React by writing a JavaScript function. These functions may or may not receive data as parameters.
In the _functional components_, the return value is the JSX (TSX) code to render to the DOM tree.
**ReactViews** now support _functional component_ views, which leads to seamless React development of the portal blades without the decorators' overhead.

<a name="root-functional-components-how-are-they-different"></a>
## How are they different
Previously, the react blades had to be class based components with decorators applied for configuration, now we don't impose such constraints.
All you have to do is to use `export default` at the end of the file to signal the compiler about a new blade.
Be mindful that **ReactViews** still have to be named as `*.ReactView.tsx` - this is the only way for us to capture the blades so far.

<a name="root-functional-components-how-are-they-different-how-to-specify-parameters"></a>
### How to specify parameters
Just define an interface for the component's props with the `parameters` key, and provide the parameters interface as its value. There are limitations to the supported parameters types: enums, generics and utility types aren't supported.
> **NOTE**: The compiler will try to inline all the encountered interface references inside the props.

**Before**
```tsx
interface ComponentProps {
    parameters: {
        text: string;
        optionalText?: string;
    };
}

@ReactView.ReduxFree.Decorator<ComponentProps, {}>()
export class AcceptsParameters extends React.Component<ComponentProps, {}> {
    public render() {
        return <span>{this.props.closeView}</span>;
    }
}
```

**Now**
```tsx
interface ComponentProps {
    parameters: {
        text: string;
        optionalText?: string;
    };
}

const AcceptsParameters: React.FunctionComponent<ComponentProps> = (props) => {
    return <span>{props.parameters.text}</span>;
}

export default AcceptsParameters;
```

<a name="root-functional-components-how-are-they-different-how-to-set-the-returnsdata-contract"></a>
### How to set the ReturnsData contract
Similarly to the parameters, you would have to add closeView prop, which should be a void callback function accepting the returned data.
As you can see there are not many differences between two approaches, besides the lack of need for decorators.

**Before**
```tsx
interface ComponentProps {
    closeView: (data: { text: string }) => void;
}

@ReactView.ReduxFree.Decorator<{}, {}>()
@ReactView.ReturnsData.Decorator()
export class ReturnsData extends React.Component<ComponentProps, {}> {
    public render() {
        return <ActionButton text={"Close"} onClick={() => props.closeView({ text: "Returned text" })} />;
    }
}
```

**Now**
```tsx
interface ComponentProps {
    closeView: (data: { text: string }) => void;
}

const ReturnsData: React.FunctionComponent<ComponentProps> = (props) => {
    return <ActionButton text={"Close"} onClick={() => props.closeView({ text: "Returned text" })} />;
};

export default ReturnsData;
```

<a name="root-functional-components-how-are-they-different-how-to-signify-viewready"></a>
### How to signify viewReady
Since we don't have to use decorators anymore, we replace a `viewReady` with `useInitialized` hook, available from `@microsoft/azureportal-reactview/ReactView`.
The hook is not a requirement and may be used when the content of a view needs to be revealed _only_ after some data is loaded.

**Before**
```tsx
interface ComponentState {
    ready: boolean;
}

@ReactView.ReduxFree.Decorator<{}, ComponentState>({
    // viewReady should be bound to the last async operation required to populate the blade
    viewReady: (state) => state.ready,
})
export class ViewReadySample extends React.Component<{}, ComponentState> {
    public constructor(props: {}) {
        super(props);

        this.state = { ready: false };
        Promise.all([ /* a bunch of async calls */ ]).then(() => {
            this.setState({ ready: true }); // updated state will mark the viewReady
        });
    }
```

**Now**
```tsx
import { useInitialized } from "@microsoft/azureportal-reactview/ReactView";

const ViewReadySample: React.FunctionComponent = () => {
    const ready = useInitialized("ViewReadySample"); // useInitialized hook accepts an ID string for the logging purposes

    // this hook will be called once on the initial render, find out more https://reactjs.org/docs/hooks-effect.html
    React.useEffect(() => {
        Promise.all([  /* a bunch of async calls */ ]).then(() => {
            ready(); // useInitialized returned a callback which we invoke here to signify that our view is ready
        });
    }, []);
};
```

<a name="root-functional-components-how-are-they-different-higher-order-components-and-additional-configuration"></a>
### Higher-order components and additional configuration
What about other decorators? How do we mark blades ForExport now?
Higher-order components are to rescue. All we need is to import them and wrap the view.
[Learn more about higher-order components](https://reactjs.org/docs/higher-order-components.html).

<a name="root-functional-components-how-are-they-different-higher-order-components-and-additional-configuration-forexport"></a>
#### ForExport
`ForExport` configuration is set by `WithForExport` component now. When we wrap our view with it, the view gets marked as _for export_ in a generated PDL.

**Before**
```tsx
@ReactView.ReduxFree.Decorator<{}, {}>({
    forExport: true,
})
export class ForExportView extends React.Component<{}, {}> {
    public render() {
        return <span>{"This view is for export"}</span>;
    }
}
```

**Now**
```tsx
import { withForExport } from "@microsoft/azureportal-reactview/ReactView";

const ForExportView: React.FunctionComponent = () => {
    return <span>{"This view is for export"}</span>;
};

export default withForExport(ForExportView);
```


<a name="root-functional-components-how-are-they-different-higher-order-components-and-additional-configuration-contextpanewidth"></a>
#### ContextPaneWidth
If we want to specify the size of a context pane, we can wrap the pane component with the `withContextWidth` higher-order component, providing the size as the second argument.

**Before**
```tsx
@ReactView.ReduxFree.Decorator<{}, {}>({
    contextPaneWidth: ReactView.ContextPaneWidth.Large,
})
export class ContextPaneWidthView extends React.Component<{}, {}> {
    public render() {
        return <span>{"This view sets the context pane width."}</span>;
    }
}

```

**Now**
```tsx
import { withContextPaneWidth, ContextPaneWidth } from "@microsoft/azureportal-reactview/ReactView";

const ContextPaneWidthView: React.FunctionComponent = () => {
    return <span>{"This view sets the context pane width."}</span>;
};

export default withContextPaneWidth(ContextPaneWidthView, ContextPaneWidth.Large);
```

<a name="root-functional-components-how-are-they-different-higher-order-components-and-additional-configuration-doesprovisioning"></a>
#### DoesProvisioning
To mark our React View as the one that does the provisioning we now utilize the `withProvisioning` wrapper.

**Before**
```tsx
import { doesProvisioning, Provisioning } from "@microsoft/azureportal-reactview/Provisioning";
@ReactView.ReduxFree.Decorator<{}, {}>()
@ReactView.DoesProvisioning.Decorator({ requiresMarketplaceId: false })
export class ProvisioningView extends React.Component<{}, {}> {
    private _provisioning: Promise<Provisioning<void>>;

    constructor(props: {}) {
        super(props);
        this._provisioning = doesProvisioning();
    }

    public render() {
        return <ActionButton text={"Deploy"} onClick={() => {
            this._provisioning.then(provisioning => {
                return provisioning.deployCustom({ provisioningPromise: /* some provisioning promise */ }).then(() => {
                    /* anything after deployment */
                });
            });
        }} />;
    }
}
```

**Now**
```tsx
import { doesProvisioning } from "@microsoft/azureportal-reactview/Provisioning";
import { withProvisioning } from "@microsoft/azureportal-reactview/ReactView"

const ProvisioningView: React.FunctionComponent = () => {
    const provisioning = doesProvisioning();

    return <ActionButton text={"Deploy"} onClick={() => {
        provisioning.then(provisioning => {
            return provisioning.deployCustom({ provisioningPromise: /* some provisioning promise */ }).then(() => {
                /* anything after deployment */
            });
        });
    }} />;
};

export default withProvisioning(ProvisioningView, false); // 'false' is setting up the requiresMarketplaceId parameter
```

> The resulting blade will be recognized as the one that does provisioning and we can see that when creating a reference.
```tsx
BladeReferences.forBlade("ProvisioningView.ReactView").createReference({
    doesProvisioning: true,
});
```

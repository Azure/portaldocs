<a name="creating-a-new-reactview-experience"></a>
# Creating a New ReactView Experience

* [Creating a New ReactView Experience](#creating-a-new-reactview-experience)
    * [Getting Setup](#creating-a-new-reactview-experience-getting-setup)
    * [Add Boilerplate](#creating-a-new-reactview-experience-add-boilerplate)
    * [Load the Data](#creating-a-new-reactview-experience-load-the-data)
    * [Render the Data](#creating-a-new-reactview-experience-render-the-data)
    * [Add Metadata](#creating-a-new-reactview-experience-add-metadata)
    * [Adding icons](#creating-a-new-reactview-experience-adding-icons)
    * [Improving the styling](#creating-a-new-reactview-experience-improving-the-styling)
    * [Filtering the cards](#creating-a-new-reactview-experience-filtering-the-cards)
    * [Putting it all together](#creating-a-new-reactview-experience-putting-it-all-together)
    * [Next Steps](#creating-a-new-reactview-experience-next-steps)



ReactViews are the recommended way to build all new experiences within the portal. This guide assumes you have already onboarded your extension
to ReactViews, and are looking to build your first experience. We will slightly cover React, but for thorough documentation, it
is recommended you visit their [official documentation](https://reactjs.org/). We will focus on the specific differences of writing React within the ReactView framework
versus writing React elsewhere.

Let's build a simple experience that queries ARM for a resource type across a set of subscriptions, and then displays the results to the user in
a grid. After we build the base experience, you can switch to one of the various guides that improves the blade further.

<a name="creating-a-new-reactview-experience-getting-setup"></a>
## Getting Setup

ReactView development is designed to enable fast inner dev loops. Sideload your extension and add the feature flag in the query string:
`&feature.reactreload=true`. Then, within your ReactView folder, run the command that triggers Webpack to run in watch mode. In our onboarding guide
we called this command `npm run watch`.

Next create an empty file in your ReactView folder, and name it `GettingStarted.ReactView.tsx`. All code below will go into this file.

<a name="creating-a-new-reactview-experience-add-boilerplate"></a>
## Add Boilerplate

Every ReactView needs a root component with a decorator on it. This results in boilerplate that looks like this:

```tsx
import * as React from "react"; // this is needed for all react code, regardless of whether or not it's explicitly referenced
import * as ReactView from "@microsoft/azureportal-reactview/ReactView"; // this import gives us decorators for initializing and rendering the view
import { versionId } from "@microsoft/azureportal-reactview/major-version/1"; // this enables the ReactView runtime to know which major version is being run
import { setTitle } from "@microsoft/azureportal-reactview/major-version/1"; // allows us to set the title of the ReactView

setTitle("GettingStarted"); // this can be called anywhere, in production scenarios this should be passed a localized string

@ReactView.ReduxFree.Decorator({ // We use the redux-free decorator for now, later in the guide we'll switch to using redux to reduce complexity
    versionId, // versionId always gets passed into the decorators
    viewReady: () => true // When this function evaluates to true, the view is asserted ready and the user is shown the experience
})
export const GettingStarted extends React.Component { // a completely empty React class component, needed
    public render() {
        return <span>Getting Started</span>;
    }
}
```

<a name="creating-a-new-reactview-experience-load-the-data"></a>
## Load the Data

Calling ARM in ReactViews should be done using batch, just like in Knockout blades. We'll also use the `ArmResource` type from the `ResourceManagement`
module. A simple batch call to get all the resources looks like this:

```typescript
import { ArmResource } from "@microsoft/azureportal-reactview/ResourceManagement";
import { batch } from "@microsoft/azureportal-reactview/Ajax";

function getAllResources() {
    return batch<{ value: ArmResource[] }>({
        uri: "/resources?api-version=2019-10-01",
        type: "GET",
        setTelemetryHeader: "GettingStarted.ReactView/AllResources",
    }).then((armResponse) => {
        return armResponse.content.value;
    });
}
```

<a name="creating-a-new-reactview-experience-render-the-data"></a>
## Render the Data

Now that we have a way to get the data, we need to make the data available within our component. React components typically store this
information on their state. The state is a mutable store, local to an instance of a component. Mutating the store will trigger a re-render
of the component. The full depth of state is beyond the scope of this guide, you can read more about it in the official React documentation.

For now, we'll define a simple state on the component where the resources we've retrieved from ARM can be accessed:

```tsx
interface GettingStartedState { // typing for the state, you can also anonymously declare state within the generic below
    resources: ArmResource[];
}

@ReactView.ReduxFree.Decorator({
    versionId,
    viewReady: (state: GettingStartedState) => !!state.resources // now that we load data in our experience, we want to wait to assert ready until we've loaded it
})
class GettingStarted extends React.Component<{}, GettingStartedState> { // the first generic is for props, since we don't need any we leave it empty
    constructor(props: {}) {
        super(props); // you must call the super and pass the props from the constructor in

        this.state = {}; // initialize the state. The synchronous part of the constructor is the only time you can directly set the state
        getAllResources().then(resources => { // call our data loading function from earlier
            this.setState({resources: resources}); // call this.setState to load our data into the state
        });
    }
}
```

Once the data is available in the component's state, we want to modify our render function to display the data to the user:

The next step is to render the data so the user can see it, we can do this by leveraging the `@fluentui/react` List:

```tsx
import { List } from "@fluentui/react/lib/List"; // Get the List component, note the direct import rather than importing from index

class GettingStarted extends React.Component<{}, GettingStartedState>  {
    public render() {
        if (this.state.resources === undefined) {
            return <></>; // if we don't have anything to render, we return a React Fragment
        }
        return <List
            items={this.state.resources} // pass in the list of resource objects to render
            onRenderCell={(resource) => { // this function gets called for each resource object, and should return a React.Node representation
                return <span>{resource.name} is in {resource.location}</span>;
            }}
        >;
    }
}
```

<a name="creating-a-new-reactview-experience-add-metadata"></a>
## Add Metadata

While the `ArmResource` returned from our batch call gives us some data, to get the full metadata we want to parse it
further. We can do this with the `ResourceMetadata` namespace within the `ResourceManagement` module:

```tsx
import { ArmResource, ResourceMetadata } from "@microsoft/azureportal-reactview/ResourceManagement";
import { getAllAssetTypes } from "@microsoft/azureportal-reactview/AssetTypes";

interface GettingStartedState {
    resources: ResourceMetadata[]; // Update the state typing
}

class GettingStarted extends React.Component<{}, GettingStartedState> {
    constructor(props: {}) {
        Promise.all([getAllResources(), getAllAssetTypes()]) // parsing ArmResource requires AssetTypes
        .then(results => {
            const [armResources, assetTypes] = results; // destructure the returned array
            const resources = armResources.map(resource => {
                return ResourceMetadata.parse(resource, assetTypes); // map the resource array to a metadata array
            });
            this.setState({ resources: resources });
        });
    }
}
```

We now have to update the render function to accommodate the new shape of the resources, additionally
we can now render the subscriptionId:

```tsx
class GettingStarted extends React.Component<{}, GettingStartedState> {
    public render() {
        if (this.state.resources === undefined) {
            return <></>; // If we don't have anything to render, we return a React Fragment
        }
        return <List
            items={this.state.resources}
            onRenderCell={(resource) => { // this function gets called for each resource object, and should return a React.Node representation
            return <span>{resource.resourceName} is in {resource.resourceLocation} and {resource.armId.subscription}</span>;
            }}
        />;
    }
}
```


<a name="creating-a-new-reactview-experience-adding-icons"></a>
## Adding icons

Let's add some icons for the resources to improve the look of the rows. To render the icons, we need to use
the `FrameworkIcon` component. Additionally, we'll refactor our renderCell function outside of our class:

```tsx
/* the FrameworkIcon component is designed to make rendering the icons in the ResourceMetadata easier */
import { FrameworkIcon } from "@microsoft/azureportal-reactview/FrameworkIcon";

const onRenderCell = (resource: ResourceMetadata) => {
    return <>
        <FrameworkIcon image={resource.icon} // FrameworkIcon can directly handle the icon value
            style={{
                width: "24px",
                height: "24px",
                display: "inline-block",
                verticalAlign: "middle",
                overflow: "hidden",
            }}
        />
        <span>{resource.resourceName} is in {resource.resourceLocation} and subscription {resource.armId.subscription}</span>
    </>;
};

class GettingStarted extends React.Component<{}, GettingStartedState> {
    public render() {
        if (this.state.resources === undefined) {
            return <></>;
        }
        return <List
            items={this.state.resources}
        /* This refactor cleans our code, and improves performance by preventing rerenders due to redeclaration */
            onRenderCell={onRenderCell}
        />;
    }
}
```

Let's also pull the custom styling on the icon into its own CSS class. To do that, we'll use a function called
`mergeStyleSets` from `@fluentui/react`:

```tsx
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
const classNames = mergeStyleSets({
    icon: {
        width: "24px",
        height: "24px",
        display: "inline-block",
        verticalAlign: "middle",
    },
});

const onRenderCell = (resource: ResourceMetadata) => {
    return <>
        <FrameworkIcon image={resource.icon} className={classNames.icon}/>
        <span>{resource.resourceName} is in {resource.resourceLocation} and subscription {resource.armId.subscription}</span>
    </>;
};
```

<a name="creating-a-new-reactview-experience-improving-the-styling"></a>
## Improving the styling

The next task is to improve the styling we have in our ReactView, the goal is to convert our items from rows into
cards. To do this, we'll leverage the `Stack` component from `@fluentui/react` as well as reach into our current
color pallette to help style the card:

```tsx
import { Stack, StackItem } from "@fluentui/react/lib/Stack";
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { useTheme } from "@fluentui/react-theme-provider/lib/useTheme";

const classNames = mergeStyleSets({
    listRootDiv: {
        width: "200px", // By restricting the width, we can create a card like layout
        float: "left",
        margin: "5px", // Put some padding around our cards
        padding: "5px",
    },
    /* Below class is to force overflow text to end in ellipsis */
    detailsStackItem: {
        textOverflow: "ellipsis",
        width: "140px", // 200px (width of parent) - 48px (width of icon) - 12px (width of left padding)
        whiteSpace: "nowrap",
        overflow: "hidden",
        paddingLeft: "12px",
    },
    icon: {
        width: "48px", // note we increased the size of the icon here
        height: "48px",
        display: "inline-block",
        verticalAlign: "middle",
    },
});

const onRenderCell = (resource: ResourceMetadata) => {
    /*
     Here we create a layout that has a left side, big icon and a right side with the three properties listed.
     To do this, we create a Horizontal stack of 200 px, with the first item being the Icon, and the second
     being a vertical stack of our three property values.
    */

    // the useTheme hook allows us to grab the current correct color, and have it update as the portal theme changes
    const backgroundColor = useTheme().semanticColors.bodyStandoutBackground;
    return <div className={classNames.listRootDiv} styles={{ backgroundColor }}>
        <Stack horizontal>
            <StackItem >
                <FrameworkIcon image={resource.icon} className={classNames.icon} />
            </StackItem>
            <StackItem>
                <Stack>
                    <StackItem className={classNames.detailsStackItem}>
                        {resource.resourceName}
                    </StackItem>
                    <StackItem className={classNames.detailsStackItem}>
                        {resource.resourceLocation || "NoRegion"}
                    </StackItem>
                    <StackItem className={classNames.detailsStackItem}>
                        {resource.armId.subscription}
                    </StackItem>
                </Stack>
            </StackItem>
        </Stack>
    </div>;
};

export class GettingStarted extends React.Component<{}, GettingStartedState> {
    public render() {
        if (this.state.resources === undefined) {
            return <></>;
        }
        return <List
            items={this.state.resources}
            onRenderCell={onRenderCell}
            getItemCountForPage={() => this.state.resources?.length} // We add this to render all items
        />;
    }
}
```

<a name="creating-a-new-reactview-experience-filtering-the-cards"></a>
## Filtering the cards

Let's add a bit of functionality to our cards, first a search box to filter by resourceName:

```tsx
import { SearchBox } from "@fluentui/react/lib/SearchBox"; // use the built in searchbox

interface GettingStartedState {
    resources?: ResourceMetadata[];
    searchQuery?: string; // add our search string into the state
}

export class GettingStarted extends React.Component<{}, GettingStartedState> {
    public render() {
        if (this.state.resources === undefined) {
            return <></>;
        }
        return <>
            <SearchBox
                onChange={(_, value) => {
            /* When the search box changes, set the new value into our new searchQuery state */
                    this.setState({searchQuery: value.toLowerCase()});
                }}
            />
            <List
                items={this.state.resources.filter(i => {
                    /* filter the items to only include those that include the searchQuery */
                    return i.armId.resourceName.toLowerCase().includes(this.state.searchQuery || "")
                })}
                onRenderCell={onRenderCell}
                getItemCountForPage={() => this.state.resources?.length}
            />
        </>;
    }
```

Now we have a reasonably functioning searchbox. Let's add another filter for Subscription. This time,
the component providing the filter will come from the ReactView package:

```tsx
import { SubscriptionFilter } from "@microsoft/azureportal-reactview/SubscriptionFilter";

interface GettingStartedState {
    resources?: ResourceMetadata[];
    searchQuery?: string;
    subscriptionIds?: string[];
}

export class GettingStarted extends React.Component<{}, GettingStartedState> {
    render() {
        if (this.state.resources === undefined) {
            return <></>;
        }
        return <>
            <SubscriptionFilter
                onSubscriptionChange={(subs) => {
                    /* Update the state with the new set of subscriptions */
                    this.setState({
                        subscriptionIds: subs.map(i => i.subscriptionId)
                    });
                }}
            />
            <SearchBox
                onChange={(_, value) => {
                    this.setState({searchQuery: value.toLowerCase()});
                }}
            />
            <List
                items={this.state.resources
                .filter(resource => {
                    return resource.armId.resourceName.toLowerCase().includes(this.state.searchQuery || "")
                })
                .filter((resource => {
                    /* Add another filter on the set of resources to render, accounting for the possible null ref */
                    return (this.state.subscriptionIds || []).includes(resource.armId.subscription);
                }))
            }
                onRenderCell={onRenderCell}
                getItemCountForPage={() => this.state.resources?.length}
            />
        </>;
    }
}
```

<a name="creating-a-new-reactview-experience-putting-it-all-together"></a>
## Putting it all together

If you followed the above steps, we now have a view that has a grid of cards that we can search and filter within.
Here's the full set of code that drives the experience:

```tsx
import * as ReactView from "@microsoft/azureportal-reactview/ReactView";
import * as React from "react";
import { versionId } from "@microsoft/azureportal-reactview/major-version/1";
import { List } from "@fluentui/react/lib/List";
import { Stack, StackItem } from "@fluentui/react/lib/Stack";
import { mergeStyleSets } from "@fluentui/react/lib/Styling";
import { useTheme } from "@fluentui/react-theme-provider/lib/useTheme";
import { batch } from "@microsoft/azureportal-reactview/Ajax";
import { setTitle } from "@microsoft/azureportal-reactview/Az";
import { ResourceMetadata, ArmResource } from "@microsoft/azureportal-reactview/ResourceManagement";
import { getAllAssetTypes } from "@microsoft/azureportal-reactview/AssetTypes";
import { FrameworkIcon } from "@microsoft/azureportal-reactview/FrameworkIcon";
import { SearchBox } from "@fluentui/react/lib/SearchBox";
import { SubscriptionFilter } from "@microsoft/azureportal-reactview/SubscriptionFilter";

function getAllResources() {
    return batch<{ value: ArmResource[] }>({
        uri: "/resources?api-version=2019-10-01",
        type: "GET",
        setTelemetryHeader: "GettingStarted.ReactView/AllResources",
    }).then((armResponse) => {
        return armResponse.content.value;
    });
}

interface GettingStartedState {
    resources?: ResourceMetadata[];
    searchQuery?: string;
    subscriptionIds?: string[];
}

const classNames = mergeStyleSets({
    listRootDiv: {
        width: "200px",
        float: "left",
        margin: "5px",
        padding: "5px",
    },
    detailsStackItem: {
        textOverflow: "ellipsis",
        width: "140px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        paddingLeft: "12px",
    },
    icon: {
        width: "48px",
        height: "48px",
        display: "inline-block",
        verticalAlign: "middle",
    },
});

const onRenderCell = (resource: ResourceMetadata) => {
    const backgroundColor = useTheme().semanticColors.bodyStandoutBackground;
    return <div className={classNames.listRootDiv} style={{ backgroundColor }} >
        <Stack horizontal>
            <StackItem >
                <FrameworkIcon image={resource.icon} className={classNames.icon} />
            </StackItem>
            <StackItem>
                <Stack>
                    <StackItem className={classNames.detailsStackItem}>
                        {resource.resourceName}
                    </StackItem>
                    <StackItem className={classNames.detailsStackItem}>
                        {resource.resourceLocation || "NoRegion"}
                    </StackItem>
                    <StackItem className={classNames.detailsStackItem}>
                        {resource.armId.subscription}
                    </StackItem>
                </Stack>
            </StackItem>
        </Stack>
    </div>;
};

@ReactView.ReduxFree.Decorator({
    versionId,
    viewReady: (state: GettingStartedState) => !!state.resources,
})
export class GettingStarted extends React.Component<{}, GettingStartedState> {
    constructor(props: {}) {
        super(props);
        Promise.all([getAllResources(), getAllAssetTypes()])
            .then(results => {
                const [armResources, assetTypes] = results;
                const resources = armResources.map(resource => {
                    return ResourceMetadata.parse(resource, assetTypes);
                });
                this.setState({ resources });
            });
        this.state = {};
        setTitle("Getting Started");
    }
    render() {
        if (this.state.resources === undefined) {
            return <></>; // If we don't have anything to render, we return a React Fragment
        }
        return <>
            <SubscriptionFilter
                onSubscriptionChange={(subs) => {
                    this.setState({
                        subscriptionIds: subs.map(i => i.subscriptionId),
                    });
                }}
            />
            <SearchBox
                onChange={(_, value) => {
                    this.setState({ searchQuery: value.toLowerCase() });
                }}
            />
            <List
                items={this.state.resources
                    .filter(resource => {
                        return resource.armId.resourceName.toLowerCase().includes(this.state.searchQuery || "");
                    })
                    .filter((resource => {
                        return (this.state.subscriptionIds || []).includes(resource.armId.subscription);
                    }))
                }
                onRenderCell={onRenderCell}
                getItemCountForPage={() => this.state.resources?.length}
            />
        </>;
    }
}
```

<a name="creating-a-new-reactview-experience-next-steps"></a>
## Next Steps

Congratulations, you should now be ready to begin building any pure ReactView experience you would like. For
more advanced examples that leverage redux, or third party npm packages, see some of the other guides.

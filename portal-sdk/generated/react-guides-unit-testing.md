<a name="unit-testing-a-reactview"></a>
# Unit Testing a ReactView

New react extensions come set up with unit testing support, with the following libraries configured

- [Jest](https://jestjs.io/docs/en/getting-started)
- [Enzyme](https://enzymejs.github.io/enzyme/)
- [Testing-Library](https://testing-library.com/docs/react-testing-library/intro)

Existing extensions wanting to add our react framework must provide their own setup for jest and the testing library they wish to choose. For jest specifically, a `jest.config.js` file must be created in order for proper setup. The jest configuration file that we provide for new extensions is as follows and must be adjusted to fit your needs:

const { jestModuleNameMappings } = require("@microsoft/azureportal-reactview/jestModuleNameMappings");

module.exports = {
    preset: "ts-jest",
    testEnvironment: "jsdom",
    rootDir: "../",
    setupFiles: [
        "<rootDir>/test-config/globalTestSetup.ts",
    ],
    globals: {
        "ts-jest": {
            tsConfig: "tsconfig.test.json",
        },
    },
    transform: {
        "^.+\\.tsx?$": ["ts-jest"],
        "\\.resx$": "@microsoft/azureportal-reactview/resxTransformer",
        "ClientResources": "@microsoft/azureportal-reactview/resxTransformer",
    },
    coveragePathIgnorePatterns: [".test.tsx", ".test.ts", "globalTestSetup.ts", "testUtils.ts"],
    coverageProvider: "babel",
    collectCoverage: true,
    coverageReporters: [
        "text",
        "lcov",
    ],
    testMatch: [
        "<rootDir>/**/__tests__/**/*.(spec|test).[jt]s?(x)",
        "<rootDir>/*.(spec|test).[tj]s?(x)",
        "<rootDir>/**/*.(spec|test).[tj]s?(x)",
    ],
    testPathIgnorePatterns: ["/node_modules/"],
    collectCoverageFrom: [
        "**/*.{ts,tsx}",
        "!**/node_modules/**",
    ],
    moduleNameMapper: {
        ...jestModuleNameMappings,
        "ClientResources": "<rootDir>/../ClientResources.resx",
    },
};


Full documentation on what each key/value pair means in the configuration file can be found [here.](https://jestjs.io/docs/configuration)

<a name="unit-testing-a-reactview-what-is-jest"></a>
## What is Jest

Jest is a test runner and test framework that provides the following utilities:

- Running test cases
- Code coverage reporting
- Utilities to mock dependencies in test cases
- Snapshot assertions for easily testing large objects and react component/DOM output

<a name="unit-testing-a-reactview-what-is-enzyme"></a>
## What is Enzyme

Enzyme is a library for testing react components. Its main benefits are shallow rendering,
support for getting access to a component instance in a test and querying render output
with component constructors.

<a name="unit-testing-a-reactview-what-is-testing-library"></a>
## What is Testing-Library

Testing-Library is similar to Enzyme but more focused on testing DOM output of react components.
Unlike Enzyme, querying is DOM only, and you are unable to access react component instances rendered in test cases.

<a name="unit-testing-a-reactview-how-to-write-a-unit-test-in-enzyme-and-testing-library"></a>
## How to write a unit test in Enzyme and Testing-Library

Consider the following component:

```tsx
@ReactView.Decorator<ComponentProps, ComponentState, ReduxState, ResourceAction>({
    store,
    viewReady: (state) => state.loading !== LoadingStatus.LOADING && state.loading !== LoadingStatus.NOT_LOADED,
})
@ReactView.ReactReduxConnect.Decorator<ReduxState>(
    mapStateToProps,
    mapDispatchToProps,
)
export class Component extends React.Component<ComponentProps, ComponentState> {
    private readonly columns: IColumn[];
    public constructor(props: ComponentProps) {
        super(props);
        this.state = { nameFilter: '' }
        Az.setTitle('React blade');
        this.columns = ['id', 'name', 'subscriptionId']
        .map(name => ({
            key: name,
            name,
            fieldName: name,
            minWidth: 100,
            isResizable: true,
        }));

        initialize(props.dispatch);

    }

    public render() {
        const { resources, loading, selectedSubscriptions, setSelectedSubscriptions } = this.props;
        const { nameFilter } = this.state;
        return (
            <Fabric>
                <Header
                    setNameFilter={({nameFilter: nf}) => {this.setState({nameFilter: nf})}}
                    setSelectedSubscriptions={(subs) => setSelectedSubscriptions(subs)}
                    loading={loading}
                />
                <Stack tokens={{ childrenGap: 5 }}>
                    <Stack.Item grow={5}>
                        <Table resources={filterResources({ nameFilter, subscriptions }, resources)} loading={loading} columns={this.columns} />
                    </Stack.Item>
                </Stack>
            </Fabric>
        );
    }
}
```

<a name="unit-testing-a-reactview-how-to-write-a-unit-test-in-enzyme-and-testing-library-enzyme-test"></a>
### Enzyme test

```tsx
const props = {
    resources: [],
    loading: true,
    selectedSubscriptions: ['sub']
  };
it('sets filters and filters resources', () => {
    jest.mock('./components/Header', () => 'Header')
    const wrapper = mount(
      <Component
        {
          ...{
            ...props,
            loading: LoadingStatus.LOADED,
            resources: [
              {name: 'test', subscriptionId: 'sub1'},
              {name: 'test1', subscriptionId: 'sub'}
            ]
          }
        }
      />
    );
    expect(wrapper.find(Table).first().props().resources).toEqual([{name: 'test1', subscriptionId: 'sub'}]);
    wrapper.find(Header).first().props().setNameFilter({nameFilter: 'not visible'});
    expect(wrapper.update().find(Table).first().props().resources).toEqual([]);
  });

```

```tsx
jest.mock('./components/Header', () => 'Header')
```
> This tells jest to replace imports to `'./components/Header'` with the implementation passed as the second paramater. In this case, it is a basic react component that just returns a string.

```tsx
expect(wrapper.find(Table).first().props().resources).toEqual([{name: 'test1', subscriptionId: 'sub'}]);
```
> Notice how in the assertion we pass the `Table` component to `wrapper.find()`.
>
> This queries the wrapper for `Table` components and returns a list of `Table` components. Once we have the active component instance, we can access its props.

```tsx
wrapper.find(Header).first().props().setNameFilter({nameFilter: 'not visible'});
```
> Notice how we are directly calling the `setNameFilter` prop passed to the `Header` component
>
> This provides an easy, type safe way to assert that the component under test functions correctly in isolation, and is especially helpful when the component is mocked.

<a name="unit-testing-a-reactview-how-to-write-a-unit-test-in-enzyme-and-testing-library-testing-library-test"></a>
### Testing-Library test

```tsx
it('sets filters and filters resources', async () => {
    const wrapper = render(
      <Component
        {
          ...{
            ...props, 
            loading: LoadingStatus.LOADED,
            resources: [
              {name: 'test', subscriptionId: 'sub1'},
              {name: 'test1', subscriptionId: 'sub'}
            ]
          }
        }
      />
    );
    await waitFor(() => expect(document.querySelectorAll('div[data-automationid="DetailsRowFields"]')).toHaveLength(1));
    expect(wrapper.container).toMatchSnapshot('resources-not-filtered');
    const filter = await screen.findByPlaceholderText('filter by name')
      fireEvent.change(
        filter,
        {target: {value: 'not visible'}}
      );
      await waitFor(() => expect(document.querySelectorAll('div[data-automationid="DetailsRowFields"]')).toHaveLength(0));
      expect(wrapper.container).toMatchSnapshot('resources-filtered');
  });

```

```tsx
await waitFor(() => expect(document.querySelectorAll('div[data-automationid="DetailsRowFields"]')).toHaveLength(1));
```

> Notice the `waitFor` call, as Testing-Library only allows DOM access, we must wait for the DOM to be updated.
>
> `waitFor` is a utility provided by testing library that will poll the callback until it passes, or it times out.

```tsx
const filter = await screen.findByPlaceholderText('filter by name')
fireEvent.change(
  filter,
  {target: {value: 'not visible'}}
);
```

> To perform actions on our components, we must dispatch events to the DOM element we need to trigger our code

<a name="unit-testing-a-reactview-running-tests"></a>
## Running tests

For new extensions, the react package comes with two test commands. These can be found in the `scripts` section of `package.json`
- `npm run test`
- `npm run watchtest` will rerun your tests when file changes are made

For existing extensions, you will need to create these commands yourself. These will look something like:
```json
"scripts": {
  ...
  "test": "jest -c ./test-config/jest.config.js",
  "watchtest": "jest test -c ./test-config/jest.config.js --watch",
  ...
}
```

<a name="unit-testing-a-reactview-portal-provided-test-utilites"></a>
## Portal provided test utilites

<a name="unit-testing-a-reactview-portal-provided-test-utilites-mocks"></a>
### Mocks

We vend a set of mocks for all portal APIs. These are wired up by default, you can see how this is done by looking at the `moduleNameMapper` section of `test-config/jest.config.js`.
This is done to allow better assertions in unit tests, as all APIs used by portal reactview components will be using these mocked APIs when tests are running.
Any API used by portal components can be imported (as a jest mock), and have its implementation mocked.

```typescript
// All imports to the real getLocations will be swapped to the mocked versions at test time by Jest moduleNameMapper
import { getLocations } from '@microsoft/azureportal-reactview/Locations';

...

(getLocations as jest.Mock).mockImplementation(() => Promise.reject());

// Alternatively

import * as Locations from '@microsoft/azureportal-reactview/Locations';

...

jest.spyOn(Locations, 'getLocations').mockImplementation(() => Promise.reject());
```

<a name="unit-testing-a-reactview-portal-provided-test-utilites-testing-redux-connected-components-that-use-reactview-decorators"></a>
### Testing Redux-connected components that use ReactView decorators

Reactview decorators are mocked by default which is good for unit testing in isolation.
Because the decorators also handle connecting the component to the redux store we provide a utility for this
to allow testing the component with the redux store attached.

```tsx
import { getBladeForTest } from '@microsoft/azureportal-reactview/test-support/getBladeForTest';
import { reducer } from './store/reducer';
import { Component } from './Component.ReactView';
import { render } from '@testing-library/react';
...

const [ConnectedComponent, reduxStore] = getBladeForTest(Component, reducer);

render(<ConnectedComponent />)

```

For most test cases though, the best way to test a connected component would be to:

1. Define and export your reducer and store it in a separate file
2. Test the React component in isolation, passing props to simulate the redux store
3. Test the reducer function itself in isolation
4. Have a small 'happy path' test case with the store attached that verifies everything works correctly

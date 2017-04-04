
## Using DataViews

The `QueryView` and `EntityView` both serve the purposes of presenting data from the cache to the view model, and providing reference counting. A DataView is created from the `createView` method of a QueryCache or EntityCache:

`\Client\Data\MasterDetailBrowse\ViewModels\MasterViewModels.ts`

```ts
this._websitesQueryView = dataContext.masterDetailBrowseSample.websitesQuery.createView(container);
```

In the sample above, the `container` object acts as a *lifetime object*. Lifetime objects inform the cache when a given view is currently being displayed on the screen. This allows the shell to make several adjustments for performance:

- Adjust polling interval when the part is not on the screen
- Automatically dispose of data when the blade containing the part is closed

Creating a DataView does not result in a data load operation from the server. The server is only queried when the `fetch` operation of the view is invoked:

`\Client\Data\MasterDetailBrowse\ViewModels\MasterViewModels.ts`

```ts
public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
    return this._websitesQueryView.fetch({ runningStatus: inputs.filterRunningStatus.value });
}
```

The `runningStatus` is a filter which will be applied to the query. This allows several views to be created over a single cache, each presenting a potentially different data set.

## Observable map & filter

In many cases, you may want to shape your data to fit the view you are binding to. There are many cases where this is useful:

- Shaping data to match the contract of a control (data points of a chart, for instance)
- Adding a computed property to a model object
- Filtering data on the client based on a property

The recommended approach to these cases is to use the `map` and `filter` methods found in the <a href="https://github.com/stevesanderson/knockout-projections" target="_blank">Knockout projections</a> library, included in the SDK.

See [Shaping and filtering your data](./aaaportalfx-data-projections.md) for more details.

<!--
    Base.Net.Ajax
-->

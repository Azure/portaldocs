
### Improving Part responsiveness

#### Overview

As a Part loads, by default, the user is presented with a *blocking* loading indicator:

![Part with blocking loading indicator][opaque]
[opaque]: ../media/portalfx-parts-opaquespinner.png

By default, the lifetime of this *blocking* loading indicator is controlled by the promise returned from the Part's `onInputsSet` method:

```ts
public onInputsSet(inputs: Def.InputsContract): MsPortalFx.Base.Promise {
	// When this promise is resolved, the loading indicator is removed.
    return this._view.fetch(inputs.websiteId);
}
```

Now, it is quite common that a Part's content can be revealed (that is, the *blocking* loading indicator can be removed) earlier, allowing the user to interact with the Part while its data continues to load.  An example of this looks like:

![Part with non-blocking loading indicator][translucent]
[translucent]: ../media/portalfx-parts-translucentspinner.png

Here, essential content - like the "Accounts" SQL Database name - is displayed to the user while non-essential "status" (bottom left) loads in the background.
While "status" loads, a *non-blocking* loading indicator is displayed at the top of the Part.  Crucially, the user can activate the Part (can interact with the Part) while the Part is in this *non-blocking* loading state.

To optimize your Part to behave in this more responsive way, you'll use the `container.revealContent()` API from within your Part's view model.  A call to this API will:

* remove the *blocking* loading indicator
* reveal the Part's content
* apply the *non-blocking* loading indicator
* allow the user to interact with your Part

Depending on the nature of your Part, you will call `container.revealContent()`:

* from your Part view model's `constructor` *or*
* from your Part view model's `onInputsSet` function:
    * in a '.then(() => ...)' callback, once *essential data* has loaded
    * in 'onInputsSet' directly, before initiating data-loading    

You'll call `container.revealContent()` from your view model's `constructor` in scenarios where the Part has interesting content to display *even before any data is loaded*.  An example of this would be a chart that can show its X and Y-axis immediately:

```ts
export class BarChartPartViewModel implements Def.BarChartPartViewModel.Contract {

    public barChartVM: MsPortalFx.ViewModels.Controls.Visualization.Chart.Contract<string, number>;

    constructor(container: MsPortalFx.ViewModels.PartContainerContract, initialState: any, dataContext: ControlsArea.DataContext) {
        // Initialize the chart view model.
        this.barChartVM = new MsPortalFx.ViewModels.Controls.Visualization.Chart.ViewModel<string, number>(container);

        // Configure the chart view model (incomplete as shown).
        this.barChartVM.yAxis.showGridLines(true);
		
		container.revealContent();
	}
}
```
More often, you'll call `container.revealContent()` once some essential, fast-loading data is loaded:

```ts
public onInputsSet(inputs: MyPartInputs): Promise {
    // This larger Promise still controls the lifetime of all loading indicators (the
    // non-blocking one in this case, since 'container.revealContent()' has been called).
    return Q.all([
        this._essentialDataView.fetch(inputs.resourceId).then(() => {
            // Show the Part content once essential, fast-loading data loads.
            this._container.revealContent();
        }),
        this._slowLoadingNonEssentialDataView.fetch(inputs.resourceId)
    ]);
}
```
Less commonly, you'll call `container.revealContent()` when the essential data you'll display can be computed synchronously from the Part/Blade inputs:

```ts
public onInputsSet(inputs: MyPartInputs): Promise {

    // In this case, the 'resourceGroupName' is sufficient to allow the user to interact with the Part/Blade.
    var resourceDescriptor = ResourceTypes.parseResourceManagerDescriptor(inputs.resourceId);
    this.resourceGroupName(resourceDescriptor.resourceGroup);
    this._container.revealContent();

    // This Promise controls the lifetime of all loading indicators (the
    // non-blocking one in this case, since 'container.revealContent()' has been called).
    return this._dataView.fetch(inputs.resourceId);
}
```
In all cases above, the promise returned from `onInputsSet` still determines the visibility/presence of loading indicators.  Once the promise returned from `onInputsSet` is resolved, all loading indicators are removed:

![Fully loaded Part with no loading indicator][nospinner]
[nospinner]: ../media/portalfx-parts-nospinner.png

Also, if the promise returned from `onInputsSet` is rejected (due to the rejection of either the fast- or slow-loading data promise), the Part will transition to show the default error UX (a "sad cloud").
This treatment of the promise returned from `onInputsSet` behaves consistently, whether or not the Part makes use of `container.revealContent()`.  In this way, `container.revealContent()` is a *simple, additive* change you should use to optimize your Part's behavior.

#### Anti-patterns

It is important that loading indicators are consistently applied across the Parts/Blades of all extensions.  To achieve this:

**Do** call `container.revealContent()` to limit the time where the user sees *blocking* loading indicators.

**Do** return a Promise from `onInputsSet` that **reflects all data-loading** for your Part (or for your Blade, if the Blade is locked or `<TemplateBlade>`).

**Do not** return a Promise from `onInputsSet` that removes loading indicators *before all Part data is loaded*.  While your Part data loads, if the user sees no loading indicator, your Part will appear broken and/or unresponsive.  For instance,

```ts
public onInputsSet(inputs: MyPartInputs): Promise {
    this._view.fetch(inputs.resourceId);
    
    // DO NOT DO THIS!  Removes all loading indicators.
    // Your Part will look broken while the `fetch` above completes.
    return Q();
}
```

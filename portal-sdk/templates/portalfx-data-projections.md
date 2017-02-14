<a name="data-shaping"></a>
## Shaping and filtering data

### Understanding observable map() and mapInto()

When working with data in a QueryCache the most common operation you'll want to do is reshape all the items in the cache into a format that is better for displaying in the UI. Let's look at example that shows how knockout observable versions of `map()` and `mapInto()` can be used to accomplish this and some pitfalls to watch out for.

The sample we'll look at will take a QueryCache of `Robot` objects. The data model for a `Robot` looks like:

<!-- this is generated so I couldn't put comments in to do an include-section -->
```ts
interface Robot {
    name: KnockoutObservable<string>;
    status: KnockoutObservable<string>;
    model: KnockoutObservable<string>;
    manufacturer: KnockoutObservable<string>;
    os: KnockoutObservable<string>;
    specId: KnockoutObservable<string>;
}
```

What we want to do is put each robot in a grid with three columns. The two columns (name and status) will be the same data as that of the model but the third column will be a combination of properties from the model object in the QueryCache. We'll combine the model and manufacturer observables into a single property. The interface for the data to show in the grid is then:

{"gitdown": "include-section", "file":"../Samples/SamplesExtension/Extension/Client/V1/Data/Projection/ViewModels/MapAndMapIntoViewModels.ts", "section": "data#robotDetailsModel"}

A naive implementation of this might go something like this (ignore the lines about `projectionId` and `_logMapFunctionRunning()` for now. They're used for logging in the sample we'll get to in a sec):

{"gitdown": "include-section", "file":"../Samples/SamplesExtension/Extension/Client/V1/Data/Projection/ViewModels/MapAndMapIntoViewModels.ts", "section": "data#buggyMapProjection"}

Without knowing too much about map() this looks like a fairly reasonable implementation. We know `robot.name()` has the name of the robot and `robot.model()` and `robot.manufacturer()` will give us the model and manufacturer values. The `RobotDetails` interface we're using to model the data in the grid requires observables for it's `name` and `modelAndMfg` properties so we'll throw the strings we get from the QueryCache model into a pair of observables and call it done.

Well, not quite. Let's open up a sample and see why this causes problems. In samples extension search for the __Understanding map() and mapInto()__ sample. When the blade opens up click on the __Buggy Map__ button to load the grid with a data projection code shown above. You should see something like the following show up in the __log stream__ control at the bottom of the blade:

```
Creating buggy map() projection
Creating a projection (projection id=4, robot=Bolt)
Creating a projection (projection id=5, robot=Botly)
Creating a projection (projection id=6, robot=Spring)
Creating a projection (projection id=7, robot=MetalHead)
```

Let's talk about what's happening here. We've created the projection shown above and passed it to the grid. Since there are four items in the QueryCache the projection will run four times, once on each object. Everytime we run the mapping function on an item in the grid this sample creates a new ID for the resulting `RobotDetails` object. You can see the robot names and the ID we generated for the details object in the output above.

Activate the first time in the grid so the child blade opens then what we're going to do is simulate the QueryCache getting an updated property value (generally by polling the server) for that activated item. You can do this by clicking on the 'update status' command at the top of the blade. When you click you'll see that the status for the 'Bolt' robot was updated but the child blade closed. Why did it do that? It's still the same item in the QueryCache, we've just updated one of it's properties. And you can see the top row of the grid is still an item with a name of 'Bolt'. The answer can be found in the __log__ at the bottom of the blade:

```
Updating robot status to 'processor' (robot='Bolt')
Creating a projection (projection id=8, robot=Bolt)
```

You'll notice after the status observable updates the map's projection function runs and computes __a different projected item__. The object with projectionId === 4 is gone and has been replaced with a new item with projectionId === 8. This is the reason the child blade closed. The item that was in selectableSet's activatedItems observable array no longer exists in the grid's list of items. It has been replaced by an item with the same `name` and `modelAndMfg` but a new `status`.

To understand why the map does this you need to understand a little how map() works. When the mapping function you supply runs knockout is watching to see what observable values are read and it then takes a dependency on those values (just like ko.pureComputed or ko.reactor). If any of those values change knockout knows the generated item is now out of date because the source for that item has changed. How does the map function generate an update-to-date projection? The only way it can, by running the mapping function again. This can be especially bad if you do something expensive in your mapping function.

The same thing happens if you update the model property of the top item (by clicking the 'update model' command):

```
Updating model to 'into' (robot=Bolt)
Creating a projection (projection id=10, robot=Bolt)
```

Reason is the same. During our mapping function we wrote:

```
modelAndMfg: ko.observable("{0}:{1}".format(robot.model(), robot.manufacturer()))
```

Which means the map projection will run again anytime robot.model() is observably updated. This causes the old item to be removed from the grid and an entirely new item to be added.

This obviously isn't what we want so how do we write projections that don't do this? In the case of a property we want to pass through straight from the data model to the grid model (like the `status` property in this example) you simply pass the observable. Don't get the current string value out of the observable and shove it into a different observable. So this line from our mapping function:

```
status: ko.observable(robot.status()),
```

becomes this:

```
status: robot.status,
```

We can't take the same approach with the `modelAndMfg` property however since we need to combine multiple properties from the data model to produce one property on the grid model. For cases like this you should use a ko.pureComputed() like so:

```
modelAndMfg: ko.pureComputed(() => {
    return "{0}:{1}".format(robot.model(), robot.manufacturer());
})
```

This prevents the map() from taking a dependency on robot.model() and robot.manufacturer() because __the pureComputed() function takes the dependency on robot.model() and robot.manufacturer()__. Since the pureComputed() we created will update whenever model() or manufacturer() updates ko.map knows it will not need to rerun your mapping function to keep the projection object up-to-date when those observables change in the source model.

A correct implemenation of the map above then looks like (again ignore uuid and the logging functions):

{"gitdown": "include-section", "file":"../Samples/SamplesExtension/Extension/Client/V1/Data/Projection/ViewModels/MapAndMapIntoViewModels.ts", "section": "data#properMapProjection"}

You can click on the 'Proper map' button in the sample and perform the same actions to see the difference. Now updating a property on the opened grid item no longer results in a rerunning of your map function. Instead changes to `status` are pushed directly to the DOM and changes to `model` cause the pureComputed to recalculate but importantly __do not change the object in grid.items()__.

Now that you understand how `map()` works we can introduce `mapInto()`. Here's the code the same projection implemented with mapInto():

{"gitdown": "include-section", "file":"../Samples/SamplesExtension/Extension/Client/V1/Data/Projection/ViewModels/MapAndMapIntoViewModels.ts", "section": "data#properMapIntoProjection"}

You can see how it reacts by clicking on the 'Proper mapInto' button and then add/remove/update the items. The code and behavior are the exact same. So how are map() and mapInto() different? We can see with a buggy implementation of a projection using mapInto():

{"gitdown": "include-section", "file":"../Samples/SamplesExtension/Extension/Client/V1/Data/Projection/ViewModels/MapAndMapIntoViewModels.ts", "section": "data#buggyMapIntoProjection"}

This is the same as our buggy implementation of map() we wrote earlier. Hit the 'Buggy mapInto' button and then play around with updating status() and model() of the top row while that row is activated. You'll notice, unlike map(), that the child blade doesn't close however you'll also notice that when the source data in the QueryCache changes __the observable changes are not present in the projected object__. The reason for this is mapInto() ignores any observables that use in the mapping function you supply. It is therefore guaranteed that a projected item will stay the same item as long as the source item is around but if you write your map incorrectly it isn't guaranteed the projected data is update to date.

So to summarize:

Function | Projection always guaranteed up to date | Projected object identity will not change
--- | --- | ---
map() | Yes | No
mapInto() | No | Yes

However if the projection is done correctly both functions should work identically.

### Using Knockout projections

In many cases extension authors will want to shape and filter data as it is loaded via QueryView and EntityView.

[Knockout projections](https://github.com/stevesanderson/knockout-projections) provide a simple way to efficiently perform `map` and `filter` functions over an observable array of model objects.  This allows you to add new computed properties to model objects, exclude unneeded properties on model objects, and generally change the structure of an object that is inside an array.  If used correctly, the Knockout projections library does this efficiently by only executing the developer-supplied mapping/filtering function when new data is added to the array and when data is modified. The Knockout projections library is included by default in the SDK.  You can learn more by [reading this blog post](http://blog.stevensanderson.com/2013/12/03/knockout-projections-a-plugin-for-efficient-observable-array-transformations/).

The samples extension includes an example of using a __projected array__ to bind to a grid:

`\Client\Data\Projection\ViewModels\ProjectionBladeViewModel.ts`

{"gitdown": "include-section", "file":"../Samples/SamplesExtension/Extension/Client/V1/Data/Projection/ViewModels/ProjectionBladeViewModel.ts", "section": "data#mapExample"}

### Chaining uses of `map` and `filter`

Often, it is convenient to chain uses of `map` and `filter`:
<!-- the below code no longer lives in samples extension anywhere -->
```ts
// Wire up the contents of the grid to the data view.
this._view = dataContext.personData.peopleQuery.createView(container);
var projectedItems = this._view.items
    .filter((person: SamplesExtension.DataModels.Person) => {
        return person.smartPhone() === "Lumia 520";
    })
    .map((person: SamplesExtension.DataModels.Person) => {
        return <MappedPerson>{
            name: person.name,
            ssnId: person.ssnId
        };
    });

var personItems = ko.observableArray<MappedPerson>([]);
container.registerForDispose(projectedItems.subscribe(personItems));
```

This filters to only Lumia 520 owners and then maps to just the columns the grid uses.  Additional pipeline stages can be added with more map/filters/computeds to do more complex projections and filtering.

### Anti-patterns and best practices

**Do not** unwrap observables directly in your mapping function - When returning a new object from the function supplied to `map`, you should **avoid unwrapping observables** directly in the mapping function, illustrated by `computedName` here:

```ts
var projectedItems = this._view.items.map<RobotDetails>({
    mapping: (robot: SamplesExtension.DataModels.Robot) => {
        return <RobotDetails>{
            name: robot.name,
            
            // DO NOT DO THIS!  USE A COMPUTED INSTEAD!
            computedName: "{0}:{1}".format(robot.model(), robot.manufacturer());
        };
    },
    ...
```

The `computedName` property above is the source of a common bug where **"my grid loses selection when my QueryCache refreshes"**.  The reason for this is subtle.  If you unwrap observables in your mapping function, you will find that - each time the observable changes - your mapping function will be invoked again, (inefficiently) *generating an entirely new object*.  Since the Azure Portal FX's selection machinery presently relies on JavaScript object identity, selection tracked relative to the *old object* will be lost when this object is replaced by the *new object* generated by your mapping function.  Ignoring bugs around selection, generating new objects can lead to UI flicker and performance problems, as more UI is re-rendered than is necessary to reflect data changes. 

**Do** follow these two patterns to avoid re-running of mapping functions and to avoid unnecessarily generating new output objects:
 
* **Reuse observables from the input object** - Above, the `name` property above simply reuses - in the projected output object - an observable *from the input object*
* **Use `ko.computed()` for new, computed properties** - The `computedName` property above uses a Knockout `computed` and unwraps observables *in the function defining the `computed`*.  With this, only the `computedName` property is recomputed when the input `robot` object changes.

**Do** use `map` and `filter` to reduce the size of the data you are binding to a control - See [Use map and filter to reduce size of rendered data](/portal-sdk/generated/index-portalfx-extension-monitor.md#use-map-and-filter-to-reduce-size-of-rendered-data).

**Do not** use `subscribe` to project\shape data - An extreme anti-pattern would be to not use `map` at all when projecting/shaping data for use in controls:

```ts
// DO NOT DO THIS!
this._view.items.subscribe((items) => {
    var mappedItems: MappedPerson[] = [];
    for (var i = 0; i < items.length; i++) {
        // create a new mapped person for every item
        mappedItems.push({
            name: items[i].name,
            model: robot.model()
        });
    }

    this.selectableGridViewModel.items(mappedItems);
});
```

There are two significant problems with `subscribe` used here:

* Whenever `this._view.items` changes, an *entirely new array containing entirely new objects* will be generated.  Your scenario will suffer from the cost of serializing/deserializing this new array to the grid control and from the cost of fully re-rendering your grid.
* Whenever the `robot.model` observable changes, this change *will not be reflected in the grid*, since no code has subscribed to this `robot.model` observable.

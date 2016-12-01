## Lifetime Manager

The portal has a concept of a 'lifetime manager' to make sure any resources specifically associated with a blade are cleaned up
when the blade is closed. Each blade has a lifetime manager associated with it. Controls, knockout projections and APIs that take 
a lifetime manager will be disposed when the lifetime manager is disposed. That means, for the most part, extensions in the portal 
will perform efficient memory management without having to worry about it.

There are some scenarios that call for more fine-grained memory management. The most common case is when you write a `map()` or 
`mapInto()` function and create a reactor or control in the callback that generates the individual items. These items can obviously 
be destroyed long before the blade is closed by being removed from the source array and when dealing with large amounts of data 
(especially virtualized data) memory leaks can quickly add up and lead to poor performance. Before we get into a discussion of child 
lifetime managers it should be noted that `pureComputed()` does *not* take a lifetime manager because pureComputed already uses memory 
as efficiently as possible by design and generally any computed you create in a `map()` should be a pureComputed (as opposed to a 
`ko.reactor`). More info on pureComputeds is available [here](#data-pureComputed).

For this example let's say you have some data in a data cache and for each item you want to display a row in a grid and separately 
display a button in a Section located below the grid. We'll use the `mapInto()` function to map the items in the data cache into 
grid items and in the map function create a button and add it to the section:

```ts
let gridItems = this._view.items.mapInto(container, (itemLifetime, item) => {
    let button = new Button.ViewModel(itemLifetime, { label: pureComputed(() => "Button for " + item.name())});
    this.section.children.push(button);
    return {
        name: item.name,
        status: ko.pureComputed(() => item.running() ? "Running" : "Stop")
    };
});
```

A few things to note here. First is that everywhere we read the value an observable in the mapping function we wrapped it in a 
ko.pureComputed. This is important and we have documentation [here](#data-shaping) that goes into the reasons why.

The second thing is that rather than passing 'container' into the button constructor we passed `itemLifetime` which our mapping 
function receives as a parameter. This is a "child" lifetime manager that was automatically created for you by the mapInto function.
Child lifetime managers have a lifetime that is at most the lifetime of their parent but importantly they can be disposed before their 
parent is disposed. When you know you have resources whose lifetime is shorter than that of the blade you can do 
`container.createChildLifetimeManager()` to create a child lifetime manager and pass that in to view model constructors or anywhere 
else a lifetime manager object is needed. When you know you are done with those resources you can explictly call `dispose()` on the 
child lifetime manager. If you forget the child lifetime manager will be disposed when it's parent is disposed to prevent memory leaks.

In the case of `map()` and `mapInto()` the item lifetime manager will be disposed when the associated object is removed from the source 
array. In the example above this means the button view model will be disposed at the correct time but notice the now disposed button 
view model will still be in the Section. Nobody has removed the button from the section's `children()` array. Fortunately extension 
authors can register callbacks with the lifetime manager that are called when it's disposed using `registerForDispose`. To fix up 
the sample above we can do:

```ts
let gridItems = this._view.items.mapInto(container, (itemLifetime, item) => {
    let button = new Button.ViewModel(itemLifetime, { label: pureComputed(() => "Button for " + item.name())});
    this.section.children.push(button);
    itemLifetime.registerForDispose(() => this.section.children.remove(button));
    return {
        name: item.name,
        status: ko.pureComputed(() => item.running() ? "Running" : "Stop")
    };
});
```

Now our mapInto function is working properly.
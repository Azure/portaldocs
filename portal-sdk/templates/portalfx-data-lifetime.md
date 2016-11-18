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
`ko.reactor`). More info on pureComputeds is available [below](#lifetime-pureComputed).

For this example let's say you have some data in a dad cache and for each item you want to display a row in a grid and separately 
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

<a name="lifetime-pureComputed">
### Pure computed

As mentioned above the portal's version of the knockout `pureComputed()` has not been modified to take a lifetime manager. Knockout 
has some good documentation on pureComputeds [here]("http://knockoutjs.com/documentation/computed-pure.html") but in a nut shell
the reason is that any knockout dependencies (which are the things that will pin a computed or observable in memory) associated 
with the pureComputed are allocated only when someone is listening to the pureComputed and are cleaned up as soon everyone stops 
listening to the pureComputed. This works great for 'pure' functions where there are no side effects which applies to the vast majority
of cases where you would like to create a computed so you should always try to use a pureComputed as opposed to a ko.reactor. Here's an 
example to help you understand the difference between the two so you know when you need to use a reactor as opposed to a pureComputed:

```ts
let obsNum = ko.observable(0);
let pureComputedCounter = 0;
let reactorCounter = 0;

let pure = ko.pureComputed(() => {
    pureComputedCounter++;
    return obsNum() + 1;
});

let reactor = ko.reactor(lifetime, () => {
    reactorCounter++;
    return obsNum() + 2;
});

obsNum(10);
obsNum(3);
obsNum(5);

console.log("According to pureComputed obsNum changed " + pureComputedCounter + " times");
console.log("According to reactor obsNum changed " + reactorCounter + " times");
```

The output of the above will be:

```
According to pureComputed obsNum changed 0 times
According to reactor obsNum changed 3 times
```

Here incrementing `pureComputedCounter` or `reactorCounter` is a side-effect because it has no bearing on the value of the observables 
produced by the functions (`pure` and `reactor`). If you need a side effect use `ko.reactor()`. If you don't use `ko.pureComputed()`. 
(Note: if we had added `pure.subscribe(lifetime, (val) => console.log(val.toString()))` right after creating `pure` then `pureComputedCounter`
would have been incremented to 3 as well because the pureComputed becomes live as soon as a listener is attached).
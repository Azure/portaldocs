* [Understanding the blade view model](#understanding-the-blade-view-model)
    * [Blade initialization](#understanding-the-blade-view-model-blade-initialization)
        * [Blade constructor](#understanding-the-blade-view-model-blade-initialization-blade-constructor)
        * [Blade onInputsSet](#understanding-the-blade-view-model-blade-initialization-blade-oninputsset)
        * [Best practices when using observables](#understanding-the-blade-view-model-blade-initialization-best-practices-when-using-observables)
        * [ko.pureComputed()](#understanding-the-blade-view-model-blade-initialization-ko-purecomputed)
        * [ko.reactor()](#understanding-the-blade-view-model-blade-initialization-ko-reactor)


<a name="understanding-the-blade-view-model"></a>
# Understanding the blade view model

The portal uses a view model abstraction to allow extensions to author UI in the portal. This allows extensions to deal with data
and manipulate UI without worrying about the differences in DOM events across browsers or having to remember to include the right
accessiblity attributes (these are encapsulated in the widgets provided by the portal). Remember the architecture of portal puts
the DOM in an iframe controlled by the portal (the 'shell' iframe) and extension in a separate iframe (the 'extension' iframe).
The shell iframe and the extension iframe communicate through view models (often using knockout observable values). It's important
for you as an extension author to understand these interactions because they will have a performance impact on the blades you create.

We'll start with the blade view model. When a blade is opened by the user the portal will call into the iframe for the extension
that owns the blade and request the view model for that blade. That blade view model will be composed of
other view models like textbox view models, button view models & other widgets. These widget view models are the way the extension
communicates with user  (by displaying or collecting information). The blade view model handles plumbing the data to and from
the widget view models and coordinates the interactions between the widgets on the blade.

To help you understand what code belongs where we'll look at a simple example blade. The blade will load a person object from the
server and display it to the user in some readonly textboxes. To make the scenario more dynamic we won't show a textbox for the
person's smartphone if the string is empty. Our UI will either look like this:

![Person](../media/portalfx-blade-viewmodel/SmartPhone.png)

Or this:

![Person no smartphone](../media/portalfx-blade-viewmodel/NoSmartPhone.png)

For reference here are the properties we'll put on the blade view model to create this blade:

```typescript

/**
 * Textbox control containing the user's name.
 */
public nameTextBox: TextBox.ViewModel;

/**
 * Observable containing either a numeric textbox or a textbox.
 */
public smartPhone: KnockoutObservable<TextBox.ViewModel>;

/**
 * OK button for submitting updated user data back to server.
 */
public okButton: Button.Contract;

/**
 * EntityView containing the person being edited
 */
private _view: MsPortalFx.Data.EntityView<Person, any>;

```

One important thing to note here is the EntityView object is named `_view`. The reason for this is it's not directly used in the
rendering of the blade (it doesn't appear in the blade template) and thus does not need to be proxied to the shell iframe. The
proxied observable layer does not transfer private members of the blade view model (properties whose name starts with an underscore)
to the other iframe. If you are not careful about what data you are proxing to the shell you can cause greatly slow down the
performance of your blade.

The template for this blade is:

```xml

<div data-bind="pcControl: nameTextBox"></div>
<div data-bind="pcControl: smartPhone"></div>
<div data-bind="pcControl: okButton"></div>

```

(As an aside we generally recommend using a section control to layout your controls rather than directly putting them in the
template like we've done above because it provides default styling and an easier way to deal with dynamically adding/removing
control but doing it this way is useful for this example)

<a name="understanding-the-blade-view-model-blade-initialization"></a>
## Blade initialization

<a name="understanding-the-blade-view-model-blade-initialization-blade-constructor"></a>
### Blade constructor

When a blade is opened the first thing that happens is the portal creates a blade with loading UI and shows it to the users while
the view model for the blade is requested from the extension. The first thing that happens in the extension is the constructor
for the blade view model will run. This is the place to create view models for your UI and do as much initialization as you can.
In our example we know we'll always need a readonly textbox for the name and a OK button to close the blade so we'll create those
now. Note we don't know what the value of the name textbox will be yet (we'll only  know that after the data is retrieved) but
we can still create the textbox now and update the value later because the `value` property of the textbox view model is observable.
Here's what our blade view model constructor looks like:

```typescript

this._view = dataContext.personData.peopleEntities.createView(container);

this.nameTextBox = new TextBox.ViewModel(container, {
    readOnly: true,
    label: ko.observable("Name"),
});

this.smartPhone = ko.observable<TextBox.ViewModel>();

this.okButton = Button.create(container, {
    text: "OK",
    onClick: () => {
        container.closeChildBlade();
    },
});

```

This is where it's important to understand the different between observables and non-observable. Observable values can be updated
after their creation. Any properties that are not observable cannot be *observably* updated after the proxied observable layer has
mirrored the view model in the other iframe. That means you could write code like:

```ts
viewModel.readonly = false;
```

But this new value will never be propogated to the shell side and thus will never take effect. However if you write a new value to
an observable:

```ts
viewModel.value("updated");
```

The proxied observable layer will be notified of the change in the value and will reflect the change in the other iframe. Let's take
a look at what we did and didn't make observable in our constructor (remember changes to non-observable values won't show up in the
shell iframe). Only one of the properties on the blade, `smartPhone`, is an observable. The others are non-observable
values because, even though we might update properties on the `nameTextBox` for example , we won't remove or replace the actual textbox
view model itself. It's value is static for the lifetime of the blade. With `smartPhone` however we won't know if we want to create
the textbox control until we get the data (after the `onInputsSet` function finishes running) so we need to make the property observable.

The same applies for properties on widget view models. For example, when we create the `okButton` view model we specify a static string
for the `text` property. Since it is not an observable value we won't be able to update the button text later. If you look at the
type signature for the `text` property however you'll see it is a union type. It accepts both a `string` and a `KnockoutObservable<string>`.
In case we want to revisit the decision of making the property dynamic or such that it can be updated later then we can achieve that by
defining an observable at construction time:

```ts
this._buttonText = ko.observable("OK");
this.smartPhone = new SimpleButton.ViewModel(container, {
    text: this._buttonText,
    ...
});
```

And then at any point later updated the text by writing to that observable:

```ts
this._buttonText("New button text");
```

The question then becomes 'why not make every property observable just in case you want to update it later?'. The reason is performance.
Using an observable string instead of a string increases the size of your view model. It also means the proxied observable layer has
to do extra work to hook up listeners to the observable in case it is ever updated. Both these things will hurt your blade reveal
performance for literally no benefit if you never update the observable. Anywhere you can provide an observable or non-observable value
you should provide the non-observable value if possible. (Unfortunately there are still many places where framework view models
accept only observable values so you must provide an observable even if you never plan on updating the value. We are currently working
on that).

<a name="understanding-the-blade-view-model-blade-initialization-blade-oninputsset"></a>
### Blade onInputsSet

When the input values for your blade are ready the framework will call your onInputsSet method. This is often when you'll fetch the
data for blade and update the view models you created in your constructor. When the promise you return from the onInputsSet method
is resolved your blade is considered 'loaded' the loading UI will be removed from your blade. Here's the code for our example's
onInputsSet method:

```typescript

return this._view.fetch(inputs.id).then(() => {
    const person = this._view.data;

    // populate name textbox value
    this.nameTextBox.value(person.name());

    // if smartphone has a value create a control to display it
    // otherwise leave it empty
    const smartPhone = person.smartPhone();
    if (smartPhone) {
        const textBox = new TextBox.ViewModel(this._container, {
            readOnly: true,
            label: ko.observable("Smart phone"),
            defaultValue: ko.observable(smartPhone),
        });
        this.smartPhone(textBox);
    }
});

```

Based on the inputs provided to us by the framework we'll start a `fetch()` to get data from the server. The return value for our
onInputSet is the promise returned to us by the fetch call because our blade is ready to be displayed as soon as the data is loaded.
We also hook up a `then()` on the fetch promise so we can populate the dynamic pieces of our blade.

The first thing we do is update the value of the name textbox with the name of the person we got from the server by writing to the
`value` observable on the textbox. If we hadn't marked the textbox as read only we could also subscribe to the value observable and
observe any changes the user makes to the textbox in the subscription callback.

The other thing we do is decide whether or not to populate the blade's `smartPhone` observable with a textbox view model. Observables
aren't limited to just primative types. When the textbox view model is written to the `smartPhone` observable the `pcControl` binding
handler in the blade template observes the new view model and constructs a textbox widget. If we don't populate the observable the
`<div>` in our template stays empty and nothing is displayed on the blade.

As mentioned before there are other cases besides optional UI elements for populating an observable (or the section control's
`children` observable array). The grid control, for example, has a boolean option in it's constructor that controls whether column headers
should be shown or not. Since it's not an observable boolean this can't be changed after the grid view model is created. If this
decision depends on some data that you get from the server you'll have to delay constructing the grid until you know that information.
If proxied observables has already frozen your view model by the time you get your data you can get around this restriction by putting
the grid view model in an observable.

<a name="understanding-the-blade-view-model-blade-initialization-best-practices-when-using-observables"></a>
### Best practices when using observables

* Proper naming of view model properties
  - The easiest thing you can do to improve performance is make sure proxied observables is
not copying data to the shell that is only needed in the extension iframe. The shell will warn you when it sees certain types of
objects (like an editscope) being sent to the shell but it can't guard against everything. It is on the extension author to review
their view model and ensure the right data is public vs private. Any private member name should start with an underscore so that
proxied observables knows not to send the property to the shell.

* Avoid observables when possible
  - As mentioned above it is much more efficient and performant to use non-observables values.
Whenever possible specifying a string instead of a KnockoutObservable<string> or a boolean instead of a KnockoutObservable<boolean>
will improve performance. The performance between transfering a single string and KnockoutObservable<string> isn't huge but if
a blade can make tens or hundreds of such savings they will add up.

* Efficient mutation of observable arrays
  - While doing:

  ```ts
  let numbers = ko.observable([]);
  for (i = 0; i < 100; i++) {
      numbers.push(i);
  }
  ```

  and

  ```ts
  let tempArray = [];
  for (i = 0; i < 100; i++) {
      tempArray.push(i);
  }
  let numbers = ko.observable(tempArray);
  ```

  Might look more or less equivalent the first example above can lead to SEVERE performance problems. In terms of observable
  changes the first example queues 100 observable updates of one item each. The second example queues a single observable update
  with 100 items.

  This is obviously a fictional example but let's say we were pushing data points to a series displayed on a chart that had
  auto-scaling of it's axes turned on. Let's assume it takes 0.01 seconds to render an extra data point but 0.5 seconds to
  recalcuate the scale of the x-axis and the y-axis every time the data is updated.

  In this case the first example would take 100 * (0.01 + 0.5) = 51 seconds to process all the changes. The second example
  would take (100 * 0.01) + 0.5 = 1.5 seconds to process the changes. That is a *3400% difference*. Again, this is a made up
  example but we have seen this mistake made by extension authors again and again that results in real performance problems.

  This is such a common problem the framework attempts to detect when an extension writes this type of code and warns them
  with the message:

  Performance warning: A proxied observable array is mutated inefficiently.

  Generally this means you have somewhere in your code doing a repeated push() on an observable array (although there are a few
  other inefficient array mutations it attempts to catch). If you ever see this warning in the console please take them time
  to figure out what is going on and address the issue.

<a name="data-pureComputed">
<a name="understanding-the-blade-view-model-blade-initialization-ko-purecomputed"></a>
### ko.pureComputed()

You might have noticed unlike `ko.reactor` or knockout's observable subscribe method the portal's version of the knockout
`pureComputed()` has not been modified to take a lifetime manager. Knockout has some good documentation on pureComputeds
[here](http://knockoutjs.com/documentation/computed-pure.html) but in a nut shell
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

<a name="understanding-the-blade-view-model-blade-initialization-ko-reactor"></a>
### ko.reactor()

Any observables read in the function passed to `ko.reactor()` will become a dependency for that reactor and the reactor will recompute
whenever *any* of those observable values change. The same goes for `ko.pureComputed()` and the observable array's `map()` and `mapInto()`
functions (for map and mapInto this information is covered in more detail [here](portalfx-data-projections.md#shaping-and-filtering-data)). This can very easily lead to a situation
where a computed is recalculating at times you never intended. Whenever you write a pureComputed or a reactor it's always a good idea
to put a breakpoint in the computed function and see when and why. We have seen computed functions that should run once actually run
30+ time and waste CPU time recalcuating things that didn't need to be recalculated. If another computed takes a dependency on that computed
the problem grows expontentially.

This is actually such a common problem the framework has code that attempts to detect problematic computed functions. When a computed
is created that has dependencies on 30 or more other observables the shell will output an error to the console. This should be an
indication to the extension author the computed has likely picked up unnecessary dependencies and is wasting time recomputing when
those dependencies change.

There are a few strategies you can use to ensure your computed only calculates when you intend it to:

* Try to avoid calling other functions in your computed method. When the entire implementation of the computed is visible in one place
it's not too hard to scan the code and figure out what observables are dependencies of the function. If you write something like:

```ts
let computed = ko.pureComputed(() => {
    let foo = this.foo();
    this._processfoo(foo);
});
```

And `_processFoo()` calls three more helper methods it becomes a lot of work to figure out which observables will cause `computed()` to
recalculate.

* Use the explicit dependency overload of ko.reactor()/ko.pureComputed(). There is an overload of those functions that takes as a second
parameter a list of observables to subscribe to. When this overload is used an observable that is read is the computed function will
not become a dependency. No matter what code is called inside the body of the computed you can be sure it will only recalculate when
the observables you listed as dependencies are changed.

* Use ko.ignoreDependencies() inside your computed function. Doing:

```ts
let computed = ko.reactor(lifetime, () => {
    let foo = this.foo();
    let bar = this.bar();
    ko.ignoreDependencies(() => {
        this._processFoo(foo, bar);
    });
});
```

Is equivalent to doing:

```ts
let computed = ko.reactor(lifetime, [this.foo, this.bar], (foo, bar) => {
    this._processFoo(foo, bar);
});
```

(The second just looks a lot cleaner).

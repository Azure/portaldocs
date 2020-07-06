<a name="memory-management-and-lifetimemanager"></a>
## Memory Management and LifetimeManager

<a name="memory-management-and-lifetimemanager-memory-management-and-the-dispose-api-pattern"></a>
### Memory Management and the <code>dispose()</code> API pattern

Although garbage-collected languages simplify application and service development, opportunities remain for memory leaks in modern systems.  To mitigate, the `dispose()` API pattern was developed to allow components to _**release resources**_ when they are destroyed/disposed.

Applied to the Blade and Part programming model:

- The FX itself (that is, the Ibiza "Shell") is the party that _**instantiates extension Blade / Part classes**_ as the user navigates.
- When the user navigates away from these same Blades/Parts, the Shell _**disposes the corresponding extension-authored Blade and Part classes.**_

Not surprisingly, at a high level, the responsibility of the extension-authored Blade/Part class is to release its resources in response to a "dispose" callback.  As a sketch:

```
@TemplateBlade.Decorator(…)
export class MyBlade {
    private _someOtherComponent: OtherComponent;

    public dispose() {
        this._someOtherComponent.dispose();
    }
}
```

A practical example of "releasing resources" here, for instance, might be to dispose subscriptions to Knockout observables for those observables that live longer than a single Blade or Part. Using unmodified KnockoutJS (in early versions of the Azure Portal SDK), this would look like:

```
this._customerNameSubscription = customerName.subscribe(() => { … });
	
…
	
public dispose() {
	this._customerNameSubscription.dispose();
}
```

<a name="memory-management-and-lifetimemanager-the-problem"></a>
### The problem

Seems simple and straightforward, right?
There is one problem here though. Put simply, developers forget to call "dispose()" for components they instantiate.

But why is this important to Azure Portal users?
Well, since there are over 130 teams developing UI for the Azure Portal, left unmitigated, the likelihood of memory leaks is a near certainty, and the cost of diagnosis is very high to find the leak among 130 teams' code. Likewise, since we want users to spend hours in the same Azure Portal session, memory leaks compound over time and do impact Azure Portal perf/responsiveness.

So, the question posed early in the development of the Azure Portal became "How can we help extension developers who forget to call `dispose()`?"

<a name="memory-management-and-lifetimemanager-the-solution-lifetimemanager"></a>
### The Solution - LifetimeManager

The answer we identified is actually quite simple.
We asked the question - "As an FX, can we turn forgetting to call `dispose()` into a _**compile-time error**_?".  As it turns out, we can do just that for nearly all cases that extension developers encounter.

You'll notice that:

- _**All FX Control classes**_ accept a `LifetimeManager` as their constructor/factory's first parameter.

- _**Most KnockoutJS factory methods**_ (`ko.computed(…)`, `observable.subscribe(…)`, etc.) have been modified in the FX to similarly accept a `LifetimeManager` parameter

If an extension developer (or even an FX developer) forgets to supply this `LifetimeManager`-typed parameter, they'll encounter a conventional TypeScript compiler error, alerting them to correct their call site to include the `LifetimeManager` parameter.

With this solution, _**extensions no longer have to call `dispose()` manually/explicitly**_ (except in advanced scenarios described later).  Rather, internally FX components register for an `dispose` callback.  To illustrate, our modified version of KnockoutJS behaves like so:

```
this._customerNameSubscription = customerName.subscribe(lifetime, () => { … });
	
…
	
// KnockoutJS impl
function subscribe(lifetime: LifetimeManager, callback: (newValue) => void): Subscription {
    subscriptions.push(callback);
    lifetime.registerForDispose({
        dispose: () => { subscriptions.remove(callback); }
    });
}
```

With this:

1. To render a Blade/Part, the FX/Shell instantiates a `LifetimeManager` corresponding to the Blade/Part's lifetime.

1. The FX/Shell supplies the `LifetimeManager` to the extension's Blade or Part class as the Blade's/Part's `container` API (this `container` contains extra methods unrelated to lifetime/disposal).

1. The Blade or Part class supplies the `LifetimeManager` to other FX constructors/factories as it develops its view.

1. When the Blade/Part is disposed, the FX/Shell calls `lifetimeManager.dispose()` to trigger the cascade of `dispose` callbacks to components instantiated in (3).

<a name="memory-management-and-lifetimemanager-advanced-lifetime-scenarios"></a>
### Advanced lifetime scenarios

Steps (1)-(3) above cover nearly all Blade/Part scenarios.  That said, there are advanced Blade/Part scenarios that deserve extra treatment.

In uncommon cases, Blades (and, less commonly, Parts) change their UI/view dynamically based on user interaction within the Blade/Part.  In such cases, a Blade might dispose controls A, B, C and replace them in the view with controls D, E, F.  To ensure that control A/B/C's resources are released, the extension might make use of a "child `LifetimeManager`":

```
private _childLifetime: DisposableLifetimeManager;

public onInitialize() {
    const childLifetime = this._newChildLifetime();
    this._controlA = TextBox.create(this._childLifetime, { … });
    this._controlB = CheckBox.create(this._childLifetime, { … });
    this._controlC = Button.create(this._childLifetime, { … });
    …
}

public onButtonClick() {
    const childLifetime = this._newChildLifetime();
    this._controlD = Grid.create(this._childLifetime, { … });
    this._controlE = DropDown.create(this._childLifetime, { … });
    this._controlF = Chart.create(this._childLifetime, { … });
}

private _newChildLifetime(): LifetimeManager {
    if (this._childLifetime) {
        this._childLifetime.dispose();
    }

    const bladeLifetime = this.context.container;
    this._childLifetime = bladeLifetime.createChildLifetime();

    return this._childLifetime;
}
```

Here, the extension developer is saved the burden of manually disposing all these Controls, as this is responsibility is relegated to `LifetimeManager`.  This covers not only the case of switching views from A/B/C to D/E/F, but also the case where the Controls should be disposed (regardless of the state of the view) when the Blade itself is disposed.  Being a "child `LifetimeManager`" of the Blade's lifetime, above, `this._childLifetime` is itself disposed implicitly when the Blade's lifetime is disposed (when the user closes the Blade).
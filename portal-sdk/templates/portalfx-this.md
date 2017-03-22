
# 'this' context

You're probably here because you saw the following warning when using a function in a knockout binding :

```
The 'function' function is being invoked with a different 'this' context than the viewmodel it was declared on.
```

An example causing this scenario to happen would be the following html code :

```html
<ul data-bind="foreach: myButtons">
    <li>    
        <button data-bind="text: displayName, click: $parent.buttonClickHandler"></button>
        Number of clicks: <strong data-bind="text: clicked"></strong>
    </li>
</ul>
```

As you can see here, we are trying to use a click handler from our part/blade viewmodel on each item of a collection.  
Since knockout's 'foreach' binding changes the binding context, we use the '$parent' property to point to our blade/part's viewmodel and use our selectTemplate click handler.

Here are different ways to declare our click handler and the difference between them (see 'buttonClickHandler', 'buttonClickHandler2', 'buttonClickHandler3' and 'buttonClickHandler4').

```ts
/**
 * Example view model for a custom part
 */
export class ExampleCustomPartViewModel {
    /**
     * Constructs an instance of the custom part view model.
     */
    constructor(container: MsPortalFx.ViewModels.PartContainerContract, initialState: any, dataContext: PartsArea.DataContext) {
        let that = this;
        this.buttonClickHandler4 = function() {
            this.clicked(this.clicked() + 1);
            that.totalClicked(that.totalClicked() + 1);
        };
    }

    public myButtons = ko.observableArray([
        {
            displayName: ko.observable("First button"),
            clicked: ko.observable(0)
        },
        {
            displayName: ko.observable("Second button"),
            clicked: ko.observable(0)
        }
    ]);

    public totalClicked = ko.observable(0);

    public buttonClickHandler = function () {
        this.clicked(this.clicked() + 1);
    };

    public buttonClickHandler2() {
        this.clicked(this.clicked() + 1);
    };

    public buttonClickHandler3 = () => {
        this.totalClicked(this.totalClicked() + 1);
    };
    
    public buttonClickHandler4: () => void;
}
```

## public buttonClickHandler

The first implementation uses a function as a member of the part's viewmodel.  
Inside the function, 'this' will be the viewmodel of the clicked 'myButton' button.  
This way, you can access the properties of the clicked button inside your click handler.

## public buttonClickHandler2

The second implementation uses a function on the prototype of the part's viewmodel.  
For all intents and purposes, this implementation has the same effects as the first one.

## public buttonClickHandler3

The third implementation uses an arrow function as a member of the part's viewmodel.  
Arrow functions in Typescript are modeled after [ES6 arrow functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions), which automatically replaces the 'this' inside your function by a reference to the 'this' outside of your function, i.e. your part's viewmodel.  
As such, the 'this' inside the arrow function is your instance of 'ExampleCustomPartViewModel', so we can access its properties like 'totalClicked'.

## public buttonClickHandler4

The fourth implementation uses a function as a member of the part's viewmodel that is declared in the constructor.  
This implementation can be used if you need both a reference to the clicked viewmodel and a reference to the part's viewmodel; you can save a reference to the 'this' representing the part and use it in your click handler.


# Widget context

Please note that if you are in a scenario where you're trying to bind html inside a widget to a function on your part/blade viewmodel, you can use the '$root' property like this :

```ts
// Declare my click handler
this.labelClick = () => this.labelSelectable.isSelected(true);

// Set my click handler as an <a> tag 'click' binding on the label of my textbox
this.lastNameModel = new Forms.TextBox.ViewModel(container, this, "lastName", {
    label: ko.observable<string>("Choose your last name (click here for more <a href data-bind='click: $root.labelClick'>info</a>)"),
    subLabel: ko.observable<string>(ClientResources.tryCara)
});
```
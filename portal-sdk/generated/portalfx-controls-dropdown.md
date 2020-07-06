<a name="dropdown"></a>
## DropDown
The AMD dropdown has all the features of the old dropdowns. You can now turn on filtering or add grouping to a multiselect dropdown where previously adding a featuring might mean porting your code to a different control (or 
wasn't possible depending on combination of features you were looking for). 

The AMD dropdown supports:
- Grouping
- Rich Templating
- Filtering 
- Custom Filtering
- Multiselect
- Objects as the value

You can use it by importing the AMD module:

```typescript
import * as DropDown from "Fx/Controls/DropDown";
```

Creating the view model: 

```typescript
// Items to popuplate the dropdown with.
let myItems = [{
    text: "Sample text",
    value: "SampleValue"
}, {
    text: "Sample text 2",
    value: "SampleValue2"
}];

this.dropDownVM = DropDown.create(container, {
   items: myItems
});
```

<a name="features"></a>
## Features

<a name="features-grouping"></a>
### Grouping
Grouping is simple by expanding the dropdown item with a group type. 
 
 ###### Group type example
```typescript
let myItems = [{
    text: "Sample header text",
    children: [{
        text: "Sample text",
        value: "SampleValue"
      }, {
          text: "Sample text 2",
          value: "SampleValue2"
      }]
}]
```

You are able to group multiple groups together to create a nested layout.

<a name="features-filtering-searching"></a>
### Filtering / Searching
For large list of items you are able to turn on `filtering: true` to enable searching.

```typescript
this.dropDownVM = DropDown.create(container, {
   items: myItems,
   filter: true
});
```

<a name="features-filtering-searching-filterplaceholder"></a>
#### filterPlaceholder
Popuplates the search both with a placeholder, overwrites the `placeholder` property on the dropdown.. 

```typescript
this.dropDownVM = DropDown.create(container, {
   items: myItems,
   filter: true,
   filterPlaceholder: "Search items"
});
```

<a name="features-multiselect"></a>
### Multiselect
When you need multiple items selected we support `multiselect: true` to allow this. We will then show items selected as "X selected". The multiselect dropdown doesn't use `placeholder`, use below `multiItemDisplayText`.

```typescript
this.dropDownVM = DropDown.create(container, {
   items: myItems,
   multiselect: true
});
```

<a name="features-multiselect-multiitemdisplaytext"></a>
#### multiItemDisplayText
If you want to change the format of the default text, you may set `multiItemDisplayText`. Include a {0} in the replaced string if you want to include the number of items selected.

```typescript
this.dropDownVM = DropDown.create(container, {
   items: myItems,
   multiselect: true,
   multiItemDisplayText: "{0} subscriptions"
});
```

<a name="features-filter-multiselect"></a>
### Filter &amp; Multiselect
The dropdown supports both filtering & multiselect states to be active. The filter textbox will move into the dropdown.

```typescript
this.dropDownVM = DropDown.create(container, {
   items: myItems,
   filter: true,
   multiselect: true
});
```

<a name="features-rich-templating"></a>
### Rich Templating
The dropdown supports both filtering & multiselect states to be active. The filter textbox will move into the dropdown.

```typescript
let myItems = [{
        text: "<b>G1</b> - large"
        value: "large"
    },{
        text: "<b>G2</b> - small"
        value: "small"
}];

this.dropDownVM = DropDown.create(container, {
   items: myItems
});
```

<a name="features-placeholder"></a>
### Placeholder
Adds a default string to show if nothing is selected.'

```typescript
this.dropDownVM = DropDown.create(container, {
   items: myItems,
   placeholder: "Select an item"
});
```

<a name="features-ispopupopen"></a>
### isPopUpOpen
This a readonly observable which you can subscribe to know when the dropdown is opened/closed. Useful for delay loading your items they are popuplated from an expensive ajax call.

```typescript
this.dropDownVM.isPopUpOpen.subscribe(container, (opened) => {
    if (opened) {
        // make your expensive call here.
    }
});
```

<a name="accessibility"></a>
## Accessibility
We handle most accessibility, one important note though is if you use an html template or image binding in your item text. You need to add an ariaLabel on that item.


<a name="need-to-migrating-to-this-control"></a>
## Need to migrating to this control?
Check out the documentation here: 
https://github.com/Azure/portaldocs/blob/dev/portal-sdk/templates/portalfx-controls-dropdown-migration.md

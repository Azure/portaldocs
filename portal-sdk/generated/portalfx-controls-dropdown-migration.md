View full documentation for the AMD dropdown here: https://github.com/Azure/portaldocs/blob/dev/portal-sdk/templates/portalfx-controls-dropdown.md

<a name="migrating-from-older-dropdown-controls"></a>
### Migrating from older dropdown controls
The biggest reason to replace usage of the older dropdown controls with the AMD dropdown is that all the features
of the other dropdowns are now present in the AMD dropdown. You can now turn on filtering or add grouping to a 
multiselect dropdown where previously adding a featuring might mean porting your code to a differen control (or 
wasn't possible depending on combination of features you were looking for). The AMD dropdown supports:

- Grouping
- Rich Templating
- Filtering 
- Custom Filtering, this also gives you a hook to replace items on keystroke.
- Multiselect
- Objects as the value

<a name="this-applies-to-upgrading-the-following-controls-to-the-new-amd-dropdown-pattern"></a>
### This applies to upgrading the following controls to the new AMD dropdown pattern

```typescript
    MsPortalFx.ViewModels.Obsolete.Forms.DropDown
    MsPortalFx.ViewModels.Obsolete.Forms.FilterComboBox
    MsPortalFx.ViewModels.Obsolete.Forms.GroupDropDown
    MsPortalFx.ViewModels.Obsolete.Forms.MultiSelectDropDown
```

<a name="how-to-convert-to-a-new-dropdown-_if-you-bind-your-multiselectdropdown-to-an-editscope-observable_"></a>
### How to convert to a new DropDown <em>if you bind your MultiSelectDropDown to an EditScope observable</em>

Using EditScope looked something like this (with "multiSelectDropDownValue"  being a path to an observable in the EditScope):

```typescript
    this.myMultiSelectDropDown = new MultiSelectDropDown.ViewModel(this._container, this, "multiSelectDropDownValue", {
        ...
    });
```

or if you're using an EditScopeAccessor:

```typescript
    MultiSelectDropDown.ViewModel(this._container, this, this.createEditScopeAccessor<string>((data) => { return data.multiSelectDropDownValue; }), {
        ...
    });
```

You can simple change switch to the DropDown like this by adding this import:

```typescript
    // Add this import @ the top of the file
    import * as DropDown from "Fx/Controls/DropDown";
```

Add the property to your Blade view model:

```typescript
    /**
    * View model for the drop down control.
    */
    public dropDown: DropDown.ViewModel<string>; 
```

And finally switch over to: 

```typescript
    this.dropDown = new DropDown.ViewModel(container, this, "multiSelectDropDownValue" {
    	label: ClientResources.multiSelectDropDownSingleSelectLabel,
    	infoBalloonContent: ko.observable(ClientResources.multiSelectDropDownInfoBalloon),
    	items: items,
    });
```

Or if you're using the EditScopeAccessor:

```typescript
    this.dropDown = new DropDown.ViewModel(container, this, this.createEditScopeAccessor<string>((data) => { return data.multiSelectDropDownValue; }) {
    	label: ClientResources.multiSelectDropDownSingleSelectLabel,
    	infoBalloonContent: ko.observable(ClientResources.multiSelectDropDownInfoBalloon),
    	items: items,
    });
```


Now, follow the rest of the instructions below, which shows how to add multiselect and filtering to your new DropDown.

-----------------------------------------------------------------

<a name="how-to-convert-to-a-new-dropdown-_if-you-do-not-bind-your-multiselectdropdown-to-an-editscope-observable_"></a>
### How to convert to a new DropDown <em>if you do not bind your MultiSelectDropDown to an EditScope observable</em>

If your MultiSelectDropDown doesn’t make use of an EditScope, then you’ll convert to a DropDown using new form field APIs that were designed to be EditScope-less.  Beyond this MultiSelectDropDown->DropDown scenario, we recommend these new EditScope-less form field APIs _when developing entirely new Blades_.

Your MultiSelectDropDown would look something like this:
```typescript
    /**
    * View model for the multiselect drop down control.
    */
    public multiSelectDropDownVM: MultiSelectDropDown.ViewModel<string>;
        
    const items: MsPortalFx.ViewModels.Forms.ISelectableOption<string>[] = [
    	{ text: ko.observable("Item 1"), value: "Value 1" },
    	{ text: ko.observable("Item 2"), value: "Value 2" },
    	{ text: ko.observable("Item 3"), value: "Value 3" },
    	{ text: ko.observable("Item 4"), value: "Value 4" },
    ];

    this.oldMultiSelectDropDownVM = new MultiSelectDropDown.ViewModel<string>(container, {
    	label: ko.observable(ClientResources.multiSelectDropDownLabel),
    	groups: ko.observableArray<MsPortalFx.ViewModels.Forms.IGroup<string>>([
    		<MsPortalFx.ViewModels.Forms.IGroup<string>>{
    			options: ko.observableArray<MsPortalFx.ViewModels.Forms.ISelectableOption<string>>(items)
    		}
    	]),
    	validations: ko.observableArray([
    		new MsPortalFx.ViewModels.RequiredValidation(),
    		new MsPortalFx.ViewModels.ContainsValidation("Value 1")
    	])
    });
```

You'll modify your code to look something like:

New import:
```typescript
    // Add this import @ the top of the file
    import * as DropDown from "Fx/Controls/DropDown";
```

Add the property to your Blade view model:
```typescript
    /**
    * View model for the drop down control.
    */
    public dropDown: DropDown.Contract<string>;
```

Then inside your constructor: 
   
```typescript
     const items = [ 
        { text: ko.observable("Item 1"), value: "Value 1" },
        { text: ko.observable("Item 2"), value: "Value 2" },
        { text: ko.observable("Item 3"), value: "Value 3" },
        { text: ko.observable("Item 4"), value: "Value 4" },
     ];

    // New basic drop down 
    this.dropDown = DropDown.create<string>(container, {
    	label: ClientResources.multiSelectDropDownSingleSelectLabel,
    	infoBalloonContent: ko.observable(ClientResources.multiSelectDropDownInfoBalloon), 
    	items: items, 
    });
```

-----------------------------------------------------------------
<a name="add-multi-select-functionality-to-your-new-dropdown"></a>
### Add multi-select functionality to your new DropDown

Just add `multiselect: true` to your options in the create call like this:

```typescript
    // DropDown with multiselect
    this.dropDown = DropDown.create<string>(container, {
    	...
    	multiselect: true,
    	selectAll: true // Optional, adds a select all checkbox to the top of the dropdown popup.
    });
```

-----------------------------------------------------------------
<a name="add-filtering-functionality-to-your-new-dropdown"></a>
### Add filtering functionality to your new DropDown

Just add `filter: true` to your options in the create call like this:
  
```typescript
    // DropDown with filtering
    this.dropDown = DropDown.create<string>(container, {
        ...
        filter: true,
        filterPlaceholder: ClientResources.fitlerPlaceholder,   // Optional if you want placeholder text in the filter text box.
    });
```

-----------------------------------------------------------------
**Notes:**
 - You can mix filtering/multiselect to have a filterable multiselect DropDown.
 - When multi-select is true, the 'value' property of your DropDown view model (that is, `dropDown.value`) is no longer a semicolon-separated string. Rather, it's of type `TValue[]`, where `TValue` is the generic type argument supplied to `DropDown.create<TValue>`.


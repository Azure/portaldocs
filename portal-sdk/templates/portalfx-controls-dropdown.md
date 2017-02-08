## DropDown
We've had several version of the dropdown control but have asked partners to standardize on the AMD dropdown control.
You can use it by importing the AMD module:

```
import * as DropDown from "Fx/Controls/DropDown";
```

creating the view model:

```
var dropDown = new DropDown.ViewModel(ltm, {...});
```

and then inserting it into a section or your HTML template via the pcControl binding. You can see it running
in samples extension [here](http://aka.ms/portalfx/samples#blade/SamplesExtension/DropDownInstructions/selectedItem/DropDownInstructions/selectedValue/DropDown).

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
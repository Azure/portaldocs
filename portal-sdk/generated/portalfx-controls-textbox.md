<a name="textbox"></a>
## Textbox

The Textbox control provides an easy way allow users to input data.

You can use it by importing the module:
```
import * as TextBox from "Fx/Controls/TextBox";
```

Then creating the view model:
```
public textBox: TextBox.Contract;

this.textBox = TextBox.create(container, {
    label: "someLabel"
    //Other options...
});
```

And then either:
- inserting it as a member of a Section, or
- including it in an HTML template via a 'pcControl' binding.
You can see examples running in SamplesExtension [here](http://aka.ms/portalfx/samples#blade/SamplesExtension/Textboxblade) along with the source code here: `SamplesExtension\Extension\Client\V2\Controls\TextBox\TextBoxBlade.ts`.


<a name="migrating-from-older-textbox"></a>
## Migrating from older <code>TextBox</code>:

The `MsPortalFx.ViewModels.Controls.Forms.TextBox` control is being deprecated. When you update your Ibiza SDK to a newer version, you will see compile-time errors reflecting this.

Here are the steps you can take to replace your use of this deprecated control with the new, recommended `TextBox` control in the `'Fx/Controls/TextBox'` module.


**1. Please update the `Textbox` with the new namespace**

Old code:
```
const textBoxVM = new MsPortalFx.ViewModels.Controls.Forms.TextBox.ViewModel(lifetimeManager, {...// Options goes here});
```
New code:
```
import * as TextBox from "Fx/Controls/TextBox";
const textBoxVM = TextBox.create(lifetimeManager, {...// Options goes here});
```

**2. Please update with the new properties, especially `TextBox.ViewModel.placeholder` and `TextBox.ViewModel.events.enterPressed`**

**For `TextBox.ViewModel.placeholder`**

Old code:
```
textBoxVM.placeHolder("PlaceHolder text goes here");
```

New code:
```
const textBoxVM = TextBox.create(lifetimeManager, {
    placeHolderText: "PlaceHolder text goes here",
    //other options goes here…
});

//or

textBoxVM.placeHolderText("PlaceHolder text goes here");
```

**For `TextBox.ViewModel.events.enterPressed`**

Old code:
```
textBoxVM.events.enterPressed = (value: string): void => {
    // Functions goes here...
    let enterPresseded: boolean = true;
};
```

Move it to `TextBox.ViewModel.onEnterPressed`

New code:
```
const textBoxVM = TextBox.create(lifetimeManager, {
    onEnterPressed: (value: string) => {
        // Functions goes here...
        let enterPresseded: boolean = true;
    }
});
```
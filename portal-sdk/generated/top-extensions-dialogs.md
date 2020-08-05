* [Dialogs](#dialogs)
    * [When to use dialogs](#dialogs-when-to-use-dialogs)
    * [The dialog API](#dialogs-the-dialog-api)
    * [Dialogs with custom buttons](#dialogs-dialogs-with-custom-buttons)
    * [Displaying complex scenarios in dialogs](#dialogs-displaying-complex-scenarios-in-dialogs)
    * [Targeting the dialog at a specific element or cssSelector](#dialogs-targeting-the-dialog-at-a-specific-element-or-cssselector)
    * [Positioning the dialog when targeting](#dialogs-positioning-the-dialog-when-targeting)
    * [Handling the dialog result (onClosed)](#dialogs-handling-the-dialog-result-onclosed)


<a name="dialogs"></a>
# Dialogs

Dialogs allow the developer to display information to the user with very little navigation. Dialogs may be as simple as a short confirmation, or as complex as a form. They can be both targeted and non-targeted, such that they either display at the top of the blade or they display in context of another piece of UI. The following is an image of a non-targeted dialog.

![alt-text](../media/top-extensions-dialogs/dialog-non-targeted.png "Non-targeted dialog")

The following is an image of a targeted dialog.

![alt-text](../media/top-extensions-dialogs/dialog-targeted.png "Targeted dialog")

<a name="dialogs-when-to-use-dialogs"></a>
## When to use dialogs

Dialogs are great to use in cases where an extension requests a confirmation from the user, or if it needs the user to update a small piece of information. Dialogs are more lightweight than context blades; however, if the dialog becomes overloaded, you may want to use a context blade instead.

<a name="dialogs-the-dialog-api"></a>
## The dialog API

Dialogs expose various options that allow developers to customize the dialog experience. To open a dialog, the extension should specify `dialogOptions`. The simplest form of those options is illustrated here:

```typescript

container.openDialog({
    telemetryName: "SimpleDialog",
    title: ClientResources.Dialog.SimpleDialog.title,
    content: ClientResources.Dialog.SimpleDialog.message,
    buttons: DialogButtons.OK,
    onClosed: () => {
        // this callback is invoked when the dialog is closed
        // result.button may be inspected to see which button was clicked.
    },
});

```

The properties for this implementation of the dialog are as follows.

| Property | Definition |
| -------- | ---------- |
| buttons | The buttons to surface to the user. These can be the predefined button combinations that the framework offers, or you can specify your own custom labels, as specified in [#dialogs-with-custom-buttons](#dialogs-with-custom-buttons). |
| content | The string or `htmlContent` to display to the user. |
| onClosed | A callback function that is called when the user closes the dialog by selecting a button. |
| telemetryName | The name that is logged for any telemetry events that occur while the user interacts with the dialog. |
| title | The string that is shown to the user as the title of the dialog. |

This `options` object will be passed by the extension to `container.openDialog(yourDialogOptions)` to open the dialog.

<a name="dialogs-dialogs-with-custom-buttons"></a>
## Dialogs with custom buttons

To specify a dialog with custom buttons, send an array to the `buttons` property in the `dialogOptions`, illustrated here:

```typescript
/**
* Describes a custom button in a dialog
*/
export interface CustomDialogButton {
    /**
    * Display text of the button
    */
    displayText: string;
    /**
    * Button identifier that is programatically passed back
    */
    button: DialogButton;
}
```
```typescript

container.openDialog({
    telemetryName: "DialogWithCustomButtons",
    title: ClientResources.Dialog.CustomButtons.title,
    content: dialogContent,
    buttons: [
        { button: DialogButton.Yes, displayText: ClientResources.Dialog.CustomButtons.sushi },
        { button: DialogButton.No, displayText: ClientResources.Dialog.CustomButtons.nothing, disabled: disableNothingOption },
        { button: DialogButton.Cancel, displayText: ClientResources.Dialog.CustomButtons.pizza },
    ],
    onClosed: (dialogResult) => {
        switch (dialogResult.button) {
            case DialogButton.Yes:
                this.dinnerSelection(ClientResources.Dialog.CustomButtons.sushi);
                break;
            case DialogButton.No:
                // only users over the age of 18 can choose to skip dinner
                this.dinnerSelection("");
                break;
            case DialogButton.Cancel:
                // if the user cancels with escape key they are getting pizza
                this.dinnerSelection(ClientResources.Dialog.CustomButtons.pizza);
                break;
        }
    },
});

```

<a name="dialogs-displaying-complex-scenarios-in-dialogs"></a>
## Displaying complex scenarios in dialogs

In a dialog, if you want to allow the user to pick a value from a slider or interact with some other custom UI, make use of a custom HTML template. You can achieve that by providing an object of type `HtmlContent` to the `content` property in the dialog options.

Here we define our custom dialog `ViewModel`, which only contains a slider control. We then define a simple html template, which is only the control, and specify our `dialogViewModel`:

```typescript

const { container } = this.context;
const dialogViewModel = {
    slider: Slider.createSimpleSlider(container, {
        label: ClientResources.slider,
        max: 10,
        min: 0,
        value: 8,
        ariaLabel: ClientResources.sliderAriaLabel,
    }),
};
const dialogContent: HtmlContent = {
    htmlTemplate: `<div data-bind='pcControl: slider'></div>`,
    viewModel: dialogViewModel,
};

container.openDialog({
    telemetryName: "DialogWithCustomTemplate",
    title: ClientResources.Dialog.Template.title,
    content: dialogContent,
    buttons: DialogButtons.OK,
});

```

<a name="dialogs-targeting-the-dialog-at-a-specific-element-or-cssselector"></a>
## Targeting the dialog at a specific element or cssSelector

If you want to provide context to which the dialog applies, for example, confirming a delete of a certain item, you can supply a CSS selector string or an `FxElement` as the 'target' property on your 'DialogOptions':

When the `fxClick` element is clicked, it generates a `FxElement` which is sent as a parameter to the callback function supplied to `fxClick`:

```typescript

container.openDialog({
    telemetryName: "SimpleDialogWithTargetAndPositionHint",
    title: ClientResources.Dialog.SimpleDialog.title,
    content: ClientResources.Dialog.SimpleDialog.message,
    positionHint: DialogPosition.RightTopEdge,
    target: ".ext-target-simple",
    buttons: DialogButtons.OK,
    onClosed: () => {
        // this callback is invoked when the dialog is closed
        // result.button may be inspected to see which button was clicked.
    },
});

```

To target the location of the `fxClick` the extension defines the `target` property on the `dialogOptions` as `evt.target`, the parameter defined by the `fxClick` onClick handler. The dialog will then open within the context of the element.

To target elements by using a CSS selector, send the specific CSS selector string to the `target` property on the `dialogOptions`.

<a name="dialogs-positioning-the-dialog-when-targeting"></a>
## Positioning the dialog when targeting

When the extension specifies a target, it should also specify where the dialog is displayed,  relative to that target. To do so, you can send a `positionHint` to the `dialogOptions`. The screen positioning will be honored if the space is available; otherwise, it will fallback to an available space.

```typescript
/**
* option hint for requested dialog position. Defaults to BottomLeftEdge.
*/
export const enum DialogPosition {
    TopLeftEdge = 1,
    RightTopEdge = 2,
    BottomLeftEdge = 3,
    LeftTopEdge = 4,
}
```

<a name="dialogs-handling-the-dialog-result-onclosed"></a>
## Handling the dialog result (onClosed)

There are two reasons why the dialog would be closed;

  1. The user has interacted with something else and the framework needs to close it (Auto close)
    - The button result will always be `cancel`
  1. The user has interacted with one of the buttons on the dialog
    - The button result will be the button which the user clicked

When handling the `onClosed` callback you will receive a `DialogResult` object. Within that object is a `button` property, that button property will map to the buttons you previously defined as your button options.

The easiest way to process the options is to use a switch case and have a case for each of the buttons you declared and cancel (due to the auto close). In the example below we have custom buttons declared but they map to the standard button enums. Then in the onClosed callback we will receive the corresponding button as the result.

```typescript

container.openDialog({
    telemetryName: "DialogWithTarget",
    title: ClientResources.Dialog.ColorPicker.title,
    content: {
        htmlTemplate: "<div data-bind='pcControl: colorDropDown'></div>",
        viewModel: dialogViewModel,
    },
    buttons: DialogButtons.OKCancel,

    /**
     * The element or element selector which the dialog will be targeted too
     */
    target,

    /**
     * onClosed is invoked when the dialog closes.   If the user clicks
     * somewhere else in the portal the cancel button is passed to the onClosed callback.
     */
    onClosed: (dialogResult) => {
        if (dialogResult.button === DialogButton.Ok) {
            this.colorSelection(dialogViewModel.colorDropDown.value());
        } else {
            // user pressed cancel or clicked somewhere else outside of the dialog
        }
    },
});

```
<a name="focus-management"></a>
# Focus management

<a name="focus-management-autofocus-handling-by-the-framework"></a>
## Autofocus handling by the framework

The portal performs autofocus management following a default set of rules that covers the navigation usage flow. At the core, the basic rule is to focus the first element in the DOM order once the content is ready. Controls also perform focus management onto themselves.

Portal autofocus will cover these scenarios:

* Initial startup of the page on any deeplink
* Opening/closing content on blade navigation
* Dialog management
* All form control interactions
* Most list and grid control interactions
  * Some delete and addition scenarios aren't going to match the extension desired behavior at times, and will need to be done via programmatic focus.

>**Note:** On blade navigation, autofocus works properly only if extension complete the promise of the `onInitialize()` method of the `container` when the UI is truly initialized. Completing the promise early could lead the focus to land on an unexpected location.

<a name="focus-management-focus-handling-by-extension"></a>
## Focus handling by extension

Despite the portal autofocus behavior, there are cases where extension will need to manage focus programmatically. Such cases include, but aren't limited to:

* A form validation is performed, and the first invalid control should capture the focus.
* A focused element is removed from the UI (ex: deleting a list entry).
* New UI is introduced within the content and contains the next expected interaction area.

It is important to note that focus operations should be performed solely as a result of a user-triggered action. Performing focus operation outside of a user-triggered action will be perceived as a bug. Typical examples of a user-triggered action is clicking a button or a link.

<a name="focus-management-focus-handling-by-extension-focus-apis-sample-page"></a>
### Focus APIs sample page

A sample page with live examples is available in the Samples extension at [http://aka.ms/portalfx/samples#blade/SamplesExtension/SDKMenuBlade/extensionfocus](http://aka.ms/portalfx/samples#blade/SamplesExtension/SDKMenuBlade/extensionfocus)

<a name="focus-management-focus-handling-by-extension-focusing-first-invalid-form-control-after-validation"></a>
### Focusing first invalid form control after validation

When a user triggers an action that validates a form (ex.: a "Submit" button click), the extension owner should ensure any form validation errors bring the focus to the first invalid control within that form.

For [forms created with the Ibiza SDK](top-extensions-forms.md), one can use the `triggerValidation(focusOnFirstInvalid: boolean)` API of the blade context. The optional `focusOnFirstInvalid` argument needs to be set as `true`.

Here is how this is done within the samples page:

```typescript

this.validateBtn = Button.create(container, {
    text: "Validate form",
    onClick: () => {
        this.context.form.triggerValidation(true /*focusOnFirstInvalid*/);
    },
});

```

<a name="focus-management-focus-handling-by-extension-focusing-programmatically-after-adding-or-removing-ui"></a>
### Focusing programmatically after adding or removing UI

For scenarios where UI is created or removed by the extension code, carefully review where the focus should move next. Typically:

* For UI insertion operations, the focus usually should move to the first interactable UI that was inserted.
* For UI removal operations, select a location that would be the logical natural next step for the user.

> *An abstract example where extension would manage focus*
>
> Assuming a custom list of items that is managed from the extension code. On deletion of a focused item, the focus should move to the next element within that list, reverting to the previous items if there is no next element. If there are no elements remaining and a "Add new entry" button exists that button should be focused instead. For each item insertion, the focus is placed on the newly added item as this item is interactable with further config.

The focus management API is accessed via the `container.setFocus(selector: string)` method.

The selector that is passed to the `setFocus` method will be validated with these rules:

* It is a class selector (it starts with a "."), or multiple class selectors with valid selector operators
* Each class within the selector must be extension owned (they are prefixed with "ext-")

When called, the framework will queue the operation to ensure it is completed after the blade is fully initialized. It will then confirm the focus is currently owned by the blade or one of its dependent controls. If it isn't, the operation will be ignored. If the blade owns the focus, the framework will perform a `querySelectorAll` operation to locate the focus target within the blade content and focus the first element found that matches the selector.

Here is how this is done within the samples page:

```typescript

this.moveFocusBtn = Button.create(container, {
    text: "Focus on textbox 2",
    onClick: () => {
        container.setFocus(".ext-focusfrombuttonclick").then((result) => { focusResultDebugHandler(result, "Focus Succeeds Button"); });
    },
});

```

And a second example showing it can be done from non-content areas, like from the toolbar in this case:

```typescript

const focusFromToolbarButton = new Toolbars.CommandButton({
    label: "Focus on form content",
    name: "focusFromToolbar",
    icon: MsPortalFx.Base.Images.Go(),
    command: {
        canExecute: ko.pureComputed(() => {
            return true;
        }),
        execute: () => {
            return container.setFocus(".ext-focusfromcommandbar").then((result) => { focusResultDebugHandler(result, "CommandBar"); });
        },
    },
});

```

> **Note:** While it is possible to call the `setFocus` API at anytime and that it will work as long as focus is considered owned by the calling container, doing so without a user-triggered action as the starting point will feel like a bug to the user. Keep the `setFocus` method call as close as synchronous to the user-triggered action as possible.

> **Note:** The `setFocus` API can only set focus to elements within the blade content of the container it is called from. It cannot set focus to other blade component of the same blade (ex: CommandBar), nor any other blade or portal component outside of the container.

> **Note:** Focus operations have the side effect to bring in view any element that isn't fully visible within their overflow container. If the focus target isn't visible, the browser will automatically scroll that element in view following the browser behavior for such scenario. The framework will not interfere with this default behavior.

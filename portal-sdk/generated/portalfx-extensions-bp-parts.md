
<a name="best-practices"></a>
## Best Practices

Portal development patterns or architectures that are recommended based on customer feedback and usability studies may be categorized by the type of part.

<a name="best-practices-loading-indicators"></a>
#### Loading indicators

Loading indicators should be consistently applied across all blades and parts of the extension.  To achieve this:

* Call `container.revealContent()` to limit the time when the part displays  **blocking loading** indicators.

* Return a `Promise` from the `onInputsSet` method that reflects all data-loading for the part. Return the `Promise` from the blade if it is locked or is of type  `<TemplateBlade>`.

* Do not return a `Promise` from the `onInputsSet` method previous to the loading of all part data if it removes loading indicators.   The part will seem to be broken or unresponsive if no **loading** indicator is displayed while the data is loading, as in the following code.

```ts
public onInputsSet(inputs: MyPartInputs): Promise {
    this._view.fetch(inputs.resourceId);
    
    // DO NOT DO THIS!  Removes all loading indicators.
    // Your Part will look broken while the `fetch` above completes.
    return Q();
}
```

<a name="best-practices-handling-part-errors"></a>
### Handling part errors

The sad cloud UX is displayed when there is no meaningful error to display to the user. Typically this occures when the error is unexpected and the only option the user has is to try again.

If an error occurs that the user can do something about, then the extension should launch the UX that allows them to correct the issue.    Extension  developers and domain owners are aware of  how to handle many types of errors.

For example, if the error is caused because the user's credentials are not known to the extension, then it is best practice to use one of the following options instead of failing the part.

1. The part can handle the error and change its content to show the credentials input form

1. The part can handle the error and show a message that says ‘click here to enter credentials’. Clicking the part would launch a blade with the credentials form.

 
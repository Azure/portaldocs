
<a name="handling-part-errors"></a>
### Handling part errors

Occasionally while loading parts, your application may encounter some sort of unrecoverable error. In that case, the part may placed into a failure state:

![Failed part][520]

Parts should only be placed into a failed state if it is a system fault and there is no action that the user could take to correct the error. If the user could correct the error, then instead give them information about how to do so. For an example of a failing part, view the following file in the samples:

`\Client\Parts\Lifecycle\ViewModels\PartLifecycleViewModels.ts`

```ts
constructor(container: MsPortalFx.ViewModels.PartContainer, initialState: any, dataContext: DataContext) {
    container.fail(SamplesExtension.Resources.Strings.failedToLoad);
}
```

If the error later becomes fixed (for example, if you are polling for data, and a subsequent poll returns valid results), then you can call `container.recover()` to return the part to its normal display state.

<a name="best-practice-for-handling-part-errors"></a>
### Best practice for handling part errors

The sad cloud UX is intended for use cases where you don’t have any meaningful error to show to the user. Basically, it’s an unexpected error and the only thing they can do is try again.

If there’s an error that the user can actually do something about then you should launch the appropriate UX that lets them correct the issue. For example, if the error is caused because the user would need to enter some credentials somewhere then we recommend you do not fail the part and instead use one of the following options:

1. The part can handle the error and change its content to show the credentials input form
1. The part can handle the error and show a message that says ‘click here to enter credentials’. Clicking the part would launch a blade with the credentials form.
1. Whatever else you think is appropriate. The point is in this case you (the domain owner) know how to handle the error and should show the right UX.

[520]: ../media/portalfx-debugging/failure.png
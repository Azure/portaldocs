* [Subscriptions](#subscriptions)
    * [Getting the list of subscriptions](#subscriptions-getting-the-list-of-subscriptions)
    * [Getting subscription details](#subscriptions-getting-subscription-details)
    * [Subscription filtering on blades and parts](#subscriptions-subscription-filtering-on-blades-and-parts)


<a name="subscriptions"></a>
## Subscriptions

<a name="subscriptions-getting-the-list-of-subscriptions"></a>
### Getting the list of subscriptions
Most extensions should only need the list of user selected subscriptions. To **get the list of selected subscriptions**, call the `getSelectedSubscriptions()` function:

```ts
MsPortalFx.Azure.getSelectedSubscriptions().then((subs: Subscription[]) => {
    ...
});
```

Extensions can also **subscribe to changes to the selected subscriptions** and always get the updated list of user selected subscriptions. To do so, call the `onSelectedSubscriptionsChange()` function as shown below. You may refer to [another sample here](https://msazure.visualstudio.com/DefaultCollection/One/_git/AzureUX-PortalFX/?path=/src/SDK/Extensions/SamplesExtension/Extension/Client/V2/ResourceManagement/SelectedSubscriptionsChangeBlade.tsx&version=GBdev&line=114&lineEnd=117&lineStartColumn=9&lineEndColumn=12&lineStyle=plain&_a=contents) to see its usage.

```ts
import * as ResourceManagement from "Fx/ResourceManagement";

await ResourceManagement.onSelectedSubscriptionsChange(container, (selectedSubscriptions: Subscription[]) => {
    // performRequiredAction(selectedSubscriptions);
});
```

<a name="subscriptions-getting-subscription-details"></a>
### Getting subscription details
Extensions need subscription details to enable the following scenarios:

* Determining if a resource is in a disabled subscription
* Showing the subscription display name in resource properties
* Making a decision based on the quota id
* Showing resources for all filtered subscriptions

Most extensions should only need the details of a single subscription for these first 3 scenarios. To get subscription details, call the `getSubscriptionInfo()` function:

```ts
MsPortalFx.Azure.getSubscriptionInfo(subId).then((sub: Subscription) => {
    var name = sub.displayName,
        isDisabled = sub.state.toLowerCase() === "disabled",
        quotaId = sub.subscriptionPolicies.quotaId;
    ...
});
```

<a name="subscriptions-subscription-filtering-on-blades-and-parts"></a>
### Subscription filtering on blades and parts
If you show content across subscriptions, use the following guidelines:

1. On template blades, use a `ResourceFilter` control (see below)
1. Unlocked blades should add a subtitle that represents the selected subscriptions and a `Filter` command that includes the subscription filter in a context pane (same as locked blades)
1. Parts should add a subtitle that represents the selected subscriptions and expose a `Filter` command similar to unlocked blades

The selected subscription label should be formatted using these rules:

* 1 subscription: "{subscription.displayName}"
* 2+ subscriptions: "{count} subscriptions"
* All subscriptions: "All subscriptions"

> [WACOM.NOTE] We will provide an API to do the label calculation for you. Stay tuned...

If you have a template blade that shows resources across subscriptions, you can add the `ResourceFilter` control to your blade using a `pcControl` binding and use the observables on the viewmodel on your blade:
```ts
  this.resourceFilter = new MsPortalFx.Azure.ResourceFilter.ViewModel(this._container, {
        actionHandler: this.gridViewModel,
        showTextFilter: ko_observable(true),
        showSubscriptionFilter: ko_observable(true),
        showSubscriptionSummary: ko_observable(false),
        showTenantLevelSubscriptionSummary: ko_observable(false),
        textFilterPlaceholder: ko_observable<string>("Search here")
  });
```

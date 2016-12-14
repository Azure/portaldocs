## Resource moves

Resources can be moved between resource groups or subscriptions in the Properties blade and Essentials (resource summary part). Every resource that can be moved, directly or indirectly, by the ARM `/moveResources` API must have both Properties and Essentials entry points for consistency.

Start with your Properties blade by specifying an "edit blade" option for your resource group and subscription name properties:

```ts
var subscriptionNamePropertyOptions = {
    label: strings.subscriptionName,
    value: subscriptionName,
    editBlade: MsPortalFx.Azure.ResourceManager.getMoveResourceBlade(
        resourceId,
        MsPortalFx.Azure.ResourceManager.MoveType.Subscription)
};
partProperties.push(new FxPropertiesPart.CopyFieldProperty(this._container, subscriptionPropertyOptions));
```

In Essentials, simply add the `supportsResourceMove` option:

```ts
var resourceSummaryOptions = <MsPortalFx.ViewModels.Parts.ResourceSummary.Options2>{
    getQuickStartSelection: getQuickStartSelection,
    getSettingsSelection: getAllSettingsSelection,
    getKeysSelection: getKeysSelection,
    supportsResourceMove: MsPortalFx.Azure.ResourceManager.MoveType.SubscriptionAndResourceGroup,
    status: {
        value: statusValue,
        isLoading: statusIsLoading
    },
    staticProperties: properties
}
```

Along with essentials and properties blade, resource blade must also have move command.
If you are not using Move resource PDL command on your resource blade, please use MoveResourceButton on the command/toolbar bar on your resource blade. 
As we are eventually deprecating PDL support, moving forward, this is the strongly recommended way of adding the move command.

Here's code to add move resource button to the toolbar:
```ts
    import MoveResorceButton = require("Fx/Composition/MoveResourceToolbarButton");

    const moveResourceButton = new MoveResorceButton.MoveToolbarButton(container, 
    { 
        resourceId: "subscriptions/{subId}/resourcegroups/{resourceGroupId}/providers/{providerId}/{resourcetype}/{resourceName}", 
        cloudName: "{cloudName}"
    });
    const toolBar = new Toolbars.Toolbar(container);
    toolBar.setItems([moveResourceButton]);
```
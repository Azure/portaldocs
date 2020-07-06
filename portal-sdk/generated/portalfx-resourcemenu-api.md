
<a name="resource-menu-apis"></a>
### Resource menu APIs

```ts
import * as FxMenuBlade from "Fx/Composition/MenuBlade";
 
declare module MsPortalFx.Assets {
    /**
     * The resource information for the resource menu.
     */
    interface ResourceInformation {
        /**
         * The resource ID.
         */
        resourceId: string;
        /**
         * The resource or resource group.
         */
        resource: FxSubscription | FxHubsAzure.ResourceGroup | FxHubsAzure.Resource;
        /**
         * The resource's subscription information (only valid for non-tenant resources).
         */
        subscription?: FxSubscription;
    }

    /**
     * The options of the resource menu config.
     */
    interface ResourceMenuOptions {
        /**
         * Enables the settings for roles and users.
         */
        enableRbac?: boolean;
        /**
         * Enables the settings for help request support.
         */
        enableSupportHelpRequest?: boolean;
        /**
         * Enables the settings for troubleshoot support.
         */
        enableSupportTroubleshoot?: boolean;
        /**
         * Enables the settings for troubleshootv2 support.
         */
        enableSupportTroubleshootV2?: boolean;
        /**
         * Enables the settings for resource health support.
         */
        enableSupportResourceHealth?: boolean;
        /**
         * Enables the settings for the event logs.
         */
        enableSupportEventLogs?: boolean;
        /**
         * Enables the setting for tags.
         */
        enableTags?: boolean;
    }

    /**
     * Defines a group extension in the menu.
     * This is used to extend the built-in groups with additional items.
     *
     * NOTE: The referenceId must be one of the constants for group IDs in this file.
     *       Using a different ID will result in a load rejection.
     */
    interface MenuGroupExtension {
        /**
         * Gets the ID for the built-in group.
         */
        referenceId: string;
        /**
         * The menu items in the group.
         */
        items: MenuItem[];
    }

    /**
     * The menu group instance type (either a menu group or a menu group extension).
     */
    type MenuGroupInstance = MenuGroup | MenuGroupExtension;

    /**
     * The resource menu configuration.
     */
    interface ResourceMenuConfig {
       /**
         * The resource menu item (overview item).
         */
        overview: MenuItem;
        /**
         * The menu item groups.
         */
        groups: MenuGroupInstance[];
        /**
         * The ID of the default menu item.
         * If this is not provided, the overview item will be the default item.
         */
        defaultItemId?: string;
        /**
         * Optional set of resource menu options.
         */
        options?: ResourceMenuOptions;
    }

    /**
     * The contract for the asset type's resource menu config.
     */
    interface ResourceMenuConfigContract {
        /**
         * Gets the resource menu configuration.
         *
         * @param resourceInfo The resource ID and resource|resource group for the menus.
         * @return A promise which will be resolved with the resource menu configuration.
         */
        getMenuConfig(resourceInfo: ResourceInformation): FxBase.PromiseV<ResourceMenuConfig>;
    }
}

```

<a name="menu-apis"></a>
### Menu APIs

```ts
declare module "Fx/Composition/MenuBlade" {
    /**
     * Attributes common to all items and groups in the menu.
     */
    interface MenuItemBase {
        /**
         * Gets the ID for the item.
         */
        id: string;
        /**
         * The display text for the item.
         */
        displayText: string;
        /**
         * A space-delimited list of keywords associated to the item.
         */
        keywords?: string | string[];
    }

    /**
     * Defines an item in a group of the menu.
     */
    interface MenuItem extends MenuItemBase, FxComposition.Selectable2Options<FxComposition.BladeReference<any>> {
        /**
         * The icon associated to the menu item.
         */
        icon: FxBase.Image;
        /**
         * A value indicating whether or not the item is enabled.
         */
        enabled?: KnockoutObservableBase<boolean>;
    }

    /**
     * Defines a group in the menu.
     */
    interface MenuGroup extends MenuItemBase {
        /**
         * The menu items in the group.
         */
        items: MenuItem[];
    }
}
```

<a name="selectable-2-apis"></a>
### Selectable 2 APIs

```ts
declare module "Fx/Composition/Selectable" {
    /**
     * Configuration to pass to the selectable constructor
     */
    interface Selectable2Options<TBladeReference> {
        /**
         * This callback is invoked by the portal when a new blade is to be opened
         * in response to a user-invoked navigation.
         *
         * @return A blade reference that describes the blade to open.  This value cannot be null or undefined.
         */
        supplyBladeReference?: () => TBladeReference;
        /**
         * This callback is invoked by the portal when a new blade is to be opened
         * asychronously in response to a user-invoked navigation.
         *
         * @return A promise that returns a blade reference that describes the blade to open.  This value cannot be null or undefined.
         */
        supplyBladeReferenceAsync?: () => Q.Promise<TBladeReference>;
    }
}
```
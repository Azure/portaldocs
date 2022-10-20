The ResourceGroupSelector returns an object with the following properties as the output:

```typescript
    /**
    * The mode of the dropdown, create new or use existing.
    */
    mode: SelectedMode;
    /**
    * The ARM value for the resource group.
    */
    value: ResourceGroup;
```

The modes possible(defined by the <code>SelectedMode</code>interface) is as follows:
```typescript
            /**
             * The modes possible for the dropdown.
             */
            const enum Mode {
                UseExisting = 0,
                CreateNew = 1,
            }
```

The <code>ResourceGroup</code> interface is defined as:
```typescript
interface ResourceGroup {
        /**
         * Resource group location.
         */
        location: string;
        /**
         * Resource group name.
         */
        name: string;
        /**
         * Resource group provisioning state.
         */
        provisioningState?: string;
        /**
         * The resource id of the resource group. e.g. /subscriptions/123/resourceGroups/${this.name}
         * Available with the fx resource group dropdown.
         */
        resourceId?: string;
    }
```

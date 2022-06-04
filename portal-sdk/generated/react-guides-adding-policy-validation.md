<a name="creating-policy-components"></a>
## Creating Policy Components

When modifying or creating resources, there are many situations where policies might block a user from performing an action. Normally the first time the user is alerted to violation of policies is when they try to perform the action. Within the portal, there's an opportunity to alert the user early on in their efforts, saving users time and frustration.

In react the portal has a policy api that can construct resource details with fields in your blades, and provide validation messages with details on how the user is violating policies. It does this by allowing you to define components which are aware of how your blade is going to set the details of the resources being modified or created.

In this example we create and export some basic policy components.
```typescript

export const { PolicyContext: VMPolicyContext, PolicyField: VMPolicyField } = createPolicyComponents({
// The keys of the reducer map are the field names
reducerMap: {
    subscription: {
        order: 0,
        buildResourceDetails: (resourceDetails, val: string) => {
            // scope is required
            resourceDetails.scope = `/subscriptions/${val}`;
            return resourceDetails;
        },
    },
    resourceGroup: {
        order: 1,
        buildResourceDetails: (resourceDetails, val: { isNew: boolean; resourceGroup: string }) => {
            const requestScope = resourceDetails.scope;
            //add the resource group to the subscription to set the scope to the resource group
            resourceDetails.scope = val.resourceGroup;
            // record the scope if the resource group hasn't been created yet or set to undefined
            // so that policyRequest.scope is defaulted to resourceDetails.scope
            // make sure to set request scope in both cases.
            return val?.isNew ? { requestScope, resourceDetails } : { requestScope: resourceDetails.scope, resourceDetails };
        },
    },
    location: {
        buildResourceDetails: (resourceDetails, locationId: string) => {
            const location = ArmId.parse(locationId).resourceName;
            resourceDetails.resourceContent = {
                // type is required
                // In production this would be a virtual machine type, but in dogfood we're using a test resource type
                type: "Providers.Test/statefulIbizaEngines",
                location,
            };
            // api version of the resource is required
            resourceDetails.apiVersion = "2014-04-01";
            return resourceDetails;
        },
        pendingValuesGenerator: (value: string) => {
            return [{
                // The potential field to be set by the string values e.g. resourceDetails.resourceContent.location = "location"
                field: "location",
                // Return values for each potential value to be placed in the resource Content
                // This is run in a computed, so when fetchedValues is updated, this list will also be updated
                // And trigger a policy check.
                values: () => [value, ...Redux.store.getState().fetchedLocations.map(val => val.id)],
                // This will map your value to a string for placement in the field
                // of the resource. In this instance resourceDetails.resourceContent.location = {1} where loc = subscriptions/{0}/locations/{1}
                valueToField: (loc: string) => ArmId.parse(loc).resourceName,
            }];
        },
    },
},
customizeRequest: (policyRequest) => {
    // Perform any final customizations to the policy request as necessary
    // This is Optional.
    return policyRequest;
},
});

```

<a name="creating-policy-components-policy-context"></a>
### Policy Context
The VM's policy context can be imported.
```typescript

import { VMPolicyContext } from "./Components/CreateExperienceVMPolicy";

```

When the VM's policy context is used within the blade, it will track the state of the fields within your react form and allow resource details to validate against all other relevant fields.
```typescript

return <Fabric>
    {/* Make sure to place every field which will modify a policy field within that policy's context */}
    <VMPolicyContext>
        <Pivot
            aria-label="navigation"
            style={{ marginBottom: "100px" }}
            styles={{ itemContainer: { maxWidth: "720px", paddingLeft: "8px", paddingTop: "12px" } }}
            selectedKey={String(this.state.selectedPivotKey)}
            onLinkClick={(item, _event) => {
                this.setState({ selectedPivotKey: Number(item.props.itemKey) });
            }}
        >
            <PivotItem headerText={pivotItemsNames[0]} itemKey="0">
                {/* The basics section has most of our policy field controls */}
                <CreateExperienceBasicsSection
                    onAuthenticationTypeOptionChange={(option) => this.props.setAuthenticationTypeOption(option)}
                    onAvailabilityOptionChange={(option) => this.props.setAvailabilityOption(option)}
                    onKeyPairNameChange={(keyPairName) => this.props.setKeyPairName(keyPairName)}
                    onKeySourceOptionChange={(option) => { this.props.setKeySourceOption(option); }}
                    onLocationChange={(locationId, location) => {
                        this.props.setLocationId(locationId);
                        this.props.setLocationName(location && location.displayName || "");
                    }}
                    onCustomizeLocations={(locs: Common.ResourceManagement.Location[]) => {
                        this.props.setFetchedLocations(locs);
                        return locs;
                    }}
                    onPublicInboundPortsOptionChange={(option) => this.props.setPublicInboundPortsOption(option)}
                    onResourceGroupChange={(resourceGroupName, resourceGroup, isNew) => {
                        this.props.setResourceGroupCreateNewMode(isNew);
                        this.props.setResourceGroupId(resourceGroup && resourceGroup.id || "");
                        this.props.setResourceGroupName(resourceGroupName);
                    }}
                    onSelectedInboundPortsOptionChange={(option) => { this.props.setSelectedInboundPortsOption(option); }}
                    onSubscriptionChange={(subscriptionId, subscription) => {
                        this.props.setSubscriptionId(subscriptionId);
                        this.props.setSubscriptionName(subscription && subscription.displayName || "");
                    }}
                    onSpotInstanceOptionChange={(option) => this.props.setSpotInstanceOption(option)}
                    onUsernameChange={(username) => this.props.setUsername(username)}
                    onVirtualMachineImageOptionChange={(option) => this.props.setVmImageOption(option)}
                    onVirtualMachineNameChange={(vmName) => this.props.setVmName(vmName)}
                    onVirtualMachineSizeOptionChange={(option) => this.props.setVmSizeOption(option)}
                    setLocationValidationMessage={(message) => this.props.setLocationValidation(message)}
                />
            </PivotItem>
            <PivotItem headerText={pivotItemsNames[1]} itemKey="1">
                <CreateExperienceTagsSection
                    onTaggedResourcesChange={(resources) => this.props.setTaggedResources(resources)}
                />
            </PivotItem>
            <PivotItem headerText={pivotItemsNames[2]} itemKey="2">
                <CreateExperienceReviewSection />
            </PivotItem>
        </Pivot>
    </VMPolicyContext>
    
```

<a name="creating-policy-components-policy-field"></a>
### Policy Field
Within the basics section is a control intended to update a field within the resource details. To hook up the context to that field, import and use the policy field of that policy context to update the resource details with value changes from controls
```typescript

import { VMPolicyField } from "./CreateExperienceVMPolicy";

```
Then add the validation to the control. Within this component is a callback attribute that will be passed a react hook which needs to be passed in the field intended to be updated and the new value. The field will constrict the type of value that can be passed in to update the details.
```typescript

}
<FormLabel displayValue={ClientStrings.Label.region} required
    tooltip={<><span>{ClientStrings.Tooltip.region}</span></>}>
    <VMPolicyField getUsePolicyField={(usePolicyField) => usePolicyField("location", this.props.locationId)}>
        <LocationDropdown
            onLocationChange={this.props.onLocationChange}
            selectedLocationId={this.props.locationId}
            subscriptionId={this.props.subscriptionId}
            customizeLocations={this.props.onCustomizeLocations}
        />
    </VMPolicyField>
</FormLabel>
{
    
```

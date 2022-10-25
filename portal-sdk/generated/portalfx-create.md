* [Building create experiences](#building-create-experiences)
* [Building custom create forms](#building-custom-create-forms)
    * [Create Marketplace package (aka Gallery package) - Optional](#building-custom-create-forms-create-marketplace-package-aka-gallery-package-optional)
    * [Design for a single blade](#building-custom-create-forms-design-for-a-single-blade)
    * [Add a provisioning decorator](#building-custom-create-forms-add-a-provisioning-decorator)
    * [Launching a provisioning blade](#building-custom-create-forms-launching-a-provisioning-blade)
    * [Build your form](#building-custom-create-forms-build-your-form)
    * [Standard ARM fields](#building-custom-create-forms-standard-arm-fields)
    * [Setting the value](#building-custom-create-forms-setting-the-value)
    * [Resource dropdowns](#building-custom-create-forms-resource-dropdowns)
    * [ARM dropdown options](#building-custom-create-forms-arm-dropdown-options)
    * [Validation](#building-custom-create-forms-validation)
    * [Automation options](#building-custom-create-forms-automation-options)
    * [Testing](#building-custom-create-forms-testing)
    * [Feedback](#building-custom-create-forms-feedback)
    * [Telemetry](#building-custom-create-forms-telemetry)
    * [Troubleshooting](#building-custom-create-forms-troubleshooting)


<a name="building-create-experiences"></a>
## Building create experiences

The Azure portal offers 3 ways to build a create form:

1. *[Deploy to Azure](portalfx-create-deploytoazure.md)*

    There are simple forms auto-generated from an ARM template with very basic controls and validation. Deploy to Azure is the quickest way to build a Create form and even integrate with the Marketplace, but is very limited in available validation and controls.

    Use [Deploy to Azure](portalfx-create-deploytoazure.md) for [community templates](https://azure.microsoft.com/documentation/templates) and simple forms.

2. *[Solution templates](https://github.com/Azure/azure-marketplace/wiki)*

    These are simple forms defined by a JSON document separate from the template. Solution templates can be used by any service, however there are some limitations on supported controls.

    Use [Solution templates](https://github.com/Azure/azure-marketplace/wiki) for IaaS-focused ARM templates.

3. *Custom create forms*

    These are fully customized forms built using TypeScript in an Azure portal extension. Most teams build custom create forms for full flexibility in the UI and validation. This requires developing an extension.

<a name="building-custom-create-forms"></a>
## Building custom create forms

<a name="building-custom-create-forms-create-marketplace-package-aka-gallery-package-optional"></a>
### Create Marketplace package (aka Gallery package) - Optional
The Marketplace provides a categorized collection of packages which can be created in the portal. Publishing your package to the Marketplace is simple:

1. Create a package and publish it to the DF Marketplace yourself, if applicable. Learn more about [publishing packages to the Marketplace](../../gallery-sdk/generated/index-gallery.md).
1. Side-load your extension to test it locally.
1. Set a "hide key" before testing in production.
1. Send the package to the Marketplace team to publish it for production.
1. Notify the Marketplace team when you're ready to go live.

Note that the **+New** menu is curated and can change at any time based on C+E leadership business goals. Ensure documentation, demos, and tests use [Create from Browse](portalfx-browse.md) or [deep-links](portalfx-links.md) as the entry point.

![The +New menu][plus-new]

![The Marketplace][marketplace]

In most cases, your blade will be launched from the Marketplace, a deep link, or a toolbar command (like Create from Browse), but you are able to open create blades directly with a blade reference.

This can be done directly with a blade reference or a marketplace id

```typescript

public engineBladeLink: BladeLink = {
    bladeReference: BladeReferences.forMarketplace().createReference({
        marketplaceId: "Microsoft.EngineNoPdlV1",
        parameters: createEngineBladeParameters,
    }),
};
public noMarketplaceEngineBladeLink: BladeLink = {
    bladeReference: BladeReferences.forBlade("CreateNoMarketplaceArmEngineBlade").createReference({
        doesProvisioning: true,
        parameters: createEngineBladeParameters,
    }),
};

```

<a name="building-custom-create-forms-design-for-a-single-blade"></a>
### Design for a single blade
All create experiences should be designed for a single blade. Start by building a Create blade by applying the `@TemplateBlade.DoesProvisioning.Decorator` to your Blade class. Always prefer dropdowns over pickers (form fields that allow selecting items from a list in a child blade) and avoid using selectors (form fields that open child blades).

Email [ibizafxpm](mailto:ibizafxpm@microsoft.com?subject=Full-screen Create) if you have any questions about the current state of full-screen create experiences.

<a name="building-custom-create-forms-add-a-provisioning-decorator"></a>
### Add a provisioning decorator
A provisioning decorator is another component of template blades.

The [typescript decorator framework](portalfx-no-pdl.md) enables you to build UX to collect data from the user. If you're not familiar with decorator blades, now is a good time to read more about it.

```typescript

@TemplateBlade.DoesProvisioning.Decorator({ supportsPostProvisioning: true })

```

This decorator adds a provisioning property to the context of your blade which enables you to harness the framework's provisioning capabilities, and it includes the ability to require this blade be launched with a marketplace item.

There are 2 specific scenarios which the provisioning decorator covers.

1. ARM provisioning:
(Refer to the full CreateArmEngineBlade sample to see the full create blade)

```typescript

private _supplyTemplateDeploymentOptions(): TemplateBlade.DoesProvisioning.DeployTemplateOptions
    | TemplateBlade.DoesProvisioning.DeploySubscriptionLevelTemplateOptions {
    
```
```typescript

return {
    marketplaceItemId: MsPortalFx.isFeatureEnabled("prodtest") ? prodMarketplaceItemId : testMarketplaceItemId,
    provisioningHash: JSON.stringify(postCreateContent),
    subscriptionId: subscriptionId,
    resourceGroupName: resourceGroupName,
    resourceGroupLocation: resourceGroupLocation,
    parameters: parameters,
    deploymentName: `${marketplaceItem ? marketplaceItem.deploymentName : "NoMarketplaceEngine"}-${(new Date()).toISOString().replace(/\D/g, "")}`,
    resourceProviders: [resourceProvider],
    resourceId: resourceIdFormattedString,
    templateJson: getTemplateJson(),
    // You can override the gallery item's dashboard part when pinning.
    // Here we're doing it based on a feature flag.
    supplyPartReference: isFeatureEnabled("noPinEngine") && (() => {
        return PartReferences.forPart("NotificationsPinnedPart").createReference({ parameters: {} });
    }),
};

```
```typescript

return provisioning.deployTemplate(this._supplyTemplateDeploymentOptions())
    
```

2. Custom provisioning:
(Refer to the full CreateCustomRobotBlade sample to see the full create blade)
```typescript

const provisioningPromise = provisioning.deployCustom({
    provisioningPromise: model.robotData.createRobot(newRobot).then(() => {
        // Close blade, notification will update when creation is complete
        container.closeCurrentBlade();
        // Adding some extra wait time to make the operation seem longer.
        return Q.delay(delay).then(() => newRobot);
    }),
    supplyPartReference: (provisionedRobot) => {
        return new PartReference("RobotPart", { id: provisionedRobot.name() }, { extensionName: "SamplesExtension" });
    },
});

```

<a name="building-custom-create-forms-launching-a-provisioning-blade"></a>
### Launching a provisioning blade
In most cases, your blade will be launched from the Marketplace, a deep link, or a toolbar command (like Create from Browse), but you are able to open create blades directly with a blade reference.

This can be done directly with a blade reference or a marketplace id

```typescript

import * as ClientResources from "ClientResources";
import { BladeReferences, BladeLink } from "Fx/Composition";
import * as TemplateBlade from "Fx/Composition/TemplateBlade";
import { DataContext } from "./CreateArea";

```
```typescript

/**
* This blade is an example of how to launch a provisioning blade
* combined with a marketplace gallery id
*/
@TemplateBlade.Decorator({
   htmlTemplate: `
   <div class='msportalfx-padding'>
       <a data-bind='text: engineText, fxclick: engineBladeLink'></a>
       <p></p>
       <a data-bind='text: robotText, fxclick: robotBladeLink'></a>
       <p></p>
       <a data-bind='text: engineNoMarketplaceText, fxclick: noMarketplaceEngineBladeLink'></a>
       <p></p>
       <a data-bind='text: reactRobotText, fxclick: reactViewLink'></a>
   </div>`,
})
@TemplateBlade.InjectableModel.Decorator(DataContext)
export class CreateLauncherBlade {
   public title = ClientResources.createLauncher;
   public subtitle: string;
   public context: TemplateBlade.Context<void, DataContext>;
   public engineText = ClientResources.createEngine;
   public engineNoMarketplaceText = ClientResources.createNoMarketplaceEngine;
   public robotText = ClientResources.createRobot;
   public reactRobotText = ClientResources.reactCreateRobot;

   public async onInitialize() {
   }

   public robotBladeLink: BladeLink = {
       bladeReference: BladeReferences.forBlade("CreateCustomRobotBlade").createReference({
           parameters: createCustomRobotBladeParameters,
           doesProvisioning: true,
       }),
   };
   //docs#launchProvisioningBlades
   public engineBladeLink: BladeLink = {
       bladeReference: BladeReferences.forMarketplace().createReference({
           marketplaceId: "Microsoft.EngineNoPdlV1",
           parameters: createEngineBladeParameters,
       }),
   };
   public noMarketplaceEngineBladeLink: BladeLink = {
       bladeReference: BladeReferences.forBlade("CreateNoMarketplaceArmEngineBlade").createReference({
           doesProvisioning: true,
           parameters: createEngineBladeParameters,
       }),
   };
   //docs#launchProvisioningBlades
   public reactViewLink: BladeLink = {
       bladeReference: BladeReferences.forBlade("CreateCustomRobot.ReactView").createReference({
           doesProvisioning: true,
       }),
   };
}

```

<a name="building-custom-create-forms-build-your-form"></a>
### Build your form
Use built-in form fields, like TextField and DropDown, to build your form the way you want. Use the built-in EditScope integration to manage changes and warn customers if they leave the form.

```ts
// The parameter provider takes care of instantiating and initializing an edit scope for you,
// so all we need to do is point our form's edit scope to the parameter provider's edit scope.
this.editScope = this.parameterProvider.editScope;
```
Learn more about [building forms](portalfx-forms.md).

<a name="building-custom-create-forms-standard-arm-fields"></a>
### Standard ARM fields
All ARM subscription resources require a subscription, resource group, location and pricing dropdown. The portal offers built-in controls for each of these. Refer to the EngineV3 Create sample (`SamplesExtension\Extension\Client\V2\Create\Engine\CreateArmEngineBlade.tsx`) for a working example.
<a name="building-custom-create-forms-setting-the-value"></a>
### Setting the value
Each of these fields will retrieve values from the server and populate a dropdown with them. If you wish to set the value of these dropdowns, make sure to lookup the value from the `fetchedValues` array, and then set the `value` observable.
```ts
locationDropDown.value(locationDropDown.fetchedValues().first((value)=> value.name === "centralus"))
```

<a name="building-custom-create-forms-resource-dropdowns"></a>
### Resource dropdowns
<a name="building-custom-create-forms-resource-dropdowns-subscriptions-dropdown"></a>
#### Subscriptions dropdown
```ts
import * as SubscriptionDropDown from "Fx/Controls/SubscriptionDropDown";
```
```typescript

const subscriptionDropDown = FxSubscriptionDropDown.create(container, {
    initialSubscriptionId: provisioning.initialValues.subscriptionIds,
    infoBalloonContent: ClientResources.infoBalloonContent,
    validations: [
        ...(subPolicyValidation ? [subPolicyValidation] : []),
        new Validations.Required(ClientResources.selectSubscription),
    ],
    // Providing a list of resource providers (NOT the resource types) makes sure that when
    // the deployment starts, the selected subscription has the necessary permissions to
    // register with the resource providers (if not already registered).
    // Example: Providers.Test, Microsoft.Compute, etc.
    resourceProviders: [resourceProvider],
    // Optional -> You can pass the gallery item to the subscriptions drop down, and the
    // the subscriptions will be filtered to the ones that can be used to create this
    // gallery item.
    filterByGalleryItem: this._marketplaceItem,
});

```

<a name="building-custom-create-forms-resource-dropdowns-resource-groups-dropdown"></a>
#### Resource groups dropdown
```ts
import * as ResourceGroupDropDown from "Fx/Controls/ResourceGroupDropDown";
```
```typescript

const resourceGroupDropDown = FxResourceGroupDropDown.create(container, {
    initialResourceGroupName: provisioning.initialValues.resourceGroupNames,
    infoBalloonContent: ClientResources.infoBalloonContent,
    label: ko.observable<string>(ClientResources.resourceGroup),
    subscriptionId: this._subscription,
    validations: [
        new Validations.Required(ClientResources.selectResourceGroup),
        new FxAzure.RequiredPermissionsValidator(requiredPermissionsCallback),
        ...(rgPolicyValidation ? [rgPolicyValidation] : []),
    ],
    // Optional -> RBAC permission checks on the resource group. Here, we're making sure the
    // user can create an engine under the selected resource group, but you can add any actions
    // necessary to have permissions for on the resource group.
    requiredPermissions: {
        actions: actions,
        // Optional -> You can supply a custom error message. The message will be formatted
        // with the list of actions (so you can have {0} in your message and it will be replaced
        // with the array of actions).
        message: ClientResources.enginePermissionCheckCustomValidationMessage.format(actions.toString()),
    },
    // Optional -> Will determine which mode is selectable by the user. It defaults to Both.
    allowedMode: allowedMode, // Alternatively Mode.UseExisting or Mode.CreateNew
    createNewPlaceholder: ClientResources.createNew,
    // This will shift the dropdown to the right and add a connector implying a parent/child relationship with the subscription.
    nested: true,
});

```
<a name="building-custom-create-forms-resource-dropdowns-locations-dropdown"></a>
#### Locations dropdown
```ts
import * as LocationDropDown from "Fx/Controls/LocationDropDown";
```
```typescript

const locationDropDown = FxLocationDropDown.createCustom(container, {
    initialLocationName: provisioning.initialValues.locationNames,
    infoBalloonContent: ClientResources.infoBalloonContent,
    subscriptionId: this._subscription,
    resourceTypes: [resourceType],
    validations: ([
        ...(!isFeatureEnabled("PolicyAwareControls") ? locationPolicyValidations.map((val) => val.validation) : []),
        new Validations.Required(ClientResources.selectLocation),
    ]),
    // Use policy denied values to disable options and inform your user that their policies have disallowed that value
    disable: (!isFeatureEnabled("PolicyAwareControls")) && ((loc) => {
        return locationPolicyValidations
            .reduce((previous, val) => previous.concat(val.pendingResultValues()?.denied || []), [] as string[])
            .includes(loc.name) && ClientResources.policyDisabledLocations;
    }),
});

```

<a name="building-custom-create-forms-arm-dropdown-options"></a>
### ARM dropdown options
Each ARM dropdown can disable, hide, group, and sort.

<a name="building-custom-create-forms-arm-dropdown-options-disable"></a>
#### Disable
This is the preferred method of disallowing the user to select a value from ARM. The disable callback will run for each fetched value from ARM. The return value of your callback will be a reason for why the value is disabled. If no reason is provided, then the value will not be disabled. This is to ensure the customer has information about why they can’t select an option, and reduces support calls.
```typescript

disable: (loc) => { return !!~["5ag", "3bg"].indexOf(loc.property) && "Disabled (value not allowed for subscription)"; },

```
When disabling, the values will be displayed in groups with the reason they are disabled as the group header. Disabled groups will be placed at the bottom of the dropdown list.

<a name="building-custom-create-forms-arm-dropdown-options-hide"></a>
#### Hide
This is an alternative method of disallowing the user to select a value from ARM. The hide callback will run for each fetched value from ARM. The return value of your callback will return a boolean for if the value should be hidden. If you choose to hide, a message telling the user why some values are hidden is required.
```typescript

hiding: {
    hide: (item: Value) => item.property === "5ag",
    reason: "Some values are hidden because because of legal restrictions on new software",
},

```

<a name="building-custom-create-forms-arm-dropdown-options-hide-note-on-hide"></a>
##### Note on Hide
It's recommended to use the `disable` option so you can provide scenario-specific detail as to why a given dropdown value is disabled, and customers will be able to see that their specific desired value is not available. Disabling is preferable to hiding, as users often react negatively when they cannot visually locate their expected dropdown value.  In extreme cases, this can trigger incidents with your Blade.

<a name="building-custom-create-forms-arm-dropdown-options-group"></a>
#### Group
This is a way for you to group values in the dropdown. The group callback will take a value from the dropdown and return a display string for which group the value should be in. If no display string or an empty string is provided, then the value will default to the top level of the group dropdown.

If you want to sort the groups (not the values within the group), you can supply the 'sort' option, which should be a conventional comparator function that determines the sort order by returning a number greater or less than zero. It defaults to alphabetical sorting.

```typescript

grouping: {
    map: (item: Value): string => {
        return item.property.slice(-2) === "bg" ? "Group B" : "Group A";
    },
    sort: (a: string, b: string) => MsPortalFx.compare(b, a),
},

```

If you both disable and group, values which are disabled will be placed under the disabled group rather than the grouping provided in this callback.

<a name="building-custom-create-forms-arm-dropdown-options-sort"></a>
#### Sort
If you want to sort values in the dropdown, supply the 'sort' option, which should be a convention comparator function that returns a number greater or less than zero. It defaults to alphabetical based on the display string of the value.

```typescript

sort: (a: Value, b: Value) => MsPortalFx.compare(b.property, a.property),

```

If you sort and use disable or group functionality, this will sort inside of the groups provided.

<a name="building-custom-create-forms-arm-dropdown-options-policy-aware-controls"></a>
#### Policy Aware Controls
The provisioning context has a policy validation factory useful for determining if the resource being created is going to violate the policies of a user's organization. With the `context.provisioning.policyValidationFactory` you can keep track of the state of your create to construct a resource from the fields in your create experience, and then generate validations that will be displayed when a policy violation is detected.

```typescript

// Create a validation to place in the subscription dropdown
// Policy checks will not be run until all required values are set
// eslint-disable-next-line deprecation/deprecation
const subPolicyValidation = primaryEnginePolicyFactory?.createFieldValidation<FxSubscriptionDropDown.Subscription>({
    // The buildResourceDetails functions passed in to this `policyFactory` instance with the `createFieldValidation`
    // are run sequentially in order of creation to build the policy request
    // Each function will receive the output of the previous buildResourceDetails function the latest validating value of their control
    buildResourceDetails: (resourceDetails, val) => {
        const subscription = val?.subscriptionId;
        // scope is required
        resourceDetails.scope = subscription && ArmId.stringify({ subscription, kind: ArmId.Kind.Subscription }, ArmId.Kind.Subscription);
        return resourceDetails;
    },
}).validation;

```

This validation can be placed inside the SubscriptionDropDown.

Similarly with the ResourceGroupDropDown you can build the resource and even modify the policy check request just before it's made.
```typescript

// create another policy validation from the factory
// eslint-disable-next-line deprecation/deprecation
const rgPolicyValidation = primaryEnginePolicyFactory?.createFieldValidation<FxResourceGroupDropDown.Value>({
    // This will be run after the previously run buildResourceDetails
    buildResourceDetails: (resourceDetails, val) => {
        const requestScope = resourceDetails.scope;
        //add the resource group to the subscription to set the scope to the resource group
        resourceDetails.scope = val?.value?.resourceId;
        // buildResourceDetails will accept a return value of a different requestScope along side the resource details
        // In the case that the scope of the policy check request hasn't been created e.g. a new resource group
        // You'll need to request it at the scope where the new scope is about to be created
        return val?.mode === FxResourceGroupDropDown.Mode.CreateNew ? { requestScope, resourceDetails } : { requestScope: resourceDetails.scope, resourceDetails };
    },
}).validation;

```

<a name="building-custom-create-forms-arm-dropdown-options-policy-aware-controls-multi-resource-policy-aware-controls"></a>
##### Multi-resource Policy Aware Controls
Your create experience might deploy multiple resources, and you may have fields which differ between them. To enable multiple resources (and resource types) to be validated against policies, each additional resource needs a child policy factory.
```typescript

// Locations is our first control which will be validated with a pending field. This means it can become invalid
// or valid depending on other values in the resource. In this sample we're doing a multi resource create
// so more than one policy check could invalidate this location. With this in mind, we'll need to create a child
// factory for each resource we're creating (if they have any different properties) before creating field validations with pending
// fields. This allows us to maintain the previous resource detail reducers from the subscription and resource group dropdowns.
// Optionally, you can not copy over the buildResourceDetails, and recreate the policy reducers from the beginning.
// eslint-disable-next-line deprecation/deprecation
const secondaryEnginePolicyFactory = primaryEnginePolicyFactory?.createChildFactory({ copyBuildResourceDetails: true });
// eslint-disable-next-line deprecation/deprecation
const backupEnginePolicyFactory = primaryEnginePolicyFactory?.createChildFactory({ copyBuildResourceDetails: true });

const fetchedValues = ko.observableArray<FxLocationDropDown.Location>();
// eslint-disable-next-line deprecation/deprecation
const createLocationFieldValidation = (factory: PolicyValidationFactory) => {
    // This factory can also take multiple potential values.
    // This is useful only for values within the resourceContent as only
    // they can have pending fields
    // eslint-disable-next-line deprecation/deprecation
    return factory?.createFieldValidation<FxLocationDropDown.Location>({
        pendingValues: {
            // The potential field to be set by the string values e.g. resourceDetails.resourceContent.location = "location"
            field: "location",
            // Return values for each potential value to be placed in the resource Content
            // This is run in a computed, so when fetchedValues is updated, this list will also be updated
            // And trigger a policy check.
            values: () => fetchedValues(),
            // This will map your value to a string for placement in the field
            // of the resource. In this instance resourceDetails.resourceContent.location = loc.name
            valueToField: (loc) => loc.name,
        },
        buildResourceDetails: (resourceDetails, val) => {
            resourceDetails.resourceContent = {
                // type is required
                type: resourceType,
                location: val?.name,
            };
            // api version of the resource is required
            resourceDetails.apiVersion = "2014-04-01";
            return resourceDetails;
        },
    });
};
const locationPolicyValidations = primaryEnginePolicyFactory ? [primaryEnginePolicyFactory, secondaryEnginePolicyFactory, backupEnginePolicyFactory].map(createLocationFieldValidation) : [];

```

Tags are also able to validate against policies with a different method of creating pending fields at run time instead of statically.
```typescript

// In some policy validations, you won't know what fields you're going to validate until the control defines it.
// In that case use the pendingValuesGenerator
// eslint-disable-next-line deprecation/deprecation
const createTagFieldValidation = (factory: PolicyValidationFactory) => factory.createFieldValidation<FxTags.TaggedResource[]>({
    buildResourceDetails: (details, taggedResources) => {
        let resourceTypeVal = resourceType;
        [resourceTypeVal] = resourceTypeVal.split("?");
        details.resourceContent.tags = (taggedResources || []).reduce((acc, taggedResource) => {
            if (taggedResource.id.toLowerCase() === resourceTypeVal.toLowerCase()) {
                taggedResource.tags.reduce((acc, tag) => {
                    acc[tag.name] = tag.value;
                    return acc;
                }, acc);
            }
            return acc;
        }, {} as { [field: string]: string });
        return details;
    },
    // This function generates multiple pending fields for tags to be validated
    pendingValuesGenerator: (taggedResources) => {
        const [resourceTypeVal] = resourceType.split("?");
        const pendingValues = (taggedResources || []).reduce((acc, taggedResource) => {
            if (taggedResource.id.toLowerCase() === resourceTypeVal.toLowerCase()) {
                taggedResource.tags.reduce((acc, tag) => {
                    acc.push({
                        field: `tags.${tag.name}`,
                        valueToField: () => tag.value,
                        fieldToDisplay: () => {
                            return {
                                displayField: clientStrings.tag.format(tag.name),
                                displayValue: tag.value,
                            };
                        },
                    });
                    return acc;
                }, acc);
            }
            return acc;
        }, [] as PendingValues<FxTags.TaggedResource[]>[]);
        pendingValues.push({
            field: "tags",
            valueToField: null,
            fieldToDisplay: (field) => ({
                displayField: clientStrings.tag.format(field.split(".").slice(1).join(".")),
            }),
        });
        return pendingValues;
    },
}).validation;

const tagsValidations = (primaryEnginePolicyFactory) ? [primaryEnginePolicyFactory, secondaryEnginePolicyFactory, backupEnginePolicyFactory].map(createTagFieldValidation) : [];
const tagsByResource = FxTags.create(container, {
    resources: tagResources,
    validations: [...(primaryEnginePolicyFactory ? tagsValidations : [])],
    // Optional -> provide an observable for the value of the control if the value will need to be updated manually.
    // tags: this._tags,
});

```

Lastly we set the validations on the controls which set properties on separate resources being created and checked against policies independently.
```typescript

// Here we are able to run policy validations across our different resources being created
// eslint-disable-next-line deprecation/deprecation
const createNameFieldValidation = (policyValidationFactory: PolicyValidationFactory) => policyValidationFactory.createFieldValidation<string>({
    buildResourceDetails: (details, value) => {
        details.resourceContent.name = value;
        return details;
    },
    pendingValues: {
        field: "name",
    },
}).validation;
const [primaryNameFieldValidation, secondaryNameFieldValidation, backupNameFieldValidation] = (primaryEnginePolicyFactory) ? [primaryEnginePolicyFactory, secondaryEnginePolicyFactory, backupEnginePolicyFactory].map(createNameFieldValidation) : [];
const primaryEngineNameTextBox = FxTextBox.create(container, {
    label: ClientResources.primaryEngineName,
    placeHolderText: ClientResources.enterName,
    // Make sure to set the match validation with the control it's meant for
    validations: [...nameValidations, primaryNameFieldValidation],
});
this._primaryEngineName = primaryEngineNameTextBox.value;

const secondaryEngineNameTextBox = FxTextBox.create(container, {
    label: ClientResources.secondaryEngineName,
    placeHolderText: ClientResources.enterName,
    // This will trigger a different policy check request
    validations: [...nameValidations, secondaryNameFieldValidation],
});
this._secondaryEngineName = secondaryEngineNameTextBox.value;

const backupEngineNameTextBox = FxTextBox.create(container, {
    label: ClientResources.backupEngineName,
    placeHolderText: ClientResources.enterName,
    validations: [...nameValidations, backupNameFieldValidation],
});
this._backupEngineName = backupEngineNameTextBox.value;

this._backupEngineName = backupEngineNameTextBox.value;

```

<a name="building-custom-create-forms-arm-dropdown-options-additional-custom-validation-to-the-arm-fields"></a>
#### Additional/custom validation to the ARM fields
Sometimes you need to add extra validation on any of the previous ARM fields. For instance, you might want to check with you RP/backend to make sure that the selected location is available in certain circumstances. To do that, just add a custom validator like you would do with any regular form field. Example:

```ts
// The locations drop down.
var locationCustomValidation = new MsPortalFx.ViewModels.CustomValidation(
    validationMessage,
    (value) => {
        return this._dataContext.validateLocation(value).then((isValid) => {
            // Resolve with undefined if 'value' is a valid selection and with an error message otherwise.
            return MsPortalFx.ViewModels.getValidationResult(!isValid && validationMessage || undefined);
        }, (error) => {
            // Make sure your custom validation never throws. Catch the error, log the unexpected failure
            // so you can investigate later, and fail open.
            logError(...);
            return MsPortalFx.ViewModels.getValidationResult();
        });
    });
var locationsDropDownOptions: LocationsDropDown.Options = {
    ...,
    validations: ko.observableArray<MsPortalFx.ViewModels.Validation>([
        new MsPortalFx.ViewModels.RequiredValidation(ClientResources.selectLocation),
        locationCustomValidation // Add your custom validation here.
    ])
    ...
};
this.locationsDropDown = new LocationsDropDown(container, locationsDropDownOptions);
```

<a name="building-custom-create-forms-arm-dropdown-options-pdl-wizards-and-creates"></a>
#### PDL Wizards and Creates
The Azure portal has a **legacy pattern** for wizard blades, however customer feedback and usability has proven the design
isn't ideal and shouldn't be used. Additionally, earlier creates weren't designed for [TypeScript decorators](portalfx-no-pdl.md).
and leads to a more complicated design and extended development time. The Portal team recommends a new pattern with full screen
create blades utilizing the tabs controls as seen in the [TypeScript Decorator Engine Blade](engine-blade)

Email [ibizafxpm](mailto:ibizafxpm@microsoft.com?subject=Create wizards + full screen) if you have any questions about
the current state of wizards and full-screen Create support.

<a name="building-custom-create-forms-validation"></a>
### Validation
Create is our first chance to engage with and win customers and every hiccup puts us at risk of losing customers; specifically
new customers. As a business, we need to lead that engagement on a positive note by creating resources quickly and easily.
When a customer clicks the Create button, it should succeed. This includes all types of errors – from
using the wrong location to exceeding quotas  to unhandled exceptions in the backend. [Adding validation to your form fields](portalfx-forms-field-validation.md)
will help avoid failures and surface errors before deployment.

In an effort to resolve Create success regressions as early as possible, sev 2 [ICM](https://icm.ad.msft.net) (internal only)
incidents will be created and assigned to extension teams whenever the success rate
drops 5% or more for 50+ deployments over a rolling 24-hour period.


<a name="building-custom-create-forms-automation-options"></a>
### Automation options
The provisioning decorator provides an "Automation options" blade reference in the provisioning context.
This can be invoked in the same way as a template deployment. You can add this next to your create button.
```
container.openBlade(provisioning.getAutomationBladeReference(this._supplyTemplateDeploymentOptions())
```

<a name="building-custom-create-forms-testing"></a>
### Testing
Due to the importance of Create and how critical validation is, all Create forms should have automated testing to help
avoid regressions and ensure the highest possible quality for your customers. Refer to [testing guidance](portalfx-test.md)
for more information on building tests for your form.

<a name="building-custom-create-forms-feedback"></a>
### Feedback

When customers leave the Create blade before submitting the form, the portal asks for feedback. The feedback is stored
in the standard [telemetry](portalfx-telemetry.md) tables. Query for
`source == "FeedbackPane" and action == "CreateFeedback"` to get Create abandonment feedback.


<a name="building-custom-create-forms-telemetry"></a>
### Telemetry

Portal has a `ProvisioningBladeOpen` telemetry event to create which records duration telemetry as well as success and abandoned
states based on whether the user completed a create or closed out before provisioning. For example you can see [how long](create-length-telemetry)
it takes for your customers to decide whether or not to create your resource. Just set `extensionName` in the query to see your blade.


For deployment telemetry, refer to [Create telemetry](/portal-sdk/generated/index-portalfx-extension-monitor.md#portalfx-telemetry-create) for additional information on usage dashboards and queries.

<a name="building-custom-create-forms-troubleshooting"></a>
### Troubleshooting

Refer to the [troubleshooting guide](portalfx-create-troubleshooting.md) for additional debugging information.

[plus-new]: ../media/portalfx-create/plus-new.png
[marketplace]: ../media/portalfx-ui-concepts/gallery.png
[engine-blade]: https://df.onecloud.azure-test.net/?clientOptimizations=false&samplesExtension=true#create/Microsoft.EngineNoPdlV1
[create-length-telemetry]: https://dataexplorer.azure.com/clusters/azportalpartner/databases/AzurePortal?query=H4sIAAAAAAAAA3WQQU8CMRCF7/sr5saSNLAmYjRkPRg9cFBJJN7L9okl23YznVUw/nhbRYgYDp3Dm9f3vkwLIWwEPtrgH7QD1TQYTIs26Q1DC2616CTebWSBFg7C2+KT3l/BoDmjsREL6/Ak2nV0TXoVynMz3Ft0IymZ6hQ75/Bmc4/1q5tWGzx28IO9c4+RzX+ZkudbMLTM/2Y+ivYNZiaBSYjCKbHsNEesY/ClScjDUZ6jI3/m6jis0cg/eLVjVYdyRTH03OB3dR+MfbFgRc76XhBr07POm/FZVVXji0pR01p4eQb/BBwBKMpYxbQ4HDchxd45zfYD1CHVebEtYrnrUDRJsZfpXU2GtNyeYMpHioHltOMLxYUzDewBAAA=

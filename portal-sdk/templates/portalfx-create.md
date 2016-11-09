<properties title="" pageTitle="Building create experiences" description="" authors="nickharris" />

## Building create experiences

The Azure portal offers 3 ways to build a Create form:

1. *[Deploy to Azure](/documentation/articles/portalfx-create-deploytoazure)*

    There are simple forms auto-generated from an ARM template with very basic controls and validation. Deploy to Azure is the quickest way to build a Create form and even integrate with the Marketplace,
    but is very limited in available validation and controls.

    Use [Deploy to Azure](/documentation/articles/portalfx-create-deploytoazure) for [community templates](https://azure.microsoft.com/documentation/templates) and simple forms.

2. *[Solution templates](https://github.com/Azure/azure-marketplace/wiki)*

    These are simple forms defined by a JSON document separate from the template. Solution templates can be used by any service, however there are some limitations on supported controls.

    Use [Solution templates](https://github.com/Azure/azure-marketplace/wiki) for IaaS-focused ARM templates.

3. *Custom form*

    These are fully customized form built using TypeScript in an Azure portal extension. Most teams build custom Create forms for full flexibility in the UI and validation. This requires developing an extension.

### Create a template blade

#### Create Marketplace package (aka Gallery package)

The Marketplace provides a categorized collection of packages which can be created in the portal. Publishing your
package to the Marketplace is simple:

1. Create a package
1. Side-load your extension to test it locally
1. Publish it to the DF Marketplace yourself, if applicable
1. Set a "hide key" before testing in production
1. Send the package to the Marketplace team to publish it for production
1. Notify the Marketplace team when you're ready to go live

Note that the +New menu is curated and can change at any time, based on C+E leadership business goals. Ensure
documentation, demos, and tests use [Create from Browse](/documentation/articles/portalfx-browse#create) or
[deep-links](/documentation/articles/portalfx-links) as the entry point.

![The +New menu][plus-new]

Learn more about [publishing packages to the Marketplace](/documentation/sections/gallery).

![The Marketplace][marketplace]


#### Handling provider callbacks


#### Handling provisioner callbacks

The parameter collection framework is the piece that ties all the above components together. At the core, this framework
consists of two types of entities: Providers and Collectors. As their names suggest, providers implement an interface
that allows them to provide data to collectors in a well understood format. Similarly, collectors implement an interface
that allows them to collect this data from the providers.

Learn more about [parameter collectors](/documentation/articles/portalfx-parameter-collection-overview).


#### Build form

Use built-in form fields, like TextField and DropDown, to build your form the way you want. Use the built-in EditScope
integration to manage changes and warn customers if they leave the form. Learn more about
[building forms](/documentation/articles/portalfx-forms).

#### Design for a single blade
All Create experiences should be designed for a single blade. Always prefer dropdowns over pickers (form fields that
allow selecting items from a list in a child blade) and avoid using [selectors](#controls-selectors-and-pickers)
(form fields that open child blades).

Email [ibizafxpm](mailto:ibizafxpm@microsoft.com?subject=Full-screen Create) if you have any questions about the current
state of full-screen Create experiences.

#### Standard ARM fields
All ARM subscription resources require a subscription, resource group, location and pricing dropdown. The portal offers built-in controls
for each of these. Refer to the EngineV3 Create sample
(`SamplesExtension\Extension\Client\Create\EngineV3\ViewModels\CreateEngineBladeViewModel.ts`) for a working example.

##### Subscriptions dropdown
```ts
*`MsPortalFx.Azure.Subscriptions.DropDown`

// The subscriptions drop down.
var subscriptionsDropDownOptions: SubscriptionsDropDown.Options = {
    options: ko.observableArray([]),
    form: this,
    accessor: this.createEditScopeAccessor((data) => {
        return data.subscription;
    }),
    validations: ko.observableArray<MsPortalFx.ViewModels.Validation>([
        new MsPortalFx.ViewModels.RequiredValidation(ClientResources.selectSubscription)
    ]),
    // Providing a list of resource providers (NOT the resource types) makes sure that when
    // the deployment starts, the selected subscription has the necessary permissions to
    // register with the resource providers (if not already registered).
    // Example: Providers.Test, Microsoft.Compute, etc.
    resourceProviders: ko.observable([resourceProvider]),
    // Optional -> You can pass the gallery item to the subscriptions drop down, and the
    // the subscriptions will be filtered to the ones that can be used to create this
    // gallery item.
    filterByGalleryItem: this._galleryItem
};
this.subscriptionsDropDown = new SubscriptionsDropDown(container, subscriptionsDropDownOptions);
```
##### Resource groups dropdown
```ts
*`MsPortalFx.Azure.ResourceGroups.DropDown`

var resourceGroupsDropDownOptions: ResourceGroups.DropDown.Options = {
    options: ko.observableArray([]),
    form: this,
    accessor: this.createEditScopeAccessor((data) => {
        return data.resourceGroup;
    }),
    label: ko.observable<string>(ClientResources.resourceGroup),
    subscriptionIdObservable: this.subscriptionsDropDown.subscriptionId,
    validations: ko.observableArray<MsPortalFx.ViewModels.Validation>([
        new MsPortalFx.ViewModels.RequiredValidation(ClientResources.selectResourceGroup),
        new MsPortalFx.Azure.RequiredPermissionsValidator(requiredPermissionsCallback)
    ]),
    // Specifying the 'defaultNewValue' property provides a default name in the create new
    // text box (shown if the user chooses to create a new resource group). If a resource group
    // already exists with the same name, it will be automatically incremented (e.g.
    // "NewResourceGroup_1", "NewResourceGroup_2", etc.).
    defaultNewValue: "NewResourceGroup",
    // Optional -> RBAC permission checks on the resource group. Here, we're making sure the
    // user can create an engine under the selected resource group, but you can add any actions
    // necessary to have permissions for on the resource group.
    requiredPermissions: ko.observable({
        actions: actions,
        // Optional -> You can supply a custom error message. The message will be formatted
        // with the list of actions (so you can have {0} in your message and it will be replaced
        // with the array of actions).
        message: ClientResources.enginePermissionCheckCustomValidationMessage.format(actions.toString())
    })
};
this.resourceGroupDropDown = new ResourceGroups.DropDown(container, resourceGroupsDropDownOptions);
```
##### Locations dropdown
```ts
*`MsPortalFx.Azure.Locations.DropDown`

  // The locations drop down.
 var locationsDropDownOptions: LocationsDropDown.Options = {
    options: ko.observableArray([]),
    form: this,
    accessor: this.createEditScopeAccessor((data) => {
        return data.location;
    }),
    subscriptionIdObservable: this.subscriptionsDropDown.subscriptionId,
    resourceTypesObservable: ko.observable([resourceType]),
    validations: ko.observableArray<MsPortalFx.ViewModels.Validation>([
        new MsPortalFx.ViewModels.RequiredValidation(ClientResources.selectLocation)
    ])
    // Optional -> Add location filtering by either providing a list of allowed locations
    // OR a list of disallowed locations (not both). This can also be an observable.
    // filter: {
    //     allowedLocations: {
    //         locationNames: [ "centralus" ],
    //         disabledMessage: "This location is disabled for demo purporses (not in allowed locations)."
    //     },
    //     OR -> disallowedLocations: [{
    //         name: "westeurope",
    //         disabledMessage: "This location is disabled for demo purporses (disallowed location)."
    //     }]
    // }
};
this.locationsDropDown = new LocationsDropDown(container, locationsDropDownOptions);
```
##### Pricing dropdown
```ts
*`MsPortalFx.Azure.Pricing.DropDown`

import * as Specs from "Fx/Specs/DropDown";
...
public specDropDown: Specs.DropDown;
...
this.specDropDown = new Specs.DropDown(container, {
    form: this,
    accessor: this.createEditScopeAccessor((data) => {
        return data.spec;
    }),
    supplyInitialData: supplyInitialData,
    /**
     * This extender should be the same extender view model used for the spec
     * picker blade. You may need to extend your data context or share your data context between
     * your create area and you spec picker area to use the extender with the current datacontext
     */
    specPickerExtender: new BillingSpecPickerExtender.BillingSpecPickerV3Extender(container, supplyInitialData(), dataContext)
});

```

#### Wizards
The Azure portal has a **legacy pattern** for wizard blades, however customer feedback and usability has proven the design
isn't ideal and shouldn't be used. Additionally, the wizard wasn't designed for
[Parameter Collector v3](/documentation/articles/portalfx-parameter-collection-getting-started), which leads to a more
complicated design and extended development time. The Portal Fx team is testing a new design for wizards to address
these issues and will notify teams once usability has been confirmed and APIs updated. Wizards are discouraged and will
not be supported.

Email [ibizafxpm](mailto:ibizafxpm@microsoft.com?subject=Create wizards + full screen) if you have any questions about
the current state of wizards and full-screen Create support.

### Validation
Create is our first chance to engage with and win customers and every hiccup puts us at risk of losing customers; specifically
new customers. As a business, we need to lead that engagement on a positive note by creating resources quickly and easily.
When a customer clicks the Create button, it should succeed. This includes all types of errors – from
using the wrong location to exceeding quotas  to unhandled exceptions in the backend. [Adding validation to your form fields](/documentation/articles/portalfx-forms-field-validation)
will help avoid failures and surface errors before deployment.

In an effort to resolve Create success regressions as early as possible, sev 2 [ICM](http://icm.ad.msft.net) (internal only)
incidents will be created and assigned to extension teams whenever the success rate
drops 5% or more for 50+ deployments over a rolling 24-hour period.

#### ARM template deployment validation
If your form uses the ARM provisioner, you need to opt in to deployment validation manually by adding
`CreateFeatures.EnableArmValidation` to the `HubsProvisioner<T>` options. Wizards are not currently supported; we are
working on a separate solution for wizards. Email [ibizafxpm](mailto:ibizafxpm@microsoft.com?subject=Create wizards + deployment validation)
if you have any questions about wizard support.

```ts
 this.armProvisioner = new HubsProvisioner.HubsProvisioner<DeployFromTemplateDataModel>(container, initialState, {
    supplyTemplateDeploymentOptions: this._supplyProvisioningPromise.bind(this),
    actionBar: this.actionBar,
    parameterProvider: this.parameterProvider,
    createFeatures: Arm.Provisioner.CreateFeatures.EnableArmValidation
});
```

Refer to the Engine V3 sample for a running example
- Client\Create\EngineV3\ViewModels\CreateEngineBladeViewModel.ts
- [http://aka.ms/portalfx/samples#create/microsoft.engine](http://aka.ms/portalfx/samples#create/microsoft.engine)

### Automation options
If your form uses the ARM provisioner, you will get an "Automation options" link in the action bar by default. This link
gets the same template that is sent to ARM and gives it to the user. This allows customers to automate the creation of
resources via CLI, PowerShell, and other supported tools/platforms. Wizards are not currently supported; we are working
on a separate solution for wizards.

Email [ibizafxpm](mailto:ibizafxpm@microsoft.com?subject=Create wizards + automation options)
if you have any questions about wizard support.


### Testing

Due to the importance of Create and how critical validation is, all Create forms should have automated testing to help
avoid regressions and ensure the highest possible quality for your customers. Refer to [testing guidance](/documentation/articles/portalfx-test)
for more information on building tests for your form.

### Feedback

When customers leave the Create blade before submitting the form, the portal asks for feedback. The feedback is stored
in the standard [telemetry](/documentation/articles/portalfx-telemetry) tables. Query for
`source == "FeedbackPane" and action == "CreateFeedback"` to get Create abandonment feedback.


### Telemetry

Refer to [Create telemetry](/portal-sdk/generated/index-portalfx-extension-monitor.md#portalfx-telemetry-create) for additional information on usage dashboards and queries.

### Troubleshooting

Refer to the [troublshooting guide](/documentation/articles/portalfx-create-troubleshooting) for additional debugging information.


### Additional topics

#### Initiating Create from other places
Some scenarios may require launching your Create experience from outside the +New menu or Marketplace. The following
are supported patterns:

* **From a command using the ParameterCollectorCommand** -- "Add Web Tests" command from the "Web Tests" blade for a web app
* **From a part using the SetupPart flow** -- "Continuous Deployment" setup from a web app blade

![Create originating from blade part][create-originating-from-blade-part]


[create-originating-from-blade-part]: ../media/portalfx-create/create-originating-from-blade-part.png
[plus-new]: ../media/portalfx-create/plus-new.png
[marketplace]: ../media/portalfx-ui-concepts/gallery.png

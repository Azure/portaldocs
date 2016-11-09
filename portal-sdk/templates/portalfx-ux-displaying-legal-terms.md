<properties title="Displaying legal terms in a create form" pageTitle="Displaying legal terms in a create form" description="" authors="danyuen" />

<tags
    ms.service="portalfx"
    ms.workload="portalfx"
    ms.tgt_pltfrm="portalfx"
    ms.devlang="portalfx"
    ms.topic="get-started-article"
    ms.date="11/6/2015" 
    ms.author="brhavard"/>

# Displaying legal terms in a create form

## Overview
If you're designing a [create form][create forms article] which provisions a third party marketplace item, then you need to display the third party company's legal terms and privacy policy. The legal terms blade is part of the Azure Marketplace, and is available to anyone who develops a create form for a marketplace item that includes third party products. It displays a list of the products being purchased, their prices, and links to the legal terms and privacy policy that the third party seller has configured through the [publishing portal][publishing portal]. Meter pricing and Azure compute charges for any virtual machines are included.

> [WACOM.NOTE] This article is for version 2 of the legal terms blade (named `PCLegalTermsV2Blade` in the `Microsoft_Azure_Marketplace` extension). You may see references to an older blade named `LegalTermsBlade`. That blade is deprecated and will be removed.

## Legal Requirements for Create Forms
The legal terms blade *must* be displayed whenever a user purchases a third party product through the Azure Marketplace, and should be the final step in the create form.

> [WACOM.NOTE] Never display legal/privacy terms as text in your own part or control. Microsoft Legal has specific requirements that the legal terms blade is designed to fulfill. Contact [the marketplace team][1store] if you have questions, or special needs that the legal terms blade does not meet.

The presentation and behavior of the legal terms form elements must also be consistent across all create forms. To achieve this, we've provided a helper class for configuring the legal terms form controls which you should use (see [below][integration section]). If you have questions or concerns about using the helper class, please contact [the marketplace team][1store] to discuss your requirements.

## Referencing the Legal Terms Blade
In order to display legal terms in your create form, you need to:

 1. **Install the marketplace extension NuGet package**: Include the `Legal.ts` helper module in your project by installing the Microsoft.Portal.Extensions.Marketplace NuGet project.  
 1. **Declare and configure the selector**: Create a public property of type `Legal.Selector` in your viewmodel. Then, implement an observable which which provides a `LegalTermsConfig` object, and is updated whenever the user updates a value on your form that changes its result.
 1. **Reset the legal terms when form inputs change**: Wire up your form so that it calls `Selector.resetLegalTerms()` whenever the user changes any value on your form. 
 1. **Include the selector in your form and PDL:** Add the selector as a child of your last form section, and add a blade action to your part.

The following screenshot shows how the legal terms selector should look when you're done:

![Example of a legal terms selector on a form][selector example image]

### Installing the Marketplace Extension NuGet Package
The Microsoft.Portal.Extension.Marketplace package is included in the Azure Portal SDK. You can add a reference by following these steps:

 1. Open your Portal extension project in Visual Studio.
 1. Expand the extension project in the Solution Explorer, right click on References, and choose Manage NuGet Packages.
 1. In the Package Source dropdown in the upper right hand of the Nuget Package Manager window, change the selection to PortalSDK.
 1. Click on Browse above the search box, find the package named Microsoft.Portal.Extensions.Marketplace, and install it.

As part of the installation, a TypeScript module named `Legal.ts` is copied to the `Client\LegalTermsSdk` folder in your project. This is a helper module which you will reference in the following steps. Don't edit this file, since it will be overwritten if you upgrade the Microsoft.Portal.Extension.Marketplace package.

> [WACOM.NOTE] Microsoft internal teams should install packages by [following the instructions on the OneBranch wiki][onebranch packages]. Installing the package this way won't automatically copy `Legal.ts` into your project, but you can use the [MSBuild.NugetContentRestore][NugetContentRestore] package to automatically copy `Legal.ts` during the build.

If, for some reason, you need to place the `Legal.ts` file in a different location, you should add an MSBuild task to copy the file from the NuGet package before each build. Otherwise, `Legal.ts` will not be updated automatically when the Microsoft.Portal.Extension.Marketplace package is updated.

### Declaring and Configuring the Selector
Start by referencing `Legal.ts` from your form's ViewModel.

```ts
import Legal = require("../../LegalTermsSdk/Legal");
```

Then add a public property of type `Legal.Selector`.

```ts
/**
* A helper class that configures the selector and parameter provider for the legal terms blade.
*/
public legalTermsSelector: Legal.Selector;
```

In your ViewModel constructor, initialize the selector, providing an observable `LegalTermsConfig` via the `options` argument.

```ts
this.legalTermsSelector = new Legal.Selector(container, this, "legalterms", {
    legalTermsConfig: ko.pureComputed(() => {
        const dataModel = this.editScope() && this.editScope().root;

        const subscription = dataModel && dataModel.subscription();
        const galleryCreateOptions = this.armProvisioner.armProvisioningConfig && this.armProvisioner.armProvisioningConfig.galleryCreateOptions;

        if (subscription && subscription.subscriptionID) {
            return <Legal.LegalTermsConfig>{
                subscriptionId: subscription.subscriptionID,
                legalTermsLanguage: Legal.LegalTermsLanguageEnum.TemplateDeployment,
                galleryItem: galleryCreateOptions && galleryCreateOptions.galleryItem
            };
        }

        // Lock the legal terms blade if the fields required to display legal terms have not been populated.
        return null;
    })
});
```

For the second and third arguments of the constructor, provide the view model for the form (typically `this`), and the name of the property on your `EditScope` which stores the legal terms acceptance result. The edit scope property should be a boolean (`true` if the user has accepted the legal terms, and `false` otherwise).

When implementing the `LegalTermsConfig` observable, take note of a few requirements:

 * There may be many several fields on your form which you use to build the `LegalTermsConfig`. If the user hasn't completed one of these fields, stop and return `null` (this will cause the selector to be locked). If you return an incomplete `LegalTermsConfig`, the user will be able to open the legal terms blade prematurely, and will either see incorrect terms or an error message.
 * Make sure this observable is subscribed to any fields which are used to build the `LegalTermsConfig`, so that the selector is notified when your form is updated. Whenever one of these fields is updated return a new object so that the observable will fire an update (the selector won't be notified if you update the properties of the existing LegalTermsConfig).
 * Consider using the [KnockoutJS throttle extension][knockout throttle extension] if any of the form fields you use to build `LegalTermsConfig` may be changed multiple times in quick succession (say, if it is updated continuously as the user types). Every update of this observable triggers computation and a refresh of the selector.
 
The [parameters and settings section][parameters section] describes the settings and values you need to provide in the `LegalTermsConfig` object. Nearly all forms will need to provide more inputs than in the above example, so make sure to read this section.

### Resetting the Legal Terms When Form Inputs Change
Microsoft Legal requires the user to accept the legal terms again after any change is made to the values on the create form. So, if the user opens the legal terms blade and accepts the legal terms, but then changes an entry on the create form (say, the name of the VM they are deploying), they must accept the legal terms *again* before deploying.

To enforce this behavior, call `Legal.Selector.resetLegalTerms()` whenever the value of any form field changes. Here is an example of resetting the legal terms blade whenever the value of a `Forms.Selector` control is updated:

```ts
this.mySelector.value.subscribe(container, () => {
    this.legalTermsSelector.resetLegalTerms();
});
```

The `resetLegalTerms()` method will have no effect if the user hasn't accepted the legal terms yet.

### Including the Selector in Your Form and PDL
When you initialize your form section, include `Legal.Selector.control` as the last control in your last form section.

```ts
this.mySection = new Forms.Section.ViewModel(container, <Forms.Section.Options>{
    children: ko.observableArray([
        ...
        this.legalTermsSelector.control
    ])
});

this.sections.push(this.mySection);
```

Finally, add the following blade action to your part in the PDL file. You must use a `DynamicBladeAction`, rather than a `BladeAction`, because the `Legal.Selector` code will provide the name and extension of the legal terms blade at runtime.

```xml
<DynamicBladeAction SelectableSource="legalTermsSelector.control.selectable" ParameterCollector="legalTermsSelector.collector" />
```

## Parameters and Settings
Every `LegalTermsConfig` object includes a few basic parameters:

 * `legalTermsLanguage`: This value determines which set of legal text is displayed. If the gallery item which opened your create blade is an ARM template which may contain more than one product, then set this to `LegalTermsLanguage.TemplateWithProducts`. Otherwise, set this to `LegalTermsLanguage.Default`.
 * `subscriptionId`: Set this to the ID of the subscription with which the product is being purchased.
 * `galleryItem`: Use this property to pass the marketplace item which is being deployed. This is typically obtained by reading the `armProvisioningConfig.galleryCreateOptions` property of the `MsPortalFx.Azure.ResourceManager.Provisioner<T>` used by the form.

### Listing the Purchased Products
The legal blade needs to know which virtual machines and app services the user is purchasing. The `LegalTermsConfig.productPurchases` array lists the 3rd party products being purchased. Add one `VirtualMachinePurchase` object for each 3rd party virtual machine SKU, and one one `AppServicePurchase` for each dev service or data service. If the user is buying more than one instance of the same VM image, then include only one `VirtualMachinePurchase` object and use `VirtualMachinePurchase.firstPartyVirtualMachine.quantity` to pass the number of instances.

Use `LegalTermsConfig.firstPartyVirtualMachinePurchases` to pass virtual machines that don't include third party software (i.e. any VM image published by Microsoft).

In some cases, you may be deploying an ARM template without knowing exactly what the template contains (for example, if the template was submitted through the publishing portal). In these cases, use the response from the ARM `/validate` call to to determine which products will be deployed.

If you have questions about how do determine which products are being purchased, email the [Azure Marketplace team][1store].

#### VirtualMachinePurchase Properties
The following properties must be supplied if the product being purchased is a virtual machine image. The values for `firstPartyVirtualMachine` and `thirdPartyVirtualMachineCost` should be available as part of the specs that you pass to the pricing tier selector or spec picker.

 * `publisherId`: The publisherId of the product (in the [publishing portal][publishing portal] this is also called publisher namespace). This corresponds with `galleryItem.products[i].offerDetails.publisherId`.
 * `offerId`: The offerId of the product being purchased. This corresponds with `galleryItem.products[i].offerDetails.offerId`.
 * `planId`: The ID of the VM SKU which the user has chosen to deploy. This should be one of the values from `galleryItem.products[i].offerDetails.plans`.
 * `promotionCode`: The promotion code that the user has applied to this purchase. You can omit this parameter unless your create form accepts promotion codes.
 * `thirdPartyVirtualMachineCost.meterId`: The name of the meter used to calculate the price charged by the 3rd party company for this VM (not including Azure infrastructure costs). The meter name corresponds to HubsExtension.Azure.Pricing.ThirdPartyMeter.meterId, and changes depending on the number of cores in the virtual machine the user is provisioning.
 * `firstPartyVirtualMachine`: See the FirstPartyVirtualMachinePurchase section below.

#### FirstPartyVirtualMachinePurchase Properties
The `FirstPartyVirtualMachinePurchase` describes an Azure VM SKU. 

 * `quantity`: The number of instances of this VM SKU being deployed. If this value is ommitted, then it's assumed to be 1.
 * `skuDisplayName`: The display name of the VM spec / SKU that the user chose (in the spec picker or pricing tier selector). This value should be localized.
 * `operatingSystem`: Indicates whether the virtual machine is a Linux or Windows VM.
 * `hourlyCost.resourceId`: The resource ID corresponding to the chosen VM size in the Azure billing system. This is the ID which is passed in the `HubsExtension.Azure.Pricing.FirstPartyResource.resourceId` argument to the `getSpecsCosts` RPC.
 * `hourlyCost.quantity`: This is the number of units billed by Microsoft for this resource (the resource whose ID is resourceId) for every hour of use. For example, Standard A2 VMs have the same resourceId as Standard A1 VMs in the billing system, but the quantity billed per hour is doubled.

#### AppServicePurchase Properties
The following properties must be suplied if the product being purchased is an app service or data service.

 * `publisherId`: The publisherId of the product (in the [publishing portal][publishing portal] this is also called publisher namespace). This corresponds with `galleryItem.products[i].offerDetails.publisherId`.
 * `offerId`: The offerId of the product being purchased. This corresponds with `galleryItem.products[i].offerDetails.offerId`.
 * `planId`: The ID of the service plan which the user has chosen to deploy. This should be one of the values from `galleryItem.products[i].offerDetails.plans`.
 * `promotionCode`: The promotion code that the user has applied to this purchase. You can omit this parameter unless your create form accepts promotion codes.
 * `servicePlanName`: The display name of the service plan which the user has chosen (in the pricing tier selector or spec picker). This value will be displayed in the legal terms blade.
 * `meterIds`: A list of the meters which apply to the chosen service plan. The prices for these meters will be displayed on the legal terms blade.
 
 This screenshot shows how meters and service plan names are formatted in the legal terms blade:
 
 ![Screenshot of the legal terms for a dev service][meters example image]

## Questions or Comments
If you have questions or comments about the legal terms selector or legal terms blade, send them to the [Azure Marketplace team][1store].

[integration section]: #referencing-the-legal-terms-blade
[parameters section]: #parameters-and-settings
[purchases section]: #listing-the-purchased-products
[create forms article]: portalfx-ux-create-forms
[publishing portal]: https://publish.windowsazure.com/ 
[1store]: mailto:1store@microsoft.com
[selector example image]: ../media/portalfx-ux-displaying-legal-terms/legal_selector_sample.png
[meters example image]: ../media/portalfx-ux-displaying-legal-terms/legal_dev_service_sample.png
[infrastructure prices example image]: ../media/portalfx-ux-displaying-legal-terms/legal_vm_sample.png
[knockout throttle extension]: http://knockoutjs.com/documentation/throttle-extender.html
[publishing portal]: https://publish.windowsazure.com
[onebranch packages]: https://microsoft.sharepoint.com/teams/WAG/EngSys/Implement/_layouts/15/start.aspx#/OneBranch/Referencing%20a%20New%20Package.aspx
[NugetContentRestore]: https://github.com/panchilo/MSBuild.NugetContentRestore

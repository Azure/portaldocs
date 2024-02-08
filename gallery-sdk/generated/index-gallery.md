* [Gallery Overview](#gallery-overview)
    * [OnBoarding to the Gallery](#gallery-overview-onboarding-to-the-gallery)
    * [Gallery Experience](#gallery-overview-gallery-experience)
    * [Gallery Service](#gallery-overview-gallery-service)
    * [New Process](#gallery-overview-new-process)
* [Gallery Item Specificiations](#gallery-item-specificiations)
    * [Marketplace Search ##](#gallery-item-specificiations-marketplace-search)
    * [Gallery Package Search Metadata ##](#gallery-item-specificiations-gallery-package-search-metadata)
    * [Marketplace Suggest ##](#gallery-item-specificiations-marketplace-suggest)
    * [Localization ##](#gallery-item-specificiations-localization-1)
    * [FAQs and Notes ##](#gallery-item-specificiations-faqs-and-notes)
* [Gallery Item Metadata](#gallery-item-metadata)
    * [Identity Information](#gallery-item-metadata-identity-information)
    * [Metadata](#gallery-item-metadata-metadata)
    * [Images](#gallery-item-metadata-images-1)
    * [Component Metadata](#gallery-item-metadata-component-metadata)
    * [Categories](#gallery-item-metadata-categories)
    * [Links](#gallery-item-metadata-links)
    * [Additional Properities](#gallery-item-metadata-additional-properities)
    * [HTML Sanitization](#gallery-item-metadata-html-sanitization)
* [Gallery Item Field to UI Element Mappings](#gallery-item-field-to-ui-element-mappings)
    * [Create Hub](#gallery-item-field-to-ui-element-mappings-create-hub)
    * [Gallery Blade](#gallery-item-field-to-ui-element-mappings-gallery-blade)
    * [Gallery Item Details Blade](#gallery-item-field-to-ui-element-mappings-gallery-item-details-blade)
* [Gallery Package Development and Debugging](#gallery-package-development-and-debugging)
    * [How to test a Gallery Package with F5 Debug Experience using Test in Prod](#gallery-package-development-and-debugging-how-to-test-a-gallery-package-with-f5-debug-experience-using-test-in-prod)
    * [Testing in production](#gallery-package-development-and-debugging-testing-in-production)
    * [CoreXT considerations](#gallery-package-development-and-debugging-corext-considerations)
* [Legacy OneBox Development approach](#legacy-onebox-development-approach)
* [Using the Add to Resource Blade](#using-the-add-to-resource-blade)
    * [Launching Gallery Results Blade](#using-the-add-to-resource-blade-launching-gallery-results-blade)
    * [Reasons to use the Gallery Launcher](#using-the-add-to-resource-blade-reasons-to-use-the-gallery-launcher)
* [Your icon tile for the Azure Store](#your-icon-tile-for-the-azure-store)
    * [Use examples](#your-icon-tile-for-the-azure-store-use-examples)
    * [Icon tile aspects](#your-icon-tile-for-the-azure-store-icon-tile-aspects)
* [Developer tooling and productivity](#developer-tooling-and-productivity)
* [Gallery Frequently Asked Questions](#gallery-frequently-asked-questions)


<properties title="" pageTitle="Gallery Overview" description="" authors="adwest" />

<div class="wa-documentationArticle-meta">
  <p class="wa-linkArray">
    Related documents:
    <a href="/documentation/articles/gallery-overview">Overview</a>
    <a href="/documentation/articles/gallery-release-notes">Release Notes</a>
    <a href="/documentation/articles/gallery-items">Gallery Items</a>
    <a href="/documentation/articles/gallery-metadata">Gallery Metadata</a>
    <a href="/documentation/articles/gallery-development">Gallery Package Development and Debugging </a>
    <a href="/documentation/articles/gallery-icon-guidelines">Icon Guidelines</a>
    <a href="/documentation/articles/gallery-add-to-resource">Add To Resource</a>
    <a href="/documentation/articles/gallery-faq">FAQ</a>
  </p>
</div>

<a name="gallery-overview"></a>
# Gallery Overview

The gallery is the single place where users will go to find anything that can be created. The gallery includes both the create hub as well as the gallery blades. The entire gallery is driven from the gallery service which serves both gallery items and curation data. Placement of your resource or app in the gallery is driven by a controlled curation process.


> [WACOM.NOTE] In order to receive important notices and alerts about the gallery service, please subscribe to the [Azure Gallery Announcements](https://idwebelements/GroupManagement.aspx?Group=azuregallery&Operation=join) alias.

<a name="gallery-overview-onboarding-to-the-gallery"></a>
## OnBoarding to the Gallery
In order to add an item to the gallery, you must create and publish a gallery item. The contents of the gallery item are explained in more detail in the <a href="/documentation/articles/gallery-items">gallery item documentation</a>. However, the general idea of a gallery item is that it consists of all the metadata that drives the gallery UX around your resource in addition to various files that are used to run your resource create experience.

One extension may publish multiple gallery items and a single create extension can handle the creation of multiple gallery items. You must create at least one gallery item to enable your create experience.

<a name="gallery-overview-gallery-experience"></a>
## Gallery Experience
The gallery should be the single place where users browse for resources they will create in the portal. Additional sub-galleries, or resource specific gallery's should never be used in the portal. If you have a list of items that can be browsed and created, they will be in the gallery.

Items in the gallery should reflect what users are looking for. You should not ship your team in the gallery. For example, if your resource provider can create multiple resources you will likely publish multiple gallery items.

![Gallery items][gallery-items]

<a name="gallery-overview-gallery-service"></a>
## Gallery Service
The entire gallery in the portal is driven by the gallery service. The gallery service is responsible for hosting and serving gallery content including metadata, icons, screenshots, and Azure Templates. You can see all of the items in the production gallery service at: [https://gallery.azure.com/Microsoft.Gallery/galleryitems?api-version=2015-10-01&includePreview=true](https://gallery.azure.com/Microsoft.Gallery/galleryitems?api-version=2015-10-01&includePreview=true).


[gallery-items]: ../media/gallery-overview/gallery-items.png


<properties title="" pageTitle="Updated Azure Package Publishing Process (May 2019 Onwards)" description="" authors="ansud" />

<div class="wa-documentationArticle-meta">
  <p class="wa-linkArray">
    Related documents:
    <a href="/documentation/articles/gallery-overview">Overview</a>
    <a href="/documentation/articles/gallery-release-notes">Release Notes</a>
    <a href="/documentation/articles/gallery-items">Gallery Items</a>
    <a href="/documentation/articles/gallery-metadata">Gallery Metadata</a>
    <a href="/documentation/articles/gallery-development">Gallery Package Development and Debugging </a>
    <a href="/documentation/articles/gallery-icon-guidelines">Icon Guidelines</a>
    <a href="/documentation/articles/gallery-add-to-resource">Add To Resource</a>
    <a href="/documentation/articles/gallery-faq">FAQ</a>
  </p>
</div>

<a name="gallery-overview-new-process"></a>
## New Process

Starting **1st May 2019**, Gallery is switching the process of publishing to Azure Production. Packages would only be received via ICM for making updates to Azure Production Clouds. If you publish a product to Microsoft Azure directly without going through Cloud Partner Portal, these changes impact you.

<a name="gallery-overview-new-process-package-update-slas"></a>
### Package Update SLAs
The following SLAs would be provided for these incidents:

* Regular Package Update	- 48 business hours
* Urgent Package Updates	- 24 business hours
* Live Site - Case by Case basis, please email 1storehot after opening ICM.

<a name="gallery-overview-new-process-steps-to-update"></a>
### Steps to Update
-  Go through the gallery documentation here to create your package: https://aka.ms/GalleryDocs
-  Log onto ICM and use the template here to create an incident: https://aka.ms/UpdateGalleryPackage
-  Create an incident for each cloud and ensure the correct package is attached to each incident.
-  You may attach multiple packages to 1 incident as long as you are updating the same cloud (Public/Fairfax/Mooncake)
-  Ensure the right cloud instance is selected and environment is PROD.
-  Select deployment priority and submit the incident. No need to fill the fields for ‘service category azure’
-  Once your update is processed, the incident will be updated with confirmation of the changes and closed. You may reactivate the incident with information if you see any issues.

<a name="gallery-overview-new-process-other-important-points"></a>
### Other Important Points

-	Business justifications must be provided for expedited requests and will be tracked at SHR level. Enter N/A for normal priority.
-	For events such as Build, Inspire etc. , the SLAs may be suspended due to package volume. Hence we recommend pushing your packages much in advance.
-	The process to update packages in dogfood is fully self service and remains the same.


<properties title="" pageTitle="Gallery Item Specificiations" description="" authors="ansud" />

<div class="wa-documentationArticle-meta">
  <p class="wa-linkArray">
    Related documents:
    <a href="/documentation/articles/gallery-overview">Overview</a>
    <a href="/documentation/articles/gallery-release-notes">Release Notes</a>
    <a href="/documentation/articles/gallery-items">Gallery Items</a>
    <a href="/documentation/articles/gallery-metadata">Gallery Metadata</a>
    <a href="/documentation/articles/gallery-development">Gallery Package Development and Debugging </a>
    <a href="/documentation/articles/gallery-icon-guidelines">Icon Guidelines</a>
    <a href="/documentation/articles/gallery-add-to-resource">Add To Resource</a>
    <a href="/documentation/articles/gallery-faq">FAQ</a>
  </p>
</div>

<a name="gallery-item-specificiations"></a>
# Gallery Item Specificiations
Each item in the gallery is published to the gallery service using a format called the Azure Gallery Package (azpkg). The Azure Gallery Package contains all of the data needed to display items in the Ibiza gallery, build the Ibiza create experiences, and initiate resource creation through the Template Execution Service. The Azure Gallery Package (azpkg) is a single file that is packaged using the OPC (Open Package Conventions) standard. The Azure Gallery Package does not contain deployment or runtime resources such as code, zip files with software, or Virtual Machines or Disks. These resources are only referenced by the ARM template(s) contained in the Azure Gallery Package and are hosted externally to the Azure Gallery Package.

<a name="gallery-item-specificiations-azure-gallery-package-contents"></a>
### Azure Gallery Package Contents
<a name="gallery-item-specificiations-azure-gallery-package-contents-folder-structure"></a>
#### Folder Structure

```txt
/MyPackage/
/MyPackage/Manifest.json
/MyPackage/UIDefinition.json
/MyPackage/Icons/
/MyPackage/Screenshots/
/MyPackage/Strings/
/MyPackage/DeploymentTemplates/
/MyPackage/DeploymentFragments/
/MyPackage/DeploymentFragments/Template.json
```

<a name="gallery-item-specificiations-azure-gallery-package-contents-manifest-manifest-json"></a>
#### Manifest (Manifest.json)
The manifest file contains all of the metadata for your gallery item. For a visual representation of where each metadata value is used see the page on [gallery UI examples][gallery-ui-examples].

```json
{
    "$schema": "https://gallery.azure.com/schemas/2014-09-01/manifest.json#",
    "name": "string", // [A-Za-z0-9]+ (offer + plan namespace)
    "publisher": "string", // [A-Za-z0-9]+ (publisher namespace)
    "version": "string", // SemVer v2 Format - see https://semver.org/
    "displayName": "string", // max of 256 characters (plan name)
    "publisherDisplayName": "string", // max of 256 characters (publisher name)
    "publisherLegalName": "string", // max of 256 characters -->
    "summary": "string", // max of 100 characters -->
    "longSummary": "string", // required, max of 256 characters
    "description": "string", // max of 2000 characters. Can contain HTML
    "properties": [
        /* optional. max of 10 properties
           displayName: max of 64 characters
           value: max of 64 characters */
        { "displayName": "string", "value": "string" }
    ],
    "uiDefinition": {
        "path": "string" // required, path to file
    },
    "artifacts": [
        // you probably want an artifact, because this is where the link to your ARM deployment template goes!
        /* name: max of 256 characters, [A-Za-z0-9\-_]+
           type: Fragment, Template
           path: path to artifact
           isDefault: true|false */
        { "name": "string", "type": "string", "path": "string", "isDefault": true } // max of 128 characters
    ],
    "icons": {
        // see: https://auxdocs.azurewebsites.net/en-us/documentation/articles/gallery-items
        "small": "string", // path to image file
        "medium": "string", // medium images must be 90x90 pixels if bitmaps...
        "large": "string", // 40x40
        "wide": "string", // 255x115
        "hero": "string"
    },
    "links": [
        /* optional, but highly recommended, max of 10 links
           displayName: max of 64 characters
           uri: uri */
        { "displayName": "string", "uri": "string" }
    ],
    "products": [
        // optional - you don't need it in a simple gallery item
        {
            "displayName": "string", // max of 256 characters
            "publisherDisplayName": "string", // max of 256 characters
            "legalTerms": "string", // max can contain HTML
            "privacyPolicy": "string", // max can contain HTML
            "pricingDetailsUri": "string", // uri, optional
            // optional, if null means $0 cost (like "bring your own license")
            "offerDetails": {
                "publisherId": "string", // max of 256 characters
                "offerId": "string", // max of 256 characters
                "plans": [
                    {
                        "planId": "string", // max of 256 characters
                        "displayName": "string", // max of 256 characters full display name, includes os, version, etc.
                        "summary": "string", // max of 100 characters
                        "description": "string", // max of 2000 characters. Can contain HTML
                    }
                ]
            }
        }
    ],
    "screenshots": [ "string" ],
     "keywords": [ // When searching, you could use keywords to make your product more discoverable
        "Keyword1",
        "Keyword2"
    ],
    "categories": [ "string" ],
    "filters": [
        // type: Country/Region, Subscription, Resources, HideKey, OfferType, OfferCategory
        { "type": "string", "value": "string" }
    ]
}

```

<a name="gallery-item-specificiations-azure-gallery-package-contents-uidefinition-uidefinition-json"></a>
#### UIDefinition (UIDefinition.json)
The spec file contains all metadata, parameters, and other content used in the portal create experience. This file should be in the Portal folder.

```json
{
    "$schema": "https://gallery.azure.com/schemas/2015-02-12/UIDefinition.json#",
    "createDefinition": {
        "createBlade": {
            "name": "[bladeName]",
            "extension": "[extension]"
        },
        "startboardPart": {
            "name": "[partName]",
            "extension": "[extension]"
        },
        "startboardPartKeyId": "id"
    },
    "initialData": {
        "model": "Azure Engine 3.0"
    },
    "options": {
        "key": "value",
        // ...
    }
}
```

<a name="gallery-item-specificiations-azure-gallery-package-contents-template-template-json"></a>
#### Template (Template.json)
This file contains publisher, name, version and content of a template.

```json
{
  "$schema": "https://gallery.azure.com/schemas/2014-06-01/gallerytemplate.json#",
  "name": "[name]",
  "publisher": "[publisher]",
  "version": "[version]",
  "content": {
    // well-formed json
  }
}
```

<a name="localization"></a>
<a name="gallery-item-specificiations-localization"></a>
### Localization

<a name="gallery-item-specificiations-localization-images"></a>
#### Images
Images support localization. The following folder structure will be used for localizing images.
You can find the list of languages that Azure Portal supports <a href="/portal-sdk/generated/portalfx-localization.md#list-of-accepted-languages" target="_blank">here</a>.

```txt
/GalleryPackage
    /Images
        icon.png
        /fr
            icon.png
        /ja
            icon.png
        /pt-BR
            icon.png
        /pt-PT
            icon.png
```

<a name="gallery-item-specificiations-strings"></a>
### Strings
The strings folder contains json files for each localized language. The resource files are simple key value pair json documents. The files are named localization.resjson.
You can find the list of languages that Azure Portal supports <a href="/portal-sdk/generated/portalfx-localization.md#list-of-accepted-languages" target="_blank">here</a>.

The format of the resource file is as follows:

```json
{
	"key1": "value1",
	"key2": "value2"
}
```

Resource strings can be consumed by specifying the resource key in either the Manifest.json, the UIDefinition.json, or other localizable files.

Example using resource string in JSON file.

```json
{
	"property1": "ms-resource:key1",
	"property2": "ms-resource:key2"
}
```

The strings folder and resource files will have the following structure. The file at /Strings/resources.resjson is used as the default language.

```
/GalleryPackage
  /Strings
    /resources.resjson
      /fr
        resources.resjson
      /ja
        resources.resjson
      /pt-BR
        resources.resjson
      /pt-PT
        resources.resjson
```

<a name="gallery-item-specificiations-strings-arm-templates"></a>
#### ARM Templates
The package will contain 1 or more ARM template stored in the DeploymentTemplates folder.

<a name="gallery-item-specificiations-gallery-package-management"></a>
### Gallery Package Management

<a name="gallery-item-specificiations-gallery-package-management-getting-the-gallery-tools"></a>
#### Getting the Gallery Tools
You can find the latest version of the gallery tools (Microsoft.Azure.Gallery.AzureGalleryUtility) in the Marketplace NuGet feed: [https://msazure.visualstudio.com/One/_packaging?_a=feed&feed=MarketplaceOne](https://msazure.visualstudio.com/One/_packaging?_a=feed&feed=MarketplaceOne).

<a name="gallery-item-specificiations-gallery-package-management-creating-an-azure-gallery-package"></a>
#### Creating an Azure Gallery Package
After you have created the folder structure and added the required files to your pre-packaged Gallery Item you will need to run the AzureGallery tool to validate and build the Gallery Item Package.

To create packages run the following command.

```bat
> Microsoft.Azure.Gallery.AzureGalleryUtility.exe package -m [path to manifest.json] -o [output directory]
```

<a name="gallery-item-specificiations-gallery-package-management-publishing-a-azure-gallery-package-or-deployment-fragment"></a>
#### Publishing a Azure Gallery Package or Deployment Fragment
In order to publish a gallery package (azpkg) you will run the AzureGallery tool. You can optionally associate a hide key with the package. This key will be required when requesting the item from the gallery service.

To upload the package run the following command.

```bat
> Microsoft.Azure.Gallery.AzureGalleryUtility.exe upload -p ..\path\to\package.azpkg
```

Provisioning your package to all the regions and Cache refresh might take up to 30 minutes to show up in Azure Marketplace. You can verify this using a public endpoints:
```
https://df.catalogrp.azure-test.net/view/offers/<galleryItemId>?api-version=2018-08-01-beta
```
Make sure to update the "**galleryItemId**" in the URI that you received when you uploaded the package. If you have added a hidekey, Please add an additional query parameter  `"HideKeys[0]=<your hidekey>"`

<a name="gallery-item-specificiations-gallery-package-management-publishing-a-azure-gallery-package-to-national-clouds-fairfax-mooncake"></a>
#### Publishing a Azure Gallery Package to National Clouds (Fairfax/Mooncake)

1. Modify your service's Marketplace Gallery package for first-time-publishing testing.
    1. Unzip your gallery package. If it's an `.azpkg` file, rename it to `.zip`.
    1. Add a hidekey in the filters section of your `Manifest.json`
        ```json
        "filters": [
          {
            "type": "HideKey",
            "value": "HIDEKEY_NAME_HERE"
          }
        ]
        ```
    1. Reduce the package's version by 1 minor version. This is because you'll need to bump up the version once you remove the hide key and you don't want to have to have the minor version of your package in the sovereigns be +1 from your public package.
    1. Re-zip your package and rename it back to `.azpkg`.
1. Create an ICM on "PFX-MIX-Marketplace Ingestion Experience/Marketplace Publishing" with your gallery package `.azpkg` file to get it published. Let them know this is for Fairfax and that you already added a hidekey.
1. Once the MIX Marketplace Ingestion Experience team completes publishing, test your package by launching the portal with the hidekey.

    ```
    https://portal.azure.us/?microsoft_azure_marketplace_ItemHideKey=HIDEKEY_NAME_HERE
    ```

1. Repeat step 2 but this time send your unmodified package without the version change and hidekey.

<a name="gallery-item-specificiations-gallery-package-management-updating-hide-key-for-azure-gallery-package"></a>
#### Updating hide key for Azure Gallery Package
In order to add/update or remove a hide key or subscription filters associated with an item you will run the AzureGallery tool. To remove a hide key you need update the item and specify an empty key.

To update the filters for the a package run the following command.


```bat
> Microsoft.Azure.Gallery.AzureGalleryUtility.exe update -i [Publisher].[Name].[Version] -h [comma-separated hide key list] -sf [comma-separated subscription guid list]
```

<a name="gallery-item-specificiations-gallery-package-management-deleting-a-azure-gallery-package-or-deployment-fragment"></a>
#### Deleting a Azure Gallery Package or Deployment Fragment
Deleting Azure Gallery Packages is only supported in the test environments. We will not allow or support deletion of gallery packages in PROD except in rare situations such as a security or legal issue. In order to delete your package run the following command. In order to do this you will be required to configure the package loader too as noted here.

To delete a azure gallery package run the following command.

```bat
> Microsoft.Azure.Gallery.AzureGalleryUtility.exe delete -i [Publisher].[Name].[Version]
```

<a name="gallery-item-specificiations-gallery-package-management-configuring-the-azure-package-loader-tool"></a>
#### Configuring the Azure Package Loader Tool
In order to use the gallery loader you will need to download two test certificates from this [Azure key vault](https://ms.portal.azure.com/#@microsoft.onmicrosoft.com/resource/subscriptions/705c43bf-c68a-4e96-b683-77b0aa2dd09e/resourceGroups/GalleryPackageDeployment-RG/providers/Microsoft.KeyVault/vaults/GalleryPackageDeployment/certificates)

Please download both in PFX/PEM format. Install them without a password.

Certificates will be auto rotated every 90 days. You should always download the latest certificates.

If you are a Microsoft FTE and do not have permissions to access the key vault, please join the right groups following instructions [here](../../portal-sdk/generated/top-onboarding.md#join-dls-and-request-permissions). If you are an external partner, request permissions through the Microsoft team you are collaborating with to light up your extension.

In order to publish to production, create an ICM on "PFX-MIX-Marketplace Ingestion Experience/Marketplace Publishing" with your gallery package `.azpkg` file to get it published

<a name="gallery-item-specificiations-versioning"></a>
### Versioning
Package and template versioning must use [SemVer 2.0.0](https://semver.org) for version numbers. The rules for SemVer should be applied to the Gallery Item and reflect changes to the content that will be installed with the package. For example, if the content of your package will cause breaking changes to existing users you must increment the MAJOR version numner for your gallery item package.

Given a version number MAJOR.MINOR.PATCH, increment the:

1.	MAJOR version when you make incompatible API changes,
2.	MINOR version when you add functionality in a backwards-compatible manner, and
3.	PATCH version when you make backwards-compatible bug fixes.

Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH format.

For preview packages the convention in the portal is to use a version such as: `1.0.0-preview`.
For placeholder package you should use a version such as `0.1.0-placeholder`.


[gallery-ui-examples](#gallery-item-field-to-ui-element-mappings)


<properties title="" pageTitle="Marketplace Search" description="" authors="aawest" />

<div class="wa-documentationArticle-meta">
  <p class="wa-linkArray">
    Related documents:
    <a href="/documentation/articles/gallery-overview">Overview</a>
    <a href="/documentation/articles/gallery-release-notes">Release Notes</a>
    <a href="/documentation/articles/gallery-items">Gallery Items</a>
    <a href="/documentation/articles/gallery-metadata">Gallery Metadata</a>
    <a href="/documentation/articles/gallery-development">Gallery Package Development and Debugging </a>
    <a href="/documentation/articles/gallery-icon-guidelines">Icon Guidelines</a>
    <a href="/documentation/articles/gallery-add-to-resource">Add To Resource</a>
    <a href="/documentation/articles/gallery-faq">FAQ</a>
  </p>
</div>

<a name="gallery-item-specificiations-marketplace-search"></a>
## Marketplace Search ##
While creating your gallery package, keep in mind how your item will be discovered by customers. You will need to properly curate your package into the Marketplace. More information regarding curation <a href="/documentation/articles/gallery-faq">here</a>. Your item will also need to be easily discoverable via Marketplace search.

> [WACOM.NOTE] The Marketplace leverages Azure Search to power its search functionality. [Read more.](https://azure.microsoft.com/en-us/services/search/)

Customers can search for Marketplace items in two locations:

<a name="gallery-item-specificiations-marketplace-search-new"></a>
### +New ###
![+New Search Box][New_Search_Box]

When a user searches via the +New search box, they will be taken to the Marketplace "Everything" menu which displays all possible search results.

<a name="gallery-item-specificiations-marketplace-search-marketplace-search-1"></a>
### Marketplace Search ###
![Marketplace Search][Marketplace_Search]

Searches in Marketplace are made within the context of the current menu. If a customer navigates to the "Virtual Machines" menu and searches, only items located in that menu will be returned. The top level "Everything" menu is the only menu where all gallery items are searched.

> [WACOM.NOTE] If no results are returned within a menu, search will fallback to "Everything" and display any matching results there. 

<a name="gallery-item-specificiations-gallery-package-search-metadata"></a>
## Gallery Package Search Metadata ##
The following fields in your package <a href="/documentation/articles/gallery-items">manifest</a> are indexed in Azure Search. They are in descending order of weight given to the field when determining search ranking. 
Marketplace also uses popularity data to rank search results. When a user selects an item from a search result, it is given a small boost to its relevancy in future searches.

- itemDisplayName
- publisherDisplayName
- summary
- description
- longSummary

Example: In general, a gallery item with display name "Azure Package" will be ranked higher than a gallery item with publisher name "Azure Package" for the query "Azure Package". However, this will not always be the case as matches in other fields can result in a higher ranking.

<a name="gallery-item-specificiations-marketplace-suggest"></a>
## Marketplace Suggest ##
Suggestions in the Marketplace search boxes only suggest item display names and publisher names. The API finds the closest matching query string and does not prioritize any titles or publishers.

<a name="gallery-item-specificiations-localization-1"></a>
## Localization ##
Marketplace is fully localized, but not all gallery items in the Marketplace are localized. To accommodate this, Marketplace will use a customer's search query to perform an English query as well as a query under the customer's current locale. If the customer's query matches the English or localized fields of a package, the localized package will be returned to the customer.

Example: A customer whose locale is set to Spanish searches for "Storage account". This query will match the English version of the Storage Account gallery package, but the Spanish version of the package will be returned to the customer.

<a name="gallery-item-specificiations-faqs-and-notes"></a>
## FAQs and Notes ##

<a name="gallery-item-specificiations-faqs-and-notes-search-hide-keys"></a>
### Search &amp; Hide Keys ###
Hidden Marketplace items behind hide keys will behave differently when searched. See <a href="/documentation/articles/gallery-development">Testing in production</a> for more information on hidden marketplace items.
- Marketplace makes two separate requests for public and hidden items. This allows for the highest version of public and private items to be discoverable via search. 
- Hidden items will appear at the top or bottom of search results. If you do not see your hidden item, look at the bottom of the search results.
- Hidden items will NOT be suggested

<a name="gallery-item-specificiations-faqs-and-notes-why-does-my-item-not-appear-as-a-suggestion"></a>
### Why does my item not appear as a suggestion? ###
Often times suggest will pick the closest string to the given query. This does not mean that your item will not be deemed as relevant when the user completes their search. Hidden items will not be suggested even with a hide key present.


[New_Search_Box]: ../media/gallery-search/New_Search_Box.png
[Marketplace_Search]: ../media/gallery-search/Marketplace_Search.png

<properties title="" pageTitle="Gallery Metadata" description="" authors="adwest" />

<div class="wa-documentationArticle-meta">
  <p class="wa-linkArray">
    Related documents:
    <a href="/documentation/articles/gallery-overview">Overview</a>
    <a href="/documentation/articles/gallery-release-notes">Release Notes</a>
    <a href="/documentation/articles/gallery-items">Gallery Items</a>
    <a href="/documentation/articles/gallery-metadata">Gallery Metadata</a>
    <a href="/documentation/articles/gallery-development">Gallery Package Development and Debugging </a>
    <a href="/documentation/articles/gallery-icon-guidelines">Icon Guidelines</a>
    <a href="/documentation/articles/gallery-add-to-resource">Add To Resource</a>
    <a href="/documentation/articles/gallery-faq">FAQ</a>
  </p>
</div>

<a name="gallery-item-metadata"></a>
# Gallery Item Metadata
Below you will find a list of all metadata that is collected with a gallery item.


<a name="gallery-item-metadata-identity-information"></a>
## Identity Information

| Name          | Required | Type    | Constraints                            | Description                            |
| ------------- | -------- | ------- | -------------------------------------- | -------------------------------------- |
| Name          | X        | string  | [A-Za-z0-9]+                           |                                        |
| Publisher     | X        | string  | [A-Za-z0-9]+                           |    									   |
| Version       | X        | string  | [SemVer v2](https://semver.org)        |										   |



<a name="gallery-item-metadata-metadata"></a>
## Metadata

| Name                 | Required | Type      | Constraints                            | Description                                     |
| -------------------- | -------- | --------- | -------------------------------------- | ----------------------------------------------- |
| DisplayName          | X        | string    | recommendation 80 characters           | if longer than 80, Portal may not display your item name gracefully			|
| PublisherDisplayName | X        | string    | recommendation 30 characters		   | if longer than 30, Portal may not display your publisher name gracefully    	|
| PublisherLegalName   | X        | string    | max of 256 characters                  |																				|
| Summary              | X        | string    | 60 to 100 characters	               |																				|
| LongSummary          | X        | string    | 140 to 256 characters                  | used on hero image, will fall back to summary   								|
| Description          | X        | [html][1] | 500 to 5000 characters                 |                                    		         							|



<a name="gallery-item-metadata-images-1"></a>
## Images
Below is the list of icons used in the gallery.

| Name          | Width | Height | Notes                                  |
| ------------- | ----- | ------ | -------------------------------------- |
| Hero          | 815px | 290px  | Only required if hero display is used. |
| Wide          | 255px | 115px  | Always required.                       |
| Large         | 115px | 115px  | Always required.                       |
| Medium        | 90px  | 90px   | Always required.                       |
| Small         | 40px  | 40px   | Always required.                       |
| Screenshot(s) | 533px | 324px  | Optional. Maximum of 5 allowed.        |



<a name="gallery-item-metadata-component-metadata"></a>
## Component Metadata
You can include any number of components. Components are used to primarily to specify pricing and legal data.

| Name                 | Required | Type      | Constraints                            | Description                                             |
| -------------------- | -------- | --------- | -------------------------------------- | ------------------------------------------------------- |
| DisplayName          | X        | string    | max of 256 characters                  |                                                         |
| ComponentType        | X        | enum      | operatingsystem, software, service     |    																		                 |
| PublisherDisplayName | X        | string    | max of 256 characters                  |																				                 |
| Terms                | X        | [html][1] |                                        | The full text of the legal terms                        |
| PrivacyPolicy        | X        | [html][1] |                                        | The full text of the privacy policy                     |
| PricingDetailsUri    | X        | uri       |                                        | A URL to get more details on the price of the component |



<a name="gallery-item-metadata-categories"></a>
## Categories
Each gallery item can be "tagged" with a variety of categories.
You can categorize the offer to be under L1 (Level 1) category or L2 (Level 2) category
In order to appear under L2 category you will need to provide both the L2 and the L1 parent category id.

The following are common L1 categories.
The left hand side is the category id that needs to be provided, and the right hand side is the category display name:

* **compute** - Compute
* **networking** - Networking
* **database** - Database
* **security** - Security
* **storage** - Storage
* **analytics** - Analytics
* **analytics** - Analytics
* **businessApplication** - Business Application
* **media** - Media
* **web** - Web
* **security** - Security



The following are common L2 categories.
The left hand side is the category ids that needs to be provided, and the right hand side is the categories display name ( L1 -> L2):

* **compute, appInfrastructure** - Compute -> Application
* **compute, clientOS** - Compute -> Client Operating System
* **developer-tools, devService** - Developer Tools > Developer Service
* **compute, cache** - Compute -> Cache
* **analytics, bigData** - Analytics -> Big Data
* **storage, backup** - Storage -> Backup
* **it-and-management-tools, businessApplication** - IT & Management Tools -> Business Application



<a name="gallery-item-metadata-links"></a>
## Links
Each gallery item can include a variety of links to additional content. The links are specified as a list of names and urls.

| Name          | Required | Type    | Constraints                            | Description                            |
| ------------- | -------- | ------- | -------------------------------------- | -------------------------------------- |
| DisplayName   | X        | string  | max of 64 characters                   |                                        |
| Uri           | X        | uri     |                                        |    																		 |



<a name="gallery-item-metadata-additional-properities"></a>
## Additional Properities
In addition to the above metadata, gallery authors can also provide custom key/value pair data in the following form.

| Name          | Required | Type    | Constraints                            | Description                            |
| ------------- | -------- | ------- | -------------------------------------- | -------------------------------------- |
| DisplayName   | X        | string  | max of 25 characters                   |                                        |
| Value         | X        | string  | max of 30 characters                   |    																		 |



<a name="gallery-item-metadata-html-sanitization"></a>
## HTML Sanitization
For any field that allows HTML the following elements and attributes are allowed.

"h1", "h2", "h3", "h4", "h5", "p", "ol", "ul", "li", "a[target|href]", "br", "strong", "em", "b", "i"


<properties title="" pageTitle="Gallery UI Element Examples" description="" authors="nickharris" />

<a name="gallery-item-field-to-ui-element-mappings"></a>
# Gallery Item Field to UI Element Mappings
Below you will find examples of where the metadata for gallery items are displayed in the portal and azure.com.

<a name="gallery-item-field-to-ui-element-mappings-create-hub"></a>
## Create Hub

![create-hub][create-hub]

<a name="gallery-item-field-to-ui-element-mappings-gallery-blade"></a>
## Gallery Blade

![gallery-hero-and-tile][gallery-hero-and-tile]

![gallery-wide-tile][gallery-wide-tile]

<a name="gallery-item-field-to-ui-element-mappings-gallery-item-details-blade"></a>
## Gallery Item Details Blade

![gallery-details-blade][gallery-details-blade]


[create-hub]: ../media/gallery-ui-examples/create-hub.png
[gallery-hero-and-tile]: ../media/gallery-ui-examples/gallery-hero-and-tile.png
[gallery-wide-tile]: ../media/gallery-ui-examples/gallery-wide-tile.png
[gallery-details-blade]: ../media/gallery-ui-examples/gallery-details-blade.png

﻿<properties title="" pageTitle="Gallery Package Development and Debugging" description="" authors="nickharris" />

<tags
	ms.service="portalfx"
	ms.workload="portalfx"
	ms.tgt_pltfrm="portalfx"
	ms.devlang="portalfx"
	ms.topic="get-started-article"
	ms.date="02/11/2016"
	ms.author="1store"/>	

<div class="wa-documentationArticle-meta">
  <p class="wa-linkArray">
    Related documents:
    <a href="/documentation/articles/gallery-overview">Overview</a>
    <a href="/documentation/articles/gallery-release-notes">Release Notes</a>
    <a href="/documentation/articles/gallery-items">Gallery Items</a>
    <a href="/documentation/articles/gallery-metadata">Gallery Metadata</a>
    <a href="/documentation/articles/gallery-development">Gallery Package Development and Debugging </a>
    <a href="/documentation/articles/gallery-icon-guidelines">Icon Guidelines</a>
    <a href="/documentation/articles/gallery-add-to-resource">Add To Resource</a>
    <a href="/documentation/articles/gallery-faq">FAQ</a>
  </p>
</div>

<a name="gallery-package-development-and-debugging"></a>
# Gallery Package Development and Debugging

[This video](/portal-sdk/generated/index-videos.md#devtest-side-loading-gallery-packages-in-prod) demonstrates how to configure a Gallery Package for a F5 Debug Experience on localhost using Test in Prod

<a name="gallery-package-development-and-debugging-how-to-test-a-gallery-package-with-f5-debug-experience-using-test-in-prod"></a>
## How to test a Gallery Package with F5 Debug Experience using Test in Prod

1. Install the following two NuGet Packages onto your web project.   Note: The MSI ships with and sets up a package source in visual studio that will contain the NuGet packages. If using CoreXT see CoreXT specifics at end of file.
  1. Microsoft.Azure.Gallery.Common
  1. Microsoft.Azure.Gallery.AzureGalleryUtility
1.	By default the Microsoft.Azure.Gallery.AzureGalleryUtlity.targets, injected into your webprojects csproj, will look for your gallery package definition under your $(SolutionDir)/GalleryPackages.  Copy your gallery package(s) into $(SolutionDir)/GalleryPackages.  Create as many folders for as many gallery packages as you would like there.  The target will find them all.
1.	Build your solution to generate the *.azpkg files.
1.	Add the App_Data/GalleryPackages/*.azpkg folders and files to your solution.  On the *.azpkg files set the Build action to Content, Copy if newer.
1.	F5 your solution and side load your application using Test in Prod syntax.  
1.	Click into Marketplace and see your Side Loaded gallery package under Local Development.
That’s it, for those of you who are using CoreXT.  Here are a few gotchas.

<a name="gallery-package-development-and-debugging-testing-in-production"></a>
## Testing in production

Gallery items can be uploaded to production behind a hide key or subscription GUID filter. Only users who specify the hide key via query parameter or have access to the subscription will see the package in Marketplace. Specify filters in your package's <a href="/documentation/articles/gallery-items">manifest</a>.
To access your item behind a hide key, pass the following query parameter when navigating to Portal:  ?microsoft_azure_marketplace_ItemHideKey=YOURHIDEKEY
Multiple hide keys can be used via a comma separated list: ?microsoft_azure_marketplace_ItemHideKey=KEY1,KEY2,KEY3

> [WACOM.NOTE] Hide keys and subscription filters are not to be used for flighting or beta features. It is for testing your package in production before going public.


<a name="gallery-package-development-and-debugging-corext-considerations"></a>
## CoreXT considerations

1. If you do not check in your .sln file you can override the folder to search for gallery packages by defining
<GalleryPackagesSourceFolder /> in your web projects csproj anywhere prior to the import of Microsoft.Azure.Gallery.AzureGalleryUtility.targets

```  
<PropertyGroup>
    <GalleryPackagesSourceFolder>$(ProjectDir)GalleryPackages</GalleryPackagesSourceFolder>
  </PropertyGroup>
```

1. if you are using CoreXT simply updating the global package.config is not sufficient.  Microsoft.Azure.Gallery.AzureGalleryUtility injects a targets file into your csproj and Microsoft.Azure.Galllery.Common adds a reference to a required *.dll

```   
 <Reference Include="Microsoft.Azure.Gallery.Common">
      <HintPath$(PkgMicrosoft_Azure_Gallery_Common)\lib\net45\Microsoft.Azure.Gallery.Common.dll</HintPath>
  </Reference> 
  ...
  <Import Project="$(PkgMicrosoft_Azure_Gallery_Common)\build\Microsoft.Azure.Gallery.AzureGalleryUtility.targets"            Condition="Exists('$(PkgMicrosoft_Azure_Gallery_Common)\build\Microsoft.Azure.Gallery.AzureGalleryUtility.targets')" />
```

<a name="legacy-onebox-development-approach"></a>
# Legacy OneBox Development approach
Steps to get package working in one box:

1. Copy package (*.azpkg) to the following locations
  1. "%USERPROFILE%\Documents\PortalSDK\FrameworkPortal\Extensions\HubsExtension\App_Data\Gallery"
  1. "%PROGRAMFILES(x86)%\Microsoft SDKs\PortalSDK\FrameworkPortal\Extensions\HubsExtension\App_Data\Gallery"
1. Launch portal and goto gallery blade.
1. Goto to the "local development" category.
1. You should see your package in both menu items.
 
For updates:

1. Overwrite the package file (in the above locations).
1. Goto the gallery -> local development UI (if UI already open just move away to another category and come back to see updates).


<properties title="" pageTitle="Using the Add to Resource Blade" description="" authors="nickharris" />

<div class="wa-documentationArticle-meta">
  <p class="wa-linkArray">
    Related documents:
    <a href="/documentation/articles/gallery-overview">Overview</a>
    <a href="/documentation/articles/gallery-release-notes">Release Notes</a>
    <a href="/documentation/articles/gallery-items">Gallery Items</a>
    <a href="/documentation/articles/gallery-metadata">Gallery Metadata</a>
    <a href="/documentation/articles/gallery-development">Gallery Package Development and Debugging </a>
    <a href="/documentation/articles/gallery-icon-guidelines">Icon Guidelines</a>
    <a href="/documentation/articles/gallery-add-to-resource">Add To Resource</a>
    <a href="/documentation/articles/gallery-faq">FAQ</a>
  </p>
</div>

<a name="using-the-add-to-resource-blade"></a>
# Using the Add to Resource Blade

As an extension developer you will likely create one or more gallery items that will appear in the full gallery. However, you will also utilize gallery items to build your "Add" experience for your extension. Gallery items used in the add, up sell, or extension experiences will also be gallery items. Whether these gallery items show in the full gallery or just in the Add experience is up to you.

> [WACOM.NOTE] If you are thinking about building your own gallery type experience for your extension or add-on, **please don't**. If you choose to build your own "Add" or "Extension" experience you will be required to build a consistent UX to the gallery. This will be a lot of work and is not advised. If you think you really must build your own custom experience please contact the [hubs](mailto:hubs@microsoft.com) team and we can figure out the requirements and see what makes sense.

The basic experience the gallery enables for add is shown below. You will use the Add command to launch a gallery list blade that shows a specific result set that applies to your resource.

![Add To Resource][add-to-resource]

In the simplest case this experience will be used for resource that can truly be added to another resource. For example the SQL Server blade has an Add command that allows users to add a SQL database to their server. However this experience can be used to facilitate a variety of experiences such as setting up an extension on a website, configuring continuous integration, and more.

<a name="using-the-add-to-resource-blade-launching-gallery-results-blade"></a>
## Launching Gallery Results Blade
You can launch the Gallery Results Blade like any other blade. Below are the parameters for the blade.

<a name="using-the-add-to-resource-blade-launching-gallery-results-blade-blade-info"></a>
### Blade Info
* **extension**: MsPortalFx.Base.Constants.ExtensionNames.Hubs
* **detailBlade**: "GalleryResultsListBlade"

<a name="using-the-add-to-resource-blade-launching-gallery-results-blade-blade-inputs"></a>
### Blade Inputs
 * **selectedSubMenuItemId** - Required. The menu item for the curated list for your list of gallery items. For example "linkableResource/Microsoft.WebSite/WebHostingPlan"
 * **resourceGroupId** - Optional. The Azure Resource Manager Uri of the resource group.
 * **resourceGroupLocation** - Optional. The location of the resource group.

<a name="using-the-add-to-resource-blade-reasons-to-use-the-gallery-launcher"></a>
## Reasons to use the Gallery Launcher
By utilizing the gallery launcher for your add/extension/up sell scenarios you are ensuring that every experience in the portal is consistent. Additionally, you will receive many features for free without having to reimplement what the gallery already provides. For example, you will get the details blade shown below with no effort on your side. Additionally, as we implement more features like filtering, search, etc. in the gallery your extension will continue to benefit from these improvements.

![Add to Resource with Detail][add-to-resource-with-detail]

<a name="using-the-add-to-resource-blade-reasons-to-use-the-gallery-launcher-curating-your-list"></a>
### Curating Your List
In order to set the content of the gallery results list you will need to have the curation service updated with your content. You can build your curation configuration with either a hard coded list of gallery items or with gallery item categories. See below for an example curated list configuration. In order to have the curation service updated with your required curation please email the [hubs team](mailto:hubs@microsoft.com).

```json
{
  "id": "Microsoft.WebSite-WebSite",
  "categories": [
    "category1",
    "category2"
  ],
  "items": [
    "Microsoft.SQLDatabase.0.2.0-preview",
    "Microsoft.ClassicStorage.0.2.0-preview",
    "Microsoft.HDInsight.0.2.0-placeholder",
    "Microsoft.Cache.0.2.0-preview",
    "SuccessBricksInc.ClearDBMySQLDatabase.0.2.0-preview",
    "ObjectLabsCorporation.MongoLab.0.2.0-placeholder"
  ]
}
```

[add-to-resource]: ../media/gallery-add-to-resource/add-to-resource.png
[add-to-resource-with-detail]: ../media/gallery-add-to-resource/add-to-resource-with-detail.png


<properties title="" pageTitle="Gallery Icon Styles" description="" authors="nickharris" />

<div class="wa-documentationArticle-meta">
  <p class="wa-linkArray">
    Related documents:
    <a href="/documentation/articles/gallery-overview">Overview</a>
    <a href="/documentation/articles/gallery-release-notes">Release Notes</a>
    <a href="/documentation/articles/gallery-items">Gallery Items</a>
    <a href="/documentation/articles/gallery-metadata">Gallery Metadata</a>
    <a href="/documentation/articles/gallery-development">Gallery Package Development and Debugging </a>
    <a href="/documentation/articles/gallery-icon-guidelines">Icon Guidelines</a>
    <a href="/documentation/articles/gallery-add-to-resource">Add To Resource</a>
    <a href="/documentation/articles/gallery-faq">FAQ</a>
  </p>
</div>

<a name="your-icon-tile-for-the-azure-store"></a>
# Your icon tile for the Azure Store

When onboarding a new partner to the Windows Azure Store it is very important that their offer looks polished and professional. We work very hard with each partner to simplify the display of their logo for maximum impact. To ensure that the store and offers display well, maintain consistency, and can be scaled into the next version of the developer portal, certain design standards are enforced.

Think of putting an offering in the Windows Phone store. The icons that represent those offerings are not exactly the same as the full company logo. They are an "icon" created that identifies the offering by showing a simplified view of the company logo or a new graphic created for the specific offer. We view the images that accompany WA store offerings as "logo-icons". They retain branding and logo marks that customers recognize, but discard fine details and logo text.

There are two ways that these logo-icons can be created. You can design a first pass of your own logo-icon then send a version to the Azure UX team for review, or send over an illustrator file format version of your logo along with some desired background colors and have us do the work.

These are the logo-icon requirements:

1. Select a white solid version of your logo or icon. If you do not have a reversed out version, select the version that you would use on top of a dark color or image.
1. Full color background
1. The background color must be dark enough for white text to be overlayed on top of it. (this consideration is for the next version of the portal)
1. Logo must be legible at 40x40px
1. We strongly prefer the icon to contain only a logo MARK without logo TEXT, unless that text is very short.

<a name="your-icon-tile-for-the-azure-store-use-examples"></a>
## Use examples
Icon tiles used in the Windows Azure marketing site and developer portal

<a name="your-icon-tile-for-the-azure-store-icon-tile-aspects"></a>
## Icon tile aspects


<a name="your-icon-tile-for-the-azure-store-icon-tile-aspects-icon-size-square-round-or-compact-logos-prefered-dimaensions"></a>
### Icon size: square, round, or compact logos (prefered dimaensions)

<a name="your-icon-tile-for-the-azure-store-icon-tile-aspects-icon-size-horizontal-logos-with-ample-white-space-above-and-below"></a>
### Icon size: horizontal logos with ample white space above and below




<properties title="" pageTitle="Gallery Frequently Asked Questions" description="" authors="adwest" />

<div class="wa-documentationArticle-meta">
  <p class="wa-linkArray">
    Related documents:
    <a href="/documentation/articles/gallery-overview">Overview</a>
    <a href="/documentation/articles/gallery-release-notes">Release Notes</a>
    <a href="/documentation/articles/gallery-items">Gallery Items</a>
    <a href="/documentation/articles/gallery-metadata">Gallery Metadata</a>
    <a href="/documentation/articles/gallery-development">Gallery Package Development and Debugging </a>
    <a href="/documentation/articles/gallery-icon-guidelines">Icon Guidelines</a>
    <a href="/documentation/articles/gallery-add-to-resource">Add To Resource</a>
    <a href="/documentation/articles/gallery-faq">FAQ</a>
  </p>
</div>

<a name="developer-tooling-and-productivity"></a>
# Developer tooling and productivity

<a name="developer-tooling-and-productivity-do-you-have-a-file-new-project-template-experience"></a>
#### Do you have a File &gt; New Project Template experience? ####
Yes, by default the File > New project template is installed as part of the MSI install.  You can find it within File > New > Installed > Templates > Visual C# > Azure Portal

<a name="developer-tooling-and-productivity-do-you-have-nuget-packages-for-the-portal-sdk"></a>
#### Do you have NuGet packages for the Portal SDK? ####
Yes and if you are not using them you should ensure you update as it will provide a much more efficient path to update to newer versions of the SDK.  See the following documentation regarding <a href="/documentation/articles/portalfx-nuget-overview">NuGet Packages</a>

<a name="gallery-frequently-asked-questions"></a>
# Gallery Frequently Asked Questions

<a name="gallery-frequently-asked-questions-how-do-i-get-a-gallery-item-into-the-gallery"></a>
#### How do I get a Gallery Item into the gallery?
You will need to create your own gallery items for your resources. You can find instruction on how to do this in the <a href="/documentation/articles/gallery-items">gallery items section</a> of these documents.

<a name="gallery-frequently-asked-questions-how-do-i-authenticate-to-the-gallery-service-to-publish-my-gallery-items"></a>
#### How do I authenticate to the gallery service to publish my gallery items?
At this time, you will need a certificate that maps to each environment. You can <a href="https://auxdocs.azurewebsites.net/en-us/Downloads/DownloadGallery" target="_blank">download the test certificate here</a>. At this time, we do not allow partner teams to publish to the production service so you will need to contact [1store](mailto:1store@microsoft.com) to have your production gallery items published. We will change this soon so that each team will be able to manage their own production gallery assets.

<a name="gallery-frequently-asked-questions-do-i-have-to-have-publish-a-gallery-item-in-order-to-be-in-the-portal-gallery"></a>
#### Do I have to have publish a gallery item in order to be in the portal gallery?
Yes, all resource providers must publish at least one gallery item in order to be in the gallery. Gallery items contain all of the information used to start create wizards. If you need to test your package in production you can follow <a href="/documentation/articles/gallery-development">these steps</a> to side load your package in production.

<a name="gallery-frequently-asked-questions-how-do-i-add-my-resource-gallery-item-to-the-new-menu-or-marketplace-while-i-am-developing"></a>
#### How do I add my resource/gallery item to the +New menu or Marketplace while I am developing?
For now, we do not support this scenario without using a fully deployed package. If you need to test your package in production you can follow <a href="/documentation/articles/gallery-development">these steps</a> to side load your package in production.

<a name="gallery-frequently-asked-questions-how-do-i-add-my-resource-gallery-item-to-the-marketplace-in-the-test-environments-or-production"></a>
#### How do I add my resource/gallery item to the Marketplace in the test environments or production?
The entire gallery is driven by a curation service. The curation service controls both the structure of the Marketplace and where various items are placed in the Marketplace. In order to have your gallery item show up in the Marketplace you will need to request an updated to the curation service. Some locations such as the +New menu and hero banners require executive approval. Please email [1store](mailto:1store@microsoft.com) to make this request.

![Create Hub][plus-new]

<a name="gallery-frequently-asked-questions-how-do-i-hide-a-gallery-item"></a>
#### How do I hide a gallery item?
You can associate a hide key with a gallery item. This key will be required when trying to access the item from the Azure Portal. For information on how to add and remove hide keys, look at "Gallery Package Management" section in the <a href="/documentation/articles/gallery-items">Gallery Items section</a>.

<a name="gallery-frequently-asked-questions-how-do-i-access-a-hidden-gallery-item-in-the-azure-portal"></a>
#### How do I access a hidden gallery item in the Azure Portal?
To access hidden gallery items in the portal, append "microsoft_azure_marketplace_ItemHideKey=&lt;hide key&gt;" as a query parameter in the Uri when launching the portal. Multiple hide keys can be specified by comma delimiting them in the value of the query parameter.

<a name="gallery-frequently-asked-questions-i-am-trying-to-publish-gallery-items-and-get-an-error-stating-client-certificate-missing-or-not-specified-on-the-request"></a>
#### I am trying to publish gallery items and get an error stating &quot;Client certificate missing or not specified on the request.&quot;.
Check to make sure you aren't running fiddler or any other tool that may interfere with HTTP traffic. This is usually the cause of this problem.

[plus-new]: ../media/gallery-faq/plus-new.png


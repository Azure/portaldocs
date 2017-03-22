<properties title="" pageTitle="Gallery Item Specificiations" description="" authors="adwest" />

{"gitdown": "include-file", "file": "./includes/gallery-header.md"}

# Gallery Item Specificiations
Each item in the gallery is published to the gallery service using a format called the Azure Gallery Package (azpkg). The Azure Gallery Package contains all of the data needed to display items in the Ibiza gallery, build the Ibiza create experiences, and initiate resource creation through the Template Execution Service. The Azure Gallery Package (azpkg) is a single file that is packaged using the OPC (Open Package Conventions) standard. The Azure Gallery Package does not contain deployment or runtime resources such as code, zip files with software, or Virtual Machines or Disks. These resources are only referenced by the ARM template(s) contained in the Azure Gallery Package and are hosted externally to the Azure Gallery Package.

### Azure Gallery Package Contents
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

#### Manifest (Manifest.json)
The manifest file contains all of the metadata for your gallery item. For a visual representation of where each metadata value is used see the page on [gallery UI examples][gallery-ui-examples].

```json
{
    "$schema": "https://gallery.azure.com/schemas/2014-09-01/manifest.json#",
    "name": "string", // [A-Za-z0-9]+ (offer + plan namespace)
    "publisher": "string", // [A-Za-z0-9]+ (publisher namespace)
    "version": "string", // SemVer v2 Format - see http://semver.org/
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
    "categories": [ "string" ],
    "filters": [
        // type: Country, Subscription, Resources, HideKey, OfferType, OfferCategory
        { "type": "string", "value": "string" }
    ]
}

```

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
### Localization

#### Images
Images support localization. The following folder structure will be used for localizing images.
You can find the list of languages that Azure Portal supports <a href="/documentation/articles/portalfx-localization#list-of-accepted-languages" target="_blank">here</a>.

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

### Strings
The strings folder contains json files for each localized language. The resource files are simple key value pair json documents. The files are named localization.resjson.
You can find the list of languages that Azure Portal supports <a href="/documentation/articles/portalfx-localization#list-of-accepted-languages" target="_blank">here</a>.

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

#### ARM Templates
The package will contain 1 or more ARM template stored in the DeploymentTemplates folder.

### Gallery Package Management

#### Getting the Gallery Tools
You can find the latest version of the gallery tools (Microsoft.Azure.Gallery.AzureGalleryUtility) in the official wanuget store: http://wanuget/Official.


#### Creating an Azure Gallery Package
After you have created the folder structure and added the required files to your pre-packaged Gallery Item you will need to run the AzureGallery tool to validate and build the Gallery Item Package.

To create packages run the following command.

```bat
> AzureGallery.exe package -m [path to manifest.json] -o [output directory]
```

#### Publishing a Azure Gallery Package or Deployment Fragment
In order to publish a gallery package (azpkg) you will run the AzureGallery tool. You can optionally associate a hide key with the package. This key will be required when requesting the item from the gallery service.

To upload the package run the following command.

```bat
> AzureGallery.exe upload -p ..\path\to\package.azpkg
```

#### Updating hide key for Azure Gallery Package
In order to add/update or remove a hide key or subscription filters associated with an item you will run the AzureGallery tool. To remove a hide key you need update the item and specify an empty key.

To update the filters for the a package run the following command.

```bat
> AzureGallery.exe update -i [Publisher].[Name].[Version] -h [comma-separated hide key list] -sf [comma-separated subscription guid list]
```

#### Deleting a Azure Gallery Package or Deployment Fragment
Deleting Azure Gallery Packages is only supported in the test environments. We will not allow or support deletion of gallery packages in PROD except in rare situations such as a security or legal issue. In order to delete your package run the following command. In order to do this you will be required to configure the package loader too as noted here.

To delete a azure gallery package run the following command.

```bat
> AzureGallery.exe delete -i [Publisher].[Name].[Version]
```

#### Configuring the Azure Package Loader Tool
In order to use the gallery loader you will need to set some values in the AzureGallery.exe.config file. You can <a href="https://auxdocs.azurewebsites.net/en-us/Downloads/DownloadGallery" target="_blank">download the test certificate here</a>. In order to publish to production, you must contact the [1store team](mailto:1store@microsoft.com).

```xml
<appSettings>
  <add key="Microsoft.Azure.Gallery.ServiceEndpoint" value="https://df.gallery.azure-test.net"/>
  <add key="Microsoft.Azure.Gallery.ServiceSettings.PrivilegedOperationsCertificateThumbprint" value="F569803807B692011559C718715767056926F497"/>
  <add key="Microsoft.Azure.Gallery.ServiceSettings.HighPrivilegeOperationsCertificateThumbprint" value="F569803807B692011559C718715767056926F497"/>
</appSettings>
```

> NOTE: The utilization of certificate authorization is temporary. We will be switching to STS auth post public preview. For now everyone is sharing the same cert and has permission to publish/delete any package. Please don't break other people’s packages.

### Versioning
Package and template versioning must use [SemVer 2.0.0](http://semver.org) for version numbers. The rules for SemVer should be applied to the Gallery Item and reflect changes to the content that will be installed with the package. For example, if the content of your package will cause breaking changes to existing users you must increment the MAJOR version numner for your gallery item package.

Given a version number MAJOR.MINOR.PATCH, increment the:

1.	MAJOR version when you make incompatible API changes,
2.	MINOR version when you add functionality in a backwards-compatible manner, and
3.	PATCH version when you make backwards-compatible bug fixes.

Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH format.

For preview packages the convention in the portal is to use a version such as: `1.0.0-preview`.
For placeholder package you should use a version such as `0.1.0-placeholder`.


[gallery-ui-examples](gallery-ui-examples.md)

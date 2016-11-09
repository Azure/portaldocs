<properties title="" pageTitle="Gallery Frequently Asked Questions" description="" authors="adwest" />

{"gitdown": "include-file", "file": "./includes/gallery-header.md"}

# Developer tooling and productivity

#### Do you have a File > New Project Template experience? ####
Yes, by default the File > New project template is installed as part of the MSI install.  You can find it within File > New > Installed > Templates > Visual C# > Azure Portal

#### Do you have NuGet packages for the Portal SDK? ####
Yes and if you are not using them you should ensure you update as it will provide a much more efficient path to update to newer versions of the SDK.  See the following documentation regarding <a href="/documentation/articles/portalfx-nuget-overview">NuGet Packages</a>

# Gallery Frequently Asked Questions

#### How do I get a Gallery Item into the gallery?
You will need to create your own gallery items for your resources. You can find instruction on how to do this in the <a href="/documentation/articles/gallery-items">gallery items section</a> of these documents.

#### How do I authenticate to the gallery service to publish my gallery items?
At this time, you will need a certificate that maps to each environment. You can <a href="https://auxdocs.azurewebsites.net/en-us/Downloads/DownloadGallery" target="_blank">download the test certificate here</a>. At this time, we do not allow partner teams to publish to the production service so you will need to contact [1store](mailto:1store@microsoft.com) to have your production gallery items published. We will change this soon so that each team will be able to manage their own production gallery assets.

#### Do I have to have publish a gallery item in order to be in the portal gallery?
Yes, all resource providers must publish at least one gallery item in order to be in the gallery. Gallery items contain all of the information used to start create wizards. If you need to test your package in production you can follow <a href="/documentation/articles/gallery-development">these steps</a> to side load your package in production.

#### How do I add my resource/gallery item to the +New menu or Marketplace while I am developing?
For now, we do not support this scenario without using a fully deployed package. If you need to test your package in production you can follow <a href="/documentation/articles/gallery-development">these steps</a> to side load your package in production.

#### How do I add my resource/gallery item to the Marketplace in the test environments or production?
The entire gallery is driven by a curation service. The curation service controls both the structure of the Marketplace and where various items are placed in the Marketplace. In order to have your gallery item show up in the Marketplace you will need to request an updated to the curation service. Some locations such as the +New menu and hero banners require executive approval. Please email [1store](mailto:1store@microsoft.com) to make this request.

![Create Hub][plus-new]

#### How do I hide a gallery item?
You can associate a hide key with a gallery item. This key will be required when trying to access the item from the Azure Portal. For information on how to add and remove hide keys, look at "Gallery Package Management" section in the <a href="/documentation/articles/gallery-items">Gallery Items section</a>.

#### How do I access a hidden gallery item in the Azure Portal?
To access hidden gallery items in the portal, append "microsoft_azure_marketplace_ItemHideKey=&lt;hide key&gt;" as a query parameter in the Uri when launching the portal. Multiple hide keys can be specified by comma delimiting them in the value of the query parameter.

#### I am trying to publish gallery items and get an error stating "Client certificate missing or not specified on the request.".
Check to make sure you aren't running fiddler or any other tool that may interfere with HTTP traffic. This is usually the cause of this problem.

[plus-new]: ../media/gallery-faq/plus-new.png
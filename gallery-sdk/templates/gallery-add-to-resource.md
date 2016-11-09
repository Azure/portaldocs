<properties title="" pageTitle="Using the Add to Resource Blade" description="" authors="nickharris" />

{"gitdown": "include-file", "file": "./includes/gallery-header.md"}

# Using the Add to Resource Blade

As an extension developer you will likely create one or more gallery items that will appear in the full gallery. However, you will also utilize gallery items to build your "Add" experience for your extension. Gallery items used in the add, up sell, or extension experiences will also be gallery items. Whether these gallery items show in the full gallery or just in the Add experience is up to you.

> [WACOM.NOTE] If you are thinking about building your own gallery type experience for your extension or add-on, **please don't**. If you choose to build your own "Add" or "Extension" experience you will be required to build a consistent UX to the gallery. This will be a lot of work and is not advised. If you think you really must build your own custom experience please contact the [hubs](mailto:hubs@microsoft.com) team and we can figure out the requirements and see what makes sense.

The basic experience the gallery enables for add is shown below. You will use the Add command to launch a gallery list blade that shows a specific result set that applies to your resource.

![Add To Resource][add-to-resource]

In the simplest case this experience will be used for resource that can truly be added to another resource. For example the SQL Server blade has an Add command that allows users to add a SQL database to their server. However this experience can be used to facilitate a variety of experiences such as setting up an extension on a website, configuring continuous integration, and more.

## Launching Gallery Results Blade
You can launch the Gallery Results Blade like any other blade. Below are the parameters for the blade.

### Blade Info
* **extension**: MsPortalFx.Base.Constants.ExtensionNames.Hubs
* **detailBlade**: "GalleryResultsListBlade"

### Blade Inputs
 * **selectedSubMenuItemId** - Required. The menu item for the curated list for your list of gallery items. For example "linkableResource/Microsoft.WebSite/WebHostingPlan"
 * **resourceGroupId** - Optional. The Azure Resource Manager Uri of the resource group.
 * **resourceGroupLocation** - Optional. The location of the resource group.

## Reasons to use the Gallery Launcher
By utilizing the gallery launcher for your add/extension/up sell scenarios you are ensuring that every experience in the portal is consistent. Additionally, you will receive many features for free without having to reimplement what the gallery already provides. For example, you will get the details blade shown below with no effort on your side. Additionally, as we implement more features like filtering, search, etc. in the gallery your extension will continue to benefit from these improvements.

![Add to Resource with Detail][add-to-resource-with-detail]

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

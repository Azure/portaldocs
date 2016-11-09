<properties title="" pageTitle="Gallery Overview" description="" authors="adwest" />

{"gitdown": "include-file", "file": "./includes/gallery-header.md"}

# Gallery Overview

The gallery is the single place where users will go to find anything that can be created. The gallery includes both the create hub as well as the gallery blades. The entire gallery is driven from the gallery service which serves both gallery items and curation data. Placement of your resource or app in the gallery is driven by a controlled curation process.


> [WACOM.NOTE] In order to receive important notices and alerts about the gallery service, please subscribe to the [Azure Gallery Announcements](http://idwebelements/GroupManagement.aspx?Group=azuregallery&Operation=join) alias.

## OnBoarding to the Gallery
In order to add an item to the gallery, you must create and publish a gallery item. The contents of the gallery item are explained in more detail in the <a href="/documentation/articles/gallery-items">gallery item documentation</a>. However, the general idea of a gallery item is that it consists of all the metadata that drives the gallery UX around your resource in addition to various files that are used to run your resource create experience.

One extension may publish multiple gallery items and a single create extension can handle the creation of multiple gallery items. You must create at least one gallery item to enable your create experience.

## Gallery Experience
The gallery should be the single place where users browse for resources they will create in the portal. Additional sub-galleries, or resource specific gallery's should never be used in the portal. If you have a list of items that can be browsed and created, they will be in the gallery.

Items in the gallery should reflect what users are looking for. You should not ship your team in the gallery. For example, if your resource provider can create multiple resources you will likely publish multiple gallery items.

![Gallery items][gallery-items]

## Gallery Service
The entire gallery in the portal is driven by the gallery service. The gallery service is responsible for hosting and serving gallery content including metadata, icons, screenshots, and Azure Templates. You can see all of the items in the production gallery service at: [https://gallery.azure.com/Microsoft.Gallery/galleryitems?api-version=2015-10-01&includePreview=true](https://gallery.azure.com/Microsoft.Gallery/galleryitems?api-version=2015-10-01&includePreview=true).


[gallery-items]: ../media/gallery-overview/gallery-items.png
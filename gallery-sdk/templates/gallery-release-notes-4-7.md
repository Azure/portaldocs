<properties title="" pageTitle="Gallery 4.7 Release Notes" description="" authors="nickharris" />

{"gitdown": "include-file", "file": "./includes/gallery-header.md"}

# Gallery 4.7 Release Notes
Below are the updates to the gallery that are availible in Gallery 4.7 and Shell 4.7 (AUX4.8 release).

## New Documenation Site
The gallery documenation (as well as the SDK docs) have moved to a new location. You can find the gallery docs at [https://auxdocs.azurewebsites.net/en-us/documentation/sections/gallery](https://auxdocs.azurewebsites.net/en-us/documentation/sections/gallery).

## API Version Update
We have introduced API versioning recently in the gallery service. All consumers of the gallery service must start adding the api version query parameter to the gallery services.

?api-version=2014-07-01

> [WACOM.NOTE] Starting with the 4.10 release, scheduled for October 2nd, we will only accept API version 2014-07-01 or greater (no greater version exists yet). We will be removing the API versions before this release as well as requests that don't include the api-version query parameter.

## Deep Linking Updates
Deep links to the gallery no longer require specifying the version number of the gallery item. It is highly recommended that everyone updates their links and docs to reflect the new versionless format as versions of gallery items can change often.

### Old Link Format 
`https://portal.azure.com/#gallery/Publisher.Name.Version`

i.e. [https://portal.azure.com/#gallery/Microsoft.WebSite.0.2.0-preview](https://portal.azure.com/#gallery/Microsoft.WebSite.0.2.0-preview)

### New Link Format
`https://portal.azure.com/#gallery/Publisher.Name`

i.e. [https://portal.azure.com/#gallery/Microsoft.WebSite](https://portal.azure.com/#gallery/Microsoft.WebSite)

## Curation No Longer References Versions
Previously, every time you updated your gallery item you would be required to update the version number. When testing hidden packages you would see your preview/hidden item in a different place from your production item. Now, the curation will show the most current release availible to the user. Normal users will see the most recently released version. If you are testing the gallery with a hide key you will see the most recent release including the hidden item.

Additionally, this update means you no longer need to ask for a curation update when you publish a new version of your gallery item.

## No Longer Allowing Deleting Of Gallery Items
Starting with this release we will no longer be allowing deletions of gallery items. Every publish of a gallery item will require a new version. This change will ensure we eliminate the downtime associated with deleting and publishing a gallery item (about 10 minutes) and also the accidental deletions (this happened a few times). In order to make this an easy transition we now no longer require gallery item version in an of the following places: 

**The one exception to this will be in the case of legal or security issues. In this case deletions will be done by the hubs team only.**

## Most Recent Version Query
You can now query the most recent version of a gallery item. The query example is below:

`/Microsoft.Gallery/galleryitems/Microsoft.WebSite?api-version=2014-07-01&includePreview=true`
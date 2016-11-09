<properties title="" pageTitle="Gallery 4.11 Release Notes" description="" authors="nickharris" />

{"gitdown": "include-file", "file": "./includes/gallery-header.md"}

# Gallery 4.11 Release Notes
Below are the updates to the gallery that are availible in Gallery 4.11 and Shell 4.11 (AUX4.12 release).

## New Manifest format
The manifest format has changed and is now a JSON file. All packages must be updated to use the new format in order to be published. See details on the [gallery items documentation page][gallery-item-spec].

Below is a simple script that can help you convert your Manifest.xml to Manifest.json. Note, this is provide as-is as a reference. It may not work for your package.

```ps
Param(
    [Parameter(Mandatory=$True)]
    [string]$manifestPath
)

[xml]$manifestXml = Get-Content $manifestPath
$package = $manifestXml.Package

$categories = @()
foreach ($categoryId in $package.Categories.CategoryId) {
    $categories = $categories + $categoryId.ToString()
}

$links = @()
foreach ($link in $package.Links.Link) {
    $links = $links + @{
        "displayName" = $link.displayName
        "uri" = $link.uri
    }
}

$screenshots = @()
foreach ($screenshot in $package.Screenshots.Image) {
    $screenshots = $screenshots + $screenshot.ToString()
}

$data = [PSCustomObject][Ordered]@{
    "schema" = "https://gallery.azure.com/schemas/2014-09-01/manifest.json#"
    "name" = $package.Identity.Name
    "publisher" = $package.Identity.Publisher
    "version" = $package.Identity.Version
    "displayName" = "ms-resource:displayName"
    "publisherDisplayName" = "ms-resource:publisherDisplayName"
    "publisherLegalName" = "ms-resource:publisherLegalName"
    "summary" = "ms-resource:summary"
    "longSummary" = "ms-resource:longSummary"
    "description" = "ms-resource:description"
    "uiDefinition" = [PSCustomObject][Ordered]@{
        "path" = "uiDefinition.json"
     }
    "icons" = [PSCustomObject][Ordered]@{
        "small" = $package.Icons.Small
        "medium" = $package.Icons.Medium
        "large" = $package.Icons.Large
        "wide" = $package.Icons.Wide
    }
    "screenshots" = $screenshots
    "categories" = $categories
    "links" = $links
}

$json = $data | ConvertTo-JSON
New-Item -Path $manifestPath.Replace("xml", "json") -Force -Value $json
```

[gallery-item-spec]: /documentation/articles/gallery-items
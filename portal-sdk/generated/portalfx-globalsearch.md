<a name="global-search"></a>
# Global search
Portal's global search allows users to search for services, resources, resource groups, documentation and marketplace within the scope of selected subscriptions.
In order to allow users to search for services using names other than their display names, extension authors must specify those strings as keywords on the respective service's asset type definition. The keywords must be concise, unique and should support localization.

Here's a sample on how to specify keywords:

<a name="global-search-create-keywords"></a>
## Create keywords
Create a comma separated list of words in your resources file that best describe your service. (MyAssetStrings.resjson in this case)

```json
    "keywords": "subname, assetname"
```

<a name="global-search-specify-keywords-property-on-the-asset-type"></a>
## Specify keywords property on the asset type
Add keywords property in your asset type definition.

```json
{
  "$schema": "../../Definitions/dx.schema.json",
  "stringSource": "Resources/MyAssetStrings.resjson",
  "assetType": {
    "name": "SampleAssetType",
    "keywords":"keywords",
    "displayNames": {
      "singular": "singular",
      "plural": "plural",
      "lowerSingular": "lowerSingular",
      "lowerPlural": "lowerPlural"
    },
    "icon": "MsPortalFx.Base.Images.Logos.MicrosoftSquares",
    "part": {
      "builtIn": "ResourcePart"
    },
    "browse": {
      "type": "ResourceType",
      "query"
    },
    "resourceType": {
      "name": "Providers.Test/statefulIbizaEngines",
      "apiVersion": "2014-04-01"
    }
  }
}
```

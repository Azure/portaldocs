Recommendations view can be configured to display in two ways -

1. As a full screen blade opened from a resource menu
2. As a tab in a resource overview (GetStarted view)

<a name="as-a-full-screen-blade-opened-from-a-resource-menu"></a>
### As a full screen blade opened from a resource menu

To add the Recommendations view to be opened from a resource menu blade, add Properties definition (see `Properties definition samples` section) in the Recommendations view schema below.

```json
{
  "$schema": "../../../Definitions/dx.schema.json",
  "stringSource": "Resources/MyStrings.resjson",
  "view": {
    "kind": "Recommendations",
    "export": true,
    "parameters": [],
    "resources": [
      {
        "id": "[parameters('id')]",
        "apiVersion": "2020-06-01"
      }
    ],
    "essentials": {},
    "commands": [],
    "properties": {
      "title": "Recommendations Example"
    }
  }
}
```

<a name="as-a-tab-in-a-resource-overview-getstarted-view"></a>
### As a tab in a resource overview (GetStarted view)

To add the Recommendations view as a tab in a resource overview, add the `Recommendations Tab` (see example) to the `properties.tabs` section as seen in the Resource Overview (GetStarted) schema below.

```json
{
  "$schema": "../../Definitions/dx.schema.json",
  "stringSource": "Resources/MyStrings.resjson",
  "view": {
    "kind": "GetStarted",
    "export": true,
    "parameters": [
      {
        "name": "id",
        "type": "key"
      }
    ],
    "resources": [
      {
        "id": "[parameters('id')]",
        "apiVersion": "2014-04-01"
      }
    ],
    "essentials": {},
    "commands": [],
    "properties": {
        "title": "title",
        "tabs": [
        ]
    }
  }
}
```

<a name="as-a-tab-in-a-resource-overview-getstarted-view-recommendations-tab-example"></a>
#### <code>Recommendations Tab</code> example

Add Properties definition (see `Properties definition samples` section) in the Recommendations tab schema below.

```json
{
  "kind": "Recommendations"
}
```

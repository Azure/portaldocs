Properties view can be configured to display in two ways -

1. As a full screen blade opened from a resource menu
2. As a tab in a resource overview (GetStarted view)

<a name="as-a-full-screen-blade-opened-from-a-resource-menu"></a>
### As a full screen blade opened from a resource menu

To add the Properties view to be opened from a resource menu blade, add Properties definition (see `Properties definition samples` section) to the `properties.groups.items` as seen in the Properties view schema below.

```json
{
  "$schema": "../../../Definitions/dx.schema.json",
  "stringSource": "Resources/MyStrings.resjson",
  "view": {
    "kind": "Properties",
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
      "title": "Properties Example",
      "groups": [
        {
          "displayName": "Virtual machine",
          "icon": "MsPortalFx.Base.Images.Polychromatic.VirtualMachine",
          "description": "This is a virtual machine.",
          "items": [
          ]
        },
        {
          "displayName": "Availability + scaling",
          "icon": "MsPortalFx.Base.Images.Polychromatic.AvailabilitySet",
          "items": [
          ]
        }
      ]
    }
  }
}
```

<a name="as-a-tab-in-a-resource-overview-getstarted-view"></a>
### As a tab in a resource overview (GetStarted view)

To add the Properties view as a tab in a resource overview, add the `Properties Tab` (see example) to the `properties.tabs` section as seen in the Resource Overview (GetStarted) schema below

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

<a name="as-a-tab-in-a-resource-overview-getstarted-view-properties-tab-example"></a>
#### <code>Properties Tab</code> example

Add Properties definition (see `Properties definition samples` section) to the `groups.items` as seen in the Properties tab schema below. For each group, you can define a `Menu action` which will enable a hyperlink for the group display name to open the defined menu item.

```json
{
    "kind": "Properties",
    "groups": [
        {
            "displayName": "Virtual machine",
            "icon": "MsPortalFx.Base.Images.Polychromatic.VirtualMachine",
            "action": {
                "menu": "tags"
            },
            "description": "This is a virtual machine.",
            "items": [
            ]
        }
    ]
}
```

Tutorials view can be configured to display in two ways -

1. As a full screen blade opened from a resource menu
2. As a tab in a resource overview (GetStarted view)

<a name="as-a-full-screen-blade-opened-from-a-resource-menu"></a>
### As a full screen blade opened from a resource menu

To add the Tutorials view to be opened from a resource menu blade, add Properties definition (see `Properties definition samples` section) to the `tilesGroup.items`, `videosGroup.items` and `linksGroup.items` as seen in the Tutorials view schema below.

```json
{
  "$schema": "../../../Definitions/dx.schema.json",
  "stringSource": "Resources/MyStrings.resjson",
  "view": {
    "kind": "Tutorials",
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
      "title": "Tutorials Example",
      "tilesGroup": {
        "displayName": {
          "property": "freeTrainingsFromMicrosoft"
        },
        "items": [
          {
            "title": {
              "property": "tile1Title"
            },
            "icon": "MsPortalFx.Base.Images.Polychromatic.Learn",
            "subtitle": {
              "property": "tile1Subtitle"
            },
            "description": {
              "property": "tile1Description"
            },
            "action": {
              "url": "https://www.azure.com",
              "displayName": {
                "property": "start"
              }
            }
          }
        ]
      },
      "videosGroup": {
        "displayName": {
          "property": "tab2videosTitle"
        },
        "items": [
          {
            "title": {
              "property": "tab2feature1Title"
            },
            "description": {
              "property": "tab2feature1Description"
            },
            "learnMore": {
              "url": "https://www.azure.com",
              "ariaLabel": "Learn more about Azure"
            },
            "video": {
              "src": "https://www.youtube.com/watch?v=KXkBZCe699A"
            }
          }
        ]
      },
      "linksGroup": {
        "displayName": "Useful links",
        "items": [
          {
            "title": "Concepts",
            "action": [
              {
                "url": "https://azure.microsoft.com/en-us/",
                "displayName": "Azure Managed applications overview"
              },
              {
                "url": "https://azure.microsoft.com/en-us/",
                "displayName": "Service Catalog applications"
              },
              {
                "url": "https://azure.microsoft.com/en-us/",
                "displayName": "Managed applications in Azure Marketplace"
              }
            ]
          }
        ]
      }
    }
  }
}
```

<a name="as-a-tab-in-a-resource-overview-getstarted-view"></a>
### As a tab in a resource overview (GetStarted view)

To add the Tutorials view as a tab in a resource overview, add the `Tutorials Tab` (see example) to the `properties.tabs` section as seen in the Resource Overview (GetStarted) schema below

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

<a name="as-a-tab-in-a-resource-overview-getstarted-view-tutorials-tab-example"></a>
#### <code>Tutorials Tab</code> example

Add Properties definition (see `Properties definition samples` section) to the `tilesGroup.items`, `videosGroup.items` and `linksGroup.items` as seen in the Tutorials tab schema below.

```json
{
  "kind": "Tutorials",
  "tilesGroup": {
    "displayName": {
      "property": "freeTrainingsFromMicrosoft"
    },
    "items": [
      {
        "title": {
          "property": "tile1Title"
        },
        "icon": "MsPortalFx.Base.Images.Polychromatic.Learn",
        "subtitle": {
          "property": "tile1Subtitle"
        },
        "description": {
          "property": "tile1Description"
        },
        "action": {
          "url": "https://www.azure.com",
          "displayName": {
            "property": "start"
          }
        }
      }
    ]
  },
  "videosGroup": {
    "displayName": {
      "property": "tab2videosTitle"
    },
    "items": [
      {
        "title": {
          "property": "tab2feature1Title"
        },
        "description": {
          "property": "tab2feature1Description"
        },
        "learnMore": {
          "url": "https://www.azure.com",
          "ariaLabel": "Learn more about Azure"
        },
        "video": {
          "src": "https://www.youtube.com/watch?v=KXkBZCe699A"
        }
      }
    ]
  },
  "linksGroup": {
    "displayName": "Useful links",
    "items": [
      {
        "title": "Concepts",
        "action": [
          {
            "url": "https://azure.microsoft.com/en-us/",
            "displayName": "Azure Managed applications overview"
          },
          {
            "url": "https://azure.microsoft.com/en-us/",
            "displayName": "Service Catalog applications"
          },
          {
            "url": "https://azure.microsoft.com/en-us/",
            "displayName": "Managed applications in Azure Marketplace"
          }
        ]
      }
    ]
  }
}
```

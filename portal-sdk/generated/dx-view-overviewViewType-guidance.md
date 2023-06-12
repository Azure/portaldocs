<a name="as-a-full-screen-blade-opened-from-a-resource-menu"></a>
### As a full screen blade opened from a resource menu

To add the Overview view to be opened from a resource menu blade, add Properties definition (see `Properties definition samples` section) to the `properties.summary`and `properties.features` as seen in the Overview view schema below.

```json
{
  "$schema": "../../Definitions/dx.schema.json",
  "stringSource": "Resources/MyStrings.resjson",
  "view": {
    "kind": "Overview",
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
        "apiVersion": "2020-06-01"
      }
    ],
    "essentials": {},
    "commands": [
      {
        "kind": "MoveCommand",
        "id": "moveCommand",
        "displayName": {
          "property": "move"
        },
        "icon": "MsPortalFx.Base.Images.Move"
      },
      {
        "kind": "DeleteCommand",
        "id": "deleteCommand",
        "displayName": {
          "property": "delete"
        },
        "icon": "MsPortalFx.Base.Images.Delete",
        "confirmation": {
          "title": {
            "property": "deleteResourceTitle"
          },
          "message": {
            "property": "deleteResourceMessage"
          }
        },
        "definition": {
          "apiVersion": "2014-04-01"
        }
      }
    ],
    "properties": {
      "title": "title",
      "summary": {
        "title": {
          "property": "tab1Title"
        },
        "description": "By default, all resources added to profiles within the same network security perimeter will be able to communicate with each other, but not with the internet or resources outside the perimeter.",
        "learnMore": {
          "url": "https://azure.microsoft.com/en-us/features/azure-portal/",
          "ariaLabel": "Learn more about Azure Portal"
        }
      },
      "features": [
        {
          "title": {
            "property": "tab1feature1Title"
          },
          "description": {
            "property": "tab1feature1Description"
          },
          "learnMore": {
            "url": "https://azure.microsoft.com/en-us/features/azure-portal/",
            "ariaLabel": "Learn more about Azure Portal"
          },
          "icon": {
            "file": "../../Content/svg/engine.svg"
          },
          "action": [
            {
              "menu": "tags",
              "displayName": {
                "property": "tab1feature1actionDisplayName"
              }
            }
          ]
        },
        {
          "title": {
            "property": "tab1feature2Title"
          },
          "description": {
            "property": "tab1feature2Description"
          },
          "learnMore": {
            "url": "https://azure.microsoft.com/en-us/features/azure-portal/",
            "ariaLabel": "Learn more about Azure Portal"
          },
          "icon": {
            "file": "../../Content/svg/engine.svg"
          },
          "action": {
            "blade": {
              "name": "FormBladeArmRequest_Dx"
            },
            "displayName": {
              "property": "tab1feature2actionDisplayName"
            }
          }
        },
        {
          "title": {
            "property": "tab1feature3Title"
          },
          "description": {
            "property": "tab1feature3Description"
          },
          "learnMore": {
            "url": "https://azure.microsoft.com/en-us/features/azure-portal/",
            "ariaLabel": "Learn more about Azure Portal"
          },
          "icon": {
            "file": "../../Content/svg/msi.svg"
          },
          "action": {
            "url": "https://www.azure.com",
            "displayName": {
              "property": "tab1feature3actionDisplayName"
            }
          }
        }
      ]
    }
  }
}
```

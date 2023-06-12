DataBrowse view can be configured to display in two ways -

1. As a full screen blade opened from a resource menu
2. As a tab in a resource overview (GetStarted view)

<a name="as-a-full-screen-blade-opened-from-a-resource-menu"></a>
### As a full screen blade opened from a resource menu

To add the DataBrowse view to be opened from a resource menu blade, add Properties definition (see `Properties definition samples` section) to the `properties.data` and `properties.columns` as seen in the DataBrowse view schema below.

```json
{
  "$schema": "../../Definitions/dx.schema.json",
  "stringSource": "Resources/MyStrings.resjson",
  "view": {
    "kind": "DataBrowse",
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
      "title": "DataBrowse",
      "description": "By default, all resources added to profiles within the same network security perimeter will be able to communicate with each other, but not with the internet or resources outside the perimeter.",
      "ariaLabel": "testing",
      "data": [
        {
          "name": "",
          "id": "",
          "status": "succeeded",
          "menu": "tags",
          "urlText": "Azure portal",
          "urlAction": {
            "url": "https://azure.microsoft.com/"
          },
          "parameters": {
            "obj": {
              "name": "aks-agentpool"
            },
            "title": "aks-agentpool"
          },
          "diskSize": 100,
          "creationTime": "2021-03-23T21:24:47.7856737Z"
        },
        {
          "name": "",
          "id": "",
          "status": "warning",
          "menu": "metrics",
          "urlText": "Microsoft",
          "urlAction": {
            "url": "https://www.microsoft.com/en-us/"
          },
          "parameters": {
            "obj": {
              "name": "AzureMobileTest-vnet"
            },
            "title": "AzureMobileTest-vnet"
          },
          "diskSize": 10000,
          "creationTime": "2021-04-24T21:24:47.7856737Z"
        },
        {
          "name": "",
          "id": "",
          "status": "failed",
          "menu": "locks",
          "urlText": "Github",
          "urlAction": {
            "url": "https://github.com/"
          },
          "parameters": {
            "obj": {
              "name": "Test-disk"
            },
            "title": "Test-disk"
          },
          "diskSize": 1500,
          "price": 1500,
          "creationTime": "2021-05-25T21:24:47.7856737Z"
        }
      ],
      "columns": [
        {
          "displayName": "Name",
          "name": "name",
          "action": {
            "resourceId": "[$item.id]"
          }
        },
        {
          "displayName": "Menu",
          "name": "menu",
          "action": {
            "menu": "[$item.menu]"
          }
        },
        {
          "displayName": "Url",
          "name": "urlText",
          "action": {
            "url": "[$item.urlAction.url]"
          }
        },
        {
          "displayName": "Blade",
          "name": "name",
          "action": {
            "blade": {
              "name": "ObjectJsonViewBlade",
              "extension": "Microsoft_Azure_CreateUIDef",
              "parameters": "[$item.parameters]",
              "inContextPane": true
            }
          }
        },
        {
          "displayName": "Status",
          "name": "status",
          "valueMapping": [
            {
              "value": "Succeeded",
              "displayName": "Succeeded",
              "icon": "MsPortalFx.Base.Images.StatusBadge.Outline.Success"
            },
            {
              "value": "Warning",
              "displayName": "Warning",
              "icon": "MsPortalFx.Base.Images.StatusBadge.Outline.Warning"
            },
            {
              "value": "Failed",
              "displayName": "Failed",
              "icon": "MsPortalFx.Base.Images.StatusBadge.Outline.Failed"
            }
          ]
        },
        {
          "displayName": "Disk size",
          "name": "diskSize",
          "format": "Number",
          "sourceUnits": "Gigabytes",
          "maximumFractionDigits": 2
        },
        {
          "displayName": "Creation time",
          "name": "creationTime",
          "format": "Date"
        }
      ]
    }
  }
}
```

<a name="as-a-tab-in-a-resource-overview-getstarted-view"></a>
### As a tab in a resource overview (GetStarted view)

To add the DataBrowse view as a tab in a resource overview, add the `DataBrowse Tab` (see example) to the `properties.tabs` section as seen in the Resource Overview (GetStarted) schema below

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

<a name="as-a-tab-in-a-resource-overview-getstarted-view-databrowse-tab-example"></a>
#### <code>DataBrowse Tab</code> example

Add Properties definition (see `Properties definition samples` section) to the `properties.data` and `properties.columns` as seen in the DataBrowse tab schema below.

```json
{
  "kind": "DataBrowse",
  "ariaLabel": "testing",
  "data": [
    {
      "name": "",
      "id": "",
      "status": "succeeded",
      "menu": "tags",
      "urlText": "Azure portal",
      "urlAction": {
        "url": "https://azure.microsoft.com/"
      },
      "parameters": {
        "obj": {
          "name": "aks-agentpool"
        },
        "title": "aks-agentpool"
      },
      "diskSize": 100,
      "creationTime": "2021-03-23T21:24:47.7856737Z"
    },
    {
      "name": "",
      "id": "",
      "status": "warning",
      "menu": "metrics",
      "urlText": "Microsoft",
      "urlAction": {
        "url": "https://www.microsoft.com/en-us/"
      },
      "parameters": {
        "obj": {
          "name": "AzureMobileTest-vnet"
        },
        "title": "AzureMobileTest-vnet"
      },
      "diskSize": 10000,
      "creationTime": "2021-04-24T21:24:47.7856737Z"
    },
    {
      "name": "",
      "id": "",
      "status": "failed",
      "menu": "locks",
      "urlText": "Github",
      "urlAction": {
        "url": "https://github.com/"
      },
      "parameters": {
        "obj": {
          "name": "Test-disk"
        },
        "title": "Test-disk"
      },
      "diskSize": 1500,
      "price": 1500,
      "creationTime": "2021-05-25T21:24:47.7856737Z"
    }
  ],
  "columns": [
    {
      "displayName": "Name",
      "name": "name",
      "action": {
        "resourceId": "[$item.id]"
      }
    },
    {
      "displayName": "Menu",
      "name": "menu",
      "action": {
        "menu": "[$item.menu]"
      }
    },
    {
      "displayName": "Url",
      "name": "urlText",
      "action": {
        "url": "[$item.urlAction.url]"
      }
    },
    {
      "displayName": "Blade",
      "name": "name",
      "action": {
        "blade": {
          "name": "ObjectJsonViewBlade",
          "extension": "Microsoft_Azure_CreateUIDef",
          "parameters": "[$item.parameters]",
          "inContextPane": true
        }
      }
    },
    {
      "displayName": "Status",
      "name": "status",
      "valueMapping": [
        {
          "value": "Succeeded",
          "displayName": "Succeeded",
          "icon": "MsPortalFx.Base.Images.StatusBadge.Outline.Success"
        },
        {
          "value": "Warning",
          "displayName": "Warning",
          "icon": "MsPortalFx.Base.Images.StatusBadge.Outline.Warning"
        },
        {
          "value": "Failed",
          "displayName": "Failed",
          "icon": "MsPortalFx.Base.Images.StatusBadge.Outline.Failed"
        }
      ]
    },
    {
      "displayName": "Disk size",
      "name": "diskSize",
      "format": "Number",
      "sourceUnits": "Gigabytes",
      "maximumFractionDigits": 2
    },
    {
      "displayName": "Creation time",
      "name": "creationTime",
      "format": "Date"
    }
  ]
}
```

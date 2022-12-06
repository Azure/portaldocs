Capabilities view can be configured to display in two ways -

1. As a full screen blade opened from a resource menu
2. As a tab in a resource overview (GetStarted view)

<a name="as-a-full-screen-blade-opened-from-a-resource-menu"></a>
### As a full screen blade opened from a resource menu

To add the Capabilities view to be opened from a resource menu blade, add Properties definition (see `Properties definition samples` section) to the `properties.capabilities.items` as seen in the Capabilities view schema below.

```json
{
  "$schema": "../../../Definitions/dx.schema.json",
  "stringSource": "Resources/MyStrings.resjson",
  "view": {
    "kind": "Capabilities",
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
      "title": "Capabilities Example",
      "capabilities": [
        {
          "title": "Backup",
          "icon": "MsPortalFx.Base.Images.Polychromatic.Backup",
          "description": "Simple and reliable server backup to the cloud",
          "action": {
            "menu": "tags"
          },
          "status": {
            "value": "[contains(resources().name, 'test')]",
            "valueMapping": [
              {
                "value": "true",
                "displayName": "Configured",
                "icon": "MsPortalFx.Base.Images.StatusBadge.Success"
              },
              {
                "value": "false",
                "displayName": "Not configured",
                "icon": "MsPortalFx.Base.Images.StatusBadge.None",
                "action": {
                  "blade": {
                    "name": "",
                    "extension": "",
                    "parameters": {},
                    "inContextPane": true
                  }
                }
              }
            ]
          }
        },
        {
          "title": "Disaster recovery",
          "icon": "MsPortalFx.Base.Images.Polychromatic.SiteRecovery",
          "description": "Replicate your virtual machine to another Azure region",
          "action": {
            "menu": "tags"
          },
          "status": {
            "value": "[not(contains(resources().name, 'test'))]",
            "valueMapping": [
              {
                "value": "true",
                "displayName": "Configured",
                "icon": "MsPortalFx.Base.Images.StatusBadge.Success"
              },
              {
                "value": "false",
                "displayName": "Not configured",
                "icon": "MsPortalFx.Base.Images.StatusBadge.None",
                "action": {
                  "blade": {
                    "name": "",
                    "extension": "",
                    "parameters": {},
                    "inContextPane": true
                  }
                }
              }
            ]
          }
        },
        {
          "title": "Insights",
          "icon": "MsPortalFx.Base.Images.Polychromatic.Insights",
          "description": "Enable logs and detailed monitoring capabilities",
          "action": {
            "menu": "tags"
          },
          "status": {
            "value": "[resources().properties.test]",
            "valueMapping": [
              {
                "value": "present",
                "displayName": "Configured",
                "icon": "MsPortalFx.Base.Images.StatusBadge.Success"
              },
              {
                "value": "notPresent",
                "displayName": "Not configured",
                "icon": "MsPortalFx.Base.Images.StatusBadge.None",
                "action": {
                  "blade": {
                    "name": "",
                    "extension": "",
                    "parameters": {},
                    "inContextPane": true
                  }
                }
              },
              {
                "value": "null",
                "displayName": "Error",
                "icon": "MsPortalFx.Base.Images.StatusBadge.Error"
              },
              {
                "value": "undefined",
                "displayName": "Error",
                "icon": "MsPortalFx.Base.Images.StatusBadge.Error"
              }
            ]
          }
        },
        {
          "title": "Security",
          "icon": "MsPortalFx.Base.Images.Polychromatic.SslCustomDomains",
          "description": "Continuously monitor your VM for potential security vulnerabilities",
          "action": {
            "menu": "tags"
          }
        }
      ]
    }
  }
}
```

<a name="as-a-tab-in-a-resource-overview-getstarted-view"></a>
### As a tab in a resource overview (GetStarted view)

To add the Capabilities view as a tab in a resource overview, add the `Capabilities Tab` (see example) to the `properties.tabs` section as seen in the Resource Overview (GetStarted) schema below

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

<a name="as-a-tab-in-a-resource-overview-getstarted-view-capabilities-tab-example"></a>
#### <code>Capabilities Tab</code> example

Add Properties definition (see `Properties definition samples` section) to the `capabilities.items` as seen in the Capabilities tab schema below.

```json
{
  "kind": "Capabilities",
  "capabilities": [
    {
      "title": "Backup",
      "icon": "MsPortalFx.Base.Images.Polychromatic.Backup",
      "description": "Simple and reliable server backup to the cloud",
      "action": {
        "menu": "tags"
      },
      "status": {
        "value": "[contains(resources().name, 'test')]",
        "valueMapping": [
          {
            "value": "true",
            "displayName": "Configured",
            "icon": "MsPortalFx.Base.Images.StatusBadge.Success"
          },
          {
            "value": "false",
            "displayName": "Not configured",
            "icon": "MsPortalFx.Base.Images.StatusBadge.None",
            "action": {
              "blade": {
                "name": "",
                "extension": "",
                "parameters": {},
                "inContextPane": true
              }
            }
          }
        ]
      }
    },
    {
      "title": "Disaster recovery",
      "icon": "MsPortalFx.Base.Images.Polychromatic.SiteRecovery",
      "description": "Replicate your virtual machine to another Azure region",
      "action": {
        "menu": "tags"
      },
      "status": {
        "value": "[not(contains(resources().name, 'test'))]",
        "valueMapping": [
          {
            "value": "true",
            "displayName": "Configured",
            "icon": "MsPortalFx.Base.Images.StatusBadge.Success"
          },
          {
            "value": "false",
            "displayName": "Not configured",
            "icon": "MsPortalFx.Base.Images.StatusBadge.None",
            "action": {
              "blade": {
                "name": "",
                "extension": "",
                "parameters": {},
                "inContextPane": true
              }
            }
          }
        ]
      }
    },
    {
      "title": "Insights",
      "icon": "MsPortalFx.Base.Images.Polychromatic.Insights",
      "description": "Enable logs and detailed monitoring capabilities",
      "action": {
        "menu": "tags"
      },
      "status": {
        "value": "[resources().properties.test]",
        "valueMapping": [
          {
            "value": "present",
            "displayName": "Configured",
            "icon": "MsPortalFx.Base.Images.StatusBadge.Success"
          },
          {
            "value": "notPresent",
            "displayName": "Not configured",
            "icon": "MsPortalFx.Base.Images.StatusBadge.None",
            "action": {
              "blade": {
                "name": "",
                "extension": "",
                "parameters": {},
                "inContextPane": true
              }
            }
          },
          {
            "value": "null",
            "displayName": "Error",
            "icon": "MsPortalFx.Base.Images.StatusBadge.Error"
          },
          {
            "value": "undefined",
            "displayName": "Error",
            "icon": "MsPortalFx.Base.Images.StatusBadge.Error"
          }
        ]
      }
    },
    {
      "title": "Security",
      "icon": "MsPortalFx.Base.Images.Polychromatic.SslCustomDomains",
      "description": "Continuously monitor your VM for potential security vulnerabilities",
      "action": {
        "menu": "tags"
      }
    }
  ]
}
```

<a name="declarative-resource-overview-experience"></a>
# Declarative Resource Overview experience

This document will guide you on how to create the Declarative Resource Overview blade. The Declarative Resource Overview blade is is the home page for your resource, which provides the purpose, top actions and key information so that users can quickly get value from your resource. 

The Declarative Resource Overview blade includes the following sections: 

1. Command bar - Define actions for your resource
2. Essentials - Display key properties of your resource
3. Views - Display key information of your resource

The following Views that are supported:

1. Getting Started
2. Monitoring
3. Tutorials
4. Information

<a name="declarative-resource-overview-experience-getting-started-with-declarative-resource-overview-blade"></a>
## Getting started with Declarative Resource Overview blade

Below is an example the Declarative Resource Overview blade schema, as defined by the `GetStarted` kind. The `resources` section takes an ARM `id` and `apiVersion`, which in turn makes a ARM GET request to retrieve the resource details.  You can use the `resources()` function to retrieve the resource payload at runtime.

<a name="declarative-resource-overview-experience-getting-started-with-declarative-resource-overview-blade-declarative-resource-overview-schema"></a>
##### Declarative Resource Overview schema
<a name="resourceoverviewschema"></a>
```
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
        "tabs": []
    }
  }
}
```
The `essentials` section defines what is rendered in Essentials.  The `commands` section defines the Commands in the command bar.  The `properties` section defines the tabbed Views to be rendered (under Essentials).  See below for an illustration.

![alt-text](../media/portalfx-cuid/ResourceOverview.png "Declarative Resource Overview")

<a name="declarative-resource-overview-experience-configuring-views"></a>
## Configuring views

The following views are supported -
****
1. [Getting Started](#getting-started)
2. [Monitoring](#monitoring)
3. [Tutorials](#tutorials)
4. [Information](#information)

<a name="declarative-resource-overview-experience-configuring-views-getting-started"></a>
#### Getting Started
The Getting Started view is the primary view that users first see in Declarative Resource Overview blade. The purpose of the Getting Started view is to help the user learn about the resource and service. The Getting Started view consist of free form text followed by `features`, which can include actions such as URL, Blade and Menu open actions. The Menu action opens a menu item as defined with the `id`. In the example below, `tags` will open the Tags menu blade. [Learn more about configuring the resource menu](declarative-assets.md#configuring-the-resource-menu).

To add the Getting Started view, add the following example to the `properties.tabs` section in the [Declarative Resource Overview schema](#resource-overview-schema)

```
{
    "title": {
        "property": "tab1Title"
    },
    "description": {
        "property": "tab1Description"
    },
    "learnMore": {
        "url": "https://azure.microsoft.com/en-us/features/azure-portal/",
        "ariaLabel": "Learn more about Azure Portal"
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
        "action": {
            "menu": "tags",
            "displayName": {
                "property": "tab1feature1actionDisplayName"
            }
        }
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
                "name": "ActiveDirectoryMenuBlade",
                "extension": "Microsoft_AAD_IAM"
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
```
Example
![alt-text](../media/portalfx-cuid/GettingStartedTab.png "Getting Started tab")

<a name="declarative-resource-overview-experience-configuring-views-monitoring"></a>
#### Monitoring
The Monitoring view allows you to add customized metrics for your resource.  The metrics are derived from Azure Monitor.  

Metrics can be defined as such 
```
{
    "id": "Percentage CPU",
    "aggregationType": "Sum",
    "resourceMetadata": {
        "id": "[parameters('id')]"
    }
}
```
And the `id` and `aggregationType` must match what is available in Azure Monitor's `Metric` and `Aggregation`

![alt-text](../media/portalfx-cuid/MetricsMonitoring.png "Declarative Resource Overview")

To add the Monitoring view, add the following example to the `properties.tabs` section in the [Declarative Resource Overview schema](#resource-overview-schema)

```
{
    "kind": "Monitoring",
    "charts": [
        {
            "title": "CPU (average)",
            "metrics": [
                {
                    "id": "Percentage CPU",
                    "aggregationType": "Avg",
                    "resourceMetadata": {
                        "id": "[parameters('id')]"
                    }
                }
            ]
        }
    ]
}
```
Example
![alt-text](../media/portalfx-cuid/MonitoringTab.png "Monitoring tab")

<a name="declarative-resource-overview-experience-configuring-views-tutorials"></a>
#### Tutorials
The tutorials view supports embedding tiles, videos and links.

To add the Tutorials view, add the following example to the `properties.tabs` section in the [Declarative Resource Overview schema](#resource-overview-schema)

```
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
Example
![alt-text](../media/portalfx-cuid/TutorialsTab.png "Tutorials tab")

<a name="declarative-resource-overview-experience-configuring-views-information"></a>
#### Information
The Information view allow you to specify an array of actions including URL, Blade and Menu open actions.


To add the Information view, add the following example to the `properties.tabs` section in the [Declarative Resource Overview schema](#resource-overview-schema)

```
{
    "kind": "Information",
    "displayName": "Information",
    "features": [
        {
            "title": "Declarative Resources",
            "action": [
                {
                    "displayName": "Declarative Developer guide",
                    "url": "https://aka.ms/portalfx/declarative"
                },
                {
                    "displayName": "Declarative Form Sandbox",
                    "url": "http://aka.ms/form/sandbox"
                },
                {
                    "displayName": "Open Active Directory",
                    "blade": {
                    "name": "ActiveDirectoryMenuBlade",
                    "extension": "Microsoft_AAD_IAM"
                    }
                },
                {
                    "displayName": "Open Tags",
                    "menu": "tags"
                }
            ]
        }
    ]
}
```
Example
![alt-text](../media/portalfx-cuid/InformationTab.png "Information tab")

<a name="declarative-resource-overview-experience-configuring-the-command-bar"></a>
## Configuring the command bar

The command bar allows you to provide top actions that interacts with your resource. The following commands are supported:

1. [OpenBladeCommand](#openbladecommand)
2. [OpenMarketplaceCommand](#openmarketplacecommand)
3. [ArmCommand](#armcommand)
4. [MenuCommand](#menucommand)
5. [MoveCommand](#movecommand)
6. [RefreshCommand](#refreshcommand)
7. [DeleteCommand](#deletecommand)

<a name="declarative-resource-overview-experience-configuring-the-command-bar-openbladecommand"></a>
#### OpenBladeCommand
This command allows you to open another blade either in full screen or as a context pane. The blade name is defined in `blade` property. You can also specify the `blade.extension` to reference blade in another extension. Example of OpenBladeCommand -
```
    {
        "kind": "OpenBladeCommand",
        "id": "openBladeCommand",
        "displayName": "Open Blade",
        "icon": "MsPortalFx.Base.Images.Logos.MicrosoftSquares",
        "blade": {
            "name": "CreateForm_dx",
            "inContextPane": true
        }
    }
```
<a name="declarative-resource-overview-experience-configuring-the-command-bar-openmarketplacecommand"></a>
#### OpenMarketplaceCommand
This command allows you to open the Create experience for a Marketplace package as defined by the `marketplaceItemId` property. The `marketplaceItemId` must exists in the Azure Marketplace.  Example of OpenMarketplaceCommand - 

```
    {
        "kind": "OpenMarketplaceCommand",
        "id": "openMarketplaceCommand",
        "displayName": "Marketplace Command",
        "icon": "MsPortalFx.Base.Images.Polychromatic.Store",
        "marketplaceItemId": "Microsoft.DxIbizaEngine"
    }
```
<a name="declarative-resource-overview-experience-configuring-the-command-bar-armcommand"></a>
#### ArmCommand
This command allows you to make an ARM request. The ARM request method and URI are defined in the `definition` property.  Example of ArmCommand - 

```
    {
        "kind": "ArmCommand",
        "id": "armCommand",
        "displayName": "Arm Command",
        "icon": "MsPortalFx.Base.Images.Go",
        "definition": {
            "httpMethod": "post",
            "uri": "[concat(resources().id, '?api-version=2014-04-01')]"
        }
    }
```
<a name="declarative-resource-overview-experience-configuring-the-command-bar-menucommand"></a>
#### MenuCommand
This command allows you to group multiple commands and displays them in a menu.  Example of MenuCommand - 
```
    {
        "kind": "MenuCommand",
        "id": "menuCommand",
        "displayName": "Menu",
        "icon": "MsPortalFx.Base.Images.AllServices",
        "commands": [
          {
            "kind": "RefreshCommand",
            "id": "refreshCommandId2",
            "displayName": "refresh",
            "icon": "MsPortalFx.Base.Images.Refresh"
          },
          {
            "kind": "DeleteCommand",
            "id": "deleteCommand2",
            "displayName": "delete",
            "icon": "MsPortalFx.Base.Images.Delete",
            "confirmation": {
              "title": "deleteResourceTitle",
              "message": "deleteResourceMessage"
            },
            "definition": {
              "apiVersion": "2014-04-01"
            }
          }
        ]
    }
```
<a name="declarative-resource-overview-experience-configuring-the-command-bar-movecommand"></a>
#### MoveCommand
The Move command allows the user to move the resource to another subscription or resource group.  Example of MoveCommand - 
```
    {
        "kind": "MoveCommand",
        "id": "moveCommand",
        "displayName": "move",
        "icon": "MsPortalFx.Base.Images.Move"
    }
```
<a name="declarative-resource-overview-experience-configuring-the-command-bar-refreshcommand"></a>
#### RefreshCommand
The Refresh command allows the user to refresh the blade. Example of RefreshCommand - 
```
    {
        "kind": "RefreshCommand",
        "id": "refreshCommandId",
        "displayName": "refresh",
        "icon": "MsPortalFx.Base.Images.Refresh"
    }
```
<a name="declarative-resource-overview-experience-configuring-the-command-bar-deletecommand"></a>
#### DeleteCommand
The Delete command allows the user to delete the resource. A confirmation dialog will appear to re-confirm the delete action. The `definition.apiVersion` must match the supported API version of the Resource Provider. Example of DeleteCommand - 
```
    {
        "kind": "DeleteCommand",
        "id": "deleteCommand",
        "displayName": "delete",
        "icon": "MsPortalFx.Base.Images.Delete",
        "confirmation": {
          "title": "deleteResourceTitle",
          "message": "deleteResourceMessage"
        },
        "definition": {
          "apiVersion": "2014-04-01"
        }
    }
```


<a name="declarative-resource-overview-experience-configuring-essentials"></a>
## Configuring essentials

Essentials allows you to display key properties of your resource. The space in essentials is limited, so only configure the most used properties in essentials. By default, and for consistency, we display Resource Group, Location, Subscription, Subscription ID and Tags properties. You can also add custom properties of the resource in essentials.

Please note that the default properties are listed first (on the left of essentials) and custom properties are listed after the default (on the right of essentials)

<a name="declarative-resource-overview-experience-configuring-essentials-to-configure-default-essentials"></a>
#### To configure default essentials
To configure default essentials, simply add `"essentials": {}` to your Declarative Resource Overview json like this -

![alt-text](../media/portalfx-cuid/DefaultEssentialsJson.png "Default Essentials Json")

The default essentials will render like this -

![alt-text](../media/portalfx-cuid/DefaultEssentials.png "Default Essentials render")


<a name="declarative-resource-overview-experience-configuring-essentials-to-configure-custom-properties-in-essentials"></a>
#### To configure custom properties in essentials
We support the following custom essential types -

1. [String Content](#string-content)
2. [Action URL](#action-url)
3. [Action Blade](#action-blade)

<a name="declarative-resource-overview-experience-configuring-essentials-to-configure-custom-properties-in-essentials-string-content"></a>
##### String Content
String content can be dynamic or static. Using the `resources()` function, you can display properties of your resource at runtime.  Example json -

```
"essentials": {
    "properties": [
        {
            "displayName": "propertydisplayname",
            "value": "[resources().name]"
        }
    ]
}
```
<a name="declarative-resource-overview-experience-configuring-essentials-to-configure-custom-properties-in-essentials-action-url"></a>
##### Action URL
<a name="actionurl"></a>
Action URL allows you to open the `url` in a browser window.  Example json - 

```
"essentials": {
    "properties": [
        {
            "displayName": "propertydisplayname",
            "value": "action url",
            "action": {
                "url": "https://www.azure.com"
            }
        }
    ]
}
```
<a name="declarative-resource-overview-experience-configuring-essentials-to-configure-custom-properties-in-essentials-action-blade"></a>
##### Action Blade
<a name="actionblade"></a>
Action Blade allows you to open a blade.  Example json -

```
"essentials": {
    "properties": [
        {
            "displayName": "propertydisplayname4",
            "value": "action blade",
            "action": {
                "blade": {
                    "extension": "Microsoft_AAD_IAM",
                    "name": "ActiveDirectoryQuickStartBlade",
                    "parameters": {}
                }
            }
        }
    ]
}
```

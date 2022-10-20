To add the Tutorials view, add the following example to the `properties.tabs` section in the [Declarative Resource Overview schema](portalfx-declarative-overview.md#declarative-resource-overview-schema)

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

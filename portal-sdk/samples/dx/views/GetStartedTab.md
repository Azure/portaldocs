To add the Getting Started view, add the following example to the `properties.tabs` section in the [Declarative Resource Overview schema](portalfx-declarative-overview.md#declarative-resource-overview-schema)

```json
{
    "kind": "GetStarted",
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

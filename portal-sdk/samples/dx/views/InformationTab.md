To add the Informations Tab, add the following example to the `properties.tabs` section in the [Declarative Resource Overview schema](../../../generated/portalfx-declarative-overview.md#declarative-resource-overview-schema)

```json
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
                    "url": "https://aka.ms/form/sandbox"
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

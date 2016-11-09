<properties title="" pageTitle="Deploy to Azure" description="" authors="flanakin" />

[Portal FX](/documentation/sections/portalfx) > [Hubs](/documentation/sections/portalfx#hubs) > [Create](/documentation/articles/portalfx-create) > Deploy to Azure

# Deploy to Azure

Deploy to Azure allows you to dynamically generate a Create form based on a
[Resource Manager template](https://azure.microsoft.com/en-us/documentation/articles/resource-group-authoring-templates).
The form is generated based on the input parameters defined in the template. The most common use of the Deploy to Azure
button is for [community templates posted on Github](https://github.com/Azure/azure-quickstart-templates), but you can
also create a Marketplace package that uses the Deploy to Azure blade. This is the simplest way to publish a Create
experience in the Azure portal.

## Linking from the web

To deep-link to the template deployment blade, URL-encode your hosted template URL and append it to the end of this URL:

    https://portal.azure.com/#create/microsoft.template/uri/**<url-encoded-template-path>**

For instance, this simple storage account template...

    https://raw.githubusercontent.com/azure/azure-quickstart-templates/master/101-create-storage-account-standard/azuredeploy.json

Would be this URL...

    https://portal.azure.com/#create/microsoft.template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-create-storage-account-standard%2Fazuredeploy.json

To add a Deploy to Azure button to your Github project, add the following markdown, replacing the `{encodedTemplateUrl}`
with a URI-encoded link to your template.

```md
[![Deploy to Azure](../media/portalfx-create-deploytoazure/deploybutton.png) http://azuredeploy.net/deploybutton.png)](https://portal.azure.com/#create/Microsoft.Template/uri/{encodedTemplateUrl})
```

Or in HTML...

```html
<a href="https://portal.azure.com/#create/Microsoft.Template/uri/{encodedTemplateUrl}"><img src="http://azuredeploy.net/deploybutton.png"></a>
```

## Adding to the Marketplace

To create a custom Marketplace package that can be hosted directly in the Marketplace, create your package as you
normally would, but instead of a custom UIDefinition.json file, use the following:

```js
{
    "$schema": "https://gallery.azure.com/schemas/2015-02-12/UIDefinition.json#",
    "createDefinition": {
        "createBlade": {
            "name": "DeployToAzure",
            "extension": "HubsExtension"
        }
    }
}
```

If you want to make your custom package read-only (so people cannot edit the template), add `readonlytemplate` to the list of category ids.

Both of these will load your template automatically and open the list of parameters by default. [Try it!](https://portal.azure.com/#create/microsoft.template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F101-create-storage-account-standard%2Fazuredeploy.json)


## Best practices

* Always define a `defaultValue` for parameters, when possible
* Define `allowedValues` when a parameter has a static list of values
* Define `minValue` and `maxValue` when using a numeric range
* Define `minLength` and `maxLength` when using string values with length constraints
* Use `group` metadata to organize related parameters together
* Use `group: "basics"` for the primary resource name to elevate that to the top of the form
* Add `label` metadata to customize the display text for each field
* Add `description` metadata to provide additional information about what the parameter is for, but only if it adds contextual values


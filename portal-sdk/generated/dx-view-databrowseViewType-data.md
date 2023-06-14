<a name="view-databrowseviewtype-data"></a>
# view-databrowseViewType-data
* [view-databrowseViewType-data](#view-databrowseviewtype-data)
    * [Guidance](#view-databrowseviewtype-data-guidance)
        * [Example 1](#view-databrowseviewtype-data-guidance-example-1)
        * [Example 2](#view-databrowseviewtype-data-guidance-example-2)
    * [Definitions:](#view-databrowseviewtype-data-definitions)
        * [Option 1](#view-databrowseviewtype-data-definitions-option-1)
        * [Option 2](#view-databrowseviewtype-data-definitions-option-2)

<a name="view-databrowseviewtype-data-guidance"></a>
## Guidance
<a name="view-databrowseviewtype-data-guidance-example-1"></a>
### Example 1
```json
{
    "kind": "DataBrowse",
    "displayName": "Data browse",
    "ariaLabel": "testing",
    "data": {
        "transforms": "[concat('[', '@.{caching:caching, createOption: createOption, name: name, osType:osType, managedDisk:managedDisk.to_string(@)}', ']')]",
        "input": "[resources().properties.storageProfile.osDisk]"
    }
}
```

<a name="view-databrowseviewtype-data-guidance-example-2"></a>
### Example 2

![alt-text](../media/portalfx-cuid/DataBrowseTransformsExample.png "DataBrowse transforms")


please visit [here](https://jmespath.org/) to try out JMESPath
 
<a name="view-databrowseviewtype-data-definitions"></a>
## Definitions:
<a name="view-databrowseviewtype-data-definitions-option-1"></a>
### Option 1
<a name="view-databrowseviewtype-data-definitions-option-1-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|transforms|True|Use JMES path query to transform data. See [here](dx-function-transforms.md) for more on transforms
|input|True|The input data to display on the table.
|fx.feature|False|
<a name="view-databrowseviewtype-data-definitions-option-2"></a>
### Option 2
<a name="view-databrowseviewtype-data-definitions-option-2-any-string"></a>
##### Any String

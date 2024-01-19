<a name="view-dashboardviewtype-actionreference"></a>
# view-dashboardViewType-actionReference
* [view-dashboardViewType-actionReference](#view-dashboardviewtype-actionreference)
    * [Definitions:](#view-dashboardviewtype-actionreference-definitions)
        * [Option 1](#view-dashboardviewtype-actionreference-definitions-option-1)
        * [Option 2](#view-dashboardviewtype-actionreference-definitions-option-2)

<a name="view-dashboardviewtype-actionreference-definitions"></a>
## Definitions:
<a name="view-dashboardviewtype-actionreference-definitions-option-1"></a>
### Option 1
<a name="view-dashboardviewtype-actionreference-definitions-option-1-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|type|True|Enum permitting the value: "uri"
|url|True|The URI that will be opened
|displayName|True|Display name for the link
|fx.feature|False|
<a name="view-dashboardviewtype-actionreference-definitions-option-2"></a>
### Option 2
<a name="view-dashboardviewtype-actionreference-definitions-option-2-an-object-with-the-following-properties-1"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|type|True|Enum permitting the value: "blade"
|blade|True|See [here](dx-view-dashboardViewType-bladeReference.md) for more information.
|displayName|True|Display name for the link.
|fx.feature|False|

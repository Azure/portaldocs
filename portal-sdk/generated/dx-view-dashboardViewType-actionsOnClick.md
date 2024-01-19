<a name="view-dashboardviewtype-actionsonclick"></a>
# view-dashboardViewType-actionsOnClick
* [view-dashboardViewType-actionsOnClick](#view-dashboardviewtype-actionsonclick)
    * [Definitions:](#view-dashboardviewtype-actionsonclick-definitions)
        * [Option 1](#view-dashboardviewtype-actionsonclick-definitions-option-1)
        * [Option 2](#view-dashboardviewtype-actionsonclick-definitions-option-2)

<a name="view-dashboardviewtype-actionsonclick-definitions"></a>
## Definitions:
<a name="view-dashboardviewtype-actionsonclick-definitions-option-1"></a>
### Option 1
<a name="view-dashboardviewtype-actionsonclick-definitions-option-1-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|type|True|What action the tile should do when clicked. Enum permitting the value: "updateParameters"
|parameters|True|The parameters present in this array will be affected by parameter related actions.  See [here](dx-view-dashboardViewType-parametersValues.md) for more information.
|fx.feature|False|
<a name="view-dashboardviewtype-actionsonclick-definitions-option-2"></a>
### Option 2
<a name="view-dashboardviewtype-actionsonclick-definitions-option-2-an-object-with-the-following-properties-1"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|type|True|What action the tile should do when clicked. Enum permitting the value: "openBlade"
|blade|True|See [here](dx-view-dashboardViewType-bladeReference.md) for more information.
|fx.feature|False|

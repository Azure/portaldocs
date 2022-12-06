<a name="getstarted-propertiestab-items"></a>
# getstarted-PropertiesTab-items
* [getstarted-PropertiesTab-items](#getstarted-propertiestab-items)
    * [Definitions:](#getstarted-propertiestab-items-definitions)
        * [An array of items, where each item is of the type:](#getstarted-propertiestab-items-definitions-an-array-of-items-where-each-item-is-of-the-type)

<a name="getstarted-propertiestab-items-definitions"></a>
## Definitions:
<a name="getstarted-propertiestab-items-definitions-an-array-of-items-where-each-item-is-of-the-type"></a>
### An array of items, where each item is of the type:
<a name="getstarted-propertiestab-items-definitions-an-array-of-items-where-each-item-is-of-the-type-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|displayName|True|Specifies the displayName of the property item.
|value|True|Specifies the value of the property item.
|valueMapping|False|Specifies the valueMapping for the property item. See [here](dx-getstarted-ValueMappingWithIcon.md) on how to define a valueMapping.
|description|False|Specifies the description for the property item.
|action|False|Specifies the action to be taken on clicking the property item. See [here](dx-getstarted-ActionReference.md) for more.
|format|False|Specifies the data format for the property item. See [here](dx-enum-propertiesViewItemReference-format.md) for a list of format types.
|sourceUnits|False|Specifies the source unit for the property item. See [here](dx-enum-propertySourceUnits.md) for a list of source units.
|maximumFractionDigits|False|Specifies the maximum fraction digits for the property item.
|visible|False|When visible is evaluated to *true* then the property item will be displayed, otherwise it will be hidden.  Default value is **true**.
|fx.feature|False|

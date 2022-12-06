<a name="getstarted-capabilitiestab-capabilities"></a>
# getstarted-CapabilitiesTab-capabilities
* [getstarted-CapabilitiesTab-capabilities](#getstarted-capabilitiestab-capabilities)
    * [Definitions:](#getstarted-capabilitiestab-capabilities-definitions)
        * [An array of items, where each item is of the type:](#getstarted-capabilitiestab-capabilities-definitions-an-array-of-items-where-each-item-is-of-the-type)

<a name="getstarted-capabilitiestab-capabilities-definitions"></a>
## Definitions:
<a name="getstarted-capabilitiestab-capabilities-definitions-an-array-of-items-where-each-item-is-of-the-type"></a>
### An array of items, where each item is of the type:
<a name="getstarted-capabilitiestab-capabilities-definitions-an-array-of-items-where-each-item-is-of-the-type-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|title|True|Title of the capability
|description|True|Description for the capability
|icon|True|Specifies the icon for the capability. See [here](dx-iconReference.md) on how to define an icon.
|action|True|Specifies the action to be taken on clicking the capability. See [here](dx-getstarted-ActionReference.md) for more.
|status|False|Specifies the configuration status for the capability. See [here](dx-getstarted-CapabilitiesTab-status.md) for more.
|visible|False|When visible is evaluated to *true* then the capability will be displayed, otherwise it will be hidden.  Default value is **true**.
|fx.feature|False|

<a name="getstarted-actionreference"></a>
# getstarted-ActionReference
* [getstarted-ActionReference](#getstarted-actionreference)
    * [Definitions:](#getstarted-actionreference-definitions)
        * [Option 1](#getstarted-actionreference-definitions-option-1)
        * [Option 2](#getstarted-actionreference-definitions-option-2)
        * [Option 3](#getstarted-actionreference-definitions-option-3)
        * [Option 4](#getstarted-actionreference-definitions-option-4)

<a name="getstarted-actionreference-definitions"></a>
## Definitions:
<a name="getstarted-actionreference-definitions-option-1"></a>
### Option 1
<a name="getstarted-actionreference-definitions-option-1-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|menu|True|Menu Blade item id to navigate to.
|fx.feature|False|
<a name="getstarted-actionreference-definitions-option-2"></a>
### Option 2
<a name="getstarted-actionreference-definitions-option-2-an-object-with-the-following-properties-1"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|blade|True|Provide a Blade reference for the blade to open. <code>blade.extension</code>: extension name,  <code>blade.name</code>: blade name and <code>blade.parameters</code>: parameters to pass into the called blade(optional).
|fx.feature|False|
<a name="getstarted-actionreference-definitions-option-3"></a>
### Option 3
<a name="getstarted-actionreference-definitions-option-3-an-object-with-the-following-properties-2"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|url|True|The URI that will be opened.
|fx.feature|False|
<a name="getstarted-actionreference-definitions-option-4"></a>
### Option 4
<a name="getstarted-actionreference-definitions-option-4-an-object-with-the-following-properties-3"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|resourceId|True|The resource id of the resource blade that will be opened.
|fx.feature|False|

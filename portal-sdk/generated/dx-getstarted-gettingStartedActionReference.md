<a name="getstarted-gettingstartedactionreference"></a>
# getstarted-gettingStartedActionReference
* [getstarted-gettingStartedActionReference](#getstarted-gettingstartedactionreference)
    * [Definitions:](#getstarted-gettingstartedactionreference-definitions)
        * [Option 1](#getstarted-gettingstartedactionreference-definitions-option-1)
        * [Option 2](#getstarted-gettingstartedactionreference-definitions-option-2)
        * [Option 3](#getstarted-gettingstartedactionreference-definitions-option-3)

<a name="getstarted-gettingstartedactionreference-definitions"></a>
## Definitions:
<a name="getstarted-gettingstartedactionreference-definitions-option-1"></a>
### Option 1
<a name="getstarted-gettingstartedactionreference-definitions-option-1-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|menu|True|Menu Blade item id to navigate to.
|displayName|True|Display name for the link
|fx.feature|False|
<a name="getstarted-gettingstartedactionreference-definitions-option-2"></a>
### Option 2
<a name="getstarted-gettingstartedactionreference-definitions-option-2-an-object-with-the-following-properties-1"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|blade|True|Provide a Blade reference for the blade to open. <code>blade.extension</code>: extension name,  <code>blade.name</code>: blade name and <code>blade.parameters</code>: parameters to pass into the called blade(optional).
|displayName|True|Display name for the link
|fx.feature|False|
<a name="getstarted-gettingstartedactionreference-definitions-option-3"></a>
### Option 3
<a name="getstarted-gettingstartedactionreference-definitions-option-3-an-object-with-the-following-properties-2"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|url|True|The URI that will be opened
|displayName|True|Display name for the link
|fx.feature|False|

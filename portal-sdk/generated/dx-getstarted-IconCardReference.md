<a name="getstarted-iconcardreference"></a>
# getstarted-IconCardReference
* [getstarted-IconCardReference](#getstarted-iconcardreference)
    * [Definitions:](#getstarted-iconcardreference-definitions)
        * [An array of items, where each item is of the type:](#getstarted-iconcardreference-definitions-an-array-of-items-where-each-item-is-of-the-type)

<a name="getstarted-iconcardreference-definitions"></a>
## Definitions:
<a name="getstarted-iconcardreference-definitions-an-array-of-items-where-each-item-is-of-the-type"></a>
### An array of items, where each item is of the type:
<a name="getstarted-iconcardreference-definitions-an-array-of-items-where-each-item-is-of-the-type-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|title|True|Title for the card
|description|True|Description for the card
|learnMore|False|LearnMore link shown in the card. See [here](dx-getstarted-LearnMoreLink.md) on how to define a link.
|icon|True|Specifies the icon for the tile. See [here](dx-iconReference.md) on how to define an icon.
|action|True|An array of items or a single item of the [type](dx-getstarted-gettingStartedActionReference.md). Specifies the action to be taken on a card click.
|fx.feature|False|

<a name="getstarted-recommendationstab"></a>
# getstarted-RecommendationsTab
* [getstarted-RecommendationsTab](#getstarted-recommendationstab)
    * [Description](#getstarted-recommendationstab-description)
    * [Definitions:](#getstarted-recommendationstab-definitions)
    * [UI Sample](#getstarted-recommendationstab-ui-sample)
    * [Sample Snippet](#getstarted-recommendationstab-sample-snippet)

<a name="getstarted-recommendationstab-description"></a>
## Description
The Recommendations view is used to show the active Azure Advisor recommendations for the resource.
<a name="getstarted-recommendationstab-definitions"></a>
## Definitions:
<a name="getstarted-recommendationstab-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|kind|True|Enum permitting the value: "Recommendations".
|default|False|If default is true, then set this tab as default tab. Only the first tab with valid default value will be set as default.
|fx.feature|False|
<a name="getstarted-recommendationstab-ui-sample"></a>
## UI Sample
![alt-text](../media/dx/views/RecommendationsTab.png )  
<a name="getstarted-recommendationstab-sample-snippet"></a>
## Sample Snippet
  To add the Recommendations view, add the following example to the properties.tabs section in the [Declarative Resource Overview schema](portalfx-declarative-overview.md#declarative-resource-overview-schema)

```json
{
    "kind": "Recommendations"
}
```


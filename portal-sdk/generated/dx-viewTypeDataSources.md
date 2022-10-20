<a name="viewtypedatasources"></a>
# viewTypeDataSources
* [viewTypeDataSources](#viewtypedatasources)
    * [Definitions:](#viewtypedatasources-definitions)
        * [An array of items, where each item is of the type:](#viewtypedatasources-definitions-an-array-of-items-where-each-item-is-of-the-type)
    * [Sample Snippet](#viewtypedatasources-sample-snippet)

<a name="viewtypedatasources-definitions"></a>
## Definitions:
<a name="viewtypedatasources-definitions-an-array-of-items-where-each-item-is-of-the-type"></a>
### An array of items, where each item is of the type:
<a name="viewtypedatasources-definitions-an-array-of-items-where-each-item-is-of-the-type-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|$propertyDescription|False|
|name|True|
|kind|True|Enum permitting the value: "graph"
|path|True|Specify path for request
|fx.feature|False|
<a name="viewtypedatasources-sample-snippet"></a>
## Sample Snippet
  ### Example dataSources definition and usage

Defining a dataSources:

```json
"dataSources": [
    {
    "kind": "graph",
    "name": "mygraph",
    "path": "v1.0/me?$select=displayName,id,mail"
    }
],
```

Usage of a dataSources:

```json
"name": "[dataSources('mygraph').displayName]"
```


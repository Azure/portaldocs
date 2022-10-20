<a name="viewtypeparameters"></a>
# viewTypeParameters
* [viewTypeParameters](#viewtypeparameters)
    * [Description](#viewtypeparameters-description)
    * [Definitions:](#viewtypeparameters-definitions)
        * [An array of items, where each item is of the type:](#viewtypeparameters-definitions-an-array-of-items-where-each-item-is-of-the-type)
    * [Sample Snippet](#viewtypeparameters-sample-snippet)

<a name="viewtypeparameters-description"></a>
## Description
Declarative views, like any other Portal blade supports parameters. The parameters need to be declared in the parameters section of the view. See the samples below for an example
<a name="viewtypeparameters-definitions"></a>
## Definitions:
<a name="viewtypeparameters-definitions-an-array-of-items-where-each-item-is-of-the-type"></a>
### An array of items, where each item is of the type:
<a name="viewtypeparameters-definitions-an-array-of-items-where-each-item-is-of-the-type-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|name|True|Name of the parameter
|type|False|Type can be <code>key</code>, <code>supplemental</code> or <code>optional</code>. If type is specified as <code>key</code> or <code>supplemental</code>, a corresponding parameter needs to be passed in when the Dx blade is invoked. Otherwise, its optional.
<a name="viewtypeparameters-sample-snippet"></a>
## Sample Snippet
  ### Passing parameters to a Form Blade
```json
{
    "$schema": "../../../Definitions/dx.schema.json",
    "view": {
        "kind": "Form",
        "parameters": [
            {
                "name": "keyParameter",
                "type": "key"
            },
            {
                "name": "optionalParameter",
                "type": "optional"
            }
        ],
        "properties": {
            "title": "FooBar",
            "steps": [
               {
                   "name": "testform",
                   "label": "TestForm",
                   "elements": [
                       {
                            "name": "textBox",
                            "type": "Microsoft.Common.TextBox",
                            "label": "Using Parameters function",
                            "defaultValue": "[parameters('keyParameter')]",
                        }
                   ]
               }
            ],
            "deployment": {
               ....
            }
        }
    }
}
```

When invoking the blade, parameters can be passed into it like any other Portal Blade. Since <code>keyParameter</code> is marked as key, it has to be specified. Specifying <code>optionalParameter</code> is optional.

```typescript
container.openBlade(BladeReferences.forBlade("TestForm_Dx").createReference({
            parameters: {
                keyParameter: "default value for textBox",
                optionalParameter: "some value"
            }
        }))
```
For accessig the passed parameter inside the View, use the <code>parameters</code> function. If an object of the form:
```typescript
    objectName = {
        nestedProperty1: {
            nestedProperty2: <value>,
            ...
        }
        ...
    }
```

 is passed in, use <code>parameters</code> as <code>[parameters('objectName').nestedProperty1.nestedProperty2]</code> to access the value.


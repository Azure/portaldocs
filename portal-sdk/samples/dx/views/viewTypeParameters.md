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

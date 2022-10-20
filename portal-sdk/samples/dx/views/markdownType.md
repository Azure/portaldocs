To add a Markdown, refer to the following examples -

Example of markdown content defined as `markdownContent` in `MyStrings.resjson` file:

```json
{
    "$schema": "../../../Definitions/dx.schema.json",
    "stringSource": "../Resources/MyStrings.resjson",
    "view": {
        "kind": "Markdown",
        "parameters": [
            {
                "name": "image",
                "type": "optional"
            }
        ],
        "export": true,
        "properties": {
            "content": {
                "property": "markdownContent"
            }
        }
    }
}
```

Example of markdown string in the `content` property:

```json
{
    "$schema": "../../../Definitions/dx.schema.json",
    "stringSource": "../Resources/MyStrings.resjson",
    "view": {
        "kind": "Markdown",
        "parameters": [
            {
                "name": "image",
                "type": "optional"
            }
        ],
        "export": true,
        "properties": {
            "content": "Example markdown text illustrating *italic* and **bold**."
        }
    }
}
```

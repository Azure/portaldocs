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

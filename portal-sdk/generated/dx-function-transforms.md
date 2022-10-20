<a name="transforms"></a>
# Transforms

- Applies to ArmApiControl, GraphApiControls and Form.Deployment.OnSubmit

- Use JMESPath expression to transform response JSON into the right format
```json
{
    "request": {
        "method": "GET",
        "path": "[steps('botAppId').lookupApp.computeLookupUrl]",
        "transforms": {
            "list": "value|[*].{label:displayName, value:appId, description:appId}"
        }
    }
}
```

- The rest call returns OData json like
```json
{
    "value": [
        {
            "displayName": "foo",
            "appId": "{some_guid}",
             "objectId": "{some_other_guid}"
        },
        ...
    ]
}
```

- We specify 'list' transform to map it the following json that can be used for allowedValues constraints
```json
[
    {"label": "foo", "value": "{some_guid}", "description": "{some_guid}"},
    ...
]
```

- The dropdown control then referenced the result result of transform as
```json
{
    "allowedValues": "[steps('setpName').queryApi.transformed.list]"
}
```

- This is easier to write and read than lambda function.
```json

    "condition": "[greater(length(parameters('name')), 0)]",
    "request": {
        "method": "GET",
        "path": "/beta/myorganization/applications?filter=startsWith(displayName, 'a')&select=displayName,appId",
        "transforms": {
            "list": "value|[*].{label:displayName, value:appId, description:appId}"
        }
    }
```

```json
{
        "name": "callGraph",
        "type": "Microsoft.Solutions.GraphApiControl",
        "request": {
            "method": "GET",
            "path": "/beta/myorganization/applications?filter=startsWith(displayName, 'a')&select=displayName,appId",
            "transforms": {
                "list": "value|[*].{label:displayName, value:appId, description:appId}"
            }
        }
    },
    {
        "name": "userName",
        "type": "Microsoft.Common.DropDown",
        "label": "User info",
        "multiLine": true,
        "constraints": {
            "required": true,
            "allowedValues": "[coalesce(steps('controls').callGraph.transformed.list, parse('[]'))]"
        }
    }
```

```json
    {
        "name": "callGraph2",
        "type": "Microsoft.Solutions.GraphApiControl",
        "request": {
            "method": "GET",
            "path": "/beta/myorganization/applications?filter=startsWith(displayName, 'a')&select=displayName,appId",
            "transforms": {
                "list": {
                    "jmesPath": "value|[*].{label:displayName, value:appId, description:appId}",
                    "propertyMappings": [
                        {
                            "property": "label",
                            "valueMapping": [
                                {
                                    "value": "astf4",
                                    "displayName": "Test astf4"
                                },
                                {
                                    "value": "adelete1",
                                    "displayName": "Test adelete1"
                                }
                            ]
                        },
                        {
                            "property": "description",
                            "valueMapping": [
                                {
                                    "value": "512628f9-3682-4a1d-a7a8-f5931f9c575f",
                                    "displayName": "Test 512628f9-3682-4a1d-a7a8-f5931f9c575f"
                                },
                                {
                                    "value": "0d30f29a-9785-466d-8273-f07699ef7bfc",
                                    "displayName": "Test 0d30f29a-9785-466d-8273-f07699ef7bfc"
                                }
                            ]
                        }
                    ]
                }
            }
        }
    },
{
    "name": "userName2",
    "type": "Microsoft.Common.DropDown",
    "label": "User info 2",
    "multiLine": true,
    "constraints": {
        "required": true,
        "allowedValues": "[coalesce(steps('controls').callGraph2.transformed.list, parse('[]'))]"
    }
}
```

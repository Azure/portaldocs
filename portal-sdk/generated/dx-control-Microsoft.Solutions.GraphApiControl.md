<a name="microsoft-solutions-graphapicontrol"></a>
# Microsoft.Solutions.GraphApiControl
* [Microsoft.Solutions.GraphApiControl](#microsoft-solutions-graphapicontrol)
    * [Description](#microsoft-solutions-graphapicontrol-description)
    * [Definitions:](#microsoft-solutions-graphapicontrol-definitions)
    * [Sample Snippet](#microsoft-solutions-graphapicontrol-sample-snippet)

<a name="microsoft-solutions-graphapicontrol-description"></a>
## Description
GraphApiControl is a RESTful web API that enables you to access Microsoft Cloud service resources. 
<a name="microsoft-solutions-graphapicontrol-definitions"></a>
## Definitions:
<a name="microsoft-solutions-graphapicontrol-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|name|True|Name of the instance
|type|True|Enum permitting the value: "Microsoft.Solutions.GraphApiControl"
|condition|False|If condition is true, evaluate and execute
|request|True|define HTTP request: <br>1) request.method only can call "GET" method. <br>2) request.path is path to specify <br>3) request.transform is the output displayed after transforming data.
|fx.feature|False|
<a name="microsoft-solutions-graphapicontrol-sample-snippet"></a>
## Sample Snippet
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

## Sample output
  
## callGraph output (actual value might be different: shorten value array & modified appId)

```json
{
    "@odata.context": "https://graph.microsoft.com/beta/$metadata#applications(displayName,appId)",
    "@odata.nextLink": "https://graph.microsoft.com/beta/myorganization/applications?filter=startsWith(displayName%2c+%27a%27)&select=displayName%2cappId&$skiptoken=RFNwdAoAAQAAAAAAAAAAFAAAAAKm5DQv4BdLqamgIFkbbkIBAAAAAAAAAAAAAAAAAAAXMS4yLjg0MC4xMTM1NTYuMS40LjIzMzEGAAAAAAABTw8AYx5Ec0iWsOnZnC1p5QEaAAAAAQQAAAA",
    "value": [
        {
            "displayName": "astf4",
            "appId": "518f9-3682-434d-a7a8-f5931f945f"
        },
        {
            "displayName": "Add an application my organization is developing",
            "appId": "3a44535342-8288-4535-94342-5cf34535"
        },
        {
            "displayName": "adelete1",
            "appId": "563a-9785-466d-8273-f073254c"
        }
    ]
}
```

## callGraph2 output (actual value might be different: shorten value array  & modified appId)

```json
{
    "@odata.context": "https://graph.microsoft.com/beta/$metadata#applications(displayName,appId)",
    "@odata.nextLink": "https://graph.microsoft.com/beta/myorganization/applications?filter=startsWith(displayName%2c+%27a%27)&select=displayName%2cappId&$skiptoken=RFNwdAoAAQAAAAAAAAAAFAAAAIp1HJXa4DBEtkF0BYnTinsBAAAAAAAAAAAAAAAAAAAXMS4yLjg0MC4xMTM1NTYuMS40LjIzMzEGAAAAAAABTw8AYx5Ec0iWsOnZnC1p5QEaAAAAAQQAAAA",
    "value": [
        {
            "displayName": "astf4",
            "appId": "512628f9-3682-4a1d-43242a7a8-f575f"
        },
        {
            "displayName": "Add an application my organization is developing",
            "appId": "3a4a2-8288-4d23437f-9bde-7f8864"
        },
        {
            "displayName": "AwasaConfig",
            "appId": "30125bcb-9b20-4c30-a0bb-95177d"
        },
        {
            "displayName": "AMPAlert",
            "appId": "3fd7-741e-42f7-91b0-e5f0645354"
        }
    ]
}
```


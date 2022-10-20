<a name="microsoft-solutions-armapicontrol"></a>
# Microsoft.Solutions.ArmApiControl
* [Microsoft.Solutions.ArmApiControl](#microsoft-solutions-armapicontrol)
    * [Description](#microsoft-solutions-armapicontrol-description)
    * [Guidance](#microsoft-solutions-armapicontrol-guidance)
    * [Definitions:](#microsoft-solutions-armapicontrol-definitions)
    * [Sample Snippet](#microsoft-solutions-armapicontrol-sample-snippet)

<a name="microsoft-solutions-armapicontrol-description"></a>
## Description
ArmApiControl lets you get results from an Azure Resource Manager API operation. Use the results to populate dynamic content in other controls.
<a name="microsoft-solutions-armapicontrol-guidance"></a>
## Guidance
- The <code>request.method</code> property specifies the HTTP method. Only <code>GET</code> or <code>POST</code> are allowed.

- The <code>request.path property</code> specifies a URL that must be a relative path to an ARM endpoint. It can be a static path or can be constructed dynamically by referring output values of the other controls.

- For example, an ARM call into <code>Microsoft.Network/expressRouteCircuits</code> resource provider:

```json
"path": "subscriptions/<subid>/resourceGroup/<resourceGroupName>/providers/Microsoft.Network/expressRouteCircuits/<routecircuitName>/?api-version=2020-05-01"
```

- The <code>request.body</code> property is optional. Use it to specify a JSON body that is sent with the request. The body can be static content or constructed dynamically by referring to output values from other controls.
 
<a name="microsoft-solutions-armapicontrol-definitions"></a>
## Definitions:
<a name="microsoft-solutions-armapicontrol-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|name|True|Name of the instance.
|type|True| Enum permitting the  value: "Microsoft.Solutions.ArmApiControl".
|condition|False|Use condition property to control when REST API will be made. Value be an expression or boolean
|request|True|See [here](dx-Microsoft.Solutions.ArmApiControl-request.md) for more on the request property.
|fx.feature|False|
<a name="microsoft-solutions-armapicontrol-sample-snippet"></a>
## Sample Snippet
  In the following example, the <code>providersApi</code> element calls an API to get an array of provider objects.

The <code>allowedValues</code> property of the <code>providersDropDown</code> element is configured to get the names of the providers. It displays them in the dropdown list.

```json
{
    "name": "providersApi",
    "type": "Microsoft.Solutions.ArmApiControl",
    "request": {
        "method": "GET",
        "path": "[concat(subscription().id, '/providers/Microsoft.Network/expressRouteServiceProviders?api-version=2019-02-01')]"
    }
},
{
    "name": "providerDropDown",
    "type": "Microsoft.Common.DropDown",
    "label": "Provider",
    "toolTip": "The provider that offers the express route connection.",
    "constraints": {
        "allowedValues": "[map(steps('settings').providersApi.value, (item) => parse(concat('{\"label\":\"', item.name, '\",\"value\":\"', item.name, '\"}')))]",
        "required": true
    },
    "visible": true
}
```

<a name="microsoft-solutions-armapicontrol-sample-snippet-name-validation-usng-arm-api-control-textbox"></a>
#### Name validation usng Arm API Control + TextBox
```json

"steps": [
    {
        "name": "basics",
        "label": "Basics",
        "elements": [
            {
                "name": "resourceScope",
                "type": "Microsoft.Common.ResourceScope"
            },
            {
                "name": "checkNameAvailabilityApi",
                "type": "Microsoft.Solutions.ArmApiControl",
                "request": {
                    "method": "POST",
                    "path": "[concat(steps('basics').resourceScope.subscription.id, '/providers/Microsoft.CognitiveServices/checkDomainAvailability?api-version=2017-04-18')]",
                    "body": "[parse(concat('{\"subDomainName\":', string(steps('basics').accountName), ',\"type\": \"Microsoft.CognitiveServices/accounts\"}'))]"
                }
            },
            {
                "name": "accountName",
                "type": "Microsoft.Common.TextBox",
                "label": "Name",
                "defaultValue": "",
                "toolTip": "Test tooltip",
                "constraints": {
                    "required": true,
                    "validations": [
                        {
                            "isValid": "[or(equals(string(steps('basics').checkNameAvailabilityApi.isSubdomainAvailable), 'true'), not(contains(steps('basics').checkNameAvailabilityApi, 'isSubdomainAvailable')))]",
                            "message": "The sub-domain name is already used. Please pick a different name."
                        },
                        {
                            "regex": "^[a-z0-9A-Z][a-z0-9A-Z-_]{0,62}[a-z0-9A-Z]$",
                            "message": "Only alphanumeric characters, underscores and hyphens are allowed, and the value must be 2-64 characters long."
                        }
                    ]
                },
                "visible": true
            }
        ]
    }
]
```

<a name="microsoft-solutions-armapicontrol-sample-snippet-armapicontrol-dropdown"></a>
#### ArmApiControl + DropDown

```json
"steps": [
    {
        "name": "basics",
        "label": "Basics",
        "elements": [
            {
                "name": "resourceScope",
                "type": "Microsoft.Common.ResourceScope"
            },
            {
                "name": "providersApi",
                "type": "Microsoft.Solutions.ArmApiControl",
                "request": {
                    "method": "GET",
                    "path": "[concat(steps('basics').resourceScope.subscription.id, '/providers/Microsoft.Network/expressRouteServiceProviders?api-version=2019-02-01')]"
                }
            },
            {
                "name": "providerDropDown",
                "type": "Microsoft.Common.DropDown",
                "label": "Provider",
                "placeholder": "Select a provider",
                "toolTip": "The ISP that will be providing the express route connection",
                "constraints": {
                    "allowedValues": "[map(steps('basics').providersApi.value, (item) => parse(concat('{\"label\":\"', item.name, '\",\"value\":\"', item.name, '\"}')))]",
                    "required": true
                },
                "visible": true
            }
        ]
    }
]
```


<a name="microsoft-solutions-armapicontrol-sample-snippet-jmespath-transform-for-rest-api-result"></a>
#### JMESPath transform for REST api result

Use [JMESPath](https://jmespath.org/) expression to transform response JSON into the right format

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
See [here](dx-function-transforms.md) for more on transforms.

<a name="microsoft-solutions-armapicontrol-sample-snippet-multiple-dropdown-filtering"></a>
#### Multiple dropdown filtering

```json
{
    "$schema": "<relative path to dx.schema.json>",
    "view": {
        "kind": "Form",
        "properties": {
            "title": "Test Form View",
            "steps": [
                {
                    "name": "basics",
                    "label": "Basics",
                    "elements": [
                        {
                            "name": "resourceScope",
                            "type": "Microsoft.Common.ResourceScope"
                        }
                    ]
                },
                {
                    "name": "settings",
                    "label": "Settings",
                    "elements": [
                        {
                            "name": "providersApi",
                            "type": "Microsoft.Solutions.ArmApiControl",
                            "request": {
                                "method": "GET",
                                "path": "[concat(steps('basics').resourceScope.subscription.id,'/providers/Microsoft.Network/expressRouteServiceProviders?api-version=2019-02-01')]"
                            }
                        },
                        {
                            "name": "circuitName",
                            "type": "Microsoft.Common.TextBox",
                            "label": "Circuit name",
                            "defaultValue": "TestFaceAccount",
                            "toolTip": "The name must begin with a letter or number, end with a letter, number or underscore, and may contain only letters, numbers, underscores, periods, or hyphens.",
                            "constraints": {
                                "required": true
                            },
                            "visible": true
                        },
                        {
                            "name": "providerDropDown",
                            "type": "Microsoft.Common.DropDown",
                            "label": "Provider",
                            "toolTip": "The ISP that will be providing the express route connection",
                            "constraints": {
                                "allowedValues": "[map(steps('settings').providersApi.value,(item) => parse(concat('{\"label\":\"',item.name,'\",\"value\":\"',item.name,'\"}')))]",
                                "required": true
                            },
                            "visible": true
                        },
                        {
                            "name": "peeringLocationDropdown",
                            "type": "Microsoft.Common.DropDown",
                            "label": "Peering locations",
                            "toolTip": "The location where the ISP will provision the connection",
                            "constraints": {
                                "allowedValues": "[map(first(map(filter(steps('settings').providersApi.value,(entry) => equals(entry.name,steps('settings').providerDropDown)),(item) => item.properties.peeringLocations)),(plocation) => parse(concat('{\"label\":\"',plocation,'\",\"value\":\"',plocation,'\"}')))]",
                                "required": true
                            },
                            "visible": true
                        },
                        {
                            "name": "bandwidthDropdown",
                            "type": "Microsoft.Common.DropDown",
                            "label": "Bandwidth",
                            "toolTip": "The maximum bandwidth for the provisioned connection",
                            "constraints": {
                                "allowedValues": "[map(first(map(filter(steps('settings').providersApi.value,(entry) => equals(entry.name,steps('settings').providerDropDown)),(item) => item.properties.bandwidthsOffered)),(bandwidth) => parse(concat('{\"label\":\"',bandwidth.offerName,'\",\"value\":\"',string(bandwidth.valueInMbps),'\"}')))]",
                                "required": true
                            },
                            "visible": true
                        },
                        {
                            "name": "skuTier",
                            "type": "Microsoft.Common.OptionsGroup",
                            "label": "SKU",
                            "defaultValue": "Standard",
                            "toolTip": "Premium provides support for more than 4K routes, ability to connect to more than 10 virtual networks, and global connectivity. Premium also gives you access to your services deployed worldwide.",
                            "constraints": {
                                "allowedValues": [
                                    {
                                        "label": "Standard",
                                        "value": "Standard"
                                    },
                                    {
                                        "label": "Premium",
                                        "value": "Premium"
                                    }
                                ],
                                "required": true
                            },
                            "visible": true
                        },
                        {
                            "name": "skuFamily",
                            "type": "Microsoft.Common.OptionsGroup",
                            "label": "Billing model",
                            "defaultValue": "Unlimited",
                            "toolTip": "All inbound data transfer is free of charge. Unlimited provides outbound data transfer for a single fixed monthly fee while metered provides outbound data transfer for a pre-determined rate.",
                            "constraints": {
                                "allowedValues": [
                                    {
                                        "label": "Unlimited",
                                        "value": "UnlimitedData"
                                    },
                                    {
                                        "label": "Metered",
                                        "value": "MeteredData"
                                    }
                                ],
                                "required": true
                            },
                            "visible": true
                        },
                        {
                            "name": "allowClassicOperations",
                            "type": "Microsoft.Common.OptionsGroup",
                            "label": "Allow classic operations",
                            "defaultValue": "No",
                            "toolTip": "Allow the circuit to interact with classic (RDFE) resources. Use this setting if you plan to connect to resources deployed in the classic model.",
                            "constraints": {
                                "allowedValues": [
                                    {
                                        "label": "Yes",
                                        "value": "true"
                                    },
                                    {
                                        "label": "No",
                                        "value": "false"
                                    }
                                ],
                                "required": true
                            },
                            "visible": true
                        }
                    ]
                }
            ],
            "deployment": {
                "parameters": {
                    "circuitName": "[steps('settings').circuitName]",
                    "serviceProviderName": "[steps('settings').providerDropDown]",
                    "peeringLocation": "[steps('settings').peeringLocationDropdown]",
                    "bandwidthInMbps": "[steps('settings').bandwidthDropdown]",
                    "location": "[steps('basics').resourceScope.location.name]",
                    "sku_tier": "[steps('settings').skuTier]",
                    "sku_family": "[steps('settings').skuFamily]",
                    "allowClassicOperations": "[steps('settings').allowClassicOperations]"
                },
                "kind": "ResourceGroup",
                "location": "[steps('basics').resourceScope.location.name]",
                "resourceGroupId": "[steps('basics').resourceScope.resourceGroup.id]",
                "template": {
                    "file": "<ARM deployment template relative path>"
                }
            }
        }
    }
}
```

<a name="microsoft-solutions-armapicontrol-sample-snippet-request-body"></a>
#### Request Body
```json
{
    "request": {
        "method": "POST",
        "path": "providers/Microsoft.BotService/checkNameAvailability?api-version=2018-07-12",
        "body": {
            "type": "",
            "name": "[steps('basics').botId]"
        }
    }
}
```

<a name="microsoft-solutions-armapicontrol-sample-snippet-conditional-rest-call"></a>
#### Conditional REST call

Use <kbd>condition</kbd> property to control when REST API will be made. For best result, combine this with
async validation

```json
{
    "name": "botIdCheck",
    "type": "Microsoft.Solutions.ArmApiControl",
    "condition": "[greater(length(steps('basics').botId), 0)]",
    "request": {
        "method": "POST",
        "path": "providers/Microsoft.BotService/checkNameAvailability?api-version=2018-07-12",
        "body": {
            "type": "",
            "name": "[steps('basics')botId]"
        }
    }
}
```

<a name="microsoft-solutions-armapicontrol-sample-snippet-conditional-rest-call-async-validation"></a>
##### Async validation

For validation that uses REST call, use the <kbd>await</kbd> below to construct async validation logic.

```json
{
    "validations": [
        {
            "skip": "[equals(0, length(steps('basics').resourceName))]",
            "await": "[basics('botIdCheck').done]",
            "isValid": "[equals('botIdCheck').valid, true)]"
        }
    ]
}
```


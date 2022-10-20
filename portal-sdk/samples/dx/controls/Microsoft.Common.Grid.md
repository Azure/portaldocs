
## First Example -simple
```json
{
    "type": "Microsoft.Common.Grid",
    "name": "fooGrid",
    "label": {
        "summary": "Attached Foo's",
        "addition": "Add Foo",
        "delete": "Delete",
        "ariaLabel": "Grid for providing Foo information"
    },
    "addBlade": {
        "name": "FormWithOutputs_Dx",
        "extension": "tsextension",
        "parameters": {
            "title": "Add Foo"
        },
        "outputItem": "output",
        "inContextPane": true
    },
    "editBlade": {
        "name": "FormWithOutputs_Dx",
        "extension": "tsextension",
        "parameters": {
            "name": "[$item.name]",
            "region": "[$item.region]",
            "title": "Edit Foo"
        },
        "outputItem": "output",
        "inContextPane": true
    },
    "defaultValue": [
        {
            "name": "resource1",
            "region": "East US",
            "state": "on",
            "note": "Lorem ipsum"
        }
    ],
    "constraints": {
        "width": "Full",
        "canEditRows": true,
        "validations": [
            {
                "isValid": "[lessOrEquals(length(filter(steps('grid').fooGrid, (element) => equals(element.state, 'on'))), 2)]",
                "message": "A maximum of 2 Foo's may be set to 'On'"
            }
        ],
        "rows": {
            "count": {
                "min": 1,
                "max": 10
            }
        },
        "columns": [
            {
                "id": "name",
                "header": "Name",
                "width": "1fr",
                "cellType": "readonly",
                "text": "[$item.name]"
            },
            {
                "id": "region",
                "header": "Region",
                "width": "1fr",
                "cellType": "readonly",
                "text": "[$item.region]"
            },
            {
                "id": "state",
                "header": "State",
                "width": "1fr",
                "cellType": "input",
                "element": {
                    "type": "Microsoft.Common.OptionsGroup",
                    "defaultValue": "On",
                    "constraints": {
                        "allowedValues": [
                            {
                                "label": "On",
                                "value": "on"
                            },
                            {
                                "label": "Off",
                                "value": "off"
                            }
                        ],
                        "required": true
                    }
                }
            },
            {
                "id": "note",
                "header": "Note",
                "width": "2fr",
                "cellType": "input",
                "element": {
                    "type": "Microsoft.Common.TextBox",
                    "placeholder": "Jot something down",
                    "constraints": {
                        "required": true,
                        "validations": [
                            {
                                "regex": "^[a-z0-9A-Z]{1,30}$",
                                "message": "Only alphanumeric characters are allowed, and the value must be 1-30 characters long."
                            },
                            {
                                "isValid": "[or(contains($item.note, 'e'), contains($item.note, 'E'))]",
                                "message": "Use the letter 'e' in your note, please."
                            }
                        ]
                    }
                }
            }
        ]
    }
}
```

## Second Example

```json
{
    "type": "Microsoft.Common.Grid",
    "name": "aadGrid",
    "label": {
        "addition": "Add AAD-Based User",
        "delete": "Delete",
        "summary": "AAD-Based User(s)"
    },
    "defaultValue": [
        {
            "id": "[dataSources('graph').id]",
            "ledgerRoleName": "Administrator",
            "displayName": "[dataSources('graph').displayName]",
            "mail": "[dataSources('graph').mail]"
        }
    ],
    "addBlade": {
        "extension": "Microsoft_AAD_IAM",
        "name": "ObjectPickerBlade",
        "parameters": {
            "title": "addAadLabel",
            "disabledObjectIds": "[map(steps('security').aadGrid,(element)=>element.id)]",
            "queries": 1
        },
        "outputItem": "selectedObjects",
        "inContextPane": true
    },
    "constraints": {
        "width": "Full",
        "canEditRows": false,
        "columns": [
            {
                "id": "displayName",
                "header": "Name",
                "cellType": "readonly",
                "text": "[$item.displayName]"
            },
            {
                "id": "mail",
                "header": "Email",
                "cellType": "readonly",
                "text": "[$item.mail]"
            },
            {
                "id": "ledgerRoleName",
                "header": "Ledger Role",
                "cellType": "input",
                "element": {
                    "type": "Microsoft.Common.DropDown",
                    "constraints": {
                        "allowedValues": [
                            {
                                "label": "readerLabel",
                                "value": "Reader"
                            },
                            {
                                "label": "contributorLabel",
                                "value": "Contributor"
                            },
                            {
                                "label": "administratorLabel",
                                "value": "Administrator"
                            }
                        ],
                        "required": true
                    }
                }
            }
        ],
        "rows": {
            "count": {
                "min": 1,
                "max": 3
            }
        },
        "validations": [
            {
                "isValid": "[contains(map(steps('security').aadGrid,(element)=>element.ledgerRoleName),'Administrator')]",
                "message": "Must include at least one AAD-based user with the role of Administrator."
            }
        ]
    }
}
```

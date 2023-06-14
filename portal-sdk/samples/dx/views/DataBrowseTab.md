To add the DataBrowse view, add the following example to the properties.tabs section in the [Declarative Resource Overview schema](portalfx-declarative-overview.md#declarative-resource-overview-schema)


Example for static array data source.

```json
{
    "kind": "DataBrowse",
    "displayName": "Data browse",
    "ariaLabel": "Data browse",
    "data": [
        {
            "diskSize": 100,
            "price": 100,
            "displayName": "a",
            "creationTime": "2021-03-23T21:24:47.7856737Z"
        },
        {
            "diskSize": 10000,
            "price": 10000,
            "displayName": "b",
            "creationTime": "2021-04-24T21:24:47.7856737Z"
        },
        {
            "diskSize": 1500,
            "price": 1500,
            "displayName": "c",
            "creationTime": "2021-05-25T21:24:47.7856737Z"
        }
    ],
    "columns": [
        {
            "displayName": "Disk Size",
            "name": "diskSize",
            "format": "Number",
            "sourceUnits": "Gigabytes",
            "maximumFractionDigits": 2
        },
        {
            "displayName": "Price",
            "name": "price"
        },
        {
            "displayName": "Display Names",
            "name": "displayName"
        },
        {
            "displayName": "Creation time",
            "name": "creationTime",
            "format": "Date"
        }
    ]
}
```

Example for resources() data source, the output for resources().resources must be an array.

```json
{
    "kind": "DataBrowse",
    "displayName": "Data browse",
    "ariaLabel": "Data browse",
    "data": "[resources().resources]",
    "columns": [
        {
            "displayName": "Name",
            "name": "name"
        },
        {
            "displayName": "VM Type",
            "name": "type"
        },
        {
            "displayName": "Location",
            "name": "location"
        }
    ]
}
```

Example for icon and link support.

```json
{
	"kind": "DataBrowse",
	"displayName": "Data browse",
	"ariaLabel": "testing",
	"data": [
		{
			"name": "resourceName1",
			"id": "/subscriptions/{subscription}/resourcegroups/{resourcegroup}/providers/{provider}/{resourceType}/{resourceName}",
			"status": "Succeeded",
			"menu": "tags",
			"urlText": "Azure portal",
			"urlAction": {
				"url": "https://azure.microsoft.com/"
			},
			"parameters": {
				"title": "resourceName1"
			}
		},
		{
			"name": "resourceName2",
			"id": "/subscriptions/{subscription}/resourcegroups/{resourcegroup}/providers/{provider}/{resourceType}/{resourceName}",
			"status": "Warning",
			"menu": "properties",
			"urlText": "Microsoft",
			"urlAction": {
				"url": "https://www.microsoft.com/en-us/"
			},
			"parameters": {
				"title": "resourceName2"
			}
		},
		{
			"name": "resourceName3",
			"id": "/subscriptions/{subscription}/resourcegroups/{resourcegroup}/providers/{provider}/{resourceType}/{resourceName}",
			"status": "Failed",
			"menu": "locks",
			"urlText": "Github",
			"urlAction": {
				"url": "https://github.com/"
			},
			"parameters": {
				"title": "resourceName3"
			}
		}
	],
	"columns": [
		{
			"displayName": "Name",
			"name": "name",
			"action": {
				"resourceId": "[$item.id]"
			}
		},
		{
			"displayName": "Status",
			"name": "status",
			"valueMapping": [
				{
					"value": "Succeeded",
					"displayName": "Succeeded",
					"icon": "MsPortalFx.Base.Images.StatusBadge.Outline.Success"
				},
				{
					"value": "Warning",
					"displayName": "Warning",
					"icon": "MsPortalFx.Base.Images.StatusBadge.Outline.Warning"
				},
				{
					"value": "Failed",
					"displayName": "Failed",
					"icon": "MsPortalFx.Base.Images.StatusBadge.Outline.Failed"
				}
			]
		},
		{
			"displayName": "Menu",
			"name": "menu",
			"action": {
				"menu": "[$item.menu]"
			}
		},
		{
			"displayName": "Url",
			"name": "urlText",
			"action": {
				"url": "[$item.urlAction.url]"
			}
		},
		{
			"displayName": "Blade",
			"name": "name",
			"action": {
				"blade": {
					"name": "A blade name",
					"extension": "An extension name",
					"parameters": "[$item.parameters]",
					"inContextPane": true
				}
			}
		}
	]
}
```

Example for transforms and inputs

```json
{
    "kind": "DataBrowse",
    "displayName": "Data browse",
    "ariaLabel": "testing",
    "data": {
        "transforms": "[concat('[', '@.{caching:caching, createOption: createOption, name: name, osType:osType, managedDisk:managedDisk.to_string(@)}', ']')]",
        "input": "[resources().properties.storageProfile.osDisk]"
    }
}
```

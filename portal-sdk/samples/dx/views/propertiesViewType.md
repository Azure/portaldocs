## Properties definition samples

### Grouping

- Properties view is made up of groupings of property items
- A link to open a resource menu item, on click of the group display name, can be optionally configured. The `action.menu` referenced must exists for this action to work. If the `action` is configured, the group display name will render as a clickable link.
- Icon can be optionally configured. For complete list of supported icons, go to [icon enum](./dx-enum-svgEnum.md).
- Property items are added to the `items` array to be rendered under the same group
```json
{
    "displayName": "Disk",
    "icon": "MsPortalFx.Base.Images.Polychromatic.Discs",
    "action": {
        "menu": "disk"
    },
    "items": [
    ]
}
```

### Resources and Datasources

Property values of a resource are often available at runtime.  In order to access these runtime data, the Properties view allows two types of GET operations

#### ARM Request

The `resources` is an array of ARM GET Request, which are executed when the Properties view is loaded. To define ARM Request, provide a valid ResourceID (id) and apiVersion.  You can have an array of ARM Request which is distinguishable with the `name` property
```json
"resources": [
    {
        "id": "[parameters('id')]",
        "apiVersion": "2020-06-01"
    },
    {
        "name": "vmInstanceView",
        "id": "[concat(parameters('id'), '?$expand=instanceView')]",
        "apiVersion": "2021-03-01"
    }
]
```
Example of referencing the response of the ARM Request
```json
{
    "displayName": "Disk Size",
    "value": "[resources().properties.storageProfile.osDisk.diskSizeGB]",
    "sourceUnits": "Gigabytes",
    "maximumFractionDigits": 2
}
{
    "displayName": "Visible if VM running",
    "value": "[resources('vmInstanceView').properties.instanceView.statuses.1.displayStatus]",
    "visible": "[equals(resources('vmInstanceView').properties.instanceView.statuses.1.code, 'PowerState/running')]"
}
```

#### Azure Active Directory Resource Graph Request

The `dataSources` is an array of Resource Graph GET Request, which are executed when the Properties view is loaded. To define Resource Graph request, provide a valid Resource Graph query in the `path` property.  You can have an array of Resource Graph request which is distinguishable with the `name` property. Go [here](https://developer.microsoft.com/en-us/graph/graph-explorer) for help with Resource Graph query. Only Applications and Users queries are supported.

```json
"dataSources": [
    {
        "kind": "graph",
        "name": "graph",
        "path": "v1.0/me?$select=displayName,id,mail"
    }
],
```json

Example of referencing the response of the Resource Graph Request

```json
"name": "[dataSources('graph').displayName]"
```

### Property Items

#### Actions

URL action - Enables clickable `url` that opens in a new browser window
```json
{
    "displayName": "Azure portal",
    "value": "https://azure.microsoft.com/",
    "action": {
        "url": "https://azure.microsoft.com/"
    }
}
```

Resource action - Enables clickable link that opens the Resource Overview for the specified `resourceId`
```json
{
    "displayName": "Open a resource",
    "value": "Resource name",
    "action": {
        "resourceId": "/subscriptions/{subscription}/resourcegroups/{resourcegroup}/providers/{provider}/{resourceType}/{resourceName}"
    }
}
```
Blade action - Enables clickable link that opens an Azure Portal blade defined by `blade` property
```json
{
    "displayName": "Open a blade",
    "value": "Blade name",
    "action": {
        "blade": {
            "name": "A blade name",
            "extension": "An extension name",
            "parameters": {
                "resId": "[resources().id]"
            }
        }
    }
}
```

Menu action - Enables clickable link that opens a menu item as defined by `action.menu`.  The menu must exists in the menu definition.
```json
{
    "displayName": "Open a menu",
    "value": "Tags",
    "action": {
        "menu": "tags"
    }
}
```

#### valueMapping

- valueMapping enables localization of the display name for the Property definition
- valueMapping allows multiple `displayName` to be used for a single Property definition where the `valueMapping.displayName` is displayed in the UI when `valueMapping.value` matches the `value` of the property
- valueMapping also supports displaying seperate `icon` types for each `valueMapping`.  For complete list of supported icons, go to [icon enum](./dx-enum-svgEnum.md).
```json
{
    "displayName": "Provisioning State",
    "value": "[resources().properties.provisioningState]",
    "description": "This is provisioning state.",
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
}
```

#### Format

Secret - display the content in asterisks (*)
```json
{
    "displayName": "Key",
    "value": "[resources().id]",
    "format": "Secret"
}
```
Date - display the content as date value
```json
{
    "displayName": "Creation time",
    "value": "2021-03-23T21:24:47.7856737Z",
    "format": "Date"
}
```

#### SourceUnit

- All supported [source unit enums](./dx-enum-propertySourceUnits.md)
- Use `maximumFractionDigits` to set the number of decimal digits to display
```json
{
    "displayName": "Disk Size",
    "value": "[resources().properties.diskSize]",
    "sourceUnits": "Gigabytes",
    "maximumFractionDigits": 2
}
```

#### Visibility

- Visibility of the property item can be used to show/hide the property item
- If the `visible` property is set to **true** then the property item will show; otherwise, it will not be visible.  Default is **true**.
```json
{
    "displayName": "Visible if VM running",
    "value": "[resources('vmInstanceView').properties.instanceView.statuses.1.displayStatus]",
    "visible": "[equals(resources('vmInstanceView').properties.instanceView.statuses.1.code, 'PowerState/running')]"
}
```

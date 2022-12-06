
The Declarative Resource Overview blade includes the following sections:

1. Command bar - Define actions for your resource
2. Essentials - Display key properties of your resource
3. Views - Display key information of your resource


<a name="getting-started-with-declarative-resource-overview-blade"></a>
## Getting started with Declarative Resource Overview blade

Below is an example the Declarative Resource Overview blade schema, as defined by the `GetStarted` kind. The `resources` section takes an ARM `id` and `apiVersion`, which in turn makes a ARM GET request to retrieve the resource details.  You can use the `resources()` function to retrieve the resource payload at runtime.


<a name="getting-started-with-declarative-resource-overview-blade-declarative-resource-overview-schema"></a>
##### Declarative Resource Overview schema
<a name="resourceoverviewschema"></a>
```json
{
  "$schema": "../../Definitions/dx.schema.json",
  "stringSource": "Resources/MyStrings.resjson",
  "view": {
    "kind": "GetStarted",
    "export": true,
    "parameters": [
      {
        "name": "id",
        "type": "key"
      }
    ],
    "resources": [
      {
        "id": "[parameters('id')]",
        "apiVersion": "2014-04-01"
      }
    ],
    "essentials": {},
    "commands": [],
    "properties": {
        "title": "title",
        "tabs": []
    }
  }
}
```
The `essentials` section defines what is rendered in Essentials.  The `commands` section defines the Commands in the command bar.  The `properties` section defines the tabbed Views to be rendered (under Essentials).  See below for an illustration.

<a name="getting-started-with-declarative-resource-overview-blade-list-of-supported-tabs"></a>
### List of Supported Tabs
- [Getting Started](dx-getstarted-GetStartedTab.md)
- [Properties](dx-getstarted-PropertiesTab.md)
- [Monitoring](dx-getstarted-MonitoringTab.md)
- [Capabilities](dx-getstarted-CapabilitiesTab.md)
- [Recommendations](dx-getstarted-RecommendationsTab.md)
- [Tutorials](dx-getstarted-TutorialsTab.md)
- [DataBrowse](dx-getstarted-DataBrowseTab.md)
- [Information](dx-getstarted-InformationTab.md)

It is recommended that the TagsByResource be used in its own `Tags` tab and that the `Tags` tab be the final tab of the Create form. This recommendation is to ensure consistency with the Create pattern for Azure Portal.

<a name="example-usage"></a>
### Example Usage

- The output of the control is formatted for easy assignment of tag values in an Azure Resource Manager template. To receive the control's output in a template, include a parameter in your template as shown in the following example:

```json
"parameters": {
  "tagsByResource": { "type": "object", "defaultValue": {} }
}
```

For each resource that can be tagged, assign the tags property to the parameter value for that resource type:

```json
{
  "name": "saName1",
  "type": "Microsoft.Storage/storageAccounts",
  "tags": "[ if(contains(parameters('tagsByResource'), 'Microsoft.Storage/storageAccounts'), parameters('tagsByResource')['Microsoft.Storage/storageAccounts'], json('{}')) ]",
  ...
```

- Use the [if](https://docs.microsoft.com/en-us/azure/azure-resource-manager/templates/template-functions-logical#if) function when accessing the tagsByResource parameter. It enables you to assign an empty object when no tags are assigned to the given resource type.

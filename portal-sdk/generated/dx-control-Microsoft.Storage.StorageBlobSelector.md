<a name="microsoft-storage-storageblobselector"></a>
# Microsoft.Storage.StorageBlobSelector
* [Microsoft.Storage.StorageBlobSelector](#microsoft-storage-storageblobselector)
    * [Description](#microsoft-storage-storageblobselector-description)
    * [Guidance](#microsoft-storage-storageblobselector-guidance)
    * [Definitions:](#microsoft-storage-storageblobselector-definitions)
    * [UI Sample](#microsoft-storage-storageblobselector-ui-sample)
    * [Sample Snippet](#microsoft-storage-storageblobselector-sample-snippet)
    * [Sample output](#microsoft-storage-storageblobselector-sample-output)

<a name="microsoft-storage-storageblobselector-description"></a>
## Description
A control for selecting a blob from an Azure storage account.
<a name="microsoft-storage-storageblobselector-guidance"></a>
## Guidance
- The `constraints.allowedFileExtensions` property specifies the allowed file types.
 
<a name="microsoft-storage-storageblobselector-definitions"></a>
## Definitions:
<a name="microsoft-storage-storageblobselector-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|name|True|The name of the instance
|type|True|Enum permitting the value: "Microsoft.Common.StorageBlobSelector"
|label|True|Display text for the control
|toolTip|False|Text to display when hovering over the tooltip icon. Tooltip icon will only be displayed if text is a non-empty value.
|extendExpirationDate|False|If **true** SAS expiration date will extend to 90 days, otherwise it will default to 8 hours.
|visible|False|If **true** the control will display, otherwise it will be hidden.
|options|False|`options.text` is the default value for the selection text
|constraints|False|`constraints.allowedFileExtensions` specifies the allowed file types.  Defined as an array of file types.
|scope|True|
|fx.feature|False|
<a name="microsoft-storage-storageblobselector-ui-sample"></a>
## UI Sample
![alt-text](../media/dx/controls/Microsoft.Storage.StorageBlobSelectorPackageSelection.png "UI Sample")  
![alt-text](../media/dx/controls/Microsoft.Storage.StorageBlobSelectorStorageSelection.png "Storage selection")  
![alt-text](../media/dx/controls/Microsoft.Storage.StorageBlobSelectorContainerSelection.png "Container selection")  
![alt-text](../media/dx/controls/Microsoft.Storage.StorageBlobSelectorFileSelection.png "File selection")  
![alt-text](../media/dx/controls/Microsoft.Storage.StorageBlobSelectorDisplayFile.png "Display file selected")  
<a name="microsoft-storage-storageblobselector-sample-snippet"></a>
## Sample Snippet

```json
// Enclosing comment
{
    "name": "storageBlobSelection",
    "type": "Microsoft.Storage.StorageBlobSelector",
    "visible": true,
    "toolTip": "Select storage blob",
    "label": "Package (.zip, .cspkg)",
    "options": {
      "text": "Select Package"
    },
    "constraints": {
      "allowedFileExtensions": [ "zip", "cspkg" ]
    },
    "extendExpirationDate": false
  }
// Enclosing comment

```
<a name="microsoft-storage-storageblobselector-sample-output"></a>
## Sample output

```json
{
    "blobName": "test.zip",
    "sasUri": "https://azstorageaccnt1.blob.core.windows.net/container1/test.zip?sp=r&se=2020-10-10T07:46:22Z&sv=2019-12-12&sr=b&sig=X4EL8ZsRmiP1TVxkVfTcGyMj2sHg1zCbFBXsDmnNOyg%3D"
  }

```

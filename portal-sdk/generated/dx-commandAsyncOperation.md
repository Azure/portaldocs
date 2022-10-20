<a name="commandasyncoperation"></a>
# commandAsyncOperation
* [commandAsyncOperation](#commandasyncoperation)
    * [Definitions:](#commandasyncoperation-definitions)

<a name="commandasyncoperation-definitions"></a>
## Definitions:
<a name="commandasyncoperation-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|pollingHeaderOverride|False|By default when http Accepted (202) status code is received, the Location header will be looked up for polling uri to get the status of long running operation. A different response header can be specified with the pollingHeaderOverride value.
|statusPath|False|A property path to look for status in the response body. By default 'status' property will be looked up to see if it has "Succeeded", "Failed", "InProgress" or "Canceled".
|fx.feature|False|

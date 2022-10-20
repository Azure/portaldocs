<a name="viewdeletecommand-properties-definition"></a>
# viewDeleteCommand-properties-definition
* [viewDeleteCommand-properties-definition](#viewdeletecommand-properties-definition)
    * [Guidance](#viewdeletecommand-properties-definition-guidance)
        * [More details on properties of viewDeleteCommand](#viewdeletecommand-properties-definition-guidance-more-details-on-properties-of-viewdeletecommand)
    * [Definitions:](#viewdeletecommand-properties-definition-definitions)
        * [Option 1](#viewdeletecommand-properties-definition-definitions-option-1)
        * [Option 2](#viewdeletecommand-properties-definition-definitions-option-2)

<a name="viewdeletecommand-properties-definition-guidance"></a>
## Guidance

<a name="viewdeletecommand-properties-definition-guidance-more-details-on-properties-of-viewdeletecommand"></a>
### More details on properties of viewDeleteCommand

<a name="viewdeletecommand-properties-definition-guidance-more-details-on-properties-of-viewdeletecommand-uri"></a>
#### uri

Uri should be a relative uri with the fixed format - {resourceid}/optionalOperationName?api-version.
Example: "{resourceid}?api-version=2018-09-01-preview

<a name="viewdeletecommand-properties-definition-guidance-more-details-on-properties-of-viewdeletecommand-retryablearmcodes"></a>
#### retryableArmCodes

Optional list of resource-specific ARM error codes that should be retried for HttpStatusCode.BadRequest(400).

By default, Fx retries below codes:

* Retry for transient errors with Http status codes: HttpStatusCode.InternalServerError(500), HttpStatusCode.BadGateway(502), HttpStatusCode.ServiceUnavailable(503), HttpStatusCode.GatewayTimeout(504)
* Retry for ARM conflict/throttle errors with status codes: HttpStatusCode.TooManyRequests(409), HttpStatusCode.Conflict(429)
* In addition to these, there could be resource-specific errors that need to be retried for HttpStatusCode.BadRequest(400).
* If this list is specified, Fx will parse ARM error codes for HttpStatusCode.BadRequest(400) requests and retry in addition to above retries.

* Example: ["PublicIpAddressCannotBeDeleted", "InuseNetworkSecurityGroupCannotBeDeleted"]

<a name="viewdeletecommand-properties-definition-guidance-more-details-on-properties-of-viewdeletecommand-nonretryablearmcodes"></a>
#### nonRetryableArmCodes

Optional list of resource-specific ARM error codes that shouldn't be retried.
This helps optimize network calls and improve bulk operation performance.

By default, Fx won't issue retry for below code regardless of HTTP status code:

* "ScopeLocked"
* In addition to this Arm error code, there could be resource-specific error codes that shouldn't be retried.
* If this list is specified, Fx will ignore the above mentioned list and only honor this list of Arm codes that shouldn't be retried.
* Example: ["ScopeLocked"]

<a name="viewdeletecommand-properties-definition-guidance-more-details-on-properties-of-viewdeletecommand-asyncoperation"></a>
#### asyncOperation

ARM command operation can be long running operation. asyncOperation property specifies how to poll the status for completion of long running operation.

```json
ArmCommand (in Views)
"definition":{
  "httpMethodType": "POST",
  "uri": "{resourceid}/myaction?api-version=2018-09-01-preview",
  "asyncOperation": {
    "pollingHeaderOverride": "Azure-AsyncOperation",
  },
},
```
 
<a name="viewdeletecommand-properties-definition-definitions"></a>
## Definitions:
<a name="viewdeletecommand-properties-definition-definitions-option-1"></a>
### Option 1
<a name="viewdeletecommand-properties-definition-definitions-option-1-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|apiVersion|True|Specify api version
|retryableArmCodes|False|Optional list of resource-specific ARM error codes that should be retried for HttpStatusCode.BadRequest(400).
|nonRetryableArmCodes|False|Optional list of resource-specific ARM error codes that shouldn't be retried. This helps optimize network calls and improve bulk operation performance.
|asyncOperation|False|Optional Arm command configs to describe how long running ARM operations needs to be polled and results processed. See [here](dx-commandAsyncOperation.md) for more on asyncOperation.
|fx.feature|False|
<a name="viewdeletecommand-properties-definition-definitions-option-2"></a>
### Option 2
<a name="viewdeletecommand-properties-definition-definitions-option-2-an-object-with-the-following-properties-1"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|uri|True|ARM uri for the command operation.
|retryableArmCodes|False|Optional list of resource-specific ARM error codes that should be retried for HttpStatusCode.BadRequest(400).
|nonRetryableArmCodes|False|Optional list of resource-specific ARM error codes that shouldn't be retried. This helps optimize network calls and improve bulk operation performance.
|asyncOperation|False|Optional Arm command configs to describe how long running ARM operations needs to be polled and results processed. See [here](dx-commandAsyncOperation.md) for more on asyncOperation.
|fx.feature|False|


<a name="more-details-on-properties-of-viewdeletecommand"></a>
### More details on properties of viewDeleteCommand

<a name="more-details-on-properties-of-viewdeletecommand-uri"></a>
#### uri

Uri should be a relative uri with the fixed format - {resourceid}/optionalOperationName?api-version.
Example: "{resourceid}?api-version=2018-09-01-preview

<a name="more-details-on-properties-of-viewdeletecommand-retryablearmcodes"></a>
#### retryableArmCodes

Optional list of resource-specific ARM error codes that should be retried for HttpStatusCode.BadRequest(400).

By default, Fx retries below codes:

* Retry for transient errors with Http status codes: HttpStatusCode.InternalServerError(500), HttpStatusCode.BadGateway(502), HttpStatusCode.ServiceUnavailable(503), HttpStatusCode.GatewayTimeout(504)
* Retry for ARM conflict/throttle errors with status codes: HttpStatusCode.TooManyRequests(409), HttpStatusCode.Conflict(429)
* In addition to these, there could be resource-specific errors that need to be retried for HttpStatusCode.BadRequest(400).
* If this list is specified, Fx will parse ARM error codes for HttpStatusCode.BadRequest(400) requests and retry in addition to above retries.

* Example: ["PublicIpAddressCannotBeDeleted", "InuseNetworkSecurityGroupCannotBeDeleted"]

<a name="more-details-on-properties-of-viewdeletecommand-nonretryablearmcodes"></a>
#### nonRetryableArmCodes

Optional list of resource-specific ARM error codes that shouldn't be retried.
This helps optimize network calls and improve bulk operation performance.

By default, Fx won't issue retry for below code regardless of HTTP status code:

* "ScopeLocked"
* In addition to this Arm error code, there could be resource-specific error codes that shouldn't be retried.
* If this list is specified, Fx will ignore the above mentioned list and only honor this list of Arm codes that shouldn't be retried.
* Example: ["ScopeLocked"]

<a name="more-details-on-properties-of-viewdeletecommand-asyncoperation"></a>
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

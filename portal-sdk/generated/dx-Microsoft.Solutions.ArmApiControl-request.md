<a name="microsoft-solutions-armapicontrol-request"></a>
# Microsoft.Solutions.ArmApiControl-request
* [Microsoft.Solutions.ArmApiControl-request](#microsoft-solutions-armapicontrol-request)
    * [Definitions:](#microsoft-solutions-armapicontrol-request-definitions)

<a name="microsoft-solutions-armapicontrol-request-definitions"></a>
## Definitions:
<a name="microsoft-solutions-armapicontrol-request-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|method|True|Specifies the HTTP method. Only "GET" or "POST" are allowed
|path|True|Specifies a URL that must be a relative path to an ARM endpoint
|body|False|Specifies a JSON body that is sent with the request.
|transforms|False|See [here](dx-function-transforms.md) for more on transforms
|fx.feature|False|

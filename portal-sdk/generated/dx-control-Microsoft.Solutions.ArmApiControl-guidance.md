- The <code>request.method</code> property specifies the HTTP method. Only <code>GET</code> or <code>POST</code> are allowed.

- The <code>request.path property</code> specifies a URL that must be a relative path to an ARM endpoint. It can be a static path or can be constructed dynamically by referring output values of the other controls.

- For example, an ARM call into <code>Microsoft.Network/expressRouteCircuits</code> resource provider:

```json
"path": "subscriptions/<subid>/resourceGroup/<resourceGroupName>/providers/Microsoft.Network/expressRouteCircuits/<routecircuitName>/?api-version=2020-05-01"
```

- The <code>request.body</code> property is optional. Use it to specify a JSON body that is sent with the request. The body can be static content or constructed dynamically by referring to output values from other controls.

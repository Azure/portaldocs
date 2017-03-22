
### Remote Procedure Calls (RPC)

In some cases an extension may want to invoke a method on another extension, or provide one such method for others to invoke. This is supported via an RPC API.

#### Producer API

To provide a method for invocation, you can create a new callback in `EntryPoint`.  The following code creates a RPC endpoint named `StringUpperCaseCallback`, takes a single string argument, and returns a transformed string:

`\Client\Program.ts`

```ts
/*
 * Registers the RPC callbacks supported by this extension.
 */
private registerCallbacks(): void {
    MsPortalFx.Services.Rpc.registerCallback("StringUpperCaseCallback",
    	function (input: string): string {
        	return input.toUpperCase();
        }
    );
}
```
#### Consumer API

The consumer simply needs to invoke the `MsPortalFx.Services.Rpc.invokeCallback` API, passing the extension endpoint, callback name, and any required arguments:

`\Client\Framework\ViewModels\RpcCallbacksViewModels.ts`

```ts
/**
 * Invokes an RPC callback.
 */
public invokeCallback() {
    var extensionId = ExtensionDefinition.definitionName,
        callbackName = "StringUpperCaseCallback",
        arg = (new Date()).toTimeString();

    // Reset UI
    this.result(ClientResources.rpcResultPending);

    // Make the RPC call.
    // Note: For convenience, this source/destination extensions are the same
    // for this example. In practice, that will not be so, but the syntax/behavior
    // is otherwise the same.
    MsPortalFx.Services.Rpc.invokeCallback<string>(extensionId, callbackName, arg)
    	.then(
	        (result) => {
	            this.result(result);
	        },
	        (rpcError) => {
	            this.result(ClientResources.rpcResultErrorFormatString.format(
	            		rpcError.error.toString(),
	            		rpcError.isClientError
	            	)
	           	);
	        }
	    );
}
```

This will asynchronously return a result from the source.

> [WACOM.NOTE] Extensions in the portal will often need to be loaded into memory to perform an RPC call. It is often more predictable when both extensions are projecting UI.


{"gitdown": "include-file", "file": "portalfx-extensibility-pde.md"}

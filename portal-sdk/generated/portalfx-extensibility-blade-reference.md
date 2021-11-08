
<a name="launching-blades-from-another-extension"></a>
### Launching blades from another extension

To open a external blade use the method `BladeReference.forExtension` when you are creating the blade reference.  
The example below demonstrates this.  You can find additional documentation on how to open blades 
here [top-blades-opening-and-closing.md](top-blades-opening-and-closing.md).

```typescript

// open the "control" menu item in the resource menu for a specific resource
const resourceId = "/subscriptions/sub123/resourcegroups/servertest/providers/Microsoft.test/virtualservers/web1";
void this._container.openBlade(BladeReferences.forExtension("HubsExtension").forMenuBlade("ResourceMenuBlade", "control").createReference({ parameters: { id: resourceId } }));

```


<a name="referencing-external-parts"></a>
### Referencing external parts
In some cases, you may [import a part from another extension](portalfx-extension-sharing-pde.md).  Using this technique, the source of the shared part will control launching of the blade.

You can also pin a external part to the customers dashboard.  When you create the part reference use the method PartReference.forExtension.

```typescript

public onPin() {
    const { parameters } = this.context;
    return PartReferences.forExtension("HubsExtension").forPart("ResourcePart").createReference({ parameters: parameters });
}

```


<a name="the-pde-file"></a>
## The PDE File

You may not have noticed, but every time you build your project you're generating a .PDE file inside of the `\Client\_generated` directory. The PDE file contains a list of the parts which are exposed in the global scope, along with a few other pieces of metadata:

```json
{
  "extension": "HubsExtension",
  "version": "1.0",
  "sdkVersion": "1.0.8889.122 (rd_auxweb_n_f1(tomcox).130919-1440)",
  "schemaVersion": "0.9.1.0",
  "assetTypes": [
    {
      "name": "TagsCollection",
      "permissions": []
    }
    ...
  ],
  "parts": [
    {
      "name": "ChangeLogPart",
      "inputs": []
    },
    ...
  ],
  "blades": [
    {
      "name": "TagCollectionBlade",
      "keyParameters": [],
      "inputs": [],
      "outputs": []
    },
    ...
  ]
}
```

To share parts, blades, or asset types with another extension, **both extensions must be running in the same portal**. The sharing of parts occurs at runtime, which requires that both extensions be present within the shell for this technique to work.

<a name="importing-the-pde-file"></a>
## Importing the PDE file

After you've generated the PDE file, it needs to be added to the project of the extension that wishes to consume your parts. First, add the file to your project. Next, you need to make a manual change to your .csproj file. Instead of using the `<Content>` compile action, you need to change it to `<ExtensionReference>`. Right click on your project file, and choose 'Unload Project'. Next, right click the project file again, and choose 'Edit'. Find the PDE file reference, and change the compile action:

```xml
<ExtensionReference Include="Client\References\HubsExtension.pde" />
```

Save the file, right click on your project file, and choose 'Reload Project'.




<a name="importing-the-pde-file-remote-procedure-calls-rpc"></a>
### Remote Procedure Calls (RPC)

In some cases an extension may want to invoke a method on another extension, or provide one such method for others to invoke. This is supported via an RPC API.

<a name="importing-the-pde-file-remote-procedure-calls-rpc-producer-api"></a>
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
<a name="importing-the-pde-file-remote-procedure-calls-rpc-consumer-api"></a>
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


<a name="the-pde-file-1"></a>
## The PDE File

You may not have noticed, but every time you build your project you're generating a .PDE file inside of the `\Client\_generated` directory. The PDE file contains a list of the parts which are exposed in the global scope, along with a few other pieces of metadata:

```json
{
  "extension": "HubsExtension",
  "version": "1.0",
  "sdkVersion": "1.0.8889.122 (rd_auxweb_n_f1(tomcox).130919-1440)",
  "schemaVersion": "0.9.1.0",
  "assetTypes": [
    {
      "name": "TagsCollection",
      "permissions": []
    }
    ...
  ],
  "parts": [
    {
      "name": "ChangeLogPart",
      "inputs": []
    },
    ...
  ],
  "blades": [
    {
      "name": "TagCollectionBlade",
      "keyParameters": [],
      "inputs": [],
      "outputs": []
    },
    ...
  ]
}
```

To share parts, blades, or asset types with another extension, **both extensions must be running in the same portal**. The sharing of parts occurs at runtime, which requires that both extensions be present within the shell for this technique to work.

<a name="importing-the-pde-file-1"></a>
## Importing the PDE file

After you've generated the PDE file, it needs to be added to the project of the extension that wishes to consume your parts. First, add the file to your project. Next, you need to make a manual change to your .csproj file. Instead of using the `<Content>` compile action, you need to change it to `<ExtensionReference>`. Right click on your project file, and choose 'Unload Project'. Next, right click the project file again, and choose 'Edit'. Find the PDE file reference, and change the compile action:

```xml
<ExtensionReference Include="Client\References\HubsExtension.pde" />
```

Save the file, right click on your project file, and choose 'Reload Project'.



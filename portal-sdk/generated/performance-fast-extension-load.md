<a name="fast-extension-load"></a>
# Fast extension load

The frameworks supports a new extension load contract that can improve extension load performance by one second at the 95th percentile by deprecating Program.ts and the classic extension initialization code path. Once your extension uses the new contract, the portal will no longer download and execute Program.ts and _generated/Manifest.ts. _generated/ExtensionDefinition.ts will be bundled with your blades.

<a name="fast-extension-load-prerequistes"></a>
## Prerequistes

- Remove all requireJS shims.
- Complete the dependency injected view models migration.
- Upgrade to at least SDK 14401.
  - The SDK can be updated from the [internal package feeds](top-extension-packages.md).
  - $(ExtensionPageVersion) breaking change notes: https://msazure.visualstudio.com/One/_workitems/edit/3276047
- Prewarming / Web Workers is not a pre-requisite. If an extension onboards to both Prewarming and FastExtensionLoad, the framework will eliminate an additional 500 ms postMessage call, allowing an extension to reach sub-second extension load time.

<a name="fast-extension-load-migration-steps"></a>
## Migration steps

- Since the new extension load contract will no longer execute Program.ts, your extension's Program.ts should only contain the bare minimum scaffolding. Refer to the following Program.ts for an example: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx/pullrequest/1320194?_a=files&path=%2Fsrc%2FSDK%2FAcceptanceTests%2FExtensions%2FInternalSamplesExtension%2FExtension%2FClient%2FProgram.ts
- You do not need to run `MsPortalFx.Base.Diagnostics.Telemetry.initialize(*extensionName*);` because the framework will run it on your behalf.
- If your extension is on the hosting service, you can delete Program.ts.
- If you have RPC callbacks that need to be registered, you need to migrate them to the new contract by performing the following steps.
  - Create the file `Client\EventHandlers\EventHandlers.ts`.
  - Create a class like the one below and add your RPC registrations.

    ```typescript

    import * as Di from "Fx/DependencyInjection";

    import Rpc = MsPortalFx.Services.Rpc;

    @Di.Class()
    @Rpc.EventHandler.Decorator("rpc")
    export class EventHandlers {
        public registerEndPoints(): void {
            // Add RPC registrations here
        }
    }
    ```

    - Refer to these changes for an example: https://msazure.visualstudio.com/One/_git/AzureUX-IaaSExp/commit/fba28b74f52b4d8a60497037f9ecd743ff775368?path=%2Fsrc%2Fsrc%2FUx%2FExtensions%2FCompute%2FClient%2FEventHandlers%2FEventHandlers.ts&gridItemType=2&_a=contents
    - You can verify whether the RPC callbacks are registered correctly by checking `Output/Content/AzurePortalMetadata/SdkSuppliedEnvironment.json` for `rpc`.
- Change the `EnableDependencyInjectedViewModels` MSBuild property in your csproj to `EnableFastExtensionLoad`.
- The URI used to register your extension to the portal should be the application root and should not contain any routes.
  - You may need to change the URI that you use to sideload your extension.
  - The hosting service URIs are already registered correctly.
  - You can add a urlMapping in your web.config to redirect the root application path `~/` to your home page controller. This change does not have to be deployed to production if your extension is already on the hosting service.

    ```xml
        <system.web>
            <urlMappings enabled="true">
                <add url="~/" mappedUrl="~/Home/Index"/>
            </urlMappings>
        </system.web>
    ```

- You can verify whether the migration was completed successfully by sideloading your extension in MPAC and checking whether the expression `FxImpl.Extension.isFastExtensionLoadEnabled()` returns `true` in the iframe/webworker of your extension.


<a name="fast-extension-load-pull-request-samples"></a>
## Pull Request Samples

- https://msazure.visualstudio.com/One/_git/AzureUX-Monitoring/pullrequest/1514753
- https://dev.azure.com/msazure/One/_git/Mgmt-RecoverySvcs-Portal/pullrequest/1423720
- https://msazure.visualstudio.com/One/_git/MGMT-AppInsights-InsightsPortal/pullrequest/1426564
- https://msazure.visualstudio.com/One/_git/AzureUX-Monitoring/pullrequest/1514753

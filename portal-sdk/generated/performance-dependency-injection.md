<a name="dependency-injected-view-models"></a>
# Dependency injected view models

The framework supports loading view models using dependency injection. If you migrate your extension to use this programming model, the SDK will no longer generate ViewModelFactories.ts and a large portion of ExtensionDefinition.ts. Consequently you can remove nearly all code in Program.ts. All of your DataContext classes will also be bundled with the associated blade and will no longer be loaded up front.

> If you have any issues throughout this process please post to our [stack overflow](https://aka.ms/portalfx/ask)

<a name="dependency-injected-view-models-prerequistes"></a>
## Prerequistes

- Migrate to V2 targets if you haven’t done so (See: [V2 targets](performance-using-v2-targets.md))
- Ensure that the `emitDecoratorMetadata` compiler option is set to `true` in the tsconfig.json
- Ensure that the `forceConsistentCasingInFileNames` compiler option is set to `true` in the tsconfig.json
- Ensure that the `moduleResolution` compiler option is set to `node` in the tsconfig.json
- Upgrade to at least SDK 3001+
- Cleanup your extension project TypeScript code and remove all uses of export = Main.
  - Check this PR in the portal repo for an example: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx/pullrequest/1003495?_a=overview
  - You do not have to remove trailing newlines like the PR.
- Commit and verify that these changes do not break your extension before starting the actual migration.

<a name="dependency-injected-view-models-migration-steps"></a>
## Migration steps

- Remove the code in Program.ts that initializes the DataContext classes. Set the generic type parameter of `MsPortalFx.Extension.EntryPointBase` base class specification to void.
- Delete the generated ViewModelFactories.ts from `Client\_generated`
- Add the following line to your csproj

```xml
<EnableDependencyInjectedViewModels>true</EnableDependencyInjectedViewModels>
```

- Build the extension project
- Get a copy of the dependency injection migration tool at: [\\\\wimoy-dev\Public\DependencyInjectionMigrator](\\\\wimoy-dev\Public\DependencyInjectionMigrator) and copy it locally. Many thanks to Bryan Wood for improving the tool.
  - Look for the string "ViewModels:" in the build logs and copy and paste the JSON to Extension.json in the dependency injection migration tool.
  - Modify the migration tool source code and put in the path of the folder that contains the TypeScript for your extension
- Run the tool and migrate your V1 view models.
  - The tool will modify your source files and perform the following operations:
    - Add `import * as Di from "Fx/DependencyInjection` to the top of any file with a V1 (pdl) view model
    - Add `@Di.Class("viewModel")` right before every single V1 view model class
    - Delete the initialState second parameter of the viewModel classes
  - The migration tool is based on regex and is not perfect. Review the results and make any necessary adjustments to ensure that it performs those three operations on all V1 viewModels.
  - The removal of the initialState parameter may cause breaks in your code if your code was referencing the parameter. The portal was always passing null for initialState. You can basically remove all uses of initialState.
  - If the tool outputs anything besides a completion message, send wimoy@microsoft.com and cscro@microsoft.com an email with the message
- Optionally, remove any parameters in V1 view models that are no longer needed. In the process of doing so, you may end up with some unused DataContext classes too. You can remove them if they are not used by V2 (no-pdl) view models.
- Find all V2 view models and add the InjectableModel decorator. Refer to the PRs below for examples.
  - You can enumerate all of the V2 view models by going through the code in the following generated folders located at the root of your TypeScript build:
    - _generated\adapters\blade
    - _generated\adapters\part
  - DataContext classes referenced by V2 view models cannot be removed even if they are empty
- Find all DataContext classes that are still referenced by your view models and add the `@Di.Class()` decorator.
  - Note that `@Di.Class()` is called with no arguments.
  - You will need to add `import * as Di from "Fx/DependencyInjection` to the top of the files
- The constructor of any class that contains a `@Di.Class()` decorator (with or without the "viewModel" argument) cannot contain an parameter that is specified with a non-class type. Some of your view model classes may have a dataContext parameter with an any type or an interface type. Either change the type to a class or remove the parameter entirely.
- All classes in the dependency chain of migrated view models should be marked with `@Di.Class()` decorator. The dependency injection framework in the Portal only supports constructor injection.
- Put the following code in your Program.ts right at the module level. Then load your extension through the portal. This will validate that you have correctly migrated the V1 view models. The code should complete almost instantly. Remove the code when you are done.

```typescript
MsPortalFx.require("Fx/DependencyInjection")
    .then((di: any) => {
        const container: any = di.createContainer("viewModel");
        (function (array: any[]) {
            array.forEach(a => {
                if (a.module) {
                    MsPortalFx.require(a.module)
                        .then((m: any) => {
                            console.log("Loading view model: " + a.module + " " + a.export);
                            const exportedType = m[a.export];
                            if (exportedType.ViewModelAdapter) {
                                // Can't validate V2 view models
                            }
                            else {
                                container._validate(new (<any>window).Map(), exportedType, true);
                            }
                        });
                }
            });
        })([/* insert view model json from build log here */ ]);
});
```

- Temporarily set `emitDecoratorMetadata` compiler option to false. Then turn on the compiler option `noUnusedParameters` and `noUnusedLocals`. Remove any dead parameters flagged by the compiler. You may find some violations in generated code. Ignore them.

<a name="dependency-injected-view-models-pull-request-samples"></a>
## Pull Request Samples

- **Note:** as of sdk 5.0.302.20501 Program.ts should be removed completely as part of this migration.
- https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx/pullrequest/1013125?_a=overview
- https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx/pullrequest/1013301?_a=overview
- https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx/pullrequest/1016472?_a=overview
- https://msazure.visualstudio.com/One/_git/AD-IAM-IPC/pullrequest/1096247?_a=overview
- https://msazure.visualstudio.com/One/_git/AD-IAM-Services-ADIbizaUX/pullrequest/1098977?_a=overview
- https://msazure.visualstudio.com/One/_git/MGMT-AppInsights-InsightsPortal/pullrequest/1124038?_a=overview


{"gitdown": "include-file", "file": "portalfx-parameter-collection-related.md"}

# Parameter Collection: Inputs and Outputs
For collectors and providers to communicate, there has to be a contract between them. The provider gets to define that contract. Following the interrogation analogy, the provider defines what questions you can ask, what it needs before it can answer the question, and what the response will look like. It's the duty of the collector to learn the provider's contract.

So consider the provider to be a function that has a specific signature; it processes some specific inputs and returns specific outputs. You just call the function as it is. This way of thinking helps us build reusable entities (collectors/providers) that not only can be used within our extension, but also share with other extensions. This extensibility enables building endless combinations of those UI elements to build any scenario we might need.

Let's take a closer look at those inputs and outputs.

## Inputs
A data structure sent from the collector to the provider. It contains:

* **Input Parameters**: The inputs to the parameter collection flow (initial values). A dictionary of parameter sets (key is a string, parameter set name - value is an object, the parameter set). A parameter set is a dictionary of parameters (key is a string, parameter name - value is a string, parameter value). You should have at least one parameter set, and you can call it anything other than "galleryParameters". Usually values are initially empty, unless your want to pre-set the value of a specific parameter. The parameters defined here are the ones you get back filled out in the Outputs.

* **Input Metadata**: Some scenarios require metadata around the parameters (e.g. generated or conditional UX). This dictionary mirrors the Input Parameters, except that the value of the parameter is a `ParameterCollectionMetada` object (opposed to the actual string value).

* **Options**: This is where you define any configuration options for the provider you're invoking (part of the contract). For instance, a provider can show different UX based on a flag that you define in the options. The rule of thumb here is that if you're expecting the value back, it should be under Input Parameters. If not, it should be under Options (obviously you won't expect the value of the flag back in this case, but if it's a choice that the user makes, it's a parameter not an option). Options don't have to mirror the Input Parameters, and can have complex objects in the values. It's defined as a dictionary of options sets (key is a string, options set name - value is an object, a bag of options).

**Sample Inputs:**

```ts
inputs = {
    inputParameters: {
        parameterSetA: {
            parameter1: "Initial value",
            parameter2: "",
            // More parameters...
        },
        // More parameter sets...
    },
    inputMetadata: {
        parameterSetA: {
            parameter1: {
                displayName: "Display Name",
                defaultValue: "Default Value",
                description: "Description for parameter",
                tooltip: "Enter the value...",
                uiHint: "text",
                constraints: {
                    required: true,
                    hidden: false,
                    length: {
                        min: 10,
                        max: 256
                    }
                    // More constraints..
                }
            },
            // More parameter metadata...
        },
        // More parameter metadata sets...
    }
    options: {
        providerAOptionSet: {
            someFlag: true,
            someValue: "value",
            someArray: ["A", "B", "C"]
        }
        // More option sets...
    }
}
```

## Outputs
A data structure sent from the provider back to the collector. It contains:

* **Output Parameters**: The outputs of the parameter collection flow. Usually mirrors the structure of the Input Parameters, except that the values are filled out. Also defined as a dictionary of parameter sets (key is a string, parameter set name - value is an object, the parameter set). A parameter set is a dictionary of parameters (key is a string, parameter name - value is a string, parameter value). You should have at least one parameter set, and you can call it anything other than "galleryParameters".

**Sample Outputs:**

```ts
outputs = {
    outputParameters: { // Mirrors the input parameters
        parameterSetA: {
            parameter1: "Final value for parameter1",
            parameter2: "Final value for parameter2",
            // More parameters values...
        },
        // More parameter sets...
    }
}
```

## Data Models
Most base view model classes are require a data model type in their definition (e.g. `Form<T>`, `Wizard<T>`, etc.). This later simplifies your implementation for having to access the inputs or outputs using indexers to having a typed object instead. Your data model definition has to mirror the input parameters structure (which is the same for outputs too), except that the values for the parameters are Knockout string observables.

**Sample Data Model Type:**

```ts
class MyDataModel {
    public parameterSetA = {
        parameter1: ko.observable<string>(),
        parameter2: ko.observable<string>(),
        // The remaining parameters...
    },
    // The remaining parameter sets...
}
```

Now instead of doing `inputs.inputParameters["parameterSetA"]["parameter1"]`, you can do `inputs.inputParameters.parameterSetA.parameter1()`. This means less mistakes, added intellisense, type-checking and more benefits in development time. You can also share those data model classes with others who intend to invoke your provider in their parameter collection flows.

The framework also provides two utility methods that can help you convert data models to parameters and vice versa.

```ts
dataModel = MsPortalFx.ViewModels.ParameterCollectionV2.Utilities.parametersToModel<MyDataModel>(parameterSetCollection);
parameterSetCollection = MsPortalFx.ViewModels.ParameterCollectionV2.Utilities.modelToParameters<MyDataModel>(dataModel);
```

# Parameter Collection Base Classes
The framework provides base classes and PDL templates for the UI elements you need to build parameter collection flows. Here's a list:

## Forms
Form view models should extend `MsPortalFx.ViewModels.ParameterCollectionV2.Form<T>`.  
Use the `azurefx:CreateStepFormBlade` PDL template to represent that in your PDL.

## Wizards
Wizard view models should extend `MsPortalFx.ViewModels.ParameterCollectionV2.Wizard<T>`.  
Use the `azurefx:CreateWizardBlade` PDL template to represent that in your PDL.

_**More UI elements will be listed here.**_

# Parameter Collection: Role Implementations
To add roles to your view models, first you have to define an implementation of each role. Second, you need to pass instances of those role implementations to the super() constructor of your view model's base class. Different view model base classes have different required roles.

The possible roles are:

## Parameter Collector Role
The view model (and its base class) launches and dismisses providers. What the parameter collector does is _prepare_ the inputs required by the providers, optionally _validate_ the outputs coming back, and then _save_ the validated outputs. In the (optional) validation step, the collector must either accept the outputs (which implicitly closes the provider), or reject the outputs and send appropriate errors to the provider.

Here's a sample implementation of a parameter collector role:

```ts
/**
 * Sample parameter collection "collector" role.
 */
export class MyCollector
    implements MsPortalFx.ViewModels.ParameterCollectionV2.Roles.ParameterCollector<CollectorDataModel> {
    /**
     * Create the inputs that will be sent to a given provider when launched.
     *
     * @param dataModel The editable copy of the editScope data model.
     * @param providerId The id of the provider.
     * @param inputMetadata The input parameters metadata received from the collector.
     * @param options The parameter collection options received from the collector.
     * @return The input parameters for the provider.
     */
    public createInputParameters(
        dataModel: CollectorDataModel, // Typed to the data model tied to your UI element.
        providerId: string,
        inputMetadata: MsPortalFx.ViewModels.ParameterCollectionV2.InputMetadata,
        options: MsPortalFx.ViewModels.ParameterCollectionV2.ParameterCollectionOptions)
        : MsPortalFx.ViewModels.ParameterCollectionV2.ParameterCollectionInput {
        // Create the input parameters required by the provider.
        var inputs = new MsPortalFx.ViewModels.ParameterCollectionV2.ParameterCollectionInput();

        switch (providerId) {
            case "aProvider":
                // Create an instance of the provider's data model, populate it using your own
                // data model then convert it into parameters.
                var providerDataModel = new ProviderDataModel();
                providerDataModel.providerParams.paramP(dataModel.collectorParams.paramC());

                inputs.inputParameters =
                    MsPortalFx.ViewModels.ParameterCollectionV2.Utilities.modelToParameters(providerDataModel);
                // Define metadata if needed:   inputs.inputMetadata = ...
                // Define options if needed:    inputs.options = ...
                break;

            // More providers...
            default:
                break;
        }

        return inputs;
    }

    /**
     * (Optional) Validates the output parameters received from the provider. Do not reject the
     * promise. In case of failure, resolve with the errors. In case of success, resolve with an
     * empty array, or simply return null.
     *
     * @param dataModel The editable copy of the editScope data model.
     * @param providerId The id of the provider sending back the output parameters.
     * @param outputs The outputs received from the provider.
     * @return A JQuery promise resolved with an array of validation errors, if any.
     */
    public validateOutputParameters(
        dataModel: CollectorDataModel, // Typed to the data model tied to your UI element.
        providerId: string,
        outputParameters: MsPortalFx.ViewModels.ParameterCollectionV2.OutputParameters)
        : MsPortalFx.Base.PromiseV<MsPortalFx.ViewModels.ParameterCollectionV2.ParameterCollectionError[]> {=
        switch (providerId) {
            case "aProvider":
                // Create an instance of the provider's data model from the output parameters
                // sent back from the provider, then validate those outputs.
                var providerDataModel = MsPortalFx.ViewModels.ParameterCollectionV2.Utilities.parametersToModel<ProviderDataModel>(outputParameters);

                if (providerDataModel.providerParams.paramP() !== "someValue") {
                    var errors: MsPortalFx.ViewModels.ParameterCollectionV2.ParameterCollectionError[] = [],
                    deferred =
                            Q.defer<MsPortalFx.ViewModels.ParameterCollectionV2.ParameterCollectionError[]>();

                    errors.push({
                        errorMessage: "Value for paramP cannot be equal to 'someValue'.",
                        parameterName: "paramP"
                    });

                    // Resolve with the errors. Do not reject.
                    deferred.resolve(errors);

                    return deferred.promise;
                }
                break;

            // More providers...
            default:
                break;
        }

        return null;
    }

    /**
     * Saves the output parameters received from the provider.
     *
     * @param dataModel The editable copy of the editScope data model.
     * @param providerId The id of the provider sending back the output parameters.
     * @param outputs The outputs received from the provider.
     */
    public saveOutputParameters(
        dataModel: CollectorDataModel, // Typed to the data model tied to your UI element.
        providerId: string,
        outputParameters: MsPortalFx.ViewModels.ParameterCollectionV2.OutputParameters): void {
        // Save the outputs sent back by the provider.
        switch (providerId) {
            case "aProvider":
                // Create an instance of the provider's data model from the output parameters
                // sent back from the provider, then save them to your own data model.
                var providerDataModel = MsPortalFx.ViewModels.ParameterCollectionV2.Utilities.parametersToModel<ProviderDataModel>(outputParameters);

                dataModel.collectorParams.paramC(providerDataModel.providerParams.paramP());
                break;

            // More providers...
            default:
                break;
        }
    }
}
```

## Parameter Provider Role
The provider role has only two methods, and both are optional. The two methods let you override the inputs coming from the collector, or the outputs going back. Often you don't need to implement either method, in which case your implementation of this role can be the empty object `{}`!

Please note: the `overrideInputParameters` method will run before the edit scope is created (seeded). So any changes you make will not be reflected in the UI as 'dirty' modifications. Any changes made to the data model by the provider after overrideInputParameters returns, however, will put the UI element in a dirty state.

Here's a sample implementation of a parameter provider role:

```ts
/**
 * Sample parameter collection "collector" role.
 */
export class MyProvider implements MsPortalFx.ViewModels.ParameterCollectionV2.Roles.ParameterProvider {

    /**
     * (Optional) Overrides the input parameters received from the collector. Use this to override
     * or initialize any value before the editScope is created. Otherwise, the editScope will be
     * seeded with the input parameters as they are.
     *
     * @param inputParameters The input parameters received from the collector.
     * @param inputMetadata The input parameters metadata received from the collector.
     * @param options The parameter collection options received from the collector.
     * @return A JQuery promise object resolved with the overriden input parameters.
     */
    public overrideInputParameters(
        inputParameters: MsPortalFx.ViewModels.ParameterCollectionV2.InputParameters,
        inputMetadata: MsPortalFx.ViewModels.ParameterCollectionV2.InputMetadata,
        options: MsPortalFx.ViewModels.ParameterCollectionV2.ParameterCollectionOptions)
        : MsPortalFx.Base.PromiseV<MsPortalFx.ViewModels.ParameterCollectionV2.InputParameters> {
        var deferred = Q.defer<MsPortalFx.ViewModels.ParameterCollectionV2.InputParameters>();

        // You can either replace, modify or augment the input parameters passed to the provider.
        // You can also use this place to make the inputs match your data model (if they don't),
        //     and the only reason why we're not using the data model here in this example.
        deferred.resolve({
            newParameterSet: {
                parameterP: providerDataModel["providerParams"]["paramP"].toLowerCase(),
                parameterQ: providerDataModel["providerParams"]["paramX"] + providerDataModel["providerParams"]["paramY"],
                // More parameters..
            },
            // More parameter sets..
        });
        return deferred.promise;
    }

    /**
     * (Optional) Overrides the output parameters sent to the collector at the end of the parameter
     * collection process. Otherwise, the dataModel (the data in the editScope) will be sent to
     * the collector as they are.
     *
     * @param outputParameters The output parameters to be sent to the collector (extracted from the dataModel).
     * @param options The parameter collection options received from the collector.
     * @return A JQuery promise object resolved with the overriden output parameters.
     */
    public overrideOutputParameters(
        outputParameters: MsPortalFx.ViewModels.ParameterCollectionV2.OutputParameters,
        options: MsPortalFx.ViewModels.ParameterCollectionV2.ParameterCollectionOptions)
        : MsPortalFx.ViewModels.ParameterCollectionV2.OutputParameters{
        var providerDataModel = MsPortalFx.ViewModels.ParameterCollectionV2.Utilities.parametersToModel<ProviderDataModel>(outputParameters);

        // You can either replace, modify or augment the output parameters passed back to the collector.
        // You can also transform the structure completely, and you wouldn't use the data model in that
        // case (not in this sample, but similar to overrideInputParameters above).
        providerDataModel.providerParams.paramP("override value");

        return MsPortalFx.ViewModels.ParameterCollectionV2.Utilities.modeltoParameters<ProviderDataModel>(providerDataModel);
    }
}
```

## Provisioner Role
The provider role is usually an optional role, and even when not optional, both of its methods are optional. If you implement it you must choose to implement exactly one method - not both. Choosing to implement `mapOutputsForProvisioning()` means you want the default provisioning logic; i.e. Gallery/ARM create. Please refer to the Gallery/ARM documentation for more details. Choosing instead to implement `executeCustomProvisioning()` means you want to provide your own custom provisioning logic, which must include the logic to add a provisioning part to the start board, if desired. If you choose not to implement the Provisioner Role, but the base class requires one, the empty object `{}` can be your implementation.

Here's a sample implementation of a provisioner role:

```ts
/**
 * Sample parameter collection "provisioner" role.
 */
export class MyProvisioner implements MsPortalFx.ViewModels.ParameterCollectionV2.Roles.Provisioner {
    /**
     * (Optional) Maps the outputs of the parameter collection flow to what the default provisioning
     * action expects (i.e. gallery create). Override this method to implement custom mapping of
     * output parameters if the outputs of the parameter collection flow are different from what the
     * gallery deployment expects.
     *
     * NOTE: You cannot implement both the "executeCustomProvisioning" and "mapOutputsForProvisioning"
     * methods. Implement one or the other, but not both.
     *
     * @param outputParameters The outputs of the parameter collection flow.
     * @param options The options used for the provisioning process.
     * @return The mapped outputs, to what the default provisioning expects.
     */
    public mapOutputsForProvisioning(
        outputParameters: MsPortalFx.ViewModels.ParameterCollectionV2.OutputParameters,
        options: MsPortalFx.ViewModels.ParameterCollectionV2.ParameterCollectionOptions)
        : MsPortalFx.Base.PromiseV<MsPortalFx.ViewModels.ParameterCollectionV2.OutputParameters> {
        var deferred = Q.defer<MsPortalFx.ViewModels.ParameterCollectionV2.OutputParameters>(),
            mappedOutputs: MsPortalFx.ViewModels.ParameterCollectionV2.OutputParameters,
            providerDataModel = MsPortalFx.ViewModels.ParameterCollectionV2.Utilities.parametersToModel<ProviderDataModel>(outputParameters);

        // Fill out any missing properties or the ones required by Gallery/ARM create. Most of
        // the properties should probably be filled out by now.
        if (providerDataModel) {
            var selectedTemplateId = "armTemplateId",
                resourceId = "someResourceId",
                // Stringify the array because parameters can only be strings.
                resourceProviders = JSON.stringify(["Resource1", "Resource2"]);

            providerDataModel.galleryParameters.selectedTemplateId(selectedTemplateId);
            providerDataModel.galleryParameters.primaryResourceId(resourceId);
            providerDataModel.galleryParameters.resourceProviders(resourceProviders);

            // Convert the filled out data model to parameters before returning them.
            mappedOutputs = MsPortalFx.ViewModels.ParameterCollectionV2.Utilities.modelToParameters(providerDataModel);

            deferred.resolve(mappedOutputs);
        } else {
            deferred.reject();
        }

        return deferred.promise;
    }

    /**
     * (Optional) Executes a custom provisioning action. Override this method for custom provisioning.
     *
     * NOTE: You cannot implement both the "mapOutputsForProvisioning" and "executeCustomProvisioning"
     * methods. Implement one or the other, but not both.
     *
     * @param outputParameters The outputs of the parameter collection flow.
     * @param options The options used for the provisioning process.
     * @return A promise object that is resolved with any value (operation results) if the provisioning
     *      succeeds, or rejected if it fails.
     */
    public executeCustomProvisioning(
        outputParameters: MsPortalFx.ViewModels.ParameterCollectionV2.OutputParameters,
        options: MsPortalFx.ViewModels.ParameterCollectionV2.ParameterCollectionOptions)
        : MsPortalFx.Base.PromiseV<any> {
        var deferred = Q.defer(),
            providerDataModel = MsPortalFx.ViewModels.ParameterCollectionV2.Utilities.parametersToModel<ProviderDataModel>(outputParameters);

        if (providerDataModel) {
            // Do something with the data...
            var queryParams = [providerDataModel.providerParams.paramP()];

            GlobalDataLayer.queryServer(queryParams).then(
                (dataFromServer) => { deferred.resolve(dataFromServer); },
                () => { deferred.reject(); });
        } else {
            deferred.reject();
        }

        return deferred.promise;
    }
}
```

## Setting up the roles
Every base class requires specific roles (mandatory or optional). Let's consider forms as an examples. Forms are always providers. They are optionally collectors, if they launch other forms, wizards or pickers. They are also optionally provisioners, if they do provisioning at some point.

Here's how you define a simple form that works out of the box (simplest case):

```ts
/**
 * Sample parameter collection form.
 */
export class MySimpleFormPartViewModel
    extends MsPortalFx.ViewModels.ParameterCollectionV2.Form<MyDataModel>
    implements MsPortalFx.Base.Disposable {
    /**
     * Constructs the view model.
     *
     * @param container The container into which the part is being placed.
     * @param initialState Initial state of the view model.
     * @param dataContext The data context for the part.
     */
    constructor(container: MsPortalFx.ViewModels.PartContainerContract, initialState: any, dataContext: DataContext) {
        // Define the roles that this form will play and pass them to the super's contructor.
        var roles: MsPortalFx.ViewModels.ParameterCollectionV2.FormRoles<MyDataModel> = {
            // Form will always be a provider because it collects data from the user, but we're not doing
            // anything special, so we'll pass an empty object to get the default provisioning behavior.
            parameterProvider: {}
        };

        super(container, roles, initialState);
    }
}
```

Here's how you define a complex form that plays all three roles:

```ts
/**
 * Sample parameter collection form.
 */
export class MyComplexFormPartViewModel
    extends MsPortalFx.ViewModels.ParameterCollectionV2.Form<MyDataModel>
    implements MsPortalFx.Base.Disposable {
    /**
     * Constructs the view model.
     *
     * @param container The container into which the part is being placed.
     * @param initialState Initial state of the view model.
     * @param dataContext The data context for the part.
     */
    constructor(container: MsPortalFx.ViewModels.PartContainerContract, initialState: any, dataContext: DataContext) {
        // Define the roles that this form will play and pass them to the super's contructor.
        var roles: MsPortalFx.ViewModels.ParameterCollectionV2.FormRoles<MyDataModel> = {
            // We're launching a pickers for instance, so we need a collector role.
            parameterCollector: new MyCollector(),
            // Form will always be a provider because it collects data from the user.
            parameterProvider: MyProvider(),
            // We're doing a Gallery/ARM create for instance, so we need a provisioner role.
            provisioner: new MyProvisioner()
        };

        super(container, roles, initialState);
    }
}
```
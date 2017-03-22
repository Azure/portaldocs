
<a name="faq"></a>
# FAQ
<a name="faq-when-should-i-use-a-parameter-provider"></a>
## When should I use a parameter provider?
Use a parameter providers to build blades that can be used to collect data from the user (usually using a collection of form fields). To do so, the blade must be a locked blade and must have an action bar. There can only be one parameter provider per blade. Clicking the action bar will automatically and immediately close the blade. The parameter provider does three things for you in such scenarios:
1. Takes care of receiving the inputs to the blade and sending the outputs back (including serialization).
2. Provisions an edit scope for you to use with the form.
3. Reacts to action bar clicks (commits the results and gets the blade dismissed).

You need a parameter collector to launch a parameter provider blade.

<a name="faq-when-should-i-use-a-parameter-collector"></a>
## When should I use a parameter collector?
Use a parameter collector to launch a parameter provider blade. You can add a parameter collector to any UI component that can launch blades (via selectables), like parts, selector controls, commands, hotspots, etc. You can have more than once collector on the same UI component (like multiple selector controls on the same form or multiple commands in the same toolbar).

<a name="faq-when-should-i-use-a-provisioner"></a>
## When should I use a provisioner?
Use a provisioner to provision an async operation that happens in the background (e.g. deploying a template to ARM or sending data to your backend). There are two ways to use a provisioner:
1. A provisioner can be hooked up with a parameter provider and an action bar. The provisioner will start the async provisioning operation automatically when the action bar is clicked. It will get the mapped data outputs from the parameter provider and pass it to your `supplyProvisioningPromise` callback.
2. A provisioner can be manually started by calling the `startProvisioning(..)` method, usually as a reaction to a certain event. A common example would be to manually start provisioning in the `receiveResult` callback on the parameter collector (on a part or a command).

<a name="faq-what-is-the-arm-provisioner"></a>
## What is the ARM provisioner?
The ARM provisioner is a subclass of the regular (custom) provisioner. If your provisioning operation is nothing more than deploying a template to ARM, then use the ARM provisioner to simplify your implementation.

<a name="faq-what-is-the-difference-between-supplyinitialdata-and-supplyproviderconfig-on-the-parameter-collector"></a>
## What is the difference between <code>supplyInitialData</code> and <code>supplyProviderConfig</code> on the parameter collector?
Both callbacks return values that are sent as inputs to the parameter provider. The `supplyInitialData` callback returns the data you're working on. That's basically the data you want to initialize the parameter provider form with. It's also the same data the user will modify before returning to the collector once the provider blade is dismissed. The *optional* `supplyProviderConfig` callback will return config values that are used to configure the behavior of the provider blade.


Consider this example: You want to build a form that collects the user's username and password. The data here is the username and password. You want to supply the username as the initial value to your provider form, if you have it - that's what the `supplyInitialData` should return. You can optionally force the user to confirm the password in a third field. You will show that third field based on a flag. The 'supplyProviderConfig' should return something like `confirmPassword: true` (or `false`) based on whether you want to enforce that requirement. However, that flag is not data that will be presented or modified by the user. It's values that change the behavior of the parameter provider blade.


Please note that you have to account for missing/incomplete data in your `supplyInitialData` callback. Whatever this method returns is what will seed your edit scope.

<a name="faq-can-i-mix-pcv1-v2-old-with-pcv3-new"></a>
## Can I mix PCv1/v2 (old) with PCv3 (new)?
PCv1/v2 relied on inheritance, so your form would extend some PCv1/v2 base class that provided both the collector and provider functionality. This has changed with PCv3, which now relies on composition. You *add* a collector and/or provider component to your view model and configure it. This is how you can have multiple collectors on the same view model, which also has a provider. As a result:
* A PCv3 provider *must* be launched by a PCv3 collector.
* A PCv3 collector can only launch a PCv3 provider.
* You **cannot** launch a PCv1/v2 blade using a PCv3 collector.
* You *can* launch a PCv3 provider blade from a PCv1/v2 blade by adding a PCv3 collector to it.

<a name="faq-how-do-i-upgrade-from-pcv1-v2-to-pcv3"></a>
## How do I upgrade from PCv1/v2 to PCv3?
Please take a look at the parameter collector documentation and samples first. Here's what you need to do in a nutshell:
1. Fix the PDL: If you're using a PDL template (like `<azure:CreateStepForm .../>`, replace that with a regular blade template like the one in the sample. If you have an expanded blade, remove the bindings and convert to a [template blade]. Also make sure you use the new action bar definition syntax.
2. In your view model, remove all PCv1/v2 interfaces and base classes.
3. If your view model played a collector role, add a parameter collector. The old `createInputParameters` (or `getProviderInputs`) breaks into one or two callbacks: `supplyInitialData` and `supplyProviderConfig`. Your `inputParameters` is what the `supplyInitialData` should return. Your *optional* `inputMetadata` is what the `supplyInitialConfig` should return. The `saveOutputParameters` (or `onProviderCommit`) is now the `receiveResult` callback.
4. If your view model played a provider role, add a parameter provider. The old `overrideInputParameters` (or `onInputsReceived`) is your new `mapIncomingDataToEditScope/Async'. You can access the provider config by calling `this.paramterProvider.configFromCollector()` inside that callback. The `overrideOutputParameters` is now the `mapOutgoingDataForCollector`.
5. If your view model played a provisioner role, add a provisioner. The `executeCustomProvisioning` is not the `supplyProvisioningPromise` callback. The `mapOutputsForProvisioning` is gone (broken into `mapOutgoingDataForCollector` which sends the mapped data to `supplyProvisioningPromise`).











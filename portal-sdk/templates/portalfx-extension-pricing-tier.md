## Pricing Tier
### Consuming the Spec Picker Blade
The spec picker has a three controls (dropdown, infobox, and selector) for getting the data from the spec picker blades. The best way is to use the Spec Picker dropdown in your create blades.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/Create/EngineV3/ViewModels/CreateEngineBladeViewModel.ts", "section": "config#specDropDown"}

### Spec Picker Blade
To create a pricing tier blade you'll need to first create the blade in pdl using the `SpecPickerV3` template,
{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/Hubs/PricingV3/ViewModels/Robot/RobotSpecPickerV3.pdl", "section": "templateBlade#specPicker"}
a blade view model,
{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/Hubs/PricingV3/ViewModels/Robot/RobotSpecPickerV3BladeViewModel.ts", "section": "config#specPicker"}
and an extender viewModel,
{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/Hubs/PricingV3/ViewModels/Robot/RobotSpecPickerV3Extender.ts", "section": "config#specPicker"}

Inside of the constructor of the extender view model you'll have to setup the input and output observables for the extender.
{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/Hubs/PricingV3/ViewModels/Robot/RobotSpecPickerV3Extender.ts", "section": "config#specPickerConstructor"}

The data fetching part is where you're code will bring all of the spec picker data into the output.
{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/Hubs/PricingV3/ViewModels/Robot/RobotSpecPickerV3Extender.ts", "section": "config#specPickerData"}

The data in here will have the information that will be shown on the specs and as well as the `ResourceMap` information used to look up pricing from billing.

### Sample Spec Data
Sample Spec
{"gitdown": "include-section", "file": "../../../src/SDK/Framework.Tests/TypeScript/Tests/HubsExtension/SpecPickerV3/Mock.ts", "section": "config#sampleSpec"}
Sample Features
{"gitdown": "include-section", "file": "../../../src/SDK/Framework.Tests/TypeScript/Tests/HubsExtension/SpecPickerV3/Mock.ts", "section": "config#sampleFeature"}
Sample Resource Map
{"gitdown": "include-section", "file": "../../../src/SDK/Framework.Tests/TypeScript/Tests/HubsExtension/SpecPickerV3/Mock.ts", "section": "config#sampleResourceMap"}

For the resourceIds in the resource map, you'll need to cooridanate with billing to add any new resource ids in your spec picker.
The `default` resource map will be used if no region is specified as part of the spec picker blade inputs.
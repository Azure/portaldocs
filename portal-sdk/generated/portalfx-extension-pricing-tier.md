* [Pricing Tier](#pricing-tier)
    * [Consuming the Spec Picker Blade](#pricing-tier-consuming-the-spec-picker-blade)
    * [Spec Picker Blade](#pricing-tier-spec-picker-blade)
    * [Sample Spec Data](#pricing-tier-sample-spec-data)

<a name="pricing-tier"></a>
## Pricing Tier
<a name="pricing-tier-consuming-the-spec-picker-blade"></a>
### Consuming the Spec Picker Blade
The spec picker has a three controls (dropdown, infobox, and selector) for getting the data from the spec picker blades. The best way is to use the Spec Picker dropdown in your create blades.

```typescript

const initialSpecData: FxSpecPicker.InitialData = {
    selectedSpecId: "A0",
    entityId: "",
    recommendedSpecIds: ["small_basic", "large_standard"],
    recentSpecIds: ["large_basic", "medium_basic"],
    selectRecommendedView: false,
    subscriptionId: "subscriptionId",
    regionId: "regionId",
    options: { test: "DirectEA" },
    disabledSpecs: [
        {
            specId: "medium_standard",
            message: ClientResources.robotPricingTierLauncherDisabledSpecMessage,
            helpBalloonMessage: ClientResources.robotPricingTierLauncherDisabledSpecHelpBalloonMessage,
            helpBalloonLinkText: ClientResources.robotPricingTierLauncherDisabledSpecLinkText,
            helpBalloonLinkUri: ClientResources.robotPricingTierLauncherDisabledSpecLinkUri,
        },
    ],
};

const specsDropDown = new (FxSpecsDropDown as any)(container, { // #12469622: remove this before deleting Fx/Specs/DropDown
    initialData: ko.observable(initialSpecData),
    specPickerExtender: new BillingSpecPickerV3Extender(container),
    // Make sure to use a blade reference factory, DynamicBladeReferences do not work with no pdl
    pricingBladeReference: BladeReferences.forBlade("BillingSpecPickerV3"),
    validations: ko.observableArray([new Validations.Required()]),
    contextPane: true,
});

```

<a name="pricing-tier-spec-picker-blade"></a>
### Spec Picker Blade
To create a pricing tier blade you'll need to first create the blade in pdl using the `SpecPickerV3` template,
```xml

<azurefx:SpecPickerBladeV3 Name="RobotSpecPickerV3"
                        BladeViewModel="RobotSpecPickerV3BladeViewModel"
                        PartExtenderViewModel="RobotSpecPickerV3Extender" />

```
a blade view model,
```typescript

/**
* The view model that drives the Virtual Machines specific spec picker blade.
*/
@Di.Class("viewModel")
export class RobotSpecPickerV3BladeViewModel extends MsPortalFx.ViewModels.Blade {
   /**
    * Creates the view model for the spec picker blade.
    */
   constructor() {
       super();
       this.title(ClientResources.vmSpecPickerBladeTitle);
       this.subtitle(ClientResources.vmSpecPickerBladeSubtitle);
   }
}

```
and an extender viewModel,
```typescript

/**
* The sample extender for the robot spec picker blade.
*/
export class RobotSpecPickerV3Extender implements HubsExtension.Azure.SpecPicker.SpecPickerExtender {
   /**
    * See SpecPickerExtender interface.
    */
   public input = ko.observable<SpecPicker.SpecPickerExtenderInput>();

   /**
    * See SpecPickerExtender interface.
    */
   public output = ko.observable<SpecPicker.SpecPickerExtenderOutput>();

   /**
    * See SpecPickerExtender interface.
    */
   public selectionMode: SpecPicker.SelectionMode;

   /**
    * See SpecPickerExtender interface.
    */
   public filterControls: KnockoutObservableArray<SpecPicker.FilterControl>;

   private _specDataView: MsPortalFx.Data.EntityView<SpecPicker.SpecData, any>;

   private _specData = ko.observable<SpecPicker.SpecData>();

   /**
    * Extender constructor.
    *
    * @param container The view model for the part container.
    * @param dataContext The data context.
    */
   constructor(container: MsPortalFx.ViewModels.ContainerContract, dataContext: HubsArea.DataContext, selectionMode?: SpecPicker.SelectionMode) {
       
```

Inside of the constructor of the extender view model you'll have to setup the input and output observables for the extender.
```typescript

// The spec picker can return one or many specs. Specify if you want the user to be able to select multiple specs.
this.selectionMode = selectionMode || SpecPicker.SelectionMode.Single;

// Perform the initial fetch to load data into the view from your own controllers
//config#specPickerData
this._specDataView = dataContext.robotData.specDataEntity.createView(container);
this._specDataView.fetch({}).then(
    () => {
        const specData = ko.toJS(this._specDataView.item());
        // Pass the spec data into an observable
        this._specData(specData);
    },
    () => {
        // Implement custom error handling logic
        throw new Error("Fetch spec data failed.");
    }
);
//config#specPickerData

// a computed which returns an array of spec ids which will determine what specs will be shown
const filteredSpecIds = ko.computed(container, () => {
    const input = this.input();
    if (!input) {
        return [];
    }
    // Options is a property passed in as part of the blade inputs. Defaults to any type
    const options = input.options;
    const filterFeatures: string[] = options && options.filterFeatures || [];

    // React to the input availableSpecData observable. This observable is updated
    // when billing information returns from the server and contains specs which have not
    // been filtered out by the billing calls.
    return input.availableSpecData().filter((spec) => {
        // This will filter out any spec which contains the feature in input.options.filterFeatures
        return !MsPortalFx.find(spec.features, (feature) => (feature.displayValue !== null && feature.displayValue !== undefined) && !!~filterFeatures.indexOf(feature.displayValue.toString()));
    }).map((spec) => spec.id);
});
ko.reactor(container, () => {
    // react to inputs and specData observables being updated
    const input = this.input(),
        specData = this._specData();

    if (!input || !specData) {
        return;
    }

    const output: SpecPicker.SpecPickerExtenderOutput = {
        specData: specData,
        //disabledSpecs: [],
        //failureMessage: "",
        //recentSpecIds: [],
        filteredSpecIds: filteredSpecIds,
    };
    // Update the output observable to give all the spec data back to the spec picker blade
    this.output(output);
});

```

The data fetching part is where you're code will bring all of the spec picker data into the output.
```typescript

this._specDataView = dataContext.robotData.specDataEntity.createView(container);
this._specDataView.fetch({}).then(
    () => {
        const specData = ko.toJS(this._specDataView.item());
        // Pass the spec data into an observable
        this._specData(specData);
    },
    () => {
        // Implement custom error handling logic
        throw new Error("Fetch spec data failed.");
    }
);

```

The data in here will have the information that will be shown on the specs and as well as the `ResourceMap` information used to look up pricing from billing.

<a name="pricing-tier-sample-spec-data"></a>
### Sample Spec Data
Sample Spec
```typescript

{
    "id": "Standard_D15_v2",
    "colorScheme": "mediumBlue", //available colors: "mediumBlue", "yellowGreen", "darkOrchid", "orange""
    "title": "Standard",
    "specCode": "D15_v2",
    "promotedFeatures": [
        {
            "id": "cores",
            "value": "20",
            "unitDescription": "Cores",
        },
        {
            "id": "ram",
            "value": "140",
            "unitDescription": "GB",
        },
    ],
    "features": [
        {
            "id": "disks",
            "displayValue": "40",
        },
        {
            "id": "iops",
            "displayValue": "40x500",
        },
        {
            "id": "ssdCache",
            "displayValue": "1000 GB",
        },
        {
            "id": "loadBalancing",
            "displayValue": "",
        },
        {
            "id": "autoScale",
            "displayValue": "",
        },
    ],
    "cost": {
        "currencyCode": "USD",
        "caption": "{0}/Month (Estimated)",
    },
},

```
Sample Features
```typescript

{
    "id": "disks",
    "displayName": "Data disks",
    "iconSvgData": "<svg viewBox=\"0 0 50 50\" class=\"msportalfx-svg-placeholder\" > <path d=\"M50,37.198c0,5.001-11.194,9.054-25,9.054S0,42.199,0,37.198v-4.88h50V37.198z\" class=\"msportalfx-svg-c14\"/> <path d=\"M50,32.318c0,5.001-11.194,9.054-25,9.054S0,37.319,0,32.318c0-5,11.193-9.054,25-9.054S50,27.318,50,32.318 \" class=\"msportalfx-svg-c13\"/> <path d=\"M33.013,31.797c0,1.33-3.588,2.407-8.014,2.407s-8.015-1.077-8.015-2.407s3.589-2.407,8.015-2.407 S33.013,30.468,33.013,31.797\" class=\"msportalfx-svg-c14\"/> <path opacity=\"0.25\" d=\"M43.071,26.115c-3.502-1.327-8.104-2.269-13.279-2.633l-3.244,6.004 c1.596,0.094,3.023,0.329,4.127,0.662L43.071,26.115z\" class=\"msportalfx-svg-c01\"/> <path opacity=\"0.25\" d=\"M5.902,38.208c3.601,1.543,8.598,2.643,14.288,3.045l3.793-7.02 c-1.579-0.06-3.014-0.257-4.168-0.552L5.902,38.208z\" class=\"msportalfx-svg-c01\"/> <path d=\"M50,17.682c0,5.001-11.194,9.054-25,9.054S0,22.682,0,17.682v-4.88h50V17.682z\" class=\"msportalfx-svg-c19\"/> <path d=\"M50,12.802c0,5.001-11.194,9.054-25,9.054S0,17.802,0,12.802s11.193-9.054,25-9.054S50,7.801,50,12.802\" class=\"msportalfx-svg-c15\"/> <path d=\"M33.013,12.281c0,1.33-3.588,2.407-8.014,2.407s-8.015-1.077-8.015-2.407s3.589-2.407,8.015-2.407 S33.013,10.951,33.013,12.281\" class=\"msportalfx-svg-c19\"/> <path opacity=\"0.25\" d=\"M43.071,6.549c-3.502-1.327-8.104-2.269-13.279-2.633L26.548,9.92 c1.596,0.094,3.023,0.329,4.127,0.662L43.071,6.549z\" class=\"msportalfx-svg-c01\"/> <path opacity=\"0.25\" d=\"M5.902,18.642c3.601,1.543,8.598,2.643,14.288,3.045l3.793-7.02 c-1.579-0.06-3.014-0.257-4.168-0.552L5.902,18.642z\" class=\"msportalfx-svg-c01\"/> </svg>",
},
{
    "id": "iops",
    "displayName": "Max IOPS",
    "iconName": "Monitoring",
},

```
Sample Resource Map
```typescript

"default": [ // List of spec cards
    {
        "id": "Standard_D15_v2", // Roundtrip spec card ID of your choice to track request/response
        "firstParty": [ // list of first party
            {
                "id": "STANDARD_D15_V2",
                "resourceId": "4naypwzhqsu7yaeruxj3fpqa5ah5p9ax4nayrti71j3x5pdwtc7y4imyqeyy6a", // resource target key for this spec (you can use GUID now) work with PM if you don’t know this
                "quantity": 744, // quantity based on the unit of measure in the Catalog
            },
        ],
        "thirdParty": [ // list of third party resources, this is used for Marketplace, usually not used for Microsoft resource
            {
                "id": "samplecloudconnect:sample:samplebackup",
                "publisherId": "sample",
                "offerId": "samplecloudconnect",
                "planId": "samplebackup",
                "promotionCode": "",
                "meters": [
                    {
                        "meterId": "20core",
                        "quantity": 744,
                    },
                ],
            },
        ],
    },
    
```

For the resourceIds in the resource map, you'll need to cooridanate with billing to add any new resource ids in your spec picker.
The `default` resource map will be used if no region is specified as part of the spec picker blade inputs.

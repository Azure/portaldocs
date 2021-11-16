<a name="monitor-chart-v2"></a>
## Monitor Chart V2
This control allows you to plot the multi-dimensional metrics for your resource in Azure with support for dimension based grouping and filters. It is part of the Ibiza framework, and it inherently knows how to fetch data for your resource.

<a name="monitor-chart-v2-benefits"></a>
### Benefits
- **Performance** - The charts are built to render quickly and make efficient network calls for data
- **Multi-dimensional support** - The charts support grouping and filtering on the dimensions from your multi-dimensional metric data.

<a name="monitor-chart-v2-pre-requisites-onboard-to-monitor-config"></a>
### Pre-requisites: Onboard to Monitor config
If you are onboarding to Azure Monitor for the first time, please reach out to the [Monitoring team](mailto:monitoringcontrib@microsoft.com).

The Monitoring team will add your resource type to a config which allows the Monitor Control to know how to fetch metrics for your resources.


<a name="monitor-chart-v2-using-the-control"></a>
### Using the control
```typescript
import * as MonitorChartV2 from "Fx/Controls/MonitorChartV2";

...

// Create the MonitorChart options
const chartInputs: MonitorChartV2.Options = {
            metrics: [
                {
                    resourceMetadata: {
                        id: "subscription/resource/id"
                    },
                    name: "exceptions/count",
                    aggregationType: MonitorChartV2.Metric.AggregationType.Sum
                }
            ]
};

const const timespan: MonitorChartV2.Timespan = {
    relative: {
        /* One day in Milliseconds */
        duration: 1 * 24 * 60 * 60 * 1000
    }
};

// Create the MonitorChart viewmodel
const monitorChartViewModel =MonitorChartV2.create(bladeOrPartContainer, monitorChartOptions);
```

> You can plot more than one metric on the chart referencing the control. Also you can specify the dimensions to segment the data by and set of filters to filter the data.

> To see a complete list of the options you can pass to the control, look at the `Fx/Controls/MonitorChartV2` module in Fx.d.ts, or you can [view the interfaces directly in the PortalFx repo][4].

<a name="monitor-chart-v2-try-it-out-in-samples-extension"></a>
### Try it out in samples extension
You can try out the monitor chart v2 control in the [Samples Extension][1], or view the code directly in the Samples Extension at:

`\Client\V2\Preview\MonitorChartV2\MonitorChartV2Blade.ts`

The sample has a static chart from dummy app on top and a configurable chart below it with various options. You can add a single or multiple metrics to the chart, Add a threshold on the first metric and adjust its value, add grouping/segmentation to the chart on selected dimensions and add filters to the chart.

![Metrics chart control single input][2]

<a name="monitor-chart-v2-end-to-end-flow-for-users"></a>
### End-to-end flow for users

<a name="monitor-chart-v2-end-to-end-flow-for-users-overview-blade"></a>
#### Overview blade
Once you reference the monitor chart control in your overview blade, it will look similar to the following screenshot:

![Monitor chart control overview blade][3]

<a name="monitor-chart-v2-legacy-blade-usage"></a>
### Legacy blade usage
<a name="monitor-chart-v2-using-the-control-on-a-locked-unlocked-blade"></a>
### Using the control on a locked/unlocked blade
If you are not using a template blade, you can reference the `MonitorChartPart` from the `HubsExtension` in your blade's pdl.

> Ensure that you have the HubsExtension.pde added to your extension. You can get the HubsExtension.pde and the MonitorChartPart.d.ts file from Microsoft.Portal.Extensions.Hubs.<<Build#>>.nupkg

**Example Blade PDL:**
```xml
<Definition xmlns="http://schemas.microsoft.com/aux/2013/pdl"
            xmlns:azurefx="http://schemas.microsoft.com/aux/2013/pdl/azurefx"
            Area="MyArea">

  <AdaptedPart Name="MyMonitorChartPartAdapter"
    AdapterViewModel="{ViewModel Name=MonitorChartPartAdapter, Module=./MonitorChartPartAdapter}">

    <AdaptedPart.InputDefinitions>
      <InputDefinition Name="id" Type="MsPortalFx.ViewModels.ResourceId" />
    </AdaptedPart.InputDefinitions>

    <PartReference Name="MyMonitorChartPart" Extension="HubsExtension" PartType="MonitorChartPart">
      <PartReference.PropertyBindings>
        <Binding Property="options" Source="{Adapter options}" />
      </PartReference.PropertyBindings>
    </PartReference>

  </AdaptedPart>

  <Blade Name="MyBlade"
         ViewModel="{ViewModel Name=MyBladeViewModel, Module=./MyBlade}">
    <Lens Name="MonitoringLens">

      <PartReference Name="MyPart" PartType="MyMonitorChartPartAdapter" InitialSize="HeroWide">
        <PartReference.PropertyBindings>
            <Binding Property="id">
                <BladeParameter Property="id"/>
            </Binding>
        </PartReference.PropertyBindings>
      </PartReference>

    </Lens>
  </Blade>

</Definition>
```

**Example Blade view model:**
```typescript
import * as Blade from "Fx/Composition/Pdl/Blade";

export class MonitorChartTestBladeViewModel {
    constructor(container: Blade.Container, initialState: any, dataContext: any) {
    }

    public onInputsSet(inputs: any): Q.Promise<void> {
        return Q();
    }
}
```

**Example Adapted part view model:**
```typescript
/// <reference path="../../_extensions/Hubs/Definitions/MonitorChartPart.d.ts />
import AggregationType = HubsExtension.MonitorChartPart.Metrics.AggregationType;
import MonitorChartPartOptions = HubsExtension.MonitorChartPart.Options;

export class MonitorChartPartAdapter {
    public options: KnockoutObservable<MonitorChartPartOptions>;

    constructor(container: any, initialState: any, dataContext: any) {
        this.options = ko.observable({
            chart: {
                title: "My chart title",
                metrics: [
                    {
                        resourceMetadata: {
                            id: "<resource id goes here>"
                        },
                        name: "<metric name goes here>",
                        aggregationType: AggregationType.Avg
                    }
                ],
                timespan: {
                    relative: {
                        duration: 1 * 24 * 60 * 60 * 1000 // 1 day in milliseconds
                    }
                }
            }
        });
    }
}
```

> To see a complete list of the options you can pass to the MonitorChartPart, look at the `MonitorChartPart.d.ts` file either in the Hubs Nuget package, or [directly in the Hubs repo][5].
> For an easy way to generate the correct config for the part or control, go to the Monitoring Extension, open the Metrics blade, configure the metric chart you want, pin it to an empty dashboard, download the dashboard .json config file, look at the configuration generated for that pinned MonitorChartPart and use it for your own monitor chart part or control.

<!-- References -->
[1]: https://df.onecloud.azure-test.net/#blade/SamplesExtension/SDKMenuBlade/monitorchartv2
[2]: ../media/portalfx-controls-monitor-chart-v2/monitor-chart-v2-control-sample.png
[3]: ../media/portalfx-controls-monitor-chart-v2/monitor-chart-v2-control-overview-blade.png
[4]: https://msazure.visualstudio.com/DefaultCollection/One/_git/AzureUX-PortalFX?path=%2Fsrc%2FSDK%2FFramework.Client%2FTypeScript%2FFx%2FControls%2FMonitorChartV2.ts&version=GBproduction&_a=contents
[5]: https://msazure.visualstudio.com/DefaultCollection/One/_git/AzureUX-PortalFX?path=%2Fsrc%2FSDK%2FExtensions%2FHubsExtension%2FTypeScript%2FHubsExtension%2FForExport%2FMonitorChartPart.d.ts&_a=contents

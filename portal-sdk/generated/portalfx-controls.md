* [Controls](#controls)
    * [Date and Time](#controls-date-and-time)
    * [Drop downs](#controls-drop-downs)
        * [Migrating from older dropdown controls](#controls-drop-downs-migrating-from-older-dropdown-controls)
    * [Editors](#controls-editors)
        * [Editor](#controls-editors-editor)
    * [Console](#controls-console)
    * [Forms](#controls-forms)
    * [Lists](#controls-lists)
    * [Helpers and Indicators](#controls-helpers-and-indicators)
    * [Visualizing Data](#controls-visualizing-data)
        * [Chart views and series views](#controls-visualizing-data-chart-views-and-series-views)
        * [Metrics](#controls-visualizing-data-metrics)
        * [Metrics rules](#controls-visualizing-data-metrics-rules)
    * [Donut chart](#controls-donut-chart)


<a name="controls"></a>
# Controls

Controls are the building blocks of your experience. They allow users to view, edit, and analyze data.

To learn more about any of our controls, click on any of the links below.

- [Button](http://aka.ms/portalfx/samples#blade/SamplesExtension/SimpleButtonInstructions/selectedItem/SimpleButtonInstructions/selectedValue/SimpleButtonInstructions)
- [Copyable Label](http://aka.ms/portalfx/samples#blade/SamplesExtension/CopyableLabelInstructions/selectedItem/CopyableLabelInstructions/selectedValue/CopyableLabelInstructions)
- [File Upload (async)](http://aka.ms/portalfx/samples#blade/SamplesExtension/AsyncFileUploadInstructions/selectedItem/AsyncFileUploadInstructions/selectedValue/AsyncFileUploadInstructions)
- [File Download Button](http://aka.ms/portalfx/samples#blade/SamplesExtension/FileDownloadButtonInstructions/selectedItem/FileDownloadButtonInstructions/selectedValue/FileDownloadButtonInstructions)
- [Text Block](https://df.onecloud.azure-test.net/?samplesExtension=true#blade/SamplesExtension/TextBlockInstructions/selectedItem/TextBlockInstructions/selectedValue/TextBlockInstructions)
- [OAuth Button](http://aka.ms/portalfx/samples#blade/SamplesExtension/OAuthButtonInstructions/selectedItem/OAuthButtonInstructions/selectedValue/OAuthButtonInstructions)
- [Splitter](http://aka.ms/portalfx/samples#blade/SamplesExtension/SplitterInstructions/selectedItem/SplitterInstructions/selectedValue/SplitterInstructions)
- [Selector](http://aka.ms/portalfx/samples#blade/SamplesExtension/SelectorInstructions/selectedItem/SelectorInstructions/selectedValue/SelectorInstructions)
- [Settings](http://aka.ms/portalfx/samples#blade/SamplesExtension/SettingsInstructions/selectedItem/SettingsInstructions/selectedValue/SettingsInstructions)
- [Single Setting](http://aka.ms/portalfx/samples#blade/SamplesExtension/SingleSettingInstructions/selectedItem/SingleSettingInstructions/selectedValue/SingleSettingInstructions)
- [Toolbar](http://aka.ms/portalfx/samples#blade/SamplesExtension/ToolbarInstructions/selectedItem/ToolbarInstructions/selectedValue/ToolbarInstructions)
- [Markdown Control](http://aka.ms/portalfx/samples#blade/SamplesExtension/MarkdownInstructions/selectedItem/MarkdownInstructions/selectedValue/MarkdownInstructions)


<a name="controls-date-and-time"></a>
## Date and Time

- [Date Picker](http://aka.ms/portalfx/samples#blade/SamplesExtension/DatePickerInstructions/selectedItem/DatePickerInstructions/selectedValue/DatePickerInstructions)
- [Date/Time Picker](http://aka.ms/portalfx/samples#blade/SamplesExtension/DateTimePickerInstructions/selectedItem/DateTimePickerInstructions/selectedValue/DateTimePickerInstructions)
- [Date/Time Range Picker](http://aka.ms/portalfx/samples#blade/SamplesExtension/DateTimeRangePickerInstructions/selectedItem/DateTimeRangePickerInstructions/selectedValue/DateTimeRangePickerInstructions)
- [Date Polyfills](http://aka.ms/portalfx/samples#blade/SamplesExtension/DatePolyFillsInstructions/selectedItem/DatePolyFillsInstructions/selectedValue/DatePolyFillsInstructions)
- [Day Picker](http://aka.ms/portalfx/samples#blade/SamplesExtension/DayPickerInstructions/selectedItem/DayPickerInstructions/selectedValue/DayPickerInstructions)
- [Duration Picker](http://aka.ms/portalfx/samples#blade/SamplesExtension/DurationPickerInstructions/selectedItem/DurationPickerInstructions/selectedValue/DurationPickerInstructions)
- [Time Picker](http://aka.ms/portalfx/samples#blade/SamplesExtension/TimePickerInstructions/selectedItem/TimePickerInstructions/selectedValue/TimePickerInstructions)

<a name="controls-drop-downs"></a>
## Drop downs
- Drop Down
	## DropDown
We've had several version of the dropdown control but have asked partners to standardize on the AMD dropdown control.
You can use it by importing the AMD module:

```
import * as DropDown from "Fx/Controls/DropDown";
```

creating the view model:

```
var dropDown = new DropDown.ViewModel(ltm, {...});
```

and then inserting it into a section or your HTML template via the pcControl binding. You can see it running
in samples extension [here](http://aka.ms/portalfx/samples#blade/SamplesExtension/DropDownInstructions/selectedItem/DropDownInstructions/selectedValue/DropDown).

<a name="controls-drop-downs-migrating-from-older-dropdown-controls"></a>
### Migrating from older dropdown controls
The biggest reason to replace usage of the older dropdown controls with the AMD dropdown is that all the features
of the other dropdowns are now present in the AMD dropdown. You can now turn on filtering or add grouping to a 
multiselect dropdown where previously adding a featuring might mean porting your code to a differen control (or 
wasn't possible depending on combination of features you were looking for). The AMD dropdown supports:

- Grouping
- Rich Templating
- Filtering 
- Custom Filtering, this also gives you a hook to replace items on keystroke.
- Multiselect
- Objects as the value

<a name="controls-editors"></a>
## Editors

- Code editor
       
<a name="controls-editors-editor"></a>
### Editor

Editor control in the FX SDK is a wrapper for the "Monaco" editor which supports various languages, syntax highligting, intellisense, real-time syntax checking and validation.

![Editor][editor-code]

<a name="controls-editors-editor-editor-basics"></a>
#### Editor Basics

To use the editor, compose a part that hosts the editor control, then use it from your extension.

You can control the behavior and features of the editor via initialization `options`.

**Step 1**: Define the Html template for your part:

`\Client\V1\Controls\Editor\Templates\EditorInstructions.html`

**Step 2**: Create a viewmodel to bind your control to. SampleEditorViewModel implements the viewmodel for the editor.

`\Client\V1\Controls\Editor\ViewModels\EditorViewModels.ts.`

```typescript

/**
* ViewModel class for the editor sample.
*/
export class SampleEditorViewModel extends MsPortalFx.ViewModels.Controls.Documents.Editor.ViewModel {
   /**
    * Editor view model constructor.
    */
   constructor(lifetimeManager: MsPortalFx.Base.LifetimeManager) {
       // Mock up sample javascript file content.
       var content =
           [
               "function test1(name, job) {",
               "    alert('Welcome ' + name + ', the ' + job);",
               "}",
               "",
               "function test2() {",
               "    var x = '', i = 0;",
               "    for (i = 0; i < 10; i++) {",
               "        if (i == 3) {",
               "            continue;",
               "        }",
               "        x = x + 'The number is ' + i;",
               "    }",
               "    document.getElementById('demo').innerHTML = x;",
               "}"
           ].join("\n");

       // Set up whether or not to show line numbers and what the tab size is in the editor.
       var options = {
               lineNumbers: false,
               tabSize: 4,
               wrappingColumn: 0
           };

       // Initialize the editor with the above content and options, as well as set the type to be JavaScript.
       super(lifetimeManager, MsPortalFx.ViewModels.Controls.Documents.Editor.ContentType.JavaScript, content, options);
   }
}

/**
* ViewModel class for the editor sample part.
*/
export class EditorInstructionsPartViewModel
   implements Def.EditorInstructionsPartViewModel.Contract {

   /**
    * View model for the editor.
    */
   public editorVM: MsPortalFx.ViewModels.Controls.Documents.Editor.Contract;

   /**
    * View model for the save button.
    */
   public saveButton: MsPortalFx.ViewModels.Controls.Forms.Button.Contract;

   /**
    * Creates a new instance of the EditorInstructionsPartViewModel class.
    *
    * @param container The view model for the part container.
    * @param initialState The initial state for the part.
    * @param dataContext The data context.
    */
   constructor(
       container: MsPortalFx.ViewModels.PartContainerContract,
       initialState: any,
       dataContext: ControlsArea.DataContext) {

       // Initialize the editor view model.  If we were getting the data from teh data context, we would pass it in here.
       this.editorVM = new SampleEditorViewModel(container);

       // Initialize the save button and wire it up such that it saves the content of the editor.
       this.saveButton = new MsPortalFx.ViewModels.Controls.Forms.Button.ViewModel(container);
       this.saveButton.click = () => {
           this.editorVM.save.execute().then(() => {
               // Here is where you would put code that is executed after any changes have been written back to the content property on the viewmodel.
           });
       };
   }
}

```

**Step 3**: Now you can consume your part from an extension by referencing it in the PDL:

`\Client\V1\Controls\Editor\Editor.pdl`

```xml

<CustomPart Name="b_EditorInstructions_part1"
            ViewModel="{ViewModel Name=EditorInstructionsPartViewModel, Module=./Editor/ViewModels/EditorViewModels}"
            InitialSize="FullWidthFitHeight"
            Template="{Html Source='Templates\\EditorInstructions.html'}" />
<PartReference Name="EditorApiReferencePart"
               InitialSize="FullWidthFitHeight"
               PartType="ModuleReferencePart">
  <PartReference.PropertyBindings>
    <Binding Property="moduleName"
             Source="{Constant MsPortalFx.ViewModels.Controls.Documents.Editor}" />
  </PartReference.PropertyBindings>
</PartReference>

```

[editor-code]: ../media/portalfx-controls/editor-code.png

<a name="controls-editors-editor-editor-with-custom-language"></a>
#### Editor with Custom Language

Custom language can be used by declaring inherited Editor control viewmodel with rules and suggestions.

**Step 1**: Define the Html template for your part:

`\Client\V1\Controls\Editor\Templates\CustomLanguageEditor.html`

**Step 2**: Create a viewmodel to bind your control to. SampleEditorViewModel implements the viewmodel for the editor.

`\Client\V1\Controls\Editor\ViewModels\CustomLanguageEditorViewModels.ts.`

/**
 * ViewModel class for the custom language editor sample part.
 */
export class CustomLanguageEditorPartViewModel {

    /**
     * View model for the editor.
     */
    public editor: Editor.ViewModel;

    /**
     * Creates a new instance of the EditorInstructionsPartViewModel class.
     *
     * @param container The view model for the part container.
     * @param initialState The initial state for the part.
     * @param dataContext The data context.
     */
    constructor(
        container: MsPortalFx.ViewModels.PartContainerContract,
        initialState: any,
        dataContext: ControlsArea.DataContext) {

        // Initialize the editor view model.  If we were getting the data from teh data context, we would pass it in here.
        this.editor = new CustomLanguageEditorViewModel(container);

        // create the initial markers
        this.updateMarkers(this.editor.content());

        // whenever the code in the editor changes process it and set the markers
        this.editor.content.subscribe(container, this.updateMarkers.bind(this));

        // perform auto save every 500ms to update markers as the user edits the text
        this.editor.autoSaveTimeout(500);
    }

    /**
     * try to match the given pattern in the provided line, if matched construct a marker for that line
     */
    private processTerm(line: string, lineIndex: number, termPattern: string, severity: MsPortalFx.ViewModels.Controls.Documents.Editor.MarkerSeverity): MsPortalFx.ViewModels.Controls.Documents.Editor.EditorMarker {

        // try to match the pattern
        var termIndex = line.indexOf(termPattern);
        if (termIndex === -1) {
            return null;
        }

        // we found the pattern in the line so we create a marker which uses the defined severity and the rest of the text
        // from the pattern location in the line to the end as the message
        return <MsPortalFx.ViewModels.Controls.Documents.Editor.EditorMarker> {
            message: line.substring(termIndex + termPattern.length),
            severity: severity,
            range: <MsPortalFx.ViewModels.Controls.Documents.Editor.EditorRange> {
                startLineNumber: lineIndex + 1,
                startColumn: termIndex + 1,
                endLineNumber: lineIndex + 1,
                endColumn: termIndex + termPattern.length + 1
            }
        };
    }

    /**
     * updates the markers according to the text content
     */
    private updateMarkers(value: string): void {

        // split the text into lines and process each to add an annotation to it
        var markers = value
            .split("\n")
            .map((line: string, index: number): MsPortalFx.ViewModels.Controls.Documents.Editor.EditorMarker => {

                var term = this.processTerm(line, index, "[error]", MsPortalFx.ViewModels.Controls.Documents.Editor.MarkerSeverity.Error);
                if (term !== null) {
                    return term;
                }

                term = this.processTerm(line, index, "[notice]", MsPortalFx.ViewModels.Controls.Documents.Editor.MarkerSeverity.Warning);
                if (term !== null) {
                    return term;
                }

                term = this.processTerm(line, index, "[info]", MsPortalFx.ViewModels.Controls.Documents.Editor.MarkerSeverity.Info);
                if (term !== null) {
                    return term;
                }

                return null;
            })
            .filter(marker => marker !== null);

        // update the markers
        this.editor.markers(markers);
    }
}

**Step 3**: Now you can consume your part from an extension by referencing it in the PDL:

`\Client\V1\Controls\Editor\Editor.pdl`

```xml
<CustomPart Name="b_EditorInstructions_part1"
                  ViewModel="{ViewModel Name=EditorInstructionsPartViewModel, Module=./Editor/ViewModels/EditorViewModels}"
                  InitialSize="FullWidthFitHeight"
                  Template="{Html Source='Templates\\EditorInstructions.html'}" />
<PartReference Name="EditorApiReferencePart"
                InitialSize="FullWidthFitHeight"
                PartType="ModuleReferencePart">
    <PartReference.PropertyBindings>
        <Binding Property="moduleName"
                Source="{Constant MsPortalFx.ViewModels.Controls.Documents.Editor}" />
    </PartReference.PropertyBindings>
</PartReference>
```

- [Diff editor](http://aka.ms/portalfx/samples#blade/SamplesExtension/DiffEditorInstructions/selectedItem/DiffEditorInstructions/selectedValue/DiffEditorInstructions)
- Console
      
<a name="controls-console"></a>
## Console
The console control provides a REPL like experience which can be used to replicate a Bash/PowerShell/Batch like experience.

![Console](../media/portalfx-controls/console-large.png)

`\SamplesExtension\Extension\Client\Controls\Console\Templates\ConsoleInstructions.html`

```html
<div data-bind='pcConsole: consoleViewModel'></div>
```

`\SamplesExtension\Extension\Client\Controls\Console\ViewModels\ConsoleViewModels.ts`

```ts
public consoleViewModel: MsPortalFx.ViewModels.Controls.Console.Contract;

constructor(container: MsPortalFx.ViewModels.PartContainerContract,
			initialState: any,
			dataContext: ControlsArea.DataContext) {

    // Initialize the console view model.
    this.consoleViewModel = new MsPortalFx.ViewModels.Controls.Console.ViewModel();

    // To get input from the user, subscribe to the command observable.
    // This is where you would parse the incomming command.
    // To show output, you can set the info, warning, success and error properties.
    this.consoleViewModel.command.subscribe(container, (s) => {
        // In this example, we are just piping back the input as an info, warning, success or error message based off of what you type in.
        switch (s) {
            case ClientResources.consoleInfo:
                this.consoleViewModel.info(s);
                break;
            case ClientResources.consoleWarning:
                this.consoleViewModel.warning(s);
                break;
            case ClientResources.consoleSuccess:
                this.consoleViewModel.success(s);
                break;
            case ClientResources.consoleError:
                this.consoleViewModel.error(s);
                break;
            default:
                this.consoleViewModel.error(s);
        }
    });

    // You can also observably set the prompt which is displayed above the > in the console.
    this.consoleViewModel.prompt = ko.observable(ClientResources.consolePrompt);
}
```


<a name="controls-forms"></a>
## Forms
- Check Box
  - [Standard Check Box](http://aka.ms/portalfx/samples#blade/SamplesExtension/CheckBoxInstructions)
  - [Tri State Check Box](http://aka.ms/portalfx/samples#blade/SamplesExtension/TriStateCheckBoxInstructions)
- [Custom HTML](http://aka.ms/portalfx/samples#blade/SamplesExtension/CustomFormFieldsBlade)

- Text Boxes
  - [MultiLine Text Box](http://aka.ms/portalfx/samples#blade/SamplesExtension/MultiLineTextBoxInstructions/selectedItem/MultiLineTextBoxInstructions/selectedValue/MultiLineTextBoxInstructions)
  - [Numeric Text Box](http://aka.ms/portalfx/samples#blade/SamplesExtension/NumericTextBoxInstructions/selectedItem/NumericTextBoxInstructions/selectedValue/NumericTextBoxInstructions)
  - [Text Box](http://aka.ms/portalfx/samples#blade/SamplesExtension/TextBoxInstructions/selectedItem/TextBoxInstructions/selectedValue/TextBoxInstructions)
  
- [Option Picker](http://aka.ms/portalfx/samples#blade/SamplesExtension/OptionPickerInstructions/selectedItem/OptionPickerInstructions/selectedValue/OptionPickerInstructions)

- [Password Box](http://aka.ms/portalfx/samples#blade/SamplesExtension/PasswordInstructions/selectedItem/PasswordInstructions/selectedValue/PasswordInstructions)

- [Search Box](http://aka.ms/portalfx/samples#blade/SamplesExtension/SearchBoxBlade/selectedItem/SearchBoxBlade/selectedValue/SearchBoxBlade)

- Sliders
  - [Standard Slider](http://aka.ms/portalfx/samples#blade/SamplesExtension/SliderInstructions/selectedItem/SliderInstructions/selectedValue/SliderInstructions)
  - [Custom Value Slider](http://aka.ms/portalfx/samples#blade/SamplesExtension/SlidersInstructions/selectedItem/SlidersInstructions/selectedValue/SlidersInstructions)
  - [Range Slider](http://aka.ms/portalfx/samples#blade/SamplesExtension/RangeSliderInstructions/selectedItem/RangeSliderInstructions/selectedValue/RangeSliderInstructions)
  - [Custom Range Slider](http://aka.ms/portalfx/samples#blade/SamplesExtension/RangeSliderInstructions/selectedItem/CustomRangeSliderInstructions/selectedValue/CustomRangeSliderInstructions)

<a name="controls-lists"></a>
## Lists

- [Gallery](http://aka.ms/portalfx/samples#blade/SamplesExtension/GalleryInstructions/selectedItem/GalleryInstructions/selectedValue/GalleryInstructions)
- [List View](http://aka.ms/portalfx/samples#blade/SamplesExtension/ListViewInstructions/selectedItem/ListViewInstructions/selectedValue/ListViewInstructions)
- [Tree View](http://aka.ms/portalfx/samples#blade/SamplesExtension/TreeViewInstructions/selectedItem/TreeViewInstructions/selectedValue/TreeViewInstructions)
- [String List](http://aka.ms/portalfx/samples#blade/SamplesExtension/StringListInstructions/selectedItem/StringListInstructions/selectedValue/StringListInstructions)
- [Query Builder](http://aka.ms/portalfx/samples#blade/SamplesExtension/QueryBuilderInstructions/selectedItem/QueryBuilderInstructions/selectedValue/QueryBuilderInstructions)
- Grid
    [Grid](portalfx-controls-grid.md)

<a name="controls-helpers-and-indicators"></a>
## Helpers and Indicators

- [Docked Balloon](http://aka.ms/portalfx/samples#blade/SamplesExtension/DockedBalloonInstructions/selectedItem/DockedBalloonInstructions/selectedValue/DockedBalloonInstructions)
- [Info Box](http://aka.ms/portalfx/samples#blade/SamplesExtension/InfoBoxInstructions/selectedItem/InfoBoxInstructions/selectedValue/InfoBoxInstructions)
- [Progress Bar](http://aka.ms/portalfx/samples#blade/SamplesExtension/ProgressBarInstructions/selectedItem/ProgressBarInstructions/selectedValue/ProgressBarInstructions)

<a name="controls-visualizing-data"></a>
## Visualizing Data

- Chart
    ## Charts
Insert chart controls in your experience to allow your users to visualize and analyze their data.

[Chart](../media/portalfx-ui-concepts/chart.png)

In most cases, you will probably want to use the chart [intrinsic part](portalfx-.md). The intrinsic part is maintained by the framework and will provide you with consistent layout with the rest of the portal.

If you are using a custom part template, charts can be added with the following html:

```xml
<div data-bind='pcChart: chartVM' style='height:500px'></div>
```

<a name="controls-visualizing-data-chart-views-and-series-views"></a>
### Chart views and series views

Our charts include the following **chart view** types which can be used separately or in tandem:

* Line
* Grouped bar
* Stacked bar
* Scatter
* Area
* Stacked area 

Chart views are the high-level view type for your chart.

```ts
// Initialize the view.  This is the code that makes this chart a bar chart.
var barChartView = new MsPortalFx.ViewModels.Controls.Visualization.Chart.BarChartView<string, number>(MsPortalFx.ViewModels.Controls.Visualization.Chart.BarChartType.Grouped);
this.chartVM.views([barChartView]);
```

A sample chart viewmodel with a single chart view type can be found here:
`\Client\Controls\Chart\ViewModels\BarChartViewModels.ts`

A sample chart viewmodel with multiple chart view types can be found here:
`\Client\Controls\Chart\ViewModels\OverlayedViewChartViewModel.ts`

**Series views** are visualizations of individual data series. Series views allow you to modify the color, display name, and interaction behavior of a particular series.

By default, series views will be generated for each of the chart views and each of the data series you add to your chart. For example, let's say you added three data series, seriesA, seriesB, and seriesC to a chart that has two chart views, a bar chart view and a line chart view. Your chart would have 6 series views, a bar chart series view and a line chart series view for each series. This default behavior is ideal for simple charts, especially those with one chart view type.

In some cases you may want to do some more interesting things with series views. Perhaps instead you want seriesA and seriesB to be visualized as bars and seriesC to be visualized as a line. To achieve this behavior you will need to turn off the auto-generate behavior.

```ts
this.chartVM.autogenerateSeriesViews(false);
```

You can then create and specialize your series views however you'd like.

```ts
var lineSeriesView = new MsPortalFx.ViewModels.Controls.Visualization.Chart.LineChartSeriesView<string, number>();
lineSeriesView.seriesName("LineSeries");
lineSeriesView.cssClass("msportalfx-bgcolor-c1");

var barSeriesView = new MsPortalFx.ViewModels.Controls.Visualization.Chart.SeriesView<string, number>(MsPortalFx.ViewModels.Controls.Visualization.Chart.BarChartType.Stacked);
barSeriesView.seriesName("BarSeries");

lineChartView.seriesView([lineSeriesView]);
barChartView.seriesView([barSeriesView]);
```

A good example of using the chart's auto-generated series views functionality is:
`\Client\Controls\Chart\ViewModels\LineChartDateBasedViewModels.ts`

To see a more advanced sample where series views are created explicitly by the extension see
`\Client\Controls\Chart\ViewModels\OverlayedViewChartViewModels.ts`

<a name="controls-visualizing-data-metrics"></a>
### Metrics
Metrics are the big data call-outs that pair with our chart controls to give the user interactive peeks into their data. Metrics can be configured manually by handling chart events, calculating values, and passing information to the metrics controls or by setting up metrics rules. 

![Chart metrics](../media/portalfx-ui-concepts/chartMetrics.png)

<a name="controls-visualizing-data-metrics-rules"></a>
### Metrics rules
Metrics rules are a rule-based system that automatically hooks up metric values to different user interactions. For instance, by default (when the user is not interacting with the chart area) you may want your chart metrics to show the average value of each data series. This rule can be configured like so:

```ts
metricRule1.scope(Chart.MetricRuleScope.Default);
metricRule1_metric1.aggregationScope(Chart.MetricRuleAggregationScope.AllSeparately);
metricRule1_metric1.aggregationType(Chart.MetricRuleAggregationType.AverageY);
```

With this rule configured, when the user is not interacting with the chart area they will see one metric representing the average value of each data series on the chart.

See the following file for a full example of the metrics rules implementation:
`\Client\Controls\Chart\ViewModels\LineChartDateTimeViewModels.ts`


- Donut
  	
<a name="controls-donut-chart"></a>
## Donut chart

Donut charts are a great way to visualize proportional data.

![Donut](../media/portalfx-ui-concepts/donut.png)

Donuts can be added to your part templates with the following html:

```xml
<div data-bind='pcDonut: donutVM' style='height:500px; width:500px'></div>
```

A sample view model can be found here:

`\Client\Controls\Donut\ViewModels\DonutViewModels.ts`

Other visualization controls:

* [Chart](portalfx-controls-chart.md)

	
- Gauges
  - [Quota Gauge](http://aka.ms/portalfx/samples#blade/SamplesExtension/QuotaGaugeBlade)
  - [Single Value Gauge](http://aka.ms/portalfx/samples#blade/SamplesExtension/SingleValueGaugeBlade)
  - [Step Gauge](http://aka.ms/portalfx/samples#blade/SamplesExtension/StepGaugeBlade)
- Graphs
  - [Standard Graph](http://aka.ms/portalfx/samples#blade/SamplesExtension/graphInstructions)
  - [Custom Html Nodes](http://aka.ms/portalfx/samples#blade/SamplesExtension/graphCustomNodeInstructions)
- [Metrics](http://aka.ms/portalfx/samples#blade/SamplesExtension/MetricsInstructions/selectedItem/MetricsInstructions/selectedValue/MetricsInstructions)
- Maps
  - [Base Map](http://aka.ms/portalfx/samples#blade/SamplesExtension/BaseMapInstructions)
  - [Hexagon Layout Map](http://aka.ms/portalfx/samples#blade/SamplesExtension/HexagonMapInstructions)
- [Menu](http://aka.ms/portalfx/samples#blade/SamplesExtension/MenuInstructions/selectedItem/MenuInstructions/selectedValue/MenuInstructions)
- [Log Stream](http://aka.ms/portalfx/samples#blade/SamplesExtension/LogStreamInstructions/selectedItem/LogStreamInstructions/selectedValue/LogStreamInstructions)
- [Spec Comparison Table](http://aka.ms/portalfx/samples#blade/SamplesExtension/SpecComparisonTableInstructions/selectedItem/SpecComparisonTableInstructions/selectedValue/SpecComparisonTableInstructions)
- [Video Control](http://aka.ms/portalfx/samples#blade/SamplesExtension/VideoInstructions/selectedItem/VideoInstructions/selectedValue/VideoInstructions)
- [Legend](http://aka.ms/portalfx/samples#blade/SamplesExtension/Legend/selectedItem/Legend/selectedValue/Legend)
- [HotSpot](http://aka.ms/portalfx/samples#blade/SamplesExtension/HotSpotInstructions/selectedItem/HotSpotInstructions/selectedValue/HotSpotInstructions)
- [Video](http://aka.ms/portalfx/samples#blade/SamplesExtension/VideoInstructions/selectedItem/VideoInstructions/selectedValue/VideoInstructions)
- [Terminal Emulator](http://aka.ms/portalfx/samples#blade/SamplesExtension/TerminalEmulatorInstructionsBlade/selectedItem/TerminalEmulatorInstructionsBlade/selectedValue/TerminalEmulatorInstructionsBlade)


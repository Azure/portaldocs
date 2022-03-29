<a name="knockout-to-react-controls"></a>
# Knockout to React controls

If you're migrating an existing Knockout based blade to a ReactView you'll find that the FluentUI components aren't mapped one to one with the Knockout controls offering.

Given ReactViews allow access to the DOM, we'll only look to provide components which will impact the majority, this is mainly around base functionality and driving consistency efforts.
For anything bespoke or unique, extension authors have the freedom to self serve.

> Note: We're actively working to provide parity between the React and the Knockout component offerings, some controls don't have full parity yet.
> In those cases please feel free to [upvote an existing partner request or file a new one][React UserVoice] to help us prioritise investments.

Currently (*) charting is a known parity gap, we're working to provide a common charting solution.

| Knockout Control Name  | Knockout Control Namespace                    | React Component Name                                                                                                                                           |
| ---------------------- | --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Accordion              | Fx/Controls/Accordion                         | [FluentUI GroupedList][FluentUI GroupedList]                                                                                                                   |
| AreaChart              | Fx/Controls/AreaChart                         | * No Framework component provided, if charting is needed please see [D3 Sample][D3 Sample]                                                                     |
| ArmErrorList           | Fx/Controls/ArmErrorList                      | No Framework component provided                                                                                                                                |
| BarChart               | Fx/Controls/BarChart                          | * No Framework component provided, if charting is needed please see [D3 Sample][D3 Sample]                                                                     |
| BlobContainerDropDown  | Fx/Controls/Storage/BlobContainerDropDown     | No Framework component provided                                                                                                                                |
| Button                 | Fx/Controls/Button                            | [FluentUI Button][FluentUI Button]                                                                                                                             |
| CheckBox               | Fx/Controls/CheckBox                          | [FluentUI Checkbox][FluentUI Checkbox]                                                                                                                         |
| ClickableLink          | MsPortalFx.ViewModels.ClickableLink           | [AzurePortal-ReactView BladeLink][AzurePortal-ReactView BladeLink]                                                                                             |
| ComboBox               | Fx/Controls/ComboBox                          | [FluentUI ComboBox][FluentUI ComboBox]                                                                                                                         |
| Console                | Fx/Controls/Console                           | No Framework component provided                                                                                                                                |
| CopyableLabel          | Fx/Controls/CopyableLabel                     | [AzurePortal-ReactView CopyableLabel][AzurePortal-ReactView CopyableLabel]                                                                                     |
| CustomHtml             | Fx/Controls/CustomHtml                        | This is no longer applicable given ReactViews have DOM access                                                                                                  |
| DataGrid               | Fx/Controls/DataGrid                          | [FluentUI DetailsList][FluentUI DetailsList]                                                                                                                   |
| DatePicker             | Fx/Controls/DatePicker                        | [FluentUI DatePicker][FluentUI DatePicker]                                                                                                                     |
| DateTimePicker         | Fx/Controls/DateTimePicker                    | Requires custom configuration using [FluentUI TextField][FluentUI TextField] and [FluentUI DatePicker][FluentUI DatePicker]                                    |
| DateTimeRangePicker    | Fx/Controls/DateTimeRangePicker               | Requires custom configuration using [FluentUI TextField][FluentUI TextField] and [FluentUI DatePicker][FluentUI DatePicker]                                    |
| DayPicker              | Fx/Controls/DayPicker                         | [FluentUI DatePicker][FluentUI DatePicker]                                                                                                                     |
| Dialog                 |                                               | [AzurePortal-ReactView Dialog][AzurePortal-ReactView Dialog] for dialogs off the blade header, or use [FluentUI Dialog][FluentUI Dialog]                       |
| DiffEditor             | Fx/Controls/DiffEditor                        | No Framework component provided. Use [react-monaco-editor][ReactMonacoEditor] npm package, see [MonacoEditor Sample][MonacoEditor Sample]. Must also use ```--enableMonacoEditor```, see [reactview-build][ReactViewBuild]                      |
| DocsControl            | Fx/Controls/DocsControl                       | Not applicable                                                                                                                                                 |
| Donut                  | Fx/Controls/Donut                             | * No Framework component provided, if charting is needed please see [D3 Sample][D3 Sample]                                                                     |
| DropDown               | Fx/Controls/DropDown                          | [FluentUI Dropdown][FluentUI Dropdown]                                                                                                                         |
| DurationPicker         | Fx/Controls/DurationPicker                    | No specific component is available but this can be achieved using [FluentUI TextField][FluentUI TextField], see [DurationPicker Sample][DurationPicker Sample] |
| EditableGrid           | Fx/Controls/EditableGrid                      | [FluentUI DetailsList][FluentUI DetailsList] / AzurePortal-ReactView component is in-progress                                                                  |
| Editor                 | Fx/Controls/Editor                            | No Framework component provided. Use [react-monaco-editor][ReactMonacoEditor] npm package, see [MonacoEditor Sample][MonacoEditor Sample]. Must also use ```--enableMonacoEditor```, see [reactview-build][ReactViewBuild]                      |
| Essentials             | Fx/Controls/Essentials                        | [AzurePortal-ReactView Essentials][AzurePortal-ReactView Essentials]                                                                                           |
| FileDownload           | Fx/Controls/FileDownload                      | No Framework component provided                                                                                                                                |
| FileShareDropDown      | Fx/Controls/Storage/FileShareDropDown         | No Framework component provided                                                                                                                                |
| FileUpload             | Fx/Controls/FileUpload                        | [AzurePortal-ReactView FileUpload][AzurePortal-ReactView FileUpload]                                                                                           |
| FrameControl           | Fx/Controls/FrameControl                      | Not applicable                                                                                                                                                 |
| Graph                  | Fx/Controls/Graph                             | No Framework component provided                                                                                                                                |
| Hotspot                | Fx/Controls/HotSpot                           | [AzurePortal-ReactView BladeLink][AzurePortal-ReactView BladeLink]                                                                                             |
| InfoBalloon            | Fx/Controls/InfoBalloon                       | No Framework component provided, you can utilise [FluentUI Tooltip][FluentUI Tooltip]                                                                          |
| InfoBox                | Fx/Controls/InfoBox                           | [FluentUI MessageBar][FluentUI MessageBar]                                                                                                                     |
| Legend                 | Fx/Controls/Legend                            | * No Framework component provided, if charting is needed please see [D3 Sample][D3 Sample]                                                                     |
| LineChart              | Fx/Controls/LineChart                         | * No Framework component provided, if charting is needed please see [D3 Sample][D3 Sample]                                                                     |
| ListView               | Fx/Controls/ListView                          | [FluentUI DetailList][FluentUI List]                                                                                                                           |
| LocationDropdown       | Fx/Controls/LocationDropDown                  | [AzurePortal-ReactView LocationDropdown][AzurePortal-ReactView LocationDropdown]                                                                               |
| LogStream              | Fx/Controls/LogStream                         | No Framework component provided                                                                                                                                |
| Map                    | Fx/Controls/Map                               | No Framework component provided                                                                                                                                |
| Markdown               | Fx/Controls/Markdown                          | No Framework component provided                                                                                                                                |
| Menu                   | Fx/Controls/Menu                              | [FluentUI Nav][FluentUI Nav]                                                                                                                                   |
| Metrics                | Fx/Controls/Metrics                           | No Framework component provided                                                                                                                                |
| MonitorChartV2         | Fx/Controls/MonitorChart                      | https://aka.ms/metrics/mcr |
| MultiLineTextBox       | Fx/Controls/MultiLineTextBox                  | [FluentUI TextField][FluentUI TextField]                                                                                                                       |
| NumericTextBox         | Fx/Controls/NumericTextBox                    | [FluentUI TextField][FluentUI TextField], with a custom mask                                                                                                   |
| OAuthButton            | Fx/Controls/OAuthButton                       | Not applicable                                                                                                                                                 |
| OptionsGroup           | Fx/Controls/OptionsGroup                      | [FluentUI ChoiceGroup][FluentUI ChoiceGroup]                                                                                                                   |
| PasswordBox            | Fx/Controls/PasswordBox                       | [FluentUI TextField][FluentUI TextField]                                                                                                                       |
| Pill                   | Fx/Controls/Pill                              | [AzurePortal-ReactView Pills][AzurePortal-ReactView Pills]                                                                                                     |
| PillCollection         | Fx/Controls/PillCollection                    | [AzurePortal-ReactView PillCollection][AzurePortal-ReactView PillCollection]                                                                                   |
| PricingControl         | Fx/Controls/PricingControl                    | No Framework component provided                                                                                                                                |
| ProgressBar            | Fx/Controls/ProgressBar                       | [FluentUI ProgressIndicator][FluentUI ProgressIndicator]                                                                                                       |
| QuotaGauge             | Fx/Controls/QuotaGuage                        | * No Framework component provided, if charting is needed please see [D3 Sample][D3 Sample]                                                                     |
| RadioButtons           | Fx/Controls/RadioButtons                      | [FluentUI ChoiceGroup][FluentUI ChoiceGroup]                                                                                                                   |
| RangeSlider            | Fx/Controls/RangeSlider                       | [FluentUi Slider][FluentUI Slider]                                                                                                                             |
| Recommendations        | Fx/Controls/Recommendations                   | No Framework component provided                                                                                                                                |
| ResourceFilter         | MsPortalFx.Azure.ResourceFilter               | [AzurePortal-ReactView SubscriptionFilter][AzurePortal-ReactView SubscriptionFilter]                                                                           |
| ResourceGroupDropdown  | Fx/Controls/ResourceGroupDropDown             | [AzurePortal-ReactView ResourceGroupDropdown][AzurePortal-ReactView ResourceGroupDropdown]                                                                     |
| ScatterChart           | Fx/Controls/ScatterChart                      | * No Framework component provided, if charting is needed please see [D3 Sample][D3 Sample]                                                                     |
| SearchBox              | Fx/Controls/SearchBox                         | [FluentUI SearchBox][FluentUI SearchBox]                                                                                                                       |
| Section                | Fx/Controls/Section                           | No Framework component provided                                                                                                                                |
| SingleValueGauge       | Fx/Controls/SingleValueGauge                  | * No Framework component provided, if charting is needed please see [D3 Sample][D3 Sample]                                                                     |
| Slider                 | Fx/Controls/Slider                            | [FluentUi Slider][FluentUI Slider]                                                                                                                             |
| Splitter               | Fx/Controls/Splitter                          | No Framework component provided                                                                                                                                |
| Status bar             |                                               | [AzurePortal-ReactView StatusBar][AzurePortal-ReactView StatusBar]                                                                                             |
| StorageAccountDropDown | Fx/Controls/Storage/StorageAccountDropDown    | No Framework component provided                                                                                                                                |
| SubscriptionDropdown   | Fx/Controls/SubscriptionDropDown              | [AzurePortal-ReactView SubscriptionDropdown][AzurePortal-ReactView SubscriptionDropdown]                                                                       |
| Summary                | Fx/Controls/Summary                           | [AzurePortal-ReactView Summary][AzurePortal-ReactView Summary]                                                                                                 |
| TabControl             | Fx/Controls/TabControl                        | [FluentUI Pivot][FluentUI Pivot]                                                                                                                               |
| TagsByResource         | Fx/Controls/TagsByResource                    | [AzurePortal-ReactView TagsByResource][AzurePortal-ReactView TagsByResource]                                                                                   |
| TextBlock              | Fx/Controls/TextBlock                         | [FluentUI Text][FluentUI Text]                                                                                                                                 |
| TextBox                | Fx/Controls/TextBox                           | [FluentUI TextField][FluentUI TextField]                                                                                                                       |
| TimePicker             | Fx/Controls/TimePicker                        | No Framework component provided                                                                                                                                |
| Toggle                 | Fx/Controls/Toggle                            | [FluentUI Toggle][FluentUI Toggle]                                                                                                                             |
| Toolbar                |                                               | For command bars docked at the top of a view use [AzurePortal-ReactView][AzurePortal-ReactView CommandBar] for inline command bars use [FluentUI CommandBar].  |
| TreeView               | MsPortalFx.ViewModels.Controls.Lists.TreeView | [FluentUI Nav][FluentUI Nav]                                                                                                                                   |
| TriStateCheckBox       | Fx/Controls/TriStateCheckBox                  | [FluentUI Checkbox][FluentUI Checkbox]                                                                                                                         |
| Video                  | Fx/Controls/Video                             | This is no longer applicable given ReactViews have DOM access                                                                                                  |

[FluentUI Button]: https://developer.microsoft.com/fluentui#/controls/web/button
[FluentUI Checkbox]: https://developer.microsoft.com/fluentui#/controls/web/checkbox
[FluentUI ChoiceGroup]: https://developer.microsoft.com/fluentui#/controls/web/choicegroup
[FluentUI ComboBox]: https://developer.microsoft.com/fluentui#/controls/web/combobox
[FluentUI CommandBar]: https://developer.microsoft.com/fluentui#/controls/web/commandbar
[FluentUI DatePicker]: https://developer.microsoft.com/fluentui#/controls/web/datepicker
[FluentUI DetailsList]: https://developer.microsoft.com/fluentui#/controls/web/detailslist
[FluentUI Dialog]: https://developer.microsoft.com/fluentui#/controls/web/dialog
[FluentUI Dropdown]: https://developer.microsoft.com/fluentui#/controls/web/dropdown
[FluentUI GroupedList]: https://developer.microsoft.com/fluentui#/controls/web/groupedlist
[FluentUI List]: https://developer.microsoft.com/fluentui#/controls/web/list
[FluentUI MessageBar]: https://developer.microsoft.com/fluentui#/controls/web/messagebar
[FluentUI Nav]: https://developer.microsoft.com/fluentui#/controls/web/nav
[FluentUI Pivot]: https://developer.microsoft.com/fluentui#/controls/web/pivot
[FluentUI ProgressIndicator]: https://developer.microsoft.com/fluentui#/controls/web/progressindicator
[FluentUI SearchBox]: https://developer.microsoft.com/fluentui#/controls/web/searchbox
[FluentUI Slider]: https://developer.microsoft.com/fluentui#/controls/web/slider
[FluentUI Text]: https://developer.microsoft.com/fluentui#/controls/web/text
[FluentUI TextField]: https://developer.microsoft.com/fluentui#/controls/web/textfield
[FluentUI Toggle]: https://developer.microsoft.com/fluentui#/controls/web/toggle
[FluentUI Tooltip]: https://developer.microsoft.com/fluentui#/controls/web/tooltip

[AzurePortal-ReactView BladeLink]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.ReactView%2Fazureportal-reactview%2Fsrc%2FBladeLink.tsx
[AzurePortal-ReactView CommandBar]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.ReactView%2Fazureportal-reactview%2Fsrc%2FCommandBar.tsx
[AzurePortal-ReactView CopyableLabel]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.ReactView%2Fazureportal-reactview%2Fsrc%2FCopyableLabel.tsx
[AzurePortal-ReactView CSS]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.ReactView%2Fazureportal-reactview%2Fsrc%2FCss.ts
[AzurePortal-ReactView Dialog]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.ReactView%2Fazureportal-reactview%2Fsrc%2FDialog.tsx
[AzurePortal-ReactView Essentials]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.ReactView%2Fazureportal-reactview%2Fsrc%2FEssentials.tsx
[AzurePortal-ReactView FileUpload]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.ReactView%2Fazureportal-reactview%2Fsrc%2FFileUpload.tsx
[AzurePortal-ReactView Footer]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.ReactView%2Fazureportal-reactview%2Fsrc%2FFooter.tsx
[AzurePortal-ReactView FrameworkIcon]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.ReactView%2Fazureportal-reactview%2Fsrc%2FFrameworkIcon.tsx
[AzurePortal-ReactView LocationDropdown]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.ReactView%2Fazureportal-reactview%2Fsrc%2FLocationDropdown.tsx
[AzurePortal-ReactView ResourceGroupDropdown]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.ReactView%2Fazureportal-reactview%2Fsrc%2FResourceGroupDropdown.tsx
[AzurePortal-ReactView StatusBar]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.ReactView%2Fazureportal-reactview%2Fsrc%2FStatusBar.tsx
[AzurePortal-ReactView SubscriptionDropdown]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.ReactView%2Fazureportal-reactview%2Fsrc%2FSubscriptionDropdown.tsx
[AzurePortal-ReactView SubscriptionFilter]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.ReactView%2Fazureportal-reactview%2Fsrc%2FSubscriptionFilter.tsx
[AzurePortal-ReactView Summary]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.ReactView%2Fazureportal-reactview%2Fsrc%2FSummary.tsx
[AzurePortal-ReactView TagsByResource]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.ReactView%2Fazureportal-reactview%2Fsrc%2FTagsByResource.tsx
[AzurePortal-ReactView Pills]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=/src/SDK/Framework.ReactView/azureportal-reactview/src/Pill.tsx
[AzurePortal-ReactView PillCollection]: hhttps://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=/src/SDK/Framework.ReactView/azureportal-reactview/src/PillCollection.tsx

[D3 Sample]: https://msazure.visualstudio.com/One/_git/AzureUX-SamplesExtension?path=%2Fsrc%2FExtension%2FClient%2FReact%2FViews%2FCustomDependencies%2FD3.ReactView.tsx
[DurationPicker Sample]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FSamplesExtension%2FExtension%2FClient%2FReact%2FViews%2FControls%2FDurationPicker.ReactView.tsx
[MonacoEditor Sample]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FSamplesExtension%2FExtension%2FClient%2FReact%2FViews%2FCustomDependencies%2FMonacoEditor.ReactView.tsx

[ReactMonacoEditor]: https://www.npmjs.com/package/react-monaco-editor
[ReactViewBuild]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=/src/SDK/Framework.ReactView/azureportal-reactview-tools/bin/reactview-build.ts

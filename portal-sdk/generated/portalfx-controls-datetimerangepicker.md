<a name="datetimerangepicker"></a>
## DateTimeRangePicker

The DateTimeRangePicker control provides an easy way select a date/time range, e.g. Start: 6/5/2017 00:00:00 AM, End: 7/9/2018 00:00:00 AM
This is the recommended control for UI where users pick a date/time range. All previous controls that had this functionality are obsolete.

You can use it by importing the module:
```
import * as DateTimeRangePicker from "Fx/Controls/DateTimeRangePicker";
```

Then creating the view model:
```
public dateTimeRangePicker: DateTimeRangePicker.Contract;

this.DateTimeRangePicker = DateTimeRangePicker.create(container, {
    label: "someLabel"
    //Other options...
});
```
And then either:
- inserting it as a member of a Section, or
- including it in an HTML template via a 'pcControl' binding.
You can see examples running in SamplesExtension [here](https://aka.ms/portalfx/samples#blade/SamplesExtension/DateTimeRangePickerInstructions/selectedItem/DateTimeRangePickerInstructions/selectedValue/DateTimeRangePickerInstructions) along with the source code here: `SamplesExtension\Extension\Client\V1\Controls\DateTimeRangePicker\ViewModels\DateTimeRangePickerViewModels.ts`.

<a name="migrating-from-older-datetimecombo-or-datetimecombobox"></a>
## Migrating from older DateTimeCombo or DateTimeComboBox

1. Update the namespace with DateTimeRangePicker

Old code:
```
var startDateTimeViewModel = new MsPortalFx.ViewModels.Obsolete.Forms.DateTimeComboBox.ViewModel(container, {...});
var endDateTimeViewModel = new MsPortalFx.ViewModels.Obsolete.Forms.DateTimeComboBox.ViewModel(container, {...});

```

New code:
```
import * as DateTimeRangePicker from "Fx/Controls/DateTimeRangePicker";

var dateTimeRangePickerVM = DateTimeRangePicker.create(container, {
    value: new MsPortalFx.DateUtil.DateTimeRange(new Date(2014, 5, 13, 13, 45, 0), new Date(2014, 5, 20, 13, 45, 0)),
    startDateTimeEnabledRange: new MsPortalFx.DateUtil.DateTimeRange(new Date(2016, 1, 1, 0, 0, 0), new Date(2017, 1, 1, 0, 0, 0)),
    endDateTimeEnabledRange: new MsPortalFx.DateUtil.DateTimeRange(new Date(2017, 1, 1, 0, 0, 0), new Date(2018, 1, 1, 0, 0, 0)),
    validations: [
        new MsPortalFx.ViewModels.CustomValidation("", <any>((value: MsPortalFx.DateUtil.DateTimeRange): Promise<MsPortalFx.ViewModels.ValidationResult> => {
            return Q({
                valid: value.startDateTime() <= value.endDateTime(),
                message: "Start date/time has to be before end date/time"
            });
        }))
    ],
});
```

2. If you have set `DateTimeComboBox.formatString`, please remove it.
The new DateTimePicker does not support formatting the datetime value now. Value will be presented in general date/time pattern (long time) by default, e.g. 6/7/2017 4:20:00 PM.

Old code:
```
startDateTimeViewModel.formatString("G");
endDateTimeViewModel.formatString("G");
```
New code:
```
//Just remove it.
```

<a name="datetimepicker"></a>
## DateTimePicker

The DateTimePicker control provides an easy way select date and time, e.g. 6/5/2017 1:45:00 PM.
This is the recommended control for Blade UI where users pick a date and time. All previous controls that had this functionality are obsolete.

You can use it by importing the module:
```
import * as DateTimePicker from "Fx/Controls/DateTimePicker";
```

Then creating the view model:
```
public dateTimePicker: DateTimePicker.Contract;

this.dateTimePicker = DateTimePicker.create(container, {
    label: "someLabel"
    //Other options...
});

```
And then either:
- inserting it as a member of a Section, or
- including it in an HTML template via a 'pcControl' binding.
You can see examples running in SamplesExtension [here](https://aka.ms/portalfx/samples#blade/SamplesExtension/DateTimePickerInstructions/selectedItem/DateTimePickerInstructions/selectedValue/DateTimePickerInstructions) along with the source code here: `SamplesExtension\Extension\Client\V1\Controls\DateTimePicker\ViewModels\DateTimePickerViewModels.ts`.

By default, this control displays date according to the user's local [timezoneoffset](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset). If the `showTimezoneDropdown` option is supplied as `true`, users can choose a timezoneoffset using the Timezone Dropdown. The viewmodel's `value` property will *always* normalize the date/time value to the user's local timezoneoffset. Typically, backends will return UTC dates, and these will be converted by the DateTimePicker control such that the view model `value` property will reflect the user's locale.

Be aware that [timezoneoffset](http://tantek.com/2015/218/b1/use-timezone-offsets) !== timezone. If you need to use timezones (e.g., to ensure constant scheduling time), you should set `showTimezoneDropdown` to `false`, and use separate dropdown control populated with timezones used on your backend (which may vary, but preferably [IANA timezones](https://www.iana.org/time-zones)).

<a name="migrating-from-older-datetimecombo-or-datetimecombobox"></a>
## Migrating from older DateTimeCombo or DateTimeComboBox

If you're combining two older DateTimeComboBoxes together to select a date/time range, please migrate to [DateTimeRangePicker](portalfx-controls-datetimerangepicker.md)

1. Update the namespace with DateTimePicker

Old code:
```
var dateTimeVM = new MsPortalFx.ViewModels.Obsolete.Forms.DateTimeCombo.ViewModel(container, {...});

//or
var dateTimeVM = new MsPortalFx.ViewModels.Obsolete.Forms.DateTimeComboBox.ViewModel(container, {...});
```

New code:
```
import * as DateTimePicker from "Fx/Controls/DateTimePicker";
var dateTimeVM = DateTimePicker.create(container, {...});
```

2. If you have set `DateTimeComboBox.formatString`, please remove it.
The new DateTimePicker does not support formatting the datetime value now. Value will be presented in general date/time pattern (long time) by default, e.g. 6/7/2017 4:20:00 PM.

Old code:
```
dateTimeVM.formatString("G");
```
New code:
```
//Just remove it.
```

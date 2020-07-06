# DateTimePicker

 
<a name="basics"></a>
### Basics
The DateTimePicker control provides an easy way select date and time, e.g. 6/5/2017 1:45:00 PM.



<!-- TODO get an IMAGE to embed here -->

<!-- TODO get an SAMPLE CODE to embed here -->

 
<a name="when-to-use"></a>
### When to use
There are a set of date, time and duration pickers available in the SDK.  Choose the one that is most suitable to your need.
* **DatePicker** - gets a specific date including month, day and year
* **DateTimePicker** - gets a specific date including month, day, year and time including hours, minutes, seconds
* **DateTimeRangePicker** - gets a range of time between two date and times
* **DayPicker** - gets a day of the month
* **DurationPicker** - gets a duration in terms of days, hours, minutes and seconds
* **TimePicker** - gets a time including hours, minutes, seconds



 
<a name="best-practices"></a>
### Best practices
Use the DateTimePicker when the user must enter a date and time.

<a name="best-practices-do"></a>
#### Do

* Use the control as a single entity.
* Set the default date to the current date unless a specific date is required for context (e.g. the date of the conference).
* The control is designed to resize relative to available screen width. Allow it to render in either wide or narrow as appropriate.
* When the control is engaged, the DatePicker renders as a flyout and has defined widths (300px -narrow and 440px – wide). Plan your UI implementation accordingly.
* The control renders date in a specific format. If allowing for manual entry of date, provide helper text in the appropriate format.

<a name="best-practices-don-t"></a>
#### Don&#39;t

* Don't attempt to break apart year from month/day selectors. If granularity is required, use the Dropdown control or something similar.
* Don't attempt to force resize the control in any way.
* Don't force the control to render one mode vs. the other (year or month/day)
* The flyout selector is a light dismiss control. Don't modify this behavior in any way.



 
<a name="developer-tips-and-tricks"></a>
### Developer tips and tricks
By default, this control displays date according to the user's local [timezoneoffset](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset). If the showTimezoneDropdown option is supplied as true, users can choose a timezoneoffset using the Timezone Dropdown. The viewmodel's value property will *always* normalize the date/time value to the user's local timezoneoffset. Typically, backends will return UTC dates, and these will be converted by the DateTimePicker control such that the view model value property will reflect the user's locale.

Be aware that [timezoneoffset](http://tantek.com/2015/218/b1/use-timezone-offsets) !== timezone. If you need to use timezones (e.g., to ensure constant scheduling time), you should set showTimezoneDropdown to false, and use separate dropdown control populated with timezones used on your backend (which may vary, but preferably [IANA timezones](https://www.iana.org/time-zones)).


<a name="developer-tips-and-tricks-interactive-control-and-sample-source-code"></a>
#### Interactive control and sample source code
Go to the playground site to use the latest control and get source code for your project.  [Learn more about playground](./top-extensions-controls-playground.md).

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/DateTimePicker_create_Playground" target="_blank">DateTimePicker in the interactive controls playground</a>



 
<a name="related-info"></a>
### Related info

* <a href="https://www.figma.com/file/Bwn8rmUOYtnPRwA3JoQTBn/Azure-Portal-Toolkit?node-id=3410%3A7621" target="_blank">Date pickers in Azure Portal Toolkit (Figma)</a>

* [Azure design guidance](http://aka.ms/portalfx/design)



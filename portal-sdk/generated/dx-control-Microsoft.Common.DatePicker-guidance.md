- `constraints.validations` requires `isValid` and `message`. When `isValid` is **true**, then the `message` is displayed below the control as an error text.
- If `time.visible` is not set, only the Date selector is displayed. The output will default the time value to `00:00:00`.
- The following date functions are available for use with the DatePicker control

  - **getYear(DateTime_output)**: Return the year of the DateTime value
  - **getMonth(DateTime_output)**: Return the month of the DateTime value
  - **getDate(DateTime_output)**: Return the date of the DateTime value
  - **toUtc(DateTime_output)**: Convert the DateTime value to UTC time
  - **duration(Datetime d1, DateTime d2)**: Calculates the difference between d2 and d1 and return time value in milliseconds since midnight, January 1, 1970 UTC.
  - **durationFormat(DateTime-value)**:  Convert DateTime value in milliseconds to a specific format using any combination of yy MM dd hh mm ss.

    Examples
    ```json
    "[durationFormat(duration(utcNow(), steps('basics').datePicker), 'yy MM dd hh mm ss')]"
      => "1 year 1 month 20 days 9 hours 20 minutes 46 seconds"

    "[durationFormat(duration(utcNow(), steps('basics').datePicker), 'hh mm ss')]"
      => "9849 hours 20 minutes 17 seconds"

    "[durationFormat(duration(utcNow(), steps('basics').datePicker), 'dd')]" => "410 days"
    ```

  - [**addHours()**](https://docs.microsoft.com/en-us/azure/azure-resource-manager/managed-applications/create-ui-definition-date-functions#addhours)
  - [**addMinutes()**](https://docs.microsoft.com/en-us/azure/azure-resource-manager/managed-applications/create-ui-definition-date-functions#addminutes)
  - [**addSeconds()**](https://docs.microsoft.com/en-us/azure/azure-resource-manager/managed-applications/create-ui-definition-date-functions#addseconds)
  - [**utcNow()**](https://docs.microsoft.com/en-us/azure/azure-resource-manager/managed-applications/create-ui-definition-date-functions#utcnow)

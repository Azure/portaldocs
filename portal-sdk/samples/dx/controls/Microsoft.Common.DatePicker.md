
## First Example -Date only
```json
{
    "name": "dateTime1",
    "type": "Microsoft.Common.DatePicker",
    "label": "start time",
    "visible": true,
    "constraints": {
    "required": true
    }
}
```

## Second Example -with Date and Time selection
```json
{
    "name": "dateTime2",
    "type": "Microsoft.Common.DatePicker",
    "label": "end time",
    "visible": true,
    "time": {
        "visible": true
    },
    "constraints": {
        "required": true,
        "validations":
        [
            {
                "message": "can't be earlier than the start time",
                "isValid": "[less(duration(steps('datePicker').dateTime1, steps('datePicker').dateTime2), 0)]"
            }
        ]
    }
}
```

## Third Example -with Validation
```json
{
    "name": "dateTime3",
    "type": "Microsoft.Common.DatePicker",
    "label": "showValidationMessage",
    "visible": true,
    "constraints": {
        "validations":
        [
            {
                "message": "selected date can't be earlier than today",
                "isValid": "[less(duration(addHours(utcNow(), -24), steps('datePicker').dateTime1), 0)]"
            }
        ]
    }
}
```

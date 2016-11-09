## Extension Errors Dashboard

**Extension Errors dashboard** gives you the ability to look into the errors and warnings thrown by your extension.

To view the Extension Errors PowerBi dashboard follow this link: [Extension Errors PowerBi dashboard](http://aka.ms/portalfx/dashboard/ExtensionErrors)

### Prerequisites

**NOTE:** Note that your extension's errors/warnings will be tracked in this dashboard only if you have previously [onboarded to ExtTelemetry/ExtEvents tables](/documentation/articles/portalfx-telemetry).

#### Getting access to the Extension Errors Dashboard

In order to get acess to the Extension Errors Dashboard, you will need to join [Azure Portal Data](http://idwebelements/GroupManagement.aspx?Group=auxdatapartners&Operation=join) group.

### Where to look for error/warning spikes

"Errors by Environment" and "Warnings by Environment" are the charts that you need to monitor. You should check to see if there are any significant spikes in the report.

There are three charts on each column:

- Affected Users % = this is the percentage of users which had >= 1 error divided by the total number of users which were using the portal. This chart is very useful to detect changes in the error percentage pattern.
- Affected Users Count = the total number of users which had an error thrown by the portal.
- Error Count = the total number of errors thrown by the portal.

In order to hide irrelevant spikes (where the portal is used by less than 10 users), you can select the option "Show Data" -> "Where total users > 10".

### Find the cause of error/warning spikes

If you want to analyze a spike, you can drill down into the top errors thrown by your extension in a specific hour by going to the "1 Hour Error Drilldown" chart.

You can drill down into the errors thrown by the extension by using the following functions from Kusto (AzurePortal database):

- query to get the error counts for a specific environment between a startTime and an endTime, grouped by a specific time granularity (e.g. 1 hour):

```sql
GetExtensionErrorCounts(datetime("2016-07-25 00:00:00"), datetime("2016-07-26 00:00:00"), "Compute", "Error", "portal.azure.com", 1h)
| where clientVersion == "4.12.102.0 (82a67ee.160722-1641)"
```

- query to get the top 10 errors from last hour, independent of client version:

```sql
Top10ExtErrorsFromLastHour("Compute", "Error", "portal.azure.com")
```

- query to get a complete list of all the error messages for a specific environment that follow a message pattern between a startTime and an endTime:

```sql
GetExtensionErrorsByAggregatedErrorMessage(datetime("2016-07-25 18:15:00"), datetime("2016-07-26 18:30:00"), "Compute", "Error", "portal.azure.com", 'message: Script error')
| where clientVersion == "4.12.102.0 (82a67ee.160722-1641)"
| take 1000
```

Query hints:

- You can select all the error messages between startTime and endTime by using "*" when looking for the error message. Otherwise, you can search by the entire aggregated error message or just by a part of it (e.g. 'message: Script error').
- ErrorType can be: "Error", "Warning" or "Verbose".

Another useful chart is the "Last 24 Hours Error Summary", which shows the errors thrown by the an extension aggregated for the last 24 hours.

**NOTE:** We aggregate the error messages by omitting the text which is within double quotes (") or single quotes ('). We consider those parts to be the dynamic part of the message (e.g. an id, a timestamp etc.). For example, a message like [Could not find part "PartName1"] will be treated as [Could not find part ""]. Please use this format for all the logged error messages, if you want them to be aggregated by our queries.

### Additional information

- All time stamps shown in this dashboard are UTC time stamps.
- Currently, we refresh automatically the dashboard 8 times a day (the maximum number of scheduled refreshes allowed by PowerBI), during working hours: 8:00 AM, 9:30 AM, 11:00 AM, 12:30 PM, 2:00 PM, 3:30 PM, 5:00 PM and 6:30 PM (Pacific Time).

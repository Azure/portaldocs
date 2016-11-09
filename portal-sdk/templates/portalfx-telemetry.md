# Portal Telemetry Overview

Ibiza portal tracks several pieces of information as users navigate through the portal. Extensions do not need to consume any APIs to have this information collected.

> **Note**: Currently, telemetry is made available to partners through Kusto. In order to access the Portal logs you must get 
access to [Azure Portal Data](http://idwebelements/GroupManagement.aspx?Group=auxdatapartners&Operation=join) group.

You can access our Kusto cluster using <a href="https://azportal.kusto.windows.net/AzurePortal" target="_blank" title="Kusto">Kusto Explorer</a> or 
<a href="https://azportal.kusto.windows.net/AzurePortal?web=1" target="_blank" title="KustoWeb">Kusto Web Explorer</a>. 
Our Kusto cluster contains two databases: 

* AzurePortal - which contains the raw data
* AzPtlCosmos - which is our main telemetry database used in all the official dashboards and reports. Data from this database is deduped, geo-coded, expanded and has test traffic filtered out.

There are two tables used for telemetry:

* ClientTelemetry - contains telemetry logged by Framework and Hubs. In this table, you can find all the telemetry events (e.g. BladeLoaded, PartLoaded) which are logged by default for any extension which is registered in the portal.
* ExtTelemetry - contains extension telemetry. As an extension author, you may log additional telemetry to this table. 
    * *Note*: Your extension will log to this table only if you have onboarded to the telemetry services provided by Framework.

You can read more [here](/documentation/articles/portalfx-telemetry-kusto-databases) about Kusto and about the data provided in our Kusto cluster.

### Tracked Actions

{"gitdown": "include-file", "file": "./includes/portalfx-telemetry-actions.md"}

## Logging

There are two options for collecting telemetry and error/warning logs. You can either configure and use the Portal Framework's built-in telemetry services or you can utilize an entirely custom telemetry system.

> We advise you to use the telemetry controller provided by Framework in order to take advantage of the system which is already in place.

> Information should be collected in a way that that ensures no personally identifiable information (PII) is captured. It is very important for security and compliance reasons that PII data is not sent to telemetry services and you should have practices in place to ensure that this is enforced.

### Onboarding to ExtTelemetry/ExtEvents tables

To start using the built-in controller provided by Framework for collecting telemetry and error/warning logs, just add `this.EnablePortalLogging = true;` in the constructor of your extension definition class:

```cs
  public Definition(ApplicationConfiguration applicationConfiguration)
  {
      this.EnablePortalLogging = true;
  }
```

You can read [here](/documentation/articles/portalfx-telemetry-logging) more details about using the telemetry controller provided by Framework.

### Logging telemetry to ExtTelemetry table

You can use the Portal telemetry APIs to log telemetry. However, before you do so you will need to initialize the telemetry service.

```ts
  // Initialize the telemetry functionality and make it available for use.
  MsPortalFx.Base.Diagnostics.Telemetry.initialize("ExtensionName", false /* traceBrowserInformation */ );
```

> Note that you don't need to trace browser information to your particular extension as this data is collected globally. However, if you would like the browser information in your own telemetry store set traceBrowserInformation to true.

To log telemetry, you can call the `trace` method as shown below:

```ts
  MsPortalFx.Base.Diagnostics.Telemetry.trace({
      extension: "Microsoft_Azure_NewExtension",
      source: "Links",
      action: "LinkClicked",
      name: "Recommended",
      data: {...}
  });
```

Telemetry logs go to ExtTelemetry table, which is available in Kusto in both AzurePortal and AzPtlCosmos databases.
The recommended format for `name` column is 'Extension/Microsoft_Azure_NewExtension/Blade/NewBladeName', if the event is related to a blade. 
Please do not stringify `data` and `context` columns when passing them through. These columns usually contain JSON values. You should pass their values as objects, as otherwise, this will result in double-encoded strings. 

### Logging errors/warnings to ExtEvents table

To log errors/warnings, you can call the `error`/`warning` methods as shown below:

```ts
  var log = new MsPortalFx.Base.Diagnostics.Log("logging_area");
  log.warning(errorMessage, code, args);
  log.error(errorMessage, code, args);
```

Args can be provided for additional information to get logged together with the message. Pass it as an object and do not stringify it before passing it through.

Errors and warnings are logged to ExtEvents table, which is available in Kusto only in AzurePortal database.

**NOTE:** Verbose logging is currently disabled in mpac/production, in order to prevent overly aggressive logging. We recommend you to use verbose logging only for debugging.

We have built [Extension Errors Dashboard](/documentation/articles/portalfx-telemetry-extension-errors) for giving you the ability to analyze easier the errors and warnings thrown by your extension.

**NOTE:**  In the charts from [Extension Errors Dashboard](/documentation/articles/portalfx-telemetry-extension-errors), we aggregate the error messages by omitting the text which is within double quotes (") or single quotes ('). We consider those parts to be the dynamic part of the message (e.g. an id, a timestamp etc.). For example, a message like [Could not find part "PartName1"] will be treated as [Could not find part ""]. Please use this format for all the logged error messages, if you want them to be aggregated by our queries.

## Available Power BI Dashboards

Following are some of the dashboards that we support. If you do not have access to any of these please request the right permissions in [Getting Started](onenote:#Getting%20Started&section-id={B333CBFA-BF45-47DC-816B-37B2F3CFD7E8}&page-id={F1EE506C-5158-49DB-AD06-1027E2BC3EAD}&end&base-path=https://microsoft.sharepoint.com/teams/azureteams/aapt/azureux/portalfx/SiteAssets/PortalFx%20Notebook/Gauge/Ibiza%20Telemetry%20-%20Internal.one)

|Name                            | PowerBi Link                                                                                                                                     | Metrics Description                                                                    |
|--------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
|Portal User Adoption Dashboard  | [http://aka.ms/portalfx/dashboard/PortalUserAdoption](http://aka.ms/portalfx/dashboard/PortalUserAdoption)                                       |                                                                                        |
|Portal Performance Dashboard    | [http://aka.ms/portalfx/dashboard/PortalPerformance](http://aka.ms/portalfx/dashboard/PortalPerformance)                                         | [Perf Docs](/documentation/articles/portalfx-performance)                              |
|Portal Reliability Dashboard    | [http://aka.ms/portalfx/dashboard/PortalReliability](http://aka.ms/portalfx/dashboard/PortalReliability)                                         | [Reliability Docs](/documentation/articles/portalfx-reliability)                       |
|Portal Create Dashboard         | [http://aka.ms/portalfx/dashboard/PortalCreate](http://aka.ms/portalfx/dashboard/PortalCreate)                                                   | [Create Docs](/documentation/articles/portalfx-telemetry-create)                       |
|Extension Errors Dashboard      | [http://aka.ms/portalfx/dashboard/ExtensionErrors](http://aka.ms/portalfx/dashboard/ExtensionErrors)                                             | [Extension Errors Docs](/documentation/articles/portalfx-telemetry-extension-errors)   |


## Collecting Feedback From Your Users

In February 2016 we introduced a standardized pane for collecting user feedback. We currently expose one method to extension developers.

### Resource Deleted Survey

To ask a user why they deleted a resource use the `openResourceDeletedFeedbackPane` method:

```
  import * as FxFeedback from "Fx/Feedback";
  FxFeedback.openResourceDeletedFeedbackPane("displayNameOfTheDeletedResource", optionalObjectWithAnyAdditionalDataYouWantToLog);
```

Call this method after a user starts the deletion process for a resource. Shell will open the feedback pane with a standardized survey. The name of the resource you pass to the method will be shown to the user in the survey. Responses to this survey are logged to the telemetry tables. If the feedback pane is already open calls to this method will be no-ops.

### Questions?

Read more about [Kusto query language](https://kusto.azurewebsites.net/docs/queryLanguage/query_language.html).

Ask questions on: [https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza-telemetry](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza-telemetry)


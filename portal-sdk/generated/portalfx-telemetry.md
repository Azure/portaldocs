* [Portal Telemetry Overview](#portal-telemetry-overview)
    * [Tracked Actions](#portal-telemetry-overview-tracked-actions)
    * [Logging](#portal-telemetry-overview-logging)
        * [Onboarding to ExtTelemetry/ExtEvents tables](#portal-telemetry-overview-logging-onboarding-to-exttelemetry-extevents-tables)
        * [Logging telemetry to ExtTelemetry table](#portal-telemetry-overview-logging-logging-telemetry-to-exttelemetry-table)
        * [Logging errors/warnings to ExtEvents table](#portal-telemetry-overview-logging-logging-errors-warnings-to-extevents-table)
    * [Available Power BI Dashboards](#portal-telemetry-overview-available-power-bi-dashboards)
    * [Collecting Feedback From Your Users](#portal-telemetry-overview-collecting-feedback-from-your-users)
        * [Resource Deleted Survey](#portal-telemetry-overview-collecting-feedback-from-your-users-resource-deleted-survey)
        * [Questions?](#portal-telemetry-overview-collecting-feedback-from-your-users-questions)


<a name="portal-telemetry-overview"></a>
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

You can read more [here](portalfx-telemetry-kusto-databases.md) about Kusto and about the data provided in our Kusto cluster.

<a name="portal-telemetry-overview-tracked-actions"></a>
### Tracked Actions

The following actions are logged to ClientTelemetry table:

* Blade events

    * **BladeLoaded**
        * Tracks the time it takes to open the blade and start seeing the part frames show up. BladeLoaded also includes loading and opening the action bar.
    * **BladeLoadErrored**
        * Triggered when loading a blade failed. 
        * **This event is used to track blade errors in our reliability metrics.**
    * **BladeOpened**
        * Tracks the time it takes for BladeLoaded + all the parts to start loading.  More specifically, it is when the blade’s Above The Fold lenses, parts and widgets have been created. It includes setting up the input bindings. The inputs themselves aren’t necessarily available yet (onInputsSet is not necessarily called yet). It also includes loading the collapsed state of the essentials part (if there is one).
    * **BladeRevealed**
        * All parts above the fold have called reveal content or resolved onInputsSet(). This action is triggered when a Blade is revealed but the parts within the blade may still be loading.
        * **This event is used in our blade performance metrics.**
    * **BladeReady**
        * All parts above the fold have resolved onInputsSet(). This action is triggered when a Blade Load is complete and it's ready for consumption by the user.
    * **BladeFullOpened**
        * Is the same as BladeOpened except it is for all the parts, not just the parts above the fold.
    * **BladeFullRevealed**
        * Is the same as BladeRevealed except it is for the all parts, not just the parts above the fold.
    * **BladeFullReady**
        * Is the same as BladeReady except it is for all the parts, not just the parts above the fold.
    * **BladeButtonClicked**
        * When the pin, unpin, maximize, minimize or close button on a blade is clicked.
    * **CommandExecuted** 
        * When any of the Commands on a blade is clicked - like start, stop, etc.

    "name" column provides the name of the blade. This name is provided in "Extension/extension_name/Blade/blade_name" format.

* Part events

    * **PartClick**
        * Triggered when a part is clicked.
    * **PartLoaded**
        * Tracks the time it takes for a part to start getting filled with some UI (e.g. … spinner)
    * **PartErrored**
        * Triggered when loading a part failed. 
        * **This event is used to track part errors in our reliability metrics.**
    * **PartReady**
        * Triggered when the part has resolved onInputsSet().

    "name" column provides the name of the part. This name is provided in "Extension/extension_name/Blade/blade_name/Part/part_name" format.

* Portal Ready events

    * **TotalTimeToPortalReady**
        * Tracks the time it takes to load the portal (load the splash screen and show the startboard or start rendering the blade if it was a deep link).
    * **TotalTimeToStartBoardReady**
        * Tracks the time to load the portal and show the startboard.
    * **TotalTimeToDeepLinkReady**
        * This event is triggered only if a user is using a deep link to call up the portal. It tracks the time it takes to load the portal and start rendering the deep linked blade.

    The portal load time is tracked in the "duration" column.

* Extension events

    * **LoadExtensions**
        * Measures the time it takes Shell to create the extension's IFrame until Shell receives the extension's manifest.
        * "actionModifier" = start is triggered when an extension starts loading
        * "actionModifier" = cancel is triggered when an extension fails loading
        * "actionModifier" = complete is triggered when an extension finishes loading
    * **InitializeExtensions**
        * Measures the time since Shell receives the extension manifest until Shell receives an RPC response stating that the extension's state is Initialized.
        * "actionModifier" = start is triggered when an extension starts being initialized
        * "actionModifier" = cancel is triggered when an extension's initialization fails
        * "actionModifier" = complete is triggered when an extension's initialization finishes

    "name" column provides the name of the extension which is being loaded/initialized.

* Create events

    * **CreateFlowLaunched**
        * Triggered when a user expresses the intent to create a resource in the Portal by launching its create blade. This event is mostly logged from the Marketplace extension. This event can be found mostly in ExtTelemetry table (where the logs from Marketplace extension go) and only partially in ClientTelemetry table.
    * **ProvisioningStarted** / **ProvisioningEnded**
        * Triggered when a new deployment started/ended. This event is being logged for both custom and ARM deployments.
    * **CreateDeploymentStart** / **CreateDeploymentEnd**
        * Triggered only if the deployment is done using the ARM Provisioner provided by Framework. For ARM deployments, the order of the logged events for a deployment is: "ProvisioningStarted", "CreateDeploymentStart", "CreateDeploymentEnd" and "ProvisioningEnded".
        Note that "CreateDeploymentStart" and "CreateDeploymentEnd" are only logged if the deployment is accepted by ARM. "CreateDeploymentStart"/"CreateDeploymentEnd" logs contain the correlationId that can be used to search for the deployment's status in ARM.

    "name" column provides the name of the package getting deployed, while "data" column provides more information about the deployment.

* Side Bar events

    * **SideBarItemClicked**
        * When one of the items on the Side Bar (except + or Browse All) is clicked.
    * **SideBarFavorite**
        * When a resource type is marked as a favorite
    * **SideBarUnFavorite**
        * When a resource type is removed as a favorite


<a name="portal-telemetry-overview-logging"></a>
## Logging

There are two options for collecting telemetry and error/warning logs. You can either configure and use the Portal Framework's built-in telemetry services or you can utilize an entirely custom telemetry system.

> We advise you to use the telemetry controller provided by Framework in order to take advantage of the system which is already in place.

> Information should be collected in a way that that ensures no personally identifiable information (PII) is captured. It is very important for security and compliance reasons that PII data is not sent to telemetry services and you should have practices in place to ensure that this is enforced.

<a name="portal-telemetry-overview-logging-onboarding-to-exttelemetry-extevents-tables"></a>
### Onboarding to ExtTelemetry/ExtEvents tables

To start using the built-in controller provided by Framework for collecting telemetry and error/warning logs, just add `this.EnablePortalLogging = true;` in the constructor of your extension definition class:

```cs
  public Definition(ApplicationConfiguration applicationConfiguration)
  {
      this.EnablePortalLogging = true;
  }
```

You can read [here](portalfx-telemetry-logging.md) more details about using the telemetry controller provided by Framework.

<a name="portal-telemetry-overview-logging-logging-telemetry-to-exttelemetry-table"></a>
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

<a name="portal-telemetry-overview-logging-logging-errors-warnings-to-extevents-table"></a>
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

We have built [Extension Errors Dashboard](portalfx-telemetry-extension-errors.md) for giving you the ability to analyze easier the errors and warnings thrown by your extension.

**NOTE:**  In the charts from [Extension Errors Dashboard](portalfx-telemetry-extension-errors.md), we aggregate the error messages by omitting the text which is within double quotes (") or single quotes ('). We consider those parts to be the dynamic part of the message (e.g. an id, a timestamp etc.). For example, a message like [Could not find part "PartName1"] will be treated as [Could not find part ""]. Please use this format for all the logged error messages, if you want them to be aggregated by our queries.

<a name="portal-telemetry-overview-available-power-bi-dashboards"></a>
## Available Power BI Dashboards

Following are some of the dashboards that we support. If you do not have access to any of these please request the right permissions in [Getting Started](onenote:#Getting%20Started&section-id={B333CBFA-BF45-47DC-816B-37B2F3CFD7E8}&page-id={F1EE506C-5158-49DB-AD06-1027E2BC3EAD}&end&base-path=https://microsoft.sharepoint.com/teams/azureteams/aapt/azureux/portalfx/SiteAssets/PortalFx%20Notebook/Gauge/Ibiza%20Telemetry%20-%20Internal.one)

|Name                            | PowerBi Link                                                                                                                                     | Metrics Description                                                                    |
|--------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
|Portal User Adoption Dashboard  | [http://aka.ms/portalfx/dashboard/PortalUserAdoption](http://aka.ms/portalfx/dashboard/PortalUserAdoption)                                       |                                                                                        |
|Portal Performance Dashboard    | [http://aka.ms/portalfx/dashboard/PortalPerformance](http://aka.ms/portalfx/dashboard/PortalPerformance)                                         | [Perf Docs](portalfx-performance.md)                              |
|Portal Reliability Dashboard    | [http://aka.ms/portalfx/dashboard/PortalReliability](http://aka.ms/portalfx/dashboard/PortalReliability)                                         | [Reliability Docs](portalfx-reliability.md)                       |
|Portal Create Dashboard         | [http://aka.ms/portalfx/dashboard/PortalCreate](http://aka.ms/portalfx/dashboard/PortalCreate)                                                   | [Create Docs](portalfx-telemetry-create.md)                       |
|Extension Errors Dashboard      | [http://aka.ms/portalfx/dashboard/ExtensionErrors](http://aka.ms/portalfx/dashboard/ExtensionErrors)                                             | [Extension Errors Docs](portalfx-telemetry-extension-errors.md)   |


<a name="portal-telemetry-overview-collecting-feedback-from-your-users"></a>
## Collecting Feedback From Your Users

In February 2016 we introduced a standardized pane for collecting user feedback. We currently expose one method to extension developers.

<a name="portal-telemetry-overview-collecting-feedback-from-your-users-resource-deleted-survey"></a>
### Resource Deleted Survey

To ask a user why they deleted a resource use the `openResourceDeletedFeedbackPane` method:

```
  import * as FxFeedback from "Fx/Feedback";
  FxFeedback.openResourceDeletedFeedbackPane("displayNameOfTheDeletedResource", optionalObjectWithAnyAdditionalDataYouWantToLog);
```

Call this method after a user starts the deletion process for a resource. Shell will open the feedback pane with a standardized survey. The name of the resource you pass to the method will be shown to the user in the survey. Responses to this survey are logged to the telemetry tables. If the feedback pane is already open calls to this method will be no-ops.

<a name="portal-telemetry-overview-collecting-feedback-from-your-users-questions"></a>
### Questions?

Read more about [Kusto query language](https://kusto.azurewebsites.net/docs/queryLanguage/query_language.html).

Ask questions on: [https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza-telemetry](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza-telemetry)


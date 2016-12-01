* [Logging](#logging)
* [Available Power BI Dashboards](#available-power-bi-dashboards)
* [Collecting Feedback From Your Users](#collecting-feedback-from-your-users)
* [How to view Live Telemetry](#how-to-view-live-telemetry)
* [Create Flow Telemetry Dashboards](#create-flow-telemetry-dashboards)
* [Create Flow table](#create-flow-table)
* [Create Flow Functions](#create-flow-functions)
* [<a name="GetCreateFlows"></a>GetCreateFlows(startDate: datetime, endDate: datetime)](#a-name-getcreateflows-a-getcreateflows-startdate-datetime-enddate-datetime)
    * [Summary](#a-name-getcreateflows-a-getcreateflows-startdate-datetime-enddate-datetime-summary)
    * [Common Use Cases](#a-name-getcreateflows-a-getcreateflows-startdate-datetime-enddate-datetime-common-use-cases)
    * [Underlying Function Resources](#a-name-getcreateflows-a-getcreateflows-startdate-datetime-enddate-datetime-underlying-function-resources)
    * [Parameters](#a-name-getcreateflows-a-getcreateflows-startdate-datetime-enddate-datetime-parameters)
    * [Output Columns](#a-name-getcreateflows-a-getcreateflows-startdate-datetime-enddate-datetime-output-columns)
* [<a name="GetCreateFunnel"></a>GetCreateFunnel(startDate: datetime, endDate: datetime)](#a-name-getcreatefunnel-a-getcreatefunnel-startdate-datetime-enddate-datetime)
    * [Summary](#a-name-getcreatefunnel-a-getcreatefunnel-startdate-datetime-enddate-datetime-summary)
    * [Common Use Cases](#a-name-getcreatefunnel-a-getcreatefunnel-startdate-datetime-enddate-datetime-common-use-cases)
    * [Underlying Function Resources](#a-name-getcreatefunnel-a-getcreatefunnel-startdate-datetime-enddate-datetime-underlying-function-resources)
    * [Parameters](#a-name-getcreatefunnel-a-getcreatefunnel-startdate-datetime-enddate-datetime-parameters)
    * [Output Columns](#a-name-getcreatefunnel-a-getcreatefunnel-startdate-datetime-enddate-datetime-output-columns)
* [<a name="GetCreateFunnelByDay"></a>GetCreateFunnelByDay(startDate: datetime, endDate: datetime)](#a-name-getcreatefunnelbyday-a-getcreatefunnelbyday-startdate-datetime-enddate-datetime)
    * [Summary](#a-name-getcreatefunnelbyday-a-getcreatefunnelbyday-startdate-datetime-enddate-datetime-summary)
    * [Common Use Cases](#a-name-getcreatefunnelbyday-a-getcreatefunnelbyday-startdate-datetime-enddate-datetime-common-use-cases)
    * [Underlying Function Resources](#a-name-getcreatefunnelbyday-a-getcreatefunnelbyday-startdate-datetime-enddate-datetime-underlying-function-resources)
    * [Parameters](#a-name-getcreatefunnelbyday-a-getcreatefunnelbyday-startdate-datetime-enddate-datetime-parameters)
    * [Output Columns](#a-name-getcreatefunnelbyday-a-getcreatefunnelbyday-startdate-datetime-enddate-datetime-output-columns)
* [<a name="GetCreateFunnelByGalleryPackageId"></a>GetCreateFunnelByGalleryPackageId(startDate: datetime, endDate: datetime)](#a-name-getcreatefunnelbygallerypackageid-a-getcreatefunnelbygallerypackageid-startdate-datetime-enddate-datetime)
    * [Summary](#a-name-getcreatefunnelbygallerypackageid-a-getcreatefunnelbygallerypackageid-startdate-datetime-enddate-datetime-summary)
    * [Common Use Cases](#a-name-getcreatefunnelbygallerypackageid-a-getcreatefunnelbygallerypackageid-startdate-datetime-enddate-datetime-common-use-cases)
    * [Underlying Function Resources](#a-name-getcreatefunnelbygallerypackageid-a-getcreatefunnelbygallerypackageid-startdate-datetime-enddate-datetime-underlying-function-resources)
    * [Parameters](#a-name-getcreatefunnelbygallerypackageid-a-getcreatefunnelbygallerypackageid-startdate-datetime-enddate-datetime-parameters)
    * [Output Columns](#a-name-getcreatefunnelbygallerypackageid-a-getcreatefunnelbygallerypackageid-startdate-datetime-enddate-datetime-output-columns)
* [<a name="GetCombinedCreateFunnel"></a>GetCombinedCreateFunnel(startDate: datetime, endDate: datetime)](#a-name-getcombinedcreatefunnel-a-getcombinedcreatefunnel-startdate-datetime-enddate-datetime)
    * [Summary](#a-name-getcombinedcreatefunnel-a-getcombinedcreatefunnel-startdate-datetime-enddate-datetime-summary)
    * [Common Use Cases](#a-name-getcombinedcreatefunnel-a-getcombinedcreatefunnel-startdate-datetime-enddate-datetime-common-use-cases)
    * [Underlying Function Resources](#a-name-getcombinedcreatefunnel-a-getcombinedcreatefunnel-startdate-datetime-enddate-datetime-underlying-function-resources)
    * [Parameters](#a-name-getcombinedcreatefunnel-a-getcombinedcreatefunnel-startdate-datetime-enddate-datetime-parameters)
    * [Output Columns](#a-name-getcombinedcreatefunnel-a-getcombinedcreatefunnel-startdate-datetime-enddate-datetime-output-columns)
* [Create Troubleshooting](#create-troubleshooting)
    * [Types of Create Failures](#create-troubleshooting-types-of-create-failures)
    * [Debugging Alerts](#create-troubleshooting-debugging-alerts)
* [Performance](#performance)
    * [Extension performance](#performance-extension-performance)
    * [Blade performance](#performance-blade-performance)
    * [Part performance](#performance-part-performance)
    * [WxP score](#performance-wxp-score)
    * [How to assess your performance](#performance-how-to-assess-your-performance)
    * [Performance Checklist](#performance-performance-checklist)
    * [Performance Frequently Asked Questions (FAQ)](#performance-performance-frequently-asked-questions-faq)
    * [Performance best practices](#performance-performance-best-practices)
    * [Configuring CDN](#performance-configuring-cdn)
    * [Extension HomePage Caching](#performance-extension-homepage-caching)
    * [Persistent Caching of scripts across extension updates](#performance-persistent-caching-of-scripts-across-extension-updates)
    * [Run portalcop to identify and resolve common performance issues](#performance-run-portalcop-to-identify-and-resolve-common-performance-issues)
    * [Performance alerting](#performance-performance-alerting)
* [Reliability](#reliability)
    * [Overview](#reliability-overview)
    * [Assessing extension reliability](#reliability-assessing-extension-reliability)
    * [Checklist](#reliability-checklist)
    * [Alerts](#reliability-alerts)


 <h1 name="portalfx-extension-monitor"></h1>
 # Telemetry 
 <h1 name="portalfx-telemetry-getting-started"></h1>
 ## Getting Started

Starting 2016, Portal Telemetry has moved completely to the Kusto based solution. 

<a name="pre-requisites"></a>
### Pre-requisites

Kusto.Explorer: [Application](http://kusto-us/ke/Kusto.Explorer.application)

<a name="kusto-cluster-info"></a>
### Kusto Cluster Info

Name: AzPortal
Data Source: [https://AzPortal.kusto.windows.net](https://AzPortal.kusto.windows.net)


<a name="permissions"></a>
### Permissions

Partner teams wanting access need to join the [Azure Portal Data](http://idwebelements/GroupManagement.aspx?Group=auxdatapartners&Operation=join) group


<a name="kusto-documentation-links"></a>
### Kusto Documentation &amp; Links

[Documentation](http://kusto.azurewebsites.net/docs)

[Kusto Discussions](http://idwebelements/GroupManagement.aspx?Group=KusTalk&Operation=join)

<a name="who-can-i-contact"></a>
### Who can I contact ?

[Ibiza Performance/ Reliability](mailto:ibiza-perf@microsoft.com;ibiza-reliability@microsoft.com) - Telemetry PM for Ibiza Performance and Reliability Telemetry

[Ibiza Create](mailto:ibiza-create@microsoft.com) - Telemetry PM for Ibiza Create Telemetry

[Azure Fx Gauge Team](mailto:azurefxg@microsoft.com) - Telemetry Team


 <h1 name="portalfx-telemetry-kusto-databases"></h1>
 ## Kusto Telemetry

<a name="supported-databases"></a>
### Supported Databases

|Name              | Details                                                                                                                                                                                                                                                                                                                                                                                         |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|AzPtlCosmos       | This is our main telemetry database. Data here is deduped, geo-coded, expanded and filtered. All the official dashboards\reports are based on this table. It is highly encouraged that this database is used for your needs. Data here is persisted for 120 days and excludes test traffic.                                                                                                     |
|AzurePortal       | There will be many scenarios where you may want to debug your issues. For e.g., debugging perf issues. To look at diagnostic events, this is the right table to use. This is the raw data coming from MDS directly to Kusto and it is unprocessed. Data here is persisted for 45 days. To filter out test traffic when doing queries on this database, you should use userTypeHint == "".       |


<a name="supported-kusto-tables"></a>
### Supported Kusto Tables

|Database          | Table Name        | Details                                                                                                                                              |
|------------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
|AzPtlCosmos       | ClientTelemetry   | This is all the Client Telemetry data that is collected from the portal. This is the main table that should be good for most scenarios.              |
|AzPtlCosmos       | ExtTelemetry      | This holds client events data for extensions using the Extension Telemetry feature.                                                                  |

Other useful Kusto tables are the ones where errors and warnings are getting logged. These tables are currently available only under AzurePortal database:

|Database          | Table Name        | Details                                                                                                                                                                                                                                 |
|------------------|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|AzurePortal       | ClientEvents      | This table contains errors and warnings thrown from Framework and Hubs IFrame.                                                                                                                                                          |
|AzurePortal       | ExtEvents         | This table contains errors and warnings thrown from an extension's IFrame. Your extension will log to this table only if you have previously [onboarded to ExtTelemetry/ExtEvents tables](#portalfx-telemetry).  |

<a name="supported-functions"></a>
### Supported Functions

![Supported Functions](../media/portalfx-telemetry/supportedfunctions.png)

Other functions in the databases are available for exploration but are mainly intended for internal usage and are subject to change at any time.

<a name="query-for-reported-numbers"></a>
### Query for Reported Numbers


On a weekly basis, we send out a Weekly Ibiza Status mail where we cover the KPI numbers for all extensions among other things. For folks not getting these emails, please join one of the groups in the screenshot below.

These emails have clickable Kusto links within the reported numbers. Clicking on these will take you to the Kusto query behind getting these numbers. We use functions to hide the complexity behind the queries that we use. To view the details about the queries, look under **Functions\Public**. Once you find the right function, if you right-click and do “Make a command script”, you will be able to see the details of that function. You can do this recursively for any functions underneath. 

![Connection Scope](../media/portalfx-telemetry/connectionScope.png)


<a name="supported-cosmos-streams"></a>
### Supported Cosmos streams

While we have moved to Kusto, we still have streams that continue to exist. This could be required if you want to enable some E2E automation, write super-complex queries that Kusto is unable to handle or need data older than 120 days. 

|Name              | Schema                                                                                                           | Cosmos Link                                                                                                                                                                                                           |
|------------------|------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Client Telemetry  | [DataSet=53004](https://nova.msdial.com/vis/DataCatalog/DataSetViewer?dataSet=53004&dataType=Schema)             | [Daily ClientTelemetry](https://cosmos11.osdinfra.net/cosmos/AzureAnalytics.Partner.AAPT/shares/AzureAnalytics.Dev/AzureAnalytics.Dev.PublishedData/AAPT.Gauge.Ibiza.Daily/ClientTelemetry/)                          |
|ClientTelemetryForKustoExport | [DataSet=93405](https://nova.msdial.com/vis/DataCatalog/DataSetViewer?dataSet=93405&dataType=Schema) | [Hourly ClientTelemetry](https://cosmos11.osdinfra.net/cosmos/azureanalytics.partner.azureportal/shares/AzureAnalytics.Dev/AzureAnalytics.Dev.PublishedData/AAPT.Gauge.Ibiza.Hourly/ClientTelemetryForKustoExport/)   |

We plan to merge ClientTelemetryForKustoExport into ClientTelemetry stream very shortly. ClientTelemetryForKustoExport is the stream that currently feeds the Kusto database - AzPtlCosmos

<a name="clienttelemetry-azptlcosmos"></a>
### ClientTelemetry (AzPtlCosmos)

<a name="clienttelemetry-azptlcosmos-action"></a>
#### Action
This represents an event in the portal.

 <h1 name="portalfx-telemetry-actions"></h1>
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


<a name="clienttelemetry-azptlcosmos-actionmodifier"></a>
#### ActionModifier
This is used in tandem with the Action field. This represents a status of a particular Action. So for BladeReady for eg., you will see ActionModifier values of start, complete & cancel

<a name="clienttelemetry-azptlcosmos-area"></a>
#### Area
This field usually gives the extension name associated with the particular Action. This is derived from either then Name field or the Source field depending on the Action

<a name="clienttelemetry-azptlcosmos-blade"></a>
#### Blade
This field gives the Blade name associated with the particular Action. This is derived from either then Name field or the Source field depending on the Action

<a name="clienttelemetry-azptlcosmos-browserfamily"></a>
#### BrowserFamily
This field represents the name of the Browser used by the User. This is derived from the UserAgent field

<a name="clienttelemetry-azptlcosmos-browsermajorversion"></a>
#### BrowserMajorVersion
This field represents the Major Version of the Browser used by the User. This is derived from the UserAgent field

<a name="clienttelemetry-azptlcosmos-browserminorversion"></a>
#### BrowserMinorVersion
This field represents the Minor Version of the Browser used by the User. This is derived from the UserAgent field

<a name="clienttelemetry-azptlcosmos-clienttime"></a>
#### ClientTime
This field gives the actual time of the event according to the client's clock (which can be off based on the client settings). This is a good field to reconstruct the precise sequence of events.

<a name="clienttelemetry-azptlcosmos-data"></a>
#### Data
The Data field is the most dynamic field in telemetry. It is a JSON object with no set structure. They often contain information specific to a particular Action. 

Below is an example of the <b>Data</b> filed for <b>Action</b> "ProvisioningStarted"
	
```json
	{
		"oldCreateApi": true,
		"launchingContext": {
		"galleryItemId": "Microsoft.SQLDatabase",
		"source": [
			"GalleryCreateBlade"
		],
		"menuItemId": "recentItems",
		"itemIndex": 0
		}
	}
```

<a name="clienttelemetry-azptlcosmos-duration"></a>
#### Duration
This field gives the duration a particular Action took to complete. This value is non-zero only for Actions with ActionModifier having values either "complete", "succeeded", etc. The time is in milliseconds.

<a name="clienttelemetry-azptlcosmos-journeyid"></a>
#### JourneyId
This field provides the journey Id for each action. A journey is basically a tiny sub-session within which a user navigates a flow of blades. This id allows us to identify the actions that the user took within any given journey, how many journey did a user interact with, etc.

<a name="clienttelemetry-azptlcosmos-lens"></a>
#### Lens
This field gives the Lens name associated with the particular Action. This is derived from either then Name field or the Source field depending on the Action

<a name="clienttelemetry-azptlcosmos-name"></a>
#### Name
The Name field usually changes it's format based on the Action. In most scenarios, it usually has the following format
		
        Extension/<extensionName>/Blade/<BladeName>/Lens/<LensName>/PartInstance/<PartName>

<a name="clienttelemetry-azptlcosmos-this-field-is-usually-used-to-identify-the-extension-blade-lens-part-associated-with-a-particular-action"></a>
#### This field is usually used to identify the extension\Blade\Lens\Part associated with a particular Action.

<a name="clienttelemetry-azptlcosmos-sessionid"></a>
#### SessionId
This represents each sessions that the user opens. SessionId refreshes everytime a user logs in\refreshes. 

<a name="clienttelemetry-azptlcosmos-part"></a>
#### Part
This field gives the Part name associated with the particular Action. This is derived from either then Name field or the Source field depending on the Action

<a name="clienttelemetry-azptlcosmos-precisetimestamp"></a>
#### PreciseTimeStamp
This field gives the time the event was logged by the server. It is in UTC.

<a name="clienttelemetry-azptlcosmos-userid"></a>
#### UserId
This field identifies a user by PUID. We can use this to identify queries like daily active users, unique users using my feature, etc.

<a name="clienttelemetry-azptlcosmos-useragent"></a>
#### UserAgent
This represents the user agent of the user. This is a standard UserAgentString - [User Agent](https://en.wikipedia.org/wiki/User_agent)

<a name="clienttelemetry-azptlcosmos-usercity"></a>
#### UserCity
This represents the City that the User has used the portal from. We derive this from the Users Client IP.

<a name="clienttelemetry-azptlcosmos-usercountry"></a>
#### UserCountry
This represents the Country that the User has used the portal from. We derive this from the Users Client IP.

Read more about [Kusto query language](https://kusto.azurewebsites.net/docs/queryLanguage/query_language.html).

 <h1 name="portalfx-telemetry"></h1>
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

You can read more [here](#portalfx-telemetry-kusto-databases) about Kusto and about the data provided in our Kusto cluster.

<a name="tracked-actions"></a>
### Tracked Actions

 <h1 name="portalfx-telemetry-actions"></h1>
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


<a name="logging"></a>
## Logging

There are two options for collecting telemetry and error/warning logs. You can either configure and use the Portal Framework's built-in telemetry services or you can utilize an entirely custom telemetry system.

> We advise you to use the telemetry controller provided by Framework in order to take advantage of the system which is already in place.

> Information should be collected in a way that that ensures no personally identifiable information (PII) is captured. It is very important for security and compliance reasons that PII data is not sent to telemetry services and you should have practices in place to ensure that this is enforced.

<a name="logging-onboarding-to-exttelemetry-extevents-tables"></a>
### Onboarding to ExtTelemetry/ExtEvents tables

To start using the built-in controller provided by Framework for collecting telemetry and error/warning logs, just add `this.EnablePortalLogging = true;` in the constructor of your extension definition class:

```cs
  public Definition(ApplicationConfiguration applicationConfiguration)
  {
      this.EnablePortalLogging = true;
  }
```

You can read [here](#portalfx-telemetry-logging) more details about using the telemetry controller provided by Framework.

<a name="logging-logging-telemetry-to-exttelemetry-table"></a>
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

<a name="logging-logging-errors-warnings-to-extevents-table"></a>
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

We have built [Extension Errors Dashboard](#portalfx-telemetry-extension-errors) for giving you the ability to analyze easier the errors and warnings thrown by your extension.

**NOTE:**  In the charts from [Extension Errors Dashboard](#portalfx-telemetry-extension-errors), we aggregate the error messages by omitting the text which is within double quotes (") or single quotes ('). We consider those parts to be the dynamic part of the message (e.g. an id, a timestamp etc.). For example, a message like [Could not find part "PartName1"] will be treated as [Could not find part ""]. Please use this format for all the logged error messages, if you want them to be aggregated by our queries.

<a name="available-power-bi-dashboards"></a>
## Available Power BI Dashboards

Following are some of the dashboards that we support. If you do not have access to any of these please request the right permissions in [Getting Started](onenote:#Getting%20Started&section-id={B333CBFA-BF45-47DC-816B-37B2F3CFD7E8}&page-id={F1EE506C-5158-49DB-AD06-1027E2BC3EAD}&end&base-path=https://microsoft.sharepoint.com/teams/azureteams/aapt/azureux/portalfx/SiteAssets/PortalFx%20Notebook/Gauge/Ibiza%20Telemetry%20-%20Internal.one)

|Name                            | PowerBi Link                                                                                                                                     | Metrics Description                                                                    |
|--------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------|
|Portal User Adoption Dashboard  | [http://aka.ms/portalfx/dashboard/PortalUserAdoption](http://aka.ms/portalfx/dashboard/PortalUserAdoption)                                       |                                                                                        |
|Portal Performance Dashboard    | [http://aka.ms/portalfx/dashboard/PortalPerformance](http://aka.ms/portalfx/dashboard/PortalPerformance)                                         | [Perf Docs](#portalfx-performance)                              |
|Portal Reliability Dashboard    | [http://aka.ms/portalfx/dashboard/PortalReliability](http://aka.ms/portalfx/dashboard/PortalReliability)                                         | [Reliability Docs](#portalfx-reliability)                       |
|Portal Create Dashboard         | [http://aka.ms/portalfx/dashboard/PortalCreate](http://aka.ms/portalfx/dashboard/PortalCreate)                                                   | [Create Docs](#portalfx-telemetry-create)                       |
|Extension Errors Dashboard      | [http://aka.ms/portalfx/dashboard/ExtensionErrors](http://aka.ms/portalfx/dashboard/ExtensionErrors)                                             | [Extension Errors Docs](#portalfx-telemetry-extension-errors)   |


<a name="collecting-feedback-from-your-users"></a>
## Collecting Feedback From Your Users

In February 2016 we introduced a standardized pane for collecting user feedback. We currently expose one method to extension developers.

<a name="collecting-feedback-from-your-users-resource-deleted-survey"></a>
### Resource Deleted Survey

To ask a user why they deleted a resource use the `openResourceDeletedFeedbackPane` method:

```
  import * as FxFeedback from "Fx/Feedback";
  FxFeedback.openResourceDeletedFeedbackPane("displayNameOfTheDeletedResource", optionalObjectWithAnyAdditionalDataYouWantToLog);
```

Call this method after a user starts the deletion process for a resource. Shell will open the feedback pane with a standardized survey. The name of the resource you pass to the method will be shown to the user in the survey. Responses to this survey are logged to the telemetry tables. If the feedback pane is already open calls to this method will be no-ops.

<a name="collecting-feedback-from-your-users-questions"></a>
### Questions?

Read more about [Kusto query language](https://kusto.azurewebsites.net/docs/queryLanguage/query_language.html).

Ask questions on: [https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza-telemetry](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza-telemetry)


 <h1 name="portalfx-telemetry-live-telemetry"></h1>
 
<a name="how-to-view-live-telemetry"></a>
## How to view Live Telemetry

<a name="how-to-view-live-telemetry-using-fiddler"></a>
### Using Fiddler

1. Install Fiddler - http://www.telerik.com/fiddler
1. Open Fiddler and configure the "Filters" as below
      ![Fiddler](../media/portalfx-telemetry/fiddler.png)
1. Open Portal and you should see all relevant telemetry logs emitted here.

<a name="how-to-view-live-telemetry-using-fiddler-note"></a>
#### NOTE
  -  If the sign in flow would normally require 2FA (i.e. you are not already signed in), Fiddler will break the sign in flow
  -  Fiddler can capture your passwords

<a name="how-to-view-live-telemetry-using-console-logs"></a>
### Using Console Logs
	
1. Enable Console Telemetry - https://portal.azure.com/?feature.consoletelemetry=true# 
1. Hit F12 and view the "Console" Tab.
1. You will be able to see most of all telemetry logs within this window. The only known **Action** that doesn’t show up here is **CreateFlowLaunched**
    ![Fiddler](../media/portalfx-telemetry/consoleLogs.png)

<a name="how-to-view-live-telemetry-viewing-blade-names"></a>
### Viewing Blade Names

Pressing Ctrl-Alt-D in the Ibiza portal shows some component loading times

![Fiddler](../media/portalfx-telemetry/bladeNames.png)

 <h1 name="portalfx-telemetry-extension-errors"></h1>
 ## Extension Errors Dashboard

**Extension Errors dashboard** gives you the ability to look into the errors and warnings thrown by your extension.

To view the Extension Errors PowerBi dashboard follow this link: [Extension Errors PowerBi dashboard](http://aka.ms/portalfx/dashboard/ExtensionErrors)

<a name="how-to-view-live-telemetry-prerequisites"></a>
### Prerequisites

**NOTE:** Note that your extension's errors/warnings will be tracked in this dashboard only if you have previously [onboarded to ExtTelemetry/ExtEvents tables](#portalfx-telemetry).

<a name="how-to-view-live-telemetry-prerequisites-getting-access-to-the-extension-errors-dashboard"></a>
#### Getting access to the Extension Errors Dashboard

In order to get acess to the Extension Errors Dashboard, you will need to join [Azure Portal Data](http://idwebelements/GroupManagement.aspx?Group=auxdatapartners&Operation=join) group.

<a name="how-to-view-live-telemetry-where-to-look-for-error-warning-spikes"></a>
### Where to look for error/warning spikes

"Errors by Environment" and "Warnings by Environment" are the charts that you need to monitor. You should check to see if there are any significant spikes in the report.

There are three charts on each column:

- Affected Users % = this is the percentage of users which had >= 1 error divided by the total number of users which were using the portal. This chart is very useful to detect changes in the error percentage pattern.
- Affected Users Count = the total number of users which had an error thrown by the portal.
- Error Count = the total number of errors thrown by the portal.

In order to hide irrelevant spikes (where the portal is used by less than 10 users), you can select the option "Show Data" -> "Where total users > 10".

<a name="how-to-view-live-telemetry-find-the-cause-of-error-warning-spikes"></a>
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

<a name="how-to-view-live-telemetry-additional-information"></a>
### Additional information

- All time stamps shown in this dashboard are UTC time stamps.
- Currently, we refresh automatically the dashboard 8 times a day (the maximum number of scheduled refreshes allowed by PowerBI), during working hours: 8:00 AM, 9:30 AM, 11:00 AM, 12:30 PM, 2:00 PM, 3:30 PM, 5:00 PM and 6:30 PM (Pacific Time).

 <h1 name="portalfx-telemetry-create"></h1>
 # Create Telemetry 

<a name="create-flow-telemetry-dashboards"></a>
## Create Flow Telemetry Dashboards

* PowerBi Dashboard: https://msit.powerbi.com/groups/me/dashboards/73368590-6a29-4a85-b534-69791580be4a
* Documentation: https://github.com/Azure/portaldocs/blob/master/portal-sdk/templates/portalfx-telemetry-createFlowDashboard.md
  
<a name="create-flow-table"></a>
## Create Flow table

CreateFlow table in Kusto database **AzPtlCosmos** called **CreateFlows**

Accessible through using the function: **GetCreateFlows(startDate: datetime, endDate: datetime)**

<a name="create-flow-functions"></a>
## Create Flow Functions

[GetCreateFlows](#GetCreateFlows)

[GetCreateFunnel](#GetCreateFunnel)

[GetCreateFunnelByDay](#GetCreateFunnelByDay)

[GetCreateFunnelByGalleryPackageId](#GetCreateFunnelByGalleryPackageId)

[GetCombinedCreateFunnel](#GetCombinedCreateFunnel)

<a name="a-name-getcreateflows-a-getcreateflows-startdate-datetime-enddate-datetime"></a>
# <a name="GetCreateFlows"></a>GetCreateFlows(startDate: datetime, endDate: datetime)

<a name="a-name-getcreateflows-a-getcreateflows-startdate-datetime-enddate-datetime-summary"></a>
## Summary
This function returns the list of Portal Azure service deployment lifecycles, also known as 'create flows', for a given time range.
* Each create flow represents the lifecycle of a create with the beginning being marked by the moment the create blade is opened and ending the moment that the create has been concluded and logged by the Portal.
* Data for each create is curated and joined between Portal data logs and available ARM deployment data logs.

<a name="a-name-getcreateflows-a-getcreateflows-startdate-datetime-enddate-datetime-common-use-cases"></a>
## Common Use Cases
* Identifying the number of creates completed for a given Extension or for a particular Azure marketplace gallery package.
* Calculating the percentage of successful creates initiated by an Extension's create blade.
* Debugging failed deployments by retrieving error message information logged for failed creates.
* Calculating the number of creates that were abandoned by the user before being initiated and completed.
* Identifying creates initiated by a given user id.
* Calculating the average create duration by data center.

<a name="a-name-getcreateflows-a-getcreateflows-startdate-datetime-enddate-datetime-underlying-function-resources"></a>
## Underlying Function Resources
* `cluster("Azportal").database("AzPtlCosmos").CreateFlows`
  * The source of the Azure create lifecycle deployment information.
* `cluster("Armprod").database("ARMProd").Deployments`
  * The source of the ARM deployment information
* `cluster("Armprod").database("ARMProd").HttpIncomingRequests`
  * Used to identify which of the ARM deployments are requests made from the Portal.
* `cluster("Armprod").database("ARMProd").EventServiceEntries`
  * The source of the ARM deployment failed logs error information.

<a name="a-name-getcreateflows-a-getcreateflows-startdate-datetime-enddate-datetime-parameters"></a>
## Parameters
* startDate: The date to mark the inclusive start of the time range.
* endDate: The date to mark the exclusive end of the time range.

<a name="a-name-getcreateflows-a-getcreateflows-startdate-datetime-enddate-datetime-output-columns"></a>
## Output Columns
* PreciseTimeStamp
  * Time of which the create blade was opened
  * When the create flow launched event is logged by the server
* TelemetryId
  * The unique identifier of this Azure Portal create flow.
* Extension
  * The extension which initiated the deployment.
* Blade
  * The name of the blade which was used to initiated the deployment.
* GalleryPackageId
  * The Azure service market place gallery package that was created.
* ExecutionStatus
  * The final result of the create execution.
  * Possible execution statuses
    * Succeeded
      * The create was successfully completed.
      * If ARMExecutionStatus is "Succeeded" or if ARMExecutionStatus is blank and PortalExecutionStatus is "Succeeded"
    * Canceled
      * The create was canceled before completion
      * If ARMExecutionStatus is "Canceled" or if ARMExecutionStatus is blank and PortalExecutionStatus is "Canceled"
    * Failed
      * The create failed to complete.
      * If ARMExecutionStatus is "Failed" or if ARMExecutionStatus is blank and PortalExecutionStatus is "Failed"
    * BillingError
      * The create failed to completed because of the error, "We could not find a credit card on file for your azure subscription. Please make sure your azure subscription has a credit card."
    * Unknown
      * The status of the create is unable to be determined.
      * If ARMExecutionStatus is blank and PortalExecutionStatus is blank
    * Abandoned 
      * The create blade was closed before a create was initialized.
* Excluded
  * Boolean which represents if this Create Flow is to be excluded from create funnel KPI calculations.
  * A Create Flow is marked Excluded = true if ExecutionStatus is "Canceled", "CommerceError", or "Unknown".
* CorrelationId
  * The unique ARM identifier of this deployment.
* ArmDeploymentName
  * The name of the resource group deployment from ARM.
* ArmExecutionStatus
  * The result of the deployment from ARM.
* PortalExecutionStatus
  * The result of the deployment execution logged by the Portal.
* ArmStatusCode
  * The ARM status code of the deployment .
* ArmErrorCode
  * The error code of a failed deployment logged by ARM.
* ArmErrorMessage
  * The error message of a failed deployment logged by ARM.
* PortalErrorCode
  * The error code of a failed deployment logged by the Portal.
* PortalErrorMessage
  * The error message of a failed deployment logged by the Portal.
* CreateBladeOpened
  * Boolean representing if the create blade was opened.
  * Logged as a CreateFlowLaunched event at the time that the create blade is opened and logged by the Portal.
* CreateBladeOpened_ActionModifier
  * Context for CreateBladeOpened.
* CreateBladeOpened_TimeStamp
  * Time when the create blade was opened.
* PortalCreateStarted
  * Boolean representing if a Portal create was started for this create flow.
  * Logged by a ProvisioningStarted event when the create is initiated.
* PortalCreateStarted_ActionModifier
  * Context for PortalCreateStarted.
* PortalCreateStarted_TimeStamp
  * Time when the Portal create was started and logged by the Portal.
* ArmDeploymentStarted
  * Boolean representing if a deployment request was accepted by ARM.
  * Logged when the deployment request is acknowledged by ARM and a CreateDeploymentStart event was logged by the Portal.
* ArmDeploymentStarted_ActionModifier
  * Context for the ArmDeploymentStarted.
* ArmDeploymentStarted_TimeStamp
  * The time when the ARM deployment request response was logged by the Portal.
* ArmDeploymentEnded
  * Boolean representing if a deployment was completed by ARM.
  * Logged when ARM has completed status for the deployment and a CreateDeploymentEnd event was logged by the Portal.
* ArmDeploymentEnded_ActionModifier
  * Context for ArmDeploymentEnded.
* ArmDeploymentEnded_TimeStamp
  * The time when the CreateDeploymetEnd event was logged.
* PortalCreateEnded
  * Boolean representing if a Portal create was completed for this create flow.
  * Logged when all operations relating to the create have completed and a ProvisioningEnded event was logged by the Portal.
* PortalCreateEnded_ActionModifier
  * Context for PortalCreateEnded.
* ProvisioningEnded_TimeStamp
  * Time when the Portal create was completed and logged by the Portal.
* ArmPreciseStartTime
  * Start time of the deployment through ARM
* ArmPreciseEndTime
  * End time of the deployment through ARM.
* ArmPreciseDuration
  * Duration of the deployment through ARM.
* PortalCreateStartTime
  * Start time of the Portal create.
* PortalCreateEndTime
  * End time of the Portal create.
* PortalCreateDuration
  * Duration of the Portal create.
  * PortalCreateDuration = PortalCreateEndTime - PortalCreateStartTime
* Data
  * The entire collection of logged create events' telemetry data in JSON format.
* BuildNumber
  * The Portal SDK and environment in which the deployment was initiated.
* DataCenterId
  * The data center in which the deployment telemetry originated.
* SessionId
  * The session in which the deployment was initiated.
* UserId
  * The user identification which initiated the deployment.
* SubscriptionId
  * The subscription Id
* TenantId
  * The tenant Id
* Template
  * The type of the create template used.
* OldCreateApi
  * Boolean representing if the deployment was initiated using the latest supported Provisioning API.
* CustomDeployment
  * Boolean representing if the deployment was initiated using the Portal ARM Provisioning Manager.

<a name="a-name-getcreatefunnel-a-getcreatefunnel-startdate-datetime-enddate-datetime"></a>
# <a name="GetCreateFunnel"></a>GetCreateFunnel(startDate: datetime, endDate: datetime)

<a name="a-name-getcreatefunnel-a-getcreatefunnel-startdate-datetime-enddate-datetime-summary"></a>
## Summary
This functions calculates the create funnel KPI's for each extension's create blade for a given time range.

<a name="a-name-getcreatefunnel-a-getcreatefunnel-startdate-datetime-enddate-datetime-common-use-cases"></a>
## Common Use Cases
* Retrieving the percentage of successful create initated by an Extension's create blade for a week.
* Retrieving the number of the failed creates.
* Retrieving the drop off rate of customers attempting a create (how often creates are abandoned).

<a name="a-name-getcreatefunnel-a-getcreatefunnel-startdate-datetime-enddate-datetime-underlying-function-resources"></a>
## Underlying Function Resources
* [GetCreateFlows()](#GetCreateFlows)

<a name="a-name-getcreatefunnel-a-getcreatefunnel-startdate-datetime-enddate-datetime-parameters"></a>
## Parameters
* startDate: The date to mark the inclusive start of the time range.
* endDate: The date to mark the exclusive end of the time range.

<a name="a-name-getcreatefunnel-a-getcreatefunnel-startdate-datetime-enddate-datetime-output-columns"></a>
## Output Columns
* Extension
  * The Extension which initiated the creates.
* Blade
  * The create blade which inititated the creates.
* CreateBladeOpened
  * The number of times the create blade was opened.
  * Calculated by taking the count of the number of Create Flows for each blade from [GetCreateFlows()](#GetCreateFlows) which had:
    * `CreateBladeOpened == true`.
* Started
  * The number of creates that were started.
  * Calculated by taking the count of the number of Create Flows for each blade from [GetCreateFlows()](#GetCreateFlows) which had:
    * `PortalCreateStarted == true`
    * or `ArmDeploymentStarted == true`
  * *Note - We check both of these for redundancy proof becuase we know that as long as one of these properties are true then we know a create was started.*
* Excluded
  * The number of creates from [GetCreateFlows()](#GetCreateFlows) that were marked as Excluded.
  * *See [GetCreateFlows()](#GetCreateFlows) documentation for Excluded details.*
* Completed
  * The number of creates that were completed.
  * Completed = Started - Excluded
* StartRate
  * The rate of create blades that are opened which leads to a create being started.
  * StartRate = Started / CreateBladeOpened
* Succeeded
  * The number of creates that succeeded.
* SuccessRate
  * The rate of completed creates which succeeded.
  * SuccessRate = Succeeded / Completed
* Failed
  * The number of creates that failed.
* FailureRate
  * The rate of completed creates which failed.
  * FailureRate = Failed / Completed
* Canceled
  * The number of creates which were canceled.
* CommerceError
  * The number of creates which were aborted due to a commerce error.
* Unknown
  * The number of creates which do not have a known result.
* OldCreateApi
  * Represents if the create blade deployments were initiated using a deprecated version of the ARM provisioning API provided by the Portal SDK
* CustomDeployment
  * Represents if the create blade deployments were initiated without using the official ARM provisioning API provided by the portal SDK

<a name="a-name-getcreatefunnelbyday-a-getcreatefunnelbyday-startdate-datetime-enddate-datetime"></a>
# <a name="GetCreateFunnelByDay"></a>GetCreateFunnelByDay(startDate: datetime, endDate: datetime)

<a name="a-name-getcreatefunnelbyday-a-getcreatefunnelbyday-startdate-datetime-enddate-datetime-summary"></a>
## Summary
This functions calculates the create funnel KPI's for each extension's create blade for each day over a given time range.

<a name="a-name-getcreatefunnelbyday-a-getcreatefunnelbyday-startdate-datetime-enddate-datetime-common-use-cases"></a>
## Common Use Cases
* Identifying the change in the number of successful create initiated by an Extension's create blade over the course of multiple weeks.
* Identifying which days have higher number of failed deployments.

<a name="a-name-getcreatefunnelbyday-a-getcreatefunnelbyday-startdate-datetime-enddate-datetime-underlying-function-resources"></a>
## Underlying Function Resources
* [GetCreateFlows()](#GetCreateFunnelByDay)

<a name="a-name-getcreatefunnelbyday-a-getcreatefunnelbyday-startdate-datetime-enddate-datetime-parameters"></a>
## Parameters
* startDate: The date to mark the inclusive start of the time range.
* endDate: The date to mark the exclusive end of the time range.

<a name="a-name-getcreatefunnelbyday-a-getcreatefunnelbyday-startdate-datetime-enddate-datetime-output-columns"></a>
## Output Columns
* Date
  * The date at midnight of the day which the create flow was started.
* Extension
  * The Extension which initiated the creates.
* Blade
  * The create blade which inititated the creates.
* GalleryPackageId
  * The gallery package id that was created.
* CreateBladeOpened
  * The number of times the create blade was opened.
  * Calculated by taking the count of the number of Create Flows  for each blade from [GetCreateFlows()](#GetCreateFlows) which had:
    * `CreateBladeOpened == true`.
* Started
  * The number of creates that were started.
  * Calculated by taking the count of the number of Create Flows  for each blade from [GetCreateFlows()](#GetCreateFlows) which had:
    * `PortalCreateStarted == true`
    * or `ArmDeploymentStarted == true`
  * *Note - We check both of these for redundancy proof becuase we know that as long as one of these properties are true then we know a create was started.*
* Excluded
  * The number of creates from [GetCreateFlows()](#GetCreateFlows) that were marked as Excluded.
  * *See [GetCreateFlows()](#GetCreateFlows) documentation for Excluded details.*
* Completed
  * The number of creates that were completed.
  * Completed = Started - Excluded
* StartRate
  * The rate of create blades that are opened which leads to a create being started.
  * StartRate = Started / CreateBladeOpened
* Succeeded
  * The number of creates that succeeded.
* SuccessRate
  * The rate of completed creates which succeeded.
  * SuccessRate = Succeeded / Completed
* Failed
  * The number of creates that failed.
* FailureRate
  * The rate of completed creates which failed.
  * FailureRate = Failed / Completed
* Canceled
  * The number of creates which were canceled.
* CommerceError
  * The number of creates which were aborted due to a commerce error.
* Unknown
  * The number of creates which do not have a known result.
* OldCreateApi
  * Represents if the create blade deployments were initiated using a deprecated version of the ARM provisioning API provided by the Portal SDK
* CustomDeployment
  * Represents if the create blade deployments were initiated without using the official ARM provisioning API provided by the portal SDK

<a name="a-name-getcreatefunnelbygallerypackageid-a-getcreatefunnelbygallerypackageid-startdate-datetime-enddate-datetime"></a>
# <a name="GetCreateFunnelByGalleryPackageId"></a>GetCreateFunnelByGalleryPackageId(startDate: datetime, endDate: datetime)

<a name="a-name-getcreatefunnelbygallerypackageid-a-getcreatefunnelbygallerypackageid-startdate-datetime-enddate-datetime-summary"></a>
## Summary
This functions calculates the create funnel KPI's by gallery package id, extension, and create blade over a given time range.

<a name="a-name-getcreatefunnelbygallerypackageid-a-getcreatefunnelbygallerypackageid-startdate-datetime-enddate-datetime-common-use-cases"></a>
## Common Use Cases
* Identifying the number of successfully creates for a resource.
* Identifying which resources have higher number of failed deployments.

<a name="a-name-getcreatefunnelbygallerypackageid-a-getcreatefunnelbygallerypackageid-startdate-datetime-enddate-datetime-underlying-function-resources"></a>
## Underlying Function Resources
* [GetCreateFlows()](#GetCreateFlows)

<a name="a-name-getcreatefunnelbygallerypackageid-a-getcreatefunnelbygallerypackageid-startdate-datetime-enddate-datetime-parameters"></a>
## Parameters
* startDate: The date to mark the inclusive start of the time range.
* endDate: The date to mark the exclusive end of the time range.

<a name="a-name-getcreatefunnelbygallerypackageid-a-getcreatefunnelbygallerypackageid-startdate-datetime-enddate-datetime-output-columns"></a>
## Output Columns
* Extension
  * The Extension which initiated the creates.
* Blade
  * The create blade which inititated the creates.
* GalleryPackageId
  * The gallery package id that was created.
* CreateBladeOpened
  * The number of times the create blade was opened.
  * Calculated by taking the count of the number of Create Flows for each blade from [GetCreateFlows()](#GetCreateFlows) which had:
    * `CreateBladeOpened == true`.
* Started
  * The number of creates that were started.
  * Calculated by taking the count of the number of Create Flows for each blade  from [GetCreateFlows()](#GetCreateFlows) which had:
    * `PortalCreateStarted == true`
    * or `ArmDeploymentStarted == true`
  * *Note - We check both of these for redundancy proof becuase we know that as long as one of these properties are true then we know a create was started.*
* Excluded
  * The number of creates from [GetCreateFlows()](#GetCreateFlows) that were marked as Excluded.
  * *See [GetCreateFlows()](#GetCreateFlows) documentation for Excluded details.*
* Completed
  * The number of creates that were completed.
  * Completed = Started - Excluded
* StartRate
  * The rate of create blades that are opened which leads to a create being started.
  * StartRate = Started / CreateBladeOpened
* Succeeded
  * The number of creates that succeeded.
* SuccessRate
  * The rate of completed creates which succeeded.
  * SuccessRate = Succeeded / Completed
* Failed
  * The number of creates that failed.
* FailureRate
  * The rate of completed creates which failed.
  * FailureRate = Failed / Completed
* Canceled
  * The number of creates which were canceled.
* CommerceError
  * The number of creates which were aborted due to a commerce error.
* Unknown
  * The number of creates which do not have a known result.
* OldCreateApi
  * Represents if the create blade deployments were initiated using a deprecated version of the ARM provisioning API provided by the Portal SDK
* CustomDeployment
  * Represents if the create blade deployments were initiated without using the official ARM provisioning API provided by the portal SDK

<a name="a-name-getcombinedcreatefunnel-a-getcombinedcreatefunnel-startdate-datetime-enddate-datetime"></a>
# <a name="GetCombinedCreateFunnel"></a>GetCombinedCreateFunnel(startDate: datetime, endDate: datetime)

<a name="a-name-getcombinedcreatefunnel-a-getcombinedcreatefunnel-startdate-datetime-enddate-datetime-summary"></a>
## Summary
This functions calculates the overall create funnel KPIs for the Portal.

<a name="a-name-getcombinedcreatefunnel-a-getcombinedcreatefunnel-startdate-datetime-enddate-datetime-common-use-cases"></a>
## Common Use Cases
* Identifying the overall success rates of creates in the Portal.
* Identifying the total number of failed creates in the Portal.
* Identifying the total number of create aborted due to commerce errors in the Portal.
* Identifying the overall rate of create flows that lead to a create being started.

<a name="a-name-getcombinedcreatefunnel-a-getcombinedcreatefunnel-startdate-datetime-enddate-datetime-underlying-function-resources"></a>
## Underlying Function Resources
* [GetCreateFlows()](#GetCreateFlows)

<a name="a-name-getcombinedcreatefunnel-a-getcombinedcreatefunnel-startdate-datetime-enddate-datetime-parameters"></a>
## Parameters
* startDate: The date to mark the inclusive start of the time range.
* endDate: The date to mark the exclusive end of the time range.

<a name="a-name-getcombinedcreatefunnel-a-getcombinedcreatefunnel-startdate-datetime-enddate-datetime-output-columns"></a>
## Output Columns
* CreateBladeOpened
  * The total number of times create blade were opened.
  * Calculated by taking the total count of the number of Create Flows from [GetCreateFlows()](#GetCreateFlows) which had:
    * `CreateBladeOpened == true`.
* Started
  * The total number of creates that were started.
  * Calculated by taking the total count of the number of Create Flows from [GetCreateFlows()](#GetCreateFlows) which had:
    * `PortalCreateStarted == true`
    * or `ArmDeploymentStarted == true`
  * *Note - We check both of these for redundancy proof becuase we know that as long as one of these properties are true then we know a create was started.*
* Excluded
  * The total number of creates from [GetCreateFlows()](#GetCreateFlows) that were marked as Excluded.
  * *See [GetCreateFlows()](#GetCreateFlows) documentation for Excluded details.*
* Completed
  * The total number of creates that were completed.
  * Completed = Started - Excluded
* StartRate
  * The rate of create blades that are opened which leads to a create being started.
  * StartRate = Started / CreateBladeOpened
* Succeeded
  * The total number of creates that succeeded.
* SuccessRate
  * The overall rate of completed creates which succeeded.
  * SuccessRate = Succeeded / Completed
* Failed
  * The total number of creates that failed.
* FailureRate
  * The overrall rate of completed creates which failed.
  * FailureRate = Failed / Completed
* Canceled
  * The total number of creates which were canceled.
* CommerceError
  * The total number of creates which were aborted due to a commerce error.
* Unknown
  * The total number of creates which do not have a known result.


<a name="create-troubleshooting"></a>
# Create Troubleshooting
 <h1 name="portalfx-create-troubleshooting"></h1>
 ## Overview

Creates are when a user tries to provision a resource using the portal.  The goal of the Create Flow Regressions alert is to  generate awareness when our create reliability seems to be degrading.  This can happen for a number of reasons, this alert does not attempt to distinguish the reasons why.

The alert fires any time the success rate drops more than 5% below the bar on average over an hour.  MDM will send an alert each time this happens.  The first thing to do is take a look at MDM by selecting the link at the bottom of the ICM, this will show a trend of how long the alert has been active and to what degree.

The numbers are the percentage of regression.  For example, if latest value is 10 it means the success rate has regressed by 10% below the bar.  If it seems to be trending up then this is a much bigger concern than one that spiked then went down.

This bar is set on a blade by blade basis and can be adjusted as needed.

<a name="create-troubleshooting-types-of-create-failures"></a>
## Types of Create Failures

There are three types of create failures:

1. The create was successfully sent to ARM, but ARM eventually reported Failure rather than Success or Cancel
    - Billing errors such as no credit card are considered canceled creates rather than failures
2. The create request was not accepted by ARM for any reason
3. This is a custom create where the *ProvisioningEnded* is either missing or reports an error

<a name="create-troubleshooting-debugging-alerts"></a>
## Debugging Alerts

Follow the below documentation to understand and debug your create regressions that caused the alert.

<a name="create-troubleshooting-debugging-alerts-alert-regression-error-count"></a>
### Alert Regression Error Count
 
If you want to see what errors are making up your regression percentage *(over the last 24 hours ending at the datetime provided)* and how many times these errors are occurring then the following query will give you the break down you are looking for (using websites as an example): 
 
`GetCreateRegressionErrorCount(now(),"websitesextension","webhostingplancreateblade")` [[Run in Kusto.Explorer]](https://azportal.kusto.windows.net:443/AzurePortal?query=H4sIAAAAAAAEAHNPLXEuSk0sSQ1KTS9KLS7OzM9zrSgJLs3NTSyq1MjLL9fQ1FEqT00qzixJLU6tKEnNAylR0lTg5QIAqPv6pjsAAAA%3d) [[Run in Kusto.WebExplorer]](https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/azportal/databases/AzurePortal?q=H4sIAAAAAAAEAB3MQQqAMAwF0bt01YK3KOLeG7T6qYGSSBKpxxe7HR6zwbOiOHY0hRkJr6qiWR72yDJiWsJANXIYXgf%2fJMx2iTlxu3vhYz5qLydC%2bgAfaEluVAAAAA%3d%3d) 

 
This function is best used when trying to identify the main error that is causing your regression numbers to increase. 
 
Input Parameters:
 
* **End time** – 24 hours ending at this end time will be the time span which is scanned for errors. Time range: [end time – 24 hours, end time] 
* **Extension** – the extension you are looking into 
* **CreateBladeName** – the name of the create blade which the errors occurred on 

Output Result Columns: 

* **extension** – the extension specified 
* **CreateBladeName** – the create blade name specified 
* **ErrorCode** – the error code that specifies the type of error that occurred 
* **Hits** – the number of times this error occurred 

<a name="create-troubleshooting-debugging-alerts-alert-regression-details"></a>
### Alert regression details

When things go wrong you will need to drill down. Once you have used GetCreateRegressionErrorCount to understand the main errors that are causing your regressions numbers *(over the last 24 hours ending at the datetime provided)* to spike, you will now need to understand what caused them.  The following query shows all of the failed creates with their error messages for a specific extension and blade (using websites as an example): 

`GetCreateRegressionDetails(now(),"websitesextension","webhostingplancreateblade")` [[Run in Kusto.Explorer]](https://azportal.kusto.windows.net:443/AzurePortal?query=H4sIAAAAAAAEAHNPLXEuSk0sSQ1KTS9KLS7OzM9zSS1JzMwp1sjLL9fQ1FEqT00qzixJLU6tKEnNA8krgcUy8otLMvPSC3IS85LBBiTlJKakKmnycgEAg5C8UlMAAAA%3d) [[Run in Kusto.WebExplorer]](https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/azportal/databases/AzurePortal?q=H4sIAAAAAAAEAHNPLXEuSk0sSQ1KTS9KLS7OzM9zSS1JzMwp1sjLL9fQ1FEqT00qzixJLU6tKEnNA8krgcUy8otLMvPSC3IS85LBBiTlJKakKmnycgEAg5C8UlMAAAA%3d)

Input Parameters: 

* **End time** – 24 hours ending at this end time will be the time span which is scanned for errors. Time range: [end time – 24 hours, end time]. 
* **Extension** – The extension you are looking into. 
* **CreateBladeName** – The name of the create blade which the errors occurred on. 

Output Result Columns: 

* **extension** – The name of the extension. 
* **name** – The name of the resource attempted to be created. 
* **CreateBladeName** – The name of the create blade from which the create flow originated.  
* **status** – The resulting status of the create. Regressions are represented only by failed creates, so this should always be marked as "Failed". 
* **MessageCode** - In the case of a Failed status create flow, this typically is the name of the error which occurred. We try to always fill this information in for you, but if it is blank then you may have to go digging for this information in the **data** field. More information regarding this below. 
* **Message** – In the case of a Failed status create flow, this typically is the resulting message of the error which occurred which provides context as to why the create flow was a failure.  We try to always fill this information in for you, but if it is blank then you may have to go digging for this information in the data field. More information regarding this below. 
* **StartTime** – When the create was initiated. 
* **EndTime** – When the create completed. If the EndTime is the same as the StartTime then the create failed to be initiated correctly or the information regarding its completion is lost. 
* **Duration** – The length in time of the create from start to finish. If the duration is 00:00:00 then the create failed to be initiated correctly or the information regarding its completion is lost. 
* **telemetryId** – The id which is used to identify the creates events which make up a create flow. 
* **userId** – ID which represents the user that initiated the create. 
* **sessionId** – ID which represents the sessions in which the create was initiated. 
* **CustomDeployment** – Boolean representing if the create is a custom deployment and therefore was not initiated through the ARM provisioner.  
* **data** – Contains all of the in-depth information regarding the different stages of the create flow  

The most interesting field is the **data** field. It contains JSON describing details of the create.  **Understanding the data field is crucial to debugging simple to complicated regression issues.**

**The data field:**

To understand how the data field is created, one must understand the life cycle of the create flow. This process is slightly different for a standard deployment through ARM vs a custom deployment (one that does not use the ARM provisioner). 

1. When a create is initiated a **ProvisioningStarted** events is logged.  
2. Once the request for that deployment is received and acknowledge by ARM a **CreateDeploymentStart** event is logged. *(not logged for custom deployment) *
3. When the status of the completion of that deployment  is available a **CreateDeploymentEnd** event is logged.  *(not logged for custom deployment) *
4. Once the deployment is finished and the Portal has finished the create process a **ProvisioningEnded** event is logged. 

The data field contains all of the data from each of these logged create events (if available) to give you the information from each stage of the lifecycle.  Each of these are represented by 3 main fields: 

* **action** – The action logged (ProvisioningStarted, CreateDeploymentStart, CreateDeploymentEnd, ProvisioningEnded) 
* **actionModifier** – The context in which the action was being logged.
    Here are the available different combinations of **action** and **actionModifier**:

    |      action         |actionModifier|
    |---------------------|--------------|
    |ProvisioningStarted  |   mark       |
    |CreateDeploymentStart|   Failed     |
    |CreateDeploymentStart|   Succeeded  |
    |CreateDeploymentEnd  |   Canceled   |
    |CreateDeploymentEnd  |   Failed     |
    |CreateDeploymentEnd  |   Succeeded  |
    |ProvisioningEnded    |   Failed     |
    |ProvisioningEnded    |   Succeeded  |
* **data** – the data field for this particular create event which makes up part of the greater create flow

**Digging for the error MessageCode field and Message field in the data field**

So, we were either unable to provide you with the correct error code or message, or you are looking for more context and information. The way to go about this is to start digging into the **data** field.  

1. Locate the last create event with data available inside of the data field. This is typically the **ProvisioningEnded** event, but if that is not available then use the **CreateDeploymentEnd** event. If neither of these are available, then the information has been lost for an unknown reason and it isn't available at all. 
2. Look into the **data** field of the event until you find the details field  
3. The details field should contains a hierarchy of error codes and error message. The inner mode error code or message should be the underlying cause of the deployment failure. 


<a name="create-troubleshooting-debugging-alerts-all-creates"></a>
### All Creates

When looking for patterns it is sometimes better to see the good with the bad.  The following query returns a single row for each create:

`GetCreatesByDateRange(ago(1d),now())` [[Run in Kusto.Explorer]](https://azportal.kusto.windows.net:443/AzurePortal?query=H4sIAAAAAAAEAHNPLXEuSk0sSS12qnQBUkGJeempGonp%2bRqGKZo6efnlGpqavFwAGPlBOSYAAAA%3d) [[Run in Kusto.WebExplorer]](https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/azportal/databases/AzurePortal?q=H4sIAAAAAAAEAHNPLXEuSk0sSS12qnQBUkGJeempGonp%2bRqGKZo6efnlGpqavFwAGPlBOSYAAAA%3d)
 
The results include:

* Extension
* Name - name of the asset type
* CreateBladeName
* Status - has one of the following values
    * Succeeded
    * Failed
    * Unknown
    * Canceled - (billing errors are included here)
* telemetryId - unique ID for the deployment
* CustomDeployment - if not an ARM deployment this is true
        
<a name="create-troubleshooting-debugging-alerts-all-creates-with-additional-details"></a>
### All Creates With Additional Details

To query with more details the following query:

`GetCreateDetailsByDateRange(ago(1d),now())` [[Run in Kusto.Explorer]](https://azportal.kusto.windows.net/AzurePortal?query=H4sIAAAAAAAEAHNPLXEuSk0sSQ1KTS9KLS7OzM9zSS1JzMwp1sjLL9fQ1FEqT00qzixJLU6tKEnNA8krgcUy8otLMvPSC3IS85LBBiTlJKakKmnycgEAg5C8UlMAAAA%3d) [[Run in Kusto.WebExplorer]](https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/azportal/databases/AzurePortal?q=H4sIAAAAAAAEAB3MQQqAMAwF0bt01YK3KOLeG7T6qYGSSBKpxxe7HR6zwbOiOHY0hRkJr6qiWR72yDJiWsJANXIYXgf%2fJMx2iTlxu3vhYz5qLydC%2bgAfaEluVAAAAA%3d%3d)
 
 Adds the following properties with multiple rows per telemetryId (each telemetryId == 1 create):

* userId
* sessionId
* action
* actionModifier
* Data - this has a JSON string that contains most of the information needed for debugging

This function is best used when trying to identify the main error that is causing your regression numbers to increase.

Input Parameters:

* **End time** – 24 hours ending at this end time will be the time span which is scanned for errors. Time range: [end time – 24 hours, end time]
* **Extension** – the extension you are l

Output Result Columns:

* **Extension** – the extension specified
* **CreateBladeName** – the create blade name specified
* **ErrorCode** – the overall error code that specifies the type of error that occurred
* **Hits** – the number of times this error

<a name="create-troubleshooting-debugging-alerts-alert-query"></a>
### Alert query
The alert itself is driven from the following query:

`CreateFlowRegressions(now())` [[Run in Kusto.Explorer]](https://azportal.kusto.windows.net:443/AzurePortal?query=H4sIAAAAAAAEAHMuSk0sSXXLyS8PSk0vSi0uzszPK9bIyy%2fX0NRU4OUCAOcPvacfAAAA) [[Run in Kusto.WebExplorer]](https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/azportal/databases/AzurePortal?q=H4sIAAAAAAAEAHMuSk0sSXXLyS8PSk0vSi0uzszPK9bIyy%2fX0NRU4OUCAOcPvacfAAAA)

This has strangely named columns that are required by MDM, but essentially it tracks success percentage over the last 24 hours versus the success bar:

* `d_ExtensionName`
* `d_CreateBladeName`
* `m_CreateRegressionPercent - percentage of regression below the bar`
* `m_CreateRegressionCount - number of creates over the last 24 hours`
* `timestamp`

The alert is generated any time the regression is more than 5% from the bar.

<a name="create-troubleshooting-debugging-alerts-alert-bar"></a>
### Alert bar
The bar is a value we've captured based on current performance.  This should be raised over time as the create becomes more reliable.  PMs from the portal team will help you remember that this is needed.

To see the current bar settings use the following query:

`_CreateFlowRegressionOverrides()` [[Run in Kusto.Explorer]](https://azportal.kusto.windows.net:443/AzurePortal?query=H4sIAAAAAAAEAIt3LkpNLEl1y8kvD0pNL0otLs7Mz%2fMvSy0qykxJLdbQVODlAgAOtIVvIwAAAA%3d%3d) [[Run in Kusto.WebExplorer]](https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/azportal/databases/AzurePortal?q=H4sIAAAAAAAEAHMuSk0sSXXLyS8PSk0vSi0uzszPK9bIyy%2fX0NRU4OUCAOcPvacfAAAA) 

* Extension
* CreateBladeName
* Ignore - if true this extension is excluded from alerting
* Bar - this is the success percentage expected
* NormalizedCount - not used
* Reason - notes about why the bar was set
    
<a name="create-troubleshooting-debugging-alerts-alert-summaries-base"></a>
### Alert summaries base
    
The alert is very specific as per the rules of MDM and does not provide any context.  To see the state of creates more clearly try the following query:

`_CreateFlowRegressionsBase(now(),24h,50)` [[Run in Kusto.Explorer]](https://azportal.kusto.windows.net:443/AzurePortal?query=H4sIAAAAAAAEAIt3LkpNLEl1y8kvD0pNL0otLs7Mzyt2SixO1cjLL9fQ1DEyydAxNdDk5QIAWr8chSoAAAA%3d) [[Run in Kusto.WebExplorer]](https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/azportal/databases/AzurePortal?q=H4sIAAAAAAAEAIt3LkpNLEl1y8kvD0pNL0otLs7Mzyt2SixO1cjLL9fQ1DEyydAxNdDk5QIAWr8chSoAAAA%3d)

The parameters are the start time, number of hours to check, minimum number of creates required.  The parameters shown are what drives the alert query.  Using this and adding a filter for your extension will give you a pretty clear idea of the current state.

This query gives:
* EndTime
* Extension
* CreateBladeName
* Count
* SuccessRate
* SuccessBar
* Regression

The simple version of this takes an extension name parameter and automatically filters to the necessary section.  For example, for websites the query would be:

`GetCreateRegressionExtSummary(now(),"websitesextension")` [[Run in Kusto.Explorer]](https://azportal.kusto.windows.net:443/AzurePortal?query=H4sIAAAAAAAEAHNPLXEuSk0sSQ1KTS9KLS7OzM9zrSgJLs3NTSyq1MjLL9fQ1FEqT00qzixJLU6tKEnNAylR0lTg5QIAqPv6pjsAAAA%3d) [[Run in Kusto.WebExplorer]](https://ailoganalyticsportal-privatecluster.cloudapp.net/clusters/azportal/databases/AzurePortal?q=H4sIAAAAAAAEAHNPLXEuSk0sSQ1KTS9KLS7OzM9zrSgJLs3NTSyq1MjLL9fQ1FEqT00qzixJLU6tKEnNAylR0lTg5QIAqPv6pjsAAAA%3d)


<a name="performance"></a>
# Performance
 <h1 name="portalfx-performance"></h1>
 ## Overview

Portal performance from a customers perspective is seen as all experiences throughout the product. 
As an extension author you have a duty to uphold your experience to the performance bar at a minimum.

| Area      | Sub-Area                   | 80th Percentile Bar | Telemetry Action         | How is it measured? |
| --------- | -------------------------- | ------------------- | ------------------------ | ------------------- |
| Blade     | Revealed                   | See Power BI        | BladeRevealed            | Time it takes for the blade's OnInputsSet to resolve and all the parts on the blade and above the fold to reveal |
| Blade     | FullRevealed               | N/A                 | BladeFullRevealed        | Same as Revealed but all the parts on the blade to reveal |
| Part      | Revealed                   | See Power BI        | PartRevealed             | Time it takes for the part to be rendered and then the part's OnInputsSet to resolve or earlyReveal to be called |
| WxP       | N/A                        | See Power BI        | N/A                      | An overall experience score, calculated by weighting blade usage and the blade revealed time |

<!--| Extension | Initial Extension Response | TODO                | InitialExtensionResponse | TODO |
| Extension | Manifest Load              | TODO                | ManifestLoad             | TODO |
| Extension | Initialization             | TODO                | InitializeExtensions     | TODO | -->

<a name="performance-extension-performance"></a>
## Extension performance

Extension performance effects both Blade and Part performance, as your extension is loaded and unloaded as and when it is required.
In the case a user is visiting your resource blade for the first time, the Fx will load up your extension and then request the view model, consequently your Blade/Part
performance is effected.
If the user were to browse away from your experience and browse back before your extension is unloaded obviously second visit will be faster, as they don't pay the cost
of loading the extension.

<a name="performance-blade-performance"></a>
## Blade performance

Blade performance is spread across a couple of main areas:

1. Blade's constructor
1. Blade's OnInputsSet
1. Any Parts within the Blade become revealed

All of which are encapsulated under the one BladeRevealed action.

<a name="performance-part-performance"></a>
## Part performance

Similar to Blade performance, Part performance is spread across a couple of areas:

1. Part's constructor
1. Part's OnInputsSet

All of which are encapsulated under the one PartRevealed action.

<a name="performance-wxp-score"></a>
## WxP score

The WxP score is a per extension Weight eXPerience score (WxP). It is calculated by the as follows:

```txt

WxP = (BladeViewsMeetingTheBar * 80thPercentileBar) / ((BladeViewsMeetingTheBar * 80thPercentileBar) + ∑(BladeViewsNotMeetingTheBar * ActualLoadTimePerBlade))

```

| Blade   | 80th Percentile Times | Usage Count | Meets 80th Percentile Bar? |
| ------- | --------------------- | ----------- | -------------------------- |
| Blade A | 1.2                   | 1000        | Yes                        |
| Blade B | 5                     | 500         | No                         |
| Blade C | 6                     | 400         | No                         |

```txt

WxP = (BladeViewsMeetingTheBar * 80thPercentileBar) / ((BladeViewsMeetingTheBar * 80thPercentileBar) + ∑(BladeViewsNotMeetingTheBar * ActualLoadTimePerBlade)) %
    = (4 * 1000) / ((4 * 1000) + ((5 * 500) + (6 * 400))) %
    = 44.94%

```

As you can see the model penalizes the number of views which don’t meet the bar and also the count of those.

<a name="performance-how-to-assess-your-performance"></a>
## How to assess your performance

There is two methods to assess your performance:

1. Visit the IbizaFx provided PowerBi report*
1. Run Kusto queries locally to determine your numbers

    (*) To get access to the PowerBi dashboard reference the [Telemetry onboarding guide][TelemetryOnboarding], then access the following [Extension performance/reliability report][Ext-Perf/Rel-Report]

The first method is definitely the easiest way to determine your current assessment as this is maintained on a regular basis by the Fx team.
You can, if preferred, run queries locally but ensure you are using the Fx provided Kusto functions to calculate your assessment.

<a name="performance-performance-checklist"></a>
## Performance Checklist

- [Configure CDN][portalfx-cdn]
- [Extension HomePage Caching](/portalfx-extension-homepage-caching)
- [Persistent Caching of scripts across extension updates](/portalfx-extension-persistent-caching-of-scripts)
- [Run portalcop to identify and resolve common performance issues](/portalfx-performance-portalcop)
- [Optimize number CORS preflight requests to ARM using invokeApi](index-portalfx-extension-development.md#optimize-number-cors-preflight-requests-to-arm-using-invokeapi)
- [Improve part responsiveness with revealContent](/index-portalfx-extension-development.md#portalfx-parts-revealContent)
- [Best practices](#performancebestpractices)

<a name="performance-performance-frequently-asked-questions-faq"></a>
## Performance Frequently Asked Questions (FAQ)

<!--### My Extension 'InitialExtensionResponse' is above the bar, what should I do

TODO

<a name="performance-performance-frequently-asked-questions-faq-my-extension-manifestload-is-above-the-bar-what-should-i-do"></a>
### My Extension &#39;ManifestLoad&#39; is above the bar, what should I do

TODO

<a name="performance-performance-frequently-asked-questions-faq-my-extension-initializeextensions-is-above-the-bar-what-should-i-do"></a>
### My Extension &#39;InitializeExtensions&#39; is above the bar, what should I do

TODO -->

<a name="performance-performance-frequently-asked-questions-faq-my-blade-revealed-is-above-the-bar-what-should-i-do"></a>
### My Blade &#39;Revealed&#39; is above the bar, what should I do

1. Assess what is happening in your Blades's constructor and OnInputsSet.
1. Can that be optimized?
1. If there are any AJAX calls, wrap them with custom telemetry and ensure they you aren't spending a large amount of time waiting on the result.
1. Check the Part's on the Blade revealed times using [Extension performance/reliability report][Ext-Perf/Rel-Report], select your Extension and Blade on the filters.
1. How many parts are on the blade?
    - If there's only a single part, if you're not using a `<TemplateBlade>` migrate your current blade over.
    - If there's a high number of parts (> 3), consider removing some of the parts

<a name="performance-performance-frequently-asked-questions-faq-my-part-revealed-is-above-the-bar-what-should-i-do"></a>
### My Part &#39;Revealed&#39; is above the bar, what should I do

1. Assess what is happening in your Part's constructor and OnInputsSet.
1. Can that be optimized?
1. If there are any AJAX calls, wrap them with custom telemetry and ensure they you aren't spending a large amount of time waiting on the result.
1. Do you have partial data before the OnInputsSet is fully resolved? If yes, then you can reveal early, display the partial data and handle loading UI for the individual components 

<a name="performance-performance-frequently-asked-questions-faq-my-wxp-score-is-below-the-bar-what-should-i-do"></a>
### My WxP score is below the bar, what should I do

Using the [Extension performance/reliability report][Ext-Perf/Rel-Report] you can see the WxP impact for each individual blade. Although given the Wxp calculation,
if you are drastically under the bar its likely a high usage blade is not meeting the performance bar, if you are just under the bar then it's likely it's a low usage
blade which is not meeting the bar.

<a name="performance-performance-best-practices"></a>
## Performance best practices

 <h1 name="portalfx-performance-bestpractices"></h1>
 <properties title="" pageTitle="Performance" description="" authors="nickharris" />

<!-- THIS FILE IS REFERENCED IN THE portalfx-performance SECTION PLEASE START ALL HEADINGS WITH H3S -->

<a name="performance-performance-best-practices-writing-fast-extensions"></a>
### Writing fast extensions

When writing extensions, there are a few patterns you can follow to make sure you're getting the most performance out
the browser and the portal.

<a name="performance-performance-best-practices-writing-fast-extensions-use-amd"></a>
#### Use AMD

In the early days of the Azure Portal SDK, it was common to write extensions that bundled all scripts into a single file at
compilation time. This generally happens if you use reference statements in your classes:

<a name="performance-performance-best-practices-writing-fast-extensions-use-amd-deprecated-synatx"></a>
##### [DEPRECATED SYNATX]

```ts

/// <reference path="../TypeReferences.d.ts" />
/// <reference path="WebsiteSelection.ts" />
/// <reference path="../Models/Website.ts" />
/// <reference path="../DataContexts/DataContexts.ts" />

module RemoteExtension {
    export class WebsitesBladeViewModel extends MsPortalFx.ViewModels.Blade {
    ...
    }
}

```

In the example above, modules are imported using `<reference>` elements.
This includes those scripts into a single script file at compile time, leading to a relatively large file which needs to be downloaded
every time your extension projects UI.

Since that time, we've introduced support for using [Asynchronous Module Definition (AMD)](http://requirejs.org/docs/whyamd.html).
Instead of bundling all scripts into a single monolithic file, the portal is now capable of downloading only the files needed to
project the current UI onto the screen. This makes it faster to unload and reload an extension, and provides for generally better
performance in the browser.  In this case, by using AMD, the following files will only be loaded at runtime as they're required
(instead of one large bundle):

<a name="performance-performance-best-practices-writing-fast-extensions-use-amd-correct-synatx"></a>
##### [CORRECT SYNATX]

```ts

import SecurityArea = require("../SecurityArea");
import ClientResources = require("ClientResources");
import Svg = require("../../_generated/Svg");

export class BladeViewModel extends MsPortalFx.ViewModels.Blade {
    ...
}

```

This leads to faster load time, and less memory consumption in the browser. You can learn more about the TypeScript module loading
system in the [official language specification](http://www.typescriptlang.org/Content/TypeScript%20Language%20Specification.docx).

<a name="performance-performance-best-practices-writing-fast-extensions-use-querycache-and-entitycache"></a>
#### Use QueryCache and EntityCache

When performing data access from your view models, it may be tempting to make data calls directly from the `onInputsSet` function.
By using the QueryCache and EntityCache, you can control access to data through a single component.
A single ref-counted cache can hold data across your entire extension.  This has the benefits of:

- Reduced memory consumption
- Lazy loading of data
- Less calls out to the network
- Consistent UX for views over the same data.

> Developers should use QueryCache and EntityCache for data access.
These classes provide advanced caching and ref-counting.
Internally, these make use of Data.Loader and Data.DataSet (which will be made FX-internal in the future).

To learn more, visit [Querying for data](#portalfx-data-query).

<a name="performance-performance-best-practices-writing-fast-extensions-avoid-unnecessary-data-reloading"></a>
#### Avoid unnecessary data reloading

As users navigate through the Ibiza UX, they will frequently revisit often-used resources within a short period of time.
They might visit their favorite Website Blade, browse to see their Subscription details, and then return to configure/monitor their
favorite Website. In such scenarios, ideally, the user would not have to wait through loading indicators while Website data reloads.

To optimize for this scenario, use the `extendEntryLifetimes` option common to QueryCache and EntityCache.

```ts

public websitesQuery = new MsPortalFx.Data.QueryCache<SamplesExtension.DataModels.WebsiteModel, any>({
    entityTypeName: SamplesExtension.DataModels.WebsiteModelType,
    sourceUri: MsPortalFx.Data.uriFormatter(Shared.websitesControllerUri),
    supplyData: (method, uri, headers, data) => {
        // ...
    },
    extendEntryLifetimes: true
});

```

QueryCache/EntityCache contain numerous cache entries, each of which are ref-counted based on not-disposed instances of
QueryView/EntityView. When a user closes a Blade, typically a cache entry in the corresponding QueryCache/EntityCache will be removed,
since all QueryView/EntityView instances will have been disposed. In the scenario where the user *revisits* their Website Blade,
the corresponding cache entry will have to be reloaded via an ajax call, and the user will be subjected to loading indicators on
the Blade and its Parts.

With `extendEntryLifetimes`, unreferenced cache entries will be *retained for some amount of time*, so when a corresponding Blade
is reopened, data for the Blade and its Parts will already be loaded and cached.  Here, calls to `this._view.fetch()` from a Blade
or Part view model will return a resolved Promise, and the user will not see long-running loading indicators.

(Note - The time that unreferenced cache entries are retained in QueryCache/EntityCache is controlled centrally by the FX
 and the timeout will be tuned based on telemetry to maximize cache efficiency across extensions.)

For your scenario to make use of `extendEntryLifetimes`, it is **very important** that you take steps to keep your client-side
QueryCache/EntityCache data caches **consistent with server data**.
See [Reflecting server data changes on the client](#portalfx-data-query) for details.


<a name="performance-performance-best-practices-writing-fast-extensions-use-paging-for-large-data-sets"></a>
#### Use paging for large data sets

When working with a large data set, extension authors should use the paging features of the grid.
Paging allows deferred loading of rows, so even with a large dataset responsiveness can be maintained.
Additionally it means many rows might not need to be loaded at all. To learn more about paging with grids,
you can check out the samples:

`\Client\Controls\Grid\ViewModels\PageableGridViewModel.ts`

<a name="performance-performance-best-practices-writing-fast-extensions-use-map-and-filter-to-reduce-size-of-rendered-data"></a>
#### Use &quot;map&quot; and &quot;filter&quot; to reduce size of rendered data

Often, it is useful to use the [Knockout projections](https://github.com/stevesanderson/knockout-projections) to shape and filter model data loaded using QueryView and EntityView (see [Shaping and filtering data](#portalfx-data-projections)).

Significant performance improvements can achieved by reducing the number and size of the model objects bound to controls like grids, lists, charts:

    `\Client\Controls\Grid\ViewModels\SelectableGridViewModel.ts`

```ts

// Wire up the contents of the grid to the data view.
this._view = dataContext.personData.peopleQuery.createView(container);
var projectedItems = this._view.items
    .filter((person: SamplesExtension.DataModels.Person) => { return person.smartPhone() === "Lumia 520"; })
    .map((person: SamplesExtension.DataModels.Person) => {
        return <MappedPerson>{
            name: person.name,
            ssnId: person.ssnId
        };
    });

var personItems = ko.observableArray<MappedPerson>([]);
container.registerForDispose(projectedItems.subscribe(personItems));


```

In this example, `map` is used to project new model objects containing only those properties required to fill the columns of the grid.  Additionally, `filter` is used to reduce the size of the array to just those items that will be rendered as grid rows.

<a name="performance-performance-best-practices-writing-fast-extensions-benefits-to-ui-rendering-performance"></a>
#### Benefits to UI-rendering performance

Using the selectable grid SDK sample we can see the benefits to using `map` to project objects with only those properties required by a grid row:

![Using knockout projections to map an array][mapping]
[mapping]: ../media/portalfx-performance/mapping.png

There is almost a 50% reduction in time with these optimizations, but also note that at 300 items it is still over 1.5s. Mapping to just the 2 columns in that selectable grid sample reduces the message size by 2/3 by using the technique described above. This reduces the time needed to transfer the view model as well as reducing memory usage.



<a name="performance-configuring-cdn"></a>
## Configuring CDN

 <h1 name="portalfx-cdn"></h1>
 <properties title="" pageTitle="CDN" description="" authors="alvarorahul,madjos,nickharris" />

<a name="performance-configuring-cdn-using-the-cdn"></a>
### Using the CDN
Extension authors may choose to use a CDN to serve static images, scripts, and stylesheets. The Azure Portal SDK does not require the use of a CDN, or the use of a particular CDN. However, extensions served from Azure can take advantage of the built-in CDN capabilities in the SDK.

<a name="performance-configuring-cdn-creating-the-cdn-account"></a>
### Creating the CDN account
Follow this guide to set up your CDN account:

<a href="http://www.windowsazure.com/en-us/documentation/articles/cdn-how-to-use/" target="_blank">http://www.windowsazure.com/en-us/documentation/articles/cdn-how-to-use/</a>

<a name="performance-configuring-cdn-configuring-your-cdn-service"></a>
### Configuring your CDN service
After creating your CDN, there are a few options that need to be set.
- Make sure HTTP and HTTPS are enabled by clicking the "Enable HTTPS" command.
- Make sure query string status is enabled by clicking the "Enable Query String" command.

<a name="performance-configuring-cdn-configuring-your-extension"></a>
### Configuring your extension
To take advantage of the CDN capabilities in the Portal SDK, there are a few pieces that must be configured.

<a name="performance-configuring-cdn-configuring-the-prefix"></a>
### Configuring the Prefix
After setting up your CDN, you will receive a url which can be used to access your content. It will be in the form:

    //<MyCDNNamespace>.vo.msecnd.net/

This is the prefix for your CDN service. Your production service should be configured to use this prefix. In your local web.config, can set this with the following `appSetting`:

```xml
<add key="Microsoft.Portal.Extensions.SamplesExtension.ApplicationConfiguration.CdnPrefix" 
     value="//<MyCDNNamespace>.vo.msecnd.net/" />
```

Notice that neither `http` nor `https` are used in the url. This is important. It allows your page to request content based on the current protocol of the request. Oftentimes, this setting will be blank in web.config, and instead configured in a `cscfg` for a cloud service.

<a name="performance-configuring-cdn-reading-the-prefix-from-configuration"></a>
### Reading the prefix from configuration

To read any FX configuration, you must have a class which inherits from `ApplicationContext`. This class needs to include a `CdnPrefix` property:

```
\SamplesExtension\Configuration\CustomApplicationContext.cs
```

```cs
[Export(typeof(ApplicationContext))]
internal class CustomApplicationContext : ApplicationContext
{
    private ApplicationConfiguration configuration;

    [ImportingConstructor]
    public CustomApplicationContext(ApplicationConfiguration configuration)
    {
        this.configuration = configuration;
    }

    public override bool IsDevelopmentMode
    {
        get
        {
            return this.configuration.IsDevelopmentMode;
        }
    }

    public override string CdnPrefix
    {
        get
        {
            return this.configuration.CdnPrefix;
        }
    }
}
```

This class will assign properties which are available in your `web.config` or `*.cscfg`. To read the values from those files, create a C# class which inherits from `ConfigurationSettings` and exports `ApplicationConfiguration`:

    \SamplesExtension\Configuration\ApplicationConfiguration.cs

```cs
[Export(typeof(ApplicationConfiguration))]
public class ApplicationConfiguration : ConfigurationSettings
{
    /// <summary>
    /// Gets a value indicating whether development mode is enabled.
	/// Development mode turns minification off
    /// </summary>
    /// <remarks>
	/// Development mode turns minification off. 
	/// It also disables any caching that be happening.
	/// </remarks>
    [ConfigurationSetting]
    public bool IsDevelopmentMode
    {
        get;
        private set;
    }

    /// <summary>
    /// Gets a value indicating a custom location where browser should 
	/// find cache-able content (rather than from the application itself).
    /// </summary>
    [ConfigurationSetting]
    public string CdnPrefix
    {
        get;
        private set;
    }
}
```

<a name="performance-configuring-cdn-iis-asp-net-configuration"></a>
### IIS / ASP.NET Configuration
Files are pushed to the CDN using the following process:

- The browser makes a request to a given CDN-able address (ex: http://exampleCDN.vo.msecnd.net/Content/jquery.js).
- If the file is already cached on the CDN, it is returned.
- If the file is not cached, the CDN service *makes a request* to the origin server for the resource (ex: http://myextension.cloudapp.net/CDN/Content/jquery.js)
- The file is cached, and returned to the client.

To enable this workflow, the CDN must be able to make an HTTP request to your extension. This would normally not be an issue, but some CDNs will make an HTTP __1.0__ request. HTTP 1.0 technically does not support gzip/deflated content, so IIS does not enable compression by default. To turn this on, the `noCompressionForHttp10` setting in `<httpCompression>` must be set to `false`:

<a href="http://www.iis.net/configreference/system.webserver/httpcompression" target="_blank">http://www.iis.net/configreference/system.webserver/httpcompression</a>

The url used for the request is in the following form:

`http://myextension.cloudapp.net/CDN/Content/jquery.js`

The */CDN/* portion of this url is inserted after the host address, and before the rest of the route for requested content. The request handling code in the SDK automatically handles incoming requests of the form /CDN/Content/... and /Content/...   

<a name="performance-configuring-cdn-invalidating-content-on-the-cdn"></a>
### Invalidating content on the CDN

- Amd Bundles are invalidated using a **hash** of the file content i.e https://hubs-s3-portal.azurecomcdn.net/AzureHubs/Content/Dynamic/AmdBundleDefinition_**83A1A15A39494B7BB1F704FDB5F32596D4498792**.js?root=*HubsExtension/ServicesHealth/ServicesHealthArea
- static content is invalidated using the **extension version** i.e  https://hubs-s3-portal.azurecomcdn.net/AzureHubs/Content/**5.0.202.7608987.150717-1541**/Images/HubsExtension/Tour_Tile_Background_Normal.png

When you release to ensure that users are served the latest static content, as opposed to stale content,  you need to configure versioning.

<a name="performance-configuring-cdn-configuring-versioning-of-your-extensioon"></a>
### Configuring versioning of your Extensioon

 <h1 name="portalfx-versioning-extensions"></h1>
 
<a name="performance-configuring-cdn-updating-extensions"></a>
### Updating extensions

The portal shell relies on environment version for making runtime decisions, e.g.:

- invalidating cached manifests
- invalidating static content served indirectly via CDN or from directly from your extension

By default this value is populated based on the version attributes present in the extension assembly.
First the runtime tries to find the `AssemblyInformationalVersionAttribute` attribute and get the value from there.
If this attribute isn't defined in the assembly, the runtime searches for the `AssemblyFileVersion` attribute and gets the value from this attribute.
You can check the version of your extensions by typing in `window.fx.environment.version` in the browser console from the extension frame.

You should ensure that while building your extension assembly, the version number is correctly stamped and updated on every build. The assembly version is added to your assembly by specifying the assembly level attribute as shown below.

```cs
[assembly: System.Reflection.AssemblyFileVersion("5.0.0.56")]
[assembly: System.Reflection.AssemblyInformationalVersionAttribute("5.0.0.56 (COMPUTER.150701-1627)")]
```
You can also override this behavior by deriving from the `ApplicationContext` class and MEF-exporting the derived class as `[Export(typeof(ApplicationContext))]` and overriding the getter for the Version property on the class. If you do this, please ensure that the overridden getter returns a constant value for a specific build.

see [AssemblyVersionAttribute](https://msdn.microsoft.com/en-us/library/system.reflection.assemblyversionattribute(v=vs.110).aspx)
see [AssemblyInformationalVersionAttribute](https://msdn.microsoft.com/en-us/library/system.reflection.assemblyinformationalversionattribute(v=vs.110).aspx)
see (Azure internal teams only) [OneBranch versioning](https://microsoft.sharepoint.com/teams/WAG/EngSys/Implement/OneBranch/Version%20Properties.aspx)

Once configured content will be served directly from your extension, or via CDN if configured, using a URL segment such as /Content/<Version> e.g /Content/**5.0.0.56**/Scripts, Content/**5.0.0.56**/Images.

<a name="performance-configuring-cdn-implications-of-changing-the-version"></a>
### Implications of changing the version

You should not introduce breaking changes in your server code (e.g. incompatibility between client and server code). Instead leave a compatibile version of the old code around on the server for a few days, monitor its usage to ensure that customers/browsers are no longer accessing it (i.e all users have switched to the newer version of your code - likely by refreshing the portal), and then delete the code.
This can easily be accomplished by making new controllers/methods instead of making breaking changes to existing ones.
If you do end up in a situation where you make a breaking change, users will likely see a broken experience until they reload the portal.
You will need to contact the portal team in order to find a way to get past this issue.


<a name="performance-configuring-cdn-faq"></a>
### FAQ

- I am not seeing paths w/ versioning during debug.
    - Ensure IsDevelomentMode in your *.config is set to false



<a name="performance-extension-homepage-caching"></a>
## Extension HomePage Caching

 <h1 name="portalfx-extension-homepage-caching"></h1>
 <properties
    title=""
    pageTitle="Performance - Extension HomePage Caching"
    description=""
    authors="madjos" />

<a name="performance-extension-homepage-caching-server-side-caching-of-extension-home-pages"></a>
### Server side caching of extension home pages

With the latest version of the SDK (5.0.302.85 or later) extension home pages can be cached (to different levels).
This should help get slightly better load time especially from browsers that have high latency.
Below are two example URLs from the portal running in production:

```
https://yourextension.contoso.com/
    ?extensionName=Your_Extension
    &shellVersion=5.0.302.85%20(production%23444e261.150819-1426)
    &traceStr=
    &sessionId=ece19d8501fb4d2cbe10db84b844c55b
    &l=en.en-us
    &trustedAuthority=portal.azure.com%3A
    #ece19d8501fb4d2cbe10db84b844c55b
```

You will notice that for the extension, the sessionId is passed in the query string part of the URL.
This makes the extension essentially un-cacheable (because even if it was, we would generate a unique URL on each access essentially busting any cache – browser or server).
If you enable server side caching of extension home pages, the URL will become:

```
https://yourextension.contoso.com/
    ?extensionName=Your_Extension
    &shellVersion=5.0.302.85%20(production%23444e261.150819-1426)
    &traceStr=
    &l=en.en-us
    &trustedAuthority=portal.azure.com%3A
    #ece19d8501fb4d2cbe10db84b844c55b
```

Notice that the sessionId is no longer present in the query string (only in the fragment).
This allows the extension server to serve up the same version of the page to a returning browser (HTTP 304).

You need to do some work to enable caching on your extension server.

1.  There is a property `Cacheability` on your implementation of the `Microsoft.Portal.Framework.ExtensionDefinition` class.

1.  By default its value is `ExtensionIFrameCacheability.None`

1.  At the very least you should be able to set it to `ExtensionIFrameCacheability.Server`

Making this change assumes that you do not change the way your home page is rendered dynamically (different output for different requests).
It assumes that if you do change the output, you only do so by also incrementing the value of Microsoft.Portal.Framework.ApplicationContext.Version.
Note: In this mode, if you make live updates to your extension without bumping the version, some chunk of your customers may not see those for a while because of caching.


<a name="performance-extension-homepage-caching-client-side-caching-of-extension-home-pages"></a>
### Client-side caching of extension home pages

The above version of the feature only enables server side caching.
But there could be even more benefits if we could somehow cache on the client (avoid the network call altogether).

So we have added support for caching extension home pages in the browser itself.
This can allow your extension to load with *ZERO* network calls from the browser (for a returning user).
We believe that this should give us further performance and reliability improvements (fewer network calls => fewer network related errors).

To enable this, here are the steps you need to take:

1.  Move to a version of the SDK newer than 5.0.302.121.

1.  Implement [persistent caching of your scripts](#portalfx-extension-persistent-caching-of-scripts).
    You should do this any way to improve extension reliability.
    If you do not do this, you will see higher impact on reliability as a result of home page caching.

1.  Ensure that your implementation of `Microsoft.Portal.Framework.ApplicationContext.GetPageVersion()` returns a *stable* value per build of your extension.
    We implement this for your extension by default for you by using the version of your assembly.
    If this value changes between different servers of the same deployment, the home page caching will not be very effective.
    Also if this value does not change between updates to your extension, then existing users will continue to load the previous version of your extension even after you update.

1.  In your implementation of `Microsoft.Portal.Framework.ExtensionDefinition` update this property:

    ```cs
    public override ExtensionIFrameCacheability Cacheability
    {
        get
        {
            return ExtensionIFrameCacheability.Manifest;
        }
    }
    ```

1.  <a href="mailto:ibizafxpm@microsoft.com?subject=[Manifest Caching] on &lt;ExtensionName&gt; &body=Hi, we have enabled manifest caching on &lt;ExtensionName&gt; please make the appropriate portal change">Contact the Portal team</a>
     or submit a [Work Item Request](https://aka.ms/cachemanifest) so we can update the value from our side.  
    Sorry about this step.
    We added it to ensure backward compatibility.
    When all extensions have moved to newer SDKs, we can eliminate it.

<a name="performance-extension-homepage-caching-implications-of-client-side-caching"></a>
### Implications of client side caching

1.  An implication of this change is that when you roll out an update to your extension, it might take a couple of hours for it to reach all your customers.
    But the reality is that this can occur even with the existing deployment process.
    If a user has already loaded your extension in their session, they will not really get your newer version till they F5 anyway.
    So extension caching adds a little more latency to this process.

1.  If you use this mechanism, you cannot use extension versioning to roll out breaking changes to your extension.
    Instead, you should make server side changes in a non-breaking way and keep earlier versions of your server side code running for a few days.

We believe that the benefits of caching and fast load time generally outweigh these concerns.

<a name="performance-extension-homepage-caching-how-this-works"></a>
### How this works

We periodically load your extensions (from our servers) to get their manifests.
We call this "manifest cache". The cache is updated every few minutes.
This allows us to start up the portal without loading every extension to find out very basic information about it (like its name and its browse entry/entries, etc.)
When the extension is actually interacted with, we still load the latest version of its code, so the details of the extension should always be correct (not the cached values).
So this works out as a reasonable optimization.
With the newer versions of the SDK, we include the value of GetPageVersion() of your extension in its manifest.
We then use this value when loading your extension into the portal (see the pageVersion part of the query string below).
So your extension URL might end up being something like:

```
https://YourExtension.contoso.com/
    ?extensionName=Your_Extension
    &shellVersion=5.0.302.85%20(production%23444e261.150819-1426)
    &traceStr=
    &pageVersion=5.0.202.18637347.150928-1117
    &l=en.en-us
    &trustedAuthority=portal.azure.com%3A
    #ece19d8501fb4d2cbe10db84b844c55b
```

On the server side, we match the value of pageVersion with the current value of ApplicationContext.GetPageVersion().
If those values match, we set the page to be browser cacheable for a long time (1 month).
If the values do not match we set no caching at all on the response.
The no-caching case could happen during an upgrade, or if you had an unstable value of ApplicationContext.GetPageVersion()).
This should provide a reliable experience even when through updates.
When the caching values are set, the browser will not even make a server request when loading your extension for the second time.

You will notice that we include the shellVersion also in the query string of the URL.
This is just there to provide a mechanism to bust extension caches if we needed to.

<a name="performance-extension-homepage-caching-how-to-test-your-changes"></a>
### How to test your changes

You can verify the behavior of different caching modes in your extension by launching the portal with the following query string:

```
https://portal.azure.com/
    ?Your_Extension=cacheability-manifest
    &feature.canmodifyextensions=true
```

This will cause the extension named "Your_Extension" to load with "manifest" level caching (instead of its default setting on the server.
You also need to add "feature.canmodifyextensions=true" so that we know that the portal is running in test mode.  

To verify that the browser serves your extension entirely from cache on subsequent requests:

- Open F12 developer tools, switch to the network tab, filter the requests to only show "documents" (not JS, XHR or others).
- Then navigate to your extension by opening one of its blades, you should see it load once from the server.
- You will see the home page of your extension show up in the list of responses (along with the load time and size).
- Then F5 to refresh the portal and navigate back to your extension. This time when your extension is served up, you should see the response served with no network activity. The response will show "(from cache)".  If you see this manifest caching is working as expected.

<a name="performance-extension-homepage-caching-co-ordinating-these-changes-with-the-portal"></a>
### Co-ordinating these changes with the portal

Again, if you do make some of these changes, you still need to coordinate with the portal team to make sure that we make corresponding changes on our side too.
Basically that will tell us to stop sending your extension the sessionId part of the query string in the URL (otherwise caching does not help at all).
Sorry about this part, we had to do it in order to stay entirely backward compatible/safe.

<a name="performance-persistent-caching-of-scripts-across-extension-updates"></a>
## Persistent Caching of scripts across extension updates

 <h1 name="portalfx-extension-persistent-caching-of-scripts"></h1>
 <properties
    title=""
    pageTitle="Performance - Persistent Caching of scripts across extension updates" 
    description=""
    authors="madjos" />

<a name="performance-persistent-caching-of-scripts-across-extension-updates-making-sure-that-scripts-are-available-across-extension-updates"></a>
### Making sure that scripts are available across extension updates

One problem that can impact reliability of extensions is scripts failing to load.
And one corner case where this problem can occur is when update your extensions.

Suppose you have V1 of your extension deployed to production and it references a script file /Content/Script_A_SHA1.js We add the SHA1 to ensure maximum cacheability of the script.
Now a user visits the portal and starts interacting with your V1 extension.
They haven’t yet started loading Script_A_SHA1.js perhaps because it is only used by a different blade.
At this time you update the extension server to V2.
The update includes a change to Script_A so now its URL becomes /Content/Script_A_SHA2.js.
Now when the user does visit that blade, Script_A_SHA1.js is no longer on your server and the request to fetch it from the browser will most likely result in a 404.
The use of a CDN might reduce the probability of this occurring. And you should use a CDN.
But these user actions can occur over several hours and the CDN does not guarantee keeping data around (for any duration let alone hours).
So this problem can/does still occur.

To avoid this issue, you can implement a class that derives from `Microsoft.Portal.Framework.IPersistentContentCache`

On your extension server. The simplest way to do this is to derive from `Microsoft.Portal.Framework.BlobStorageBackedPersistentContentCache` 

And MEF export your implementation. That is decorate it with:

```cs 
[Export(typeof(Microsoft.Portal.Framework.IPersistentContentCache))]
```

You just need to provide it a storage account connection string that can be used to store the scripts.
Keep the storage account the same across upgrades of your extension.

We save all your JavaScript, CSS, and image files (basically anything under /Content/...) in this cache to make upgrades smoother.

The storage account is a third layer cache.
Layer 1 is CDN.
Layer 2 is in memory in your extension server.
So it should get hit very rarely and once read, it should warm up the other layers.
So we don't think you need to geo-distribute this layer.
If we detect that it is getting hit too often, we will come up with a geo-distribution strategy.
If you do use one account per region to handle this, you will need to find a way to synchronize them.
You could do this by using a custom implementation of the `Microsoft.Portal.Framework.IPersistentContentCache` interface.

<a name="performance-persistent-caching-of-scripts-across-extension-updates-example-implementation-as-done-in-hubsextension"></a>
### Example implementation as done in HubsExtension

```cs 

using System;
using System.ComponentModel.Composition;
using Microsoft.Portal.Framework;

namespace <your.extension.namespace>
{
    /// <summary>
    /// The configuration for hubs content caching.
    /// </summary>
    [Export(typeof(HubsBlobStorageBackedContentCacheSettings))]
    internal class HubsBlobStorageBackedContentCacheSettings : ConfigurationSettings
    {
        /// <summary>
        /// Gets the hubs content cache storage connection string.
        /// </summary>
        [ConfigurationSetting(DefaultValue = "")]
        public SecureConfigurationConnectionString StorageConnectionString
        {
            get;
            private set;
        }
    }

    /// <summary>
    /// Stores content in blob storage as block blobs.
    /// Used to ensure that cached content is available to clients
    /// even when the extension server code is newer/older than the content requested.
    /// </summary>
    [Export(typeof(IPersistentContentCache))]
    internal class HubsBlobStorageBackedContentCache : BlobStorageBackedPersistentContentCache
    {
        /// <summary>
        /// /// Creates an instance of the cache.
        /// </summary>
        /// <param name="applicationContext"> Application context which has environment settings.</param>
        /// <param name="settings"> The content cache settings to use.</param>
        /// <param name="tracer"> The tracer to use for any logging.</param>
        [ImportingConstructor]
        public HubsBlobStorageBackedContentCache(
            ApplicationContext applicationContext,
            HubsBlobStorageBackedContentCacheSettings settings,
            ICommonTracer tracer)
            :base(settings.StorageConnectionString.ToString(), "HubsExtensionContentCache", applicationContext, tracer)
        {
        }
    }
}

```

web.config

```xml

    <add key="<your.extension.namespace>.HubsBlobStorageBackedContentCacheSettings.StorageConnectionString" value="" />

```

<a name="performance-persistent-caching-of-scripts-across-extension-updates-verfiying-that-persistent-caching-is-working"></a>
### Verfiying that persistent caching is working

- Deploy a version of your extension. Examine the scripts it loads, they will be of the form `prefix<sha hash>suffix.js`
- Use a blob explorer of your preference and verify that the scripts have been written to blob storage.
- Then make changes to TS files in your solution, build and deploy a new version of your extension.
- Look for scripts that have the same prefix and suffix but a different hash.
- For those scripts try to request the original URL (from step 1) from your extension server (not via the cdn).
- The script should still get served, but this time it is coming from the persistent cache.

<a name="performance-run-portalcop-to-identify-and-resolve-common-performance-issues"></a>
## Run portalcop to identify and resolve common performance issues

 <h1 name="portalfx-performance-portalcop"></h1>
 ## PortalCop
The Portal Framework team has built a tool called PortalCop that can help reduce code size and remove redundant RESX entries.

<a name="performance-run-portalcop-to-identify-and-resolve-common-performance-issues-installing-portalcop"></a>
### Installing PortalCop

Run the following command in the NuGet Package Manager Console.

```
Install-Package PortalFx.PortalCop -Source https://msazure.pkgs.visualstudio.com/DefaultCollection/_packaging/Official/nuget/v3/index.json -Version 1.0.0.339
```

Or run the following in a Windows command prompt.

```
nuget install PortalFx.PortalCop -Source https://msazure.pkgs.visualstudio.com/DefaultCollection/_packaging/Official/nuget/v3/index.json -Version 1.0.0.339
```

<a name="performance-run-portalcop-to-identify-and-resolve-common-performance-issues-running-portalcop"></a>
### Running PortalCop

<a name="performance-run-portalcop-to-identify-and-resolve-common-performance-issues-running-portalcop-namespace-mode"></a>
#### Namespace Mode

NOTE: If you do not use AMD, please do not run this mode in your codebase.

If there are nested namespaces in code (for example A.B.C.D) the minifier will only reduce the top level (A) name, leaving all remaining names uncompressed.

Example of uncompressible code and minified version
        MsPortalFx.Base.Utilities.SomeFunction(); -> a.Base.Utilities.SomeFunction();

As you implement your extension using our Framework, you may have done some namespacing import to help achieve better minification, like this:
        Import FxUtilities = MsPortalFx.Base.Utilities;

which yields a better minified version
        FxUtilities.SomeFunction(); -> a.SomeFunction();

In the Namespace mode, the PortalCop tool will normalize imports to the Fx naming convention. It won’t collide with any predefined names you defined. Using this tool, we achieved up to 10% code reduction in most of the Shell codebase.

Review the changes after running the tool. Especially, be wary of string content changes. The tool does string mapping, not syntax based replacement.
 
```
   portalcop Namespace
```

<a name="performance-run-portalcop-to-identify-and-resolve-common-performance-issues-running-portalcop-resx"></a>
#### Resx

To reduce code size and save on localization costs, you can use the PortalCop RESX mode to find unused/redundant resx strings. 

```
To list unused strings:
   portalcop Resx
   
To list and clean *.resx files:
    portalcop Resx AutoRemove
```

Constraints:

- The tool may incorrectly flag resources as being un-used if your extension uses strings in unexpected formats. 
  For example, if you try to dynamically read from resx based on string values.
    
  Utils.getResourceString(ClientResources.DeploymentSlots, slot)));
  export function getResourceString(resources: any, value: string): string {
        var key = value && value.length ? value.substr(0, 1).toLowerCase() + value.substr(1) : value;
        return resources[key] || value;
   }

- You need to review the changes after running the tool and make sure that they are valid because of the above constraint.
- If using the AutoRemove option, you need to open up the RESX files in VisualStudio to regenerate the Designer.cs files.
- If you find any more scenarios that the tool incorrectly identifies as unused please report to [Ibiza Fx PM](mailto:ibizafxpm@microsoft.com)


<a name="performance-performance-alerting"></a>
## Performance alerting

Coming soon please reach out to sewatson if you are interested.

[TelemetryOnboarding]: </portalfx-telemetry-getting-started>
[Ext-Perf/Rel-Report]: <http://aka.ms/portalfx/dashboard/extensionperf>
[portalfx-cdn]: </portalfx-cdn>

<a name="reliability"></a>
# Reliability
 <h1 name="portalfx-reliability"></h1>
 <properties title="" pageTitle="Telemetry in the Portal" description="" authors="" />

<a name="reliability-overview"></a>
## Overview

Reliability of the Portal is one of the top pain points from a customers perspective.
As an extension author you have a duty to uphold your experience to the reliability bar at a minimum.

| Area          | Reliability Bar     | Telemetry Action/s                  | How is it measured? |
| ---------     | ------------------- | ------------------------            | ------------------- |
| Extension     | See Power BI        | InitializeExtensions/LoadExtensions | (( # of LoadExtensions starts - # of InitializeExtensions or LoadExtensions failures ) /  # of load extension starts ) * 100 |
| Blade         | See Power BI        | BladeLoaded vs BladeLoadErrored     | (( # of BladeLoaded started - # of BladeLoadErrored's) / # of BladeLoaded started) * 100 |
| Part          | See Power BI        | PartLoaded                          | (( # of PartLoaded started - # of PartLoaded canceled) / # of PartLoaded started) * 100 |

<a name="reliability-overview-extension-reliability"></a>
### Extension reliability

This is core to your customers experience, if the FX is unable to load your extension it will be unable to surface any of your experience.
Consequently your customers will be unable to manage/monitor their resources through the Portal.

<a name="reliability-overview-blade-reliability"></a>
### Blade reliability

Second to Extension reliability, Blade reliability is next level of critical reliability.
Your Blade reliability can be equated to a page loading in a website, it failing to load is a critical issue.

<a name="reliability-overview-part-reliability"></a>
### Part reliability

Parts are used throughout the portal, from a blade and dashboard perspective, if a part fails to load this results in the user potentially:

1. not being able to navigate to the a blade or the next blade
1. not seeing the critical data they expected on the dashboard
1. etc...

<a name="reliability-assessing-extension-reliability"></a>
## Assessing extension reliability

There is two methods to assess your reliability:

1. Visit the IbizaFx provided PowerBi report*
1. Run Kusto queries locally to determine your numbers

    (*) To get access to the PowerBi dashboard reference the [Telemetry onboarding guide][TelemetryOnboarding], then access the following [Extension performance/reliability report][Ext-Perf/Rel-Report]

The first method is definitely the easiest way to determine your current assessment as this is maintained on a regular basis by the Fx team.
You can, if preferred, run queries locally but ensure you are using the Fx provided Kusto functions to calculate your assessment.

<a name="reliability-checklist"></a>
## Checklist

There are a few items that the FX team advises all extensions to follow.

- [Configure CDN][portalfx-cdn]
- [Extension HomePage Caching](/portalfx-extension-homepage-caching)
- [Persistent Caching of scripts across extension updates](/portalfx-extension-persistent-caching-of-scripts)
- Geo-distribution, ensure you are serving your extension as close as possible to users.
The FX provides an [Extension Hosting Service](/portalfx-extension-hosting-service) which handles Geo-distribution.
To assess your extensions performance by data center see the [Extension performance/reliability report][Ext-Perf/Rel-Report]
- Turning on [IIS compression](https://technet.microsoft.com/en-us/library/cc730629(v=ws.10).aspx)
- [Run portalcop to identify and resolve common performance issues](/portalfx-performance-portalcop)

<a name="reliability-checklist-code-optimisations-to-improve-extension-reliability"></a>
### Code optimisations to improve extension reliability

<a name="reliability-checklist-code-optimisations-to-improve-extension-reliability-lazy-initialization-of-data-contexts-and-view-model-factories"></a>
#### Lazy initialization of data contexts and view model factories

The setDataContext API on view model factories was designed pre-AMD support in TypeScript and slows down extension load by increasing the amount of code downloaded on extension initialization. This also increases the risk of extension load failures due to increase in network activity. By switching to the setDataContextFactory method, we reduce the amount of code downloaded to the bare minimum. And the individual data contexts are loaded if and when required (e.g. if a blade that's opened requires it).

Old code:

```javascript
this.viewModelFactories.Blades().setDataContext(new Blades.DataContext());
```

New code:

```javascript
this.viewModelFactories.Blades().setDataContextFactory<typeof Blades>(
        "./Blades/BladesArea",
        (contextModule) => var x = new contextModule.DataContext()
);
```

<a name="reliability-checklist-reliability-frequently-asked-questions-faq"></a>
### Reliability Frequently Asked Questions (FAQ)

<a name="reliability-checklist-reliability-frequently-asked-questions-faq-my-extension-is-below-the-reliability-bar-what-should-i-do"></a>
#### My Extension is below the reliability bar, what should I do

Run the following [query][kusto-extension-reliability-summary]

```txt
GetExtensionFailuresSummary(ago(1d))
| where extensionName contains "Microsoft_Azure_Compute"
```

Updating the extensionName to be your extension, and increase the time range if the last 24 hours isn't sufficient.
Address the highest impacting issues, per occurence/affected users.

The query will return a summary of all the events which your extension failed to load. 

| Field name        | Definition |
| ----------------- | ---------- |
| extensionName     | The extension the error correlates to |
| errorState        | The type of error that occurred |
| error             | The specific error that occurred |
| Occurences        | Number of occurrences |
| AffectedUsers     | Number of affected users |
| AffectedSessions  | Number of affected sessions |
| any_sessionId     | A sample of an affected session |
| any_message       | A sample message of what would normally be returned given errorState/error |

Once you have ran the query you will be shown a list of errorStates and errors, for more greater details you can use the any_sessionId 
to investigate further.

<a name="reliability-checklist-reliability-frequently-asked-questions-faq-my-extension-is-below-the-reliability-bar-what-should-i-do-error-states"></a>
##### Error States

<table>
    <tr>
        <th>Error State</th>
        <th>Definition</th>
        <th>Action items</th>
    </tr>
    <tr>
        <td>
            FirstResponseNotReceived
        </td>
        <td>
            This error state means that the shell loaded the extension URL obtained from the config into an IFrame, however there wasn't any response from the extension
        </td>
        <td>
            <ol>
                <li>Scan the events table to see if there are any other relevant error messages during the time frame of the alert</li>
                <li>Try opening the extension URL directly in the browser - it should show the default page for the extension</li>
                <li>Open the dev tools network tab in your browser and try opening the extension URL appending the following query string parameter sessionId=testSessionId - this should open a blank page and all requests in the network tab should be 200 or 300 level responses (no failures). If there is a server error in the extension - it will print out the error and a call stack if available. In case the failures are from a CDN domain, check if the same URL is accessible from the extension domain - if so, the CDN might be corrupt/out of sync. In this case, flushing the CDN would mitigate the issue.</li>
            </ol>
        </td>
    </tr>
    <tr>
        <td>
            HomePageTimedOut
        </td>
        <td>
            The index page failed to load within the max time period 
        </td>
        <td>
            // Need steps to action on
        </td>
    </tr>
    <tr>
        <td>
            ManifestNotReceived
        </td>
        <td>
            This error state means that the bootstrap logic was completed, however the extension did not return a manifest to the shell. The shell waits for a period of time and then timed out.
        </td>
        <td>
            <ol>
                <li>
                Open the dev tools network tab in your browser and try opening the extension URL appending the following query string parameter sessionId=testSessionId - this should open a blank page and all requests in the network tab should be 200 or 300 level responses (no failures). If there is a server error in the extension - it will print out the error and a call stack if available. In case the failures are from a CDN domain, check if the same URL is accessible from the extension domain - if so, the CDN might be corrupt/out of sync. In this case, flushing the CDN would mitigate the issue.
                </li>
                <li>
                Scan the events table to see if there are any other relevant error messages during the time frame of the alert
                </li>
            </ol>
        </td>
    </tr>
    <tr>
        <td>
            InvalidExtensionName
        </td>
        <td>
            This error state means that the name of the extension specified in the extensions JSON in config doesn't match the name of the extension in the extension manifest.
        </td>
        <td>
            <ol>
                <li>
                Verify what the correct name of the extension should be, and if the name in config is incorrect, update it.
                </li>
                <li>
                If the name in the manifest is incorrect, contact the relevant extension team to update <Extension> tag in their PDL with the right extension name and recompile
                </li>
            </ol>
        </td>
    </tr>
    <tr>
        <td>
            InvalidManifest
        </td>
        <td>
            This error state means that the manifest that was received from an extension was invalid, i.e. it had validation errors
        </td>
        <td>
            Scan the error logs for all the validation errors in the extension manifest.
        </td>
    </tr>
    <tr>
        <td>
            InvalidDefinition
        </td>
        <td>
            This error state means that the definition that was received from an extension was invalid, i.e. it had validation errors
        </td>
        <td>
            Scan the error logs for all the validation errors in the extension definition.
        </td>
    </tr>
    <tr>
        <td>
            FailedToInitialize
        </td>
        <td>
            This error state means that the extension failed to initialize one or more calls to methods on the extension's entry point class failing
        </td>
        <td>
            <ol>
                <li>
                Look for the error code and if it is present the call stack in the  message to get more details.
                </li>
                <li>
                Scan the events table to get all the relevant error messages during the time frame of the alert
                </li>
                <li>
                These errors should have information about what exactly failed while trying to initialize the extension e.g. the initialize endpoint, the getDefinition endpoint, etc.
                </li>
            </ol>
        </td>
    </tr>
    <tr>
        <td>
            TooManyRefreshes
        </td>
        <td>
            This error state means that the extension try to reload itself within the IFrame multiple times. The error should specify the number of times it refreshed before the extension was disabled
        </td>
        <td>
            Scan the events table to see if there are any other relevant error messages during the time frame of the alert
        </td>
    </tr>
    <tr>
        <td>
            TooManyBootGets
        </td>
        <td>
            This error state means that the extension try to send the bootGet message to request for Fx scripts multiple times. The error should specify the number of times it refreshed before the extension was disabled
        </td>
        <td>
            Scan the events table to see if there are any other relevant error messages during the time frame of the alert
        </td>
    </tr>
    <tr>
        <td>
            TimedOut
        </td>
        <td>
            This error signifies that the extension failed to load after the predefined timeout.
        </td>
        <td>
            <ol>
                <li>
                    Scan the events table to see if there are any other relevant error messages during the time frame of the alert
                </li>
                <li>
                    Analyze the error messages to try to deduce whether the problem is on the extension side or the shell.
                </li>
                <li>
                If the issue is with the extension, look at CPU utilization of the cloud service instances. If the CPU utilization is high, it might explain why clients are timing out when requesting resources from the server.
                </li>
            </ol>
        </td>
    </tr>
    <tr>
        <td>
            MaxRetryAttemptsExceeded
        </td>
        <td>
            This a collation of the above events
        </td>
        <td>
             Inspect the sample message and follow appropriate step above
        </td>
    </tr>
</table>

<a name="reliability-checklist-reliability-frequently-asked-questions-faq-my-blade-is-below-the-reliability-bar-what-should-i-do"></a>
#### My Blade is below the reliability bar, what should I do

Firstly, run the following [query][kusto-blade-reliabiltiy-summary], ensure you update the extension/time range.

```txt
GetBladeFailuresSummary(ago(1h))
| where extension == "Microsoft_Azure_Compute"
```

| Field name        | Definition |
| ----------------- | ---------- |
| extension         | The extension the error correlates to |
| blade             | The blade the error correlates to |
| errorReason       | The error reason associated with the failure |
| Occurences        | Number of occurrences |
| AffectedUsers     | Number of affected users |
| AffectedSessions  | Number of affected sessions |
| any_sessionId     | A sample of an affected session |
| any_details       | A sample message of what would normally be returned given extension/blade/errorReason |

Once you have that, correlate the error reasons with the below list to see the guided next steps.

<table>
    <tr>
        <th>Error reason</th>
        <th>Defintion</th>
        <th>Action items</th>
    </tr>
    <tr>
        <td>
            ErrorInitializing
        </td>
        <td>
            The FX failed to initialize the blade due to an invalid definition.
        </td>
        <td>
            <ol>
                <li>
                    Verify the PDL definition of the given blade
                </li>
                <li>
                    Verify the source opening the blade is passing the correct parameters
                </li>
                <li>
                     Reference a sample session in the ClientEvents kusto table there should be correlating events before the blade failure
                </li>
            </ol>
        </td>
    </tr>
    <tr>
        <td>
            ErrorLoadingExtension
        </td>
        <td>
            The extension failed to load and therefore the blade was unable to load.
        </td>
        <td>
            Refer to the guidance provided for extension reliability
        </td>
    </tr>
    <tr>
        <td>
            ErrorLoadingDefinition
        </td>
        <td>
            The FX was unable to retrieve the blade defintion from the Extension.
        </td>
        <td>
             Reference a sample session in the ClientEvents kusto table there should be correlating events before the blade failure
        </td>
    </tr>
    <tr>
        <td>
            ErrorLoadingExtensionAndDefinition
        </td>
        <td>
            The FX was unable to retrieve the blade defintion from the Extension.
        </td>
        <td>
            Reference a sample session in the ClientEvents kusto table there should be correlating events before the blade failure
        </td>
    </tr>
    <tr>
        <td>
            ErrorUnrecoverable
        </td>
        <td>
            The FX failed to restore the blade during journey restoration because of an unexpected error.
        </td>
        <td>
            This should not occur but if it does file a [shell bug](http://aka.ms/portalfx/shellbug).
        </td>
    </tr>
</table>

<a name="reliability-checklist-my-part-is-below-the-reliability-bar-what-should-i-do"></a>
### My Part is below the reliability bar, what should I do

Firstly, run the following [query][kusto-part-reliabiltiy-summary], ensure you update the extension/time range.

```txt
GetPartFailuresSummary(ago(1h))
| where extension == "Microsoft_Azure_Compute"
```

| Field name        | Definition |
| ----------------- | ---------- |
| extension         | The extension the error correlates to |
| blade             | The blade the part is on, if blade === "Dashboard' then the part was loaded from a dashboard |
| part              | The part the error correlates to |
| errorReason       | The error reason associated with the failure |
| Occurences        | Number of occurrences |
| AffectedUsers     | Number of affected users |
| AffectedSessions  | Number of affected sessions |
| any_sessionId     | A sample of an affected session |
| any_details       | A sample message of what would normally be returned given extension/blade/part/errorReason |

Once you have that, correlate the error reasons with the below list to see the guided next steps.

<table>
    <tr>
        <th>Error reason</th>
        <th>Defintion</th>
        <th>Action items</th>
    </tr>
    <tr>
        <td>
            TransitionedToErrorState
        </td>
        <td>
            The part was unable to load and failed through its initialization or OnInputsSet
        </td>
        <td>
            Consult the any_details column, there should be sample message explaining explicitly what the issue was. Commonly this is a nullRef.
        </td>
    </tr>
    <tr>
        <td>
            ErrorLocatingPartDefinition
        </td>
        <td>
            The FX was unable to determine the part definition.
        </td>
        <td>
            The likely cause of this is the extension has removed the part entirely from the PDL, this is not the guided pattern.
            See deprecating parts for the explicit guidance. __NEED LINK__
        </td>
    </tr>
    <tr>
        <td>
            ErrorAcquiringViewModel
        </td>
        <td>
            The FX was unable to retrieve the part view model from the Extension.
        </td>
        <td> 
            You can correlate the start of thesample message with one of the below for common explanations. 
            <ul>
                <li>
                     ETIMEOUT - This may be caused by a flooding of the RPC layer.
                </li>
                <li>
                     Script error - Dependent on the exact message, this may be due to timeouts/latency issues/connection problems.
                </li>
                <li>
                     Load timeout for modules - This may be caused by a slow or loss of connection.
                </li>
                <li>
                     description: - This is generic bucket, here the message will define the issue further. For example if there were null references
                </li>
            </ul>
            For all the above if enough information was not provided via the message explore the raw events function or reference a sample session in
            the ClientEvents kusto table as there should be correlating events before the failure. 
        </td>
    </tr>
    <tr>
        <td>
            ErrorLoadingControl
        </td>
        <td>
            The FX was unable to retrieve the control module.
        </td>
        <td>
            Reach out to the FX team if you see a large amount of these issues.
        </td>
    </tr>
    <tr>
        <td>
            ErrorCreatingWidget
        </td>
        <td>
            The FX failed to create the widget.
        </td>
        <td>
            Check the sample message this is indicate the explicit reason why it failed, this was probably a ScriptError or failure to load the module.
        </td>
    </tr>
    <tr>
        <td>
            OldInputsNotHandled
        </td>
        <td>
            In this case a user has a pinned representation of a old version of the tile. The extension author has changed the inputs in a breaking fashion.
        </td>
        <td>
            If this happens you need follow the guided pattern. __NEED LINK__
        </td>
    </tr>
</table>


<a name="reliability-alerts"></a>
## Alerts

This is in progress, if you have interest in adopting reliability alerts please contact sewatson

There are 3 types of alerts we will be firing:

1. Extension reliability - this requires on-boarding please contact sewatson if you are interested
1. Blade reliability hourly 
1. Part reliability hourly 

[TelemetryOnboarding]: </portalfx-telemetry-getting-started>
[Ext-Perf/Rel-Report]: <http://aka.ms/portalfx/dashboard/extensionperf>
[portalfx-cdn]: </portalfx-cdn>
[kusto-extension-reliability-summary]: <https://azportal.kusto.windows.net:443/AzurePortal?query=H4sIAAAAAAAEAHNPLXGtKEnNK87Mz3NLzMwpLUotDi7NzU0sqtRITM%2fXMEzR1OTlqlEoz0gtSlVIhSn1S8xNVUjOzytJzMwrVlDyzUwuyi%2fOTyuJd6wCmhDvnJ9bUFqSqsTLxcsFAAXqLsliAAAA>
[kusto-blade-reliabiltiy-summary]: <https://azportal.kusto.windows.net:443/AzurePortal?query=H4sIAAAAAAAEAHNPLXHKSUxJdUvMzCktSi0OLs3NTSyq1EhMz9cwzNDU5OWqUSjPSC1KVUitKEnNK87Mz1OwtVVQ8s1MLsovzk8riXesAuqLd87PLSgtSVXi5QJBADW0cJdWAAAA>
[kusto-part-reliabiltiy-summary]: <https://azportal.kusto.windows.net:443/AzurePortal?query=H4sIAAAAAAAEAHNPLQlILCpxS8zMKS1KLQ4uzc1NLKrUSEzP1zDM0NTk5apRKM9ILUpVSK0oSc0rzszPU7C1VVDyzUwuyi%2fOTyuJd6wC6ot3zs8tKC1JVQIAAv63pU8AAAA%3d>

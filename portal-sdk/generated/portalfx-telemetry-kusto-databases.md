* [Kusto Telemetry](#kusto-telemetry)
    * [Supported Databases](#kusto-telemetry-supported-databases)
    * [Supported Kusto Tables](#kusto-telemetry-supported-kusto-tables)
    * [Supported Functions](#kusto-telemetry-supported-functions)
    * [Query for Reported Numbers](#kusto-telemetry-query-for-reported-numbers)
    * [Supported Cosmos streams](#kusto-telemetry-supported-cosmos-streams)
    * [ClientTelemetry (AzPtlCosmos)](#kusto-telemetry-clienttelemetry-azptlcosmos)


<a name="kusto-telemetry"></a>
## Kusto Telemetry

<a name="kusto-telemetry-supported-databases"></a>
### Supported Databases

|Name              | Details                                                                                                                                                                                                                                                                                                                                                                                         |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|AzPtlCosmos       | This is our main telemetry database. Data here is deduped, geo-coded, expanded and filtered. All the official dashboards\reports are based on this table. It is highly encouraged that this database is used for your needs. Data here is persisted for 120 days and excludes test traffic.                                                                                                     |
|AzurePortal       | There will be many scenarios where you may want to debug your issues. For e.g., debugging perf issues. To look at diagnostic events, this is the right table to use. This is the raw data coming from MDS directly to Kusto and it is unprocessed. Data here is persisted for 45 days. To filter out test traffic when doing queries on this database, you should use userTypeHint == "".       |


<a name="kusto-telemetry-supported-kusto-tables"></a>
### Supported Kusto Tables

|Database          | Table Name        | Details                                                                                                                                              |
|------------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
|AzPtlCosmos       | ClientTelemetry   | This is all the Client Telemetry data that is collected from the portal. This is the main table that should be good for most scenarios.              |
|AzPtlCosmos       | ExtTelemetry      | This holds client events data for extensions using the Extension Telemetry feature.                                                                  |

Other useful Kusto tables are the ones where errors and warnings are getting logged. These tables are currently available only under AzurePortal database:

|Database          | Table Name        | Details                                                                                                                                                                                                                                 |
|------------------|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|AzurePortal       | ClientEvents      | This table contains errors and warnings thrown from Framework and Hubs IFrame.                                                                                                                                                          |
|AzurePortal       | ExtEvents         | This table contains errors and warnings thrown from an extension's IFrame. Your extension will log to this table only if you have previously [onboarded to ExtTelemetry/ExtEvents tables](portalfx-telemetry.md).  |

<a name="kusto-telemetry-supported-functions"></a>
### Supported Functions

![Supported Functions](../media/portalfx-telemetry/supportedfunctions.png)

Other functions in the databases are available for exploration but are mainly intended for internal usage and are subject to change at any time.

<a name="kusto-telemetry-query-for-reported-numbers"></a>
### Query for Reported Numbers


On a weekly basis, we send out a Weekly Ibiza Status mail where we cover the KPI numbers for all extensions among other things. For folks not getting these emails, please join one of the groups in the screenshot below.

These emails have clickable Kusto links within the reported numbers. Clicking on these will take you to the Kusto query behind getting these numbers. We use functions to hide the complexity behind the queries that we use. To view the details about the queries, look under **Functions\Public**. Once you find the right function, if you right-click and do “Make a command script”, you will be able to see the details of that function. You can do this recursively for any functions underneath. 

![Connection Scope](../media/portalfx-telemetry/connectionScope.png)


<a name="kusto-telemetry-supported-cosmos-streams"></a>
### Supported Cosmos streams

While we have moved to Kusto, we still have streams that continue to exist. This could be required if you want to enable some E2E automation, write super-complex queries that Kusto is unable to handle or need data older than 120 days. 

|Name              | Schema                                                                                                           | Cosmos Link                                                                                                                                                                                                           |
|------------------|------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Client Telemetry  | [DataSet=53004](https://nova.msdial.com/vis/DataCatalog/DataSetViewer?dataSet=53004&dataType=Schema)             | [Daily ClientTelemetry](https://cosmos11.osdinfra.net/cosmos/AzureAnalytics.Partner.AAPT/shares/AzureAnalytics.Dev/AzureAnalytics.Dev.PublishedData/AAPT.Gauge.Ibiza.Daily/ClientTelemetry/)                          |
|ClientTelemetryForKustoExport | [DataSet=93405](https://nova.msdial.com/vis/DataCatalog/DataSetViewer?dataSet=93405&dataType=Schema) | [Hourly ClientTelemetry](https://cosmos11.osdinfra.net/cosmos/azureanalytics.partner.azureportal/shares/AzureAnalytics.Dev/AzureAnalytics.Dev.PublishedData/AAPT.Gauge.Ibiza.Hourly/ClientTelemetryForKustoExport/)   |

We plan to merge ClientTelemetryForKustoExport into ClientTelemetry stream very shortly. ClientTelemetryForKustoExport is the stream that currently feeds the Kusto database - AzPtlCosmos

<a name="kusto-telemetry-clienttelemetry-azptlcosmos"></a>
### ClientTelemetry (AzPtlCosmos)

<a name="kusto-telemetry-clienttelemetry-azptlcosmos-action"></a>
#### Action
This represents an event in the portal.

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


<a name="kusto-telemetry-clienttelemetry-azptlcosmos-actionmodifier"></a>
#### ActionModifier
This is used in tandem with the Action field. This represents a status of a particular Action. So for BladeReady for eg., you will see ActionModifier values of start, complete & cancel

<a name="kusto-telemetry-clienttelemetry-azptlcosmos-area"></a>
#### Area
This field usually gives the extension name associated with the particular Action. This is derived from either then Name field or the Source field depending on the Action

<a name="kusto-telemetry-clienttelemetry-azptlcosmos-blade"></a>
#### Blade
This field gives the Blade name associated with the particular Action. This is derived from either then Name field or the Source field depending on the Action

<a name="kusto-telemetry-clienttelemetry-azptlcosmos-browserfamily"></a>
#### BrowserFamily
This field represents the name of the Browser used by the User. This is derived from the UserAgent field

<a name="kusto-telemetry-clienttelemetry-azptlcosmos-browsermajorversion"></a>
#### BrowserMajorVersion
This field represents the Major Version of the Browser used by the User. This is derived from the UserAgent field

<a name="kusto-telemetry-clienttelemetry-azptlcosmos-browserminorversion"></a>
#### BrowserMinorVersion
This field represents the Minor Version of the Browser used by the User. This is derived from the UserAgent field

<a name="kusto-telemetry-clienttelemetry-azptlcosmos-clienttime"></a>
#### ClientTime
This field gives the actual time of the event according to the client's clock (which can be off based on the client settings). This is a good field to reconstruct the precise sequence of events.

<a name="kusto-telemetry-clienttelemetry-azptlcosmos-data"></a>
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

<a name="kusto-telemetry-clienttelemetry-azptlcosmos-duration"></a>
#### Duration
This field gives the duration a particular Action took to complete. This value is non-zero only for Actions with ActionModifier having values either "complete", "succeeded", etc. The time is in milliseconds.

<a name="kusto-telemetry-clienttelemetry-azptlcosmos-journeyid"></a>
#### JourneyId
This field provides the journey Id for each action. A journey is basically a tiny sub-session within which a user navigates a flow of blades. This id allows us to identify the actions that the user took within any given journey, how many journey did a user interact with, etc.

<a name="kusto-telemetry-clienttelemetry-azptlcosmos-lens"></a>
#### Lens
This field gives the Lens name associated with the particular Action. This is derived from either then Name field or the Source field depending on the Action

<a name="kusto-telemetry-clienttelemetry-azptlcosmos-name"></a>
#### Name
The Name field usually changes it's format based on the Action. In most scenarios, it usually has the following format
		
        Extension/<extensionName>/Blade/<BladeName>/Lens/<LensName>/PartInstance/<PartName>

<a name="kusto-telemetry-clienttelemetry-azptlcosmos-this-field-is-usually-used-to-identify-the-extension-blade-lens-part-associated-with-a-particular-action"></a>
#### This field is usually used to identify the extension\Blade\Lens\Part associated with a particular Action.

<a name="kusto-telemetry-clienttelemetry-azptlcosmos-sessionid"></a>
#### SessionId
This represents each sessions that the user opens. SessionId refreshes everytime a user logs in\refreshes. 

<a name="kusto-telemetry-clienttelemetry-azptlcosmos-part"></a>
#### Part
This field gives the Part name associated with the particular Action. This is derived from either then Name field or the Source field depending on the Action

<a name="kusto-telemetry-clienttelemetry-azptlcosmos-precisetimestamp"></a>
#### PreciseTimeStamp
This field gives the time the event was logged by the server. It is in UTC.

<a name="kusto-telemetry-clienttelemetry-azptlcosmos-userid"></a>
#### UserId
This field identifies a user by PUID. We can use this to identify queries like daily active users, unique users using my feature, etc.

<a name="kusto-telemetry-clienttelemetry-azptlcosmos-useragent"></a>
#### UserAgent
This represents the user agent of the user. This is a standard UserAgentString - [User Agent](https://en.wikipedia.org/wiki/User_agent)

<a name="kusto-telemetry-clienttelemetry-azptlcosmos-usercity"></a>
#### UserCity
This represents the City that the User has used the portal from. We derive this from the Users Client IP.

<a name="kusto-telemetry-clienttelemetry-azptlcosmos-usercountry"></a>
#### UserCountry
This represents the Country that the User has used the portal from. We derive this from the Users Client IP.

Read more about [Kusto query language](https://kusto.azurewebsites.net/docs/queryLanguage/query_language.html).

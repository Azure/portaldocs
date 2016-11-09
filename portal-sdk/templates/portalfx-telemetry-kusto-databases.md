## Kusto Telemetry

### Supported Databases

|Name              | Details                                                                                                                                                                                                                                                                                                                                                                                         |
|------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|AzPtlCosmos       | This is our main telemetry database. Data here is deduped, geo-coded, expanded and filtered. All the official dashboards\reports are based on this table. It is highly encouraged that this database is used for your needs. Data here is persisted for 120 days and excludes test traffic.                                                                                                     |
|AzurePortal       | There will be many scenarios where you may want to debug your issues. For e.g., debugging perf issues. To look at diagnostic events, this is the right table to use. This is the raw data coming from MDS directly to Kusto and it is unprocessed. Data here is persisted for 45 days. To filter out test traffic when doing queries on this database, you should use userTypeHint == "".       |


### Supported Kusto Tables

|Database          | Table Name        | Details                                                                                                                                              |
|------------------|-------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
|AzPtlCosmos       | ClientTelemetry   | This is all the Client Telemetry data that is collected from the portal. This is the main table that should be good for most scenarios.              |
|AzPtlCosmos       | ExtTelemetry      | This holds client events data for extensions using the Extension Telemetry feature.                                                                  |

Other useful Kusto tables are the ones where errors and warnings are getting logged. These tables are currently available only under AzurePortal database:

|Database          | Table Name        | Details                                                                                                                                                                                                                                 |
|------------------|-------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|AzurePortal       | ClientEvents      | This table contains errors and warnings thrown from Framework and Hubs IFrame.                                                                                                                                                          |
|AzurePortal       | ExtEvents         | This table contains errors and warnings thrown from an extension's IFrame. Your extension will log to this table only if you have previously [onboarded to ExtTelemetry/ExtEvents tables](/documentation/articles/portalfx-telemetry).  |

### Supported Functions

![Supported Functions](../media/portalfx-telemetry/supportedfunctions.png)

Other functions in the databases are available for exploration but are mainly intended for internal usage and are subject to change at any time.

### Query for Reported Numbers


On a weekly basis, we send out a Weekly Ibiza Status mail where we cover the KPI numbers for all extensions among other things. For folks not getting these emails, please join one of the groups in the screenshot below.

These emails have clickable Kusto links within the reported numbers. Clicking on these will take you to the Kusto query behind getting these numbers. We use functions to hide the complexity behind the queries that we use. To view the details about the queries, look under **Functions\Public**. Once you find the right function, if you right-click and do “Make a command script”, you will be able to see the details of that function. You can do this recursively for any functions underneath. 

![Connection Scope](../media/portalfx-telemetry/connectionScope.png)


### Supported Cosmos streams

While we have moved to Kusto, we still have streams that continue to exist. This could be required if you want to enable some E2E automation, write super-complex queries that Kusto is unable to handle or need data older than 120 days. 

|Name              | Schema                                                                                                           | Cosmos Link                                                                                                                                                                                                           |
|------------------|------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|Client Telemetry  | [DataSet=53004](https://nova.msdial.com/vis/DataCatalog/DataSetViewer?dataSet=53004&dataType=Schema)             | [Daily ClientTelemetry](https://cosmos11.osdinfra.net/cosmos/AzureAnalytics.Partner.AAPT/shares/AzureAnalytics.Dev/AzureAnalytics.Dev.PublishedData/AAPT.Gauge.Ibiza.Daily/ClientTelemetry/)                          |
|ClientTelemetryForKustoExport | [DataSet=93405](https://nova.msdial.com/vis/DataCatalog/DataSetViewer?dataSet=93405&dataType=Schema) | [Hourly ClientTelemetry](https://cosmos11.osdinfra.net/cosmos/azureanalytics.partner.azureportal/shares/AzureAnalytics.Dev/AzureAnalytics.Dev.PublishedData/AAPT.Gauge.Ibiza.Hourly/ClientTelemetryForKustoExport/)   |

We plan to merge ClientTelemetryForKustoExport into ClientTelemetry stream very shortly. ClientTelemetryForKustoExport is the stream that currently feeds the Kusto database - AzPtlCosmos

### ClientTelemetry (AzPtlCosmos)

#### Action 
This represents an event in the portal.

{"gitdown": "include-file", "file": "./includes/portalfx-telemetry-actions.md"}

#### ActionModifier
This is used in tandem with the Action field. This represents a status of a particular Action. So for BladeReady for eg., you will see ActionModifier values of start, complete & cancel

#### Area
This field usually gives the extension name associated with the particular Action. This is derived from either then Name field or the Source field depending on the Action

#### Blade
This field gives the Blade name associated with the particular Action. This is derived from either then Name field or the Source field depending on the Action

#### BrowserFamily
This field represents the name of the Browser used by the User. This is derived from the UserAgent field

#### BrowserMajorVersion
This field represents the Major Version of the Browser used by the User. This is derived from the UserAgent field

#### BrowserMinorVersion
This field represents the Minor Version of the Browser used by the User. This is derived from the UserAgent field

#### ClientTime
This field gives the actual time of the event according to the client's clock (which can be off based on the client settings). This is a good field to reconstruct the precise sequence of events.

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

#### Duration
This field gives the duration a particular Action took to complete. This value is non-zero only for Actions with ActionModifier having values either "complete", "succeeded", etc. The time is in milliseconds.

#### JourneyId
This field provides the journey Id for each action. A journey is basically a tiny sub-session within which a user navigates a flow of blades. This id allows us to identify the actions that the user took within any given journey, how many journey did a user interact with, etc.

#### Lens
This field gives the Lens name associated with the particular Action. This is derived from either then Name field or the Source field depending on the Action

#### Name
The Name field usually changes it's format based on the Action. In most scenarios, it usually has the following format
		
        Extension/<extensionName>/Blade/<BladeName>/Lens/<LensName>/PartInstance/<PartName>

#### This field is usually used to identify the extension\Blade\Lens\Part associated with a particular Action.

#### SessionId
This represents each sessions that the user opens. SessionId refreshes everytime a user logs in\refreshes. 

#### Part
This field gives the Part name associated with the particular Action. This is derived from either then Name field or the Source field depending on the Action

#### PreciseTimeStamp
This field gives the time the event was logged by the server. It is in UTC.

#### UserId
This field identifies a user by PUID. We can use this to identify queries like daily active users, unique users using my feature, etc.

#### UserAgent
This represents the user agent of the user. This is a standard UserAgentString - [User Agent](https://en.wikipedia.org/wiki/User_agent)

#### UserCity
This represents the City that the User has used the portal from. We derive this from the Users Client IP.

#### UserCountry
This represents the Country that the User has used the portal from. We derive this from the Users Client IP.

Read more about [Kusto query language](https://kusto.azurewebsites.net/docs/queryLanguage/query_language.html).

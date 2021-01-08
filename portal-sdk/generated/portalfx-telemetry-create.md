* [Create Telemetry](#create-telemetry)
    * [Create Flow Telemetry Dashboards](#create-telemetry-create-flow-telemetry-dashboards)
    * [Create Flow table](#create-telemetry-create-flow-table)
    * [Create Flow Functions](#create-telemetry-create-flow-functions)
        * [AzurePortal Database VS. AzPtlCosmos Database functions](#create-telemetry-create-flow-functions-azureportal-database-vs-azptlcosmos-database-functions)
        * [GetCreateFlows](#create-telemetry-create-flow-functions-getcreateflows)
        * [GetCreateFunnel](#create-telemetry-create-flow-functions-getcreatefunnel)
        * [GetCreateFunnelByDay](#create-telemetry-create-flow-functions-getcreatefunnelbyday)
        * [GetCombinedCreateFunnel](#create-telemetry-create-flow-functions-getcombinedcreatefunnel)


<a name="create-telemetry"></a>
# Create Telemetry

<a name="create-telemetry-create-flow-telemetry-dashboards"></a>
## Create Flow Telemetry Dashboards

* PowerBi Dashboard: [https://msit.powerbi.com/groups/me/dashboards/73368590-6a29-4a85-b534-69791580be4a](https://msit.powerbi.com/groups/me/dashboards/73368590-6a29-4a85-b534-69791580be4a)
* [Documentation](portalfx-telemetry-createFlowDashboard.md)

<a name="create-telemetry-create-flow-table"></a>
## Create Flow table

CreateFlow table in Kusto database **AzPtlCosmos** called **CreateFlows**

Accessible through using the function: **GetCreateFlows(startDate: datetime, endDate: datetime)**

**Description**

A CreateFlow row is a flattened telemetry timeline comprised of the following create related telemetry events (in order of their trigger in the timeline of a create flow):
- CreateFlowLaunched (CFL) - Marketplace create blade opened
- ProvisioningBladeOpened (PBO) - Nonpdl blade that creates resources opened (can be from marketplace or not)
- ProvisioningStarted (PS) - Portal create started
- CreateDeploymentStart (CDS) - Create accepted by ARM
- CreateDeploymentEnd (CDE) - Create completed by ARM
- ProvisioningEnded (PE) - Portal create completed

**Rules about the which events make up a create flow**

- Every CreateFlow row will have the PS,PE,CDS,CDE events
- A createflow used to be only started with a CFL event, but now can be started with a ProvisioningBladeOpened PBO event as well.
- A createflow can have either the CFL or the PBO event, or only 1, but must have at least 1.

**Rules about which events start a create flow (CFL and PBO)**

- CFL but no PBO
  - FromMarketplace == true
    - This is a marketplace create with an old pdl blade
  - FromMarketplace == false
    - This is a nonmarketplace create with an old pdl blade
- PBO but no CFL
  - This is always a nonmarketplace create with a nonpdl blade, so FromMarketplace will alway be false
- CFL and PBO
  - This is always a marketplace create with a nonpdl blade, so FromMarketplace will always be true

<a name="create-telemetry-create-flow-functions"></a>
## Create Flow Functions

<a name="create-telemetry-create-flow-functions-azureportal-database-vs-azptlcosmos-database-functions"></a>
### AzurePortal Database VS. AzPtlCosmos Database functions

There are two Kusto databases that are supported with Create Flow related functions for you to use. Although in some cases the functions may have the same names, they have some differenes that are worth noting.

<a name="create-telemetry-create-flow-functions-azureportal-database-vs-azptlcosmos-database-functions-azureportal-create-functions"></a>
#### AzurePortal Create functions

Found under: `Functions\CreateFlows`

* The intended purpose of the AzurePoral.GetCreateFlows function is for Live-site alert debugging and test verification.
* Creates completed in the Portal will be available here typically within 10-15 minutes.
* Creates here will include **test traffic** and will be with the column `isTestTraffic=true`.
* Queries will be much slower as all raw telemetry must be queried over in-real-time.
* For most use-cases, please try to query only hours of data at a time with this query for best results. If the create you are searching for has occured in the last 24 hours, or is test traffic, then this is the best function for you to use.

Common cases for traffic being marked as test:
* If any feature flags are used
* Test account is used
* Stamp of extension is manually overriden

Note:
* The AzPtlCosmos.GetCreateFlows function provides additional optional filtering parameters that can be passed in to drastically improve query time - these options are not available in the AzurePortal.GetCreateFlows function as these queries all occur in-real-time.

<a name="create-telemetry-create-flow-functions-azureportal-database-vs-azptlcosmos-database-functions-azptlcosmos-create-functions"></a>
#### AzPtlCosmos Create functions

Found under: `Functions\CreateFlows`

* The intended purpose of the AzPtlCosmos.getCreateFlows function is for KPI tracking, dashboards, and general use.
* All telemetry in this database goes through a pipeline to improve and filter the results, which causes a significant delay up to 24 hours for CreateFlows (no SLA).
  * The result is drastically improved results and query speed.
* If the creates you want to capture span more than 24 hours, but have occured more than 24 hours ago, and are not test traffic, then this is the correct function to use.

<a name="create-telemetry-create-flow-functions-getcreateflows"></a>
### GetCreateFlows

<a name="create-telemetry-create-flow-functions-getcreateflows-summary"></a>
#### Summary
<a name="create-telemetry-create-flow-functions-getcreateflows-summary"></a>
<a name="create-telemetry-create-flow-functions-getcreateflows-summary-1"></a>
#### Summary

```
GetCreateFlows(
    startDate:datetime,                 // required
    endDate:datetime,                   // required
    match_Extention:string="",          // optional
    match_Blade:string="",              // optional
    match_SessionId:string="",          // optional
    match_SubscriptionId:string="",     // optional
    match_TelemetryId:string="",        // optional
    match_CorrelationId:string="",      // optional
    match_GalleryPackageId:string="",   // optional
    match_BuildNumber:string="",        // optional
    exclude_NonMarketplace:bool=true    // optional
)
```

This function returns the list of Portal Azure service deployment lifecycles, also known as 'create flows', for a given time range.
* Each create flow represents the lifecycle of a create with the beginning being marked by the moment the create blade is opened and ending the moment that the create has been concluded and logged by the Portal.
* Data for each create is curated and joined between Portal data logs and available ARM deployment data logs.

<a name="create-telemetry-create-flow-functions-getcreateflows-common-use-cases"></a>
#### Common Use Cases
* Identifying the number of creates completed for a given Extension or for a particular Azure marketplace gallery package.
* Calculating the percentage of successful creates initiated by an Extension's create blade.
* Debugging failed deployments by retrieving error message information logged for failed creates.
* Calculating the number of creates that were abandoned by the user before being initiated and completed.
* Identifying creates initiated by a given user id.
* Calculating the average create duration by data center.

<a name="create-telemetry-create-flow-functions-getcreateflows-underlying-function-resources"></a>
#### Underlying Function Resources
* `cluster("Azportalpartner").database("AzPtlCosmos").CreateFlows`
  * The source of the Azure create lifecycle deployment information.
* `cluster("Armprod").database("ARMProd").Deployments`
  * The source of the ARM deployment information
* `cluster("Armprod").database("ARMProd").HttpIncomingRequests`
  * Used to identify which of the ARM deployments are requests made from the Portal.
* `cluster("Armprod").database("ARMProd").EventServiceEntries`
  * The source of the ARM deployment failed logs error information.

<a name="create-telemetry-create-flow-functions-getcreateflows-parameters"></a>
#### Parameters
* startDate: ***required*** The date to mark the inclusive start of the time range.
* endDate: ***required*** The date to mark the exclusive end of the time range.
* match_Extention: *optional* Filter by extension name.
* match_Blade: *optional* Filter by blade name.
* match_SessionId: *optional* Filter by session id.
* match_SubscriptionId: *optional* Filter by subscription id.
* match_TelemetryId: *optional* Filter by telemetry id.
* match_CorrelationId: *optional* Filter by correlation id.
* match_GalleryPackageId: *optional* Filter by gallery package id.
* match_BuildNumber: *optional* Filter by build number.
* exclude_NonMarketplace: *optional* Filter out creates that were not initiated from the marketplace. True by default.

<a name="create-telemetry-create-flow-functions-getcreateflows-output-columns"></a>
#### Output Columns
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

<a name="create-telemetry-create-flow-functions-getcreatefunnel"></a>
### GetCreateFunnel

<a name="create-telemetry-create-flow-functions-getcreatefunnel-summary-2"></a>
#### Summary
`GetCreateFunnel(startDate: datetime, endDate: datetime)`

This functions calculates the create funnel KPI's for each extension's create blade for a given time range.

<a name="create-telemetry-create-flow-functions-getcreatefunnel-common-use-cases-1"></a>
#### Common Use Cases
* Retrieving the percentage of successful create initated by an Extension's create blade for a week.
* Retrieving the number of the failed creates.
* Retrieving the drop off rate of customers attempting a create (how often creates are abandoned).

<a name="create-telemetry-create-flow-functions-getcreatefunnel-underlying-function-resources-1"></a>
#### Underlying Function Resources
* [GetCreateFlows()](#create-telemetry-create-flow-functions-getcreateflows)

<a name="create-telemetry-create-flow-functions-getcreatefunnel-parameters-1"></a>
#### Parameters
* startDate: The date to mark the inclusive start of the time range.
* endDate: The date to mark the exclusive end of the time range.

<a name="create-telemetry-create-flow-functions-getcreatefunnel-output-columns-1"></a>
#### Output Columns
* Extension
  * The Extension which initiated the creates.
* Blade
  * The create blade which inititated the creates.
* CreateBladeOpened
  * The number of times the create blade was opened.
  * Calculated by taking the count of the number of Create Flows for each blade from [GetCreateFlows()](#create-telemetry-create-flow-functions-getcreateflows) which had:
    * `CreateBladeOpened == true`.
* Started
  * The number of creates that were started.
  * Calculated by taking the count of the number of Create Flows for each blade from [GetCreateFlows()](#create-telemetry-create-flow-functions-getcreateflows) which had:
    * `PortalCreateStarted == true`
    * or `ArmDeploymentStarted == true`
  * *Note - We check both of these for redundancy proof becuase we know that as long as one of these properties are true then we know a create was started.*
* Excluded
  * The number of creates from [GetCreateFlows()](#create-telemetry-create-flow-functions-getcreateflows) that were marked as Excluded.
  * *See [GetCreateFlows()](#create-telemetry-create-flow-functions-getcreateflows) documentation for Excluded details.*
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

<a name="create-telemetry-create-flow-functions-getcreatefunnelbyday"></a>
### GetCreateFunnelByDay

<a name="create-telemetry-create-flow-functions-getcreatefunnelbyday-summary-3"></a>
#### Summary
`GetCreateFunnelByDay(startDate: datetime, endDate: datetime)`

This functions calculates the create funnel KPI's for each extension's create blade for each day over a given time range.

<a name="create-telemetry-create-flow-functions-getcreatefunnelbyday-common-use-cases-2"></a>
#### Common Use Cases
* Identifying the change in the number of successful create initiated by an Extension's create blade over the course of multiple weeks.
* Identifying which days have higher number of failed deployments.

<a name="create-telemetry-create-flow-functions-getcreatefunnelbyday-underlying-function-resources-2"></a>
#### Underlying Function Resources
* [GetCreateFlows()](#create-telemetry-create-flow-functions-getcreateflows)

<a name="create-telemetry-create-flow-functions-getcreatefunnelbyday-parameters-2"></a>
#### Parameters
* startDate: The date to mark the inclusive start of the time range.
* endDate: The date to mark the exclusive end of the time range.

<a name="create-telemetry-create-flow-functions-getcreatefunnelbyday-output-columns-2"></a>
#### Output Columns
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
  * Calculated by taking the count of the number of Create Flows  for each blade from [GetCreateFlows()](#create-telemetry-create-flow-functions-getcreateflows) which had:
    * `CreateBladeOpened == true`.
* Started
  * The number of creates that were started.
  * Calculated by taking the count of the number of Create Flows  for each blade from [GetCreateFlows()](#create-telemetry-create-flow-functions-getcreateflows) which had:
    * `PortalCreateStarted == true`
    * or `ArmDeploymentStarted == true`
  * *Note - We check both of these for redundancy proof becuase we know that as long as one of these properties are true then we know a create was started.*
* Excluded
  * The number of creates from [GetCreateFlows()](#create-telemetry-create-flow-functions-getcreateflows) that were marked as Excluded.
  * *See [GetCreateFlows()](#create-telemetry-create-flow-functions-getcreateflows) documentation for Excluded details.*
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

<a name="create-telemetry-create-flow-functions-getcreatefunnelbyday-getcreatefunnelbygallerypackageid"></a>
#### GetCreateFunnelByGalleryPackageId

<a name="create-telemetry-create-flow-functions-getcreatefunnelbyday-summary-4"></a>
#### Summary
`GetCreateFunnelByGalleryPackageId(startDate: datetime, endDate: datetime)`

This functions calculates the create funnel KPI's by gallery package id, extension, and create blade over a given time range.

<a name="create-telemetry-create-flow-functions-getcreatefunnelbyday-common-use-cases-3"></a>
#### Common Use Cases
* Identifying the number of successfully creates for a resource.
* Identifying which resources have higher number of failed deployments.

<a name="create-telemetry-create-flow-functions-getcreatefunnelbyday-underlying-function-resources-3"></a>
#### Underlying Function Resources
* [GetCreateFlows()](#create-telemetry-create-flow-functions-getcreateflows)

<a name="create-telemetry-create-flow-functions-getcreatefunnelbyday-parameters-3"></a>
#### Parameters
* startDate: The date to mark the inclusive start of the time range.
* endDate: The date to mark the exclusive end of the time range.

<a name="create-telemetry-create-flow-functions-getcreatefunnelbyday-output-columns-3"></a>
#### Output Columns
* Extension
  * The Extension which initiated the creates.
* Blade
  * The create blade which inititated the creates.
* GalleryPackageId
  * The gallery package id that was created.
* CreateBladeOpened
  * The number of times the create blade was opened.
  * Calculated by taking the count of the number of Create Flows for each blade from [GetCreateFlows()](#create-telemetry-create-flow-functions-getcreateflows) which had:
    * `CreateBladeOpened == true`.
* Started
  * The number of creates that were started.
  * Calculated by taking the count of the number of Create Flows for each blade  from [GetCreateFlows()](#create-telemetry-create-flow-functions-getcreateflows) which had:
    * `PortalCreateStarted == true`
    * or `ArmDeploymentStarted == true`
  * *Note - We check both of these for redundancy proof becuase we know that as long as one of these properties are true then we know a create was started.*
* Excluded
  * The number of creates from [GetCreateFlows()](#create-telemetry-create-flow-functions-getcreateflows) that were marked as Excluded.
  * *See [GetCreateFlows()](#create-telemetry-create-flow-functions-getcreateflows) documentation for Excluded details.*
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

<a name="create-telemetry-create-flow-functions-getcombinedcreatefunnel"></a>
### GetCombinedCreateFunnel

<a name="create-telemetry-create-flow-functions-getcombinedcreatefunnel-summary-5"></a>
#### Summary
`GetCombinedCreateFunnel(startDate: datetime, endDate: datetime)`

This functions calculates the overall create funnel KPIs for the Portal.

<a name="create-telemetry-create-flow-functions-getcombinedcreatefunnel-common-use-cases-4"></a>
#### Common Use Cases
* Identifying the overall success rates of creates in the Portal.
* Identifying the total number of failed creates in the Portal.
* Identifying the total number of create aborted due to commerce errors in the Portal.
* Identifying the overall rate of create flows that lead to a create being started.

<a name="create-telemetry-create-flow-functions-getcombinedcreatefunnel-underlying-function-resources-4"></a>
#### Underlying Function Resources
* [GetCreateFlows()](#create-telemetry-create-flow-functions-getcreateflows)

<a name="create-telemetry-create-flow-functions-getcombinedcreatefunnel-parameters-4"></a>
#### Parameters
* startDate: The date to mark the inclusive start of the time range.
* endDate: The date to mark the exclusive end of the time range.

<a name="create-telemetry-create-flow-functions-getcombinedcreatefunnel-output-columns-4"></a>
#### Output Columns
* CreateBladeOpened
  * The total number of times create blade were opened.
  * Calculated by taking the total count of the number of Create Flows from [GetCreateFlows()](#create-telemetry-create-flow-functions-getcreateflows) which had:
    * `CreateBladeOpened == true`.
* Started
  * The total number of creates that were started.
  * Calculated by taking the total count of the number of Create Flows from [GetCreateFlows()](#create-telemetry-create-flow-functions-getcreateflows) which had:
    * `PortalCreateStarted == true`
    * or `ArmDeploymentStarted == true`
  * *Note - We check both of these for redundancy proof becuase we know that as long as one of these properties are true then we know a create was started.*
* Excluded
  * The total number of creates from [GetCreateFlows()](#create-telemetry-create-flow-functions-getcreateflows) that were marked as Excluded.
  * *See [GetCreateFlows()](#create-telemetry-create-flow-functions-getcreateflows) documentation for Excluded details.*
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

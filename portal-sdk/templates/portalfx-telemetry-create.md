{"gitdown": "contents"}

# Create Telemetry 

## Create Flow Telemetry Dashboards

* PowerBi Dashboard: https://msit.powerbi.com/groups/me/dashboards/73368590-6a29-4a85-b534-69791580be4a
* Documentation: https://github.com/Azure/portaldocs/blob/master/portal-sdk/templates/portalfx-telemetry-createFlowDashboard.md
  
## Create Flow table

CreateFlow table in Kusto database **AzPtlCosmos** called **CreateFlows**

Accessible through using the function: **GetCreateFlows(startDate: datetime, endDate: datetime)**

## Create Flow Functions

[GetCreateFlows](#GetCreateFlows)

[GetCreateFunnel](#GetCreateFunnel)

[GetCreateFunnelByDay](#GetCreateFunnelByDay)

[GetCreateFunnelByGalleryPackageId](#GetCreateFunnelByGalleryPackageId)

[GetCombinedCreateFunnel](#GetCombinedCreateFunnel)

# <a name="GetCreateFlows"></a>GetCreateFlows(startDate: datetime, endDate: datetime)

## Summary
This function returns the list of Portal Azure service deployment lifecycles, also known as 'create flows', for a given time range.
* Each create flow represents the lifecycle of a create with the beginning being marked by the moment the create blade is opened and ending the moment that the create has been concluded and logged by the Portal.
* Data for each create is curated and joined between Portal data logs and available ARM deployment data logs.

## Common Use Cases
* Identifying the number of creates completed for a given Extension or for a particular Azure marketplace gallery package.
* Calculating the percentage of successful creates initiated by an Extension's create blade.
* Debugging failed deployments by retrieving error message information logged for failed creates.
* Calculating the number of creates that were abandoned by the user before being initiated and completed.
* Identifying creates initiated by a given user id.
* Calculating the average create duration by data center.

## Underlying Function Resources 
* `cluster("Azportal").database("AzPtlCosmos").CreateFlows`
  * The source of the Azure create lifecycle deployment information.
* `cluster("Armprod").database("ARMProd").Deployments`
  * The source of the ARM deployment information
* `cluster("Armprod").database("ARMProd").HttpIncomingRequests`
  * Used to identify which of the ARM deployments are requests made from the Portal.
* `cluster("Armprod").database("ARMProd").EventServiceEntries`
  * The source of the ARM deployment failed logs error information.

## Parameters
* startDate: The date to mark the inclusive start of the time range.
* endDate: The date to mark the exclusive end of the time range.

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

# <a name="GetCreateFunnel"></a>GetCreateFunnel(startDate: datetime, endDate: datetime)

## Summary
This functions calculates the create funnel KPI's for each extension's create blade for a given time range.

## Common Use Cases
* Retrieving the percentage of successful create initated by an Extension's create blade for a week.
* Retrieving the number of the failed creates.
* Retrieving the drop off rate of customers attempting a create (how often creates are abandoned).

## Underlying Function Resources
* [GetCreateFlows()](#GetCreateFlows)

## Parameters
* startDate: The date to mark the inclusive start of the time range.
* endDate: The date to mark the exclusive end of the time range.

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

# <a name="GetCreateFunnelByDay"></a>GetCreateFunnelByDay(startDate: datetime, endDate: datetime)

## Summary
This functions calculates the create funnel KPI's for each extension's create blade for each day over a given time range.

## Common Use Cases
* Identifying the change in the number of successful create initiated by an Extension's create blade over the course of multiple weeks.
* Identifying which days have higher number of failed deployments.

## Underlying Function Resources
* [GetCreateFlows()](#GetCreateFunnelByDay)

## Parameters
* startDate: The date to mark the inclusive start of the time range.
* endDate: The date to mark the exclusive end of the time range.

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

# <a name="GetCreateFunnelByGalleryPackageId"></a>GetCreateFunnelByGalleryPackageId(startDate: datetime, endDate: datetime)

## Summary
This functions calculates the create funnel KPI's by gallery package id, extension, and create blade over a given time range.

## Common Use Cases
* Identifying the number of successfully creates for a resource.
* Identifying which resources have higher number of failed deployments.

## Underlying Function Resources
* [GetCreateFlows()](#GetCreateFlows)

## Parameters
* startDate: The date to mark the inclusive start of the time range.
* endDate: The date to mark the exclusive end of the time range.

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

# <a name="GetCombinedCreateFunnel"></a>GetCombinedCreateFunnel(startDate: datetime, endDate: datetime)

## Summary
This functions calculates the overall create funnel KPIs for the Portal.

## Common Use Cases
* Identifying the overall success rates of creates in the Portal.
* Identifying the total number of failed creates in the Portal.
* Identifying the total number of create aborted due to commerce errors in the Portal.
* Identifying the overall rate of create flows that lead to a create being started.

## Underlying Function Resources
* [GetCreateFlows()](#GetCreateFlows)

## Parameters
* startDate: The date to mark the inclusive start of the time range.
* endDate: The date to mark the exclusive end of the time range.

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

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

[GetCreateFunnelByResourceName](#GetCreateFunnelByResourceName)

[GetCreateErrors](#GetCreateErrors)

[GetCreateBladeSuccessRates](#GetCreateBladeSuccessRates)

# <a name="GetCreateFlows"></a>GetCreateFlows(startDate: datetime, endDate: datetime)

## Summary
This function returns the list of Ibiza Portal Azure service deployment lifecycles, also known as 'create flows', for a given time range.
* Each create flow represents the lifecycle of a create with the beginning being marked by the moment the create blade is opened and ending the moment that the create has been concluded and logged by the Ibiza Portal.
* Data for each create is curated and joined between Ibiza Portal data logs and available ARM deployment data logs.

## Common Use Cases
* Identifying the number of creates completed for a given Ibiza Extension or for a particular Azure marketplace gallery package.
* Calculating the percentage of successful creates initiated by an Extension's create blade.
* Debugging failed deployments by retrieving error message information logged for failed creates.
* Calculating the number of creates that were abandoned by the user before being initiated and completed.
* Identifying creates initiated by a given user id.
* Calculating the average create duration by data center.

## Underlying Function Resources 
* cluster("Azportal").database("AzPtlCosmos").CreateFlows
  * The source of the Azure Ibiza create lifecycle deployment information.
* cluster("Armprod").database("ARMProd").Deployments
  * The source of the ARM deployment information
* cluster("Armprod").database("ARMProd").HttpIncomingRequests
  * Used to identify which of the ARM deployments are requests made from the Ibiza Portal.
* cluster("Armprod").database("ARMProd").EventServiceEntries
  * The source of the ARM deployment failed logs error information.

## Parameters
* startDate: The date to mark the inclusive start of the time range.
* endDate: The date to mark the exclusive end of the time range.

## Output Columns
* PreciseTimeStamp
  * Time of which the create blade was opened
  * When the create flow launched event is logged by the server
* TelemetryId
  * The unique identifier of this Azure Ibiza Portal create flow.
* ExtensionId
  * The extension which initiated the deployment.
* CreateBladeName
  * The name of the blade which was used to initiated the deployment.
* GalleryPackageId
  * The Azure service market place gallery package that was created.
* ExecutionStatus
  * The final result of the create execution.
  * Possible execution statuses
    * Succeeded
      * The create was successfully completed.
      * If ARMExecutionStatus is "Succeeded" or if ARMExecutionStatus is blank and IbizaExecutionStatus is "Succeeded"
    * Canceled
      * The create was canceled before completion
      * If ARMExecutionStatus is "Canceled" or if ARMExecutionStatus is blank and IbizaExecutionStatus is "Canceled"
    * Failed
      * The create failed to complete.
      * If ARMExecutionStatus is "Failed" or if ARMExecutionStatus is blank and IbizaExecutionStatus is "Failed"
    * BillingError
      * The create failed to completed because of the error, "We could not find a credit card on file for your azure subscription. Please make sure your azure subscription has a credit card."
    * Unknown
      * The status of the create is unable to be determined.
      * If ARMExecutionStatus is blank and IbizaExecutionStatus is blank
    * Abandoned 
      * The create blade was closed before a create was initialized.
* CorrelationId
  * The unique ARM identifier of this deployment.
* ArmExecutionStatus
  * The result of the deployment from ARM.
* ArmStatusCode
  * The ARM status code of the deployment .
* ArmErrorCode
  * The error code of a failed deployment logged by ARM.
* ArmErrorMessage
  * The error message of a failed deployment logged by ARM.
* IbizaExecutionStatus
  * The result of the deployment execution logged by Ibiza.
* IbizaProvisioningStatus
  * The result status from the Ibiza ProvisioningEnded event.
* IbizaCreateDeploymentStatus
  * The result status from the Ibiza CreateDeploymentEnded event
* IbizaErrorCode
  * The error code of a failed deployment logged by Ibiza.
* IbizaErrorMessage
  * The error message of a failed deployment logged by Ibiza.
* CreateFlowLaunched
  * Boolean representing if a CreateFlowLaunched event was logged.
  * Logged when the create blade is opened by the user.
* CreateFlowLaunched_ActionModifier
  * Status of the CreateFlowLaunched event.
* CreateFlowLaunched_TimeStamp
  * Time when the CreateFlowLaunched was logged.
* ProvisioningStarted
  * Boolean representing if a ProvisioningStarted event was logged.
  * Logged when the create is initiated by the user.
* ProvisioningStarted_ActionModifier
  * Status of the ProvisioningStarted event.
* ProvisioningStarted_TimeStamp
  * Time when the ProvisioningStarted event was logged.
* CreateDeploymentStarted
  * Boolean representing if a CreateDeploymentStart event was logged.
  * Logged when the deployment request is acknowledged by ARM.
* CreateDeploymentStarted_ActionModifier
  * Status of the CreateDeploymentStart event.
* CreateDeploymentStarted_TimeStamp
  * The time when the CreateDeploymentStart event was logged.
* CreateDeploymentEnded
  * Boolean representing if a CreateDeploymentEnd event was logged.
  * Logged when ARM has completed status for the create.
* CreateDeploymentEnded_ActionModifier
  * Status of the CreateDeploymentEnd event.
* CreateDeploymentEnded_TimeStamp
  * The time when the CreateDeploymetEnd event was logged.
* ProvisioningEnded
  * Boolean representing if a ProvisioningEnded event was logged.
  * Logged when Ibiza has completed all actions regarding a create.
* ProvisioningEnded_ActionModifier
  * Status of the ProvisioningEnded event.
* ProvisioningEnded_TimeStamp
  * The time when the ProvisioningEnded event was logged.
* ArmStartTime
  * Start time of the deployment through ARM
* ArmEndTime
  * End time of the deployment through ARM.
* ArmDuration
  * Duration of the deployment through ARM.
* IbizaStartTime
  * Start time of the deployment through Ibiza.
* IbizaEndTime
  * End time of the deployment through Ibiza.
* IbizaDuration
  * Duration of the deployment through Ibiza.
* Data
  * The entire collection of logged create events' telemetry data in JSON format.
* BuildNumber
  * The Ibiza SDK and environment in which the deployment was initiated.
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
* OldCreateApi
  * Boolean representing if the deployment was initiated using the latest supported Provisioning API.
* CustomDeployment
  * Boolean representing if the deployment was initiated using the Ibiza ARM Provisioning Manager.

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
  * The extension's id.
* ["Extension Name"] 
  * The extension's friendly name.
* ["Create Blade Name"]
  * The create blade name that the deployments were initiated through.
* ["Create Flow Launched"]
  * The number of times the create blade was opened by users.
* ["Deployment Started"]
  * The number of deployments that were started.
    * Calculated counting the number of rows returned by GetCreateFlows() for the create blade which has the columns ProvisioningStarted set to true or CreateDeploymentStarted set to true.
      * ProvisioningStarted is the initiation point for all deployments, including custom deployments. 
      * CreateDeploymentStarted (ARM deployments only) is the point which ARM has accepted the request for deployment.
      * We check these columns being logged as true because they can only be logged in the event that a deployment was initiated. We check both of these to add redundancy in the event that either of these logs are lost.
        * Custom deployments do not have the protection of the redundancy fallback check as they only log ProvisioningStarted and not CreateDeploymentStarted.
* ["Deployment Started %"]
  * The rate of create flows that resulted in a deployment being started.
    * This is calculated by taking ["Deployment Started"] / ["Create Flow Launched"]
  * It's labeled as percentage but it is technically the rate as it needs to be multiplied by 100 to be the percentage.
* ["Deployment Cancelled"]
  * The number of deployments that were canceled.
    * This is calculated by counting the number of rows from GetCreateFlows() for a create blade in which the column ExecutionStatus was equal to "Canceled". 
  * Cancelled and canceled are both correct spelling but it should be canceled as that is the Microsoft standard.
* ["Deployment Cancelled %"]
  * The rate of started deployments that resulted in a "Canceled" status.
    * Calculated by taking ["Deployment Cancelled"] / ["Deployment Started"]
* ["Deployment Failed Billing Error"]
  * The number of deployments that were rejected due to the error: "We could not find a credit card on file for your azure subscription. Please make sure your azure subscription has a credit card."
  * A deployment that was rejected due to this error will have the ExecutionStatus of "BillingError"
* ["Deployment Failed Billing Error %"]
  * The rate of started deployments that resulted in being rejected due to the error "We could not find a credit card on file for your azure subscription. Please make sure your azure subscription has a credit card."
    * This is calculated by taking ["Deployment Failed Billing Error"] / ["Deployment Started"]
* ["Deployment Succeeded"]
  * The number of successful deployments
    * This is calculated by counting the number of deployments for a create blade that contained that ExecutionStatus of "Succeeded"
* ["Deployment Succeeded %"]
  * The rate of deployments started that resulted in a not failed deployment.
    * Calculated by taking ["Deployment Succeeded"]   / ( ["Deployment Started"] - ["Deployment Cancelled"] - ["Deployment Failed Billing Error"] )
* ["Deployment Unknown"]
  * The number of deployments which status could not be determined
* ["Deployment Unknown %"]
  * The rate of deployments started which the status of could not be determined.
    * Calculated by taking ["Deployment Unknown"]   /  ["Deployment Started"]
* ["Old Create API"]
  * Represents if the create blade deployments were initiated using a deprecated version of the ARM provisioning API provided by the Ibiza SDK
* ["Custom Deployment"]
  * Represents if the create blade deployments were initiated without using the official ARM provisioning API provided by the Ibiza SDK

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
* CreateFlowLaunched
  * The number of create flows launched.
* DeploymentStarted
  * The number creates that were initiated.
* CustomDeploymentCancelled
  * The number of custom deployments that were cancelled.
* CustomDeploymentSucceeded
  * The number of custom deployments that succeeded.
* ARMDeploymentSucceeded
  * The number of ARM deployments that succeeded.
* ARMDeploymentsCancelled
  * The number of ARM deployments that were canceled.
* ARMDeploymentFailedBillingError
  * The number of ARM deployments that were rejected due to the error, "We could not find a credit card on file for your azure subscription. Please make sure your azure subscription has a credit card."
* Unsupported
  * Represents if the create blade deployments were initiated using a deprecated version of the ARM provisioning API provided by the Ibiza SDK
* CustomDeployment
  * Represents if the create blade deployments were initiated without using the official ARM provisioning API provided by the Ibiza SDK
* Date
  * The date at midnight representing the day which the numbers are calculated for.
* ResourceName
  * The name of the gallery package id which was being created.
* ExtensionId
  * The extension which initiated the resource creation.
* CreateBladeName
  * The name of the create blade which the create was initiated from.
* DeploymentSucceeded
  * The number of successful deployments.
    * Equal to CustomDeploymentSucceeded if CustomDeployment is true or ARMDeploymentSucceeded if CustomDeployments is false.
* DeploymentCancelled
  * The number of cancelled deployments.
    * Equal to CustomDeploymentCancelled if CustomDeployment is true or ARMDeploymentsCancelled if CustomDeployments is false.
* DeploymentFailedBillingError
  * The number of rejected deployments due to a billing error.
    * Equal to 0 if CustomDeployment is true or ARMDeploymentFailedBillingError if CustomDeployments is false.
* DeploymentStartedWithExclusions
  * Equal to DeploymentStarted - DeploymentCancelled - DeploymentFailedBillingError

# <a name="GetCreateFunnelByResourceName"></a>GetCreateFunnelByResourceName(startDate: datetime, endDate: datetime)

## Summary
This functions calculates the create funnel KPI's for each gallery package id (resource) over a given time range.

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
  * The extension's id.
* ["Extension Name"] 
  * The extension's friendly name.
* ["Create Blade Name"]
  * The create blade name that the deployments were initiated through.
* ["Create Flow Launched"]
  * The number of times the create blade was opened by users.
* ["Deployment Started"]
  * The number of deployments that were started.
    * Calculated counting the number of rows returned by GetCreateFlows() for the create blade which has the columns ProvisioningStarted set to true or CreateDeploymentStarted set to true.
      * ProvisioningStarted is the initiation point for all deployments, including custom deployments. 
      * CreateDeploymentStarted (ARM deployments only) is the point which ARM has accepted the request for deployment.
      * We check these columns being logged as true because they can only be logged in the event that a deployment was initiated. We check both of these to add redundancy in the event that either of these logs are lost.
        * Custom deployments do not have the protection of the redundancy fallback check as they only log ProvisioningStarted and not CreateDeploymentStarted.
* ["Deployment Started %"]
  * The rate of create flows that resulted in a deployment being started.
    * This is calculated by taking ["Deployment Started"] / ["Create Flow Launched"]
  * It's labeled as percentage but it is technically the rate as it needs to be multiplied by 100 to be the percentage.
* ["Deployment Cancelled"]
  * The number of deployments that were canceled.
    * This is calculated by counting the number of rows from GetCreateFlows() for a create blade in which the column ExecutionStatus was equal to "Canceled". 
  * Cancelled and canceled are both correct spelling but it should be canceled as that is the Microsoft standard.
* ["Deployment Cancelled %"]
  * The rate of started deployments that resulted in a "Canceled" status.
    * Calculated by taking ["Deployment Cancelled"] / ["Deployment Started"]
* ["Deployment Failed Billing Error"]
  * The number of deployments that were rejected due to the error: "We could not find a credit card on file for your azure subscription. Please make sure your azure subscription has a credit card."
  * A deployment that was rejected due to this error will have the ExecutionStatus of "BillingError"
* ["Deployment Failed Billing Error %"]
  * The rate of started deployments that resulted in being rejected due to the error "We could not find a credit card on file for your azure subscription. Please make sure your azure subscription has a credit card."
    * This is calculated by taking ["Deployment Failed Billing Error"] / ["Deployment Started"]
* ["Deployment Succeeded"]
  * The number of successful deployments
    * This is calculated by counting the number of deployments for a create blade that contained that ExecutionStatus of "Succeeded"
* ["Deployment Succeeded %"]
  * The rate of deployments started that resulted in a not failed deployment.
    * Calculated by taking ["Deployment Succeeded"]   / ( ["Deployment Started"] - ["Deployment Cancelled"] - ["Deployment Failed Billing Error"] )
* ["Old Create API"]
  * Represents if the create blade deployments were initiated using a deprecated version of the ARM provisioning API provided by the Ibiza SDK
* ["Custom Deployment"]
  * Represents if the create blade deployments were initiated without using the official ARM provisioning API provided by the Ibiza SDK

# <a name="GetCreateErrors"></a>GetCreateErrors(startDate: datetime, endDate: datetime)

## Summary
This function returns the create flows that resulted in Failed status for a given time range.

## Common Use Cases
* Retrieving the failed creates initiated by an extension's create blade.
* Debugging failed creates by looking into their error logs.

## Underlying Function Resources
* [GetCreateFlows()](#GetCreateFlows)

## Parameters
* startDate: The date to mark the inclusive start of the time range.
* endDate: The date to mark the exclusive end of the time range.

## Output Columns
*See [GetCreateFlows()](#GetCreateFlows)*

# <a name="GetCreateBladeSuccessRates"></a>GetCreateBladeSuccessRates(startDate: datetime, endDate: datetime)

## Summary
This function returns the create flows rates of successful create results for all extensions' create blades for a given time range.

## Common Use Cases
* A simple way to retrieve the create success rate for a particular extension or create blade.

## Underlying Function Resources
* [GetCreateFunnel()](#GetCreateFunnel)

## Parameters
* startDate: The date to mark the inclusive start of the time range.
* endDate: The date to mark the exclusive end of the time range.

## Output Columns
* Extension
  * The extension id which initiated the create.
* ["Create Blade Name"]
  * The name of the create blade used for the create.
* ["Success Rate %"]
  * The rate of succeeded creates compared to the number of started creates.
* ["Old Create API"]
  * Represents if the create blade deployments were initiated using a deprecated version of the ARM provisioning API provided by the Ibiza SDK.
* ["Custom Deployment"]
  * Represents if the create blade deployments were initiated without using the official ARM provisioning API provided by the Ibiza SDK.

<a name="ibiza-create-flow-powerbi-dashboard"></a>
# Ibiza Create Flow PowerBi dashboard

The **Ibiza Create Flow PowerBi dashboard** gives you live access to your extension's create flow telemetry.

To view the Ibiza Create Flow PowerBi dashboard follow this link: [Ibiza Create Flow PowerBi dashboard](https://msit.powerbi.com/groups/me/dashboards/73368590-6a29-4a85-b534-69791580be4a)

<a name="ibiza-create-flow-powerbi-dashboard-prerequisites"></a>
## Prerequisites

<a name="ibiza-create-flow-powerbi-dashboard-prerequisites-getting-access-to-the-ibiza-create-flow-dashboard"></a>
#### Getting access to the Ibiza Create Flow Dashboard

In order to get acess to the Create Flow Dashbaord, you will need to get access to the [Security Group 'Azure Portal Data' (auxdatapartners)](https://idwebelements/GroupManagement.aspx?Group=auxdatapartners&Operation=join).

<a name="ibiza-create-flow-powerbi-dashboard-prerequisites-optional-running-or-creating-modified-kusto-queries"></a>
#### Optional: Running or Creating Modified Kusto Queries

If you want to run or create modified versions of the Kusto queries provided below in the code samples then you will need access to our *Kusto data tables*. How to get setup using Kusto and getting access is explained here: [PortalFx Telemetry - Getting Started](https://auxdocs.azurewebsites.net/en-us/documentation/articles/portalfx-telemetry-getting-started)

All queries performed here are against the **AzurePortal.AzPtlCosmos** database and we will assume you understand the ClientTelemetry table. To get up to speed on the ClientTelemtry table in the AzPtlComos database check out: [PortalFx Telemetry - Kusto Databases](https://auxdocs.azurewebsites.net/en-us/documentation/articles/portalfx-telemetry-getting-started)

<a name="ibiza-create-flow-powerbi-dashboard-create-flow-funnel"></a>
## Create Flow Funnel

<a name="ibiza-create-flow-powerbi-dashboard-create-flow-funnel-overview"></a>
### Overview

This report gives you ability to look at your extensions live create flow telemetry which gives you a overview of your create blade's usage and deployment success numbers.

<a name="ibiza-create-flow-powerbi-dashboard-create-flow-funnel-description-of-data-fields"></a>
### Description of data fields

- **Create Flow Launched** - The number of times your create blade has been opened by users.
- **Deployment Started** - The number of times that a create has been started by your create blade.
- **Deployment Started %** - A percentage representing how often your create blade being opened leads to a create being started.
- **Deployment Succeeded** - The number of successful create deployements.
- **Deployment Succeeded %** - The percentage of creates that led to a successful deployment. Unsunsuccessful deployments would include cancellations and failures.
- **Old Create API**
    - If true, this means that your create blade is using the old deprecated Parameter Collector (Parameter Collector V1 or V2) and therefore your create telemetry is not dependable and is potentially innacurrate.
    - It is recommended to get this field to 'false', by updating your create blade to use the new Parameter Collector (Parameter Collector V3).
        - [Parameter Collector V3 - Getting Started](portalfx-parameter-collection-getting-started.md)
- **Custom Deployment**
    - If true, this means that your create does not go through the official Arm Provisioner and therefore you only receive limited telemetry reporting.
    - If your experience's create deployments go through Arm but you are not using the Arm Provisioning then please refer to the Create Engine documentation
        - [Create Engine](portalfx-create-engine-sample.md)

<a name="ibiza-create-flow-powerbi-dashboard-create-flow-funnel-how-these-numbers-are-generated"></a>
### How these numbers are generated

<a name="ibiza-create-flow-powerbi-dashboard-create-flow-funnel-how-these-numbers-are-generated-create-flow-funnel-kusto-query"></a>
#### Create Flow Funnel - Kusto Query

```js
let timeSpan = 30d;
let startDate = GetStartDateForLastNDays(timeSpan);
let endDate = GetEndDateForTimeSpanQueries();
GetCreateFunnel(startDate, endDate)
```

<a name="ibiza-create-flow-powerbi-dashboard-create-flow-funnel-how-these-numbers-are-generated-create-flow-funnel-by-resource-name-kusto-query"></a>
#### Create Flow Funnel By Resource Name - Kusto Query

```js
let timeSpan = 30d;
let startDate = GetStartDateForLastNDays(timeSpan);
let endDate = GetEndDateForTimeSpanQueries();
GetCreateFunnelByResourceName(startDate, endDate)
```

<a name="ibiza-create-flow-powerbi-dashboard-create-flow-funnel-how-these-numbers-are-generated-create-flow-funnel-success-rate-kusto-query"></a>
#### Create Flow Funnel Success Rate - Kusto Query

```js
let timeSpan = 30d;
let startDate = GetStartDateForLastNDays(timeSpan);
let endDate = GetEndDateForTimeSpanQueries();
GetCreateFunnelByDay(startDate, endDate)
| extend DeploymentSucceededPerc = iff(DeploymentStarted == 0, 0.0, todouble(DeploymentSucceeded)/DeploymentStarted)
| project Date, ExtensionName, CreateBladeName, DeploymentSucceededPerc
```

<a name="ibiza-create-flow-powerbi-dashboard-create-flow-funnel-how-these-numbers-are-generated-create-flow-funnel-weekly-deployment-success-kusto-query"></a>
#### Create Flow Funnel Weekly Deployment Success - Kusto Query

```js
let today = floor(now(),1d);
let fri= today - dayofweek(today) - 2d;
let sat = fri - 6d;
let startDate = sat-35d;
let endDate = fri;
GetCreateFunnelByDay(startDate, endDate)
| where Unsupported == 0 and CustomDeployment == 0
| extend startOfWeek = iff(dayofweek(Date) == 6d,Date , Date - dayofweek(Date) - 1d)
| summarize sum(CreateFlowLaunched), sum(DeploymentStartedWithExclusions), sum(DeploymentSucceeded) by startOfWeek, ExtensionName
| extend ["Deployment Success %"] = iff(sum_DeploymentStartedWithExclusions == 0, todouble(0), bin(todouble(sum_DeploymentSucceeded)/sum_DeploymentStartedWithExclusions*100 + 0.05, 0.1))
| project startOfWeek, ["Extension"] = ExtensionName, ["Deployment Success %"]
```

<a name="ibiza-create-flow-powerbi-dashboard-create-flow-origins"></a>
## Create Flow Origins

<a name="ibiza-create-flow-powerbi-dashboard-create-flow-origins-overview-1"></a>
### Overview

This report gives you an overview of where your create blade is being linked to and launched from.

<a name="ibiza-create-flow-powerbi-dashboard-create-flow-origins-description-of-data-fields-1"></a>
### Description of data fields

- **Create Flow Launched** - The number of times your create blade has been opened by users.
- **New (%)** - The percentage representing how often your create blade is opened from +New.
- **Browse (%)** - The percentage representing how often your create blade is opened from Browse.
- **Marketplace (%)** - The percentage representing how often your create blade is opened from the Marketplace.
- **DeepLink (%)** - The percentage representing how often your create blade is opened from a internal or external link.

<a name="ibiza-create-flow-powerbi-dashboard-create-flow-origins-how-these-numbers-are-generated-1"></a>
### How these numbers are generated

<a name="ibiza-create-flow-powerbi-dashboard-create-flow-origins-how-these-numbers-are-generated-1-create-flow-origins-kusto-query"></a>
#### Create Flow Origins - Kusto Query

```js
let timeSpan = 30d;
let selectedData =
GetClientTelemetryByTimeSpan(timeSpan, false)
| union (GetExtTelemetryByTimeSpan(timeSpan, false));

selectedData
| where Action == "CreateFlowLaunched"
| extend
    CreateBladeName = _GetCreateBladeNameFromData(Data, ActionModifier),
    ExtensionId = _GetCreateExtensionNameFromData(Data, ActionModifier),
    OriginFromMenuItemId = extractjson("$.menuItemId", Data, typeof(string)),
    DataContext = extractjson("$.context", Data, typeof(string))
| extend OriginFromDataContext = extract('([^,"]*Blade[^,"]*)', 1, DataContext)
| project CreateBladeName, ExtensionId, Origin = iff(OriginFromMenuItemId == "recentItems" or OriginFromMenuItemId == "deepLinking", OriginFromMenuItemId, OriginFromDataContext), DataContext
| extend Origin = iff(Origin == "", DataContext, Origin)
| summarize CreateFlowLaunched = count() by ExtensionId, CreateBladeName, Origin
| summarize
    CreateFlowLaunched = sum(CreateFlowLaunched),
    New = sum(iff(Origin contains "recentItems" or Origin contains "GalleryCreateMenuResultsListBlade", CreateFlowLaunched, 0)),
    Browse = sum(iff(Origin contains "BrowseResourceBlade", CreateFlowLaunched, 0)),
    Marketplace = sum(iff(Origin contains "GalleryItemDetailsBlade" or Origin contains "GalleryResultsListBlade" or Origin contains "GalleryHeroBanner", CreateFlowLaunched, 0)),
    DeepLink = sum(iff(Origin contains "deepLinking", CreateFlowLaunched, 0))
  by ExtensionId, CreateBladeName
| join kind = inner (ExtensionLookup | extend ExtensionId = Extension) on ExtensionId
| project
    ["Extension Name"] = ExtensionName,
    ["Create Blade Name"] = CreateBladeName,
    ["Create Flow Launched"] = CreateFlowLaunched,
    ["+New"] = New,
    ["+New (%)"] = todouble(New) / CreateFlowLaunched,
    ["Browse"] = Browse,
    ["Browse (%)"] = todouble(Browse) / CreateFlowLaunched,
    ["Marketplace"] = Marketplace,
    ["Marketplace (%)"] = todouble(Marketplace) / CreateFlowLaunched,
    ["DeepLink"] = DeepLink,
    ["DeepLink (%)"] = todouble(DeepLink) / CreateFlowLaunched
```

<a name="ibiza-create-flow-powerbi-dashboard-create-flow-errors"></a>
## Create Flow Errors

<a name="ibiza-create-flow-powerbi-dashboard-create-flow-errors-overview-2"></a>
### Overview

This report gives you an overview of create blades create errors, billing issues, and cancellations.

<a name="ibiza-create-flow-powerbi-dashboard-create-flow-errors-description-of-data-field"></a>
### Description of data field

- **Deployment Cancelled Count** - The number of cancalled deployments
- **Billing Error Count** - The number of deployments that resulted in the biling error "no credit card on file".
- **Total Errors Count** - The total number of deployments that resulted in an failure/error
- **Deployment Failed %** - The percentage of deployments that resulted in a failure/error
- **Error Submitting Deployment Request %** - The percentage of failed deployments that was because of the error "Error Submitting Deployment Request"
- **Error Provisiong Resource Group %** - The percentage of failed deployments that was because of the error "Error Provisiong Resource Group".
- **Error Registering Resource Providers %** - The percentage of failed deployments that was because of the error "Error Registering Resource Providers".
- **Unknown Failure %** - The percentage of failed deployments that was because of the error "Unknown Failure".
- **Deployment Request Failed %** - The percentage of failed deployments that was because of the error "Deployment Request Failed".
- **Error Getting Deployment Status %** - The percentage of failed deployments that was because of the error "Error Getting Deployment Status".
- **Deployment Status Unknown %** - The percentage of failed deployments that was because of the error "Deployment Status Unknown".
- **Invalid Args %** - The percentage of failed deployments that was because of the error "Invalid Args".
- **Old Create API**
    - If true, this means that your create blade is using the old deprecated Parameter Collector (Parameter Collector V1 or V2) and therefore your create telemetry is not dependable and is potentially innacurrate.
    - It is recommended to get this field to 'false', by updating your create blade to use the new Parameter Collector (Parameter Collector V3).
        - [Parameter Collector V3 - Getting Started](portalfx-parameter-collection-getting-started.md)
- **Custom Deployment**
    - If true, this means that your create does not go through the official Arm Provisioner and therefore you only receive limited telemetry reporting.
    - If your experience's create deployments go through Arm but you are not using the Arm Provisioning then please refer to the Create Engine documentation
        - [Create Engine](portalfx-create-engine-sample.md)

<a name="ibiza-create-flow-powerbi-dashboard-create-flow-errors-how-these-numbers-are-generated-2"></a>
### How these numbers are generated

<a name="ibiza-create-flow-powerbi-dashboard-create-flow-errors-how-these-numbers-are-generated-2-create-flow-errors-kusto-query"></a>
#### Create Flow Errors - Kusto Query

```js
let timeSpan = 30d;
let startDate = GetStartDateForLastNDays(timeSpan);
let endDate = GetEndDateForTimeSpanQueries();

let errors =
(GetClientTelemetryByDateRange(startDate, endDate, false)
| union (GetExtTelemetryByDateRange(startDate, endDate, false))
| where Action == "ProvisioningEnded" and ActionModifier == "Failed" and isnotempty(Name))
| union (_GetArmCreateEvents(startDate, endDate) | where ExecutionStatus in ("Failed", "Cancelled", "BillingError") and isnotempty(Name))
| extend
    Date = bin(PreciseTimeStamp, 1d)
    | join kind = leftouter (
        _GetCreateBladesMapping(startDate, endDate)
        | project Date, Name,
            ExtensionIdCurrent = ExtensionId,
            CreateBladeNameCurrent = CreateBladeName,
            UnsupportedCurrent = Unsupported,
            CustomDeploymentCurrent = CustomDeployment
      ) on Date, Name
    // Join again on previous day's mappings to cover case when mapping is not found in current day
    | join kind = leftouter (
        _GetCreateBladesMapping(startDate - 1d, endDate - 1d)
        | project Date, Name,
            ExtensionIdPrev = ExtensionId,
            CreateBladeNamePrev = CreateBladeName,
            UnsupportedPrev = Unsupported,
            CustomDeploymentPrev = CustomDeployment
        | extend Date = Date + 1d
      ) on Date, Name
    // Use current day's mapping if available, otherwise, use previous day
    | extend
        ExtensionId = iff(isnotempty(ExtensionIdCurrent), ExtensionIdCurrent, ExtensionIdPrev),
        CreateBladeName = iff(isnotempty(ExtensionIdCurrent), CreateBladeNameCurrent, CreateBladeNamePrev),
        Unsupported = iff(isnotempty(ExtensionIdCurrent), UnsupportedCurrent, UnsupportedPrev),
        CustomDeployment = iff(isnotempty(ExtensionIdCurrent), CustomDeploymentCurrent, CustomDeploymentPrev)
| where isnotempty(ExtensionId) and isnotempty(CreateBladeName)
| extend ExecutionStatus = iff(Action == "ProvisioningEnded", extractjson("$.provisioningStatus", Data, typeof(string)), ExecutionStatus);

errors
| summarize
    CustomDeploymentErrorsCount = count(Action == "ProvisioningEnded" and ActionModifier == "Failed"),
    // We exclude ProvisioningEnded events with ExecutionStatus in ("DeploymentFailed", "DeploymentCanceled") from ARMDeploymentErrorsCount as in this case, we get the number of deployments that failed or were cancelled from ARM.
    ARMDeploymentErrorsCount = count((Action startswith "CreateDeployment") or (Action == "ProvisioningEnded" and ExecutionStatus !in ("DeploymentFailed", "DeploymentCanceled")))
  by ExtensionId, CreateBladeName, Unsupported, CustomDeployment
| join kind = inner (
    errors
    | summarize
        ARMFailed = count(Action startswith "CreateDeployment" and ExecutionStatus == "Failed"),
        ARMCancelled = count(Action startswith "CreateDeployment" and ExecutionStatus == "Cancelled"),
        ARMBillingError = count(Action startswith "CreateDeployment" and ExecutionStatus == "BillingError"),
        Failed = count(Action == "ProvisioningEnded" and ExecutionStatus == "DeploymentFailed"),
        Cancelled = count(Action == "ProvisioningEnded" and ExecutionStatus == "DeploymentCanceled"),
        ErrorSubmitting = count(Action == "ProvisioningEnded" and ExecutionStatus == "ErrorSubmittingDeploymentRequest"),
        ErrorProvisioning = count(Action == "ProvisioningEnded" and ExecutionStatus == "ErrorProvisioningResourceGroup"),
        ErrorRegistering = count(Action == "ProvisioningEnded" and ExecutionStatus == "ErrorRegisteringResourceProviders"),
        ErrorGettingStatus = count(Action == "ProvisioningEnded" and ExecutionStatus == "ErrorGettingDeploymentStatus"),
        InvalidArgs = count(Action == "ProvisioningEnded" and ExecutionStatus == "InvalidArgs"),
        UnknownFailure = count(Action == "ProvisioningEnded" and ExecutionStatus == "UnknownFailure"),
        RequestFailed = count(Action == "ProvisioningEnded" and ExecutionStatus == "DeploymentRequestFailed"),
        StatusUnknown = count(Action == "ProvisioningEnded" and ExecutionStatus == "DeploymentStatusUnknown")
      by ExtensionId, CreateBladeName, Unsupported, CustomDeployment)
  on ExtensionId, CreateBladeName, Unsupported, CustomDeployment
| extend Failed = iff(CustomDeployment, Failed, ARMFailed)
| extend Cancelled = iff(CustomDeployment, Cancelled, ARMCancelled)
| extend BillingError = iff(CustomDeployment, 0, ARMBillingError)
| extend TotalCount = iff(CustomDeployment, CustomDeploymentErrorsCount, ARMDeploymentErrorsCount) - Cancelled - BillingError
| extend TotalCountDbl = todouble(TotalCount)
| join kind = leftouter (ExtensionLookup | extend ExtensionId = Extension) on ExtensionId
| project
    ["Extension Name"] = ExtensionName,
    ["Create Blade Name"] = CreateBladeName,
    ["Deployment Cancelled Count"] = Cancelled,
    ["Billing Error Count"] = BillingError,
    ["Total Errors Count"] = TotalCount,
    ["Deployment Failed %"] = iff(TotalCountDbl == 0.0, 0.0, Failed / TotalCountDbl),
    ["Error Submitting Deployment Request %"] = iff(TotalCountDbl == 0.0, 0.0, ErrorSubmitting / TotalCountDbl),
    ["Error Provisioning Resource Group %"] = iff(TotalCountDbl == 0.0, 0.0, ErrorProvisioning / TotalCountDbl),
    ["Error Registering Resource Providers %"] = iff(TotalCountDbl == 0.0, 0.0, ErrorRegistering / TotalCountDbl),
    ["Error Getting Deployment Status %"] = iff(TotalCountDbl == 0.0, 0.0, ErrorGettingStatus / TotalCountDbl),
    ["Invalid Args %"] = iff(TotalCountDbl == 0.0, 0.0, InvalidArgs / TotalCountDbl),
    ["Unknown Failure %"] = iff(TotalCountDbl == 0.0, 0.0, UnknownFailure / TotalCountDbl),
    ["Deployment Request Failed %"] = iff(TotalCountDbl == 0.0, 0.0, RequestFailed / TotalCountDbl),
    ["Deployment Status Unknown %"] = iff(TotalCountDbl == 0.0, 0.0, StatusUnknown / TotalCountDbl),
    ["Old Create API"] = Unsupported,
    ["Custom Deployment"] = CustomDeployment
```

<a name="ibiza-create-flow-powerbi-dashboard-error-distribution"></a>
## Error Distribution

<a name="ibiza-create-flow-powerbi-dashboard-error-distribution-overview-3"></a>
### Overview

This report gives an overview of the errors that have occured over the last week and including how they have changed since the week before, aka WoW (Week or Week).

<a name="ibiza-create-flow-powerbi-dashboard-error-distribution-description-of-reports"></a>
### Description of reports

- Error Distribution - The high level error that occured for all deployments in the last week.
- Error Distribution By Extension - The number of create deployment error that occured by each extension over the last week.
- Inner Error Distribution - Looking at the 'inner most error' inside of the error messages that is recorded for a create deployment failure. Error messages often become nested as they they reach different points of provisioning and have different stages record the failure reason. The 'inner most error' in theory should be the original reason why a create deployment failed.

<a name="ibiza-create-flow-powerbi-dashboard-error-distribution-how-these-numbers-are-generated-3"></a>
### How these numbers are generated

<a name="ibiza-create-flow-powerbi-dashboard-error-distribution-how-these-numbers-are-generated-3-create-error-distribution-kusto-query"></a>
#### Create Error Distribution - Kusto Query

```js
let today = floor(now(),1d);
let sat = today - dayofweek(today) - 8d;
let fri =  sat + 6d;
ClientTelemetry
| where PreciseTimeStamp >= sat and PreciseTimeStamp < fri + 1d
| where Action == "ProvisioningEnded" and ActionModifier == "Failed"
| extend provisioningStatus = extractjson("$.provisioningStatus", Data, typeof(string)),
  isCustomProvisioning = extractjson("$.isCustomProvisioning", Data, typeof(string)),
  oldCreateApi = extractjson("$.oldCreateApi", Data, typeof(string)),
  launchingContext = extract('"launchingContext"\\s?:\\s?{([^}]+)', 1, Data)
| where isnotempty(launchingContext) and isempty(extract("^(\"telemetryId\":\"[^\"]*\")$", 1, launchingContext)) and oldCreateApi != "true" and isCustomProvisioning != "true" and provisioningStatus != "DeploymentCanceled"
| where Data !contains "We could not find a credit card on file for your azure subscription."
| summarize ["Error Count"] = count() by ["Error"] = provisioningStatus
| order by ["Error Count"] desc
```

<a name="ibiza-create-flow-powerbi-dashboard-error-distribution-how-these-numbers-are-generated-3-create-error-distribution-by-extension-kusto-query"></a>
#### Create Error Distribution By Extension - Kusto Query

```js
let today = floor(now(),1d);
let sat = today - dayofweek(today) - 8d;
let fri =  sat + 6d;
ClientTelemetry
| where PreciseTimeStamp >= sat and PreciseTimeStamp < fri + 1d
| where Action == "ProvisioningEnded" and ActionModifier == "Failed"
| extend provisioningStatus = extractjson("$.provisioningStatus", Data, typeof(string)),
  isCustomProvisioning = extractjson("$.isCustomProvisioning", Data, typeof(string)),
  oldCreateApi = extractjson("$.oldCreateApi", Data, typeof(string)),
  launchingContext = extract('"launchingContext"\\s?:\\s?{([^}]+)', 1, Data)
| where isnotempty(launchingContext) and isempty(extract("^(\"telemetryId\":\"[^\"]*\")$", 1, launchingContext)) and oldCreateApi != "true" and isCustomProvisioning != "true" and provisioningStatus != "DeploymentCanceled"
| where Data !contains "We could not find a credit card on file for your azure subscription."
| summarize ["Error Count"] = count() by Extension
| order by ["Error Count"] desc
```

<a name="ibiza-create-flow-powerbi-dashboard-error-distribution-how-these-numbers-are-generated-3-create-error-distribution-by-error-code-kusto-query"></a>
#### Create Error Distribution By Error Code - Kusto Query

```js
let today = floor(now(),1d);
let sat = today - dayofweek(today) - 8d;
let fri =  sat + 6d;
ClientTelemetry
| where PreciseTimeStamp >= sat and PreciseTimeStamp < fri + 1d
| where Action == "ProvisioningEnded" and ActionModifier == "Failed"
| extend provisioningStatus = extractjson("$.provisioningStatus", Data, typeof(string)),
  isCustomProvisioning = extractjson("$.isCustomProvisioning", Data, typeof(string)),
  oldCreateApi = extractjson("$.oldCreateApi", Data, typeof(string)),
  eCode = extractjson("$.details.code", Data, typeof(string)),
  launchingContext = extract('"launchingContext"\\s?:\\s?{([^}]+)', 1, Data)
| where isnotempty(launchingContext) and isempty(extract("^(\"telemetryId\":\"[^\"]*\")$", 1, launchingContext)) and oldCreateApi != "true"
| where provisioningStatus != "DeploymentFailed" and provisioningStatus != "DeploymentCanceled" and isCustomProvisioning != "true"
| where Data !contains "We could not find a credit card on file for your azure subscription."
| summarize ["Error Count"] = count() by ["Error Code"] = eCode
| order by ["Error Count"] desc
```

<a name="ibiza-create-flow-powerbi-dashboard-error-distribution-how-these-numbers-are-generated-3-create-inner-most-error-distribution-kusto-query"></a>
#### Create Inner Most Error Distribution - Kusto Query

```js
let today = floor(now(),1d);
let sat = today - dayofweek(today) - 8d;
let fri =  sat + 6d;
ClientTelemetry
| where PreciseTimeStamp >= sat and PreciseTimeStamp < fri+1d
| where Action == "ProvisioningEnded" and ActionModifier == "Failed"
| join kind = inner (ExtensionLookup | project Extension, ExtensionName) on Extension
| where Data !contains "We could not find a credit card on file for your azure subscription."
| extend datajson = parsejson(Data)
| extend provisioningStatus = tostring(datajson.provisioningStatus), isCustomProvisioning = tostring(datajson.isCustomProvisioning), oldCreateApi = tostring(datajson.oldCreateApi), launchingContext = extract('"launchingContext"\\s?:\\s?{([^}]+)', 1, Data)
| where isnotempty(launchingContext) and isempty(extract("^(\"telemetryId\":\"[^\"]*\")$", 1, launchingContext)) and oldCreateApi != "true" and isCustomProvisioning != "true" and provisioningStatus != "DeploymentCanceled"
| extend code1 = tostring(datajson.details.code), statusCode = tostring(datajson.details.deploymentStatusCode), details = datajson.details.properties.error.details[0]
| extend message= tostring(details.message), code2 = tostring(details.code)
| extend messagejson = parsejson(message)
| extend code3 = tostring(messagejson.code), code4 = tostring(messagejson.error.code), code5= tostring(messagejson.error.details[0].code)
| extend errorCode1 = iff(code5 == "", code4, code5)
| extend errorCode2 = iff(errorCode1 == "", code3, errorCode1)
| extend errorCode3 = iff(errorCode2 == "", code2, errorCode2)
| extend errorCode4 = iff(errorCode3 == "", code1, errorCode3)
| extend errorCode5 = iff(errorCode4 == "", statusCode, errorCode4)
| summarize ["ErrorCount"] = count() by ["Extension"] = ExtensionName, errorCode5
| order by ErrorCount desc
```

<a name="next-steps"></a>
# Next Steps:
- [Troubleshooting Create Regressions and ICM alerts](portalfx-create-troubleshooting.md)
- [For General Telemetry](portalfx-telemetry.md)
- [For Kusto Documentation](https://aka.ms/kusto)

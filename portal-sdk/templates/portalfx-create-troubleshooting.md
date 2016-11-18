## Overview

Creates are when a user tries to provision a resource using the portal.  The goal of the Create Flow Regressions alert is to  generate awareness when our create reliability seems to be degrading.  This can happen for a number of reasons, this alert does not attempt to distinguish the reasons why.

The alert fires any time the success rate drops more than 5% below the bar on average over an hour.  MDM will send an alert each time this happens.  The first thing to do is take a look at MDM by selecting the link at the bottom of the ICM, this will show a trend of how long the alert has been active and to what degree.

The numbers are the percentage of regression.  For example, if latest value is 10 it means the success rate has regressed by 10% below the bar.  If it seems to be trending up then this is a much bigger concern than one that spiked then went down.

This bar is set on a blade by blade basis and can be adjusted as needed.

## Types of Create Failures

There are three types of create failures:

1. The create was successfully sent to ARM, but ARM eventually reported Failure rather than Success or Cancel
    - Billing errors such as no credit card are considered canceled creates rather than failures
2. The create request was not accepted by ARM for any reason
3. This is a custom create where the *ProvisioningEnded* is either missing or reports an error

## Debugging Alerts

Follow the below documentation to understand and debug your create regressions that caused the alert.

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

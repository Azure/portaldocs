* [Overview](#overview)
* [What alerting is available?](#what-alerting-is-available)
* [What configurability is available](#what-configurability-is-available)
* [Onboarding and FAQ](#onboarding-and-faq)
* [Availability](#availability)
    * [Opted in](#availability-opted-in)
    * [Two types of availability alerts](#availability-two-types-of-availability-alerts)
    * [Is availability alert configurable?](#availability-is-availability-alert-configurable)
    * [How often do they run?](#availability-how-often-do-they-run)
    * [What are the alerts triggering criteria?](#availability-what-are-the-alerts-triggering-criteria)
* [Client Error](#client-error)
    * [Configuration](#client-error-configuration)
    * [How often client error alerts run?](#client-error-how-often-client-error-alerts-run)
* [Create prevalidation and regression](#create-prevalidation-and-regression)
    * [Configuration](#create-prevalidation-and-regression-configuration-1)
    * [How often do create alerts run?](#create-prevalidation-and-regression-how-often-do-create-alerts-run)
* [Performance](#performance)
    * [Configuration](#performance-configuration-2)
    * [How often do they run?](#performance-how-often-do-they-run-1)
* [How do I onboard?](#how-do-i-onboard)
* [Time zone based alerting](#time-zone-based-alerting)
* [Overwrite default TSG with extenions' TSG](#overwrite-default-tsg-with-extenions-tsg)
* [Route alerts to another team in IcM](#route-alerts-to-another-team-in-icm)
    * [Step 1](#route-alerts-to-another-team-in-icm-step-1)
    * [Step 2](#route-alerts-to-another-team-in-icm-step-2)
    * [Step 3](#route-alerts-to-another-team-in-icm-step-3)
* [FAQ](#faq)
    * [Q: How do I know my extension's current configuration?](#faq-q-how-do-i-know-my-extension-s-current-configuration)
    * [Q: What happens if I need to update my configuration?](#faq-q-what-happens-if-i-need-to-update-my-configuration)
    * [Q: How is mapping done from extension name to IcM team and service names?](#faq-q-how-is-mapping-done-from-extension-name-to-icm-team-and-service-names)


<a name="overview"></a>
## Overview

The framework provides an out of the box alerting infrastructure. Some of these alerts you will be automatically onboarded to and others you will have to onboard manually.
They offer a great way to constantly assess your product and ensure you are within SLAs and not regressing within real time.
Each alert type has either configurable or fixed alerting criteria which is assessed on varying windows of time and then based on the results the alert will be triggered or not.
Once an alert is triggered it will automatically open an IcM on the owning team.

<a name="what-alerting-is-available"></a>
## What alerting is available?

There are number of framework provided alerts:

1. Extension SDK age
    - Sev3 IcM incident for an extension when its SDK is older than 60 days
    - Sev2 for over 90 days

    Note: You can set the time of the day at which you want to trigger an SDK age alert. Learn more about time zone based alerting [here](#time-zone-based-alerting).
1. Telemetry Throttled
    - Sev4 IcM incident for an extension when its ExtTelemetry logs reach above 500 events every 60 seconds per user per browser tab. We stop logging ExtTelemetry events until the next 60 seconds start.
1. Availability
1. Client Error
1. Create Prevalidation and Regression
1. Performance

Some of these alert types are configurable per extension. The following alerts types currently support extension configuration:

1. [Availability](#Availability)
1. [Client Error](#client-error)
1. [Create prevalidation and regression](#create-prevalidation-and-regression)
1. [Performance](#performance)

To onboard to the configurable alerts please see the relevant sub section below.

Similarly, to the non-configurable alerts, once the thresholds for any of the configured alerts are met or surpassed a ICM alert containing details will be opened against the owning team.

<a name="what-configurability-is-available"></a>
## What configurability is available
Besides configuration for various alert types extension partners can configure when they'd like to receive an alert (for SDK age alert), who they'd like to assign an alert to and overwrite the default TSG links in IcM with TSG links owned and provided by extensions.
1. [Time zone based alerting](#time-zone-based-alerting)
1. [TSG overwrite](#Overwrite-default-TSG-with-extenions-TSG)
1. [Route alerts to another team](#Route-alerts-to-another-team-in-IcM)

<a name="onboarding-and-faq"></a>
## Onboarding and FAQ
1. [How do I onboard?](#How-do-I-onboard)
2. [FAQ](#FAQ)

<a name="availability"></a>
## Availability

The alerts have extension, blade and part load availability on different environments including sovereign and air-gapped clouds.

<a name="availability-opted-in"></a>
### Opted in

Every extension in Azure Portal is opted in automatically by default. No action is needed from extension partner.

<a name="availability-two-types-of-availability-alerts"></a>
### Two types of availability alerts
1. User Failed At Least Once (FALO): when users have at least one load failure.
2. User Failed Always (FA): when users do not have any successfully loads after they try to load at least once.

<a name="availability-is-availability-alert-configurable"></a>
### Is availability alert configurable?
Percentage based availability alert is not configurable. The same set of [alerts triggering criteria](#What-are-the-alerts-triggering-criteria) are used for extension, blade and part respectively.

<a name="availability-how-often-do-they-run"></a>
### How often do they run?

Currently extension, blade and part availability alert run 5, 10 and 15 minutes respectively assessing the previous 1, 2, 4, 8, 12 and 24 hours of data.

<a name="availability-what-are-the-alerts-triggering-criteria"></a>
### What are the alerts triggering criteria?

Below two tables show different criteria for different alert types and different severities that appliy for any extension, blade and part load in Azure Portal.

<a name="availability-what-are-the-alerts-triggering-criteria-sev3"></a>
#### Sev3:
| Alert Type | Cloud | Min Total User Count | Min Affected User Percentage |
| ----- | ----- | ----- | ----- |
| Failed At Least Once | All Clouds* | 10 | 7% |
| Failed Always | All Clouds* | 10 | 5% |

<a name="availability-what-are-the-alerts-triggering-criteria-sev2"></a>
#### Sev2:
<table>
    <thead>
        <tr>
            <th>Alert Type</th>
            <th>Cloud</th>
            <th>Min Total User Count</th>
            <th>Min Affected User Percentage</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td rowspan=2>Failed At Least Once</td>
            <td>Public</td>
            <td>50</td>
            <td rowspan=2>50%</td>
        </tr>
        <tr>
            <td>Non-Public Clouds**</td>
            <td>25</td>
        </tr>
        <tr>
            <td rowspan=2>Failed Always</td>
            <td>Public</td>
            <td>50</td>
            <td rowspan=2>25%</td>
        </tr>
        <tr>
            <td>Non-Public Clouds**</td>
            <td>25</td>
        </tr>
    </tbody>
</table>

> *All Clouds are Public, Fairfax, Mooncake, BlackForest and air-gapped clouds.

> **Non-public clouds are Fairfax, Mooncake, BlackForest and air-gapped clouds.

For any given monitor window (1, 2, 4, 8, 12 and 24 hours) the following three conditions must be met to fire an alert.
1. total user count >= Min Total User Count
2. affected user percentage >= Min Affected User Percentage
3. affected user count >= 3 for 1, 2, 4, 8, 12-hour period and >=4 for 24-hour period

> When alert firing conditions are true for both User Failed At Least Once and User Failed Always, only User Failed Always will be fired.

> When alert firing conditions are true for different monitor windows, only alert on the smallest window will be fired. For example, alerting firing conditions are true for 1-hour lookback window and 2-hour lookback window, alert will fire only on 1-hour lookback window.

<a name="client-error"></a>
## Client Error

There are two high level types of client error alerts, error percentage and error message on different environments including national clouds.

1. Error percentage alerts fire when the percentage of users experiencing any error(s) is above the defined threshold.
2. Error message alerts fire on specified error messages.

<a name="client-error-configuration"></a>
### Configuration

At a high level you define:

1. An environment for the alerts to run against. See definition [below](#client-error-configuration-what-is-environment)
2. The error configuration for the alerts within that environment

```json
{
    "extensionName": "Your_Extension_Name",
    "enabled": true,
    "environments": [
        {
            "environment": ["portal.azure.com", "portal.azure.cn"],
            "availability": [...],
            "clientError": [
                {
                    "type": "message",
                    "enabled": true,
                    "criteria": [
                       ...
                    ]
                },
                {
                    "type": "percentage",
                    "enabled": true,
                    "criteria": [
                       ...
                    ]
                }
            ],
            "create": [...],
            "performance": [...],
        },
        {
            "environment": ["ms.portal.azure.com"],
            ...
            "clientError": [
                {
                    ...
                }
                ...
             ],
            ...
        }
        ...
    ]
    ...
}
```

<a name="client-error-configuration-what-is-environments"></a>
#### What is environments?

"environments" property is an array. Each of its elements represents a set of alerting criteria for an environment.

<a name="client-error-configuration-what-is-environment"></a>
#### What is environment?

"environment" property is an array. Its supported value is portal.azure.com or ms.portal.azure.com or portal.azure.cn or canary.portal.azure.com
or any other legit portal domain name, a.k.a., national cloud and air-gapped cloud domain names are supported too. Multiple values can be set for an "environment" property.

<a name="client-error-configuration-what-is-enabled"></a>
#### What is enabled?

"enabled" property is used to enable (when "enabled" is true) or disable ("enabled" is false) alerts on various level
depending on where it is in customization json. For details, see "enabled" property in json snippet.

> Among "message" and "percentage" types, you can choose to have one type or two types. Per each of those, you can define a set of criteria like the below. You can define N number of criteria.

<a name="client-error-configuration-percentage"></a>
#### Percentage

An example of a percentage error alert criteria

> You can specify up to 3 messages in "exclusion" property. "type" property's supported value is "and" or "or".

```json
[
    {
        "type": "percentage",
        "enabled": true,
        "criteria": [
            {
                "severity": 3,
                "enabled": true,
                "minAffectedUserCount": 2,
                "minAffectedUserPercentage": 10.0,
                "exclusion": {
                    "type": "or",
                    "message1":"eastus2stage",
                    "message2":"eastus2(stage)"
                },
                "safeDeploymentStage": ["3"],
                "datacenterCode": ["AM"]
            },
            ...
        ]
    },
   ...
]
```

<a name="client-error-configuration-message"></a>
#### Message

An example of a message error alert criteria.

> You can specify up to 3 messages in one criterion and up to 3 messages in "exclusion" property. "type" property's supported value is "and" or "or".

```json
[
    {
        "type": "message",
        "criteria": [
            {
                "severity": 4,
                "enabled": true,
                "checkAllNullRefs": true,
                "message1": "Cannot read property",
                "message2": "of null",
                "minAffectedUserCount": 1,
                "exclusion": {
                    "type": "or",
                    "message1":"eastus2stage",
                    "message2":"eastus2(stage)"
                },
                "safeDeploymentStage": ["3"],
                "datacenterCode": ["AM"]
            },
            ...
        ]
    },
   ...
]
```

<a name="client-error-configuration-what-is-severity"></a>
#### What is severity?

This is the severity value that an IcM alert would have when an alert is fired.

<a name="client-error-configuration-what-is-minaffecteduserpercentage"></a>
#### What is minAffectedUserPercentage?

This is the minimum number of percentage of users affected by any client error.

<a name="client-error-configuration-what-is-minaffectedusercount"></a>
#### What is minAffectedUserCount?

This is the minimum number of users affected by any client error.

<a name="client-error-configuration-what-is-checkallnullrefs"></a>
#### What is checkAllNullRefs?

When it is true, alert checks all the null refs client errors. You can still specify message1, message2, etc. They are additional conditions. 'checkAllNullRefs' property is optional.

<a name="client-error-configuration-what-is-message1-message2-message3-in-criteria-element-for-error-message-alerts"></a>
#### What is message1, message2, message3 in criteria element for error message alerts?

This is the error string that error message alerts check if it exists in client error logs, specifically in [message] column at (Client|Ext)Events log table. They are logical AND relations. To count as an error, all the messages that specified in criteria element have to be present in a client error message([message] column at (Client|Ext)Events log table). You can specify up to 3 messages in one criterion.

<a name="client-error-configuration-what-is-exclusion"></a>
#### What is exclusion?

This specifies condition(s) that alerts do not count as a client error. You can specify it for both error percentage and error message alerts.

<a name="client-error-configuration-what-is-message1-message2-message3-in-the-exclusion-property"></a>
#### What is message1, message2, message3 in the exclusion property?

This is the error string(s) that alerts would not count it as a client error when they're present in a client error message([message] column at (Client|Ext)Events log table). You can specify up to 3 messages in "exclusion" property.

<a name="client-error-configuration-what-is-type-in-the-exclusion-property"></a>
#### What is type in the exclusion property?

This is the logical operator for messages in "exclusion" property. Its supported value is "and" or "or". "and" means when all the messages specified in "exclusion" property are present in a client error message, error alerts would not count it as a client error. "or" means when any of the messages specified in "exclusion" property is present in a client error message, error alerts would not count it as a client error.

<a name="client-error-configuration-what-is-safedeploymentstage"></a>
#### What is safeDeploymentStage?

Safe deployment stage can be "0", "1", "2", or "3". Each stage has a batch of regions. It does not support asterisk ("*") sign.
Safe deployment stage is optional. If you do not specify the safe deployment stage property in criteria, when alerting calculates affectedUserCount, affectedUserPercentage, it does not take safe deployment stage into consideration. So, you will not have affectedUserCount or affectedUserPercentage per safe deployment stage. For such a case, minAffectedUserCount or minAffectedUserPercentage specified in criteria are for all (combined, overall) the safe deployment stages.

<a name="client-error-configuration-what-is-datacentercode"></a>
#### What is datacenterCode?

Datacenter code can be "`*`", "AM", "BY", etc. "`*`" represents all Azure Portal Production regions.
Datacenter code is optional. If you do not specify the datacenterCode property in criteria, when alerting calculates affectedUserCount or affectedUserPercentage, it does not take datacenter into consideration. So, you will not have affectedUserCount or affectedUserPercentage per datacenter. For such a case, minAffectedUserCount or minAffectedUserPercentage specified in criteria are for all (combined, overall) the datacenters.
For the complete list of datacenter code names, go to [datacenter code list](https://aka.ms/portalfx/alerting/datacenter-code-name)

<a name="client-error-how-often-client-error-alerts-run"></a>
### How often client error alerts run?

Currently error percentage alerts run every 15 minutes and error message alerts run every 5 minutes assessing the previous 60 minutes of data.

<a name="create-prevalidation-and-regression"></a>
## Create prevalidation and regression

The create prevalidation and regression alerts can be configured for create blade extension on different environments. Prevalidation alert is supported only in public cloud, whereas the regression alert is supported in all clouds.

<a name="create-prevalidation-and-regression-configuration-1"></a>
### Configuration

At a high level you define;

1. N number of environment within "environments" property like the below.
2. The create prevalidation or regression configuration for the alerts within that environment

```json
{
    "extensionName": "Your_Extension_Name",
    "enabled": true,
    "environments": [
        {
            "environment": ["portal.azure.com", "ms.portal.azure.com"], // prevalidation type is only supported in public clouds
            "availability": [...], // Optional
            "clientError": [...], // Optional.
            "create": [
                 {
                    "type": "regression", // "regression" or "prevalidation" are supported types
                    "enabled": true,
                    "criteria": [
                       ...
                    ]
                }
            ],
            "performance": [...], // Optional.
        },
        {
            "environment": ["ms.portal.azure.com"],
            "create": [
                {
                    ...
                }
                ...
             ]
            ...
        }
        ...
    ]
    ...
}
```

<a name="create-prevalidation-and-regression-configuration-1-what-is-environments-1"></a>
#### What is environments?

"environments" property is an array. Each of its elements represents a set of alerting criteria for an environment.

<a name="create-prevalidation-and-regression-configuration-1-what-is-environment-1"></a>
#### What is environment?

"environment" property is an array. Its supported value for this alert is portal.azure.com or ms.portal.azure.com. For regression alerts, cn or canary.portal.azure.com or any other legit portal domain name, a.k.a., national cloud and air-gapped cloud domain names are supported too. Prevalidation alerts are only available in ms.portal.azure.com and the portal.azure.com portal domains. Mutiple values can be set for an "environment" property.

<a name="create-prevalidation-and-regression-configuration-1-what-is-enabled-1"></a>
#### What is enabled?

"enabled" property is used to enable (when "enabled" is true) or disable ("enabled" is false) alerts on various level depending on where it's located in customization json. For details, see "enabled" property in json snippet.

You can define N number of criteria like the below.

```json
{
    "severity": 3,
    "enabled": true,
    "bladeName": ["CreateBlade"],
    "minSuccessRateOverPast24Hours":94.0,
    "minSuccessRateOverPastHour":94.0,
    "minTotalCountOverPast24Hours":50,
    "minTotalCountOverPastHour":3,
    "errorCodesToExclude": [""] // Optional and only supported in prevalidation alerts
}
```
<a name="create-prevalidation-and-regression-configuration-1-what-is-severity-1"></a>
#### What is severity?

This is the severity value that an IcM alert would have when an alert is fired.

<a name="create-prevalidation-and-regression-configuration-1-what-is-bladename"></a>
#### What is bladeName?

The list of the create blade name.

<a name="create-prevalidation-and-regression-configuration-1-what-is-minsuccessrateoverpast24hours"></a>
#### What is minSuccessRateOverPast24Hours?

This is the minimum create blade success rate or the create prevalidation success rate over the past 24 hours.

<a name="create-prevalidation-and-regression-configuration-1-what-is-minsuccessrateoverpasthour"></a>
#### What is minSuccessRateOverPastHour?

This is the minimum create blade success rate or the create prevalidation success rate over the past hour.

<a name="create-prevalidation-and-regression-configuration-1-what-is-mintotalcountoverpast24hours"></a>
#### What is minTotalCountOverPast24Hours?

This is the minimum number of creates or create prevalidations that get kicked off over the past 24 hours.

<a name="create-prevalidation-and-regression-configuration-1-what-is-mintotalcountoverpasthour"></a>
#### What is minTotalCountOverPastHour?

This is the minimum number of creates or create prevalidations that get kicked off over the past hour.

<a name="create-prevalidation-and-regression-configuration-1-what-is-errorcodestoexclude"></a>
#### What is errorCodesToExclude?

The optional list of create prevalidation error codes which need to be excluded while evaluating the alert. This is only supported for prevalidation alerts.

<a name="create-prevalidation-and-regression-configuration-1-is-national-cloud-supported"></a>
#### Is National Cloud Supported?

1. For regressions, the alert is available in all clouds including national clouds.
2. For prevalidations, the alert is only available in public cloud.

<a name="create-prevalidation-and-regression-how-often-do-create-alerts-run"></a>
### How often do create alerts run?

Every 60 minutes, we get create or prevalidation success rate and create or prevalidation total count for the last 60 minutes and the last 24 hours.
Alerts will only trigger when the following criteria are met.

1. Hourly create or prevalidation success rate is below {minSuccessRateOverPastHour} and hourly create or prevalidation total count is above {minTotalCountOverPastHour}
1. 24-hour create or prevalidation success rate is below {minSuccessRateOverPast24Hours} and 24-hour create or prevalidation total count is above {minTotalCountOverPast24Hours}

<a name="performance"></a>
## Performance

The alerts can be configured for extension performance, blade performance and part performance on different environments including national clouds.

<a name="performance-configuration-2"></a>
### Configuration

At a high level you define;

1. N number of environment within "environments" property like the below.
2. The performance configuration for the alerts within that environment

```json
{
    "extensionName": "Your_Extension_Name",
    "enabled": true,
    "environments": [
        {
            "environment": ["portal.azure.com", "portal.azure.cn"],
            "availability": [...],
            "clientError": [...],
            "create": [...],
            "performance": [
                 {
                    "type": "extension",
                    "enabled": true,
                    "criteria": [
                       ...
                    ]
                },
                {
                    "type": "blade",
                    "enabled": true,
                    "criteria": [
                       ...
                    ]
                }
                ...
            ]
        },
        {
            "environment": ["ms.portal.azure.com"],
            "performance": [
                {
                    ...
                }
                ...
             ]
            ...
        }
        ...
    ]
    ...
}
```

Per each of those, you can define a set of criteria like the below.

> Only blade or part is required to have a namePath property or optionally to have an exclusion property.

<a name="performance-configuration-2-what-is-environments-2"></a>
#### What is environments?

"environments" property is an array. Each of its elements represents a set of alerting criteria for an environment.

<a name="performance-configuration-2-what-is-environment-2"></a>
#### What is environment?

"environment" property is an array. Its supported value is portal.azure.com or ms.portal.azure.com or portal.azure.cn or canary.portal.azure.com
or any other legit portal domain name, a.k.a., national cloud and air-gapped cloud domain names are supported too. Multiple values can be set for an "environment" property.

<a name="performance-configuration-2-what-is-enabled-2"></a>
#### What is enabled?

"enabled" property is used to enable (when "enabled" is true) or disable ("enabled" is false) alerts on various level
depending on where it is located in customization json. For details, see "enabled" property in json snippet.

You can define N number of criteria like the below.

```json
{
    "severity": 3,
    "enabled": true,
    "percentile": 95,
    "percentileDurationThresholdInMilliseconds": 4000,
    "minAffectedUserCount": 10,
    "bottomMinAffectedUserCount": 2,
    "namePath": ["*"],
    "exclusion": [
        "Extension/Your_Extension_Name/Blade/BladeNameA",
        "Extension/Your_Extension_Name/Blade/BladeNameB"],
    "safeDeploymentStage": ["3"],
    "datacenterCode": ["AM"]
}
```

<a name="performance-configuration-2-what-is-severity-2"></a>
#### What is severity?

This is the severity value that an IcM alert would have when an alert is fired.

<a name="performance-configuration-2-what-is-percentile"></a>
#### What is percentile?

This is at which percentile you want to measure the performance. Today the only options are 80 or 95.

<a name="performance-configuration-2-what-is-percentiledurationthresholdinmilliseconds"></a>
#### What is percentileDurationThresholdInMilliseconds?

This is the minimum duration (in milliseconds) when {percentile}% of users are above the {percentileDurationThresholdInMilliseconds}.

<a name="performance-configuration-2-what-is-minaffectedusercount-1"></a>
#### What is minAffectedUserCount?

This is the minimum number of users whose load duration is above {percentileDurationThresholdInMilliseconds}.

<a name="performance-configuration-2-what-is-bottomminaffectedusercount"></a>
#### What is bottomMinAffectedUserCount?

This is used as a threshold to trigger an alert if the {percentile} defined is greater than or
equal to __double__ the {percentileThreshold} defined.

> This is defaulted to 20% of {minAffectedUserCount}.

This is used to catch any unusual spikes on the weekends/low traffic periods.

<a name="performance-configuration-2-what-is-namepath"></a>
#### What is namePath?

This only applies to blades or parts and defines what blades or parts to alert on, you can either use an asterisk ("*") sign to include
all the blades or parts within your extension or specify a list of full blade or part names to alert on. The percentileDurationThresholdInMilliseconds, minAffectedUserCount and bottomMinAffectedUserCount specified in criteria are for individual blades or parts.

<a name="performance-configuration-2-what-is-exclusion-1"></a>
#### What is exclusion?

This only applies to blades or parts and defines what blades or parts you wish to exclude.

<a name="performance-configuration-2-what-is-safedeploymentstage-1"></a>
#### What is safeDeploymentStage?

Safe deployment stage can be "0", "1", "2", or "3". Each stage has a batch of regions. It does not support asterisk ("*") sign.
Safe deployment stage is optional. If you do not specify the safe deployment stage property in criteria, when alerting calculates percentileDuration and affectedUserCount, it does not take safe deployment stage into consideration. So, you won't have percentileDuration and affectedUserCount per safe deployment stage. For such a case, percentileDurationThresholdInMilliseconds, minAffectedUserCount and bottomMinAffectedUserCount specified in criteria are for all (combined, overall) the safe deployment stages.

<a name="performance-configuration-2-what-is-datacentercode-1"></a>
#### What is datacenterCode?

Datacenter code can be "`*`", "AM", "BY", etc. "`*`" represents all Azure Portal Production regions.
Datacenter code is optional. If you do not specify the datacenterCode property in criteria, when alerting calculates percentileDuration and affectedUserCount, it does not take datacenter into consideration. So you will not have percentileDuration and affectedUserCount per datacenter. For such a case percentileDurationThresholdInMilliseconds, minAffectedUserCount and bottomMinAffectedUserCount specified in criteria are for all (combined, overall) the datacenters.
For the complete list of datacenter code names, go to [datacenter code list](https://aka.ms/portalfx/alerting/datacenter-code-name)

<a name="performance-configuration-2-when-do-the-alerts-trigger"></a>
#### When do the alerts trigger?

Every 10 minutes, we get percentile load duration for the last 90 minutes. We get the most recent 6 sample points and calculate a weighted percentile load duration based on the following formula.

```txt
Weighted duration = 8/24 * {most recent percentile load duration} + 6/24 * {2nd most recent percentile load duration} + 4/24 * {3rd…} + 3/24 * {4th …} + 2/24 * {5th …} + 1/24 * {6th …}
```

Alerts will only trigger when one of the following criteria is met.

1. Weighted duration is above {percentileDurationThresholdInMilliseconds} and affected user count is above {minAffectedUserCount}
1. Weighted duration is above 2 * {percentileDurationThresholdInMilliseconds} and affected user count is above {bottomMinAffectedUserCount}

<a name="performance-how-often-do-they-run-1"></a>
### How often do they run?

Currently performance alerts run every 10 minutes assessing the previous 90 minutes of data.

<a name="how-do-i-onboard"></a>
## How do I onboard?

1. Submit and complete a Pull Request in [Azure Portal Alerting Repo a.k.a. Alerting Repo](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx-Alerting).
> For availability alert refer to [Availability Opted in](#Opted-in)

> For non-create alert the customization JSON should be located at `products/{YourServiceNameInIcM}/{ExtensionName}.alerting.json`. It is recommended to have an `owners.txt` in the same folder as the customization JSON file. The `owners.txt` has AAD enabled email alias or/and individual MSFT aliases. Anyone from `owners.txt` can approve the Pull Request for any changes within that folder or its subfolder. The PR becomes eligible to complete once it gets an approval from `owners.txt` and the merge validation passes.

> For create alert the customization JSON should be located at `products/IbizaFx/Create/{ExtensionName}.create.alerting.json`. To be eligible to complete the PR need additional approval from Gauge Team Code Reviews or Create PMs.

> For public and national clouds the configuration updates take effect immediately after the PR gets completed.

> For air-gapped clouds we deploy configuration updates to air-gapped clouds once every month.

2. Set up correlation rules in ICM

| Field | Value |
| -----  | ----- |
| Routing ID | 'AIMS://AZUREPORTAL\Portal\\{ExtensionName}' |
| Correlation ID | use table below to map |
| Mode | Hit count (recommended) |
| Match DC/Region | Checked |
| Match Slice | Checked |
| Match Severity | Checked |
| Match Role | Checked |
| Match Instance/Cluster | Checked |

> Depending on the alert you are correlating you will need to use the corresponding correlation id

> If you'd like alerts to correlate on different safe deployment stages, do not check Match DC/Region for availability alert.

| Alert | Correlation ID |
| ----- | -------------- |
| Availability | PercentageBasedAvailability |
| Create - Regression | CreateBladeSuccessRate |
| Error - AffectedUserPercentage | ErrorAffectedUserPercentage |
| Error - Message | ErrorMessage |
| Extension SDK Age* | ExtensionAge |
| Performance - Extension | ExtensionLoadPerformance |
| Performance - Blade | BladeLoadPerformance |
| Performance - Part | PartLoadPerformance|
> *It's required when extension team's tenant in IcM owns multiple extensions in Azure Portal. Without it the extension age alerts fired for different extensions would be correlated into one IcM per cloud.

<a name="time-zone-based-alerting"></a>
## Time zone based alerting

As Ibiza has extension developers spread across the world, we have a mechanism to trigger alerts in the business hours of the extension team. Currently, the alerts supported for time zone based alerting are -
1. SDK Age alerts.

For all other alerts, the extension owner cannot pick a time zone and will be alerted as soon as the alert trigger conditions are met.

To configure time zone based alerting, you need to specify a `businessHourStartTimeUtc` property in the alerting config. The value takes an integer value from `0` to `23` as a string. The value represents the UTC hour at which business hours start in the extension team's region.

When an alert is triggered, the Ibiza team guarantees that you will receive it within 6 hours of the hour configured as `businessHourStartTimeUtc`.

Examples -

1. If your region is 6 hours ahead of UTC (UTC +6), and you want to receive an alert between 10 AM to 4 PM, you can set `businessHourStartTimeUtc` to "4" as 10 AM in your region will be 4 AM in UTC.

1. If your region is 8 hours behind UTC (UTC -8), and you want to receive an alert between 10 AM to 4 PM, you can set `businessHourStartTimeUtc` to "18" as 10 AM in your region will be 6 PM in UTC.

Here is an example of how to specify `businessHourStartTimeUtc` in the config for a team that wants to receive alerts between 4 AM and 10 AM UTC.

```json
{
    "extensionName": "Your_Extension_Name",
    "businessHourStartTimeUtc": "4",
    "enabled": true,
    "environments": [
        ...
    ]
    ...
}
```

If no value is specified for `businessHourStartTimeUtc`, alerts are triggered in Pacific Time business hours by default.

<a name="overwrite-default-tsg-with-extenions-tsg"></a>
## Overwrite default TSG with extenions&#39; TSG
Extension team can overwrite the default TSG links in IcM that are set by Azure Portal team by specifying their own TSG links in extension's customization JSON. The TSG link can be any valid URL that points to the TSG owned by extension team although it's preferably a URL in [Engineering Hub][2] because it can be accessible in air-gapped clouds without extra work. The [Engineering Hub][2] takes care of translating it to a URL in air-gapped clouds and makes sure it can be accessible in air-gapped clouds behind the scenes.
Here is an example of how to specify the `tsgLinks` in the customization JSON config.

```json
{
    "extensionName": "Your_Extension_Name",
    "enabled": true,
    "tsgLinks": {
        "availability":"https://extension_availability_TSG_link_preferably_a_url_in_engineering_hub",
        "clientError":"any_valid_url",
        "create":"https://aka.ms/your_extension_name_portalfx_create_alert_TSG_link",
        "extensionAgeOverdue":"https://extension_age_overdue_alert_TSG_link",
        "performance":"https://your_extension_name_performance_alert",
        "telemetryThrottled":"https://aka.ms/telemetry_throttled_TSG"
    }
    ...
}
```
> You don't need to specify the TSG links for all alert types. For alert types that are not specified in `tsgLinks`, the IcM uses the default TSG link that is owned by Portal framework team.

<a name="route-alerts-to-another-team-in-icm"></a>
## Route alerts to another team in IcM

By default all the alerts are fired against Azure Portal (IbizaFx) team and IbizaFx team maintains an IcM routing table by which alerts are routed to different services and teams. Since IcM does not support secondary routing, once extension partners receive an IcM, they cannot route it to another service or team in IcM even if they have their own IcM routing table. The workaround is to fire alerts directly to you (the extension partner) in IcM, which requires your team to create a custom connector in IcM, onboard a certificate to it and add connector Id into customization JSON.

[*If your extension is comprised of sub-teams*] - With this setup you would also be able to route these alerts to your team's ICM and then you will be able to setup your own routing rules, which can check the blade name, or other properties, and then route to the appropriate sub-team.

<a name="route-alerts-to-another-team-in-icm-step-1"></a>
### Step 1

Onboard a custom IcM connector per cloud instance following the IcM doc [Onboard a connector for a Service][1]. Alerting service will use the custom connector owned by your team to inject IcM incidents directly to your service in IcM. Only the service admin has the rights to onboard a new or update an existing connector.

Certificate is used by IcM service to authenticate with the alerting service who sends incidents to IcM service. We are using Azure Key Vault managed certificate. You will need to add **DSTS.PHMS.AZUREWEBSITES.NET** as one of "Certificates SAN(s)" on connector edit or onboarding page.

<a name="route-alerts-to-another-team-in-icm-step-2"></a>
### Step 2

Submit and complete a PR to add **IcM connector info** into alerting customization JSON so that alerting service knows what connector is used when sending incidents for that extension. The supported cloud values are Public, BlackForest, Fairfax, Mooncake and air-gapped clouds.

If one or more **clouds** are not specified in customization JSON, the IcM incidents will be created and sent to Azure Portal (IbizaFx) team through IbizaFx's custom connector for the cloud instance(s) that're not specified in the extension's customization JSON. And IbizaFx's IcM routing rule auto-routes the incidents to the corresponding service and team in IcM

```json
{
   "extensionName":"Your_Extension_Name",
   "enabled":true,
   "icmConnectors":[
      {
         "connectorId":"12345678-abcd-abcd-abcd-123456789012",
         "cloud":"Public"
      },
      {
         "connectorId":"87654321-dcba-dcba-dcba-210987654321",
         "cloud":"Mooncake"
      },
      ...
   ],
   "environments":[
      ...
   ]
}
```

**The alerting service will be sending out IcM through customized connectors once step 2 is complete**

<a name="route-alerts-to-another-team-in-icm-step-3"></a>
### Step 3

The last step is to create routing rules to route different IcMs to different teams at IcM site. Please reach out to [ICM support](mailto:icmsupport@microsoft.com) team to opt in the Export/Import feature to bulk update IcM routing rules.

<a name="faq"></a>
## FAQ

<a name="faq-q-how-do-i-know-my-extension-s-current-configuration"></a>
### Q: How do I know my extension&#39;s current configuration?

A: Alerting is running off customization JSONs that live in [Alerting Repo](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx-Alerting). All the non-create alerts customimzation JSONs are located at `products/{YourServiceNameInIcM}/{ExtensionName}.alerting.json`. All the create alerts customization JSONs are located at `products/IbizaFx/Create/{ExtensionName}.create.alerting.json`.

<a name="faq-q-what-happens-if-i-need-to-update-my-configuration"></a>
### Q: What happens if I need to update my configuration?

A: Submit and complete a Pull Request on your extension's customization JSON in [Alerting Repo](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx-Alerting). The update is 'live' once the Pull Request is complete.

> For each extension there is an `owners.txt` that is in the same or parent folder as the JSON. The `owners.txt` has AAD enabled email alias or/and individual MSFT aliases. Anyone from `owners.txt` can approve the Pull Request. The `owners.txt` is created and maintained by extension team.

<a name="faq-q-how-is-mapping-done-from-extension-name-to-icm-team-and-service-names"></a>
### Q: How is mapping done from extension name to IcM team and service names?

A: Azure Portal partner team's IcM info is collected during partner onboarding process and is stored in the [extension config](https://aka.ms/portalfx/extensionsprodjson). An IcM routing rule is added under Azure Portal (Ibiza) service in IcM to route incidents to corresponding partners.

> The IcM routing rule is in format 'AIMS://AZUREPORTAL\Portal\{ExtensionName}'.

  [1]: https://icmdocs.azurewebsites.net/developers/Connectors/ConnectorOnboarding.html
  [2]: https://aka.ms/EngineeringHub

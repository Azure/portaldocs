* [Overview](#overview)
* [What alerting is available](#what-alerting-is-available)
* [Performance](#performance)
    * [Configuration](#performance-configuration)
    * [How often do they run](#performance-how-often-do-they-run)
* [Availability](#availability)
    * [Configuration](#availability-configuration-1)
    * [When do the alerts trigger](#availability-when-do-the-alerts-trigger-1)
    * [How often do they run](#availability-how-often-do-they-run-1)
* [Client Error](#client-error)
    * [Configuration](#client-error-configuration-2)
    * [How often client error alerts run](#client-error-how-often-client-error-alerts-run)
* [Create regression](#create-regression)
    * [Configuration](#create-regression-configuration-3)
    * [How often do create alerts run](#create-regression-how-often-do-create-alerts-run)
* [How do I onboard](#how-do-i-onboard)
* [How do I know my extension's current configuration](#how-do-i-know-my-extension-s-current-configuration)
* [What happens if I need to update my configuration](#what-happens-if-i-need-to-update-my-configuration)
    * [How is mapping done from extension name to IcM team and service names](#what-happens-if-i-need-to-update-my-configuration-how-is-mapping-done-from-extension-name-to-icm-team-and-service-names)
    * [How to enable alerts for national clouds](#what-happens-if-i-need-to-update-my-configuration-how-to-enable-alerts-for-national-clouds)
* [Timezone based alerting](#timezone-based-alerting)
    * [How partners route alerts to another team in IcM](#timezone-based-alerting-how-partners-route-alerts-to-another-team-in-icm)


<a name="overview"></a>
## Overview

The framework provides an out of the box alerting infrastructure. Some of these alerts you will be automatically onboarded to and others you will have to onboard manually.
They offer a great way to constantly assess your product and ensure you are within SLAs and not regressing within real time.
Each alert type has either configurable or fixed alerting criteria which is assessed on varying windows of time and then based on the results will the alert will be triggered or not.
Once an alert is triggered it will automatically open an IcM on the owning team.

<a name="what-alerting-is-available"></a>
## What alerting is available

There are number of framework provided alerts:

1. Extension SDK age
    - Sev3 IcM incident for an extension when its SDK is older than 60 days
    - Sev2 for over 90 days

    Note: You can set the time of the day at which you want to trigger an SDK age alert. Learn more about timezone based alerting [here](#timezone-based-alerting).
1. Extension Alive
1. Telemetry Throttled
    - Sev4 IcM incident for an extension when its ExtTelemetry logs reach above 200 events every 60 seconds per user per browser tab. We stop logging ExtTelemetry events utill the next window starts.
1. Performance
1. Availability
1. Client Error
1. Create Regression

Some of these alert types are configurable per extension. The following alerts types currently support extension configuration:

1. [Performance](#performance)
1. [Availability](#Availability)
1. [Client Error](#client-error)
1. [Create regression](#create-regression)

To onboard to the configurable alerts please see the relevant sub section below.

Similarly to the non-configurable alerts, once the thresholds for any of the configured alerts are met or surpassed a ICM alert containing details will be opened agaisnt the owning team.

<a name="performance"></a>
## Performance

The alerts can be configured for extension performance, blade performance and part performance on different environments including national clouds.

<a name="performance-configuration"></a>
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

<a name="performance-configuration-what-is-environments"></a>
#### What is environments

"environments" property is an array. Each of its elements represents a set of alerting critiera for an environment.

<a name="performance-configuration-what-is-environment"></a>
#### What is environment

"environment" property is an array. Its supported value is portal.azure.com or ms.portal.azure.com or portal.azure.cn or canary.portal.azure.com
or any other legit portal domain name, a.k.a., national cloud domain names are supported too. Mutiple values can be set for an "environment" property.

<a name="performance-configuration-what-is-enabled"></a>
#### What is enabled

"enabled" property is used to enable (when "enabled" is true) or disable ("enabled" is false) alerts on various level
depending on where it's located in customization json. For details, see "enabled" property in json snippet.

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

<a name="performance-configuration-what-is-severity"></a>
#### What is severity

This is the severity value that an IcM alert would have when an alert is fired.

<a name="performance-configuration-what-is-percentile"></a>
#### What is percentile

This is at which percentile you want to measure the performance. Today the only options are 80 or 95.

<a name="performance-configuration-what-is-percentiledurationthresholdinmilliseconds"></a>
#### What is percentileDurationThresholdInMilliseconds

This is the minimum duration (in milliseconds) when {percentile}% of users is above the {percentileDurationThresholdInMilliseconds}.

<a name="performance-configuration-what-is-minaffectedusercount"></a>
#### What is minAffectedUserCount

This is the minimum number of users whose load duration is above {percentileDurationThresholdInMilliseconds}.

<a name="performance-configuration-what-is-bottomminaffectedusercount"></a>
#### What is bottomMinAffectedUserCount

This is used as a threshold to trigger an alert if the {percentile} defined is greater than or
equal to __double__ the {percentileThreshold} defined.

> This is defaulted to 20% of {minAffectedUserCount}.

This is used to catch any unusual spikes on the weekends/low traffic periods.

<a name="performance-configuration-what-is-namepath"></a>
#### What is namePath

This only applies to blades or parts and defines what blades or parts to alert on, you can either use an asterisk("*") sign to include
all the blades or parts within your extension or specify a list of full blade or part names to alert on. The percentileDurationThresholdInMilliseconds, minAffectedUserCount and bottomMinAffectedUserCount specified in critiera are for individual blades or parts.

<a name="performance-configuration-what-is-exclusion"></a>
#### What is exclusion

This only applies to blades or parts and defines what blades or parts you wish to exclude.

<a name="performance-configuration-what-is-safedeploymentstage"></a>
#### What is safeDeploymentStage

Safe deployment stage can be "0", "1", "2", or "3". Each stage has a batch of regions. It does not support asterisk("*") sign.
Safe deployment stage is optional. If you don't specify the safe deployment stage property in critera, when alerting calculates percentileDuration and affectedUserCount, it does not take safe deployment stage into consideration. So you won't have percentileDuration and affectedUserCount per safe deployment stage. For such a case, percentileDurationThresholdInMilliseconds, minAffectedUserCount and bottomMinAffectedUserCount specified in critiera are for all(combined, overall) the safe deployment stages.

<a name="performance-configuration-what-is-datacentercode"></a>
#### What is datacenterCode

Datacenter code can be "`*`", "AM", "BY", etc. "`*`" represents all Azure Portal Production regions.
Datacenter code is optional. If you don't specify the datacenterCode property in critera, when alerting calculates percentileDuration and affectedUserCount, it does not take datacenter into consideration. So you won't have percentileDuration and affectedUserCount per datacenter. For such a case percentileDurationThresholdInMilliseconds, minAffectedUserCount and bottomMinAffectedUserCount specified in critiera are for all(combined, overall) the datacenters.
For the complete list of datacenter code names, go to [datacenter code list](https://aka.ms/portalfx/alerting/datacenter-code-name)

<a name="performance-configuration-when-do-the-alerts-trigger"></a>
#### When do the alerts trigger

Every 10 minutes, we get percentile load duration for the last 90 minutes. We get the most recent 6 sample points and calculate a weighted percentile load duration based on the following formula.

```txt
Weighted duration = 8/24 * {most recent percentile load duration} + 6/24 * {2nd most recent percentile load duration} + 4/24 * {3rd…} + 3/24 * {4th …} + 2/24 * {5th …} + 1/24 * {6th …}
```

Alerts will only trigger when one of the following criteria is met.

1. Weighted duration is above {percentileDurationThresholdInMilliseconds} and affected user count is above {minAffectedUserCount}
1. Weighted duration is above 2 * {percentileDurationThresholdInMilliseconds} and affected user count is above {bottomMinAffectedUserCount}

<a name="performance-how-often-do-they-run"></a>
### How often do they run

Currently performance alerts run every 10 minutes assessing the previous 90 minute of data.

<a name="availability"></a>
## Availability

The alerts can be configured for extension availability, blade availability and part availability on different environments including national clouds.

<a name="availability-configuration-1"></a>
### Configuration

At a high level you define;

1. N number of environment within "environments" property like the below.
2. The availability configuration for the alerts within that environment

```json
{
    "extensionName": "Your_Extension_Name",
    "enabled": true,
    "environments": [
        {
            "environment": ["portal.azure.com", "portal.azure.cn"],
            "availability": [
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
            ],
            "clientError": [...],
            "create": [...],
            "performance": [...]
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
}
```

Per each of those, you can define a set of criteria like the below.

> Only blade or part is required to have a namePath property or optionally to have an exclusion property.

<a name="availability-configuration-1-what-is-environments-1"></a>
#### What is environments

"environments" property is an array. Each of its elements represents a set of alerting critiera for an environment.

<a name="availability-configuration-1-what-is-environment-1"></a>
#### What is environment

"environment" property is an array. Its supported value is portal.azure.com or ms.portal.azure.com or portal.azure.cn or canary.portal.azure.com
or any other legit portal domain name, a.k.a., national cloud domain names are supported too. Mutiple values can be set for an "environment" property.

<a name="availability-configuration-1-what-is-enabled-1"></a>
#### What is enabled

"enabled" property is used to enable (when "enabled" is true) or disable ("enabled" is false) alerts on various level
depending on where it's located in customization json. For details, see comments of "enabled" property in json snippet.

You can define N number of criteria like the below.

```json
{
    "severity": 3,
    "enabled": true,
    "minAvailability": 80.0,
    "minFailureCount": 10,
    "minFailureUserCount": 10,
    "namePath": ["*"],
    "exclusion": [
        "Extension/Your_Extension_Name/Blade/BladeNameA",
        "Extension/Your_Extension_Name/Blade/BladeNameB"],
    "safeDeploymentStage": ["3"],
    "datacenterCode": ["AM"]
}
```

<a name="availability-configuration-1-what-is-severity-1"></a>
#### What is severity

This is the severity value that an IcM alert would have when an alert is fired.

<a name="availability-configuration-1-what-is-minavailability"></a>
#### What is minAvailability

This is the minimum availability as a percentage. For example your extension fails to load 20 out of 100 times that would be 80% available.

<a name="availability-configuration-1-what-is-minfailurecount"></a>
#### What is minFailureCount

This is the minimum number of failures that have occurred, for example the above configuration requires 10 or more failures.

<a name="availability-configuration-1-what-is-minfailureusercount"></a>
#### What is minFailureUserCount

This is the minimum number of unique users who have to encountered a failure before the threshold is surpassed.

<a name="availability-configuration-1-what-is-namepath-1"></a>
#### What is namePath

This only applies to blades or parts and defines what blades or parts to alert on, you can either use an asterisk("*") sign to include
all the blades or parts within your extension or specify a list of full blade or part names to alert on. The minAvailability, minFailureCount and minFailureUserCount specified in critiera are for individual blades or parts.

<a name="availability-configuration-1-what-is-exclusion-1"></a>
#### What is exclusion

This only applies to blades or parts and defines what blades or parts you wish to exclude.

<a name="availability-configuration-1-what-is-safedeploymentstage-1"></a>
#### What is safeDeploymentStage

Safe deployment stage can be "0", "1", "2", or "3". Each stage has a batch of regions. It does not support asterisk("*") sign.
Safe deployment stage is optional. If you don't specify the safe deployment stage property in critera, when alerting calculates availability, failureCount and failureUserCount, it does not take safe deployment stage into consideration. So you won't have availability, failureCount and failureUserCount per safe deployment stage. For such a case, minAvailability, minFailureCount and minFailureUserCount specified in critiera are for all(combined, overall) the safe deployment stages.

<a name="availability-configuration-1-what-is-datacentercode-1"></a>
#### What is datacenterCode

Datacenter code can be "`*`", "AM", "BY", etc. "`*`" represents all Azure Portal Production regions.
Datacenter code is optional. If you don't specify the datacenterCode property in critera, when alerting calculates availability, failureCount and failureUserCount, it does not take datacenter into consideration. So you won't have availability, failureCount and failureUserCount per datacenter. For such a case, minAvailability, minFailureCount and minFailureUserCount specified in critiera are for all(combined, overall) the datacenters.
For the complete list of datacenter code names, go to [datacenter code list](https://aka.ms/portalfx/alerting/datacenter-code-name)

<a name="availability-when-do-the-alerts-trigger-1"></a>
### When do the alerts trigger

Alerts will only trigger for any blade in extension "Your_Extension_Name" except for blades "Extension/Your_Extension_Name/Blade/BladeNameA" and
"Extension/Your_Extension_Name/Blade/BladeNameB" and for the blade load on safe deployment stage 3 and datacenter "AM", when all 3 criteria,
minAvailability, minFailureCount and minFailureUserCount are met (AND). So the above critical configuration will only fire when 10 or more unique users encounter failures
*AND* there are 10 or more failure occurences *AND* the total availability < 80%, all within the last hour. Only then will a severity 3 alert be opened.

<a name="availability-how-often-do-they-run-1"></a>
### How often do they run

Currently they run every 5 minutes assessing the previous hour of data.

<a name="client-error"></a>
## Client Error

There are two high level types of client error alerts, error percentage and error message on different environments including national clouds.

1. Error percentage alerts fire when the percentage of users experiencing any error(s) is above the defined threshold.
2. Error message alerts fire on specified error messages.

<a name="client-error-configuration-2"></a>
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

<a name="client-error-configuration-2-what-is-environments-2"></a>
#### What is environments

"environments" property is an array. Each of its elements represents a set of alerting critiera for an environment.

<a name="client-error-configuration-2-what-is-environment-2"></a>
#### What is environment

"environment" property is an array. Its supported value is portal.azure.com or ms.portal.azure.com or portal.azure.cn or canary.portal.azure.com
or any other legit portal domain name, a.k.a., national cloud domain names are supported too. Mutiple values can be set for an "environment" property.

<a name="client-error-configuration-2-what-is-enabled-2"></a>
#### What is enabled

"enabled" property is used to enable (when "enabled" is true) or disable ("enabled" is false) alerts on various level
depending on where it's located in customization json. For details, see "enabled" property in json snippet.

> Among "message" and "percentage" types, you can choose to have one type or two types. Per each of those, you can define a set of criteria like the below. You can define N number of criteria.

<a name="client-error-configuration-2-percentage"></a>
#### Percentage

An example of a percentage error alert criteria

> You can specify up to 3 messages in "exclusion" property. "type" property's supported value is "and" or "or".

```json
[
    {
        "type": "percentage",
        "enabled": true,
        "criteria":[
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

<a name="client-error-configuration-2-message"></a>
#### Message

An example of a message error alert criteria.

> You can specify up to 3 messages in one criteria and up to 3 messages in "exclusion" property. "type" property's supported value is "and" or "or".

```json
[
    {
        "type": "message",
        "criteria":[
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

<a name="client-error-configuration-2-what-is-severity-2"></a>
#### What is severity

This is the severity value that an IcM alert would have when an alert is fired.

<a name="client-error-configuration-2-what-is-minaffecteduserpercentage"></a>
#### What is minAffectedUserPercentage

This is the minimum number of percentage of users affected by any client error.

<a name="client-error-configuration-2-what-is-minaffectedusercount-1"></a>
#### What is minAffectedUserCount

This is the minimum number of users affected by any client error.

<a name="client-error-configuration-2-what-is-checkallnullrefs"></a>
#### What is checkAllNullRefs

When it's true, alert checks all the null refs client errors. You can still specify message1, message2, etc. They're additional conditions. 'checkAllNullRefs' property is optional.

<a name="client-error-configuration-2-what-is-message1-message2-message3-in-criteria-element-for-error-message-alerts"></a>
#### What is message1, message2, message3 in criteria element for error message alerts

This is the error string that error message alerts check if it existis in client error logs, specifically in [message] column at (Client|Ext)Events log table. They're logical AND relations. To count as an error, all the messages that specified in criteria element have to be present in a client error message([message] column at (Client|Ext)Events log table). You can specify up to 3 messages in one criteria.

<a name="client-error-configuration-2-what-is-exclusion-2"></a>
#### What is exclusion

This specifies condition(s) that alerts do not count as a client error. You can specify it for both error percentage and error message alerts.

<a name="client-error-configuration-2-what-is-message1-message2-message3-in-the-exclusion-property"></a>
#### What is message1, message2, message3 in the exclusion property

This is the error string(s) that alerts would not count it as a client error when they're present in a client error message([message] column at (Client|Ext)Events log table). You can specify up to 3 messages in "exclusion" property.

<a name="client-error-configuration-2-what-is-type-in-the-exclusion-property"></a>
#### What is type in the exclusion property

This is the logical operator for messages in "exclusion" property. Its supported value is "and" or "or". "and" means when all the messages specified in "exclusion" property are present in a client error message, error alerts would not count it as a client error. "or" means when any of the messages specified in "exclusion" property is present in a client error message, error alerts would not count it as a client error.

<a name="client-error-configuration-2-what-is-safedeploymentstage-2"></a>
#### What is safeDeploymentStage

Safe deployment stage can be "0", "1", "2", or "3". Each stage has a batch of regions. It does not support asterisk("*") sign.
Safe deployment stage is optional. If you don't specify the safe deployment stage property in critera, when alerting calculates affectedUserCount, affectedUserPercentage, it does not take safe deployment stage into consideration. So you won't have affectedUserCount or affectedUserPercentage per safe deployment stage. For such a case, minAffectedUserCount or minAffectedUserPercentage specified in critiera are for all(combined, overall) the safe deployment stages.

<a name="client-error-configuration-2-what-is-datacentercode-2"></a>
#### What is datacenterCode

Datacenter code can be "`*`", "AM", "BY", etc. "`*`" represents all Azure Portal Production regions.
Datacenter code is optional. If you don't specify the datacenterCode property in critera, when alerting calculates affectedUserCount or affectedUserPercentage, it does not take datacenter into consideration. So you won't have affectedUserCount or affectedUserPercentage per datacenter. For such a case, minAffectedUserCount or minAffectedUserPercentage specified in critiera are for all(combined, overall) the datacenters.
For the complete list of datacenter code names, go to [datacenter code list](https://aka.ms/portalfx/alerting/datacenter-code-name)

<a name="client-error-how-often-client-error-alerts-run"></a>
### How often client error alerts run

Currently error percentage alerts run every 15 minutes and error message alerts run every 5 minutes assessing the previous 60 minute of data.

<a name="create-regression"></a>
## Create regression

The alerts can be configured for create blade extension on different environments including national clouds.

<a name="create-regression-configuration-3"></a>
### Configuration

At a high level you define;

1. N number of environment within "environments" property like the below.
2. The create configuration for the alerts within that environment

```json
{
    "extensionName": "Your_Extension_Name",
    "enabled": true,
    "environments": [
        {
            "environment": ["portal.azure.com", "portal.azure.cn"],
            "availability": [...],
            "clientError": [...],
            "create": [
                 {
                    "type": "regression",
                    "enabled": true,
                    "criteria": [
                       ...
                    ]
                }
            ],
            "performance": [...],
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

<a name="create-regression-configuration-3-what-is-environments-3"></a>
#### What is environments

"environments" property is an array. Each of its elements represents a set of alerting critiera for an environment.

<a name="create-regression-configuration-3-what-is-environment-3"></a>
#### What is environment

"environment" property is an array. Its supported value is portal.azure.com or ms.portal.azure.com or portal.azure.cn or canary.portal.azure.com
or any other legit portal domain name, a.k.a., national cloud domain names are supported too. Mutiple values can be set for an "environment" property.

<a name="create-regression-configuration-3-what-is-enabled-3"></a>
#### What is enabled

"enabled" property is used to enable (when "enabled" is true) or disable ("enabled" is false) alerts on various level
depending on where it's located in customization json. For details, see "enabled" property in json snippet.

You can define N number of criteria like the below.

```json
{
    "severity": 3,
    "enabled": true,
    "bladeName": ["CreateBlade"],
    "minSuccessRateOverPast24Hours":94.0,
    "minSuccessRateOverPastHour":94.0,
    "minTotalCountOverPast24Hours":50,
    "minTotalCountOverPastHour":3
}
```

<a name="create-regression-configuration-3-what-is-severity-3"></a>
#### What is severity

This is the severity value that an IcM alert would have when an alert is fired.

<a name="create-regression-configuration-3-what-is-bladename"></a>
#### What is bladeName

The list of the create blade name.

<a name="create-regression-configuration-3-what-is-minsuccessrateoverpast24hours"></a>
#### What is minSuccessRateOverPast24Hours

This is the minimum create blade success rate over the past 24 hours.

<a name="create-regression-configuration-3-what-is-minsuccessrateoverpasthour"></a>
#### What is minSuccessRateOverPastHour

This is the minimum create blade success rate over the past hour.

<a name="create-regression-configuration-3-what-is-mintotalcountoverpast24hours"></a>
#### What is minTotalCountOverPast24Hours

This is the minimum number of create that gets kicked off over the past 24 hours.

<a name="create-regression-configuration-3-what-is-mintotalcountoverpasthour"></a>
#### What is minTotalCountOverPastHour

This is the minimum number of create that gets kicked off over the past hour.

<a name="create-regression-how-often-do-create-alerts-run"></a>
### How often do create alerts run

Every 60 minutes, we get create successRate and create totalCount for the last 60 minutes and the last 24 hours.

Alerts will only trigger when the following criteria are met.

1. Hourly create successRate is below {minSuccessRateOverPastHour} and hourly create totalcount is above {minTotalCountOverPastHour}
1. 24-hour create successRate is below {minSuccessRateOverPast24Hours} and 24-hour create totalcount is above {minTotalCountOverPast24Hours}



<a name="how-do-i-onboard"></a>
## How do I onboard


1. Submit and complete a Pull Request in [Azure Portal Alerting Repo a.k.a. Alerting Repo](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx-Alerting).

> For non-create alert the customization JSON should be located at `products/{YourServiceNameInIcM}/{ExtensionName}.alerting.json`. It's recommended to have an `owners.txt` in the same folder as the customization JSON file. The `owners.txt` has AAD enabled email alias or/and individual MSFT aliases. Anyone from `owners.txt` can approve the Pull Request for any changes within that folder or its subfolder.

> For create alert the customization JSON should be located at `products/IbizaFx/Create/{ExtensionName}.create.alerting.json`.


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

> Depending on the alert you're correlating you will need to use the corresponding correlation id

| Alert | Correlation ID |
| ----- | -------------- |
| Create - Regression | CreateBladeSuccessRate |
| Error - AffectedUserPercentage | ErrorAffectedUserPercentage |
| Error - Message | ErrorMessage |
| Availability - Extension | ExtensionLoadAvailability |
| Availability - Blade | BladeLoadAvailability |
| Availability - Part | PartLoadAvailability |
| Performance - Extension | ExtensionLoadPerformance |
| Performance - Blade | BladeLoadPerformance |
| Performance - Part | PartLoadPerformance|

<a name="how-do-i-know-my-extension-s-current-configuration"></a>
## How do I know my extension&#39;s current configuration

Alerting is running off customization JSONs that live in [Alerting Repo](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx-Alerting). All the non-create alerts customimzation JSONs are located at `products/{YourServiceNameInIcM}/{ExtensionName}.alerting.json`. All the create alerts customization JSONs are located at `products/IbizaFx/Create/{ExtensionName}.create.alerting.json`.

<a name="what-happens-if-i-need-to-update-my-configuration"></a>
## What happens if I need to update my configuration

Submit and complete a Pull Request on your extension's customization JSON in [Alerting Repo](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx-Alerting). The update is 'live' once the Pull Request is complete.

> For each extension there's an `owners.txt` that is in the same or parent folder as the JSON. The `owners.txt` has AAD enabled email alias or/and individual MSFT aliases. Anyone from `owners.txt` can approve the Pull Request. The `owners.txt` is created and maintained by extension team.

<a name="what-happens-if-i-need-to-update-my-configuration-how-is-mapping-done-from-extension-name-to-icm-team-and-service-names"></a>
### How is mapping done from extension name to IcM team and service names

Azure Portal partner team's IcM info is collected during parnter onboarding process and is stored in the [extension config](https://aka.ms/portalfx/extensionsprodjson). An IcM routing rule is added under Azure Portal (Ibiza) service in IcM to route incidents to corresponding partners.

> The IcM routing rule is in format 'AIMS://AZUREPORTAL\Portal\{ExtensionName}'.

<a name="what-happens-if-i-need-to-update-my-configuration-how-to-enable-alerts-for-national-clouds"></a>
### How to enable alerts for national clouds

Alerts are supported in national clouds. Specify the national cloud portal domain names in "environment" property. You can use the same criteria for national clouds or different set of criteria.The national cloud domain names are "portal.azure.cn", "portal.azure.us", "portal.microsoftazure.de". You can use any legit national cloud domain name, for instance, "aad.portal.azrue.cn".

```json
{
   ...
    "environments": [
        {
            "environment": ["portal.azure.com", "ms.portal.azure.com", "portal.azure.cn"],
            ...
        },
        {
            "environment": ["portal.azure.cn","portal.azure.us", "portal.microsoftazure.de"],
            ...
        },
        {
            "environment": ["portal.azure.us", "portal.microsoftazure.de"],
            ...
        }
        ...
    ]
    ...
}
```

<a name="timezone-based-alerting"></a>
## Timezone based alerting

As Ibiza has extension developers spread across the world, we have a mechanism to trigger alerts in the business hours of the extension team. Currently, the alerts supported for timezone based alerting are -
1. SDK Age alerts.

For all other alerts, the extension owner cannot pick a timezone and will be alerted as soon as the alert trigger conditions are met.

To configure timezone based alerting, you need to specify a `businessHourStartTimeUtc` property in the alerting config. The value takes an integer value from `0` to `23` as a string. The value represents the UTC hour at which business hours start in the extension team's region.

When an alert is triggered, the Ibiza team guarentees that you will receive it within 6 hours of the hour configured as `businessHourStartTimeUtc`.

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

If no value is specified for `businessHourStartTimeUtc`, alerts are triggered in PST business hours by default.

<a name="timezone-based-alerting-how-partners-route-alerts-to-another-team-in-icm"></a>
### How partners route alerts to another team in IcM

By default all the alerts are fired against Azure Portal (IbizaFx) team and IbizaFx team maintains an IcM routing table by which alerts are routed to different services and teams. Since IcM does not support secondary routing, once extension partners receive an IcM, they can't route it to another service or team in IcM even if they have their own IcM routing table. The workaround is to fire alerts directly to you (the extension partner) in IcM, which requires your team to create a custom connector in IcM, onboard a certificate to it and add connector Id into customization JSON.

[*If your extension is comprised of sub-teams*] - With this setup you would also be able to route these alerts to your team's ICM and then you will be able to setup your own routing rules, which can check the blade name, or other properties, and then route to the appropriate sub-team.

<a name="timezone-based-alerting-how-partners-route-alerts-to-another-team-in-icm-step-1"></a>
#### Step 1

Onboard an IcM connector per cloud instance following the IcM doc [Onboard a connector for a Service][1]. Alerting service will use the IcM connector under your service to inject IcM incidents directly to your service in IcM. Only the service admin has the rights to onboard a new or update an existing connector or update the certificate.

Certificate is used by IcM service to authenticate with the alerting service who sends incidents to IcM service. Certificate need to be uploaded on connector on-boarding page. Currently the certificate being used was issued from ssladmin. It's an unmanaged cert. It can be downloaded from [ssladmin site][2].

We're working on auto-rotate the cert before the current unmanaged cert expires on 03/03/2020. If by the time you read this and it's after 03/03/2020, it means this doc should have been updated and has not. Please reach out to azurefxg@microsoft.com for the link to managed cert.

[![enter image description here][3]][3]
[![enter image description here][4]][4]

<a name="timezone-based-alerting-how-partners-route-alerts-to-another-team-in-icm-step-2"></a>
#### Step 2

Once IcM connectors are created, the next step is to submit and complete a PR of adding **IcM connector info** into alerting customization JSON to let alerting service know what connector is used when sending incidents for that extension. The supported cloud values are Public, BlackForest, Fairfax or Mooncake.

If one or more **clouds** are not specified in customization JSON, the IcM incidents will be created and sent to Azure Portal (IbizaFx) team through IbizaFx's IcM connector for the cloud instance(s) that're not specified in the extension's customization JSON. And IbizaFx's IcM routing rule auto-routes the incidents to the corresponding service and team in IcM

```json
{
   "extensionName":"Microsoft_Azure_{MyExtension}",
   "enabled":true,
   "**icmConnectors**":[
      {
         "connectorId":"12345678-abcd-abcd-abcd-123456789012",
         "**cloud**":"Public"
      },
      {
         "connectorId":"87654321-dcba-dcba-dcba-210987654321",
         "**cloud**":"Mooncake"
      },
      ...
   ],
   "environments":[
      ...
   ]
}
```

**The alerting service will be sending out IcM through customized connectors once step 2 is complete**

<a name="timezone-based-alerting-how-partners-route-alerts-to-another-team-in-icm-step-3"></a>
#### Step 3

The last step is to create routing rules to route different IcMs to different teams in IcM site.

  [1]: https://icmdocs.azurewebsites.net/developers/Connectors/ConnectorOnboarding.html
  [2]: https://ssladmin/Details/2849443
  [3]: https://stackoverflow.microsoft.com/images/a/2b260f70-aa31-4f04-8ccb-862bd64b6519.png
  [4]: https://stackoverflow.microsoft.com/images/a/9bf653db-719b-466b-bb70-69129708f78b.png


<a name="performance"></a>
# Performance

The alerts can be configured for extension performance, blade performance and part performance on different environments including national clouds.

<a name="performance-configuration"></a>
## Configuration

At a high level you define;

1. N number of environment within "environments" property like the below.
2. The performance configuration for the alerts within that environment

```json
{
    "extensionName": "Your_Extension_Name",
    "enabled": true,
    "environments": [
        {
            "environment": ["portal.azure.com", "portal.azure.cn"], // National clouds are supported.
            "availability": [...], // Optional. Add it when you want to enable availability alerts.
            "clientError": [...], // Optional. Add it when you want to enable client error alerts.
            "create": [...], // Optional. Add it when you want to enable create alerts.
            "performance": [
                 {
                    "type": "extension", // Support value, "extension", "blade" or "part".
                    "enabled": true, // Enable or disable extension type alerts for Your_Extension_Name.
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
### What is environments?
"environments" property is an array. Each of its elements represents a set of alerting critiera for an environment.

<a name="performance-configuration-what-is-environment"></a>
### What is environment?

"environment" property is an array. Its supported value is portal.azure.com or ms.portal.azure.com or portal.azure.cn or canary.portal.azure.com 
or any other legit portal domain name, a.k.a., national cloud domain names are supported too. Mutiple values can be set for an "environment" property.

<a name="performance-configuration-what-is-enabled"></a>
### What is enabled?
"enabled" property is used to enable (when "enabled" is true) or disable ("enabled" is false) alerts on various level 
depending on where it's located in customization json. For details, see "enabled" property in json snippet.

You can define N number of criteria like the below.

```json
{
    "severity": 3, // Support value 0, 1, 2, 3 or 4.
    "enabled": true, // Enable or disable this criteria.
    "percentile": 95, // Support value 80 or 95.
    "percentileDurationThresholdInMilliseconds": 4000,
    "minAffectedUserCount": 10,
    "bottomMinAffectedUserCount": 2,
    "namePath": ["*"], // Only support for blade or part type.
    "exclusion": [
        "Extension/Your_Extension_Name/Blade/BladeNameA",
        "Extension/Your_Extension_Name/Blade/BladeNameB"], // Only support for blade or part type.
    "safeDeploymentStage": ["3"], // Optional. It does not support asterisk("*") sign.
    "datacenterCode": ["AM"] // Optional.
}
```
<a name="performance-configuration-what-is-severity"></a>
### What is severity?

This is the severity value that an IcM alert would have when an alert is fired.

<a name="performance-configuration-what-is-percentile"></a>
### What is percentile?

This is at which percentile you want to measure the performance. Today the only options are 80 or 95.

<a name="performance-configuration-what-is-percentiledurationthresholdinmilliseconds"></a>
### What is percentileDurationThresholdInMilliseconds?

This is the minimum duration (in milliseconds) when {percentile}% of users is above the {percentileDurationThresholdInMilliseconds}.

<a name="performance-configuration-what-is-minaffectedusercount"></a>
### What is minAffectedUserCount?

This is the minimum number of users whose load duration is above {percentileDurationThresholdInMilliseconds}.

<a name="performance-configuration-what-is-bottomminaffectedusercount"></a>
### What is bottomMinAffectedUserCount?

This is used as a threshold to trigger an alert if the {percentile} defined is greater than or
equal to __double__ of the {percentileThreshold} defined.

> This is defaulted to 20% of {minAffectedUserCount}.

This is used to catch any unusual spikes on the weekends/low traffic periods.

<a name="performance-configuration-what-is-namepath"></a>
### What is namePath?

This only applies to blades or parts and defines what blades or parts to alert on, you can either use an asterisk("*") sign to include 
all the blades or parts within your extension or specify a list of full blade or part names to alert on. The percentileDurationThresholdInMilliseconds, minAffectedUserCount and bottomMinAffectedUserCount specified in critiera are for individual blades or parts.

<a name="performance-configuration-what-is-exclusion"></a>
### What is exclusion?

This only applies to blades or parts and defines what blades or parts you wish to exclude.

<a name="performance-configuration-what-is-safedeploymentstage"></a>
### What is safeDeploymentStage?

Safe deployment stage can be "0", "1", "2", or "3". Each stage has a batch of regions. It does not support asterisk("*") sign.
Safe deployment stage is optional. If you don't specify the safe deployment stage property in critera, when alerting calculates percentileDuration and affectedUserCount, it does not take safe deployment stage into consideration. So you won't have percentileDuration and affectedUserCount per safe deployment stage. For such a case, percentileDurationThresholdInMilliseconds, minAffectedUserCount and bottomMinAffectedUserCount specified in critiera are for all(combined, overall) the safe deployment stages. 
For the complete list of safe deployment stages and their regions, go to [https://aka.ms/portalfx/alerting/safe-deployment-stage][safe-deployment-stage]

<a name="performance-configuration-what-is-datacentercode"></a>
### What is datacenterCode?

Datacenter code can be "`*`", "AM", "BY", etc. "`*`" represents all Azure Portal Production regions.
Datacenter code is optional. If you don't specify the datacenterCode property in critera, when alerting calculates percentileDuration and affectedUserCount, it does not take datacenter into consideration. So you won't have percentileDuration and affectedUserCount per datacenter. For such a case percentileDurationThresholdInMilliseconds, minAffectedUserCount and bottomMinAffectedUserCount specified in critiera are for all(combined, overall) the datacenters. 
For the complete list of datacenter code names, go to [https://aka.ms/portalfx/alerting/datacenter-code-name][datacenter-code-name]

<a name="performance-configuration-when-do-the-alerts-trigger"></a>
### When do the alerts trigger?

Every 10 minutes, we get percentile load duration for the last 90 minutes. We get the most recent 6 sample points and calculate a weighted percentile load duration based on the following formula.

```
Weighted duration = 8/24 * {most recent percentile load duration} + 6/24 * {2nd most recent percentile load duration} + 4/24 * {3rd…} + 3/24 * {4th …} + 2/24 * {5th …} + 1/24 * {6th …}
```

Alerts will only trigger when one of the following criteria is met.

1. Weighted duration is above {percentileDurationThresholdInMilliseconds} and affected user count is above {minAffectedUserCount}
1. Weighted duration is above 2 * {percentileDurationThresholdInMilliseconds} and affected user count is above {bottomMinAffectedUserCount}

<a name="performance-configuration-is-national-cloud-supported"></a>
### Is National Cloud Supported?
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

<a name="performance-how-often-do-they-run"></a>
## How often do they run?

Currently performance alerts run every 10 minutes assessing the previous 90 minute of data.

<a name="performance-how-do-i-onboard"></a>
## How do I onboard?

1. Submit and complete a Pull Request in [Alerting Repo][alerting-dev-ops].
> For non-create alert the customization JSON should be located at products/{YourServiceNameInIcM}/{ExtensionName}.alerting.json. It's recommended to have an owners.txt in the same folder as the customization JSON file. The owners.txt has AAD enabled email alias or/and individual MSFT aliases. Anyone from owners.txt can approve the Pull Request for any changes within that folder or its subfolder.

> For create alert the customization JSON should be located at products/IbizaFx/Create/{ExtensionName}.create.alerting.json.
2. Set up correlation rules in ICM


| Field | Value |
| -----  | ----- |
| Routing ID | 'AIMS://AZUREPORTAL\Portal\\{ExtensionName}' |
| Correlation ID | Specific to alert, use table below to map |
| Mode | Hit count (recommended) |
| Match DC/Region | Checked |
| Match Slice | Checked |
| Match Severity | Checked |
| Match Role | Checked |
| Match Instance/Cluster | Checked |


| Alert | Correlation ID |
| ----- | -------------- |
| Performance - Extension | ExtensionLoadPerformance |
| Performance - Blade | BladeLoadPerformance |
| Performance - Part | PartLoadPerformance|

<a name="performance-how-do-i-know-my-extension-s-current-customization"></a>
## How do I know my extension&#39;s current customization?

Alerting is running off customization JSONs that live in [Azure Portal Alerting Repo a.k.a. Alerting Repo][alerting-dev-ops]. All the non-create alerts customimzation JSONs are located at products/{YourServiceNameInIcM}/{ExtensionName}.alerting.json. All the create alerts customization JSONs are located at products/IbizaFx/Create/{ExtensionName}.create.alerting.json.

<a name="performance-what-happens-if-i-need-to-update-them"></a>
## What happens if I need to update them?

Submit and complete a Pull Request on your extension's customization JSON in [Alerting Repo][alerting-dev-ops]. The update is 'live' once the Pull Request is complete.
> For each extension there's an owners.txt that is in the same or parent folder as the JSON. The owners.txt has AAD enabled email alias or/and individual MSFT aliases. Anyone from owners.txt can approve the Pull Request. The owners.txt is created and maintained by extension team.

<a name="performance-questions-and-suggestions"></a>
## Questions and suggestions?
Contact [Azure Ibiza Fx Gauge Team](mailto:azurefxg@microsoft.com).

[datacenter-code-name]: https://aka.ms/portalfx/alerting/datacenter-code-name
[safe-deployment-stage]: https://aka.ms/portalfx/alerting/safe-deployment-stage
[alerting-dev-ops]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFX-Alerting
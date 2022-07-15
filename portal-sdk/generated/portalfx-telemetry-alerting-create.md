<a name="create"></a>
# Create

The alerts can be configured for create blade extension on different environments including national clouds.

<a name="create-configuration"></a>
## Configuration

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
            "availability": [...], // Optional
            "clientError": [...], // Optional.
            "create": [
                 {
                    "type": "regression",
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

<a name="create-configuration-what-is-environments"></a>
### What is environments?
"environments" property is an array. Each of its elements represents a set of alerting critiera for an environment.

<a name="create-configuration-what-is-environment"></a>
### What is environment?

"environment" property is an array. Its supported value is portal.azure.com or ms.portal.azure.com or portal.azure.cn or canary.portal.azure.com
or any other legit portal domain name, a.k.a., national cloud domain names are supported too. Mutiple values can be set for an "environment" property.

<a name="create-configuration-what-is-enabled"></a>
### What is enabled?
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
<a name="create-configuration-what-is-severity"></a>
### What is severity?

This is the severity value that an IcM alert would have when an alert is fired.

<a name="create-configuration-what-is-bladename"></a>
### What is bladeName?

The list of the create blade name.

<a name="create-configuration-what-is-minsuccessrateoverpast24hours"></a>
### What is minSuccessRateOverPast24Hours?

This is the minimum create blade success rate over the past 24 hours.

<a name="create-configuration-what-is-minsuccessrateoverpasthour"></a>
### What is minSuccessRateOverPastHour?

This is the minimum create blade success rate over the past hour.

<a name="create-configuration-what-is-mintotalcountoverpast24hours"></a>
### What is minTotalCountOverPast24Hours?

This is the minimum number of create that gets kicked off over the past 24 hours.

<a name="create-configuration-what-is-mintotalcountoverpasthour"></a>
### What is minTotalCountOverPastHour?

This is the minimum number of create that gets kicked off over the past hour.

<a name="create-configuration-when-do-the-alerts-trigger"></a>
### When do the alerts trigger?

Every 60 minutes, we get create successRate and create totalCount for the last 60 minutes and the last 24 hours.

Alerts will only trigger when the following criteria are met.

1. Hourly create successRate is below {minSuccessRateOverPastHour} and hourly create totalcount is above {minTotalCountOverPastHour}
1. 24-hour create successRate is below {minSuccessRateOverPast24Hours} and 24-hour create totalcount is above {minTotalCountOverPast24Hours}

<a name="create-configuration-is-national-cloud-supported"></a>
### Is National Cloud Supported?
Alerts are supported in national clouds. Specify the national cloud portal domain names in "environment" property. You can use the same criteria for national clouds or different set of criteria.The national cloud domain names are "portal.azure.cn", "portal.azure.us". You can use any legit national cloud domain name, for instance, "aad.portal.azrue.cn".
```json
{
   ...
    "environments": [
        {
            "environment": ["portal.azure.com", "ms.portal.azure.com", "portal.azure.cn"],
            ...
        },
        {
            "environment": ["portal.azure.cn","portal.azure.us"],
            ...
        },
        {
            "environment": ["portal.azure.us"],
            ...
        }
        ...
    ]
    ...
}
```

<a name="create-how-often-do-they-run"></a>
## How often do they run?

Currently alerts run every 60 minutes assessing the previous 60 minute and previous 24 hours of data.

<a name="create-how-do-i-onboard"></a>
## How do I onboard?

1. Submit and complete a Pull Request in [Alerting Repo][alerting-dev-ops].
> For non-create alert the customization JSON should be located at products/{YourServiceNameInIcM}/{ExtensionName}.alerting.json. It's recommended to have an owners.txt in the same folder as the customization JSON file. The owners.txt has AAD enabled email alias or/and individual MSFT aliases. Anyone from owners.txt can approve the Pull Request for any changes within that folder or its subfolder.

> For create alert the customization JSON should be located at products/IbizaFx/Create/{ExtensionName}.create.alerting.json.
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


| Alert | Correlation ID |
| ----- | -------------- |
| Create - Regression | CreateBladeSuccessRate |

<a name="create-how-do-i-know-my-extension-s-current-customization"></a>
## How do I know my extension&#39;s current customization?

Alerting is running off customization JSONs that live in [Azure Portal Alerting Repo a.k.a. Alerting Repo][alerting-dev-ops]. All the non-create alerts customimzation JSONs are located at products/{YourServiceNameInIcM}/{ExtensionName}.alerting.json. All the create alerts customization JSONs are located at products/IbizaFx/Create/{ExtensionName}.create.alerting.json.

<a name="create-what-happens-if-i-need-to-update-them"></a>
## What happens if I need to update them?

Submit and complete a Pull Request on your extension's customization JSON in [Alerting Repo][alerting-dev-ops]. The update is 'live' once the Pull Request is complete.
> For each extension there's an owners.txt that is in the same or parent folder as the JSON. The owners.txt has AAD enabled email alias or/and individual MSFT aliases. Anyone from owners.txt can approve the Pull Request. The owners.txt is created and maintained by extension team.

<a name="create-questions-and-suggestions"></a>
## Questions and suggestions?
Contact [Azure Ibiza Fx Gauge Team](mailto:azurefxg@microsoft.com).

[alerting-onboarding]: https://aka.ms/portalfx/alerting-onboarding
[alerting-dev-ops]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFX-Alerting

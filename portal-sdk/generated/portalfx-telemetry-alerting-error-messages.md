<a name="client-error"></a>
# Client Error

There are two high level types of client error alerts, error percentage and error message on different environments including national clouds.
1. Error percentage alerts fire when the percentage of users experiencing any error(s) is above the defined threshold.
2. Error message alerts fire on specified error messages.

<a name="client-error-configuration"></a>
## Configuration

At a high level you define:

1. An environment for the alerts to run against. See definition [below](#client-error-configuration-what-is-environment)
2. The error configuration for the alerts within that environment

```json
{
    "extensionName": "Your_Extension_Name",
    "enabled": true,
    "environments": [
        {
            "environment": ["portal.azure.com", "portal.azure.cn"], // National clouds are supported.
            "availability": [...], // Optional. Add it when you want to enable availability alerts.
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
            "create": [...], // Optional. Add it when you want to enable create alerts.
            "performance": [...], // Optional. Add it when you want to enable performance alerts.
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
### What is environments?
"environments" property is an array. Each of its elements represents a set of alerting critiera for an environment.

<a name="client-error-configuration-what-is-environment"></a>
### What is environment?

"environment" property is an array. Its supported value is portal.azure.com or ms.portal.azure.com or portal.azure.cn or canary.portal.azure.com
or any other legit portal domain name, a.k.a., national cloud domain names are supported too. Mutiple values can be set for an "environment" property.

<a name="client-error-configuration-what-is-enabled"></a>
### What is enabled?
"enabled" property is used to enable (when "enabled" is true) or disable ("enabled" is false) alerts on various level
depending on where it's located in customization json. For details, see "enabled" property in json snippet.

> Among "message" and "percentage" types, you can choose to have one type or two types. Per each of those, you can define a set of criteria like the below. You can define N number of criteria.

<a name="client-error-configuration-percentage"></a>
### Percentage

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
                    "type": "or", // Only support value "and", "or".
                    "message1":"eastus2stage",
                    "message2":"eastus2(stage)"
                },
                "safeDeploymentStage": ["3"], // Optional. It does not support asterisk("*") sign.
                "datacenterCode": ["AM"] // Optional.
            },
            ...
        ]
    },
   ...
]
```

<a name="client-error-configuration-message"></a>
### Message

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
                "checkAllNullRefs": true, // Optional.
                "message1": "Cannot read property", // Optional.
                "message2": "of null", // Optional.
                "minAffectedUserCount": 1,
                "exclusion": {
                    "type": "or", // Only support value "and", "or".
                    "message1":"eastus2stage",
                    "message2":"eastus2(stage)"
                },
                "safeDeploymentStage": ["3"], // Optional. It does not support asterisk("*") sign.
                "datacenterCode": ["AM"] // Optional.
            },
            ...
        ]
    },
   ...
]
```

<a name="client-error-configuration-what-is-severity"></a>
### What is severity?

This is the severity value that an IcM alert would have when an alert is fired.

<a name="client-error-configuration-what-is-minaffecteduserpercentage"></a>
### What is minAffectedUserPercentage?

This is the minimum number of percentage of users affected by any client error.

<a name="client-error-configuration-what-is-minaffectedusercount"></a>
### What is minAffectedUserCount?

This is the minimum number of users affected by any client error.

<a name="client-error-configuration-what-is-checkallnullrefs"></a>
### What is checkAllNullRefs?
When it's true, alert checks all the null refs client errors. You can still specify message1, message2, etc. They're additional conditions. 'checkAllNullRefs' property is optional.

<a name="client-error-configuration-what-is-message1-message2-message3-in-criteria-element-for-error-message-alerts"></a>
### What is message1, message2, message3 in criteria element for error message alerts?
This is the error string that error message alerts check if it existis in client error logs, specifically in [message] column at (Client|Ext)Events log table. They're logical AND relations. To count as an error, all the messages that specified in criteria element have to be present in a client error message([message] column at (Client|Ext)Events log table). You can specify up to 3 messages in one criteria.

<a name="client-error-configuration-what-is-exclusion"></a>
### What is exclusion?
This specifies condition(s) that alerts do not count as a client error. You can specify it for both error percentage and error message alerts.

<a name="client-error-configuration-what-is-message1-message2-message3-in-the-exclusion-property"></a>
### What is message1, message2, message3 in the exclusion property?
This is the error string(s) that alerts would not count it as a client error when they're present in a client error message([message] column at (Client|Ext)Events log table). You can specify up to 3 messages in "exclusion" property.

<a name="client-error-configuration-what-is-type-in-the-exclusion-property"></a>
### What is type in the exclusion property?
This is the logical operator for messages in "exclusion" property. Its supported value is "and" or "or". "and" means when all the messages specified in "exclusion" property are present in a client error message, error alerts would not count it as a client error. "or" means when any of the messages specified in "exclusion" property is present in a client error message, error alerts would not count it as a client error.

<a name="client-error-configuration-what-is-safedeploymentstage"></a>
### What is safeDeploymentStage?

Safe deployment stage can be "0", "1", "2", or "3". Each stage has a batch of regions. It does not support asterisk("*") sign.
Safe deployment stage is optional. If you don't specify the safe deployment stage property in critera, when alerting calculates affectedUserCount, affectedUserPercentage, it does not take safe deployment stage into consideration. So you won't have affectedUserCount or affectedUserPercentage per safe deployment stage. For such a case, minAffectedUserCount or minAffectedUserPercentage specified in critiera are for all(combined, overall) the safe deployment stages.
For the complete list of safe deployment stages and their regions, go to [https://aka.ms/portalfx/alerting/safe-deployment-stage][safe-deployment-stage]

<a name="client-error-configuration-what-is-datacentercode"></a>
### What is datacenterCode?

Datacenter code can be "`*`", "AM", "BY", etc. "`*`" represents all Azure Portal Production regions.
Datacenter code is optional. If you don't specify the datacenterCode property in critera, when alerting calculates affectedUserCount or affectedUserPercentage, it does not take datacenter into consideration. So you won't have affectedUserCount or affectedUserPercentage per datacenter. For such a case, minAffectedUserCount or minAffectedUserPercentage specified in critiera are for all(combined, overall) the datacenters.
For the complete list of datacenter code names, go to [https://aka.ms/portalfx/alerting/datacenter-code-name][datacenter-code-name]

<a name="client-error-configuration-is-national-cloud-supported"></a>
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

<a name="client-error-how-often-do-they-run"></a>
## How often do they run?

Currently error percentage alerts run every 15 minutes and error message alerts run every 5 minutes assessing the previous 60 minute of data.

<a name="client-error-how-do-i-onboard"></a>
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
| Error - AffectedUserPercentage | ErrorAffectedUserPercentage |
| Error - Message | ErrorMessage |

<a name="client-error-how-do-i-know-my-extension-s-current-customization"></a>
## How do I know my extension&#39;s current customization?

Alerting is running off customization JSONs that live in [Azure Portal Alerting Repo a.k.a. Alerting Repo][alerting-dev-ops]. All the non-create alerts customimzation JSONs are located at products/{YourServiceNameInIcM}/{ExtensionName}.alerting.json. All the create alerts customization JSONs are located at products/IbizaFx/Create/{ExtensionName}.create.alerting.json.

<a name="client-error-what-happens-if-i-need-to-update-them"></a>
## What happens if I need to update them?

Submit and complete a Pull Request on your extension's customization JSON in [Alerting Repo][alerting-dev-ops]. The update is 'live' once the Pull Request is complete.
> For each extension there's an owners.txt that is in the same or parent folder as the JSON. The owners.txt has AAD enabled email alias or/and individual MSFT aliases. Anyone from owners.txt can approve the Pull Request. The owners.txt is created and maintained by extension team.

<a name="client-error-questions-and-suggestions"></a>
## Questions and suggestions?
Contact [Azure Ibiza Fx Gauge Team](mailto:azurefxg@microsoft.com).

[datacenter-code-name]: https://aka.ms/portalfx/alerting/datacenter-code-name
[safe-deployment-stage]: https://aka.ms/portalfx/alerting/safe-deployment-stage
[alerting-dev-ops]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFX-Alerting

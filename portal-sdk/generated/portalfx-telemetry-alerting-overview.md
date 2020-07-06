<a name="overview"></a>
# Overview
<a name="overview-what-are-the-alerts"></a>
## What are the alerts?

There are number of framework level provided alerts:

1. Extension SDK age (Sev3 IcM incdient for an extension when its SDK is older than 60 days and Sev2 for over 90 days)
1. Extension alive
1. Create regression
1. Availability
1. Performance
1. Client Error

The framework provides a per extension configurable alerting infrastructure, this will cover:

1. Create
1. Availability
1. Performance
1. Client Error

Once the thresholds for any of the configured alerts are met or surpassed a ICM alert containing details will be opened agaisnt the owning team.

<a name="overview-what-is-configurable"></a>
## What is configurable?

Each area will be configurable to it's own extent, allowing various levels of custom configuration.

<a name="overview-is-national-cloud-supported"></a>
## Is National Cloud Supported?

Alerts are supported in national clouds by specifying national cloud portal domain names in "environment" property in alert customization Json. See the sub categories for further details. Its subject title is 'Is National Cloud Supported?'.

<a name="overview-how-mapping-is-done-from-extension-name-to-icm-team-and-service-names"></a>
## How mapping is done from extension name to IcM team and service names?

Azure Portal partner team's IcM info is collected during parnter onboarding process and is stored in spreadsheet at [https://aka.ms/portalfx/partners][partner-info-spreadsheet]. An IcM routing rule is added under Azure Portal (Ibiza) service in IcM to route incidents to corresponding partners.

> The IcM routing rule is in format 'AIMS://AZUREPORTAL\Portal\{ExtensionName}'.

[partner-info-spreadsheet]: https://aka.ms/portalfx/partners
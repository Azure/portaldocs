<a name="portal-as-a-service"></a>
# Portal as a Service

<a name="portal-as-a-service-what-is-portal-as-a-service"></a>
## What is Portal as a Service

Portal as a Service is a way to provide all the benefits of the Ibiza Portal to partner teams with the ability to brand and customize the experience.

The need for Portal as a Service came from partners wanting to leverage the capabilities and user experience of the Ibiza Portal without having to build their own portal or having to take on the task of maintaining the infrastructure required to host the portal.

<a name="portal-as-a-service-benefits-of-portal-as-a-service"></a>
## Benefits of Portal as a Service

Portal as a Service allows partners to:

- Provide targeted experience for their Service
- Selectively exclude Azure related services from the user interface
- Manage their Portal branding

<a name="portal-as-a-service-current-use-cases"></a>
## Current use cases

There are already several use cases for Portal as a Service.

<a name="portal-as-a-service-current-use-cases-intune-for-education"></a>
### Intune for Education

Url: [https://intuneeducation.portal.azure.com](https://intuneeducation.portal.azure.com)

The Intune team is developing a cloud-based tool to help administrators quickly deploy and manage devices, applications, and PC settings. This new offering will help teachers save time, improve student learning outcomes, and help to protect student data.

Customization:

- Intune for Education branding
- Browse curation to only show Intune for Education extension assets with own categorization
- Default favorites with custom ordering
- Curation of the parts gallery to only show desired parts
- Removed the Search toolbar
- Removed ability to share dashboards
- Only show client notifications emitted by the Intune for Education extension
- Default dashboard presenting pertaining Intune for Education parts

This portal is currently in private preview and will GA in the coming months.

<a name="portal-as-a-service-current-use-cases-azure-active-directory-aad"></a>
### Azure Active Directory (AAD)

Url: [https://aad.portal.azure.com](https://aad.portal.azure.com)

The AAD portal will serve as the landing place for Office 365 users without an Azure subscriptions to manage their Active Directories.

Customization:

- Azure Active Directory branding
- Browse curation to show AAD assets as well as Help and Support
- Set Light theme as default to match other AAD portals
- Default dashboard presenting pertaining AAD parts

<a name="portal-as-a-service-getting-started-onboarding"></a>
## Getting started / Onboarding

The work required to configure and launch a Portal using this model is a close collaboration between the Ibiza portal team and the partner team making the request. One of the main reasons for this is the fact that the configuration is driven by the portal and lives in the portal code as opposed to the partner's extension.

New portal instances are subject to review and approval by the Ibiza portal team. If you are interested in getting started please contact **Adam Abdelhamed** with the following information:

- Team name
- Custom domain (_domain_.portal.azure.com)
- Business justification

<a name="portal-as-a-service-developing-an-extension-for-portal-as-a-service"></a>
## Developing an extension for Portal as a Service

Extensions development does not have any specific requirements and any extension developed for the Ibiza Portal will work seamlessly. However, an extension can be registered to only load from a Portal as a Service instance and not be exposed in the Ibiza Portal.

<a name="portal-as-a-service-usage-telemetry"></a>
## Usage telemetry

The telemetry principles and delivery pipeline stay the same as for the Ibiza Portal.

For more information about Telemetry / Performance / Reliability, refer to the [telemetry documentation](portalfx-extension-monitor.md).

Filtering telemetry based on the custom portal can be done using the _'feature.browsecuration'_ flag value in the _Query_ column.

For example:

```sql
ClientTelemetry
| where PreciseTimeStamp > ago(1d)
| where requestUri startswith "https://your-domain.portal.azure.com"
```
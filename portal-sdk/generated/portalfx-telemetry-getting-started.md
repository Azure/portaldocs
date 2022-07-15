<a name="getting-started"></a>
# Getting Started

<a name="getting-started-pre-requisites"></a>
## Pre-requisites

- Kusto.Explorer: [Application](http://kusto-us/ke/Kusto.Explorer.application)

OR

- Kusto.WebExplorer: [Web Application](https://aka.ms/kwe) (public cloud only)

<a name="getting-started-kusto-cluster-information"></a>
## Kusto Cluster Information

Name: AzPortalPartner
- Cloud: Public
- Data Source: https://Azportalpartner.kusto.windows.net

<a name="getting-started-kusto-cluster-information-national-clouds-information"></a>
### National Clouds Information

>**Note:** We do not onboard for the national clouds.

Name: AzPortalMC
- Cloud: Mooncake
- Data Source: https://azportalmc2.chinaeast2.kusto.chinacloudapi.cn

Name: AzPortalFF
- Cloud: Fairfax
- Data Source: https://azportalff.kusto.usgovcloudapi.net

See the [National Clouds FAQ](#national-clouds) for more information

<a name="getting-started-user-access-and-permissions"></a>
## User Access and Permissions
>**Note:** access is database specific, i.e. access to one database does not indicate access to another in the cluster.

We do not grant individuals direct access to our Kusto Clusters. If you require manual access, you must first join your respective team's standard access group.
Your team should have a standard access group you can join from  [aka.ms/myaccess](https://aka.ms/myaccess) which is configured to inherit the required, valid permissions.

If you are having trouble gaining access, please see the [FAQ](#faq)

All Azure Employees should have access to our Kusto Clusters. Permissions are granted through inheritance of the top-level AAD Group. This group is **REDMOND\AZURE-ALL-PSV** for teams in C+AI and **REDMOND\AZURE-ALL-FPS** for all other orgs.

Though permissions are granted through these top-level groups, you may not join them directly. In order to acquire the permissions granted from these groups, you must join a group that inherits from one. This group is your team's group.

1. Visit [https://aka.ms/standardaccess](https://aka.ms/standardaccess)
1. On the standard access page you will find a table of team projects 'Active ​Azure  Team Projects'
1. Search the table for your team's group (if you are unware of which group to join ask your colleagues)
1. Once you have found the correct group join that group via [aka.ms/myaccess](https://aka.ms/myaccess) or reach out to team's support alias for further help.
1. Ensure your request has been approved. If you have been denied for any reason please follow up with the group support alias.

>**Note:** group access can take up to 24 hours to propogate.

<a name="getting-started-programmatic-access"></a>
## Programmatic Access
Please note that we already offer pretty extensive and customized alerting for extensions that may reduce (often eliminates) the need for you to request programmatic accesses. See https://aka.ms/portalfx/docs/alerting for more details.

**If there does not appear to be an existing product or service that meets your needs and/or requirements, please first email [Ibiza Telemetry](mailto:ibiza-telemetry@microsoft.com).** We are always working to increase our available services and need partners' help identifying new use cases.

If needs and/or requirements cannot be met without programmatic access to our cluster(s) we may, at our discretion, onboard partners to our dedicated follower cluster: **AzPortalPartner**. Access to the **AzurePortal**, **AzPtlCosmos**, and **hostingservice** databases are granted through this follower cluster.

> **Note:** Only Viewer (read) access will be provided for the requested database(s).

> **Note:** As part of the onboarding process, we will review your provided queries. Please provide all the queries you know will be executed as part of your access as part of the form.  Please also review the [Kusto Query Best Practices](https://kusto.azurewebsites.net/docs/query/best-practices.html) before submitting your queries.

<a name="getting-started-programmatic-access-onboard-request-process"></a>
### Onboard Request Process
To onboard programmatic access, please copy and paste the [Onboarding Request Form](#onboarding-request-form) in an e-mail to [azurefxg@microsoft.com](mailto:azurefxg@microsoft.com) with your answers in-line. We require all fields to be answer for our records.

Please make the subject line: Onboarding Request: *team name* (*list of databases needed*)
- e.g. Onboarding Request: Azure Gauge (AzurePortal, AzPtlCosmos)
- e.g. Onboarding Request: Azure Gauge (AzPtlCosmos)

Once all the information is received, the team will review the request. Questions, comments, and concerns will be returned to you via the same email thread.

<a name="getting-started-programmatic-access-onboard-request-process-onboard-request-approval"></a>
#### Onboard Request Approval
When your approval has been successfuly processed, you will recieve an email confirmation from a member of the [azurefxg@microsoft.com](mailto:azurefxg@microsoft.com) team.

When we approve the onboarding request, we’ll call you as an anti-phishing step. Your app ID will then be enabled with Viewer access for the requested databases. There is no propagation delay between enabling programmatic access and it taking effect.

Please note that Kusto is shared capacity system. As such, we have to reserve the right to shut down applications that put excessive load on the system. To date, we have never had to do this.

<a name="getting-started-programmatic-access-onboarding-request-form"></a>
### Onboarding Request Form
---
1. Have you emailed [Ibiza Telemetry](mailto:ibiza-telemetry@microsoft.com) to discuss the percieved gap between our standard offerings and your needs?

1. What is your team name?

1. Please provide a brief, but thorough, reason you require access.

1. To which database(s) (AzurePortal, AzPtlCosmos, hostingservice) will you need access?

1. Please acknowledge you understand that programmatic access to these databases potentially allows 'anonymous' access to the uncensored production logs, and your usage must not allow this.

1. Please acknowledge you are following Microsoft best practices for key storage. Typically, this means storing the certificate in KeyVault (not, for example, in source code repositories) and rotating the key at the appropriate frequency.

1. Please acknowledge your handling of **any** data you access must comply with Microsoft PII & GDPR policies.
    This means, but is no way limited to:
    - Not copying or downloading non-anonymized logs (even to secure systems, unless you have registered those systems with GDPR for deletion and export).
    - Not making available anonymous access by proxy. For example, a web site or other access mechanism that allows the caller (authed or not) to make non-Delegated requests as the service principal (example: a log search tool that connects directly as the Service Principal or dSTS Service Identity rather than using delegated auth)

1. Please acknowledge your application must not put excessive load on the cluster, particular over popular times (5-7pm PST, 0-1am UTC).

1. Please supply examples of the queries you will be executing, as well as the schedule/frequency.

1. What is the AAD App ID of your Service Principal or the dSTS App Id of your dSTS Service Identity?

1. If you are using an AAD Service Principal: please confirm your application uses certificate-based authentication for its Service Principal. See: [Creating a Certificate-backed Partner Service Principal](#creating-a-certificate-backed-partner-service-principal) for details.
	>**Note:** Certificate-based authentication is required. Your request will be denied until certificate-based authentication is used.

1. Please provide a contact e-mail for this application that we can reach out to in cases of outage, capacity planning, etc. This should be a team alias rather than an individual.

1. If you are using the [Kusto Client SDK](https://kusto.azurewebsites.net/docs/api/netfx/about-kusto-data.html) to connect, confirm your application sets ClientRequestProperties.Application to reflect your application name (older libraries, [no longer documented on Kusto](https://kusto.azurewebsites.net/docs/api/using_the_kusto_client_library.html)) or [embed it the ClientRequestId](https://kusto.azurewebsites.net/docs/api/netfx/request-properties.html#the-clientrequestid-x-ms-client-request-id-property) (newer libraries).

	>If you are using another access method that supports a similar feature (e.g. the REST API directly), please confirm use of the feature.

1. Do you need to create your own functions and tables (i.e. require write access) in Kusto? This will involve creating a dedicated database for your team which you will then be responsible for maintaining (and registering with the GDPR scanner, etc). If yes, then please provide a suitable database name. If you are not sure, start with No and change your mind to Yes later.
---
<a name="getting-started-faq"></a>
## FAQ

<a name="getting-started-faq-troubleshooting-user-access"></a>
### Troubleshooting User Access

<a name="getting-started-faq-troubleshooting-user-access-i-had-access-and-now-i-do-not"></a>
#### &quot;I had access and now I do not&quot;
Check [aka.ms/myaccess](https://aka.ms/myaccess) and identify if you are still part of a group with access to the database.
If you are part of an access group with valid permissions, check with the group's owner(s) to identify if there is a problem with your access.

Alternatively you can open command prompt and enter:
``` console
whoami /groups > temp.txt
notepad temp.txt
```
And search for **REDMOND\AZURE-ALL-PSV** or **REDMOND\AZURE-ALL-FPS**. If neither appear, then there is an issue with your access group. This must be resolved by the access group's owner. The group owner can be found at [aka.ms/standardaccess](aka.ms/standardaccess).

If you are not part of an access group with valid permissions, then you will need to regain access through the normal route.

If you have AME credentials, you may try using them to see if this resolves the issue.

Other possibilities:
- When did you joined your team's standard access group? Active Directory can take up to 48 hours to sync.
- There are known issues when connecting from any of the following:
	- A SAW device
	- Windows Server
	- Window 10 VM
- Try using the Kusto.Explorer (Desktop) Application if you are not already.

<a name="getting-started-faq-troubleshooting-user-access-i-do-not-know-which-group-to-join-or-i-cannot-find-a-group"></a>
#### &quot;I do not know which group to join&quot; or &quot;I cannot find a group&quot;
If you are unable to find a group to join within the table, you may need to create a new group. First confirm with your colleagues a group does not exist, the group may be named non-intuitively.

If there is still no group you can join, you will need to create a new group. To do this please follow documentation on [https://aka.ms/standardaccess](https://aka.ms/standardaccess). Look for the link named ['Azure RBAC Getting Started Guide'](https://aka.ms/portalfx/telemetryaccess/newgroup). There are various steps to follow, unfortunately the Ibiza team does not own this process. The standard access team have step by step videos you can use to follow along. If you need further assistance with creating a new group please contact the 'MyAccess' support team.

For all other questions please reach out to [Ibiza Telemetry](mailto:ibiza-telemetry@microsoft.com).

<a name="getting-started-faq-troubleshooting-user-access-errors-occurred-while-resolving-remote-entities-cluster-https-armprod-kusto-windows-net-database-armprod"></a>
#### Errors occurred while resolving remote entities. Cluster=&#39;<a href="https://Armprod.kusto.windows.net/&#39;">https://Armprod.kusto.windows.net/&#39;</a>, Database=&#39;ARMProd&#39;
Some of our functions and queries rely on external databases, such as ARM. If you plan to use these functions and/or queries, you will need to also onboard your service principal to the appropriate database.
>**Note:** Azure Gauge does not own any of these external tables and thus cannot onboard you to them.

<a name="getting-started-faq-national-clouds"></a>
### National Clouds

<a name="getting-started-faq-national-clouds-do-the-national-clouds-support-x"></a>
#### Do the National Clouds support X?
National Clouds do not support:
- PowerBI
- Kusto to MDM Scheduler
- Kusto WebExplorer
- Querying across clouds

If you have specific questions about a service or product, check directly with the owning team.

<a name="getting-started-faq-national-clouds-is-programmatic-access-supported-with-in-the-national-clouds"></a>
#### Is programmatic access supported with in the National Clouds?
Partner programmatic access currently is not provided due to us not having sufficient rights in clouds to support this.

It is worth noting AAD Service Principals are not available to Microsoft employees in National Clouds (only to the local vender). To connect with a National Cloud, you will need to use a dSTS Service Identity. These are supported in all clouds (including Public), so if you want to get a step up your code being National Cloud compatible, you can use these now. The Kusto documentation for this is at https://kusto.azurewebsites.net/docs/concepts/concepts_security_authn_dsts.html?#application-authentication-with-dsts

<a name="getting-started-faq-national-clouds-what-the-limits-to-using-national-clouds"></a>
#### What the limits to using National Clouds?
You must respect the national boundaries in place. Do not remove data from one cloud and move it to another. For example, you may not bulk export data to the public cloud to get around restrictions.

Loads on the national clouds mut be very light; Azure Gauge does not own any of the National Cloud databases and therefore cannot monitor or address issues.

<a name="getting-started-faq-what-is-the-future-of-the-partner-database"></a>
### What is the Future of the &#39;Partner&#39; Database
We previously provided a shared database called Partner for this purpose. We are decommissioning that model due to low take-up by partners, partners not respecting naming conventions in the shared space, a large number (literally in the 100s) of abandoned and 'V1/V2/V3' functions, permissions issues to edit functions, and partners tables causing false-positive GDPR S360 alerts to the gauge team.

Going forward, partners who demonstrate an unavoidable need to create their own functions and tables will be given a database of their own that the partner is admin on. The partner will be responsible for maintaining Security & GDPR compliance (including registration) of that database.

<a name="getting-started-resources"></a>
## Resources

<a name="getting-started-resources-obsolete-best-practices"></a>
### Obsolete Best Practices
>**Note:** With the move to follower clusters and other changes, the following advice is no longer relevant and can be ignored:
- *Prefixing you function and table names with your team identifier.* Since you own the database, you can adopt whatever conventions you like.
- *Runners executing through the Partner database rather against AzurePortal / AzPltCosmos databases directly.* This advice was to make it easier for us to identify and disable rouge application. In practice, it didn't work (most partners did not follow the advice, and we can usually identify the runner either by the application name or the nature of the query anyway).Please run through your query from whatever database makes most sense to you.

<a name="getting-started-resources-kusto-documentation-links"></a>
### Kusto Documentation &amp; Links

[Documentation](https://kusto.azurewebsites.net/docs)

[Kusto Discussions](http://idwebelements/GroupManagement.aspx?Group=KusTalk&Operation=join)

[Kusto Operations' Information Bot](aka.ms/gaia)

[Kusto Query Best Practices](https://kusto.azurewebsites.net/docs/query/best-practices.html)

<a name="getting-started-resources-kusto-tips-and-tricks"></a>
### Kusto Tips and Tricks
When testing your queries, you can see the performance cost of current query in the Query Summary tab of the results window. You can also see 30 days of history of queries you have run via *.show* queries command.

>**Note:** *where* and other clauses can be applied to the output of the *.show* command.

You can see the statistics and load history for the AzPortalPartner cluster at https://aka.ms/GaugePartnerCluster.

<a name="getting-started-resources-creating-a-certificate-backed-partner-service-principal"></a>
### Creating a Certificate-backed Partner Service Principal

<a name="getting-started-resources-creating-a-certificate-backed-partner-service-principal-pre-requisites-1"></a>
#### Pre-requisites
- A Base64-encoded X.509 Certificate (.cer) file with the certificate to be used.

<a name="getting-started-resources-creating-a-certificate-backed-partner-service-principal-steps"></a>
#### Steps
>**Note:** If you have custom / multiple tenants, make sure you are on the have switched back to the default Microsoft tenant first.

If you already have an application, you can skip forward to the PowerShell part

1. Go to https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApp.
1. Click 'New application registration'
1. Fill out the application registration.
    - Name: Your application's friendly name
    - Application Type: Choice only matters if you have users signing into your app. Pick the type most appropriate to you.
    - Sign-on URL / Redirect URL: Choice only matters if you have users signing into your app.
1. Click 'Create'.The creates the application and a default service principal. Make a note of the Application ID GUID.

Follow either method below to upload the generated certificate

1. UI
   1. Go to your AAD app in the portal UI (https://ms.portal.azure.com/#blade/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/RegisteredApps)
   2. Select 'Certificates & secrets' from the App's menu items
   3. Click 'Upload certificate'
   4. Find and upload your certificate
2. Powershell
   1. Install the [Azure Active Directory (MSOnline)](https://docs.microsoft.com/powershell/azure/active-directory/install-msonlinev1) CommandLets if you haven’t already, and open an elevated PowerShell prompt (an elevated shell is required to run New-MsolServicePrincipalCredential (step 3)).
   2. Execute the following code to get the public key from a cert file (feel free to get the public key another way, such as by thumbprint).

      ``` powershell
      $cer = New-Object System.Security.Cryptography.X509Certificates.X509Certificate
      $cer.Import("C:\temp\ServicePrincipalCertPublicKey.cer")
      $binCert = $cer.GetRawCertData()
      $credValue = [System.Convert]::ToBase64String($binCert);
      ```

   3. Connect to AAD, and get a reference to your application's SP, and add the certificate.

      ``` powershell
      import-module MSOnline
         Connect-MsolService
      $sp = Get-AzureRmADServicePrincipal -ServicePrincipalName yourApplicationId
      New-MsolServicePrincipalCredential -ObjectId $sp.Id -Type asymmetric -Value
      $credValue -StartDate $cer.GetEffectiveDateString() -EndDate
      $cer.GetExpirationDateString()
      ```

   Rotating a certificate is done by running the New-MsolServicePrincipalCredential for the new certificate, then removing (when ready to do so) the old certificate through Remove-MsolServicePrincipalCredential.

> **Note:** You may also use [AAD Managed Identities](https://azure.microsoft.com/en-us/blog/keep-credentials-out-of-code-introducing-azure-ad-managed-service-identity/) to add a service principal to an already existing application.

- - -
<a name="getting-started-contact-links"></a>
## Contact Links

[Ibiza Performance/ Reliability](mailto:ibiza-perf@microsoft.com;ibiza-reliability@microsoft.com) - Telemetry PM for Ibiza Performance and Reliability Telemetry

[Ibiza Create](mailto:ibiza-create@microsoft.com) - Telemetry PM for Ibiza Create Telemetry

[Azure Fx Gauge Team](mailto:azurefxg@microsoft.com) - Telemetry Team

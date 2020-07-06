
<a name="frequently-asked-questions"></a>
## Frequently Asked Questions

<a name="frequently-asked-questions-site-is-not-accessible"></a>
### Site is not accessible

***My site is not accessible from a custom URL in DogFood***

SOLUTION:  Verify that the configuration setting  `Microsoft.Portal.Framework.FrameworkConfiguration.AllowedParentFrame` is correctly set in your extension’s configuration file. Your extension will reject calls from pages from domains and subdomains of the values listed here. For example, a setting value of `df.onecloud.azure-test.net` will NOT allow calls from pages hosted at `df-myExtension.onecloud.azure-test.net`, but a setting of `onecloud.azure-test.net` will allow calls from both `df.onecloud.azure-test.net` and `df-myExtension.onecloud.azure-test.net`.

* * * 

<a name="frequently-asked-questions-default-favorites-list-do-not-match-the-submitted-list"></a>
### Default favorites list do not match the submitted list

***I changed the default favorites definition, but am still seeing the old one.***

SOLUTION: Default favorites are user-configurable and stored in `User Settings`. The system generates and saves the user's default favorites only if they haven’t been previously generated for the user. To force a refresh, reset your desktop.

* * *

<a name="frequently-asked-questions-shared-url-for-cloud-and-production"></a>
### Shared URL for cloud and production

***Can I point my Community Cloud and Production to the same extension URL?***

Yes, if the only difference between your Community Cloud and Production is branding the hiding of other extensions UI. 

However, a major reuse restriction is that you must serve the same PDL to both Production and your Community Cloud. You can serve a different domain-based configuration to the user’s browser,  as specified in `AuxDocs`, and you can review  `PortalContext.TrustedAuthorityHost` to determine the  environment from which the client is calling your extension.  However, you cannot change the behavior of server-to-server calls, and PDL is requested by servers.


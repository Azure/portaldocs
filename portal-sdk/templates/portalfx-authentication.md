### Overview 

The portal uses an internal provider for authentication and authorization. 

The built-in cloud auth provider uses Azure Active Directory (AAD), which also supports Microsoft Account (MSA, formerly Windows Live ID) users. Please refer to _Accessing claims from your server_, if your extension needs to differentiate between AAD and MSA users.

During sign-in, the portal obtains a token containing claims that identify the signed-in user and retrieves directories and subscriptions s/he has access to, if any.

 **NOTE:** Users can sign in without a subscription. Extensions must gracefully handle this case and return 0 assets when queried._


#### Sign in flow

The following is a high-level representation of the sign-in flow provided by the portal:

1. User browses to the portal
2. The portal redirects to AAD to sign in
3. AAD redirects to the portal with a token
4. The portal gets a list of directories the user has access to from ARM
5. The portal gets a list of subscriptions the user has access to from ARM
6. The portal signs the user into the last-used directory, the home directory for AAD accounts, or the first directory it gets from ARM for MSA accounts
7. Finally, the portal loads the Startboard and all extensions

## Calling ARM

### From client

The recommended practice is to use cross-origin resource sharing (CORS) for all of your non-aggregated, non-orchestrated calls. If you need to call multiple sources for a single piece of UI, you should use a server API to orchestrate/aggregate those calls.

From the extension client to call any server API , use the built-in `ajax()` function to communicate with your extension server. This function will attach a token targeted at ARM specific to your extension to the HTTP header. 
**Do not use `jQuery.ajax()`** &ndash; it will not properly authorize your requests.

**NOTE:** If you have a scenario that isn't supported by `ajax()`, you can use the `getAuthorizationToken()` function to obtain a token and manually attach it to your own request._

### From Server

To call ARM from your extension server, use the `WebApiClient` class. Like the client `ajax()` function, this class attaches a token targeted at ARM to the request on your behalf.

```cs
    Uri arm = new Uri("https://management.azure.com/...");  // arm endpoint
    using (var client = new Microsoft.Portal.Framework.ClientProxy.WebApiClient())
    {
        // ConfigureAwait(false) is recommended to not forcibly resume on the same thread it started on
        // var data = await client.GetAsync<...>(arm).ConfigureAwait(false);
    }
```

## Calling alternate resources 

**Only First Party Extensions (i.e. Internal/ Microsoft extensions that comply with Azure Privacy terms and conditions) are allowed to call alternate resources.  Third party extensions get an encrypted token that cannot be decrypted by services other than ARM so they cannot call alternate resources.**

If you are working on Internal / Microsoft extension but you are not sure that your extension scenarios comply with Azure terms and conditions then please reach out to [Ibiza LCA](mailto:ibiza-lca@microsoft.com).   

Calling alternate resources involves AAD Onboarding that can take 5-6 weeks so we recommend extension developers to think about this scenarios early in the design phase. 

#### From client
Only ibiza has the authority to mint tokens so in order to call external resourses extension developers need to request Ibiza to create the AAD and register the resources with Ibiza.
 
Here is an example that walks you through on how to enable Contoso_Extension, a sample extension, that can query Graph APIs from extension client :

1. To query graph API's, an extension owner would submit [RDTask](http://aka.ms/portalfx/newextension) to onboard AAD Application with the portal.AAD Onboarding can take 5-6 weeks so we recommend extension developers to think about this scenarios early in the design phase.
2. Once ibiza team has created the app in https://aadonboardingsiteppe.cloudapp.net/ you can reach out to  aadonboarding@microsoft.com to expedite the process.
3. Submit [RDTask](http://aka.ms/portalfx/newextension) to register the AAD Applciation created in Step 1 into the portal's extension config. This step can be done in parallel to Step 2.
   In this case the resourceAccess config for your extension in portal would look something like the following:

```json
{
    "name": "Contoso_Extension",
    "uri": "//stamp2.extension.contoso.com/Home",
    "uriFormat": "//{0}.extension.contoso.com/Home",
    "feedbackEmail": "extension.admin@contoso.com",
    "resourceAccess": [{
        "name": "",
        "resource": "https://management.core.windows.net/"
    }, {
        "name": "graph",
        "resource": "https://graph.windows.net"
    }]
}
```

4. Once the config changes are deployed in the requested (i.e. Dogfood/ PPE/ PROD) envirnonment then the extension will be able to request tokens for the graph resource using any of its data APIs

```ts
MsPortalFx.Base.Security.getAuthorizationToken({ resourceName: "graph" });

MsPortalFx.Base.Net.ajax({
    setAuthorizationHeader: { resourceName: "graph" }
});

new MsPortalFx.ViewModels.Controls.FileDownload.ViewModel(
    container,
    {
        context: ko.observable(new FileDownload.Context({
            ...
            addDefaultAuthorizationToken: {
                resourceName: "graph"
            },
            ...
        })),
    });

new MsPortalFx.ViewModels.FileDownloadCommand({
    authorizationOptions: {
        resourceName: "graph"
    }
});
```


**NOTE:** MsPortalFx.Base.Security.getAuthorizationToken(), MsPortalFx.Base.Net2.ajax(), MsPortalFx.ViewModels.FileDownloadCommand, and MsPortalFx.ViewModels.FileDownloadButton.ViewModel
provide the ability to request authorization tokens for named resources other than the default Azure Resource Manager

#### From Controller or Server-Side

In this scenario, extensions request a token targeted to the extension. Then the extension exchanges the token by calling AAD to communicate with alternate resources.

The workflow in this case will be a little different from the one we descrobed on the client side:


1. To query graph API's, an extension author needs to create AAD application on [https://aadonboardingsiteppe.cloudapp.net/](https://aadonboardingsiteppe.cloudapp.net/). AAD Onboarding can take 5-6 weeks so we recommend extension developers to think about this scenarios early in the design phase.
2. Once you have created the app you can reach out to  [aadonboarding@microsoft.com](aadonboarding@microsoft.com) to expedite the process.
3. Once you have the App Id submit [RDTask](http://aka.ms/portalfx/newextension) to register the AAD Applciation created in Step 1 into the portal's extension config. This step can be done in parallel to Step 2.
   In this case the resourceAccess config for your extension in portal would look something like the following:
```json
   {
        "name": "Contoso_Extension",
        "name": "Contoso_Extension",
        "uri": "//stamp2.extension.contoso.com/Home",
        "uriFormat": "//{0}.extension.contoso.com/Home",
        "resourceAccess": [{
            "name": "",
            "resource": "https://management.core.windows.net/"
        }, {
            "name": "self",
            "resource": "1a123abc-1234-1a2b-ab01-01ab01a1a1ab"
        }]
    }
```

Sample code for exchanging toke:

Add an extra parameter to ajax calls (setAuthorizationHeader = { resourceName: "self" }

Which means give me a token to myself and Ill exchange that token later

```cs
    MsPortalFx.Base.Net2.ajax({
        uri: "MyController/MyAction",
        setAuthorizationHeader: { resourceName: "self" }
    }).then((myData) => {
        // do work with data
    });
```

Controller code.

```cs
    // Get the token passed to the controller
    var portalAuthorizationHeader = PortalRequestContext.Current.GetCorrelationData<AuthorizationCorrelationProvider>();
    if (portalAuthorizationHeader == null) {
     // This should never happen, the auth module should have returned 401 if there wasnt a valid header present
     throw new HttpException(401, "Unauthorized");
    }

    // Exchange it for the token that should pass to downstream services
    var exchangedAuthorizationHeader = GetExchangedToken(portalAuthorizationHeader, intuneClientId, intuneClientCert, "https://graph.windows.net/");

    // Call downstream service with exchanged header
    var headers = new NameValueCollection();
    headers.Add("Authorization", exchangedAuthorizationHeader);
    webApiClient.GetAsync(uri, "MyOperation", headers);

    // Helper method to exchange tokens
    string GetExchangedToken(string portalAuthorizationHeader, string clientId, X509Certificate2 clientCertificate, string resource) {

        // proof that the intune extension is making the token request
     var clientAssertion = new ClientAssertionCertificate(clientId, clientCertificate);
    
     // proof that the request originated from the portal and is on behalf of a valid user
     var accessToken = GetAccessTokenFromAuthorizationHeader(portalAuthorizationHeader);
     var userAssertion = new UserAssertion(accessToken, "urn:ietf:params:oauth:grant-type:jwt-bearer"); 
    
     // the actual token exchange
     var exchangedToken = authContext.AcquireToken(resource, clientAssertion, userAssertion); 
    
     return exchangedToken.GetAuthorizationHeader();
    }

    string GetAccessTokenFromAuthorizationHeader(string authorizationHeader) {
     // The header will be in the form "Bearer eyMZ"
     // The access token in the last part of the header
     var separator = new char[] { ' ' };
     var accessToken = authorizationHeader.Split(separator, StringSplitOptions.RemoveEmptyEntries).LastOrDefault();
    
     return accessToken;
    }
```

### Accessing claims from your server

The token used to communicate with your server contains claims (key/value pairs) that identify the target and destination systems as well as the calling user. Reading claims can be accomplished from the server using the [ASP.NET claims API](http://msdn.microsoft.com/en-us/library/ee517271.aspx). To simplify development, the [HttpContext.User](http://msdn.microsoft.com/library/system.web.httpcontext.user.aspx) has been augmented with the most commonly used claims.

First, reference the following assemblies:

* Microsoft.Portal.AadCore.dll
* System.IdentityModel.Tokens.Jwt.dll

Second, add the following to your **web.config** file:

<!-- INTERNAL NOTE: copy settings from src\StbPortal\Extensions\AzureHubsExtension\Web.config -->

```xml
<!-- deny anonymous users -->
<system.web>
    <authorization>
      <deny users="?" />
    </authorization>
</system.web>

<!-- allow the home page which serves the extension source -->
<!-- TODO: This loads your extension from ~/Index; change path to fit your needs -->
<location path="Index">
  <system.web>
    <authorization>
      <allow users="*" />
    </authorization>
  </system.web>
</location>

<!-- allow images and scripts -->
<location path="Content">
  <system.web>
    <authorization>
      <allow users="*" />
    </authorization>
  </system.web>
</location>
<location path="Scripts">
  <system.web>
    <authorization>
      <allow users="*" />
    </authorization>
  </system.web>
</location>

<configuration>
  <appSettings>
    <!-- For test, use authority="https://login.windows-ppe.net/" -->
    <!-- For PROD, use authority="https://login.windows.net/" -->
    <add key="Microsoft.Portal.Security.AzureActiveDirectory.AadAuthenticationConfiguration.Authority"
         value="https://login.windows-ppe.net/" />
    <add key="Microsoft.Portal.Security.AzureActiveDirectory.AadAuthenticationConfiguration.TenantId"
         value="common" />
    <add key="Microsoft.Portal.Security.AzureActiveDirectory.AadAuthenticationConfiguration.AllowedAudiences"
         value="['https://management.core.windows.net/']" />
    <add key="Microsoft.Portal.Security.AzureActiveDirectory.AadAuthenticationConfiguration.MinValidationCertUpdateInterval"
         value="PT05M" />
    <add key="Microsoft.Portal.Security.AzureActiveDirectory.AadAuthenticationConfiguration.MaxValidationCertUpdateInterval"
         value="PT24H" />
    <add key="Microsoft.Portal.Security.AzureActiveDirectory.AadAuthenticationConfiguration.ForwardDecryptedAuthorizationTokens"
         value="false" />
  </appSettings>
</configuration>
```

Lastly, use [HttpContext.User](http://msdn.microsoft.com/library/system.web.httpcontext.user.aspx) to retrieve the common claims:

```cs
// use IPortalIdentity for email and tenant id
// NOTE: Do not rely on IPortalIdentity.FirstName and LastName properties; they aren't consistenty populated
var portalUser = HttpContext.User.Identity as Microsoft.Portal.Framework.IPortalIdentity;
// portalUser.EmailAddress;
// portalUser.TenantId;

// use IAadIdentity (implements IPortalIdentity) for user id
// and to determine if the user is an MSA or AAD account
var aadUser = portalUser as Microsoft.WindowsAzure.Management.AadAuthentication.IAadIdentity;
if (aadUser != null)
{
    // aadUser.ObjectId;
    // aadUser.PrincipalId;
    // aadUser.IsOrgId
}
```

If you require additional claims, use the [ASP.NET claims API](http://msdn.microsoft.com/en-us/library/ee517271.aspx) to read the desired claims from the token. The [Supported token and claim types](http://msdn.microsoft.com/en-us/library/windowsazure/dn195587.aspx#BKMK_JWT) article on MSDN covers the default claims provided by AAD.

Due to token size constraints, additional information cannot be added to the token. Instead, any additional information required by an extension must be obtained from [AAD Graph API](http://msdn.microsoft.com/en-us/library/windowsazure/hh974482.aspx).


### FAQs

#### Q: How do I get the list of subscriptions? Or just those selected by a user?

A: Call the `MsPortalFx.Azure.getAllSubscriptions()` or `MsPortalFx.Azure.getSelectedSubscriptions()` APIs (see the [subscriptions page](/documentation/articles/portalfx-subscriptions) for more information).

#### Q: When do authenticated sessions expire?

A: The portal does not automatically log users out after a period of inactivity; it only logs a user out when the user's AAD-issued authentication token expires (because all subsequent operations would fail).
This generally happens after a few hours of usage (8 to 24 hours based on the type of account) or if the token was not refreshed/renewed for a period of time (typically 1 hour).
(Note that if the browser is in a situation where it cannot connect to the network for more than an hour, the user will likely get logged out.)

### Q: How to enable local portal authentication?

By default, authentication is not configured in the local portal to simplify development. Use the following to enable authentication:

1. Install [Internet Information Services (IIS)](http://msdn.microsoft.com/en-us/library/ms181052%28v=vs.80%29.aspx) (not IIS Express)
2. Install the [URL Rewrite module for IIS](http://www.iis.net/downloads/microsoft/url-rewrite)
3. Install the [Azure SDK](http://www.windowsazure.com/en-us/downloads)
4. Execute the **%programfiles(x86)%\Microsoft SDKs\PortalSDK\Tools\Setup-OneCloud.cmd** script

The **Setup-OneCloud.cmd** script creates a new IIS site configured to use the CURRENT test environment, which includes AAD-PPE and MSA-PROD. The new site can be accessed at [http://onestb.cloudapp.net/](http://onestb.cloudapp.net/). This site is located in the following folder on your system:

`%programfiles(x86)%\Microsoft SDKs\PortalSDK\StbPortal`

To change environments to either NEXT or DOGFOOD, update the web.config files for the portal, Hubs extension, and the Billing extension. Each extension has environment config at the top to simplify switching environments.

**NOTE:** This URL is configured within AAD and cannot be changed. A new hosts file entry was added to support loopback._

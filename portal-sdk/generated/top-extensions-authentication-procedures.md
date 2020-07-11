
<a name="overview"></a>
## Overview

The Portal uses an internal provider for authentication and authorization. The built-in cloud authentication provider uses Azure Active Directory (AAD), which also supports Microsoft Account users. If your extension needs to differentiate between AAD and MSA users, see [Access claims from the extension server](#access-claims-from-the-extension-server). If you are working on first-party extensions, but you are not sure that your extension scenarios comply with Azure terms and conditions, you may want to reach out to <a href="mailto:ibiza-lca@microsoft.com?subject=Compliance%20with%20Azure%20Terms%20and%20Conditions">ibiza-lca@microsoft .com</a>.

During sign-in, the Portal obtains a token that contains claims that identify the signed-in user. The Portal also retrieves directories and subscriptions to which the user has access.

**NOTE**:  Users can sign in without a subscription. Extensions must gracefully handle this case and return zero assets when queried.

The extension can call ARM from the client or from the extension server. The extension can also call external services from the client or from the extension server.

Calling external services involves AAD Onboarding.  The onboarding process can take five or six weeks, so if your extension needs to invoke services other than ARM, you should reach out to the Azure Portal team early in the design phase, as specified in [top-extensions-onboarding-with-related-teams.md](top-extensions-onboarding-with-related-teams.md).

**NOTE**: Only first-party extensions can call alternate resources. Third party extensions use an encrypted token that cannot be decrypted by services other than ARM, therefore they cannot call alternate resources.

* [Call ARM from the client](#call-arm-from-the-client)

* [Call ARM from the server](#call-arm-from-the-server)

* [Calling backed services/APIs or Graph APIs](#calling-backed-services-apis-or-graph-apis)

* [Access claims](#access-claims)

* [Enable local portal authentication](#enable-local-portal-authentication)

* * *

<a name="call-arm-from-the-client"></a>
## Call ARM from the client

Your extension should use cross-origin resource sharing (CORS) for all non-aggregated, non-orchestrated calls. If you need to call multiple sources for a single piece of UI, you should use a server API to orchestrate and aggregate those calls.

Use the built-in `ajax()` function to communicate from the extension client to call any extension server API. This function will attach a token targeted at ARM that is specific to your extension for the HTTP header.

**NOTE**: Do not use `jQuery.ajax()` because it will not properly authorize your requests. If you have a scenario that is not supported by `ajax()`, you can use the `getAuthorizationToken()` function to obtain a token and manually attach it to your request.

<a name="call-arm-from-the-server"></a>
## Call ARM from the server

Use the `WebApiClient` class to call ARM from your extension server. This class attaches a token to the request on your behalf, in a manner similar to the client `ajax()` function.  The following code attaches a token that is targeted at ARM.

```cs
    Uri arm = new Uri("https://management.azure.com/...");  // arm endpoint
    using (var client = new Microsoft.Portal.Framework.ClientProxy.WebApiClient())
    {
        // ConfigureAwait(false) is recommended to not forcibly resume on the same thread it started on
        // var data = await client.GetAsync<...>(arm).ConfigureAwait(false);
    }
```

<a name="calling-backend-services-apis-or-graph-apis"></a>
## Calling backend services/APIs or Graph APIs

Only Ibiza has the authority to mint tokens. To call external resources, extension developers need to request the creation of the AAD and register the extension resources with Ibiza for the appropriate environment, as specified in [top-onboarding.md#register-the-extension-with-the-portal-product-configuration](top-onboarding.md#register-the-extension-with-the-portal-product-configuration).

The following example enables `Contoso_Extension`, a sample extension that queries Graph APIs from the client.

1. The extension owner creates an RDTask that is located at [http://aka.ms/portalfx/newextension](http://aka.ms/portalfx/newextension).  This is part of the process that onboards the AAD application with the Portal, as specified in [portalfx-extensions-onboarding-aad.md](portalfx-extensions-onboarding-aad.md).

1. The AAD Onboarding Website is located at [https://aadonboardingsite.cloudapp.net/RegisterApp](https://aadonboardingsite.cloudapp.net/RegisterApp). After the Ibiza team creates the app, you can reach out to <a href="mailto:aadonboarding@microsoft.com?subject=Expediting%20the%20Onboarding%20of%20a%20new%20Extension">aadonboarding@microsoft.com</a> to expedite the process.

1. Submit the RDTask to register the AAD application into the Portal's extension configuration. This step can be done simultaneously with the previous step.

    * The client-side `resourceAccess` configuration for the extension in Portal would look something like the following code.
    * *New:* See [Migrating resource access configuration](#migrating-resource-access-configuration) for instructions on migrating your extension's authorization configuration to your hosting service configuration.

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

    * The server-side configuration would resemble the following code.

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

     * The following code adds a parameter to `ajax` calls so that the extension can exchange tokens. In this instance, the token goes to the resourceName `self` for later exchange.

        ```cs
            MsPortalFx.Base.Net2.ajax({
                uri: "MyController/MyAction",
                setAuthorizationHeader: { resourceName: "self" }
            }).then((myData) => {
                // do work with data
            });
        ```

    *  The controller configuration would resemble the following code.

        ```cs
            // Get the token passed to the controller
            var portalAuthorizationHeader = PortalRequestContext.Current.GetCorrelationData<AuthorizationCorrelationProvider>();
            if (portalAuthorizationHeader == null) {
                // This should never happen, the auth module should have returned 401 if there wasn't a valid header present
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
                // The header will be in the form "Bearer ey��MZ"
                // The access token in the last part of the header
                var separator = new char[] { ' ' };
                var accessToken = authorizationHeader.Split(separator, StringSplitOptions.RemoveEmptyEntries).LastOrDefault();

                return accessToken;
            }
        ```

2. After the configuration changes are deployed in the requested environment, like Dogfood, PPE, or PROD, the extension can request tokens for the graph resource using any of its data APIs, as in the following code.

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

<a name="access-claims"></a>
## Access claims

Tokens received from AAD contain a set of claims that are formatted as key-value pairs.  They contain information about the user, and they are only available to extensions that comply with the Azure privacy policy that is located at [https://www.microsoft.com/en-us/TrustCenter/Privacy/default.aspx](https://www.microsoft.com/en-us/TrustCenter/Privacy/default.aspx).

<!-- TODO: Validate whether the following lists are still part of the signin process. -->

They may include items like a list of directories that the user can  access from ARM, or a list of subscriptions that the user can access from ARM.

Extensions that are not covered by this policy, like the ones that share PII with third-parties, do not have access to the token or its claims, because Microsoft can be sued for abuse or misuse of PII as specified in the  privacy policy. These exceptions need to be approved by reaching out to <a href="mailto:ibiza-lca@microsoft.com?subject=Personally-identifiable%20Information%20Policy">ibiza-lca@microsoft .com</a>.

<a name="access-claims-access-claims-from-the-client"></a>
### Access claims from the client

Extensions that have access to claims can use the `getUserInfo()` API to retrieve common claims from the client.

**NOTE**: Secondary claims, like name and email, may not always be available and cannot be guaranteed. Token claims may change over time as AAD evolves. Call the `Graph` to get required user information instead of extracting claims yourself. Do not make hard dependencies on claims.

The following code retrieves common claims from the client.

```ts
MsPortalFx.Base.Security.getUserInfo() : PromiseV<MsPortalFx.Base.Security.UserInfo>

interface UserInfo {
    email: string;          // Guest accounts not homed in the current directory will have a UPN and not a valid email address
    givenName: string;      // Name may be empty if not provided in the token
    surname: string;        // Name may be empty if not provided in the token
    directoryId: string;
    directoryName: string;  // Directory name may be empty if calling Graph fails
    domainName: string;     // Directory domain may be empty if calling Graph fails
}
```

<a name="access-claims-access-claims-from-the-extension-server"></a>
### Access claims from the extension server

While not recommended, the token used to communicate with your server also contains claims that can be read from the
server by using the **ASP.NET** claims API specified in [http://msdn.microsoft.com/en-us/library/ee517271.aspx](http://msdn.microsoft.com/en-us/library/ee517271.aspx). To simplify development, the `HttpContext.User` property specified in [http://aka.ms/portalfx/httpContextUser](http://aka.ms/portalfx/httpContextUser) has been augmented with the most commonly used claims.

The extension uses the API to read additional claims from the token. Due to size constraints, additional information required by an extension cannot be added to the token. Instead, the extension obtains it from the AAD Graph API that is specified in [http://aka.ms/portalfx/AADGraphAPI](http://aka.ms/portalfx/AADGraphAPI).

The following code sample retrieves common claims.

1. Reference the following assemblies:

    * Microsoft.Portal.AadCore.dll

    * System.IdentityModel.Tokens.Jwt.dll

1. Add the following to the **web.config** file.

    <!-- INTERNAL NOTE: copy settings from src\StbPortal\Extensions\AzureHubsExtension\Web.config -->

    ```xml
    <!-- deny anonymous users -->
    <system.web>
        <authorization>
        <deny users="?" />
        </authorization>
    </system.web>

    <!-- allow the home page which serves the extension source -->
    <!-- this loads the extension from ~/Index; change path to fit your development environment -->
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

1. Use `HttpContext.User` to retrieve the common claims, as in the following code.

    ```cs
    // use IPortalIdentity for email and tenant id
    // NOTE: Do not rely on IPortalIdentity.FirstName and LastName properties; they are not consistenty populated
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

For more information about default claims that are provided by AAD, see the "Azure AD token reference" article located at [http://aka.ms/portalfx/tokensandclaims](http://aka.ms/portalfx/tokensandclaims).


 ### Session expiration

The Portal does not automatically log users out after a period of inactivity; it only logs a user out when the user's AAD-issued authentication token expires. Otherwise, all subsequent operations would fail.

This typically happens after a few hours of usage, maybe eight to 24 hours based on the type of account. It may also happen if the token was not refreshed or renewed for a period of time, which is typically one hour.

**NOTE**: If the browser is in a situation where it cannot connect to the network for more than an hour, typically, the user is logged out.


<a name="migrating-resource-access-configuration"></a>
## Migrating resource access configuration

To provide extension authors greater control over the deployment cadence of resource access changes, the SDK now supports defining resource access in the extension's hosting service configuration.

1. Prerequisites
   1. Upgrade your extension’s SDK to version **5.0.303.4271** or newer.
   1. If your extension requires access to a resource other than ARM, you must define an `OAuthClientId` at the root of your extension configuration in the relevant `Extensions.*.json` files in the Portal repo.

1. Add the desired resources to your extension's hosting service configuration.
   *  In your extension's hosting service configuration(s), add a new `authorization` property with the desired resource access.
       * Note that the ARM resource (name: "") is not included. All extensions will now get ARM access using the Portal's credentials without needing to define it in configuration.

    ```ts
    "authorization": {
        "resourceAccess": [
            {
                "name": "graph",
                "resource": "https://graph.ppe.windows.net/"
            }
        ]
    }
    ```

1. Deploy your extension with the new configuration changes.
1. Verify your new configuration by requesting a token for each of the resources with access defined...
    * ...from a blade in your extension.
    * ...manually from the developer command prompt:
        * From your browser's developer tools, navigate to the "Console" tab, and select your extension's frame using the dropdown in the header.

        * The following code will trigger a network request to `/api/DelegationToken` for your resource:

        ```js
        MsPortalFx.Base.Security.getAuthorizationToken({
            resourceName: "graph",
        });
        ```

        1. Open the "Network" tab of your browser's developer tools

        1. Locate the call to `/api/DelegationToken` and inspect the response - a successful token request will have status `200` and will include a "Bearer" token in the response body.


1. Remove the `resourceAccess` section from your extension configuration in the Portal repo.

    Once you have verified that your extension can still retrieve tokens for each of the resources in your extension's `authorization` configuration, you should remove the `resourceAccess` section of your extension's configuration in the relevant `Extensions.*.json` files in the Portal repo.



**Before migration**

*Extensions.dogfood.json*

```json
{
    "name": "Microsoft_Azure_MyExtension",
    "feedbackEmail": "myteamtriage@microsoft.com",
    "flags": "SupportsPrewarming",
    "resourceAccess": [
        {
            "name": "",
            "resource": "https://management.core.windows.net/",
        }
        {
            "name": "graph",
            "resource": "https://graph.ppe.windows.net/",
        }
    ],
    "hostingServiceName": "testextension"
},
```

**After migration**

*Extensions.dogfood.json*

```json
{
    "name": "Microsoft_Azure_MyExtension",
    "feedbackEmail": "myteamtriage@microsoft.com",
    "flags": "SupportsPrewarming",
    "hostingServiceName": "testextension",
    "oAuthClientId": "727c064e-126e-445a-92b5-224e5af412fb"
},
```

*df-onecloud.azure-test.net.json*

```json
{
  "argbrowseoptions": {...},
  "authorization": {
    "resourceAccess": [
      {
        "name": "graph",
        "resource": "https://graph.ppe.windows.net/"
      }
    ]
  },
  "enablePortalLogging": true,
  "features": {...}
```

<a name="extension-authentication-procedures"></a>
# Extension authentication procedures

<a name="extension-authentication-procedures-table-of-contents"></a>
## Table of contents
  - [Overview](#overview)
  - [Call ARM from the client](#call-arm-from-the-client)
  - [Calling backend services/APIs or Graph APIs](#calling-backend-servicesapis-or-graph-apis)
    - [Exchanging tokens for a specific resource token](#exchanging-tokens-for-a-specific-resource-token)
  - [Access claims](#access-claims)
    - [Access claims from the client](#access-claims-from-the-client)
    - [Access claims from the extension server](#access-claims-from-the-extension-server)
    - [Session expiration](#session-expiration)
  - [Migrating resource access configuration](#migrating-resource-access-configuration)
    - [Testing extension-side authorization configuration with friendly-name stamps](#testing-extension-side-authorization-configuration-with-friendly-name-stamps)

<a name="extension-authentication-procedures-overview"></a>
## Overview

The Portal uses an internal provider for authentication and authorization. The built-in cloud authentication provider uses Azure Active Directory (AAD), which also supports Microsoft Account users. If your extension needs to differentiate between AAD and MSA users, see [Access claims from the extension server](#access-claims-from-the-extension-server). If you are working on first-party extensions, but you are not sure that your extension scenarios comply with Azure terms and conditions, you may want to reach out to <a href="mailto:ibiza-lca@microsoft.com?subject=Compliance%20with%20Azure%20Terms%20and%20Conditions">ibiza-lca@microsoft .com</a>.

During sign-in, the Portal obtains a token that contains claims that identify the signed-in user. The Portal also retrieves directories and subscriptions to which the user has access.

**NOTE**:  Users can sign in without a subscription. Extensions must gracefully handle this case and return zero assets when queried.

The extension can call ARM from the client. The extension can also call external services from the client or from the extension server.

Calling external services involves AAD Onboarding.  The onboarding process can take five or six weeks, so if your extension needs to invoke services other than ARM, you should reach out to the Azure Portal team early in the design phase, as specified in [top-extensions-onboarding-with-related-teams.md](top-extensions-onboarding-with-related-teams.md).

**NOTE**: Only first-party extensions can call alternate resources. Third party extensions use an encrypted token that cannot be decrypted by services other than ARM, therefore they cannot call alternate resources.

* [Call ARM from the client](#call-arm-from-the-client)

* [Calling backed services/APIs or Graph APIs](#calling-backed-services-apis-or-graph-apis)

* [Access claims](#access-claims)

* [Enable local portal authentication](#enable-local-portal-authentication)

* * *

<a name="extension-authentication-procedures-call-arm-from-the-client"></a>
## Call ARM from the client

Your extension should use cross-origin resource sharing (CORS) for all non-aggregated, non-orchestrated calls.

Use the built-in `ajax()` function in the `Fx/Ajax` module to communicate from the extension client to call any extension server API. This function will attach a token targeted at ARM that is specific to your extension for the HTTP header.

**NOTE**: Do not use `jQuery.ajax()` because it will not properly authorize your requests. If you have a scenario that is not supported by `ajax()`, you can use the `getAuthorizationToken()` function to obtain a token and manually attach it to your request.

<a name="extension-authentication-procedures-calling-backend-services-apis-or-graph-apis"></a>
## Calling backend services/APIs or Graph APIs

Only Ibiza has the authority to mint tokens. To call external resources, extension developers need to request the creation of the AAD app and register the extension resources with Ibiza for the appropriate environment, as specified in [top-onboarding.md#register-the-extension-with-the-portal-product-configuration](top-onboarding.md#register-the-extension-with-the-portal-product-configuration).

The following example enables a sample extension `Contoso_Extension` to query Graph APIs from the client.

1. Create a first party AAD application [https://firstpartyportal.msidentity.com/](https://firstpartyportal.msidentity.com/). Ensure that the Subject Name + Issuer (SNI) used by the Portal is listed on the AAD application. The list of portal SNIs is documented at [https://aka.ms/portalfx/sni](http://aka.ms/portalfx/sni).

2. Onboard your AAD application ID in the portal configuration using EasyStart per the steps outlined in [https://aka.ms/portalfx/newextension](https://aka.ms/portalfx/newextension).

3. Define the auth configuration in the extension's hosting service configuration file as outlined at [defining extension resource access configuration](#migrating-resource-access-configuration)
     * Note: Sideloading the extension-defined resource access is not supported since the portal server will not have access to your machine to read the sideloaded configuration.
     * For testing purposes, the extension configuration can be deployed to a friendly-name stamp using the steps outlined at: [testing extension-side authorization configuration with friendly-name stamps](#testing-extension-side-authorization-configuration-with-friendly-name-stamps)

4. After the configuration changes are deployed in the requested environment, like Dogfood, PPE, or PROD, the extension can request tokens for the graph resource using any of its data APIs, as in the following code.
     * To automatically attach a the token when making `ajax` calls, use the `name` property defined for the resource in the extension configuration file as the `resourceName` in the `setAuthorizationHeader` argument.
     * To get an access token for a specific resource, use the `getAuthorizationToken` call as outlined below.

    ```ts
    import { ajax, getEndpoints } from "Fx/Ajax";

    MsPortalFx.Base.Security.getAuthorizationToken({ resourceName: "graph" });

    ajax({
        setAuthorizationHeader: { resourceName: "graph" },
        uri: getEndpoints().graph + "/endpoint",
    });

    new MsPortalFx.ViewModels.Controls.FileDownload.ViewModel(
        container,
        {
            context: ko.observable(new FileDownload.Context({
                ...
                addDefaultAuthorizationToken: {
                    resourceName: "graph",
                },
                ...
            })),
        });

    new MsPortalFx.ViewModels.FileDownloadCommand({
        authorizationOptions: {
            resourceName: "graph",
        }
    });
    ```

<a name="extension-authentication-procedures-calling-backend-services-apis-or-graph-apis-exchanging-tokens-for-a-specific-resource-token"></a>
### Exchanging tokens for a specific resource token

Extensions can also exchange tokens themselves for a target resource. This can be achieved as follows:

1.  Include a "self" resource in the extension's resource access configuration:

```ts
"authorization": {
    "resourceAccess": [
        {
            "name": "self",
            "resource": "1a123abc-1234-1a2b-ab01-01ab01a1a1ab"    // The extension's AAD application ID
        }
    ]
}
```

2. On the client, request a token for the "self" resource using the `ajax` function or the `getAuthorizationCode` function as demonstrated in the previous section. The following code adds a parameter to the `ajax` call:

```ts
    MsPortalFx.Base.Net2.ajax({
        uri: "MyController/MyAction",
        setAuthorizationHeader: { resourceName: "self" }
    }).then((myData) => {
        // do work with data
    });
```

3. On the extension's controller, the token can be exchanged for another target resource as follows. Note that the following sample uses MSAL.Net.

```cs
    // Get the token passed to the controller
    var portalAuthorizationHeader = PortalRequestContext.Current.GetCorrelationData<AuthorizationCorrelationProvider>();
    if (portalAuthorizationHeader == null)
    {
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
    async Task<string> GetExchangedToken(string portalAuthorizationHeader, string clientId, X509Certificate2 clientCertificate, string resource)
    {
        var scopes = new string[] { resource + "./default" };    // This is the MSAL.Net requirement to request tokens for the default scope for a given resource.
        var confidentialClientApp = ConfidentialClientApplicationBuilder
                .Create(clientId)
                .WithCertificate(clientCertificate)
                .WithAuthority(this.aadAuthority.ToString())    // This value can be obtained from the config value using Microsoft.Portal.Security.AzureActiveDirectory.IAadAuthenticationConfiguration.Authority.
                .Build();

        // Proof that the request originated from the portal and is on behalf of a valid user
        var accessToken = GetAccessTokenFromAuthorizationHeader(portalAuthorizationHeader);
        var userAssertion = new UserAssertion(accessToken, "urn:ietf:params:oauth:grant-type:jwt-bearer");

        // The actual token exchange
        var exchangedToken = await extensionApp.AcquireTokenOnBehalfOf(scopes, userAssertion)
            .WithSendX5C(true)      // This is required to use SN+I for certificate validation.
            .ExecuteAsync()
            .ConfigureAwait(false);

        return exchangedToken.CreateAuthorizationHeader();
    }

    string GetAccessTokenFromAuthorizationHeader(string authorizationHeader)
    {
        // The header will be in the form "Bearer ey��MZ"
        // The access token in the last part of the header
        var separator = new char[] { ' ' };
        var accessToken = authorizationHeader.Split(separator, StringSplitOptions.RemoveEmptyEntries).LastOrDefault();

        return accessToken;
    }
```

<a name="extension-authentication-procedures-access-claims"></a>
## Access claims

Tokens received from AAD contain a set of claims that are formatted as key-value pairs.  They contain information about the user, and they are only available to extensions that comply with the Azure privacy policy that is located at [https://www.microsoft.com/en-us/TrustCenter/Privacy/default.aspx](https://www.microsoft.com/en-us/TrustCenter/Privacy/default.aspx).

<!-- TODO: Validate whether the following lists are still part of the signin process. -->

They may include items like a list of directories that the user can  access from ARM, or a list of subscriptions that the user can access from ARM.

Extensions that are not covered by this policy, like the ones that share PII with third-parties, do not have access to the token or its claims, because Microsoft can be sued for abuse or misuse of PII as specified in the  privacy policy. These exceptions need to be approved by reaching out to <a href="mailto:ibiza-lca@microsoft.com?subject=Personally-identifiable%20Information%20Policy">ibiza-lca@microsoft .com</a>.

<a name="extension-authentication-procedures-access-claims-access-claims-from-the-client"></a>
### Access claims from the client

Extensions that have access to claims can use the `getUserInfo()` API to retrieve common claims from the client.

**NOTE**: Secondary claims, like name and email, may not always be available and cannot be guaranteed. Token claims may change over time as AAD evolves. Call the `Graph` to get required user information instead of extracting claims yourself. Do not make hard dependencies on claims.

The following code retrieves common claims from the client.

```ts
MsPortalFx.Base.Security.getUserInfo() : Promise<MsPortalFx.Base.Security.UserInfo>

interface UserInfo {
    email: string;          // Guest accounts not homed in the current directory will have a UPN and not a valid email address
    givenName: string;      // Name may be empty if not provided in the token
    surname: string;        // Name may be empty if not provided in the token
    directoryId: string;
    directoryName: string;  // Directory name may be empty if calling Graph fails
    domainName: string;     // Directory domain may be empty if calling Graph fails
}
```

<a name="extension-authentication-procedures-access-claims-access-claims-from-the-extension-server"></a>
### Access claims from the extension server

While not recommended, the token used to communicate with your server also contains claims that can be read from the
server by using the **ASP.NET** claims API specified in [https://msdn.microsoft.com/en-us/library/ee517271.aspx](https://msdn.microsoft.com/en-us/library/ee517271.aspx). To simplify development, the `HttpContext.User` property specified in [https://aka.ms/portalfx/httpContextUser](https://aka.ms/portalfx/httpContextUser) has been augmented with the most commonly used claims.

The extension uses the API to read additional claims from the token. Due to size constraints, additional information required by an extension cannot be added to the token. Instead, the extension obtains it from the AAD Graph API that is specified in [https://aka.ms/portalfx/AADGraphAPI](https://aka.ms/portalfx/AADGraphAPI).

The following code sample retrieves common claims.

1. Reference the following assemblies:

    * Microsoft.Portal.AadCore.dll

    * System.IdentityModel.Tokens.Jwt.dll

2. Add the following to the **web.config** file.

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

3. Use `HttpContext.User` to retrieve the common claims, as in the following code.

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

For more information about default claims that are provided by AAD, see the "Azure AD token reference" article located at [https://aka.ms/portalfx/tokensandclaims](https://aka.ms/portalfx/tokensandclaims).


 ### Session expiration

The Portal does not automatically log users out after a period of inactivity; it only logs a user out when the user's AAD-issued authentication token expires. Otherwise, all subsequent operations would fail.

This typically happens after a few hours of usage, maybe eight to 24 hours based on the type of account. It may also happen if the token was not refreshed or renewed for a period of time, which is typically one hour.

**NOTE**: If the browser is in a situation where it cannot connect to the network for more than an hour, typically, the user is logged out.


<a name="extension-authentication-procedures-migrating-resource-access-configuration"></a>
## Migrating resource access configuration

To provide extension authors greater control over the deployment cadence of resource access changes, the SDK now supports defining resource access in the extension's hosting service configuration.

1. **Prerequisite:** If your extension requires access to a resource other than ARM, you will need to provide an `oAuthClientId` in the [EasyStart Onboarding](https://aka.ms/portalfx/easystart) tool for your extension. If you only need access to ARM, you do not need to define a `resourceAccess` section in your extension's configuration.

2. Add the desired resources to your extension's hosting service configuration.
   *  In your extension's hosting service configuration(s), add a new `authorization` property with the desired resource access.
       * **Note:** the ARM resource (name: "") is not included. All extensions will now get the portal's ARM access token by default without needing to define it in configuration.

    ```json
    {
        "authorization": {
            "resourceAccess": [
                {
                    "name": "microsoft.graph",
                    "resource": "https://graph.microsoft.com/"
                }
            ]
        }
    }
    ```

3. Deploy your extension with the new configuration changes.
   * Your configuration changes must be fully deployed to all stages in order to be detected by the authentication pipeline.
   * **Optional:** Resource access configuration changes can be tested by deploying to a friendly-name stamp. Instructions can be found [below.](#testing-extension-side-authorization-configuration-with-friendly-name-stamps)
4. Verify your new configuration by requesting a token for each of the resources with access defined using the following methods:
    * From a blade in your extension.
    * Manually from the developer command prompt:
        * From your browser's developer tools, navigate to the "Console" tab, and select your extension's frame using the dropdown in the header.

        * The following code will trigger a network request to `/api/DelegationToken` for your resource:

        ```ts
        MsPortalFx.Base.Security.getAuthorizationToken({
            resourceName: "microsoft.graph",
        });
        ```

        1. Open the "Network" tab of your browser's developer tools

        2. Locate the call to `/api/DelegationToken` and inspect the response - a successful token request will have status `200` and will include a "Bearer" token in the response body.

**Before migration**

*Extensions.prod.json*

```json
{
    "name": "Contoso_Extension",
    "feedbackEmail": "myteamtriage@microsoft.com",
    "flags": "SupportsPrewarming",
    "resourceAccess": [
        {
            "name": "",
            "resource": "https://management.azure.com/",
        }
        {
            "name": "microsoft.graph",
            "resource": "https://graph.microsoft.com/",
        }
    ],
    "hostingServiceName": "contoso"
},
```

**After completing migration**

*portal.azure.com.json*

```json
{
  "authorization": {
    "resourceAccess": [
      {
        "name": "microsoft.graph",
        "resource": "https://graph.microsoft.com/"
      }
    ]
  },
}
```

<a name="extension-authentication-procedures-migrating-resource-access-configuration-testing-extension-side-authorization-configuration-with-friendly-name-stamps"></a>
### Testing extension-side authorization configuration with friendly-name stamps

Are you making changes to your extension's resource access that might negatively impact users? The Portal authentication pipeline now supports testing `resourceAccess` changes against a friendly name stamp.

1. Deploy your extension to a friendly name stamp. More information about friendly names can be found [here](top-extensions-hosting-service.md#friendly-names-and-sideloading).

2. Load the Portal in your favorite web browser with this query string, replacing `Contoso_Extension` with your extension's name, and `foobar` with the name of your stamp:

    `?Contoso_Extension_authstamp=foobar`

    All token requests for this Portal session will attempt to read your extension's authorization configuration from the provided friendly name stamp.
    - **Note:** Portal authentication performance for your extension will be significantly degraded within this session. This feature should be used for testing and verification purposes only!

**For additional questions, please join our teams channel at http://aka.ms/portalfx/resourceaccessteams**

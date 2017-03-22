
<a name="c-test-framework-overview"></a>
## C# Test Framework Overview

You write UI based test cases using Visual Studio and the Portal Test Framework which is part of the Portal SDK.

<a name="c-test-framework-overview-creating-the-test-project"></a>
### Creating the Test Project
To create a test project that can use the Portal Test Framwork:

1. Create a new Visual Studio Unit Test Project.
2. Install the NuGet Package Microsoft.Portal.TestFramework from [here](https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.testframework).
3. If your test cases involve the Azure Marketplace, also install the Microsoft.Portal.TestFramework.MarketplaceUtilities package from [here](https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.testframework.marketplaceutilities), which contains Selenium classes for elements in the Azure Marketplace.
4. Add an app.config file to your test project and define the basic Test Framework settings under appSettings. For example:

```xml

<appSettings>
  <!-- Browser type. "Chrome", "IE" -->
  <add key="TestFramework.WebDriver.Browser" value="Chrome" />
  <add key="TestFramework.WebDriver.DirectoryPath" value="packages\WebDriver.ChromeDriver.win32.2.19.0.0\content" />

  <!-- Amount of time to wait for the Portal to load before timing out (seconds) -->
  <add key="TestFramework.Portal.PortalLoadTimeOut" value="60" />
  
  <!-- The uri of the target Portal server -->
  <add key="PortalUri" value="https://portal.azure.com" />
  
  <!-- The uri of your deployed extension -->
  <add key="ExtensionUri" value="https://mscompute2.iaas.ext.azure.com/ComputeContent/ComputeIndex" />
  
  <!-- The default webdriver server timeout for requests to be processed and returned (not the same as the waitUntil timeout) -->
  <add key="TestFramework.WebDriver.DefaultTimeout" value="60"/>
</appSettings>

```

5. Add a new Unit Test class and start writing your test case

<a name="c-test-framework-overview-navigating-to-the-portal"></a>
### Navigating to the Portal
To navigate to the Portal, you first must supply the Portal's uri.  We recommend setting the value in the app.config file as shown above.  Once you have the Portal uri, you can use the **WebDriverFactory.Create** method to create an instance of the WebDriver object and then use the **PortalAuthentication** class to login, navigate to the Portal in the browser.

```csharp

// Get the specified Portal Uri from the configuration file
var portalUri = new Uri(ConfigurationManager.AppSettings["PortalUri"]);
var extensionUri = new Uri(ConfigurationManager.AppSettings["ExtensionUri"]);

// Make sure the servers are available
PortalServer.WaitForServerReady(portalUri);
ExtensionsServer.WaitForServerReady(extensionUri);

// Create a webdriver instance to automate the browser.
var webDriver = WebDriverFactory.Create();

// Create a Portal Authentication class to handle login, note that the portalUri parameter is used to validate that login was successful.
var portalAuth = new PortalAuthentication(webDriver, portalUri);

//config#sideLoadingExtension
// Sign into the portal
portalAuth.SignInAndSkipPostValidation(userName: "", /** The account login to use.  Note Multi Factor Authentication (MFA) is not supported, you must use an account that does not require MFA **/
    password: "", /** The account password **/
    tenantDomainName: string.Empty, /** the tenant to login to, set only if you need to login to a specific tenant **/
    query: "feature.canmodifyextensions=true", /** Query string to use when navigating to the portal.  **/ 
    fragment: "#" /** The hash fragment, use this to optionally navigate directly to your resource on sign in. **/);

```

Please note that multi factor authentication (MFA) is not supported, you must use an account that does not require MFA.  If you are part of the Microsoft Azure organization please see (Azure Security Guidelines)[https://microsoft.sharepoint.com/teams/azure2fa/SitePages/FAQ%20on%20Use%20of%20MSA%20on%20Azure%20Subsriptions.aspx] for details on how to request an exception for an MSA/OrgID account.  You can not use a service account to login to the Azure Portal.

<a name="c-test-framework-overview-side-loading-an-extension-via-test-framework"></a>
### Side Loading An Extension via Test Framework
The Portal provides options for side loading your extension for testing.  If you wish to side load your extension (either a localhost or deployed one) you can set the appropriate query strings and execute the registerTestExtension function for deployed extensions.  For a localhost extension you can just set a query string.  See (Testing in Production)[#Testing in production] for details.

```csharp

// Sign into the portal
portalAuth.SignInAndSkipPostValidation(userName: "", /** The account login to use.  Note Multi Factor Authentication (MFA) is not supported, you must use an account that does not require MFA **/
    password: "", /** The account password **/
    tenantDomainName: string.Empty, /** the tenant to login to, set only if you need to login to a specific tenant **/
    query: "feature.canmodifyextensions=true", /** Query string to use when navigating to the portal.  **/ 
    fragment: "#" /** The hash fragment, use this to optionally navigate directly to your resource on sign in. **/);
//config#navigateToPortal

// Check for and click the Untrusted Extension prompt if its present
Portal.CheckAndClickExtensionTrustPrompt(webDriver);
var portal = Portal.FindPortal(webDriver, false);

// Register a deployed extension via javascript and then reload the portal.  Not required if using the query string method to load from localhost
(webDriver as IJavaScriptExecutor).ExecuteScript("MsPortalImpl.Extension.registerTestExtension({ name: \"SamplesExtension\", uri: \"https://df.onecloud.azure-test.net/Samples\"});");
portal.WaitForPortalToReload(() => webDriver.Navigate().Refresh());

// Check for and click the Untrusted Extension prompt if its present
Portal.CheckAndClickExtensionTrustPrompt(webDriver);
portal = Portal.FindPortal(webDriver, false);

```

Finally, you should dispose the WebDriver to cleanup:

```csharp

// Clean up the webdriver after
webDriver.Dispose();

```

<a name="c-test-framework-overview-managing-authentication-credentials-unsupported"></a>
### Managing authentication credentials (unsupported)
While the test framework does not provide any support for managing login credentials, there are some recommendations:
1.  If you are in the Azure org, please see (Azure Security guidelines)[https://microsoft.sharepoint.com/teams/azure2fa/SitePages/FAQ%20on%20Use%20of%20MSA%20on%20Azure%20Subsriptions.aspx]
1.  Do not store your credentials in the test code.
1.  Do not check in your credentials into your repository.
1.  Some possibilities for storing login credentials include:
    1.  Using the Windows Credential Store.
    1.  Using Azure Key Vault.
    1.  Write your own service for providing credentials.

<a name="c-test-framework-overview-full-sample-code"></a>
### Full Sample Code
```cs

﻿//------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//------------------------------------------------------------

using System;
using System.Configuration;
using Microsoft.Portal.TestFramework.Core;
using Microsoft.Portal.TestFramework.Core.Authentication;
using Microsoft.Portal.TestFramework.Core.Shell;
using Microsoft.Selenium.Utilities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;

namespace DocSampleTest
{
    [TestClass]
    public class NavigateToPortalTest
    {
        [TestMethod]
        public void NavigateToPortal()
        {
            //config#navigateToPortal
            // Get the specified Portal Uri from the configuration file
            var portalUri = new Uri(ConfigurationManager.AppSettings["PortalUri"]);
            var extensionUri = new Uri(ConfigurationManager.AppSettings["ExtensionUri"]);

            // Make sure the servers are available
            PortalServer.WaitForServerReady(portalUri);
            ExtensionsServer.WaitForServerReady(extensionUri);

            // Create a webdriver instance to automate the browser.
            var webDriver = WebDriverFactory.Create();

            // Create a Portal Authentication class to handle login, note that the portalUri parameter is used to validate that login was successful.
            var portalAuth = new PortalAuthentication(webDriver, portalUri);

            //config#sideLoadingExtension
            // Sign into the portal
            portalAuth.SignInAndSkipPostValidation(userName: "", /** The account login to use.  Note Multi Factor Authentication (MFA) is not supported, you must use an account that does not require MFA **/
                password: "", /** The account password **/
                tenantDomainName: string.Empty, /** the tenant to login to, set only if you need to login to a specific tenant **/
                query: "feature.canmodifyextensions=true", /** Query string to use when navigating to the portal.  **/ 
                fragment: "#" /** The hash fragment, use this to optionally navigate directly to your resource on sign in. **/);
            //config#navigateToPortal

            // Check for and click the Untrusted Extension prompt if its present
            Portal.CheckAndClickExtensionTrustPrompt(webDriver);
            var portal = Portal.FindPortal(webDriver, false);

            // Register a deployed extension via javascript and then reload the portal.  Not required if using the query string method to load from localhost
            (webDriver as IJavaScriptExecutor).ExecuteScript("MsPortalImpl.Extension.registerTestExtension({ name: \"SamplesExtension\", uri: \"https://df.onecloud.azure-test.net/Samples\"});");
            portal.WaitForPortalToReload(() => webDriver.Navigate().Refresh());

            // Check for and click the Untrusted Extension prompt if its present
            Portal.CheckAndClickExtensionTrustPrompt(webDriver);
            portal = Portal.FindPortal(webDriver, false);
            //config#sideLoadingExtension

            //config#dispose
            // Clean up the webdriver after
            webDriver.Dispose();
            //config#dispose
        }
    }
}


```
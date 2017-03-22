* [Portal Test Framework](#portal-test-framework)
    * [NOTICE: Changes to C# Test Framework NuGet](#portal-test-framework-notice-changes-to-c-test-framework-nuget)
        * [What](#portal-test-framework-notice-changes-to-c-test-framework-nuget-what)
        * [When](#portal-test-framework-notice-changes-to-c-test-framework-nuget-when)
        * [Getting the new test framework:](#portal-test-framework-notice-changes-to-c-test-framework-nuget-getting-the-new-test-framework)
        * [Viewing the source code and contributing back](#portal-test-framework-notice-changes-to-c-test-framework-nuget-viewing-the-source-code-and-contributing-back)
    * [C# Test Framework Overview](#portal-test-framework-c-test-framework-overview)
        * [Creating the Test Project](#portal-test-framework-c-test-framework-overview-creating-the-test-project)
        * [Navigating to the Portal](#portal-test-framework-c-test-framework-overview-navigating-to-the-portal)
        * [Side Loading An Extension via Test Framework](#portal-test-framework-c-test-framework-overview-side-loading-an-extension-via-test-framework)
        * [Managing authentication credentials (unsupported)](#portal-test-framework-c-test-framework-overview-managing-authentication-credentials-unsupported)
        * [Full Sample Code](#portal-test-framework-c-test-framework-overview-full-sample-code)
    * [Testing Parts and Blades](#portal-test-framework-testing-parts-and-blades)
    * [Testing: Filling Out Forms](#portal-test-framework-testing-filling-out-forms)
        * [Full Example](#portal-test-framework-testing-filling-out-forms-full-example)
    * [Testing Commands](#portal-test-framework-testing-commands)
        * [To use commands from the command bar](#portal-test-framework-testing-commands-to-use-commands-from-the-command-bar)
        * [To use commands from context menus](#portal-test-framework-testing-commands-to-use-commands-from-context-menus)
        * [Full example](#portal-test-framework-testing-commands-full-example)
    * [Taking Screenshots while Testings](#portal-test-framework-taking-screenshots-while-testings)
        * [Full example](#portal-test-framework-taking-screenshots-while-testings-full-example)
    * [Loading a Subset of Extensions](#portal-test-framework-loading-a-subset-of-extensions)
    * [Testing Best Practices](#portal-test-framework-testing-best-practices)
        * [Always verify that every action completed as expected](#portal-test-framework-testing-best-practices-always-verify-that-every-action-completed-as-expected)
        * [Log everything](#portal-test-framework-testing-best-practices-log-everything)
        * [Use built in Test Framework methods](#portal-test-framework-testing-best-practices-use-built-in-test-framework-methods)
        * [Use WaitUntil for retrying actions and waiting for conditions](#portal-test-framework-testing-best-practices-use-waituntil-for-retrying-actions-and-waiting-for-conditions)
        * [Prefer WaitUntil to Assert for non instantaneous conditions](#portal-test-framework-testing-best-practices-prefer-waituntil-to-assert-for-non-instantaneous-conditions)
        * [Create proper wrapper/abstractions for commonly used patterns](#portal-test-framework-testing-best-practices-create-proper-wrapper-abstractions-for-commonly-used-patterns)
        * [Clear user settings before starting a test](#portal-test-framework-testing-best-practices-clear-user-settings-before-starting-a-test)
        * [Use FindElements to verify the absence of elements](#portal-test-framework-testing-best-practices-use-findelements-to-verify-the-absence-of-elements)
        * [Prefer CssSelector to Xpath](#portal-test-framework-testing-best-practices-prefer-cssselector-to-xpath)
    * [Contributing to C# Test Framework](#portal-test-framework-contributing-to-c-test-framework)
        * [Enlisting](#portal-test-framework-contributing-to-c-test-framework-enlisting)
        * [Building](#portal-test-framework-contributing-to-c-test-framework-building)
        * [Testing](#portal-test-framework-contributing-to-c-test-framework-testing)
        * [Submitting](#portal-test-framework-contributing-to-c-test-framework-submitting)
        * [Troubleshooting](#portal-test-framework-contributing-to-c-test-framework-troubleshooting)


<a name="portal-test-framework"></a>
# Portal Test Framework

Please use the following links for info on how to use the Portal Test Framework:


<a name="portal-test-framework-notice-changes-to-c-test-framework-nuget"></a>
## NOTICE: Changes to C# Test Framework NuGet

<a name="portal-test-framework-notice-changes-to-c-test-framework-nuget-what"></a>
### What
The Ibiza Portal’s C# Test Framework is being moved to a separate repository.  This will empower partners to iterate faster without depending on the Portal Teams SDK ship cycle.  You may contribute directly or creating your own forks of the Test Framework.

<a name="portal-test-framework-notice-changes-to-c-test-framework-nuget-when"></a>
### When
The new repository is already available for you to enlist into now.   An email will be sent when the Microsoft.Portal.TestFramework NuGet contains the changes.

<a name="portal-test-framework-notice-changes-to-c-test-framework-nuget-getting-the-new-test-framework"></a>
### Getting the new test framework:
If you are currently using the [Microsoft.Portal.TestFramework NuGet](https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.testframework&packageVersion=5.0.302.542&_a=view) (recommended), then there should be minimal changes required.  

If you are using Visual Studio/NuGet then the dependencies should automatically be pulled down by just referencing Microsoft.Portal.TestFramework NuGet package.  You may need to update your reference paths as some of the DLLs (eg Microsoft.Portal.TestFramework.Core.dll) have moved to a dependent package (which should be included automatically).

If you are using the a custom build environment that requires that explicit listing of the dependent packages (eg internal Microsoft CoreXt), please see the list of known package dependencies:
* AzureUX.UserManagement.Client
* Microsoft.Portal.TestFramework.CSharp
* Microsoft.AspNet.WebApi.Client
* Newtonsoft.Json
* Selenium.WebDriver
* Selenium.Support
* WebDriver.ChromeDriver.win32 (if using Chrome, recommended)
* WebDriver.IEDriverServer.win32 (if using IE11, note only limited support is available for this)

If you see issues, please verify that the correct versions for the matching TestFramework NuGet package are being used.

While we try to keep the package dependency list up to date, the best way to figure out the dependencies (and their versions) is to use NuGet to install the package and see what dependencies it includes.  If you want to manually figure out the dependency list, you can look at the Microsoft.Portal.TestFramework's nuspec file and follow its dependencies nuspec files which can be found in their corresponding nupkg.

If you wish to pick up the absolute latest Test Framework bits, the NuGet package called [Microsoft.Portal.TestFramework.CSharp](https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.testframework.csharp&packageVersion=1.0.8.8&_a=view) (not the same as Microsoft.Portal.TestFramework) is available via the [MsAzure Official feed](https://msazure.pkgs.visualstudio.com/_packaging/Official/NuGet/v3/index.json) and [waNuGet official](http://waNuGet/Official/NuGet).
This package only contains the necessary DLLs for building the test framework, not running it.  There are additional runtime dependencies on Portal framework DLLs (put them in the same directory as the running tests) in order to properly run tests (these DLLs are automatically included in the Microsoft.Portal.TestFramework NuGet).  The specific DLLs are listed in the Microsoft.Portal.TestFramework.CSharp’s readme.txt file.  

<a name="portal-test-framework-notice-changes-to-c-test-framework-nuget-viewing-the-source-code-and-contributing-back"></a>
### Viewing the source code and contributing back
If you wish to view the source code and possibly contribute fixes back to the Test Framework then please see [the contribution article](portalfx-testing-contributing.md).



<a name="portal-test-framework-c-test-framework-overview"></a>
## C# Test Framework Overview

You write UI based test cases using Visual Studio and the Portal Test Framework which is part of the Portal SDK.

<a name="portal-test-framework-c-test-framework-overview-creating-the-test-project"></a>
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

<a name="portal-test-framework-c-test-framework-overview-navigating-to-the-portal"></a>
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

<a name="portal-test-framework-c-test-framework-overview-side-loading-an-extension-via-test-framework"></a>
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

<a name="portal-test-framework-c-test-framework-overview-managing-authentication-credentials-unsupported"></a>
### Managing authentication credentials (unsupported)
While the test framework does not provide any support for managing login credentials, there are some recommendations:
1.  If you are in the Azure org, please see (Azure Security guidelines)[https://microsoft.sharepoint.com/teams/azure2fa/SitePages/FAQ%20on%20Use%20of%20MSA%20on%20Azure%20Subsriptions.aspx]
1.  Do not store your credentials in the test code.
1.  Do not check in your credentials into your repository.
1.  Some possibilities for storing login credentials include:
    1.  Using the Windows Credential Store.
    1.  Using Azure Key Vault.
    1.  Write your own service for providing credentials.

<a name="portal-test-framework-c-test-framework-overview-full-sample-code"></a>
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


<a name="portal-test-framework-testing-parts-and-blades"></a>
## Testing Parts and Blades

Once you have an instance of the Portal object you can find parts on the StartBoard using the **Portal.StartBoard.FindSinglePartByTitle** method. The method will give you a an instance of the Part class that you can use to perform actions on the part, like clicking on it:

```cs
var portal = this.NavigateToPortal();

string samplesTitle = "Samples";

var samplesPart = portal.StartBoard.FindSinglePartByTitle<ButtonPart>(samplesTitle);
samplesPart.Click();
```

You can find blades in a simmilar way using the **Portal.FindSingleBladeByTitle** method and then find parts within the blade using the **Blade.FindSinglePartByTitle** method:

```cs
var blade = portal.FindSingleBladeByTitle(samplesTitle);

string sampleName = "Notifications";

blade.FindSinglePartByTitle(sampleName).Click();

blade = portal.FindSingleBladeByTitle(sampleName);
```

If you need to find parts based on different conditions other than the part's title you can do so by using the FindElement or FindElements methods on any web element:

```cs
var errorPart = webDriver.WaitUntil(() => blade.FindElements<Part>()
                                               .FirstOrDefault(p => p.Text.Contains("Send Error")),
									"Could not find a part with a Send Error text.");
```

Notice the use of the **WebDriver.WaitUntil** method as a general and recommended mechanism to ask the WebDriver to retry an operation until a condition succeeds. In this case, the test case asks WebDriver to wait until it can find a part within the blade that has text that contains the 'Send Error' string. Once it can find such part it is returned to the errorPart variable, or if it can't find it after the default timeout (10 seconds) it will throw an exception with the text specified in the last parameter.

You can also use classic Selenium WebDriver syntax to find any element based on a **By** selector. For example, this will find a single button element within the found part:

```cs
webDriver.WaitUntil(() => errorPart.FindElement(By.TagName("button")),
					"Could not find the button.")
	     .Click();
```

<a name="portal-test-framework-testing-parts-and-blades-full-example"></a>
#### Full example

```cs
using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Portal.TestFramework.Core;
using Microsoft.Selenium.Utilities;
using OpenQA.Selenium;
using Microsoft.Portal.TestFramework.Core.Shell;

namespace SamplesExtensionTests
{
    [TestClass]
    public class PartsAndBlades
    {
        private const string ExtensionUrl = "http://localhost:11998";
        private const string ExtensionWebSitePath = @"d:\Users\julioct\Documents\PortalSDK\FrameworkPortal\Extensions\SamplesExtension\Extension";
        private static IWebDriver webDriver;
        private static PortalServer portalServer;
        private static WebServer extensionServer;

        [TestInitialize]
        public void TestInitialize()
        {
            extensionServer = new WebServer(new Uri(ExtensionUrl), ExtensionWebSitePath);
            if (extensionServer.IsHostedByTestFramework)
            {
                extensionServer.Start();
            }

            portalServer = PortalServer.Create();

            if (portalServer.IsHostedByTestFramework)
            {
                portalServer.RegisterExtension("Samples", new Uri(extensionServer.Uri));
                portalServer.Start();
            }

            webDriver = WebDriverFactory.Create();
            webDriver.Url = "about:blank";
            portalServer.ClearUserSettings();
        }

        [TestMethod]
        public void CanFindPartsAndBlades()
        {
            var portal = this.NavigateToPortal();

            string samplesTitle = "Samples";

            var samplesPart = portal.StartBoard.FindSinglePartByTitle<ButtonPart>(samplesTitle);
            samplesPart.Click();

            var blade = portal.FindSingleBladeByTitle(samplesTitle);

            string sampleName = "Notifications";

            blade.FindSinglePartByTitle(sampleName).Click();

            blade = portal.FindSingleBladeByTitle(sampleName);

            var errorPart = webDriver.WaitUntil(() => blade.FindElements<Part>()
														   .FirstOrDefault(p => p.Text.Contains("Send Error")),
												"Could not find a part with a 'Send Error' text.");

            webDriver.WaitUntil(() => errorPart.FindElement(By.TagName("button")),
								"Could not find the button.")
					 .Click();
        }

        [TestCleanup]
        public void TestCleanup()
        {
            webDriver.Dispose();
            portalServer.Dispose();
            extensionServer.Dispose();
        }
    }
}

```


<a name="portal-test-framework-testing-filling-out-forms"></a>
## Testing: Filling Out Forms

You can find form fields using the **FindField** method of the **FormSection** class. First, let's find the form:

```cs
var portal = this.NavigateToPortal();

portal.StartBoard.FindSinglePartByTitle<ButtonPart>("New Contact").Click();

string contactName = "John Doe";
string subscriptionName = "Portal Subscription 2";

var blade = portal.FindSingleBladeByTitle("Basic Information");
var form = webDriver.WaitUntil(() => blade.FindElement<FormSection>(), "Could not find the form.");
```

In this example, the form has 2 fields, a TextBox field and a Selector field. Let's enter some text in the contactName text box field and wait until it is marked as Edited and Valid (since it supports validations):

```cs
string fieldName = "contactName";
var field = webDriver.WaitUntil(() => form.FindField<Textbox>(fieldName),
								string.Format("Could not find the {0} textbox.", fieldName));
field.Value = contactName + Keys.Tab;
webDriver.WaitUntil(() => field.IsEdited && field.IsValid,
					string.Format("The {0} field did not pass validations.", fieldName));
```

Now, let's find the Selector field and click it to open the associated picker blade:

```cs
fieldName = "subscriptionField";
form.FindField<Selector>(fieldName).Click();
```

Let's select an item from the picker's grid and click the OK button to send the selection back to the form:

```cs
blade = portal.FindSingleBladeByTitle("Select Subscription");

var grid = webDriver.WaitUntil(blade.FindElement<Grid>, "Could not find the grid in the blade.");
GridRow row = grid.SelectRow(subscriptionName);

PickerActionBar pickerActionBar = webDriver.WaitUntil(() => blade.FindElement<PickerActionBar>(),
													  "Could not find the picker action bar.");
webDriver.WaitUntil(() => pickerActionBar.OkButton.IsEnabled,
					"Expected the OK Button of the Picker Action Bar to be enabled after selecting an item in the picker list.");
pickerActionBar.ClickOk();
```

Finally, let's click the Create button to complete the form and then look for a blade with the title of the created Contact to verify that it got created successfully:

```cs
blade = portal.FindSingleBladeByTitle("Basic Information");

CreateActionBar createActionBar = webDriver.WaitUntil(() => blade.FindElement<CreateActionBar>(),
													  "Could not find the create action bar.");
createActionBar.ClickOk();

portal.FindSingleBladeByTitle(contactName);
```

<a name="portal-test-framework-testing-filling-out-forms-full-example"></a>
### Full Example
```cs
using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Portal.TestFramework.Core;
using Microsoft.Selenium.Utilities;
using OpenQA.Selenium;
using Microsoft.Portal.TestFramework.Core.Shell;
using Microsoft.Portal.TestFramework.Core.Controls;

namespace SamplesExtensionTests
{
    [TestClass]
    public class Create
    {
        private const string SamplesExtensionUrl = "http://localhost:11997";
        private const string SamplesExtensionWebSitePath = @"d:\Users\julioct\Documents\PortalSDK\FrameworkPortal\Extensions\SamplesExtension\Extension";
        private const string HubsExtensionUrl = "http://localhost:11998";
        private const string HubsExtensionWebSitePath = @"d:\Users\julioct\Documents\PortalSDK\FrameworkPortal\Extensions\HubsExtension";
        private static IWebDriver webDriver;
        private static PortalServer portalServer;
        private static WebServer samplesExtensionServer;
        private static WebServer hubsExtensionServer;

        [TestInitialize]
        public void TestInitialize()
        {
            hubsExtensionServer = new WebServer(new Uri(HubsExtensionUrl), HubsExtensionWebSitePath);
            if (hubsExtensionServer.IsHostedByTestFramework)
            {
                hubsExtensionServer.Start();
            }

            samplesExtensionServer = new WebServer(new Uri(SamplesExtensionUrl), SamplesExtensionWebSitePath);
            if (samplesExtensionServer.IsHostedByTestFramework)
            {
                samplesExtensionServer.Start();
            }

            portalServer = PortalServer.Create();

            if (portalServer.IsHostedByTestFramework)
            {
                portalServer.RegisterExtension("Hubs", new Uri(hubsExtensionServer.Uri));
                portalServer.RegisterExtension("Samples", new Uri(samplesExtensionServer.Uri));
                portalServer.Start();
            }

            webDriver = WebDriverFactory.Create();
            webDriver.Url = "about:blank";
            portalServer.ClearUserSettings();
        }

        [TestMethod]
        public void CanCreateContact()
        {
            var portal = this.NavigateToPortal();

            // Open and find the Create Form
            portal.StartBoard.FindSinglePartByTitle<ButtonPart>("New Contact").Click();

            string contactName = "John Doe";
            string subscriptionName = "Portal Subscription 2";

            var blade = portal.FindSingleBladeByTitle("Basic Information");
            var form = webDriver.WaitUntil(() => blade.FindElement<FormSection>(), "Could not find the form.");

            // Fill a textbox field
            string fieldName = "contactName";
            var field = webDriver.WaitUntil(() => form.FindField<Textbox>(fieldName),
											string.Format("Could not find the {0} textbox.", fieldName));
            field.Value = contactName + Keys.Tab;
            webDriver.WaitUntil(() => field.IsEdited && field.IsValid,
								string.Format("The {0} field did not pass validations.", fieldName));

            // Open a picker from a selector field and select an item
            fieldName = "subscriptionField";
            form.FindField<Selector>(fieldName).Click();

            blade = portal.FindSingleBladeByTitle("Select Subscription");

            var grid = webDriver.WaitUntil(blade.FindElement<Grid>, "Could not find the grid in the blade.");
            GridRow row = grid.SelectRow(subscriptionName);

            PickerActionBar pickerActionBar = webDriver.WaitUntil(() => blade.FindElement<PickerActionBar>(),
																  "Could not find the picker action bar.");
            webDriver.WaitUntil(() => pickerActionBar.OkButton.IsEnabled,
								"Expected the OK Button of the Picker Action Bar to be enabled after selecting an item in the picker list.");
            pickerActionBar.ClickOk();

            // Click the Create button
            blade = portal.FindSingleBladeByTitle("Basic Information");

            CreateActionBar createActionBar = webDriver.WaitUntil(() => blade.FindElement<CreateActionBar>(),
																  "Could not find the create action bar.");
            createActionBar.ClickOk();

            // There should be an open blade with 'John Doe' as its title
            portal.FindSingleBladeByTitle(contactName);
        }

        [TestCleanup]
        public void TestCleanup()
        {
            webDriver.Dispose();
            portalServer.Dispose();
            samplesExtensionServer.Dispose();
            hubsExtensionServer.Dispose();
        }
    }
}
```


<a name="portal-test-framework-testing-commands"></a>
## Testing Commands

The Test Framework provides objects to interact with commands both from the command bar and context menus.

<a name="portal-test-framework-testing-commands-to-use-commands-from-the-command-bar"></a>
### To use commands from the command bar
Use the **Blade.FindCommandBar** method to get an instance of the Command Bar and then the **CommandBar.FindCommandBarItem** method to find the relevant command:

```cs
var blade = portal.FindSingleBladeByTitle(contactName);

CommandBar commandBar = blade.FindCommandBar();

var command = commandBar.FindCommandBarItem("DELETE");
```

Once you call Click() on the command it could be that it opens a message box to show some message to the user. You can interact with that message box using the **CommandBar.FindMessageBox** method and the **MessageBox.ClickButton** method:

```cs
command.Click();

commandBar.FindMessageBox("Delete contact").ClickButton("Yes");
webDriver.WaitUntil(() => !commandBar.HasMessageBox, "There is still a message box in the command bar.");
```

<a name="portal-test-framework-testing-commands-to-use-commands-from-context-menus"></a>
### To use commands from context menus
To do this you can first use Selenium's **Actions** class to perform a contextual click on the desired web element. Let's first find a grid row where we want to open the context menu:

```cs
var portal = this.NavigateToPortal();

string contactName = "Jane Doe";
string subscriptionName = "Portal Subscription 2";

this.ProvisionContact(contactName, subscriptionName, portal);

portal.StartBoard.FindSinglePartByTitle("Contacts").Click();
var blade = portal.FindSingleBladeByTitle("Contacts List");
var grid = webDriver.WaitUntil(() => blade.FindElement<Grid>(), "Could not find the grid.");
GridRow row = webDriver.WaitUntil(() => grid.FindRow(contactName), "Could not find the contact row.");
```

Now let's open the context menu:

```cs
Actions actions = new Actions(webDriver);
actions.ContextClick(row);
actions.Perform();
```

Then find the context menu and use the **ContextMenu.FindContextMenuItemByText** method to find the actual command to click:

```cs
ContextMenuItem menuItem = webDriver.WaitUntil(() => webDriver.FindElement<ContextMenu>(),
                                               "Could not find the context menu.")
                                    .FindContextMenuItemByText("Delete");
```

Finally, let's deal with the message box and verify that this Contact got deleted:

```cs
menuItem.Click();

portal.FindMessageBox("Delete contact").ClickButton("Yes");

webDriver.WaitUntil(() => !portal.HasMessageBox, "There is still a message box in the Portal.");

portal.StartBoard.FindSinglePartByTitle("Deleted");
```

<a name="portal-test-framework-testing-commands-full-example"></a>
### Full example
```cs
using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Portal.TestFramework.Core;
using Microsoft.Selenium.Utilities;
using OpenQA.Selenium;
using Microsoft.Portal.TestFramework.Core.Shell;
using Microsoft.Portal.TestFramework.Core.Controls;
using OpenQA.Selenium.Interactions;

namespace SamplesExtensionTests
{
    [TestClass]
    public class Commands
    {
        private const string SamplesExtensionUrl = "http://localhost:11997";
        private const string SamplesExtensionWebSitePath = @"d:\Users\julioct\Documents\PortalSDK\FrameworkPortal\Extensions\SamplesExtension\Extension";
        private const string HubsExtensionUrl = "http://localhost:11998";
        private const string HubsExtensionWebSitePath = @"d:\Users\julioct\Documents\PortalSDK\FrameworkPortal\Extensions\HubsExtension";
        private static IWebDriver webDriver;
        private static PortalServer portalServer;
        private static WebServer samplesExtensionServer;
        private static WebServer hubsExtensionServer;

        [TestInitialize]
        public void TestInitialize()
        {
            hubsExtensionServer = new WebServer(new Uri(HubsExtensionUrl), HubsExtensionWebSitePath);
            if (hubsExtensionServer.IsHostedByTestFramework)
            {
                hubsExtensionServer.Start();
            }

            samplesExtensionServer = new WebServer(new Uri(SamplesExtensionUrl), SamplesExtensionWebSitePath);
            if (samplesExtensionServer.IsHostedByTestFramework)
            {
                samplesExtensionServer.Start();
            }

            portalServer = PortalServer.Create();

            if (portalServer.IsHostedByTestFramework)
            {
                portalServer.RegisterExtension("Hubs", new Uri(hubsExtensionServer.Uri));
                portalServer.RegisterExtension("Samples", new Uri(samplesExtensionServer.Uri));
                portalServer.Start();
            }

            webDriver = WebDriverFactory.Create();
            webDriver.Url = "about:blank";
            portalServer.ClearUserSettings();
        }

        [TestMethod]
        public void CanDeleteContactFromBlade()
        {
            var portal = this.NavigateToPortal();

            string contactName = "John Doe";
            string subscriptionName = "Portal Subscription 2";

            this.ProvisionContact(contactName, subscriptionName, portal);

            var blade = portal.FindSingleBladeByTitle(contactName);

            CommandBar commandBar = blade.FindCommandBar();

            var command = commandBar.FindCommandBarItem("DELETE");
            command.Click();

            commandBar.FindMessageBox("Delete contact").ClickButton("Yes");
            webDriver.WaitUntil(() => !commandBar.HasMessageBox,
								"There is still a message box in the command bar.");

            portal.StartBoard.FindSinglePartByTitle("Deleted");
        }

        [TestMethod]
        public void CanDeleteContactFromGrid()
        {
            var portal = this.NavigateToPortal();

            string contactName = "Jane Doe";
            string subscriptionName = "Portal Subscription 2";

            this.ProvisionContact(contactName, subscriptionName, portal);

            portal.StartBoard.FindSinglePartByTitle("Contacts").Click();
            var blade = portal.FindSingleBladeByTitle("Contacts List");
            var grid = webDriver.WaitUntil(() => blade.FindElement<Grid>(), "Could not find the grid.");
            GridRow row = webDriver.WaitUntil(() => grid.FindRow(contactName), "Could not find the contact row.");

            Actions actions = new Actions(webDriver);
            actions.ContextClick(row);
            actions.Perform();

            ContextMenuItem menuItem = webDriver.WaitUntil(() => webDriver.FindElement<ContextMenu>(),
                                                           "Could not find the context menu.")
                                                .FindContextMenuItemByText("Delete");
            menuItem.Click();

            portal.FindMessageBox("Delete contact").ClickButton("Yes");

            webDriver.WaitUntil(() => !portal.HasMessageBox, "There is still a message box in the Portal.");

            portal.StartBoard.FindSinglePartByTitle("Deleted");
        }

        [TestCleanup]
        public void TestCleanup()
        {
            webDriver.Dispose();
            portalServer.Dispose();
            samplesExtensionServer.Dispose();
            hubsExtensionServer.Dispose();
        }

        private void ProvisionContact(string contactName, string subscriptionName, Portal portal)
        {
            // Open and find the Create Form
            portal.StartBoard.FindSinglePartByTitle<ButtonPart>("New Contact").Click();

            var blade = portal.FindSingleBladeByTitle("Basic Information");
            var form = webDriver.WaitUntil(() => blade.FindElement<FormSection>(), "Could not find the form.");

            // Fill a textbox field
            string fieldName = "contactName";
            var field = webDriver.WaitUntil(() => form.FindField<Textbox>(fieldName),
											string.Format("Could not find the {0} textbox.", fieldName));
            field.Value = contactName + Keys.Tab;
            webDriver.WaitUntil(() => field.IsEdited && field.IsValid,
								string.Format("The {0} field did not pass validations.", fieldName));

            // Open a picker from a selector field and select an item
            fieldName = "subscriptionField";
            form.FindField<Selector>(fieldName).Click();

            blade = portal.FindSingleBladeByTitle("Select Subscription");

            var grid = webDriver.WaitUntil(blade.FindElement<Grid>, "Could not find the grid in the blade.");
            GridRow row = grid.SelectRow(subscriptionName);

            PickerActionBar pickerActionBar = webDriver.WaitUntil(() => blade.FindElement<PickerActionBar>(),
																  "Could not find the picker action bar.");
            webDriver.WaitUntil(() => pickerActionBar.OkButton.IsEnabled,
								"Expected the OK Button of the Picker Action Bar to be enabled after selecting an item in the picker list.");
            pickerActionBar.ClickOk();

            // Click the Create button
            blade = portal.FindSingleBladeByTitle("Basic Information");

            CreateActionBar createActionBar = webDriver.WaitUntil(() => blade.FindElement<CreateActionBar>(),
																  "Could not find the create action bar.");
            createActionBar.ClickOk();

            // There should be an open blade with 'John Doe' as its title
            portal.FindSingleBladeByTitle(contactName);
        }
    }
}

```


<a name="portal-test-framework-taking-screenshots-while-testings"></a>
## Taking Screenshots while Testings

The Test Framework provides built in support for taking screenshots from test cases. You can use the **WebDriver.TakeScreenshot** method to take the screenshot and save it as a PNG file to the local disk. You can do this at any point within the test case, but a typical approach is to do it at least in the test CleanUp method when the outcome of the test case is not "Passed".

```cs
[TestCleanup]
public void TestCleanup()
{
    if (TestContext.CurrentTestOutcome != UnitTestOutcome.Passed && webDriver != null)
    {
        TestContext.AddResultFile(webDriver.TakeScreenshot(TestContext.TestRunResultsDirectory,
														   TestContext.TestName));
    }

    webDriver.Dispose();
    portalServer.Dispose();
    samplesExtensionServer.Dispose();
}
```

<a name="portal-test-framework-taking-screenshots-while-testings-full-example"></a>
### Full example

```cs
using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Portal.TestFramework.Core;
using Microsoft.Selenium.Utilities;
using OpenQA.Selenium;
using Microsoft.Portal.TestFramework.Core.Shell;

namespace SamplesExtensionTests
{
    [TestClass]
    public class Screenshots
    {
        public TestContext TestContext { get; set; }

        private const string SamplesExtensionUrl = "http://localhost:11997";
        private const string SamplesExtensionWebSitePath = @"d:\Users\julioct\Documents\PortalSDK\FrameworkPortal\Extensions\SamplesExtension\Extension";
        private static IWebDriver webDriver;
        private static PortalServer portalServer;
        private static WebServer samplesExtensionServer;

        [TestInitialize]
        public void TestInitialize()
        {
            samplesExtensionServer = new WebServer(new Uri(SamplesExtensionUrl), SamplesExtensionWebSitePath);
            if (samplesExtensionServer.IsHostedByTestFramework)
            {
                samplesExtensionServer.Start();
            }

            portalServer = PortalServer.Create();

            if (portalServer.IsHostedByTestFramework)
            {
                portalServer.RegisterExtension("Samples", new Uri(samplesExtensionServer.Uri));
                portalServer.Start();
            }

            webDriver = WebDriverFactory.Create();
            webDriver.Url = "about:blank";
            portalServer.ClearUserSettings();
        }

        [TestMethod]
        public void CanFindSamplesPart()
        {
            var portal = this.NavigateToPortal();

            // Intentional mistake. There is no part with this title in the StartBoard,
            // so the call to FindSinglePartByTitle will fail
            string samplesTitle = "The Samples";

            var samplesPart = portal.StartBoard.FindSinglePartByTitle<ButtonPart>(samplesTitle);
            samplesPart.Click();
        }

        [TestCleanup]
        public void TestCleanup()
        {
            if (TestContext.CurrentTestOutcome != UnitTestOutcome.Passed && webDriver != null)
            {
                TestContext.AddResultFile(webDriver.TakeScreenshot(TestContext.TestRunResultsDirectory,
																   TestContext.TestName));
            }

            webDriver.Dispose();
            portalServer.Dispose();
            samplesExtensionServer.Dispose();
        }
    }
}
```


<a name="portal-test-framework-loading-a-subset-of-extensions"></a>
## Loading a Subset of Extensions
There are some instances during test where you may want to only load your extension or a subset of extensions within the portal. You can do this using the feature.DisableExtensions feature flag. 

Usage: 

```
?feature.DisableExtensions=true&HubsExtension=true&Microsoft_Azure_Support=true&MyOtherExtension=true
```

- This will make every extension disabled by default.
- This will enable hubs (which almost everyone needs).
- This will enable the particular extension you want to test. 
- You can add multiple like the HubsExtension=true and MyOtherExtension=true if you want to test other extensions.



<a name="portal-test-framework-testing-best-practices"></a>
## Testing Best Practices

As you write UI based test cases using the Portal Test Framework it is recommended you follow a few best practices to ensure maximum reliability and to get the best value from your tests.

<a name="portal-test-framework-testing-best-practices-always-verify-that-every-action-completed-as-expected"></a>
### Always verify that every action completed as expected
In many cases the browser is not as fast as the test execution, so if you don't wait until expected conditions have completed your tests could easily fail. For example:

```cs
commandBar.FindMessageBox("Delete contact").ClickButton("Yes");
webDriver.WaitUntil(() => !commandBar.HasMessageBox, "There is still a message box in the command bar.");
```

Here, the "Yes" button of a message box is clicked and you would expect it to go away as soon as the button is clicked. However this might not happen as fast as you think. Therefore we wait until the CommandBar.HasMessageBox property reports 'false' before proceeding, which ensures the message box is gone and will not interfere with the next action.

<a name="portal-test-framework-testing-best-practices-log-everything"></a>
### Log everything
It can be very difficult to diagnose a failed test case without some good logging. An easy way to write these logs is to use the **TestContext.WriteLine** method:

```cs
TestContext.WriteLine("Starting provisioning from the StartBoard...");
```

<a name="portal-test-framework-testing-best-practices-use-built-in-test-framework-methods"></a>
### Use built in Test Framework methods
The Portal Test Framework provides many built in methods to perform actions on Portal web elements and it is recommended to use them for maximum test maintainability and reliability. For example, one way to find a StartBoard part by it's title is this:

```cs
var part = webDriver.WaitUntil(
    () => portal.StartBoard.FindElements<Part>()
    .FirstOrDefault(p => p.PartTitle.Equals("TheTitle")),
    "Could not find a part with title 'Samples'.");
```

However this can be greatly simplified by using a built in method:

```cs
var part = portal.StartBoard.FindSinglePartByTitle("TheTitle");
```

Not only this significantly reduces the amount of code to write and maintain but also encapsulates the best practice of waiting until elements are found since FindSinglePartByTitle will internally perform a WaitUntil operation that will retry until the part is found (or the timeout is reached).

BaseElement also contains an extension method that wraps the webDriver.WaitUntil call.

```cs
var part = blade.WaitForAndFindElement<Part>(p => p.PartTitle.Equals("TheTitle"));
```

<a name="portal-test-framework-testing-best-practices-use-waituntil-for-retrying-actions-and-waiting-for-conditions"></a>
### Use WaitUntil for retrying actions and waiting for conditions
WaitUntil can also be used to retry an action since it just takes a lambda function which could be an action and then a verification step afterwards.  WaitUntil will return when a "truthy" (not false or null value) is returned.  This can be useful if the particular action is flakey.  Please be careful to only use actions that are idempotent when trying to use WaitUntil in this pattern.

<a name="portal-test-framework-testing-best-practices-prefer-waituntil-to-assert-for-non-instantaneous-conditions"></a>
### Prefer WaitUntil to Assert for non instantaneous conditions
The traditional way to verify conditions within test cases is by using **Assert** methods. However, when dealing with conditions that won't be satisfied immediately you should instead use **WebDriver.WaitUntil**:

```cs
var field = form.FindField<Textbox>("contactName");
field.Value = contactName + Keys.Tab;
webDriver.WaitUntil(() => field.IsValid, "The 'contactName' field did not pass validations.");
```

In this example, if we would have instead used Assert to verify the IsValid propery the test would most like have failed since the TextBox field has a custom async validation that will perform a request to the backend server to perform the required validation, and this is expected to take at least a second.

<a name="portal-test-framework-testing-best-practices-create-proper-wrapper-abstractions-for-commonly-used-patterns"></a>
### Create proper wrapper/abstractions for commonly used patterns
A good practice is to create wrappers and abstractions for common patterns of code you use (eg when writing a WaitUntil, you may want to wrap it in a function that describes its actual intent).  This makes your test code clear in its intent by hiding the actual details to the abstraction's implementation.  It also helps with dealing with breaking changes as you can just modify your abstraction rather than every single test.  

If you think an abstraction you wrote would be generic and useful to the test framework, feel free to contribute it!

<a name="portal-test-framework-testing-best-practices-clear-user-settings-before-starting-a-test"></a>
### Clear user settings before starting a test
As you may know, the Portal keeps good track of all user customizations via persistent user settings. This behavior might not be ideal for test cases since each test case could potentially find a Portal with different customizations each time. To avoid this you can use the **portal.ResetDesktopState** method.  Note that the method will force a reload of the Portal.

```cs
portal.ResetDesktopState();
```

<a name="portal-test-framework-testing-best-practices-use-findelements-to-verify-the-absence-of-elements"></a>
### Use FindElements to verify the absence of elements
Sometimes you are not trying to find a web element but instead you want to verify that the element is not there. In these cases you can use the **FindElements** method in combination with Linq methods to verify if the element is there:

```cs
webDriver.WaitUntil(() => portal.StartBoard.FindElements<Part>()
                                           .Count(p => p.PartTitle.Equals("John Doe")) == 0,
                    "Expected to not find a part with title 'John Doe' in the StartBoard");
```

In the example, we are verifying that there is no part with title 'John Doe' in the StartBoard.

<a name="portal-test-framework-testing-best-practices-prefer-cssselector-to-xpath"></a>
### Prefer CssSelector to Xpath
You will eventually be faced with the choice of using either CSS selectors or XPath to find some web elements in the Portal. As a general rule the preferred approach is to use CSS selectors because:

- Xpath engines are different in each browser
- XPath can become complex and hense it can be harder to read
- CSS selectors are faster
- CSS is JQuery's locating strategy
- IE doesn't have a native XPath engine

Here for a simple example where we are finding the selected row in a grid:

```cs
grid.FindElements(By.CssSelector("[aria-selected=true]"))
```

If you think the element you found would be a useful abstraction, feel free to contribute it back to the test framework!



<a name="portal-test-framework-contributing-to-c-test-framework"></a>
## Contributing to C# Test Framework

Contributions that improve the Test Framework are welcome as they keep the code base healthy.  If you have improvements you wish to contribute back to the Test Framework, see below for steps on enlisting and submitting a pull request.  Please note that this is currently only available to Microsft employees.

<a name="portal-test-framework-contributing-to-c-test-framework-enlisting"></a>
### Enlisting
The repo uses a build environment called CoreXt.  Please be sure to follow the Cloud Engineering Service’s instructions for [Enlisting into an Existing repo](https://microsoft.sharepoint.com/teams/WAG/EngSys/Implement/OneBranch/Home.aspx) if this is your first time using CoreXt5.

The git repository is available at the following URL (Microsoft employees only):
https://msazure.visualstudio.com/DefaultCollection/One/_git/AzureUX-PortalFx-CSTestFx

The code can be viewed via the solution file <repoRoot>\src\TestFramework\TestFramework.sln.

<a name="portal-test-framework-contributing-to-c-test-framework-building"></a>
### Building
In order to build, you will need to [initialize the CoreXt environment for the repository](https://microsoft.sharepoint.com/teams/WAG/EngSys/Implement/OneBranch/Open%20Development%20Environment.aspx).  Once that is complete, you can call "build" at the repository root.  The build output will be available under <repoRoot>\out.

<a name="portal-test-framework-contributing-to-c-test-framework-testing"></a>
### Testing
Once you have a build, the nuget package Microsoft.Portal.TestFramework.CSharp will be available under the <repoRoot>\out\debug-AMD64\.  You can copy the binaries to your local test suites and then run your tests to verify the fix.

<a name="portal-test-framework-contributing-to-c-test-framework-submitting"></a>
### Submitting
To contribute back to the Test Framework, please submit a [pull request](https://msazure.visualstudio.com/DefaultCollection/One/_git/AzureUX-PortalFx-CSTestFx/pullrequestcreate).  Note that we may test your code changes with our internal repository's test suites before accepting your pull request.

<a name="portal-test-framework-contributing-to-c-test-framework-troubleshooting"></a>
### Troubleshooting
If you run into issues, please search the [internal Microsoft stack overflow](http://stackoverflow.microsoft.com) first.  If you are unable to find an answer, ask a new question and tag it with "ibiza-test".


<a name="planned-deprecation-c-portal-test-framework"></a>
# [PLANNED DEPRECATION] C# Portal Test Framework

> [Choosing the right test Framework](portalfx-choosing-test-framework.md)

<a name="planned-deprecation-c-portal-test-framework-notice"></a>
## NOTICE

The C# test framework is on the path to being deprecated.  It is not recommended for partners to use.  Existing users are recommended to migrate to the AzurePortal-Test typescript test framework.  The C# test framework is in maintenance mode and will **only get security fixes** (no more product fixes).

Deprecation timeline:
- June 2023 - Announcement of planned deprecation.  No more product fixes, only security fixes.
- Dec 2023 - Microsoft.Portal.TestFramework nuget package will no longer be published.  Microsoft.Portal.TestFramework.CSharp will continue to be published.
- June 2024 - The C# test framework code will no longer be maintained.  Microsoft.Portal.TestFramework.CSharp will no longer be published.

<a name="planned-deprecation-c-portal-test-framework-planned-deprecation-overview"></a>
## [PLANNED DEPRECATION] Overview

The C# test framework is a UI test framework built on top of the Selenium Webdriver C# bindings that are described in [https://www.seleniumhq.org/projects/webdriver](https://www.seleniumhq.org/projects/webdriver/).  Its primary goal is testing UI interactions in the Azure Portal.

The C# test framework provides the following.

* A base for writing UI based Selenium Webdriver tests.

* A suite of helpers for logging into, navigating, and manipulating controls, blades, and parts in the Portal

This document discusses the following topics.
* [Writing Tests](#writing-tests)
* [Creating the Test Project](#creating-the-test-project)
* [Testing Parts and Blades](#testing-parts-and-blades)
* [Entering Data into Forms](#entering-data-into-forms)
* [Testing Commands](#testing-commands)
* [Taking Screenshots while Testing](#taking-screenshots-while-testing)
* [Contributing to CSharp Typescript Test Framework](#contributing-to-csharp-typescript-test-framework)

* * *

<a name="planned-deprecation-c-portal-test-framework-planned-deprecation-writing-tests"></a>
## [PLANNED DEPRECATION] Writing Tests

<a name="planned-deprecation-c-portal-test-framework-planned-deprecation-writing-tests-prerequisites"></a>
### Prerequisites

Prerequisites for using the C# test framework are as follows.

* Nuget (https://www.nuget.org/) and [top-extensions-nuget.md](top-extensions-nuget.md)

* .NET Framework 4.7.2 or higher

* Visual Studio 2019 or higher, as specified in [What are the IDE specific installs required for Visual Studio?](https://eng.ms/docs/products/azure-portal-framework-ibizafx/development/ap-cli#FAQ)

* Understanding of the C# programming language

<a name="planned-deprecation-c-portal-test-framework-planned-deprecation-writing-tests-getting-started"></a>
### Getting Started

The C# Test framework is distributed as a NuGet package that is available in the Azure Official NuGet  feed [https://msazure.visualstudio.com/DefaultCollection/One/_packaging?feed=Official](https://msazure.visualstudio.com/DefaultCollection/One/_packaging?feed=Official).  There are two primary packages.

1. Microsoft.Portal.TestFramework

    It is located at [https://msazure.visualstudio.com/DefaultCollection/One/_Packaging?feed=Official&package=Microsoft.Portal.TestFramework&protocolType=NuGet&_a=package](https://msazure.visualstudio.com/DefaultCollection/One/_Packaging?feed=Official&package=Microsoft.Portal.TestFramework&protocolType=NuGet&_a=package)

1. Microsoft.Portal.TestFramework.Csharp

    It is located at [https://msazure.visualstudio.com/DefaultCollection/One/_packaging?feed=Official&package=Microsoft.Portal.TestFramework.CSharp&protocolType=NuGet&_a=package](https://msazure.visualstudio.com/DefaultCollection/One/_packaging?feed=Official&package=Microsoft.Portal.TestFramework.CSharp&protocolType=NuGet&_a=package)

    If you are just getting started, it is recommended to use the `Microsoft.Portal.TestFramework` NuGet package because it contains the necessary dependencies.  For more details about the two packages see [#understanding-the-differences-between-the-frameworks](#understanding-the-differences-between-the-frameworks).

<a name="planned-deprecation-c-portal-test-framework-planned-deprecation-writing-tests-understanding-the-differences-between-the-frameworks"></a>
### Understanding the differences between the frameworks

There are some differences between the  `Microsoft.Portal.TestFramework` and `Microsoft.Portal.TestFramework.Csharp`.

The `Microsoft.Portal.TestFramework.CSharp` package contains the core test framework DLLs.  It is updated with the latest code as the Portal is being developed and may contain fixes for test issues that were found after release.  It may also contain code that is not compatible with the deployed version of the Portal.

The `Microsoft.Portal.TestFramework` contains a reference to the `Microsoft.Portal.TestFramework.Csharp` package in addition to dependencies that are required for the C# test framework to run upon initial installation.

**NOTE**: Some external dependencies may require separate downloads, such as ChromeDriver, which match the version of Chrome.

<a name="planned-deprecation-c-portal-test-framework-creating-the-test-project"></a>
## Creating the Test Project

To create a test project that can use the Portal Test Framework, use the following steps.

1. Create a new **Visual Studio** Unit Test Project.

1. Install the NuGet Package Microsoft.Portal.TestFramework from [https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.testframework](https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.testframework).

1. If your test cases use the Azure Marketplace, also install the Microsoft.Portal.TestFramework.MarketplaceUtilities package from [https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.testframework.marketplaceutilities](https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.testframework.marketplaceutilities), which contains Selenium classes for elements in the Azure Marketplace.

1. Add an `app.config` file to your test project and define the basic Test Framework settings under appSettings, as in the following example.

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

  <!-- Team's email alias for identifying the owners of the test  -->
  <add key="PartnerTeamEmail" value="myTeamEmail@microsoft.com" />
</appSettings>

```

5. Add a new Unit Test class and start writing your test case.

<a name="planned-deprecation-c-portal-test-framework-creating-the-test-project-navigating-to-the-portal"></a>
### Navigating to the Portal

To navigate to the Portal, the extension supplies the Portal's URI.  We recommend setting the value in the `app.config` file as shown in [Creating the Test Project](#creating-the-test-project).  After the extension has the Portal uri, it can use the **WebDriverFactory.Create** method to create an instance of the `WebDriver` object and then use the **PortalAuthentication** class to login and navigate to the Portal in the browser, as in the following example.

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

**NOTE**: Multi-factor authentication (MFA) is not supported.  You must use an account that does not require MFA. To get an unprotected account, please see [https://aka.ms/portalfx/testaccounts](https://aka.ms/portalfx/testaccounts).  If you have any issues with the accounts, you should contact the Identity Division at [https://aka.ms/portalfx/identitydivision](https://aka.ms/portalfx/identitydivision).

For more information about handling credentials, see [#managing-authentication-credentials](#managing-authentication-credentials).

### Sideloading An Extension

The Portal provides options for side loading your extension for testing. To side load your extension you need to set the appropriate query strings and execute the `registerTestExtension` function. An example of side loading a deployed extension can be seen below. For more information, see [Sideloading an Extension](top-extensions-sideloading.md).

```csharp

// Sign into the portal
portalAuth.SignInAndSkipPostValidation(userName: "", /** The account login to use.  Note Multi Factor Authentication (MFA) is not supported, you must use an account that does not require MFA **/
    password: "", /** The account password **/
    tenantDomainName: string.Empty, /** the tenant to login to, set only if you need to login to a specific tenant **/
    query: "feature.canmodifyextensions=true", /** Query string to use when navigating to the portal.  **/ 
    fragment: "#" /** The hash fragment, use this to optionally navigate directly to your resource on sign in. **/);
//config#navigateToPortal

// Check for and click the Untrusted Extension prompt if its present
Microsoft.Portal.TestFramework.Core.Shell.Portal.CheckAndClickExtensionTrustPrompt(webDriver);
var portal = Microsoft.Portal.TestFramework.Core.Shell.Portal.FindPortal(webDriver, false);

// Register a deployed extension via javascript and then reload the portal.  Not required if using the query string method to load from localhost
(webDriver as IJavaScriptExecutor).ExecuteScript("MsPortalImpl.Extension.registerTestExtension({ name: \"SamplesExtension\", uri: \"https://df.onecloud.azure-test.net/Samples\"});");
portal.WaitForPortalToReload(() => webDriver.Navigate().Refresh());

// Check for and click the Untrusted Extension prompt if its present
Microsoft.Portal.TestFramework.Core.Shell.Portal.CheckAndClickExtensionTrustPrompt(webDriver);
portal = Microsoft.Portal.TestFramework.Core.Shell.Portal.FindPortal(webDriver, false);

```

Finally, you should dispose the `WebDriver` to cleanup, as in the following example.

```csharp

// Clean up the webdriver after
webDriver.Dispose();

```

### Managing authentication credentials

While the test framework does not provide any support for managing login credentials, the following are some recommendations.

1.  If you are in the Azure org, please see the Azure Security guidelines that are located at [https://aka.ms/portalfx/securityguidelines](https://aka.ms/portalfx/securityguidelines)

1.  Do not store your credentials in the test code.

1.  Do not check in your credentials into your repository.

1.  Some possibilities for storing login credentials include:

   * Using the Windows Credential Store.

   * Using Azure Key Vault.

### Full Sample Code

The following code demonstrates navigating to the Portal for testing.

```

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
            Microsoft.Portal.TestFramework.Core.Shell.Portal.CheckAndClickExtensionTrustPrompt(webDriver);
            var portal = Microsoft.Portal.TestFramework.Core.Shell.Portal.FindPortal(webDriver, false);

            // Register a deployed extension via javascript and then reload the portal.  Not required if using the query string method to load from localhost
            (webDriver as IJavaScriptExecutor).ExecuteScript("MsPortalImpl.Extension.registerTestExtension({ name: \"SamplesExtension\", uri: \"https://df.onecloud.azure-test.net/Samples\"});");
            portal.WaitForPortalToReload(() => webDriver.Navigate().Refresh());

            // Check for and click the Untrusted Extension prompt if its present
            Microsoft.Portal.TestFramework.Core.Shell.Portal.CheckAndClickExtensionTrustPrompt(webDriver);
            portal = Microsoft.Portal.TestFramework.Core.Shell.Portal.FindPortal(webDriver, false);
            //config#sideLoadingExtension

            //config#dispose
            // Clean up the webdriver after
            webDriver.Dispose();
            //config#dispose
        }
    }
}

```

## Testing Parts and Blades

An extension can find parts on the StartBoard by using the **Portal.StartBoard.FindSinglePartByTitle** method, after you have an instance of the Portal object. The method will give you a an instance of the Part class that you can use to perform actions on the part, like clicking on it.  In the following example, the button whose name is "Samples" is clicked.

```cs
var portal = this.NavigateToPortal();

string samplesTitle = "Samples";

var samplesPart = portal.StartBoard.FindSinglePartByTitle<ButtonPart>(samplesTitle);
samplesPart.Click();
```

You can find blades in a similar way using the **Portal.FindSingleBladeByTitle** method. You can then find parts within the blade using the **Blade.FindSinglePartByTitle** method, as in the following example.

```cs
var blade = portal.FindSingleBladeByTitle(samplesTitle);

string sampleName = "Notifications";

blade.FindSinglePartByTitle(sampleName).Click();

blade = portal.FindSingleBladeByTitle(sampleName);
```

If you need to find parts based on different conditions, you can use the `FindElement` or `FindElements` methods on any web element, as in the following example.

```cs
var errorPart = webDriver.WaitUntil(() => blade.FindElements<Part>()
                                               .FirstOrDefault(p => p.Text.Contains("Send Error")),
									"Could not find a part with a Send Error text.");
```

**NOTE**: The **WebDriver.WaitUntil** method is a general and recommended mechanism to ask the **WebDriver** to retry an operation until a condition succeeds. In this instance, the test case waits by polling continually until it finds a part in the blade that contains text that includes the 'Send Error' string. When the part is found, it is returned to the `errorPart` variable; otherwise, if it is not found before the default timeout of 10 seconds, the  method throws an exception that uses the text specified in the last parameter. For more information, see [portalfx-extensions-bp-csharp-test.md#testing-best-practices](portalfx-extensions-bp-csharp-test.md#testing-best-practices).

Classic Selenium **WebDriver** syntax can also be used to find any element based on a **By** selector. For example, the following code finds a single button element within the found part.

```cs
webDriver.WaitUntil(() => errorPart.FindElement(By.TagName("button")),
					"Could not find the button.")
	     .Click();
```
For more information, see [portalfx-extensions-bp-csharp-test.md](portalfx-extensions-bp-csharp-test.md).

### Full example

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

## Entering Data into Forms

Forms are typically used to wrap textboxes, dropdowns and other types of input.  The test framework provides helpers to find a form and then find specific input fields in the form by the field label or fieldName.  The primary way to find form fields is to use the **FindField** method of the **FormSection** class, as in the following example.

1. The extension locates the form, as in the following code. In this example, the form contains two fields: a TextBox field and a Selector field.

    ```cs
    var portal = this.NavigateToPortal();

    portal.StartBoard.FindSinglePartByTitle<ButtonPart>("New Contact").Click();

    string contactName = "John Doe";

    string subscriptionName = "Portal Subscription 2";
    var blade = portal.FindSingleBladeByTitle("Basic Information");
    var form = webDriver.WaitUntil(() => blade.FindElement<FormSection>(), "Could not find the form.");
    ```

1.  The form has 2 fields, a TextBox field and a Selector field. The following example supports validations. The user can enter text in the contactName `TextBox` field and wait until it is marked as Edited and Valid.

    ```cs
    string fieldName = "contactName";
    var field = webDriver.WaitUntil(() => form.FindField<Textbox>(fieldName),
                                    string.Format("Could not find the {0} textbox.", fieldName));
    field.Value = contactName + Keys.Tab;
    webDriver.WaitUntil(() => field.IsEdited && field.IsValid,
                        string.Format("The {0} field did not pass validations.", fieldName));
    ```

1. Find the Selector field and click it to open the associated picker blade.

    ```cs
    fieldName = "subscriptionField";
    form.FindField<Selector>(fieldName).Click();
    ```

1.  Select an item from the picker's grid and click the OK button to send the selection back to the form.

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

1. Click the Create button to complete the form and then look for a blade with the title of the created Contact to verify that it was created successfully.

    ```cs
    blade = portal.FindSingleBladeByTitle("Basic Information");

    CreateActionBar createActionBar = webDriver.WaitUntil(() => blade.FindElement<CreateActionBar>(),
                                                        "Could not find the create action bar.");
    createActionBar.ClickOk();

    portal.FindSingleBladeByTitle(contactName);
    ```

### Full Example

The entire example is in the following code.

<!-- Determine whether this is in the SDK or in the controls playground, or in the dogfood samples. -->

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

## Testing Commands

The Test Framework provides objects to interact with commands both from the command bar and context menus.

### To use commands from the command bar

Use the **Blade.FindCommandBar** method to get an instance of the Command Bar and then the **CommandBar.FindCommandBarItem** method to find the relevant command, as in the following example.

```cs
var blade = portal.FindSingleBladeByTitle(contactName);

CommandBar commandBar = blade.FindCommandBar();

var command = commandBar.FindCommandBarItem("DELETE");
```

After the  `Click()` method on the command is called, the extension may display a messageBox to show a message to the user. The extension can interact with the messageBox using the **CommandBar.FindMessageBox** method and the **MessageBox.ClickButton** method, as in the following example.

```cs
command.Click();

commandBar.FindMessageBox("Delete contact").ClickButton("Yes");
webDriver.WaitUntil(() => !commandBar.HasMessageBox, "There is still a message box in the command bar.");
```

### To use commands from context menus

Use the following steps to use Selenium's **Actions** class to perform a contextual click on the desired web element.

1. Find a grid row that has a context menu to open.

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

1. Open the context menu.

    ```cs
    Actions actions = new Actions(webDriver);
    actions.ContextClick(row);
    actions.Perform();
    ```

1. Find the context menu and use the **ContextMenu.FindContextMenuItemByText** method to find the actual command to click.

    ```cs
    ContextMenuItem menuItem = webDriver.WaitUntil(() => webDriver.FindElement<ContextMenu>(),
                                                "Could not find the context menu.")
                                        .FindContextMenuItemByText("Delete");
    ```

1. Deal with the message box to verify that this Contact was deleted.

    ```cs
    menuItem.Click();

    portal.FindMessageBox("Delete contact").ClickButton("Yes");

    webDriver.WaitUntil(() => !portal.HasMessageBox, "There is still a message box in the Portal.");

    portal.StartBoard.FindSinglePartByTitle("Deleted");
    ```

### Full example

The entire example is in the following code.

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


## Taking Screenshots while Testing

The Test Framework provides built-in support for taking screenshots from test cases. You can use the **WebDriver.TakeScreenshot** method to take the screenshot and save it as a PNG file to the local disk. You can do this at any point within the test case, but a typical approach is to do use the method in the test `CleanUp` method when the outcome of the test case is not "Passed" or if an assertion fails, as in the following example.

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

### Full example

The following example contains all the code for the test.

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

### Loading a subset of extensions

There are some instances during test where you may want to only load your extension or a subset of extensions within the Portal. You can do this using the `feature.DisableExtensions` feature flag.
Usage is as follows.

```
?feature.DisableExtensions=true&HubsExtension=true&Microsoft_Azure_Support=true&MyOtherExtension=true
```

*  This will make every extension disabled by default.
*  This will enable hubs, which are used by most developers
*  This will enable the specific extension you want to test.
*  You can add multiple extensions,  like the` HubsExtension=true and MyOtherExtension=true` if you want to test other extensions.

### Disabling a specific extension

If you want to disable a single extension, you can use the `canmodifyextensions` feature flag as in the following code.

`?feature.canmodifyextensions=true&ExtensionNameToDisable=false`

For example, if you want to turn off an old extension and turn on a new one, you can use the following code.

```
?feature.canmodifyextensions=true&MyOldExtension=false&MyNewExtension=true
```


<a name="planned-deprecation-c-portal-test-framework-contributing-to-csharp-test-framework"></a>
## Contributing to CSharp Test Framework

See the CSTestFx contribution guide [here](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx-CSTestFx?path=%2FCONTRIBUTING.md&version=GBmaster&_a=contents)

<a name="planned-deprecation-c-portal-test-framework-contributing-to-the-microsoft-azureportal-test-framework"></a>
## Contributing to the @microsoft/azureportal-test framework

See the @microsoft/azureportal-test contribution guide [here](https://aka.ms/portalfx/microsoft-azureportal-test#contributing)
<a name="planned-deprecation-c-portal-test-framework-contributing-to-the-microsoft-azureportal-test-framework-troubleshooting"></a>
### Troubleshooting
<a name="planned-deprecation-c-portal-test-framework-contributing-to-the-microsoft-azureportal-test-framework-troubleshooting-other-issues"></a>
#### Other issues

If issues are encountered while developing the improvement, please search the internal StackOverflow that is located at [http://stackoverflow.microsoft.com](http://stackoverflow.microsoft.com) first.

 If you are unable to find an answer, reach out to the Ibiza team at  [Stackoverflow Ibiza Test](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza-test).

 For a list of topics and stackoverflow tags, see [portalfx-stackoverflow.md].



<a name="planned-deprecation-c-portal-test-framework-testing-best-practices"></a>
## Testing Best Practices

As you write UI based test cases using the Portal Test Framework it is recommended you follow a few best practices to ensure maximum reliability and to get the best value from your tests.

*  Always verify that every action completed as expected

    In many cases, the browser is not as fast as the test execution, so if you do not wait until expected conditions have completed, your tests could easily fail. For example, a messageBox may not be removed from the screen within a few moments after the button is clicked, even though the "Yes" button of a message box was clicked.   It is best practice to wait until the `CommandBar.HasMessageBox` property reports `false` before proceeding, as in the following example. This ensures the message box is gone and will not interfere with the next action.

    ```cs
    commandBar.FindMessageBox("Delete contact").ClickButton("Yes");
    webDriver.WaitUntil(() => !commandBar.HasMessageBox, "There is still a message box in the command bar.");
    ```
*  Log everything

    It can be very difficult to diagnose a failed test case without a log. An easy way to write these logs is to use the `TestContext.WriteLine` method, as in the following example.

    ```cs
    TestContext.WriteLine("Starting provisioning from the StartBoard...");
    ```

*  Use built-in Test Framework methods

    The Portal Test Framework provides many built-in methods to perform actions on Portal web elements.  It is recommended to use them for maximum test maintainability and reliability. For example, one way to find a StartBoard part by its title is in the following example.

    ```cs
    var part = webDriver.WaitUntil(
        () => portal.StartBoard.FindElements<Part>()
        .FirstOrDefault(p => p.PartTitle.Equals("TheTitle")),
        "Could not find a part with title 'Samples'.");
    ```

    This code can be simplified by using a built-in method, as in the following example.

    ```cs
    var part = portal.StartBoard.FindSinglePartByTitle("TheTitle");
    ```

    This significantly reduces the amount of code. It also encapsulates the best practice of waiting until elements are found, because the `FindSinglePartByTitle` method internally performs a `WaitUntil` operation that retries until the part is found or the timeout is reached.

    The `BaseElement` API also contains an extension method that wraps the `webDriver.WaitUntil` call.

    ```cs
    var part = blade.WaitForAndFindElement<Part>(p => p.PartTitle.Equals("TheTitle"));
    ```

* Use the WaitUntil method

    The `WaitUntil` method should be used when retrying actions or waiting for conditions. It can also be used to retry an action, because it takes a lambda function which could be an action, followed by a verification step.  The `WaitUntil` method will return when a "truthy" value is returned, i.e., the value is neither false nor null.  This is useful if the specific action does not behave consistently.  Remember to use only actions that are [idempotent](portalfx-extensions-glossary-testing.md) when using the  `WaitUntil` method in this pattern.

* Use WaitUntil instead of Assert

    The traditional method of verifying conditions within test cases is by using **Assert** methods. However, when dealing with conditions that are not satisfied immediately, it is best practice to use the  **WebDriver.WaitUntil** method, as in the following example.

    ```cs
    var field = form.FindField<Textbox>("contactName");
    field.Value = contactName + Keys.Tab;
    webDriver.WaitUntil(() => field.IsValid, "The 'contactName' field did not pass validations.");
    ```

    In this example, the test would have failed if the `Assert` method had been used to verify the `IsValid` property,
     because the `TextBox` field uses a custom asynchronous validation.  This validation sends a request to the backend server to perform the required validation, which may take at least a second.

*  Create wrapper abstractions

    It is best practice to create wrappers and abstractions for common patterns of code. For example, when writing a `WaitUntil`, you may want to wrap it in a function that describes its actual intent.  This makes the intent of the  test code clear by hiding the actual details of  the abstraction's implementation.  It also helps with dealing with breaking changes, because you can modify the abstraction instead of every single test.

    If an abstraction you wrote might be generic and useful to the test framework, you may contribute it as specified in [https://aka.ms/portalfx/contributing](https://aka.ms/portalfx/contributing).

* Clear user settings before starting a test

    The Portal keeps track of all user customizations by using persistent user settings. This behavior is not ideal for test cases, because each test case might use Portals that have different customizations. To avoid this you can use the **portal.ResetDesktopState** method.

    ```cs
    portal.ResetDesktopState();
    ```

    **NOTE**: The method will force a reload of the Portal.

* Use `FindElements` to verify the absence of elements

    Sometimes an extension wants to verify that an element is not present, which may not be the same as code that validates  that an element is present.   In these cases you can use the **FindElements** method in combination with Linq methods to see if the element exists. For example, the following code verifies that there is no part with title 'John Doe' in the StartBoard.

    ```cs
    webDriver.WaitUntil(() => portal.StartBoard.FindElements<Part>()
                                            .Count(p => p.PartTitle.Equals("John Doe")) == 0,
                        "Expected to not find a part with title 'John Doe' in the StartBoard");
    ```

* Prefer CssSelector to Xpath

    It is best practice to use CSS selectors instead of **XPath** to find some web elements in the Portal. Some reasons are as follows.

    * **Xpath** engines are different in each browser

    * **XPath** can become complex and therefore more difficult to read

    * CSS selectors are faster

    * CSS is **JQuery's** locating strategy

    * **Internet Explorer** does not have a native **XPath** engine

    For example, the following code locates the selected row in a grid.

    ```cs
    grid.FindElements(By.CssSelector("[aria-selected=true]"))
    ```


<!--
gitdown": "include-file", "file": "../templates/portalfx-extensions-glossary-testing.md"}
-->

## Overview

You write UI based test cases using Visual Studio and the Portal Test Framework which is part of the Portal SDK.

### Creating the Test Project
To create a test project that can use the Portal Test Framwork:

1. Create a new Visual Studio Unit Test Project.
2. Install the NuGet Package Microsoft.Portal.TestFramework from [here](https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.testframework).
3. If your test cases involve the Azure Marketplace, also install the Microsoft.Portal.TestFramework.MarketplaceUtilities package from [here](https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.testframework.marketplaceutilities), which contains Selenium classes for elements in the Azure Marketplace.
4. Add an app.config file to your test project and define the basic Test Framework settings under appSettings. For example:

{"gitdown": "include-section", "file": "../samples/SampleCSTestsFiles/app.config", "section": "config#appSettings"}

5. Add a new Unit Test class and start writing your test case

### Navigating to the Portal
To navigate to the Portal, you first must supply the Portal's uri.  We recommend setting the value in the app.config file as shown above.  Once you have the Portal uri, you can use the **WebDriverFactory.Create** method to create an instance of the WebDriver object and then use the **PortalAuthentication** class to login, navigate to the Portal in the browser.

{"gitdown": "include-section", "file": "../samples/SampleCSTestsFiles/NavigateToPortalTest.cs", "section": "config#navigateToPortal"}

Please note that multi factor authentication (MFA) is not supported, you must use an account that does not require MFA.  If you are part of the Microsoft Azure organization please see (Azure Security Guidelines)[https://microsoft.sharepoint.com/teams/azure2fa/SitePages/FAQ%20on%20Use%20of%20MSA%20on%20Azure%20Subsriptions.aspx] for details on how to request an exception for an MSA/OrgID account.  You can not use a service account to login to the Azure Portal.

### Side Loading An Extension via Test Framework
The Portal provides options for side loading your extension for testing.  If you wish to side load your extension (either a localhost or deployed one) you can set the appropriate query strings and execute the registerTestExtension function for deployed extensions.  For a localhost extension you can just set a query string.  See (Testing in Production)[#Testing in production] for details.

{"gitdown": "include-section", "file": "../samples/SampleCSTestsFiles/NavigateToPortalTest.cs", "section": "config#sideLoadingExtension"}

Finally, you should dispose the WebDriver to cleanup:

{"gitdown": "include-section", "file": "../samples/SampleCSTestsFiles/NavigateToPortalTest.cs", "section": "config#dispose"}

### Managing authentication credentials (unsupported)
While the test framework does not provide any support for managing login credentials, there are some recommendations:
1.  If you are in the Azure org, please see (Azure Security guidelines)[https://microsoft.sharepoint.com/teams/azure2fa/SitePages/FAQ%20on%20Use%20of%20MSA%20on%20Azure%20Subsriptions.aspx]
1.  Do not store your credentials in the test code.
1.  Do not check in your credentials into your repository.
1.  Some possibilities for storing login credentials include:
    1.  Using the Windows Credential Store.
    1.  Using Azure Key Vault.
    1.  Write your own service for providing credentials.

### Full Sample Code
{"gitdown": "include-file", "file": "../samples/SampleCSTestsFiles/NavigateToPortalTest.cs"}
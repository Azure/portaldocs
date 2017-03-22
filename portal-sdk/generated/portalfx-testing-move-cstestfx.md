
<a name="notice-changes-to-c-test-framework-nuget"></a>
## NOTICE: Changes to C# Test Framework NuGet

<a name="notice-changes-to-c-test-framework-nuget-what"></a>
### What
The Ibiza Portal’s C# Test Framework is being moved to a separate repository.  This will empower partners to iterate faster without depending on the Portal Teams SDK ship cycle.  You may contribute directly or creating your own forks of the Test Framework.

<a name="notice-changes-to-c-test-framework-nuget-when"></a>
### When
The new repository is already available for you to enlist into now.   An email will be sent when the Microsoft.Portal.TestFramework NuGet contains the changes.

<a name="notice-changes-to-c-test-framework-nuget-getting-the-new-test-framework"></a>
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

<a name="notice-changes-to-c-test-framework-nuget-viewing-the-source-code-and-contributing-back"></a>
### Viewing the source code and contributing back
If you wish to view the source code and possibly contribute fixes back to the Test Framework then please see [the contribution article](portalfx-testing-contributing.md).

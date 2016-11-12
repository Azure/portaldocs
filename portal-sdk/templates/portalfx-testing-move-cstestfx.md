## NOTICE: Changes to C# Test Framework nuget

### What
The Ibiza Portal’s C# Test Framework is being moved to a separate repository.  This will empower partners to iterate faster without depending on the Portal Teams SDK ship cycle.  You may contribute directly or creating your own forks of the Test Framework.

### When
The new repository is already available for you to enlist into now.   An email will be sent when the Microsoft.Portal.TestFramework nuget contains the changes.

### Getting the new test framework:
If you are currently using the [Microsoft.Portal.TestFramework NuGet](https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.testframework&packageVersion=5.0.302.542&_a=view) (recommended), then there should be minimal changes required.  Most likely you will just need to update your NuGet version and it should pull down the new dependencies.  If you did any custom copying of dlls then please note that some unnecessary DLLs have been removed.  The Microsoft.Portal.TestFramework nuget will continue to be tied with Portal releases and will stamped with the same version as the portal framework it was built with.

If you wish to pick up the absolute latest Test Framework bits, a nuget package called [Microsoft.Portal.TestFramework.CSharp](https://msazure.visualstudio.com/DefaultCollection/One/_apps/hub/ms.feed.feed-hub?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.testframework.csharp&packageVersion=1.0.8.8&_a=view) (not the same as Microsoft.Portal.TestFramework) is available via the [MsAzure Official feed](https://msazure.pkgs.visualstudio.com/_packaging/Official/nuget/v3/index.json) and [wanuget official](http://wanuget/Official/nuget).
This package only contains the necessary DLLs for building the test framework, not running it.  You will need include some additional Portal framework DLLs (put them in the same directory as the running tests) in order to properly run tests (these DLLs are automatically included in the Microsoft.Portal.TestFramework nuget).  The specific DLLs are listed in the Microsoft.Portal.TestFramework.CSharp’s readme.txt file.  

### Viewing the source code and contributing back
If you wish to view the source code and possibly contribute fixes back to the Test Framework then please see [the contribution article](#portalfx-testing-contributing).

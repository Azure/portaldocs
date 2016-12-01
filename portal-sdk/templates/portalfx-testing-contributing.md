## Contributing

Contributions that improve the Test Framework are welcome as they keep the code base healthy.  If you have improvements you wish to contribute back to the Test Framework, see below for steps on enlisting and submitting a pull request.  Please note that this is currently only available to Microsft employees.

### Enlisting
The repo uses a build environment called CoreXt.  Please be sure to follow the Cloud Engineering Service’s instructions for [Enlisting into an Existing repo](https://microsoft.sharepoint.com/teams/WAG/EngSys/Implement/OneBranch/Home.aspx) if this is your first time using CoreXt5.

The git repository is available at the following URL (Microsoft employees only):
https://msazure.visualstudio.com/DefaultCollection/One/_git/AzureUX-PortalFx-CSTestFx

The code can be viewed via the solution file <repoRoot>\src\TestFramework\TestFramework.sln.

### Building
In order to build, you will need to [initialize the CoreXt environment for the repository](https://microsoft.sharepoint.com/teams/WAG/EngSys/Implement/OneBranch/Open%20Development%20Environment.aspx).  Once that is complete, you can call "build" at the repository root.  The build output will be available under <repoRoot>\out.

### Testing
Once you have a build, the nuget package Microsoft.Portal.TestFramework.CSharp will be available under the <repoRoot>\out\debug-AMD64\.  You can copy the binaries to your local test suites and then run your tests to verify the fix.

### Submitting
To contribute back to the Test Framework, please submit a [pull request](https://msazure.visualstudio.com/DefaultCollection/One/_git/AzureUX-PortalFx-CSTestFx/pullrequestcreate).  Note that we may test your code changes with our internal repository's test suites before accepting your pull request.

### Troubleshooting
If you run into issues, please search the [internal Microsoft stack overflow](http://stackoverflow.microsoft.com) first.  If you are unable to find an answer, ask a new question and tag it with "ibiza-test".
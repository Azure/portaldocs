
<a name="contributing-to-csharp-typescript-test-framework"></a>
## Contributing to CSharp Typescript Test Framework

Contributions that improve the Test Framework are welcome, because they keep the code base healthy.  When you have improvements to contribute back to the Typescript Test Framework, use the following steps to enlist into the list of contributors and submit a pull request. If you are unfamiliar with pull requests in Github, please review the help documentation located at [https://help.github.com/articles/about-pull-requests/](https://help.github.com/articles/about-pull-requests/). The pull request instructions are located at [top-extensions-publishing.md](top-extensions-publishing.md), with the following additions.
1. The Test Framework uses a different `<repoRoot>`
1. The Test Framework is not associated with the production extension branches
1. You may or may not want to set up a new local git repository specifically for test framework improvements
1. The configuration files must be modified to match the test framework environment

**NOTE**: We may test the improvement changes with our internal repository's test suites before accepting the pull request.

**NOTE**: Please note that the opportunity to contribute to the test framework is only available to first-party extension developers, i.e., Microsoft employees.

<a name="contributing-to-csharp-typescript-test-framework-enlisting-into-the-repository"></a>
### Enlisting into the repository

The repository is hosted in Azure's GitHub organization.  The instructions for requesting access to the Azure Github organization are located at [https://repos.opensource.microsoft.com/](https://repos.opensource.microsoft.com/).

Once you have joined the Azure Github organization, you can request access to the msportalfx-test team by using the site located at [https://repos.opensource.microsoft.com/Azure/teams/msportalfx-test](https://repos.opensource.microsoft.com/Azure/teams/msportalfx-test).

The **GitHub** repository is located at  [https://github.com/Azure/msportalfx-test/](https://github.com/Azure/msportalfx-test/).

 In this discussion, `<repoRoot>` is this git repository.

The test framework code can be viewed at `<repoRoot>/src`.

<a name="contributing-to-csharp-typescript-test-framework-making-changes-and-building-the-improvement"></a>
### Making changes and building the improvement

The prerequisites are as follows. 

* Node 4.4, 4.5, or 5.1. Newer versions may not work.

   We recommend that you use Node.js Version Management (NVM) that is located at [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows) and [https://github.com/coreybutler/nvm-windows/releases](https://github.com/coreybutler/nvm-windows/releases)  to manage your node versions.

*  Typescript 2.1 for Visual Studio 2015 

    The download is located at [https://www.microsoft.com/en-us/download/details.aspx?id=48593](https://www.microsoft.com/en-us/download/details.aspx?id=48593) for  Visual Studio.

To make changes and build your improvement, first you need to initialize your repository by running "npm install --no-optional" at `<repoRoot>`.   Once your repo is initialized, you can make your changes and then run "npm run build" at the repository root.  The build output will be available under `\lib`.

<a name="contributing-to-csharp-typescript-test-framework-testing-the-improvement"></a>
### Testing the improvement

The `MsPortalfx-Test` Typescript Test Framework includes a set of tests for basic verification.  To run the tests, you need to push your improvement to a feature branch, also known as a private branch, as specified in [https://gist.github.com/vlandham/3b2b79c40bc7353ae95a](https://gist.github.com/vlandham/3b2b79c40bc7353ae95a).  Once your improvement is in a feature branch, you can navigate to PortalFXOnDemand that is located at [https://portalfxod.azure-test.net/view/MsPortalfx-Test/job/OnDemand-MsPortalFxTest/build?delay=0sec](https://portalfxod.azure-test.net/view/MsPortalfx-Test/job/OnDemand-MsPortalFxTest/build?delay=0sec) and fill in your feature branch name in the "MsPortalFxTestBranchName" field to run your tests.  You should receive get an email when it is complete.  

<a name="contributing-to-csharp-typescript-test-framework-troubleshooting"></a>
### Troubleshooting

<a name="contributing-to-csharp-typescript-test-framework-troubleshooting-repo-sync-and-auth-errors"></a>
#### Repo sync and auth errors

If you are seeing authentication errors, try creating and using a personal access token as described in [https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/](https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/).

<a name="contributing-to-csharp-typescript-test-framework-troubleshooting-other-issues"></a>
#### Other issues

If issues are encountered while developing the improvement, please search the internal StackOverflow that is located at [http://stackoverflow.microsoft.com](http://stackoverflow.microsoft.com) first.

 If you are unable to find an answer, reach out to the Ibiza team at  [Stackoverflow Ibiza Test](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza-test). 

 For a list of topics and stackoverflow tags, see [portalfx-stackoverflow.md](portalfx-stackoverflow.md).
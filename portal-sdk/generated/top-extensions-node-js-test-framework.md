<a name="overview"></a>
## Overview

**@microsoft/azureportal-test**, formerly known as msportalfx-test, is an end-to-end test framework that is written in **TypeScript** abd  runs tests against the Microsoft Azure Portal. It tests extension interactions with user behavior, moreso than extension interactions with the Portal.  Its open source contribution model focuses on partner needs instead of internal Portal needs. It is distributed independently from the SDK to allow developers to develop tests in the same language as the extension.

The test framework interacts with the Portal as a user would, and helps developers make performant and robust extensions when they decrease breaking changes to partner team CI.

<a name="overview-general-architecture"></a>
### General Architecture

**@microsoft/azureportal-test** is arranged into three layers of abstraction. The names of the layers may not be consistent in all instances, but the general idea is the same.  There may also be some future refactoring to easily differentiate between the layers.

1. Controls layer

    The controls layer contains the basic controls used in the Portal, like blades, checkboxes, textboxes, and others.  It is not used directly by tests in most cases, because it is mainly for composing the action layer and the  test layers. It is built on webdriver primitives and there is little or no retry logic.

 1. Actions layer

    The actions layer performs an action and verifies whether it was successful. It can retry the action if necessary. It is  used in writing tests like `portal.openBrowseBlade`. It is built upon the controls layer.

1. Test layer

    The test layer contains wrappers that are used for testing common functionality. It is built upon the action and control layers, and is used in writing business-case tests or other forms of suite-test functionality, like `parts.canPinAllBladeParts`. It can re-run the test if necessary, and throws an exception if the test or verification fails.

<a name="overview-download"></a>
### Download

<a name="overview-getting-started"></a>
### Getting Started

1. Install [Node.js](https://nodejs.org/en/download/). (last tested on 12.19 LTS)

After installing Node.js can either `scaffold an @microsoft/azureportal-test project` or `create a @microsoft/azureportal-test project from scratch`

<a name="overview-getting-started-scaffold-an-microsoft-azureportal-test-project"></a>
#### Scaffold an @microsoft/azureportal-test project

1. Install the `ap cli` [https://aka.ms/portalfx/apclidoc](https://aka.ms/portalfx/apclidoc)

1. run `ap new -n Microsoft_Azure_MyExtension -o ./myextension`

1. the test project is generated to ./myextension/src/Default/Extension.E2ETests

<a name="overview-getting-started-create-a-msportaltx-test-project-from-scratch"></a>
#### Create a msportaltx-test project from scratch


1. **@microsoft/azureportal-test** is available for download on **npm** under the package name **@microsoft/azureportal-test** [https://msazure.visualstudio.com/One/_packaging?_a=feed&feed=AzurePortal](https://msazure.visualstudio.com/One/_packaging?_a=feed&feed=AzurePortal).

1. Install TypeScript 3.9.5 is located at [https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.typescript-395](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.typescript-395).

1. Open a command prompt and create a directory for your test files.

    ```
    md e2etests
    ```

1. Switch to the new directory and install the @microsoft/azureportal-test module by using npm:

    ```
    cd e2etests
    npm install @microsoft/azureportal-test
    ```

1. Next copy the provided **tsconfig.json** and **example_package.json** files from the **node_modules/@microsoft/azureportal-test/templates** folder to your test root directory.
    1. Rename provided **example_package.json** to **package.json**.  The file is used to help jumpstart the example below by installing dependencies and creating a basic environment for running tests.
    1. If you are upgrading from an older test framework version, note the **typings.json** file and **typings** package dependency from previous versions is no longer needed and has been removed.  You may need to update the typescript imports when you remove them, see the below Write a test example for how to import @microsoft/azureportal-test.

1. In the **package.json** file, update the @microsoft/azureportal-test version to the latest version.  Also update the Chromedriver version to match the version of Chrome you have installed.

    [@microsoft/azureportal-test package](https://aka.ms/portalfx/microsoft-azureportal-test/package)

    [https://www.npmjs.com/package/chromedriver](https://www.npmjs.com/package/chromedriver)

1. The **package.json** describes your project and its dependencies for NPM to understand.  You can find more details about it at [https://docs.npmjs.com/files/package.json](https://docs.npmjs.com/files/package.json)

1. The **tsconfig.json** provides configuration values for building via typescript compiler (tsc).
s
1. Once the dependencies have been updated, install them by running the following command:

    ```
    npm install
    ```
1. Now you are ready to write a test.

<a name="overview-write-a-test"></a>
### Write a test

For this test example you'll need an Azure subscription and account for the test you'll write below.

We'll use the [Mocha](https://mochajs.org/) testing framework to layout the following test, but you could use any framework that supports Node.js modules and promises. Mocha is included by default in the **package.json** file you copied earlier.

Create a `portaltests.ts` file in your e2etests directory and paste the following.

```ts
import * as testFx from "@microsoft/azureportal-test";
import * as nconf from "nconf";

describe("Resource Group Tests", function () {
    this.timeout(0);
    this.retries(0);

    // Runs before every test.  See additional documentation at https://mochajs.org
    beforeEach(() => {
        // Load command line arguments, environment variables and config.json into nconf
        // nconf is an optional package that can be used to help make various settings available.  Read more about it at https://npmsj.org/nconf
        // The below code loads settings from command line arguments, envrionment variables, and a config.json file into nconf in a hierarchical manner for easy retrieval
        nconf.argv()
            .env()
            .file("config.json");

        // The @microsoft/azureportal-test framework includes an nconf extension that reads values from the windows credential manager
        (<any>nconf)[testFx.Utils.NConfWindowsCredentialManager.ProviderName] = testFx.Utils.NConfWindowsCredentialManager;
        nconf.use(testFx.Utils.NConfWindowsCredentialManager.ProviderName);

        // Provide the portal context values needed to load the portal
        // Provide the URL to the portal that is being tested
        const portalUrl = nconf.get("PORTAL_URL");
        if (!!portalUrl) {
            testFx.portal.portalContext.portalUrl = portalUrl;
        }

        // Provide credentials to the test framweork to be used for login
        testFx.portal.portalContext.signInEmail = nconf.get("LOGIN_NAME");
        testFx.portal.portalContext.signInPassword = nconf.get(`aux/OneCloud.TestInfra/TestLogins/${testFx.portal.portalContext.signInEmail}`); // NOTE YOU SHOULD NEVER STORE SECRETS/PASSWORDS IN PLAIN TEXT.  In this case we have our password stored in windows credential manager under the name "aux/OneCloud.TestInfra/TestLogins/<login_name>"
    });

    // Test scenario
    it("Can open create resource group blade", async () => {
        const createResourceGroupURI = "create/Microsoft.ResourceGroup";

        const myblade = await testFx.portal.openBlade(
            createResourceGroupURI,
            testFx.PortalFxResources.hubsExtension.resourceGroups.createTitle
        );

        const createBladeDisplayed = await createBlade.isDisplayed();
        assert(createBladeDisplayed, "Create blade was not visible after loading the portal!");
    });

    // Runs after every test.
    afterEach(async function () {
        console.log("Running cleanup");
        try {
            if (this.currentTest.state === "failed") {
                await testFx.portal.takeScreenshot(this.currentTest.title);
            }
        } catch (e) { }
        try {
            await testFx.portal.quit();
        }
        catch (e) { }
    });
});

```

Remember to replace the signInEmail and signInPassword values with your test account credentials.  You can also use nconf to retrieve them from environment variables or windows credential manager (when using the included extension).

In this test we start by importing the @microsoft/azureportal-test module. Then the credentials are specified for the user that will sign in to the Portal. These should be the credentials of a user that already has an active Azure subscription.

After that we can use the Portal object to drive a test scenario that opens the Create Resource Group Browse blade and waits for the correct blade to open. In the afterEach block we take a screenshot if the test fails and finally, call `quit()` to close the browser.

<a name="overview-test-accounts"></a>
### Test Accounts
For external/third party teams, it is recommended to create a separate account on an isolated subscription that has no other services runnning.

For internal Microsoft teams, see [here for guidance](https://eng.ms/docs/cloud-ai-platform/azure/azure-core-compute/bburns-team/azure-portal-ibizafx/azure-portal/testing).

**NOTE**: MFA-enabled accounts are not supported.

<a name="overview-add-the-configuration"></a>
### Add the configuration

The @microsoft/azureportal-test framework can be configured via a config.json file.
Create a file named `config.json` next to `portaltests.ts`. Paste this in the file and save next to your test file.

```js
{
    "capabilities": {
        "browserName": "chrome",
        "chromeOptions": {
            "args": [
                "no-sandbox",
                "window-size=1280,960",
                "disable-extensions",
                "disable-popup-blocking"
            ]
        }
    },
    "chromeDriverPath": "node_modules\\chromedriver\\lib\\chromedriver\\chromedriver.exe",
    "portalUrl": "https://portal.azure.com",
    "signInUrl": "https://login.microsoftonline.com",
    "enableFiddler": "false",
    "managementEndpoint": "https://management.core.windows.net/",
    "allowUnauthorizedCert": "true",
    "LOGIN_NAME": "<someone@someCompany.com>",
    "partnerTeamEmail": "partnerEmail@partnerCompany.com"
}
```

Replace the `LOGIN_NAME` with the account being used to login.  If your machine automatically logs you in via corp signin then no password is needed.  Else store the password in windows credential manager and update the sign in password line in the test code to retrieve it.

Also, replace the `partnerTeamEmail` with the name of your team that runs the tests. This variable is **REQUIRED**. More details in the section [Partner team email](#partner-team-email).

This configuration tells **@microsoft/azureportal-test** that **Google Chrome** should be used for the test session and `https://portal.azure.com` should be the Portal under test.

<a name="overview-partner-team-email"></a>
### Partner team email

It is required to specify a team email (**the one used when you registered the extension to the portal**) when running the tests. This will help us to identify which extensions' tests belong to which team. There are three ways to specify the team name variable:

1. Assigning the team name to `partnerTeamEmail` configuration value in config.json file.
2. Setting the partnerTeamEmail environment variable by running either `set partnerTeamEmail "partnerEmail@partnerCompany.com"` if you want to set that variable **ONLY** for the current command prompt or `setx partnerTeamEmail "partnerEmail@partnerCompany.com"` if you'd like to propagate that variable for all the future command prompts.
3. If a test is run via VSCode, set the `--partnerTeamEmail` args for the appropriate configuration in .vscode/launch.json file, e.g. `"--partnerTeamEmail", "partnerEmail@partnerCompany.com"`.

<a name="overview-compile-and-run"></a>
### Compile and run

Compile your TypeScript test file (note these commands are stored in the package.json file "scripts" section, you can open it to see what these commands translate to):

```ts
npm run build
```

and then run **Mocha** against the generated JavaScript file.

**NOTE**: Using an elevated command prompt may cause Chrome to crash or stop responding. If so, try using a non-elevated command prompt:

```ts
npm test
```

The following output will be sent to your console as the test progresses:

```ts
Resource Group Tests
  testFx:information Opening the blade for create/Microsoft.ResourceGroup... +1s
  testFx:information Starting the ChromeDriver process... +2ms
  testFx:information Navigating to https://df.onecloud.azure-test.net?testframework=msportalfx-test&trace=debugLog&enableAnimations=false#create/Microsoft.ResourceGroup +18ms
  testFx:information Performing sign in... +6s
  testFx:information Performing SignIn... +1ms
  testFx:information Successfully signed in +11s
  testFx:information Already signed in, proceeding with test... +2ms
  testFx:information Waiting 120000 ms for the splash screen to go away... +1ms
    √ Example test (96266ms)
Running cleanup
ResourcesTest.ts:54
  1 passing (2m)
```

If you run into a compilation error with `node.d.ts`, verify that you are using the recommended tsc version stated earlier in this document or newer.  You can check the version by running:

`tsc --version`

If the version is incorrect, then you may need to install the correct version, adjust your path variables or directly call the correct version of `tsc.exe`.

<a name="overview-partner-deployment-tests"></a>
### Partner Deployment Tests
The Azure portal team is building support for running internal partner's tests during a Portal deployment.  It is currently in a limited preview for select internal partner teams.  The internal documentation is available at [Partner Deployment Tests](https://eng.ms/docs/cloud-ai-platform/azure/azure-core-compute/bburns-team/azure-portal-ibizafx/azure-portal/testing/portal-partner-deployment-tests)

<a name="overview-more-documentation-and-examples"></a>
### More Documentation and Examples

The full documentation is available on the npm site [https://aka.ms/portalfx/microsoft-azureportal-test](https://aka.ms/portalfx/microsoft-azureportal-test).

Additional examples are available in the source code located at [https://aka.ms/portalfx/microsoft-azureportal-test/src](https://aka.ms/portalfx/microsoft-azureportal-test/src).


<a name="overview-contributing"></a>
### Contributing

Contributions to improve the test framework are encouraged.  If you develop a feature/fix a bug/etc that you feel would be useful to other users of the test framework then please submit a pull request to the @microsoft/azureportal-test repository located at [https://aka.ms/portalfx/microsoft-azureportal-test/src](https://aka.ms/portalfx/microsoft-azureportal-test/src).

For detailed instructions, please view the full documentation on the npm site located at  [https://aka.ms/portalfx/microsoft-azureportal-test](https://aka.ms/portalfx/microsoft-azureportal-test).

<a name="questions"></a>
## Questions?

Ask questions on: [https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza-test](https://stackoverflow.microsoft.com/questions/tagged?tagnames=ibiza-test)

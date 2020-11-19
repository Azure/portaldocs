<a name="overview"></a>
## Overview

**MsPortalFx-Test** is an end-to-end test framework that is written in **TypeScript** abd  runs tests against the Microsoft Azure Portal. It tests extension interactions with user behavior, moreso than extension interactions with the Portal.  Its open source contribution model focuses on partner needs instead of internal Portal needs. It is distributed independently from the SDK to allow developers to develop tests in the same language as the extension.

The test framework interacts with the Portal as a user would, and helps developers make performant and robust extensions when they decrease breaking changes to partner team CI.

<a name="overview-general-architecture"></a>
### General Architecture

**MsPortalFx-Test** is arranged into three layers of abstraction. The names of the layers may not be consistent in all instances, but the general idea is the same.  There may also be some future refactoring to easily differentiate between the layers.

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

After installing Node.js can either `scaffold an msportalfx-test project` or `create a msportaltx-test project from scratch`

<a name="overview-getting-started-scaffold-an-msportalfx-test-project"></a>
#### Scaffold an msportalfx-test project

1. Install the `ap cli` [https://aka.ms/portalfx/apclidoc](https://aka.ms/portalfx/apclidoc)

1. run `ap new -n Microsoft_Azure_MyExtension -o ./myextension`

1. the test project is generated to ./myextension/src/Default/Extension.E2ETests

<a name="overview-getting-started-create-a-msportaltx-test-project-from-scratch"></a>
#### Create a msportaltx-test project from scratch


1. **MsPortalFx-Test** is available for download on **npm** under the package name **msportalfx-test** [https://msazure.visualstudio.com/One/_packaging?_a=feed&feed=AzurePortal](https://msazure.visualstudio.com/One/_packaging?_a=feed&feed=AzurePortal).

1. Install TypeScript 3.9.5 is located at [https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.typescript-395](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.typescript-395).

1. Open a command prompt and create a directory for your test files.

    ```
    md e2etests
    ```

1. Switch to the new directory and install the msportalfx-test module by using npm:

    ```
    cd e2etests
    npm install msportalfx-test --no-optional
    ```
1. The **msportalfx-test** module comes with useful TypeScript definitions and its dependencies. To make them available to your tests, we recommend that you use the typings Typescript Definition Manager.

1. First install the typings Typescript Definition Manager globally:

    ```
    npm install typings -g
    ```

1. Next copy the provided **typings.json** and **package.json** files from the **node_modules/msportalfx-test/typescript** folder (there are other files there as well but you can ignore those) to your test root directory and use typings to install the provided definitions.

        *copy typings.json to your test root directory*
        *navigate to your test root directory*
        typings install

1. In the **package.json** file, you update the chromedriver and msportalfx-test  versions to their latest versions found at

    [https://www.npmjs.com/package/chromedriver](https://www.npmjs.com/package/chromedriver)

    [msportalfx-test package](https://aka.ms/portalfx/msportalfx-test/package)

1. The **package.json** describes your project and its dependencies for NPM to understand.  You can find more details about it at [https://docs.npmjs.com/files/package.json](https://docs.npmjs.com/files/package.json)

1. Once the dependencies have been updated, install them by running the following command:

    ```
    npm install --no-optional
    ```
1. Now you are ready to write a test.

<a name="overview-write-a-test"></a>
### Write a test

For this test example you'll need an existing cloud service for the test you'll write below, so if you don't have one please go to the Azure Portal and create a new [cloud service](https://ms.portal.azure.com/#create/Microsoft.CloudService). Write down the dns name of your cloud service to use it in your test.

We'll use the [Mocha](https://mochajs.org/) testing framework to layout the following test, but you could use any framework that supports Node.js modules and promises. Mocha is included by default in the **package.json** file you copied earlier.

Create a `portaltests.ts` file in your e2etests directory and paste the following.

```ts
/// <reference path="./typings/index.d.ts" />
 
import assert = require('assert');
import testFx = require('MsPortalFx-Test');
import nconf = require('nconf');
import until = testFx.until;
 
describe('Cloud Service Tests', function () {
    this.timeout(0);
    
    it('Can Browse To A Cloud Service', () => {
 
        
        // Load command line arguments, environment variables and config.json into nconf
        nconf.argv()
            .env()
            .file(__dirname + "/config.json");
 
        //provide windows credential manager as a fallback to the above three
        nconf[testFx.Utils.NConfWindowsCredentialManager.ProviderName] = testFx.Utils.NConfWindowsCredentialManager;
        nconf.use(testFx.Utils.NConfWindowsCredentialManager.ProviderName);
        
        
        testFx.portal.portalContext.signInEmail = 'johndoe@outlook.com';
        testFx.portal.portalContext.signInPassword = nconf.get('msportalfx-test/johndoe@outlook.com/signInPassword');
        
        // Update this variable to use the dns name of your actual cloud service 
        let dnsName = "mycloudservice";
        
        return testFx.portal.openBrowseBlade('microsoft.classicCompute', 'domainNames', "Cloud services (classic)").then((blade) => {
            return blade.filterItems(dnsName);
        }).then((blade) => {
            return testFx.portal.wait<testFx.Controls.GridRow>(() => {
                return blade.grid.rows.count().then((count) => {
                    return count === 1 ? blade.grid.rows.first() : null;
                });
            }, null, "Expected only one row matching '" + dnsName + "'.");
        }).then((row) => {
            return row.click();
        }).then(() => {            
            let summaryBlade = testFx.portal.blade({ title: dnsName + " - Production" });
            return testFx.portal.wait(until.isPresent(summaryBlade));
        }).then(() => {
            return testFx.portal.quit();
        });
    });
});
```

Remember to replace "mycloudservice" with the dns name of your actual cloud service.
Also replace the signInEmail and password values with your test account credentials

**NOTE**: MFA-enabled `@microsoft.com` accounts are not supported.

In this test we start by importing the MsPortalFx-Test module. Then the credentials are specified for the user that will sign in to the Portal. These should be the credentials of a user that already has an active Azure subscription.

After that we can use the Portal object to drive a test scenario that opens the Cloud Services Browse blade, filters the list of cloud services, checks that the grid has only one row after the filter, selects the only row and waits for the correct blade to open. Finally, the call to `quit()` closes the browser.

<a name="overview-add-the-configuration"></a>
### Add the configuration

Create a file named `config.json` next to `portaltests.ts`. Paste this in the file.

```js
	{
	"capabilities": {
		"browserName": "chrome"
	},
	"portalUrl": "https://portal.azure.com"
	}
```

This configuration tells **MsPortalFx-Test** that **Google Chrome** should be used for the test session and `https://portal.azure.com` should be the Portal under test.

<a name="overview-compile-and-run"></a>
### Compile and run

Compile your TypeScript test file:

```ts
tsc portaltests.ts --module commonjs
```

and then run **Mocha** against the generated JavaScript file.

**NOTE**: Using an elevated command prompt may cause Chrome to crash or hang. If so, try using a non-elevated command prompt:

```ts
npm test
```

The following output will be sent to your console as the test progresses:

```ts
    Portal Tests
Opening the Browse blade for the microsoft.classicCompute/domainNames resource type...
Starting the ChromeDriver process...
Performing SignIn...
Waiting for the Portal...
Waiting for the splash screen to go away...
Applying filter 'mycloudservice'...
    √ Can Browse To A Cloud Service (37822ms)

    1 passing (38s)
```

If you run into a compilation error with `node.d.ts`, verify that the tsc version you are using is 1.8.x or newer.  You can check the version by running:

`tsc --version`

If the version is incorrect, then you may need to adjust your path variables or directly call the correct version of `tsc.exe`.

<a name="overview-more-documentation-and-examples"></a>
### More Documentation and Examples

The full documentation is available on the npm site [https://aka.ms/portalfx/msportalfx-test](https://aka.ms/portalfx/msportalfx-test).

Additional examples are available in the source code located at [https://aka.ms/portalfx/msportalfx-test/src](https://aka.ms/portalfx/msportalfx-test/src).


<a name="overview-contributing"></a>
### Contributing

Contributions to improve the test framework are encouraged.  If you develop a feature/fix a bug/etc that you feel would be useful to other users of the test framework then please submit a pull request to the msportalfx-test repository located at [https://aka.ms/portalfx/msportalfx-test/src](https://aka.ms/portalfx/msportalfx-test/src).

For detailed instructions, please view the full documentation on the npm site located at  [https://aka.ms/portalfx/msportalfx-test](https://aka.ms/portalfx/msportalfx-test).

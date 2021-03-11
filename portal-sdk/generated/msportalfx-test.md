
<a name="microsoft-azureportal-test"></a>
# @microsoft/azureportal-test

Generated on 2021-03-11

* [@microsoft/azureportal-test](#microsoft-azureportal-test)
    * [Overview](#microsoft-azureportal-test-overview)
        * [Goals](#microsoft-azureportal-test-overview-goals)
        * [General Architecture](#microsoft-azureportal-test-overview-general-architecture)
    * [Getting Started](#microsoft-azureportal-test-getting-started)
        * [Installation](#microsoft-azureportal-test-getting-started-installation)
        * [Write a test](#microsoft-azureportal-test-getting-started-write-a-test)
        * [Add the configuration](#microsoft-azureportal-test-getting-started-add-the-configuration)
        * [Compile and run](#microsoft-azureportal-test-getting-started-compile-and-run)
        * [Updating](#microsoft-azureportal-test-getting-started-updating)
        * [More Examples](#microsoft-azureportal-test-getting-started-more-examples)
        * [Running tests in Visual Studio](#microsoft-azureportal-test-getting-started-running-tests-in-visual-studio)
    * [Side loading a local extension during the test session](#microsoft-azureportal-test-side-loading-a-local-extension-during-the-test-session)
    * [Running](#microsoft-azureportal-test-running)
        * [In Dev](#microsoft-azureportal-test-running-in-dev)
            * [From VS](#microsoft-azureportal-test-running-in-dev-from-vs)
            * [From cmdline](#microsoft-azureportal-test-running-in-dev-from-cmdline)
        * [CI](#microsoft-azureportal-test-running-ci)
            * [Cloudtest](#microsoft-azureportal-test-running-ci-cloudtest)
                * [Environment Setup](#microsoft-azureportal-test-running-ci-cloudtest-environment-setup)
                * [Running Tests](#microsoft-azureportal-test-running-ci-cloudtest-running-tests)
            * [Windows Azure Engineering System (WAES)](#microsoft-azureportal-test-running-ci-windows-azure-engineering-system-waes)
            * [Jenkins](#microsoft-azureportal-test-running-ci-jenkins)
            * [How to setup test run parallelization](#microsoft-azureportal-test-running-ci-how-to-setup-test-run-parallelization)
    * [Debugging](#microsoft-azureportal-test-debugging)
        * [debug tests 101](#microsoft-azureportal-test-debugging-debug-tests-101)
        * [debugging tests in VS Code](#microsoft-azureportal-test-debugging-debugging-tests-in-vs-code)
        * [Checking the result of the currently running test in code](#microsoft-azureportal-test-debugging-checking-the-result-of-the-currently-running-test-in-code)
        * [How to take a screenshot of the browser](#microsoft-azureportal-test-debugging-how-to-take-a-screenshot-of-the-browser)
        * [How to capture browser console output](#microsoft-azureportal-test-debugging-how-to-capture-browser-console-output)
        * [Logs](#microsoft-azureportal-test-debugging-logs)
            * [Enabling diagnostic logs](#microsoft-azureportal-test-debugging-logs-enabling-diagnostic-logs)
        * [Callstack](#microsoft-azureportal-test-debugging-callstack)
        * [Test output artifacts](#microsoft-azureportal-test-debugging-test-output-artifacts)
    * [Localization](#microsoft-azureportal-test-localization)
    * [User Management](#microsoft-azureportal-test-user-management)
    * [Configuration](#microsoft-azureportal-test-configuration)
        * [Configuration options](#microsoft-azureportal-test-configuration-configuration-options)
            * [Behavior](#microsoft-azureportal-test-configuration-configuration-options-behavior)
            * [PortalContext](#microsoft-azureportal-test-configuration-configuration-options-portalcontext)
            * [Running tests against the Dogfood environment](#microsoft-azureportal-test-configuration-configuration-options-running-tests-against-the-dogfood-environment)
    * [Scenarios](#microsoft-azureportal-test-scenarios)
        * [Create](#microsoft-azureportal-test-scenarios-create)
            * [Opening the create blade from a deployed gallery package](#microsoft-azureportal-test-scenarios-create-opening-the-create-blade-from-a-deployed-gallery-package)
            * [Opening the create blade from a local gallery package](#microsoft-azureportal-test-scenarios-create-opening-the-create-blade-from-a-local-gallery-package)
            * [Validation State](#microsoft-azureportal-test-scenarios-create-validation-state)
            * [Get the validation state of fields on your create form](#microsoft-azureportal-test-scenarios-create-get-the-validation-state-of-fields-on-your-create-form)
            * [Wait on a fields validation state](#microsoft-azureportal-test-scenarios-create-wait-on-a-fields-validation-state)
        * [Browse](#microsoft-azureportal-test-scenarios-browse)
            * [How to test the context menu in browse shows your extensions commands?](#microsoft-azureportal-test-scenarios-browse-how-to-test-the-context-menu-in-browse-shows-your-extensions-commands)
            * [How to test the grid in browse shows the expected default columns for your extension resource](#microsoft-azureportal-test-scenarios-browse-how-to-test-the-grid-in-browse-shows-the-expected-default-columns-for-your-extension-resource)
        * [How to test the grid in browse shows additional extension resource columns that are selected](#microsoft-azureportal-test-scenarios-how-to-test-the-grid-in-browse-shows-additional-extension-resource-columns-that-are-selected)
        * [Blades](#microsoft-azureportal-test-scenarios-blades)
            * [Blade navigation](#microsoft-azureportal-test-scenarios-blades-blade-navigation)
            * [Locating an open blade](#microsoft-azureportal-test-scenarios-blades-locating-an-open-blade)
            * [Common portal blades](#microsoft-azureportal-test-scenarios-blades-common-portal-blades)
                * [Opening the extensions Create blade](#microsoft-azureportal-test-scenarios-blades-common-portal-blades-opening-the-extensions-create-blade)
                * [Opening the Browse blade for your resource](#microsoft-azureportal-test-scenarios-blades-common-portal-blades-opening-the-browse-blade-for-your-resource)
                * [Opening a Resource Summary blade](#microsoft-azureportal-test-scenarios-blades-common-portal-blades-opening-a-resource-summary-blade)
                * [Spec Picker Blade](#microsoft-azureportal-test-scenarios-blades-common-portal-blades-spec-picker-blade)
                * [Properties Blade](#microsoft-azureportal-test-scenarios-blades-common-portal-blades-properties-blade)
                * [QuickStart Blade](#microsoft-azureportal-test-scenarios-blades-common-portal-blades-quickstart-blade)
                * [Users Blade](#microsoft-azureportal-test-scenarios-blades-common-portal-blades-users-blade)
                * [Move Resource Blade](#microsoft-azureportal-test-scenarios-blades-common-portal-blades-move-resource-blade)
            * [Blade Dialogs](#microsoft-azureportal-test-scenarios-blades-blade-dialogs)
        * [Parts](#microsoft-azureportal-test-scenarios-parts)
            * [How to get the reference to a part on a blade](#microsoft-azureportal-test-scenarios-parts-how-to-get-the-reference-to-a-part-on-a-blade)
            * [CollectionPart](#microsoft-azureportal-test-scenarios-parts-collectionpart)
            * [Grid](#microsoft-azureportal-test-scenarios-parts-grid)
                * [Finding a row within a grid](#microsoft-azureportal-test-scenarios-parts-grid-finding-a-row-within-a-grid)
            * [CreateComboBoxField - Obsolete](#microsoft-azureportal-test-scenarios-parts-createcomboboxfield-obsolete)
            * [ResourceGroupDropDownField](#microsoft-azureportal-test-scenarios-parts-resourcegroupdropdownfield)
            * [Editor](#microsoft-azureportal-test-scenarios-parts-editor)
                * [Can read and write content](#microsoft-azureportal-test-scenarios-parts-editor-can-read-and-write-content)
            * [essentials](#microsoft-azureportal-test-scenarios-parts-essentials)
                * [Essentials tests](#microsoft-azureportal-test-scenarios-parts-essentials-essentials-tests)
        * [Command](#microsoft-azureportal-test-scenarios-command)
        * [Action Bar](#microsoft-azureportal-test-scenarios-action-bar)
        * [Delete](#microsoft-azureportal-test-scenarios-delete)
        * [Styling / layout regression detection](#microsoft-azureportal-test-scenarios-styling-layout-regression-detection)
            * [...](#microsoft-azureportal-test-scenarios-styling-layout-regression-detection-)
        * [Locators](#microsoft-azureportal-test-scenarios-locators)
        * [Consuming Updates](#microsoft-azureportal-test-scenarios-consuming-updates)
        * [Mocking](#microsoft-azureportal-test-scenarios-mocking)
            * [How to show mock data into the Portal](#microsoft-azureportal-test-scenarios-mocking-how-to-show-mock-data-into-the-portal)
                * [Mocking ARM](#microsoft-azureportal-test-scenarios-mocking-how-to-show-mock-data-into-the-portal-mocking-arm)
        * [Code Coverage](#microsoft-azureportal-test-scenarios-code-coverage)
            * [Interop, how to run .NET code from your tests](#microsoft-azureportal-test-scenarios-code-coverage-interop-how-to-run-net-code-from-your-tests)
        * [Accessibility Testing](#microsoft-azureportal-test-scenarios-accessibility-testing)
            * [Overview](#microsoft-azureportal-test-scenarios-accessibility-testing-overview-1)
            * [Sample Test](#microsoft-azureportal-test-scenarios-accessibility-testing-sample-test)
            * [Options](#microsoft-azureportal-test-scenarios-accessibility-testing-options)
        * [Contributing](#microsoft-azureportal-test-scenarios-contributing)
            * [To enlist](#microsoft-azureportal-test-scenarios-contributing-to-enlist)
            * [To build the source](#microsoft-azureportal-test-scenarios-contributing-to-build-the-source)
            * [To setup the tests](#microsoft-azureportal-test-scenarios-contributing-to-setup-the-tests)
        * [To run the tests](#microsoft-azureportal-test-scenarios-to-run-the-tests)
            * [Authoring documents](#microsoft-azureportal-test-scenarios-to-run-the-tests-authoring-documents)
            * [Generating the docs](#microsoft-azureportal-test-scenarios-to-run-the-tests-generating-the-docs)
            * [To submit your contribution](#microsoft-azureportal-test-scenarios-to-run-the-tests-to-submit-your-contribution)
            * [Questions?](#microsoft-azureportal-test-scenarios-to-run-the-tests-questions)
        * [API Reference](#microsoft-azureportal-test-scenarios-api-reference)


<a name="microsoft-azureportal-test-overview"></a>
## Overview

`@microsoft/azureportal-test` is an end-to-end test framework that runs tests against the Microsoft Azure Portal interacting with it as a user would.

<a name="microsoft-azureportal-test-overview-goals"></a>
#### Goals

- Strive for zero breaking changes to partner team CI
- Develop tests in the same language as the extension
- Focus on partner needs rather than internal portal needs
- Distributed independently from the SDK
- Uses an open source contribution model
- Performant
- Robust
- Great Docs

<a name="microsoft-azureportal-test-overview-general-architecture"></a>
#### General Architecture
3 layers of abstraction (note the names may change but the general idea should be the same).  There may also be some future refactoring to easily differentiate between the layers.
- Test layer

    - Useful wrappers for testing common functionality.  Will retry if necessary.  Throws if the test/verification fails.
    - Should be used in writing tests
    - Built upon the action and control layers
    - EG: parts.canPinAllBladeParts

- Action layer

    - Performs an action and verifies it was successful.  Will retry if necessary.
    - Should be used in writing tests
    - Built upon the controls layer
    - EG: portal.openBrowseBlade

- Controls layer

    - The basic controls used in the portal (eg blades, checkboxes, textboxes, etc).  Little to no retry logic.  Should be used mainly for composing the actions and tests layers.
    - Should be used for writing test and action layers.  Should not be used directly by tests in most cases.
    - Built upon webdriver primitives
    - EG: part, checkbox, etc


<a name="microsoft-azureportal-test-getting-started"></a>
## Getting Started

<a name="microsoft-azureportal-test-getting-started-installation"></a>
### Installation

1. Install [Node.js](https://nodejs.org) if you have not done so. This will also install npm, which is the package manager for Node.js.  We have only verified support for LTS Node versions 4.5 and 5.1 which can be found in the "previous downloads" section.  Newer versions of Node are known to have compilation errors.  
1. Install [Node Tools for Visual Studio](https://www.visualstudio.com/en-us/features/node-js-vs.aspx)
1. Install [TypeScript](http://www.typescriptlang.org/) 1.8.10 or greater.
1. Verify that your:
    - node version is v8.11.3 LTS using `node -v`
    - npm version is 5.6.0 or greater using `npm -v`.  To update npm version use `npm install npm -g`
    - tsc version is 1.8.10 or greater using tsc -v.

1. Open a command prompt and create a directory for your test files.

		md e2etests

1. Switch to the new directory and install the @microsoft/azureportal-test module via npm:

		cd e2etests
		npm install @microsoft/azureportal-test --no-optional

1. The @microsoft/azureportal-test module comes with some TypeScript definitions and its dependencies. To make them available to your tests, we recommend that you use the [typings](https://www.npmjs.com/package/typings) Typescript Definition Manager.

1. First install the [typings](https://www.npmjs.com/package/typings) Typescript Definition Manager globally:

		npm install typings -g

	Next copy the provided **typings.json** file and the **microsoft-azureportal-test.d.ts** file from the **node_modules/@microsoft/azureportal-test/typescript** folder to your test root directory and use *typings* to install the provided definitions:

		*copy typings.json to your test root directory*
        *navigate to your test root directory*
		typings install

1. @microsoft/azureportal-test needs a WebDriver server in order to be able to drive the browser. Currently only [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver) is supported, so downloaded it and place it in your machine's PATH or just install it from the [chromedriver Node module](https://www.npmjs.com/package/chromedriver).  You may also need a C++ compiler (Visual Studio includes one):

		npm install chromedriver


<a name="microsoft-azureportal-test-getting-started-write-a-test"></a>
### Write a test
You'll need an existing cloud service for the test you'll write below, so if you don't have one please go to the Azure Portal and [create a new cloud service](https://ms.portal.azure.com/#create/Microsoft.CloudService). Write down the dns name of your cloud service to use it in your test.

We'll use the [Mocha](https://mochajs.org/) testing framework to layout the following test, but you could use any framework that supports Node.js modules and promises. Let's install Mocha and its typescript definitions:

	npm install mocha
    npm install @types/mocha

Now, create a **portaltests.ts** file in your e2etests directory and paste the following:

```ts
/// <reference path="./typings/index.d.ts" />

import assert from 'assert';
import testFx from '@microsoft/azureportal-test';
import nconf from 'nconf';
import until = testFx.until;

describe('Cloud Service Tests', function () {
	this.timeout(0);

	it('Can Browse To A Cloud Service', () => {

		
        // Load command line arguments, environment variables and config.json into nconf
        nconf.argv()
            .env()
            .file(__dirname + "/config.json");

        //provide windows credential manager as a fallback to the above three
        nconf[testFx.Utils.NConfWindowsCredentialManager.ProviderName] = testFx.Utils.NConfWindowsCredentialManager;
        nconf.use(testFx.Utils.NConfWindowsCredentialManager.ProviderName);
        

		testFx.portal.portalContext.signInEmail = 'johndoe@outlook.com';
		testFx.portal.portalContext.signInPassword = nconf.get('microsoft-azureportal-test/johndoe@outlook.com/signInPassword');

		// Update this variable to use the dns name of your actual cloud service
		let dnsName = "mycloudservice";

		return testFx.portal.openBrowseBlade('microsoft.classicCompute', 'domainNames', "Cloud services (classic)").then((blade) => {
			return blade.filterItems(dnsName);
		}).then((blade) => {
            return testFx.portal.wait<testFx.Controls.GridRow>(() => {
                return blade.grid.rows.count().then((count) => {
                    return count === 1 ? blade.grid.rows.first() : null;
                });
            }, null, "Expected only one row matching '" + dnsName + "'.");
        }).then((row) => {
            return row.click();
		}).then(() => {
			let summaryBlade = testFx.portal.blade({ title: dnsName + " - Production" });
            return testFx.portal.wait(until.isPresent(summaryBlade));
		}).then(() => {
			return testFx.portal.quit();
		});
	});
});
```
1. write credentials to the windows credential manager

```
    cmdkey /generic:microsoft-azureportal-test/johndoe@outlook.com/signInPassword /user:johndoe@outlook.com /pass:somePassword
```

Remember to replace "mycloudservice" with the dns name of your actual cloud service.

In this test we start by importing the **@microsoft/azureportal-test** module. Then the credentials are specified for the user that will sign in to the Portal. These should be the credentials of a user that already has an active Azure subscription.

After that we can use the Portal object to drive a test scenario that opens the Cloud Services Browse blade, filters the list of cloud services, checks that the grid has only one row after the filter, selects the only row and waits for the correct blade to open. Finally, the call to quit() closes the browser.

<a name="microsoft-azureportal-test-getting-started-add-the-configuration"></a>
### Add the configuration

Create a file named **config.json** next to portaltests.ts. Paste this in the file:

	```json

		{
		"capabilities": {
			"browserName": "chrome"
		},
		"portalUrl": "https://portal.azure.com"
		}

	```

This configuration tells @microsoft/azureportal-test that Google Chrome should be used for the test session and [https://portal.azure.com](https://portal.azure.com) should be the Portal under test.

<a name="microsoft-azureportal-test-getting-started-compile-and-run"></a>
### Compile and run
Compile your TypeScript test file (note if you are using a newer version of TSC than 1.8 then you may need to pass in additional flags that aren't present in older versions of TSC):

	(TSC 1.8) tsc portaltests.ts --module commonjs
    (TSC 3+) tsc portaltests.ts --module commonjs --lib es2015 --moduleResolution classic

...and then run Mocha against the generated JavaScript file (note using an elevated command prompt may cause Chrome to crash.  Use a non-elevated command prompt for best results):

	node_modules\.bin\mocha portaltests.js

The following output will be sent to your console as the test progresses:

	  Portal Tests
	Opening the Browse blade for the microsoft.classicCompute/domainNames resource type...
	Starting the ChromeDriver process...
	Performing SignIn...
	Waiting for the Portal...
	Waiting for the splash screen to go away...
	Applying filter 'mycloudservice'...
	    √ Can Browse To A Cloud Service (37822ms)

	  1 passing (38s)

If you run into a compilation error with node.d.ts, verify that the tsc version you are using matches the compilation command above.  You can check the version by running:

    tsc --version

If the version is incorrect, then you may need to adjust your path variables or directly call the correct version of tsc.exe.  A version of tsc is usually included in the node_modules folder at node_modules/.bin/tsc that can be used.

If you see errors regarding duplicate identifiers due to some definitions being imported twice, you can try setting [moduleResolution compiler option](https://www.typescriptlang.org/docs/handbook/compiler-options.htm) to classic in your tsconfig.json file.

<a name="microsoft-azureportal-test-getting-started-updating"></a>
### Updating

1.  In order to keep up to date with the latest changes, we recommend that you update whenever a new version of @microsoft/azureportal-test is released.  npm install will automatically pull the latest version of @microsoft/azureportal-test.

        Make sure to copy typescript definition files in your *typings\* folder from the updated version in *\node_modules\@microsoft\azureportal-test\typescript*.

<a name="microsoft-azureportal-test-getting-started-more-examples"></a>
### More Examples
More examples can be found
- within this document
- in the `test` folder [here](https://aka.ms/portalfx/microsoft-azureportal-test/src)
- and the [Contacts Extension Tests](http://vstfrd:8080/Azure/One/_git/AzureUX-PortalFx#path=%2Fsrc%2FSDK%2FAcceptanceTests%2FExtensions%2FContactsExtension%2FTests).

If you don't have access, please follow the enlistment instructions below.

<a name="microsoft-azureportal-test-getting-started-running-tests-in-visual-studio"></a>
### Running tests in Visual Studio

1. Install [Node Tools for Visual Studio](https://www.visualstudio.com/en-us/features/node-js-vs.aspx) (Note that we recommend using the Node.js “LTS” versions rather than the “Stable” versions since sometimes NTVS doesn’t work with newer Node.js versions.)

1. Once that’s done, you should be able to open Visual Studio and then create new project: *New -> Project -> Installed, Templates, TypeScript, Node.js -> From Existing Node.js code*.

![NewTypeScriptNodeJsExistingProject][NewTypeScriptNodeJsExistingProject]

1. Then open the properties on your typescript file and set the TestFramework property to “mocha”.

![FileSetTestFrameworkPropertyMocha][FileSetTestFrameworkPropertyMocha]

1. Once that is done you should be able to build and then see your test in the test explorer.  If you don’t see your tests, then make sure you don’t have any build errors.  You can also try restarting Visual Studio to see if that makes them show up.

[FileSetTestFrameworkPropertyMocha]: /docs/media/microsoft-azureportal-test/FileSetTestFrameworkPropertyMocha.png
[NewTypeScriptNodeJsExistingProject]: /docs/media/microsoft-azureportal-test/NewTypeScriptNodeJsExistingProject.png


<a name="microsoft-azureportal-test-side-loading-a-local-extension-during-the-test-session"></a>
## Side loading a local extension during the test session

You can use `@microsoft/azureportal-test` to write end to end tests that side load your local extension in the Portal. You can do this by specifying additional options in the Portal object. If you have not done so, please take a look at the *Installation* section of [this page](https://auxdocs.azurewebsites.net/en-us/documentation/articles/portalfx-testing-getting-started) to learn how to get started with @microsoft/azureportal-test.

We'll write a test that verifies that the Browse experience for our extension has been correctly implemented. But before doing that we should have an extension to test and something to browse to, so let's work on those first.

**To prepare the target extension and resource:**

1. Create a new Portal extension in Visual Studio following [these steps](https://auxdocs.azurewebsites.net/en-us/documentation/articles/portalfx-creating-extensions) and then hit CTRL+F5 to get it up and running. For the purpose of this example we named the extension 'LocalExtension' and we made it run in the default [https://localhost:44300](https://localhost:44300) address.

1. That should have taken you to the Portal, so sign in and then go to New --> Marketplace --> Local Development --> LocalExtension --> Create.

1. In the **My Resource** blade, enter **theresource** as the resource name, complete the required fields and hit Create.

1. Wait for the resource to get created.


**To write a test verifies the Browse experience while side loading your local extension:**

1. Create a new TypeScript file called **localextensiontests.ts**.

1. In the created file, import the `@microsoft/azureportal-test` module and layout the Mocha test:

	```ts
	/// <reference path="./typings/index.d.ts" />

	import assert from 'assert';
	import testFx from '@microsoft/azureportal-test';
	import until = testFx.until;

	describe('Local Extension Tests', function () {
		this.timeout(0);

		it('Can Browse To The Resource Blade', () => {

		});
	});
	```

1. In the **Can Browse To The Resource Blade** test body,  specify the credentials for the test session (replace with your actual Azure credentials):

	```ts
	// Hardcoding credentials to simplify the example, but you should never hardcode credentials
	testFx.portal.portalContext.signInEmail = 'johndoe@outlook.com';
	testFx.portal.portalContext.signInPassword = '12345';
	```

1. Now, use the **features** option of the portal.PortalContext object to enable the **canmodifyextensions** feature flag and use the **testExtensions** option to specify the name and address of the local extension to load:

	```ts
	testFx.portal.portalContext.features = [{ name: "feature.canmodifyextensions", value: "true" }];
	testFx.portal.portalContext.testExtensions = [{ name: 'LocalExtension', uri: 'https://localhost:44300/' }];
	```

1. Let's also declare a variable with the name of the resource that the test will browse to:

	```ts
	let resourceName = 'theresource';
	```

1. To be able to open the browse blade for our resource we'll need to know three things: The resource provider, the resource type and the title of the blade. You can get all that info from the Browse PDL implementation of your extension. In this case the resource provider is **Microsoft.PortalSdk**, the resource type is **rootResources** and the browse blade title is **My Resources**. With that info we can call the **openBrowseBlade** function of the Portal object:

	```ts
	return testFx.portal.openBrowseBlade('Microsoft.PortalSdk', 'rootResources', 'My Resources')
	```

1. From there on we can use the returned Blade object to filter the list, verify that only one row remains after filtering and select that row:

	```ts
	.then((blade) => {
        return testFx.portal.wait<testFx.Controls.GridRow>(() => {
            return blade.grid.rows.count().then((count) => {
                return count === 1 ? blade.grid.rows.first() : null;
            });
        }, null, "Expected only one row matching '" + resourceName + "'.");
    }).then((row) => {
        return row.click();
	})
	```

1. And finally we'll verify the correct blade opened and will close the Portal when done:

	```ts
	.then(() => {
		let summaryBlade = testFx.portal.blade({ title: resourceName });
		return testFx.portal.wait(until.isPresent(summaryBlade));
	}).then(() => {
		return testFx.portal.quit();
	});
	```

1. Here for the complete test:

```ts
/// <reference path="./typings/index.d.ts" />

import assert from 'assert';
import testFx from '@microsoft/azureportal-test';
import until = testFx.until;

describe('Local Extension Tests', function () {
    this.timeout(0);

    it('Can Browse To The Resource Blade', () => {
        // Hardcoding credentials to simplify the example, but you should never hardcode credentials
        testFx.portal.portalContext.signInEmail = 'johndoe@outlook.com';
        testFx.portal.portalContext.signInPassword = '12345';
        testFx.portal.portalContext.features = [{ name: "feature.canmodifyextensions", value: "true" }];
        testFx.portal.portalContext.testExtensions = [{ name: 'LocalExtension', uri: 'https://localhost:44300/' }];

        let resourceName = 'theresource';

        return testFx.portal.openBrowseBlade('Microsoft.PortalSdk', 'rootResources', 'My Resources').then((blade) => {
            return blade.filterItems(resourceName);
        }).then((blade) => {
            return testFx.portal.wait<testFx.Controls.GridRow>(() => {
                return blade.grid.rows.count().then((count) => {
                    return count === 1 ? blade.grid.rows.first() : null;
                });
            }, null, "Expected only one row matching '" + resourceName + "'.");
        }).then((row) => {
            return row.click();
        }).then(() => {
            let summaryBlade = testFx.portal.blade({ title: resourceName });
            return testFx.portal.wait(until.isPresent(summaryBlade));
        }).then(() => {
            return testFx.portal.quit();
        });
    });
});
```

**To add the required configuration and run the test:**

1. Create a file named **config.json** next to localextensiontests.ts. Paste this in the file:

	```json
	{
	  "capabilities": {
	    "browserName": "chrome"
	  },
	  "portalUrl": "https://portal.azure.com"
	}
	```

1. Compile your TypeScript test file:

		tsc localextensiontests.ts --module commonjs

1. Run Mocha against the generated JavaScript file:

		node_modules\.bin\mocha localextensiontests.js

The following output will be sent to your console as the test progresses:

	  Local Extension Tests
	Opening the Browse blade for the Microsoft.PortalSdk/rootResources resource type...
	Starting the ChromeDriver process...
	Performing SignIn...
	Waiting for the Portal...
	Waiting for the splash screen...
	Allowing trusted extensions...
	Waiting for the splash screen to go away...
	Applying filter 'theresource'...
	    √ Can Browse To The Resource Blade (22872ms)


	  1 passing (23s)


<a name="microsoft-azureportal-test-running"></a>
## Running

<a name="microsoft-azureportal-test-running-in-dev"></a>
### In Dev

<a name="microsoft-azureportal-test-running-in-dev-from-vs"></a>
#### From VS

<a name="microsoft-azureportal-test-running-in-dev-from-cmdline"></a>
#### From cmdline

<a name="microsoft-azureportal-test-running-ci"></a>
### CI

<a name="microsoft-azureportal-test-running-ci-cloudtest"></a>
#### Cloudtest

Running mocha nodejs tests in cloudtest requires a bit of engineering work to set up the test VM. Unfortunetly, the nodejs test adaptor cannot be used with vs.console.exe since it requires a full installation of Visual Studio which is absent on the VMs. Luckily, we can run a script to set up our environment and then the Exe Execution type for our TestJob against the powershell/cmd executable.

<a name="microsoft-azureportal-test-running-ci-cloudtest-environment-setup"></a>
##### Environment Setup
Nodejs (and npm) is already installed on the cloudtest VMs. Chrome is not installed by default, so we can include the chrome executable in our build drop for quick installation.

setup.bat
```
cd UITests
call npm install --no-optional
call npm install -g typescript
call "%APPDATA%\npm\tsc.cmd"
call chrome_installer.exe /silent /install
exit 0
```

<a name="microsoft-azureportal-test-running-ci-cloudtest-running-tests"></a>
##### Running Tests
Use the Exe execution type in your TestJob to specify the powershell (or cmd) exe. Then, point to a script which will run your tests:

TestGroup.xml
```
<TestJob Name="WorkspaceExtension.UITests" Type="SingleBox" Size="Small" Tags="Suite=Suite0">
    <Execution Type="Exe" Path="C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" Args='[SharedWorkingDirectory]\UITests\RunTests.ps1' />
</TestJob>
```

At the end of your script you will need to copy the resulting trx file to the TestResults folder where Cloudtest expects to pick it up from. To generate a trx file, we used the mocha-trx-reporter npm package. To pass secrets to cloudtest, you can either use test secretstore which has been configured to use a certificate installed on all cloudtest VMs for particular paths, or one of the other solutions shown [here](https://stackoverflow.microsoft.com/questions/11589/getting-ais-token-in-cloudtest-machine/11665#11665)

RunTests.ps1
```
cd ..\UITests

$env:USER_EMAIL = ..\StashClient\StashClient.exe -env:test pgetdecrypted -name:Your/Secret/Path -cstorename:My -cstorelocation:LocalMachine -cthumbprint:0000000000000000000000000000000000000000

$env:USER_PASSWORD = ..\StashClient\StashClient.exe -env:test pgetdecrypted -name:Your/Secret/Path -cstorename:My -cstorelocation:LocalMachine -cthumbprint:0000000000000000000000000000000000000000

$env:TEST_ENVIRONMENT = [environment]::GetEnvironmentVariable("TEST_ENVIRONMENT","Machine")

mocha WorkspaceTests.js --reporter mocha-trx-reporter --reporter-file ./TestResults/result.trx

xcopy TestResults\* ..\TestResults
```

To pass non-secret parameters to your cloudtest session (and the @microsoft/azureportal-test) use the props switch when kicking off a cloudtest session. The properties will become machine level environment variables on your cloudtest VM. Once these are set as environment variables of the session, you can use nconf to pick them up in your UI test configuration.
```
ct -t "amd64\CloudTest\TestMap.xml" -tenant Default -BuildId "GUID" -props worker:TEST_ENVIRONMENT=canary
```


<a name="microsoft-azureportal-test-running-ci-windows-azure-engineering-system-waes"></a>
#### Windows Azure Engineering System (WAES)

See [WAES](http://aka.ms/WAES)

<a name="microsoft-azureportal-test-running-ci-jenkins"></a>
#### Jenkins

<a name="microsoft-azureportal-test-running-ci-how-to-setup-test-run-parallelization"></a>
#### How to setup test run parallelization

<a name="microsoft-azureportal-test-debugging"></a>
## Debugging

<a name="microsoft-azureportal-test-debugging-debug-tests-101"></a>
### debug tests 101

<a name="microsoft-azureportal-test-debugging-debugging-tests-in-vs-code"></a>
### debugging tests in VS Code
If you run mocha with the --debug-brk flag, you can press F5 and the project will attach to a debugger.

<a name="microsoft-azureportal-test-debugging-checking-the-result-of-the-currently-running-test-in-code"></a>
### Checking the result of the currently running test in code

Sometimes it is useful to get the result of the currently running test, for example: you want to take a screenshot only when the test fails.

```ts

    afterEach(function () {
        if (this.currentTest.state === "failed") {
            return testSupport.GatherTestFailureDetails(this.currentTest.title);
        }
    });

```

One thing to watch out for in typescript is how lambda functions, "() => {}", behave.  Lambda functions (also called "fat arrow" sometimes) in Typescript capture the "this" variable from the surrounding context.  This can cause problems when trying to access Mocha's current test state.  See [arrow functions](https://basarat.gitbooks.io/typescript/content/docs/arrow-functions.html) for details.

<a name="microsoft-azureportal-test-debugging-how-to-take-a-screenshot-of-the-browser"></a>
### How to take a screenshot of the browser

This is an example of how to take a screenshot of what is currently displayed in the browser.

```ts
//1. import test fx
import testFx from '@microsoft/azureportal-test';
...
    var screenshotPromise = testFx.portal.takeScreenshot(ScreenshotTitleHere);
```

Taking a screenshot when there is a test failure is a handy way to help diagnose issues.  If you are using the mocha test runner, then you can do the following to take a screenshot whenever a test fails:

```ts
import testFx from '@microsoft/azureportal-test';
...

    afterEach(function () {
        if (this.currentTest.state === "failed") {
            return testSupport.GatherTestFailureDetails(this.currentTest.title);
        }
    });

```

<a name="microsoft-azureportal-test-debugging-how-to-capture-browser-console-output"></a>
### How to capture browser console output

When trying to identify reasons for failure of a test its useful to capture the console logs of the browser that was used to execute your test. You can capture the logs at a given level e.g error, warning, etc or at all levels using the LogLevel parameter. The following example demonstrates how to call getBrowserLogs and how to work with the result. getBrowserLogs will return a Promise of string[] which when resolved will contain the array of logs that you can view during debug or write to the test console for later analysis.

```ts
import testFx from '@microsoft/azureportal-test';
...

        await testFx.portal.goHome();
        const logs = await testFx.portal.getBrowserLogs(LogLevel.All);
        assert.ok(logs.length > 0, "Expected to collect at least one log.");

```


<a name="microsoft-azureportal-test-debugging-logs"></a>
### Logs

By default the framework emits logs to the console. You can reroute logs to be sent to a custom Logger.

```ts
//1. import test fx
import testFx from '@microsoft/azureportal-test';
...
    function logToStorageAccount(logMsg: string) {
        // log to storageaccount
    }

    testFx.Logger.bind(logToStorageAccount);
```

<a name="microsoft-azureportal-test-debugging-logs-enabling-diagnostic-logs"></a>
#### Enabling diagnostic logs

You can enable additional diagnostic logs by setting the following environment variable.

> set DEBUG=testFx:warning,testFx:information,testFx:diagnostics*

or

> set DEBUG=testFx*


<a name="microsoft-azureportal-test-debugging-callstack"></a>
### Callstack

<a name="microsoft-azureportal-test-debugging-test-output-artifacts"></a>
### Test output artifacts

<a name="microsoft-azureportal-test-localization"></a>
## Localization

<a name="microsoft-azureportal-test-user-management"></a>
## User Management

<a name="microsoft-azureportal-test-configuration"></a>
## Configuration

<a name="microsoft-azureportal-test-configuration-configuration-options"></a>
### Configuration options
This document will describe the behavior and list common configuration settings used by the `@microsoft/azureportal-test` framework.

<a name="microsoft-azureportal-test-configuration-configuration-options-behavior"></a>
#### Behavior
The test framework will search for a config.json in the current working directory (usually the directory the test is invoked from).  If no config.json is found then it will check the parent folder for a config.json (and so on...).

<a name="microsoft-azureportal-test-configuration-configuration-options-portalcontext"></a>
#### PortalContext
This file contains a list of configuration values used by the test framework for context when running tests against the portal.
These values are mutable to allow test writers to set the values in cases where they prefer not to store them in the config.json.
**We strongly recommend that passwords should not be stored in the config.json file.**

```ts
import TestExtension from "./TestExtension";
import Feature from "./Feature";
import BrowserResolution from "./BrowserResolution";
import Timeout from "./Timeout";

export class PortalContextBase {
    /**
     * The set of capabilities enabled in the webdriver session.
     * For a list of available capabilities, see https://github.com/SeleniumHQ/selenium/wiki/DesiredCapabilities
     */
    capabilities: {
        /**
         * The name of the browser being used; should be one of {chrome}
         */
        browserName: string;

        /**
         * Chrome-specific supported capabilities.
         */
        chromeOptions: {
            /**
             * List of command-line arguments to use when starting Chrome.
             */
            args: string[];
        };

        /**
         * The desired starting browser's resolution in pixels.
         */
        browserResolution: BrowserResolution;
    } = null;
    /**
     * The browserstack url the tests should run on.
     * This field needs to be set if the tests are meant to run on browserstack
     * and should not be set if the tests are meant to run locally.
     */
    browserStackUrl?: string = null;
    /**
     * The path to the ChromeDriver binary.
     */
    chromeDriverPath?: string = null;
    /**
     * The url of the Portal.
     */
    portalUrl: string = null;
    /**
     * The url of the page where signin is performed.
     */
    signInUrl?: string = null;
    /**
     * Email of the user used to sign in to the Portal.
     */
    signInEmail?: string = null;
    /**
     * Password of the user used to sign in to the Portal.
     */
    signInPassword?: string = null;
    /**
     * The set of features to enable while navigating within the Portal.
     */
    features?: Feature[] = null;
    /**
     * The list of patch files to load within the Portal.
     */
    patches?: string[] = null;
    /**
     * Flag to enable executing the provided patches in Portal shell in addition to the extensions
     */
    patchShell?: boolean = null;
    /**
     * The set of extensions to side load while navigating within the Portal.
     */
    testExtensions?: TestExtension[] = null;
    /**
     * The set of timeouts used to override the default timeouts.
     * e.g.
     * timeouts: {
     *      timeout: 15000  //Overrides the default short timeout of 10000 (10 seconds).
     *      longTimeout: 70000 //Overrides the default long timetout of 60000 (60 seconds).
     * }
     */
    timeouts?: Timeout = null;

    /**
     * browser session Id
     */
    sessionId?: string = null;
    /**
     * fake user Id
     */
    fakeUser: string = null;
}

/**
 * Represents The set of options used to configure a Portal instance.
 */
export default interface PortalContext extends PortalContextBase {
    [x: string]: any;
}

type PortalContextPropsArray = Array<keyof PortalContext>;

/**
 * Represents the set of keys for the default options.
 */
export const PortalContextPropNames: PortalContextPropsArray = Object.keys(new PortalContextBase()) as PortalContextPropsArray;

```

<a name="microsoft-azureportal-test-configuration-configuration-options-running-tests-against-the-dogfood-environment"></a>
#### Running tests against the Dogfood environment
In order to run tests against the Dogfood test environment, you will need to update the follow configuration settings in the config.json:

```json
{
  portalUrl: https://df.onecloud.azure-test.net/,
  signInUrl: https://login.windows-ppe.net/
}
```


<a name="microsoft-azureportal-test-scenarios"></a>
## Scenarios

<a name="microsoft-azureportal-test-scenarios-create"></a>
### Create

<a name="microsoft-azureportal-test-scenarios-create-opening-the-create-blade-from-a-deployed-gallery-package"></a>
#### Opening the create blade from a deployed gallery package

To open/navigate to the create blade a gallery package previously deployed to the Azure Marketplace you can use `portal.openGalleryCreateBlade`.  The returned promise will resolve with the CreateBlade defined by that gallery package.

```ts
import testFx from '@microsoft/azureportal-test';
...
FromLocalPackage
        await testFx.portal.openGalleryCreateBladeFromLocalPackage(
            extensionResources.samplesExtensionStrings.Engine.engineNoPdl,     //title of the item in the marketplace e.g "EngineNoPdlV1"
            extensionResources.samplesExtensionStrings.Engine.createEngine, //the title of the blade that will be opened e.g "Create Engine"
            10000);                                                         //an optional timeout to wait on the blade
        await createEngineBlade.checkFieldValidation();
        await createEngineBlade.fillRequiredFields(resourceName, "800cc", "type1", subscriptionName, resourceName, locationDescription);
        await createEngineBlade.reviewAndCreateButton.click();
        await testFx.portal.wait(async () => !await createEngineBlade.createButton.hasClass(CssClassNames.Controls.buttonDisabled));
        await createEngineBlade.createButton.click();
        await testFx.portal.wait(
            until.isPresent(testFx.portal.blade({ title: `${extensionResources.samplesExtensionStrings.Engine.engineNoPdl} - Overview` })),
            120000,
            "The resource blade was not opened, could be deployment timeout.");
        
...
```

<a name="microsoft-azureportal-test-scenarios-create-opening-the-create-blade-from-a-local-gallery-package"></a>
#### Opening the create blade from a local gallery package

To open/navigate to the create blade a local gallery package that has been side loaded into the portal along with your extension you can use `portal.openGalleryCreateBladeFromLocalPackage`.  The returned promise will resolve with the CreateBlade defined by that gallery package.

```ts
import testFx from '@microsoft/azureportal-test';
...

        await testFx.portal.openGalleryCreateBladeFromLocalPackage(
            extensionResources.samplesExtensionStrings.Engine.engineNoPdl,     //title of the item in the marketplace e.g "EngineNoPdlV1"
            extensionResources.samplesExtensionStrings.Engine.createEngine, //the title of the blade that will be opened e.g "Create Engine"
            10000);                                                         //an optional timeout to wait on the blade
        await createEngineBlade.checkFieldValidation();
        await createEngineBlade.fillRequiredFields(resourceName, "800cc", "type1", subscriptionName, resourceName, locationDescription);
        await createEngineBlade.reviewAndCreateButton.click();
        await testFx.portal.wait(async () => !await createEngineBlade.createButton.hasClass(CssClassNames.Controls.buttonDisabled));
        await createEngineBlade.createButton.click();
        await testFx.portal.wait(
            until.isPresent(testFx.portal.blade({ title: `${extensionResources.samplesExtensionStrings.Engine.engineNoPdl} - Overview` })),
            120000,
            "The resource blade was not opened, could be deployment timeout.");
        
...
```

<a name="microsoft-azureportal-test-scenarios-create-validation-state"></a>
#### Validation State

<a name="microsoft-azureportal-test-scenarios-create-get-the-validation-state-of-fields-on-your-create-form"></a>
#### Get the validation state of fields on your create form

`FormElement` exposes two useful functions for working with the ValidationState of controls.

The function `getValidationState` returns a promise that resolves with the current state of the control and can be used as follows

```ts
import testFx from '@microsoft/azureportal-test';
...

        //click the createButton on the create blade to fire validation
        await this.createButton.click();
        //get the validation state of the control
        await this.element(By.chained(By.className("fxs-blade-statusbg"), By.className("fxs-bg-error")));
        await this.element(By.className(tabClass)).click();
        const state = await this.primaryEngine.getValidationState();
        //assert state matches expected
        // tslint:disable-next-line: deprecation
        assert.equal(state, testFx.Constants.ControlValidationState.invalid, "name should have invalid state");
        
...

```

<a name="microsoft-azureportal-test-scenarios-create-wait-on-a-fields-validation-state"></a>
#### Wait on a fields validation state

The function `waitOnValidationState(someState, optionalTimeout)` returns a promise that resolves when the current state of the control is equivalent to someState supplied.  This is particularly useful for scenarions where you may be performing serverside validation and the control remains in a pending state for the duration of the network IO.

```ts
import testFx from '@microsoft/azureportal-test';
...

        //change the value to initiate validation
        await this.element(By.className(tabClass)).click();
        await this.primaryEngine.sendKeys(nameTxt + webdriver.Key.TAB);
        //wait for the control to reach the valid state
        await this.primaryEngine.waitOnValidationState(testFx.Constants.ControlValidationState.valid);
...

```


<a name="microsoft-azureportal-test-scenarios-browse"></a>
### Browse

<a name="microsoft-azureportal-test-scenarios-browse-how-to-test-the-context-menu-in-browse-shows-your-extensions-commands"></a>
#### How to test the context menu in browse shows your extensions commands?

There is a simple abstraction available in MsPortalFx.Tests.Browse.  You can use it as follows:

```ts
//1. import test fx
import testFx from '@microsoft/azureportal-test';

...

it("Can Use Context Click On Browse Grid Rows", () => {
    ...
//2. Setup an array of commands that are expected to be present in the context menu
//  and call the contextMenuContainsExpectedCommands on Tests.Browse.
    //  The method will assert expectedCommands match what was displayed
    
        const expectedContextMenuCommands: Array<string> = [
            PortalFxResources.pinToDashboard,
            extensionResources.hubsExtension.resourceGroups.deleteResourceGroupLabel,
        ];
        await testFx.Tests.Browse.contextMenuContainsExpectedCommands(
            resourceProvider, // the resource provider e.g "microsoft.classicCompute"
            resourceType, // the resourceType e.g "domainNames"
            resourceBladeTitle, // the resource blade title "Cloud services (classic)"
            2, // Invoke context menu with right click on a column that does not contain links
            expectedContextMenuCommands); 
});
```


<a name="microsoft-azureportal-test-scenarios-browse-how-to-test-the-grid-in-browse-shows-the-expected-default-columns-for-your-extension-resource"></a>
#### How to test the grid in browse shows the expected default columns for your extension resource

There is a simple abstraction available in MsPortalFx.Tests.Browse.  You can use it as follows:

```ts
//1. import test fx
import testFx from '@microsoft/azureportal-test';

...

it("Browse contains default columns with expected column header", () => {
 // 2. setup an array of expectedDefaultColumns to be shown in browse

    const expectedDefaultColumns: Array<testFx.Tests.Browse.ColumnTestOptions> =
        [
            { columnLabel: extensionResources.hubsExtension.resourceGroups.browse.columnLabels.name },
            { columnLabel: extensionResources.hubsExtension.resourceGroups.browse.columnLabels.subscription },
            { columnLabel: extensionResources.hubsExtension.resourceGroups.browse.columnLabels.location },
        ];

// 3. call the TestFx.Tests.Browse.containsExpectedDefaultColumns function.
// This function this will perform a reset columns action in browse and then assert
// the expectedDefaultColumns match what is displayed

        return testFx.Tests.Browse.containsExpectedDefaultColumns(
            resourceProvider,
            resourceType,
            resourceBladeTitle,
            expectedDefaultColumns);
}
```

<a name="microsoft-azureportal-test-scenarios-how-to-test-the-grid-in-browse-shows-additional-extension-resource-columns-that-are-selected"></a>
### How to test the grid in browse shows additional extension resource columns that are selected

There is a simple abstraction available in MsPortalFx.Tests.Browse that asserts extension resource specific columns can be selected in browse and that after selection they show up in the browse grid.
the function is called `canSelectResourceColumns`. You can use it as follows:

```ts
// 1. import test fx
import testFx from '@microsoft/azureportal-test';

...

it("Can select additional columns for the resourcetype and columns have expected title", () => {

// 2. setup an array of expectedDefaultColumns to be shown in browse

    const expectedDefaultColumns: Array<testFx.Tests.Browse.ColumnTestOptions> =
        [
            { columnLabel: extensionResources.hubsExtension.resourceGroups.browse.columnLabels.name },
            { columnLabel: extensionResources.hubsExtension.resourceGroups.browse.columnLabels.subscription },
            { columnLabel: extensionResources.hubsExtension.resourceGroups.browse.columnLabels.location },
        ];

// 3. setup an array of columns to be selected and call the TestFx.Tests.Browse.canSelectResourceColumns function.
// This function this will perform:
//   - a reset columns action in browse
//   - select the provided columnsToSelect
//   - assert that brows shows the union of
// the expectedDefaultColumns match what is displayed expectedDefaultColumns and columnsToSelect

        const columnsToSelect: Array<testFx.Tests.Browse.ColumnTestOptions> =
            [
                { columnLabel: extensionResources.hubsExtension.resourceGroups.browse.columnLabels.locationId },
                { columnLabel: extensionResources.hubsExtension.resourceGroups.browse.columnLabels.resourceGroupId },
                { columnLabel: extensionResources.hubsExtension.resourceGroups.browse.columnLabels.status },
                { columnLabel: extensionResources.hubsExtension.resourceGroups.browse.columnLabels.subscriptionId },
            ];
        return testFx.Tests.Browse.canSelectResourceColumns(
            resourceProvider,
            resourceType,
            resourceBladeTitle,
            expectedDefaultColumns,
            columnsToSelect); 
}
```


<a name="microsoft-azureportal-test-scenarios-blades"></a>
### Blades

<a name="microsoft-azureportal-test-scenarios-blades-blade-navigation"></a>
#### Blade navigation

To navigate to blades within `@microsoft/azureportal-test` can use one of several approaches

- via a deep link to the blade using the `portal.navigateToUriFragment` function e.g

    ```ts
    import testFx from '@microsoft/azureportal-test';
    ...
    
        const resourceName = resourcePrefix + guid.newGuid();
        const createOptions = {
            name: resourceName,
            resourceGroup: resourceGroupName,
            location: locationId,
            resourceProvider: resourceProvider,
            resourceType: resourceType,
            resourceProviderApiVersion: resourceProviderApiVersion,
            properties: {
                displacement: "600cc",
                model: "type1",
                status: 0,
            },
        };
        const resourceId = await testSupport.armClient.createResource(createOptions);
        //form deep link to the quickstart blade
        await testFx.portal.navigateToUriFragment(`blade/SamplesExtension/EngineQuickStartBlade/id/${encodeURIComponent(resourceId)}`, timeouts.defaultLongTimeout);
        return testFx.portal.wait(ExpectedConditions.isPresent(testFx.portal.blade({ title: resourceId, bladeType: QuickStartBlade })), timeouts.defaultLongTimeout, "Quickstart blade was not found.");
        
    ```

- via clicking on another ux component that opens the blade

    ```ts
    // New sample needed
    ```

- via `portal.open*` functions open common portal blades like create, browse and resource summary blades. See [Opening common portal blades](#scenarios-opening-common-portal-blades)

- via `portal.search` function to search for, and open browse and resource blades

    ```ts
    import testFx from '@microsoft/azureportal-test';
    ...
    const subscriptionsBlade = testFx.portal.blade({ title: testSupport.subscription });

    testFx.portal.portalContext.features.push({ name: "feature.resourcemenu", value: "true" });
    return testFx.portal.goHome().then(() => {
        return testFx.portal.search(testSupport.subscription);
    }).then((results) => {
        return testFx.portal.wait<SearchResult>(() => {
            const result = results[0];
            return result.title.getText().then((title) => {
                return title === testSupport.subscription ? result : null;
            });
        });
    }).then((result) => {
        return result.click();
    }).then(() => {
        return testFx.portal.wait(until.isPresent(subscriptionsBlade));
    });
    ```

<a name="microsoft-azureportal-test-scenarios-blades-locating-an-open-blade"></a>
#### Locating an open blade

There are several approaches that can be used for locating an already opened blade use `testfx.portal.blade`.

- by blade title
    ```ts
    
        const resourceBlade = testFx.portal.blade({ title: resourceGroupName });
    ```

<a name="microsoft-azureportal-test-scenarios-blades-common-portal-blades"></a>
#### Common portal blades

<a name="microsoft-azureportal-test-scenarios-blades-common-portal-blades-opening-the-extensions-create-blade"></a>
##### Opening the extensions Create blade

See [Opening an extensions gallery package create blade](#scenarios-create-opening-an-extensions-gallery-package-create-blade)

<a name="microsoft-azureportal-test-scenarios-blades-common-portal-blades-opening-the-browse-blade-for-your-resource"></a>
##### Opening the Browse blade for your resource

To open/navigate to the Browse blade from resource type you can use `portal.openBrowseBlade`.  The returned promise will resolve with the browse blade.

```ts
import testFx from '@microsoft/azureportal-test';
...

        const blade = await testFx.portal.openBrowseBlade(resourceProvider, resourceType, resourceBladeTitle, timeouts.defaultLongTimeout);
        
...
```
<a name="microsoft-azureportal-test-scenarios-blades-common-portal-blades-opening-a-resource-summary-blade"></a>
##### Opening a Resource Summary blade

To open/navigate to the Resource Summary blade for a specific resource you can use `portal.openResourceBlade`.  The returned promise will resolve with the Resource summary blade for the given resource.

```ts
import testFx from '@microsoft/azureportal-test';
...

        const result = await testSupport.armClient.createResourceGroup(resourceGroupName, locationId);
        await testFx.portal.openResourceBlade(result.resourceGroup.id, result.resourceGroup.name, 70000);
        await resourceBlade.clickCommand(extensionResources.hubsExtension.resourceGroups.deleteResourceGroupLabel);
...
```

<a name="microsoft-azureportal-test-scenarios-blades-common-portal-blades-spec-picker-blade"></a>
##### Spec Picker Blade

The `SpecPickerBlade` can be used to select/change the current spec of a resource.  The following example demonstrates how to navigate to the spec picker for a given resource then changes the selected spec.

```ts
//1. imports
import testFx from '@microsoft/azureportal-test';
import SpecPickerBlade = testFx.Parts.SpecPickerBlade;


        const pricingTierBlade = testFx.portal.blade({ title: extensionResources.samplesExtensionStrings.PricingTierBlade.title });
        //2. Open navigate blade and select the pricing tier part.
        // Note if navigating to a resourceblade use testFx.portal.openResourceBlade and blade.element
        await testFx.portal.navigateToUriFragment("blade/SamplesExtension/PricingTierV3Blade", 75000);
        await pricingTierBlade.waitUntilBladeAndAllTilesLoaded();
        const pricingTierPart: PricingTierPart = testFx.portal.element(PricingTierPart);
        await pricingTierPart.click();
        //3. get a reference to the picker blade and pick a spec
        const pickerBlade = testFx.portal.blade({ bladeType: SpecPickerBlade, title: extensionResources.choosePricingTier });
        await pickerBlade.pickSpec(extensionResources.M);
        
```

There are also several API's available to make testing common functionality within browse such as context menu commands and column picking fucntionality for more details see [Browse Scenarios](#scenarios-browse).

<a name="microsoft-azureportal-test-scenarios-blades-common-portal-blades-properties-blade"></a>
##### Properties Blade

Navigation to the `PropertiesBlade` is done via the resource summary blade. The following demonstrates how to navigate to the properties blade

```ts
import testFx from '@microsoft/azureportal-test';
...
//2. navigate to the properties blade from the resource blade and check the value of one of the properties

        const resourceBlade = await testFx.portal.openResourceBlade(resourceId, resourceName, 70000);
        await resourceBlade.openMenuItem(PortalFxResources.properties);
        const expectedPropertiesCount = 6;
        await testFx.portal.wait(async () => {
            const properties = await resourcePropertiesParentBlade.getAllDetailBladeItems(testFx.Parts.PartProperty);
            const count = properties.length;
            return count === expectedPropertiesCount;
        }, null, testFx.Utils.String.format("Expected to have {0} properties in the Properties blade.", expectedPropertiesCount));
        const locator = new testFx.Parts.PartProperty().buildLocator({ name: PortalFxResources.nameLabel });
        const property = (await resourcePropertiesParentBlade.detailBladeContent).element(locator).asType(testFx.Parts.PartProperty);
        const nameProperty = await testFx.portal.wait(async () => {
            const copyableLabel = property.value.element(testFx.Controls.CopyableLabel);
            const present = await copyableLabel.isPresent();
            const nameProperty = present && await copyableLabel.value();
            return nameProperty || await property.value.getText();
        });
        // tslint:disable-next-line: deprecation
        return assert.equal(nameProperty, resourceName, testFx.Utils.String.format("Expected the value for the 'NAME' property to be '{0}' but found '{1}'.", resourceName, nameProperty));
        
...
```

<a name="microsoft-azureportal-test-scenarios-blades-common-portal-blades-quickstart-blade"></a>
##### QuickStart Blade

Using a deep link you can navigate directly into a `QuickStartBlade` for a resource with `Portal.navigateToUriFragment`.

```ts
import testFx from '@microsoft/azureportal-test';
...

        const resourceName = resourcePrefix + guid.newGuid();
        const createOptions = {
            name: resourceName,
            resourceGroup: resourceGroupName,
            location: locationId,
            resourceProvider: resourceProvider,
            resourceType: resourceType,
            resourceProviderApiVersion: resourceProviderApiVersion,
            properties: {
                displacement: "600cc",
                model: "type1",
                status: 0,
            },
        };
        const resourceId = await testSupport.armClient.createResource(createOptions);
        //form deep link to the quickstart blade
        await testFx.portal.navigateToUriFragment(`blade/SamplesExtension/EngineQuickStartBlade/id/${encodeURIComponent(resourceId)}`, timeouts.defaultLongTimeout);
        return testFx.portal.wait(ExpectedConditions.isPresent(testFx.portal.blade({ title: resourceId, bladeType: QuickStartBlade })), timeouts.defaultLongTimeout, "Quickstart blade was not found.");
        
```

While deeplinking is fast it does not validate that the user can actually navigate to a QuickStartBlade via a `ResourceSummaryPart` on a resource summary blade.  The following demonstrates how to verify the user can do so.

```ts
import testFx from '@microsoft/azureportal-test';
...
//1. model your resource summary blade which contains a resource summary part

import Blade = testFx.Blades.Blade;
import ResourceSummaryControl = testFx.Controls.Essentials;

export default class SummaryBlade extends Blade {
    public essentialsPart = this.element(ResourceSummaryControl);
}

...
//2. navigate to the quickstart and click a link

        const expectedEndTitle = resourceGroupName + " - " + PortalFxResx.quickStartMenu;

        const resourceBlade = await testFx.portal.openResourceBlade(resourceGroupId, resourceGroupName, timeouts.defaultLongTimeout);
        //click to open the quickstart blade
        await resourceBlade.openMenuItem(PortalFxResx.quickStartMenu);
        await testFx.portal.wait(() => {
            return testFx.portal.blade({ title: expectedEndTitle });
        }, null, "Title of the blade should update to include the Quickstart suffix");
        
...
```

<a name="microsoft-azureportal-test-scenarios-blades-common-portal-blades-users-blade"></a>
##### Users Blade

Using a deep link you can navigate directly into the user access blade for a resource with `Portal.navigateToUriFragment`.

```ts
import testFx from '@microsoft/azureportal-test';
...

        const resourceName = resourcePrefix + guid.newGuid();
        const createOptions = {
            name: resourceName,
            resourceGroup: resourceGroupName,
            location: locationId,
            resourceProvider: resourceProvider,
            resourceType: resourceType,
            resourceProviderApiVersion: resourceProviderApiVersion,
            properties: {
                displacement: "600cc",
                model: "type2",
                status: 0,
            },
        };

        const resourceId = await testSupport.armClient.createResource(createOptions);
        //form deep link to the quickstart blade
        await testFx.portal.navigateToUriFragment(`blade/Microsoft_Azure_AD/UserAssignmentsBlade/scope/${resourceId}`, timeouts.defaultLongTimeout);
        return await testFx.portal.wait(ExpectedConditions.isPresent(testFx.portal.element(testFx.Blades.UsersBlade)));
        
```

While deeplinking is fast it does not validate that the user can actually navigate to a UsersBlade via a `ResourceSummaryPart` on a resource summary blade.  The following demonstrates how to verify the user can do so.

```ts
import testFx from '@microsoft/azureportal-test';
...
//1. model your resource summary blade which contains a resource summary part

import Blade = testFx.Blades.Blade;
import ResourceSummaryControl = testFx.Controls.Essentials;

export default class SummaryBlade extends Blade {
    public essentialsPart = this.element(ResourceSummaryControl);
}

...
//2. navigate to the quickstart and click a link

        const expectedEndTitle = resourceGroupName + " - " + PortalFxResx.usersMenu;

        const resourceBlade = await testFx.portal.openResourceBlade(resourceGroupId, resourceGroupName, timeouts.defaultLongTimeout);
        //click to open the user access blade
        await resourceBlade.openMenuItem(PortalFxResx.usersMenu);
        await testFx.portal.wait(() => {
            return testFx.portal.blade({ title: expectedEndTitle });
        }, null, "Title of the blade should update to include the Users suffix");
        
...
```

<a name="microsoft-azureportal-test-scenarios-blades-common-portal-blades-move-resource-blade"></a>
##### Move Resource Blade

The `MoveResourcesBlade` represents the portals blade used to move resources from a resource group to a new resource group `portal.startMoveResource` provides a simple abstraction that will iniate the move of an existing resource to a new resource group.  The following example demonstrates how to initiate the move and then wait on successful notification of completion.

```ts
import testFx from '@microsoft/azureportal-test';
...

        await testFx.portal.startMoveResource(
            {
                resourceId: resourceId,
                targetResourceGroup: newResourceGroup,
                createNewGroup: true,
                subscriptionName: subscriptionName,
                timeout: 120000,
            });
        return await testFx.portal.element(NotificationsPane).waitForNewNotification(portalFxResources.movingResourcesComplete, null, 5 * 60 * 1000);
```

<a name="microsoft-azureportal-test-scenarios-blades-blade-dialogs"></a>
#### Blade Dialogs

On some blades you may use commands that cause a blade dialog that generally required the user to perform some acknowledgement action.
The `Blade` class exposes a `dialog` function that can be used to locate the dialog on the given blade and perform an action against it.
The following example demonstrates how to:

- get a reference to a dialog by title
- find a field within the dialog and sendKeys to it
- clicking on a button in a dialog

```ts
import testFx from '@microsoft/azureportal-test';
...

        testFx.portal.blade({ title: "Samples", bladeType: SamplesBlade });
        await testFx.portal.goHome(70000);
        await testFx.portal.navigateToUriFragment("blade/InternalSamplesExtension/BladeWithToolbar");
        let blade = testFx.portal.blade({ title: extensionResources.samplesExtensionStrings.SamplesBlade.bladeWithToolbar });
        blade = await blade.clickCommand("Form");
        //get a reference to a dialog by title
        const dialog = blade.dialog({ title: "Form" });
        //sending keys to a field in a dialog
        await dialog.field(testFx.Controls.TextField, { label: "Form" }).sendKeys("Something goes here");
        //clicking a button within a dialog
        await dialog.clickButton(extensionResources.ok);
        
```


<a name="microsoft-azureportal-test-scenarios-parts"></a>
### Parts

<a name="microsoft-azureportal-test-scenarios-parts-how-to-get-the-reference-to-a-part-on-a-blade"></a>
#### How to get the reference to a part on a blade

1. If it is a specific part, like the essentials for example:
```
	let thePart = await blade.find(testFx.Parts.ResourceSummaryPart);
```
1. For a more generic part:
```
	let thePart = blade.part({innerText: "some part text"});
```
1. To get a handle of this part using something else than simple text you can also do this:
```
	let thePart =(await blade.find(By.Classname("myPartClass"))).AsType(testFx.Parts.Part);
```

<a name="microsoft-azureportal-test-scenarios-parts-collectionpart"></a>
#### CollectionPart

The following example demonstrates how to:

- get a reference to the collection part using `blade.find(...)`.
- get the rollup count using `collectionPart.getRollupCount()`
- get the rollup count lable using `collectionPart.getRollupLabel()`
- get the grid rows using `collectionPart.grid.rows`

```ts

    it.skip("Can get rollup count, rollup label and grid", async () => {
        const collectionBlade = testFx.portal.blade({ title: "Collection" });

        await testFx.portal.navigateToUriFragment("blade/SamplesExtension/CollectionPartIntrinsicInstructions");
        await testFx.portal.wait(() => collectionBlade.waitUntilBladeAndAllTilesLoaded());
        const collectionPart = collectionBlade.element(testFx.Parts.CollectionPart);
        const rollupCount = await collectionPart.getRollupCount();
        // tslint:disable-next-line: deprecation
        assert.equal(4, rollupCount, "expected rollupcount to be 4");
        const label = await collectionPart.getRollupLabel();
        // tslint:disable-next-line: deprecation
        assert.equal(extensionResources.samplesExtensionStrings.Robots, label, "expected rollupLabel is Robots");
        const count = await collectionPart.grid.rows.count();
        assert.ok(count > 0, "expect the grid to have rows");
    });
```

Note if you have multiple collection parts you may want to use `blade.part(...)` to search by text.

<a name="microsoft-azureportal-test-scenarios-parts-grid"></a>
#### Grid

<a name="microsoft-azureportal-test-scenarios-parts-grid-finding-a-row-within-a-grid"></a>
##### Finding a row within a grid

The following demonstrates how to use `Grid.findRow` to:

- find a `GridRow` with the given text at the specified index
- get the text from all cells within the row using `GridRow.cells.getText`

```ts

            const row = await grid.findRow({ text: "John", cellIndex: 0 });
            const texts = await row.cells.getText();
            return texts.length > 2 && texts[0] === "John" && texts[1] === "333";
            
```

<a name="microsoft-azureportal-test-scenarios-parts-createcomboboxfield-obsolete"></a>
#### CreateComboBoxField - Obsolete

use this for modeling the resouce group `CreateComboBoxField` on create blades.

- use `selectOption(...)` to chose an existing resource group
- use `setCreateValue(...)` and `getCreateValue(...)` to get and check the value of the create new field respectively

```ts
return testFx.portal.goHome(40000).then(() => {
	//1. get a reference to the create blade
	return testFx.portal.openGalleryCreateBlade(
		galleryPackageName,              //the gallery package name e.g "Microsoft.CloudService"
		bladeTitle, //the title of the blade e.g "Cloud Services"
		timeouts.defaultLongTimeout             //an optional timeout to wait on the blade
	)
}).then((blade: testFx.Blades.CreateBlade) => {
	//2. find the CreateComboBoxField
	return blade.find(CreateComboBoxField).then((createComboField) => {
		//3. set the value of the Create New text field for the resource group
		return createComboField.setCreateValue("NewValue")
			.then(() =>
				createComboField.getCreateValue()
			).then((value) =>
				assert.equal("NewValue", value, "Set resource group name")
			).then(() =>
				createComboField.selectOption("OldValue_4")
			).then(() =>
				createComboField.getDropdownValue()
			).then((value) =>
				assert.equal("OldValue_4", value, "Set create combo dropdown")
			);
	});
});
```

<a name="microsoft-azureportal-test-scenarios-parts-resourcegroupdropdownfield"></a>
#### ResourceGroupDropDownField

use this for modeling the resouce group `ResourceGroupDropDownField` on create blades.

- use `setSelectedResourceGroup(...)` and `getSelectedResourceGroup` to get and check the value of the dropdown field respectively
- use `setNewResourceGroup(...)` and `getNewResourceGroup(...)` to get and check the value of the create new field respectively

```ts

        //1. open create blade
        await testFx.portal.openGalleryCreateBlade(
            extensionResources.samplesExtensionStrings.Engine.engineNoPdl,     //title of the item in the marketplace e.g "EngineNoPdlV1"
            extensionResources.samplesExtensionStrings.Engine.createEngine, //the title of the blade that will be opened e.g "Create Engine"
            10000);                                                         //an optional timeout to wait on the blade
        //2. get a reference to the create blade
        const createEngineBlade = testFx.portal.blade({ bladeType: CreateEngineBlade });
        //3. create the harness for the ResourceGroupDropDownField
        let resourceGroup = createEngineBlade.field(ResourceGroupDropDown, { label: resources.resourceGroup });
        await createEngineBlade.checkFieldValidation();
        //4a. set the value of the Create New text field for the resource group
        await resourceGroup.setNewResourceGroup("NewResourceGroup");
        const rgName = await resourceGroup.getNewResourceGroup();
        // tslint:disable-next-line: deprecation
        assert.equal("NewResourceGroup", rgName, "Set resource group name");
        //4b. set the value of the Use Existing dropdown
        await resourceGroup.setSelectedResourceGroup("Default-Storage-WestUS");
        const selectedRGName = await resourceGroup.getSelectedResourceGroup();
        // tslint:disable-next-line: deprecation
        assert.equal("Default-Storage-WestUS", selectedRGName, "Set resource group dropdown");
        await createEngineBlade.clickClose();
        await testFx.portal.acceptAlert();
        const blade = await testFx.portal.openGalleryCreateBlade("Microsoft.ResourceGroup", "Create a resource group");
        resourceGroup = await blade.field(ResourceGroupDropDown, { label: resources.resourceGroup });
        resourceGroup.setNewResourceGroup("newRG");
        
```

<a name="microsoft-azureportal-test-scenarios-parts-editor"></a>
#### Editor

<a name="microsoft-azureportal-test-scenarios-parts-editor-can-read-and-write-content"></a>
##### Can read and write content

The following example demonstrates how to:

- use `read(...)` to read the content
- use `empty(...)` to empty the content
- use `sendKeys(...)` to write the content

```ts

        const editorBlade: EditorBlade = await BladeOpener.openSamplesExtensionBlade(
            editorBladeTitle,
            editorUriFragment,
            EditorBlade,
            70000);
        const editor: Editor = editorBlade.editor;
        editor.viewModelName = "editorVM";

        const content = await editor.read();
        // tslint:disable-next-line: deprecation
        assert.equal(content, expectedContent, "expectedContent is not matching");
        await editor.empty();
        await editor.sendKeys("document.");
        await testFx.portal.wait(async () => {
            return await editor.isIntellisenseUp();
        });
        const saveButton = By.css(`.fxc-simplebutton[data-bind="pcControl: saveButton"]`);
        await editorBlade.element(saveButton).click();
        await testFx.portal.wait(async () => {
            const content = await editor.read();
            return content === "document.";
        });
        const count = await editor.workerIFramesCount();
        // tslint:disable-next-line: deprecation
        assert.equal(count, 0, "We did not find the expected number of iframes in the portal.  It is likely that the editor is failing to start web workers and is falling back to creating new iframes");
        
```

<a name="microsoft-azureportal-test-scenarios-parts-essentials"></a>
#### essentials

<a name="microsoft-azureportal-test-scenarios-parts-essentials-essentials-tests"></a>
##### Essentials tests

The following example demonstrates how to:

- use `countItems(...)` to count the number of all items. (MultiLine Item is counted as one)
- use `isDisabled(...)` to get a value that determines whether the essentials is disabled
- use `hasViewAll(...)` to get a value that determines whether the essentials has ViewAll button or not
- use `getViewAllButton(...)` to get a PortalElement of the essentials' viewAll button
- use `getItemByLabelText(...)` to get an EssentialsItem that is found by its label text
- use `getPropertyElementByValue(...)` to get a PortalELement of matching property value
- use `getExpandedState(...)` to get a value that determines the essentials' expanded state
- use `setExpandedState(...)` to set the essentials' expanded state
- use `getExpander(...)` to get the Expander element
- use `getProperties(...)` to get an array of properties
- use `getLabelText(...)` to get the item label text
- use `hasMoveResource(...)` to get whether the item has move resource blade or not
- use `getLabelId(...)` to get the item label id
- use `getSide(...)` to get the item's side

```ts

        try {
            const blade: EssentialsBlade = await BladeOpener.openSamplesExtensionBlade(
                essentialsBladeTitle,
                essentialsUriFragment,
                EssentialsBlade,
                waitTime);
            await blade.waitUntilLoaded(waitTime);
            // Expand the essentials control if it was collapsed in a previous session.
            const essentialVal = await Promise.all([blade.essentials.getExpandedState(), blade.essentials.getExpander()]);
            let expandedState = essentialVal[0];
            const expander = essentialVal[1];
            if (!expandedState) {
                await expander.click().delay(200);
            }

            const essentials: Essentials = blade.essentials;
            const essentialsInfo = await Promise.all([essentials.countItems(), essentials.getExpandedState(), essentials.hasViewAll()]);
            const countItems = essentialsInfo[0];
            expandedState = essentialsInfo[1];
            const hasViewAll = essentialsInfo[2];
            // Essentials item count, expanded state and viewAll button state check
        // tslint:disable-next-line: deprecation
            assert.equal(countItems, 10, "Essentials should have 10 items at the beginning, found " + countItems);
            assert.ok(expandedState, "Essentials should be expanded");
            assert.ok(hasViewAll, "Essentials has the ViewAll button at the beginning");
            await essentials.getViewAllButton().click();
            const count = await essentials.countItems();
            // Essentials item count after click ViewAll button
        // tslint:disable-next-line: deprecation
            assert.equal(count, 12, "Essentials should have 12 items after adding dynamic properties, found " + count);
            // Item label and properties check
            await Promise.all([
                itemAssertionHelper(essentials, {
                    label: "Resource group",
                    hasMoveResource: true,
                    side: "left",
                    properties: [
                        { type: EssentialsItemPropertyType.Link, valueOptions: ["snowtraxpsx600"] },
                    ],
                }),
                itemAssertionHelper(essentials, {
                    label: "Multi-line Item",
                    hasMoveResource: false,
                    side: "right",
                    properties: [
                        { type: EssentialsItemPropertyType.Text, valueOptions: ["sample string value"] },
                        { type: EssentialsItemPropertyType.Link, valueOptions: ["Bing.com"] },
                    ],
                }),
                itemAssertionHelper(essentials, {
                    label: "Status",
                    hasMoveResource: false,
                    side: "left",
                    properties: [
                        { type: EssentialsItemPropertyType.Text, valueOptions: ["", "--"] },
                    ],
                }),
            ]);
            const item = await essentials.getItemByLabelText("Status");
            const properties = await item.properties;
            const statusProperty: EssentialsItemProperty = properties[0];
            const value = await statusProperty.getValue();
            if (value !== "1 times clicked!") {
                const propElement = await essentials.getPropertyElementByValue("status will be changed");
                await propElement.click({ remainingAttempts: 0, delay: 0 });
                await testFx.portal.wait<boolean>(async () => {
                    const value = await statusProperty.getValue();
                    return value === "1 times clicked!";
                });
            }
            // Item label and properties check after clicking "status will be changed"
            await itemAssertionHelper(essentials, {
                label: "Status",
                hasMoveResource: false,
                side: "left",
                properties: [
                    { type: EssentialsItemPropertyType.Text, valueOptions: ["1 times clicked!"] },
                ],
            });
            const propElement = await essentials.getPropertyElementByValue("snowtraxpsx600");
            await propElement.click().delay(500);
            await essentials.getExpander().click().delay(200);
            let essentialsState = await Promise.all([essentials.getExpandedState(), essentials.items.isDisplayed()]);
            expandedState = essentialsState[0];
            let isDisplayed = essentialsState[1];
            // check expander state and items' visibilities after closing expander
            assert.ok(!expandedState, "expander should be closed");
            isDisplayed.forEach((state: boolean) => {
                assert.ok(!state, "items should be invisible");
            });
            await essentials.getExpander().click().delay(200);
            essentialsState = await Promise.all([essentials.getExpandedState(), essentials.items.isDisplayed()]);
            expandedState = essentialsState[0];
            isDisplayed = essentialsState[1];
            // check expander state and items' visibilities after opening expander
            assert.ok(expandedState, "expander should be opened");
            isDisplayed.forEach((state: boolean, index: number) => {
                assert.ok(state, "items should be visible");
            });
        } catch (error) {
            console.log("Error:");
            console.log(error);
            console.log(error && error.stack);
            throw error;
        }
        
```


<a name="microsoft-azureportal-test-scenarios-command"></a>
### Command

<a name="microsoft-azureportal-test-scenarios-action-bar"></a>
### Action Bar

<a name="microsoft-azureportal-test-scenarios-delete"></a>
### Delete

<a name="microsoft-azureportal-test-scenarios-styling-layout-regression-detection"></a>
### Styling / layout regression detection

The CSS styling regression feature has been deprecated, please remove all usage of the `portal.detectStylingRegression` function.


<a name="microsoft-azureportal-test-scenarios-styling-layout-regression-detection-"></a>
#### ...

<a name="microsoft-azureportal-test-scenarios-locators"></a>
### Locators

<a name="microsoft-azureportal-test-scenarios-consuming-updates"></a>
### Consuming Updates

<a name="microsoft-azureportal-test-scenarios-mocking"></a>
### Mocking

<a name="microsoft-azureportal-test-scenarios-mocking-how-to-show-mock-data-into-the-portal"></a>
#### How to show mock data into the Portal

The [MsPortalFx-Mock](https://www.npmjs.com/package/msportalfx-mock) package provides a framework for showing mock data in the portal. It come with builtin support for mocking ARM data.

<a name="microsoft-azureportal-test-scenarios-mocking-how-to-show-mock-data-into-the-portal-mocking-arm"></a>
##### Mocking ARM

Mock data including providers, subscriptions, resource groups and resources can be defined in JSON object and used to initialize the ArmManager.

```ts

import { ArmProxy } from "MsPortalFx-Mock/lib/src/ArmProxy/ArmProxy";
import { ArmManager } from "MsPortalFx-Mock/lib/src/ArmProxy/armManager";

...

const mockData: ArmManager.MockData = {
    providers: [
        {
            namespace: "Providers.Test",
            resourceTypes: [
                {
                    resourceType: "type1",
                    locations: ["WestUS"],
                    apiVersions: ["2014-04-01"],
                },
                {
                    resourceType: "type2",
                    locations: ["East US", "East US 2", "North Central US"],
                    apiVersions: ["2014-04-01"],
                },
            ],
        },
    ],
    subscriptions: [
        {
            subscriptionId: "sub1",
            displayName: "Test sub 1",
            state: "Active",
            subscriptionPolicies: {
                locationPlacementId: "Public_2014-09-01",
                quotaId: "FreeTrial_2014-09-01",
            },
            resourceGroups: [
                {
                    name: "sub1rg1",
                    location: "WestUS",
                    tags: {
                        "env": "prod",
                        "ver": "4.6",
                    },
                    properties: {
                        lockState: "Unlocked",
                        provisioningState: "Succeeded",
                    },
                    resources: [
                        {
                            name: "sub1rg1r1",
                            location: "WestUS",
                            tags: {
                                "env": "prod",
                            },
                            type: "providers.test/type1",
                            kind: null,
                            nestedResources: [
                                {
                                    name: "nr1",
                                    tags: {},
                                    type: "nested",
                                },
                            ],
                        },
                    ],
                },
                {
                    name: "sub1rg2",
                    location: "WestUS",
                    tags: {
                        "env": "prod",
                        "ver": "4.6",
                    },
                    properties: {
                        lockState: "Unlocked",
                        provisioningState: "Succeeded",
                    },
                    resources: [
                        {
                            name: "sub1rg2r1",
                            location: "WestUS",
                            tags: {
                                "env": "prod",
                            },
                            type: "providers.test/type2",
                            kind: null,
                        },
                    ],
                },
            ],
        },
    ],
};

...

    const armManager = new ArmManager.Manager();
    armManager.initializeMockData(mockData);
    
```

The ArmProxy needs to initialized at the beginning of your tests with the ArmManager. The ArmProxy supports two modes for showing data 1) mock ONLY and 2) mock + actual.

You will need to initialize the portalContext->patches to the local server address setup by the proxy.

```ts

        const proxy = await ArmProxy.create(nconf.get("armEndpoint"), 5000, armManager, null, true);
        armProxy = proxy;
        testFx.portal.portalContext.patches = [proxy.patchAddress];
        
```

The proxy can be disposed at the end of your tests.
```ts

        await testFx.portal.quit();
        await ArmProxy.dispose(armProxy);
        
```


<a name="microsoft-azureportal-test-scenarios-code-coverage"></a>
### Code Coverage
<a name="microsoft-azureportal-test-scenarios-code-coverage-interop-how-to-run-net-code-from-your-tests"></a>
#### Interop, how to run .NET code from your tests
edge.js

<a name="microsoft-azureportal-test-scenarios-accessibility-testing"></a>
### Accessibility Testing

<a name="microsoft-azureportal-test-scenarios-accessibility-testing-overview-1"></a>
#### Overview

Automated accessibility testing is enabled via './src/Accessibility.ts' which wraps two NPM libraries, 'axe-core' and 'axe-webdriverjs'.

1. 'axe-core' is an accessibility testing library owned by "Deque Systems", see: https://github.com/dequelabs/axe-core.
2. 'axe-webdriverjs' is a wrapper for 'axe-core' which simplifies the process of injecting axe-core code into the DOM when using selenium, see: https://github.com/dequelabs/axe-webdriverjs.
3. In an effort to make accessibility testing as easy as possible, 'axe-webdriverjs' functionality was further wrapped by a function within 'Accessibility.ts' so that it can be executed with as little code as possible, and results can be surfaced as test failures. For microsoft tenants only: writing a pass/fail result to extension analyzer can be done by setting the optional parameter 'reportTestResult' to 'true'. For an example, see: https://extensionanalyzer.azure-test.net/extensions/Microsoft_Azure_Storage#blades, 'Accessibility (axe-core)' column.
4. The function 'ensureAccessibilityIsAxeCoreClean' within './src/Accessibility.ts' is exposed as a public function by the PortalElement class within './src/PortalElement.ts', so any portal element can be tested for accessibilty compliance. 
5. The 'ensureAccessibilityIsAxeCoreClean' function is primarily intended to be used at the blade level, as script is executed to collect the extension and blade name for reporting purposes.
6. In the case of blades which have controls which are dynamically rendered (create blades with tabs for example), the 'ensureAccessibilityIsAxeCoreClean' function can be called multiple times, and results can be differentiated by specifying a 'stepName' parameter, additional details below.

<a name="microsoft-azureportal-test-scenarios-accessibility-testing-sample-test"></a>
#### Sample Test

Here is the minimal amount of code necessary to test if a blade is accessible or not, from './test/AccessibilityTests.ts':
```ts

import * as testFx from "../src/Index";
import * as timeouts from "../src/Utils/Timeouts";
import TestSupport from "./TestSupport";

describe("Can test accessibility of blades", function () {
    this.timeout(0);
    const testSupport = new TestSupport(this);
    const resourceProvider = "Microsoft.Resources";
    const resourceType = "subscriptions%2fresourceGroups";
    const resourceBladeTitle = "Resource groups";

    before(() => {
        testSupport.initializePortalContext();
    });

    it.skip("Can test accessibility of the browse resource groups blade", async () => {
        const blade = await testFx.portal.openBrowseBlade(resourceProvider, resourceType, resourceBladeTitle, timeouts.defaultLongTimeout);
        return await blade.ensureAccessibilityIsAxeCoreClean({ disableRuleIds: ["skip-link"] });
    });
});


```

This code is opening the browse resource groups blade, and testing if it is accessible. The 'errorIdsToIgnore' parameter is used to ignore a set of errors by their error ID.

<a name="microsoft-azureportal-test-scenarios-accessibility-testing-options"></a>
#### Options

Here is a copy of the options interface for the 'ensureAccessibilityIsAxeCoreClean' function, within './src/Accessibility.ts':
```ts

export interface Options {
    /*
     * Some blades may require more then one test execution to hit the entire experience that a blade offers. A good example of this is a blade with tabs,
     * you will need to run the test one time per tab. The 'stepName' parameter offers a way to differentate multiple calls to ensureAccessibilityIsAxeCoreClean within a single test.
     * Example: 'BasicsTab'. Use this parameter if you call ensureAccessibilityIsAxeCoreClean more then once in a single test iteration.
     */
    stepName?: string;
    /*
     * Only specify this if you are testing the accessibility of a non-blade element, and you have specified 'overrideElementToInclude'.
     * This should correspond to a "friendly name" for the 'overrideElementToInclude'. Example: "DialogBox".
     */
    friendlyElementName?: string;
    /*
     * Override the default filter that finds blade areas that extension owners typically own. The class name of the top-most element to test within.
     * For example: '.fxs-blade-content-wrapper'. All elements within this element will be tested. In some cases, this may not be the same as the 'webElement'
     * passed into the 'ensureAccessibilityIsAxeCoreClean' function. This value is also used to calculate the extension and blade names. If these values are wrong,
     * it may be because the filter you are using is incorrect or not restrictive enough. This is used in the AxeBuilder.include() function call.
     */
    overrideElementToInclude?: string;
    /*
     * Specify which violation IDs should be ignored. These IDs correspond to the 'id' property on a 'Result' from 'axe-webdriverjs'.
     * Any violations with these IDs are not passed back for filtering & processing, they are completely removed from the violation results.
     * This array of IDs is passed to the AxeBuilder.disableRules() function call.
     */
    disableRuleIds?: string[];
    /*
     * Filter violations based on string checking the results. The key to the mapping should be a descriptive name of what's being filtered, such as "IgnoreColorContrastViolations".
     * Filters can be used instead of or in combination with 'disableRuleIds' in order to offer a way to fine-tune what is filtered.
     */
    violationFilters?: Map<string, ResultFilterFunction>;
    /*
     * Increase how much logging is done to assist with test development or investigating failures.
     */
    verboseLogging?: boolean;
    /*
     * Specify a logging function to call instead of 'Log.information'.
     */
    overrideLoggingFunction?: LoggingFunction;
    /*
     * Microsoft tenant only: If true, log a test result to the accessibility report API. Only applies to extension+blade level tests.
     */
    reportTestResult?: boolean;
    /*
     * Microsoft tenant only: Specify a function that can be used to get an authentication token to use with writes to the extension analyzer's accessibility report API. The API does not currently require this, but may in the future.
     * The API URL is: https://extensionanalyzer.azure-test.net/api/extensions/${extensionName}/blades/${bladeName}/accessibilityreport
     */
    getAuthenticationToken?: GetAuthenticationTokenFunction;
}


```

<a name="microsoft-azureportal-test-scenarios-contributing"></a>
### Contributing

<a name="microsoft-azureportal-test-scenarios-contributing-to-enlist"></a>
#### To enlist

git clone https://msazure.visualstudio.com/DefaultCollection/One/_git/AzureUX-PortalFx

<a name="microsoft-azureportal-test-scenarios-contributing-to-build-the-source"></a>
#### To build the source

Use Visual Studio or Visual Studio Code to build

How to build and push your changes

1. Go to the src/msportalfx-test directory
    1. npm run clean  (This will wipe out any extra files you have in the directory)
1. Build the @microsoft/azureportal-test package (see README.MD for details)
    - npm install --no-optional
    - Note the above command pulls dependencies and builds, if you just want to build use: `npm run build`
1.   Test your changes, see README.md for details on setup
        - [Check CI]( https://portalfxci.azure-test.net/view/MsPortalFx/)
        - Alternatively run `npm test` to run tests locally

1. Push your changes


<a name="microsoft-azureportal-test-scenarios-contributing-to-setup-the-tests"></a>
#### To setup the tests

1. To run the tests you need:

- Create a dedicated test subscription that is used for tests only
- A user that has access to the test subscription only
- An AAD App and service principal with access
- Have run `setup.cmd` in the portal repo or have run `powershell.exe -ExecutionPolicy Unrestricted -file "%~dp0\Setup-OneCloud.ps1" -DeveloperType Shell %*`

Once you have the first two use the following to create the AAD application and service principal.

```powershell
    @microsoft\azureportal-test\scripts\Create-AdAppAndServicePrincipal.ps1
        -TenantId "someguid"
        -SubscriptionId "someguid"
        -ADAppName "some ap name"
        -ADAppHomePage "https://somehomepage"
        -ADAppIdentifierUris "https://someidentiferuris"
        -ADAppPassword $someAdAppPassword
        -SPRoleDefinitionName "Reader"
```

**Note**: Don't forget to store the password you use below in key vault, secret store or other. You will not be able to retrieve it using the commandlets.

You will use the details of the created service principal in the next steps.

For more detail on [AAD Applications and Service Principals] see (https://azure.microsoft.com/en-us/documentation/articles/resource-group-authenticate-service-principal/#authenticate-with-password---powershell).

1. Open **test\config.json** and enter appropriate values for:
    ```
            "aadAuthorityUrl": "https://login.windows.net/TENANT_ID_HERE",
            "aadClientId": "AAD_CLIENT_ID_HERE",
            "subscriptionId": "SUBSCRIPION_ID_HERE",
            "subscriptionName": "SUBSCRIPTION_NAME_HERE",
    ```

1. The account that corresponds to the specified credentials should have at least contributor access to the subscription specified in the **config.json** file. The account must be a Live Id account. It cannot be an account that requires two factor authentication (like most @microsoft.com accounts).

1. Install the Portal SDK from [Aux Docs](https://auxdocs.azurewebsites.net/en-us/downloads), then open Visual Studio and create a new Portal Extension from File --> New Project --> Azure Portal --> Azure Portal Extension. Name this project **LocalExtension** so that the extension itself is named LocalExtension, which is what many of the tests expect. Then hit CTRL+F5 to host the extension in IIS Express.

1. The *Can Find Grid Row* and the *Can Choose A Spec* tests require special configuration described in the tests themselves.

1. Many of the tests currently rely on the CloudService extension. We are working to remove this dependency.

<a name="microsoft-azureportal-test-scenarios-to-run-the-tests"></a>
### To run the tests

Open a command prompt in this directory and run:

```
	npm install --no-optional
	npm test
```

<a name="microsoft-azureportal-test-scenarios-to-run-the-tests-authoring-documents"></a>
#### Authoring documents
- When adding a document create a new *.md file in /docs e.g /docs/foo.md
- Author the document using [markdown syntax](https://daringfireball.net/projects/markdown/syntax)
- Inject content from your documents into the master template in /docs/TEMPLATE.md using [gitdown syntax](https://github.com/gajus/gitdown) E.g

    ```
    {"gitdown": "include", "file": "./foo.md"}
    ```

- To ensure all code samples remain up to date we extended gitdown syntax to support code injection. To reference source code in your document directly from a *.ts file use the include-section extension E.g

    ```
    {"gitdown": "include-section", "file": "../test/BrowseResourceBladeTests.ts", "section": "tutorial-browse-context-menu#step2"}
    ```

    this will find all content in ../test/BrowseResourceBladeTests.ts that is wrapped in comments //tutorial-browse-context-menu#step2 and will inject them directly into the document. see /docs/tutorial-browse-context-menu.md for a working example

<a name="microsoft-azureportal-test-scenarios-to-run-the-tests-generating-the-docs"></a>
#### Generating the docs
You can generate the documentation in one of two ways

- As part of pack the `docs` script from package.json is run to ensure that all docs are up to date

    ```
    npm pack
    ```

-  Or, While you are writing docs you may want to check that your composition or jsdoc for API ref is generating as expected to do this you can execute run the following

    ```
    npm run docs
    ```

the output of the composed TEMPLATE.md will be written to ./README.md and the generated API reference from your jsdocs will be written to /docs/apiref.md

<a name="microsoft-azureportal-test-scenarios-to-run-the-tests-to-submit-your-contribution"></a>
#### To submit your contribution
Submit a pull request to the repo [http://aka.ms/portalfx/microsoft-azureportal-test/src](http://aka.ms/portalfx/microsoft-azureportal-test/src)

This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.


<a name="microsoft-azureportal-test-scenarios-to-run-the-tests-questions"></a>
#### Questions?

Send an email to ibizadiscuss@microsoft.com

<a name="microsoft-azureportal-test-scenarios-api-reference"></a>
### API Reference

[View thet API Reference](http://aka.ms/msportalfx-test/api)

Generated on 2021-03-11

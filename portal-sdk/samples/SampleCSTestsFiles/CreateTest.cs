//------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//------------------------------------------------------------

using System;
using System.Configuration;
using System.Globalization;
using Microsoft.Portal.TestFramework.Core;
using Microsoft.Portal.TestFramework.Core.Authentication;
using Microsoft.Portal.TestFramework.Core.Controls;
using Microsoft.Portal.TestFramework.Core.Controls.Forms;
using Microsoft.Portal.TestFramework.Core.Shell;
using Microsoft.Selenium.Utilities;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using OpenQA.Selenium;

namespace DocSampleTest
{
    [TestClass]
    public class CreateTest : BaseTest
    {

        [TestInitialize]
        public override void TestInitialize()
        {
            // Do nothing
        }

        [TestMethod]
        public void CreateResourceGroupViaDeepLink()
        {
            // Get the specified Portal Uri from the configuration file
            var portalUri = new Uri(ConfigurationManager.AppSettings["PortalUri"]);
            var extensionUri = new Uri(ConfigurationManager.AppSettings["ExtensionUri"]);

            // Make sure the servers are available
            PortalServer.WaitForServerReady(portalUri);
            ExtensionsServer.WaitForServerReady(extensionUri);

            // Create a webdriver instance to automate the browser.
            webDriver = WebDriverFactory.Create();

            // Create a Portal Authentication class to handle login, note that the portalUri parameter is used to validate that login was successful.
            var portalAuth = new PortalAuthentication(webDriver, portalUri);

            //config#openCreateViaDeepLink
            // Sign into the portal
            portalAuth.SignInAndSkipPostValidation(userName: "", /** The account login to use.  Note Multi Factor Authentication (MFA) is not supported, you must use an account that does not require MFA **/
                    password: "", /** The account password **/
                    tenantDomainName: string.Empty, /** the tenant to login to, set only if you need to login to a specific tenant **/
                    query: "feature.canmodifyextensions=true", /** Query string to use when navigating to the portal.  **/
                    fragment: "create/Microsoft.ResourceGroup" /** The hash fragment, we use this to navigate directly to the create blade on sign in. **/);
            //config#openCreateViaDeepLink

            // Check for and click the Untrusted Extension prompt if its present
            Portal.CheckAndClickExtensionTrustPrompt(webDriver);
            portal = Portal.FindPortal(webDriver, false);

            // Register a deployed extension via javascript and then reload the portal.  Not required if using the query string method to load from localhost
            (webDriver as IJavaScriptExecutor).ExecuteScript("MsPortalImpl.Extension.registerTestExtension({ name: \"SamplesExtension\", uri: \"https://df.onecloud.azure-test.net/Samples\"});");
            portal.WaitForPortalToReload(() => webDriver.Navigate().Refresh());

            // Check for and click the Untrusted Extension prompt if its present
            Portal.CheckAndClickExtensionTrustPrompt(webDriver);
            portal = Portal.FindPortal(webDriver, false);

            //config#fillOutCreateForm
            var rgNameTextboxFieldLabel = "Resource group name";
            var rgName = "Test-" + Guid.NewGuid();
            var rgCreateBladeTitle = "Resource group";

            // Find the create resource group blade which should be open because we deep linked into it
            var createRgBlade = portal.FindSingleBladeByTitle(rgCreateBladeTitle).WaitUntilBladeIsLoaded().WaitUntilAllPartsAreLoaded();

            // Get the form section for the create blade so we can find the fields to fill out
            var formSection = createRgBlade.FindElement<FormSection>();

            // Find the textbox with the label for resource group name
            var rgNameTextbox = formSection.FindFieldByLabel<Textbox>(rgNameTextboxFieldLabel);
            rgNameTextbox.Value = rgName + Keys.Tab; // Keys.Tab shifts focus out of the textfield so validation can kick in
            webDriver.WaitUntil(() => rgNameTextbox.IsEdited && rgNameTextbox.ValidationState.Equals(ControlValidationState.Valid),
                string.Format(CultureInfo.InvariantCulture, "The '{0}' field is still invalid or did not change into an edited state after entering a valid value.", rgNameTextboxFieldLabel));
            TestContext.WriteLine("Resource group name's text box field was set to: " + rgNameTextbox.Value);

            // Fill out the rest of the fields.
            var subFilterComboBoxLabel = "Subscription";
            FilterCombo subFilterComboBox = formSection.FindFieldByLabel<FilterCombo>(subFilterComboBoxLabel);
            var selectedSubFilterComboBoxValue = subFilterComboBox.Value;
            subFilterComboBox.SetValueToFirstDropdownMatch(selectedSubFilterComboBoxValue);

            var rgFilterComboBoxLabel = "Resource group location";
            FilterCombo rgFilterComboBox = formSection.FindFieldByLabel<FilterCombo>(rgFilterComboBoxLabel);
            var rgSelectedFilterComboValue = rgFilterComboBox.Value;
            rgFilterComboBox.SetValueToFirstDropdownMatch(rgSelectedFilterComboValue);
            //config#fillOutCreateForm

            //config#clickCreateAndVerify
            // Find and click the create button (sometimes also called Ok button)
            CreateActionBar createActionBar = webDriver.WaitUntil(() => createRgBlade.FindElement<CreateActionBar>(), "Could not find the create action bar.");
            createActionBar.ClickOk();
            webDriver.WaitUntil(() => portal.IsBladeClosed(rgCreateBladeTitle),
                string.Format(CultureInfo.InvariantCulture, "The {0} blade did not close after clicking the Create button on it's Create action bar.", rgCreateBladeTitle));

            portal.GetNotifications(text: "Creating resource group '" + rgName + "' succeeded", timeout: TimeSpan.FromSeconds(90));
            //config#clickCreateAndVerify
        }
    }
}

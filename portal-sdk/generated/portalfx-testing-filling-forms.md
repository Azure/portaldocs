
<a name="testing-filling-out-forms"></a>
## Testing: Filling Out Forms

You can find form fields using the **FindField** method of the **FormSection** class. First, let's find the form:

```cs
var portal = this.NavigateToPortal();

portal.StartBoard.FindSinglePartByTitle<ButtonPart>("New Contact").Click();

string contactName = "John Doe";
string subscriptionName = "Portal Subscription 2";

var blade = portal.FindSingleBladeByTitle("Basic Information");
var form = webDriver.WaitUntil(() => blade.FindElement<FormSection>(), "Could not find the form.");
```

In this example, the form has 2 fields, a TextBox field and a Selector field. Let's enter some text in the contactName text box field and wait until it is marked as Edited and Valid (since it supports validations):

```cs
string fieldName = "contactName";
var field = webDriver.WaitUntil(() => form.FindField<Textbox>(fieldName),
								string.Format("Could not find the {0} textbox.", fieldName));
field.Value = contactName + Keys.Tab;
webDriver.WaitUntil(() => field.IsEdited && field.IsValid,
					string.Format("The {0} field did not pass validations.", fieldName));
```

Now, let's find the Selector field and click it to open the associated picker blade:

```cs
fieldName = "subscriptionField";
form.FindField<Selector>(fieldName).Click();
```

Let's select an item from the picker's grid and click the OK button to send the selection back to the form:

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

Finally, let's click the Create button to complete the form and then look for a blade with the title of the created Contact to verify that it got created successfully:

```cs
blade = portal.FindSingleBladeByTitle("Basic Information");

CreateActionBar createActionBar = webDriver.WaitUntil(() => blade.FindElement<CreateActionBar>(),
													  "Could not find the create action bar.");
createActionBar.ClickOk();

portal.FindSingleBladeByTitle(contactName);
```

<a name="testing-filling-out-forms-full-example"></a>
### Full Example
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
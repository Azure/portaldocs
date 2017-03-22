
<a name="testing-parts-and-blades"></a>
## Testing Parts and Blades

Once you have an instance of the Portal object you can find parts on the StartBoard using the **Portal.StartBoard.FindSinglePartByTitle** method. The method will give you a an instance of the Part class that you can use to perform actions on the part, like clicking on it:

```cs
var portal = this.NavigateToPortal();

string samplesTitle = "Samples";

var samplesPart = portal.StartBoard.FindSinglePartByTitle<ButtonPart>(samplesTitle);
samplesPart.Click();
```

You can find blades in a simmilar way using the **Portal.FindSingleBladeByTitle** method and then find parts within the blade using the **Blade.FindSinglePartByTitle** method:

```cs
var blade = portal.FindSingleBladeByTitle(samplesTitle);

string sampleName = "Notifications";

blade.FindSinglePartByTitle(sampleName).Click();

blade = portal.FindSingleBladeByTitle(sampleName);
```

If you need to find parts based on different conditions other than the part's title you can do so by using the FindElement or FindElements methods on any web element:

```cs
var errorPart = webDriver.WaitUntil(() => blade.FindElements<Part>()
                                               .FirstOrDefault(p => p.Text.Contains("Send Error")),
									"Could not find a part with a Send Error text.");
```

Notice the use of the **WebDriver.WaitUntil** method as a general and recommended mechanism to ask the WebDriver to retry an operation until a condition succeeds. In this case, the test case asks WebDriver to wait until it can find a part within the blade that has text that contains the 'Send Error' string. Once it can find such part it is returned to the errorPart variable, or if it can't find it after the default timeout (10 seconds) it will throw an exception with the text specified in the last parameter.

You can also use classic Selenium WebDriver syntax to find any element based on a **By** selector. For example, this will find a single button element within the found part:

```cs
webDriver.WaitUntil(() => errorPart.FindElement(By.TagName("button")),
					"Could not find the button.")
	     .Click();
```

<a name="testing-parts-and-blades-full-example"></a>
#### Full example

```cs
using System;
using System.Linq;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Portal.TestFramework.Core;
using Microsoft.Selenium.Utilities;
using OpenQA.Selenium;
using Microsoft.Portal.TestFramework.Core.Shell;

namespace SamplesExtensionTests
{
    [TestClass]
    public class PartsAndBlades
    {
        private const string ExtensionUrl = "http://localhost:11998";
        private const string ExtensionWebSitePath = @"d:\Users\julioct\Documents\PortalSDK\FrameworkPortal\Extensions\SamplesExtension\Extension";
        private static IWebDriver webDriver;
        private static PortalServer portalServer;
        private static WebServer extensionServer;

        [TestInitialize]
        public void TestInitialize()
        {
            extensionServer = new WebServer(new Uri(ExtensionUrl), ExtensionWebSitePath);
            if (extensionServer.IsHostedByTestFramework)
            {
                extensionServer.Start();
            }

            portalServer = PortalServer.Create();

            if (portalServer.IsHostedByTestFramework)
            {
                portalServer.RegisterExtension("Samples", new Uri(extensionServer.Uri));
                portalServer.Start();
            }

            webDriver = WebDriverFactory.Create();
            webDriver.Url = "about:blank";
            portalServer.ClearUserSettings();
        }

        [TestMethod]
        public void CanFindPartsAndBlades()
        {
            var portal = this.NavigateToPortal();

            string samplesTitle = "Samples";

            var samplesPart = portal.StartBoard.FindSinglePartByTitle<ButtonPart>(samplesTitle);
            samplesPart.Click();

            var blade = portal.FindSingleBladeByTitle(samplesTitle);

            string sampleName = "Notifications";

            blade.FindSinglePartByTitle(sampleName).Click();

            blade = portal.FindSingleBladeByTitle(sampleName);

            var errorPart = webDriver.WaitUntil(() => blade.FindElements<Part>()
														   .FirstOrDefault(p => p.Text.Contains("Send Error")),
												"Could not find a part with a 'Send Error' text.");

            webDriver.WaitUntil(() => errorPart.FindElement(By.TagName("button")),
								"Could not find the button.")
					 .Click();
        }

        [TestCleanup]
        public void TestCleanup()
        {
            webDriver.Dispose();
            portalServer.Dispose();
            extensionServer.Dispose();
        }
    }
}

```
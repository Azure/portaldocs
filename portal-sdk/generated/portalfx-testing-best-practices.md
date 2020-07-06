
<a name="testing-best-practices"></a>
## Testing Best Practices

As you write UI based test cases using the Portal Test Framework it is recommended you follow a few best practices to ensure maximum reliability and to get the best value from your tests.

<a name="testing-best-practices-always-verify-that-every-action-completed-as-expected"></a>
### Always verify that every action completed as expected
In many cases the browser is not as fast as the test execution, so if you don't wait until expected conditions have completed your tests could easily fail. For example:

```cs
commandBar.FindMessageBox("Delete contact").ClickButton("Yes");
webDriver.WaitUntil(() => !commandBar.HasMessageBox, "There is still a message box in the command bar.");
```

Here, the "Yes" button of a message box is clicked and you would expect it to go away as soon as the button is clicked. However this might not happen as fast as you think. Therefore we wait until the CommandBar.HasMessageBox property reports 'false' before proceeding, which ensures the message box is gone and will not interfere with the next action.

<a name="testing-best-practices-log-everything"></a>
### Log everything
It can be very difficult to diagnose a failed test case without some good logging. An easy way to write these logs is to use the **TestContext.WriteLine** method:

```cs
TestContext.WriteLine("Starting provisioning from the StartBoard...");
```

<a name="testing-best-practices-use-built-in-test-framework-methods"></a>
### Use built in Test Framework methods
The Portal Test Framework provides many built in methods to perform actions on Portal web elements and it is recommended to use them for maximum test maintainability and reliability. For example, one way to find a StartBoard part by it's title is this:

```cs
var part = webDriver.WaitUntil(
    () => portal.StartBoard.FindElements<Part>()
    .FirstOrDefault(p => p.PartTitle.Equals("TheTitle")),
    "Could not find a part with title 'Samples'.");
```

However this can be greatly simplified by using a built in method:

```cs
var part = portal.StartBoard.FindSinglePartByTitle("TheTitle");
```

Not only this significantly reduces the amount of code to write and maintain but also encapsulates the best practice of waiting until elements are found since FindSinglePartByTitle will internally perform a WaitUntil operation that will retry until the part is found (or the timeout is reached).

BaseElement also contains an extension method that wraps the webDriver.WaitUntil call.

```cs
var part = blade.WaitForAndFindElement<Part>(p => p.PartTitle.Equals("TheTitle"));
```

<a name="testing-best-practices-use-waituntil-for-retrying-actions-and-waiting-for-conditions"></a>
### Use WaitUntil for retrying actions and waiting for conditions
WaitUntil can also be used to retry an action since it just takes a lambda function which could be an action and then a verification step afterwards.  WaitUntil will return when a "truthy" (not false or null value) is returned.  This can be useful if the particular action is flakey.  Please be careful to only use actions that are idempotent when trying to use WaitUntil in this pattern.

<a name="testing-best-practices-prefer-waituntil-to-assert-for-non-instantaneous-conditions"></a>
### Prefer WaitUntil to Assert for non instantaneous conditions
The traditional way to verify conditions within test cases is by using **Assert** methods. However, when dealing with conditions that won't be satisfied immediately you should instead use **WebDriver.WaitUntil**:

```cs
var field = form.FindField<Textbox>("contactName");
field.Value = contactName + Keys.Tab;
webDriver.WaitUntil(() => field.IsValid, "The 'contactName' field did not pass validations.");
```

In this example, if we would have instead used Assert to verify the IsValid propery the test would most like have failed since the TextBox field has a custom async validation that will perform a request to the backend server to perform the required validation, and this is expected to take at least a second.

<a name="testing-best-practices-create-proper-wrapper-abstractions-for-commonly-used-patterns"></a>
### Create proper wrapper/abstractions for commonly used patterns
A good practice is to create wrappers and abstractions for common patterns of code you use (eg when writing a WaitUntil, you may want to wrap it in a function that describes its actual intent).  This makes your test code clear in its intent by hiding the actual details to the abstraction's implementation.  It also helps with dealing with breaking changes as you can just modify your abstraction rather than every single test.  

If you think an abstraction you wrote would be generic and useful to the test framework, feel free to contribute it!

<a name="testing-best-practices-clear-user-settings-before-starting-a-test"></a>
### Clear user settings before starting a test
As you may know, the Portal keeps good track of all user customizations via persistent user settings. This behavior might not be ideal for test cases since each test case could potentially find a Portal with different customizations each time. To avoid this you can use the **portal.ResetDesktopState** method.  Note that the method will force a reload of the Portal.

```cs
portal.ResetDesktopState();
```

<a name="testing-best-practices-use-findelements-to-verify-the-absence-of-elements"></a>
### Use FindElements to verify the absence of elements
Sometimes you are not trying to find a web element but instead you want to verify that the element is not there. In these cases you can use the **FindElements** method in combination with Linq methods to verify if the element is there:

```cs
webDriver.WaitUntil(() => portal.StartBoard.FindElements<Part>()
                                           .Count(p => p.PartTitle.Equals("John Doe")) == 0,
                    "Expected to not find a part with title 'John Doe' in the StartBoard");
```

In the example, we are verifying that there is no part with title 'John Doe' in the StartBoard.

<a name="testing-best-practices-prefer-cssselector-to-xpath"></a>
### Prefer CssSelector to Xpath
You will eventually be faced with the choice of using either CSS selectors or XPath to find some web elements in the Portal. As a general rule the preferred approach is to use CSS selectors because:

- Xpath engines are different in each browser
- XPath can become complex and hense it can be harder to read
- CSS selectors are faster
- CSS is JQuery's locating strategy
- IE doesn't have a native XPath engine

Here for a simple example where we are finding the selected row in a grid:

```cs
grid.FindElements(By.CssSelector("[aria-selected=true]"))
```

If you think the element you found would be a useful abstraction, feel free to contribute it back to the test framework!

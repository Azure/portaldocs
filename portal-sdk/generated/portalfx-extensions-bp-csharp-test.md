
<a name="testing-best-practices"></a>
## Testing Best Practices

As you write UI based test cases using the Portal Test Framework it is recommended you follow a few best practices to ensure maximum reliability and to get the best value from your tests.

*  Always verify that every action completed as expected

    In many cases, the browser is not as fast as the test execution, so if you do not wait until expected conditions have completed, your tests could easily fail. For example, a messageBox may not be removed from the screen within a few moments after the button is clicked, even though the "Yes" button of a message box was clicked.   It is best practice to wait until the `CommandBar.HasMessageBox` property reports `false` before proceeding, as in the following example. This ensures the message box is gone and will not interfere with the next action.
    
    ```cs
    commandBar.FindMessageBox("Delete contact").ClickButton("Yes");
    webDriver.WaitUntil(() => !commandBar.HasMessageBox, "There is still a message box in the command bar.");
    ```
*  Log everything

    It can be very difficult to diagnose a failed test case without a log. An easy way to write these logs is to use the `TestContext.WriteLine` method, as in the following example.

    ```cs
    TestContext.WriteLine("Starting provisioning from the StartBoard...");
    ```

*  Use built-in Test Framework methods

    The Portal Test Framework provides many built-in methods to perform actions on Portal web elements.  It is recommended to use them for maximum test maintainability and reliability. For example, one way to find a StartBoard part by its title is in the following example.

    ```cs
    var part = webDriver.WaitUntil(
        () => portal.StartBoard.FindElements<Part>()
        .FirstOrDefault(p => p.PartTitle.Equals("TheTitle")),
        "Could not find a part with title 'Samples'.");
    ```

    This code can be simplified by using a built-in method, as in the following example.

    ```cs
    var part = portal.StartBoard.FindSinglePartByTitle("TheTitle");
    ```

    This significantly reduces the amount of code. It also encapsulates the best practice of waiting until elements are found, because the `FindSinglePartByTitle` method internally performs a `WaitUntil` operation that retries until the part is found or the timeout is reached.

    The `BaseElement` API also contains an extension method that wraps the `webDriver.WaitUntil` call.

    ```cs
    var part = blade.WaitForAndFindElement<Part>(p => p.PartTitle.Equals("TheTitle"));
    ```

* Use the WaitUntil method 

    The `WaitUntil` method should be used when retrying actions or waiting for conditions. It can also be used to retry an action, because it takes a lambda function which could be an action, followed by a verification step.  The `WaitUntil` method will return when a "truthy" value is returned, i.e., the value is neither false nor null.  This is useful if the specific action does not behave consistently.  Remember to use only actions that are [idempotent](portalfx-extensions-glossary-testing.md) when using the  `WaitUntil` method in this pattern.

* Use WaitUntil instead of Assert

    The traditional method of verifying conditions within test cases is by using **Assert** methods. However, when dealing with conditions that are not satisfied immediately, it is best practice to use the  **WebDriver.WaitUntil** method, as in the following example.

    ```cs
    var field = form.FindField<Textbox>("contactName");
    field.Value = contactName + Keys.Tab;
    webDriver.WaitUntil(() => field.IsValid, "The 'contactName' field did not pass validations.");
    ```

    In this example, the test would have failed if the `Assert` method had been used to verify the `IsValid` property,
     because the `TextBox` field uses a custom asynchronous validation.  This validation sends a request to the backend server to perform the required validation, which may take at least a second.

*  Create wrapper abstractions

    It is best practice to create wrappers and abstractions for common patterns of code. For example, when writing a `WaitUntil`, you may want to wrap it in a function that describes its actual intent.  This makes the intent of the  test code clear by hiding the actual details of  the abstraction's implementation.  It also helps with dealing with breaking changes, because you can modify the abstraction instead of every single test.  

    If an abstraction you wrote might be generic and useful to the test framework, you may contribute it as specified in [http://aka.ms/portalfx/contributing](http://aka.ms/portalfx/contributing).
    
* Clear user settings before starting a test

    The Portal keeps track of all user customizations by using persistent user settings. This behavior is not ideal for test cases, because each test case might use Portals that have different customizations. To avoid this you can use the **portal.ResetDesktopState** method. 
    
    ```cs
    portal.ResetDesktopState();
    ```

    **NOTE**: The method will force a reload of the Portal.

* Use `FindElements` to verify the absence of elements

    Sometimes an extension wants to verify that an element is not present, which may not be the same as code that validates  that an element is present.   In these cases you can use the **FindElements** method in combination with Linq methods to see if the element exists. For example, the following code verifies that there is no part with title 'John Doe' in the StartBoard.

    ```cs
    webDriver.WaitUntil(() => portal.StartBoard.FindElements<Part>()
                                            .Count(p => p.PartTitle.Equals("John Doe")) == 0,
                        "Expected to not find a part with title 'John Doe' in the StartBoard");
    ```

* Prefer CssSelector to Xpath

    It is best practice to use CSS selectors instead of **XPath** to find some web elements in the Portal. Some reasons are as follows.
    
    * **Xpath** engines are different in each browser

    * **XPath** can become complex and therefore more difficult to read

    * CSS selectors are faster

    * CSS is **JQuery's** locating strategy

    * **Internet Explorer** does not have a native **XPath** engine

    For example, the following code locates the selected row in a grid.

    ```cs
    grid.FindElements(By.CssSelector("[aria-selected=true]"))
    ```


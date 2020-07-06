
<a name="create-sample"></a>
## Create Sample
The sample below shows how to fill out a form to create a resource.

<a name="create-sample-open-your-create-blade"></a>
### Open your create blade
You first need to navigate to your create blade.  Below we show how to deep link directly to it after signing in.  Deep links are useful for speeding up the process of getting to your blade.  

```cs
```csharp

// Sign into the portal
portalAuth.SignInAndSkipPostValidation(userName: "", /** The account login to use.  Note Multi Factor Authentication (MFA) is not supported, you must use an account that does not require MFA **/
        password: "", /** The account password **/
        tenantDomainName: string.Empty, /** the tenant to login to, set only if you need to login to a specific tenant **/
        query: "feature.canmodifyextensions=true", /** Query string to use when navigating to the portal.  **/
        fragment: "create/Microsoft.ResourceGroup" /** The hash fragment, we use this to navigate directly to the create blade on sign in. **/);

```
```

<a name="create-sample-fill-out-the-create-form"></a>
### Fill out the create form
Once you have the create blade open, you need to fill out the form.  In order to find fields, you should first grab an instance of the **FormSection** class that corresponds to the blade.  You can use the FormSection class to find specific fields based on their labels.  The field controls can then be used to set or get their corresponding values.

```cs
```csharp

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

```
```

<a name="create-sample-completing-the-create-and-validating-success"></a>
### Completing the create and validating success
After the create blade has been completely filled out, you can start the click by clicking the "Create" button via the **ActionBar.ClickOk()** method.  You can verify the create was successful by waiting for the notification to appear.  

```cs
```csharp

// Find and click the create button (sometimes also called Ok button)
CreateActionBar createActionBar = webDriver.WaitUntil(() => createRgBlade.FindElement<CreateActionBar>(), "Could not find the create action bar.");
createActionBar.ClickOk();
webDriver.WaitUntil(() => portal.IsBladeClosed(rgCreateBladeTitle),
    string.Format(CultureInfo.InvariantCulture, "The {0} blade did not close after clicking the Create button on it's Create action bar.", rgCreateBladeTitle));

portal.GetNotifications(text: "Creating resource group '" + rgName + "' succeeded", timeout: TimeSpan.FromSeconds(90));

```
```
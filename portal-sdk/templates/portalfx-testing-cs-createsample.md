<properties title="" pageTitle="Create Sample" description="" authors="" />

# Create Sample
The sample below shows how to fill out a form to create a resource.

### Open your create blade
You first need to navigate to your create blade.  Below we show how to deep link directly to it after signing in.  Deep links are useful for speeding up the process of getting to your blade.  

```cs
{"gitdown": "include-section", "file": "../samples/SampleCSTestsFiles/CreateTest.cs", "section": "config#openCreateViaDeepLink"}
```

### Fill out the create form
Once you have the create blade open, you need to fill out the form.  In order to find fields, you should first grab an instance of the **FormSection** class that corresponds to the blade.  You can use the FormSection class to find specific fields based on their labels.  The field controls can then be used to set or get their corresponding values.

```cs
{"gitdown": "include-section", "file": "../samples/SampleCSTestsFiles/CreateTest.cs", "section": "config#fillOutCreateForm"}
```

### Completing the create and validating success
After the create blade has been completely filled out, you can start the click by clicking the "Create" button via the **ActionBar.ClickOk()** method.  You can verify the create was successful by waiting for the notification to appear.  

```cs
{"gitdown": "include-section", "file": "../samples/SampleCSTestsFiles/CreateTest.cs", "section": "config#clickCreateAndVerify"}
```
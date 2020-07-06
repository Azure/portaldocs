<properties title="" pageTitle="Open Browse Sample" description="" authors="" />

<a name="open-browse-sample"></a>
## Open Browse Sample
Although we recommend that you use deep links to open your extension's resources directly, sometimes you may want to open your extension's resource via the browse flyout.  

<a name="open-the-browse-flyout"></a>
## Open the browse flyout
In order to open the browse flyout, you can access the portal instance's **sidebar** class, call the **sidebar.OpenBrowseFlyout()** function, and then verify that the browse flyout has opened successfully.

```cs
```csharp

portal.SideBar.OpenBrowse();
var browseFlyout = portal.SideBar.BrowseFlyout;

webDriver.WaitUntil(
    () => browseFlyout.Displayed,
    "Expected the browse flyout to be displayed");
browseFlyout.GetItem("Resource groups").Click();
var rgBrowseBlade = portal.FindSingleBladeByTitle("Resource groups");

```
```

<a name="make-sure-the-grid-has-loaded-all-expected-columns"></a>
## Make sure the grid has loaded all expected columns
The browse blade may take some time before it is ready.  Interacting with the blade before hand may cause unpredicable behavior in the test if items are shifting around.  To alleviate this issue, we wait for all expected column headers to be loaded before continuing.

```cs
```csharp

var browseGridColumns = new List<string>() { "NAME", "SUBSCRIPTION", "LOCATION" };

// You probably want to wrap this in a function for re-use.  This is inlined for documenation purposes only
webDriver.WaitUntil(
        () =>
        {
            var headers = rgBrowseGrid.Headers.ToList();
            if (headers.Count != browseGridColumns.Count)
            {
                return false;
            }
            for (var index = 0; index < browseGridColumns.Count; index++)
            {
                if (!headers[index].Text.Equals(browseGridColumns[index], StringComparison.OrdinalIgnoreCase))
                {
                    return false;
                }
            }
            return true;
        },
        "Columns never finished loading or they were incorrect");

```
```

<a name="choosing-columns-in-the-browse-blade"></a>
## Choosing columns in the browse blade
One thing that you may want to verify are the columns that show up in the browse blade.  We start by finding the command bar and clicking the Column command using the **blade.FindCommandBar().ClickCommandBaritem()** API.  That opens the column choose blade which contains a list of columns.  Since the list is actually represented by a grid (you can check the DOM to see this), we want to find the grid first and then search its cells for the specific checkbox we want to enable.  Once the columns we have selected the columns we want to enable, we click the update button to apply our changes.

```cs
```csharp

rgBrowseBlade.FindCommandBar().ClickCommandBarItem("Columns");

// Find the column choose blade that pops up on the right
var columnChooserBlade = portal.FindSingleBladeByTitle("Choose columns");

// Find the column we want to activate
var columChooserGrid = columnChooserBlade.WaitForAndFindElement<Grid>();
var statusCell = columChooserGrid.FindCell("Status");
var statusCheckbox = statusCell.FindElement<CheckBox>();
statusCheckbox.Click();
columnChooserBlade.FindElement<FilterActionBar>().UpdateButton.Click();

```
```

<a name="verifying-the-columns"></a>
## Verifying the columns
As with any test, we always want to verify that our action was successful.  In this case, we go back to the browse blade and verify the headers are what we expect.

```cs
```csharp

browseGridColumns.Add("Status");

// You probably want to wrap this in a function for re-use.  This is inlined for documenation purposes only
webDriver.WaitUntil(
        () =>
        {
            var headers = rgBrowseGrid.Headers.ToList();
            if (headers.Count != browseGridColumns.Count)
            {
                return false;
            }
            for (var index = 0; index < browseGridColumns.Count; index++)
            {
                if (!headers[index].Text.Equals(browseGridColumns[index], StringComparison.OrdinalIgnoreCase))
                {
                    return false;
                }
            }
            return true;
        },
        "Columns never finished loading or they were incorrect");

```
```

<a name="full-browse-sample"></a>
## Full Browse Sample

```cs
    ﻿//------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//------------------------------------------------------------

using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Portal.TestFramework.Core.Controls;
using Microsoft.Portal.TestFramework.Core.Shell;
using Microsoft.Selenium.Utilities;
using Microsoft.VisualStudio.TestTools.UnitTesting;

namespace DocSampleTest
{
    /// <summary>
    /// Summary description for BrowseTest
    /// </summary>
    [TestClass]
    public class BrowseTest : BaseTest
    {
        [TestMethod]
        public void OpenBrowseItem()
        {
            //config#openBrowseItem
            portal.SideBar.OpenBrowse();
            var browseFlyout = portal.SideBar.BrowseFlyout;

            webDriver.WaitUntil(
                () => browseFlyout.Displayed,
                "Expected the browse flyout to be displayed");
            browseFlyout.GetItem("Resource groups").Click();
            var rgBrowseBlade = portal.FindSingleBladeByTitle("Resource groups");
            //config#openBrowseItem

            //config#findGrid
            Grid rgBrowseGrid = rgBrowseBlade.WaitForAndFindElement<Grid>();

            //config#waitForGridToLoadAllColumns
            var browseGridColumns = new List<string>() { "NAME", "SUBSCRIPTION", "LOCATION" };

            // You probably want to wrap this in a function for re-use.  This is inlined for documenation purposes only
            webDriver.WaitUntil(
                    () =>
                    {
                        var headers = rgBrowseGrid.Headers.ToList();
                        if (headers.Count != browseGridColumns.Count)
                        {
                            return false;
                        }
                        for (var index = 0; index < browseGridColumns.Count; index++)
                        {
                            if (!headers[index].Text.Equals(browseGridColumns[index], StringComparison.OrdinalIgnoreCase))
                            {
                                return false;
                            }
                        }
                        return true;
                    },
                    "Columns never finished loading or they were incorrect");
            //config#waitForGridToLoadAllColumns

            //config#chooseColumns
            rgBrowseBlade.FindCommandBar().ClickCommandBarItem("Columns");

            // Find the column choose blade that pops up on the right
            var columnChooserBlade = portal.FindSingleBladeByTitle("Choose columns");

            // Find the column we want to activate
            var columChooserGrid = columnChooserBlade.WaitForAndFindElement<Grid>();
            var statusCell = columChooserGrid.FindCell("Status");
            var statusCheckbox = statusCell.FindElement<CheckBox>();
            statusCheckbox.Click();
            columnChooserBlade.FindElement<FilterActionBar>().UpdateButton.Click();
            //config#chooseColumns

            //config#verifyNewColumns
            browseGridColumns.Add("Status");

            // You probably want to wrap this in a function for re-use.  This is inlined for documenation purposes only
            webDriver.WaitUntil(
                    () =>
                    {
                        var headers = rgBrowseGrid.Headers.ToList();
                        if (headers.Count != browseGridColumns.Count)
                        {
                            return false;
                        }
                        for (var index = 0; index < browseGridColumns.Count; index++)
                        {
                            if (!headers[index].Text.Equals(browseGridColumns[index], StringComparison.OrdinalIgnoreCase))
                            {
                                return false;
                            }
                        }
                        return true;
                    },
                    "Columns never finished loading or they were incorrect");
            //config#verifyNewColumns
        }
    }
}
```
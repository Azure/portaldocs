//------------------------------------------------------------
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
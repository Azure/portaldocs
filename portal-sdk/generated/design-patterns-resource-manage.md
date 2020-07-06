# Manage a Resource
The manage a resource pattern provides the configuration and management of a single Azure resource.

<a name="context"></a>
## Context
Users wants to manage all aspects of an Azure resoruce.

<a name="problem"></a>
## Problem
Users manage many different types of Azure resources. For settings that are common across resources, users expect a common interaction. For settings that are unique to a resource, users want a way to easily find those settings.

<a name="solution"></a>
## Solution
The Manage a Resource pattern is used to configure and manage a single Azure resource by using a resource menu to navigate the resource blades. The manage a resource page is typically opened from the browse resources page, when the user wants to see more details or make a change to a specific resource. The manage a resource page can also be opened from related resources that link to it.

<a name="solution-also-known-as"></a>
### Also known as
-   Resource blade 
-   Resource detail
-   Resource menu
-   Resource manage 

<a name="examples"></a>
## Examples
---------

<a name="examples-example-images"></a>
### Example images
<div style="max-width:800px">
<img alttext="Resource manage example" src="../media/design-patterns-resource-manage/resource-overview.png"  />
</div>

<a name="examples-example-uses"></a>
### Example uses
These Azure resources are good examples of this design pattern.  Links to specific resources cannot be included in the documentation, so find a resource of this type and navigate to it to see the resource management experience. 

-   Redis cache
-   Virtual machine

<a name="use-when"></a>
## Use when
Managing a single azure resource.

<a name="anatomy"></a>
## Anatomy
The manage a resource pattern is a full screen experience composed of a resource menu and corresponding resource blades. Settings that are common across resources have a standard menu item and menu location so that users can easily find them.
<!-- TODO UX - get updated manage a resource anatomy image -->
<div style="max-width:800px">
<img alttext="Resource manage anatomy" src="../media/design-patterns-resource-manage/resource-manage-anatomy.png"  />
</div>

A manage a resource experience usually contains:

1. Resource menu with common and specific items to manage all aspects of this resource
2. Resource pages opened from the menu items, commands or links

<a name="behavior"></a>
## Behavior
When a resource is opened in azure the resource menu is loaded and the Overview page for the resource is displayed.  The user can then select other menu items .

<a name="behavior-resource-menu"></a>
### Resource menu
The resource menu offers a way to navigate to all pages related to the resource. The navigation includes pages that are common to all resources throughout the portal. Your resource will get those "for free," although some common pages require onboarding by the resource provider. You can have additional pages for your resource.  Refer to the table below to make sure each item is grouped properly. Learn more [Resource Menu](top-blades-resourcemenublade.md)

Azure Portal Toolkit: <a href="https://www.figma.com/file/Bwn8rmUOYtnPRwA3JoQTBn/Azure-Portal-Toolkit?node-id=3059%3A368196" target="_blank">ResourceMenu design in figma</a>

<table style="width:800px; border-style:none; cellpadding=10px">
<tr>
<td width="30%" align=center valign=top>
<div style="max-width:200px">
<img alttext="Resource menu" src="../media/design-patterns-resource-manage/resource-menu.png"  />
</div>
</td>
<td valign=top>

<a name="behavior-resource-menu-content"></a>
### Resource menu content

**(Top level-no group label)**
* Overview
* Activity log
* Access control (IAM)
* Tags
* Diagnose and solve problems

**Settings - Configuration settings**
* _any resource-specific items come at the top of the group_
* Properties
* Locks
* Export template _(was "Automation script")_

**_any resource-specific groups and items_**

**Monitoring - Services that give visibility into health and ops**
 * Alerts
 * Metrics
 * Logs
 * Diagnostic settings
 * Advisor recommendations
 * _any resource-specific items_

**Support + troubleshooting - Tools to help users find and resolve issues**
* Resource health
* _any resource-specific items_
* New support request
</td>
</tr>
</table>

<a name="behavior-resource-pages"></a>
### Resource pages
Each menu item opens a page that allows the user to drill deeper for more information. Monitoring pages and Resource health require the resource provider to do additional onboarding.

<a name="behavior-overview-page"></a>
### Overview page
The overview page is the home page for a resource. It displays key information and actions for the resource.  The overview page should contain a toolbar, essentials panel, and content area.  See more details on overview page layout in the [overview page design pattern](portalfx-design-page-overview.md)

<div style="max-width:800px">
<img alttext="Resource overview page" src="../media/design-patterns-resource-manage/overview.png"  />
</div>


<a name="behavior-overview-page-toolbar"></a>
#### Toolbar
Toolbar commands should open context panes instead of narrow blades to avoid horizontal scrolling. The resource toolbar should contain commands common to all resources
* **Delete** - delete the current resource
* **Move** - a dropdown menu to move the current resource to a different resource group or subscription
* **Refresh** - refresh the overview page
The resource toolbar should also contain resource-specific commands for easy access.
Learn more [Toolbar](portalfx-controls-toolbar.md), [Context pane](top-extensions-context-panes.md)

<a name="behavior-overview-page-essentials-panel"></a>
#### Essentials panel
The essentials panel surfaces key properties that are common for all Azure resources and important resource specific properties. User feedback has
shown that they rely heavily on the essentials panel for looking up information.  Properties can contain links, and can open blades containing related resources (for example, resource group, subscription, hosting plan, etc). The links can also point to external sites.

The Essentials sections is divided in two well know parts, the left column contains properties common to all resources and the right column contains properties that are specific to this resource.

**Ordering guidelines**
<table>
<tr>
  <th align="left"> Common resource properties - Left column</th>
  <th align="left"> Resource-specific properties - Right column</th>
</tr>
<tr>
  <td>
Resource group<br>
Status<br>
Location<br>
Subscription name (link to subscription blade)<br>
Subscription ID<br>
</td>
  <td valign="top">
Up to 5 resource-specific fields. <br>
Labels should be limited a maximum length of 150px.<br>
  </td>
</tr>
<tr>
  <td colspan="2">
<b>Tags</b><br>
Display and manage the tags assigned to this resource.  Enabled with control option <br>
  </td>
</tr>
</table>

Learn more [portalfx-extensions-essentials.md](./portalfx-extensions-essentials.md)

<a name="behavior-overview-page-content-area"></a>
#### Content area
Display guiding content and key information about the resource
* *Must* meet the performance bar – the overview page is the most viewed blade for your resource  
* Content to guide the user to get the most from the resource 
* Resource properties to indicate important resource configuration 
* Resource performance metric graphs to indicate whether resource is functioning properly   


<a name="do"></a>
## Do

* Open context blades for user input and short summaries

* Ensure you have efficient APIs to get data for your overview page  

* Do leverage a status bar for resource level or page level messaging (error, warning, info, upsell)   


<a name="don-t"></a>
## Don&#39;t

* Don’t create resource-specific menu groups that have only one menu item  

* Don’t put so much information on your resource overview page that it fails the performance bar. You'll end up removing it to meet the bar.  

* Don’t build your overview page as a PDL blade   

<a name="related-design-guidelines"></a>
## Related design guidelines
* Overvew page [design-patterns-page-overview.md](design-patterns-page-overview.md)
* Create a Resource [design-patterns-resource-create.md](design-patterns-resource-create.md)
* Browse Resources [design-patterns-resource-browse.md](design-patterns-resource-browse.md)
* Design guidelines [top-design.md](top-design.md)

<a name="research-and-usability"></a>
## Research and usability

<a name="telemetry"></a>
## Telemetry

* Resources and menus with more than 20,000 clicks over last 28 days [View report](https://aka.ms/portalfx/fundamentals/resourcemenu)

<a name="for-developers"></a>
# For developers
Developers can use the following information to get started implementing this pattern

<a name="for-developers-tips-and-tricks"></a>
## Tips and tricks
* Use the ResourceMenu SDK building block

* Opt in to ResourceMenu using the AssetType `ResourceMenu` entry
    * Assign keywords to your Resource Menu items to help the user find items  
    * Enable the recommended flags on your resource menu
        * `enableSupportTroubleshootV2`
        * `enableProperties`
        * `enableAlerts`
        * `enableMetrics`
        * `enableLogs`
        * `enableDiagnostics`
        * `enableResourceHealth`
    * Make your resource menu static to help meet the performance bar 

* For you overview page
    * Build your overview page as a template blade  
    * To display tags in the Essentials Panel, add this line to the options object
passed to the essentials control:  `includeTags:true`
    * Make sure you have efficient APIs for overview data 
    * Include standard Overview page actions - **Move**, **Delete** and **Refresh**

* Make sure your RP has onboarded to Geneva for metrics and logs so you can
enable the monitoring menu items 

* Make sure your RP has onboarded to health services so you can enable the
diagnose/troubleshooting and resource health menu items 


<a name="for-developers-related-documentation"></a>
## Related documentation

Azure Portal Toolkit: <a href="https://www.figma.com/file/Bwn8rmUOYtnPRwA3JoQTBn/Azure-Portal-Toolkit?node-id=3059%3A368196" target="_blank">ResourceMenu design in figma</a>

* Resource Menu [top-blades-resourcemenublade.md](./top-blades-resourcemenublade.md)
* Essentials [portalfx-controls-essentials.md](./portalfx-controls-essentials.md)
* Toolbar control [portalfx-controls-toolbar.md](portalfx-controls-toolbar.md)
* Context Pane [top-extensions-context-panes.md](top-extensions-context-panes.md)
* Properties page [portalfx-blades-properties.md](portalfx-blades-properties.md)

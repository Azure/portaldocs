
<a name="frequently-asked-questions"></a>
## Frequently asked questions

<!-- TODO:  FAQ Format is ###Link, ***title***, Description, Solution, 3 Asterisks -->

<a name="frequently-asked-questions-the-resource-menu"></a>
### The Resource menu

***What is the resource menu?***

SOLUTION:  The resource menu is a single location for all the resource's functionality. It reduces horizontal movement by promoting a consistent navigation model for all Azure resources.

* * *

<a name="frequently-asked-questions-resource-menu-samples"></a>
### Resource menu samples

***Are there any samples I can refer to?***

SOLUTION: There are numerous samples that demonstrate how to use the resource menu.  They are located at `..<dir>\Client\ResourceTypes\Desktop\AssetViewModels\DesktopViewModel.ts`, where `<dir>` is the `SamplesExtension\Extension\` directory, based on where the samples were installed when the developer set up the SDK. 

* * *

<a name="frequently-asked-questions-the-support-resource-management-group"></a>
### The Support Resource Management Group

***How do I add items to the Support/Resource Management Group?***

SOLUTION:  You can add items by using a `MenuGroupExtension`. `MenuGroupExtension` is a special kind of menu group that is  specified in the menu config object.  For more information, see 
[portalfx-resourcemenu-migration.md#creating-an-assetviewmodel](portalfx-resourcemenu-migration.md#creating-an-assetviewmodel).

* * * 

<a name="frequently-asked-questions-horizontal-scrolling"></a>
### Horizontal scrolling

***How do I reduce horizontal scrolling and UI movement in my extension?***

Horizontal scrolling and UI movement was a prime source of negative user feedback. One way of addressing this issue is to refactor the extension so that there are fewer blades on the user's journey. The average journey depth is three or four blades and the average flow is Browse, Resource blade, Settings and then some blade from Settings or Resource menu. In many cases, the fourth blade is displayed off screen and then scrolled into view.  Using a Resource blade reduces the dependency on the settings blade. In some instances, an extension no longer uses a Settings blade, thereby reducing the number of blades on the journey.

* * *
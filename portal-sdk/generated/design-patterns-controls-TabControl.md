# TabControl

 
<a name="basics"></a>
### Basics
The TabControl control and related tabs pattern are used for navigating frequently accessed, distinct content categories. TabControls allow for navigation between two or more content views and rely on text headers to articulate the different sections of content.

Tapping on a tab item header navigates to that header's section content.


<!-- TODO get an IMAGE to embed here -->

<!-- TODO get an SAMPLE CODE to embed here -->

 
<a name="when-to-use"></a>
### When to use
Formatting pages in Azure can be done with several controls.  Choose the one best suited to your needs
* **Accordion** - use the accordion when some of the information can be hidden in a collapsed area of the page
* **Section** - use the section to group information and when all information on the page is shown without hidden, collapsed areas.  Sections are used throughout the page.  Sections is the only control that can cause its child controls to display their label on the same line as their data input field.  This **leftLabelPosition** option is used in the new creation forms and other wide forms
* **Splitter** - use the Spitter to display an area of the page split into 2 sections
* **TabControl** - use tabs to separate content on a page and ensure the user can see the available categories of information at the top of the page.  Tabs are typically used near the top of the page.  Tabs are used in the portal wizard experiences as "steps".



 
<a name="best-practices"></a>
### Best practices

<a name="best-practices-do"></a>
#### Do

* Use on content-heavy pages that require a significant amount of scrolling to access the various sections.
* Be concise on the navigation labels, ideally one or two words rather than a phrase.
* Make sure all the children of the each Tab component are Sections
* Use the TabControl on all wizards as "steps"

<a name="best-practices-don-t"></a>
#### Don&#39;t

* Don’t use the Tab to link to a new page.
* Don’t use the Tab to link to hidden content.



 
<a name="developer-tips-and-tricks"></a>
### Developer tips and tricks



<a name="developer-tips-and-tricks-interactive-control-and-sample-source-code"></a>
#### Interactive control and sample source code
Go to the playground site to use the latest control and get source code for your project.  [Learn more about playground](./top-extensions-controls-playground.md).

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/TabControl_create_Playground" target="_blank">TabControl in the interactive controls playground</a>




 
<a name="related-info"></a>
### Related info

* <a href="https://www.figma.com/file/Bwn8rmUOYtnPRwA3JoQTBn/Azure-Portal-Toolkit?node-id=3338%3A385588" target="_blank">TabControl in Azure Portal Toolkit (Figma)</a>

* <a href="https://www.figma.com/file/Bwn8rmUOYtnPRwA3JoQTBn/Azure-Portal-Toolkit?node-id=3546%3A1034" target="_blank">Sequential tabs in Azure Portal Toolkit (Figma)</a>

* [Azure design guidance](http://aka.ms/portalfx/design)



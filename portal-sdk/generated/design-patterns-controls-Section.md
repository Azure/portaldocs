# Section

 
<a name="basics"></a>
### Basics
The Section control is used to group and format controls on pages in the Azure portal


<!-- TODO get an IMAGE to embed here -->

<!-- TODO get an SAMPLE CODE to embed here -->

 
<a name="when-to-use"></a>
### When to use
Formatting pages in Azure can be done with several controls.  Choose the one best suited to your needs
Formatting pages in Azure can be done with several controls.  Choose the one best suited to your needs
* **Accordion** - use the accordion when some of the information can be hidden in a collapsed area of the page
* **Section** - use the section to group information and when all information on the page is shown without hidden, collapsed areas.  Sections are used throughout the page.  Sections is the only control that can cause its child controls to display their label on the same line as their data input field.  This **leftLabelPosition** option is used in the new creation forms and other wide forms
* **Splitter** - use the Spitter to display an area of the page split into 2 sections
* **TabControl** - use tabs to separate content on a page and ensure the user can see the available categories of information at the top of the page.  Tabs are typically used near the top of the page.  Tabs are used in the portal wizard experiences as "steps".



 
<a name="best-practices"></a>
### Best practices


<a name="best-practices-do"></a>
#### Do

* Use the Section control **leftLabelPosition** option to display each label and data field on the same line.  This is commonly used in resource creation forms and other wide pages
* Use a good **name** for the section so the user understand why the controls are grouped
* In input forms, the section should include a concise intro sentence below the name that describes the grouped controls and offers a link for the user to learn more

<a name="best-practices-don-t"></a>
#### Don&#39;t

* Don't put each field in its own Section just to display an explanation sentence.  The InfoBalloon control and infoBalloonContent can be used to explain individual controls.



 
<a name="developer-tips-and-tricks"></a>
### Developer tips and tricks



<a name="developer-tips-and-tricks-interactive-control-and-sample-source-code"></a>
#### Interactive control and sample source code
Go to the playground site to use the latest control and get source code for your project.  [Learn more about playground](./top-extensions-controls-playground.md).

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/Section_create_Playground" target="_blank">Section in the interactive controls playground</a>




 
<a name="related-info"></a>
### Related info

<!-- TODO link to Figma -->

* [Azure design guidance](http://aka.ms/portalfx/design)



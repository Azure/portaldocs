# Essentials

 
<a name="basics"></a>
### Basics
The essentials panel surfaces key properties that are common for all Azure resources and important resource specific properties. User feedback has shown that they rely heavily on the essentials panel for looking up information. Properties can contain links, and can open blades containing related resources (for example, resource group, subscription, hosting plan, etc). The links can also point to external sites.

The Essentials sections is divided in two well know parts, the left column contains properties common to all resources and the right column contains properties that are specific to this resource.

First 5 items in left pane of the essentials are obtained by calling Azure Resource Manager APIs with given resource id.



<!-- TODO get an IMAGE to embed here -->

<!-- TODO get an SAMPLE CODE to embed here -->

 
<a name="when-to-use"></a>
### When to use
The Essentials control should be used on all overview pages in [resource management]((http://aka.ms/portalfx/design)patterns/resourcemanage) experiences in Azure.


 
<a name="best-practices"></a>
### Best practices

<a name="best-practices-do"></a>
#### Do

* For ARM resources, retain the standard 5 properties in the first column
* Add up to 5 resource-specific properties which the user will need to refer to frequently
* Keep labels short, maximum length 150px
* Enable tags (includeTags option) so that the user can easily see the tags applied to the resource


<a name="best-practices-don-t"></a>
#### Don&#39;t

* Don't open your overview page with the essentials control collapsed



 
<a name="developer-tips-and-tricks"></a>
### Developer tips and tricks



<a name="developer-tips-and-tricks-interactive-control-and-sample-source-code"></a>
#### Interactive control and sample source code
Go to the playground site to use the latest control and get source code for your project.  [Learn more about playground](./top-extensions-controls-playground.md).

The Essentials control offers different create methods and has the following entries in the interactive controls playground

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/Essentials_createDefaultResourceLayout_Playground" target="_blank">Essentials (DefaultResourceLayout)</a>

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/Essentials_createCustomResourceLayout_Playground" target="_blank">Essentials (CustomResourceLayout)</a>

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/Essentials_createNonResourceLayout_Playground" target="_blank">Essentials (NonResourceLayout)</a>




 
<a name="related-info"></a>
### Related info

* <a href="https://www.figma.com/file/Bwn8rmUOYtnPRwA3JoQTBn/Azure-Portal-Toolkit?node-id=3410%3A7668" target="_blank">Essentials in Azure Portal Toolkit (Figma)</a>

* Manage a resource design pattern: [Manage a resource]((http://aka.ms/portalfx/design)patterns/resourcemanage)

* [Azure design guidance](http://aka.ms/portalfx/design)



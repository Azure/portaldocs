# DropDown

 
<a name="basics"></a>
### Basics
A DropDown is a list in which the selected item is always visible, and the others are visible on demand by clicking a drop-down button. 



<!-- TODO get an IMAGE to embed here -->

<!-- TODO get an SAMPLE CODE to embed here -->

 
<a name="when-to-use"></a>
### When to use
To select a **single option** among existing values.  Choose the control best suited to your needs
* **CheckBox** - a choice to switch between 2 mutually exclusive options (on/off, enable/disable) or to indicate a subordinate setting (I agree to terms) when paired with another control
opt in to a single choice.  For example, use a single CheckBox for "I agree" instead of a different control where the user chooses between "I agree" and "I don't agree".
* **TriStateCheckBox** - can be checked, not checked or partially checked to indicate the checked state of children items in a hierarchy.
* **DropDown** - a single choice between a large number of options.  The DropDown control is also used on a smaller set of options where the default option is recommended for most users.  The DropDown control can also be used to make multiple selections from a set of options.
* **OptionsGroup** - No longer recommended.  
* **RadioButtons** - a single choice between 2-7 equally weighted options.   



 
<a name="best-practices"></a>
### Best practices
DropDowns are used to simplify the design and make a choice within the UI. When closed, only the selected item is visible. When users click the drop-down button, all the options become visible. To change the value, users open the list and click another value or use the arrow keys (up and down) to select a new value.

DropDown offers the following options:
* Grouping of items 
* Filtering / Searching 
* Multiselect + Select all
* HTML formatting of items 

<a name="best-practices-do"></a>
#### Do

* Use a DropDown when there are multiple choices that can be collapsed under one title. Or if the list of items is long or when space is constrained.
* Use shortened statements or single words as options.
* Use a DropDown when the selected option is more important than the alternatives (in contrast to radio buttons where all the choices are visible putting more emphasis on the other options).

<a name="best-practices-don-t"></a>
#### Don&#39;t
* Don't use DropDown when there are 2-7 equally weighted options that the user needs to see, use RadioButtons instead.



 
<a name="developer-tips-and-tricks"></a>
### Developer tips and tricks



<a name="developer-tips-and-tricks-interactive-control-and-sample-source-code"></a>
#### Interactive control and sample source code
Go to the playground site to use the latest control and get source code for your project.  [Learn more about playground](./top-extensions-controls-playground.md).

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/DropDown_create_Playground" target="_blank">DropDown in the interactive controls playground</a>




 
<a name="related-info"></a>
### Related info

* <a href="https://www.figma.com/file/Bwn8rmUOYtnPRwA3JoQTBn/Azure-Portal-Toolkit?node-id=3071%3A379395" target="_blank">DropDown in Azure Portal Toolkit (Figma)</a>

* [Azure design guidance](http://aka.ms/portalfx/design)



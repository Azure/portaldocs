# TriStateCheckBox

 
<a name="basics"></a>
### Basics
A TriStateCheckBox can be checked, not checked or partially checked.  The TriStateCheckBox is typically used in a hierarchy to indicate that checked state of children items.


<!-- TODO get an IMAGE to embed here -->

<!-- TODO get an SAMPLE CODE to embed here -->

 
<a name="when-to-use"></a>
### When to use
Selectors let the user choose options from a set of existing values.  Choose the control best suited to your needs
* **CheckBox** - a choice to switch between 2 mutually exclusive options (on/off, enable/disable) or to indicate a subordinate setting (I agree to terms) when paired with another control
opt in to a single choice.  For example, use a single CheckBox for "I agree" instead of a different control where the user chooses between "I agree" and "I don't agree".
* **TriStateCheckBox** - can be checked, not checked or partially checked to indicate the checked state of children items in a hierarchy.
* **DropDown** - a single choice between a large number of options.  The DropDown control is also used on a smaller set of options where the default option is recommended for most users.  The DropDown control can also be used to make multiple selections from a set of options.
* **OptionsGroup** - No longer recommended  
* **RadioButtons** - a single choice between 2-7 equally weighted options 
* **LocationDropDown** - a single choice between Azure regions
* **SubscriptionDropDown** - a single choice between subscriptions for the current user
* **ResourceGroupDropDown** - a single choice between resource groups for the current user.  Also enables creating a new resource group..   



 
<a name="best-practices"></a>
### Best practices


<a name="best-practices-do"></a>
#### Do

* Use to indicate the checked state of children items

<a name="best-practices-don-t"></a>
#### Don&#39;t

* Don't use the TriStateCheckBox if there is no hierarchy, use the CheckBox instead.



 
<a name="developer-tips-and-tricks"></a>
### Developer tips and tricks



<a name="developer-tips-and-tricks-interactive-control-and-sample-source-code"></a>
#### Interactive control and sample source code
Go to the playground site to use the latest control and get source code for your project.  [Learn more about playground](./top-extensions-controls-playground.md).

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/TriStateCheckBox_create_Playground" target="_blank">TriStateCheckBox in the interactive controls playground</a>




 
<a name="related-info"></a>
### Related info

* <a href="https://www.figma.com/file/Bwn8rmUOYtnPRwA3JoQTBn/Azure-Portal-Toolkit?node-id=3023%3A49" target="_blank">TriStateCheckBox in Azure Portal Toolkit (Figma)</a>

* [Azure design guidance](http://aka.ms/portalfx/design)



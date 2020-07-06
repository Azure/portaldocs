# OptionsGroup

 
<a name="basics"></a>
### Basics
Do not use the OptionsGroup control.     


 
<a name="when-to-use"></a>
### When to use
Do not use the OptionsGroup control.  Use these controls instead

Selectors let the user choose options from a set of existing values.  Choose the control best suited to your needs
* **CheckBox** - a choice to switch between 2 mutually exclusive options (on/off, enable/disable) or to indicate a subordinate setting (I agree to terms) when paired with another control
opt in to a single choice.  For example, use a single CheckBox for "I agree" instead of a different control where the user chooses between "I agree" and "I don't agree".
* **TriStateCheckBox** - can be checked, not checked or partially checked to indicate the checked state of children items in a hierarchy.
* **DropDown** - a single choice between a large number of options.  The DropDown control is also used on a smaller set of options where the default option is recommended for most users.  The DropDown control can also be used to make multiple selections from a set of options.
* **OptionsGroup** - No longer recommended  
* **RadioButtons** - a single choice between 2-7 equally weighted options 
* **LocationDropDown** - a single choice between Azure regions
* **SubscriptionDropDown** - a single choice between subscriptions for the current user
* **ResourceGroupDropDown** - a single choice between resource groups for the current user.  Also enables creating a new resource group.  

For filtering, use the **Pill** control


 
<a name="best-practices"></a>
### Best practices
Do not use the OptionsGroup control

<a name="best-practices-do"></a>
#### Do

* Use a different control like CheckBox, DropDown or RadioButtons instead of this control  

<a name="best-practices-don-t"></a>
#### Don&#39;t

* Don't use the OptionsGroup control



 
<a name="developer-tips-and-tricks"></a>
### Developer tips and tricks



 
<a name="related-info"></a>
### Related info

* [Azure design guidance](http://aka.ms/portalfx/design)



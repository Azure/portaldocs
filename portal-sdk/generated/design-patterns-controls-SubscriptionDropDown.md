# SubscriptionDropDown

 
<a name="basics"></a>
### Basics
SubscriptionDropDown control provides a choice among a user's subscriptions in a DropDown control.


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
* **ResourceGroupDropDown** - a single choice between resource groups for the current user.  Also enables creating a new resource group.


 
<a name="best-practices"></a>
### Best practices
The SubscriptionDropDown should be used in resource creation and editing pages where the user is selecting a resource group.  The SubscriptionDropDown is typically used with the ResourceGroupDropDown.

<a name="best-practices-do"></a>
#### Do

* Use the SubscriptionDropDown in the **Project details** section of the **Basics** tab of the create a resource experience.

<!-- TODO need Do's -->

<a name="best-practices-don-t"></a>
#### Don&#39;t

* Don't write your own code for a selector among subscriptions, use this control

<!-- TODO need Don'ts -->



 
<a name="developer-tips-and-tricks"></a>
### Developer tips and tricks



 
<a name="related-info"></a>
### Related info

<!-- TODO link to Figma -->

* [Azure design guidance](http://aka.ms/portalfx/design)



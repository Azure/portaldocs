# RangeSlider

 
<a name="basics"></a>
### Basics
A RangeSlider is an element used to set a range of values. It provides a visual indication of the current selected rnage amidst the total range of content. 


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
A RangeSlider is a good choice when you know that users think of the selected range as a relative quantity, not numeric values in fields. For example, users may want to set the low and high acceptable scale settings within an overall minimum and maximum allowable values.

<a name="best-practices-do"></a>
#### Do

* Use a RangeSlider when you want your users to be able to set defined values (such as volume or brightness).
* Use step points (or tick marks) if you don’t want the Slider to allow arbitrary values between min and max.
* Use a Slider when the user would benefit from instant feedback on the effect of setting changes.
* Set the **infoBalloonContent** to concise, helpful text with a link to learn
* Use the **label** option to provide a helpful name for the control.

<a name="best-practices-don-t"></a>
#### Don&#39;t

* Don't use a RangeSlider when the options are not values.
* Don’t use a RangeSlider for binary settings.
* Don’t create a continuous RangeSlider if the range of values is large.
* Don’t use for a range of three values or less.


 
<a name="developer-tips-and-tricks"></a>
### Developer tips and tricks

* To display HTML in the infoBalloonContent use this code

infoBalloonContent: {
    htmlTemplate:"<b>Sample label</b><br>infoBalloonContent should explain concepts and <br>can include a link to learn more.<a>Learn 
    more about infoBalloon</a>",
    viewModel: {},
}



<a name="developer-tips-and-tricks-interactive-control-and-sample-source-code"></a>
#### Interactive control and sample source code
Go to the playground site to use the latest control and get source code for your project.  [Learn more about playground](./top-extensions-controls-playground.md).

The RangeSlider control offers different create methods and has the following entries in the interactive controls playground

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/RangeSlider_createSimpleRangeSlider_Playground" target="_blank">RangeSlider (SimpleRangeSlider)</a>

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/RangeSlider_createCustomRangeSlider_Playground" target="_blank">RangeSlider (CustomRangeSlider)</a>




 
<a name="related-info"></a>
### Related info

* <a href="https://www.figma.com/file/Bwn8rmUOYtnPRwA3JoQTBn/Azure-Portal-Toolkit?node-id=3492%3A393895" target="_blank">RangeSlider in Azure Portal Toolkit (Figma)</a> 

* [Azure design guidance](http://aka.ms/portalfx/design)



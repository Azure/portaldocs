# PricingControl

 
<a name="basics"></a>
### Basics
The PricingControl enables the user to see the current pricing information and navigate to a separate experience to change pricing options.


<!-- TODO get an IMAGE to embed here -->

<!-- TODO get an SAMPLE CODE to embed here -->

 
<a name="when-to-use"></a>
### When to use
Use the PricingControl so the user can understand the currently selected pricing option and navigate to a separate experience to compare and select among a set pricing options.


 
<a name="best-practices"></a>
### Best practices

<a name="best-practices-do"></a>
#### Do

* Use the PricingControl when your pricing selection is moderately complex and the user needs to compare multiple facets of pricing to make a good selection.
* Set the **infoBalloonContent** to concise, helpful text with a link to learn
* Use the **label** option to provide a helpful name for the control.
* Use the **validations** option to help the user input the correct text if a specific format is required


<a name="best-practices-don-t"></a>
#### Don&#39;t

* Don't use the PricingControl if the pricing selection is a simple choice among a few options.  Consider DropDown or RadioButtons for simple pricing choices.



 
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

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/PricingControl_create_Playground" target="_blank">PricingControl in the interactive controls playground</a>



 
<a name="related-info"></a>
### Related info

* <a href="https://www.figma.com/file/Bwn8rmUOYtnPRwA3JoQTBn/Azure-Portal-Toolkit?node-id=3492%3A393684" target="_blank">PricingControl in Azure Portal Toolkit (Figma)</a>

* [Azure design guidance](http://aka.ms/portalfx/design)



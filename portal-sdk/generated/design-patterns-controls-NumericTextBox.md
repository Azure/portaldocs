# NumericTextBox

 
<a name="basics"></a>
### Basics
The NumericTextBox enables the user to easily enter a number.


<!-- TODO get an IMAGE to embed here -->

<!-- TODO get an SAMPLE CODE to embed here -->

 
<a name="when-to-use"></a>
### When to use
Gathering text input is available via multiple controls, choose the one most suited to your needs
* **CopyableLabel** - multi-line text input with built-in support for infoBalloonContent and an easy way for user to copy value.
* **NumericTextBox** - restricts input to numbers only and built-in support for validations, infoBalloonContent and placeHolderText
* **PasswordBox** - text input that uses a * character instead of echoing user input with built-in support for validations, infoBalloonContent and placeHolderText.  Use PasswordBox for security sensitive fields.
* **TextBox** - single-line text input with built-in support for validations, infoBalloonContent and placeHolderText
* **MultilineTextBox** - multi-line text input with built-in support for validations, infoBalloonContent and placeHolderText




 
<a name="best-practices"></a>
### Best practices
Use the NumericTextBox when the field represents a number

<a name="best-practices-do"></a>
#### Do

* Set the **infoBalloonContent** to concise, helpful text with a link to learn
* Use **placeHolderText** for examples of field values
* Use the **validations** option to help the user input the correct text if a specific format is required
* Use the **label** option to provide a helpful name for the control.
* When part of a form, provide clear designations for which fields are required vs. optional.

<a name="best-practices-don-t"></a>
#### Don&#39;t

* Don't use the NumericTextBox for the user to enter values among a restricted set, like 10, 20, 30, etc.  Consider a DropDown, RangeSlider or Slider instead.



 
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

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/NumericTextBox_create_Playground" target="_blank">NumericTextBox in the interactive controls playground</a>




 
<a name="related-info"></a>
### Related info

<!-- TODO link to Figma -->

* [Azure design guidance](http://aka.ms/portalfx/design)



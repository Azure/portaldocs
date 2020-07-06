# CopyableLabel

 
<a name="basics"></a>
### Basics
The CopyableLabel control enables a multi-line text area where the user can view/enter text and provides an easy way for the user to copy the value of the text area. 


<!-- TODO get an IMAGE to embed here -->

<!-- TODO get an SAMPLE CODE to embed here -->

 
<a name="when-to-use"></a>
### When to use
Text input controls let the user enter text and offer optional validation of that text. Choose the one most suited to your needs
* **CopyableLabel** - multi-line text input with built-in support for infoBalloonContent and an easy way for user to copy value.
* **NumericTextBox** - restricts input to numbers only and built-in support for validations, infoBalloonContent and placeHolderText
* **PasswordBox** - text input that uses a * character instead of echoing user input with built-in support for validations, infoBalloonContent and placeHolderText.  Use PasswordBox for security sensitive fields.
* **TextBox** - single-line text input with built-in support for validations, infoBalloonContent and placeHolderText
* **MultilineTextBox** - multi-line text input with built-in support for validations, infoBalloonContent and placeHolderText



 
<a name="best-practices"></a>
### Best practices

<a name="best-practices-do"></a>
#### Do

* Use the CopyableLabel to enable the user to easily copy text values.
* Set the **infoBalloonContent** to concise, helpful text with a link to learn

<a name="best-practices-don-t"></a>
#### Don&#39;t

* Don't use the CopyableLabel if the field value requires validation, consider the MultilineTextBox instead
* Don't use the CopyableLabel if copying the text field value is not needed, consider the MultilineTextBox instead



 
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

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/CopyableLabel_create_Playground" target="_blank">CopyableLabel in the interactive controls playground</a>



 
<a name="related-info"></a>
### Related info

<!-- TODO link to Figma -->

* [Azure design guidance](http://aka.ms/portalfx/design)



# TextBlock

 
<a name="basics"></a>
### Basics
The TextBlock control enables you to easily display a block of read only text.


<!-- TODO get an IMAGE to embed here -->

<!-- TODO get an SAMPLE CODE to embed here -->

 
<a name="when-to-use"></a>
### When to use
Use when displaying read only text.

Displaying and gathering text is available via multiple controls, choose the one most suited to your needs
* **CopyableLabel** - multi-line text input with built-in support for infoBalloonContent and an easy way for user to copy value.
* **MultilineTextBox** - multi-line text input with built-in support for validations, infoBalloonContent and placeHolderText
* **NumericTextBox** - restricts input to numbers only and built-in support for validations, infoBalloonContent and placeHolderText
* **PasswordBox** - text input that uses a * character instead of echoing user input with built-in support for validations, infoBalloonContent and placeHolderText.  Use PasswordBox for security sensitive fields.
* **TextBlock** - Readonly control used to display text.
* **TextBox** - single-line text input with built-in support for validations, infoBalloonContent and placeHolderText



 
<a name="best-practices"></a>
### Best practices

<a name="best-practices-do"></a>
#### Do

* Provide enough space for the text to be displayed
* Set a max width of no greater than 800px so that text will wrap in a readable way.
* Use the **label** option to provide a helpful name for the control.
* When part of a form, provide clear designations for which fields are required vs. optional.


<a name="best-practices-don-t"></a>
#### Don&#39;t

* Don't use this control if the user may want to easily copy the text, consider the CopyableLabel instead.
* Don't use this if the text is of a known syntax that needs format markups, consider the Editor control to display structured text in a nice way.



 
<a name="developer-tips-and-tricks"></a>
### Developer tips and tricks



<a name="developer-tips-and-tricks-interactive-control-and-sample-source-code"></a>
#### Interactive control and sample source code
Go to the playground site to use the latest control and get source code for your project.  [Learn more about playground](./top-extensions-controls-playground.md).

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/TextBlock_create_Playground" target="_blank">TextBlock in the interactive controls playground</a>




 
<a name="related-info"></a>
### Related info

<!-- TODO link to Figma -->

* [Azure design guidance](http://aka.ms/portalfx/design)



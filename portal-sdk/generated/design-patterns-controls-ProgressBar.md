# ProgressBar

 
<a name="basics"></a>
### Basics
ProgressBar is used to show the completion status of an operation lasting more than 2 seconds. If the state of progress cannot be determined, use a Spinner instead. ProgressBar can appear in a new panel, a flyout, under the UI initiating the operation, or even replacing the initiating UI, as long as the UI can return if the operation is canceled or is stopped.

ProgressBar feature a bar showing total units to completion, and total units finished. The description of the operation appears above the bar, and the status in text appears below. The description should tell someone exactly what the operation is doing. Examples of formatting include:

[Object] is being [operation name], or
[Object] is being [operation name] to [destination name] or
[Object] is being [operation name] from [source name] to [destination name]
Status text is generally in units elapsed and total units. If the operation can be canceled, an “X” icon is used and should be placed in the upper right, aligned with the baseline of the operation name. When an error occurs, replace the status text with the error description using ms-fontColor-redDark.



<!-- TODO get an IMAGE to embed here -->

<!-- TODO get an SAMPLE CODE to embed here -->

 
<a name="when-to-use"></a>
### When to use
Real-world examples include copying files to a storage location, saving edits to a file, and more. Use units that are informative and relevant to give the best idea to users of how long the operation will take to complete. Avoid time units as they are rarely accurate enough to be trustworthy. Also, combine steps of a complex operation into one total bar to avoid “rewinding” the bar. Instead change the operation description to reflect the change if necessary. Bars moving backwards reduce confidence in the service.



 
<a name="best-practices"></a>
### Best practices


<a name="best-practices-do"></a>
#### Do

* Use a ProgressBar when the total units to completion is known
* Display operation description
* Show text above and/or below the bar
* Combine steps of a single operation into one bar

<a name="best-practices-don-t"></a>
#### Don&#39;t

* Use a ProgressBar when the total units to completion is indeterminate
* Use only a single word description
* Show text to the right or left of the bar
* Cause progress to “rewind” to show new steps


 
<a name="developer-tips-and-tricks"></a>
### Developer tips and tricks



<a name="developer-tips-and-tricks-interactive-control-and-sample-source-code"></a>
#### Interactive control and sample source code
Go to the playground site to use the latest control and get source code for your project.  [Learn more about playground](./top-extensions-controls-playground.md).

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/ProgressBar_create_Playground" target="_blank">ProgressBar in the interactive controls playground</a>



 
<a name="related-info"></a>
### Related info

<!-- TODO link to Figma -->

* [Azure design guidance](http://aka.ms/portalfx/design)



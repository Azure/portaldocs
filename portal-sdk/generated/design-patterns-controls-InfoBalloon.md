# InfoBalloon

 
<a name="basics"></a>
### Basics
The InfoBalloon control displays additional information when the user hovers or clicks on the control.  The hover behavior is typically called a tooltip and will appear on hover and disappear when the mouse is not over the control.  The click behavior is typically called a "call out" and will continue to display until the user clicks away.




<!-- TODO get an IMAGE to embed here -->

<!-- TODO get an SAMPLE CODE to embed here -->

 
<a name="when-to-use"></a>
### When to use
Use the InfoBalloon control to display additional info to the user.  Many user input controls have an **infoBalloonContent** option which enables the InfoBalloon behavior without an additional control.



 
<a name="best-practices"></a>
### Best practices

<a name="best-practices-do"></a>
#### Do

* Set the **infoBalloonContent** on input controls so that the built-in InfoBalloon behavior is available.  The built-in InfoBalloon click behavior enables the infoBalloonContent to display while the user interacts with the field. 
* Format InfoBalloon content and infoBalloonContent using HTML to decorate text, use bullets, use links, etc  There is guidance in the Azure Design Templates figma file on common InfoBalloon formatting.
* Provide concise, meaningful content in the InfoBalloon.
* Provide links in the InfoBalloon content if the user will want to learn more by going to an external site.


<a name="best-practices-don-t"></a>
#### Don&#39;t

* Don't just repeat the control label text in the InfoBalloon.  That is not helpful.



 
<a name="developer-tips-and-tricks"></a>
### Developer tips and tricks



<a name="developer-tips-and-tricks-interactive-control-and-sample-source-code"></a>
#### Interactive control and sample source code
Go to the playground site to use the latest control and get source code for your project.  [Learn more about playground](./top-extensions-controls-playground.md).

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/InfoBalloon_create_Playground" target="_blank">InfoBalloon in the interactive controls playground</a>



 
<a name="related-info"></a>
### Related info

* <a href="https://www.figma.com/file/Bwn8rmUOYtnPRwA3JoQTBn/Azure-Portal-Toolkit?node-id=3342%3A153" target="_blank">InfoBalloon in Azure Portal Toolkit (Figma)</a>
* [Azure design guidance](http://aka.ms/portalfx/design)



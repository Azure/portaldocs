# FrameControl

 
<a name="basics"></a>
### Basics
The FrameControl provides an alternative programming model for developing UI in Ibiza. This alternative gives the extension author full control over the DOM via an IFrame.

While this programming model results in maximum flexibility, FrameControls are not Ibiza Fx controls so extension developers are responsible for 

* Accessibility - Making the blade accessible, as specified in portalfx-accessibility.md
* Theming - The extension's UI should always reflect the user's currently selected theme, and should react dynamically when the user changes themes
* Consistent Look & feel - Designing a visual experience that is consistent with the rest of Ibiza


<!-- TODO get an IMAGE to embed here -->

<!-- TODO get an SAMPLE CODE to embed here -->

 
<a name="when-to-use"></a>
### When to use
Use FrameControl under the following conditions.

* An existing web experience needs to be migrated to Ibiza without being re-implemented
* An existing web experience needs to be hosted in many environments where Ibiza is just one of the hosts
* Developers want to implement user interactions and experiences that are not supported by Ibiza Framework components. For example, you need to build a very rich, custom UX that is not likely to be reused across services.
* When using AppBlade, developers are responsible for the following.



 
<a name="best-practices"></a>
### Best practices


<a name="best-practices-do"></a>
#### Do

* Try to use a built-in control when possible, even if it means a little more work up front.


<a name="best-practices-don-t"></a>
#### Don&#39;t

* Don't underestimate the cost of accessibility and alignment with portal look and feel



 
<a name="developer-tips-and-tricks"></a>
### Developer tips and tricks



<a name="developer-tips-and-tricks-interactive-control-and-sample-source-code"></a>
#### Interactive control and sample source code
Go to the playground site to use the latest control and get source code for your project.  [Learn more about playground](./top-extensions-controls-playground.md).

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/FrameControl_create_Playground" target="_blank">FrameControl in the interactive controls playground</a>



 
<a name="related-info"></a>
### Related info

<!-- TODO link to Figma -->

* [Azure design guidance](http://aka.ms/portalfx/design)



# Toolbar

 
<a name="basics"></a>
### Basics
Toolbar is a surface that houses commands that operate on the content of the window, panel, or parent region it resides above. Toolbars are one of the most visible and recognizable ways to surface commands, and can be an intuitive method for interacting with content on the page; however, if overloaded or poorly organized, they can be difficult to use and hide valuable commands from your user. Toolbars can also display a search box for finding content, hold simple commands as well as menus, or display the status of ongoing actions.


<!-- TODO get an IMAGE to embed here -->

<!-- TODO get an SAMPLE CODE to embed here -->

 
<a name="when-to-use"></a>
### When to use
Use the Toolbar to offer commands that operate on the context of the current window, panel or region below the toolbar.


 
<a name="best-practices"></a>
### Best practices
Commands should be sorted in order of importance, from left-to-right or right-to-left depending on the culture. Secondarily, organize commands in logical groupings for easier recall. Toolbars work best when they display no more than 5-7 commands. This helps users quickly find your most valuable features. If you need to show more commands, consider using the overflow menu. If you need to render status or viewing controls, these go on the right side of the Toolbar (or left side if in a left-to-right experience). Do not display more than 2-3 items on the right side as it will make the overall Toolbar difficult to parse.

All command items should have an icon and a label. Commands can render as labels only as well. In smaller widths, commands can just use icon only, but only for the most recognizable and frequently used commands. All other commands should go into an overflow where text labels can be shown.


<a name="best-practices-do"></a>
#### Do

* Sort commands in order of importance from left to right or right to left depending on the culture.
* Organize commands into logical groupings.
* Display no more than 5-7 commands.
* Use overflow to house less frequently-used commands.
* In small breakpoints, only have the most recognizable commands render as icon only.

<a name="best-practices-don-t"></a>
#### Don&#39;t

* Fill the command bar completely from left to right.
* Use icons only for commands in larger widths.
* Display more than 2-3 items on the right side of the bar (or left side in left to right experiences).


 
<a name="developer-tips-and-tricks"></a>
### Developer tips and tricks



<a name="developer-tips-and-tricks-interactive-control-and-sample-source-code"></a>
#### Interactive control and sample source code
Go to the playground site to use the latest control and get source code for your project.  [Learn more about playground](./top-extensions-controls-playground.md).

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/Toolbar_create_Playground" target="_blank">Toolbar in the interactive controls playground</a>



 
<a name="related-info"></a>
### Related info

<!-- TODO link to Figma -->

* [Azure design guidance](http://aka.ms/portalfx/design)



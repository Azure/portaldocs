<properties title="Dropdowns vs pickers" pageTitle="Dropdowns vs pickers" description="" authors="mattshel" />

<tags
    ms.service="portalfx"
    ms.workload="portalfx"
    ms.tgt_pltfrm="portalfx"
    ms.devlang="portalfx"
    ms.topic="get-started-article"
    ms.date="07/23/2015" 
    ms.author="mattshel"/>  

## Dropdowns vs. pickers ##

Using dropdowns can dramatically reduce the number of blades you need to use. "Blade fatigue" (too many blades open at once) is a common customer complaint.

Use dropdowns unless:

- The scenario needs to open a blade
- Multiple views are necessary (for example, if there's a toggle to switch from a list view to a map view)
- The data needs to be sortable
- The scenario requires multiple columns of data the user needs to make a decision
- Advanced filters are available to view data

Here's an example of pickers and dropdowns in the create flow. To choose an App service plan, pickers work best because the user needs name, location, and instance count to make a decision. On the other hand, location only requires that the user know the location name (so a dropdown works best).

![Dropdowns and pickers][dropdowns]

[dropdowns]: ../media/portalfx-ux-dropdowns-vs-pickers/dropdowns_pickers.jpg
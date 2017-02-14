## Menu Blade

Menu blade are rendered as a menu on the left side. Each item that is referenced from the menu is rendered using the same header than the menu, resulting in the two blades showing as one (similar to what resource menu blade does).

In summary:

* Menu blade is displayed as a menu (list of items), where each items opens a blade when clicked
* The menu blade is rendered to the left of the screen
* The blades opened from the menu share the chrome with the menu blade (so both blades look as one)

Menu blades are defined in PDL as shown below:

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V1/Blades/MenuBlade/MenuBlade.pdl", "section": "menuBlade#pdlDef"}

The code below shows how to define a menu blade view-model to open 4 different items:

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V1/Blades/MenuBlade/ViewModels/SampleMenuBlade.ts", "section": "menuBlade#ctor"}

A few things to notice in the code above:

* Menu can have different groups. In the code above there are two groups
* Each menu item opens a blade and all necessary parameters are provided
* Menu items can integrate with EditScope and ParameterProvider (shown in "createengine" item)
* At the end of the constructor, options for the menu are set. The option set in this case defines the id of the default item.

You can see MenuBlade in action in our SampleExtension [here](https://df.onecloud.azure-test.net/?SamplesExtension=true#blade/SamplesExtension/SampleMenuBlade/bladeWithSummary)
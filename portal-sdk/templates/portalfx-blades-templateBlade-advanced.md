<properties title="" pageTitle="Blades" description="" authors="adamabdelhamed" />

### TemplateBlade Advanced Options

### Deep linking

"Deep linking" is the feature where the portal URL is updated when a blade is opened (giving the user a URL to directly navigate to the new blade).
By design only certain blades are deep linkable. Blades that aren't deep linkable are those that can't be opened independent of some parent 
blade or part, like blades that return values to their caller. Think of these non-deep linkable blades as web pages in the middle of an website's
check-out experience.

One of the easiest ways to make your blade deep linkable is to mark your TemplateBlade as pinnable. See more information about pinning [here](#pinning-your-blade).

### Showing a shield / loading status in your blade

Sometimes you may want to prevent interaction with your blade while initializing it. In those cases, you can add a shield. The shield can be fully transparent or opaque. In all cases, a loading indicator UX is displayed in the blade. 

The code snippet below shows an extreme example where a filter is applied on a timer and it changes from opaque to transparent).

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/Blades/Template/ViewModels/TemplateBladeViewModels.ts", "section": "templateBlade#shield"}

### Showing a notification in your blade

Blades can display a status bar at their top that contains both text and a background color that can be used to convey information and status to users. For example, when validation fails in a form a red bar with a message can be displayed at the top of the blade.

This area is clickable and can either open a new blade or an external url.

This capability is exposed through the **statusBar** member in the Blade base class (using `this.statusBar(myStatus)` in your blade view-model).

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/Blades/ContentState/ViewModels/ContentStateViewModels.ts", "section": "templateBlade#contentState"}

<a name="pinning-your-blade"></a>
### Pinning your blade

You can mark your blades as able to be pinned to the dashboard by setting `Pinnable="true"` in the TemplateBlade's PDL definition.

By default blades are pinned as button parts to the dashboard.

If you desire to provide a different part represention you need to indicate that in the PDL definition of your blade.

### Storing settings for your blade

You can store settings associated with a blade. Those settings need to be declared both in the PDL definition of your blade and in the view-model.

The code below shows how to define the settings in PDL using the `TemplateBlade.Settings` element.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/Blades/Template/Template.pdl", "section": "templateBlade#settingsPDL"}

Once the settings are declared, you need to define them in your view-model too.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/Blades/Template/ViewModels/TemplateBladeViewModels.ts", "section": "templateBlade#settingsVMDef"}

The settings are retrieved through the blade container.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/Blades/Template/ViewModels/TemplateBladeViewModels.ts", "section": "templateBlade#settingsVMUse"}

The settings are also passed to onInputsSet.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/Blades/Template/ViewModels/TemplateBladeViewModels.ts", "section": "templateBlade#settingsVMois"}

### Showing Unauthorized UI in your blade

You can set your blade to Unauthorized UI using the **unauthorized** member of the blade container.

The code below does this statically, but it can also be done dynamically (e.g. based on a condition after data is loaded).

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/Blades/Unauthorized/ViewModels/UnauthorizedBladeViewModel.ts", "section": "templateBlade#Unauthorized"}

### Showing Notice UI dynamically in your blade

You can set your blade to Notice UI using **enableNotice** member of the blade container.

This can be done statically (e.g. in the constructor) or dynamically. In the example below, the blade is set to Notice UI if the **id** input parameter has a given value.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/Blades/DynamicNotice/ViewModels/DynamicNoticeViewModels.ts", "section": "templateBlade#dynamicNotice"}
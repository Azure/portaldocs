{"gitdown": "contents"}

## Parts (a.k.a. tiles) 

Parts (a.k.a. tiles) are a framework feature that let you integrate your UI on dashboards.  Parts used to be more prevalent on blades, but this is an older pattern.  If you are building a part for use on a blade then please reconsider.  

**Almost all blades in the system should be built using TemplateBlades which do not contain parts.**

The following sections covers the following topics.  

- When to, and when not to build parts
- How to use one of the built in parts to expose your data in pre-built views
- How to create a custom part where you define the look and feel as well as the data loading
- How to integrate your part into the part gallery (a.k.a. tile gallery)
- How to define the sizing behavior of your parts
- How to leverage per user part settings
- More advanced parts topics

### When to, and when not to build parts

The Ibiza teaam has changed it's guidance on how to expose parts based on user feedback.  The team has also built new features to support the user feedback.   

Ibiza used to be full of blades that contained customizable parts (a.k.a. tiles) that served as the main way for users to navigate the UI. 
UI built that way was difficult to navigate, caused excessive navigation, caused excessive horizontal scrolling, and had a lot of performance overheard.

The newer experiences rely on more traditional menu blades to expose features to users, combined with TemplateBlades to expose content.  

There are still many cases where you want to expose rich monitoring, or at a glance data. To support those cases we now support multiple, shareable dashboards (formerly the single start board).

If you are building parts then __it's highly recommended that you build them for use on dashboards, rather than on blades__.

### How to use one of the built in parts to expose your data in pre-built views

Ibiza provides several built in parts (a.k.a. intrinsic parts) that let you create a part that has a pre-defined view and interaction pattern, but lets you plug in our own data.

Here is an example of a very simple part, the __Button__ part.  It is simply an icon and a label that navigates to a blade when the user clicks it.

__You can see this code working in a [live sample here](http://aka.ms/portalfx/samples#blade/SamplesExtension/ButtonPartIntrinsicInstructions/selectedItem/ButtonPartIntrinsicInstructions/selectedValue/ButtonPartIntrinsicInstructions).__

To use a button part you first declare the part in the global __`<Definition>`__ section of your PDL (definition tag not shown).
{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V1/Parts/Intrinsic/ButtonPart/ButtonPartIntrinsicInstructions.pdl", "section": "parts#BasicPartExampleForDocs"}

The matching view model lets you plug data into the part.  For this simple part, the data is just the label and icon, but for more data oriented parts this can be data gathered from a backend, like a resource provider.
{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V1/Parts/Intrinsic/ViewModels/ButtonPartViewModel.ts", "section": "parts#BasicPartExampleViewModel"}

More info: [More about built in parts](portalfx-parts-intrinsic.md)
Related: [Integrate your part with the tile gallery](parts-a-k-a-tiles-how-to-integrate-your-part-into-the-part-gallery)

### How to create a custom part where you define the look and feel as well as the data loading

Unlike the built in parts discussed in the previous section, custom parts let you define the html template that will be bound to your view model. Your templates can (and in many cases should) refer to the [controls](portalfx-controls.md) that are provided by the framework.

__You can see this code working in a [live sample here](http://aka.ms/portalfx/samples#blade/SamplesExtension/SDKMenuBlade/custompart).__

To create a custom part you first declare the part in the global __`<Definition>`__ section of your PDL (definition tag not shown).
{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V1/Parts/Custom/CustomParts.pdl", "section": "Parts#CustomPartsPDLDoc"}

The pdl points to this html template.
{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V1/Parts/Custom/Templates/ExampleCustomPart.html", "section": "Parts#CustomPartTemplateDoc"}

That template will be bound (using [knockout](http://knockoutjs.com/)) to the view model below, which is also referred to in the pdl.
{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V1/Parts/Custom/ViewModels/ExampleCustomPartViewModel.ts", "section": "parts#CustomPartViewModelDoc"}

Related: [Integrate your part with the tile gallery](#parts-a-k-a-tiles-how-to-integrate-your-part-into-the-part-gallery)

### How to integrate your part into the part gallery

The primary way that users add tiles to their dashboards is via the part gallery (a.k.a. tile gallery).  The tile gallery appears when:

- Users click the __edit dashboard__ command, or
- Users rearrange or resize a part on the dashboard

To register your part with the part gallery, you need to add the __PartGalleryInfo__ tag inside of your `<Part>` or `<CustomPart>` tag.
{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V1/Parts/TileGallery/TileGallery.pdl", "section": "parts#PartGalleryDocsPDL"}

Title, Category, and Thumbnail are pretty self explanatory.  The AutoConfigSelectablePath property is a little more nuanced. Some tile experiences require the user to configure their part as soon as it is dropped from the tile gallery.  If your part has this requirement then the __AutoConfigSelectablePath__ property lets you do that.  This is the path to a selectable that lives within your view model.  This selectable will be set to true by the framework as soon as the part is dropped on a dashboard.  You can configure your selectable to open a context blade for configuration.  Here's an example of how you would configure such a selectable.
{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V1/Parts/TileGallery/ViewModels/GeneralGalleryPart.ts", "section": "parts#PartGalleryConfigOnDropDoc"}

If your tile is associated with an Ibiza asset (like an ARM resource) then it should be associated with an asset type and have a single input definition whose IsAssetId property is 'True'.  If this is not the case then the part will appear in the General category of the part gallery.
 
### How to define the sizing behavior of your parts

This section is based on [this live sample](http://aka.ms/portalfx/samples#blade/SamplesExtension/SDKMenuBlade/partsizes).

You have a lot of flexibility when it comes to sizing your tiles. It's prety much all covered in the PDL within the `<CustomPart>` tag.

This part supports only a single, standard size.  In this case, large.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V1/Parts/PartSizes/PartSizes.pdl", "section": "parts#BasicPartThatSupportsSingleStandardSize"}

This part supports multiple, standard sizes.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V1/Parts/PartSizes/PartSizes.pdl", "section": "parts#PartThatSupportsMultipleStandardSizes"}

This part is defaulted to an arbitrary size, and can be resized by the user.  The framework will automatically add a drag handle to this part because of the value `ResizeMode="User"`.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V1/Parts/PartSizes/PartSizes.pdl", "section": "parts#PartThatSupportsArbitrarySizeAndUserResize"}

This part is defaulted to an arbitrary size, and can be resized programatically.  

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V1/Parts/PartSizes/PartSizes.pdl", "section": "parts#PartThatSupportsArbitrarySizeAndProgrammaticResize"}

This next snippet shows how to programatically resize your part from within your part view model.  The arguments are specified in grid units, not pixels.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V1/Parts/PartSizes/ViewModels/PartSizesViewModels.ts", "section": "parts#ProgramatticResizeDoc"}

### How to leverage per user part settings

Part implementation can read and write settings that get saved whenever the user saves their dashboard.  Private dashboards live in the Ibiza user settings service.  Shared dashboards are stored in ARM as Azure resources inside of the MS.Portal resource provider.

The dashboard gets saved as a JSON document that contains the list of parts on the dashboard, their sizes, positions, and settings.  It also contains dashboard level settings like the shared time range that many monitoring charts use.

There is a sample that covers this end to end at __SamplesExtension\Extension\Client\Parts\TileGallery__.  It is not a live sample that you can browse in dogfood, but the complete samples extension code comes bundled with the Ibiza SDK.

You can use the `<CustomPart.PartSettings>` tag to declare your settings in PDL

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V1/Parts/TileGallery/TileGallery.pdl", "section": "parts#PartSettingsDocs"}

Here is the TypeScript portion of the code that reads and writes samples.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V1/Parts/TileGallery/ViewModels/GeneralGalleryPart.ts", "section": "parts#TileGalleryWithNewConfigurationPattern"}

### No data message

Sometimes you may need to display a part for which no data is available. For example, before a user has enabled deployments, you might want to show a teaser 'deployment history' part containing sample data. To support this, part `container` objects now have a new property: `noDataMessage`.

If you populate the part with sample data and set `noDataMessage` to a nonempty string, for example:

```ts
container.noDataMessage("Enable deployments to see your history");
```

At this point the part will become grayed out, non-interactive, and will have the message overlaid onto it. Set the `noDataMessage` value back to `null` if you later need to remove the message. This feature should *only* be used when a part is currently not applicable because no data is available (to help the user realize the feature exists). If instead you are simply trying to disable a part while data loads, please continue to return a promise from `onInputsSet` or use the `container.operations` queue directly.

### Advanced Parts Topics

- [Part versioning](portalfx-parts-versioning.md)
- [Retiring a part](portalfx-parts-how-to-retire.md)
- [How to remove a part from an unlocked blade](portalfx-parts-how-to-remove-from-blade.md)
- [Using the reveal content pattern for better performance](portalfx-parts-revealContent.md)
- [Handling part errors](portalfx-parts-errors.md)
- [Handling assets that no longer exist](#parts-a-k-a-tiles-handling-assets-that-no-longer-exist)

 {"gitdown": "include-file", "file": "../templates/portalfx-parts-versioning.md"}
 {"gitdown": "include-file", "file": "../templates/portalfx-parts-how-to-retire.md"}
 {"gitdown": "include-file", "file": "../templates/portalfx-parts-how-to-remove-from-blade.md"}
 {"gitdown": "include-file", "file": "../templates/portalfx-parts-revealContent.md"}
 {"gitdown": "include-file", "file": "../templates/portalfx-parts-errors.md"}
 {"gitdown": "include-file", "file": "../templates/portalfx-parts-assets-dont-exist.md"}

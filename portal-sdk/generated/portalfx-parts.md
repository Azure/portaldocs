* [Parts (a.k.a. tiles)](#parts-a-k-a-tiles)
    * [When to, and when not to build parts](#parts-a-k-a-tiles-when-to-and-when-not-to-build-parts)
    * [How to use one of the built in parts to expose your data in pre-built views](#parts-a-k-a-tiles-how-to-use-one-of-the-built-in-parts-to-expose-your-data-in-pre-built-views)
    * [How to create a custom part where you define the look and feel as well as the data loading](#parts-a-k-a-tiles-how-to-create-a-custom-part-where-you-define-the-look-and-feel-as-well-as-the-data-loading)
    * [How to integrate your part into the part gallery](#parts-a-k-a-tiles-how-to-integrate-your-part-into-the-part-gallery)
    * [How to define the sizing behavior of your parts](#parts-a-k-a-tiles-how-to-define-the-sizing-behavior-of-your-parts)
    * [How to leverage per user part settings](#parts-a-k-a-tiles-how-to-leverage-per-user-part-settings)
    * [No data message](#parts-a-k-a-tiles-no-data-message)
    * [Advanced Parts Topics](#parts-a-k-a-tiles-advanced-parts-topics)
    * [Versioning](#parts-a-k-a-tiles-versioning)
    * [Walkthrough](#parts-a-k-a-tiles-walkthrough)
    * [Permanently Retire a part](#parts-a-k-a-tiles-permanently-retire-a-part)
    * [Removig a part from a blade's default layout](#parts-a-k-a-tiles-removig-a-part-from-a-blade-s-default-layout)
    * [Improving Part responsiveness](#parts-a-k-a-tiles-improving-part-responsiveness)
    * [Handling part errors](#parts-a-k-a-tiles-handling-part-errors)
    * [Best practice for handling part errors](#parts-a-k-a-tiles-best-practice-for-handling-part-errors)
    * [Handling assets that no longer exist](#parts-a-k-a-tiles-handling-assets-that-no-longer-exist)


<a name="parts-a-k-a-tiles"></a>
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

<a name="parts-a-k-a-tiles-when-to-and-when-not-to-build-parts"></a>
### When to, and when not to build parts

The Ibiza teaam has changed it's guidance on how to expose parts based on user feedback.  The team has also built new features to support the user feedback.   

Ibiza used to be full of blades that contained customizable parts (a.k.a. tiles) that served as the main way for users to navigate the UI. 
UI built that way was difficult to navigate, caused excessive navigation, caused excessive horizontal scrolling, and had a lot of performance overheard.

The newer experiences rely on more traditional menu blades to expose features to users, combined with TemplateBlades to expose content.  

There are still many cases where you want to expose rich monitoring, or at a glance data. To support those cases we now support multiple, shareable dashboards (formerly the single start board).

If you are building parts then __it's highly recommended that you build them for use on dashboards, rather than on blades__.

<a name="parts-a-k-a-tiles-how-to-use-one-of-the-built-in-parts-to-expose-your-data-in-pre-built-views"></a>
### How to use one of the built in parts to expose your data in pre-built views

Ibiza provides several built in parts (a.k.a. intrinsic parts) that let you create a part that has a pre-defined view and interaction pattern, but lets you plug in our own data.

Here is an example of a very simple part, the __Button__ part.  It is simply an icon and a label that navigates to a blade when the user clicks it.

__You can see this code working in a [live sample here](http://aka.ms/portalfx/samples#blade/SamplesExtension/ButtonPartIntrinsicInstructions/selectedItem/ButtonPartIntrinsicInstructions/selectedValue/ButtonPartIntrinsicInstructions).__

To use a button part you first declare the part in the global __`<Definition>`__ section of your PDL (definition tag not shown).
```xml

<!-- Name - Give your part a unique name -->
<!-- PartKind - This is where you declare that you're using a built in part type -->
<!-- ViewModel A pointer to the view model type that will customize the view (label, icon, etc) -->
<!-- InitialSize - The initial size of the part, in this case 2 X 1 (Small) -->
<Part Name="ButtonPartSmall" 
      PartKind="Button"
      ViewModel="{ViewModel Name=ButtonPartViewModel, Module=./Intrinsic/ViewModels/ButtonPartViewModel}"
      InitialSize="Small" />

```

The matching view model lets you plug data into the part.  For this simple part, the data is just the label and icon, but for more data oriented parts this can be data gathered from a backend, like a resource provider.
```typescript

/**
* This sample uses the base class implementation. You can also implement the
* interface MsPortalFx.ViewModels.ButtonPartContract.
*/
export class ButtonPartViewModel extends MsPortalFx.ViewModels.ButtonPart {

   /**
    * Initialize the part.
    */
   constructor(container: MsPortalFx.ViewModels.PartContainerContract, initialState: any, dataContext: PartsArea.DataContext) {
       super();
       this.title(ClientResources.AssetTypeNames.Robot.singular);
       this.shortTitle(ClientResources.AssetTypeNames.Robot.singular);
       this.description(ClientResources.robotDescription);
       this.icon(SvgLogo.Content.SamplesExtension.Images.robot);

       container.assetName(ClientResources.robotManafacturerBotsAreUs);
   }
}

```

More info: [More about built in parts](portalfx-parts-intrinsic.md)
Related: [Integrate your part with the tile gallery](parts-a-k-a-tiles-how-to-integrate-your-part-into-the-part-gallery)

<a name="parts-a-k-a-tiles-how-to-create-a-custom-part-where-you-define-the-look-and-feel-as-well-as-the-data-loading"></a>
### How to create a custom part where you define the look and feel as well as the data loading

Unlike the built in parts discussed in the previous section, custom parts let you define the html template that will be bound to your view model. Your templates can (and in many cases should) refer to the [controls](portalfx-controls.md) that are provided by the framework.

__You can see this code working in a [live sample here](http://aka.ms/portalfx/samples#blade/SamplesExtension/SDKMenuBlade/custompart).__

To create a custom part you first declare the part in the global __`<Definition>`__ section of your PDL (definition tag not shown).
```xml

<CustomPart Name="ExampleCustomPart"
            ViewModel="{ViewModel Name=ExampleCustomPartViewModel, Module=./Custom/ViewModels/ExampleCustomPartViewModel}"
            Template="{Html Source='Templates\\ExampleCustomPart.html'}"
            InitialSize="Large">
  <StyleSheet Source="{Css Source='Styles\\ExampleStyles.css'}" />
</CustomPart>

```

The pdl points to this html template.
```xml

<h3>This is a custom part</h3>

<p>
Number of clicks: <strong data-bind="text: numberOfClicks"></strong>
</p>

<div data-bind="visible: allowMoreClicks">
<button data-bind="click: increaseClickCount">Click me</button>
</div>

<div class="ext-too-many-clicks-box" data-bind="visible: !allowMoreClicks()">
That's too many clicks!
<button data-bind="click: resetClickCount">Reset</button>
</div>

<ul data-bind="foreach: myButtons">
<li>    
    <button data-bind="text: displayName, click: $parent.buttonClickHandler"></button>
    Number of clicks: <strong data-bind="text: clicked"></strong>
</li>
</ul>

```

That template will be bound (using [knockout](http://knockoutjs.com/)) to the view model below, which is also referred to in the pdl.
```typescript

/**
* Example view model for a custom part
*/
export class ExampleCustomPartViewModel {

   // Public properties bound to the UI in the part's template
   public numberOfClicks = ko.observable(0);
   public allowMoreClicks = ko.pureComputed(() => {
       return this.numberOfClicks() < 3;
   });

   /**
    * Constructs an instance of the custom part view model.
    */
   constructor(container: MsPortalFx.ViewModels.PartContainerContract, initialState: any, dataContext: PartsArea.DataContext) {
   }

   public increaseClickCount(): void {
       var currentCount = this.numberOfClicks();
       this.numberOfClicks(currentCount + 1);
   }

   public resetClickCount(): void {
       this.numberOfClicks(0);
   }

   public myButtons = ko.observableArray([
       {
           displayName: ko.observable("First button"),
           clicked: ko.observable(0)
       },
       {
           displayName: ko.observable("Second button"),
           clicked: ko.observable(0)
       }
   ]);

   public buttonClickHandler = function () {
       this.clicked(this.clicked() + 1);
   };
}

```

Related: [Integrate your part with the tile gallery](#parts-a-k-a-tiles-how-to-integrate-your-part-into-the-part-gallery)

<a name="parts-a-k-a-tiles-how-to-integrate-your-part-into-the-part-gallery"></a>
### How to integrate your part into the part gallery

The primary way that users add tiles to their dashboards is via the part gallery (a.k.a. tile gallery).  The tile gallery appears when:

- Users click the __edit dashboard__ command, or
- Users rearrange or resize a part on the dashboard

To register your part with the part gallery, you need to add the __PartGalleryInfo__ tag inside of your `<Part>` or `<CustomPart>` tag.
```xml

<PartGalleryInfo
  Title="{Resource generalGalleryPartTitle, Module=ClientResources}"
  Category="{Resource partGalleryCategorySample, Module=ClientResources}"
  Thumbnail="MsPortalFx.Base.Images.Favorite()"
  AutoConfigSelectablePath="configOnDropSelectable"/>

```

Title, Category, and Thumbnail are pretty self explanatory.  The AutoConfigSelectablePath property is a little more nuanced. Some tile experiences require the user to configure their part as soon as it is dropped from the tile gallery.  If your part has this requirement then the __AutoConfigSelectablePath__ property lets you do that.  This is the path to a selectable that lives within your view model.  This selectable will be set to true by the framework as soon as the part is dropped on a dashboard.  You can configure your selectable to open a context blade for configuration.  Here's an example of how you would configure such a selectable.
```typescript

// Configure the HotSpot's Selectable so it will be implicitly activated when the user drops this Part on a Dashboard.
const bladeSelection: FxViewModels.DynamicBladeSelection = {
    detailBlade: ExtensionDefinition.BladeNames.pdlGeneralGalleryPartConfigurationBlade,
    detailBladeInputs: {}
};
const hotSpotSelectable = new FxViewModels.Selectable({
    selectedValue: bladeSelection
});
hotSpotSelectable.getDefaultSelection = () => {
    return Q(bladeSelection);
};
this.configureHotSpot.selectable = hotSpotSelectable;
this.configOnDropSelectable = hotSpotSelectable;
    
// Create a ParameterCollector that will open the configure Blade to modify 'configuration' -- this Part's Configuration.
const configuration = container.activateConfiguration<Inputs, Def.SettingsContract>();
const collector = new FxViewModels.ParameterCollector<PartConfiguration>(container, {
    selectable: hotSpotSelectable,

    // The Parts Configuration values are sent to the Provider Blade to be edited by the user.
    supplyInitialData: configuration.getValues.bind(configuration),

    // The edited Configuration values are returned from the Provider Blade and updated in this Part.
    // Any edits will cause 'onInputsSet' to be called again, since this is the method where the Part receives a new, consistent
    // set of inputs/settings.
    receiveResult: configuration.updateValues.bind(configuration)
});

// This Selectable must be dynamically registered due to a PDL compiler bug that rejects any <BladeAction> that opens a
// <ContextBlade> from a HotSpot.
container.registerSelectable(
    container,
    "GeneralGalleryPartConfigSelectable",
    hotSpotSelectable,
    {
        openInContextPane: true,
        parameterCollector: collector
    });
  
```

If your tile is associated with an Ibiza asset (like an ARM resource) then it should be associated with an asset type and have a single input definition whose IsAssetId property is 'True'.  If this is not the case then the part will appear in the General category of the part gallery.
 
<a name="parts-a-k-a-tiles-how-to-define-the-sizing-behavior-of-your-parts"></a>
### How to define the sizing behavior of your parts

This section is based on [this live sample](http://aka.ms/portalfx/samples#blade/SamplesExtension/SDKMenuBlade/partsizes).

You have a lot of flexibility when it comes to sizing your tiles. It's prety much all covered in the PDL within the `<CustomPart>` tag.

This part supports only a single, standard size.  In this case, large.

```xml

<CustomPart Name="LargePart"
            ViewModel="{ViewModel Name=PartSizesLargePartViewModel, Module=./PartSizes/ViewModels/PartSizesViewModels}"
            Template="{Html Source='Templates\\SizeAwarePart.html'}"
            InitialSize="Large">

```

This part supports multiple, standard sizes.

```xml

<CustomPart Name="MiniPart"
            ViewModel="{ViewModel Name=PartSizesMiniPartViewModel, Module=./PartSizes/ViewModels/PartSizesViewModels}"
            Template="{Html Source='Templates\\SizeAwarePart.html'}"
            InitialSize="Mini">
  <CustomPart.SupportedSizes>
    <PartSize>Mini</PartSize>
    <PartSize>Normal</PartSize>
  </CustomPart.SupportedSizes>
</CustomPart>

```

This part is defaulted to an arbitrary size, and can be resized by the user.  The framework will automatically add a drag handle to this part because of the value `ResizeMode="User"`.

```xml

<CustomPart Name="CustomSizeUserResizePart"
            ViewModel="{ViewModel Name=PartSizesCustomSizeUserResizePartViewModel, Module=./PartSizes/ViewModels/PartSizesViewModels}"
            Template="{Html Source='Templates\\SizeAwarePart.html'}"
            InitialSize="Custom"
            InitialWidth="5"
            InitialHeight="2"
            ResizeMode="User">
</CustomPart>

```

This part is defaulted to an arbitrary size, and can be resized programatically.  

```xml

<CustomPart Name="CustomSizeProgrammaticResizePart"
            ViewModel="{ViewModel Name=PartSizesCustomSizeProgrammaticResizePartViewModel, Module=./PartSizes/ViewModels/PartSizesViewModels}"
            Template="{Html Source='Templates\\SizeAwareResizablePart.html'}"
            InitialSize="Custom"
            InitialWidth="6"
            InitialHeight="3"
            ResizeMode="Programmatic">
  <CustomPart.SupportedSizes>
    <PartSize>Tall</PartSize>
    <PartSize>Mini</PartSize>
    <PartSize>Wide</PartSize>
    <PartSize>Large</PartSize>
  </CustomPart.SupportedSizes>
</CustomPart>

```

This next snippet shows how to programatically resize your part from within your part view model.  The arguments are specified in grid units, not pixels.

```typescript

this.resizeToButton1.click = () => {
    container.resizeTo(resizeA.width, resizeA.height);
};

```

<a name="parts-a-k-a-tiles-how-to-leverage-per-user-part-settings"></a>
### How to leverage per user part settings

Part implementation can read and write settings that get saved whenever the user saves their dashboard.  Private dashboards live in the Ibiza user settings service.  Shared dashboards are stored in ARM as Azure resources inside of the MS.Portal resource provider.

The dashboard gets saved as a JSON document that contains the list of parts on the dashboard, their sizes, positions, and settings.  It also contains dashboard level settings like the shared time range that many monitoring charts use.

There is a sample that covers this end to end at __SamplesExtension\Extension\Client\Parts\TileGallery__.  It is not a live sample that you can browse in dogfood, but the complete samples extension code comes bundled with the Ibiza SDK.

You can use the `<CustomPart.PartSettings>` tag to declare your settings in PDL

```xml

<CustomPart.Settings>
  <Setting Property="colorSettingValue" />
  <Setting Property="fontSettingValue" />
</CustomPart.Settings>

```

Here is the TypeScript portion of the code that reads and writes samples.

```typescript

import ClientResources = require("ClientResources");
import PartsArea = require("../../PartsArea");
import ExtensionDefinition = require("../../../../_generated/ExtensionDefinition");
import Def = ExtensionDefinition.ViewModels.V1$Parts.GeneralGalleryPart;

export = Main;

module Main {
"use strict";

import FxViewModels = MsPortalFx.ViewModels;
import PartContainerContract = FxViewModels.PartContainerContract;
import FxConfiguration = MsPortalFx.Composition.Configuration;
import TimeUnit = FxConfiguration.TimeUnit;

// We have to explicitly define our Inputs contract here rather than use Def.InputsContract since there is a PDL
// compiler bug where <Part.InputDefinitions> are not represented on Def.InputsContract.
export interface Inputs {
    timeRange: FxConfiguration.TimeRange,
    otherParameter: string
};

// We have to use this over Def.Settings because Def.Settings includes an old 'content' property that is no longer
// important to the Part Configuration design re: Part Settings.
export type Settings = Def.Settings$content$0;

// This will be used by the GeneralGalleryPartConfigurationPart too.
export type PartConfiguration = FxConfiguration.Part.ValuesWithMetadata<Inputs, Settings>;

export enum BackgroundColor {
    Default,
    Blue,
    Green,
    Yellow
}

export enum FontStyle {
    Default,
    Muted,
    AllCaps,
}

export class GeneralGalleryPart implements Def.Contract {
    public configOnDropSelectable: FxViewModels.Selectable<FxViewModels.DynamicBladeSelection>;
    public configureHotSpot: FxViewModels.Controls.HotSpot.ViewModel;

    public timeRange = ko.observable<string>();
    public otherParameter = ko.observable<string>();
    public css: KnockoutObservableBase<any>;  // For the 'css' binding in the corresponding HTML template.
    public location: string;

    // These are required by the portal presently.  Re: Part Settings, the Part below works exclusively in terms of
    // 'configuration.updateValues' to update settings values and 'onInputsSet(..., settings)' to receive settings values.
    public colorSettingValue = ko.observable<BackgroundColor>();
    public fontSettingValue = ko.observable<FontStyle>();

    // These store the raw color and font style values supplied to the Part.
    private _colorSetting = ko.observable<BackgroundColor>();
    private _fontSetting = ko.observable<FontStyle>();

    constructor(container: PartContainerContract, initialState: any, context: PartsArea.DataContext) {

        container.partTitle(ClientResources.generalGalleryPartTitle);

        // Create the HotSpot control that the user will click.
        this.configureHotSpot = new FxViewModels.Controls.HotSpot.ViewModel(container);
        this.configureHotSpot.clickableDuringCustomize = true;
        //parts#PartGalleryConfigOnDropDoc
        // Configure the HotSpot's Selectable so it will be implicitly activated when the user drops this Part on a Dashboard.
        const bladeSelection: FxViewModels.DynamicBladeSelection = {
            detailBlade: ExtensionDefinition.BladeNames.pdlGeneralGalleryPartConfigurationBlade,
            detailBladeInputs: {}
        };
        const hotSpotSelectable = new FxViewModels.Selectable({
            selectedValue: bladeSelection
        });
        hotSpotSelectable.getDefaultSelection = () => {
            return Q(bladeSelection);
        };
        this.configureHotSpot.selectable = hotSpotSelectable;
        this.configOnDropSelectable = hotSpotSelectable;
            
        // Create a ParameterCollector that will open the configure Blade to modify 'configuration' -- this Part's Configuration.
        const configuration = container.activateConfiguration<Inputs, Def.SettingsContract>();
        const collector = new FxViewModels.ParameterCollector<PartConfiguration>(container, {
            selectable: hotSpotSelectable,

            // The Parts Configuration values are sent to the Provider Blade to be edited by the user.
            supplyInitialData: configuration.getValues.bind(configuration),

            // The edited Configuration values are returned from the Provider Blade and updated in this Part.
            // Any edits will cause 'onInputsSet' to be called again, since this is the method where the Part receives a new, consistent
            // set of inputs/settings.
            receiveResult: configuration.updateValues.bind(configuration)
        });

        // This Selectable must be dynamically registered due to a PDL compiler bug that rejects any <BladeAction> that opens a
        // <ContextBlade> from a HotSpot.
        container.registerSelectable(
            container,
            "GeneralGalleryPartConfigSelectable",
            hotSpotSelectable,
            {
                openInContextPane: true,
                parameterCollector: collector
            });
          //parts#PartGalleryConfigOnDropDoc
        // For fringe cases, this illustrates how the Part can understand whether it is located on a Dashboard or a Blade.
        // Importantly, the Part behavior shouldn't change between Dashboard and Blade.
        this.location = container.location === FxViewModels.PartLocation.Dashboard ?
            ClientResources.generalGalleryPartDashboardLocation :
            ClientResources.generalGalleryPartBladeLocation;

        // Data-driven styling for the Part.
        this.css = ko.computed(container, (lifetime) => {
            const colorSetting = this._colorSetting();
            const fontSetting = this._fontSetting();
            return {
                "msportalfx-bgcolor-h2": colorSetting === BackgroundColor.Blue,
                "msportalfx-bgcolor-i2": colorSetting === BackgroundColor.Green,
                "msportalfx-bgcolor-j2": colorSetting === BackgroundColor.Yellow,
                "msportalfx-text-muted-50": fontSetting === FontStyle.Muted,
                "msportalfx-text-header-small": fontSetting === FontStyle.AllCaps,
            };
        });
    }

    public onInputsSet(inputs: Inputs, settings: Def.SettingsContract): MsPortalFx.Base.Promise {

        // Any changes to the Part's Configuration values (see 'updateValues' above) will cause 'onInputsSet' to be called with the
        // new inputs/settings values.
        this.timeRange(inputs.timeRange ? timeRangeToString(inputs.timeRange) : ClientResources.generalGalleryPartNone);
        this.otherParameter(inputs.otherParameter || ClientResources.generalGalleryPartNone);
        this._colorSetting(settings && settings.content && settings.content.colorSettingValue || BackgroundColor.Default);
        this._fontSetting(settings && settings.content && settings.content.fontSettingValue || FontStyle.Default);

        return null;
    }
}

function timeRangeToString(timeRange: FxConfiguration.TimeRange): string {
    if (timeRange.relative) {
        const duration = timeRange.relative.duration;
        const plural = duration > 1;
        let timeUnit: string;
        switch (timeRange.relative.timeUnit) {
            case TimeUnit.Minute:
                timeUnit = plural ? ClientResources.timeUnitMinutes : ClientResources.timeUnitMinute;
                break;
            case TimeUnit.Hour:
                timeUnit = plural ? ClientResources.timeUnitHours : ClientResources.timeUnitHour;
                break;
            case TimeUnit.Day:
                timeUnit = plural ? ClientResources.timeUnitDays : ClientResources.timeUnitDay;
                break;
            case TimeUnit.Week:
                timeUnit = plural ? ClientResources.timeUnitWeeks : ClientResources.timeUnitWeek;
                break;
            case TimeUnit.Month:
                timeUnit = plural ? ClientResources.timeUnitMonths : ClientResources.timeUnitMonth;
                break;
            case TimeUnit.Year:
                timeUnit = plural ? ClientResources.timeUnitYears : ClientResources.timeUnitYear;
                break;
        }
        return "{0} {1} {2}".format(ClientResources.timeRangeLast, duration, timeUnit);
    } else {
        return "{0} - {1}".format(timeRange.absolute.from, timeRange.absolute.to);
    }
}
}

```

<a name="parts-a-k-a-tiles-no-data-message"></a>
### No data message

Sometimes you may need to display a part for which no data is available. For example, before a user has enabled deployments, you might want to show a teaser 'deployment history' part containing sample data. To support this, part `container` objects now have a new property: `noDataMessage`.

If you populate the part with sample data and set `noDataMessage` to a nonempty string, for example:

```ts
container.noDataMessage("Enable deployments to see your history");
```

At this point the part will become grayed out, non-interactive, and will have the message overlaid onto it. Set the `noDataMessage` value back to `null` if you later need to remove the message. This feature should *only* be used when a part is currently not applicable because no data is available (to help the user realize the feature exists). If instead you are simply trying to disable a part while data loads, please continue to return a promise from `onInputsSet` or use the `container.operations` queue directly.

<a name="parts-a-k-a-tiles-advanced-parts-topics"></a>
### Advanced Parts Topics

- [Part versioning](portalfx-parts-versioning.md)
- [Retiring a part](portalfx-parts-how-to-retire.md)
- [How to remove a part from an unlocked blade](portalfx-parts-how-to-remove-from-blade.md)
- [Using the reveal content pattern for better performance](portalfx-parts-revealContent.md)
- [Handling part errors](portalfx-parts-errors.md)
- [Handling assets that no longer exist](#parts-a-k-a-tiles-handling-assets-that-no-longer-exist)

 
<a name="parts-a-k-a-tiles-versioning"></a>
### Versioning

When users customize or pin a part the following state is stored and used the next time the part is loaded from a customized context.

1. Basic part metadata (e.g. part name, extension name, etc)
1. Part inputs (e.g. resource id)
1. Part settings (e.g. time range for a chart).

Over time, extension developers will find the need to modify the schema of a  part's inputs and/or settings to support new functionality.  Ibiza will always call your latest code, but it may call it with older versions of inputs and settings that were stored when an earlier version of your code was active.  

Your part may also be called with older inputs by code running in other extensions that may have taken a dependency on an earlier version of your part.  This is what happens when another extension uses a .pde file along with a `<PartReference/>`. 

To handle this you need to support backwards compatibility in your code.

<a name="parts-a-k-a-tiles-walkthrough"></a>
### Walkthrough

For part inputs we've added the **CanUseOldInputVersion** attribute that you should set to true to indicate that your part can handle older versions of inputs.  We recommend you use that in conjunction with a new part property/input called 'version'.  

Inline parts can define the current version as a constant.  In this case, this is the first explicit version.  We recommend using 2 the first time you do this.

```xml
<Part Name="RobotPart"
      ViewModel="{ViewModel Name=RobotPartViewModel, Module=./Browse/ViewModels/RobotPartViewModel}"
      CanUseOldInputVersions="true"
      PartKind="Button"
      AssetType="Robot"
      AssetIdProperty="name">
    <Part.Properties>
        <Property Name="version"
                  Source="{Constant 2}" />
        <Property Name="name"
                  Source="{DataInput Property=id}" />
    </Part.Properties>
</Part>
```

Globally defined parts can't specify constant bindings, but the flow is mostly the same.

```xml
<CustomPart Name="RobotSummary2"
            Export="true"
            ViewModel="RobotSummaryViewModel"
            CanUseOldInputVersions="true"
            Template="{Html Source='Templates\\Robot.html'}"
            InitialSize="FullWidthFitHeight">
    <CustomPart.Properties>
        <Property Name="name"
                  Source="{DataInput Property=name}" />
        <Property Name="version"
                  Source="{DataInput Property=version}" /> <!-- currently 2 -->
    </CustomPart.Properties>
</CustomPart>
```

The meat of the solution is in your part view model code.  The example below shows how to handle explicitly versioned inputs as well as the version of your parts that existed in the wild before you added explicit versioning support.

```javascript
public onInputsSet(inputs: Def.InputsContract, settings: Def.SettingsContract): MsPortalFx.Base.Promise {
        var name: string;
        if (inputs.version === "2") {  // this block explicitly handles version 2, which is the latest
            name = inputs.name;
        } else if (inputs.version === "1") { // this block explicitly handles version 1, which is now old, but was an explicit version
            var oldInputs: any = inputs;
            name = oldInputs.oldName;
        } else if (MsPortalFx.Util.isNullOrUndefined(inputs.version)) { // this block handles any version of the inputs
            var oldestInputs: any = inputs;                             //  that existed before the version property was added
            name = oldestInputs.oldestName;
        } else {
            throw new Error("Unexpected version.  This should not happen, but there is one edge case where you temporarily deploy a new version, say version 3, and then roll back your code to version 2.  Any tiles pinned before you roll back will hit this block.");
        }
        return this._view.fetch(name);
    }
```

You can use the same exact technique for part settings.

```javascript
public onInputsSet(inputs: Def.InputsContract, settings: Def.SettingsContract): MsPortalFx.Base.Promise {
        var someSetting: string;
        if (settings.version === "2") {  // this block explicitly handles version 2, which is the latest
            someSetting = settings.someSetting;
        } else if (settings.version === "1") { // this block explicitly handles version 1, which is now old, but was an explicit version
            var oldSettings: any = settings;
            someSetting = oldSettings.oldSetting;
        } else if (MsPortalFx.Util.isNullOrUndefined(settings.version)) { // this block handles any version of the settings
            var oldestSettings: any = string;                             //  that existed before the version property was added
            someSetting = oldestSettings.oldestSetting;
        } else {
            throw new Error("Unexpected version.  This should not happen, but there is one edge case where you temporarily deploy a new version, say version 3, and then roll back your code to version 2.  Any tiles pinned before you roll back will hit this block.");
        }
        return this._view.fetch(name);
    }
```

 
<a name="parts-a-k-a-tiles-permanently-retire-a-part"></a>
### Permanently Retire a part

You may have built and shipped a part, but later decide to discontinue its functionality.  Since we provide a customizable system we need to handle cases where a user has pinned this part and incorporated it into the layout of the startboard.  Customers have clearly told us they do not like it when parts disappear from their startboard automatically.  The following process allows you to permanently retire your part while providing a good user experience around customizations.

To retire a part you should simply delete the majority of the code, but leave the bare minimum in place so that the tile still loads.  Then use the `container.noDataMessage()` api to inform the user that the part is no longer supported.

This ensures that users won't see parts failing unexpectedly on their dashboards, while also informing them that this part is no longer supported.
 
<a name="parts-a-k-a-tiles-removig-a-part-from-a-blade-s-default-layout"></a>
### Removig a part from a blade&#39;s default layout
Your unlocked blade's default layout should be reflective of tiles you think provide the most out of the box value to users while meeting your performance goals.  That layout may change over time, and you may decide that a part that included in a blade's default layout at one point in time should not be included going forward.  

If you find yourself in that position this is what you should do.

If your part was defined inline as a `<Part/>` or `<CustomPart>` element within a `<Blade/>` and `<Lens/>` then you have the pre-step of moving that part out of the blade and into your extension's global part catalog.

Else if your part is already defined in the global part catalog or is defined in another extension then you currently have a `<PartReference/>` tag in your blade rather than a `<Part/>` tag.

Next, you should replace your `<Part/>` or `<PartReference/>` tag with the `<RedirectPart/>` tag.

At this point we need to keep in mind that our goal is to remove the part from the default layout, but we still want to continue supporting instances of the part that users have pinned to their startboards.  You may also choose to allow new users to  find the part in the tile gallery.  If your goal was to permanently retire a part, including removing support for pinned instances and the tile gallery then read [How to permanently retire a part](portalfx-parts-how-to-retire.md).

We use the `<Preserve/>` tag to properly configure the `<RedirectPart/>` to preserve pinned instances.

```xml
<RedirectPart Name="SAME EXACT NAME THAT WAS USED IN THE TAG THIS IS REPLACING">
    <Preserve PartType="NAME OF THE GLOBAL PART THAT DEFINES THE PART BEHAVIOR"
                        Extension="ONLY APPLICABLE IF THE PART IS DEFINED IN A DIFFERENT EXTENSION"/>
</RedirectPart>
```
 
<a name="parts-a-k-a-tiles-improving-part-responsiveness"></a>
### Improving Part responsiveness

<a name="parts-a-k-a-tiles-improving-part-responsiveness-overview"></a>
#### Overview

As a Part loads, by default, the user is presented with a *blocking* loading indicator:

![Part with blocking loading indicator][opaque]
[opaque]: ../media/portalfx-parts-opaquespinner.png

By default, the lifetime of this *blocking* loading indicator is controlled by the promise returned from the Part's `onInputsSet` method:

```ts
public onInputsSet(inputs: Def.InputsContract): MsPortalFx.Base.Promise {
	// When this promise is resolved, the loading indicator is removed.
    return this._view.fetch(inputs.websiteId);
}
```

Now, it is quite common that a Part's content can be revealed (that is, the *blocking* loading indicator can be removed) earlier, allowing the user to interact with the Part while its data continues to load.  An example of this looks like:

![Part with non-blocking loading indicator][translucent]
[translucent]: ../media/portalfx-parts-translucentspinner.png

Here, essential content - like the "Accounts" SQL Database name - is displayed to the user while non-essential "status" (bottom left) loads in the background.
While "status" loads, a *non-blocking* loading indicator is displayed at the top of the Part.  Crucially, the user can activate the Part (can interact with the Part) while the Part is in this *non-blocking* loading state.

To optimize your Part to behave in this more responsive way, you'll use the `container.revealContent()` API from within your Part's view model.  A call to this API will:

* remove the *blocking* loading indicator
* reveal the Part's content
* apply the *non-blocking* loading indicator
* allow the user to interact with your Part

Depending on the nature of your Part, you will call `container.revealContent()`:

* from your Part view model's `constructor` *or*
* from your Part view model's `onInputsSet` function:
    * in a '.then(() => ...)' callback, once *essential data* has loaded
    * in 'onInputsSet' directly, before initiating data-loading    

You'll call `container.revealContent()` from your view model's `constructor` in scenarios where the Part has interesting content to display *even before any data is loaded*.  An example of this would be a chart that can show its X and Y-axis immediately:

```ts
export class BarChartPartViewModel implements Def.BarChartPartViewModel.Contract {

    public barChartVM: MsPortalFx.ViewModels.Controls.Visualization.Chart.Contract<string, number>;

    constructor(container: MsPortalFx.ViewModels.PartContainerContract, initialState: any, dataContext: ControlsArea.DataContext) {
        // Initialize the chart view model.
        this.barChartVM = new MsPortalFx.ViewModels.Controls.Visualization.Chart.ViewModel<string, number>(container);

        // Configure the chart view model (incomplete as shown).
        this.barChartVM.yAxis.showGridLines(true);
		
		container.revealContent();
	}
}
```
More often, you'll call `container.revealContent()` once some essential, fast-loading data is loaded:

```ts
public onInputsSet(inputs: MyPartInputs): Promise {
    // This larger Promise still controls the lifetime of all loading indicators (the
    // non-blocking one in this case, since 'container.revealContent()' has been called).
    return Q.all([
        this._essentialDataView.fetch(inputs.resourceId).then(() => {
            // Show the Part content once essential, fast-loading data loads.
            this._container.revealContent();
        }),
        this._slowLoadingNonEssentialDataView.fetch(inputs.resourceId)
    ]);
}
```
Less commonly, you'll call `container.revealContent()` when the essential data you'll display can be computed synchronously from the Part/Blade inputs:

```ts
public onInputsSet(inputs: MyPartInputs): Promise {

    // In this case, the 'resourceGroupName' is sufficient to allow the user to interact with the Part/Blade.
    var resourceDescriptor = ResourceTypes.parseResourceManagerDescriptor(inputs.resourceId);
    this.resourceGroupName(resourceDescriptor.resourceGroup);
    this._container.revealContent();

    // This Promise controls the lifetime of all loading indicators (the
    // non-blocking one in this case, since 'container.revealContent()' has been called).
    return this._dataView.fetch(inputs.resourceId);
}
```
In all cases above, the promise returned from `onInputsSet` still determines the visibility/presence of loading indicators.  Once the promise returned from `onInputsSet` is resolved, all loading indicators are removed:

![Fully loaded Part with no loading indicator][nospinner]
[nospinner]: ../media/portalfx-parts-nospinner.png

Also, if the promise returned from `onInputsSet` is rejected (due to the rejection of either the fast- or slow-loading data promise), the Part will transition to show the default error UX (a "sad cloud").
This treatment of the promise returned from `onInputsSet` behaves consistently, whether or not the Part makes use of `container.revealContent()`.  In this way, `container.revealContent()` is a *simple, additive* change you should use to optimize your Part's behavior.

<a name="parts-a-k-a-tiles-improving-part-responsiveness-anti-patterns"></a>
#### Anti-patterns

It is important that loading indicators are consistently applied across the Parts/Blades of all extensions.  To achieve this:

**Do** call `container.revealContent()` to limit the time where the user sees *blocking* loading indicators.

**Do** return a Promise from `onInputsSet` that **reflects all data-loading** for your Part (or for your Blade, if the Blade is locked or `<TemplateBlade>`).

**Do not** return a Promise from `onInputsSet` that removes loading indicators *before all Part data is loaded*.  While your Part data loads, if the user sees no loading indicator, your Part will appear broken and/or unresponsive.  For instance,

```ts
public onInputsSet(inputs: MyPartInputs): Promise {
    this._view.fetch(inputs.resourceId);
    
    // DO NOT DO THIS!  Removes all loading indicators.
    // Your Part will look broken while the `fetch` above completes.
    return Q();
}
```

 
<a name="parts-a-k-a-tiles-handling-part-errors"></a>
### Handling part errors

Occasionally while loading parts, your application may encounter some sort of unrecoverable error. In that case, the part may placed into a failure state:

![Failed part][520]

Parts should only be placed into a failed state if it is a system fault and there is no action that the user could take to correct the error. If the user could correct the error, then instead give them information about how to do so. For an example of a failing part, view the following file in the samples:

`\Client\Parts\Lifecycle\ViewModels\PartLifecycleViewModels.ts`

```ts
constructor(container: MsPortalFx.ViewModels.PartContainer, initialState: any, dataContext: DataContext) {
    container.fail(SamplesExtension.Resources.Strings.failedToLoad);
}
```

If the error later becomes fixed (for example, if you are polling for data, and a subsequent poll returns valid results), then you can call `container.recover()` to return the part to its normal display state.

<a name="parts-a-k-a-tiles-best-practice-for-handling-part-errors"></a>
### Best practice for handling part errors

The sad cloud UX is intended for use cases where you don’t have any meaningful error to show to the user. Basically, it’s an unexpected error and the only thing they can do is try again.

If there’s an error that the user can actually do something about then you should launch the appropriate UX that lets them correct the issue. For example, if the error is caused because the user would need to enter some credentials somewhere then we recommend you do not fail the part and instead use one of the following options:

1. The part can handle the error and change its content to show the credentials input form
1. The part can handle the error and show a message that says ‘click here to enter credentials’. Clicking the part would launch a blade with the credentials form.
1. Whatever else you think is appropriate. The point is in this case you (the domain owner) know how to handle the error and should show the right UX.

[520]: ../media/portalfx-debugging/failure.png
 
<a name="parts-a-k-a-tiles-handling-assets-that-no-longer-exist"></a>
### Handling assets that no longer exist

Many parts represent assets such as ARM resources that can be deleted from the UI, PowerShell, or calling REST APIs directly.  A stateless UI system would handle this reality by loading only assets that exist at the time the UI starts up.  Since Ibiza holds the state for all user customizations this 'Not Found' case needs to be handled in a few specific places.

* A part that has been pinned to the startboard represents an asset that no longer exists
  * Example: The VM part
* A part that has been pinned to the startboard depends on information provided by an asset that no longer exists
  * Example: The CPU chart for a VM part

<a name="parts-a-k-a-tiles-handling-assets-that-no-longer-exist-automatic-http-404-handling"></a>
#### Automatic HTTP 404 handling

In an attempt to cover the most common scenarios Ibiza's built in data layer automatically detects HTTP 404 responses from AJAX calls.  When a part depends on data where a 404 has been detected Ibiza automatically makes the part non-interactive and displays a message of 'Not Found'.

The effect is that in most not found scenarios most users will see a more accurate 'Not found' message rather than the sad cloud UX that they see when there is an unexpected error.

This distinction also lets our telemetry system tell the difference between a part that fails to render because of bugs and a part that fails to render because the user's asset has been deleted. **Instances of 'Not Found' do not count against a part's reliability KPI**.

<a name="parts-a-k-a-tiles-handling-assets-that-no-longer-exist-how-to-opt-out-of-automatic-http-404-handling"></a>
#### How to opt out of automatic HTTP 404 handling

We strongly encourage teams to use the default behavior of having Ibiza handle 404 responses automatically, but there may be some valid exceptions where the standard behavior may not be the best thing to do.  In those very rare cases you can opt out of automatic 404 handling by setting the showNotFoundErrors flag to false when creating your data views.

```js
this._dataView = dataContext.createView(container, { showNotFoundErrors: false });
```

If you do this then 404s will result in rejected promises as they always have and it will be up to your extension code to apply your special handling of 404 responses.


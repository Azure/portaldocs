<a name="parts"></a>
# Parts

<a name="parts-overview"></a>
## Overview

Parts, also known as Tiles, are the units of UI that can participate on Azure dashboards. This includes the procedures used to create parts.

* [Creating a basic part](#creating-a-basic-part)

* [Pinning a part manually](#pinning-a-part-manually)

* [Pinning a part programmatically](#pinning-a-part-programmatically)

* [Offering a part in the Tile gallery](#offering-a-part-in-the-tile-gallery)

<a name="parts-overview-creating-a-basic-part"></a>
### Creating a basic part

**NOTE**: In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory, and  `<dirParent>`  is the `SamplesExtension\` directory, based on where the samples were installed when the developer set up the SDK.

Creating a part is very similar to creating a blade. And like blades, there are important decisions to be made while planning to implement the part.  The recommended way is to implement a template part.  Template parts are like template blades. You define an html template and bind it to a TypeScript view model, as in the following example.

```
import * as PartsArea from "../PartsArea";
import * as ClientResources from "ClientResources";
import * as TemplatePart from "Fx/Composition/TemplatePart";
import { SvgType } from "Fx/Images";

@TemplatePart.Decorator({
    htmlTemplate: "" +
    "<div class='msportalfx-padding'>" +
    "  <div>This is a Template Part.</div>" +
    "</div>",
    galleryMetadata: {
        title: ClientResources.simpleTemplatePart,
        category: ClientResources.partGalleryCategorySample,
        thumbnail: {
            image: SvgType.ArrowDown,
        },
    },
})
@TemplatePart.InjectableModel.Decorator(PartsArea.DataContext)
export class SimpleTemplatePart {
    public title = ClientResources.simpleTemplatePart;
    public subtitle: string;
    public onClick: () => void = null;  // This Part isn't clickable.

    public context: TemplatePart.Context<void, PartsArea.DataContext>;

    public async onInitialize() {
        // This sample loads no data.
    }
}

```

**NOTE**: The context property on the part view model contains useful APIs on it for things like opening blades, putting the part into an error state, and more.

If you need more control over the DOM and are willing to take on additional burdens regarding accessibility and theming then you can also choose to build a `FramePart` where the contents of the part are implemented by using an iFrame that you can control. The following  example demonstrates  a simple FramePart that shows how to communicate between the visible iFrame and the hidden extension iFrame.

```
/// <reference path="../../../FramePage.d.ts" />

import { BladeReferences } from "Fx/Composition";
import * as FramePart from "Fx/Composition/FramePart";
import { SvgType } from "Fx/Images";
import * as ClientResources from "ClientResources";

@FramePart.Decorator({
    galleryMetadata: {
        title: ClientResources.noPdlSampleFramePartTitle,
        category: ClientResources.partGalleryCategorySample,
        thumbnail: {
            image: SvgType.ArrowUp,
        },
    },
})
export class SampleFramePart {
    public title: string;  // This sample doesn't make use of a title.
    public subtitle: string;  // This sample doesn't make use of a subtitle.
    public onClick: () => void;  // This FramePart doesn't have click behavior.
    public context: FramePart.Context<void>;

    /*
     * View model for the frame part.
     */
    public viewModel: FramePart.ViewModelV2Contract;

    constructor(
        private readonly _container: FramePart.Container
    ) {
    }

    public async onInitialize() {
        const viewModel = this.viewModel = FramePart.createViewModel(this._container, {
            src: MsPortalFx.Base.Resources.getContentUri("/Content/SamplesExtension/framepartpage.html"),
            onReceiveMessage: (message: FramePage.Message) => {
                switch (message.messageType) {
                    // This is an example of how to listen for messages from your iframe.
                    case FramePage.MessageType.OpenBlade:
                        // In this sample, opening a sample child blade.
                        this._container.openBlade(BladeReferences.forBlade("OpenBladeApiChildBlade").createReference());
                        break;
                    default:
                        break;
                }
            },
        });

        // This is an example of how to post a message back to your iframe.
        // Send initialization information to iframe.
        MsPortalFx.Base.Security.getAuthorizationToken().then((token) => {
            // Post initialization info from FrameControl to your iframe.
            viewModel.postMessage({ messageType: FramePage.MessageType.InitInfo, value: { authToken: token.header, resourceId: "testResourceId" } });
        });
    }
}

```

<a name="parts-overview-pinning-a-part-manually"></a>
### Pinning a part manually

This is for when a user clicks on the pin icon on a blade.

If you have built a blade and have added the `@TemplateBlade.Pinnable.Decorator()` decorator that is available for TemplateBlade and all the other Blade variants, then the compiler will require you to implement an `onPin()` function. This function is called by the framework when the user manually clicks the blade's pin icon.  The extension returns a `PartReference` in that function. When the  extension is built, a PartReference class will be autogenerated for each part defined in the extension.

To access the part references from within a blade, the extension imports the following reference.

```typescript

import { PartReferences } from "Fx/Composition";
import { PinnableBladePinnedPartReference } from "_generated/PartReferenceTypes";

```

Then in the `onPin()` function you can do something like this:

```typescript

// This method is called by the FX when the user clicks the "Pin" icon on the Blade.
// It's required because @TemplateBlade.Pinnable.Decorator is applied to this class.
public onPin() {
    return this._getPartReferenceForPinning();
}

```

This enables the extension to initialize the part, as in the following example.

```typescript

private _getPartReferenceForPinning() {
    const { parameters } = this.context;

    // Here, when the user clicks the "Pin" UI in the opened Blade, the Blade has the opportunity to run some code
    // to choose the Part to be pinned and to capture some Blade state to pass along to the Part.
    const favoriteColor = this.colorDropDown.value() || undefined;
    const partParameters = $.extend({}, parameters, { favoriteColor: favoriteColor });  // Here, supply extra parameters to the Part.
    const partSize = this._getPinnedPartSize(favoriteColor);

    return PartReferences.forPart("PinnableBladePinnedPart").createReference({ parameters: partParameters, options: { initialSize: partSize }});  // Here, specify the initial size of the Part.
}

```

<a name="parts-overview-pinning-a-part-programmatically"></a>
### Pinning a part programmatically

You can programmatically pin a part to the current dashboard when a user is interacting with one of your blades. To do this, first import the PartPinner module like this.

```typescript

import * as PartPinner from "Fx/Pinner";

```

Then from within your code you can imperatively call the `pin()` function, as in the following code.

```typescript

// An example of UI in the Blade that the user can interact with to pin some artifact from the Blade UI.
// This method is called from the 'fxclick' handler in the HTML template for this TemplateBlade.
public onPinFromUiClick() {
    const partReference = this._getPartReferenceForPinning();
    return PartPinner.pin([partReference]);
}

```

<a name="parts-overview-offering-a-part-in-the-tile-gallery"></a>
### Offering a part in the Tile gallery

The Tile Gallery is presented when users create new dashboards or when they put their dashboard in edit mode. The Gallery lets users browse and search through all parts built by all extensions, as long as the parts have the right metadata. If you want your part to be included in the tile gallery then you just need to provide a little bit of metadata inside of your part's decorator.

The following example includes the `galleryMetadata` property that lets the developer specify a localized title and category, in addition to a thumbnail image.

```typescript

@TemplatePart.Decorator({
htmlTemplate: "" +
"<div class='ext-gallery-part' data-bind='css: css'>" +
"    <div>Color: <span data-bind='text: colorName'></span></div>" +
"    <div>Time range: <span class='ext-gallery-part-time-range' data-bind='text: timeRange'></span></div>" +
"    <div>Other parameter: <span data-bind='text: otherParameter'></span></div>" +
"</div>" +
"<p/>" +
"<div>Part location: <span class='ext-gallery-part-location' data-bind='text: location'></span></div>" +
"<p/>" +
"<a class='ext-general-gallery-part-configure' data-bind='fxclick: onConfigureClick'>Configure</a>",
galleryMetadata: {
    title: ClientResources.noPdlGeneralGalleryPartTitle,
    category: ClientResources.partGalleryCategorySample,
    thumbnail: {
        path: "../../../AmdSvg/sample.svg",
    },
},
parameterMetadata: {
    timeRange: {
        // TODO: Use FX constant.
        valueType: "MsPortalFx.Composition.Configuration.ValueTypes.TimeRange",
    },
},
})

```


<a name="templateblades"></a>
## TemplateBlades

The `TemplateBlade` is the recommended way of authoring blades in Ibiza. It is the equivalent to windows or pages in other systems.

You can think of a `TemplateBlade` as an HTML page. Authoring template blades requires an HTML template, a ViewModel, and an optional CSS file.

To create a template blade you create a single TypeScript file inside one of your area directories. Here is a basic example of a `TemplateBlade`.

```typescript

/// <reference path="../../../TypeReferences.d.ts" />

import * as ClientResources from "ClientResources";
import * as TemplateBlade from "Fx/Composition/TemplateBlade";

//docs#DecoratorReference
@TemplateBlade.Decorator({
htmlTemplate: "" +
    "<div class='msportalfx-padding'>" +
    "  <div>This is a Template Blade.</div>" +
    "</div>",
})
//docs#DecoratorReference
export class SimpleTemplateBlade {
public title = ClientResources.simpleTemplateBlade;
public subtitle: string;

//docs#Context
public context: TemplateBlade.Context<void>;
//docs#Context

public async onInitialize() {
}
}

```

Import statements at the top of the file pull in things like the template blade module, your client resources, and your area information.

Below that is the template blade decorator which is where you supply your HTML template.  The template can include Knockout constructs for data binding as well as referencing Ibiza controls. The document located at [top-extensions-controls.md](top-extensions-controls.md) covers the supported features and recommended patterns in detail. There are other, optional pieces of metadata you can specify in the decorator such as opting in to the feature that lets users pin your blade.

Below the decorator is a TypeScript class that implements the blade logic. The name of the class is used as a unique identifier for a blade within your extension. That name will appear in URLs and will be used to locate the blade when a user clicks on a pinned part.

**WARNING**: Changing these names after shipping will result in broken links.

This class has three public properties.

**Title**:  String which can optionally be observable. It directly maps to what the user will see in the blade header.

**subtitle**:  String which can optionally be observable. It directly maps to what the user will see in the blade header.

  ```typescript

public context: TemplateBlade.Context<void>;

```

**context**: This property is auto populated by the framework when your blade loads. It contains many APIs you can use to interact with the shell such as blade opening, access to blade parameters, and much more. The context property accepts two generic type arguments. The first represents the type of your parameters. In this simple case we use void because this blade takes no parameters.  You can define your own interface type to define your parameters and then use that type as the first parameter. The second parameter represents the data context type that is shared by all blades in an area.

In this simple case we use void because this blade takes no parameters. You can define your own interface type to define your parameters and then use that type as the first parameter. The second parameter represents the data context type that is shared by all blades in an area.

The `onInitialize()` method is called by the framework when loading your blade. The context property will be populated before this method is called. This is where you do all of your blade loading logic. In this example the blade does not fetch any data from a server and so it only returns a resolved `promise` by using the `Q()` method. This instructs the Framework to immediately remove the loading indicator and render the template. If your blade requires data to load before content is rendered then you should return a promise that resolves when your blade is ready. The Portal will continue to load the loading indicator on the blade until this happens. The portal telemetry infrastructure will also place markers around the beginning of the `onInitialize()` method and the end of this promise in order to measure the performance of your blade load path. If your blade has a two-phase load, which means that the extension should display  some content to the user previous to loading all the data, then the extension should call `context.container.revealContent()` at the end of the first phase. This will signal to the framework to remove the loading indicator and render your content even though the blade is not fully ready. You are responsible for making the experience usable while in this partially ready state.

There are several samples that show more advanced features of template blades.

* Source Code installed with the SDK

  `<dir>/Client/V2/Blades/Template`

* Live running sample

    The working copy is located at
    [https://df.onecloud.azure-test.net/?SamplesExtension=true#blade/SamplesExtension/TemplateBladesBlade/overview](https://df.onecloud.azure-test.net/?SamplesExtension=true#blade/SamplesExtension/TemplateBladesBlade/overview)

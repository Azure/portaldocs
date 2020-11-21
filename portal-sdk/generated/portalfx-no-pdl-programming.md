* [Defining Blades and Parts using TypeScript decorators (a.k.a. 'no-PDL')](#defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl)
    * [Introduction](#defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-introduction)
    * [Current TypeScript decorator support](#defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-current-typescript-decorator-support)
    * [Building a hello world template blade using decorators](#defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-building-a-hello-world-template-blade-using-decorators)
    * [Building a menu blade using decorators](#defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-building-a-menu-blade-using-decorators)
    * [The context property](#defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-the-context-property)
    * [no-PDL FAQ](#defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-no-pdl-faq)


<a name="defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl"></a>
## Defining Blades and Parts using TypeScript decorators (a.k.a. &#39;no-PDL&#39;)

For those who want to jump right into using TypeScript decorators to develop Blades and Parts, here are some quick and easy resources to consider:

* Getting started [video](https://ibizareflectorprod.blob.core.windows.net/public/video.html)
* no-PDL [FAQ](#no-pdl-faq)

<a name="defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-introduction"></a>
### Introduction

Using the PDL language to develop the metadata that accompanies a Blade or Part and to define the API for a Blade or Part has a couple of signficant drawbacks to developer productivity and code quality.  First, it's burdensome for developers to manage an extra file authored in a different language (PDL/XAML).  Second, the API by which one would open a Blade or pin a Part is *not strongly-typed*, potentially leading to run-time bugs when extensions change their Blade/Part API.

In the latest versions of the Ibiza SDK, extension teams can develop Blades and Parts using [TypeScript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html) (and not PDL).  With this, you'll define metadata in TypeScript right alongside your Blade/Part implementation.  Also, you'll define the API for a Blade or Part in terms of *TypeScript interfaces* (for the Blade/Part's parameters, for instance).  With this, when you (or other teams) write TypeScript code to *open* the Blade or *pin* the Part, the TypeScript compiler validates calls to `openBlade(...)` or `PartPinner.pin(...)` and issues conventional TypeScript compilation errors.

PDL is still supported for back compat reasons, but using Blade/Part TypeScript decorators is the recommended pattern for new Blades/Parts and for teams who elect to port old PDL Blades/Parts.

The next few sections provide an overview on how to use these decorators.  Additionally, there is an [Introduction video](https://ibizareflectorprod.blob.core.windows.net/public/video.html) that walks through these concepts.

<a name="defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-current-typescript-decorator-support"></a>
### Current TypeScript decorator support

The following SDK features can be built today with TypeScript decorators.  If you have access, you can explore the interfaces with jsdoc comments [directly in our source code](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.Client%2FTypeScript%2FFx%2FComposition&version=GBdev&_a=contents).  We will eventually export the jsdocs for the SDK to a public location.  That effort is in progress.

**Blades**

- **Template Blade** - A Blade where you develop the Blade's content using an HTML template bound to properties on the Blade's TypeScript class
- **Menu Blade** - A Blade that exposes menu items where each item opens a sub-Blade
- **Frame Blade** - A Blade that provides you with an IFrame where you develop your Blade content as a conventional web page (or rehost an existing web page)
- **Blade** - A special case of Template Blade, where the Blade's UI uses only a single FX control (like Grid) and doesn't require an HTML template to apply styling or compose multiple FX controls.

<a name="defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-current-typescript-decorator-support-parts-a-k-a-tiles"></a>
#### Parts (a.k.a. Tiles)
- **Template Part** - Like Template Blade, you'll develop your Part's content using an HTML template
Parts (tiles)
- **Frame Part** - Like Frame Blade, you'll develop your Blade content as a conventional web page and the FX will render your Blade in an IFrame
- **Button Part** - A simple API that allows you develop standard Parts with title/subtitle/icon
- **Part** - Like 'Blade' above, this is a special case of Template Part for cases where a single FX control is used (like Chart, Grid).

These SDK features cannot **(yet)** be built with decorators:

- Unlocked blades - Blades with tiles on them - These will likely never get decorator support since that is not a pattern that is recommended for any experience.
- The asset model - Defines the asset types (usually ARM resources) in your extension
- Extension definition - A very small amount of PDL that provides general metadata about your extension

<a name="defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-building-a-hello-world-template-blade-using-decorators"></a>
### Building a hello world template blade using decorators

This section pulls from a sample that [you can see in the dogfood environment](https://df.onecloud.azure-test.net/?SamplesExtension=true#blade/SamplesExtension/TemplateBladesBlade/simpleTemplateBlade).

Here is an example of a very simple template blade, represented by a single TpeScript file in your extension project.

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
@TemplateBlade.ForContextPane.Decorator({
width: TemplateBlade.ForContextPane.Width.Small,
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

This is the decorator code.  There are several options that can be specified as properties on the object passed into the decorator.  This sample shows the simplest scenario where you only need to provide an HTML template.  In this case, the template is provided inline, something the SDK supports for convinience.  You also have the ability to provide a relative path to an html file that contains the template (e.g. If your blade is in a file called `MyBlade.ts` then you can add a file right next to it called `MyBlade.html` and then pass `./MyBladeName.html` into the htmlTemplate property of the decorator).

```typescript

@TemplateBlade.Decorator({
htmlTemplate: "" +
    "<div class='msportalfx-padding'>" +
    "  <div>This is a Template Blade.</div>" +
    "</div>",
})
@TemplateBlade.ForContextPane.Decorator({
width: TemplateBlade.ForContextPane.Width.Small,
})

```

Additionally, the No-PDL programming model introduces (and requires) a context property to be present in your blade class. The context property is populated by the framework on your behalf and contains APIs you can call to interact with the shell.  You can learn more about the context property [here](#no-pdl-context-property).

```typescript

public context: TemplateBlade.Context<void>;

```

<a name="defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-building-a-menu-blade-using-decorators"></a>
### Building a menu blade using decorators

Below is an example of a menu blade build using decorators.  It uses the `@MenuBlade` decorator.  This decorator puts two constraints on your type.

1.  It makes the public `viewModel` property required.  The property is of type `MenuBlade.ViewModel2` and provides you with APIs to setup the menu.
2.  It makes the public 'context' property required.  The property is of type `MenuBlade.Context`.

/// <reference path="../../../TypeReferences.d.ts" />

import * as ClientResources from "ClientResources";
import { BladeReferences } from "Fx/Composition";
import * as MenuBlade from "Fx/Composition/MenuBlade";

@MenuBlade.Decorator()
export class TemplateBladesBlade {
    public title = ClientResources.templateBladesBladeTitle;
    public subtitle = ClientResources.samples;

    public context: MenuBlade.Context<void>;

    public viewModel: MenuBlade.ViewModel2;

    public async onInitialize() {
        const { container } = this.context;

        this.viewModel = MenuBlade.ViewModel2.create(container, {
            groups: [
                {
                    id: "default",
                    displayText: ClientResources.templateBladeSamples,
                    items: [
                        {
                            id: "simpleTemplateBlade",
                            displayText: ClientResources.simpleTemplateBlade,
                            icon: null,
                            supplyBladeReference: () => {
                                return BladeReferences.forBlade("SimpleTemplateBlade").createReference();
                            },
                        },
                        {
                            id: "diTemplateBlade",
                            displayText: ClientResources.diTemplateBlade,
                            icon: null,
                            supplyBladeReference: () => {
                                return BladeReferences.forBlade("DiTemplateBlade").createReference();
                            },
                        },
                        {
                            id: "templateBladeWithShield",
                            displayText: ClientResources.templateBladeWithShield,
                            icon: null,
                            supplyBladeReference: () => {
                                return BladeReferences.forBlade("TemplateBladeWithShield").createReference();
                            },
                        },
                        {
                            id: "templateBladeReceivingDataFromChildBlade",
                            displayText: ClientResources.templateBladeReceivingDataFromChildBlade,
                            icon: null,
                            supplyBladeReference: () => {
                                return BladeReferences.forBlade("TemplateBladeReceivingDataFromChildBlade").createReference();
                            },
                        },
                        {
                            id: "templateBladeWithSettings",
                            displayText: ClientResources.templateBladeWithSettings,
                            icon: null,
                            supplyBladeReference: () => {
                                return BladeReferences.forBlade("TemplateBladeWithSettings").createReference();
                            },
                        },
                        {
                            id: "templateBladeWithStatusBar",
                            displayText: ClientResources.templateBladeWithStatusBar,
                            icon: null,
                            supplyBladeReference: () => {
                                return BladeReferences.forBlade("TemplateBladeWithStatusBar").createReference();
                            },
                        },
                        {
                            id: "shrinkOnOpenChildBladeTemplateBlade",
                            displayText: ClientResources.shrinkOnOpenChildBladeTemplateBlade,
                            icon: null,
                            supplyBladeReference: () => {
                                return BladeReferences.forBlade("ShrinkOnOpenChildBladeTemplateBlade").createReference();
                            },
                        },
                        {
                            id: "templateBladeInContextPane",
                            displayText: ClientResources.forContextPaneLauncherTemplateBladeTitle,
                            icon: null,
                            supplyBladeReference: () => {
                                return BladeReferences.forBlade("ForContextPaneLauncherBlade").createReference();
                            },
                        },
                    ],
                },
            ],
            overview: {
                id: "overview",
                displayText: ClientResources.templateBladeOverviewBlade,
                icon: null,
                supplyBladeReference: () => {
                    return BladeReferences.forBlade("TemplateBladeOverviewBlade").createReference();
                },
            },
        });
    }
}


<a name="no-pdl-context-property"></a>
<a name="defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-the-context-property"></a>
### The context property

The context property contains APIs you can call to interact with the shell. It will be populated for you by the framework before your `onInitialize()` function is called.  **It will not be populated in your constructor.  In fact, we advise against having a constructor and instead doing all initialization work in the onInitialize function.** This is a fairly common [Dependency injection technique](https://en.wikipedia.org/wiki/Dependency_injection).

Declaring the type of this property can be a little tricky, and the declaration can change if more No-PDL decorators are added to your file.  This is because certain APIs on the context object get enhanced when new decorators are used.  Let's start with a basic example and build from there.

```typescript

public context: TemplateBlade.Context<void>;

```

This is the simplest declaration of the context property.  The framework provided `TemplateBlade.Context` type takes in two generic parameters (the second one is optional). The first parameter represents the type of object that represents the parameters to the blade.  This simple blade takes no parameters, hence the value of `void` for the first generic parameter. Although the `Context` type accepts a second, optional `TModel` generic parameter, this is in support of a legacy `DataContext` feature that is no longer recommended for new Blades/Parts. To provide dependencies to your Blade/Part, the recommended pattern is to use dependency injection on the constructor.

Note that in this example there is an API on the context called `context.container.closeCurrentBlade()`.  This function takes no parameters.

Now let's say you're changing this blade so that it returns data to its parent (i.e. the blade or part that opened it). First, you would add the returns data decorator. **Note that not all blades need this behavior, and it does come with the consequence that the child blade is not deep-linkable if it requires a parent blade. Use only as appropriate.**

        @TemplateBlade.ReturnsData.Decorator()

That will cause a compiler error because that decorator changes the context in a way that must be declared.  The `closeCurrentBlade()` function that previously took no arguments now needs to accept the data to return to the parent blade.

To fix the error, add `& TemplateBlade.ReturnsData.Context<{ value: string }>` to the declaration like this.

        public context: TemplateBlade.Context<void> & TemplateBlade.ReturnsData.Context<{ value: string }>;

This uses TypeScript [intersection types](https://www.typescriptlang.org/docs/handbook/advanced-types.html) to overload the closeCurrentBlade function to look like this `closeCurrentBlade(data: { value: string })` so that when you use it the compiler will enforce that data is provided to it like this:

    context.container.closeCurrentBlade({
        value: "Data to return to parent blade"
    });

Intersection types combine the members of all types that get and'd (&'d) together.

When you build your project, the compiler will also produce an auto generated blade reference definition file that gives the same level of type safety to the parent blade.  Here is code that the parent blade would have.  Note that the callback that fires when `SimpleTemplateBlade` closes has the type information about the data being returned.

    context.container.openBlade(BladeReferences.forBlade("SimpleTemplateBlade").createReference({
        onClosed: (reason: BladeClosedReason, data: {value: string}) => {
            if (reason === BladeClosedReason.ChildClosedSelf) {
                const newValue = data && data.value ? data.value : noValue;
                this.previouslyReturnedValue(newValue);
            }
        }}));

Each time you add an additional decorator you will need to incorporate it into the context declaration as we did here.

<a name="no-pdl-faq"></a>
<a name="defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-no-pdl-faq"></a>
### no-PDL FAQ

<a name="defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-no-pdl-faq-how-do-i-know-what-properties-methods-to-add-to-my-blade-or-part-class-i-m-used-to-my-typescript-class-inheriting-an-interface"></a>
#### How do I know what properties/methods to add to my Blade or Part class?  I&#39;m used to my TypeScript class inheriting an interface.

The short answer here is that:
- Yes, interface types exist for every no-PDL TypeScript decorator. For every decorator (@TemplateBlade.Decorator, for instance), there is a corresponding interface type that applies to the Blade/Part class (for instance, TemplateBlade.Contract).
- No, it is **not necessary** to follow this extra step of having your Blade/Part class inherit an interface.

To the larger question now, if it's unnecessary to inherit the 'Contract' interface in my Blade/Part class, how is this workable in practice?  How do I know what properties to add to my class and what their typing should be?

Here, the 'Contract' interface is applied *implicitly* as part of the implementation of the Blade/Part TypeScript decorator.

So, once you've applied a TypeScript decorator to your Blade/Part class, TypeScript Intellisense and compiler errors should inform you what is missing from your Blade/Part class.  By mousing over Intellisense errors in your IDE, you can act on each of the TypeScript errors to:
- add a missing property
- determine the property's type or the return type of your added method.

If you iteratively refine your class based on Intellisense errors, once these are gone, you should be able to compile and run your new Blade / Part.  This technique is demonstrated in the intro [video](https://ibizareflectorprod.blob.core.windows.net/public/video.html).

<a name="defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-no-pdl-faq-how-do-i-know-what-types-to-return-from-the-oninitialize-method"></a>
#### How do I know what types to return from the <code>onInitialize</code> method?

Covered above, if you start by simply *not* using a 'return' statement in your `onInitialize` (or any other method required by you choice of TypeScript decorator), Intellisense errors will reflect the expected return type for the method:
```
public onInitialize() {
    // No return statement
}

...
```
<a name="no-pdl-error"></a>
```
Argument of type 'typeof TestTemplateBlade' is not assignable to parameter of type 'TemplateBladeClass'.
  Type 'TestTemplateBlade' is not assignable to type 'Contract<any, any>'.
    Types of property `onInitialize` are incompatible.
      Type '() => void' is not assignable to type '() => Promise<any>'.
        Type 'void' is not assignable to type 'Promise<any>'.
```
<a name="defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-no-pdl-faq-why-can-t-i-return-my-data-loading-promise-directly-from-oninitialize"></a>
#### Why can&#39;t I return my data-loading Promise directly from &#39;onInitialize&#39;

Extensions will see compile errors when then attempt to return from `onInitialize` the result of a call to `queryView.fetch(...)`, `entityView.fetch(...)`, `Base.Net.ajax2(...)`:
```
public onInitialize() {
    public { container, model, parameters } = this.context;
    public view = model.websites.createView(container);

    // Returns MsPortalFx.Base.PromiseV and not the required Q.Promise<any>.
    return view.fetch(parameters.websiteId).then(...);
}
```
Here, our FX data-loading APIs return an old `MsPortalFx.Base.PromiseV` type that is not compatible with the `Q.Promise` type expected for `onInitialize`.  To workaround this shortcoming of the FX data-loading APIs, until these APIs are revised you'll do:
```
    ...
    return Q(view.fetch(...)).then(...);
    ...
```
This application of `Q(...)` simply coerces your data-loading Promise into the return type expected for `onInitialize`.

<a name="defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-no-pdl-faq-i-don-t-understand-the-typescript-compilation-error-i-m-getting-around-my-no-pdl-blade-part-and-there-are-lots-of-them-what-should-i-do-here"></a>
#### I don&#39;t understand the TypeScript compilation error I&#39;m getting around my no-PDL Blade/Part.  And there are lots of them.  What should I do here?

Typically, around no-PDL Blades and Parts (and even old PDL-defined Blades/Parts), only the first 1-5 compilation errors are easily understandable and actionable.

Here, the best practice is to:
- **Focus on** errors in your Blade/Part TypeScript (and in PDL for old Blades/Parts)
- **Ignore** errors in TypeScript files in your extension's '_generated' directory
- Until compile errors in your Blade/Part named 'Foo' are fixed, **ignore** errors around uses of the corresponding, code-generated FooBladeReference/FooPartReference in `openBlade(...)` and `PartPinner.pin(...)`.
    - This is because errors in the 'Foo' Blade/Part will cause *no code* to be generated for 'Foo'.

Some gotchas to be aware of:
- **Read all lines of multi-line TypeScript errors** - TypeScript errors are frequently multi-line.  If you compile from your IDE, often only the first line of each error is shown and the first line is often not useful (see an example [here](#no-pdl-error)).  Be sure to look at the whole error, focusing on the last lines of the multi-line error message.
- **Don't suppress compiler warnings** - Ibiza compilation of no-PDL TypeScript decorators often generates build *warnings* that are specific to no-PDL and more actionable than TypeScript errors.  To easily understand warnings/errors and turn these into code fixes, be sure to read *all compiler warnings*, which some IDEs / command-line builds are configured to suppress.

<a name="defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-no-pdl-faq-how-do-i-add-an-icon-to-my-blade"></a>
#### How do I add an icon to my Blade?

Developers coming from PDL will be used to customizing their Blade's icon like so:
```
this.icon(MsPortalFx.Base.Images.Logos.MicrosoftSquares());  // For instance
```
With no-PDL decorators, developers are confused as to why this API isn't available in no-PDL.

To answer here, first, how *does* one add an icon to a no-PDL Blade?  You do this in two steps:
1. Associate the icon with your `<AssetType>`
```
<AssetType
    Name='Carrots'
    Icon='MsPortalFx.Base.Images.Logos.MicrosoftSquares()'
    ...
```
2. Associate your no-PDL Blade with your AssetType
```
import { AssetTypes, AssetTypeNames } from "../_generated/ExtensionDefinition";

@TemplateBlade.Decorator({
    forAsset: {
        assetType: AssetTypeNames.customer,
        assetIdParameter: "carrotId"
    }
})
export class Carrot {
    ...
}
```
Now, why is this so?  It seems easier to do this in a single-step at the Blade-level.  The answer here is that - according to Ibiza UX design - only Blades associated with a resource/asset should show a Blade icon.  To make this more obvious at the API level, as it stands, the only place to associate an icon for a Blade is on `<AssetType>`.

<a name="defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-no-pdl-faq-how-do-i-control-the-loading-indicators-for-my-blade-how-is-it-different-than-pdl-blades"></a>
#### How do I control the loading indicators for my Blade?  How is it different than PDL Blades?

[Controlling the loading indicator](portalfx-parts-revealContent.md) in Blades/Parts is the almost exactly the same for PDL and no-PDL Blades/Parts.  That is:
- An opaque loading indicator is shown as soon as the Blade/Part is displayed
- The FX calls `onInitialize` (no-PDL) or `onInputsSet` (PDL) so the extension can render its Blade/Part UI
- (Optionally) the extension can call `revealContent(...)` to show its UI, at which point a transparent/translucent loading indicator ("marching ants" at the top of Blade/Part) replaces the opaque loading indicator
- The extension resolves the Promise returned from `onInitialize` / `onInputsSet` and all loading indicators are removed.

The only difference with no-PDL here is that `onInitialize` replaces `onInputsSet` as the entrypoint for Blade/Part initialization.

For no-PDL, this is demonstrated in the sample [here](https://df.onecloud.azure-test.net/#blade/SamplesExtension/TemplateBladeWithSettings).

If yours is a scenario where your Blade/Part should show the loading indicators in response to some user interaction (like clicking 'Save' or 'Refresh'), read on...

<a name="defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-no-pdl-faq-when-should-i-use-the-operations-api-to-control-the-blade-part-s-loading-indicator"></a>
#### When should I use the &#39;operations&#39; API to control the Blade/Part&#39;s loading indicator?
There are scenarios like 'User clicks "Save" on my Blade/Part' where the extension wants to show loading indicators at the Blade/Part level.  What's distinct about this scenario is that the Blade/Part has already completed its initialization and, now, the user is interacting with the Blade/Part UI.  This is precisely the kind of scenario for the 'operations' API.

For no-PDL Blades/Parts, the 'operations' API is `this.context.container.operations`, and the API's use is described [here](portalfx-blades-templateBlade-advanced.md#showing-a-shield-loading-status-in-your-blade).  There is a sample to consult [here](https://df.onecloud.azure-test.net/#blade/SamplesExtension/TemplateBladeWithSettings).

<a name="defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-no-pdl-faq-how-can-i-save-some-state-for-my-no-pdl-blade-aka-blade-settings"></a>
#### How can I save some state for my no-PDL Blade (aka &quot;Blade settings)?
There is a decorator - `@TemplateBlade.Configurable.Decorator` for example, available on most Blade variations (`@TemplateBlade`, `@FrameBlade`, `@Blade.Decorator` but not `@MenuBlade.Decorator` or the menu portion of ResourceMenu Blades).  When applied, this decorator adds a `this.context.configuration` API that can be used to load/save Blade "settings".  See the "TemplateBladeWithSettings" sample here:

- https://df.onecloud.azure-test.net/#blade/SamplesExtension/TemplateBladeWithSettings
- https://msazure.visualstudio.com/One/_git/AzureUX-SamplesExtension?path=%2Fsrc%2FExtension%2FClient%2FV2%2FBlades%2FTemplate%2FTemplateBladeWithSettings.ts

Some guidelines using `@TemplateBlade.Configurable.Decorator` (across the supported no-PDL Blade variants):

- Only a small number of select Blades should use this “Blade settings” API, as the feature itself has a perf cost. Nearly all Blades should have no use for this feature.
- Don’t use the `SettingsScope.PerId` feature – This feature stores a discrete settings value for every resource the user navigates to (for a given Blade). As you can guess, this is where you can lose control of the scale/lifetime of settings you’re loading, and this can impact perf. There are no steps necessary to turn off this feature. You should simply not use this `SettingsScope.PerId` feature.
- An extension team has reported that the `sharedKey` feature that enables settings to be shared across different Blades (developed as different classes, that is) is broken. This feature has very little use in extensions (and possibly none), so no steps have been taken to verify the break and to fix it.
- The "Blade settings" feature is not supported for `@MenuBlade.Decorator` and not for the menu portion of your ResourceMenu Blade.

<a name="defining-blades-and-parts-using-typescript-decorators-a-k-a-no-pdl-no-pdl-faq-what-does-this-error-mean-blade-does-not-support-rebinding-use-the-rebindable-decorator-decorator"></a>
#### What does this error mean - &quot;Blade does not support rebinding. Use the &#39;@Rebindable.Decorator()&#39; decorator.&quot;?

There is an old Azure Portal performance optimization named "rebinding" that can be triggered when child Blades are opened by old PDL parent Blades.  Here, when the user clicks around multiple times in the parent PDL Blade - the Portal tries to reuse (that is, "rebind") any already-opened child Blade, as long as that child Blade has the same Blade name / extension name.  This "rebinding" optimization was aimed at "master-detail" scenarios that were prominent in early Azure Portal UI.  Teams often do not test this "rebind" scenario before deployment and consequently this "rebinding" optimization is a source of Portal bugs that **impacts reliability of child Blades (both PDL and no-PDL) opened by old PDL parent Blades**.

Regarding this error message, you'll see this error message for your no-PDL Blade **if "rebinding" is triggered by an old PDL parent Blade and yours is the opened child Blade**.

In these rare cases, what should you do when you see this error message?  You have two options, in order of preferability:
- Update the parent Blade to use modern Azure Portal controls and modern Blade-opening APIs.  Here, the parent Blade is likely authored in PDL, using the old Grid1 control or using Selectable-based Blade-opening APIs.  Updating the parent Blade is preferable because, then, this "rebinding" optimization will not be triggered by the parent Blade.  **No repairs are necessary for the child Blade in this case.**
- Apply the '`@TemplateBlade.Rebindable.Decorator()`' decorator to your child, no-PDL Blade (or the variant of the '`@Rebindable.Decorator()`' decorator for your chosen no-PDL Blade type).  The applied decorator will require that you also develop a '`rebind`' method where you'll update your Blade's UI to reflect a new set of '`this.context.parameters`' passed by the parent Blade.  Again, this is not the preferred mitigation for this error, because: (1) the performance optimization is likely not important to your scenario; (2) these additions add complexity to your child Blade that you must test and maintain over time.

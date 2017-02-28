
## TypeScript decorator support for extension metadata (formerly known as No-PDL or No PDL)

The Azure portal SDK requires developers to provide metadata for UI elements like blades and parts. The portal uses this metadata to build an inventory for your extension that is used internally.

Earlier versions of the SDK mandated that this metadata be provided via a proprietery language called **Portal Definition Language (PDL)**.  This resulted in extra files in your codebase, split the logic for a single UI entity into two different places, and added a new language for developers to learn.

The latest version of the SDK lets you provide this metadata using [TypeScript decorators](https://www.typescriptlang.org/docs/handbook/decorators.html).  With this approach the metadata and code for a blade or part all lives in a single file.  Because it's native TypeScript you'll also find that there is enhanced type checking support that becomes available. PDL is still supported for back compat reasons, but the decorators are the recommended pattern going forward.

The next few sections provide an overview on how to use these decorators.  Additionally, there is an [Introduction video](https://ibizareflectorprod.blob.core.windows.net/public/video.html) that walks through these concepts.

### Current TypeScript decorator support

The following SDK features can be built today with TypeScript decorators.  If you have access, you can explore the interfaces with jsdoc comments [directly in our source code](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FFramework.Client%2FTypeScript%2FFx%2FComposition&version=GBdev&_a=contents).  We will eventually export the jsdocs for the SDK to a public location.  That effort is in progress.

1. Template blades - A blade where you provide a template and a view model
1. Menu blades - A blade that exposes menu items where each item represents a blade
1. FrameBlades - A blade that provides you with an iframe where you fully own the blade content
1. Parts (tiles)
1. Frame parts

These SDK features cannot **(yet)** be built with decorators:

1. Unlocked blades - Blades with tiles on them - These will likely never get decorator support since that is not a pattern that is recommended for any experience.
1. The asset model - Defines the asset types (usually ARM resources) in your extension
1. Extension definition - A very small amount of PDL that provides general metadata about your extension

### Building a hello world template blade using decorators 

This section pulls from a sample that [you can see in the dogfood environment](https://df.onecloud.azure-test.net/?SamplesExtension=true#blade/SamplesExtension/TemplateBladesBlade/simpleTemplateBlade).

Here is an example of a very simple template blade, represented by a single TpeScript file in your extension project.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V2/Blades/Template/SimpleTemplateBlade.ts", "section": "docs#HelloWorld"}

This is the decorator code.  There are several options that can be specified as properties on the object passed into the decorator.  This sample shows the simplest scenario where you only need to provide an HTML template.  In this case, the template is provided inline, something the SDK supports for convinience.  You also have the ability to provide a relative path to an html file that contains the template (e.g. If your blade is in a file called `MyBlade.ts` then you can add a file right next to it called `MyBlade.html` and then pass `./MyBladeName.html` into the htmlTemplate property of the decorator).

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V2/Blades/Template/SimpleTemplateBlade.ts", "section": "docs#DecoratorReference"}

Additionally, the No-PDL programming model introduces (and requires) a context property to be present in your blade class. The context property is populated by the framework on your behalf and contains APIs you can call to interact with the shell.  You can learn more about the context property [here](###The context property).

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V2/Blades/Template/SimpleTemplateBlade.ts", "section": "docs#Context"}

### Building a menu blade using decorators

Below is an example of a menu blade build using decorators.  It uses the `@MenuBlade` decorator.  This decorator puts two constraints on your type.

1.  It makes the public `viewModel` property required.  The property is of type `MenuBlade.ViewModel2` and provides you with APIs to setup the menu.
2.  It makes the public 'context' property required.  The property is of type `MenuBlade.Context`.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V2/Blades/Template/TemplateBladesBlade.ts", "section": "docs#HelloWorldMenuBlade"}

### The context property

The context property contains APIs you can call to interact with the shell. It will be populated for you by the framework before your `onInitialize()` function is called.  **It will not be populated in your constructor.  In fact, we advise against having a constructor and instead doing all initialization work in the onInitialize function.** This is a fairly common [Dependency injection technique](https://en.wikipedia.org/wiki/Dependency_injection).

Declaring the type of this property can be a little tricky, and the declaration can change if more No-PDL decorators are added to your file.  This is because certain APIs on the context object get enhanced when new decorators are used.  Let's start with a basic example and build from there.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/V2/Blades/Template/SimpleTemplateBlade.ts", "section": "docs#Context"}

This is the simplest declaration of the context property.  The framework provided `TemplateBlade.Context` type takes in two generic parameters. The first parameter represents the type of object that represents the parameters to the blade.  This simple blade takes no parameters, hence the value of `void` for the first generic parameter.  The second generic parameter represents the type of your model data, which – today – must be the DataContext object for your Blade/Part. This makes the context property aware of your data context in a strongly typed way.

Note that in this example there is an API on the context called `context.container.closeCurrentBlade()`.  This function takes no parameters.

Now let's say you're changing this blade so that it returns data to its parent (i.e. the blade or part that opened it). First, you would add the returns data decorator. **Note that not all blades need this behavior, and it does come with the consequence that the child blade is not deep-linkable if it requires a parent blade. Use only as appropriate.**

```typescript
        @TemplateBlade.ReturnsData.Decorator()
```
That will cause a compiler error because that decorator changes the context in a way that must be declared.  The `closeCurrentBlade()` function that previously took no arguments now needs to accept the data to return to the parent blade. 

To fix the error, add `& TemplateBlade.ReturnsData.Context<{ value: string }>` to the declaration like this.

        public context: TemplateBlade.Context<void, BladesArea.DataContext> & TemplateBlade.ReturnsData.Context<{ value: string }>;

This uses TypeScript [intersection types](https://www.typescriptlang.org/docs/handbook/advanced-types.html) to overload the closeCurrentBlade function to look like this `closeCurrentBlade(data: { value: string })` so that when you use it the compiler will enforce that data is provided to it like this:

```typescript
context.container.closeCurrentBlade({
    value: "Data to return to parent blade"
});
```

Intersection types combine the members of all types that get and'd (&'d) together.

When you build your project, the compiler will also produce an auto generated blade reference file that gives the same level of type safety to the parent blade.  Here is code that the parent blade would have.  Note that the callback that fires when `SimpleTemplateBlade` closes has the type information about the data being returned.

```typescript
context.container.openBlade(new BladeReferences.SimpleTemplateBlade((reason: BladeClosedReason, data: {value: string}) => {
    if (reason === BladeClosedReason.ChildClosedSelf) {
        const newValue = data && data.value ? data.value : noValue;
        this.previouslyReturnedValue(newValue);
    }
}));
```
Each time you add an additional decorator you will need to incorporate it into the context declaration as we did here. 
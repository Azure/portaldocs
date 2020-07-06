<a name="navigating-to-other-content"></a>
# Navigating to other content

<a name="navigating-to-other-content-opening-blades"></a>
## Opening blades

This section describes how to open blades using container APIs. A working copy of blades that open and close is located at [http://aka.ms/portalfx/samples#blade/SamplesExtension/SDKMenuBlade/openbladeapi](http://aka.ms/portalfx/samples#blade/SamplesExtension/SDKMenuBlade/openbladeapi).

**NOTE**: In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory, and  `<dirParent>`  is the `SamplesExtension\` directory, based on where the samples were installed when the developer set up the SDK. If there is a working copy of the sample in the Dogfood environment, it is also included.

For more information about the legacy declarative API's, see [top-legacy-blades-opening-and-closing.md](top-legacy-blades-opening-and-closing.md).

<a name="navigating-to-other-content-container-apis"></a>
## Container APIs

It is recommended that extensions use the container APIs. Typically, each of these methods returns a `promise` that returns `true`. If a blade on the screen contains  unsaved edits to a form, the Framework will issue a prompt that allows the user to keep the unsaved blade open. If the user chooses to continue working on their unsaved edits, then the `promise` that is returned when the blade closes will return `false`.

<a name="navigating-to-other-content-container-apis-strongly-typed-blade-reference-types"></a>
### Strongly typed blade reference types

A strongly typed blade reference type is auto-generated for each blade in the project when the extension is compiled. For example, if the blade is named 'MyBlade', then a **TypeScript** definition for 'MyBlade' will be generated and automatically show up in IntelliSense when using the `BladeReferences.forBlade("blade_name")` API in the `Fx/Composition` module. These blade reference types are used to open blades programmatically. Blade references for `parameterProviders` have a different signature that is similar to the options that are provided to the `ParameterCollector` class.

In the following example, the `WebsiteBlade` accepts parameters and callback functions that allow the child blade to communicate with the parent blade. In this instance, the `BladeReference` that is instantiated represents a Website blade, and is fully type checked, including the string for the blade name.

```javascript
import { BladeReferences } from "Fx/Composition";
…
var bladeRef = BladeReferences.forBlade("WebsiteBlade").createReference({
    parameters: { id: "_ARM_ID_HERE" }
});
```

Blade references are also generated for external extensions. The compiler creates a blade references definition file for every PDE file that is included, which will automatically show up in IntelliSense when using the `BladeReferences.forExtension("extension_name")` API in the `Fx/Composition` module.

Perform the following steps to open a blade from  a different extension.

1. Ensure the project references the external extension's PDE file.

1. Import `Fx/Composition` module, as in the following example.

    ```javascript
    import { BladeReferences } from "Fx/Composition"
    ```

1. Create the blade reference using the strongly typed parameters, as in the following example.

    ```javascript
    const bladeReference = BladeReferences.forExtension("HubsExtension").forBlade("LocationPickerV3Blade").createReference({
        supplyInitialData: () => { ... }
        receiveResult: () => { ... }
    });
    ```

<a name="navigating-to-other-content-container-apis-open-blade-methods"></a>
### Open blade methods

The following `openBlade` methods are now available on the template blade container.

<!-- TODO: Determine whether   openContextBlade exists on this object. -->

```javascript
    // opens a blade right now
    openBlade(bladeToOpen: BladeReference): Promise<boolean>;

    // displays the blade placeholder right now, but shows a spinner until the given promise resolves
    openBladeAsync(promiseToDetermineBladeToOpen: Promise<BladeReference>): Promise<boolean>;

    // opens a context blade right now
    openContextBlade(bladeToOpen: BladeReference): Promise<boolean>;

    // displays the context blade placeholder right now, but shows a spinner until the given promise resolves
    openContextBladeAsync(promiseToDetermineBladeToOpen: Promise<BladeReference>): Promise<boolean>;
```

<a name="navigating-to-other-content-container-apis-opening-blades-within-the-menu"></a>
### Opening blades within the menu

When the template blade is in the context of a menu blade, for example, when the template blade is the child of a menu blade, the following methods are available on the `menu` object within the PDL `container` object or the no-PDL `context` object.

**NOTE**: If the blade is opened outside the context of a `MenuBlade`, then the `MenuBlade` will be null. If so, the extension should account for that by including the standard blade opening APIs.

```typescript
    /**
    * This method causes the menu blade to navigate to a different item
    *
    * @param id Identifier of the item to navigate too
    */
    switchItem(id: string): void;

    /**
    * Opens a child Blade in place.
    *
    * @param bladeToOpen A BladeReference describing the Blade to be opened.
    */
    openBlade(bladeToOpen: BladeReference): Promise<boolean>;

    /**
    * Opens a child Blade asynchronously in place. While the Blade to be shown is being determined (via 'bladeReferencePromise') a loading
    * indicator will be displayed on the new child Blade.
    *
    * @param promiseToDetermineBladeToOpen A Promise that will be resolved with a BladeReference describing the Blade to be opened.
    */
    openBladeAsync(promiseToDetermineBladeToOpen: Promise<BladeReference>): Promise<boolean>;
```

Each of these methods returns a `promise` that typically returns `true`. If a blade on the screen contains unsaved edits to a form, the Framework will prompt the user, giving them the option to keep the unsaved blade open. If the user chooses to continue working on their unsaved edits then the blade opening promise will return false.

For the asynchronous methods, your code provides a `promise`. If that `promise` fails or is rejected, then the promise returned from this API contains a value of `false`.

<a name="navigating-to-other-content-container-apis-click-callbacks"></a>
### Click callbacks

In many cases, blade opening is the result of a user interaction, like a click. Many Portal controls support click callbacks. The blade opening APIs can be used within these callbacks. If the control supports highlighting the item that was clicked, like the grid, then the highlight automatically will be added to the click target and cleared when the child blade closes.

The following examples open blades when controls are clicked.

* Button

    This control opens a blade when a button is clicked, as in the following example.

    ```javascript
    var button = new Button.create({
        // … skipping over other button options
        onClick: () => {
            container.openBlade(BladeReferences.forBlade("SomeBlade").createReference());
        }
    });
    ```

* Custom HTML

    This control opens a blade when the user clicks on an **HTML** element that uses the `fxclick` **Knockout** data-binding, as in the following example.

    ```javascript

    // Your html template
    <a href="#" data-bind="fxclick: myOnClick">Click me!</a>

    // Your template blade or part view model
    public myOnClick(): void {
        container.openBlade(BladeReferences.forBlade("SomeBlade").createReference());
    }
    ```

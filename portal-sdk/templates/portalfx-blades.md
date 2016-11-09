<properties title="" pageTitle="Blades" description="" authors="adamabdelhamed" />

## Blades

Blades are the main UI container in the portal equivalent to "Windows" or "Pages" in other UX frameworks.

There are different types of blades that you can use:

Type | Description | Use For...
--- | --- | ---
**TemplateBlade** | This is the main and **recommended** authoring model for UI in the portal. The basic idea is that you provide an HTML template with your UI and a ViewModel with the logic that binds to that HTML template.<br/> [TemplateBlade walkthough](/documentation/articles/portalfx-blades-templateBlade) <br/>[Learn more about TemplateBlade](/documentation/articles/portalfx-blades-templateBlade-reference) | Creating any portal blade!
**MenuBlade** | Show a menu at the left of a blade. This blade gets combined by the Shell with the blade that its opened at its right.<br/> [Learn more about MenuBlade](/documentation/articles/portalfx-blades-menublade) | Left side vertical menu
**Fx Blades** | The framework provides a limited set of built-in blades that encapsulate common patterns (like properties, quick start, create forms, etc.). <br/> [Learn more about FxBlades](/documentation/articles/portalfx-blades-bladeKinds) | Properties, Quickstart, Coming Soon, Create  
**AppBlade** | This type of blade provides you an IFrame to host your UI enabling full flexibility and control. In this case you **won't** be able to use Ibiza Fx controls and will be fully responsible for accessibility, theming, and consistency.<br/> [Learn more about AppBlade](/documentation/articles/portalfx-blades-appblades) | Rehost an existing experience or create a UI not supported by the Fx
**Blade with tiles** | This is our **legacy** authoring model. In this case you author your blades as a combination of lenses and parts. Given the complexity associated with this model, we are discouraging extension authors from using it.<br>[Learn more about legacy blades](/documentation/articles/portalfx-blades-legacy) | Legacy


 {"gitdown": "include-file", "file": "../templates/portalfx-blades-templateBlade.md"}
 {"gitdown": "include-file", "file": "../templates/portalfx-blades-templateBlade-reference.md"}
 {"gitdown": "include-file", "file": "../templates/portalfx-blades-templateBlade-advanced.md"}
 {"gitdown": "include-file", "file": "../templates/portalfx-blades-menublade.md"}
 
 {"gitdown": "include-file", "file": "../templates/portalfx-blades-bladeKinds.md"}
 {"gitdown": "include-file", "file": "../templates/portalfx-blades-appblades.md"}
 {"gitdown": "include-file", "file": "../templates/portalfx-blades-legacy.md"}


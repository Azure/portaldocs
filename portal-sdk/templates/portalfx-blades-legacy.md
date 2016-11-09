<properties title="" pageTitle="Blades" description="" authors="adamabdelhamed" />

### Introduction to Blades

A blade is the vertical container that acts as the starting point for any journey. You can define multiple blades, each containing their own collection of statically defined lenses and parts.

![Blade][blade]

Defining a blade in PDL is simple. Blades can be created in any PDL file, and they will be aggregated at compile time into the extension definition:

`\Client\Blades\Locked\Locked.pdl`

```xml
<Blade Name="LockedBlade"
       ViewModel="LockedBladeViewModel">
    <Lens>
        ...
    </Lens>
</Blade>
```

Blades use view models to drive dynamic content include titles, icons, and status.  To learn more about blades, start with the following topics:

* [Controlling blade UI](/documentation/articles/portalfx-blades-ui)
* [Opening blades](/documentation/articles/portalfx-blades-opening)
* [Blade parameters](/documentation/articles/portalfx-blades-parameters)
* [Blade properties](/documentation/articles/portalfx-blades-properties)
* [Blade outputs](/documentation/articles/portalfx-blades-outputs)
* [Pinning blades](/documentation/articles/portalfx-blades-pinning)
* [Blade Kinds](/documentation/articles/portalfx-blades-bladeKinds)
* [Closing blades](/documentation/articles/portalfx-blades-closing)

* Controlling blade UI
 {"gitdown": "include-file", "file": "../templates/portalfx-blades-ui.md"}

* Opening blades
 {"gitdown": "include-file", "file": "../templates/portalfx-blades-opening.md"}

* Blade parameters
 {"gitdown": "include-file", "file": "../templates/portalfx-blades-parameters.md"}

* Blade properties
 {"gitdown": "include-file", "file": "../templates/portalfx-blades-properties.md"}

* Blade outputs
 {"gitdown": "include-file", "file": "../templates/portalfx-blades-outputs.md"}

* Pinning blades 
{"gitdown": "include-file", "file": "../templates/portalfx-blades-pinning.md"}

* Closing blades
{"gitdown": "include-file", "file": "../templates/portalfx-blades-closing.md"}

[blade]: ../media/portalfx-blades/blade.png


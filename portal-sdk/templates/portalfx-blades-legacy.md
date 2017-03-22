
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

* [Controlling blade UI](portalfx-blades-ui.md)
* [Opening blades](portalfx-blades-opening.md)
* [Blade parameters](portalfx-blades-parameters.md)
* [Blade properties](portalfx-blades-properties.md)
* [Blade outputs](portalfx-blades-outputs.md)
* [Pinning blades](portalfx-blades-pinning.md)
* [Blade Kinds](portalfx-blades-bladeKinds.md)
* [Closing blades](portalfx-blades-closing.md)

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


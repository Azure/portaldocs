<properties title="" pageTitle="BladeKinds" description="" authors="adamabdelhamed,ashergarland" />

### Introduction to Blade Kinds
Blade Kinds are common implementations of Blade experience which offer consistent UI and are easily implemented. Blade Kinds provide a simplified programming model with a closed UI. 

All you need to provide is the ViewModel. Advantages you receive beyond is simplicity; when the Blade Kinds are updated, you can use the updates and the layout without having to change your implementation.

Defining a Blade using a Blade Kind in PDL is a simplified version of the typical Blade PDL. All you need is to define multiple view models, typically a view model for the blade and a view model for the part.

```xml
<azurefx:QuickStartBlade ViewModel="" PartViewModel=""/>
```

To learn more about each of the Blade Kinds, start with the following topics:

- [QuickStart Blade](/documentation/articles/portalfx-blades-bladeKinds-quickStart)
- [Properties Blade](/documentation/articles/portalfx-blades-bladeKinds-properties)
- [Notice Blade](/documentation/articles/portalfx-blades-bladeKinds-notice)
- [Setting List Blade](/documentation/articles/portalfx-blades-bladeKinds-settingList)

 {"gitdown": "include-file", "file": "../templates/portalfx-blades-bladeKinds-quickStart.md"}
 {"gitdown": "include-file", "file": "../templates/portalfx-blades-bladeKinds-properties.md"}
 {"gitdown": "include-file", "file": "../templates/portalfx-blades-bladeKinds-notice.md"}
 {"gitdown": "include-file", "file": "../templates/portalfx-blades-bladeKinds-settingList.md"}

[part]: ../media/portalfx-bladeKinds/BladeKindsIntro.png
* [UI Concepts](#ui-concepts)
    * [The dashboard](#ui-concepts-the-dashboard)
    * [Blades](#ui-concepts-blades)
    * [Commands](#ui-concepts-commands)
    * [Parts](#ui-concepts-parts)
    * [Top bar](#ui-concepts-top-bar)
    * [Left nav](#ui-concepts-left-nav)
    * [Marketplace](#ui-concepts-marketplace)


<a name="ui-concepts"></a>
## UI Concepts
Before you start building an extension for the portal, take a few minutes to review our terminology and concepts.

<a name="ui-concepts-the-dashboard"></a>
### The dashboard

The dashboard is the first thing users see when they sign in to the portal. It's fully customizable - users can resize, re-order, pin, or unpin tiles to create a unique start experience. It also includes an integrated tile gallery, where users can pick and choose from new tiles that display information most relevant to them (and their resources). 

![dashboard][dashboard]

<a name="ui-concepts-blades"></a>
### Blades

Blades are the primary way that users navigate through the portal. They show contextual information based on the object that opens them. There are several different blades types, but for the most part you can group them into two categories: non-customizable (or locked) blades, and customizable (or unlocked) blades. New blades open left to right, and stay open so users can visualize where they are in their workflow.

![Blade][blade]

<a name="ui-concepts-blades-templateblade"></a>
#### TemplateBlade

This is the main and recommended authoring model for UI in the portal. The basic idea is that you provide an HTML template with your UI and a ViewModel with the logic that binds to that HTML template.

<a name="ui-concepts-blades-menublade"></a>
#### MenuBlade

Show a menu at the left of a blade. This blade gets combined by the Shell with the blade that its opened at its right.


<a name="ui-concepts-blades-locked-blades"></a>
#### Locked blades

Locked blades are usually task-focused (looking at a list of data, performing an action, etc.) and can't be user customized. 
You should only use a Blade or Locked Blade when creating Resource blade. 

[Learn more](portalfx-blades.md)

<a name="ui-concepts-commands"></a>
### Commands

Users click a command to take a specific action in a specific resource. Commands can show dialogs to confirm a direct action, or they can open blades to perform an indirect action. Never use commands as a navigation tool.

![Command][command]

[Learn more](portalfx-commands.md)

<a name="ui-concepts-parts"></a>
### Parts

A tile is the core UI component in the portal. Each one contains chunks of information updated in real time. Tiles can be resized, removed, pinned, or dragged to another blade. 

Design each tile to work in at least 3 different sizes so they can be easily customized. UX and Dev need to create multiple layouts and define the appropriate data ramp to make sure that larger parts provide additional data and context.

![Part][part]

[Learn more](portalfx-parts.md)

<a name="ui-concepts-top-bar"></a>
### Top bar

The top nav exposes global search (search works against resources only), notifications, settings, help, feedback and user directories (if they have more than one).

The top nav bar doesn't require any extension-specific work from you. 


<a name="ui-concepts-left-nav"></a>
### Left nav

By default, the left nav shows the most-used Azure services. Users can click **Favorites** in the Browse menu to add, remove, or reorder services.

The left nav doesn't require any extension-specific work from you.

<a name="ui-concepts-marketplace"></a>
### Marketplace

The marketplace houses all Microsoft and partner offerings, ranging from simple resources to complex multi-tier applications. Each can be installed using a simple wizard.

Before your package is allowed into the marketplace, you'll need to onboard with the Marketplace team. You'll also be expected to supply a set of marketplace icons for each one of your packages.  


[Learn more](portalfx-ux-gallery.md)



[blade]: ../media/portalfx-ui-concepts/blade.png
[part]: ../media/portalfx-ui-concepts/part.png
[command]: ../media/portalfx-ui-concepts/command.png
[journey]: ../media/portalfx-ui-concepts/journey.png
[hub]: ../media/portalfx-ui-concepts/hub.png
[dashboard]: ../media/portalfx-ui-concepts/dashboard.png
[gallery]: ../media/portalfx-ui-concepts/gallery.png
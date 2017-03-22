
<a name="removig-a-part-from-a-blade-s-default-layout"></a>
### Removig a part from a blade&#39;s default layout
Your unlocked blade's default layout should be reflective of tiles you think provide the most out of the box value to users while meeting your performance goals.  That layout may change over time, and you may decide that a part that included in a blade's default layout at one point in time should not be included going forward.  

If you find yourself in that position this is what you should do.

If your part was defined inline as a `<Part/>` or `<CustomPart>` element within a `<Blade/>` and `<Lens/>` then you have the pre-step of moving that part out of the blade and into your extension's global part catalog.

Else if your part is already defined in the global part catalog or is defined in another extension then you currently have a `<PartReference/>` tag in your blade rather than a `<Part/>` tag.

Next, you should replace your `<Part/>` or `<PartReference/>` tag with the `<RedirectPart/>` tag.

At this point we need to keep in mind that our goal is to remove the part from the default layout, but we still want to continue supporting instances of the part that users have pinned to their startboards.  You may also choose to allow new users to  find the part in the tile gallery.  If your goal was to permanently retire a part, including removing support for pinned instances and the tile gallery then read [How to permanently retire a part](portalfx-parts-how-to-retire.md).

We use the `<Preserve/>` tag to properly configure the `<RedirectPart/>` to preserve pinned instances.

```xml
<RedirectPart Name="SAME EXACT NAME THAT WAS USED IN THE TAG THIS IS REPLACING">
    <Preserve PartType="NAME OF THE GLOBAL PART THAT DEFINES THE PART BEHAVIOR"
                        Extension="ONLY APPLICABLE IF THE PART IS DEFINED IN A DIFFERENT EXTENSION"/>
</RedirectPart>
```

<a name="icons"></a>
# Icons

When you're ready to start adding icons in parts, commands, or blades, the portal places some special requirements on the types of icons you can use.  All icons are required to be SVG files - this allows for icons that will scale on high resolution devices, and for automatic theming.

In many cases, you will not need to provide your own icons, as the SDK framework includes a large library of icons that can be used off the shelf.

<a name="icons-using-built-in-icons-portalfx-icons-builtin-md"></a>
## <a href="portalfx-icons-builtin.md">Using built-in icons</a>
<a name="icons-creating-icons-portalfx-icons-creation-md"></a>
## <a href="portalfx-icons-creation.md">Creating icons</a>
<a name="icons-faqs-portalfx-icons-faq-md"></a>
## <a href="portalfx-icons-faq.md">FAQs</a>

<a name="icons-faqs-portalfx-icons-faq-md-special-msportalfx-base-images-calls"></a>
### Special MsPortalFx.Base.Images Calls

  * **MsPortalFx.Base.Images.Blank()** \- Doesn't render any SVG element, overrides the default icon.
  * **MsPortalFx.Base.Images.Custom** \- Triggers loading a custom SVG's from your project, this is built into your SVG bundle definition. So you shouldn't normally need to call it.
  * **MsPortalFx.Base.Images.ImageUri()** \- Used to add non SVG images. *Not recommended*

<a name="icons-faqs-portalfx-icons-faq-md-using-the-built-in-svg-s-command-bar-example"></a>
### Using the built in SVG&#39;s (Command Bar Example).

Here is a simple example of using a build in SVG on the command bar:

```ts
export class DeleteCommandViewModel implements MsPortalFx.ViewModels.CommandContract {
    public icon = ko.observable<MsPortalFx.Base.Image>();

    constructor(dataContext: WebsitesDataContext) {
        this.icon(MsPortalFx.Base.Images.Delete());
    }
}
```

<a name="icons-faqs-portalfx-icons-faq-md-setting-up-your-project-file-to-use-custom-svg-s"></a>
### Setting up your project file to use Custom SVG&#39;s.

1. Add this to your .csproj :

```xml
<SvgTypeScriptCompile Include="Client\_generated\Svg.ts">
  <Namespace>SamplesExtension</Namespace>
  <IsAmd>true</IsAmd>
</SvgTypeScriptCompile>
```

2. Add your SVG's to your project and assign their build action to 'Svg' like so:
```xml
<Svg Include="Content\SamplesExtension\Images\sample.svg" />
```

3. Then you can import the **Svg** module (or whatever you named it above) in any file you need to use custom images:

```ts
import Svg = require ("./../_generated/Svg");
...
this.icon(Svg.Content.SamplesExtension.Images.robot);
```

You now you will be able to reference your SVG's images

Be sure not to check the generated Svg.ts file in source control, as it updates whenever you add/remove/change an svg.

<a name="icons-faqs-portalfx-icons-faq-md-tips-tricks"></a>
### Tips &amp; Tricks

- Do not name your SVG's <a href="http://msdn.microsoft.com/en-us/library/ie/0779sbks(v=vs.94).aspx" target="_blank">JavaScript reserved words</a> (ie delete).

<a name="icons-faqs-portalfx-icons-faq-md-tips-tricks-using-custom-svg-s-in-pdl"></a>
#### Using custom SVG&#39;s in PDL.
  This is the common pattern when using icons in PDL, see the Icon attribute below:
  ```xml
     <AssetType Name="Engine"
                Text="{Resource engineSearchProviderKey, Module=ClientResources}"
                Icon="{Resource Content.SamplesExtension.Images.engine, Module=./../Generated/SvgDefinitions}"
                BladeName="EngineBlade"
                PartName="EnginePart">
  ```

<a name="icons-faqs-portalfx-icons-faq-md-tips-tricks-using-custom-svg-s-in-the-command-bar"></a>
#### Using custom SVG&#39;s in the command bar.

  1. Add SVGS's to your project and include the generated file as described above.
  2. AMD example (Assuming we have `<Svg Include="Content\Images\Commandbar_Trash.svg" />` included in the project file):
  3. ```ts
    import CustomSvgImages = require("./SvgDefinitions.js");
    export class DeleteCommandViewModel implements MsPortalFx.ViewModels.CommandContract {
        public icon = ko.observable<MsPortalFx.Base.Image>();

        constructor(dataContext: WebsitesDataContext) {
            this.icon(CustomSvgImages.Content.MsPortalFx.Images.commandbar_Trash);
        }
    }
    ```

<a name="icons-faqs-portalfx-icons-faq-md-tips-tricks-using-png-s-with-the-custom-data-binding-image-for-command-bar"></a>
#### Using PNG&#39;s/ with the custom data binding &#39;image&#39;.(for command bar)

This lets you switch between SVG's and normal images while using the same data binding.

```ts
export class DeleteCommandViewModel implements MsPortalFx.ViewModels.CommandContract {
    public icon = ko.observable<MsPortalFx.Base.Image>();

    constructor(dataContext: WebsitesDataContext) {
        //SVG version
        //this.icon(MsPortalFx.Base.Images.Start());

        //PNG Version
        this.icon(MsPortalFx.Base.Images.ImageUri(MsPortalFx.Base.Resources.getContentUri("Content/RemoteExtension/Images/Website_Commandbar_Play.png")));
    }
}
```

<a name="icons-faqs-portalfx-icons-faq-md-tips-tricks-using-palettes"></a>
#### Using Palettes

You can change the color of most icons provided by the framework (All the ones at the root namespace ie
`MsPortalFx.Base.Images.Add()` but not `MsPortalFx.Base.Images.Polychromatic.PowerUp()`)

To do so all you need to do is add {palette: MsPortalFx.Base.ImagePalette.*} inside the function

```ts
import CustomSvgImages = require("./SvgDefinitions.js");
...
export class DeleteCommandViewModel implements MsPortalFx.ViewModels.CommandContract {
    public icon = ko.observable<MsPortalFx.Base.Image>();

    constructor(dataContext: WebsitesDataContext) {
        this.icon(MsPortalFx.Base.Images.Delete({palette: MsPortalFx.Base.ImagePalette.Blue}));
    }
}
```

Next steps: [Using built-in icons](portalfx-icons-builtin.md)

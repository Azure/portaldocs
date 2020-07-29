<a name="icons"></a>
# Icons

When you're ready to add icons in parts, commands, or blades, the portal places some special requirements on the types of icons you can use. All icons are required to be SVG file. This allows for icons that will scale on high resolution devices, and for a certain level of automatic theming.

In many cases, you will not need to provide your own icons, as the SDK framework includes a large library of icons that can be used off the shelf.

<a name="icons-learn-about-the-built-in-icons-provided-in-the-framework-portalfx-icons-builtin-md"></a>
## <a href="portalfx-icons-builtin.md">Learn about the built-in icons provided in the framework</a>

<a name="icons-learn-about-creating-custom-icons-portalfx-icons-creation-md"></a>
## <a href="portalfx-icons-creation.md">Learn about creating custom icons</a>

<a name="icons-read-the-faq-portalfx-icons-faq-md"></a>
## <a href="portalfx-icons-faq.md">Read the FAQ</a>

<a name="icons-using-the-built-in-svgs-command-bar-example"></a>
## Using the built in SVGs (Command Bar Example)

Here is a simple example of using a build in SVG on the command bar:

```ts
export class DeleteCommandViewModel implements MsPortalFx.ViewModels.CommandContract {
    public icon = ko.observable<MsPortalFx.Base.Image>();

    constructor(dataContext: WebsitesDataContext) {
        this.icon(MsPortalFx.Base.Images.Delete());
    }
}
```

<a name="icons-setting-up-your-project-file-to-use-custom-svgs"></a>
## Setting up your project file to use Custom SVGs

1. Add this to your .csproj:

```xml
<SvgTs Include="Content\Images\*.svg">
  <OutputFile>Client\_generated\Svg\%(Filename).ts</OutputFile>
</SvgTs>
```

2. Import your image in any file you need to use custom images:

```ts
import * as SampleSvg from "./../_generated/sample.svg";
...
this.icon(MsPortalFx.Base.Images.CustomImageWithOptions(SampleSvg, customImageOptions));
```

You now you will be able to reference your SVG images

Be sure not to check the generated Svg.ts file in source control, as it updates whenever you add/remove/change an svg.

<a name="icons-special-msportalfx-base-images-functions"></a>
## Special <code>MsPortalFx.Base.Images</code> functions

The framework offers a few special functions to render images for certain specific scenarios.

| Function                                | Usage                                                                                                                                                                                                       |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`MsPortalFx.Base.Images.Blank()`**    | Doesn't renders any SVG element. This overrides the default icon.                                                                                                                                           |
| **`MsPortalFx.Base.Images.Custom()`**   | Triggers loading a custom SVG from your project. This is built into your SVG bundle definition. You shouldn't normally need to call this function. Instead, use the custom reference directly into the API. |
| **`MsPortalFx.Base.Images.ImageUri()`** | Used to add non SVG images. _Not recommended_                                                                                                                                                               |

<a name="icons-tips-tricks"></a>
## Tips &amp; Tricks

<a name="icons-tips-tricks-naming"></a>
### Naming

Do not name your SVGs with <a href="http://msdn.microsoft.com/en-us/library/ie/0779sbks(v=vs.94).aspx" target="_blank">JavaScript reserved words</a> (ex: delete).

<a name="icons-tips-tricks-using-custom-svgs-in-pdl"></a>
### Using custom SVGs in PDL

This is the common pattern when using icons in PDL, see the Icon attribute below:

```xml
<AssetType Name="Engine"
           Text="{Resource engineSearchProviderKey, Module=ClientResources}"
           Icon="{Resource Content.SamplesExtension.Images.engine, Module=./../Generated/SvgDefinitions}"
           BladeName="EngineBlade"
           PartName="EnginePart">
```

<a name="icons-tips-tricks-using-custom-svgs-in-the-command-bar"></a>
### Using custom SVGs in the command bar

Add SVGs to your project and include the generated file as described above.

2. AMD example (Assuming we have `<Svg Include="Content\Images\Commandbar_Trash.svg" />` included in the project file):

```ts
import CustomSvgImages = require("./SvgDefinitions.js");
export class DeleteCommandViewModel implements MsPortalFx.ViewModels.CommandContract {
    public icon = ko.observable<MsPortalFx.Base.Image>();

    constructor(dataContext: WebsitesDataContext) {
        this.icon(CustomSvgImages.Content.MsPortalFx.Images.commandbar_Trash);
    }
}
```

<a name="icons-tips-tricks-using-pngs-with-the-custom-data-binding-image-for-command-bar"></a>
### Using PNGs with the custom data binding &#39;image&#39; (for command bar)

This lets you switch between SVGs and normal images while using the same data binding.

```ts
export class DeleteCommandViewModel implements MsPortalFx.ViewModels.CommandContract {
    public icon = ko.observable<MsPortalFx.Base.Image>();

    constructor(dataContext: WebsitesDataContext) {
        //SVG version
        //this.icon(MsPortalFx.Base.Images.Start());

        //PNG Version
        this.icon(
            MsPortalFx.Base.Images.ImageUri(
                MsPortalFx.Base.Resources.getContentUri("Content/RemoteExtension/Images/Website_Commandbar_Play.png")
            )
        );
    }
}
```

<a name="icons-tips-tricks-using-palettes"></a>
### Using Palettes

You can change the color of most icons provided by the framework (All the ones at the root namespace ie
`MsPortalFx.Base.Images.Add()` but not `MsPortalFx.Base.Images.Polychromatic.PowerUp()`)

To do so all you need to do is add `{palette: MsPortalFx.Base.ImagePalette.*}` inside the function

```ts
import * as CustomSvgImages from "./SvgDefinitions.js";
...
export class DeleteCommandViewModel implements MsPortalFx.ViewModels.CommandContract {
    public icon = ko.observable<MsPortalFx.Base.Image>();

    constructor(dataContext: WebsitesDataContext) {
        this.icon(MsPortalFx.Base.Images.Delete({palette: MsPortalFx.Base.ImagePalette.Blue}));
    }
}
```

<a name="icons-tips-tricks-preserving-icon-coloring-when-user-changes-theme"></a>
### Preserving icon coloring when user changes theme

For any [built-in monochromatic icon](https://df.onecloud.azure-test.net/#blade/SamplesExtension/IconsMonochromaticBlade) (a.k.a. flat icon), their fill color changes relative to the portal's themes within their context. The change only applies to the `fill` property of the SVG. Other coloring is left intact, including `stroke`.

Example of the rendering in major theme modes:

| Light mode                                                       | Dark mode                                                       |
| ---------------------------------------------------------------- | --------------------------------------------------------------- |
| In light theme, monochromatic icon is presented with color black | In dark theme, monochromatic icon is presented with color white |
| ![Flat icons with light theme][icon-light-theme]                 | ![Flat icons with dark theme][icon-dark-theme]                  |

If you would like to have color of your icon **_NOT_** be impacted by theme changes, you can embed the fill color in the SVG itself.

Next steps: [Using built-in icons](portalfx-icons-builtin.md)

[icon-light-theme]: ../media/portalfx-icons/icon-light-theme.PNG
[icon-dark-theme]: ../media/portalfx-icons/icon-dark-theme.PNG

* [<a name="statuscolortext"></a>Coloring to convey status](#a-name-statuscolortext-a-coloring-to-convey-status)
* [<a name="bgcolortext"></a>Coloring to differentiate data](#a-name-bgcolortext-a-coloring-to-differentiate-data)
* [<a name="svgcolortext"></a>Coloring SVG](#a-name-svgcolortext-a-coloring-svg)


 <h1 name="portalfx-extension-style-guide"></h1>
  <h1 name="portalfx-style-guide"></h1>
 # Style Guide

The portal includes a built in list of CSS classes that may be used inside of your templates.

Browse the following topics to learn about portal styling:

 <h1 name="portalfx-style-guide-custom-css-file"></h1>
 ## Style Guide: Custom CSS Files

Extension developers may choose to combine commonly used classes into a CSS file. CSS styles defined in stylesheets are sanitized using the same rules as the style attribute (see below). All custom class names must start with the `.ext-` prefix, identifying classes which are owned by the extension. First,
add a new CSS file to your extension:

`\Client\Parts\Custom\Styles\ExampleStyles.css`

```css
.ext-too-many-clicks-box {
    color: red;
    border: 2px dotted red;
    padding: 8px;
    text-align: center;
}
```

CSS files can then be referenced from any PDL file, inside of the `Definition` element:

`\Client\Parts\Custom\CustomParts.pdl`

```xml
<?xml version="1.0" encoding="utf-8" ?>
<Definition xmlns="http://schemas.microsoft.com/aux/2013/pdl" Area="Parts">
  <!--
    The following sample demonstrates the use of custom parts. Custom parts
    supply HTML templates and can be styled with custom style sheets.
  -->
  <StyleSheet Source="{Css Source='Styles\\ExampleStyles.css'}" />
  ...
</Definition>
```

The styles included in the CSS file may now be used inside HTML templates:

`\Client\Parts\Custom\Templates\ExampleCustomPart.html`

```html
<div class="ext-too-many-clicks-box" data-bind="visible: !allowMoreClicks()">
    That's too many clicks!
    <button data-bind="click: resetClickCount">Reset</button>
</div>
```

 <h1 name="portalfx-style-guide-style-sanitization"></h1>
 ## Style Guide: Style Sanitization

To ensure a consistent and sandboxed experience in the portal, CSS is analyzed at runtime to filter out disallowed properties or values. A typical example of a disallowed style is "`position: fixed;`", which would allow developers to move content outside of their parts.

All CSS properties should be allowed with a few exceptions documented at the end of this article. As the analysis is whitelist based, you may encounter CSS properties being erroneously filtered out. Shall this occur, report the issue on [Stack Overflow](https://stackoverflow.microsoft.com/).

The following properties only allow the specified values:

1. position: [ static | relative | absolute ]
1. text-transform: [ none | uppercase | lowercase ]

The following properties are sanitized out:

1. font
1. font-family
1. list-style

Certain properties have inconsistent behavior across browsers, or full support requires vendor prefixes. To enable them in a supported way, use the Framework style class instead.

* user-select: use class 'msportalfx-unselectable'

 <h1 name="portalfx-style-guide-themed-color-classes"></h1>
 ## Style Guide: Themed Color Classes

Base colors within the portal have been outfitted to change based on user-chosen themes. Since the actual hex values of these colors are determined by the theme definitions themselves, acceptable contrast between elements must be maintained by framework. In order to react to theme changes and maintain readability, the following classes have been made available to extension authors:

<a name="text-color-classes"></a>
### Text color classes
```css
// Suited for main text, will render with the highest contrast
msportalfx-text-default

// Suited for labels, subheaders, or any secondary text
msportalfx-text-muted-50

// Suited for links, or call to action text
msportalfx-link-primary

// Suited for highlighting searched text
msportalfx-highlight
```

 <h1 name="portalfx-style-guide-utility-classes"></h1>
 ## Style Guide: Utility Classes

There are several built-in classes that make working with the portal just a little bit easier.

<a name="code-formatting"></a>
### Code Formatting

```html
<pre class="msportalfx-code"><code>// this is code</code></pre>
```

In addition to using the `msportalfx-code` class, text blocks may be set to use a monospace style font:

```html
<div class="msportalfx-font-monospace">msportalfx-font-monospace</div>
```

<a name="utility-classes"></a>
### Utility Classes

**msportalfx-removeTableBorders** \- Removes all borders from a TABLE element.

**msportalfx-boxsizing-borderbox** \- Changes layout to include padding and borders in its width and height.

**msportalfx-removeDefaultListStyle** \- Remove bullets from a `ul` or `ol` element.

**msportalfx-lineheight-reset** \- Reset the line height back to the default of the current font size.

**msportalfx-removepartpadding** \- Remove default padding on a part template.

**msportalfx-removepartpaddingside** \- Remove padding on the side only of a part template.

**msportalfx-partdivider** \- Sets up a horizontal side to side divider within the part.

**msportalfx-clearfix** \- Applied to a container that contains floated elements, ensures the container gets a size and that DOM element following the container flows the document normally with no overlap.

**msportalfx-gridcolumn-asseticon** \- Applied as the css class name for a grid column which is showing an asset SVG icon.

**msportalfx-gridcolumn-statusicon** \- Applied as the css class name for a grid column which is showing a status SVG icon.

 <h1 name="portalfx-style-guide-color-palette"></h1>
 ## Style Guide: Color Palette
The portal offers a built-in set of coloring classes based on a core palette. Using these classes ensures a consistent experience for all users. This is especially important when the color conveys meaning, or differentiating data.

1. [Coloring to convey status](#statuscolortext)
1. [Coloring to differentiate data](#bgcolortext)
1. [Coloring SVG](#svgcolortext)

<a name="a-name-statuscolortext-a-coloring-to-convey-status"></a>
## <a name="statuscolortext"></a>Coloring to convey status
When conveying status, use these classes to relevant UI in your design. These classes ensure any future changes to the status colors will automatically apply to your content.

* "`msportalfx-bg-*`" changes the background color.
* "`msportalfx-text-*`" changes the foreground color. The foreground color applies to text and based on the text color as basis, like border.
* "`msportalfx-br-*`" changes the border color.
* "`msportalfx-fill-*`" changes the SVG fill color.

Use them in combination to update multiple aspects simulteanously.

<div id="statuspalette">
<div class="statuscontainer">
Info
  <div class="msportalfx-bg-info">msportalfx-bg-info</div>
  <div class="msportalfx-text-info">msportalfx-text-info</div>
  <div class="msportalfx-br-info">msportalfx-br-info</div>
  <div class="msportalfx-fill-info">msportalfx-fill-info <svg><rect height="10" width="10"/></svg></div>
</div>
<div class="statuscontainer">
Dirty
  <div class="msportalfx-bg-dirty">msportalfx-bg-dirty</div>
  <div class="msportalfx-text-dirty">msportalfx-text-dirty</div>
  <div class="msportalfx-br-dirty">msportalfx-br-dirty</div>
  <div class="msportalfx-fill-dirty">msportalfx-fill-dirty <svg><rect height="10" width="10"/></svg></div>
</div>
<br>
<br>
<div class="statuscontainer">
Success
  <div class="msportalfx-bg-success">msportalfx-bg-success</div>
  <div class="msportalfx-text-success">msportalfx-text-success</div>
  <div class="msportalfx-br-success">msportalfx-br-success</div>
  <div class="msportalfx-fill-success">msportalfx-fill-success <svg><rect height="10" width="10"/></svg></div>
</div>
<div class="statuscontainer">
Warning
  <div class="msportalfx-bg-warning">msportalfx-bg-warning</div>
  <div class="msportalfx-text-warning">msportalfx-text-warning</div>
  <div class="msportalfx-br-warning">msportalfx-br-warning</div>
  <div class="msportalfx-fill-warning">msportalfx-fill-warning <svg><rect height="10" width="10"/></svg></div>
</div>
<div class="statuscontainer">
Error
  <div class="msportalfx-bg-error">msportalfx-bg-error</div>
  <div class="msportalfx-text-error">msportalfx-text-error</div>
  <div class="msportalfx-br-error">msportalfx-br-error</div>
  <div class="msportalfx-fill-error">msportalfx-fill-error <svg><rect height="10" width="10"/></svg></div>
</div>
</div>

<a name="a-name-bgcolortext-a-coloring-to-differentiate-data"></a>
## <a name="bgcolortext"></a>Coloring to differentiate data
When representing data, differentiating with color is a common technique. For example, drawing lines in a chart, or coloring pie chart sections. The following sets of classes are provided to specify a background color on your elements. They also define a contrasted color for the text. They don't change appearance between themes.

<div id="bgcolorpalette">
<div class="bgcolorcontainer">
Base set
  <div class="msportalfx-bgcolor-a0">msportalfx-bgcolor-a0</div>
  <div class="msportalfx-bgcolor-b0">msportalfx-bgcolor-b0</div>
  <div class="msportalfx-bgcolor-c0">msportalfx-bgcolor-c0</div>
  <div class="msportalfx-bgcolor-d0">msportalfx-bgcolor-d0</div>
  <div class="msportalfx-bgcolor-e0">msportalfx-bgcolor-e0</div>
  <div class="msportalfx-bgcolor-f0">msportalfx-bgcolor-f0</div>
  <div class="msportalfx-bgcolor-g0">msportalfx-bgcolor-g0</div>
  <div class="msportalfx-bgcolor-h0">msportalfx-bgcolor-h0</div>
  <div class="msportalfx-bgcolor-i0">msportalfx-bgcolor-i0</div>
  <div class="msportalfx-bgcolor-j0">msportalfx-bgcolor-j0</div>
  <div class="msportalfx-bgcolor-k0">msportalfx-bgcolor-k0</div>
</div>
<br>
<br>
<div class="bgcolorcontainer">
Shade 1
  <div class="msportalfx-bgcolor-a1">msportalfx-bgcolor-a1</div>
  <div class="msportalfx-bgcolor-b1">msportalfx-bgcolor-b1</div>
  <div class="msportalfx-bgcolor-c1">msportalfx-bgcolor-c1</div>
  <div class="msportalfx-bgcolor-d1">msportalfx-bgcolor-d1</div>
  <div class="msportalfx-bgcolor-e1">msportalfx-bgcolor-e1</div>
  <div class="msportalfx-bgcolor-f1">msportalfx-bgcolor-f1</div>
  <div class="msportalfx-bgcolor-g1">msportalfx-bgcolor-g1</div>
  <div class="msportalfx-bgcolor-h1">msportalfx-bgcolor-h1</div>
  <div class="msportalfx-bgcolor-i1">msportalfx-bgcolor-i1</div>
  <div class="msportalfx-bgcolor-j1">msportalfx-bgcolor-j1</div>
  <div class="msportalfx-bgcolor-k1">msportalfx-bgcolor-k1</div>
</div>
<div class="bgcolorcontainer">
Shade 2
  <div class="msportalfx-bgcolor-a0s1">msportalfx-bgcolor-a0s1</div>
  <div class="msportalfx-bgcolor-b0s1">msportalfx-bgcolor-b0s1</div>
  <div class="msportalfx-bgcolor-c0s1">msportalfx-bgcolor-c0s1</div>
  <div class="msportalfx-bgcolor-d0s1">msportalfx-bgcolor-d0s1</div>
  <div class="msportalfx-bgcolor-e0s1">msportalfx-bgcolor-e0s1</div>
  <div class="msportalfx-bgcolor-f0s1">msportalfx-bgcolor-f0s1</div>
  <div class="msportalfx-bgcolor-g0s1">msportalfx-bgcolor-g0s1</div>
  <div class="msportalfx-bgcolor-h0s1">msportalfx-bgcolor-h0s1</div>
  <div class="msportalfx-bgcolor-i0s1">msportalfx-bgcolor-i0s1</div>
  <div class="msportalfx-bgcolor-j0s1">msportalfx-bgcolor-j0s1</div>
  <div class="msportalfx-bgcolor-k0s1">msportalfx-bgcolor-k0s1</div>
</div>
<div class="bgcolorcontainer">
Shade 3
  <div class="msportalfx-bgcolor-a0s2">msportalfx-bgcolor-a0s2</div>
  <div class="msportalfx-bgcolor-b0s2">msportalfx-bgcolor-b0s2</div>
  <div class="msportalfx-bgcolor-c0s2">msportalfx-bgcolor-c0s2</div>
  <div class="msportalfx-bgcolor-d0s2">msportalfx-bgcolor-d0s2</div>
  <div class="msportalfx-bgcolor-e0s2">msportalfx-bgcolor-e0s2</div>
  <div class="msportalfx-bgcolor-f0s2">msportalfx-bgcolor-f0s2</div>
  <div class="msportalfx-bgcolor-g0s2">msportalfx-bgcolor-g0s2</div>
  <div class="msportalfx-bgcolor-h0s2">msportalfx-bgcolor-h0s2</div>
  <div class="msportalfx-bgcolor-i0s2">msportalfx-bgcolor-i0s2</div>
  <div class="msportalfx-bgcolor-j0s2">msportalfx-bgcolor-j0s2</div>
  <div class="msportalfx-bgcolor-k0s2">msportalfx-bgcolor-k0s2</div>
</div>
<br>
<br>
<div class="bgcolorcontainer">
Tint 1
  <div class="msportalfx-bgcolor-a2">msportalfx-bgcolor-a2</div>
  <div class="msportalfx-bgcolor-b2">msportalfx-bgcolor-b2</div>
  <div class="msportalfx-bgcolor-c2">msportalfx-bgcolor-c2</div>
  <div class="msportalfx-bgcolor-d2">msportalfx-bgcolor-d2</div>
  <div class="msportalfx-bgcolor-e2">msportalfx-bgcolor-e2</div>
  <div class="msportalfx-bgcolor-f2">msportalfx-bgcolor-f2</div>
  <div class="msportalfx-bgcolor-g2">msportalfx-bgcolor-g2</div>
  <div class="msportalfx-bgcolor-h2">msportalfx-bgcolor-h2</div>
  <div class="msportalfx-bgcolor-i2">msportalfx-bgcolor-i2</div>
  <div class="msportalfx-bgcolor-j2">msportalfx-bgcolor-j2</div>
  <div class="msportalfx-bgcolor-k2">msportalfx-bgcolor-k2</div>
</div>
<div class="bgcolorcontainer">
Tint 2
  <div class="msportalfx-bgcolor-a0t1">msportalfx-bgcolor-a0t1</div>
  <div class="msportalfx-bgcolor-b0t1">msportalfx-bgcolor-b0t1</div>
  <div class="msportalfx-bgcolor-c0t1">msportalfx-bgcolor-c0t1</div>
  <div class="msportalfx-bgcolor-d0t1">msportalfx-bgcolor-d0t1</div>
  <div class="msportalfx-bgcolor-e0t1">msportalfx-bgcolor-e0t1</div>
  <div class="msportalfx-bgcolor-f0t1">msportalfx-bgcolor-f0t1</div>
  <div class="msportalfx-bgcolor-g0t1">msportalfx-bgcolor-g0t1</div>
  <div class="msportalfx-bgcolor-h0t1">msportalfx-bgcolor-h0t1</div>
  <div class="msportalfx-bgcolor-i0t1">msportalfx-bgcolor-i0t1</div>
  <div class="msportalfx-bgcolor-j0t1">msportalfx-bgcolor-j0t1</div>
  <div class="msportalfx-bgcolor-k0t1">msportalfx-bgcolor-k0t1</div>
</div>
<div class="bgcolorcontainer">
Tint 3
  <div class="msportalfx-bgcolor-a0t2">msportalfx-bgcolor-a0t2</div>
  <div class="msportalfx-bgcolor-b0t2">msportalfx-bgcolor-b0t2</div>
  <div class="msportalfx-bgcolor-c0t2">msportalfx-bgcolor-c0t2</div>
  <div class="msportalfx-bgcolor-d0t2">msportalfx-bgcolor-d0t2</div>
  <div class="msportalfx-bgcolor-e0t2">msportalfx-bgcolor-e0t2</div>
  <div class="msportalfx-bgcolor-f0t2">msportalfx-bgcolor-f0t2</div>
  <div class="msportalfx-bgcolor-g0t2">msportalfx-bgcolor-g0t2</div>
  <div class="msportalfx-bgcolor-h0t2">msportalfx-bgcolor-h0t2</div>
  <div class="msportalfx-bgcolor-i0t2">msportalfx-bgcolor-i0t2</div>
  <div class="msportalfx-bgcolor-j0t2">msportalfx-bgcolor-j0t2</div>
  <div class="msportalfx-bgcolor-k0t2">msportalfx-bgcolor-k0t2</div>
</div>
</div>

<a name="a-name-svgcolortext-a-coloring-svg"></a>
## <a name="svgcolortext"></a>Coloring SVG
Certain types of custom SVG content should adhere to the color palette. This is mostly for custom controls that use color to differentiate data, like charts. Iconography does not have this requirement, and instead you should refer to the [Icons](/documentation/sections/portalfx-icons) documentation to color those.

To use the palette within SVG content, use the same class names as the one for [data differentiation](#bgcolortext). The classes affect both the "`stroke`" and "`fill`" properties. The CSS rules assume the target element is within an "`g`" element contained in an "`svg`" element. The following sample shows proper usage:

    <svg>
        <g>
            <rect class="msportafx-bgcolor-i0t2"/>
        </g>
    </svg>


<style type="text/css">
  #statuspalette .statuscontainer {
    display: inline-flex;
    flex-flow: column nowrap;
  }

  .statuscontainer div {
    padding: 10px;
    width: 200px;
    display: inline-block;
    text-align: center;
    margin: 3px auto;
    border-width: 3px;
    border-style: solid;
  }

  #statuspalette svg {
    height: 10px;
    width: 10px;
    display: inline-block;
    stroke: #000;
  }

  /* These style copied from generated Theme.Universal.css */
  .msportalfx-bg-info {
    background-color: #0072c6;
  }
  .msportalfx-bg-success {
    background-color: #7fba00;
  }
  .msportalfx-bg-dirty {
    background-color: #9b4f96;
  }
  .msportalfx-bg-error {
    background-color: #e81123;
  }
  .msportalfx-bg-warning {
    background-color: #ff8c00;
  }
  .msportalfx-text-info {
    color: #0072c6;
  }
  .msportalfx-text-success {
    color: #7fba00;
  }
  .msportalfx-text-dirty {
    color: #9b4f96;
  }
  .msportalfx-text-error {
    color: #e81123;
  }
  .msportalfx-text-warning {
    color: #ff8c00;
  }
  .msportalfx-br-info {
    border-color: #0072c6;
  }
  .msportalfx-br-success {
    border-color: #7fba00;
  }
  .msportalfx-br-dirty {
    border-color: #9b4f96;
  }
  .msportalfx-br-error {
    border-color: #e81123;
  }
  .msportalfx-br-warning {
    border-color: #ff8c00;
  }
  .msportalfx-fill-info {
    fill: #0072c6;
  }
  .msportalfx-fill-success {
    fill: #7fba00;
  }
  .msportalfx-fill-dirty {
    fill: #9b4f96;
  }
  .msportalfx-fill-error {
    fill: #e81123;
  }
  .msportalfx-fill-warning {
    fill: #ff8c00;
  }
</style>

<style type="text/css">
  #bgcolorpalette .bgcolorcontainer {
    display: inline-flex;
    flex-flow: column nowrap;
  }

  .bgcolorcontainer div {
    padding: 10px;
    width: 200px;
    display: inline-block;
    text-align: center;
    margin: auto;
  }

  /* These style copied from generated CustomPart.css */
  .msportalfx-bgcolor-a1 {
    background-color: #fcd116;
    color: #000000;
  }
  .msportalfx-bgcolor-b1 {
    background-color: #eb3c00;
    color: #ffffff;
  }
  .msportalfx-bgcolor-c1 {
    background-color: #ba141a;
    color: #ffffff;
  }
  .msportalfx-bgcolor-d1 {
    background-color: #b4009e;
    color: #ffffff;
  }
  .msportalfx-bgcolor-e1 {
    background-color: #442359;
    color: #ffffff;
  }
  .msportalfx-bgcolor-f1 {
    background-color: #002050;
    color: #ffffff;
  }
  .msportalfx-bgcolor-g1 {
    background-color: #0072c6;
    color: #ffffff;
  }
  .msportalfx-bgcolor-h1 {
    background-color: #008272;
    color: #ffffff;
  }
  .msportalfx-bgcolor-i1 {
    background-color: #007233;
    color: #ffffff;
  }
  .msportalfx-bgcolor-j1 {
    background-color: #7fba00;
    color: #ffffff;
  }
  .msportalfx-bgcolor-k1 {
    background-color: #a0a5a8;
    color: #ffffff;
  }
  .msportalfx-bgcolor-a0 {
    background-color: #fff100;
    color: #000000;
  }
  .msportalfx-bgcolor-b0 {
    background-color: #ff8c00;
    color: #ffffff;
  }
  .msportalfx-bgcolor-c0 {
    background-color: #e81123;
    color: #ffffff;
  }
  .msportalfx-bgcolor-d0 {
    background-color: #ec008c;
    color: #ffffff;
  }
  .msportalfx-bgcolor-e0 {
    background-color: #68217a;
    color: #ffffff;
  }
  .msportalfx-bgcolor-f0 {
    background-color: #00188f;
    color: #ffffff;
  }
  .msportalfx-bgcolor-g0 {
    background-color: #00bcf2;
    color: #ffffff;
  }
  .msportalfx-bgcolor-h0 {
    background-color: #00b294;
    color: #ffffff;
  }
  .msportalfx-bgcolor-i0 {
    background-color: #009e49;
    color: #ffffff;
  }
  .msportalfx-bgcolor-j0 {
    background-color: #bad80a;
    color: #000000;
  }
  .msportalfx-bgcolor-k0 {
    background-color: #bbc2ca;
    color: #000000;
  }
  .msportalfx-bgcolor-a2 {
    background-color: #fffc9e;
    color: #000000;
  }
  .msportalfx-bgcolor-b2 {
    background-color: #ffb900;
    color: #000000;
  }
  .msportalfx-bgcolor-c2 {
    background-color: #dd5900;
    color: #ffffff;
  }
  .msportalfx-bgcolor-d2 {
    background-color: #f472d0;
    color: #ffffff;
  }
  .msportalfx-bgcolor-e2 {
    background-color: #9b4f96;
    color: #ffffff;
  }
  .msportalfx-bgcolor-f2 {
    background-color: #4668c5;
    color: #ffffff;
  }
  .msportalfx-bgcolor-g2 {
    background-color: #6dc2e9;
    color: #000000;
  }
  .msportalfx-bgcolor-h2 {
    background-color: #00d8cc;
    color: #000000;
  }
  .msportalfx-bgcolor-i2 {
    background-color: #55d455;
    color: #000000;
  }
  .msportalfx-bgcolor-j2 {
    background-color: #e2e584;
    color: #000000;
  }
  .msportalfx-bgcolor-k2 {
    background-color: #d6d7d8;
    color: #000000;
  }
  .msportalfx-bgcolor-a0s2 {
    background-color: #807900;
    color: #ffffff;
  }
  .msportalfx-bgcolor-b0s2 {
    background-color: #804600;
    color: #ffffff;
  }
  .msportalfx-bgcolor-c0s2 {
    background-color: #740912;
    color: #ffffff;
  }
  .msportalfx-bgcolor-d0s2 {
    background-color: #760046;
    color: #ffffff;
  }
  .msportalfx-bgcolor-e0s2 {
    background-color: #34113d;
    color: #ffffff;
  }
  .msportalfx-bgcolor-f0s2 {
    background-color: #000c48;
    color: #ffffff;
  }
  .msportalfx-bgcolor-g0s2 {
    background-color: #005e79;
    color: #ffffff;
  }
  .msportalfx-bgcolor-h0s2 {
    background-color: #084c41;
    color: #ffffff;
  }
  .msportalfx-bgcolor-i0s2 {
    background-color: #063d20;
    color: #ffffff;
  }
  .msportalfx-bgcolor-j0s2 {
    background-color: #3d460a;
    color: #ffffff;
  }
  .msportalfx-bgcolor-k0s2 {
    background-color: #32383f;
    color: #ffffff;
  }
  .msportalfx-bgcolor-a0s1 {
    background-color: #bfb500;
    color: #000000;
  }
  .msportalfx-bgcolor-b0s1 {
    background-color: #bf6900;
    color: #ffffff;
  }
  .msportalfx-bgcolor-c0s1 {
    background-color: #ae0d1a;
    color: #ffffff;
  }
  .msportalfx-bgcolor-d0s1 {
    background-color: #b10069;
    color: #ffffff;
  }
  .msportalfx-bgcolor-e0s1 {
    background-color: #4e195c;
    color: #ffffff;
  }
  .msportalfx-bgcolor-f0s1 {
    background-color: #00126b;
    color: #ffffff;
  }
  .msportalfx-bgcolor-g0s1 {
    background-color: #008db5;
    color: #ffffff;
  }
  .msportalfx-bgcolor-h0s1 {
    background-color: #00856f;
    color: #ffffff;
  }
  .msportalfx-bgcolor-i0s1 {
    background-color: #0f5b2f;
    color: #ffffff;
  }
  .msportalfx-bgcolor-j0s1 {
    background-color: #8ba208;
    color: #ffffff;
  }
  .msportalfx-bgcolor-k0s1 {
    background-color: #464f59;
    color: #ffffff;
  }
  .msportalfx-bgcolor-a0t1 {
    background-color: #fcf37e;
    color: #000000;
  }
  .msportalfx-bgcolor-b0t1 {
    background-color: #ffba66;
    color: #000000;
  }
  .msportalfx-bgcolor-c0t1 {
    background-color: #f1707b;
    color: #ffffff;
  }
  .msportalfx-bgcolor-d0t1 {
    background-color: #f466ba;
    color: #ffffff;
  }
  .msportalfx-bgcolor-e0t1 {
    background-color: #a47aaf;
    color: #ffffff;
  }
  .msportalfx-bgcolor-f0t1 {
    background-color: #6674bc;
    color: #ffffff;
  }
  .msportalfx-bgcolor-g0t1 {
    background-color: #66d7f7;
    color: #000000;
  }
  .msportalfx-bgcolor-h0t1 {
    background-color: #66d1bf;
    color: #000000;
  }
  .msportalfx-bgcolor-i0t1 {
    background-color: #66c592;
    color: #000000;
  }
  .msportalfx-bgcolor-j0t1 {
    background-color: #d6e86c;
    color: #000000;
  }
  .msportalfx-bgcolor-k0t1 {
    background-color: #8f9ca8;
    color: #ffffff;
  }
  .msportalfx-bgcolor-a0t2 {
    background-color: #fffccc;
    color: #000000;
  }
  .msportalfx-bgcolor-b0t2 {
    background-color: #ffe8cc;
    color: #000000;
  }
  .msportalfx-bgcolor-c0t2 {
    background-color: #facfd3;
    color: #000000;
  }
  .msportalfx-bgcolor-d0t2 {
    background-color: #fbcce8;
    color: #000000;
  }
  .msportalfx-bgcolor-e0t2 {
    background-color: #e1d3e4;
    color: #000000;
  }
  .msportalfx-bgcolor-f0t2 {
    background-color: #ccd1e9;
    color: #000000;
  }
  .msportalfx-bgcolor-g0t2 {
    background-color: #ccf2fc;
    color: #000000;
  }
  .msportalfx-bgcolor-h0t2 {
    background-color: #ccf0ea;
    color: #000000;
  }
  .msportalfx-bgcolor-i0t2 {
    background-color: #ccecdb;
    color: #000000;
  }
  .msportalfx-bgcolor-j0t2 {
    background-color: #f0f7b2;
    color: #000000;
  }
  .msportalfx-bgcolor-k0t2 {
    background-color: #63707e;
    color: #ffffff;
  }
</style>



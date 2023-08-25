<a name="html-css-and-svg-sanitization"></a>
# HTML, CSS, and SVG sanitization

Extension writers provide their own HTML templates and associated Cascading Style Sheets (CSS) to render and style their experiences. Those files are analyzed at runtime to filter out disallowed HTML tags, attribute names, attribute values, CSS properties, or CSS property values that are known to have potential negative impact on the Portal. This filtering ensures a consistent and sandboxed experience in the Portal. This runtime analysis is often referred to colloquially as "sanitization".

Similar sanitization is also applied to SVG markup provided by the extension. The philosophy around the application of sanitization is to allow extensions access to as much CSS as possible, based on an allowlist of permissible styles. Since the Ibiza team expands this allowlist to suit extension scenarios, developers may encounter items filtered out that are not mentioned in this document. Should this occur, developers should report the issue by using the `ibiza-style` tag on Stack Overflow. For more information, see [portalfx-stackoverflow.md](portalfx-stackoverflow.md).

The criteria that determine whether a CSS property or an HTML element might have a negative impact on the Portal  are as follows:

1. Usage allows an element to escape the tile or blade container boundaries
1. Usage significantly impacts browser performance during layout or repainting
1. Usage can be exploited as a possible security threat
1. Usage is non-standard across IE11, Microsoft Edge, Chrome, Firefox, or Safari
1. Usage resets defaults font-family branding that is enforced for typographic consistency
1. Usage assigns or relies on unique identifiers. Identifier allocation is reserved in the Portal for accessibility purposes

<a name="html-css-and-svg-sanitization-css-library"></a>
## CSS Library

A CSS Library of reusable, composable classes is provided. Please refer to the Playground extension for the latest available library classes and their documentation.

<a name="html-css-and-svg-sanitization-html-sanitization"></a>
## HTML sanitization

HTML sanitization is divided between HTML tags and their attributes.

<a name="html-css-and-svg-sanitization-html-sanitization-html-tags"></a>
### HTML tags

The iframe tag is not allowed based on criterion 3.

<a name="html-css-and-svg-sanitization-html-sanitization-html-attributes"></a>
### HTML attributes

The id attribute is not allowed based on criterion 6.

<a name="html-css-and-svg-sanitization-html-sanitization-attribute-data-bind-sanitization"></a>
### Attribute data-bind sanitization

The data-bind value is sanitized to allow simple binding and logics, but no complex JavaScript is allowed.

<a name="html-css-and-svg-sanitization-css-sanitization"></a>
## CSS sanitization

All CSS properties are allowed, with a few exceptions based on the criteria listed previously. The following properties are sanitized as described.

| Property | Criterion | Reason |
| -------- | --------- | ------- |
| position | Criterion 1 |  Only a subset of the possible values are allowed: `static` \| `relative` \| `absolute` |
| font | Criterion 5 |  Disallowed. Instead use expanded properties, like font-size, font-style, etc. |
| font-family |Criterion 5 |  Disallowed. Instead, use the portal classes that assign font-family: `msportalfx-font-regular` \| `msportalfx-font-bold` \| `msportalfx-font-semibold` \| `msportalfx-font-light` \| `msportalfx-font-monospace` |
| list-style | Criterion 3 |  Disallowed. Use expanded properties instead of the shorthand (list-style-type, etc) |
| user-select | Criterion 4 |  Disallowed. Use Framework class `msportalfx-unselectable` to achieve the same result. |

CSS media queries are not supported, and are filtered out. The most common scenario for media queries is responding to container size. Extensions support this feature by subscribing to an observable `size` property available on your `container` object (described in [portalfx-no-pdl-programming.md](portalfx-no-pdl-programming.md), [top-legacy-parts.md](top-legacy-parts.md), and [top-extensions-forms.md](top-extensions-forms.md)). Newer API have an observable `contentSize` exposed on the `container` object.

<a name="html-css-and-svg-sanitization-svg-sanitization"></a>
## SVG sanitization

SVG sanitization follows the rules applied to HTML sanitization, as they are both DOM structures.

Some SVG functionality like certain filters and gradients are known to cause significant browser rendering slowdowns, as specified in Criterion 2. As such, they are sanitized out. The Azure Portal build tools should detect those early and mitigate them when possible. Extension writers should rely on StackOverflow if the sanitization of SVG elements causes a blocking issue.

For multiple reasons including security, localization, accessibility and consistency, the Portal only allows certain elements and attributes to be used in SVG images.

The following elements are supported:

* circle
* clipPath
* defs
* ellipse
* g
* image
* line
* linearGradient
* mask
* path
* polygon
* polyline
* radialGradient
* rect
* stop
* svg
* symbol
* title
* use

The following attributes are supported:

* aria-hidden
* aria-labelledby
* class
* clip-path
* clip-rule
* cx
* cy
* d
* enable-background
* fill-opacity
* fill-rule
* fill
* filter
* focusable
* gradientTransform
* gradientUnits
* height
* href
* id
* mask
* offset
* opacity
* points
* r
* role
* rx
* ry
* space
* spreadMethod
* stop-color
* stop-opacity
* stroke-dasharray
* stroke-linecap
* stroke-linejoin
* stroke-miterlimit
* stroke-opacity
* stroke-width
* stroke
* transform
* viewbox
* viewBox
* width
* x
* x1
* x2
* xlink:href
* xml:space
* xmlns
* xmlns:svg
* xmlns:xlink
* y
* y1
* y2

<a name="html-css-and-svg-sanitization-adding-custom-css"></a>
## Adding custom CSS

This section is still being worked on and will be available shortly.

<a name="html-css-and-svg-sanitization-blade-layout-patterns"></a>
## Blade Layout patterns

For the most part, you can layout a blade the same way you would build an HTML page using Knockout. Layout should be handled by using CSS. The framework provides a number of controls that you can use by using Knockout bindings. In additional, the Framework provides a set of css classes you can add to elements to help with docking controls to the top or bottom of the blade.

Certain FX controls themselves offer TypeScript APIs to control common layout (replacing more low-level use of custom HTML and CSS).

These controls include:

* Sections

    For layout of user input forms, as specified in [top-extensions-forms.md](top-extensions-forms.md), we provide a section control, which is just a container for other controls.  The section aligns its contained controls labels and padding in a consistent manner across the Portal.

* Tabs

    For tab layouts, we provide a tab control.  This control contains a collection of sections, each of which holds the contents of a tab.

* Custom Html

    We also provide a custom html control which allows you to combine a `ViewModel` and template with support for labels which behave in similar ways to those on form controls.  Custom html allows you to create your own controls to be used in sections or directly in your blade.

Sections, tabs and custom html can all be found in the playground located at [https://aka.ms/portalfx/playground](https://aka.ms/portalfx/playground).

<a name="html-css-and-svg-sanitization-theming"></a>
## Theming

Base colors within the Portal have been outfitted to change based on user-chosen themes. Because the actual hexadecimal values of these colors are determined by the theme definitions, acceptable levels of contrast between elements are maintained by the Framework. The following classes have been made available to extension developers, so that their extensions can react to theme changes and maintain readability.

<a name="html-css-and-svg-sanitization-theming-color-palette"></a>
### Color palette

The Portal offers a built-in set of classes that are based on a core color palette. These classes ensure a consistent experience for all users. This is especially important when the color conveys meaning, or differentiates data. The purposes are discussed in the following section.

<a name="html-css-and-svg-sanitization-theming-convey-status"></a>
### Convey status

CSS classes can be applied to specific UI elements in an extension to convey status. These classes ensure any future changes to the status colors will automatically be applied to the content of the extension. The names of the class prefixes are as follows.

**msportalfx-bg-**: changes the background color.

**msportalfx-text-**: changes the foreground color. The foreground color will be the same for the text and for the border.

**msportalfx-br-**: changes the border color.

**msportalfx-fill-**: changes the SVG fill color.

The classes can be combined to update multiple aspects simultaneously. The visual sample of those classes are provided in the SDK on [this sample blade](https://df.onecloud.azure-test.net/?SamplesExtension=true#blade/SamplesExtension/SDKMenuBlade/styleguidecolorpalettetitle).

<a name="html-css-and-svg-sanitization-typography"></a>
## Typography

Typography is associated with the formation of letters and words, and their impact on usability. The right typography makes extensions convey the feeling of accuracy, crispness, and polish. Typography that is not as effective may actually distract from content on which it was used.

The FX provides built-in CSS classes to enable use of a consistent font set across UI from the various extension teams:

| Class name | Current font on European languages |
| -------- | --------- |
| msportalfx-font-regular | SegoeUI |
| msportalfx-font-bold | SegoeUI-Bold |
| msportalfx-font-semibold |SegoeUI-Semibold |
| msportalfx-font-light | SegoeUI-Light |

Note that using the class name also ensures you get the optimal font in Asian, East Asian, and Cyrillic languages. Those fonts differ due to their respective character sets.

Azure extensions have considered the factors of font selection and placement, in addition to other linotype techniques, to provide typography that can be used consistently across extensions to display content in a way that the content is more important than the designs that display it.

<a name="html-css-and-svg-sanitization-iconography"></a>
## Iconography

This section is still being worked on and will be available shortly.

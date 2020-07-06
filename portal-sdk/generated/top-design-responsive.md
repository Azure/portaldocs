<a name="responsive-design-with-ibiza-sdk"></a>
# Responsive design with Ibiza SDK

<a name="responsive-design-with-ibiza-sdk-the-web-is-an-unconstrained-canvas"></a>
## The web is an unconstrained canvas

The web is consumed from a large number of window resolutions, from mobile devices to multiple screen desktop. This is a simplistic view of how content is actually rendered to web users. Those users also modify how the content is rendered in their user agent of choice, with tools like zoom, or font size minimums. To ensure maximum compatibility with all those rendering contexts, it is imperative the content shall be responsive.

<a name="responsive-design-with-ibiza-sdk-responsive-goals-in-ibiza"></a>
## Responsive goals in Ibiza

The framework has aimed at a responsive design for a few years. In 2017, content owners were asked to review their content to render in what was called "full screen". It was a bit of a misnomer, as it meant that content should be allowed to render larger then the explicitly set or inferred min-width of their content. That min-width, when inferred, is 585px, while it can also be adjusted via the BladeWidth parameter.

In 2019, content owners were requested to further review their content to allow responsive content that renders properly when the browser size is 320px width by 256px height. This requirement wasn't arbitrary, it was in line with the minimum requirements for the [WCAG2.1 1.4.10 Reflow Criterion](https://www.w3.org/WAI/WCAG21/Understanding/reflow.html).

The portal has improved support for rendering at that size, while also adding tools to enable content creators to meet the goal. This document should help content creators review and prepare their content to be responsive with the tools provided. It also informs on the limitations that are known for the support.

<a name="responsive-design-with-ibiza-sdk-ibiza-portal-responsiveness"></a>
## Ibiza portal responsiveness

The portal has been re-engineered with a small resolution first philosophy in mind. This includes work done on the native Ibiza controls. Here is what changes based on the viewport.

Based on viewport width:

- **Top bar:** shows more or less items, folded into menu buttons.
- **Search results:** shows one or two columns, and is constrained to the viewport.
- **Sidebar:** if it is docked in the user settings, it collapses to a hamburger button on the top left below 1024px.
- **Menu blade table of content:** folds in the hamburger button on the top left below 640px.
- **Azure Home:** adapts to always render in a single continuous column.
- **Dialogs:** constrains to the browser viewport.
- **Breadcrumbs:** elements folds into an overflow menu button as needed.
- **Dashboards:** header shows more or less items, folded into menu buttons. Tiles are two-dimensional and remain positioned in a scrollable container.

Based on viewport height:

- **Content in blade and context pane:** undocked by default. Above 500px of viewport height, content is allowed to be pinned within the content.
- **Breadcrumb and blade header:** this UI is unpinned below 500px of viewport height, allowing to scroll the full blade content.
- **Grids** have a maximum height constraint equal to the viewport height when rendered in a viewport that is less than 500px in height. This improves usability of the grid by allowing both scrollbars of the grid to show within the viewport in these low resolution. Note this only applies to the EditableGrid when using a virtual vertical scrollbar.

Be aware of these notable control behaviors:

- **Grids** are considered two dimensional content. They will render an horizontal scrollbar based on the sum of the column widths overflowing the container.
- **Charts** are considered two dimensional content. They will render an horizontal scrollbar if the chart is overflowing its container.

<a name="responsive-design-with-ibiza-sdk-responsive-design-techniques"></a>
## Responsive design techniques

This "[Responsive design techniques](https://docs.microsoft.com/en-us/windows/uwp/design/layout/responsive-design)" document is part of the Universal Windows Platform apps documentation. The design techniques illustrated within are the same for the web. These techniques were used to implement the responsive updates to the Ibiza portal. Familiarity with these techniques should help guide decisions when updating existing content for responsiveness.

***

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive"></a>
## Migrating content to be responsive

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-summary-steps"></a>
### Summary steps

Existing and new content should be adapted to responsive design principles following these steps:

1. Evaluate existing content with the portal preview tools
2. Fix existing content, using this document for help to:
    - Follow guidance about the design principles used in the portal
    - Review layout grid usage if necessary
    - Use media queries where needed
    - Review common pitfalls of using certain techniques (like flexbox)
3. Annotate content as responsive

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-evaluating-existing-content"></a>
### Evaluating existing content

To help investigate the current state of readiness, the portal exposes an evaluation tool that hosts the content in a responsive container. An additional tool renders the content at the minimum width it shall render to pass the accessibility criterion for Reflow.

>**Note:** It isn't always obvious if the tool is active or not since not all content reacts to it toggling on or off. The tool is active if the top bar of the portal adopts a green tint.

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-evaluating-existing-content-responsive-container-preview-tool"></a>
#### Responsive container preview tool

This tool forces content to render in a container that is fully responsive. The content is rendered as if it was marked as `reflowReady`, the last step to enable responsive content. Browser window resize, or zoom actions, will influence the content rendering. All layout issues that cause scrolling in two dimensions should be investigated, as is content that is cut into the overflow without a scrollbar to access it.

>**Tip:** Most browsers' developer tools include a *"Responsive design mode"*. Using preset values, or the draggable size handles of the free form option, it is possible to preview how the content react to viewport size changes. Add a custom value of *ReflowMin* with 320px by 256px for evaluating the minimum required render without having to hassle with the browser window size or zoom!

To activate this tool, while focus is within non-iframe content, access the portal debugging tools with the `Ctrl+Alt+D` keyboard shortcut. Alternatively, do a long press on the login avatar for 5 seconds and select `Debugging tools` in the dialog that appears. In the lower right corner, a crude UI with options will appear. Under the accessibility label, select the `Reflow flexible` option. Turn it off using the `Reflow off` option.

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-evaluating-existing-content-minimum-container-width-preview-tool"></a>
#### Minimum container width preview tool

This tool is similar to the responsive container preview, but forces the content to be exactly 320px in width. This width is the minimum size the content should render without showing an horizontal scrollbar. While in that mode, empty space that would not be rendered is hashed out.

To activate this tool, invoke the portal developer tools as described previously. Under the accessibility label, select the `Reflow min` option.

>**Note:** The min-width tool emulates the minimum width requirement of the accessibility criterion. It must be used when the portal is rendered in a relatively large resolution no less than 650px by 650px. Using browser zoom, or using a smaller resolution, would yield unexpected result as the normal portal responsiveness logic would kick in and interfere with the preview.

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-evaluating-existing-content-tool-bookmarklets"></a>
#### Tool bookmarklets

Create a shortcut to the tools as a bookmark! Create a new bookmark and edit its URI as follow:

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-evaluating-existing-content-tool-bookmarklets-reflowmin_-shortcut"></a>
##### <em>ReflowMin</em> shortcut

```javascript
javascript:(function(){var ctrlAltDEvent = $.Event("keydown", { keyCode: 68, ctrlKey: true, altKey: true }); $("body").trigger(ctrlAltDEvent);setTimeout(function() { $($(".fxs-sticky-debugbox").find(".fxs-sticky-link").toArray().filter(function(s){return s.innerText === "Reflow min";})).click(); $("body").trigger(ctrlAltDEvent); } ) ;})();
```

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-evaluating-existing-content-tool-bookmarklets-reflowflexible_-shortcut"></a>
##### <em>ReflowFlexible</em> shortcut

```javascript
javascript:(function(){var ctrlAltDEvent = $.Event("keydown", { keyCode: 68, ctrlKey: true, altKey: true }); $("body").trigger(ctrlAltDEvent);setTimeout(function() { $($(".fxs-sticky-debugbox").find(".fxs-sticky-link").toArray().filter(function(s){return s.innerText === "Reflow flexible";})).click(); $("body").trigger(ctrlAltDEvent); } ) ;})();
```

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-evaluating-existing-content-tool-bookmarklets-reflowoff_-shortcut"></a>
##### <em>ReflowOff</em> shortcut

```javascript
javascript:(function(){var ctrlAltDEvent = $.Event("keydown", { keyCode: 68, ctrlKey: true, altKey: true }); $("body").trigger(ctrlAltDEvent);setTimeout(function() { $($(".fxs-sticky-debugbox").find(".fxs-sticky-link").toArray().filter(function(s){return s.innerText === "Reflow off";})).click(); $("body").trigger(ctrlAltDEvent); } ) ;})();
```

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-fixing-content-for-responsiveness"></a>
### Fixing content for responsiveness

Content creators can fix their layout using the responsive design techniques introduced earlier. This section describes where to start. It describes some patterns to adopt, some common pitfalls encountered, and introduces Ibiza SDK tools to help achieve flexible and responsive layouts.

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-fixing-content-for-responsiveness-fix-the-smallest-resolution-first"></a>
#### Fix the smallest resolution first

Decide how the content is laid out on the smallest resolution first, then adapt it to larger ones.

Embrace the _design for smallest resolution first_ philosophy around in all the code too. The advantage of doing so are:

- The CSS written will be progressive from top to bottom as media queries won't conflict with complex rules
- The layout grid leverages the assumption that the smallest resolution is built first
- API calls to `container.size` will be structured has additive

Doing so keeps the code maintainable and more readable.

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-fixing-content-for-responsiveness-sizing-is-everything"></a>
#### Sizing is everything

Content is hosted in sized container within the portal, and propagating the sizing information is the responsibility of content owners. If it isn't assigned, the size will be inferred, and in some cases, such as `flexbox` container, this can lead to layout issues.

For a child content not to overflow its parent, the child content size must be at most the same as the size of its parent. In most cases, that would be `width: 100%`. Pixel values are okay, but should be used sparingly and in combination with other layout technique to prevent fixed values to overflow.

If you intend to have overflowing content, don't forget to assign the `overflow` property.

As a general rule, containers that are block level should have their CSS width set to 100%.

Note that inline elements cannot be sized. Example of inline elements are unstyled `span`, or elements with CSS `display: inline;`. If a sizable container is needed, choose the appropriate HTML element, or use a CSS `display` property value that allows sizing.

>Although unintuitive when using multiple container side by side with flexbox, it is still a good idea to use `width: 100%` for flexed content as flexbox container rules will override those values to fit the available width, provided each flexed content has the CSS property `flex: 1 1 100%`.

```css
/* Example class that could be reused on sizable content to enforce 100% width */
.ext-fillcontainer {
    width: 100%;
}
```

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-fixing-content-for-responsiveness-box-sizing-property-set-to-border-box-avoids-surprises"></a>
#### Box-sizing property set to border-box avoids surprises

The box model in HTML defines the `width` as the content width, and excludes the padding and border widths. This isn't necessarily intuitive.

With `box-sizing: border-box`, the `width` is redefined to include the padding and border widths. This is more in line with the behavior of `width` expected by developers. It also minimize issues when resizing paddings and borders.

If the Ibiza portal could go back in time, it would set a base CSS property to all elements as follow:

```css
/* Size containers in a natural way. */
*,
*::after,
*::before {
    box-sizing: border-box;
}
```

Unfortunately, doing so now would break a lot of existing layout that doesn't have this assumption built in. The next best thing possible is to advise content creator to set that property on their sized content. Doing so aligns the expectation that adding paddings and borders keeps the element within the container relative width.

Ibiza offers a reusable class `.msportalfx-boxsizing-borderbox` to that effect, or it can be set explicitly by content creators.

>__Note:__ Margins aren't part of content sizing in either case and have to be adressed separately.

```css
/*
  Example effect on size of different box-sizing values.
  Assume each class is added to an element hosted in a 300px container.
*/
.ext-boxsizingcontentbox {
    box-sizing: initial;
    width: 100%;
    padding: 20px;
    border: 1px solid black;
}
/*
  This element rendered width is 342px, calculated as follow:
  300px (100% of container) + 20px + 20px (padding right/left) + 1px + 1px (border right/left)

  A developer that doesn't want to overflow the container would have to assign width like this:
  width: calc(100% - 42px)
  This is a maintenance problem because the 42px value needs update everytime the paddings and borders are updated.
*/

.ext-boxsizingborderbox {
    box-sizing: border-box;
    width: 100%;
    padding: 20px;
    border: 1px solid black;
}
/*
  This element rendered width is 300px.
  The difference with the previous element is the content width is 258px after accounting for paddings and borders, but it is done intrinsically.
*/
```

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-fixing-content-for-responsiveness-fix-layout-from-parent-containers-to-children-containers"></a>
#### Fix layout from parent containers to children containers

Because sizing is everything, always fix the layout from the parent container to its children containers. It isn't possible to fix the sizing information of a child box if it cannot get the correct size from its parent box.

```html
<div class="ext-container"> <!-- Fix the layout starting at this element -->
    <div class="ext-content-first"></div> <!-- These elements should be fixed after the parent element -->
    <div class="ext-content-second"></div>
</div>
```

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-fixing-content-for-responsiveness-flexbox-can-help-size-things-with-less-complexity-but-careful-about-the-inferred-min-width-auto"></a>
#### Flexbox can help size things with less complexity, but careful about the inferred <code>min-width: auto</code>

Flexbox is a great layout system in responsive design. The one pitfall to watch for: flexible content is assigned a min-width of `auto`. This means the browser will assign an actual min-width value based on the content width when rendered. This `auto` value may interfere in shrinking the content to fit the available width, causing overflow.

>__Note:__ Get more info about the [automatic minimum size](https://www.w3.org/TR/css-flexbox-1/#min-size-auto) in the specification of flexible layout.

For all direct children of `display: flex` containers, one should verify the min-width value each elements can actually take and assign it, or simply reset to `min-width: 0` for CSS simplicity.

```css
/* A good practice is to always reset min-width of flex elements. */
.ext-flexcontainer {
    display: flex;
}

.ext-flexcontent {
    min-width: 0;
}
```

```html
<!-- Template example showing the structure of a flex container with its flex content -->
<div class="ext-flexcontainer">
    <div class="ext-content-first ext-flexcontent"></div>
    <div class="ext-content-second ext-flexcontent"></div>
</div>
```

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-fixing-content-for-responsiveness-understand-rendered-width-and-how-it-causes-overflow"></a>
#### Understand rendered width and how it causes overflow

The browser calculates dimensions based on what the container and content influence on each other. Understanding how the container is rendered can help understand where and how content overflows and introduces scrollbars. While all the aspects discussed here apply to both the height and width dimensions, the focus will be on width.

>__Note:__ If you like specifications, you can have in-depth details of how layout sizing is calculated in the [CSS Intrinsic & Extrensic Sizing Module Level 3](https://www.w3.org/TR/css-sizing-3/) specification. The following is a simplified explication of the specification.

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-fixing-content-for-responsiveness-understand-rendered-width-and-how-it-causes-overflow-decide-if-overflow-is-appropriate-and-how-it-manifest-in-the-content"></a>
##### Decide if overflow is appropriate and how it manifest in the content

Not all overflowing content needs to be eliminated. If the content is two dimensional, like graphics or grids, a scrollable container is acceptable. Another example of content that can overflow is single line text value which cut off with an ellipsis. While such text should be obtainable in full (ex: tooltip), the ellipsis is acceptable to contain it visually.

As such, it is important to determine which content should be contained, and which should be allowed to overflow.

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-fixing-content-for-responsiveness-understand-rendered-width-and-how-it-causes-overflow-block-level-items-can-be-contained-inline-items-wrap-or-clip"></a>
##### Block level items can be contained, inline items wrap or clip

To be sizable with explicit properties, the element must support extrensic sizing. Typically, these are block level elements. Example of block level elements are unstyled `<div>`, or elements with CSS property `display: block`, `display: inline-block`, or `display: flex`.

Conversely, inline elements cannot be sized explicitly. Common examples of inline elements are unstyled `<span>`, or elements with the CSS property `display: inline`. Those elements are intrinsicly sized, which means their content determines their dimensions.

This difference is important when trying to contain elements within the boundary of a container. If the element is block level, it can be contained to that container with explicit properties. If it is inline level, then it either needs to wrap in its container and increase the container height along, or use another technique to clip its size within the bounds of the container it belongs, such as using ellipsis or scrollbars.

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-fixing-content-for-responsiveness-understand-rendered-width-and-how-it-causes-overflow-minimum-maximum-desired-width-influence-each-other-calculated-value"></a>
##### Minimum/Maximum/Desired width influence each other calculated value

Understand how the CSS properties `width`, `min-width`, and `max-width` impact each other.

- `width`: Defines the desired width for the item. It is overridden by max and min constraints.
- `max-width`: Defines the maximum width constraint. It overrides the desired width when the calculated width would be larger. It is overriden by min constraint.
- `min-width`
Defines the minimum width constraint. It overrides the desired width when the calculated width would be smaller.

```css
/*
  Examples explaining how width/max-width/min-width influence each other.
*/

.ext-content {
    width: 100%;
    max-width: 250px;
    min-width: 200px;
}

/*
  If ext-content is within a 300px wide container, then:
  -> the desired width is 300px.
  -> the max-width constrains it to 250px.
  -> the min-width has no effect.
  The final size is 250px.

  If ext-content is within a 150px wide container, then:
  -> the desired width is 150px.
  -> the max-width has no effect.
  -> the min-width constrains it to 200px.
  The final size is 200px. <=== Note this caused an overflow of the container and should be investigated for correctness.
*/
```

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-fixing-content-for-responsiveness-understand-rendered-width-and-how-it-causes-overflow-flexible-items-impacts-how-content-can-be-sized"></a>
##### Flexible items impacts how content can be sized

Flex containers with the default `flex-wrap: nowrap` value are often prone to unexpected overflow. The container with `display: flex` applies an implicit `flex: 0 1 auto` property on all children. This has unintended consequence as explained below. It's good practice to set the `flex` property explicitly on children to reduce discrepancies and show intent.

>For the purpose of this section, assume the `flex-direction` is `row`, which impacts the width dimension. For height, the same principle applies, but `flex-direction` would be `column`.

The `flex` property is a shorthand for three properties: `flex-grow`, `flex-shrink`, and `flex-basis`. Each have side-effect on the final element width calculation in addition to the previous `width`, `min-width`, and `max-width` properties.

- `flex-grow`: Indicates the proportion of the unallocated width of a container the flexible element should gain when redistributing the space. The gain will be constrained by `max-width` if present on the element.
  - This property usually doesn't cause overflow to occur.

- `flex-shrink`: Indicates the proportion by which an element should shrink to fit within an overflowing container. The compression will be constrained by `min-width` if present on the element.
  - This property could cause overflow to occur if set to `0` and the calculated width of all elements adds up to larger then the container itself.
  - Because `min-width` is assigned to `auto` in a flexible container, the element could be constrained in how much it can shrink. Re-assign `min-width` to prevent overflow due to large content. See earlier section about the pitfalls of `min-width: auto`.

- `flex-basis`: Sets the initial desired width of the element. The `auto` value assign the desired width as the size of its content, unless the `width` property is explicitly assigned, in which case the `width` property is the one that takes precedence.
  - This property could cause overflow to occur when used on large textual content. In such case, the text would overflow the width of the container. Using `flex-shrink: 1`, combined with a `min-width: 0`, would allow such content to fit the container again.

>__Note:__ Typical values for `flex-grow` and `flex-shrink` should be `0` or `1`. While other values are acceptable, they usually indicates hacky code and might have unintended consequence at very small or very large container size.

>__Note:__ As the [specification](https://www.w3.org/TR/css-flexbox-1/#flex-components) recommends, prefer setting all flex properties using the `flex` shorthand.

```css
/*
  Example of good practices using the flexible layout pattern
  - Each child is assigned an explicit flex shorthand property.
  - min-width is re-assigned when it could cause overflow due to automatic sizing.
*/

.ext-flexcontainer {
    display: flex;
    width: 100%;
}

.ext-icon {
    /* The icon should not change in size */
    flex: 0 0 auto;
    /* The size is explicit */
    width: 20px;
}

.ext-text {
    /* Text content should adapt to the remaining space in the container, regardless of the content size */
    flex: 1 1 auto;
    /* Ensure the size can be reduced when text is larger than remaining space.
       While the min-width could be calc(100% - 20px) to at least insure it constrains to the flex container,
       it is simpler to reset to 0 in this simple (and most other) scenario. */
    min-width: 0;
}
```

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-fixing-content-for-responsiveness-watch-for-pinned-ui-on-small-viewport-height"></a>
#### Watch for pinned UI on small viewport height

The portal allows for pinned UI when the viewport height of the browser is greater than 500px. Pinned UI (also known as docked content) takes up fixed amount of spaces in the UI. This could cause some content to have very little remaining space to render.

If using pinned UI, verify that it can still render properly at a viewport height of 500px. Blade content at that resolution has 350px left of content height. Pinning UI at top and bottom of such blades could significantly reduce the main content usability.

```html
<!-- Typical usage of msportalfx-docking that should be reviewed at small viewport height. -->
<div class="msportalfx-docking">
    <div class="msportalfx-docking-header">Always takes space at the top<div>
    <div class="msportalfx-docking-body">This content is at risk of being crushed by the header and footer!<div>
    <div class="msportalfx-docking-footer">Always takes space at the bottom<div>
</div>
```

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-fixing-content-for-responsiveness-consider-a-media-query-to-control-layout-based-on-min-width-of-container"></a>
#### Consider a media query to control layout based on min-width of container

Media queries allow to add specificity to your CSS without adding new classes.

Ibiza SDK supports the `min-width` directive only. For maintainability and readability, structure media query directives from smallest to largest.

```css
/*
 * An example usage of min-width media query.
 * Content is allowed to wrap in a flex box until 640px.
 */
.ext-container {
    display: flex;
    flex-flow: row wrap;
}

@media (min-width: 640px) {
    .ext-container {
        flex-flow: row nowrap;
    }
}
```

>__Internal implementation note:__ Because Ibiza content isn't hosted in the viewport directly, but in containers, the media queries are adapted to the Ibiza container width instead of the viewport. This abstraction allows content implementers not to worry if the Ibiza container width is influenced by docked sidebars, menu blade table of content, or other elements impacting the container width.

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-fixing-content-for-responsiveness-leverage-the-layout-grid-when-content-sizing-is-flexible-and-adapts-to-specific-resolution"></a>
#### Leverage the layout grid when content sizing is flexible and adapts to specific resolution

The Ibiza SDK supports the same layout grid as Office Fabric UI. Review how it is used with [this documentation](https://developer.microsoft.com/en-us/fabric#/styles/web/layout) from Office Fabric UI.

Note that push/pull/offset aren't supported in the Ibiza part though.

A small addition for the documentation. Despite mentioning that columns should add up to 12, this is only if the columns are desired to be always the same in a row. Instead, one can create a very powerful UI by always keeping a single row of items where each item changes in size based on the container width.

```html
<!--
    A powerful example where all elements are in a single column by default
         at 640px width, elements are grouped two together on each row
         at 1024px width, elements are grouped three together on each row
         at 1920px width, elements are grouped four together on each row
-->
<div class="ms-Grid" dir="ltr">
  <div class="ms-Grid-row">
    <div class="ms-Grid-col ms-sm12 ms-lg6 ms-xlg4 ms-xxxlg3"><div>A</div></div>
    <div class="ms-Grid-col ms-sm12 ms-lg6 ms-xlg4 ms-xxxlg3"><div>B</div></div>
    <div class="ms-Grid-col ms-sm12 ms-lg6 ms-xlg4 ms-xxxlg3"><div>C</div></div>
    <div class="ms-Grid-col ms-sm12 ms-lg6 ms-xlg4 ms-xxxlg3"><div>D</div></div>
    <div class="ms-Grid-col ms-sm12 ms-lg6 ms-xlg4 ms-xxxlg3"><div>E</div></div>
    <div class="ms-Grid-col ms-sm12 ms-lg6 ms-xlg4 ms-xxxlg3"><div>F</div></div>
    <div class="ms-Grid-col ms-sm12 ms-lg6 ms-xlg4 ms-xxxlg3"><div>G</div></div>
  </div>
</div>
```

>__Internal implementation note:__ Because Ibiza content isn't hosted in the viewport directly, but in containers, the layout grid was adapted to the Ibiza container width instead of the viewport. This abstraction allows content implementers not to worry if the Ibiza container width is influenced by docked sidebars, menu blade table of content, or other elements impacting the container width.

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-fixing-content-for-responsiveness-use-container-contentsize-api-when-the-content-cannot-be-fixed-with-css-or-the-layout-grid-alone"></a>
#### Use <code>container.contentSize</code> API when the content cannot be fixed with CSS or the layout grid alone

Some content might need code to be fixed. The `container.contentSize` API exists to support those scenarios.

```typescript
// An example usage of container.size API.
// Note how it is structured so that changes are applied in an additive way from small to large.
container.contentSize.subscribe(container, (size) => {
    const width = size.width;
    if (size.width >= 640) {
        // Change behavior at 640px
        // Example: add or remove elements from the templates.
    }

    if (size.width >= 1024) {
        // Change behavior at 1024px
    }
});
```

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-fixing-content-for-responsiveness-iframe-content-needs-special-treatment"></a>
#### Iframe content needs special treatment

>**A note about iframe content:** While a lot of the guidances described here also applies to iframe content, certain aspects, like the layout grid, aren't necessarily available in the iframe content. Refer to your iframe layout library for support.

*We are aware of an issue with iframe content when the height of the viewport is below 500px. In such cases, the portal would have to be aware of the content height of the iframe. Investigation is ongoing about the desired approach to take. It could be invasive (injecting a script to detect height change), or proactive from iframe owners (reporting back height to portal), or another technique not considered yet. A future update to this document will include how to address this problem.*

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-fixing-content-for-responsiveness-bad-pattern-percentage-based-paddings-margins-borders"></a>
#### Bad pattern: percentage based paddings/margins/borders

Paddings, margins, and borders should be sized in fixed pixels. If you must use a relative value, `em` is okay, but will be influenced by any change in font-size of the portal in the future.

Percentage based paddings, margins, and borders, won't display properly at large and small resolution, since they are proportional to the width of the container.

```css
/* Good */
.ext-container {
    padding: 16px;
}

/* Bad */
.ext-container {
    padding: 1%;
}
```

***

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-annotate-content-as-responsive"></a>
### Annotate content as responsive

Once the content is deemed ready, the content owner has to signal to the framework that it should be rendered in a responsive container. This can be done in one of two ways.

>__Note:__ The annotation works post SDK 1153.

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-annotate-content-as-responsive-content-level-reflowready-flag"></a>
#### Content level <code>reflowReady</code> flag

When the content is ready to be fully flexible, mark the content as `reflowReady`. The flag usage differs depending on the type of content.

>**Note:** The content level flag also turns on a rule that enforces the removal of any content width explicitly set on non-context pane content. If this is too much noise, consider the `reflowReadyDefault` flag, which doesn't have this enforcement enabled yet. Context pane width is exempt because it applies the maximum width constraint of the pane when rendered in a large enough resolution.

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-annotate-content-as-responsive-content-level-reflowready-flag-for-pdl-content"></a>
##### For PDL content

Annotate `reflowReady` on the declaration of the blade as an attribute.

```xml
<!-- Example PDL blades with ReflowReady attribute set -->
<Blade
    Name="BladeWithReflowReadyTrue"
    ViewModel="{...}"
    Template="{Html Source='...'}"
    ReflowReady=”True”>
    ...
</Blade>

 <TemplateBlade
    Name="TemplateBladeWithReflowReadyTrue"
    ViewModel="{...}"
    Template="{Html Source='...'}"
    ReflowReady="True">
    ...
</TemplateBlade>
```

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-annotate-content-as-responsive-content-level-reflowready-flag-for-typescript-content"></a>
##### For TypeScript content

Annotate `reflowReady` on the decorator as an additional option on the declaration.

```typescript
// An example TemplateBlade annotated with the reflowReady option.
@TemplateBlade.Decorator({
    htmlTemplate: "...",
    reflowReady: true,
})
export class TemplateBladeWithReflowReadyTrue {
    public title: string;
    public subtitle: string;

    public onInitialize() {
        return Q();
    }
}
```

<a name="responsive-design-with-ibiza-sdk-migrating-content-to-be-responsive-annotate-content-as-responsive-extension-wide-reflowreadydefault-flag"></a>
#### Extension wide <code>reflowReadyDefault</code> flag

The `reflowReadyDefault` flag sets the default value of the content level `reflowReady` flag. For existing extension this is set to `false`, while all future new extensions have this flag set to `true`. If a significant portion of the content of the extension is ready for responsive rendering, consider changing this flag value instead of each individual content.

The config switch is set in the `default.json` config file of the extension. Changing the value applies to all environment at once. Simply add a setting line in the file:

```json
{
  "reflowReadyDefault": true
}
```

>**Note:** It's possible to enable the `reflowReadyDefault` per environment config file. While doing so won't cause a compilation issue, it isn't a supported scenario to mix and match this flag on different domain on a long term basis. Portal cannot be responsible for discrepancies in rendering that occurs between environment if configured as such by extension owners, and no support will be provided for such scenario. Notice though that upstream verification in stages, such as enabling in RC, then MPAC, then PROD, is part of normal deployement strategy and is supported.

>**Note:** In a future release, likely post //Build 2020, content that mix and match `reflowReady` with content width explicitely set will trigger a build break about incompatible flags.

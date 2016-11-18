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

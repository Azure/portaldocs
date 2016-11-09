<properties linkid="" urlDisplayName="" pageTitle="Style Guide: Themed Color Classes" metaKeywords="" description="" metaCanonical="" services="" documentationCenter="" title="Style Guide: Themed Color Classes" authors="" solutions="" manager="" editor="" />

[Portal FX](/documentation/sections/portalfx) > [UI](/documentation/sections/portalfx#ui) > [Style Guide](/documentation/articles/portalfx-style-guide) > Themed Color Classes

# Style Guide: Themed Color Classes

Base colors within the portal have been outfitted to change based on user-chosen themes. Since the actual hex values of these colors are determined by the theme definitions themselves, acceptable contrast between elements must be maintained by framework. In order to react to theme changes and maintain readability, the following classes have been made available to extension authors:

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

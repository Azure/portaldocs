<properties title="" pageTitle="Style Sanitization" description="" authors="" />

[Portal FX](/documentation/sections/portalfx) > [UI](/documentation/sections/portalfx#ui) > [Style Guide](/documentation/articles/portalfx-style-guide) > Style Sanitization

# Style Guide: Style Sanitization

To ensure a consistent and sandboxed experience in the portal, CSS is analyzed at runtime to filter out disallowed properties or values. A typical example of a disallowed style is "`position: fixed;`", which would allow developers to move content outside of their parts.

All CSS properties should be allowed with a few exceptions documented at the end of this article. As the analysis is whitelist based, you may encounter CSS properties being erroneously filtered out. Shall this occur, report the issue on [Stack Overflow](https://stackoverflow.microsoft.com/).

The following properties only allow the specified values:

* position: [ static | relative | absolute ]
* text-transform: [ none | uppercase | lowercase ]

The following properties are sanitized out:

* font
* font-family
* list-style

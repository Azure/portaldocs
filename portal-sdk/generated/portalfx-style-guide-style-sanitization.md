<a name="style-guide-style-sanitization"></a>
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

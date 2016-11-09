<properties title="" pageTitle="SVG Icons FAQ" description="" authors="nickharris" />

[Portal FX](/documentation/sections/portalfx) > [UI](/documentation/sections/portalfx#ui) > [Icons](/documentation/articles/portalfx-icons) > Icon FAQ

# Icons: FAQ

## My icon is black!?!
You're probably circumventing our icon preprocessing which happens at build time and fixes up our icons so they can pass our html sanitizer (which is why it's black), minifies it, and makes it so they can react to different themes. 

*(Note: This will happen if you serve it via json).*

To work around this you can include the icon in your project normally, build, look at the generated file, find and copy your fresh sanitized svg markup, replace the html encoded carots and quotes, and that's it!

Next steps: [Working with Icons](/documentation/articles/portalfx-icons)
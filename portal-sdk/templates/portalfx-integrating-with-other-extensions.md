<properties title="" pageTitle="Extension Extensibility" description="" authors="nickharris" />

[Portal FX](/documentation/sections/portalfx) > [Framework](/documentation/sections/portalfx#framework) > Extensibility

# Extension Extensibility

One of the great things about the Azure portal is the ability for multiple services to blend together to form a cohesive user experience.  In many cases, extensions will want to share parts, share data, and kick off actions. There are a few examples where this is useful:

- The [Azure Websites](https://azure.microsoft.com/en-us/services/websites/) browse blade [includes a part](/documentation/articles/portalfx-extensibility-part-sharing) from [Visual Studio Online](http://www.visualstudio.com/en-us/products/what-is-visual-studio-online-vs.aspx) which sets up continuous deployment between a source code repository and a web site.

![Setting up continuous deployment with part sharing][part-sharing]

- After configuring continuous deployment, the Visual Studio Online extension informs the Azure Websites extension it is complete with a [RPC callback](/documentation/articles/portalfx-rpc).

To start learning more about parts, check out the topics below:

- [Part sharing](/documentation/articles/portalfx-parts-sharing)
- [Blade references](/documentation/articles/portalfx-extensibility-blade-reference)
- [RPC](/documentation/articles/portalfx-rpc)

Next steps: Learn about [part sharing](/documentation/articles/portalfx-parts-sharing).

[part-sharing]: ../media/portalfx-parts/part-sharing.png
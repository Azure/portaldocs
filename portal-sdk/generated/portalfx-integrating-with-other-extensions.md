
<a name="extension-extensibility"></a>
# Extension Extensibility

One of the great things about the Azure portal is the ability for multiple services to blend together to form a cohesive user experience.  In many cases, extensions will want to share parts, share data, and kick off actions. There are a few examples where this is useful:

- The [Azure Websites](https://azure.microsoft.com/en-us/services/websites/) browse blade [includes a part](portalfx-extension-sharing-pde.md) from [Visual Studio Online](https://www.visualstudio.com/en-us/products/what-is-visual-studio-online-vs.aspx) which sets up continuous deployment between a source code repository and a web site.

![Setting up continuous deployment with part sharing][part-sharing]

- After configuring continuous deployment, the Visual Studio Online extension informs the Azure Websites extension it is complete with a [RPC callback](portalfx-rpc.md).

To start learning more about parts, check out the topics below:

- [Part sharing](portalfx-extension-sharing-pde.md)
- [Blade references](portalfx-extensibility-blade-reference.md)
- [RPC](portalfx-rpc.md)

Next steps: Learn about [part sharing](portalfx-extension-sharing-pde.md).

[part-sharing]: ../media/portalfx-parts/part-sharing.png

### What version is required?

You must be on version [5.0.302.374](../generated/downloads.md) at least.

#### What is the resource menu?

The resource menu is the new pattern on what a resource blade should be, it creates a single location for all the resource's functionality.
It reduces horizontal movement by promoting the navigation menu from the settings list, what was the previous pattern, to a new concept of a menu blade.

![resourcemenu-resourcegroup][resourcemenu-resourcegroup-example]

#### Is there any samples I can refer to?

We have numerous samples covering the adoption of the resource menu which can be found in the samples extension. Look for the Desktop assets, or refer to:

```
..\SamplesExtension\Extension\Client\ResourceTypes\Desktop\AssetViewModels\DesktopViewModel.ts
```

#### How do I add items to the Support/Resource Management Group?

You can add items by using a MenuGroupExtension. MenuGroupExtension is a special kind of menu group, you can specify it as a group in the menu config object
See how to do this under the [creating an asset view model section][/documentation/articles/portalfx-resourcemenu-adoption#creating-an-assetviewmodel-if-you-havent-already-and-adding-a-method-to-your-assetviewmodel]

#### Do any other resources use this yet?

Yes! - IaaS, AppServices, Resource Groups, AppInsights and many others.
You can see this in the RC environment.

#### How much work is it to adopt this?

We have tried to keep the amount of churn to a minimum, you don't have to create a new blade we have a framework blade which adapts given a resource id.
All that is required is opting in and setting your menu items.
The Menu API is very similar to the settings list API which you are likely already using today.
We found porting the resource group over took less than a day's worth of work, the resource group only has 12 items in the menu so this will vary depending on the number of items you need to port.

#### I've adopted it but it's not showing up?

The resource menu is currently hidden behind a global feature flag, this will be turned on publically once we have majority adoption.
For testing purposes please use the following feature flag in your URL, this works in all environments.

```
?feature.resourcemenu=true
```

#### Will this be tracked in the weekly status email?

Yes, this is going to be tracked in the weekly status email.

#### I've noticed a bug how can I report it?

You can file a bug directly on Sean Watson using the link below, it will be triaged asap.
[Resource menu bug](http://aka.ms/portalfx/resourcemenubug)
Or if you don't have access to that template, email [ibiza Menu Blade](mailto:ibiza-menu-blade@microsoft.com) 


[resourcemenu-resourcegroup-example]: ../media/portalfx-resourcemenu/resourcemenu-resourcegroup.gif
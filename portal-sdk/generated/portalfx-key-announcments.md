<a name="deprecating-blade-customizations"></a>
## Deprecating blade customizations

We’re currently in the process of deprecating blade customizations, this process will take roughly a month. The choice to deprecate blade customization is driven by the superseded dashboard functionality, performance benefits and lack of usage.

This has been deployed in PROD since __9/12/16__. 

<a name="deprecating-blade-customizations-eta-for-production"></a>
### ETA for production

We will be removing the code which backs this in production after __10/10/16__.

First we will be enabling a feature flag that disables all this functionality, the ask of you is to verify none of your tests are broken when this functionality is enabled.
Please use the following feature flag to verify ?feature.disablebladecustomization = true

This will:
- Stop users adding new tiles to a blade
- Stop users adding new sections to a blade
- Stop users rearranging tile on a blade
- Stop users removing tiles from a blade
- Stop users resizing tiles on a blade
- Stop parts from mutating on blades __(*)__

This won’t:
- Force you (extension authors) to rewrite any of your blades
- Stop users pinning tiles to the dashboard
- Stop users customising dashboards
- Stop the use of part settings from parts on blades


__(*)__ To determine if you have a part which can mutate on your unlocked blade, you will have to look for something like the following:

```ts

partContainer.mutate(…);

```
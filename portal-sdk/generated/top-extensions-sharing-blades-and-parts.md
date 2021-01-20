<a name="sharing-blades-and-parts-across-extensions"></a>
## Sharing blades and parts across extensions

Each extension team develops their UI in terms of Blades and Parts. Further, they use FX APIs like `container.openBlade(…)` to link between their Blades and (less commonly) the `pin` function to affix Parts to user Dashboards. This is how they create the larger user experience for their service from their Blades and Parts, similar to the way they'd stitch together the pages of their own site via links.

Now, rather than perceiving each service like an island, Azure users value the ability to navigate between related services directly (from service A directly to service B) without the need to drill from the top-level (from "Browse", for instance). Users are accustomed to links in team A's UI leading to Blades from team B. They like to click a `Pin` command in a team C's resource Blade and pin a monitoring Part from the Monitor extension.

<a name="sharing-blades-and-parts-across-extensions-the-effect-cross-team-reuse-of-blades-parts"></a>
### The effect - Cross-team reuse of Blades/Parts

When developing your Blades and Parts, it's fairly simple to mark Blades/Parts to be "exported" for reuse by other teams.  Once a team "imports" Blades and Parts from another team and rebuilds their extension, they'll find code-generated Blade and Part reference definitions corresponding to the newly imported Blades and Parts.  These Blade and Part reference types work with Azure Portal FX APIs just like those generated for internally developed Blades/Parts:


```typescript

import { BladeReferences, PartReferences } from "Fx/Composition";

```

```typescript

public onOpenImportedBladeClick() {
    const { container } = this.context;
    container.openBlade(BladeReferences.forExtension("SamplesExtension").forBlade("ExportedBlade").createReference({
        parameters: { parameter1: "42" },
    }));
}

public onPinImportedPartClick() {
    pin([PartReferences.forExtension("SamplesExtension").forPart("ExportedPart").createReference({ parameters: { parameter1: "42" } })]);
}

```


<a name="sharing-blades-and-parts-across-extensions-the-process-of-exporting-and-importing"></a>
### The process of exporting and importing

This is the effect of importing Blades/Parts that have been exported by some other team. To achieve this between your extension A and some extension built by a partner team B, this is the set of steps to follow.

<a name="sharing-blades-and-parts-across-extensions-the-process-of-exporting-and-importing-step-1-prepare-your-blade-part-for-export"></a>
#### Step 1 - Prepare your Blade/Part for export

Exporting a Blade or Part from your extension requires a couple of simple steps.  First, apply the `forExport` option to your Blade or Part like so:

```typescript

@TemplateBlade.Decorator({
forExport: true,
})
export class ExportedBlade {

```

Second, relocate the Parameters interface type for your Blade or Part into a new `<YourExtensionProjectRootFolder>/Client/ForExport/<YourExtensionName>.d.ts` file that you'll share with your partner team B:

```typescript

/**
* API types for Blades and Parts exported from this extension.
* This TypeScript definition file will be redistributed to extension teams who reuse this extension's exported Blades
* and Parts.
* The types here are referenced by code-generated BladeReferences and PartReferences, enabling compiler verification for
* parameters passed to the exported Blades and Parts.
*/
declare namespace SamplesExtension {

   /**
    * API types for the exported 'ExportedBlade' Blade.
    */
   namespace ExportedBlade {

       /**
        * Defines the parameters that can be passed to 'ExportedBlade' when, for instance,
        * it is programmatically pinned using the 'pin' function in the 'Fx/Pinner' module.
        */
       interface Parameters {

           /**
            * An optional, sample parameter passed to 'ExportedBlade'.
            */
           parameter1?: string;
       }
   }
   
```

Notice that you'll partition your types using TypeScript namespaces, following a structure that reflects `<YourExtensionName>.<YourBladeOrPartName>.Parameters`.  This makes your types discoverable to teams that make use of this `.d.ts` file.  It also allows you to cleanly add new types as you export more Blades and Parts in the future.

You'll find that you have to fix up any type references to your Parameters type, illustrated here:

```typescript

public readonly context: TemplateBlade.Context<SamplesExtension.ExportedBlade.Parameters>;

```

With this, once you recompile your extension, you'll find the generated `<YourExtensionName>.pde` will be expanded to include entries for your newly exported Blade/Part.

<a name="sharing-blades-and-parts-across-extensions-the-process-of-exporting-and-importing-step-2-create-a-nuget-package-to-share-with-partner-teams-who-will-import-your-blades-parts"></a>
#### Step 2 - Create a NuGet package to share with partner teams who will import your Blades/Parts

Once you've completed step 1, you'll have two artifacts that you must share with your partner teams:
- The <YourExtensionName>.d.ts developed in step (1) above;
- The compiler-generated <YourExtensionName>.pde file.

For this next step, follow the instructions in [this doc](/portal-sdk/generated/portalfx-pde-publish.md#sharing-your-pde-with-other-teams) to produce and publish a NuGet package that your partner teams can use to import your Blades and Parts.

<a name="sharing-blades-and-parts-across-extensions-the-process-of-exporting-and-importing-step-3-partner-team-applies-the-nuget-package-and-rebuilds-their-extension"></a>
#### Step 3 - Partner team applies the NuGet package and rebuilds their extension

Once a partner team applies your NuGet package to their extension and rebuilds, they can verify that new  Blade and Part reference types are now generated for the newly imported Blades/Parts. The generated TypeScript for this resides in:

- <TheirExtensionProjectRootFolder>/Client/_generated/<YourExtensionName>/BladeReferenceTypes.d.ts
- <TheirExtensionProjectRootFolder>/Client/_generated/<YourExtensionName>/PartReferenceTypes.d.ts

<a name="sharing-blades-and-parts-across-extensions-the-process-of-exporting-and-importing-step-4-partner-team-integrates-the-imported-blades-parts-into-their-ui"></a>
#### Step 4 - Partner team integrates the imported Blades/Parts into their UI

Now, partner team's UI can make use of these new Blade / Part references in their code, repeated from above:

```typescript

import { BladeReferences, PartReferences } from "Fx/Composition";

```

```typescript

public onOpenImportedBladeClick() {
    const { container } = this.context;
    container.openBlade(BladeReferences.forExtension("SamplesExtension").forBlade("ExportedBlade").createReference({
        parameters: { parameter1: "42" },
    }));
}

public onPinImportedPartClick() {
    pin([PartReferences.forExtension("SamplesExtension").forPart("ExportedPart").createReference({ parameters: { parameter1: "42" } })]);
}

```

<a name="sharing-blades-and-parts-across-extensions-versioning-your-exported-blades-and-parts"></a>
### Versioning your exported Blades and Parts

Once you've successfully published a NuGet package for your exported Blades and Parts, your team is responsible for versioning these Blades and Parts in a responsible manner, so Azure users don't experience broken links or broken experiences in the Azure Portal.  You will take steps to avoid breaking your partner teams consuming your NuGet package over time. These steps include:

- Updating semantic version numbers for your NuGet package, so teams consuming your NuGet can update their version in a predictable manner
- Avoiding removing Blades and Parts from your NuGet package.  For instance,
	- Don't remove the `forExport` option from your Blades and Parts
	- Don't remove the Blade and Part classes themselves
- Modify the Parameters types in your `<YourExtensionName>.d.ts` file only in a manner that retains backwards compatibility with old versions.  For instance,
	- Don't add non-optional properties.  Only add optional properties.
	- Don't changes the types of properties in a way that breaks compilation.  Consider using TypeScript [`union types`](https://www.typescriptlang.org/docs/handbook/advanced-types.html) so you continue to support old property types along with any newly supported property types.

In situations where you must break Blades/Parts that you've already published via NuGet (for instance, you're retiring an old Blade), you will likely reach out to your partner teams to coordinate deployments around the breaking change, so no Azure users encounter disruptions.
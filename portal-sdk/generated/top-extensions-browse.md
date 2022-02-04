<a name="browse-table-of-contents"></a>
# Browse - Table of Contents

- [Browse - Table of Contents](#browse---table-of-contents)
- [Browse](#browse)
  - [Building browse experiences](#building-browse-experiences)
- [Start with Asset Type Definition](#start-with-asset-type-definition)
  - [Defining your asset type](#defining-your-asset-type)
    - [Display Name Determination](#display-name-determination)
    - [How to hide or show your asset in different environments](#how-to-hide-or-show-your-asset-in-different-environments)
      - [Self hosted](#self-hosted)
      - [Hosting service](#hosting-service)
      - [Testing your hidden asset](#testing-your-hidden-asset)
      - [How the options are applied from PDL, from the config JSON file and from the URL](#how-the-options-are-applied-from-pdl-from-the-config-json-file-and-from-the-url)
    - [Handling ARM kinds](#handling-arm-kinds)
    - [Display Name Overrides for Kinds](#display-name-overrides-for-kinds)
    - [Overriding Visibility of Kinds](#overriding-visibility-of-kinds)
    - [Choosing Asset Type and Kind Visibility Options](#choosing-asset-type-and-kind-visibility-options)
      - [Asset Type Only](#asset-type-only)
      - [Asset Type And Kinds](#asset-type-and-kinds)
    - [Add command (Create)](#add-command-create)
    - [Handling empty browse](#handling-empty-browse)
- [Browse with Azure Resource Graph](#browse-with-azure-resource-graph)
  - [Benefits to Tracking Resources with Azure Resource Graph](#benefits-to-tracking-resources-with-azure-resource-graph)
    - [Moving Forward](#moving-forward)
  - [Onboarding an asset to ARG](#onboarding-an-asset-to-arg)
    - [Expected Framework columns](#expected-framework-columns)
  - [KQL Query](#kql-query)
  - [PDL Definition](#pdl-definition)
    - [Adding a Query to PDL](#adding-a-query-to-pdl)
    - [Adding Custom columns](#adding-custom-columns)
    - [Column Formats](#column-formats)
    - [Source Units for Number Columns](#source-units-for-number-columns)
    - [Column Icons](#column-icons)
      - [Valid Icons for a `Status` Column](#valid-icons-for-a-status-column)
    - [Possible Summary Visualizations](#possible-summary-visualizations)
    - [Controlling column visibility via per-environment configuration](#controlling-column-visibility-via-per-environment-configuration)
      - [Testing your column manually](#testing-your-column-manually)
    - [Default columns](#default-columns)
    - [Exclude columns](#exclude-columns)
    - [Default filters](#default-filters)
    - [Full Asset Browse definition](#full-asset-browse-definition)
    - [Adding an informational info box with optional link to ARG browse](#adding-an-informational-info-box-with-optional-link-to-arg-browse)
      - [Browse Info Box Styles](#browse-info-box-styles)
  - [Releasing the Azure Resource Graph experience](#releasing-the-azure-resource-graph-experience)
  - [Column Summaries for Extension-provided Columns](#column-summaries-for-extension-provided-columns)
    - [Preventing the Column Summary](#preventing-the-column-summary)
    - [Specifying Visualizations to Show for Column Summary](#specifying-visualizations-to-show-for-column-summary)
    - [Custom Column Handling for Summary Views](#custom-column-handling-for-summary-views)
    - [Dealing with Non-scalar Values in Summary](#dealing-with-non-scalar-values-in-summary)
  - [Extensible commanding for ARG browse](#extensible-commanding-for-arg-browse)
    - [How to hide your asset commands in different environments](#how-to-hide-your-asset-commands-in-different-environments)
      - [Testing hiding/showing commands locally](#testing-hidingshowing-commands-locally)
    - [Controlling the visibility of your commands](#controlling-the-visibility-of-your-commands)
      - [Criteria](#criteria)
      - [Default behavior](#default-behavior)
    - [Experimenting with extensible commands in browse command bar](#experimenting-with-extensible-commands-in-browse-command-bar)
      - [How to force a specific treatment variable with query strings for local testing](#how-to-force-a-specific-treatment-variable-with-query-strings-for-local-testing)
      - [How to experiment with a new command](#how-to-experiment-with-a-new-command)
- [Merging Resource Types and Kinds](#merging-resource-types-and-kinds)
  - [Adding Additional Resource Type or Types to an Existing Asset Type](#adding-additional-resource-type-or-types-to-an-existing-asset-type)
    - [Original Asset Type and Query](#original-asset-type-and-query)
    - [Step One - Add the Merged Resource Type](#step-one---add-the-merged-resource-type)
    - [Step Two - Alter the Query to Include Both Resource Types](#step-two---alter-the-query-to-include-both-resource-types)
    - [Step Three - Add the new Asset Type](#step-three---add-the-new-asset-type)
  - [Merging Resources only with Specific Kind](#merging-resources-only-with-specific-kind)
  - [Controlling Initial Selection of Merged Resource Types](#controlling-initial-selection-of-merged-resource-types)
  - [Using Virtual Asset Types with Merged Resource Types](#using-virtual-asset-types-with-merged-resource-types)
- [Curating browse assets](#curating-browse-assets)
- [Providing a Custom Browse Hub](#providing-a-custom-browse-hub)
  - [Providing Menu Items for Related Asset Types](#providing-menu-items-for-related-asset-types)
  - [Example Menu Blade for Browse Hub](#example-menu-blade-for-browse-hub)
- [Custom browse blade](#custom-browse-blade)
- [Customization of Browse for Resources not available in Azure Resource Graph](#customization-of-browse-for-resources-not-available-in-azure-resource-graph)
  - [Customizing columns](#customizing-columns)
  - [Providing supplemental data](#providing-supplemental-data)
  - [Adding an informational message/link to ARM browse](#adding-an-informational-messagelink-to-arm-browse)
  - [Adding context menu commands](#adding-context-menu-commands)

<a name="browse"></a>
# Browse

The Favorites in the left nav and the 'All services' menu are the primary ways to launch tools and services within the portal. The default favorites are determined by C+E leadership based on the highest grossing services with the most engaged customers. New services will start in the 'All services' menu and, based on those metrics or the number of favorites surpasses other defaults, the list can be updated.

<a name="browse-building-browse-experiences"></a>
## Building browse experiences

The most optimized and efficient method for browse is to on board tracked resources into the Azure Resource Graph (ARG) resources tables.  The flexibility and features for filtering and summarizing resource in the resource group tables is far superior for those resources that can be onboarded.  If the resources cannot be onboarded, there is a fallback to use Azure Resource Manager (ARM) instead.

The first step to having an entry in the 'All services' menu and in global search which can launch the browse experience is to define an asset type and set the options to use ARG browse.  If ARG browse is not available, for ARM browse, the asset type is still required, so lets start there.

If you already have an asset type and wish to update to use ARG, you can skip ahead to this section: [Azure Resource Graph](#browse-with-azure-resource-graph)

If you need to use a custom blade for complete control, once the asset type is ready, skip to this section: [Custom browse blade](#custom-browse-blade)

Lastly, if you need to use ARM browse for your resources, once the asset type is ready, skip to this section:  [Azure Resource Manager](#customization-of-browse-for-resources-not-available-in-azure-resource-graph)

<a name="start-with-asset-type-definition"></a>
# Start with Asset Type Definition

Browse automatically queries the Azure Resource Graph (ARG) or Azure Resource Manager (ARM) for resources of a specific type and displays them in a grid. The performance and experience benefits of moving to utilize the Azure Resource Graph are outlined below and all new tracked resources should be implementing browse with ARG. Follow the instructions outlined here to set up browse for resources and then extend that to use browse using ARG in the section here [Azure Resource Graph](#browse-with-azure-resource-graph). If you already have an asset type using ARM browse, please follow the instructions in the Azure Resource Graph section to upgrade your browse experience today.

In this section we will explore the following:

1. Define an asset type in PDL
1. Specify the resource type
1. Indicate that it should be visible in Browse
1. Specify the API version that hubs extension should use to call ARM for the resource type
1. Specify the browse type

That's it, you can see an example of that below

DX.json:
```jsonc
"assetType": {
    "name": "Book",
    //...
    "browse": {
        "type": "ResourceType",
        //...
    },
    "resourceType": {
        "name": "Microsoft.Press/books",
        "apiVersion": "2016-01-01"
    }
}
```
<details>
<summary>Legacy PDL</summary>
<p><!-- do not remove following empty line -->

```xml
<AssetType Name="Book" ... >
  <Browse Type="ResourceType" />
  <ResourceType ResourceTypeName="Microsoft.Press/books" ApiVersion="2016-01-01" />
</AssetType>
```
</p>
</details>

![No-code Browse grid](../media/portalfx-browse/nocode.png)

All asset types have the following requirements:

1. The asset type blade **_must_** have a single `id` parameter that is the asset id
1. The asset type part must be the same as the blade's pinned part

> Asset types that represent Azure Resource Manager (ARM) resource types also have the following requirements:

1. The asset id **_must_** be the string resource id
1. The ARM RP manifest should include a RP, resource type, and resource kind metadata

<a name="start-with-asset-type-definition-defining-your-asset-type"></a>
## Defining your asset type

To define your asset type, simply add the following snippet to PDL:

DX.json:
```jsonc
"assetType": {
    "name": "MyAsset",
    "service": { "property": "MyAsset.service", "module": "../../ClientResources" },
    "displayNames": {
        "singular": { "property": "MyAsset.singular", "module": "../../ClientResources" },
        "plural": { "property": "MyAsset.plural", "module": "../../ClientResources" },
        "lowerSingular": { "property": "MyAsset.lowerSingular", "module": "../../ClientResources" },
        "lowerPlural": { "property": "MyAsset.lowerPlural", "module": "../../ClientResources" }
    },
    "keywords": { "property": "MyAsset.keywords", "module": "../..ClientResources" },
    "description": { "property": "MyAsset.description", "module": "../..ClientResources" },
    "icon": { "file": "../../Svg/MyAsset.svg" },
    "blade": "MyAssetBlade",
    "part": "MyAssetPart",
    "preview": true,
    // ...
}
```
<details>
<summary>Legacy PDL </summary>
<p><!-- do not remove following empty line -->

```xml
<AssetType
    Name="MyAsset"
    ServiceDisplayName="{Resource MyAsset.service, Module=ClientResources}"
    SingularDisplayName="{Resource MyAsset.singular, Module=ClientResources}"
    PluralDisplayName="{Resource MyAsset.plural, Module=ClientResources}"
    LowerSingularDisplayName="{Resource MyAsset.lowerSingular, Module=ClientResources}"
    LowerPluralDisplayName="{Resource MyAsset.lowerPlural, Module=ClientResources}"
    Keywords="{Resource MyAsset.keywords, Module=ClientResources}"
    Description="{Resource MyAsset.description, Module=ClientResources}"
    Icon="{Resource Content.MyExtension.Images.myAsset, Module=./../_generated/Svg}"
    BladeName="MyAssetBlade"
    PartName="MyAssetPart"
    IsPreview="true">
  ...
</AssetType>
```
</p>
</details>

The name can be anything, since it's scoped to your extension. You'll be typing this a lot, so keep it succinct, yet clear -- it will be used to identify asset types in telemetry. It is advised that the name not contain any white space.

In order to provide a modern voice and tone within the portal, asset types have 4 different display names. The portal will use the most appropriate display name given the context. If your asset type display name includes an acronym or product name that is always capitalized, use the same values for upper and lower display name properties (e.g. `displayNames.plural` and `displayNames.lowerPlural` in JSON (or `PluralDisplayName` and `LowerPluralDisplayName` in PDL) may both use `SQL databases`). Do not share strings between singular and plural display name properties. The display names should use sentence casing where acronyms, trademark/product names and the first letter of the uppercase display name should be capitalized but the rest should be lower case, ie use "Virtual machine" instead of "Virtual Machine" or use "Azure SQL database" instead of "Azure SQL Database".

- The 'All services' (browse) menu shows the `service` display name in JSON (or `ServiceDisplayName` in PDL) in the list of browseable asset types. If `service` in JSON (or `ServiceDisplayName` in PDL) is not available, `displayNames.plural` in JSON (or `PluralDisplayName` in PDL) will be shown instead.
- The All Resources blade uses the `displayNames.singular` in JSON (or `SingularDisplayName` in PDL) in the Type column, when visible.
- Browse uses the `displayNames.lowerPlural` in JSON (or `LowerPluralDisplayName` in PDL) when there are no resources (e.g. "No web apps to display").
- Browse uses the `displayNames.lowerPlural` in JSON (or `LowerPluralDisplayName` in PDL) as the text filter placeholder.

Filtering functionality within the 'All services' (browse) menu searches over `keywords` in JSON (or `Keywords` in PDL). `Keywords` is a comma-separated set of words or phrases which
allow users to search for your asset by identifiers other than than the set display names.

<a name="start-with-asset-type-definition-defining-your-asset-type-display-name-determination"></a>
### Display Name Determination

For the type display name, the asset type can define the display name values. The way that the type display name is derived works like this:

1. If there is a ServiceDisplayName on the asset type, use that.
1. Otherwise if there is a CompositeDisplayName (or individual display names) on the asset type, use the appropriate case and plurality of that value.
1. If there are no display names available, use the raw resource type string.

Remember, your part and blade should both have a single `id` input parameter, which is the resource id:

```ts
/**
 * View model for the asset tile.
 */
@TemplatePart.Decorator({
    supportedSizes: [
        TemplatePart.Size.Normal,
        TemplatePart.Size.Wide,
        TemplatePart.Size.Large,
    ],
    initialSize: TemplatePart.Size.Wide,
    htmlTemplate: "Tile.html",
    styleSheets: ["Tile.css"],
    forAsset: {
        assetIdParameter: "id",
        assetType: "MyAsset",
    },
})
@TemplatePart.InjectableModel.Decorator(DataContext)
export class MyAssetPart {
    // Required. Must be the only input parameter.
    public context: TemplatePart.Context<{ id: string }, DataContext>;
    // ...
}

/**
 * View model for the asset blade.
 */
@TemplateBlade.Decorator({
    htmlTemplate: "Blade.html",
    styleSheets: ["Blade.css"],
    forAsset: {
        assetIdParameter: "id",
        assetType: "MyAsset",
    },
})
@TemplateBlade.Pinnable.Decorator()
@TemplateBlade.InjectableModel.Decorator(DataContext)
export class MyAssetBlade {
    // Required. Must be the only input parameter.
    public context: TemplateBlade.Context<{ id: string }, DataContext>;
    // ...
}
```

<details>
<summary>Legacy PDL</summary>
<p>

If still using older PDL part and tile definitions:

```xml
<Part Name="MyAssetPart" ViewModel="MyAssetPartViewModel" AssetType="MyAsset" AssetIdProperty="id" ...>
  <Part.Properties>
    <!-- Required. Must be the only input parameter. -->
    <Property Name="id" Source="{DataInput Property=id}" />
  </Part.Properties>
  <BladeAction Blade="MyAssetBlade">
    <BladeInput Source="id" Parameter="id" />
  </BladeAction>
  ...
</Part>

<Blade Name="MyAssetBlade" ViewModel="MyAssetBladeViewModel" AssetType="MyAsset" AssetIdProperty="id">
  <Blade.Parameters>
    <!-- Required. Must be the only input parameter. -->
    <Parameter Name="id" Type="Key" />
  </Blade.Parameters>
  <Blade.Properties>
    <Property Name="id" Source="{BladeParameter Name=id}" />
  </Blade.Properties>
  ...
</Blade>
```
</p>
</details>

If your asset type is in preview, set the `preview=true` in JSON (or `IsPreview="true"` in PDL) property. If the asset type is GA, simply remove the property (the default is `false`).

<a name="start-with-asset-type-definition-defining-your-asset-type-how-to-hide-or-show-your-asset-in-different-environments"></a>
### How to hide or show your asset in different environments

You can hide or show your asset in different environments by setting the assettypeoptions extension feature flag in your config which is a rich object
structure which allows changing not only asset types, but also hiding and showing asset instances in browse and global search as well as hiding and showing
asset instances with a specific resource kind. *This supersedes the legacy hideassettypes extension feature flag.*

```jsonc
    {
        "assettypeoptions": {
          "YOUR_ASSET_NAME": { "options": "HideAssetType" },
          "YOUR_OTHER_ASSET_NAME": { "options": "HideAssetType,HideInstances" },
          "YOUR_THIRD_ASSET_NAME": { "options": "" }
        }
    }
```

The "options" value is a comma-separated list of options which will be applied to the asset type:

Options| Result
--- | ---
HideAssetType | Hides the asset type from the All services left navigation
HideInstances | Hides any instances of the asset type in browse all resources and global search
HideAssetType,HideInstance | Hide the asset type from left navigation AND hides any instances in browse and global search
*empty string* | This will show the asset type in left navigation AND shows instances in browse and global search

*Importantly*, if HideInstances is used on an asset type, using resource type-specific browse will show those instances in that browse.

<div style="margin-bottom: 20px; background-color: #fff; border: 1px solid transparent; border-radius: 4px; -webkit-box-shadow: 0 1px 1px rgb(0 0 0 / 5%); box-shadow: 0 1px 1px rgb(0 0 0 / 5%); border-color: rgba(251,162,37,.3);">
<p style="background-color: rgba(251,162,37,.3);
    border-color: rgba(251,162,37,.3); color: #e14329; padding: 5px">**IMPORTANT**</p>
<div style="padding: 0 15px 10px; color: black;">
When providing `assettypeoptions` in a configuration JSON file, values are not merged from per-environment configuration files with the values in the default.json file, even if the `assettypeoptions` is not defined in the per-environment. If, as an example, there is a portal.azure.com.json file, then `assettypeoptions` must be defined in that file as well as the default.json file and when using portal.azure.com only the values from portal.azure.com.json will be used. If the per-environment JSON file does not exist for the environment, then the default.json file value will be used.
</div>
</div>

The case of empty string strips off any visibility options provided in PDL. The options are applied to the asset type, essentially replacing the options in PDL.

As mentioned above, visibility of instances with a specific resource kind can also be controlled if the kind is specified in the PDL:

```jsonc
    {
        "assettypeoptions": {
          "YOUR_ASSET_NAME": { "options": "HideAssetType" },
          "YOUR_OTHER_ASSET_NAME": { "options": "HideAssetType,HideInstances" },
          "YOUR_THIRD_ASSET_NAME": { "options": "" },
          "YOUR_ASSET_WITH_KINDS_NAME": { "kinds": { "KIND_NAME": { "options": "HideInstances" } } }
        }
    }
```

In this example, the instances of the asset type 'YOUR_ASSET_WITH_KINDS_NAME' which have the kind of 'KIND_NAME' will be hidden. Note that the 'HideAssetType' option does
not apply to kind, only the 'HideInstances' option.

There is also no way to show hidden asset types or hide / show specific kinds using the old configuration flags, so please move to 'assettypeoptions'.

<a name="start-with-asset-type-definition-defining-your-asset-type-how-to-hide-or-show-your-asset-in-different-environments-self-hosted"></a>
#### Self hosted

This now reads the config JSON file for the appropriate environment, so follow the same procedure as for the Hosting service next.

<a name="start-with-asset-type-definition-defining-your-asset-type-how-to-hide-or-show-your-asset-in-different-environments-hosting-service"></a>
#### Hosting service

If you’re using the hosting service, you can do this by updating your domainname.json (e.g. portal.azure.cn.json file)

```jsonc
    {
        "assettypeoptions": {
          "YOUR_ASSET_NAME": { "options": "HideAssetType" },
          "YOUR_OTHER_ASSET_NAME": { "options": "HideAssetType,HideInstances" },
          "YOUR_THIRD_ASSET_NAME": { "options": "" },
          "YOUR_ASSET_WITH_KINDS_NAME": { "kinds": { "KIND_NAME": { "options": "HideInstances" } } }
        }
    }
```

**IMPORTANT** These flags cannot be mixed with the legacy 'hideassettypes' flag. If the config provides an 'assettypeoptions' flag, 'hideassettypes' flag
will be ignored. This is one reason that using 'assettypeoptions' is preferred and use of 'hideassettypes' should be deprecated.

<a name="start-with-asset-type-definition-defining-your-asset-type-how-to-hide-or-show-your-asset-in-different-environments-testing-your-hidden-asset"></a>
#### Testing your hidden asset

To test enable your hidden asset for testing purposes, you will need to update the hide asset feature flag to exclude the asset you want to show and ensure you have feature.canmodifyextensions set.

For the desired environment append the following feature flags.
> If you want to test showing all hidden assets, you can specify all the assets as a comma separated list to the 'showassettypes' extension feature flag.

```txt
    ?microsoft_azure_mynewextension_assettypeoptions={"MyNewAsset":{"options":""},"MySecondNewAsset":{"options":""}}
```

For example:
https://rc.portal.azure.com/?microsoft_azure_compute_assettypeoptions={"VirtualMachine":{"options":""}}&microsoft_azure_compute=true&feature.canmodifyextensions=true

or testing the hiding of an asset can be achieved with:
https://rc.portal.azure.com/?microsoft_azure_compute_assettypeoptions={"VirtualMachine":{"options":"HideAssetType"}}&microsoft_azure_compute=true&feature.canmodifyextensions=true

<a name="start-with-asset-type-definition-defining-your-asset-type-how-to-hide-or-show-your-asset-in-different-environments-how-the-options-are-applied-from-pdl-from-the-config-json-file-and-from-the-url"></a>
#### How the options are applied from PDL, from the config JSON file and from the URL

There is a definitive recipe for how visibility options are applied to asset types and kinds from the various sources of PDL, config JSON files and via
overrides on the URL. The PDL has the lowest priority and should be considered the defaults. Whatever options you apply in PDL will be already applied to
the asset type. Once the portal loads, the config JSON file for the appropriate domain is loaded and overrides are applied from there. The options flags
are replaced by the flags from config. The 'assettypeoptions' are applied if present, otherwise 'hideassettypes' are applied if present. Note that if
both are supplied, only the 'assettypeoptions' will be used. After that, the URL extension feature flag will have the highest priority and will be applied
last. Again, if the 'MyExtensionName_assettypeoptions' feature flag is in the URL, it will be applied.  Otherwise, if the 'MyExtensionName_showassettypes'
feature flag is present, it will be applied. Otherwise, if the 'MyExtensionName_hideassettypes' feature flag is present, it will be applied. Note that
the only asset types affected are those in the config or feature flag. Other asset types will not be affected:

1. PDL flags are baked into the asset type definition at compile time.
2. Config is applied:
3. If the 'assettypeoptions' is present, apply any changes, jump to step 5
4. If the 'hideassettypes' is present, apply any changes, jump to step 5 - this is considered legacy and should be replaced with assettypeoptions.
5. URL overrides are applied:
6. If the 'MyExtensionName_assettypeoptions' feature flag is present, apply any changes, jump to end
7. If the 'MyExtensionName_showassettypes' feature flag is present, apply any changes, jump to end - this is considered legacy and should be replaced with assettypeoptions.
8. If the 'MyExtensionName_hideassettypes' feature flag is present, apply any changes, jump to end - this is considered legacy and should be replaced with assettypeoptions.

As shown, if 'assettypeoptions' and 'hideassettypes' are all present in the config, the 'hideassettypes' will be ignored. The 'hideassettypes' flag is considered legacy and
should be replaced with 'assettypeoptions'.

Also, if 'assettypeoptions', 'showassettypes' and 'hideassettypes' are all present in the URL, the 'showassettypes' and 'hideassettypes' will be ignored
and if only 'showassettypes' and 'hideassettypes' are specified, 'hideassettypes' will be ignored. Both 'showassettypes' and 'hideassettypes' are both considered to be legacy
and should be replaced with 'assettypeoptions'.

<a name="start-with-asset-type-definition-defining-your-asset-type-handling-arm-kinds"></a>
### Handling ARM kinds

If the resource you wish to expose does not have kinds then please skip to the next topic.

ARM has the capability for a resource to define kinds, in some cases you may want to treat those kinds separately in the portal.

To define a kind for your asset, you need to declare the kind as a child of the `ResourceType` within PDL. Firstly you will need to specify a default kind,
this kind inherits the blade/part defined in the Asset. The default kind is identified with `"default"=true` in JSON (or `IsDefault="true"` in PDL).

If your resource exposes multiple kinds you can declare them as siblings of the default kind.

Exposing your kind within the 'All services' menu will require your kind/asset to be curated within the Portal Framework. The framework also offers
ways for grouping kinds together when browsing to those kinds. There are two options you can use group your kinds:

1. Kind groups
    - This will define a separate kind group within your extensions definition which can be used as a way to define a single view for multiple kinds while also keeping the individual kind view.  In JSON, the kind object should include a `groupedKinds` property which is the array of references to other kinds.  In PDL, use `KindGroup` instead of `Kind` for the group and include the `KindReferences`.
2. Merged kinds
    - Similar to kind groups merged kinds will group various kinds together and present them in a single view, except merged kind forces any instance of the individual kinds to be viewed as the merged view.  In JSON, the kind object should include a `mergedKinds` property which is the array of kind objects to be merged together.  In PDL use `MergedKind` instead of `Kind` for the merged kinds and include `Kind` entries inside.

DX.json:
```jsonc
// This asset type represents a watch instance.

// An asset type represents an asset object in the system independent of other objects in the system.
// It represents a singular class of objects distinctively but without connection to other objects.

// This asset type includes a resource type which represents a watch instance in the resource map.

// A resource type represents an asset specifically in a resource map where the connections between
// objects is important.  It represents a way to map resources in a resource map to the underlying
// assets in the system.

// It includes the resource map icons which are used in the resource map control.

// Watch is an "abstract" asset type, there is no such thing as a "watch", the default
// watch type is a "apple" watch.  Other specializations are based on function.
"assetType": {
  "name": "Watch",
  "displayNames": "AssetTypeNames.Watch",
  "viewModel": { "name": "WatchViewModel", "module": "AssetType/Watch" },
  "icon": { "file": "../../Svg/Watches/generic.svg" },
  "part": "AppleWatchTile",
  "blade": "AppleWatchBlade",
  "create": { "marketplacePackageId": "Microsoft/watch" },
  "resourceMenu": { "resourceProvidedBy": "ProvidedByResourceMenu" },
  "browse": {
    "type": "ResourceType",
    "query": { "file": "WatchQuery.kml" },
    "defaultColumns": ["model", "status"],
    "customConfig": { "useSupplementalData": true },
    "columns": [
      {
        "name": "model",
        "displayName": "Columns.Watch.model",
        "description": "Columns.Watch.modelDescription",
        "format": "String",
        "width": "90fr"
      },
      {
        "name": "status",
        "displayName": "Columns.Watch.status",
        "description": "Columns.Watch.statusDescription",
        "format": "Status",
        "width": "80fr",
        "iconColumn": "statusIcon"
      }
    ]
  },
  "resourceType": {
    "name": "Microsoft.Test/watches",
    "apiVersion": "2017-04-01",
    "kinds": [
      {
        "name": "apple",
        "default": true,
        "displayNames": "AssetTypeNames.Watch.Apple",
        "icon": { "file": "../../Svg/Watches/apple.svg" },
        "create": { "marketplacePackageId": "Microsoft/applewatch" }
      },
      {
        "name": "astro",
        "displayNames": "AssetTypeNames.Watch.Astro",
        "icon": { "file": "../../Svg/Watches/astro.svg" },
        "part": "AstroWatchTile",
        "blade": "AstroWatchBlade"
      },
      {
        "name": "lg",
        "displayNames": "AssetTypeNames.Watch.LG",
        "icon": { "file": "../../Svg/Watches/lg.svg" },
        "preview": true,
        "part": "LgWatchTile",
        "blade": "LgWatchBlade"
      },
      {
        "name": "samsung",
        "displayNames": "AssetTypeNames.Watch.Samsung",
        "icon": { "file": "../../Svg/Watches/samsung.svg" },
        "preview": true,
        "part": "SamsungWatchTile",
        "blade": "SamsungWatchBlade"
      },
      {
        "name": "fitbit",
        "displayNames": "AssetTypeNames.Watch.Fitbit",
        "icon": { "file": "../../Svg/Watches/fitbit.svg" },
        "part": "FitbitWatchTile",
        "blade": "FitbitWatchBlade"
      },
      {
          "name": "android",
          "displayNames": "AssetTypeNames.Watch.Android",
          "icon": { "file": "../../Svg/Watches/android.svg" },
          "groupedKinds": ["lg", "samsung"]
      },
      {
        "name": "garmin-merged",
        "mergedKinds": [
          {
            "name": "garmin",
            "displayNames": "AssetTypeNames.Watch.Garmin",
            "icon": { "file": "../../Svg/Watches/garmin.svg" },
            "part": "GarminWatchTile",
            "blade": "GarminWatchBlade"
          },
          {
            "name": "garmin2",
            "displayNames": "AssetTypeNames.Watch.Garmin2",
            "icon": { "file": "../../Svg/Watches/garmin2.svg" },
            "part": "Garmin2WatchTile",
            "blade": "Garmin2WatchBlade"
          }
        ]
      },
      {
        "name": "fitness",
        "displayNames": "AssetTypeNames.Watch.Fitness",
        "icon": { "file": "../../Svg/Watches/fitness.svg" },
        "groupedKinds": ["apple", "lg", "fitbit", "garmin-merged"]
      }
    ]
  }
}
```
<details>
<summary>Legacy PDL</summary>
<p><!-- do not remove following empty line -->

```xml
<!--
    This asset type represents a watch instance.

    An asset type represents an asset object in the system independent of other objects in the system.
    It represents a singular class of objects distinctively but without connection to other objects.

    This asset type includes a resource type which represents a watch instance in the resource map.

    A resource type represents an asset specifically in a resource map where the connections between
    objects is important.  It represents a way to map resources in a resource map to the underlying
    assets in the system.

    It includes the resource map icons which are used in the resource map control.

    Watch is an "abstract" asset type, there is no such thing as a "watch", the default
    watch type is a "apple" watch.  Other specializations are based on function.
  -->
  <AssetType Name="Watch"
             ViewModel="{ViewModel Name=WatchViewModel, Module=./Watch/AssetType/Watch}"
             CompositeDisplayName="{Resource AssetTypeNames.Watch, Module=ClientResources}"
             Icon="{Svg File=../../Svg/Watches/generic.svg}"
             BladeName="AppleWatchBlade"
             PartName="AppleWatchTile"
             MarketplaceItemId="Microsoft/watch">
    <Browse Type="ResourceType"
            UseCustomConfig="true"
            UseSupplementalData="true" />
    <ResourceMenu ResourceProvidedBy="NoResource" />
    <ResourceType ResourceTypeName="Microsoft.Test/watches"
                  ApiVersion="2017-04-01">
      <Kind Name="apple"
            IsDefault="true"
            CompositeDisplayName="{Resource AssetTypeNames.Watch.Apple, Module=ClientResources}"
            Icon="{Svg File=../../Svg/Watches/apple.svg}" />
      <Kind Name="lg"
            CompositeDisplayName="{Resource AssetTypeNames.Watch.LG, Module=ClientResources}"
            Icon="{Svg File=../../Svg/Watches/lg.svg}"
            BladeName="LgWatchBlade"
            PartName="LgWatchTile" />
      <Kind Name="samsung"
            CompositeDisplayName="{Resource AssetTypeNames.Watch.Samsung, Module=ClientResources}"
            Icon="{Svg File=../../Svg/Watches/samsung.svg}"
            BladeName="SamsungWatchBlade"
            PartName="SamsungWatchTile" />
      <Kind Name="fitbit"
            CompositeDisplayName="{Resource AssetTypeNames.Watch.Fitbit, Module=ClientResources}"
            Icon="{Svg File=../../Svg/Watches/fitbit.svg}"
            BladeName="FitbitWatchBlade"
            PartName="FitbitWatchTile" />
      <!--
        The 'android' kind group wraps the lg and samsung kinds into a single kind. The 'android' kind is an abstract
        kind. There should never be a watch with the kind set to 'android'. Instead it's used to group kinds into
        a single list. However, 'lg' watches and be seen separately, same with 'samsung' watches. The 'android' kind
        will be emitted to the manifest as a kind.
      -->
      <KindGroup Name="android"
            CompositeDisplayName="{Resource AssetTypeNames.Watch.Android, Module=ClientResources}"
            Icon="{Svg File=../../Svg/Watches/android.svg}">
        <KindReference KindName="lg" />
        <KindReference KindName="samsung" />
      </KindGroup>
      <!--
        The 'garmin-merged' kind has two merged kinds, 'garmin' and 'garmin2'. The 'garmin-merged' kind is not a real
        kind and is not emitted to the manifest as a kind, it is organizational only.
      -->
      <MergedKind Name="garmin-merged">
        <Kind Name="garmin"
              CompositeDisplayName="{Resource AssetTypeNames.Watch.Garmin, Module=ClientResources}"
              Icon="{Svg File=../../Svg/Watches/garmin.svg}"
              BladeName="GarminWatchBlade"
              PartName="GarminWatchTile" />
        <Kind Name="garmin2"
              CompositeDisplayName="{Resource AssetTypeNames.Watch.Garmin2, Module=ClientResources}"
              Icon="{Svg File=../../Svg/Watches/garmin2.svg}"
              BladeName="Garmin2WatchBlade"
              PartName="Garmin2WatchTile" />
      </MergedKind>
    </ResourceType>
  </AssetType>
```
</p>
</details>

<a name="start-with-asset-type-definition-defining-your-asset-type-display-name-overrides-for-kinds"></a>
### Display Name Overrides for Kinds

For the type display name, the kind can override the values on the asset type. The way that the type display name is derived works like this:

1. If there is a kind which matches the resource's kind, use the kind's ServiceDisplayName if present.
1. Otherwise, if the kind's CompositeDisplayName is present (or individual display names), use the appropriate case and plurality of that value.
1. If there kind has not display name or no kind is found or there is no kind, fall back to the asset type display name.
1. If there is a ServiceDisplayName on the asset type, use that.
1. Otherwise if there is a CompositeDisplayName (or individual display names) on the asset type, use the appropriate case and plurality of that value.
1. If there are no display names available, use the raw resource type string.

<a name="start-with-asset-type-definition-defining-your-asset-type-overriding-visibility-of-kinds"></a>
### Overriding Visibility of Kinds

Just as the type display name, blade, part and icon can be overridden per kind in the Kind entries, visibility of the
kind and instances of resources of the kind can be overridden using the Options property on the Kind.

```jsonc
    {
        "assettypeoptions": {
          "YOUR_ASSET_NAME": { "kinds": { "apple": { "options": "ShowInstances" }, "lg": { "options": "HideAssetType" } } }
        }
    }
```

The "options" value is a comma-separated list of options which will be applied to the asset type:

Options| Result
--- | ---
HideAssetType | Hides any curated kind-based asset type entry from the All services left navigation
ShowAssetType | Shows any curated kind-based asset type entry in the All services left navigation - used to show a kind where the parent asset type is hiding the asset type (override)
HideInstances | Hides any instances of the asset type with the kind in browse all resources and global search
ShowInstances | Shows any instances of the asset type with the kind in browse all resources and global search - used to show instances of a resource with the kind where the parent asset type is hiding instances (override)
HideAssetType,HideInstance | Hide the asset type from left navigation AND hides any instances in browse and global search
HideAssetType,ShowInstance | Hide the asset type from left navigation BUT shows any instances in browse and global search
ShowAssetType,HideInstance | Show the asset type in left navigation BUT hides any instances in browse and global search
ShowAssetType,ShowInstance | Show the asset type in left navigation AND shows any instances in browse and global search
*empty string* | This will show the asset type in left navigation AND shows instances in browse and global search

Importantly, if HideInstances is used on a kind, using resource type-specific browse with a kind filter will show those
instances in that browse.

<div style="margin-bottom: 20px; background-color: #fff; border: 1px solid transparent; border-radius: 4px; -webkit-box-shadow: 0 1px 1px rgb(0 0 0 / 5%); box-shadow: 0 1px 1px rgb(0 0 0 / 5%); border-color: rgba(251,162,37,.3);">
<p style="background-color: rgba(251,162,37,.3);
    border-color: rgba(251,162,37,.3); color: #e14329; padding: 5px">**IMPORTANT**</p>
<div style="padding: 0 15px 10px; color: black;">
When providing `assettypeoptions` in a configuration JSON file, values are not merged from per-environment configuration files with the values in the default.json file, even if the `assettypeoptions` is not defined in the per-environment. If, as an example, there is a portal.azure.com.json file, then `assettypeoptions` must be defined in that file as well as the default.json file and when using portal.azure.com only the values from portal.azure.com.json will be used. If the per-environment JSON file does not exist for the environment, then the default.json file value will be used.
</div>
</div>


<a name="start-with-asset-type-definition-defining-your-asset-type-choosing-asset-type-and-kind-visibility-options"></a>
### Choosing Asset Type and Kind Visibility Options

Choosing the visibility options for the asset type and kinds is very powerful and configurable to ensure customers see
what they should be seeing.

<a name="start-with-asset-type-definition-defining-your-asset-type-choosing-asset-type-and-kind-visibility-options-asset-type-only"></a>
#### Asset Type Only

First, if your resource type has no kinds (or the kinds do not affect visibility), it is fairly straight-forward to
choose the options.

Entry in All Services / Global Search | Show Resources in Browse All / Global Search | Options to use
-|-|-
Show entry | Show resources | no Options, empty string OR "ShowAssetType,ShowInstances"
Show entry | Hide resources | "HideInstances" OR "ShowAssetType,HideInstances"
Hide entry | Show resources | "HideAssetType" OR "HideAssetType,ShowInstances"
Hide entry | Hide resources | "HideAssetType,HideInstances"

<a name="start-with-asset-type-definition-defining-your-asset-type-choosing-asset-type-and-kind-visibility-options-asset-type-and-kinds"></a>
#### Asset Type And Kinds

However, if you have Kind entries with different visibility needs, it is a bit more complicated to choose the options
for the asset type and the kinds. The visibility of the asset type entry and the instances is split into two charts, but
the flags can be combined separated by a comma to achieve the end result.

Asset type entry in All Services / Global Search | Kind entry in All Services / Global Search | Asset Type Options | Kind Options
-|-|-|-
Show entry | Show entry | no Options OR empty | no Options OR empty
Show entry | Hide entry | no Options OR empty | "HideInstances"
Hide entry | Show entry | "HideInstances" | "ShowInstances"
Hide entry | Hide entry | "HideInstances" | no Options OR empty

Show Resources in Browse All / Global Search | Show Resources with Kind in Browse All / Global Search | Asset Type Options | Kind Options
-|-|-|-
Show resources | Show resources | no Options OR empty | no Options OR empty
Show resources | Hide resources | no Options OR empty | "HideInstances"
Hide resources | Show resources | "HideInstances" | "ShowInstances"
Hide resources | Hide resources | "HideInstances" | no Options OR empty

So, as an example, if you wanted to show the asset type in the all services menu but hide instances in Browse All AND has a kind
which you wanted to hide in the all services menu but show instances of the kind in Browse All, the asset type would have the
Options "HideInstances" (since ShowAssetType is implied) and the Kind would have the Options "HideAssetType,ShowInstances".

But utilizing the Options (which can be set per-environment in the config JSON files), there exists a powerful mechanism to show and
hide resources with and without kinds to provide the appropriate experience for your customers.

<a name="start-with-asset-type-definition-defining-your-asset-type-add-command-create"></a>
### Add command (Create)

To allow people to create new resources from Browse, you can associate your asset type with a Marketplace item or category:

DX.json:
```jsonc
"assetType": {
    "name": "Book",
    "create": {
        "marketplacePackageId": "Microsoft.Book"
        // or "marketplaceMenuItemId": "menu/book"
    },
    // ...
    "browse": { "type": "ResourceType" },
    "resourceType": { "name": "Microsoft.Test/book", "apiVersion": "2021-02-01" }
}
```
<details>
<summary>Legacy PDL</summary>
<p><!-- do not remove following empty line -->

```xml
<AssetType
    Name="Book"
    MarketplaceItemId="Microsoft.Book"
    <!-- or MarketplaceMenuItemId="menu/book" -->
    ...>
  <Browse Type="ResourceType" />
  <ResourceType ResourceTypeName="Microsoft.Press/books" ApiVersion="2016-01-01" />
</AssetType>
```
</p>
</details>

The Browse blade will launch the Marketplace item, if specified; otherwise, it will launch the Marketplace category blade for the specific
menu item id (e.g. `gallery/virtualMachines/recommended` for Virtual machines > Recommended). To determine the right Marketplace category,
contact the <a href="mailto:1store?subject=Marketplace menu item id">Marketplace team</a>. If neither is specified, the Add command won't
be available.

<a name="start-with-asset-type-definition-defining-your-asset-type-handling-empty-browse"></a>
### Handling empty browse

The framework offers the ability to display a description and links in the case that the users filters return no results.

>NOTE: This will also display if the user visits the browse experience and they have not yet created the given resource.

![Empty browse](../media/portalfx-assets/empty-browse.png)

To opt in to this experience you need to provide a `description` and a `link`, these are properties that you provide on your Asset.

DX.json:
```jsonc
"assetType": {
    "name": "MyAsset",
    // ...
    "description": { "property": "MyAsset.description", "module": "../..ClientResources" },
    // ...
    "links": [
        {
            "title": { "property": "MyAsset.linkTitle1", "module": "../../ClientResources" },
            "uri": "http://www.bing.com"
        },
        {
            "title": { "property": "MyAsset.linkTitle2", "module": "../../ClientResources" },
            "uri": "http://www.bing.com"
        }
    ]
    // ...
}
```
<details>
<summary>Legacy PDL</summary>
<p><!-- do not remove following empty line -->

```xml
<AssetType
    Name="MyAsset"
    ...
    Description="{Resource MyAsset.description, Module=ClientResources}">
    ...
    <Link Title="{Resource MyAsset.linkTitle1, Module=ClientResources}" Uri="https://www.bing.com"/>
    <Link Title="{Resource MyAsset.linkTitle2, Module=ClientResources}" Uri="https://www.bing.com"/>
    ...
  </AssetType>
```
</p>
</details>

<a name="browse-with-azure-resource-graph"></a>
# Browse with Azure Resource Graph

If you aren’t familiar Azure Resource Graph, it’s a new service which provides a query-able caching layer over ARM.
This gives us the capability to sort, filter, and search server side which is a vast improvement on what we have today.

<a name="browse-with-azure-resource-graph-benefits-to-tracking-resources-with-azure-resource-graph"></a>
## Benefits to Tracking Resources with Azure Resource Graph

There are compelling reasons to use the Azure Resource Graph for your tracked resources.

- Performance
    - The general performance of using Azure Resource Graph is greatly improved as ARG is at heart an indexing service for your ARM resources. This includes paging and server-side filtering support.
- Query-able
    - Allows for customized query options to provide rich data to customers and allows the browse blade to provide a richer experience to the customer.
- Summary Views
    - The nature of ARG as an indexing and query-able layer allows the browse blade to provide rich summary views to give the customer rich visual representations of their resources.
- Future
    - The ARG browse path will be receiving almost all the new features moving forward while the ARM browse path will only be receiving maintenance work moving forward.

<a name="browse-with-azure-resource-graph-benefits-to-tracking-resources-with-azure-resource-graph-moving-forward"></a>
### Moving Forward

What that does mean though is we won’t be loading extensions to gather the extra, supplemental, column data. Instead that will all be served via ARG.

Due to which there the following required from extension authors to onboard.

- Define the columns which you wish to expose
- Craft the query to power your data set
  - To craft the query you can use the in portal advanced query editor [Azure Resource Graph Explorer](https://rc.portal.azure.com#blade/hubsextension/argqueryblade)
  - Ensure the query projects all the framework and extension expected columns
- Onboard your given asset via PDL
  - If you haven't created an Asset follow the previous documentation on how to do that
- Choose how to expose the ARG experience

**Note:** the below contains the PDL, Columns definitions, and Query required to match to an existing AppServices browse experience.

<a name="browse-with-azure-resource-graph-onboarding-an-asset-to-arg"></a>
## Onboarding an asset to ARG

Firstly you'll need to craft a [KQL query](#kql-query) which represents all possible data for your desired browse view, this includes the required framework columns.

<a name="browse-with-azure-resource-graph-onboarding-an-asset-to-arg-expected-framework-columns"></a>
### Expected Framework columns

| Display name | Expected Column Name | PDL Reference | Default Width |
| ------------ | -------------------- | ------------- | ------------- |
| Name | name | N/A - Injected as the first column | 200fr |
| Resource Id | id | FxColumns.ResourceId | 100fr |
| Subscription | N/A | FxColumns.Subscription | 100fr |
| SubscriptionId | subscriptionId | FxColumns.SubscriptionId | 100fr |
| Resource Group | resourceGroup | FxColumns.ResourceGroup | 100fr |
| Resource Group Id | N/A | FxColumns.ResourceGroupId | 100fr |
| Location | location | FxColumns.Location | 100fr |
| Location Id | N/A | FxColumns.LocationId | 100fr |
| Resource Type | N/A | FxColumns.ResourceType | 100fr |
| Type | type | FxColumns.AssetType | 100fr |
| Kind | kind | FxColumns.Kind | 100fr |
| Tags | tags | FxColumns.Tags | 100fr |

**NOTE:** to avoid maintaining this list and to ensure your asset type will automatically get new framework columns, it is advisable to use the `[FxColumns]` 
placeholder in your final project statement:

```kql
project [FxColumns], ...your columns here
```

<a name="browse-with-azure-resource-graph-kql-query"></a>
## KQL Query

For those who are not familiar with KQL you can use the public documentation as reference. https://docs.microsoft.com/en-us/azure/kusto/query/

Given the framework columns are required we can use the below as a starting point.

1. Go to the [Azure Resource Graph explorer](https://rc.portal.azure.com#blade/hubsextension/argqueryblade)
1. Copy and paste the below query
1. Update the `where` filter to your desire type

```kql
where type =~ 'microsoft.web/sites'
| project [FxColumns]
```

That query is the bare minimum required to populate ARG browse.

As you decide to expose more columns you can do so by using the logic available via the KQL language to `extend` and then `project` them in the query.
One common ask is to convert ARM property values to user friendly display strings, the best practice to do that is to use the `case` statement in combination
with extending the resulting property to a given column name.

In the below example we're using a `case` statement to rename the `state` property to a user friendly display string under the column `status`.
We're then including that column in our final project statement. We can then replace those display strings with client references once we migrate it over to
PDL in our extension providing localized display strings.

```kql
where type =~ 'microsoft.web/sites'
| extend state = tolower(properties.state)
| extend status = case(
    state == 'stopped', 'Stopped',
    state == 'running', 'Running',
    'Other')
| project [FxColumns]
```

As an example the below query can be used to replicate the 'App Services' ARM based browse experience in ARG.

```kql
where type =~ 'microsoft.web/sites'
| extend appServicePlan = extract('serverfarms/([^/]+)', 1, tostring(properties.serverFarmId))
| extend appServicePlanId = properties.serverFarmId
| extend state = tolower(properties.state)
| extend sku = tolower(properties.sku)
| extend pricingTier = case(
    sku == 'free', 'Free',
    sku == 'shared', 'Shared',
    sku == 'dynamic', 'Dynamic',
    sku == 'isolated', 'Isolated',
    sku == 'premiumv2', 'PremiumV2',
    sku == 'premium', 'Premium',
    'Standard')
| extend status = case(
    state == 'stopped', 'Stopped',
    state == 'running', 'Running',
    'Other')
| extend appType = case(
    kind contains 'botapp', 'Bot Service',
    kind contains 'api', 'Api App',
    kind contains 'functionapp', 'Function App',
    'Web App')
| project [FxColumns],appServicePlanId,pricingTier,status,appType
```

<a name="browse-with-azure-resource-graph-pdl-definition"></a>
## PDL Definition

In your extension you'll have a `"assetType"` property declared in JSON (or <AssetType> tag declared in legacy PDL) which represents your ARM resource. In order to enable Azure Resource Graph (ARG) support for that asset we'll need to update the `"browse"` property to include a reference to the `query`, `defaultColumns`, `excludeColumns`, `defaultFilters`, and custom column meta data - if you have any.

<a name="browse-with-azure-resource-graph-pdl-definition-adding-a-query-to-pdl"></a>
### Adding a Query to PDL

Create a new file, we'll use `AppServiceQuery.kml`, and save your query in it.
You can update any display strings with references to resource files using following syntax `'{{Resource name, Module=ClientResources}}'`. This will allow
for localization of the display strings in your .resx file.

The following is an example using the resource reference syntax.

```kql
where type == 'microsoft.web/sites'
| extend appServicePlanId = properties.serverFarmId
| extend state = tolower(properties.state)
| extend sku = tolower(properties.sku)
| extend pricingTier = case(
    sku == 'free',
    '{{Resource pricingTier.free, Module=BrowseResources}}',
    sku == 'shared',
    '{{Resource pricingTier.shared, Module=BrowseResources}}',
    sku == 'dynamic',
    '{{Resource pricingTier.dynamic, Module=BrowseResources}}',
    sku == 'isolated',
    '{{Resource pricingTier.isolated, Module=BrowseResources}}',
    sku == 'premiumv2',
    '{{Resource pricingTier.premiumv2, Module=BrowseResources}}',
    sku == 'premium',
    '{{Resource pricingTier.premium, Module=BrowseResources}}',
    '{{Resource pricingTier.standard, Module=BrowseResources}}')
| extend status = case(
    state == 'stopped',
    '{{Resource status.stopped, Module=BrowseResources}}',
    state == 'running',
    '{{Resource status.running, Module=BrowseResources}}',
    '{{Resource status.other, Module=BrowseResources}}')
| extend appType = case(
    kind contains 'botapp',
    '{{Resource appType.botapp, Module=BrowseResources}}',
    kind contains 'api',
    '{{Resource appType.api, Module=BrowseResources}}',
    kind contains 'functionapp',
    '{{Resource appType.functionapp, Module=BrowseResources}}',
    '{{Resource appType.webapp, Module=BrowseResources}}')
| project [FxColumns], appServicePlanId, pricingTier, status, appType
```

<a name="browse-with-azure-resource-graph-pdl-definition-adding-custom-columns"></a>
### Adding Custom columns

To define a custom column you will need to create a `columns` property within your `browse` object in JSON (or add a `Column` entry in PDL within your `Browse` entry in PDL).

A column has 5 required properties.

DX.json:
```jsonc
"columns": [
    {
        "name": "status",
        "displayName": { "property": "Columns.status", "module": "../../ClientResources" },
        "description": { "property": "Columns.statusDescription", "module": "../../ClientResources" },
        "format": "String",
        "width": "90fr"
    }
]
```
<details>
<summary>Legacy PDL</summary>
<p><!-- do not remove following empty line -->

```xml
<Column Name="status"
        DisplayName="{Resource Columns.status, Module=ClientResources}"
        Description="{Resource Columns.statusDescription, Module=ClientResources}"
        Format="String"
        Width="90fr" />
```
</p>
</details>

| Property | Description |
| -- | -- |
| name | The identifier which is used to uniquely refer to your column |
| displayName | A display string, __this has to be a reference to a resource__ |
| lowerDisplayName | A lowercase display string, __this has to be a reference to a resource__ |
| description | A description string, __this has to be a reference to a resource__ |
| format | See below table for [`possible formats`](###Column%20Formats) |
| width | String, which represents the default width of the column (e.g. "120fr" - fractional units or "100px" - pixels) |
| sortColumn | Optional name of a separate column returned by the query for sorting. If the column returned as `Name` is formatted, the `SortColumn` can be used to return a sortable format of the value (possibly original value) for sorting in the grid |
| sourceUnits | Optional source units for a `Number` format column used to render the best appropriate units for the value (ie, bytes, KB, MB, etc.). See below table for [`possible units`](###Source%20Units) |
| maximumFractionDigits | Optional precision for a `Number` format column if the column might show fraction digits - often useful when using SourceUnits |
| blade | Optional blade reference for a `BladeLink` format column to specify the blade to launch when the link is clicked. Required for `BladeLink` format columns |
| bladeParameterColumn | Optional parameter column for a `BladeLink` format column to specify the parameters for the blade. Required for `BladeLink` format columns.  See note below * |
| openBladeAsContextPane | Optional boolean to open a `BladeLink` format column blade in the context pane. Default is to open as a blade, use `true` to open in context pane |
| iconColumn | Optional name of separate column returned by the query for the icon for a `Status` format column. [`See notes about icons below`](###Column%20Icons). Required for `Status` format columns |
| preventSummary | Optional flag when summary (visualization) of the column should be prevented |
| columnQueryForSummary | Optional column query for the summarization for this column used for the summary query drilldown |
| summaryQuery | Optional summarization query for this column if normal count() summarization is not appropriate. When the `ColumnQueryForSummary` property is set, that is prepended to the summary query |
| summaryColumn | Optional column name to be used for the summary for this column. This is only valid with there is a summary query. The value column should have this name and the count column should have this name with the 'Column' suffix. For example, if the SummaryColumn is 'mySummary', the query value column should be 'mySummary' and the count column should be 'mySummaryCount' |
| summaryVisualizations | Optional summary visualizations for the column. If not set, standard bar and donut charts along with grid (list) are used. See below table for [`possible summary visualizations`](###Possible%20Summary%20Visualizations). Comma-delimited list of possible values |

Note for `BladeParameterColumn`:
- If this is set and the result is a string, the column name will be the parameter name with that value.
- If this is set and the result is an object, that object will be the entire parameters for the blade.

<a name="browse-with-azure-resource-graph-pdl-definition-column-formats"></a>
### Column Formats
| Format option | Description |
| -- | -- |
| String | String rendering of your column |
| Resource | If the returned column is a ARM resource id, this column format will render the cell as the resources name and a link to the respective blade |
| Date | Date rendering of your column |
| Number | Number rendering of your column, can use the `SourceUnits` to help formatting (ie, bytes, kilobytes, megabytes) and `MaximumFractionDigits` to format a maximum precision for numbers with a fraction portion |
| Location | String representation of an ARM location code localized for the user's locale (column should return location ID) |
| BladeLink | A blade link column which allows the user to launch a blade represented by `Blade` using parameters returned by the `BladeParameterColumn` |
| Tenant | String representation of an ARM tenant ID from the display name for the tenant (column should return tenant ID) |
| Status | String rendering of your column with an icon which is return by `IconColumn`.  Currently only StatusBadge icons are supported (see list below) |

<a name="browse-with-azure-resource-graph-pdl-definition-source-units-for-number-columns"></a>
### Source Units for Number Columns
The delineated sections below show possible appropriate units in groups (ie, 20,000 metric bytes will show as 20 KB and 1,363,148 SI bytes will show as 1.3 GB).

| Unit | Description |
| -- | -- |
| None | No units - same as not including units |
|-|-|
| Percentage | Source is in percentage |
|-|-|
| Bytes | Source is in metric bytes (divisor of 1000) |
| Kilobytes | Source is in metric kilobytes (divisor of 1000) |
| Megabytes | Source is in metric megabytes (divisor of 1000) |
| Gigabytes | Source is in metric gigabytes (divisor of 1000) |
| Terabytes | Source is in metric terabytes (divisor of 1000) |
| Petabytes | Source is in metric petabytes (divisor of 1000) |
|-|-|
| BytesPerDay | Source is in metric bytes per day (divisor of 1000) |
| BytesPerHour | Source is in metric bytes per hour (divisor of 1000) |
| BytesPerMinute | Source is in metric bytes per minute (divisor of 1000) |
| BytesPerSecond | Source is in metric bytes per second (divisor of 1000) |
| KilobytesPerSecond | Source is in metric kilobytes per second (divisor of 1000) |
| MegabytesPerSecond | Source is in metric megabytes per second (divisor of 1000) |
| GigabytesPerSecond | Source is in metric gigabytes per second (divisor of 1000) |
| TerabytesPerSecond | Source is in metric terabytes per second (divisor of 1000) |
| PetabytesPerSecond | Source is in metric petabytes per second (divisor of 1000) |
|-|-|
| Count | Source is a count |
| Thousand | Source is a count in thousands |
| Million | Source is a count in millions |
| Billion | Source is a count in billions |
| Trillion | Source is a count in trillions |
|-|-|
| MicroSeconds | Source is in microseconds |
| MilliSeconds | Source is in milliseconds |
| Seconds | Source is in seconds |
| Minutes | Source is in minutes |
| Hours | Source is in hours |
| Days | Source is in days |
|-|-|
| CountPerDay | Source is a count per day |
| CountPerHour | Source is a count per hour |
| CountPerMinute | Source is a count per minute |
| CountPerSecond | Source is a count per second |
| ThousandPerSecond | Source is a count in thousands per second |
| MillionPerSecond | Source is a count in millions per second |
| BillionPerSecond | Source is a count in billions per second |
| TrillionPerSecond | Source is a count in trillions per second |
|-|-|
| Bytes_SI | Source is in SI bytes (divisor of 1024) |
| Kilobytes_SI | Source is in SI kilobytes (divisor of 1024) |
| Megabytes_SI | Source is in SI megabytes (divisor of 1024) |
| Gigabytes_SI | Source is in SI gigabytes (divisor of 1024) |
| Terabytes_SI | Source is in SI terabytes (divisor of 1024) |
| Petabytes_SI | Source is in SI petabytes (divisor of 1024) |
|-|-|
| BytesPerDay_SI | Source is in SI bytes per day (divisor of 1024) |
| BytesPerHour_SI | Source is in SI bytes per hour (divisor of 1024) |
| BytesPerMinute_SI | Source is in SI bytes per minute (divisor of 1024) |
| BytesPerSecond_SI | Source is in SI bytes per second (divisor of 1024) |
| KilobytesPerSecond_SI | Source is in SI kilobytes per second (divisor of 1024) |
| MegabytesPerSecond_SI | Source is in SI megabytes per second (divisor of 1024) |
| GigabytesPerSecond_SI | Source is in SI gigabytes per second (divisor of 1024) |
| TerabytesPerSecond_SI | Source is in SI terabytes per second (divisor of 1024) |
| PetabytesPerSecond_SI | Source is in SI petabytes per second (divisor of 1024) |

<a name="browse-with-azure-resource-graph-pdl-definition-column-icons"></a>
### Column Icons

Some columns require icons to be returned by the `IconColumn` column of the query. Possible values
are outlined below.

When an icon is returned by the query, the query should use the `{{Icon icon-name-here}}` escape sequence with no wrapping quotes as shown here:

```kql
where type == 'microsoft.web/sites'
| extend status = case(
    state == 'stopped', '{{Resource status.stopped, Module=BrowseResources}}',
    state == 'running', '{{Resource status.running, Module=BrowseResources}}',
    '{{Resource status.other, Module=BrowseResources}}')
| extend statusIcon = case(
    state == 'stopped', {{Icon StatusBadge.Stopped}},
    state == 'running', {{Icon StatusBadge.Success}},
    {{Icon StatusBadge.None}})
| project [FxColumns],status,statusIcon
```

<a name="browse-with-azure-resource-graph-pdl-definition-column-icons-valid-icons-for-a-status-column"></a>
#### Valid Icons for a <code>Status</code> Column
| Icon | Description |
| -- | -- |
| StatusBadge.Canceled | The canceled icon |
| StatusBadge.Critical | The critical icon |
| StatusBadge.Disabled | The disabled icon |
| StatusBadge.Error | The error icon |
| StatusBadge.Failed | The failed error icon |
| <span>StatusBadge</span>.Info | The info alert icon |
| StatusBadge.None | No icon |
| StatusBadge.Pending | The pending icon |
| StatusBadge.Stopped | The stopped icon |
| StatusBadge.Success | The success or running icon |
| StatusBadge.Unknown | The icon for unknown state |
| StatusBadge.Update | The icon to update |
| StatusBadge.Upsell | The icon for upsell |
| StatusBadge.Warning | The warning icon |

<a name="browse-with-azure-resource-graph-pdl-definition-possible-summary-visualizations"></a>
### Possible Summary Visualizations
| Visualization | Description |
| -- | -- |
| Map | Shows a map with pins for the counts of values. Source column must be a `Location` format column |
| BarChart | Shows a bar chart for the counts of values |
| DonutChart | Shows a donut chart for the counts of values |
| Grid | Shows a grid (list) for the counts of values |
| Default | All possible visualizations excluding `Map` |
| DefaultWithMap | All possible visualizations including `Map` |

<a name="browse-with-azure-resource-graph-pdl-definition-controlling-column-visibility-via-per-environment-configuration"></a>
### Controlling column visibility via per-environment configuration

There can be a case where for a particular environment, a column will not be valid or have a useable value. A specific feature behind a column may not be available or a linked resource might not be implemented or featured for a particular environment (like national clouds). To handle this case, browse columns can be hidden using a per-environment configuration JSON file. When a column is hidden, it is completely removed from the asset type at runtime. It will be removed from the default columns, optional columns, default filters and the status column. It will also be removed from the resource hover card. It will appear to browse as if the column does not exist in the PDL. The configuration JSON files have a 'showargcolumns' property which is a dictionary of asset type name to an inner dictionary of column name to a boolean value. Setting a column to `false` will hide the column effectively removing it.

For example, if the `special` column is not available in hosted.portal.azure.com, the following can be added to the hosted.portal.azure.com.json configuration file to hide that column:

```jsonc
{
  "showargcolumns": {
    "YOUR_ASSET_NAME": { "special": false },
    "YOUR_SECOND_ASSET_NAME": { "anothercolumn": false, "thirdcolumn": false }
  }
}
```

As can be seen, columns where the visibility is not affected do not need to be specified in the `showargcolumns`, only those being hidden should be specified with a value of `false`. Shown for the second asset type, multiple columns can be hidden by specifying more than one for the asset type.

<div style="margin-bottom: 20px; background-color: #fff; border: 1px solid transparent; border-radius: 4px; -webkit-box-shadow: 0 1px 1px rgb(0 0 0 / 5%); box-shadow: 0 1px 1px rgb(0 0 0 / 5%); border-color: rgba(251,162,37,.3);">
<p style="background-color: rgba(251,162,37,.3);
    border-color: rgba(251,162,37,.3); color: #e14329; padding: 5px">**IMPORTANT**</p>
<div style="padding: 0 15px 10px; color: black;">
When providing `showargcolumns` in a configuration JSON file, values are not merged from per-environment configuration files with the values in the default.json file, even if the `showargcolumns` is not defined in the per-environment. If, as an example, there is a portal.azure.com.json file, then `showargcolumns` must be defined in that file as well as the default.json file and when using portal.azure.com only the values from portal.azure.com.json will be used. If the per-environment JSON file does not exist for the environment, then the default.json file value will be used.
</div>
</div>

<a name="browse-with-azure-resource-graph-pdl-definition-controlling-column-visibility-via-per-environment-configuration-testing-your-column-manually"></a>
#### Testing your column manually

To test enable your column (or hide it) for testing purposes, you can use the URL to override the configuration behavior.

For the desired environment append the following feature flags.

```txt
    ?microsoft_azure_mynewextension_showargcolumns={"YOUR_ASSET_NAME":{"special":true},"YOUR_SECOND_ASSET_NAME":{"fourthcolumn":false}}
```

For example to turn a hidden column on:
https://rc.portal.azure.com/?microsoft_azure_compute_showargcolumns={"VirtualMachine":{"osdisk":true}}&feature.canmodifyextensions=true

or to turn an existing column off:
https://rc.portal.azure.com/?microsoft_azure_compute_showargcolumns={"VirtualMachine":{"osdisk":false}}&feature.canmodifyextensions=true

<a name="browse-with-azure-resource-graph-pdl-definition-default-columns"></a>
### Default columns

To specify default columns you need to declare a property `defaultColumns` on your `browse` JSON object.
Default columns is a comma separated list of column names, a mix of custom columns and framework defined columns from the earlier table. All framework columns are prefixed with `FxColumns.`.

For example `"defaultColumns": ["status", "appType", "appServicePlanId", "FxColumns.Location"]`
(or in legacy PDL: `DefaultColumns="status, appType, appServicePlanId, FxColumns.Location"`).

<a name="browse-with-azure-resource-graph-pdl-definition-exclude-columns"></a>
### Exclude columns

You can specify `excludeColumns` property on your `browse` JSON object to indicate which default columns should be excluded from the browse experience. It can be used for example for tenant-level resources.
Exclude columns is an array of column names, where values can come from the set `["FxColumns.SubscriptionId", "FxColumns.ResourceGroup", "FxColumns.Location", "FxColumns.Tags"]`.
Excluded columns won't appear in the grid, Kusto query, filter pills, groupBy dropdown, visualizations and column chooser.

For example `"excludeColumns": ["FxColumns.SubscriptionId", "FxColumns.ResourceGroup", "FxColumns.Location"]`.

<a name="browse-with-azure-resource-graph-pdl-definition-default-filters"></a>
### Default filters

By default, 3 filter pills are displayed in your Browse experience: Subscription, Resource Group and Location (unless some of these columns are exclued by `excludeColumns` property).
If you want to render additional filter pills by default, you can achieve that by specifying `defaultFilters` property.
`defaultFilters` is an array of column names, accepting only values that are specified in `columns` property.

For example `"defaultFilters": ["status"]`.

<a name="browse-with-azure-resource-graph-pdl-definition-full-asset-browse-definition"></a>
### Full Asset Browse definition

In the above query example there are 4 custom columns, the below Asset `PDL` declares the custom column meta data which each map to a column in the query above.

It also declares the default columns and their ordering for what a new user of the browse experience should see.

DX.json:
```jsonc
"assetType": {
    // other asset type properties
    "browse": {
        "type": "ResourceType",
        "query": { "file": "./MyAssetQuery.kml" },
        "defaultColumns": ["status", "appType", "FxColumns.Location"],
        "columns": [
            {
                "name": "status",
                "displayName": { "property": "Columns.status", "module": "../../ClientResources" },
                "description": { "property": "Columns.statusDescription", "module": "../../ClientResources" },
                "format": "String",
                "width": "90fr"
            },
            {
                "name": "appType",
                "displayName": { "property": "Columns.appType", "module": "../../ClientResources" },
                "description": { "property": "Columns.appTypeDescription", "module": "../../ClientResources" },
                "format": "String",
                "width": "90fr"
            }
        ],
        "excludeColumns": ["FxColumns.ResourceGroup"],
        "defaultFilters": ["status"]
    },
    "resourceType": {
        "name": "Microsoft.Test/myresources",
        "apiVersion": "2016-01-01"
    }
}
```
<details>
<summary>Legacy PDL</summary>
<p><!-- do not remove following empty line -->

```xml
<AssetType>
    <!-- other asset type properties -->
    <Browse
        Type="ResourceType"
        Query="{Query File=./MyAssetQuery.kml}"
        DefaultColumns="status, appType, FxColumns.Location">
        <Column Name="status"
              DisplayName="{Resource Columns.status, Module=ClientResources}"
              Description="{Resource Columns.statusDescription, Module=ClientResources}"
              Format="String"
              Width="90fr" />
        <Column Name="appType"
              DisplayName="{Resource Columns.appType, Module=ClientResources}"
              Description="{Resource Columns.appTypeDescription, Module=ClientResources}"
              Format="String"
              Width="90fr" />
    </Browse>
    <ResourceType
        ResourceTypeName="Microsoft.Test/myresources"
        ApiVersion="2016-01-01" />
</AssetType>
```
</p>
</details>

<a name="browse-with-azure-resource-graph-pdl-definition-adding-an-informational-info-box-with-optional-link-to-arg-browse"></a>
### Adding an informational info box with optional link to ARG browse

If you need to display an informational message and/or link above the list of resources, add a `infoBox` to your `browse` in JSON (or `BrowseInfoBox` to your Browse in PDL):

DX.json:
```jsonc
"assetType": {
    "name": "MyAsset",
    // other asset type properties
    "browse": {
        "type": "ResourceType",
        "infoBox": {
            "display": "MyAsset.upsellInfoBox",
            "style": "Upsell",
            "link": { "uri": "https://azure.microsoft.com" } // external link
        }
    },
    "resourceType": {
        "name": "Microsoft.Test/myresources",
        "apiVersion": "2016-01-01"
    }
}
```

or

```jsonc
"assetType": {
    "name": "MyAsset",
    // other asset type properties
    "browse": {
        "type": "ResourceType",
        "infoBox": {
            "display": "MyAsset.upsellInfoBox",
            "style": "Upsell",
            "blade": { "name": "BrowseAll", "extension": "HubsExtension" } // blade
        }
    },
    "resourceType": {
        "name": "Microsoft.Test/myresources",
        "apiVersion": "2016-01-01"
    }
}
```
<details>
<summary>Legacy PDL</summary>
<p><!-- do not remove following empty line -->

```xml
  <AssetType Name="MyAsset"
             ...>
    <Browse Type="ResourceType">
      <BrowseInfoBox Display="{Resource MyAsset.upsellInfoBox, Module=ClientResources}"
                     Style="Upsell">
        <LinkTarget Uri="https://azure.microsoft.com" /> <!-- external link -->
      </BrowseInfoBox>
    </Browse>
    <ResourceType ResourceTypeName="Microsoft.Test/myresources"
                  ApiVersion="2019-08-09" />
  </AssetType>
```

or

```xml
  <AssetType Name="MyAsset"
             ...>
    <Browse Type="ResourceType">
      <BrowseInfoBox Display="{Resource MyAsset.upsellInfoBox, Module=ClientResources}"
                     Style="Upsell">
        <BladeTarget BladeName="BrowseAll" ExtensionName="HubsExtension" /> <!-- blade -->
      </BrowseInfoBox>
    </Browse>
    <ResourceType ResourceTypeName="Microsoft.Test/myresources"
                  ApiVersion="2019-08-09" />
  </AssetType>
```
</p>
</details>

In JSON, the `blade` object must have a `name` and optional `extension` property.  In PDL, the `BladeTarget` entry must have a `BladeName` and optional `ExtensionName` (if the blade is from another extension) and can have an optional `openBladeAsContextPane` to open the blade as a context pane (the blade must be capable of opening as a context pane).

<a name="browse-with-azure-resource-graph-pdl-definition-adding-an-informational-info-box-with-optional-link-to-arg-browse-browse-info-box-styles"></a>
#### Browse Info Box Styles

The styles for the info box match the styles for the InfoBox control:

| Style | Description |
|-|-|
| Default | The default info box style |
| Info | The standard informational info box style |
| Upsell | The style used for up-sell information |
| Success | A success style (included for parity) |
| Warning | A warning style (included for parity) |
| Error | An error style (included for parity) |

<a name="browse-with-azure-resource-graph-releasing-the-azure-resource-graph-experience"></a>
## Releasing the Azure Resource Graph experience

Per Asset you can configure extension side feature flags to control the release of your assets Azure Resource Graph browse experience.

Within your extension config, either hosting service or self hosted, you will need to specify config for your assets with one of the following:

```jsonc
{
    "argbrowseoptions": {
        "YOUR_ASSET_NAME": "OPTION_FROM_THE_TABLE_BELOW",
    }
}
```

| Option | Definition |
| ------ | ---------- |
| AllowOptIn | Allows users to opt in/out of the new experience but will default to the old experience. This will show a 'Try preview' button on the old browse blade and an 'Opt out of preview' button on the ARG browse blade. |
| ForceOptIn | Allows users to opt in/out of the new experience but will default to the new experience. This will show a 'Try preview' button on the old browse blade and an 'Opt out of preview' button on the ARG browse blade |
| Force | This will force users to the new experience. There wil be no 'Opt out of preview' button on the ARG browse blade |
| Disable | This will force users to the old experience. This is the default experience if not flags are set. There wil be no 'Try preview' button on the ARG browse blade |

The default for simple asset types without customized columns OR asset types with a browse query but no browse options defined in 'Force'
meaning customers will see the new experience. If you need to change that behavior, set the argbrowseoptions value appropriately to allow
opt in/out and whether the default is to use the old experience or use the new experience. It is recommended to not use an option or set
the option to 'Force' to give customers the best experience possible.

It is important to note that if a query is added to the asset type's browse, then the default option will be different due to how we onboarded
ARG browse and partner extension asset types. Once the query is added, the default becomes 'AllowOptIn', it is advised that you change this to
'Force' to ensure your asset type is using ARG.

<div style="margin-bottom: 20px; background-color: #fff; border: 1px solid transparent; border-radius: 4px; -webkit-box-shadow: 0 1px 1px rgb(0 0 0 / 5%); box-shadow: 0 1px 1px rgb(0 0 0 / 5%); border-color: rgba(251,162,37,.3);">
<p style="background-color: rgba(251,162,37,.3);
    border-color: rgba(251,162,37,.3); color: #e14329; padding: 5px">**IMPORTANT**</p>
<div style="padding: 0 15px 10px; color: black;">
When providing `argbrowseoptions` in a configuration JSON file, values are not merged from per-environment configuration files with the values in the default.json file, even if the `argbrowseoptions` is not defined in the per-environment. If, as an example, there is a portal.azure.com.json file, then `argbrowseoptions` must be defined in that file as well as the default.json file and when using portal.azure.com only the values from portal.azure.com.json will be used. If the per-environment JSON file does not exist for the environment, then the default.json file value will be used.
</div>
</div>

To test each variation or to test when side loading you can use:

`https://portal.azure.com/?ExtensionName_argbrowseoptions={"assetName":"OPTION"}`

<a name="browse-with-azure-resource-graph-column-summaries-for-extension-provided-columns"></a>
## Column Summaries for Extension-provided Columns

There are summary views available on the browse blade out of the box for certain FX built-in columns to show a map (location-based columns), bar chart, donut chart and list (grid) such a location, resource group, type and subscription. These summary visualizations give customers a quick break-down of their resources by these properties in an easy to understand chart with counts to quickly reason over their resources.

In addition, we are also adding extension-provided columns for browse for a specific resource type. These are based on the `Column` definitions in the PDL. The code uses the `Format` as a hint to provide an appropriate summarization based on a simple count per value in that column. This will work for the vast majority of cases where the column is a string, location, number, datetime, etc. but may not be appropriate for all columns and we have added some customization points to prevent a column from being used in the summary views or to provide custom queries. As well, the PDL allows to specification about which views should be available for the column (map, bar chart, donut chart and/or grid).

<a name="browse-with-azure-resource-graph-column-summaries-for-extension-provided-columns-preventing-the-column-summary"></a>
### Preventing the Column Summary

There are cases where a column is simply not useful as a summary. The `Column` can be marked with the `PreventSummary` property:

DX.json:
```jsonc
"columns": [
  {
    "name": "someColumn",
    "displayName": "Columns.someColumn",
    "description": "Columns.someColumnDescription",
    "format": "String",
    "width": "80fr",
    "preventSummary": true
  }
]
```
<details>
<summary>Legacy PDL</summary>
<p><!-- do not remove following empty line -->

```xml
<Column Name="someColumn"
        DisplayName="{Resource Columns.someColumn, Module=ClientResources}"
        Description="{Resource Columns.someColumnDescription, Module=ClientResources}"
        Format="String"
        Width="80fr"
        PreventSummary="true" />
```
</p>
</details>

In addition, all columns with the `Format` of `BladeLink` are excluded from summaries.

<a name="browse-with-azure-resource-graph-column-summaries-for-extension-provided-columns-specifying-visualizations-to-show-for-column-summary"></a>
### Specifying Visualizations to Show for Column Summary

There are cases where the default visualizations for location-based columns (map, bar chart, donut chart and grid) or non-location-based columns (bar chart, donut chart and grid) are not desirable. The `Column` can be marked with the `SummaryVisualizations` property:

DX.json:
```jsonc
"columns": [
  {
    "name": "someColumn",
    "displayName": "Columns.someColumn",
    "description": "Columns.someColumnDescription",
    "format": "String",
    "width": "80fr",
    "summaryVisualizations": ["DonutChart", "Grid"]
  }
]
```
<details>
<summary>Legacy PDL</summary>
<p><!-- do not remove following empty line -->

```xml
<Column Name="someColumn"
        DisplayName="{Resource Columns.someColumn, Module=ClientResources}"
        Description="{Resource Columns.someColumnDescription, Module=ClientResources}"
        Format="string"
        Width="80fr"
        SummaryVisualizations="DonutChart,Grid" />
```
</p>
</details>

These are the available values (can be combined using comma as shown above):

|Visualization|Definition|
| ------ | ---------- |
|Map|Shows a map representation with clickable pins - only valid for location-based columns|
|BarChart|Shows a bar chart with clickable columns|
|DonutChart|Shows a donut chart with clickable sections|
|Grid|Shows a grid with clickable rows - should always be included|
|**Default**|This is the default of every visualization except Map - useful for non-location-based columns|
|**DefaultWithMap**|The is the default of every visualization including Map - useful for location-based columns|


The order of the visualizations does not matter and will not change the order of the items in the drop down in browse.

<a name="browse-with-azure-resource-graph-column-summaries-for-extension-provided-columns-custom-column-handling-for-summary-views"></a>
### Custom Column Handling for Summary Views

If you have a column which doesn't map well to a straight `count() of column` summarization, you can provide queries to change the summarization for the columns. If the summarization is based on an existing column (has a `Column` value), only the `summaryQuery` property needs to be set on the `Column`:

DX.json:
```jsonc
"columns": [
  {
    "name": "someColumn",
    "displayName": "Columns.someColumn",
    "description": "Columns.someColumnDescription",
    "format": "String",
    "width": "80fr",
    "summaryQuery": { "file": "QueryForSomeColumnSummary.kml" }
  }
]
```
<details>
<summary>Legacy PDL</summary>
<p><!-- do not remove following empty line -->

```xml
<Column Name="someColumn"
        DisplayName="{Resource Columns.someColumn, Module=ClientResources}"
        Description="{Resource Columns.someColumnDescription, Module=ClientResources}"
        Format="string"
        Width="80fr"
        SummaryQuery="{Query File=./QueryForSomeColumnSummary.kml" />
```
</p>
</details>

Then the query file would include only the summarize portion of the query:

```
summarize someColumnCount=count() by bin(someColumn, 100)
```

The result of the count summarization must be the column name with `Count` appended (`someColumn` column must have `someColumnCount` count).

If a new column must be generated for the summarize, however, then the `columnQueryForSummary` property must point to a query which will produce (extend) that new column separately from the `summaryQuery` because the summary view drill down blade will use that portion of the query to provide the list of resources that match the clicked value:

DX.json:
```jsonc
"columns": [
  {
    "name": "someColumn",
    "displayName": "Columns.someColumn",
    "description": "Columns.someColumnDescription",
    "format": "String",
    "width": "80fr",
    "columnQueryForSummary": { "file": "SomeColumnQueryForSummary.kml" },
    "summaryQuery": { "file": "SomeColumnSummaryQuery.kml" },
    "summaryColumn": "someColumnSummaryColumn",
  }
]
```
<details>
<summary>Legacy PDL</summary>
<p><!-- do not remove following empty line -->

```xml
<Column Name="someColumn"
        DisplayName="{Resource Columns.someColumn, Module=ClientResources}"
        Description="{Resource Columns.someColumnDescription, Module=ClientResources}"
        Format="string"
        Width="80fr"
        ColumnQueryForSummary="{Query File=./SomeColumnQueryForSummary.kml}"
        SummaryQuery="{Query File=./SomeColumnSummaryQuery.kml}"
        SummaryColumn="someColumnSummaryColumn" />
```
</p>
</details>

Then the column query file would include only the extend portion of the query:

```
extend someColumnSummaryColumn = case(
    (someColumn < 50), 'low',
    (someColumn <= 100), 'normal',
    'above')
```

Then the summary query file would include only the summarize portion of the query:

```
summarize someColumnSummaryColumnCount=count() by someColumnSummaryColumn
```

The `summaryColumn` property needs to be set to the name of the produced (extended) column and again, the count summarization must be the summary column name with `Count` appended (`summaryColumn` is `someColumnSummaryColumn` and the count must be `someColumnSummaryColumnCount`).

<a name="browse-with-azure-resource-graph-column-summaries-for-extension-provided-columns-dealing-with-non-scalar-values-in-summary"></a>
### Dealing with Non-scalar Values in Summary

The Kusto `summarize` operator requires that the summarize `by` clauses must be scalar and sometimes additional processing needs to be done (like having case-insensitive summary). The way this is handled for non-customized columns is by extending a temporary column casted to a scalar, used in by the summarize and then projected away.

The column query file is often not needed and the summary query file would handle the casting:

```
extend _someColumn = tolower(tostring(someColumn))
| summarize someColumn=any(someColumn),someColumnCount=count() by _someColumn
| project-away _someColumn
```

In this query, first a temporary column (`_someColumn`) is produced with the conversion to scalar (`tostring()`) and then converted to lower case for case-insensitive summarization (`tolower()`). Once the column is projected, the original value must be projected (`someColumn=any(someColumn)`) along with the count (`someColumnCount=count()`) otherwise the value column will be missing from the results. The `by` clause uses the temporary projected column `_someColumn`. Lastly, to prevent the additional temporary column from being returned, the _someColumn is projected away (`project-away _someColumn`).

<a name="browse-with-azure-resource-graph-extensible-commanding-for-arg-browse"></a>
## Extensible commanding for ARG browse

Extensible commanding enables you to author and own your resource-specific commands that allow users to manage their resources at scale with minimal efforts.
Once you have onboarded to ARG browse experience, you can start authoring commands for your browse experience using Typescript. Currently, extension authors can statically define commands associated to their <AssetType>.
*Extensible commanding is only supported for asset types which are onboarded to ARG browse.* The typescript decorator for command takes metadata required for creation and execution of the commands.

Extension authors can specify two sets of commands for their asset type. The generic commands that do not require resource selection (these will be enabled by default) and selection based commands that require resource selection (These will only be enabled if user has selected resources in the browse grid). The generic commands will be placed between `Add` and `Edit columns` command in the toolbar. The selection based commands will be displayed after `Assign tags` command in the toolbar.

Simply specify a command kind and intellisense will prompt you for all the required properties for that command type.
These are the currently supported command types:

```typescript

import { SvgType } from "Fx/Images";
import { CommandVisibility } from "Fx/Assets";
export = MsPortalFxForAsset;

module MsPortalFxForAsset {
    export module ForAsset {
        export module Commands {
            /**
             * Command kinds.
             */
            export const enum CommandKind {
                /**
                 * Kind for the open blade commands.
                 */
                OpenBladeCommand,

                /**
                 * Kind for the menu command.
                 */
                MenuCommand,
            }

            /**
             * Selection Command kinds.
             */
            export const enum SelectionCommandKind {
                /**
                 * Kind for the open blade commands that require selection.
                 */
                OpenBladeSelectionCommand,

                /**
                 * Kind for the ARM commands.
                 */
                ArmCommand,

                /**
                 * Kind for the selection based menu command.
                 */
                MenuSelectionCommand,
            }

            /**
             * Visibility options for selection menu commands.
             */
            export const enum SelectionMenuCommandVisibility {
                /**
                 * Allows a command to be hidden by default.
                 *
                 * NOTE: This is useful if you are experimenting with command bar layout and wish to only show a command via experimentation.
                 */
                HiddenByDefault = CommandVisibility.HiddenByDefault,

                /**
                 * Allows a command to appear on browse toolbar.
                 */
                BrowseToolbar = CommandVisibility.BrowseToolbar,

                /**
                 * Allows a command to appear on resource hover card.
                 */
                ResourceHoverCard = CommandVisibility.ResourceHoverCard,
            }

            /**
             * Visibility options for selection commands.
             */
            export const enum SelectionCommandVisibility {
                /**
                 * Allows a command to be hidden by default.
                 *
                 * NOTE: This is useful if you are experimenting with command bar layout and wish to only show a command via experimentation.
                 */
                HiddenByDefault = CommandVisibility.HiddenByDefault,

                /**
                 * Allows a command to appear on browse toolbar.
                 */
                BrowseToolbar = CommandVisibility.BrowseToolbar,

                /**
                 * Allows a command to appear in browse context menu.
                 *
                 * NOTE: Only selection based commands with minSelection === 1 support this option.
                 *       Menu commands do not support this option.
                 */
                BrowseContextMenu = CommandVisibility.BrowseContextMenu,

                /**
                 * Allows a command to appear on resource hover card.
                 */
                ResourceHoverCard = CommandVisibility.ResourceHoverCard,
            }

            /**
             * Visibility options for non selection commands.
             */
            export const enum NonSelectionCommandVisibility {
                /**
                 * Allows a command to be hidden by default.
                 *
                 * NOTE: This is useful if you are experimenting with command bar layout and wish to only show a command via experimentation.
                 */
                HiddenByDefault = CommandVisibility.HiddenByDefault,

                /**
                 * Allows a command to appear on browse toolbar.
                 */
                BrowseToolbar = CommandVisibility.BrowseToolbar,

                /**
                 * Allows a command to appear on empty browse view.
                 */
                BrowseEmptyView = CommandVisibility.BrowseEmptyView,

                /**
                 * Allows a command to replace default "create" button on a service hover card.
                 *
                 * NOTE: Only one command with this flag is supported per asset type.
                 */
                ServiceHoverCard = CommandVisibility.ServiceHoverCard,
            }

            /**
             * Defines the options that are passed to the command decorator.
             */
            export interface CommandOptions {
                /**
                 * The asset type that the commands are associated with.
                 */
                readonly assetType: string;

                /**
                 * The list of commands which do no require resource selection.
                 */
                readonly commands?: ReadonlyArray<Command>;

                /**
                 * The list of commands which require selection.
                 */
                readonly selectionCommands?: ReadonlyArray<SelectionCommand>;
            }

            /**
             * Constrains the @ForAsset.Commands decorator so that it can be applied only to classes implementing 'Contract'.
             */
            export interface Contract {
            }

            /**
             * Constrains the @Commands decorator so that it can be applied only to classes implementing 'Contract'.
             */
            export interface CommandsClass {
                new(...args: any[]): Contract;
            }

            /**
             * Decorator for Asset commands
             * @param options command options
             */
            export function Decorator(options?: CommandOptions) {
                return function (commandsClass: CommandsClass) {
                };
            }

            /**
             * The blade reference options for open blade command.
             */
            export interface BladeReference {
                /**
                 * The blade name.
                 */
                readonly blade: string;

                /**
                 * The extension name for the blade
                 */
                readonly extension?: string;

                /**
                 * The flag indicating whether blade needs to be opened as a context pane.
                 * Defaults to false.
                 */
                readonly inContextPane?: boolean;

                /**
                 * The blade parameters.
                 *
                 * NOTE: Blades that require list of resourceIds in the parameters, should specify {resourceIds} as the parameter value.
                 * Fx will replace the {resourceIds} value with currently selected resource Ids at runtime.
                 */
                readonly parameters?: ReadonlyStringMap<any>;
            }

            /**
             * The marketplace blade reference
             */
            export interface MarketplaceBladeReference {
                /**
                 * The marketplaceItemId to open a create flow.
                 */
                readonly marketplaceItemId?: string;
            }

            /**
             * Interface for Open blade commands.
             */
            export interface OpenBladeCommand extends CommonCommandBase<CommandKind.OpenBladeCommand> {
                /**
                 * The blade reference.
                 * Either a reference to the blade or the marketpkace item id which opens the create flow needs to be specified.
                 */
                readonly bladeReference: BladeReference | MarketplaceBladeReference;
            }

            /**
             * The interface for resource selection for commands.
             */
            export interface RequiresSelection {
                /**
                 * The resource selection for commands.
                 * Default selection is max allowed selection supported by browse grid.
                 */
                readonly selection?: Selection;
            }

            /**
             * The interface for command execution confirmation options.
             */
            export interface ConfirmationOptions {
                /**
                 * The confirmation dialog title to show before execution of the command.
                 */
                readonly title: string;

                /**
                 * The confirmation dialog message to show before execution of the bulk command.
                 */
                readonly message: string;

                /**
                 * The confirmation text input.
                 * User needs to enter this text in order to confirm command execution.
                 */
                readonly explicitConfirmationText?: string;
            }

            /**
             * The interface for commands that require user confirmation.
             */
            export interface ConfirmationCommandBase {
                /**
                 * The command execution confirmation options.
                 */
                readonly confirmation: ConfirmationOptions;
            }

            /**
             * The interface for ARM command definition.
             */
            export interface ArmCommandDefinition {
                /**
                 * Http method POST/DELETE/PATCH etc. By default POST will be used.
                 */
                readonly httpMethodType?: string;

                /**
                 * ARM uri for the command operation.
                 * Uri should be a relative uri with the fixed format - {resourceid}/optionalOperationName?api-version.
                 * Example: "{resourceid}?api-version=2018-09-01-preview
                 */
                readonly uri: string;

                /**
                 * ARM command operation can be long running operation. asyncOperation property specifies how to poll the status for completion of long running operation.
                 */
                readonly asyncOperation?: AsyncOperationOptions;

                /**
                 * Optional list of resource-specific ARM error codes that should be retried for HttpStatusCode.BadRequest(400).
                 *
                 * By default, Fx retries below codes:
                 *     Retry for transient errors with Http status codes: HttpStatusCode.InternalServerError(500), HttpStatusCode.BadGateway(502), HttpStatusCode.ServiceUnavailable(503), HttpStatusCode.GatewayTimeout(504)
                 *     Retry for ARM conflict/throttle errors with status codes: HttpStatusCode.TooManyRequests(409), HttpStatusCode.Conflict(429)
                 * In addition to these, there could be resource-specific errors that need to be retried for HttpStatusCode.BadRequest(400).
                 * If this list is specified, Fx will parse ARM error codes for HttpStatusCode.BadRequest(400) requests and retry in addition to above retries.
                 *
                 * Example: ["PublicIpAddressCannotBeDeleted", "InuseNetworkSecurityGroupCannotBeDeleted"]
                 */
                readonly retryableArmCodes?: ReadonlyArray<string>;

                /**
                 * Optional list of resource-specific ARM error codes that shouldn't be retried.
                 * This helps optimize network calls and improve bulk operation performance.
                 *
                 * By default, Fx won't issue retry for below code regardless of HTTP status code:
                 *    "ScopeLocked"
                 * In addition to this Arm error code, there could be resource-specific error codes that shouldn't be retried.
                 * If this list is specified, Fx will ignore the above mentioned list and only honor this list of Arm codes that shouldn't be retried.
                 *
                 * Example: ["ScopeLocked"]
                 */
                readonly nonRetryableArmCodes?: ReadonlyArray<string>;
            }

            /**
             * Optional Arm command configs to describe how long running ARM operations needs to be polled and results processed.
             */
            export interface AsyncOperationOptions {
                /**
                 * By default when http Accepted (202) status code is received, the Location header will be looked up for polling uri to get the status of long running operation.
                 * A different response header can be specified with the pollingHeaderOverride value.
                 */
                readonly pollingHeaderOverride?: string;

                /**
                 * A property path to look for status in the response body.
                 * By default 'status' property will be looked up to see if it has "Succeeded", "Failed", "InProgress" or "Canceled".
                 */
                readonly statusPath?: string;
            }

            /**
             * The interface for ARM commands.
             * These commands honor default selection which is FullPage.
             */
            export interface ArmCommand extends CommonCommandBase<SelectionCommandKind.ArmCommand>, ConfirmationCommandBase {
                /**
                 * The map of ARM bulk command definitions per resource type.
                 *
                 * NOTE: A command may delete multiple types of resources e.g. browse for merged resource types.
                 * In such cases, ARM command definition can be specified for each resource type.
                 */
                readonly definitions: ReadonlyStringMap<ArmCommandDefinition>;

                /**
                 * The flag indicating whether to launch Fx bulk delete confirmation blade for delete operations.
                 */
                readonly isDelete?: boolean;
            }

            /**
             * The interface for open blade commands that require resource selection.
             */
            export interface OpenBladeSelectionCommand extends CommonCommandBase<SelectionCommandKind.OpenBladeSelectionCommand>, RequiresSelection {
                /**
                 * The blade reference.
                 */
                readonly bladeReference: BladeReference;
            }

            /**
             * The interface for menu command item display customizations.
             */
            export interface MenuItemCustomCommandOptions {
                /**
                 * The command content.
                 *
                 * Customizes rendering of menu command item @see `Toolbar.ToolbarItems.MenuItemCustomButtonOptions` for more details.
                 */
                readonly content?: string;
            }

            /**
             * The interface for commands to specify visibility options.
             *
             * NOTE: Only applies to top level commands. i.e. Individual items in menu commands can't specify visibility options.
             */
            export interface SelectionCommandVisibilityOptions {
                /**
                 * The command visibility options.
                 * Specify one or more options in the format: `SelectionCommandVisibility.BrowseToolbar | SelectionCommandVisibility.BrowseContextMenu`.
                 */
                readonly visibility?: SelectionCommandVisibility;
            }

            /**
             * The interface for commands to specify visibility options.
             *
             * NOTE: Only applies to top level commands. i.e. Individual items in menu commands can't specify visibility options.
             */
            export interface NonSelectionCommandVisibilityOptions {
                /**
                 * The command visibility options.
                 * Specify one or more options in the format: `NonSelectionCommandVisibility.BrowseToolbar | NonSelectionCommandVisibility.BrowseEmptyView`.
                 */
                readonly visibility?: NonSelectionCommandVisibility;
            }

            /**
             * The interface for commands to specify visibility options.
             *
             * NOTE: Only applies to top level commands. i.e. Individual items in menu commands can't specify visibility options.
             */
            export interface SelectionMenuCommandVisibilityOptions {
                /**
                 * The command visibility options.
                 */
                readonly visibility?: SelectionMenuCommandVisibility;
            }

            /**
             * The interface for selection based menu command.
             */
            export interface MenuSelectionCommand extends CommonCommandBase<SelectionCommandKind.MenuSelectionCommand>, RequiresSelection {
                /**
                 * The list of commands.
                 */
                readonly commands: ReadonlyArray<OpenBladeSelectionCommand & MenuItemCustomCommandOptions | ArmCommand>; //If a new command type is supported in future, it'll be added to this list depending on whether it needs to be supported in the menu list.
            }

            /**
             * The interface for menu command.
             */
            export interface MenuCommand extends CommonCommandBase<CommandKind.MenuCommand> {
                /**
                 * The list of commands.
                 */
                readonly commands: ReadonlyArray<OpenBladeCommand & MenuItemCustomCommandOptions>;
            }

            /**
             * The interface for commands that require resource selection.
             */
            export type SelectionCommand = OpenBladeSelectionCommand & SelectionCommandVisibilityOptions | ArmCommand & SelectionCommandVisibilityOptions | MenuSelectionCommand & SelectionMenuCommandVisibilityOptions;

            /**
             * The interface for command.
             */
            export type Command = OpenBladeCommand & NonSelectionCommandVisibilityOptions | MenuCommand & NonSelectionCommandVisibilityOptions;

            /**
             * The interface for command selection.
             */
            export interface Selection {
                /**
                 * The maximum number of selected resources supported by the command operation.
                 */
                readonly maxSelectedItems?: number;

                /**
                 * The minimum number of selected resources supported by the command operation.
                 */
                readonly minSelectedItems?: number;

                /**
                 * The message shown when user tries to select more than supported items by the command operation.
                 */
                readonly disabledMessage: string;
            }

            /**
             * The interface for common command properties.
             */
            export interface CommonCommandBase<TKind extends CommandKind | SelectionCommandKind> {
                /**
                 * The command kind.
                 */
                readonly kind: TKind;

                /**
                 * The command Id.
                 */
                readonly id: string;

                /**
                 * The command label.
                 */
                readonly label: string;

                /**
                 * The command icon.
                 */
                readonly icon: (
                    {
                        /**
                         * URI to the image element.
                         */
                        path: string;
                    } | {
                        /**
                         * References a built-in SVG element.
                         */
                        image: SvgType;
                    });

                /**
                 * The command tooltip.
                 */
                readonly tooltip?: string;

                /**
                 * The command aria label.
                 */
                readonly ariaLabel?: string;
            }
        }
    }
}


```

Here is a sample of defining various asset commands, represented by a single TypeScript file in your extension project.

```typescript

import { ForAsset } from "Fx/Assets/Decorators";
import * as ClientResources from "ClientResources";
import { AssetTypeNames } from "_generated/ExtensionDefinition";
import { SvgType } from "Fx/Images";

@ForAsset.Commands.Decorator({
    assetType: AssetTypeNames.virtualServer, // Asset type name associated with commands
    commands: [ // Generic commands that do not require resource selection
        {
            kind: ForAsset.Commands.CommandKind.OpenBladeCommand,
            id: "OpenBladeCommandId",  // Unique identifier used for controlling visibility of commands
            label: ClientResources.AssetCommands.openBlade,
            ariaLabel: ClientResources.AssetCommands.openBlade,
            icon: {
                image: SvgType.AddTile,
            },
            bladeReference: {
                blade: "SimpleTemplateBlade",
                extension: "SamplesExtension", // An optional extension name, however, must be provided when opening a blade from a different extension
                inContextPane: true, // An optional property to open the pane in context pane
            },
        },
        {
            kind: ForAsset.Commands.CommandKind.OpenBladeCommand,
            id: "OpenCreateCommandId",
            label: ClientResources.AssetCommands.openCreate,
            icon: {
                image: SvgType.Cubes,
            },
            bladeReference: {
                marketplaceItemId: "Microsoft.EngineV3", // Opens marketplace create flow
            },
        },
        {
            kind: ForAsset.Commands.CommandKind.MenuCommand,
            id: "MenuCommand",
            label: ClientResources.AssetCommands.menuCommand,
            icon: {
                image: SvgType.PolyResourceLinked,
            },
            commands: [
                {
                    kind: ForAsset.Commands.CommandKind.OpenBladeCommand,
                    id: "OpenBladeCommand1",
                    label: ClientResources.AssetCommands.openBlade1,
                    icon: {
                        image: SvgType.AzureQuickstart,
                    },
                    content: ClientResources.infoBalloonContent, // Adds the subtitle property for the menu command item.
                    bladeReference: {
                        blade: "SimpleTemplateBlade",
                    },
                },
                {
                    kind: ForAsset.Commands.CommandKind.OpenBladeCommand,
                    id: "OpenBladeCommand2",
                    label: ClientResources.AssetCommands.openBlade2,
                    icon: {
                        image: SvgType.QuickStartPoly,
                    },
                    bladeReference: {
                        blade: "DiTemplateBlade",
                    },
                },
            ],
            visibility:
                ForAsset.Commands.NonSelectionCommandVisibility.BrowseToolbar |
                ForAsset.Commands.NonSelectionCommandVisibility.BrowseEmptyView |
                ForAsset.Commands.NonSelectionCommandVisibility.ServiceHoverCard,
        },
        {
            kind: ForAsset.Commands.CommandKind.OpenBladeCommand,
            id: "OpenBladeCommandIdV2",  // Unique identifier used for controlling visibility of commands
            label: ClientResources.AssetCommands.openBlade,
            ariaLabel: ClientResources.AssetCommands.openBlade,
            icon: {
                image: SvgType.AddTile,
            },
            bladeReference: {
                blade: "SimpleTemplateBlade",
                extension: "SamplesExtension", // An optional extension name, however, must be provided when opening a blade from a different extension
                inContextPane: true, // An optional property to open the pane in context pane
            },
            visibility: ForAsset.Commands.NonSelectionCommandVisibility.HiddenByDefault,  // Hide this command by defualt in all environments. Can be enabled via experiementation config for certain users.
        },
    ],
    selectionCommands: [ // Commands that require resource selection
        {
            kind: ForAsset.Commands.SelectionCommandKind.ArmCommand,  // Executes ARM bulk operations
            id: "BulkDelete",
            label: ClientResources.AssetCommands.delete,
            icon: {
                image: SvgType.Delete,
            },
            definitions: {
                "microsoft.test/virtualservers": {
                    httpMethodType: "DELETE",
                    uri: "{resourceid}?api-version=2018-09-01-preview", // The fixed format that starts with {resourceid}
                    asyncOperation: {
                        pollingHeaderOverride: "Azure-AsyncOperation",
                    },
                },
            },
            isDelete: true,  // Launches the default bulk delete confirmation blade provided by Fx on user click
            confirmation: {
                title: ClientResources.AssetCommands.confirmDeleteTitle,
                message: ClientResources.AssetCommands.confirmDeleteMessage,
            },
            visibility: ForAsset.Commands.SelectionCommandVisibility.BrowseToolbar | ForAsset.Commands.SelectionCommandVisibility.BrowseContextMenu | ForAsset.Commands.SelectionCommandVisibility.ResourceHoverCard, // Show this command on browse toolbar and browse context menu.
        },
        {
            kind: ForAsset.Commands.SelectionCommandKind.ArmCommand,  // Executes ARM bulk operations
            id: "BulkStart",
            label: ClientResources.AssetCommands.start,
            icon: {
                image: SvgType.Start,
            },
            definitions: {
                "microsoft.test/virtualservers": {
                    uri: "{resourceid}?api-version=2018-09-01-preview", // The fixed format that starts with {resourceid}
                },
            },
            confirmation: {
                title: ClientResources.AssetCommands.confirmStartTitle,
                message: ClientResources.AssetCommands.confirmStartMessage,
            },
        },
        {
            kind: ForAsset.Commands.SelectionCommandKind.OpenBladeSelectionCommand,
            id: "SelectionBasedOpenBladeCommand1",
            label: ClientResources.AssetCommands.openBlade2,
            icon: {
                image: SvgType.Attachment,
            },
            bladeReference: {
                blade: "SimpleTemplateBlade",
            },
            selection: {
                maxSelectedItems: 3,
                minSelectedItems: 3,
                disabledMessage: ClientResources.AssetCommands.disabledMessage,
            },
        },
        {
            kind: ForAsset.Commands.SelectionCommandKind.MenuSelectionCommand,
            id: "SelectionBasedMenuCommand",
            label: ClientResources.AssetCommands.openBlade,
            icon: {
                image: SvgType.PolyResourceLinked,
            },
            selection: {
                maxSelectedItems: 3,
                minSelectedItems: 2,
                disabledMessage: ClientResources.AssetCommands.disabledMessage,
            },
            commands: [
                {
                    kind: ForAsset.Commands.SelectionCommandKind.OpenBladeSelectionCommand,
                    id: "SelectionBasedOpenBladeCommand",
                    label: ClientResources.AssetCommands.openBlade1,
                    icon: {
                        image: SvgType.AzureQuickstart,
                    },
                    content: ClientResources.infoBalloonContent, // Adds the subtitle property for the menu command item.
                    bladeReference: {
                        blade: "SimpleTemplateBlade",
                    },
                },
                {
                    kind: ForAsset.Commands.SelectionCommandKind.OpenBladeSelectionCommand,
                    id: "SelectionBasedOpenBladeCommand",
                    label: ClientResources.AssetCommands.openBlade2,
                    icon: {
                        image: SvgType.QuickStartPoly,
                    },
                    bladeReference: {
                        blade: "DiTemplateBlade",
                    },
                },
            ],
        },
    ],
})
export class VirtualServerCommands {
}


```

<a name="browse-with-azure-resource-graph-extensible-commanding-for-arg-browse-how-to-hide-your-asset-commands-in-different-environments"></a>
### How to hide your asset commands in different environments

You can control visibility of individual or all your commands in different environments by setting the hideAssetTypeCommands extension feature flag in your config.
You can specify a comma separated list of asset command ids or "*" to hide all the extensible commands on your browse blade

If you’re using the hosting service, you can do this by updating the relevant environment configuration file (e.g. portal.azure.cn.json file)

```jsonc
    {
        "hideAssetTypeCommands": {
          "YOUR_ASSETTYPE_NAME_DEFINED_IN_PDL": ["YOUR_COMMAND_ID_TO_HIDE"],
          "YOUR_ASSETTYPE_NAME_DEFINED_IN_PDL": ["YOUR_COMMAND_ID1_TO_HIDE", "YOUR_COMMAND_ID2_TO_HIDE"],
          "YOUR_THIRD_ASSETTYPE_NAME_DEFINED_IN_PDL": ["*"]
        }
    }
```

<a name="browse-with-azure-resource-graph-extensible-commanding-for-arg-browse-how-to-hide-your-asset-commands-in-different-environments-testing-hiding-showing-commands-locally"></a>
#### Testing hiding/showing commands locally

For the desired environment append the following feature flags.

```txt
    ?microsoft_azure_myextension_hideassettypecommands={"MyAsset":["MyCommandId1", "MyCommandId2"]}
```

If you want to test hiding all your commands, you can specify ["*"].

```txt
    ?microsoft_azure_myextension_hideassettypecommands={"MyAsset":["*"]}
```

If you want to test commands by showing them locally that are hidden via config file changes, specify empty string [""]. This will ignore hidden commands and show all commands for a given asset type.

```txt
    ?microsoft_azure_myextension_hideassettypecommands={"MyAsset":[""]}
```

<a name="browse-with-azure-resource-graph-extensible-commanding-for-arg-browse-controlling-the-visibility-of-your-commands"></a>
### Controlling the visibility of your commands

Portal now allows extension authors to integrate their extensible commands across various areas in portal such as empty browse view, context menu, service hover card and resource hover card.

You can use `visibility` property on the command to specify areas in portal where the given command needs to be shown.
Here's a sample of a command that uses `visibility` property which states that the command should appear on browse toolbar, context menu and resource hover card:

```typescript

    {
        kind: ForAsset.Commands.SelectionCommandKind.ArmCommand,  // Executes ARM bulk operations
        id: "BulkDelete",
        label: ClientResources.AssetCommands.delete,
        icon: {
            image: SvgType.Delete,
        },
        definitions: {
            "microsoft.test/virtualservers": {
                httpMethodType: "DELETE",
                uri: "{resourceid}?api-version=2018-09-01-preview", // The fixed format that starts with {resourceid}
                asyncOperation: {
                    pollingHeaderOverride: "Azure-AsyncOperation",
                },
            },
        },
        isDelete: true,  // Launches the default bulk delete confirmation blade provided by Fx on user click
        confirmation: {
            title: ClientResources.AssetCommands.confirmDeleteTitle,
            message: ClientResources.AssetCommands.confirmDeleteMessage,
        },
        visibility: ForAsset.Commands.SelectionCommandVisibility.BrowseToolbar | ForAsset.Commands.SelectionCommandVisibility.BrowseContextMenu | ForAsset.Commands.SelectionCommandVisibility.ResourceHoverCard, // Show this command on browse toolbar, browse context menu and resource hover card.
    },
```

<a name="browse-with-azure-resource-graph-extensible-commanding-for-arg-browse-controlling-the-visibility-of-your-commands-criteria"></a>
#### Criteria
Notice that not all commands can support all the visibility options. e.g. you can not specify BrowseContextMenu as the visibility option for non selection commands as they are not resource specific.

| Command type | BrowseContextMenu | BrowseToolbar | BrowseEmptyView | ResourceHoverCard | ServiceHoverCard |
| ------------ | ----------------- | ------------- | --------------- | ----------------- | ---------------- |
| Non selection commands | N/A | Yes | Yes | N/A | Yes |
| Non selection menu commands | N/A | Yes | Yes | N/A | Yes |
| Selection commands | Yes | Yes | N/A | Yes | N/A |
| Selection menu commands | N/A | Yes | N/A | Yes | N/A |

<a name="browse-with-azure-resource-graph-extensible-commanding-for-arg-browse-controlling-the-visibility-of-your-commands-default-behavior"></a>
#### Default behavior
1. All commands appear on BrowseToolbar by default unless explicitly hidden via config OR a command has visibility property specified which doesn't include `BrowseToolbar`
2. All selection (non menu) commands with minSelectedItems === 1 appear in context menu by default unless a command has visibility property specified which doesn't include `BrowseContextMenu`
3. All selection commands with minSelectedItems === 1 appear in resource hover cards by default unless a command has visibility property specified which doesn't include `ResourceHoverCard`

<a name="browse-with-azure-resource-graph-extensible-commanding-for-arg-browse-experimenting-with-extensible-commands-in-browse-command-bar"></a>
### Experimenting with extensible commands in browse command bar

Portal now supports experimenting with asset type commands in browse command bar by using [Ibiza experimentation platform](https://microsoft.sharepoint.com/teams/Ibizaexperimentation).

1. Extension authors can create an Experiment in Control Tower with a value that overrides their default browse commands.
   - The variable name has to be a well-known string that uniquely identifies the asset type. The format should be of the form described below:
BrowseCommands-ExtensionNameAssetTypeName The variable name should start with `BrowseCommands-` followed by extension name and asset type name without any underscores. e.g. this would translate to `BrowseCommands-MicrosoftAzureComputeVirtualMachines` for Virtual Machine resource type.
   - The variable must be created under `AzurePortal` namespace.
   - In the Control Tower, the value for above variable must be set to one of the keys of the map defined in step 2. which will determine the flight/progression user will see in the current session.
i.e."commandBarLayout1" or "commandBarLayout2" or "commandBarLayout3"
   - Extension authors must choose HubsExtension as the value for Extension filter while setting up the experiment.[Configuring your experiment in Control Tower](https://microsoft.sharepoint.com/teams/Ibizaexperimentation/SitePages/Experiment-configuration,-start,-and-management.aspx).
   - Extension authors must specify the environment filter in Control Tower. Experimentation changes will only affect the environment based on this filter (e.g MPAC, RC).

2. Extension authors define the map of different browse command bar layouts that are part of given experiment in their environmental config files. i.e. default.json
```jsonc
        {
            "assetTypeBrowseCommandsExperiments": {
                "VirtualMachines": {
                    "commandBarLayout1": {
                        "commands": ["cmdId1", "cmdId2", "cmdId3"],
                        "selectionCommands": ["cmdId5", "cmdId6"]
                    },
                    "commandBarLayout2": {
                        "selectionCommands": ["cmdId5", "cmdId6"]
                    },
                    "commandBarLayout3": {
                        "commands": ["cmdId3", "cmdId1", "cmdId4"]
                    }
                }
            }
        }
```
`commands` array defines the layout for non selection based commands by specifying command ids. `selectionCommands` array defines the selection based commands by specifying command ids. Extensions can decide to experiement with only one section of the toolbar i.e. either selection commands or non selection commands. Rest of the commands would be read from the default set of commands supplied by extension.

<a name="browse-with-azure-resource-graph-extensible-commanding-for-arg-browse-experimenting-with-extensible-commands-in-browse-command-bar-how-to-force-a-specific-treatment-variable-with-query-strings-for-local-testing"></a>
#### How to force a specific treatment variable with query strings for local testing

If you want to verify the command bar layout for a specific treatment variable value, it can be tested with query strings:
```txt
      ?exp.AzurePortal.BrowseCommands-MicrosoftAzureComputeVirtualMachines=commandBarLayout1
```
More info can be found here: (https://microsoft.sharepoint.com/teams/Ibizaexperimentation/SitePages/Code-integration-for-A-B-testing.aspx)

<a name="browse-with-azure-resource-graph-extensible-commanding-for-arg-browse-experimenting-with-extensible-commands-in-browse-command-bar-how-to-experiment-with-a-new-command"></a>
#### How to experiment with a new command

If you are looking to enable a new command in browse command bar only for certain users and want to hide it by default for rest of the users in all environments, use `HiddenByDefault` visibility option when you define the command in your decorator. This visibility option will hide a given command across all areas where extensible commands are integrated such as browse context menu, hover cards and empty browse view.

```typescript
    {
        kind: ForAsset.Commands.CommandKind.OpenBladeCommand,
        id: "OpenBladeCommandIdV2",  // Unique identifier used for controlling visibility of commands
        label: ClientResources.AssetCommands.openBlade,
        ariaLabel: ClientResources.AssetCommands.openBlade,
        icon: {
            image: SvgType.AddTile,
        },
        bladeReference: {
            blade: "SimpleTemplateBlade",
            extension: "SamplesExtension", // An optional extension name, however, must be provided when opening a blade from a different extension
            inContextPane: true, // An optional property to open the pane in context pane
        },
        visibility: ForAsset.Commands.NonSelectionCommandVisibility.HiddenByDefault  // Hide this command by default in all environments. Can be enabled via experimentation config for certain users.
    },
```

In the environment config, you can specify this command id for one of your layouts and users hitting the flight with that experiment will only see the new command in browse command bar. e.g:
 ```jsonc
    {
        "assetTypeBrowseCommandsExperiments": {
            "VirtualMachines": {
                "commandBarLayout1": {
                    "commands": ["OpenBladeCommandIdV2", "cmdId2", "cmdId3"],
                    "selectionCommands": ["cmdId5", "cmdId6"]
                },
                "commandBarLayout2": {
                    "selectionCommands": ["cmdId5", "cmdId6"]
                },
            }
        }
    }
```

# Merging Resource Types and Kinds

Often there are multiple resource types which may have a different namespace (RP) or type but from the customer's perspective are the same or closely related.  To enforce that mental map of being similar, it is often advantageous to keep those resources together and show more than one resource type or a combination of resource type and kind in a singular browse list.  The merged resource types feature allows this by allowing multiple resource types and/or kinds in a single browse list.  Normally a browse list using the Azure Resource Graph is a list of a single resource type (or all resource types).  By specifying additional merged resource types however, more than one resource type will appear in browse merged into a single list.

## Adding Additional Resource Type or Types to an Existing Asset Type

The simple case is where a new resource type should appear with an existing set of resources.  In this case, simply add a new asset type for the new resource type and then add the resource type as a merged resource type to the browse of the original asset type.  The new asset type is required for the type display name, the icon, the blade and any other associated properties for the new resource type.

### Original Asset Type and Query

DX.json:
```json
"assetType": {
  "name": "OriginalAsset",
  // ...
  "browse": {
    "type": "ResourceType",
    "query": { "file": "./OriginalAssetQuery.kml" },
    "defaultColumns": ["status", "FxColumns.AssetType", "technology"],
    "columns": [
        // ...
    ]
  },
  "resourceType": {
    "name": "Microsoft.Test/originalresources",
    "apiVersion": "2020-01-31"
  },
  // ...
}
```
<details>
<summary>Legacy PDL</summary>
<p><!-- do not remove following empty line -->

```xml
<AssetType Name="OriginalAsset"
           ...>
  <Browse Type="ResourceType"
          Query="{Query File=./OriginalAssetQuery.kml}"
          DefaultColumns="status, FxColumns.AssetType, technology">
    ...
  </Browse>
  <ResourceType ResourceTypeName="Microsoft.Test/originalresources"
                ApiVersion="2017-04-01" />
  ...
</AssetType>
```
</p>
</details>

Query:
```kusto
resources
| where type =~ 'microsoft.test/originalresources'
// ...
| project [FxColumns], status, statusIcon, technology
```

### Step One - Add the Merged Resource Type

Add the `mergedResourceTypes` array to the `browse` object in JSON (or add a `MergedResourceType` entry to the `Browse` entry in PDL).  The `name` property should be the full name like the `name` property on the `resourceType` object in JSON (or `ResourceTypeName` property on the `ResourceType` entry in PDL).

DX.json:
```json
"assetType": {
  "name": "OriginalAsset",
  // ...
  "browse": {
    "type": "ResourceType",
    "query": { "file": "./OriginalAssetQuery.kml" },
    "defaultColumns": ["status", "FxColumns.AssetType", "technology"],
    "columns": [
        // ...
    ],
    "mergedResourceTypes": [{ "name": "microsoft.test/newresources" }]
  },
  "resourceType": {
    "name": "Microsoft.Test/originalresources",
    "apiVersion": "2020-01-31"
  },
  // ...
}
```
<details>
<summary>Legacy PDL</summary>
<p><!-- do not remove following empty line -->

```xml
<AssetType Name="OriginalAsset"
           ...>
  <Browse Type="ResourceType"
          Query="{Query File=./OriginalAssetQuery.kml}"
          DefaultColumns="status, FxColumns.AssetType, technology">
    ...
    <MergedResourceType ResourceTypeName="Microsoft.Test/newresources" />
  </Browse>
  <ResourceType ResourceTypeName="Microsoft.Test/originalresources"
                ApiVersion="2020-01-31" />
  ...
</AssetType>
```
</p>
</details>

### Step Two - Alter the Query to Include Both Resource Types

Updated Query:
```kusto
resources
| where type =~ ('microsoft.test/originalresources', 'microsoft.test/newresources')
// ...
| project [FxColumns], status, statusIcon, technology
```

Using the 'in' operator is an efficient way to check for multiple resource types.  If the columns need to be generated from different properties, be sure to use the `extend` operator in the query to ensure valid values are used from both or if properties are only available from one resource type, it is advisable to `extend` null into the column when appropriate.

### Step Three - Add the new Asset Type

Provide the new asset type for the new resource type.  It is a good idea to merge in the original resource type from the new resource type (that way the merge will go both ways).  Here we reuse the query from the original asset type since the query should be the same.  Provide the new icon, localizable display names, blades and optional parts for the new asset type.

DX.json:
```json
"assetType": {
  "name": "NewAsset",
  // ...
  "browse": {
      "type": "ResourceType",
      "query": { "file": "./OriginalAssetQuery.kml" }, // reuse query
      "defaultColumns": ["status", "FxColumns.AssetType", "technology"],
      "columns": [
          // ...
      ],
      "mergedResourceTypes": [{ "name": "microsoft.test/originalresources" }]
  },
  "resourceType": {
      "name": "Microsoft.Test/newresources",
      "apiVersion": "2021-01-31"
  },
  // ...
}
```
<details>
<summary>Legacy PDL</summary>
<p><!-- do not remove following empty line -->

```xml
<AssetType Name="NewAsset"
           ...>
 <Browse Type="ResourceType"
         Query="{Query File=./OriginalAssetQuery.kml}" // reuse query
         DefaultColumns="status, FxColumns.AssetType, technology">
  ...
  <MergedResourceType ResourceTypeName="Microsoft.Test/originalresources" />
 </Browse>
 <ResourceType ResourceTypeName="Microsoft.Test/newresources"
               ApiVersion="2021-01-31" />
  ...
</AssetType>
```
</p>
</details>

If the new asset type should not appear in the all services menu as a separate entry, you can mark the new asset type as 'HideAssetType' using the asset type 'options' property in JSON (or 'Options' property in PDL).

## Merging Resources only with Specific Kind

It is possible to merge resources from another resource type which have a specific kind.

DX.json:
```json
"assetType": {
  "name": "OriginalAsset",
  // ...
  "browse": {
    // ...
    "mergedResourceTypes": [
      { "name": "microsoft.test/newresources", "kind": "bluekind" },
      { "name": "microsoft.Test/newresources2", "kind": "roundkind",
        "additionalKinds": ["squarekind", "pentagonkind"] }
    ]
  },
  "resourceType": {
      "name": "Microsoft.Test/originalresources",
      "apiVersion": "2020-01-31"
  },
  // ...
}
```
<details>
<summary>Legacy PDL</summary>
<p><!-- do not remove following empty line -->

```xml
<AssetType Name="OriginalAsset"
           ...>
  <Browse ...>
    ...
    <MergedResourceType ResourceTypeName="Microsoft.Test/newresources" ResourceKindName="bluekind" />
    <MergedResourceType ResourceTypeName="Microsoft.Test/newresources2" ResourceKindName="roundkind">
      <AdditionalKind ResourceKindName="squarekind" />
      <AdditionalKind ResourceKindName="pentagonkind" />
    </MergedResourceType>
  </Browse>
  <ResourceType ResourceTypeName="Microsoft.Test/originalresources"
                ApiVersion="2020-01-31" />
  ...
</AssetType>
```
</p>
</details>

Also, as shown, it is possible to include multiple kinds by using the `additionalKinds` property in JSON (or `AdditionalKind` entries on the `MergedResourceKind` entry in PDL).

## Controlling Initial Selection of Merged Resource Types

By default, when browse sees any merged resource types, those types will be "filtered in" (shown) by default when browse first loads.  However, it is possible to control the default visibility of the merged resource types.  This is often useful when provide different virtual asset types where one asset type will show all resource types by default and another will selectively show resources.  The user can alway use the type filter to alter visilibility from the initial view, but this allows the initial view to be controlled.  The `mergedResourceType` has a `selected` property in JSON (or the `MergedResourceType` entry has a `Selected` property in PDL) which will control the initial visibility.  In the following example, the original resources and the new resources will be shown by design, but the new resources 2 will not be shown until the user changes the type filter.

DX.json:
```json
"assetType": {
  "name": "OriginalAsset",
  // ...
  "browse": {
    // ...
    "mergedResourceTypes": [
      { "name": "microsoft.test/newresources", "selected": "true" },
      { "name": "microsoft.Test/newresources2", "selected": "false" }
    ]
  },
  "resourceType": {
      "name": "Microsoft.Test/originalresources",
      "apiVersion": "2020-01-31"
  },
  // ...
}
```
<details>
<summary>Legacy PDL</summary>
<p><!-- do not remove following empty line -->

```xml
<AssetType Name="OriginalAsset"
           ...>
  <Browse ...>
    ...
    <MergedResourceType ResourceTypeName="Microsoft.Test/newresources" Selected="true" />
    <MergedResourceType ResourceTypeName="Microsoft.Test/newresources2" Selected="false" />
  </Browse>
  <ResourceType ResourceTypeName="Microsoft.Test/originalresources"
                ApiVersion="2020-01-31" />
  ...
</AssetType>
```
</p>
</details>

## Using Virtual Asset Types with Merged Resource Types

We have been asked a few times how to provide browse entries for different combinations of merged resource types, sometimes with different initial visibility, or providing different browse hub options.  The best way of handling this situations to by using the concept of "virtual asset types".  Virtual asset types are asset types with a "fake" or "virtual" resource type.  That is, a resource type which does not actually exist in the given namespace (RP).  These are useful for providing an all services (and global search) entry with specific merged resources.

An example of this would be a collection of related resources where there is a resource which is a child of a server where the server and the resource are closely related and there is a desire to show both resources together.  However, the partner team would like to show the combined view (the "uber" view) from one all services entry and individual resources from separate entries (there may be existing entries and favorites which are important to maintain).  Here is an example:

Asset Type / All Services Entry|Resources to Show
---|---
Operating Systems|Operating System Servers + Operating System Instances
Operating System Servers|Operating System Servers
Operating System Instances|Operating System Instances

In this case, there should be three asset types - one virtual asset type for the Operating Systems entry and one real asset type for the Operating System Servers and Operating System Instances respectively.  The Operating Systems virtual asset type needs to have a virtual resource type and **our recommendation is that the resource type use the same (or the common) namespace and use a resource type that will not be added in the future**.  The other asset types would then use the concrete (or actual) resource types.

DX.json:
```json
"assetType": {
  "name": "OperatingSystem",
  // ...
  "browse": {
    // ...
    "mergedResourceTypes": [
      { "name": "microsoft.os/servers" },   // real resource type
      { "name": "microsoft.os/instances" }  // real resource type
    ]
  },
  "resourceType": {
      "name": "microsoft.os/virtual_operatingsystems",  // virtual resource type (same namespace)
      "apiVersion": "2021-01-31"
  },
  // ...
},
"assetType": {
  "name": "OperatingSystemServer",
  // ...
  "browse": {
    // ...
  },
  "resourceType": {
      "name": "microsoft.os/servers",  // real resource type
      "apiVersion": "2020-01-31"
  },
  // ...
},
"assetType": {
  "name": "OperatingSystemInstance",
  // ...
  "browse": {
    // ...
  },
  "resourceType": {
      "name": "microsoft.os/instances",  // real resource type
      "apiVersion": "2020-05-25"
  },
  // ...
}
```
<details>
<summary>Legacy PDL</summary>
<p><!-- do not remove following empty line -->

```xml
<AssetType Name="OperatingSystem"
           ...>
  <Browse ...>
    ...
    <MergedResourceType ResourceTypeName="microsoft.os/servers" />
    <MergedResourceType ResourceTypeName="microsoft.os/instances" />
  </Browse>
  <ResourceType ResourceTypeName="microsoft.os/virtual_operatingsystems"
                ApiVersion="2021-01-31" />
  ...
</AssetType>
<AssetType Name="OperatingSystemServer"
           ...>
  <Browse ...>
    ...
  </Browse>
  <ResourceType ResourceTypeName="microsoft.os/servers"
                ApiVersion="2020-01-31" />
  ...
</AssetType>
<AssetType Name="OperatingSystemInstance"
           ...>
  <Browse ...>
    ...
  </Browse>
  <ResourceType ResourceTypeName="microsoft.os/instances"
                ApiVersion="2020-05-25" />
  ...
</AssetType>
```
</p>
</details>

The query for the virtual asset type should include resources with the two resource types but not the virtual resource type (though it should not matter given the resource type is virtual and should not have any isntances).

OperatingSystem.kml:

```kusto
resources
| where type in~ ('microsoft.os/servers','microsoft.os/instances')
| project [FxColumns]
```

OperationSystemServer.kml:

```kusto
resources
| where type =~ 'microsoft.os/servers'
| project [FxColumns]
```

OperationSystemInstance.kml:

```kusto
resources
| where type =~ 'microsoft.os/instances'
| project [FxColumns]
```

# Curating browse assets

When adding a new 'Asset' to your extension and exposing it through the 'All services' menu, by default it will be grouped in the 'Other' category.
In order to get your 'Asset' correctly categorized you will need to make a request to the Portal Framework to curate your 'Asset'.

For the portal to correct curate your 'Asset' we will need the 'ExtensionName' and 'AssetName' as defined in your extension.

Please contact [ibizafxpm@microsoft.com](mailto:ibizafxpm@microsoft.com) with the following template:

Subject: 'Browse curation request - YourAssetName'
Body:

- 'ExtensionName - YourExtensionName'
- 'AssetName - YourAssetName'
- 'KindName - YourKindName' (If applicable)
- 'Category - DesiredCategory'
- 'Portal environment - portal.azure.com (etc...)'

# Providing a Custom Browse Hub

If you have a collection of related resources or browse items which are similar from the user's perspective, you can create a hub for the assets.  Multiple asset types can point to the same hub and by using a menu blade, you can provide an entry point / overview for the resources, have each asset type point to a menu item with the browse experience for that asset type or provide an introduction page.

NOTE: One caveat to providing a hub page, your extension will need to be loaded to display the hub, so there is a slight performance hit.  The default browse experience in the Hubs extension is preloaded and prewarmed to provide the fastest possible access, but this is not possible for each extension providing a custom browse hub.  You need to weigh the performance hit versus the convenience to the user.

To provide a custom hub blade, simply add the `DeepLink` property to the `Browse` entry:

DX.json:
```jsonc
"assetType": {
  "name": "Book",
  // ...
  "browse": {
    "type": "ResourceType",
    "deepLink": "#blade/MyExtension/BookMenuBlade"
  },
```
<details>
<summary>Legacy PDL</summary>
<p><!-- do not remove following empty line -->

```xml
  <AssetType Name="Book"
             ...>
    <Browse Type="ResourceType"
            DeepLink="#blade/MyExtension/BookMenuBlade" />
  </AssetType>
```
</p>
</details>

## Providing Menu Items for Related Asset Types

The `DeepLink` must be a standard `#blade` deep link to your blade and if your blade is a menu blade, the deep link can provide a menu item (which must be handled by your menu blade code):

DX.json:
```jsonc
"assetType": {
  "name": "Manual",
  // ...
  "browse": {
    "type": "ResourceType",
    "deepLink": "#blade/MyExtension/BookMenuBlade/menuid/manuals"
  },
```
<details>
<summary>Legacy PDL</summary>
<p><!-- do not remove following empty line -->

```xml
  <AssetType Name="Manual"
             ...>
    <Browse Type="ResourceType"
            DeepLink="#blade/MyExtension/BookMenuBlade/menuid/manuals" />
  </AssetType>
```
</p>
</details>

## Example Menu Blade for Browse Hub

The code for our sample menu blade can be seen here:

```typescript
/**
 * Menu blade for the books browse deep link.
 */
@MenuBlade.Decorator()
export class BookMenuBlade {
    /**
     * Menu blade view model properties.
     */
    public title = ClientResources.AssetTypeNames.Book.plural;
    public subtitle = "";
    public context: MenuBlade.Context<Parameters>;
    public viewModel: MenuBlade.ViewModel2;

    /**
     * Blade view model constructor.
     */
    public onInitialize() {
        const { container, parameters } = this.context;

        this.viewModel = MenuBlade.ViewModel2.create(container, {
            groups: [
                {
                    id: "types",
                    displayText: ClientResources.AssetTypeNames.Book.plural,
                    items: [
                        {
                            id: "overview",
                            displayText: ClientResources.AssetTypeNames.Book.plural,
                            icon: Images.book,
                            supplyBladeReference: () => BladeReferences
                                .forBlade("BookOverview")
                                .createReference({
                                    parameters: null,
                                }),
                        },
                        {
                            id: "manuals",
                            displayText: ClientResources.AssetTypeNames.Manual.plural,
                            icon: Images.manual,
                            supplyBladeReference: () => BladeReferences
                                .forExtension("HubsExtension")
                                .forBlade("ARGBrowseResourcesInMenu")
                                .createReference({
                                    parameters: {
                                        resourceType: "Microsoft.test/manuals",
                                    },
                                }),
                        },
                        {
                            id: "novels",
                            displayText: ClientResources.AssetTypeNames.Novel.plural,
                            icon: Images.novel,
                            supplyBladeReference: () => BladeReferences
                                .forExtension("HubsExtension")
                                .forBlade("ARGBrowseResourcesInMenu")
                                .createReference({
                                    parameters: {
                                        resourceType: "Microsoft.test/novels",
                                    },
                                }),
                        },
                    ],
                },
            ],
            // The default menu item is the overview unless the deeplink had a 'menuid'.
            defaultId: parameters.menuid || "overrview",
        });

        return Q();  // This sample loads no data.
    }
}
```

# Custom browse blade

If you don't have a list of resources and simply need to add a custom blade to Browse, you can define an asset type with a `Browse` type of `AssetTypeBlade`. This tells Browse to launch the blade associated with the asset type. Note that the asset type doesn't actually refer to an instance of a resource in this case. This is most common for services that are only provisioned once per directory or horizontal services (Cost Management, Monitoring, Azure Advisor etc...). In this case, the `PluralDisplayName` is used in the 'All services' menu, but the other display names are ignored. Feel free to set them to the same value.

DX.json:
```jsonc
"assetType": {
  "name": "CompanyLibrary",
  "blade": "CompanyLibraryBlade",
  // ...
  "browse": { "type": "AssetTypeBlade" }
}
```
<details>
<summary>Legacy PDL</summary>
<p><!-- do not remove following empty line -->

```xml
<AssetType
    Name="CompanyLibrary"
    BladeName="CompanyLibraryBlade"
    ... >
  <Browse Type="AssetTypeBlade" />
</AssetType>
```
</p>
</details>

# Customization of Browse for Resources not available in Azure Resource Graph

If your resource type is not available in Azure Resource Graph, you can still customize the browse experience. While there are compelling reasons to move your resource type to the Azure Resource Graph, if your resources are untracked, currently you cannot use the Azure Resource Group. Using ARM browse as a fallback is a possibility until more support for untracked resources is available.

## Customizing columns

By default, ARM Browse only shows the resource name, group, location, and subscription. To customize the columns, add a view-model to the `AssetType` and indicate that you have custom Browse config:

```xml
<AssetType Name="Book" ViewModel="BookViewModel" ... >
  <Browse Type="ResourceType" UseCustomConfig="true" />
  <ResourceType ResourceTypeName="Microsoft.Press/books" ApiVersion="2016-01-01" />
</AssetType>
```

Now, create the asset view-model class that implements the `getBrowseConfig()` function:

```ts
class BookViewModel implements ExtensionDefinition.ViewModels.ResourceTypes.BookViewModel.Contract {

    public getBrowseConfig(): Promise<MsPortalFx.Assets.BrowseConfig> {
        ...
    }
}
```

The `getBrowseConfig()` function provides the following configuration options for your Browse blade:

- **`columns`** - List of custom columns the user will be able to choose to display
- **`defaultColumns`** - List of column ids that will be used by default
- **`properties`** - Additional properties used by formatted columns (e.g. HTML formatting)

Start by specifying all possible custom columns you want to make available to customers using `BrowseConfig.columns`. Browse will share the list of standard ARM columns and any custom columns you define with users and let them choose which columns they want to see.

To specify which columns to show by default, save the column ids to `BrowseConfig.defaultColumns`. If any columns require additional data, like HTML-formatted columns that include 2 or more properties, save the additional property names (not the `itemKey`) to `BrowseConfig.properties`. Browse needs to initialize the grid with all the properties you'll use for supplemental data to ensure the grid will be updated properly.

```ts
class BookViewModel implements ExtensionDefinition.ViewModels.ResourceTypes.BookViewModel.Contract {

    public getBrowseConfig(): Promise<MsPortalFx.Assets.BrowseConfig> {
        return Q.resolve({
            // columns the user will be able to choose to display
            columns: [
                {
                    id: "author",
                    name: ko.observable<string>(ClientResources.author),
                    itemKey: "author"
                },
                {
                    id: "genre",
                    name: ko.observable<string>(ClientResources.genre),
                    itemKey: "genre",
                    format: MsPortalFx.ViewModels.Controls.Lists.Grid.Format.HtmlBindings,
                    formatOptions: {
                        htmlBindingsTemplate: "<div data-bind='text: genre'></div> (<div data-bind='text: subgenre'></div>)"
                    }
                }
            ],

            // default columns to show -- name is always first
            defaultColumns: [
                ResourceColumns.resourceGroup,
                "author",
                "genre"
            ],

            // additional properties used to support the available columns
            properties: [
                "subgenre"
            ]
        });
    }
}
```

Notice that the genre column actually renders 2 properties: genre and subgenre. Because of this, we need to add "subgenre" to the array of additional properties to ensure it gets rendered properly to the grid.

At this point, you should be able to compile and see your columns show up in your Browse blade. Of course, you still need to populate your supplemental data. Let's do that now...

## Providing supplemental data

In order to specify supplemental data to display on top of the standard resource columns, you'll need to opt in to specifying supplemental data in PDL:

```xml
<AssetType Name="Book" ViewModel="BookViewModel" ... >
  <Browse Type="ResourceType" UseSupplementalData="true" />
  <ResourceType ResourceTypeName="Microsoft.Press/books" ApiVersion="2016-01-01" />
</AssetType>
```

You'll also need to implement the `supplementalDataStream` property and `getSupplementalData()` function on your asset view-model:

```ts
class BookViewModel implements ExtensionDefinition.ViewModels.ResourceTypes.BookViewModel.Contract {

    public supplementalDataStream = ko.observableArray<MsPortalFx.Assets.SupplementalData>([]);

    public getBrowseConfig(): Promise<MsPortalFx.Assets.BrowseConfig> {
        ...
    }

    public getSupplementalData(resourceIds: string[], columns: string[]): Promise<any> {
        ...
    }
}
```

After the Browse blade retrieves the first page of resources from ARM, it will call `getSupplementalData()` with the batch of resource ids retrieved from ARM as well as the column ids currently being displayed in the grid. You'll then retrieve *only* the properties required to populate those columns for *only* the specified resource ids. **Do not query all properties for all resources!**

```ts
class BookViewModel implements ExtensionDefinition.ViewModels.ResourceTypes.BookViewModel.Contract {

    private _container: MsPortalFx.ViewModels.ContainerContract;
    private _dataContext: any;
    private _view: any;

    constructor(container: MsPortalFx.ViewModels.ContainerContract, initialState: any, dataContext: ResourceTypesArea.DataContext) {
        this._container = container;
        this._dataContext = dataContext;
    }

    ...

    public getSupplementalData(resourceIds: string[], columns: string[]): Promise<any> {
        // NOTE: Do not create the view in the constructor. Initialize here to create only when needed.
        this._view = this._view || this._dataContext.bookQuery.createView(this._container);

        // connect the view to the supplemental data stream
        MsPortalFx.Assets.SupplementalDataStreamHelper.ConnectView(
            this._container,
            view,
            this.supplementalDataStream,
            (book: Book) => {
                return resourceIds.some((resourceId) => {
                    return ResourceTypesService.compareResourceId(resourceId, book.id());
                });
            },
            (book: Book) => {
                // save the resource id so Browse knows which row to update
                var data = <MsPortalFx.Assets.SupplementalData>{ resourceId: book.id() };

                // only save author if column is visible
                if (columns.indexOf("author") !== -1) {
                    data.author = robot.author();
                }

                // if the genre column is visible, also add the subgenre property
                if (columns.indexOf("genre") !== -1) {
                    data.genre = robot.genre;
                    data.subgenre = robot.subgenre;
                }

                return data;
            });

        // send resource ids to a controller and aggregate data into one client request
        return view.fetch({ resourceIds: resourceIds });
    }
}
```

**NOTE:** If you notice that some of the supplemental properties aren't being saved to the grid, double-check that the property names are either listed as the `itemKey` for a column or have been specified in `BrowseConfig.properties`. Unknown properties won't be saved to the grid.

**NOTE:** **Do not pre-initialize data.** Browse will show a loading indicator based on whether or not it's received data. If you initialize any supplemental data, this will inform the grid that loading has completed. Instead, leave cells empty when first displaying them.

Now, you should have supplemental data getting populated. Great! Let's add context menu commands...

## Adding an informational message/link to ARM browse

If you need to display an informational message and/or link above the list of resources, add an `infoBox` to your Browse config:

```ts
class BookViewModel implements ExtensionDefinition.ViewModels.ResourceTypes.BookViewModel.Contract {

    public getBrowseConfig(): Promise<MsPortalFx.Assets.BrowseConfig> {
        return Q.resolve({
            infoBox: {
                image: MsPortalFx.Base.Images.Info(),
                text: resx.browseBookInfoBoxText,

                // optionally specify a blade to launch when the infobox is clicked
                blade: <MsPortalFx.ViewModels.DynamicBladeSelection>{
                    detailBlade: "BookInfoBlade",
                    detailBladeInputs: null
                },

                // ...or link to an external web page
                uri: "https://microsoftpress.com"

                // NOTE: Blade is preferred over link, if both are specified.
           },
            ...
        });
    }

    ...
}
```

## Adding context menu commands

Context menu commands in Browse must take a single `id` input parameter that is the resource id of the specific resource. To specify commands, add the name of the command group defined in PDL to Browse config:

```xml
<CommandGroup Name="BrowseBookCommands">
  ...
</CommandGroup>
```

```ts
class BookViewModel implements ExtensionDefinition.ViewModels.ResourceTypes.BookViewModel.Contract {

    public getBrowseConfig(): Promise<MsPortalFx.Assets.BrowseConfig> {
        return Q.resolve({
            // NOTE: Extension (commandGroupOwner) only required if from another extension
            contextMenu: {
                commandGroup: "BrowseBookCommands",
                commandGroupOwner: "<extension name>"
            },
            ...
        });
    }

    ...
}
```

If you need to expose different commands based on some other metadata, you can also specify the the command group in `SupplementalData.contextMenu` in the same way.

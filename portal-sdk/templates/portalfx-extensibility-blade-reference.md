
### Launching blades from another extension

When using `<BladeAction>`, you're generally going to be launching blades from your own extension.  In some cases, you may [import a part from another extension](portalfx-parts-sharing.md).  Using this technique, the source of the shared part will control launching of the blade.  However - in some cases you may want to launch a blade from another extension using a part from the current extension.  This is where `BladeReference` is useful.  To use a `BladeReference`, you must import the PDE from another extension.  That extension must explicitly flag it's blades as exported:

```xml
<Blade
	Name="WebsiteBlade"
	Export="True"  .. />
```

{"gitdown": "include-file", "file": "portalfx-extensibility-pde.md"}

#### Consuming the blade

To launch the blade referenced by the PDE file, use a `<BladeAction>` as usual, but specifying the extension:

'\Client\ResourceTypes\ResourceTypes.pdl'

```xml
<BladeAction Blade="{BladeReference ResourceMapBlade, ExtensionName=HubsExtension}">
  <BladeInput
      Source="assetOwner"
      Parameter="assetOwner" />
  <BladeInput
      Source="assetType"
      Parameter="assetType" />
  <BladeInput
      Source="assetId"
      Parameter="assetId" />
</BladeAction>
```

{"gitdown": "include-file", "file": "portalfx-rpc.md"}

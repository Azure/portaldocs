<properties title="" pageTitle="SettingListBlade migration to V2" description="" authors="adamabdelhamed,ashergarland" />

# Setting List Blade Migration

Migrating from SettingListBlade to SettingListV2Blade is a small migration which is fully backwards compatible. It requires a slight change to both the SettingsListBlade PDL and viewmodel.

You can find a sample of the SettingListV2 blade kind in the SamplesExtension:


## PDL Changes

The change required is to add "V2" to the PDL tag

For reference see:

`\Client\Blades\BladeKind\BladeKinds.pdl`

### PDL - SettingList

```xml
    <azurefx:SettingListBlade
        ...
        />
```

### PDL - SettingListV2

```xml
    <azurefx:SettingListV2Blade
        ...
        />
```

## TypeScript Changes

The change require is to add "V2" to the name of the viewmodel which the part extends

For reference see:

`\Client\Blades\BladeKind\ViewModels\SettingListPartViewModel.ts`

### TypeScript - SettingList

```ts
/**
 * The view model of the setting list part.
 */
export class SettingListPartViewModel extends MsPortalFx.ViewModels.Parts.SettingList.ViewModel {
    ...
}
```

### TypeScript - SettingListV2

```ts
/**
 * The view model of the setting list v2 part.
 */
export class SettingListPartViewModel extends MsPortalFx.ViewModels.Parts.SettingList.ViewModelV2 {
    ...
}
```
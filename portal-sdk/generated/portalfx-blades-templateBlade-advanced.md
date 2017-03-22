
<a name="templateblade-advanced-options"></a>
### TemplateBlade Advanced Options

<a name="deep-linking"></a>
### Deep linking

"Deep linking" is the feature where the portal URL is updated when a blade is opened (giving the user a URL to directly navigate to the new blade).
By design only certain blades are deep linkable. Blades that aren't deep linkable are those that can't be opened independent of some parent 
blade or part, like blades that return values to their caller. Think of these non-deep linkable blades as web pages in the middle of an website's
check-out experience.

One of the easiest ways to make your blade deep linkable is to mark your TemplateBlade as pinnable. See more information about pinning [here](#pinning-your-blade).

<a name="showing-a-shield-loading-status-in-your-blade"></a>
### Showing a shield / loading status in your blade

Sometimes you may want to prevent interaction with your blade while initializing it. In those cases, you can add a shield. The shield can be fully transparent or opaque. In all cases, a loading indicator UX is displayed in the blade. 

The code snippet below shows an extreme example where a filter is applied on a timer and it changes from opaque to transparent).

```typescript

export class TemplateBladeWithShieldViewModel
extends Blade
implements Def.TemplateBladeWithShieldViewModel.Contract
{
/**
 * The blade's title.
 */
public title: KnockoutObservable<string>;

/**
 * TextBox form field.
 */
public myTextBox: TextBox.ViewModel;

private _timerHandle: number;

constructor(container: FxCompositionBlade.Container, initialState: any, dataContext: BladesArea.DataContext) {
    super();

    this.title(ClientResources.templateBladeWithShield);

    const translucent = MsPortalFx.ViewModels.ShieldType.Translucent;
    const opaque = MsPortalFx.ViewModels.ShieldType.Opaque;
    var isTranslucent = true;

    var op = () => {
        var operation = Q.defer<any>();
        var shieldType = isTranslucent ? translucent : opaque;
        container.operations.add(operation.promise, { blockUi: true, shieldType: shieldType });

        isTranslucent = !isTranslucent;
        window.setTimeout(() => { operation.resolve(); }, 3000);
    };

    op();

    window.setInterval(op, 5000);

    // TextBox
    var textBoxOptions = <TextBox.Options>{
        label: ko.observable(ClientResources.formsSampleBasicTextBox)
    };
    this.myTextBox = new TextBox.ViewModel(container, textBoxOptions);
}

/**
 * Clean up any resources.
 */
public dispose(): void {
    window.clearInterval(this._timerHandle);
}
}

```

<a name="showing-a-notification-in-your-blade"></a>
### Showing a notification in your blade

Blades can display a status bar at their top that contains both text and a background color that can be used to convey information and status to users. For example, when validation fails in a form a red bar with a message can be displayed at the top of the blade.

This area is clickable and can either open a new blade or an external url.

This capability is exposed through the **statusBar** member in the Blade base class (using `this.statusBar(myStatus)` in your blade view-model).

```typescript

if (newContentState !== MsPortalFx.ViewModels.ContentState.None) {
    statusBar = {
        text: newDisplayText,
        state: newContentState,
        selection: stateDetailsBladeSelection,
        onActivated: onActivated
    }
}

this.statusBar(statusBar);

```

<a name="pinning-your-blade"></a>
<a name="pinning-your-blade"></a>
### Pinning your blade

You can mark your blades as able to be pinned to the dashboard by setting `Pinnable="true"` in the TemplateBlade's PDL definition.

By default blades are pinned as button parts to the dashboard.

If you desire to provide a different part represention you need to indicate that in the PDL definition of your blade.

<a name="storing-settings-for-your-blade"></a>
### Storing settings for your blade

You can store settings associated with a blade. Those settings need to be declared both in the PDL definition of your blade and in the view-model.

The code below shows how to define the settings in PDL using the `TemplateBlade.Settings` element.

```xml

<TemplateBlade Name="PdlTemplateBladeWithSettings"
               ViewModel="{ViewModel Name=TemplateBladeWithSettingsViewModel, Module=./Template/ViewModels/TemplateBladeViewModels}"
               Template="{Html Source='Templates\\TemplateBladeWithSettings.html'}">
  <TemplateBlade.Settings>
    <Setting Property="colorSettingValue" />
    <Setting Property="fontSettingValue" />
  </TemplateBlade.Settings>
</TemplateBlade>

```

Once the settings are declared, you need to define them in your view-model too.

```typescript

// These are required by the portal presently.  Re: Part Settings, the Part below works exclusively in terms of
// 'configuration.updateValues' to update settings values and 'onInputsSet(..., settings)' to receive settings values.
public colorSettingValue = ko.observable<BackgroundColor>();
public fontSettingValue = ko.observable<FontStyle>();

```

The settings are retrieved through the blade container.

```typescript

const configuration = container.activateConfiguration<Settings>();
this.configureHotSpot = new HotSpotViewModel(container, {
    supplyBladeReference: () => {
        const bladeRef = new PdlTemplateBladeWithSettingsConfigurationReference<BladeConfiguration, BladeConfiguration>({
            // The Configuration values are sent to the Provider Blade to be edited by the user.
            supplyInitialData: () => {
                return configuration.getValues();
            },

            // The edited Configuration values are returned from the Provider Blade and updated in this Part.
            // Any edits will cause 'onInputsSet' to be called again, since this is the method where the Part receives a new, consistent
            // set of inputs/settings.
            receiveResult: (result) => {
                configuration.updateValues(result);
            }
        });

        bladeRef.metadata = {
            isContextBlade: true
        };

        return bladeRef;
    }
});

```

The settings are also passed to onInputsSet.

```typescript

public onInputsSet(inputs: Def.TemplateBladeWithSettingsViewModel.InputsContract, settings: Def.TemplateBladeWithSettingsViewModel.SettingsContract): MsPortalFx.Base.Promise {
    // Any changes to the  Configuration values (see 'updateValues' above) will cause 'onInputsSet' to be called with the
    // new inputs/settings values.
    this._colorSetting(settings && settings.content && settings.content.colorSettingValue || BackgroundColor.Default);
    this._fontSetting(settings && settings.content && settings.content.fontSettingValue || FontStyle.Default);

    return null;
}

```

<a name="showing-unauthorized-ui-in-your-blade"></a>
### Showing Unauthorized UI in your blade

You can set your blade to Unauthorized UI using the **unauthorized** member of the blade container.

The code below does this statically, but it can also be done dynamically (e.g. based on a condition after data is loaded).

```typescript

constructor(container: MsPortalFx.ViewModels.ContainerContract,
            initialState: any,
            dataContext: BladesArea.DataContext) {
    super();
    this.title(ClientResources.bladeUnauthorized);
    this.subtitle(ClientResources.bladesLensTitle);

    /**
     * This call marks the Blade as unauthorized, which should display a specialized UI.
     */
    container.unauthorized();
}

```

<a name="showing-notice-ui-dynamically-in-your-blade"></a>
### Showing Notice UI dynamically in your blade

You can set your blade to Notice UI using **enableNotice** member of the blade container.

This can be done statically (e.g. in the constructor) or dynamically. In the example below, the blade is set to Notice UI if the **id** input parameter has a given value.

```typescript

public onInputsSet(inputs: any): MsPortalFx.Base.Promise {
    this.title(inputs.id);

    if (inputs.id === "42" || inputs.id === "43") {
        // to simulate the response from service and enable notice accordingly.
        return Q.delay(1000).then(() => {
            this._container.enableNotice({
                noticeTitle: ClientResources.comingSoonTitle,
                noticeHeader: ClientResources.comingSoon.format(inputs.id),
                noticeDescription: ClientResources.comingSoonDescription,
                noticeCallToActionText: ClientResources.comingSoonAction,
                noticeCallToActionUri: ClientResources.microsoftUri,
                noticeImageType: MsPortalFx.ViewModels.Controls.Notice.ImageType.ComingSoon
            });
        });
    } else {
        return null;
    }
}

```
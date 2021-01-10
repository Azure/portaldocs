
<a name="advanced-topics"></a>
## Advanced Topics

The following sections discuss advanced topics in template blade development.

* [Deep linking](#deep-linking)

* [Displaying notifications using the status bar](#displaying-notifications-using-the-status-bar)

* [Making your blade pinnable to a dashboard](#making-your-blade-pinnable-to-a-dashboard)

* [Exception cases that affect the entire blade](#exception-cases-that-affect-the-entire-blade)

**NOTE**: In this discussion, `<dir>` is the `SamplesExtension\Extension\` directory, and  `<dirParent>`  is the `SamplesExtension\` directory, based on where the samples were installed when the developer set up the SDK. If there is a working copy of the sample in the Dogfood environment, it is also included.

* * *

<a name="advanced-topics-deep-linking"></a>
### Deep linking

The portal lets the user link directly to a particular blade. As long as your blade does not have the `@ReturnsData` decorator then users can deep link to it. There are a few supported link formats.

* The #blade format lets you link to arbitrary blades

    Format:

    ```
    https://portal.azure.com/{directory}#blade/{extension}/{blade}
    ```

    Example:

    [https://portal.azure.com/microsoft.com#blade/HubsExtension/HelpAndSupportBlade](https://portal.azure.com/microsoft.com#blade/HubsExtension/HelpAndSupportBlade)

    Blade parameters are serialized in consecutive name/value pairs.

    Format:

    ```
    https://portal.azure.com/{directory}#blade/{extension}/{blade}/{param1name}/{param1Val}/{param2name}/{param2Val}
    ```

    Example:
    [https://portal.azure.com/microsoft.com#blade/HubsExtension/BrowseAllBladeWithType/type/HubsExtension_Tag](https://portal.azure.com/microsoft.com#blade/HubsExtension/BrowseAllBladeWithType/type/HubsExtension_Tag)

    **Note**: Extension authors should always validate blade input parameters, as these might come from the browser address bar, which can be hand-crafted by end-users. For this reason, it is not recommended to use input parameters as a way to pass extended information to a blade that is being opened, just to avoid a lookup. As an example, if the intent is to display extended information about a resource, and even if the calling blade already retrieved that information, the recommended pattern is to only pass the resource identifier and have the receiving blade look up information about that resource and display it. That could be via a REST call to the back-end (possibly cached for performance) or it could be via a shared/cached data object in the extension’s context (with possible fallback to REST for resiliency, as the user might deep-link directly to it).

* The #create format lets you link to marketplace items

    Format:

    ```
    https://portal.azure.com/{directory}#create/{packageid}
    ```

    Example:

    [https://portal.azure.com/microsoft.com#create/NewRelic.NewRelicAccount](https://portal.azure.com/microsoft.com#create/NewRelic.NewRelicAccount)

    To link to the Marketplace item details blade for your package, add "/preview" to the end of your Create blade link.

    Format:

    ```
    https://portal.azure.com/{directory}#create/{packageid}/preview
    ```

    Example:

    [https://portal.azure.com/microsoft.com#create/NewRelic.NewRelicAccount/preview](https://portal.azure.com/microsoft.com#create/NewRelic.NewRelicAccount/preview)

* The #resource format lets you link to Azure resources

    To link to resources, all you need is the resource id. Currently, only subscription resources are supported. Tenant resources and nested resources are not supported.

    Format:

    ```
    https://portal.azure.com/{directory}#resource{resourceid}
    ```

    Example:
    [https://portal.azure.com/microsoft.com#resource/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/foo/providers/microsoft.web/sites/bar](https://portal.azure.com/microsoft.com#resource/subscriptions/00000000-0000-0000-0000-000000000000/resourceGroups/foo/providers/microsoft.web/sites/bar)

* The #asset format lets you link to arbitrary portal assets

    Format:

    ```
    https://portal.azure.com/{directory}#asset/{extension}/{assettype}/{assetid}
    ```

    Example:
    [https://portal.azure.com/microsoft.com#asset/Microsoft_Azure_Billing/BillingSubscriptionBrowseService/00000000-0000-0000-0000-000000000000](com#asset/Microsoft_Azure_Billing/BillingSubscriptionBrowseService/00000000-0000-0000-0000-000000000000)

<a name="advanced-topics-displaying-notifications-using-the-status-bar"></a>
### Displaying notifications using the status bar

A status bar can be displayed at the top of a blade. The status bar supports text, and icon, and multiple severities (e.g. warning,info,error) and supports navigating to a blade or external site when clicked.

There is a sample for the status bar at [https://df.onecloud.azure-test.net/?feature.samplesextension=true#blade/SamplesExtension/TemplateBladeWithStatusBar](https://df.onecloud.azure-test.net/?feature.samplesextension=true#blade/SamplesExtension/TemplateBladeWithStatusBar).

If you have the source code to the samples you can find the source code at this path: `Client/V2/Blades/Template/TemplateBladeWithStatusBar.tsx`. It is also included in the following code.

/* @jsx Weave */

import * as Weave from "Weave/SandboxMode";
import { WeaveNode } from "Weave";
import * as ClientResources from "ClientResources";
import { ClickableLink } from "Fx/Composition";
import * as TemplateBlade from "Fx/Composition/TemplateBlade2";
import * as Dropdown from "Fx/Controls/DropDown";
import { PcControl } from "Fx/Weave/Components/PcControl";

@TemplateBlade.Decorator()
export class TemplateBladeWithStatusBar {
    public readonly title = ClientResources.templateBladeWithStatusBar;
    public readonly subtitle: string;

    // Dropdown that manages the status of the blade and therefore the status bar
    public readonly statusBarState = Dropdown.create<TemplateBlade.ContentState>(this._container, {
        label: "Select the type of the status bar",
        subLabel: "Note: 'None' means there is no Status and therefore no Status Bar",
        suppressDirtyBehavior: true,
        items: [
            { text: "None", value: TemplateBlade.ContentState.None },
            { text: "Warning", value: TemplateBlade.ContentState.Warning },
            { text: "Error", value: TemplateBlade.ContentState.Error },
            { text: "Dirty", value: TemplateBlade.ContentState.Dirty },
            { text: "Info", value: TemplateBlade.ContentState.Info },
            { text: "Upsell", value: TemplateBlade.ContentState.Upsell },
            { text: "Complete", value: TemplateBlade.ContentState.Complete },
        ],
        value: TemplateBlade.ContentState.None,
    });

    public readonly context: TemplateBlade.Context<void>;

    constructor(
        private readonly _container: TemplateBlade.Container
    ) {
        // Subscribe to the changes of statusBarState to dictate the Status Bar
        this.statusBarState.value.subscribe(_container, statusBarState => {
            _container.statusBar({
                text: ClientResources.templateBladeWithStatusBarMessage,
                state: statusBarState,
                onClick: new ClickableLink("http://www.bing.com"),
            });
        });
    }

    public weave(): WeaveNode {
        return (
            <div className="ext-bladewithstatus-root">
                <PcControl className="ext-statusoptions" vm={this.statusBarState} container={this._container} />
            </div>
        );
    }

    public async onInitialize() {
    }
}


<a name="advanced-topics-making-your-blade-pinnable-to-a-dashboard"></a>
### Making your blade pinnable to a dashboard

No-pdl blades can be made pinnable by making the following changes to your code.

1. Add the `@TemplateBlade.Pinnable.Decorator` decorator to the  Template Blade class, or `@FrameBlade.Pinnable.Decorator`, `@Blade.Pinnable.Decorator` for these less commonly used Blade variations.

1. Implement an `onPin' method`.

1. Return a `PartReference` instance to a Part you design.  The Part should open the Blade when clicked.

These concepts are illustrated in the sample located at `<dir>/Client/V2/Blades/Pinning/PinnableBlade.tsx` and in the working copy located at [https://df.onecloud.azure-test.net/#blade/SamplesExtension/PinnableBlade/personId/111](https://df.onecloud.azure-test.net/#blade/SamplesExtension/PinnableBlade/personId/111).

<a name="advanced-topics-exception-cases-that-affect-the-entire-blade"></a>
### Exception cases that affect the entire blade

<a name="advanced-topics-exception-cases-that-affect-the-entire-blade-the-user-is-not-authorized-to-view-the-blade"></a>
#### The user is not authorized to view the blade

You may determine that the current user does not have access to the current blade's content. In this case you can call `container.unauthorized()` and the user will be presented with a message that is consistent across all experiences in the portal.

For optimal performance, we recommend you avoid extra calls to determine access rights. When possible, simply try to make the calls needed to load the page and call the `unauthorized()` function if the call failed with an authorization error.

<a name="advanced-topics-exception-cases-that-affect-the-entire-blade-the-service-is-not-configured-properly-for-the-user-to-view-the-blade"></a>
#### The service is not configured properly for the user to view the blade

You may have a scenario where the current user can't use the blade for some unexpected reason (e.g. they are not a part of a private preview or they have not done some prerequisite step). For scenarios like this you can call `container.enableNotice()` to render a generic notice with formatting that will be consistent across all experiences.

<a name="advanced-topics-exception-cases-that-affect-the-entire-blade-the-underlying-resource-for-this-blade-does-not-exist"></a>
#### The underlying resource for this blade does not exist

A user may try to deep link to a blade for a resource that no longer exists. In this case you can call `container.notFound()` and provide a message. A generic not found UI will be presented to the user.

<a name="advanced-topics-exception-cases-that-affect-the-entire-blade-the-data-required-to-load-the-blade-failed-for-some-unknown-reason-e-g-500-internal-server-error"></a>
#### The data required to load the blade failed for some unknown reason (e.g. 500 internal server error)

If your blade cannot load because of an unexpected error then you should call the `container.fail()` API. The message you provide here will be logged, but not presented to the user. This is because you should only use this API for unexpected errors. If you are handling an expected error condition then you should either use the `enableNotice()` API or do some custom rendering if the scenario requires it.
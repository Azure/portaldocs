
<tags
    ms.service="portalfx"
    ms.workload="portalfx"
    ms.tgt_pltfrm="portalfx"
    ms.devlang="portalfx"
    ms.topic="get-started-article"
    ms.date="08/06/2015"
    ms.author="thaodoan"/>

<a name="mds-tables"></a>
# MDS Tables

<a name="mds-tables-access"></a>
## Access

[https://production.diagnostics.monitoring.core.windows.net/](https://production.diagnostics.monitoring.core.windows.net/)

<a name="mds-tables-overview"></a>
## Overview

- AuxWebUiClientEvents - Client logs generated in the browser (ex: `MsPortalFx.Base.Diagnostics.Log`)
- AuxWebUiClientTelemetry - Client UI interactions, counts, etc. (see below for details)
- AuxWebUiCounterEvents - Windows performance counters
- AuxWebUiEvents - Generic server events
- AuxWebUiExtEvents - Extension events (via `IntrinsicExtensionTracer`)
- AuxWebUiExtTelemetry - Extension telemetry (via `IntrinsicExtensionTracer`)
- AuxWebUiSvcAuthorized - Information about users granted access
- AuxWebUiSvcErrors - All exceptions thrown by Framework server-side
- AuxWebUiSvcEvents - All server info/verbose messages logged (ex: `Trace.Verbose`)
- AuxWebUiSvcIncomingRequests - Information about incoming requests
- AuxWebUiSvcOutgoingRequests - Information about outgoing requests
- AuxWebUiSvcPageRequests - Client request information like IP, user agent, etc.
- AuxWebUiSvcSessions - User session information like PUID, etc.
- AuxWebUiSvcSubscriptions - Subscription information for each user
- AuxWebUiSvcWarnings - All server warnings logged (ex: `Trace.Warning`)
- AuxWebUiSvcUnauthorized - Information about users denied access
- AuxWebUiWindowsEvents - Windows event logs

<a name="mds-tables-details"></a>
## Details

<a name="mds-tables-details-auxwebuiclienttelemetry"></a>
### AuxwebUiClientTelemetry

The following actions are logged to ClientTelemetry table:

* Blade events

    * **BladeLoaded**
        * Tracks the time it takes to open the blade and start seeing the part frames show up. BladeLoaded also includes loading and opening the action bar.
    * **BladeLoadErrored**
        * Triggered when loading a blade failed. 
        * **This event is used to track blade errors in our reliability metrics.**
    * **BladeOpened**
        * Tracks the time it takes for BladeLoaded + all the parts to start loading.  More specifically, it is when the blade’s Above The Fold lenses, parts and widgets have been created. It includes setting up the input bindings. The inputs themselves aren’t necessarily available yet (onInputsSet is not necessarily called yet). It also includes loading the collapsed state of the essentials part (if there is one).
    * **BladeRevealed**
        * All parts above the fold have called reveal content or resolved onInputsSet(). This action is triggered when a Blade is revealed but the parts within the blade may still be loading.
        * **This event is used in our blade performance metrics.**
    * **BladeReady**
        * All parts above the fold have resolved onInputsSet(). This action is triggered when a Blade Load is complete and it's ready for consumption by the user.
    * **BladeFullOpened**
        * Is the same as BladeOpened except it is for all the parts, not just the parts above the fold.
    * **BladeFullRevealed**
        * Is the same as BladeRevealed except it is for the all parts, not just the parts above the fold.
    * **BladeFullReady**
        * Is the same as BladeReady except it is for all the parts, not just the parts above the fold.
    * **BladeButtonClicked**
        * When the pin, unpin, maximize, minimize or close button on a blade is clicked.
    * **CommandExecuted** 
        * When any of the Commands on a blade is clicked - like start, stop, etc.

    "name" column provides the name of the blade. This name is provided in "Extension/extension_name/Blade/blade_name" format.

* Part events

    * **PartClick**
        * Triggered when a part is clicked.
    * **PartLoaded**
        * Tracks the time it takes for a part to start getting filled with some UI (e.g. … spinner)
    * **PartErrored**
        * Triggered when loading a part failed. 
        * **This event is used to track part errors in our reliability metrics.**
    * **PartReady**
        * Triggered when the part has resolved onInputsSet().

    "name" column provides the name of the part. This name is provided in "Extension/extension_name/Blade/blade_name/Part/part_name" format.

* Portal Ready events

    * **TotalTimeToPortalReady**
        * Tracks the time it takes to load the portal (load the splash screen and show the startboard or start rendering the blade if it was a deep link).
    * **TotalTimeToStartBoardReady**
        * Tracks the time to load the portal and show the startboard.
    * **TotalTimeToDeepLinkReady**
        * This event is triggered only if a user is using a deep link to call up the portal. It tracks the time it takes to load the portal and start rendering the deep linked blade.

    The portal load time is tracked in the "duration" column.

* Extension events

    * **LoadExtensions**
        * Measures the time it takes Shell to create the extension's IFrame until Shell receives the extension's manifest.
        * "actionModifier" = start is triggered when an extension starts loading
        * "actionModifier" = cancel is triggered when an extension fails loading
        * "actionModifier" = complete is triggered when an extension finishes loading
    * **InitializeExtensions**
        * Measures the time since Shell receives the extension manifest until Shell receives an RPC response stating that the extension's state is Initialized.
        * "actionModifier" = start is triggered when an extension starts being initialized
        * "actionModifier" = cancel is triggered when an extension's initialization fails
        * "actionModifier" = complete is triggered when an extension's initialization finishes

    "name" column provides the name of the extension which is being loaded/initialized.

* Create events

    * **CreateFlowLaunched**
        * Triggered when a user expresses the intent to create a resource in the Portal by launching its create blade. This event is mostly logged from the Marketplace extension. This event can be found mostly in ExtTelemetry table (where the logs from Marketplace extension go) and only partially in ClientTelemetry table.
    * **ProvisioningStarted** / **ProvisioningEnded**
        * Triggered when a new deployment started/ended. This event is being logged for both custom and ARM deployments.
    * **CreateDeploymentStart** / **CreateDeploymentEnd**
        * Triggered only if the deployment is done using the ARM Provisioner provided by Framework. For ARM deployments, the order of the logged events for a deployment is: "ProvisioningStarted", "CreateDeploymentStart", "CreateDeploymentEnd" and "ProvisioningEnded".
        Note that "CreateDeploymentStart" and "CreateDeploymentEnd" are only logged if the deployment is accepted by ARM. "CreateDeploymentStart"/"CreateDeploymentEnd" logs contain the correlationId that can be used to search for the deployment's status in ARM.

    "name" column provides the name of the package getting deployed, while "data" column provides more information about the deployment.

* Side Bar events

    * **SideBarItemClicked**
        * When one of the items on the Side Bar (except + or Browse All) is clicked.
    * **SideBarFavorite**
        * When a resource type is marked as a favorite
    * **SideBarUnFavorite**
        * When a resource type is removed as a favorite

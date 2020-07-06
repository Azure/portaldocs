
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
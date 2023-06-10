
<a name="overview"></a>
## Overview

 Extension URLs use a standard CNAME pattern. Legacy DIY Extensions follow the CNAME naming pattern, and extensions that use a hosting service use the hosting service name convention. CNAMEs for hosting services are managed by the Ibiza team.

 The CNAMEs that are created are unique for each environment, and use the formats that are specified in the following table.  The table describes the URL format and the hosting service name convention for each environment, and includes links to the configuration files for each environment.

| Portal Environment           | Purpose                             | Legacy URL | Configuration File  | Hosting Service |
| ---------------------------- | ----------------------------------- | -- |  --- | --- |
| **DOGFOOD**                  | Testing environment                 | `df.<extension>.onecloud-ext.azure-test.net` |   [Extensions.dogfood.json](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx?_a=contents&path=%2Fsrc%2FRDPackages%2FOneCloud%2FExtensions.dogfood.json&version=GBdev)  | `//hosting.onecloud.azure-test.net/{hostingServiceRoutePrefix}` |
| **RC, MPAC, Preview, PROD**  | Preview and Production environments | `main.<extension>.ext.azure.com` | [Extensions.prod.json](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx?_a=contents&path=%2Fsrc%2FRDPackages%2FOneCloud%2FExtensions.prod.json&version=GBdev) 	| {hostingServiceRoutePrefix}.hosting.portal.azure.net/{hostingServiceRoutePrefix} |
| **FAIRFAX**                  | Localization site                   |  `main.<extension>.ext.azure.us` | [Extensions.ff.json](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx?_a=contents&path=%2Fsrc%2FRDPackages%2FOneCloud%2FExtensions.ff.json&version=GBdev)   |  {hostingServiceRoutePrefix}.hosting.azureportal.usgovcloudapi.net/{hostingServiceRoutePrefix |
| **MOONCAKE**                 | Localization site                   | `main.<extension>.ext.azure.cn` | [Extensions.mc.json](https://msazure.visualstudio.com/One/Azure%20Portal/_git/AzureUX-PortalFx?_a=contents&path=%2Fsrc%2FRDPackages%2FOneCloud%2FExtensions.mc.json&version=GBdev)    | {hostingServiceRoutePrefix}.hosting.azureportal.chinacloudapi.cn/{hostingServiceRoutePrefix} |                  |

**NOTE** The RC, MPAC, Preview, and PROD environments all share the same `Extensions.prod.json` file for configuration; therefore there can be only one entry for the extension across all these environments.

The relationship between the environments and the configuration files specified in [portalfx-extensions-branches.md](portalfx-extensions-branches.md).

<a name="legacy-cnames"></a>
## Legacy CNAMEs

The legacy CNAMEs are not used unless you are self-hosting your extension (not recommended).

If you are using the Hosting Service (recommended) then the DNS entries will be created on your behalf, automatically.

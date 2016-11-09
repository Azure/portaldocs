<properties title="AssetPart" pageTitle="AssetPart" description="" authors="mattshel" />

<tags
    ms.service="portalfx"
    ms.workload="portalfx"
    ms.tgt_pltfrm="portalfx"
    ms.devlang="portalfx"
    ms.topic="get-started-article"
    ms.date="07/23/2015" 
    ms.author="mattshel"/>  

## AssetPart ##

An AssetPart represents an an Azure resource (like a Web app, SQL Database, SQL Server, VM, Storage account, etc.). When a user clicks the AssetPart, the associated resource blade opens. The AssetPart should show the following (at a minimum): 



- The resource name (e.g., *myawesomewebsite*)
- The resource type (e.g. Web app)
- The resource's status (e.g. Running, Stopped, etc.)
- The resource icon

![AssetPart][Assetpart_tile]

The AssetPart uses the following sizes:

- 1x1
- 2x1
- 2X2





When a user pins something in the Browse list or pins a resource blade, the AssetPart is added to the Startboard. There's also an option in the create flow to pin a brand new resource.

![Pinning an AssetPart][Assetpart_pin]

[Assetpart_tile]: ../media/portalfx-ux-assetpart/Assetpart_tile.JPG
[Assetpart_pin]: ../media/portalfx-ux-assetpart/Assetpart_pin.JPG


<properties title="Tiles" pageTitle="Tiles" description="" authors="mattshel" />

<tags
    ms.service="portalfx"
    ms.workload="portalfx"
    ms.tgt_pltfrm="portalfx"
    ms.devlang="portalfx"
    ms.topic="get-started-article"
    ms.date="07/16/2015" 
    ms.author="mattshel"/>    

## Tiles ##

Tiles represent distinct chunks of information on a blade. Domain-specific tiles show information about a resource (for example, a subnets list in virtual networks, usage quotas in hosting plans, etc). More generic tiles might show the overall health of the resource, any child resources, billing info, auditing, etc. 

Users can move tiles around, change their size, or pin frequently-used tiles to their Startboard. Tiles should always show the latest information. The amount of data you can show depends on the size of the tile.

We provide built-in tiles, and those tiles include all of the standard UX functionality, like correct sizing and the ability to pin (so you get this stuff for free when you use our models). If you create your own tiles, you're responsible for making sure they include all of the right tile behavior.

Remember that tiles can be removed at any time from a blade. If there's an essential function that's only exposed in a tile, users might delete the tile and regret it later. Deleted tiles can be added again, but that's not always quick or intuitive. Consider putting this sort of stuff in [Settings](portalfx-ux-settings) instead. 

Also remember that you don't always have to make every tile visible right away. Users can always go to the [tile gallery](portalfx-ux-tile-gallery) and add them later. Consider putting tiles that may only appeal to a subset of your users in the gallery instead of on the blade. 

### Types of tiles ###

#### Data rollup ####

Examples: 

- Alert rules (Insights)
- Sessions (AI)

The rollup should always point to the whatever source is providing the data. The tile is like a peek view; the user can always click and view the whole package.

![Data rollup tile][data_rollup]
![Data rollup tile][rollup]
![Data rollup tile][rollup_large]

![Data rollup tile][rollup_xl]
![Data rollup tile][rollup_rg]

#### Data visualization ####

Examples:

- Monitoring (Insights)
- Usage (Insights)
- Overview timeline (AI)

![Data visualization tile][data_visualization]

#### List ####

Examples: 

- Slowest pages (AI)
- Subnets (Virtual networks)
- Scale (Insights)

Individual list items can be clickable. The tile is the entry point to the full list.

![List tile][List]

#### Relevant info ####

Examples:

- Continuous deployment (TFS)
- Estimated spend (Billing)
- Pricing tier (Hubs)

![Relevant info tile][Relevant_info]

#### Status ####

Examples:

- Asset part (Fx)
- Service health (Hubs)

![Status tile][Status]

#### Upsell ####

Examples:

- Web tests (AI in web app blade)
- Pricing tier

Use this tile in moderation. 

![Upsell tile][Upsell]

[data_rollup]: ../media/portalfx-ux-tiles/alert_rules.png
[rollup]: ../media/portalfx-ux-tiles/rollup.png
[rollup_large]: ../media/portalfx-ux-tiles/rollup_large.png
[rollup_xl]: ../media/portalfx-ux-tiles/rollup_xl.png
[rollup_rg]: ../media/portalfx-ux-tiles/rollup_rg.png
[data_visualization]: ../media/portalfx-ux-tiles/line_chart.png
[List]: ../media/portalfx-ux-tiles/scale.png
[Status]: ../media/portalfx-ux-tiles/status.png
[Relevant_info]: ../media/portalfx-ux-tiles/Relevant_info.JPG
[Upsell]: ../media/portalfx-ux-tiles/Upsell.JPG











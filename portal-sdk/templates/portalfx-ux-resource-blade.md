<properties title="" pageTitle="Creating resource blades" description="" authors="mattshel" />

<tags
    ms.service="portalfx"
    ms.workload="portalfx"
    ms.tgt_pltfrm="portalfx"
    ms.devlang="portalfx"
    ms.topic="get-started-article"
    ms.date="07/10/2015" 
    ms.author="mattshel"/>    

## Creating resource blades ##

Resource blades surface Azure resources like Web apps, VMs, SQL Databases, storage accounts, etc. They're the primary point of entry when you want to work on or view a resource, so they're hugely important from a UX/design perspective. Here's an example of a Web app resource blade:

![Web app resource blade][resourceblade]

Resource blades must contain some common elements:



- [Essentials](portalfx-control-essentials): A snapshot of common settings that appears toward the top of the blade. Includes common settings properties (like the resource group the resource belongs to, resource status, location, etc) and settings that are specific to the resource (like the URL and web hosting plan).


- [Commands](portalfx-ux-commands): A combination of an action and a resulting behavior (like Delete, Start, Pause, etc). They live across the top of the resource blade, directly beneath the title. 


- [Tiles](portalfx-ux-tiles): Distinct chunks of information that are glanceable, actionable, and display live info (like resource health, usage quotas, billing info, etc). 


- [Settings](portalfx-ux-settings): Everything with a dial or a knob lives here. Settings are centralized in one location, so it’s easy for users to find. Clicking on something in Settings takes the user to a child blade where they can take action.


- [Pricing tier](portalfx-ux-pricing-tier): Packages that contain different levels (or tiers) of services and usage quotas. Users choose which tier is best for them based on business need. We recommend 3 choices based on the customer’s situation.


- [Tools](portalfx-ux-tools): Extras used for troubleshooting, security, reviewing application logs, etc.


- [Monitoring](portalfx-ux-monitoring): A tile that displays up-to-the-minute information on the resource, including requests and errors.

In addition to this list, there's some standard functionality that will apply to most resource blades like Delete, Quickstart, Properties, etc.


 
[UX templates and redlines](https://microsoft.sharepoint.com/teams/azureteams/aapt/azureux/portalfx/_layouts/15/WopiFrame.aspx?sourcedoc={8f1f1bfc-903b-465f-9711-d8914214ca7c}&action=edit&wd=target%28%2F%2FDesign%20Sprints%2FBLADES.one%7C67c7b6e2-2525-4a20-a664-1068e3eee65e%2FBlade%20content%20template%7Ce24497d3-d8d6-4903-9ed8-d1032da0014c%2F%29)

[Create a blade](portalfx-blades)


[resourceblade]: ../media/portalfx-ux-resource-blade/resourceblade.jpg


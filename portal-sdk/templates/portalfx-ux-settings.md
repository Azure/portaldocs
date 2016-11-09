<properties title="Settings" pageTitle="Settings" description="" authors="mattshel" />

<tags
    ms.service="portalfx"
    ms.workload="portalfx"
    ms.tgt_pltfrm="portalfx"
    ms.devlang="portalfx"
    ms.topic="get-started-article"
    ms.date="09/15/2015" 
    ms.author="mattshel"/>    

## Settings ##

The Settings blade is an integral piece of the resource experience. It opens with the main resource blade, so it's a quick way for users to change settings, view properties, and find resource features. We introduced it based on feedback that the portal was  unstructured and hard to learn, since settings, properties, and features weren't always discoverable across different resource blades. From a holistic standpoint, users think of the Settings blade as a table of contents for the resource.

Group settings using one of the following layouts: 

![Default and custom settings][default_or_custom]

### Default layout (left blade)###

-  	The first group is **Troubleshoot + support**. This section will be home to new portal-wide features like **Troubleshoot**, **Create Support ticket**, **Check health** and **Recommendations**. We'll also be including extension-specific tools like **Audit logs** (formerly **Events**) to help users diagnose resource issues. 
-	The second group is **Manage**, and contains all resource-specific settings. **Properties** appears first, followed by other settings that directly apply to the resource. The order of these settings is set by the extension.
- **Monitor** includes **Alert rules**, **Diagnostics** (if applicable), **Estimated spend** (if applicable), and any other resource-specific monitoring features (e.g., if a part called *Performance monitoring* is pinned to a resource blade, it should also appear here).
- Resource management includes **Users** and **Tags**.

	
### Customized layout (right blade) ###

Resources with lots of settings, features, and tools can extend and customize this blade. Try creating additional logical groups so the blade is easier to scan.

### Search ###

Take the time to ensure effective searching by adding tags to features in Settings so they show up in search returns. 

The search field on the Settings blade returns results from two core areas: 

- The setting, tool, or feature name 
- Any tags added by the resource owner 

Tagging is critical. Effective tagging makes it easy for users to find settings that would otherwise be hidden within a larger bucket, and gives them some context. For example, searching for *Hybrid* on the Web Apps Settings blade highlights **Networking** as the setting the user needs to update. 

![Settings search][settings]


For consistency, all group names should be tagged so they show up in search returns. Also apply the following default tags:



- **Support + Troubleshoot** (Tags: *help,* *support*, *fix*)
- **Properties** (Tag: *settings*)
- **Pricing tier or equivalent** (Tags: *pricing*, *cost*, *size*, *price*)
- **Monitoring** (Tags: *performance*, *charts*, *metrics*)
- **Quickstart** (Tags: *help*, *documentation*, *start*)
- **Users** (Tags: *RBAC*, *roles*)

### Functionality ###

- Every feature, setting, and configuration option should live in the Settings blade. 
-	The Settings blade does not expose any additional status or dynamic data.
-	The Settings blade can't be pinned to the dashboard.
-	Clicking an option in Settings opens a child blade where the user can take action (e.g., a form where the user makes changes to the resource, like Application settings, Diagnostic logs, etc.).

Settings, essentials, and commands work together to provide a consistent UX experience. This helps new users onboard successfully, and makes it easier for existing users to access new features. For added visibility, users can pin parts to resource blades or their dashboards using the parts gallery.

**So why call this blade "Settings," instead of something more descriptive?**

This blade has always been a combination of configuration and properties – so finding the right name was always hard. We never felt that "Settings" was specific enough to describe the blade and what it could do, but during testing (to our surprise) we found that it resonated well with users. They understood that the blade was a combination of features, properties, and configurations that applied directly to the resource (in the same way that Settings on Windows Phone allows you to change settings, configure new accounts, turn features on or off, add new APNs, etc.). 




[default_or_custom]: ../media/portalfx-ux-settings/def_cust_settings3.jpg

[settings]: ../media/portalfx-ux-settings/Settings3.png




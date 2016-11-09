## Notifications ##

Use in-blade notifications to alert users that something is wrong (a VM is stopped, a website exceeds its quota and is suspended, a certificate will expire soon, etc.), or that they may benefit from trying a new feature. Don't use these notifications just to tell users their services are running normally. 

Use global notifications sparingly and only for critical or high value alerts.

###In-blade notifications###

In-blade notifications come in a couple of different flavors:

####The in-blade notification area####

![Notification area][notification_area]

The in-blade notification area relies on color and text to communicate severity.

- Blue band + info icon: Basic information that doesn't involve warnings, errors, or a service disruption (e.g., "The VM is stopped"). 

- Yellow band + warning icon: Warnings about potential problems that require attention (e.g., "Your website's certificate is about to expire").

- Red band + error icon: Alerts about an existing problem (e.g., "Your website's certificate has expired").

- Purple band + rocket icon: No problems to report, but we're recommending an additional feature, a separate service, or anything else that the user doesn't have (but might need). Also known as "upsell."

####The recommendation blades####

![Recommendation blades][recco_blades]

Use the pattern shown here, and keep the following in mind:

- Use a thin blade
- Include a title and a paragraph of text in the blade whitespace
- Follow the explanation paragraph with a blue button that takes action on the notification. After the user clicks the blue action button, be sure to trigger a local notification to track progress. When the process is complete, show the success blade (on the right above) 
- If you're recommending a pricing tier upgrade, use the pricing tier comparison control shown in the middle blade

	Carry the severity color over from the previous blade (as shown on the left blade above). We do this automatically for you, so you get this for free.

###Global notifications###

Global notifications show up in the notifications hub. When a user clicks the notification, it launches your resource blade and the recommendation blade.

![Notification hub][notification_hub]
 
Use a global notification when:

- Visibility is critical and you want a user to see your notification right after they log in (even if they don't open one of your blades)
- Your recommendation is low volume and high value

	To cut down on volume, avoid sending notifications for multiple instances stemming from the same underlying issue. Separate your notifications into two buckets: the most important go into the global bucket, and the less important can show up when a user opens your resource blades.

	High value notifications might prevent service disruptions, or they may result from research you've done that leads you to believe a high percentage of users will act on your recommendation. Keep in mind that we'll be measuring conversion rates and may ask partners to remove recommendations with low uptake.

If you think your notification warrants the global treatment, contact [Ibiza Fx PM](mailto:ibizafxpm@microsoft.com). We want to avoid spamming users, so the total number of global notifications will be limited. We'll want to collaborate to measure conversion rates, which will involve sharing and analyzing data from multiple sources. 


[notification_area]: ../media/portalfx-ux-inblade-notifications/in-blade-notification.png
[recco_blades]: ../media/portalfx-ux-inblade-notifications/recco_blades.png
[notification_hub]: ../media/portalfx-ux-inblade-notifications/notification_topbar.png



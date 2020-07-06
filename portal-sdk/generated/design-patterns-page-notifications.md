<a name="guidance-and-feedback"></a>
# Guidance and feedback
Guidance and feedback are essential to make Azure easier to use and ensure users understand the results fo their actions.

<a name="guidance-and-feedback-context"></a>
## Context
Users need guidance and feedback throughout the portal so they can quickly accomplish tasks and understand the results of their actions

<a name="guidance-and-feedback-problem"></a>
## Problem

<a name="guidance-and-feedback-solution"></a>
## Solution
The portal offers several mechanisms to guide and provide feedback to users.

<a name="guidance-and-feedback-solution-also-known-as"></a>
### Also known as

* Toast notifications
* Error reporting
* In-line messaging
* Info balloon
* Tooltip

<a name="guidance-and-feedback-examples"></a>
## Examples

<a name="guidance-and-feedback-examples-example-images"></a>
### Example images

The **create a resource group** page is a good example of the various types of guidance

<div style="max-width:800px">
<img alttext="Guidance examples" src="../media/design-patterns-page-notifications/guidance.png"  />
</div>

<a name="guidance-and-feedback-examples-example-uses"></a>
### Example uses
<!-- Descriptions and ideally deep links into the portal for running examples -->

<a name="guidance-and-feedback-use-when"></a>
## Use when
<!-- Description of when to use this solution.  For example "User is creating a resource" -->
Use guidance to help the user successfully navigate and complete tasks.

Use notifications to alert users that something is wrong (a VM is stopped, a website exceeds its quota and is suspended, a certificate will expire soon, etc.), or that they may benefit from trying a new feature. Don't use these notifications just to tell users their services are running normally. 

Use global notifications sparingly and only for critical or high value alerts.

<a name="guidance-and-feedback-anatomy"></a>
## Anatomy
<!-- Image demonstrating the solution with numerical callouts to the solution components.
     Bulleted list of the callouts with explanations of each
-->

<a name="guidance-and-feedback-behavior"></a>
## Behavior
<!-- Description of overall behavior -->
<a name="guidance-and-feedback-behavior-guiding-the-user"></a>
### Guiding the user
The various ways to include guidance in your pages is to
* use concise instructional text on the page and in each section of the page  
* use **learn more** links to guide the user to more complete information in Azure documentation or marketing pages
* mark required fields so the user knows where input is necessary
* use label text that is clear and consistent for shared concepts like subscription, resource group and region
* set the **InfoBalloon** content for each field to display additional guidance.
* use button text that is specific to the action


<div style="max-width:800px">
<img alttext="Guidance examples" src="../media/design-patterns-page-notifications/guidance.png"  />
</div>

<a name="guidance-and-feedback-behavior-in-blade-notifications"></a>
### In-blade notifications

In-blade notifications come in a couple of different flavors:

<a name="guidance-and-feedback-behavior-in-blade-notifications-the-in-blade-notification-area"></a>
#### The in-blade notification area

![Notification area][notification_area]

The in-blade notification area relies on color and text to communicate severity.

- Blue band + info icon: Basic information that doesn't involve warnings, errors, or a service disruption (e.g., "The VM is stopped"). 

- Yellow band + warning icon: Warnings about potential problems that require attention (e.g., "Your website's certificate is about to expire").

- Red band + error icon: Alerts about an existing problem (e.g., "Your website's certificate has expired").

- Purple band + rocket icon: No problems to report, but we're recommending an additional feature, a separate service, or anything else that the user doesn't have (but might want). Also known as "upsell."

<a name="guidance-and-feedback-behavior-in-blade-notifications-the-recommendation-blades"></a>
#### The recommendation blades

![Recommendation blades][recco_blades]

Use the pattern shown here, and keep the following in mind:

- Use a thin blade
- Include a title and a paragraph of text in the blade whitespace
- Follow the explanation paragraph with a blue button that takes action on the notification. After the user clicks the blue action button, be sure to trigger a local notification to track progress. When the process is complete, show the success blade (on the right above) 
- If you're recommending a pricing tier upgrade, use the pricing tier comparison control shown in the middle blade

	Carry the severity color over from the previous blade (as shown on the left blade above). We do this automatically for you, so you get this for free.

<a name="guidance-and-feedback-behavior-global-notifications"></a>
### Global notifications

Global notifications show up in the notifications hub. When a user clicks the notification, it launches your resource blade and the recommendation blade.

![Notification hub][notification_hub]
 
Use a global notification when:

- Visibility is critical and you want a user to see your notification right after they log in (even if they don't open one of your blades)
- Your recommendation is low volume and high value

	To cut down on volume, avoid sending notifications for multiple instances stemming from the same underlying issue. Separate your notifications into two buckets: the most important go into the global bucket, and the less important can show up when a user opens your resource blades.

	High value notifications might prevent service disruptions, or they may result from research you've done that leads you to believe a high percentage of users will act on your recommendation. Keep in mind that we'll be measuring conversion rates and may ask partners to remove recommendations with low uptake.

If you think your notification warrants the global treatment, contact [Ibiza Fx PM](mailto:ibizafxpm@microsoft.com). We want to avoid spamming users, so the total number of global notifications will be limited. We'll want to collaborate to measure conversion rates, which will involve sharing and analyzing data from multiple sources. 

<a name="guidance-and-feedback-do"></a>
## Do
<!-- Bulleted list of reminders for best practices-->

<a name="guidance-and-feedback-don-t"></a>
## Don&#39;t
<!-- Bulleted list of things to avoid -->

<a name="guidance-and-feedback-related-design-guidelines"></a>
## Related design guidelines
<!-- Links to Related design guidelines.  Always include the link to the readme -->
* Design toolkit notification elements
	* <a href="https://www.figma.com/file/Bwn8rmUOYtnPRwA3JoQTBn/Azure-Portal-Toolkit?node-id=3388%3A393118" target="_blank">Notification toasts</a>
	* <a href="https://www.figma.com/file/Bwn8rmUOYtnPRwA3JoQTBn/Azure-Portal-Toolkit?node-id=7781%3A2" target="_blank">StatusBar</a>
	* <a href="https://www.figma.com/file/Bwn8rmUOYtnPRwA3JoQTBn/Azure-Portal-Toolkit?node-id=21266%3A356689" target="_blank">InfoBox</a>
	* <a href="https://www.figma.com/file/Bwn8rmUOYtnPRwA3JoQTBn/Azure-Portal-Toolkit?node-id=3342%3A153" target="_blank">InfoBalloon</a>

* Design guidelines [top-design.md](top-design.md)

<a name="guidance-and-feedback-research-and-usability"></a>
## Research and usability
<!-- Links to the research for the solution -->

<a name="guidance-and-feedback-telemetry"></a>
## Telemetry
<!-- Links to portal telemetry showing the solution usage -->

<a name="for-developers"></a>
# For developers
Developers can use the following information to get started implementing this pattern

<a name="for-developers-tips-and-tricks"></a>
## Tips and tricks
<!-- Bulleted list of tips and tricks for developers -->
* Each control supports an **InfoBalloonContent** setting so you do not need to use separate InfoBalloon control

<a name="for-developers-tips-and-tricks-interactive-control-and-sample-source-code"></a>
### Interactive control and sample source code
Go to the playground site to use the latest control and get source code for your project.  [Learn more about playground](./top-extensions-controls-playground.md).

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/InfoBalloon_create_Playground" target="_blank">InfoBalloon in the interactive controls playground</a>

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/InfoBox_create_Playground" target="_blank">InfoBox in the interactive controls playground</a>

<a name="for-developers-related-documentation"></a>
## Related documentation
<!-- Links to related developer docs -->
* Portal toast notifications [top-extensions-notifications.md](top-extensions-notifications.md)


[notification_area]: ../media/design-patterns-page-notifications/in-blade-notification.png
[recco_blades]: ../media/design-patterns-page-notifications/recco_blades.png
[notification_hub]: ../media/design-patterns-page-notifications/notification_topbar.png



## Pricing tiers

Azure pricing is based on two values: a **tier** and a **plan** (or size). The most common **tiers** are Basic, Standard, and Premium. **Plans** are typically represented by a number, and reflects how many features are in a plan - 1 is fairly lightweight, while 3 is feature-heavy. The tier name is paired with the plan number to form the pricing tier (e.g., B1 Basic, S1 Standard, P2 Premium, etc). Each tier is represented by a pricing "card." We automatically show 3 recommended pricing tier cards based on the user's situation.

![An example of pricing tiers][pricing_tier]

The example above shows pricing for a Web app. Things get more complex when you start designing a pricing experience for VMs, because they also include choices for stack (old vs. new) and hardware (V1 or V2), in addition to tier and size.

Use the following pattern when you create a pricing card for your extension: 

![UX pattern for pricing cards][pricing_card]

Note that card colors aren't tied to a specific tier or plan. Just make sure you use the approved brand colors.

Users haven't been super high on the pricing card model. The Azure UX team is working on some alternatives centered around a grid view. Timing on this is TBD.

[UX templates and redlines](https://microsoft.sharepoint.com/teams/azureteams/aapt/azureux/portalfx/_layouts/15/WopiFrame.aspx?sourcedoc={8f1f1bfc-903b-465f-9711-d8914214ca7c}&action=edit&wd=target%28%2F%2FDesign%20Sprints%2FPRICING.one%7Cd10c9dfb-10fc-49cc-9cf4-e4d58ba49346%2FSpec%20picker%7Cadfccd12-288f-4a54-8eab-7236ebf0625e%2F%29)

[pricing_tier]: ../media/portalfx-ux-pricing-tier/pricing_tier.JPG
[pricing_card]: ../media/portalfx-ux-pricing-tier/pricing_card.JPG

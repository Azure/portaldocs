<properties title="Create forms" pageTitle="Create forms" description="" authors="mattshel" />

<tags
    ms.service="portalfx"
    ms.workload="portalfx"
    ms.tgt_pltfrm="portalfx"
    ms.devlang="portalfx"
    ms.topic="get-started-article"
    ms.date="09/09/2015" 
    ms.author="mattshel"/> 

## Create ##

The best online buying experiences are fast, painless, and intuitive, and customers who create a new resource expect the same thing. Our Create goal is to move the user through your flow as quickly as possible, while still ending up with a resource that's functional and *usable* right away. Also remember that Create is a way to hook components and objects together (e.g., create the container, add objects, map your data, etc.) and is often ongoing, even after the resource is created. It isn't a black box, one-and-done deal. 

Don't start designing and building until you can answer these two questions:

* How much information needs to be captured during the create experience?
* Is the flow overly complex? If it is, can certain settings be pushed post-create or into an optional configuration? (hint: if default settings can be changed after the resource is created, they probably can)

### Wizards vs. single blades ###

AKA "complex create" vs. "simple," these two options for create flows take users to the same place, but in different ways. 

![Wizard create][Wizard_create] ![Single blade create][single_create]

Which one's right for you?

1. Can all of your required fields be shown at one level without overwhelming the user? **Use a single blade.**
2. Will most of your fields have defaults? **Use a single blade.**
3. Is your create flow easier to grok if it's broken down into smaller steps? **Use a wizard.**


#### Single blade example (Cloud services) ####

Cloud services uses a single blade create. They could've included lots of additional options but decided to keep the create flow streamlined and focus on getting the resource up and running. Any other lower-pri settings can still be updated after the resource is created.

![Cloud services single blade create][single_create_2]

Note that Cloud services is using the framework's **Location** and **Subscription** dropdown, but aren't using the latest design for **Resource Group**.

#### Wizard example (Virtual machines) ####

Users have a couple of choices here: complete the **Basics** and **Size** portion of the wizard and get a VM up and running quickly (saving the other settings for later), or to take the time to configure optional features (step 3).  

Each step is greyed out until the previous step is completed. Users advance by filling out each required field, and can return to completed steps any time they want to.

![Wizard create example][wizard_with_basics]

Note that Virtual machines isn't using the latest designs for **Location**, **Subscription** and **Resource group**. Users can still work through the wizard, but they're going to see some unnecessary blades until this is updated.

### Create structure ###

Here's our general guidance for how to order your single blade create options (note that **Subscription**, **Resource group**, and **Location** pickers should always be in this order): 

1.	Basics (the name of the resource)
2.	Subscription
3.	Resource group
4.	Location
5.	Any required settings that are specific to the resource
6.	Any optional settings that are specific to the resource

A wizard has some general buckets by default:

1.	Basics (this is the equivalent of the core fields on a single blade create)
2.	Pricing tier (or resource equivalent) 
3.	Settings (optional configuration)
4.	Summary (see the Summary section below)

These are just a baseline. Include additional steps when appropriate.

### Create controls you get from the framework ###

#### Dropdowns

1.	Subscription: Defaults to the last chosen subscription 
2.	Resource group: Defaults to **+ New**
3. Location: Defaults to the last chosen location

![Subscription dropdown example][subscription_dropdown]

![Location dropdown example][location_dropdown]

#### Info icon ####

Use info icons for more context. The content in the info balloon should follow our Ibiza voice and tone guidelines (email *uxvoice* for more info).

Default

![Info icon][info_icon]

Info balloon

![Info balloon][info_triggered]

#### Info box ####

Use an info box to alert users to unexpected behavior (e.g., if your create flow will take several hours to complete). Don't use this as a general info box because users can't dismiss it. 

#### Locked fields ####

Lock a field if the user is required to complete another action first (like choosing a subscription).  

![Locked fields][locked_fields]

Add a hover tip to the lock icon and explain how to unlock the field.

### Action bar + blue buttons ###

The Action bar lives on the bottom of the main create blade. It's part of the framework, and includes the **Create** button (and remember that it's always called **Create** here, never **OK** or **Select**) plus a space for errors (if needed). Other, optional features:

* **Pin to dashboard**. Pins a resource tile to the dashboard so it's easy to find. This option is disabled by default and remembers the user's preference. 
* **Pricing summary**. A link to a detailed pricing summary blade.
* **Legal terms**. A link to legalese (for example, "When you click Create, you agree to our [services terms](https://azure.microsoft.com/en-us/support/legal/services-terms-nov-2014/) and [privacy statement](https://www.microsoft.com/privacystatement/en-us/OnlineServices/Default.aspx)"). 

![The default action bar][action_bar]

Other blades in the Create flow have blue **Select** or **OK** action buttons. On click, these buttons confirm the user action, and then move them forward in the flow. If you're using a wizard, the user is moved to the next step. If you're using a single blade, the blade will close, the control that triggered the blade will update, and the Create blade will wait for the next user action.

### Required fields ###

Required fields always show a red *. If every field is required, then all fields should be marked with the red *.

![Required fields][required_field]

### Validation ###

Whenever you're designing a data entry flow, try to give the user as much in-context feedback as possible.

#### Primary validation ####

Our primary way to validate is standard data validation. It's immediate and in-context, and pops a message if the user pauses typing or leaves the field.

![Primary validation - standard web pattern][primary_validation]

![Primary validation with error - standard web pattern][primary_validation_error]

If you use standard data validation for the whole form, the user should expect the following when they click **Create**:

* Everything's been validated
* The blade will close
* A validation issue won't cause the create to fail

Any additional info the user needs would come in notifications. 

Extension authors (that's you) control when validation occurs: after a key press, or when the user tabs out of the field.

#### Secondary validation ####

Sometimes it's a good idea to validate a form when it's submitted (in addition to validating every field in real time) especially if there's a number of fields that are interrelated. For situations like this, use primary validation for each field, and then validate the entire form when the user clicks **Create**. 

The Create blade remains open while the validation runs, and will only close if validation is successful. If it fails, the blade shows an error and a prompt to correct it. The Create button is greyed out until the problem is fixed.
 
After the blade is validated, it closes. Any additional info the user needs would come in notifications.

Error text is authored by the partner team. Make sure your error text is as actionable as possible and provides a clear solution.

### Pricing ###

Pricing can show up in one of four ways during create:

* **Pricing tier**. The standard way to present your pricing. Users can compare prices for resources and services. Included with the framework.

* **In-flight pricing**. Included on the Create blade, in-flight pricing updates in real time as users move through the create flow. 
In-flight is a good choice when there are choices or configuration options that can have a dramatic impact on pricing, and you want the user to see pricing changes before creating the resource. 

* **Summary pricing**. If you're using a summary blade, consider including the final price. This gives the user chance to check their settings and review the price before committing.

* **External link**. Links out to location where users can explore  pricing in detail. Consider this option when you need space to explain additional details, or if you've already invested in tools like deployment calculators.

### Pricing tier blade ###

User want a consistent experience around pricing. The pricing tier blade is included with the framework, and handles all the backend calculations (including any discounts). Pricing is broken down into two categories: **Recommended** and **View all** (Recommended is the default).

![Recommended pricing][recommended_pricing]

Each card includes: 

* A label and name
 
* Two promotion slots at the top of the card with a name and a value (turn off one or both if you don't need them)

* Six information slots, so users can decide why they should choose one pricing tier over another

* Six additional slots for feature highlights, with a single text line or a heading and subheading 

* A final pricing estimate

If you choose not to use a promotion slot, you can use that empty slot for a feature highlight.

Grey out the pricing card if the pricing tier isn't available in the user's chosen region. 

![Pricing card][pricing_card]

![Pricing card with highlighted sections][pricing_card_highlights]

### Summary blade ###

The Summary blade is typically part of the wizard flow, and gives the user a final chance to review settings before they commit. If you need a Summary blade in the single blade create, feel free to use it (the single blade model is usually fairly simple, so a Summary blade isn't required). 

In addition to summarizing configuration settings, the blade can highlight a pricing summary. This is important if you're creating resources with more complex pricing structures, since we want to avoid pricing surprises.

### Legal ###

Legal info is the final thing a user sees before they click **Create**. Work with your legal team to create legal text or disclaimers. Show basic legal info, and then link off to full descriptions if necessary.  

### Dropdown or picker ###

Dropdowns dramatically reduce the number of blades that you need to design, your dev team needs to build, and your customers need to open. 

Only use pickers when:

* Opening a blade helps the user get through the create flow faster 
* Users need different ways to view data (for example, a toggle to switch from a list view to a map view)
* Users need to sort data
* Users need to see multiple columns of data 
* You need to use advanced filters to view data

In this example, pickers work best for App Service plans because the user needs to enter a name, location, and instance count. On the other hand, location only requires that the user know the location name (so a dropdown works best).

![Dropdowns vs. pickers][dropdowns_pickers]

### What to avoid ###

1. Don't validate the Create form when the blade opens. It will error out if you do.

2. Avoid aggressively validating fields. For example, if the user tabs into the re-enter password field, don't immediately pop the *Your passwords don't match* error message.

### Deprecated guidance/controls ###

**Creator/selector pattern**

We've deprecated this control. It caused issues in usability testing and reduced the Create success rate.

![The creator/selector pattern][creator_selector]

### Planned features ###

**Generic create new/choose existing dropdown**

The **Create new** and **Use existing** dropdowns will be available for picking resources. This will cut down on the number of required blades.

ETA: **TBD**

**Revised wizard**

An updated wizard is being developed that includes revised button configurations for the Actionbar. This will allow for a more traditional ‘next’, ‘previous’, ‘ok/create’ wizard.

ETA: **3rd QTR FY**



[Wizard_create]: ../media/portalfx-ux-create-forms/Wizard_create_2.jpg
[single_create]: ../media/portalfx-ux-create-forms/Single_blade_create.jpg 
[single_create_2]: ../media/portalfx-ux-create-forms/Single_blade_create_2.jpg
[wizard_with_basics]: ../media/portalfx-ux-create-forms/Wizard_with_basics.jpg
[subscription_dropdown]: ../media/portalfx-ux-create-forms/Subscription_dropdown.jpg
[location_dropdown]: ../media/portalfx-ux-create-forms/Location_dropdown.jpg 
[info_icon]: ../media/portalfx-ux-create-forms/Info_icon.jpg
[info_triggered]: ../media/portalfx-ux-create-forms/Info_triggered.jpg
[locked_fields]: ../media/portalfx-ux-create-forms/Locked_field.jpg
[action_bar]: ../media/portalfx-ux-create-forms/Pin_to_dash.jpg
[required_field]: ../media/portalfx-ux-create-forms/Required_field.jpg
[primary_validation]: ../media/portalfx-ux-create-forms/Primary_validation.jpg
[primary_validation_error]: ../media/portalfx-ux-create-forms/Primary_validation_error.jpg
[recommended_pricing]: ../media/portalfx-ux-create-forms/Recommended_pricing.jpg
[pricing_card]: ../media/portalfx-ux-create-forms/Pricing_card_1.jpg
[pricing_card_highlights]: ../media/portalfx-ux-create-forms/Pricing_card_2.jpg
[dropdowns_pickers]: ../media/portalfx-ux-create-forms/Pickers_and_dropdowns.jpg
[creator_selector]: ../media/portalfx-ux-create-forms/Creator_selector.jpg
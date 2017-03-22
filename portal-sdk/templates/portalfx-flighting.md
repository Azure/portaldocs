
# AB Testing in Ibiza (Flighting)

It is sometimes useful to expose new functionality to a limited set of users.  That strategy can help test the stability of the feature while limiting exposure.  It can help identify the most effective of two or more competing implementations in terms of usability and / or performance.
 
Many of these scenarios are possible in the Ibiza portal today, and most don't require any special support from the Ibiza framework.
 
This document covers two types of scenarios:
 
1. A/B testing / experimenting in production
1. Flighting pre-release bits in MPAC 
 
## A/B Testing - How the Ibiza team does it

This section explains the strategy the Ibiza team frequently uses to perform AB testing.  Your team can follow a similar strategy.
 
When we run an experiment in production, it typically goes like this:
 
1. We decide how our experiment will work.  Here's an example:
   
   a. Hypothesis: A new implementation, called 'A' will get us better performance than the existing implementation 'B' in terms of overall blade loading
   
   b. Exposure: We want 10% of users to experience implementation 'A' and 90% of users to experience implementation 'B'

   c. Stickiness: We want users to be assigned to group 'A' or 'B' on a per session basis
1. We implement our experiment like this:
   
   a. A user logs into a new session, and we use a random number to decide whether to give that user implementation 'A' or 'B'

   b. We store that decision for the duration of the session

   c. We implement performance telemetry around the user interaction that we want to speed up

   d. The telemetry has a data field which indicates the implementation the current user is assigned to
1. We analyze the data:

   a. We use Kusto to analyze the data.  
   
   b. In addition to the implementation data field we talked about in step 2.d, all telemetry events include standard information about the logged in user such as:
      1. User Puid
      1. Session Id
      1. Azure AD Tenant Id
      1. Time stamp
      1. Geo-Location information (requires a little more work)
      1. The blade the user was on (if applicable)
      1. The extension that builds the blade (if applicable)
      1. And much more
   
   c. Kusto queries are very flexible, and based on the details of the experiment we can create queries that tell us whether our experiment is successful.  We can even slice and dice on a per blade basis to know if our implementation works better on some blades, but not on others.

   For scenarios that require visibility by various levels of leadership, we also create PowerBI reports and dashboards that are fed by the kusto queries, which can be configured to run on a schedule.
 
## Other types of experiments and A / B tests

The example above talks through a performance experiment, but the same strategy can be used for user experience experiments. For example, based on the same random number and telemetry marker strategy you can:
 
1. Hide or show commands on a blade
1. Hide, show, or swap controls in the content area of a blade *
1. In general, switch your code to behave differently based on the experiment you assigned to the user.
 
* This does not apply for unlocked blades (a.k.a. blades with tiles on them).  You cannot programmatically add or remove tiles.  However, it is strongly suggested that you use the TemplateBlade pattern to implement the vast majority of blades in your extension.  That pattern does not have this restriction.  Resource overview blades are a temporary exception to this pattern.  In the coming months there will be a TemplateBlade based pattern for resource blades.
 
## Explicit Framework Support

The Ibiza framework does not provide any APIs that are specifically designed for experimentation, but all the primitives you need to run experiments are available. And as stated above, the Ibiza team uses these same primitives frequently to run our own experiments.
 
1. You have initialization code that runs when your extension loads
1. You can choose how to store assign the current user to an experiment or flight ("A" or "B").  Here are some strategies for doing this.

   a. Generate a random number to determine if a user is in a flight and store it in session storage via `sessionStorage.setItem(flight, true)`.
   
   b. Perform some hash of the user Id so that the same user always gets the same flight assignments.
   
   c. Use blade settings (durable, cross browser settings per user).
1. You have telemetry APIs that you can use to emit events that eventually make their way to Kusto 

# MPAC Flighting

## Overview

The Ibiza team uses the MPAC environment (ms.portal.azure.com) to flight pre-production versions of the portal for a period of time before the bits go to production.  Historically, that environment has always pointed to the production version of the various extensions.  It is connected to the production version of ARM and the Azure backend.

In order to let extensions achieve a similar level of pre-production validation we have enabled extension flighting in this environment.  

## Guidance

To participate, deploy your pre-production extension to a new endpoint that will permanently be designated for flighting. Then contact the Ibiza team and give us the new endpoint information.  We will do the rest.

Once configured, the MPAC portal will send 50% of all traffic to the flight endpoint.  Once a browser is assigned to a flight that flight is stored in the browser's local storage and won't change unless the user clears their storage.  Users who visit In-Private or Incognito will be assigned a new flight each time they visit MPAC.

A user will see a query string entry like 'flight=1' uf they are being served the flight versions of the extensions.  If this is not present in the URL then they will be getting MPAC portal bits with the production extensions.

The portal team has a knob that will disable flighting and force everyone to the main versions of extensions that we can use at the appropriate times (e.g. investigating issues, important deployment).

## SLA

The MPAC environment contains special UI that lets internal users report issues quickly by sending us an email.  Since we rely on these mails to identify issues that may block our release to production, we strive to investigate those issues within 24 hours during business days.  If a user is in a particular extension's blade when they send the mail then the mail also goes to the extension team.

If your extension is participating in MPAC flighting, and your pre-production bits are causing an issue then we expect your team to strive to meet that same SLA. This benefits our internal customers because they're being blocked because of pre-prod bits, and it benefits you because you will find issues before they reach production.  You will see flight=1 in the query string, which is visible in the issue mails, if the reporting user was in a flight.

Keep in mind that we direct all internal traffic to MPAC and we want to keep the quality bar as close to production as possible.

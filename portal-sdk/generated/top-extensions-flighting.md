
<a name="mpac-flighting"></a>
# MPAC Flighting

<a name="mpac-flighting-overview"></a>
## Overview

Exposing new functionality to a limited set of users can be useful. It tests the stability of the feature, and helps identify the most effective of several implementations for usability and performance. 

The Ibiza team uses the MPAC environment that is located at [https://ms.portal.azure.com](https://ms.portal.azure.com) to flight pre-production versions of an extension previous to deploying  the bits to production. Typically, the MPAC environment points to the production version of various extensions.  It is connected to the production version of ARM and the Azure servers.

If you are trying to experiment with a particular feature in production then you might want to read [top-extensions-flags.md](top-extensions-flags.md) instead of this document. This document is more about verifying the stability of your extension before exposing it to all users. There may be cases where the framework makes something difficult to flight because extensions do not have programmatic access to turn things on and off dynamically. In this case it might be ok to fall back to the MPAC flighting method to run your experiment.

To let extensions achieve a similar level of pre-production validation, Azure enables extension flighting in the MPAC environment. Many testing scenarios are possible in the Portal, and most of them do not require any special support from the Ibiza framework. There are two main scenarios for flighting.
 
1. A/B testing or experimenting in production

    A/B Testing is also known as control group/experimental group testing, where the code is divided into two different presentations, or flights, for different user groups.  For example, one set of code, called "B", might be the code that is currently in production, while the "A" code might contain the new bits that undergo  testing previous to deployment to production.   This separation of code  is most easily accomplished by having two different flights in MPAC for testing.  The users are unaware of which version they are testing at any given time.

1. Flighting pre-release bits in MPAC 

    To flight an extension, deploy it to a new endpoint that is permanently designated for flighting. Then reach out to the Ibiza team and give us information about the endpoint.  We will inform you when the extension is available in the MPAC environment from that endpoint.

    <!-- TODO: Determine how the Ibiza team is contacted in this intance - email? Pull request? Is there a sample email? -->

    After it is configured, the MPAC Portal will send 50% of all traffic to the flight endpoint.  After a browser is assigned to a flight, that flight is stored in the browser's local storage and will not be changed unless the user clears their storage.  Users who visit the site as "In-Private" or "Incognito" will be assigned a new flight each time they visit MPAC.

    When the flight version of an extension is served, the user receives a query string that includes  `flight=1`. If this value is not present in the URL, then the user is receiving MPAC portal bits that use the production version of an extension.

    The Portal team has the option to disable flighting and redirect all users to the main version of an extension.  This option is used for investigating issues, important deployment, and other items.

Flighting different versions of an extension allows developers to study the use of the following options.
 
1. Hide or show commands on a blade

1. Hide, show, or swap controls in the content area of a blade 

    **NOTE**: It is highly recommended that developers implement the majority of blades in an extension by using  the `TemplateBlade` pattern, as specified in [top-extensions-blades.md](top-extensions-blades.md).  The  `TemplateBlade`  pattern is not restricted from programmatically adding or removing content.  Resource overview blades are an exception to this pattern, as specified in [top-blades-resourcemenu.md](top-blades-resourcemenu.md). 

1. Switch the code to behave differently based on the experiment that was assigned to the user. This is based on the strategies that are specified in [#framework-support](#framework-support).
 
<a name="mpac-flighting-mpac-service-level-agreement"></a>
## MPAC Service Level Agreement

Azure directs all internal traffic to MPAC, and we want to keep the quality bar as close to production as possible. The MPAC environment contains features that allow internal users to report issues quickly by sending email to Azure teams.  Because the Ibiza team relies on these communications to identify issues that may block a release to production, we investigate those issues within 24 hours during the Pacific Time business day.  If a user is using a specific extension's blade when they send the mail, then the mail also goes to the extension team. The extension team email includes  "flight=1" in the query string, if the user that reported the issue was in a flight.

If your extension is participating in MPAC flighting, then Ibiza expects your team to meet that same Service Level Agreement. This benefits your team if pre-production bits are causing an issue because you will find issues before they reach production.

<a name="mpac-flighting-framework-support"></a>
## Framework Support

The Ibiza framework does not provide any APIs that are specifically designed for experimentation. However, all the primitives you need to run experiments are available. The Ibiza team uses these same primitives to run our own experiments. They are as follows.
 
1. Initialization code runs when the extension loads.

1. Telemetry APIs will generate events that will be stored in Kusto databases.

1. You can assign the current user to an experiment or to a specific flight ("A" or "B").  You can use the following strategies to accomplish this.

  * Generate a random number to determine if a user is in a flight and store it in session storage by using `sessionStorage.setItem(flight, true)`.

  * Compute a hash that is based on the user Id so that the same user always gets the same flight assignments.
   
  * Use per-user blade settings that are durable and persist across browser settings.

<a name="mpac-flighting-flight-test-strategy"></a>
## Flight Test Strategy

Every flight begins with a hypothesis.  For example, a hypothesis might be that a new implementation of an extension, as associated with flight 'A', has better blade loading times than the existing implementation 'B'.

The strategy for the designing, running, and analyzing the test flight is as follows.

1. Decide how to assign users to the different flights in the experiment.

    For this example, 10% of the user population will participate in the experiment by using implementation 'A'. The other 90% of users will continue to use the  existing  implementation 'B'. Users are assigned to group 'A' or 'B' on a per session basis.

1. Create the flights for the experiment.
 
    The developer may need to create a new flight group, or a new package for the flight. If so, they will specify what to include in the package flight, in addition to configuring additional package flight options.

1. After the flights are available in MPAC, implement the user assignment using the following steps.
  
   * When a user logs into a new session, a random number is used to decide whether to give that user implementation 'A' or 'B'. That  decision is stored for the duration of the session.

   * Performance telemetry is implemented around user interactions that we believe will be more performant in the new flight. The telemetry has a data field which indicates to which implementation the current user is assigned.

1. Run the test according to the user assignment to each flight. The telemetry data should be stored in Kusto for later analysis.

    **NOTE**: Remember to gather a reasonable amount of data. Too small an experiment will not deliver statistically significant results. 

1. Analyze the data that was stored in **Kusto**.

   The performance telemetry events include the implementation data field and the following standard information about the logged in user, among other data.

    * User Puid

    * Session Id

    * Azure Active Directory Tenant Id

    * Time stamp

    * Geolocation information

        This may require more work for proper analysis. 

    * The blade the user was using, if applicable

    * The extension that builds the blade, if applicable
      
    Based on the design of the experiment, we can create flexible Kusto queries that tell us whether our experiment is successful.  Analysis on a per-blade basis can reveal whether the implementation works better on some blades, but not on others.

   The Kusto queries can be configured to run on a schedule, and can be fed to **PowerBI** reports and dashboards for scenarios that require visibility by various levels of leadership.
 
<a name="mpac-flighting-glossary"></a>
## Glossary
   
This section contains a glossary of terms and acronyms that are used in this document. For common computing terms, see [https://techterms.com/](https://techterms.com/). For common acronyms, see [https://www.acronymfinder.com](https://www.acronymfinder.com).
 
| Term            | Meaning |
| --------------  | --- |
| experimentation | Releasing two slightly different versions of a new feature to  a subsection  segment of the customer base to determine which  version works better or makes the customer happier. | 
| flighting       | Similar to experimentation. The process of selecting users who will receive specific pre-production versions of an extension  by adding them to a flight group. Anyone in a flight group will receive packages that are designated for that particular group. Users  who are not in the flight group  will receive  packages that contain  the non-flighted  version of an extension. Eventually there will be only one version of the new extension, whereupon the customer base is expanded by adding flight groups or by releasing the successfully flighted bits to production.  |
| geolocation | The identification or estimation of the real-world geographic location of a device, like a mobile phone or Internet-connected computer. |
| Performance telemetry | The recording and transmission of metadata from a remote device to an Information Technologies endpoint for monitoring and analysis. |
| performant | Characterized by an excellent level of effectiveness, responsiveness, or   success. |
| Puid | presentation id |
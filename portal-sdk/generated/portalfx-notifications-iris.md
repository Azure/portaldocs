<a name="iris-notification-for-azure-portal"></a>
# Iris Notification for Azure Portal

<a name="iris-notification-for-azure-portal-table-of-contents"></a>
## Table of Contents
- [Iris Notification for Azure Portal](#iris-notification-for-azure-portal)
  - [Table of Contents](#table-of-contents)
  - [What is Iris](#what-is-iris)
  - [How does portal integrate with Iris](#how-does-portal-integrate-with-iris)
  - [Data contract for Iris notifications](#data-contract-for-iris-notifications)
    - [NotificationStatus](#notificationstatus)
    - [ToastDuration](#toastduration)
    - [NotificationButton](#notificationbutton)
  - [Notification displaying logic](#notification-displaying-logic)
  - [Iris telemetry](#iris-telemetry)
  - [Useful links, documentations and contacts](#useful-links-documentations-and-contacts)

<a name="iris-notification-for-azure-portal-what-is-iris"></a>
## What is Iris
Iris provides a platform that is used across the company to provide timely and personalized experiences to our product users. By way of its cloud services and deep integrations with end user-facing products, Iris powers campaigns across Azure, Office, Gaming, and other product spaces to drive feature engagement/awareness, subscription acquisition or renewals, and other objectives important to end user delight and Microsoft business objectives.

<a name="iris-notification-for-azure-portal-how-does-portal-integrate-with-iris"></a>
## How does portal integrate with Iris
Portal uses Iris to deliver personalized notification to specific users, subscriptions, and/or many other target conditions. The notification are pulled on portal startup and regular polling during a portal visit. In other words, portal fetches Iris content when a user firstly visit the portal, and regularly when they stay in portal. While modal and toast notifications can be delivered on portal startup, only toast notifications can be delivered in regular pollings.

 - An example of toast notification can be found [here](https://df.onecloud.azure-test.net/?SamplesExtension=true#blade/SamplesExtension/SDKMenuBlade/hubsnotifications). Click on the `Send ..` button to trigger a toast notification.
 - An example of modal notification can be found [here](https://portal.azure.com/?feature.testcontactabilitymodal=true#home), which is triggered by a feature flag to force showing the contactability modal.

<a name="iris-notification-for-azure-portal-data-contract-for-iris-notifications"></a>
## Data contract for Iris notifications
A data contract has been defined between Iris and Portal for notification content, which contains requried and optional fields.

1. Required fields:
   - title `string`: The title of the notification.
   - description: `string`: The description of the notification. Should be text/html.
   - status [`NotificationStatus`](#notificationstatus): The status of the notification that will indicate what icon the notification will show.

2. Optional fields:
   - duration [`ToastDuration`](#toastduration): To indicate whether the notification shown as modal or toast. And for toasts, the duration the notification should remain. The default value is `ToastDuration.Short`.
   - button [`NotificationButton`](#notificationbutton): At most one button is allowed in each notification. Can be used for launching a blade, or linking to a new page.
   - isControl `boolean`: For Iris experimentation only. Signals to show whether the user is in control group. If true, the notification won't be shown, but an [impression beacon](#iris-telemetry) will be sent to Iris.
   - type `string`: Type of the notification. Used to discern "special" notifications from all the others (ie. contactability, etc.).

<a name="iris-notification-for-azure-portal-data-contract-for-iris-notifications-notificationstatus"></a>
### NotificationStatus
```typescript

/**
 * The notification status.
 */
 export enum NotificationStatus {
    /**
     * An Information notification
     */
    Information = 0,

    /**
     * A Warning notification
     */
    Warning = 1,

    /**
     * An Error notification
     */
    Error = 2,

    /**
     * An InProgress notification
     */
    InProgress = 3,

    /**
     * A Success notification
     */
    Success = 4,
}

```

<a name="iris-notification-for-azure-portal-data-contract-for-iris-notifications-toastduration"></a>
### ToastDuration
```typescript

/**
 * Notification toast duration.
 */
export const enum ToastDuration {
    /**
     * Toast stays for 5 seconds.
     */
    Short = 0,

    /**
     * Toast stays for 30 seconds.
     */
    Long = 1,

    /**
     * Toast stays till the user manually dismisses it.
     */
    Sticky = 2,

    /**
     * Suppress toast notification.
     */
    Suppress = 3,

    /**
     * Modal toast notification. By default this option won't be allowed unless white listed.
     * If you need to onboard a modal notification, please contact the Portal team.
     */
    Modal = 4,
}

```

<a name="iris-notification-for-azure-portal-data-contract-for-iris-notifications-notificationbutton"></a>
### NotificationButton
``` TypeScript
interface NotificationButton {
    /**
     * Button label (should be localized).
     */
    label: string;

    /**
     * Optional button id  which will be logged in telemetry (non localized string).
     */
    id?: string;

    /**
     * Arguments for an "openBlade" action (opens a portal blade).
     */
    openBlade?: {
        /**
         * The blade name.
         */
        blade: string;

        /**
         * The extension name.
         */
        extension: string;

        /**
         * The inputs to the blade. Defaults to an empty object.
         */
        parameters?: any;

        /**
         * Defines whether the blade should be launched in a context pane. Defaults to false.
         */
        openInContextPane?: boolean;
    };

    /**
     * Arguments for an "externalLink" action (launches an external link). This will open the link with a new tab.
     */
    externalLink?: {
        /**
         * The URI to launch.
         */
        uri: string;
    };

    /**
     * Arguments for an "deepLink" action (launches a deep link). This will open the link within the same tab.
     */
    deepLink?: {
        /**
         * The URI to launch.
         */
        uri: string;
    };
}
```

<a name="iris-notification-for-azure-portal-notification-displaying-logic"></a>
## Notification displaying logic

1. At most one modal can be displayed on a portal visit. Unless the user refreshes the page, they won't be able to see a second modal.

2. A modal can only be displayed on portal startup, while toasts can be displayed anytime.

3. Deeplinking to a page won't trigger a modal to display. That means even if portal receives modal content from Iris for a particular user who visits portal from a deep link, the modal still wouldn't be displayed.

4. Modals have priority on which to show when mutiple ones are triggered, while toast notifications have the lowest priority than all the modals. Current Iris-onboarded models are `contactability` and `advisor`. Besides these two, there are other models triggered by non-Iris signals that may have higher priority, which will be displayed instead if signal received. Click [here](https://microsoft.sharepoint.com/teams/azureteams/aapt/azureux/portalfx/_layouts/15/Doc.aspx?sourcedoc={c57ed3dc-3b5c-4c1d-8633-d64b0b6c79cb}&action=edit&wd=target%28Hubs%2FNotifications.one%7C975dc327-f8f3-49b2-b4f4-7b135e6beeac%2FStartup%20Modals%20Priority%20Flow%20%282020%5C%29%7C7e0356b5-7d50-4f0a-bc69-fda39773a7bb%2F%29&wdorigin=703) for a full list of modals and priority flow.

5. The number of Iris notifications displayed everytime is capped by the feature flag `feature.irismessagelimit`. This number only applies to Iris-triggered notifications.

<a name="iris-notification-for-azure-portal-iris-telemetry"></a>
## Iris telemetry
There are two types of [iris telemetry](https://www.osgwiki.com/wiki/Iris_Insights_Beacons): [action](https://www.osgwiki.com/wiki/Iris_Glossary#Action) and [impression](https://www.osgwiki.com/wiki/Iris_Glossary#Impression). Action beacons are like portal client telemetry where they track user interactions such as clicks of CTA (call to action) and clicks of dismiss button. Impression is a signal to let Iris know that portal has already displayed the content to the user, so that the same content won't be displayed again within a period of time for the same user. Implementation details on how iris telemetry is integrated with portal can be found [here](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=/src/SDK/Website/TypeScript/MsPortalImpl/Notifications/PortalNotifications.ts&version=GBdev&line=327&lineEnd=327&lineStartColumn=13&lineEndColumn=42&lineStyle=plain&_a=contents).

<a name="iris-notification-for-azure-portal-useful-links-documentations-and-contacts"></a>
## Useful links, documentations and contacts
- To onboarding to Iris, please contact [Karin Mepani](mailto:karin.mepani@microsoft.com).
- Documentation related to Iris
	- General: https://osgwiki.com/wiki/Category:Iris
	- Iris Glossary: https://www.osgwiki.com/wiki/Iris_Glossary
	- Iris Beacons: https://osgwiki.com/wiki/Iris_Insights_Beacons
	- List of Iris surfaces: https://www.osgwiki.com/wiki/List_of_Iris_surfaces
- Other useful links
    - Iris support: https://irissupportdesk.zendesk.com/hc/en-us/requests
    - Iris studio for campaign management: https://portal.cpm.microsoft.com/

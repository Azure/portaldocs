{"gitdown": "contents"}

## Notifications

The Notifications menu aggregates informational messages, warnings, and errors across all portal extensions and cloud-connected services via local, client notifications and global, server events from the Event service.

![Notifications help project status and progress][notification]

### What is a notification?

A notification is a **short, informative message** letting the user know about, and ideally take action on, an event that has occurred (or may occur) in the system. Notifications must be **useful and relevant**.

**Server events** are maintained by the public Event service. The Event service tracks all service events, which may be aggregated into larger operations, which are then visualized as notifications within the portal. The Notifications hub automatically surfaces notifications for all critical, error, and completed deployment events.

**Client notifications** are only available in the current browser session. When the browser is refreshed, local, client notifications will be lost. Always prefer server events.


### How and when to use notifications

#### Is a notification appropriate?

Avoid raising notifications people don't care about and don't use notifications too often. Avoid using multiple notifications when a single notification will suffice.

#### Always use server events for back-end events

Always use server events for non-read operations and any events that originate in a back-end system.

Always prefer global, server events by integrating with the Event service. Only use local, client notifications if the error originates on the client and doesn't apply to other users. Every event originating from a back-end system should be processed as a server event. This will ensure they are available to additional users and across browser sessions. _Local, client notifications are only visible in the current session._ When the browser is refreshed, all client notifications will be lost.

#### Always save server events for asset changes

Server events are used to track asset history. Even if a change is deemed as unimportant, at least raise a low-priority Info event to track it appropriately.


#### Use correct status

Always use the correct status for your notifications. Use the following lists as a guide.

* **InProgress** - Long-running operation has started or is executing (e.g. creating new resources or changing state)
* **Info** - Successful or non-critical update (e.g. state change) that doesn't require action (e.g. stopped a website)
* **Advisory** - (**Coming soon!**) Informational/potential warning, issue under investigation, or a change that should have no impact (e.g. upcoming data migration or outage investigation)
* **Warning** - Potential problem or issue that might require attention and/or could result in a more critical error (e.g. certificate about to expire)
* **Error** - Problem or condition that should be investigated (e.g. data loss)
* **Critical** - (**Coming soon!**) Urgent problem/condition that needs immediate action/attention (e.g. VM crashed)

> [WACOM.NOTE] This table depicts the notification status values we are moving towards. **Advisory** and **Critical** are coming, but not yet supported today. Please do not use **Success**, which will be deprecated moving forward. Use **Info** instead.


#### Use in-progress notifications for long-running operations

If an operation requires calling a server-side API or may take more than 2 seconds, use an in-progress notification to track it. Most long-running operations can do the following:

1. Create an in-progress local, client notification before calling the back-end server
2. Initiate the server operation, which should create an in-progress server event
3. Save the correlation id (from the Event service) to the client notification to avoid duplicate notifications
4. Poll for status updates and update the client notification as appropriate

> [WACOM.NOTE] If warnings or errors occur during the execution of the long-running operation, but don't affect the outcome, publish separate server events (and optionally client notifications) to track those issues.

5. When the operation is complete, update the title and description, and re-publish the client notification
6. Finalize the operation with necessary UI processing

Following the aforementioned steps will ensure the UI is as responsive as possible.

> [WACOM.NOTE] Server events may take up to 1.5 minutes to display in the portal. **Using both server events and client notifications is critical to ensuring UI responsiveness.**


#### Be specific

Be as specific as possible and follow the voice and tone guidelines when defining notifications. Notifications are referenced out of context (e.g. within the hub and not the asset blade) and generic messages may not make sense.


#### Never create dead ends

Associate notifications with assets and ensure there is a clear next-action. When a notification is clicked, the related asset is opened. If a notification does not have an asset, it is essentially a useless dead-end. _Do not create dead-end notifications!_



### Defining your notifications

**NOTE:** **Using legacy notifications?** The below API was introduced in SDK 5.0. If you're using one of the older, PDL-based Notifications APIs, use the [Notifications v3 upgrade guide](portalfx-notifications-upgrade.md) to convert your code.

#### One-time notification

For simple, one-time notifications that aren't part of a long-running operation and don't result in server events, simply publish a notification with the title, description, status, and linked asset. When the notification is clicked, the associated asset will be opened.

To link a notification to an asset, specify the asset details: 

```ts
MsPortalFx.Hubs.Notifications.ClientNotification.publish({
    title: resx.myEvent.title,
    description: resx.myEvent.description,
    status: MsPortalFx.Hubs.Notifications.NotificationStatus.Information,
    asset: {
        extensionName: ExtensionDefinition.definitionName,
        assetType: ExtensionDefinition.AssetTypes.MyAsset.name,
        assetId: assetId
    }
});
```

To link a notification to a blade directly, specify the blade details: 

```ts
MsPortalFx.Hubs.Notifications.ClientNotification.publish({
    title: resx.myEvent.title,
    description: resx.myEvent.description,
    status: MsPortalFx.Hubs.Notifications.NotificationStatus.Information,
    linkedBlade: {
        extension: "ExtensionName",
        detailBlade: "BladeName",
        detailBladeInputs: {
            bladeInputProperty1: "bladeInput1"
        }
    }
});
```

Or you can link a notification to a deeplink by specify the deeplink URI: 

```ts
MsPortalFx.Hubs.Notifications.ClientNotification.publish({
    title: resx.myEvent.title,
    description: resx.myEvent.description,
    status: MsPortalFx.Hubs.Notifications.NotificationStatus.Information,
    uri: "#asset/HubsExtension/ResourceGroups/subscriptions/12345689-dg32-4554-9a9a-b6e983273e5f/resourceGroups/Default"
});
```

#### Suppressing server events

When a client notification is associated with a back-end server event, add the correlation id from the Event service. By specifying the correlation id, the portal will suppress any server events to ensure duplicate notifications aren't published.

> [WACOM.NOTE] Azure Resource Manager (ARM) automatically publishes server events for every operation. If your extension initiates ARM operations, extract the Event service correlation id from the `x-ms-correlation-request-id` response header.

As discussed above, to ensure UI responsiveness when initiating long-running operations, you'll create a new client notification, start your operation, and then update the notification accordingly.

```ts
// publish an in-progress server event
var n = new MsPortalFx.Hubs.Notifications.ClientNotification({
    title: resx.myEvent.title,
    description: resx.myEvent.description,
    status: MsPortalFx.Hubs.Notifications.NotificationStatus.InProgress,
    asset: {
        extensionName: ExtensionDefinition.definitionName,
        assetType: ExtensionDefinition.AssetTypes.MyAsset.name,
        assetId: assetId
    }
});
n.publish();

// start server event
...

// save correlation id from ARM response and re-publish
n.correlationIds.push(xhr.getResponseHeader("x-ms-correlation-request-id"));
n.publish();

...

// update the notification
n.percentComplete = 25;  // .1 == .1%, 10 == 10%
n.publish();

...

// finish processing
n.percentComplete = 100;
n.status = MsPortalFx.Hubs.Notifications.NotificationStatus.Information;
n.publish();
```


#### Open a different asset for one message

If you need to open a different blade for a specific message, simply change the associated asset before re-publishing the notification.


#### Open a different blade

If you need to open a different blade (e.g. based on asset metadata or from another extension), use dynamic blade selection on the associated asset type.

[notification]: ../media/portalfx-notifications/notifications.png

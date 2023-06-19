
<a name="upgrading-to-the-latest-notifications-api"></a>
# Upgrading to the latest Notifications API

Notifications v4 simplifies your code by removing the need to pre-define notifications in PDL. You'll copy strings from PDL and switch to the new `publishNotification` function call.

<a name="upgrading-to-the-latest-notifications-api-upgrading-from-notifications-v1-pre-4-6"></a>
## Upgrading from Notifications v1 (pre-4.6)

Moving from Notifications v1 to v4 involves switching from the `NotificationDefinition` element in PDL and the `Notification` class in TypeScript to the `publishNotification` function call.

1. Search for ".Notification(" in TypeScript

    ```ts
    var notification = new MsPortalFx.UI.NotificationManager.Notification(
            "eventSource",
            "eventType",
            MsPortalFx.UI.NotificationManager.NotificationState.InProgress,
            [formatArg0, formatArg1],
            subscriptionId,
            operationId,
            percentComplete,
            assetId);
    MsPortalFx.UI.NotificationManager.addNotification(notification);
    ```

2. Search for `NotificationDefinition` in PDL

    ```xml
    <NotificationDefinition
        EventSource="eventSource"
        EventType="eventType"
        Label="{Resource myEventLabel, Module=MyExtension/MyClientStrings}"
        Message="{Resource myEventMessage, Module=MyExtension/MyClientStrings}" />
    ```

3. Replace `Notification` with `publishNotification` or `publishPendingNotification` if you need to update the notification (pending notification).

    Copy the label and message text from PDL and use the following list to determine what to do with each `Notification` constructor parameter:

    - `source` -- Delete it; no longer needed :)
    - `eventType` -- Again, delete it
    - `state` -- Use the `status` property
    - `descriptionArgs` -- Format the `description` property as needed
    - `subscriptionId` -- Delete it; no longer needed
    - `operationId` -- Replace with server event correlation ids; add to the `correlationIds` array
    - `percentOperationComplete` -- Use the `percentComplete` property
    - `assetId` -- Use the `asset` property

    The new code should look something like this:

    ```ts
    import { CompletedStatus, publishNotification } from "Fx/Notification";
    var notification = publishNotification({
        description: clientStrings.myEventMessage.format(formatArg0, formatArg1),
        status: CompletedStatus.Information,
        linkTo: `#asset/${ExtensionDefinition.definitionName}/${ExtensionDefinition.AssetTypes.MyAsset.name}/${assetId}`,
    });
    // notification will contain an "id" property, which can be used tracking, debugging, etc..
    ```

    For a notification that can be updated beyond the first publication, use the `publishPendingNotification` function call instead.

    ```ts
    import { CompletedStatus, publishPendingNotification } from "Fx/Notification";
    var notification = publishPendingNotification({
        title: clientStrings.myEventLabel,
        description: clientStrings.myEventMessage.format(formatArg0, formatArg1),
        percentComplete: percentComplete,
        linkTo: `#asset/${ExtensionDefinition.definitionName}/${ExtensionDefinition.AssetTypes.MyAsset.name}/${assetId}`,
    });

    // To update the notification, use the "update" method available on the returned notification object. "title", "description", "percentComplete", and "linkTo" can all be updated here.
    notification.update({
            percentComplete: percentComplete,
    });

    // To update the notification for the last time, use the "complete" method available on the returned notification object, where you can define your choice of status. "title", "description", "percentComplete", and "linkTo" can all be updated here.
    notification.update({
            status: CompletedStatus.Success,
    });
    ```

<a name="upgrading-to-the-latest-notifications-api-upgrading-from-notifications-v2-4-6-14"></a>
## Upgrading from Notifications v2 (4.6-14)

Similar to the v1 migration, moving from v2 involves switching from the `Notification` element in PDL and the `NotificationManager.create()` function in TypeScript to the `publishNotification` function call.

1. Search for "NotificationManager.create(" in TypeScript

    ```ts
    var myNotification = ExtensionDefinition.NotificationDefinitions.MyNotification;
    var formatArgs = { name: "MyAssetName" };
    var notification = new MsPortalFx.UI.NotificationManager.create(myNotification.name);
    notification.raise(myNotification.starting, assetId, formatArgs);
    // execute server-side operation and get server event correlation id
    notification.updateCorrelationId(correlationId);
    notification.raise(myNotification.succeeded, assetId, formatArgs);
    ```

2. Search for `Notification` in PDL

    ```xml
    <Notification Name="MyNotification" AssetType="MyAsset">
        <Notification.ServerEvent>
        <NotificationServerEventMapping
            Source="Resource.Provider"
            Operation="Resource.Provider/types"/>
        </Notification.ServerEvent>

        <InProgressMessage
            Status="started"
            Title="{Resource MyNotification.Started.title, Module=MyExtension/MyClientStrings}"
            Message="{Resource MyNotification.Started.message, Module=MyExtension/MyClientStrings}"/>
        <ErrorMessage
            Status="failed"
            Title="{Resource MyNotification.Failed.title, Module=MyExtension/MyClientStrings}"
            Message="{Resource MyNotification.Failed.title, Module=MyExtension/MyClientStrings}"/>
        <InfoMessage
            Status="succeeded"
            Title="{Resource MyNotification.Succeeded.title, Module=MyExtension/MyClientStrings}"
            Message="{Resource MyNotification.Succeeded.title, Module=MyExtension/MyClientStrings}"/>
    </Notification>
    ```

3. Replace `NotificationManager.create()` with `publishNotification` or `publishPendingNotification` if you need to update the notification (pending notification).

    Start by copying the title and message text from PDL:

    ```ts
    import { publishNotification } from "Fx/Notification";
    var formatArgs = { name: "MyAssetName" };
    var notification = publishNotification({
        title: MyNotification.Started.title,
        description: MyNotification.Started.message
    });
    ```

    Next, look up the status and substatus used in the `raise()` function from PDL and add that to the constructor:

    ```ts
    import { CompletedStatus, publishNotification } from "Fx/Notification";
    var formatArgs = { name: "MyAssetName" };
    var notification = publishNotification({
        title: MyNotification.Started.title,
        description: MyNotification.Started.message,
        status: CompletedStatus.Information
    });
    ```

    For a notification that can be updated beyond the first publication, use the `publishPendingNotification` function call instead, where a status of InProgress is implied.

    ```ts
    import { publishPendingNotification } from "Fx/Notification";
    var formatArgs = { name: "MyAssetName" };
    var notification = publishPendingNotification({
        title: MyNotification.Started.title,
        description: MyNotification.Started.message,
    });
    ```

    Specify the asset id in the constructor using the `AssetTriplet` interface:

    ```ts
    import { CompletedStatus, publishNotification } from "Fx/Notification";
    var formatArgs = { name: "MyAssetName" };
    var notification = publishNotification({
        title: MyNotification.Started.title,
        description: MyNotification.Started.message,
        status: CompletedStatus.Information,
        linkTo: `#asset/${ExtensionDefinition.definitionName}/${ExtensionDefinition.AssetTypes.MyAsset.name}/${assetId}`,
    });
    ```

    For a notification that can be updated beyond the first publication, use the `publishPendingNotification` function call instead, where a status of InProgress is implied.

    ```ts
    import { publishPendingNotification } from "Fx/Notification";
    var formatArgs = { name: "MyAssetName" };
    var notification = publishPendingNotification({
        title: MyNotification.Started.title,
        description: MyNotification.Started.message,
        linkTo: `#asset/${ExtensionDefinition.definitionName}/${ExtensionDefinition.AssetTypes.MyAsset.name}/${assetId}`,
    });
    ```

    Format the title and/or description as desired:

    ```ts
    import { CompletedStatus, publishNotification } from "Fx/Notification";
    var formatArgs = { name: "MyAssetName" };
    var notification = publishNotification({
        title: MyNotification.Started.title.format(formatArgs),
        description: MyNotification.Started.message.format(formatArgs),
        status: CompletedStatus.Success,
        linkTo: `#asset/${ExtensionDefinition.definitionName}/${ExtensionDefinition.AssetTypes.MyAsset.name}/${assetId}`,
    });
    ```

    For a notification that can be updated beyond the first publication, use the `publishPendingNotification` function call instead, where a status of InProgress is implied.

    ```ts
    import { publishPendingNotification } from "Fx/Notification";
    var formatArgs = { name: "MyAssetName" };
    var notification = publishPendingNotification({
        title: MyNotification.Started.title.format(formatArgs),
        description: MyNotification.Started.message.format(formatArgs),
        linkTo: `#asset/${ExtensionDefinition.definitionName}/${ExtensionDefinition.AssetTypes.MyAsset.name}/${assetId}`,
    });
    ```

    The act of calling this function is the equivalent of what calling `raise()` had done. For any of the former update calls `updateCorrelationId()` and `reportProgress()` make sure to have used the `publishPendingNotification` function call as this returns a notification object containing an update and a complete method call. You can update those properties using update to update the properties as many times as you need, and complete for your final update, where a finished status can be assigned:

    ```ts
    import { CompletedStatus, publishPendingNotification } from "Fx/Notification";
    // correlationIds have been replaced with a single id property, which is returned in the notification object from the "publishNotification" and "publishPendingNotification" calls.
    notification.update({
        percentComplete: 52,
    });
    notification.update({
        percentComplete: 78,
    });
    notification.complete({
        status: CompletedStatus.Warning,
    });
    ```

<a name="upgrading-to-the-latest-notifications-api-upgrading-from-notifications-v3-4-6-14"></a>
## Upgrading from Notifications v3 (4.6-14)

Moving from v3 is the most straightforward as most of the properties remain the same, and involves switching from the `ClientNotification` class in TypeScript to the `publishNotification` or `publishPendingNotification` function calls.

For a simple one time notification, use `publishNotification`:

1. Search for "ClientNotification" in TypeScript

    ```ts
    // If you're setting a status other than "MsPortalFx.Hubs.Notifications.NotificationStatus.InProgress" then use "publishNotification"
    var notification = new MsPortalFx.Hubs.Notifications.ClientNotification({
        title: clientStrings.myEventLabel,
        description: clientStrings.myEventMessage.format(formatArg0, formatArg1),
        status: MsPortalFx.Hubs.Notifications.NotificationStatus.Error,
        asset: {
            extensionName: ExtensionDefinition.definitionName,
            assetType: ExtensionDefinition.AssetTypes.MyAsset.name,
            assetId: assetId
        }
    });
    notification.publish();
    ```

    Change `new MsPortalFx.Hubs.Notifications.ClientNotification` to `publishNotification`. Change `MsPortalFx.Hubs.Notifications.NotificationStatus` to the shorter `CompletedStatus` status type. Notice how your asset definition is a simple deeplink by the name of `linkTo`.

    The act of calling `publishNotification` also performs the previous `publish` call that came after creation. The new api combines it all into one simple step.

    ```ts
    import { CompletedStatus, publishNotification } from "Fx/Notification";
    var notification = publishNotification({
        title: clientStrings.myEventLabel,
        description: clientStrings.myEventMessage.format(formatArg0, formatArg1),
        status: CompletedStatus.Error,
        linkTo: `#asset/${ExtensionDefinition.definitionName}/${ExtensionDefinition.AssetTypes.MyAsset.name}/${assetId}`,
    });
    ```

    For the cases where you need to update the notification one or more times, you will likely have used an InProgress status, or perhaps the percentComplete property. See example below.

    ```ts
    // If you're setting a status of "MsPortalFx.Hubs.Notifications.NotificationStatus.InProgress" then use "publishPendingNotification"
    var notification = new MsPortalFx.Hubs.Notifications.ClientNotification({
        title: clientStrings.myEventLabel,
        description: clientStrings.myEventMessage.format(formatArg0, formatArg1),
        status: MsPortalFx.Hubs.Notifications.NotificationStatus.InProgress,
        percentComplete: percentComplete,
        asset: {
            extensionName: ExtensionDefinition.definitionName,
            assetType: ExtensionDefinition.AssetTypes.MyAsset.name,
            assetId: assetId
        }
    });
    notification.publish();
    // execute server-side operation and get server event correlation id
    notification.correlationIds.push(correlationId);
    notification.publish();
    ```

    Change `new MsPortalFx.Hubs.Notifications.ClientNotification` with `publishPendingNotification` much like the non-pending version had. No need to include a status here as InPreogress is implied. Set the percentComplete if you need it, and change your asset definition into the simple deeplink string.

    ```ts
    import { CompletedStatus, publishPendingNotification } from "Fx/Notification";
    var notification = publishPendingNotification({
        title: clientStrings.myEventLabel,
        description: clientStrings.myEventMessage.format(formatArg0, formatArg1),
        percentComplete: percentComplete,
        linkTo: `#asset/${ExtensionDefinition.definitionName}/${ExtensionDefinition.AssetTypes.MyAsset.name}/${assetId}`,
    });
    ```

    To update the notification, you can use the `update` method returned on the notification object from the `publishPendingNotification` call.

    ```ts
    notification.update({
        percentComplete: percentComplete + 10,
    });
    notification.update({
        percentComplete: percentComplete + 20,
    });
    notification.update({
        percentComplete: percentComplete + 10,
    });
    ```

    When you're ready to make your ready to make your final update, use the `complete` method returned on the notification object from the `publishPendingNotification` call.

    ```ts
    notification.complete({
        status: CompletedStatus.Success,
    });
    ```

    Note how the additional `notification.publish();` calls were no longer necessary. `update` and `complete` combine both the property update and `publish` in one step instead of two.


<a name="upgrading-to-the-latest-notifications-api-now-clean-up"></a>
## Now, clean up :)

After upgrading to the new `publishNotification` or `publishPendingNotification` API calls, you can delete all your `NotificationDefinition` and `Notification` code in PDL or `ClientNotification` code in your client-side.

That's it. You're done. Time to build and revel in your done-ness :)


Next Steps: [Notifications](portalfx-notifications.md)

For more in-depth information on the newest notification apis, see:

[Knockout](https://eng.ms/docs/products/azure-portal-framework-ibizafx/development/notifications/notifications-api)

[ReactView](https://eng.ms/docs/products/azure-portal-framework-ibizafx/development/notifications/notifications-reactviews-api)

[notification]: ../media/portalfx-notifications/notifications.png

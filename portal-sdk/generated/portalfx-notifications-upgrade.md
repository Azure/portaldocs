
<a name="upgrading-to-the-latest-notifications-api"></a>
# Upgrading to the latest Notifications API

Notifications v3 simplifies your code by removing the need to pre-define notifications in PDL. You'll copy strings from PDL and switch to the new `ClientNotification` class.

<a name="upgrading-to-the-latest-notifications-api-upgrading-from-notifications-v1-pre-4-6"></a>
## Upgrading from Notifications v1 (pre-4.6)

Moving from Notifications v1 to v3 involves switching from the `NotificationDefinition` element in PDL and the `Notification` class in TypeScript to the `ClientNotification` class.

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

3. Replace `Notification` with `ClientNotification`

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


<a name="upgrading-to-the-latest-notifications-api-upgrading-from-notifications-v2-4-6-14"></a>
## Upgrading from Notifications v2 (4.6-14)

Similar to the v1 migration, moving from v2 involves switching from the `Notification` element in PDL and the `NotificationManager.create()` function in TypeScript to the `ClientNotification` class.

1. Search for "NotificationManager.create(" in TypeScript

   ```ts
   var myNotification = ExtensionDefinition.NotificationDefinitions.MyNotification,
       formatArgs = { name: "MyAssetName" },
       notification = new MsPortalFx.UI.NotificationManager.create(myNotification.name);
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

3. Replace `NotificationManager.create()` with `ClientNotification`

   Start by copying the title and message text from PDL:

   ```ts
   var formatArgs = { name: "MyAssetName" },
       notification = new MsPortalFx.Hubs.Notifications.ClientNotification({
           title: MyNotification.Started.title,
           description: MyNotification.Started.message
       }});
   ```

   Next, look up the status and substatus used in the `raise()` function from PDL and add that to the constructor:

   ```ts
   var formatArgs = { name: "MyAssetName" },
       notification = new MsPortalFx.Hubs.Notifications.ClientNotification({
           title: MyNotification.Started.title,
           description: MyNotification.Started.message,
           status: MsPortalFx.Hubs.Notifications.NotificationStatus.InProgress
       }});
   ```

   Specify the asset id in the constructor using the `AssetTriplet` interface:

   ```ts
   var formatArgs = { name: "MyAssetName" },
       notification = new MsPortalFx.Hubs.Notifications.ClientNotification({
           title: MyNotification.Started.title,
           description: MyNotification.Started.message,
           status: MsPortalFx.Hubs.Notifications.NotificationStatus.InProgress,
           asset: {
               extensionName: ExtensionDefinition.definitionName,
               assetType: ExtensionDefinition.AssetTypes.MyAsset.name,
               assetId: assetId
           }
       });
   ```

   Format the title and/or description as desired:

   ```ts
   var formatArgs = { name: "MyAssetName" },
       notification = new MsPortalFx.Hubs.Notifications.ClientNotification({
           title: MyNotification.Started.title.format(formatArgs),
           description: MyNotification.Started.message.format(formatArgs),
           status: MsPortalFx.Hubs.Notifications.NotificationStatus.InProgress,
           asset: {
               extensionName: ExtensionDefinition.definitionName,
               assetType: ExtensionDefinition.AssetTypes.MyAsset.name,
               assetId: assetId
           }
       });
   ```

   Now that all parameters have been moved, you can replace the `raise()` function with the `publish()` function:

   ```ts
   notification.publish();
   ```

   Replace `updateCorrelationId()` and `reportProgress()` with the `correlationIds` array and `percentComplete` property:

   ```ts
   // execute server-side operation and get server event correlation id
   notification.correlationIds.push(correlationId);
   notification.status = MsPortalFx.Hubs.Notifications.NotificationStatus.Information;
   notification.publish();
   ```


<a name="upgrading-to-the-latest-notifications-api-now-clean-up"></a>
## Now, clean up :)

After upgrading to the new `ClientNotification` API, you can delete all your `NotificationDefinition` and `Notification` code in PDL.

That's it. You're done. Time to build and revel in your done-ness :)


Next Steps: [Notifications](portalfx-notifications.md)

[notification]: ../media/portalfx-notifications/notifications.png

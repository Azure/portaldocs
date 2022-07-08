<a name="iris-notifications"></a>
## Iris Notifications

<a name="iris-notifications-what-is-iris"></a>
### What is Iris?
Iris is how Microsoft delivers personalized, optimized experiences for customer engagement—in our products and through emails, SMS messages, and notifications. For more details please refer to the [official Iris wiki](https://www.osgwiki.com/wiki/Category:Iris).

<a name="iris-notifications-how-to-use-the-iris-api-for-extensions"></a>
### How to use the Iris API for extensions?
<a name="iris-notifications-how-to-use-the-iris-api-for-extensions-import-the-apis"></a>
#### Import the APIs
1. Knockout based blades
```typescript

import { getIrisContent, sendIrisSignal } from "Fx/Notifications/IrisNotifications";

```

2. React view blades
```typescript

import { getIrisContent, sendIrisSignal, IrisContent } from "@microsoft/azureportal-reactview/Notification";

```

<a name="iris-notifications-how-to-use-the-iris-api-for-extensions-fetch-content-from-iris"></a>
#### Fetch content from Iris
```typescript

// Fetch Iris content from a list of placements
const irisContent = await getIrisContent({
    placements: [
        {
            placementId: "88000329",   // The placement id that links to a particular Iris surface.
            messageLimit: 2,           // Max number of messages to fetch. Result could be less than or equal to the message limit.
        },
    ],
});
this.contentMessage("");
this.errorMessage("");

const placementContent = irisContent["88000329"]; // Get the placement/surface content.

// A placement could have no content, or other errors.
if (placementContent.errors?.length) {
    const placementErrors = placementContent.errors;
    let errorMessage = "";
    placementErrors.forEach(error => {
        if (error.code === 2040 && error.msg?.includes("No eligible content")) {
            errorMessage += "no eligible content at this moment \n";
        } else {
            errorMessage += `${error.msg} \n`;
        }
    });
    this.errorMessage(errorMessage);
}

// Consume the content
if (placementContent.items?.length) {
    // Process placement items (length is up to the message limit)
    const placementItems = placementContent.items;
    let contentMessage = "";
    placementItems.forEach(item => {
        const itemContent: MyNotification = item.ad;  // The 'ad' property contains the pre-defined data contract content for the surface.
        contentMessage += `Title: ${itemContent.properties.title}. Description: ${itemContent.properties.description} \n`;
    });
    this.contentMessage(contentMessage);

    //iris#signal
    // Send action signals (e.g. notify Iris that the message has been received, customer interactions like button clicks).
    sendIrisSignal({ message: placementItems[0], action: "notificationReceived" });

    // Send impression signal for the 1st message (i.e. this item has been displayed/activated for the customer).
    sendIrisSignal({ message: placementItems[0] });
    //iris#signal
}

```

<a name="iris-notifications-how-to-use-the-iris-api-for-extensions-send-signals-to-iris"></a>
#### Send signals to Iris
Iris has its own data analysis and experimentation platform for analyzing experience engagement and experimentation results. To make use of that, impession/action signals should be sent for telemetry collection and data reports would be available after enough samples collected.

```typescript

// Send action signals (e.g. notify Iris that the message has been received, customer interactions like button clicks).
sendIrisSignal({ message: placementItems[0], action: "notificationReceived" });

// Send impression signal for the 1st message (i.e. this item has been displayed/activated for the customer).
sendIrisSignal({ message: placementItems[0] });

```

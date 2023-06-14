The `messages` section defines the message in views. Only one message is displayed, the first message item which visible is 'true'.

Messages allows you to display a message in response to resource's state. There are four types of messages: Info, Success, Warning, Error. Only displaying first message which visible is 'true'. It also support uri, blade, resourceId for onClick action.

Since visible is optional, if not specified, it will be treated as true.

Given this example below, if VM is running, the second message item will be displayed, even though third message is also true. We only want to display the first true message item.
If VM is deallocated, first message item will be displayed.
If VM is neither deallocated or running, last message item will be displayed.

```json
"messages": [
      {
        "kind": "error",
        "message": "vm is deallocated",
        "visible": "[equals(resources('vmInstanceView').properties.instanceView.statuses.1.code, 'PowerState/deallocated')]",
        "action": {
          "resourceId": "/subscriptions/415b6834-1801-4f6e-a285-f646ec13fe34/resourceGroups/AzureMobileTest/providers/Microsoft.Network/virtualNetworks/AzureMobileTest-vnet"
        }
      },
      {
        "kind": "success",
        "message": "vm is running1",
        "visible": "[equals(resources('vmInstanceView').properties.instanceView.statuses.1.code, 'PowerState/running')]",
        "action": {
          "blade":
                 {
                   "name": "AzureMonitoringBrowseBlade",
                   "extension": "Microsoft_Azure_Monitoring",
                   "parameters": {
                     "resId": "[resources().id]"
                   },
                   "inContextPane": true
                 }
        }
      },
      {
        "kind": "success",
        "message": "vm is running2",
        "visible": "[equals(resources('vmInstanceView').properties.instanceView.statuses.1.code, 'PowerState/running')]",
        "action": {
          "blade":
                 {
                   "name": "AzureMonitoringBrowseBlade",
                   "extension": "Microsoft_Azure_Monitoring",
                   "parameters": {
                     "resId": "[resources().id]"
                   }
                 }
        }
      },
      {
        "kind": "info",
        "message": "Welcome to our extension! please take a look at our tutorial",
        "action": {
          "url": "https://ms.portal.azure.com/"
        }
      }
    ],
```
![alt-text](../media/portalfx-cuid/Messages.png "Messages")
![alt-text](../media/portalfx-cuid/MessagesTypes.png "Messages types")

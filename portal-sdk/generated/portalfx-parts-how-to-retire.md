
<a name="permanently-retire-a-part"></a>
### Permanently Retire a part

You may have built and shipped a part, but later decide to discontinue its functionality.  Since we provide a customizable system we need to handle cases where a user has pinned this part and incorporated it into the layout of the startboard.  Customers have clearly told us they do not like it when parts disappear from their startboard automatically.  The following process allows you to permanently retire your part while providing a good user experience around customizations.

To retire a part you should simply delete the majority of the code, but leave the bare minimum in place so that the tile still loads.  Then use the `container.noDataMessage()` api to inform the user that the part is no longer supported.

This ensures that users won't see parts failing unexpectedly on their dashboards, while also informing them that this part is no longer supported.
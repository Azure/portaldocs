<a name="delete-a-resource"></a>
# Delete a Resource
Initial Release May 2022 (see Change Log).

The Delete a Resource pattern guides users through the deletion of Azure resources.

We’re currently in the early adoption phase for this design pattern. For help aligning your experiences to these guidelines, please contact us at [azurepattern@microsoft.com](mailto:azurepattern@microsoft.com).


<a name="delete-a-resource-context"></a>
## Context
Users need to delete an Azure resource and be aware of any implications that will result from deletion.

<a name="delete-a-resource-problem"></a>
## Problem
Deleting a resource in Azure can vary from a simple deletion with general implications to a complex experience with more severe impact. It’s important that each delete experience matches the level of severity/impact of the delete action to ensure users have the information they need to make a decision. Experiences that drive awareness, clarity, and provide users with the opportunity to confirm their permanent actions will minimize accidental deletion and support tickets.

<a name="delete-a-resource-solution"></a>
## Solution
The Delete a Resource design pattern makes it easy to configure the deletion experience for a given Azure resource. This includes the design anatomy and behavior for various deletion scenarios:

* Simple Delete
* Simple Delete with Soft Delete Enabled
* Delete with General Implications
* Delete with Dependent Resources
* Delete with Associated Resources
* Bulk Delete Resources

As you go from a "Simple Delete" experience to the "Delete with Associated Resources" the impact of deletion is more severe. As the impact of the delete action becomes more severe, more friction is introduced into the delete experience. The goal of the proceeding design solutions is to make it slightly more difficult for users to delete resources that are high impact (have severe consequences). If you feel that your delete experience falls somewhere between one of the scenarios listed above, you should attempt to match the more severe scenario.

<a name="delete-a-resource-example-delete-a-resource"></a>
## Example: Delete a Resource

<a name="delete-a-resource-example-delete-a-resource-example-images"></a>
### Example images
Example images of the Delete a Resource pattern are shown below for the various scenarios:

<div style="max-width:100%">
<img alttext="Delete a Resource - Example" src="../media/design-patterns-resource-delete/Delete a Resource - Example Images.png"  />
</div>

<a name="delete-a-resource-example-delete-a-resource-example-uses"></a>
### Example Uses
The following Azure Portal experiences are good examples of the Delete a Resource pattern for each scenario:

<div style="max-width:100%">
<img alttext="Delete a Resource - Example" src="../media/design-patterns-resource-delete/Delete a Resource - Examples Table.png"  />
</div>

Links to specific resources cannot be included in the documentation. To see a live version of the Delete a Resource design pattern, go to the Azure Portal and browse “All Resources.” Next, create a “dummy” Key Vault, VM, or Resource Group and then delete it.

<a name="delete-a-resource-use-when"></a>
## Use when
Deleting Azure resources.

<a name="delete-a-resource-anatomy-delete-confirmation-modal"></a>
## Anatomy: Delete Confirmation Modal

<div style="max-width:100%">
<img alttext="Delete a Resource - Example" src="../media/design-patterns-resource-delete/Anatomy - Delete a Resource - Confirmation Modal.png"  />
</div>

The Confirmation Modal is used in all delete scenarios as a safeguard for accidental deletes. It provides users with a “final check” before they perform the permanent action of deleting their Azure resource(s). The modal varies slightly depending on the use case, but in each scenario the modal contains the following:
1.	Title
2.	Message
3.	Confirmation Buttons

<a name="delete-a-resource-behavior-delete-confirmation-modal"></a>
## Behavior: Delete Confirmation Modal

The Delete Confirmation Modal may be displayed in the main display area or within a context pane. It should be the final item in the sequence of a delete workflow or experience.

<a name="delete-a-resource-behavior-delete-confirmation-modal-title"></a>
### Title
The title should read “Delete confirmation” in all use cases. This will result in consistency across Azure extensions and provide users with a similar experience regardless of the type of resource being deleted.

<a name="delete-a-resource-behavior-delete-confirmation-modal-message"></a>
### Message
The message should provide the general implication of the delete.
* When soft-delete is <strong> disabled </strong> should include the phrase “This action will permanently delete the [Resource Type].”
* When soft-delete is <strong> enabled </strong> should include the phrase “This action will move the [Resource Type] and its contents to a soft deleted state. This [Resource Type] will remain recoverable for the retention period of {x} days.

<a name="delete-a-resource-behavior-delete-confirmation-modal-confirmation-buttons"></a>
### Confirmation Buttons

Whenever active, the “Delete” button should use the Danger Button control in the Azure SDK. The Danger Button will display in a red color which adds additional warning to users of the destructive action of deletion.

The option to “Cancel” or “Go Back” should always be provided as part of the final ‘Delete Confirmation’ step.  The option to “Go Back” should only be used when a ‘Delete Acknowledgement’ step precedes the ‘Delete Confirmation’ step as shown in the examples provided with the scenarios in this document.

Confirmation checkboxes that show up prior to the user being given the option to click a “Delete” button are strongly discouraged.

<a name="delete-a-resource-anatomy-simple-delete"></a>
## Anatomy: Simple Delete

<div style="max-width:100%">
<img alttext="Delete a Resource - Example" src="../media/design-patterns-resource-delete/Anatomy - Delete a Resource - Simple Delete.png"  />
</div>

The Simple Delete pattern offers the following features:
1.	Title
2.	Message
3.	Confirmation

<a name="delete-a-resource-behavior-simple-delete"></a>
## Behavior: Simple Delete

The Simple Delete experience is triggered when the user navigates to the manage experience of a given resource and clicks “Delete” in the command bar. The Confirmation Modal dialog opens displaying the following information

<a name="delete-a-resource-behavior-simple-delete-title-1"></a>
### Title
The title should read “Delete confirmation.”

<a name="delete-a-resource-behavior-simple-delete-message-1"></a>
### Message
The message should contain the following components:

<strong> A. General Messaging </strong>

The message should provide the general implication of the delete and should include the phrase:

“The message should provide the general implication of the delete and should include the phrase “This action will permanently delete the [Resource Type].”

<strong> B. Links </strong>

Optionally, the modal message can include a “Learn more” hyperlink that opens the manage experience or soft-delete settings for the given resource. When clicked, the link should open in a new tab.

<strong> C. Resources to be Deleted </strong>

It is important to make it abundantly clear to the user which resource has been selected for deletion. The following information should be displayed in the body of the message for the primary resource being deleted:

* Resource icon
* Resource name

<a name="delete-a-resource-behavior-simple-delete-confirmation"></a>
### Confirmation

The user should be given the option to confirm their delete or cancel it using the “Delete” and “Cancel” buttons, respectively.

<a name="delete-a-resource-anatomy-simple-delete-with-soft-delete-enabled"></a>
## Anatomy: Simple Delete with Soft-Delete Enabled

<div style="max-width:100%">
<img alttext="Delete a Resource - Example" src="../media/design-patterns-resource-delete/Anatomy - Delete a Resource - Simple Delete with Soft Delete.png"  />
</div>

The Simple Delete with Soft-Delete Enabled pattern offers the following features:
1.	Title
2.	Message
3.	Confirmation

<a name="delete-a-resource-behavior-simple-delete-with-soft-delete-enabled"></a>
## Behavior: Simple Delete with Soft-Delete Enabled

The Simple Delete with Soft-Delete Enabled experience is triggered when the user navigates to the manage experience of a given resource and clicks “Delete” in the command bar. The Confirmation Modal dialog opens displaying the following information:

<a name="delete-a-resource-behavior-simple-delete-with-soft-delete-enabled-title-2"></a>
### Title
The title should read “Delete a [Resource type].”

<a name="delete-a-resource-behavior-simple-delete-with-soft-delete-enabled-message-2"></a>
### Message
The message should contain the following components:

<strong> A. General Messaging </strong>

The message should provide the general implication of the delete and should include the phrase:

“This action will move the [Resource Type] and its contents to a soft deleted state. This [Resource Type] will remain recoverable for the retention period of {x} days.”

<strong> B. Links </strong>

Optionally, the modal message can include a “Learn more” hyperlink that opens the manage experience or soft-delete settings for the given resource. When clicked, the link should open in a new tab.

<strong> C. Resources to be Deleted </strong>

It is important to make it abundantly clear to the user which resource has been selected for deletion. The following information should be displayed in the body of the message for the primary resource being deleted:
* Resource icon
* Resource name

<a name="delete-a-resource-behavior-simple-delete-with-soft-delete-enabled-confirmation-1"></a>
### Confirmation

The user should be given the option to confirm their delete or cancel it using the “Delete” and “Cancel” buttons, respectively.

<a name="delete-a-resource-anatomy-delete-with-general-implications"></a>
## Anatomy: Delete with General Implications

<div style="max-width:100%">
<img alttext="Delete a Resource - Example" src="../media/design-patterns-resource-delete/Anatomy - Delete a Resource - Delete with General Implications - 1.png"  />
</div>

<div style="max-width:100%">
<img alttext="Delete a Resource - Example" src="../media/design-patterns-resource-delete/Anatomy - Delete a Resource - Delete with General Implications - 2.png"  />
</div>

The Delete with General Implications pattern offers the following features:
1.	Title
2.	Message
3.	Delete Acknowledgement
4.	Delete Confirmation


<a name="delete-a-resource-behavior-delete-with-general-implications"></a>
## Behavior: Delete with General Implications

The Delete with General Implications experience is triggered when the user navigates to the manage experience of a given resource and clicks “Delete” in the command bar. A context pane opens displaying the following information:

<a name="delete-a-resource-behavior-delete-with-general-implications-title-3"></a>
### Title

The title should read “Delete a [Resource name]”.

<a name="delete-a-resource-behavior-delete-with-general-implications-message-3"></a>
### Message
The message should contain the following components:

<strong> A. General Messaging </strong>

The message should provide the general implications of the delete and should include the phrase:

“This action will permanently delete the [Resource Type].”

<strong> B. Resources to be Deleted </strong>

It is important to make it abundantly clear to the user which resource has been selected for deletion. The following information should be displayed in the body of the message for the primary resource being deleted:
* Resource icon
* Resource name

<strong> C. Implications of Deletion </strong>

Immediately below the resource being deleted shall be a message with specific implications of deletion. It is recommended to list any pertinent information in bullets. Additional implications may include the following:

* Restrictions on creating new resources with the same name as the deleted resource
* Billing implications
* Implications to performance of a resource that is still running

<a name="delete-a-resource-behavior-delete-with-general-implications-delete-acknowledgement"></a>
### Delete Acknowledgement

<a name="delete-a-resource-behavior-delete-with-general-implications-delete-acknowledgement-cta-buttons-only"></a>
#### CTA Buttons (only):

A pinned footer should be docked at the bottom of the context pane which contains the CTA buttons “Delete” and “Cancel”. When the user clicks the “Delete” button, they are advanced to the Delete Confirmation modal. When the user clicks “Cancel” the context pane closes and the delete operation is aborted.

<a name="delete-a-resource-behavior-delete-with-general-implications-delete-confirmation"></a>
### Delete Confirmation

The title and messaging of the Delete Confirmation Modal for this scenario should read as follows:

<strong>Title:</strong> “Delete confirmation”

<strong>Message:</strong> “Deleting the resource is a permanent action and cannot be undone.”

The CTA buttons in this modal should read and perform as follows:

<strong>Primary:</strong> “Delete” – confirms deletion

<strong>Secondary:</strong> “Go back” – returns the user to the acknowledgement step

<a name="delete-a-resource-anatomy-delete-with-dependent-resources"></a>
## Anatomy: Delete with Dependent Resources

<div style="max-width:100%">
<img alttext="Delete a Resource - Example" src="../media/design-patterns-resource-delete/Anatomy - Delete a Resource - Delete with Dependent Resources - 1.png"  />
</div>

<div style="max-width:100%">
<img alttext="Delete a Resource - Example" src="../media/design-patterns-resource-delete/Anatomy - Delete a Resource - Delete with Dependent Resources - 2.png"  />
</div>

The Delete with Dependent Resources pattern offers the following features:
1.	Title
2.	Message
3.	List of Dependent Resources
4.	Delete Acknowledgement
5.	Delete Confirmation

<a name="delete-a-resource-behavior-delete-with-dependent-resources"></a>
## Behavior: Delete with Dependent Resources

The Delete with Dependent Resources experience is triggered when the user navigates to the manage experience of a resource that has dependent resources and clicks “Delete” in the command bar. A context pane opens displaying the following information:

<a name="delete-a-resource-behavior-delete-with-dependent-resources-title-4"></a>
### Title

The title should read “Delete a [Resource name]”.

<a name="delete-a-resource-behavior-delete-with-dependent-resources-message-4"></a>
### Message
The message should contain the following components:

<strong> A. General Messaging </strong>

The message should provide the general implications of the delete and should include the phrase:

“This action will permanently delete the [Resource Type].”

<strong> B. Primary Resource to be Deleted </strong>

In the case of dependent deletion, there is a primary resource being deleted (parent), that has one or more resource dependencies (child resources). In the body of the message, the primary resource being deleted should be highlighted:
* Resource icon
* Resource name

<strong> C. Implications of Deletion </strong>

Immediately below the information of the primary resource being delete shall be a message with any additional implications of deletion. It is recommended to list any pertinent information in bullets, but not to exceed 3 bulleted items.

Additional implications may include the following:

* Restrictions on creating new resources with the same name as the deleted resource
* Billing implications
* Implications to performance of a resource that is still running

<a name="delete-a-resource-behavior-delete-with-dependent-resources-list-of-dependent-resources"></a>
### List of Dependent Resources
When a resource has a parent-child relationship with other resources, any dependent (children) resources should also be listed and deleted along with the parent resource.  The following information should be displayed in a table for dependent resources being deleted:
* Total number of dependent resources to be deleted with parent
* Resource name
* Resource type


<a name="delete-a-resource-behavior-delete-with-dependent-resources-delete-acknowledgement-1"></a>
### Delete Acknowledgement

<a name="delete-a-resource-behavior-delete-with-dependent-resources-delete-acknowledgement-1-typing-cta-buttons"></a>
#### Typing + CTA Buttons:

A pinned footer should be docked at the bottom of the context pane which contains an acknowledgement field that forces the user to type the name of the primary resource in order to activate the CTA buttons “Delete” and “Cancel.”

As an alternative to typing the resource name, the user can click the “Copy” icon next to the resource name to copy the resource name to their clipboard and paste it in the input field.

After the user has entered the correct resource name, the “Delete” button should become active. When the user clicks the “Delete” button, they are advanced to the Delete Confirmation modal. When the user clicks “Cancel” the context pane closes and the delete operation is aborted.

<a name="delete-a-resource-behavior-delete-with-dependent-resources-delete-confirmation-1"></a>
### Delete Confirmation

The title and messaging of the Delete Confirmation Modal for this scenario should read as follows:

<strong>Title:</strong> “Delete confirmation”

<strong>Message:</strong> “Deleting the [Resource type] and its dependent resources is a permanent action and cannot be undone.”

The CTA buttons in this modal should read and perform as follows:

<strong>Primary:</strong> “Delete” – confirms deletion

<strong>Secondary:</strong> “Go back” – returns the user to the acknowledgement step

<a name="delete-a-resource-anatomy-delete-with-associated-resources"></a>
## Anatomy: Delete with Associated Resources

<div style="max-width:100%">
<img alttext="Delete a Resource - Example" src="../media/design-patterns-resource-delete/Anatomy - Delete a Resource - Delete with Associated Resources - 1.png"  />
</div>

<div style="max-width:100%">
<img alttext="Delete a Resource - Example" src="../media/design-patterns-resource-delete/Anatomy - Delete a Resource - Delete with Associated Resources - 2.png"  />
</div>

<div style="max-width:100%">
<img alttext="Delete a Resource - Example" src="../media/design-patterns-resource-delete/Anatomy - Delete a Resource - Delete with Associated Resources - 3.png"  />
</div>

The Delete with Associated Resources pattern offers the following features:
1.	Title
2.	Tabs
3.	Message
4.	List of Associated Resources
5.	Selected Associated Resources
6.	Delete Acknowledgement
7.	Delete Confirmation

<a name="delete-a-resource-behavior-delete-with-associated-resources"></a>
## Behavior: Delete with Associated Resources

The Delete with Associated Resources experience is triggered when the user navigates to the manage experience of a resource that has associated resources and clicks “Delete” in the command bar. A context pane opens displaying the following information:

<a name="delete-a-resource-behavior-delete-with-associated-resources-title-5"></a>
### Title

The title should read “Delete a [Resource name]”.

<a name="delete-a-resource-behavior-delete-with-associated-resources-tabs"></a>
### Tabs
The associated resource follows a wizard pattern with two tabs:
1.	<strong> Associated Resources </strong>– On the ‘Associated Resources’ tab, the general implications and list of associated resources are provided to the user. The user is able to select which (if any) of the associated resources they want to delete along with the primary resource being deleted.
2.	<strong> Review </strong>– On the ‘Review’ tab, the user is able to review their selections before providing acknowledgement and delete confirmation.

<a name="delete-a-resource-behavior-delete-with-associated-resources-message-5"></a>
### Message
The message should contain the following components:

<strong> A. General Messaging </strong>

The message should provide the general implications of the delete and should include the phrase:

“This action will permanently delete this [Resource Type]. You can also choose to delete associated resources along with deleting the [Resource Type].”

<strong> B. Primary Resource to be Deleted </strong>

In the case of associated deletion, there is a primary resource being deleted (parent), that has one or more resource associations (child resources). In the body of the message, the primary resource being deleted should be highlighted:
* Resource icon
* Resource name

<strong> C. Implications of Deletion </strong>

Immediately below the information of the primary resource being delete shall be a message with any additional implications of deletion. It is recommended to list any pertinent information in bullets, but not to exceed 3 bulleted items.

Additional implications may include the following:

* Restrictions on creating new resources with the same name as the deleted resource
* Billing implications
* Implications to performance of a resource that is still running

<a name="delete-a-resource-behavior-delete-with-associated-resources-list-of-associated-resources"></a>
### List of Associated Resources
It is possible that deleting a resource will result in other resources associated with the deleted resource of no significance. When this happens, the user may want to delete these resources as well. It should be noted that associated resources are not dependent on the parent resource, but related. Meaning associated resources can operate on their own. That said, in some cases, the user may want to delete them anyway.

A table listing the associated resources should be provided following the message. Above this table, the total number of associated resources should also be provided. Moreover, each table row should include the following:
* Checkbox
* Resource name
* Resource type

Only associated resources that are selected by the user (checkbox) will be deleted along with the parent resource.

<a name="delete-a-resource-behavior-delete-with-associated-resources-selected-associated-resources-review"></a>
### Selected Associated Resources (Review)
On the ‘Review’ tab, a table should be provided showing a summary of the associated resources that the user selected for deletion from the overall list of associated resources. A message should be provided above this table stating the number of associated resources chosen for deletion.

<a name="delete-a-resource-behavior-delete-with-associated-resources-delete-acknowledgement-2"></a>
### Delete Acknowledgement

<a name="delete-a-resource-behavior-delete-with-associated-resources-delete-acknowledgement-2-typing-cta-buttons-1"></a>
#### Typing + CTA Buttons:

On the ‘Review’ tab, a pinned footer should be docked at the bottom of the context pane which contains an acknowledgement field that forces the user to type the name of the primary resource in order to activate the CTA buttons “Delete” and “Cancel.”

As an alternative to typing the resource name, the user can click the “Copy” icon next to the resource name to copy the resource name to their clipboard and paste it in the input field.

After the user has entered the correct resource name, the “Delete” button should become active. When the user clicks the “Delete” button, they are advanced to the Delete Confirmation modal. When the user clicks “Cancel” the context pane closes and the delete operation is aborted.

<a name="delete-a-resource-behavior-delete-with-associated-resources-delete-confirmation-2"></a>
### Delete Confirmation

The title and messaging of the Delete Confirmation Modal for this scenario should read as follows:

<strong>Title:</strong> “Delete confirmation”

<strong>Message:</strong> “Deleting this resource and the selected associated resource(s) is a permanent action and cannot be undone.”

The CTA buttons in this modal should read and perform as follows:

<strong>Primary:</strong> “Delete” – confirms deletion

<strong>Secondary:</strong> “Go back” – returns the user to the acknowledgement step

<a name="delete-a-resource-anatomy-bulk-delete-resources"></a>
## Anatomy: Bulk Delete Resources

<div style="max-width:100%">
<img alttext="Delete a Resource - Example" src="../media/design-patterns-resource-delete/Anatomy - Delete a Resource - Bulk Delete Resources - 1.png"  />
</div>

<div style="max-width:100%">
<img alttext="Delete a Resource - Example" src="../media/design-patterns-resource-delete/Anatomy - Delete a Resource - Bulk Delete Resources - 2.png"  />
</div>

The Bulk Delete Resources pattern offers the following features:
1.	Title
2.	Message
3.	List of Resources to be Deleted
4.	Delete Acknowledgement
5.	Delete Confirmation

<a name="delete-a-resource-behavior-bulk-delete-resources"></a>
## Behavior: Bulk Delete Resources

The Bulk Delete Resources experience is triggered when the user navigates to the browse experience. This includes both ‘All Resources’ browse and the browse blade of an individual resource type. The delete flow starts when the user selects one or more resources from the table and clicks ‘Delete’ in the command bar. A context pane opens displaying the following information:

<a name="delete-a-resource-behavior-bulk-delete-resources-title-6"></a>
### Title

The title should read “Delete Resources”.

<a name="delete-a-resource-behavior-bulk-delete-resources-message-6"></a>
### Message
The message should contain the following components:

<strong> A. General Messaging </strong>

The message should provide the general implications of the delete and should include the phrase:

“The selected resources along with their related resources and contents will be permanently deleted. If you are unsure of the selected resource dependencies, navigate to the individual resource page to perform the delete operation. More details of the resource dependencies are available in the manage experience.”

<a name="delete-a-resource-behavior-bulk-delete-resources-list-of-dependent-resources-1"></a>
### List of Dependent Resources
When bulk deleting resources, a list of the selected resources should be provided in a table. The following information should be displayed in a table for the resources being deleted:
* Total number of dependent resources to be deleted
* Resource name
* Resource type

<a name="delete-a-resource-behavior-bulk-delete-resources-delete-acknowledgement-3"></a>
### Delete Acknowledgement

<a name="delete-a-resource-behavior-bulk-delete-resources-delete-acknowledgement-3-typing-cta-buttons-2"></a>
#### Typing + CTA Buttons:

A pinned footer should be docked at the bottom of the context pane which contains an acknowledgement field that forces the user to type the word <strong>‘delete’</strong> in order to activate the CTA buttons “Delete” and “Cancel.”

After the user has entered the word <strong>‘delete’</strong>, the “Delete” button should become active. When the user clicks the “Delete” button, they are advanced to the Delete Confirmation modal. When the user clicks “Cancel” the context pane closes and the delete operation is aborted.

<a name="delete-a-resource-behavior-bulk-delete-resources-delete-confirmation-3"></a>
### Delete Confirmation

The title and messaging of the Delete Confirmation Modal for this scenario should read as follows:

<strong>Title:</strong> “Delete confirmation”

<strong>Message:</strong> “Deleting the selected resources and their internal data is a permanent action and cannot be undone.”

The CTA buttons in this modal should read and perform as follows:

<strong>Primary:</strong> “Delete” – confirms deletion

<strong>Secondary:</strong> “Go back” – returns the user to the acknowledgement step


<a name="delete-a-resource-do"></a>
## Do

* Use the correct UI/UX end-to-end flow as well as the guidelines that apply to your delete scenario.
* Use the ‘Danger’ button control whenever you provide a ‘Delete’ button.
* Include a bulleted list of additional implications as part of the general messaging when applicable.


<a name="delete-a-resource-don-t"></a>
## Don&#39;t

* Use the wrong UI/UX experience for your scenario.
* Create custom delete flows. One of the scenarios listed in this document should apply to your extension. If you feel you need a custom experience, please contact [azurepattern@microsoft.com](mailto:azurepattern@microsoft.com).
* Use a checkbox for delete acknowledgement or confirmation.
* Use yellow warning boxes to highlight delete implications or permeance.

<a name="delete-a-resource-related-design-guidelines"></a>
## Related design guidelines
* Azure Portal Pattern Templates (Figma): [Manage a Resource pattern](https://www.figma.com/file/SkCj1C9nh5lZTuIz0uhcY2/Azure-Portal-Pattern-Templates?node-id=743%3A0)
* Azure Portal Toolkit (Figma): [Resource Menu design](https://www.figma.com/file/Bwn8rmUOYtnPRwA3JoQTBn/Azure-Portal-Toolkit?node-id=3059%3A368196)
* Overvew page [design-patterns-page-overview.md](design-patterns-page-overview.md)
* Create a Resource [design-patterns-resource-create.md](design-patterns-resource-create.md)
* Browse Resources [design-patterns-resource-browse.md](design-patterns-resource-browse.md)
* Design guidelines [top-design.md](top-design.md)

<a name="delete-a-resource-research-and-usability"></a>
## Research and usability
The Delete a Resource pattern has been tested extensively. A few studies are listed below for your convenience:

* Delete Patterns re-design (V3) - [User Study (Feb 2022)](https://hits.microsoft.com/Study/6027944)
* Delete Patterns re-design (V2) - [User Study (Nov 2021)](https://microsoft-my.sharepoint.com/:w:/p/pdamera/EexuNcYPY0tOmvBu5KzmhnABFgw0ZdxGMG063qW8NTluoQ?e=QuAMKN)

<a name="delete-a-resource-telemetry"></a>
## Telemetry

The Azure Pattern team has pulled together usage data for delete operations in Azure. View the Delete Button shared view in our PowerBI Dashboard for a breakdown of delete actions by users for different resource types. If your experience ranks among the most common delete experiences (by volume), we strongly encourage you to adopt this guidance sooner than later.

<a name="implementation"></a>
# Implementation
Developers can use the following information to get started implementing this pattern:

<a name="implementation-figma-design"></a>
### Figma Design
Please refer to the lastest version of the Delete Pattern designs located in the [Azure Portal Pattern Templates](https://www.figma.com/file/SkCj1C9nh5lZTuIz0uhcY2/?node-id=41058%3A136861) Figma file.

<a name="implementation-declarative"></a>
### Declarative
The Azure Pattern team is currently working on declarative views for many of the designs provided in this guidance. We’re targeting August 2022 for the release of declarative views for the Delete Pattern implementation.

<a name="implementation-change-log"></a>
## Change Log

<a name="implementation-change-log-may-2022"></a>
### May 2022
* Published initial draft of documentation.
* The Delete Pattern is brand new for Azure and currently gaining adoption.
* More examples and guidelines will be added to this document in future versions.

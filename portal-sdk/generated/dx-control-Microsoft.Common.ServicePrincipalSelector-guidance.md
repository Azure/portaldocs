You can use a default application, create a new application, or use an existing application.

<a name="use-default-application-or-create-new"></a>
### Use default application or create new

The default view is determined by the values in the `defaultValue` property and the **Service Principal Type** is set to **Create New**. If the `principalId` property contains a valid globally unique identifier (GUID), the control searches for the application's `objectId`. The default value applies if the user doesn't make a selection from the control.

If you want to register a new application, select **Change selection** and the **Register an application dialog box** is displayed. Enter **Name**, **Supported account type**, and select the **Register** button.

![UI sample of a ServicePrincipalSelector control](../media/dx/controls/dx-control-Microsoft.Common.ServicePrincipalSelector.png)

After you register a new application, use the **Authentication Type** to enter a password or certificate thumbprint.

![UI sample of a ServicePrincipalSelector control in the Create New scenario specifying Authentication Type](../media/dx/controls/dx-control-Microsoft.Common.ServicePrincipalSelector-authenticationType.png)

<a name="use-existing-application"></a>
### Use existing application

To use an existing application, choose **Select Existing** and then select **Make selection**. Use the **Select an application** dialog box to search for the application's name. From the results, select the the application and then the **Select** button. After you select an application, the control displays the **Authentication Type** to enter a password or certificate thumbprint.

![UI sample of a ServicePrincipalSelector in the Select Existing Application scenario](../media/dx/controls/dx-control-Microsoft.Common.ServicePrincipalSelector-selectExisting.png)

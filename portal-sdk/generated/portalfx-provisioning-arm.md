* [ARM APIs](#arm-apis)
    * [Deploying ARM Templates](#arm-apis-deploying-arm-templates)
    * [1. Deploying the Templates](#arm-apis-1-deploying-the-templates)
    * [2. Polling for Updates](#arm-apis-2-polling-for-updates)
    * [3. Samples](#arm-apis-3-samples)


<a name="arm-apis"></a>
## ARM APIs

Historically, managing a resource (a user-managed entity such as a database server, database, or website) in Microsoft Azure required you to perform operations against one resource at a time. If you had a complex application made up of multiple resources, management of this application became a complex task. In the Microsoft Azure preview portal you can create resource groups to manage all your resources in an application together. Resource group is a new concept in Azure that serves as the lifecycle boundary for every resource contained within it. 
Resource groups enable you to manage all your resources in an application together. Resource groups are enabled by the new management functionality, Azure Resource Manager (ARM). 

The Azure Resource Manager allows you to group multiple resources as a logical group which serves as the lifecycle boundary for every resource contained within it. Typically a group will contain resources related to a specific application. For example, most applications that are designed to run in Microsoft Azure use a combination of resources (such as a database server, database, or website) to perform as designed. An [Azure Resource Manager Template](http://msdn.microsoft.com/en-us/library/azure/dn835138.aspx) makes it possible for you to deploy and manage these resources together by using a JSON description of the resources and associated deployment parameters.  To simplify deployment of ARM templates you may use the Provisionning API for ARM.
 

<a name="arm-apis-deploying-arm-templates"></a>
### Deploying ARM Templates
Deploying ARM templates is a two step process. First, you submit a request to ARM indicating which template you want to deploy, and the parameters required to satisfy that template. The deployment template could be a link to an uploaded template (usually uploaded to the gallery service as part of the gallery package), or inline JSON that is constructed on the fly. ARM will either accept your request and respond with a correlation id, or deny it.

If your request is accepted, ARM begins the deployment of the template. That means it starts provisioning the resource(s) described by the template. The second step is waiting till the deployment is complete (i.e. provisioning your resource(s) has completed). You can poll for the deployment updates to know whether the deployment has been accepted, is running, succeeded, or failed. You can also poll for operations, where ARM returns a snapshot of current operations and their statuses.

We've added a couple of APIs to help you do that in your code. Generally you either only want to submit the request to ARM (only the first step), or you want to wait till the deployment is done. We take care of the notifications for you, but you can choose to suppress them if you need to.

<a name="arm-apis-1-deploying-the-templates"></a>
### >
<li>Deploying the Templates</li>
<
Now you can deploy ARM templates directly using this API:

```ts
MsPortalFx.Azure.ResourceManager.deployTemplate(options);
```
The API takes one argument, a template deployment options object, which has the following structure:

 * __subscriptionId__: The subscription id.
 * __deploymentName__: The deployment name.
 * __resourceGroupName__: The resource group name.
 * __resourceGroupLocation__: The location/region for the resource group.
 * __resourceProviders__: An array of the resource providers to be registered for the subscription.
 * __templateLinkUri__: The URI for the deployment template. Specify this or the templateJson property, but not both.
 * __templateJson__: The inline deployment template JSON. Specify this or the templateLinkUri property, but not both.
 * __parameters__: The template parameters required by ARM to satisfy the template you want to deploy.
 * __deploymentMode__: (Optional) The template deployment operation mode. Defaults to 'RequestDeploymentOnly'.
 * __suppressDefaultNotifications__: (Optional) Flag indicating whether to suppress default deployment notifications or not. Defaults to false.

The API returns a promise that behaves based on the `deploymentMode` value:

 * __RequestDeploymentOnly__: (Default) A deployment request will be submitted to ARM. The promise will resolve/reject when ARM accepts/denies the request.
 * __DeployAndAwaitCompletion__: A deployment request will be submitted to ARM. The promise will report progress when ARM accepts the request. The promise will resolve/reject when ARM succeeds/fails to provision the deployed resource(s). Operations are not reported while the deployment is in progress (silent polling). Operations are reported on success. 
 * __DeployAndGetAllOperations__: Just like `DeployAndAwaitCompletion`, except that the promise will continuously report ARM operations as progress. Operations are also reported on success.

The result returned when the promise resolves (and the progress) have the following structure:

 * __correlationId__: The correlation id.
 * __provisioningState__: The provisioning state ("accepted", "running", "succeeded", or "failed").
 * __timestamp__: The timestamp when the reported operation was completed.
 * __operations__: When available, the list of deployment operations. This is only returned if the `deploymentMode` is set to `DeployAndGetAllOperations`.

Polling is described in the next section. If you chose to do the polling yourself, set the `deploymentMode` to `RequestDeploymentOnly` and wait for ARM to accept the request and return a correlation id. You can use the correlation id to poll for deployment updates using the `MsPortalFx.Azure.ResourceManager.pollForDeployment` described in the next section, till ARM is done with provisioning the deployed resource(s). Check out sample #4 in the samples section. Please note that those calls aren't cached, so if the user abandons the session (by closing the browser or navigating away) before the request makes it to ARM, the call to this API will result in nothing. In the other two modes, if you have some UI that reflects the deployment progress, and if the request goes through and ARM responds back with the correlation id, it's still advisable to store it somewhere because the user can still abandon the session, and you'll need to continue reflecting progress on reload.

<a name="arm-apis-2-polling-for-updates"></a>
### >
<li>Polling for Updates</li>
<
There's another API to poll for deployment updates. You can use this if you have the correlation id of an existing deployment (returned when a deployment request is accepted by ARM).
```ts
MsPortalFx.Azure.ResourceManager.pollForDeployment(options);
```
The API takes one argument, a template deployment options object, which has the following structure:

 * __subscriptionId__: The subscription id.
 * __deploymentName__: The deployment name.
 * __resourceGroupName__: The resource group name.
 * __correlationId__: The correlation id for the deployment you want to poll for.
 * __getAllOperations__: (Optional) Flag indicating whether you want all operations reported or not. Defaults to false.

The API returns a promise that is resolved/rejected when the deployment succeeds/fails. If you set the `getAllOperations` flag to true, the promise will continuously report ARM operations as progress. Operations are also reported on success.

Polling is done every ten seconds for the first minute, then every minute for the next five minutes, then every five minutes afterwards. If polling fails because of a timeout or an internal server error on ARM's back end, we'll retry up to three times.

The result returned when the promise resolves (and the progress) is exactly like the one returned in the `deployTemplate` API. `operations` are returned only if `getAllOperations` is set to true.

<a name="arm-apis-3-samples"></a>
### >
<li>Samples</li>
<

<a name="arm-apis-3-samples-1-requesting-a-template-deployment"></a>
##### >
<li>Requesting a template deployment</li>
<
```ts
// Prepare the template deployment options.
var deploymentOptions: MsPortalFx.Azure.ResourceManager.TemplateDeploymentOptions = {
    subscriptionId: "1e215951-cf63-4cd9-b5c5-748a1f97e984",
    deploymentName: "Samples.Engine",
    resourceGroupName: "armDeploymentTestRG",
    resourceGroupLocation: "centralus",
    resourceProviders: [ "EngineRP" ],
    templateLinkUri: "http://uri-of-arm-template"
    // Or -> templateJson: "json",
    parameters: {
        name: "engine-test-1",
        displacement: "disp-1",
        model: "engine-v1"
    },
    // Defaults to -> suppressDefaultNotifications: false,
    // Defaults to -> deploymentMode: MsPortalFx.Azure.ResourceManager.TemplateDeploymentMode.RequestDeploymentOnly
};

// Deploy the template.
MsPortalFx.Azure.ResourceManager.deployTemplate(options)
    .then((result: MsPortalFx.Azure.ResourceManager.TemplateDeploymentResult) => {
        // ARM accepted the deployment request.
        // Store the correlation id if you want to poll for deployment updates afterwards.
        // Do something with the result. 
    }, (error: any) => {
        // Something went wrong!
    });
```

<a name="arm-apis-3-samples-2-deploy-a-template-and-await-completion"></a>
##### >
<li>Deploy a template and await completion</li>
<
```ts
// Prepare the template deployment options.
var deploymentOptions: MsPortalFx.Azure.ResourceManager.TemplateDeploymentOptions = {
    // Same options as in sample #1, except:
    deploymentMode: MsPortalFx.Azure.ResourceManager.TemplateDeploymentMode.DeployAndAwaitCompletion
};

// Deploy the template.
MsPortalFx.Azure.ResourceManager.deployTemplate(options)
    .progress((progress: MsPortalFx.Azure.ResourceManager.TemplateDeploymentResult) => {
        // Will be called only once, when ARM accepts the deployment request.
        // Store the correlation id if you have UI that reflects the progress and the user abandons the session.
    }).then((result: MsPortalFx.Azure.ResourceManager.TemplateDeploymentResult) => {
        // Deployment is complete. 
    }, (error: any) => {
        // Something went wrong!
    });
```

<a name="arm-apis-3-samples-3-deploy-a-template-and-await-completion-while-getting-all-operations"></a>
##### >
<li>Deploy a template and await completion (while getting all operations)</li>
<
```ts
// Prepare the template deployment options.
var deploymentOptions: MsPortalFx.Azure.ResourceManager.TemplateDeploymentOptions = {
    // Same options as in sample #1, except:
    deploymentMode: MsPortalFx.Azure.ResourceManager.TemplateDeploymentMode.DeployAndGetAllOperations
};

// Deploy the template.
MsPortalFx.Azure.ResourceManager.deployTemplate(options)
    .progress((progress: MsPortalFx.Azure.ResourceManager.TemplateDeploymentResult) => {
        // First time will be called when ARM accepts the deployment request. 
        // Store the correlation id if you have UI that reflects the progress for the case when the user abandons the session.
        // Subsequent calls will continuously reports progress (and operations) while the deployment is in progress.
    }).then((result: MsPortalFx.Azure.ResourceManager.TemplateDeploymentResult) => {
        // Deployment is complete.
    }, (error: any) => {
        // Something went wrong!
    });
```

<a name="arm-apis-3-samples-4-requesting-a-template-deployment-and-seperately-polling-for-updates-and-operations"></a>
##### >
<li>Requesting a template deployment and seperately polling for updates (and operations)</li>
<
```ts
// Prepare the template deployment options.
var deploymentOptions: MsPortalFx.Azure.ResourceManager.TemplateDeploymentOptions = {
    // Same options as in sample #1.
};

// Deploy the template.
MsPortalFx.Azure.ResourceManager.deployTemplate(options)
    .then((deploymentResult: MsPortalFx.Azure.ResourceManager.TemplateDeploymentResult) => {
        // ARM accepted the deployment request.
        // Store the correlation id if you have UI that reflects the progress for the case when the user abandons the session.

        // Prepare polling options.
        var pollingOptions: MsPortalFx.Azure.ResourceManager.TemplateDeploymentPollingOption = {
            // Use the same info from the original deployment.
            subscriptionId: deploymentOptions.subscriptionId,
            deploymentName: deploymentOptions.deploymentName,
            resourceGroupName: deploymentOptions.resourceGroupName,
            // Use the correlation id returned.
            correlationId: deploymentResult.correlationId,
            // Optional:
            getAllOperations: true
        };

        // Poll for updates.
        MsPortalFx.Azure.ResourceManager.pollForDeployment(pollingOptions)
            .progress((progress: MsPortalFx.Azure.ResourceManager.TemplateDeploymentResult) => {
                // Continuously reports progress (and operations) while the deployment is in progress.
            }).then((pollingResult: MsPortalFx.Azure.ResourceManager.TemplateDeploymentResult) => {
                // Deployment is complete.
            }, (error: any) => {
                // Something went wrong!
            });
    }, (error: any) => {
        // Something went wrong!
    });
```

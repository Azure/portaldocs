<a name="custom-extension-deployment-infrastructure"></a>
## Custom extension deployment infrastructure

Teams that intend to deploy extensions by using legacy or Do-It-Yourself (DIY) deployments need to be aware that they are responsible for the following.

1. Deploying to all regions.
1. Deploying the service to every new data center.
1. Infrastructure tasks such as MDS setup, upgrade, Security pack upgrade and other tasks.
1. If you are planning to use CDN to serve the extension UI and the CDN goes down, the fallback will be not be pleasing to your users.
1. Setting up persistent storage so that users do not see reliability drops during extension deployment.
1. Setting up the infrastructure to rollback if there are live-site issues.
1. Signing up for on-call and live site rotations for deployment infrastructure.
1. Developers are also responsible for deploying both the UI and the controller, in addition to setting up load-balancing across the appropriate regions for each extension.

We recommend that extensions use a CDN, such as Azure CDN, to move the most commonly-downloaded resources as close as possible to the end user. Typically, it is best to set up servers in every region, although there is some flexibility. If the extension content is primarily static and all of its controller access is conducted by ARM by using CORS, then CDN works well. However, when the CDN goes down, then the fallback will be not pleasing to your users.

We also recommend that extensions deploy broadly across all regions in an active-active configuration and use a technology with a "Performance" profile, such as the Azure Traffic Manager that is located [here](https://azure.microsoft.com/en-us/documentation/articles/traffic-manager-overview), to direct the user to the server closest to them. This will give users the best experience, especially if the extension communicates with a resource provider that is also deployed broadly across regions. As ARM is deployed in every region, that traffic for a user will stay entirely within one region, therefore reducing latency.

<a name="custom-extension-deployment-infrastructure-resiliency-and-failover"></a>
### Resiliency and failover

Having a presence in all geographies is important for good performance. Extensions experience much higher latencies and reliability issues when servers are not geo-located with their users. For more information on performance, please refer to our performance doc [here](/portal-sdk/generated/top-extensions-performance-profiling.md).

Use the following steps to deploy an extension to all regions.

1. Use the Extension Hosting Service as specified in top-extensions-hosting-service.md to deploy the UI.
2. Deploy controllers to all regions.

If the extension uses controllers that are located in the extension server, resiliency and failover depend on how the servers are used.
Usually messages across long distances suffer more from latency than throughput. This means if there is a steady stream of data, such as uploading a file, the distance is not as noticeable as when there are many messages, such as individual calls to request status on many storage accounts.

In the file upload scenario, the upload step is more of a "delay expected" moment that is infrequent where the status messages are needed right away and very often. In the first case, the extension can probably use fewer servers, but in the second case geo-locating the extension server and the user will be very important.
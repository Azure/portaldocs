<a name="prerequisites-for-isvs"></a>
# Prerequisites for ISVs

For ISVs to build an extension for the Azure Portal, they have to meet the following prerequisites - 

1. **Microsoft sponsor** - A ISV extension will need a Microsoft team to sponsor them. A ISV extension will be linked to the sponsor's Service Tree registration. The Microsoft team will be responsible to meet SLAs for all live site incidents and support tickets arising for the ISV's extension. The Azure Portal team does not sponsor ISV extensions.

1. **Business guest accounts** - The sponsor team will be responsible for creating business guest Microsoft accounts (b- or v- accounts) for developers from the ISV and managing permissions.

1. **Storage accounts** - The Azure Portal reads an extension for deployment from a storage account. Deployment mechanisms and the need for these storage accounts can be found in the deployment section of this documentation. As a prerequisite, at this stage - 
    1. Create two storage accounts, one for dogfood and one for production. 
    1. Create a container in each of the storage accounts and set the [public access level to anonymous read access](https://docs.microsoft.com/azure/storage/blobs/anonymous-read-access-configure).
    1. Share the URLs to anonymously read the containers with your sponsor team. They will need this for the onboarding step.


<a name="extension-development-set-up-for-isvs"></a>
# Extension development set-up for ISVs

 
<a name="extension-development-set-up-for-isvs-setup-and-installation"></a>
## Setup and Installation

<a name="extension-development-set-up-for-isvs-setup-and-installation-one-time-configuration-steps"></a>
### One time configuration steps

- Install the LTS of nodejs [download](https://nodejs.org/en/download)

Windows
  1. download [setup.js](https://aka.ms/portalfx/cli/setup) and place 'setup.js' inside the project or directory you are working on.
  1. run `node setup.js` and perform any actions it asks you to.

MacOS
  1. download  [mac-setup.sh](https://aka.ms/portalfx/xplat/setup/mac) i.e `curl -fsSL https://aka.ms/portalfx/xplat/setup/mac > mac-setup.sh`
  1. run `bash mac-setup.sh`

If you prefer follow along see the step by step:
- [Manual one time Auth Setup and Installation steps](#manual-one-time-auth-setup-and-installation)
- [Video:One time configuration steps](https://msit.microsoftstream.com/video/d1f15784-da81-4354-933d-51e517d38cc1?st=657)



<a name="extension-development-set-up-for-isvs-getting-started"></a>
## Getting started


1. Run command prompt as Admin
1. Create a new extension by running the following commands - 

    ```
    cd c:\ && mkdir dev && cd dev
    ap new -d -n CompanyName_MyService -o ./MyService
    cd ./MyService/src/default/extension
    ap start

    ```
1. Congratulations, you have now successfully created a new extension and sideloaded against the production portal.

 

<a name="extension-development-set-up-for-isvs-manual-one-time-auth-setup-and-installation"></a>
## Manual one time Auth Setup and Installation
The following steps detail the one time configuration that must be applied to authenticate against the internal AzurePortal registry for both NuGet and npm.
If you prefer follow along see the step by step: [Video:One time configuration steps](https://msit.microsoftstream.com/video/d1f15784-da81-4354-933d-51e517d38cc1?st=657)

Windows:
- Install the LTS of nodejs [download](https://nodejs.org/en/download)
- Install the .NET 4.7.2 *Developer Pack* - [located here](https://dotnet.microsoft.com/download/dotnet-framework/thank-you/net472-developer-pack-offline-installer)
- NuGet Credential provider
1. Connect to the AzurePortal Feed https://msazure.visualstudio.com/One/_packaging?_a=connect&feed=AzurePortal
1. Select NuGet.exe under the NuGet header
1. Click the 'Get the tools' button in the top right corner
1. Follow steps 1 and 2 to download the latest NuGet version and the credential provider.

- NPM Auth Personal Access Token (PAT)

Just as NuGet needed the credential provider npm requires a PAT for auth.  Which can be configured as follows.

1. Connect to the AzurePortal Feed https://msazure.visualstudio.com/One/_packaging?_a=connect&feed=AzurePortal
1. Select npm under the npm header
1. Click the 'Get the tools' button in the top right corner
1. Optional. Follow steps 1 to install node.js and npm if not already done so.
1. Follow step 2 to install vsts-npm-auth node.
1. Add a .npmrc file to your project or empty directory with the following content
    ```
    registry=https://msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm/registry/
    always-auth=true
    ```
1. From the command prompt in the same directory:
    - set the default npm registry
    ```
    npm config set registry https://msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm/registry/
    ```
    - generate a readonly PAT using vsts-npm-auth
    ```
    vsts-npm-auth -R -config .npmrc
    ```
    Generally the PAT will be written to %USERPROFILE%\.npmrc we strongly recommend not checking your PAT into source control; anyone with access to your PAT can interact with Azure DevOps Services as you.


- Path
Ensure the following are on your path i.e resolve when typed in and run from the command prompt.
1. `NuGet` and the above installed credential provider is on your path.
1. Ensure `npm` is on your path.
1. Ensure `msbuild` is on your path.

If not present you can add the items to your path as follows:
1. WindowsKey + R
1. `rundll32.exe sysdm.cpl,EditEnvironmentVariables`
1. In the dialog click `Edit` on the `Path` variable and add (note paths may vary depending on your environment and msbuiuld version)
    - for npm `C:\Users\youralias\AppData\Roaming\npm`
    - for NuGet and cred provider `C:\Users\youralias\.nuget`
    - for msbuild `C:\Program Files (x86)\Microsoft Visual Studio\2019\Enterprise\MSBuild\Current\bin`

If you have run into problems checkout the [Video:One time configuration steps](https://msit.microsoftstream.com/video/d1f15784-da81-4354-933d-51e517d38cc1?st=657)

MacOS:
- `curl -fsSL curl -fsSL https://aka.ms/portalfx/xplat/setup/mac | bash`
- Or
- download https://aka.ms/portalfx/xplat/setup/mac and save to mac-setup.sh
- call bash mac-setup.sh
<a name="extension-development-set-up-for-isvs-manual-one-time-auth-setup-and-installation-installing-the-azure-portal-extension-developer-cli"></a>
### Installing the Azure portal extension developer CLI

With the one time configuration steps complete you can now install the CLI as you would with any other node module.

1. Run the following command in the directory that contains your .npmrc.
```
npm install -g @microsoft/azureportalcli
```

[Video: Installing the node module](https://msit.microsoftstream.com/video/d1f15784-da81-4354-933d-51e517d38cc1?st=1324)


<a name="extension-development-set-up-for-isvs"></a>
# Extension development set-up for ISVs

<a name="extension-development-set-up-for-isvs-one-time-configuration-steps"></a>
## One time configuration steps

[One time configuration steps](https://eng.ms/docs/products/azure-portal-framework-ibizafx/development/ap-cli#one-time-configuration-steps)

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

[Manual one time Auth Setup and Installation](https://eng.ms/docs/products/azure-portal-framework-ibizafx/development/ap-cli#manual-one-time-auth-setup-and-installation)

#!/bin/bash

dotnetOpts=()
if [[ $(uname -p) == 'arm' ]]; then
  #if M1 install rosetta
  softwareupdate --install-rosetta
  dotnetOps+=(--arch x64)
fi

#install dotnet 6.0.401
curl -fsSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin -Version 6.0.401 ${dotnetOps[@]}

if [[ $? -ne 0 ]]; then
  echo "Installing .NET failed, please try again." 2>&1
  exit 1
fi

#nodejs/npm
curl "https://nodejs.org/dist/v18.18.2/node-v18.18.2.pkg" > "$HOME/Downloads/node-v18.18.2.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-v18.18.2.pkg" -target "/"

if [[ $? -ne 0 ]]; then
  echo "Installing nodejs failed, please try again." 2>&1
  exit 1
fi

# dotnet nuget credential provider
curl -fsSL https://aka.ms/install-artifacts-credprovider.sh | bash /dev/stdin

if [[ $? -ne 0 ]]; then
  echo "Installing dotnet nuget credential provider failed, please try again." 2>&1
  exit 1
fi

#based 64 encode PAT and drop to .npmrc
echo "Go to https://msazure.visualstudio.com/_details/security/tokens and generate a Personal Access Token (PAT) for the 'Packaging' scope with 'read' access and paste below."
read -sp "PAT: " adoPAT
patBase64=$(echo -en $adoPAT | base64 -i -);
npmrcTemplate='; begin auth token
//msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm/registry/:username=msazure
//msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm/registry/:_password=$CREDENTIAL_PLACEHOLDER$
//msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm/registry/:email=npm requires email to be set but doesnt use the value
//msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm/:username=msazure
//msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm/:_password=$CREDENTIAL_PLACEHOLDER$
//msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm/:email=npm requires email to be set but doesnt use the value
; end auth token'
echo "${npmrcTemplate//\$CREDENTIAL_PLACEHOLDER\$/$patBase64}" > ~/.npmrc

#install the latest cli
echo "changing ownership of /usr/local/lib/node_modules"
sudo chown -R $USER /usr/local/lib/node_modules
echo "installing ap CLI"
npm config set registry https://msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm/registry/
npm install -g --no-optional @microsoft/azureportalcli@latest --registry https://msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm/registry/

if [[ $? -ne 0 ]]; then
  echo "Installing @microsoft/azureportalcli failed, please try again." 2>&1
  exit 1
fi

#show ap help
ap --help

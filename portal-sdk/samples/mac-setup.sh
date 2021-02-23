#!/bin/bash

#install dotnet core 3.1.202
curl -fsSL https://dot.net/v1/dotnet-install.sh | bash /dev/stdin -Version 3.1.202

if [[ $? -ne 0 ]]; then
  echo "Installing .NET Core failed, please try again." 2>&1
  exit 1
fi

#nodejs/npm
curl "https://nodejs.org/dist/v14.15.5/node-v14.15.5.pkg" > "$HOME/Downloads/node-v14.15.5.pkg" && sudo installer -store -pkg "$HOME/Downloads/node-v14.15.5.pkg" -target "/"

if [[ $? -ne 0 ]]; then
  echo "Installing nodejs failed, please try again." 2>&1
  exit 1
fi

#install brew for mono-libgdiplus dep
curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh | bash /dev/stdin

if [[ $? -ne 0 ]]; then
  echo "Installing brew failed, please try again." 2>&1
  exit 1
fi

#mono-libgdiplus for gallery package utility dependency on System.Drawing - https://github.com/dotnet/runtime/issues/21980
brew install mono-libgdiplus

if [[ $? -ne 0 ]]; then
  echo "Installing mono-libgdiplus failed, please try again." 2>&1
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
npm config set registry https://msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm/registry/
npm install --no-optional @microsoft/azureportalcli@latest --registry https://msazure.pkgs.visualstudio.com/_packaging/AzurePortal/npm/registry/

if [[ $? -ne 0 ]]; then
  echo "Installing @microsoft/azureportalcli failed, please try again." 2>&1
  exit 1
fi

#show ap help
ap --help

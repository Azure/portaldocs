<properties title="" pageTitle="Distributing a PDE using NuGet" description="" authors="nickha" />

<tags
    ms.service="portalfx"
    ms.workload="portalfx"
    ms.tgt_pltfrm="portalfx"
    ms.devlang="portalfx"
    ms.topic="distribute-pde"
    ms.date="04/18/2016"
    ms.author="nickha"/>    

## Sharing your PDE with other teams

The following guidelines have been created to ensure a consistent and easy to consume developer experience across all partner teams that need to share their PDE.

To share your PDE with other teams please follow these guidelines: 

- Create a NuGet
    
    - use the consistent naming convention Microsoft.Portal.Extensions.&lt;Name&gt;
    - the *.pde file is to be delivered under /Client/_extensions/&lt;Name&gt; 
  
    The following nuproj snippet can be used to customimze for your extensions NuGet creation. Most teams name it Microsoft.Portal.Extensions.&lt;Name&gt; to be consistent with the produced package name
    
    ```xml

    <?xml version="1.0" encoding="utf-8"?>
    <Project ToolsVersion="4.0" DefaultTargets="Build" xmlns="http://schemas.microsoft.com/developer/msbuild/2003">
    <Import Project="$(EnvironmentConfig)" />
    
    <PropertyGroup>
        <Id>Microsoft.Portal.Extensions.Name</Id>
        <Title>Microsoft Portal Extension Name</Title>
        <Description>Provides the Microsoft Portal Name PDE</Description>
        <Summary>Provides the Microsoft Portal Name PDE</Summary>
        <Tags>Microsoft Azure Cloud Portal Framework Name  PDE</Tags>
    </PropertyGroup>
    
    <ItemGroup>
        <!-- update the following to pull the PDE from your official build-->
        <Content Include="$(RepoRoot)\src\SDK\Extensions\HubsExtension\TypeScript\HubsExtension\HubsExtension.pde">
        <TargetPath>Client\_extensions\Name</TargetPath>
        </Content>
        <!-- include an install.ps1 to both set appropriate build action on pde and to pop documents-->
        <File Include="$(REPOROOT)\RDPackages\NuGet\Microsoft.Portal.Extensions.Name\Install.ps1" >
        <TargetPath>Tools\Install.ps1</TargetPath>
        </File>
    </ItemGroup>
    <!-- update the following as needed aka.ms/onebranch -->
    <Import Project="$(PkgNuProj)\NuProj.Targets" />
    <Import Project="..\Portal.Common.NuGet.props" />
    <PropertyGroup>
        <GenerateSymbolPackage>false</GenerateSymbolPackage>
    </PropertyGroup>
    </Project>

    ```
    
- Include in the nuproj a Install.ps1 that will:

    - set the correct build action on PDE 
    - and open documentation on how to consume the exposed content.  

    Customize the following Install.ps1 script

    ```powershell

    param($installPath, $toolsPath, $package, $project)
    
    # set the build action for the pde to ExtensionResource
    $item = $project.ProjectItems.Item("Client").ProjectItems.Item("_extensions").ProjectItems.Item("Your Folder Name that nuproj puts the pde in").ProjectItems.Item("SomeExtension.pde") 
    $item.Properties.Item("ItemType").Value = "ExtensionReference"
    # open the documentation for consuming exposed content from the pde. use an aka.ms link so you can change out the target content without having to republish
    $DTE.ItemOperations.Navigate("http://aka.ms/portalfx/somepde")
    
    ```
 
- Now that the NuGet is created as part of your build you need to create a document for consuming the content exposed by the PDE

    - [Check your access to the doc repo portalfx-docs-pr](https://github.com/Azure/portalfx-docs-pr)
	
        - if you don’t have access follow the instructions [here](http://aka.ms/azuregithub) to enable 2FA on your github account and link your microsoft account
		- Then through [here](http://aka.ms/azuregithub) request access to portalfx-docs-pr

- The resulting NuGet is to be published from your official builds to [http://wanuget/Official/](http://wanuget/Official/). See OneBranch guidance to [publish your package](https://microsoft.sharepoint.com/teams/WAG/EngSys/Implement/OneBranch/Publish%20your%20package.aspx)
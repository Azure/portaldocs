<a name="portalcop"></a>
## PortalCop
The Portal Framework team has built a tool called PortalCop that can help reduce code size and remove redundant RESX entries.

<a name="portalcop-installing-portalcop"></a>
### Installing PortalCop

Run the following command in the NuGet Package Manager Console.

```
Install-Package PortalFx.PortalCop -Source https://msazure.pkgs.visualstudio.com/DefaultCollection/_packaging/Official/nuget/v3/index.json -Version 1.0.0.339
```

Or run the following in a Windows command prompt.

```
nuget install PortalFx.PortalCop -Source https://msazure.pkgs.visualstudio.com/DefaultCollection/_packaging/Official/nuget/v3/index.json -Version 1.0.0.339
```

<a name="portalcop-running-portalcop"></a>
### Running PortalCop

<a name="portalcop-running-portalcop-namespace-mode"></a>
#### Namespace Mode

NOTE: If you do not use AMD, please do not run this mode in your codebase.

If there are nested namespaces in code (for example A.B.C.D) the minifier will only reduce the top level (A) name, leaving all remaining names uncompressed.

Example of uncompressible code and minified version
        MsPortalFx.Base.Utilities.SomeFunction(); -> a.Base.Utilities.SomeFunction();

As you implement your extension using our Framework, you may have done some namespacing import to help achieve better minification, like this:
        Import FxUtilities = MsPortalFx.Base.Utilities;

which yields a better minified version
        FxUtilities.SomeFunction(); -> a.SomeFunction();

In the Namespace mode, the PortalCop tool will normalize imports to the Fx naming convention. It won’t collide with any predefined names you defined. Using this tool, we achieved up to 10% code reduction in most of the Shell codebase.

Review the changes after running the tool. Especially, be wary of string content changes. The tool does string mapping, not syntax based replacement.
 
```
   portalcop Namespace
```

<a name="portalcop-running-portalcop-resx"></a>
#### Resx

To reduce code size and save on localization costs, you can use the PortalCop RESX mode to find unused/redundant resx strings. 

```
To list unused strings:
   portalcop Resx
   
To list and clean *.resx files:
    portalcop Resx AutoRemove
```

Constraints:

- The tool may incorrectly flag resources as being un-used if your extension uses strings in unexpected formats. 
  For example, if you try to dynamically read from resx based on string values.
    
  Utils.getResourceString(ClientResources.DeploymentSlots, slot)));
  export function getResourceString(resources: any, value: string): string {
        var key = value && value.length ? value.substr(0, 1).toLowerCase() + value.substr(1) : value;
        return resources[key] || value;
   }

- You need to review the changes after running the tool and make sure that they are valid because of the above constraint.
- If using the AutoRemove option, you need to open up the RESX files in VisualStudio to regenerate the Designer.cs files.
- If you find any more scenarios that the tool incorrectly identifies as unused please report to [Ibiza Fx PM](mailto:ibizafxpm@microsoft.com)

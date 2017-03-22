<a name="the-pde-file"></a>
## The PDE File

You may not have noticed, but every time you build your project you're generating a .PDE file inside of the `\Client\_generated` directory. The PDE file contains a list of the parts which are exposed in the global scope, along with a few other pieces of metadata:

```json
{
  "extension": "HubsExtension",
  "version": "1.0",
  "sdkVersion": "1.0.8889.122 (rd_auxweb_n_f1(tomcox).130919-1440)",
  "schemaVersion": "0.9.1.0",
  "assetTypes": [
    {
      "name": "TagsCollection",
      "permissions": []
    }
    ...
  ],
  "parts": [
    {
      "name": "ChangeLogPart",
      "inputs": []
    },
    ...
  ],
  "blades": [
    {
      "name": "TagCollectionBlade",
      "keyParameters": [],
      "inputs": [],
      "outputs": []
    },
    ...
  ]
}
```

To share parts, blades, or asset types with another extension, **both extensions must be running in the same portal**. The sharing of parts occurs at runtime, which requires that both extensions be present within the shell for this technique to work.

<a name="importing-the-pde-file"></a>
## Importing the PDE file

After you've generated the PDE file, it needs to be added to the project of the extension that wishes to consume your parts. First, add the file to your project. Next, you need to make a manual change to your .csproj file. Instead of using the `<Content>` compile action, you need to change it to `<ExtensionReference>`. Right click on your project file, and choose 'Unload Project'. Next, right click the project file again, and choose 'Edit'. Find the PDE file reference, and change the compile action:

```xml
<ExtensionReference Include="Client\References\HubsExtension.pde" />
```

Save the file, right click on your project file, and choose 'Reload Project'.

<properties title="" pageTitle="Parameter collection" description="" authors="alvarorahul" />

As part of making PCv1/v2 legacy, we are making changes to limit the performance costs of this functionality to only extensions that are using them.

### If you’re not using parameter collector V1/V2
No action required. You can ignore this documentation.

### Extensions that do use PC v1/v2 
No changes needed for extension code being deployed to production. We improve the performance of extensions not using these features by skipping install of these scripts for them. In production, this happens automatically. However, there are some changes required while testing your extension.

#### If you’re running your extension locally
When you upgrade to the build that contains these changes, you will need to modify the call you make to PortalServer.RegisterExtension to include the obsoleteBundlesBitmask parameter like below.

```cs
shellServer.RegisterExtension(
  "SamplesExtension",
  "http://samplesextension.com",
  false, featuresToEnable,
  new List<string> {},
  extension.CloudName,
  obsoleteBundlesBitmask: 1);
```

#### If you’re side-loading your extension
You’ll need to add an additional attribute to the metadata being passed on to the shell like below.

```ts
MsPortalImpl.Extension.registerTestExtension({
    name: "SamplesExtension",
    uri: "http://samplesextension.com",
    obsoleteBundlesBitmask: 1
});
```

#### TypeScript UI test framework
When you set the test extensions for your tests, you need to add an attribute as shown below.

```ts
testFx.portal.portalContext.testExtensions = [{
  name: "SamplesExtension",
  uri: "https://onestb.cloudapp.net/Samples",
  obsoleteBundlesBitmask: 1
}];
```

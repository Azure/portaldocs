<a name="using-an-obsolete-bundle"></a>
## Using an obsolete bundle
Occasionally we will make certain parts of the portal legacy to limit the performance costs of the old functionality to only 
extensions that are using them.

Current list of obsoleted bundles:

| Bundle | Definition file | obsoleteBundlesBitmask flag |
| --- | --- | --- |
| Parameter collector V1/V2 | Obsolete0.d.ts | 1 |
| CsmTopology control | Obsolete1.d.ts | 2 |
| PairedTimeline control | Obsolete2.d.ts | 4 |

If you are one of the extensions that is still using an obsoleted bundle there's nothing you need to do to keep your extension 
running in production but there are a couple simple steps you'll need to follow when you compile or test your extension against 
an SDK that has the feature(s) you're using marked as obsolete.

<a name="using-an-obsolete-bundle-compiling"></a>
### Compiling
If you're still using view models in a bundle from MsPortalFx that has been obsoleted you'll need to reference the `.d.ts`
for the obsolete bundle as well as the normal `MsPortalFx.d.ts` file. The bundle (the name of which is in the table above) 
will be included in the SDK along side MsPortalFx.d.ts.

<a name="using-an-obsolete-bundle-testing"></a>
### Testing
<a name="using-an-obsolete-bundle-testing-if-you-re-running-your-extension-locally"></a>
#### If you’re running your extension locally
When you upgrade to the build that contains these changes, you will need to modify the call you make to PortalServer.RegisterExtension 
to include the obsoleteBundlesBitmask parameter like below. "and" the obsoleteBundlesBitmask flags you need (see table above) together 
to get the value to use:

```cs
shellServer.RegisterExtension(
  "SamplesExtension",
  "http://samplesextension.com",
  false, featuresToEnable,
  new List<string> {},
  extension.CloudName,
  obsoleteBundlesBitmask: 1);
```

<a name="using-an-obsolete-bundle-testing-if-you-re-side-loading-your-extension"></a>
#### If you’re side-loading your extension
You’ll need to add an additional attribute to the metadata being passed on to the shell like below.

```ts
MsPortalImpl.Extension.registerTestExtension({
    name: "SamplesExtension",
    uri: "http://samplesextension.com",
    obsoleteBundlesBitmask: 1
});
```

<a name="using-an-obsolete-bundle-testing-typescript-ui-test-framework"></a>
#### TypeScript UI test framework
When you set the test extensions for your tests, you need to add an attribute as shown below.

```ts
testFx.portal.portalContext.testExtensions = [{
  name: "SamplesExtension",
  uri: "https://onestb.cloudapp.net/Samples",
  obsoleteBundlesBitmask: 1
}];
```

<a name="using-an-obsolete-bundle-important-note"></a>
### Important note:
The framework is also setting this flag for you in the production `extensions.json` file. When your extension is no longer using 
an obsolete bundle please let the framework team know so that flag can be removed. This will give your extension the performance 
benefits that come along with no longer using the obsoleted code.

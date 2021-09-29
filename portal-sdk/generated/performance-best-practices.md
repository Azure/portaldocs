<a name="performance-best-practices"></a>
# Performance best practices

<a name="performance-best-practices-checklist"></a>
## Checklist

- Migrate to the [hosting service](top-extensions-hosting-service.md#extension-hosting-service)
- Enable [prewarming](https://aka.ms/portalfx/docs/prewarming), running your extension in a web worker
- Ensure your extension isn't using [shims](#extension-load-shim-dependencies-removing-shims)
- Migrate your extension to [dependency injection](performance-dependency-injection.md)
- Migrate your extension to [Fast extension load](performance-fast-extension-load.md)
- Ensure your extension isn't using [obsolete bundles](https://aka.ms/portalfx/obsoletebundles)
- Use the [Portal's ARM delegation token](#using-the-portals-arm-token)

<a name="performance-best-practices-operational-best-practices"></a>
## Operational best practices

- Enable performance alerts
  - To ensure your experience never regresses unintentionally, you can opt into configurable alerting on your extension, blade and part load times. See [performance alerting](index-portalfx-extension-monitor.md#performance)
- Move to [hosting service](portalfx-extension-hosting-service.md#extension-hosting-service)
  - We've seen every team who have onboarded to the hosting service get some performance benefit from the migration.
    - Performance benefits vary from team to team given your current infrastructure
    - We've commonly seen teams improve their performance by > 0.5s at the 95th
  - If you are not on the hosting service ensure;
      1. [Homepage caching](portalfx-performance-caching-homepage.md) is enabled
      1. [Persistent content caching](portalfx-extension-persistent-caching-of-scripts.md) is enabled
      1. [Compression](performance-using-v2-targets.md) is enabled
      1. Your service is efficiently geo-distributed (Note: we have seen better performance from having an actual presence in a region vs a CDN)
- Compression (Brotli)
  - Move to V2 targets to get this by default, see [V2 targets](performance-using-v2-targets.md)
- Remove controllers
  - Don't proxy ARM through your controllers
- Don't require full libraries to make use of a small portion
  - Is there another way to get the same result?
- If you're using iframe experiences
    1. Ensure you have the correct caching enabled
    1. Ensure you have compression enabled
    1. Your bundling logic is optimised
    1. Are you serving your iframe experience geo-distributed efficiently?

<a name="performance-best-practices-coding-best-practices"></a>
## Coding best practices

- Reduce network calls
  - Ideally 1 network call per blade
  - Utilise `batch` to make network requests, see our [batch documentation](https://aka.ms/portalfx/docs/batch)
- Remove automatic polling
  - If you need to poll, only poll on the second request and ensure `isBackgroundTask: true` in the batch call
- Remove all dependencies on obsoleted code
  - Loading any required obsoleted bundles is a blocking request during your extension load times
  - See https://aka.ms/portalfx/obsoletebundles for further details
- Use the Portal's ARM token
- Don't use old PDL blades composed of parts: [hello world template blade](portalfx-no-pdl-programming.md#building-a-hello-world-template-blade-using-decorators)
  - Each part on the blade has its own viewmodel and template overhead, switching to a no-pdl template blade will mitigate that overhead
- Use the latest controls available: see https://aka.ms/portalfx/playground
  - This will minimise your observable usage
  - The newer controls are AMD'd reducing what is required to load your blade
- Remove Bad CSS selectors
  - Build with warnings as errors and fix them
  - Bad CSS selectors are defined as selectors which end in HTML elements for example `.class1 .class2 .class3 div { background: red; }`
    - Since CSS is evaluated from right-to-left the browser will find all `div` elements first, this is obviously expensive
- Fix your telemetry
  - Ensure you are returning the relevant blocking promises as part of your initialization path (`onInitialize` or `onInputsSet`), today you maybe cheating the system but that is only hurting your users.
  - Ensure your telemetry is capturing the correct timings

<a name="performance-best-practices-general-best-practices"></a>
## General best practices

- Test your scenarios at scale
  - How does your scenario deal with 100s of subscriptions or 1000s of resources?
  - Are you fanning out to gather all subscriptions, if so do not do that.
    - Limit the default experience to first N subscriptions and have the user determine their own scope.
- Develop in diagnostics mode
  - Use https://portal.azure.com?trace=diagnostics to detect console performance warnings
    - Using too many defers
    - Using too many ko.computed dependencies
- Be wary of observable usage
  - Try not to use them unless necessary
  - Don't aggressively update UI-bound observables
    - Accumulate the changes and then update the observable
    - Manually throttle or use `.extend({ rateLimit: 250 });` when initializing the observable

<a name="performance-best-practices-using-the-portals-arm-token"></a>
## Using the Portals ARM Token

This request is a blocking call before your extension can start loading. This drastically hurts performance and even more so at the higher percentiles.

If you're migrating to use the Portals ARM Token please verify if you are relying on server side validation of the token first.

Below is an example PR of another team making this change.
[Example PR](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx/pullrequest/867497?_a=overview)

Ensure you verify:

- If you do not require your own token, and you currently aren’t relying on server side validation of the token you should be able to make the change easily.
- If you do require your own token, assess if that is necessary and migrate to the Portal’s token if possible.
- If you’re relying on server side validation, please update that validation to validate the Portal App Id instead – if that is sufficient for you.

To fix this it is a simple change to the Portal’s config here: [extensions.prod.json](https://aka.ms/portalfx/extensionsprodjson)
See below for further details.

Please send a pull request to the portal’s config with your change. Unfortunately, we don’t like to make config changes on behalf of extensions.

- To send a pull request first [create a work item](https://aka.ms/portalfx/configtask)
- Then create a new branch from that work item via the ‘create a new branch’ link
- Make your required changes in the correct files
- Send the PR and include GuruA and SanSom as the reviewers.

Please make this change in all applicable environments, dogfood, PROD, FF, BF, and MC.
The config files follow the naming convention of `Extension.*.json` – where * is the environment.

<a name="performance-best-practices-using-the-portals-arm-token-changes-required"></a>
### Changes required

You need to move the oAuthClientId and oAuthClientCertificate properties to be defined on the non-arm resourceAccess.
See the PR below for an example of these changes.
[Example PR](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx/pullrequest/867497?_a=overview)

<a name="performance-best-practices-extension-load-shim-dependencies-removing-shims"></a>
## Extension load shim dependencies removing shims

Extension load shim dependencies are dependencies that are hardcoded into your require config to be downloaded and executed before any other script can be executed.
Because of the way shims work in requireJS, no assumption can be made about their usage and you end up blocking download and execution of any dependent script until
shims are all fully downloaded and executed. For most extensions today, at best (latest SDK), what this translates to is a shim bundle being downloaded concurrently
 with your extension's entrypoint bundle, meaning a blocking download of OSS libraries that delays any work to initialize your extension.

<a name="performance-best-practices-extension-load-shim-dependencies-removing-shims-how-to-fix-shim-usage"></a>
### How to fix shim usage

To fix this, you have a few options:

1. Reevaluate the need for that library
    - We've seen giant OSS libraries being pulled for very little functionality that the Portal actually provided or that could have been extracted/reimplemented with way less code downloaded, so confirming you really need said library is the first thing you should look into.
1. Convert the library to an AMD module
    - By converting the library to an AMD module and adding an amd-dependency tag to files that really need it, you enable the Portal's bundler to bundle said library with its owners (saving a network round-trip) and you move it out of the extension init path.

<a name="performance-best-practices-extension-load-shim-dependencies-removing-shims-how-to-fix-shim-usage-converting-your-shim-to-an-amd-module"></a>
#### Converting your shim to an AMD module

Converting your OSS library to an AMD module is very straightforward in most cases.
What you want to do is wrap all of the library’s code with a define statement like this:

```typescript
    define([], function() {
        /** OSS code here **/
    });
```

Taking an actual file as an example, here's the diff for the hammer.js OSS library:

```txt
    --------------------------------------------------------------------------
    4    4       * Copyright (c) 2014 Jorik Tangelder <j.tangelder@gmail.com>;
    5    5       * Licensed under the MIT license */

         7     + define([], function () {
    7    8       (function (window, undefined) {
    8    9           'use strict';

    10   11          /**
    --------------------------------------------------------------------------
    2156 2157        window.Hammer = Hammer;

    2158 2159    })(window);
    2159 2160  + });
    --------------------------------------------------------------------------
```

The next step is to add an amd-dependency tag to all the files that use the aforementioned OSS library so that the TypeScript to JavaScript transpilation generates an explicit dependency for it.

Simply insert:

```typescript
/// <amd-dependency path="dependencyPath" />
```

At the top of your file, where dependencyPath is the path to your AMD OSS library. For hammer.js:

```typescript
/// <amd-dependency path="hammer" />
```

Finally, since the bundler will now automatically pick up the library’s file and bundle it properly, you can remove the shim code from your C#; you can find said code by looking for derived classes of ContentBundleDefinition.

This should cover the vast majority of shim-to-AMD conversion cases.
For more information, please create a stack overflow question (https://aka.ms/portalfx/ask) and reach out to ibizaperfv@microsoft.com.

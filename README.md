# Azure portal extension development documentation

This is the home page for all documentation related to onboarding, designing, developing, operating, and anything else to do with owning an Azure portal extension.

Couldn't find what you needed? [Ask about the docs on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-missing-docs).

## Onboarding a new extension

* [Overview / Get started](/portal-sdk/generated/top-onboarding.md)

* [Steps that do not involve the Ibiza team](/portal-sdk/generated/top-extensions-onboarding-with-related-teams.md)

* [Managing cloud/environment specific configuration](/portal-sdk/generated/top-extensions-configuration.md)

* [Production-ready metrics](/portal-sdk/generated/top-extensions-production-ready-metrics.md)

* [Partner feature request process](/portal-sdk/generated/top-extensions-partner-request.md)

Kickoff the onboarding experience by sending a mail to <a href="mailto:ibiza-onboarding@microsoft.com?subject=Kickoff Meeting Request&body=My team would like to meet with you to learn about the Azure onboarding process.">Azure Onboarding Team</a>.

## Azure portal architecture

Learn how the framework is structured and how it is designed to run in multiple clouds / environments.

* [Architecture overview](/portal-sdk/generated/top-extensions-architecture.md)

* [Authentication flow](/portal-sdk/generated/top-extensions-authentication-flow.md)

* [Authentication procedures](/portal-sdk/generated/top-extensions-authentication-procedures.md)

<!--
## What's new

* [No-PDL blades and parts](/portal-sdk/generated/top-extensions-no-pdl.md)- *Reduces the number of files and concepts to build UI*

* [Forms without edit scope](/portal-sdk/generated/top-editscopeless-forms.md) - *More intuitive APIs for building forms*

* [EditableGrid V2](/portal-sdk/generated/top-extensions-grids.md) - *Improved APIs designed to work with new forms*

* [Extension availability alerts](/portal-sdk/generated/top-extensions-telemetry-alerting.md) - *Get notified if your extension goes down*

* [Actionable notifications](/portal-sdk/generated/top-extensions-notifications.md) - *Point users to well known next steps*

* [EV2 support for the Extension Hosting Service](/portal-sdk/generated/top-extensions-hosting-service-ev2.md) - *Nuff said*

* [Multi-Column for the Essentials control](/portal-sdk/generated/) - *Better use of screen real estate*

* [TreeView improvements](/portal-sdk/generated/) - *Checkboxes, commands, and Load More / Virtualization*

-->

## Design guide

Design patterns provide solutions for common Azure scenarios. By leveraging these patterns, Azure teams will accelerate extension development and provide users with a familiar experience so that users can easily adopt new Azure services. The design guide covers [design toolkits, style guidance](/portal-sdk/generated/top-design.md#design-toolkits-and-resources), [common page layouts](/portal-sdk/generated/top-design.md#page) and [the resource management pattern](/portal-sdk/generated/top-design.md#resource-management).

* [Design guide](/portal-sdk/generated/top-design.md)

* [Responsive design guide](/portal-sdk/generated/top-design-responsive.md)

## Development guide

### Getting started

If you are building a new extension, consider building a declarative extension.  A declarative extension is easier to build and cheaper to maintain. Learn more [here](/portal-sdk/generated/top-declarative.md).

Azure portal extension development is supported on Windows Server 2012 R2, and Windows 10.

* [Downloads](/portal-sdk/generated/downloads.md)

* [Release notes](/portal-sdk/generated/breaking-changes.md)

* [Breaking changes](/portal-sdk/generated/breaking-changes.md)

* [Install the CLI](/portal-sdk/generated/top-ap-cli.md#setup-and-installation)

* [Get started](/portal-sdk/generated/top-extensions-getting-started.md)

* [Updating the SDK](/portal-sdk/generated/top-extensions-packages.md#updating-your-extension-to-a-newer-version-of-the-sdk) or  [Ask an SDK setup question on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-sdkupdate)

* [Running your extension locally (a.k.a. sideloading)](/portal-sdk/generated/top-extensions-sideloading.md)

* [Add auto-generated views & asset definitions into your extension](/portal-sdk/generated/top-extensions-autogeneration.md)

### Azure Portal Extension Developer CLI

The Azure portal extension developer CLI, namely `ap`, is the foundational tool used for all inner dev/test loop actions during extension development and includes commands such as new, restore, build, serve, start, release, lint, run test, watch and update.

* [CLI Overview](/portal-sdk/generated/top-ap-cli.md#cli-overview)

* [Setup and Installation](/portal-sdk/generated/top-ap-cli.md#setup-and-installation)

* [Basic Workflows](/portal-sdk/generated/top-ap-cli.md#basic-workflows)

* [Command Reference](/portal-sdk/generated/top-ap-cli.md#command-reference)

* [Linting directly within VS Code](/portal-sdk/generated/top-ap-cli.md#linting-directly-within-vscode)

* [Customizing Lint Rules](/portal-sdk/generated/top-ap-cli.md#customizing-lint-rules)

* [Extending the cli with your teams own commands](/portal-sdk/generated/top-ap-cli.md#extending-the-cli-with-your-teams-own-commands)

* [Overriding the behavior of existing commands](/portal-sdk/generated/top-ap-cli.md#overriding-the-behavior-of-existing-commands)

* [Contributions and Feedback](/portal-sdk/generated/top-ap-cli.md#contributions-and-feedback)

* [FAQ](/portal-sdk/generated/top-ap-cli.md#faq)

### Samples

Samples show how to do many common development tasks.

* [Samples](/portal-sdk/generated/top-extensions-samples.md)

### Blades

The primary UI building block is a called a blade. A blade is like a page. It generally takes up the full screen, has a presence in the portal breadcrumb, and has an 'X' button to close it.

* [Overview](/portal-sdk/generated/top-extensions-blades.md)

* [Declarative Views](/portal-sdk/generated/top-declarative.md)

* [React Views](/portal-sdk/generated/react-index.md)

* [TemplateBlade](/portal-sdk/generated/top-blades-templateblade.md)

* [MenuBlade](/portal-sdk/generated/top-blades-menublade.md)

* [ResourceMenuBlade](/portal-sdk/generated/top-blades-resourcemenublade.md)

* [FrameBlade](/portal-sdk/generated/top-blades-frameblade.md)

* [Advanced TemplateBlade topics](/portal-sdk/generated/top-blades-advanced.md)

* [Blade with tiles](/portal-sdk/generated/top-blades-legacy.md)

[Ask a question about blades on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-blades-parts)

### UX Auto Generation (Generated UX)

Save development time by making use of auto-generated artifacts in your extension. If your resource provider has published Azure REST API specs [(check here)](https://github.com/Azure/azure-rest-api-specs), we likely have asset definitions and views already generated for your resource types. Please [browse the GeneratedExtension repo ](https://msazure.visualstudio.com/One/_git/AzureUX-GeneratedExtension?path=/src/views) for generated views and asset definitions or click link below to get started.

[Learn more about UX Auto Generation here](/portal-sdk/generated/top-extensions-autogeneration.md)

### Parts

If you want your experience to have a presence on Azure dashboards then you will want to build parts (a.k.a. tiles).

* [Developing parts](/portal-sdk/generated/top-extensions-parts.md)

[Ask a question about parts on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-blades-parts)

### Navigation

Navigating between topics or other resources is a core element of interactivity with the portal.

* [Opening and closing blades programmatically](/portal-sdk/generated/top-blades-opening-and-closing.md)

[Ask a question about navigation on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-blades-parts)

### Focus management

While the portal does autofocus management with default rules that should match most scenarios, sometimes it is better for extension to guide the focus to an appropriate location.

* [How focus is managed and how to set focus programmatically](/portal-sdk/generated/top-blades-focus-management.md)

[Ask a question about focus management on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-blades-parts)

### Building UI with HTML templates and Fx controls

Any template based UI in the portal (e.g. template blades or template parts can make use of a rich controls library maintained by the Ibiza team.

* [Controls overview](/portal-sdk/generated/top-extensions-controls.md)

* [Controls list and design guidance](/portal-sdk/generated/design-patterns-controls.md)

* [Controls playground](/portal-sdk/generated/top-extensions-controls.md#the-controls-playground)

[Ask a controls related question on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-controls)

### Styling and theming

When using HTML and framework controls you have some control over styling. These documents walk through the relevant topics.

* [Styling and theming](/portal-sdk/generated/top-extensions-styling.md)

* [HTML, CSS, and SVG sanitization](/portal-sdk/generated/top-extensions-styling.md#html-css-and-svg-sanitization)

* [Adding custom CSS](/portal-sdk/generated/top-extensions-styling.md#adding-custom-css)

* [Blade Layout patterns](/portal-sdk/generated/top-extensions-styling.md#blade-layout-patterns)

* [Theming](/portal-sdk/generated/top-extensions-styling.md#theming)

* [Typography](/portal-sdk/generated/top-extensions-styling.md#typography)

* [Iconography](/portal-sdk/generated/top-extensions-styling.md#iconography)

* [Printing](/portal-sdk/generated/top-extensions-printing.md)

### Forms

Many experiences require the user to enter data into a form. The Ibiza controls library provides support for forms. It also provides a TypeScript based section model that lets you build your form in code without expressing all the fields in an html template.

* [Develop forms](/portal-sdk/generated/top-extensions-forms.md)

[Ask a forms related question on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-forms)

### Common scenarios and integration points

* [Blades that create or provision resources and services](/portal-sdk/generated/top-extensions-create.md)

* [Add your resource or service into the 'All services' (browse) menu](/portal-sdk/generated/top-extensions-browse.md)

[Ask about browse integration on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-browse)

[Ask about create scenarios on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-create)

### Other UI concepts

* [Context panes](/portal-sdk/generated/top-extensions-context-panes.md)

* [Dialogs](/portal-sdk/generated/top-extensions-dialogs.md)

* [Notifications](/portal-sdk/generated/top-extensions-notifications.md)

* [Iris Notifications](/portal-sdk/generated/portalfx-notifictions-iris.md)

### Loading and managing data

Because your extension is Web code, you can make **AJAX** calls to various services to load data into your UI. The framework provides a data library you can use to manage this data.

* [Making authenticated and batched calls to Azure Resource Manager (ARM) and other endpoints](/portal-sdk/generated/top-extensions-data-ajax.md)

* [Legacy data management features](/portal-sdk/generated/top-legacy-data.md)

[Ask about data management on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-data-caching)

### Advanced development topics

* [Memory management (LifetimeManager)](/portal-sdk/generated/top-extensions-lifetime.md)

* [Sharing blades and parts across extensions](/portal-sdk/generated/top-extensions-sharing-blades-and-parts.md)

* [Custom domains (e.g. aad.portal.azure.com)](/portal-sdk/generated/top-extensions-custom-domains.md)

* [Persistent Storage](/portal-sdk/generated/persistent-storage.md)

## Debugging

* [Using debug mode](/portal-sdk/generated/top-extensions-debugging.md#debug-mode)

* [Debugging extension load failures](/portal-sdk/generated/top-extensions-debugging.md#debug-extension-load-failures)

* [Debugging console errors](/portal-sdk/generated/top-extensions-debugging.md#debug-console-errors)

* [Debugging javascript](/portal-sdk/generated/top-extensions-debugging.md#debug-javascript)

* [Debugging knockout](/portal-sdk/generated/top-extensions-debugging.md#debug-knockout)

* [Debugging the data stack](/portal-sdk/generated/top-extensions-debugging.md#debug-the-data-stack)

## Performance

* [Performance profiling](/portal-sdk/generated/top-extensions-performance.md)

## Testing

The Ibiza team provides limited testing support. Due to resource constraints the C# and Node.js frameworks are inner source, so that partners can unblock themselves if the Ibiza team cannot make requested improvements as quickly as you might expect.

* [Unit testing support](/portal-sdk/generated/top-extensions-unit-test.md)

* [Node.js test framework (Inner source)](/portal-sdk/generated/top-extensions-node-js-test-framework.md)

* [C# test framework (Inner source)](/portal-sdk/generated/top-extensions-csharp-test-framework.md)

When asking for assistance with a debugging UI (not unit test) test framework specific issues on stackoverflow, please include the following (if applicable):

* Screenshot of the test as it fails taken via the portal.takeScreenshot()/webdriver.takeScreenshot() API (usually via a try/catch block)
* Call stack
* Exception message
* Code snippet where the test is failing
* Version of the test framework being used

[Ask a test-related question on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-test)

## Telemetry and alerting

The Ibiza team collects standard telemetry for generic actions like blade opening and command execution. We also collect performance, reliability, and user feedback information that facilitates the operation of your extension. You can also write your own events by using the telemetry system. Ibiza supports alerting for common operations scenarios.

* [Portal telemetry overview](/portal-sdk/generated/top-telemetry.md)

* [Set up and verify telemetry logging from your extension](/portal-sdk/generated/top-telemetry.md#logging-telemetry)

* [Getting access to raw portal telemetry data](/portal-sdk/generated/top-telemetry.md#viewing-telemetry)

* [Consuming telemetry via pre-built Power BI dashboards](/portal-sdk/generated/top-telemetry.md#power-bi-reports)

* [Performance and reliability monitoring](/portal-sdk/generated/top-telemetry-alerting.md)

[Ask about telemetry on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-telemetry)

[Ask about performance and reliability on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-performance)

## Experimentation and flighting

It is common for teams to want to experiment with new capabilities. We offer framework features that make this possible.

* [Flighting a new version of your extension in MPAC](/portal-sdk/generated/top-extensions-flighting.md)

* [Feature flags to enable or disable individual features within an environment](/portal-sdk/generated/top-extensions-flags.md)

## Localization and globalization

The Azure portal supports multiple languages and locales. You will need to localize your content.

* [Localization overview and supported languages](/portal-sdk/generated/top-extensions-localization-globalization.md)

* [Setting up localization for your extension](/portal-sdk/generated/top-extensions-localization-globalization.md#localizing-build)

* [Setting up localization for your gallery package](/portal-sdk/generated/top-extensions-localization-globalization.md#marketplace)

* [Testing localization with side-loading](/portal-sdk/generated/top-extensions-localization-globalization.md#testing-localization)

* [Handling localization for links to documentation](/portal-sdk/generated/top-extensions-localization-globalization.md#handling-localization-for-links-to-documentation)

* [Formatting numbers, currencies and dates](/portal-sdk/generated/top-extensions-localization-globalization.md#formatting-numbers-currencies-and-dates)

[Ask about localization / globalization on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-localization-global)

## Accessibility

The Azure Portal strives to meet high accessibility standards to ensure the product is accessible to to users of all levels of ability. There is regular testing and a process with SLAs for getting issues addressed quickly.

* [Accessibility guidelines](/portal-sdk/generated/top-extensions-accessibility.md)

* [Accessibility testing and SLAs](/portal-sdk/generated/top-extensions-accessibility.md#accessibility-planning)

[Ask about accessibility on StackOverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-accessibility)

## Deploying your extension

Learn how to deploy your extension to the various clouds and environments.

* [Extension registration, environments, clouds and Ibiza team SLAs](/portal-sdk/generated/top-extensions-publishing.md)

* [Moving an extension from private preview to public preview to GA](/portal-sdk/generated/top-extensions-developmentPhases.md)

[Ask a deployment question on Stackoverflow](https://stackoverflow.microsoft.com/questions/tagged/ibiza-deployment)

### Deployment using the Extension Hosting Service

The Ibiza team provides and operates a common Extension Hosting Service that makes it easy to get your bits into a globally distributed system without having to manage your own infrastructure.

* [Extension Hosting Service overview](/portal-sdk/generated/top-extensions-hosting-service.md)

* [Onboarding your extension to the Extension Hosting Service](/portal-sdk/generated/top-extensions-hosting-service.md#step-by-step-onboarding)

* [Registring your extension with the Extension Hosting Service](/portal-sdk/generated/top-extensions-hosting-service.md#step-9-registering-your-extension-with-the-hosting-service)

* [Deploying a new version of an extension](/portal-sdk/generated/top-extensions-hosting-service.md#deploying-a-new-version-of-an-extension)

* [Deploying your extension using Express V2 and the Extension Hosting Service](/portal-sdk/generated/top-extensions-hosting-service-ev2.md)

* [SLA for registering an extension with the Extension Hosting Service](/portal-sdk/generated/top-extensions-svc-lvl-agreements.md)

### Custom extension deployment infrastructure

You should strive to use the Extension Hosting Service. If for some reason this is not possible then [learn how to build a custom extension deployment infrastructure](/portal-sdk/generated/top-extensions-custom-deployment.md).

## Legacy features

These features are supported, but have had no recent investment. No additional investment is planned. There are modern capabilities that should be used instead if you are developing new features.

* [PDL-based programming](/portal-sdk/generated/top-legacy-blades-template-pdl.md)

* [Legacy parts](/portal-sdk/generated/top-legacy-parts.md)

* [Legacy data management feature](/portal-sdk/generated/top-legacy-data.md)

* [Controls in the MsPortalFx namespace](/portal-sdk/generated/top-extensions-samples-controls-deprecated.md)

* [EditScope](/portal-sdk/generated/top-legacy-editscopes.md)

## Marketplace/Gallery developer resources

1. [Gallery overview](/gallery-sdk/generated/index-gallery.md#gallery-overview)

1. [Gallery item specifications](/gallery-sdk/generated/index-gallery.md#gallery-item-specificiations)

1. [Gallery item metadata](/gallery-sdk/generated/index-gallery.md#gallery-item-metadata)

1. [Gallery item field to UI element mappings](/gallery-sdk/generated/index-gallery.md#gallery-item-field-to-ui-element-mappings)

1. [Gallery package development and debugging](/gallery-sdk/generated/index-gallery.md#gallery-package-development-and-debugging)

1. [Legacy OneBox development approach](/gallery-sdk/generated/index-gallery.md#legacy-onebox-development-approach)

1. [Using the "Add to Resource" blade](/gallery-sdk/generated/index-gallery.md#using-the-add-to-resource-blade)

1. [Your icon tile for the Azure store](/gallery-sdk/generated/index-gallery.md#your-icon-tile-for-the-azure-store)

1. [Developer tooling and productivity](/gallery-sdk/generated/index-gallery.md#developer-tooling-and-productivity)

1. [Gallery frequently asked questions](/gallery-sdk/generated/index-gallery.md#gallery-frequently-asked-questions)

This is our new index which contains our refreshed docs. If you do not like our new index/docs, you can find the old index [here](old-README.md).

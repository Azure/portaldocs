<a name="fequently-asked-questions"></a>
# Fequently asked questions

<a name="fequently-asked-questions-how-do-i-onboard"></a>
## How do I onboard?

1. Follow the steps provided in the other links

<a name="fequently-asked-questions-how-do-i-know-my-extension-s-current-configuration"></a>
## How do I know my extension&#39;s current configuration?

Alerting is running off customization JSONs that live in [Azure Portal Alerting Repo a.k.a. Alerting Repo][alerting-dev-ops]. All the non-create alerts customimzation JSONs are located at products/{YourServiceNameInIcM}/{ExtensionName}.alerting.json. All the create alerts customization JSONs are located at products/IbizaFx/Create/{ExtensionName}.create.alerting.json.

<a name="fequently-asked-questions-what-happens-if-i-need-to-update-my-configuration"></a>
## What happens if I need to update my configuration?

Submit and complete a Pull Request on your extension's customization JSON in [Alerting Repo][alerting-dev-ops]. The update is 'live' once the Pull Request is complete.
> For each extension there's an owners.txt that is in the same or parent folder as the JSON. The owners.txt has AAD enabled email alias or/and individual MSFT aliases. Anyone from owners.txt can approve the Pull Request. The owners.txt is created and maintained by extension team.

<a name="fequently-asked-questions-questions-and-suggestions"></a>
## Questions and suggestions?
Contact [Azure Ibiza Fx Gauge Team](mailto:azurefxg@microsoft.com).

[alerting-dev-ops]: https://msazure.visualstudio.com/One/_git/AzureUX-PortalFX-Alerting
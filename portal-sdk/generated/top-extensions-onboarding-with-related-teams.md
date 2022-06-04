<a name="onboard-with-related-teams"></a>
## Onboard with related teams

Onboarding to Azure is a big task that spans many teams. The doc you're reading will help you onboard to the portal, but there are many other teams you will need to work with to get your entire service up and running. These include, but are not limited to the following:

**NOTE:**  Contact information for these teams is [available here](https://aka.ms/portalfx/onboarding/partners)

1. Azure Resource Manager Team

    Reach out to this team to onboard your resource provider.
    <!--TODO: Locate distribution list for this purpose.  -->

1. Azure Marketing Team


1. Support Team

   For integrating with the support system and UX integration.

1. Azure.com team

   For a presence on the marketing site.

1. Billing team

   To register meters and other billing related activities.

1. AAD onboarding

   Reach out to AAD onboarding if the new extension service needs special permissions besides just calling your own resource provider servers. If the extension requires additional built-in support for standard Graph or ARM APIs, submit a partner request here: [https://aka.ms/portalfx/uservoice](https://aka.ms/portalfx/uservoice).

1. Azure fundamentals and compliance

   The Azure Fundamentals are a set of tenets to which each Azure service is expected to adhere. The Azure Fundamentals program is described in the document here: [https://aka.ms/azurefundamentals](https://aka.ms/azurefundamentals). That document also identifies the stakeholders and contacts for each of the tenets.

1. Security and privacy reviews

1. Start the CSS onboarding process with the CSS team at least three months prior to public preview. This process may coincide with the following step. For more information about development phases, see [top-extensions-developmentPhases.md](top-extensions-developmentPhases.md).

1. Nearly 70% of Azure users are from outside of the United States. Therefore, it is important to make Azure a globalized product. There are a few requirements under the "Internationalization" criteria that your extension is required to support. This is the same set of languages that are supported by Azure Portal for GA. For more information about internationalization requirements, see [https://aka.ms/AzureGR](https://aka.ms/AzureGR). For onboarding localization, please reach out to Bruno Lewin and the <a href="mailto:ibiza-interntnl@microsoft.com?subject=Onboarding localization">Internationalization team</a>.

1. Decide on a name and any URLs for the extension. You may need to contact <a href="mailto:ibiza-onboarding@microsoft.com?subject=Name and URLs for new Extension">ibiza-onboarding@microsoft.com</a> to ensure that the name and URLs are unique.

1. Schedule a UX feasibility review with the Ibiza team UX contact by emailing <a href="mailto:ibiza-onboarding@microsoft.com?subject=Extension Feasibility Review">ibiza-onboarding@microsoft.com</a>.  Many extensions have been made more successful by setting up early design reviews with the Azure Portal team. Taking the time to review the design gives extension owners an opportunity to understand how they can leverage Azure Portal design patterns, and ensure that the desired outcome is feasible.

While the portal team cannot help directly with all of these factors, see [portalfx-extensions-contacts.md](portalfx-extensions-contacts.md) for a list of items with which we can assist you.

For less common scenarios, you might need to do a custom deployment. For example, if your extension needs to reach server services using certificate-based authentication, then there would be controller code on the server that our hosting service does not support. You should make certain that a custom hosting solution is the correct solution prior to developing one.

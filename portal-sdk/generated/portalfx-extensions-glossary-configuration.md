<a name="glossary"></a>
## Glossary

This section contains a glossary of terms and acronyms that are used in this document. For common computing terms, see [https://techterms.com/](https://techterms.com/). For common acronyms, see [https://www.acronymfinder.com](https://www.acronymfinder.com).

<!-- TODO:  Determine the difference between a branch, a region, and an environment. If they are not  completely interchangeable, then we can standardize usage. -->

| Term                     | Meaning |
| ---                      | --- |
| branch | A collection of code in a content management system. |
| branch | The five Azure environments  in which extensions are run.  They are: Dogfood, FairFax, Mooncake, and the Production Release Candidate(s). |
| build verification test  | A subset of regression testing, this is a set of non-exhaustive tests that verify whether the most important application functions work. Its results are used to determine whether a build is stable enough to proceed with further testing. |
| BVT                      | Build Verification Test |
| cherry-pick              | Apply the changes introduced by an existing GitHub commit. |
| CDN                      | Content Delivery Network |
| CNAME                    | Canonical Name record. A type of resource record in the Domain Name System (DNS) that specifies that a domain name is an alias for another domain (the 'canonical' domain). |
| DF                       | Dogfood |
| DIY                      | Do It Yourself |
| environment              | A configuration of computers in which extensions can be run. For example, environments are Dogfood, Mooncake, and Production.  |
| feature flag             | A switch that allows a user to turn on or off specific functionalities of an extension. Flags are  passed from the Portal to extensions and their controllers, and are used as an alternative to maintaining multiple source-code branches in order to hide, enable or disable a feature during run time. Most, but not all, feature flags are made available by using the syntax `feature.<featureName> = true`.   |
| FF                       | Fairfax |
| flighting                | The process of directing Internet traffic to various editions of an extension, as specified by stamps that represent different stages or regions, or by friendly names. |
| GA                       | Global Availability |
| iframe                   | An inline frame, used to embed another document within the current HTML document. |
| MC                       | Mooncake |
| MPAC                     | ms.portal.azure.com, the Azure Portal instance for internal Microsoft customers.  |
| PCV1                     | Parameter Collector V1 |
| PCV2                     | Parameter Collector V2 |
| PDL                      | Program Design Language |
| preview                  | The development phase that is used by the developer and a small audience to validate the functionality of an extension. |
| PROD                     | Production |
| region                   | The area in the world that that is served by a specific localization site. |
| RC                       | Release Candidate environment, used to deploy daily builds of the Azure Portal. There is no user traffic in this environment. |
| RP                       | Resource Provider |
| SLA                      | Service Level Agreement |
| smoke test               | see build verification test  |
| SSL                      | Secure Socket Layer |
| stakeholder              | A person, group or organization that has interest or concern in an organization. Stakeholders can affect or be affected by the organization's actions, objectives and policies. |
| stamp                    | An instance of a service in a region. Every extension can deploy one or more extension editions based on testing requirements. The main extension is used for production and is the only one that the Portal will load by default. Also known as configuration or configuration file.   |
| URI                      | Universal Resource Identifier  |
| URL                      | Uniform Resource Locator |

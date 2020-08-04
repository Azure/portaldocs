<a name="how-to-link-to-external-domains"></a>
# How to link to external domains

<a name="how-to-link-to-external-domains-understanding-navigation"></a>
## Understanding navigation

The framework provides a few ways to navigate within the Azure Portal, via the open blade APIs, or by providing relative links
to navigate to well-known locations in the Portal.

It is also possible to provide absolute URIs used for links to external domains. They can be provided from within the HTML templates of blades and parts (for example using an `<a>` tag), as well as by using some APIs in the framework that take a link (for example by providing a `ClickableLink` to the onClick handler of the Essentials control).

Absolute links are sanitized automatically in most kinds of blades and parts. Nevertheless, extension developers are required to explicitly call sanitization APIs for React Views and FrameBlade/FramePart (because the extension is in full control of the rendering in these).

<a name="how-to-link-to-external-domains-understanding-link-sanitization"></a>
## Understanding link sanitization

The absolute-link sanitization process consists of the following:

1. If the link refers to `https://docs.microsoft.com` or `https://aka.ms`, the sanitizer will keep the link as is in public versions of the Portal, or automatically transform those links to point to the Government Clouds' approved deployment of those same services, when the Portal is running in any of these environments.
2. Detect if the link is to one of the trusted domains configured in the global allow-list, or the extension-specific allow-list (if available). Notice that these allow lists depend on the environment (aka the domain) where the Portal is running.
    - If it's part of an allow list, then the link is rendered as is.
    - If it's not part of an allow list, the link will point to a confirmation page, prompting the user to explictly acknowledge redirecting to an external site. This requirement is especially important for JEDI compliance.
   For example, a template with the following:

    ```html
    <a href="https://bing.com/path">Go to other site</a>
    ```

    will be replaced with something similar to:

    ```html
    <a href="https://portal.azure.com/verifyLink?href=https%3A%2F%2Fbing.com%2Fpath&id=HubsExtension">Go to other site</a>
    ```

<a name="how-to-link-to-external-domains-global-allow-list-of-trusted-domains-used-for-linking"></a>
## Global allow-list of trusted domains used for linking

There is a small list of trusted domains for linking without any user confirmation. This list applies to all links, even if there is also an extension-specific list defined.

One notable entry in the allow list is the Portal origin (such as `portal.azure.com`). Nevertheless it is recommended to use relative links (or open blade APIs) for linking within the Portal. Absolute links that refer to `portal.azure.com` will not be automatically converted to be relative if the linking occurs in a different Portal environment. For example, when linking to `portal.azure.com` from the `ms.portal.azure.com` environment, this will require confirmation from the end-user, and it's especially important when the linking occurs from a Government cloud (to avoid any accidental cross-cloud navigation). This is the main reason why relative URIs would be preferred for these, and only use absolutely links when it is expected to navigate to a specific version of the Portal, regardless of where the link resides.

<a name="how-to-link-to-external-domains-extension-specific-allow-list-of-trusted-domains-used-for-linking"></a>
## Extension-specific allow-list of trusted domains used for linking

Each extension can configure an allow-list with a set of domains that shouldn't require explicit user confirmation. This configuration is per environment.
> NOTE: It is important that this list is not abused and it should be especially important to limit the domains defined for the Government clouds, which have a stricter set of requirements and documentation processes.

To add domains to the extension-specific allow-list, define the `trustedDomainLinks` environment variable (of type `string[]`) on each of the environments where the domain should be trusted. For instructions on how to configure this variable on each environment see [Step 5: Environment specific configuration files](./top-extensions-hosting-service.md#step-5-environment-specific-configuration-files).

The list is an array of strings that should contain the exact domain that is trusted (without the `https://` scheme). If all subdomains are trusted, you can prefix the domain with the `*.` wildcard. Notice that prefixing with `*.` is the only location where the wildcard will be treated as such (no other expansion of wildcards is supported).
Here is an example of an allow-list in the configuration file:

```json
{
    "trustedLinkedDomains": [
        "extensionsiteexample.com",
        "*.subdomainsallowedexample.com"
    ]
}
```

> NOTE: `aka.ms` and `go.microsoft.com` domains *should never* be defined in the allow-list. The Portal team is working on a feature that will automatically redirect to the final target link if the `aka.ms` link refers to a domain in the allow-list (current behavior is that it will always prompt for user confirmation).

Please be careful not to add a wildcard for all sub-domains if those shouldn't be accessed from all environments.

<a name="how-to-link-to-external-domains-sanitizing-external-links-in-frameblade-and-framepart"></a>
## Sanitizing external links in FrameBlade and FramePart

For blades and parts that control their own rendering because they run in a visible IFrame (such as FrameBlade and FramePart), the extension developer is responsible for the sanitization of links in order to be JEDI compliant.
The easiest way is to do this is to always redirect to the link verification page when linking to an external domain. For example:

```ts
const externalUri = "https://bing.com";
const sanitizedUri = `${trustedAuthority}/verifyLink?href=${encodeURIComponent(externalUri)}&id=MyExtensionName`;
```

> NOTE: Depending on how the Frame blade or part is set up, there are different ways of getting the trustedAuthority (which is part of the querystring of the IFrame src).

It's important to pass the correct extension name in the `id` querystring parameter, as this will be used for telemetry and to use the correct extension-specific allow-list if one is available.

> NOTE: currently the verify page will always prompt for user confirmation, even if the target is to a trusted domain, but the Portal team will soon enable automatic redirecting for these cases.

<a name="how-to-link-to-external-domains-sanitizing-links-in-react-views"></a>
## Sanitizing links in React Views

TBD: The Portal team will soon create a React component to automatically sanitize an external link.

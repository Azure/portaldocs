<a name="onboarding-third-party-extensions"></a>
# Onboarding Third-Party Extensions

<a name="onboarding-third-party-extensions-overview"></a>
## Overview

It is important to read this guide carefully, as we rely on you to manage the extension registration-configuration management process in the Portal repository. 

**NOTE**: All third-party extensions must be approved by <a href="mailto:ibiza-onboarding@microsoft.com?subject=Third%20Party%20Applications%20(External%20partners)">Leon Welicki and Adam Abdelhamed</a> before any work can commence on the extension. Please schedule time with them to discuss the details about the extension and get an approval. 


When you receive the approval, you can submit a third-party request by reaching out to <a href="mailto:ibizafxpm@microsoft.com?subject=New%20Third%20Party%20Extension%20Onboarding%20Request&body=Extension%20name:%20%20&lt;ExtensionName_Extension&gt;%20%20%0D%0A%20%0D%0AURLs:%20%20(must%20adhere%20to%20pattern)%20%20%0D%0A%20%0D%0APROD:%20%20%20&lt;extensionprefix&gt;.hosting.portal.azure.net%20%0D%0A%20%0D%0AContact%20info:%20%20&lt;email%20address%20of%20a%20team%20containing%20dev%20and%20support%20contacts%20for%20incidents%20related%20to%20extension>%20%0D%0A%20%0D%0ABusiness%20Contacts:%20&lt;management%20contacts%20for%20escalating%20issues%20in%20case%20of%20critical%20business%20down%20situations&gt;%20%0D%0A%20%0D%0ADev%20leads:%20%20&lt;Contacts%20of%20Developer%20teams%20who%20can%20help%20upgrade%20the%20SDK%20and%20deploy%20changes&gt;%20%0D%0A%20%0D%0APROD%20on-call%20email:%20%20&lt;email%20address%20of%20a%20team%20containing%20dev%20and%20support%20contacts%20for%20incidents%20related%20to%20extension&gt;%20%0D%0A%20%0D%0A"> ibizafxpm@microsoft .com </a> instead of using the internal sites that are in this document. The body of the email should contain the following.

**Extension name**: <ExtensionName_Extension> 

**URLs**: (must adhere to pattern)

**PROD**: `<extensionprefix>.hosting.portal.azure.net`

**Contact info**: email address of a team containing dev & support contacts for incidents related to extension

**Business Contacts**: management contacts for escalating issues in case of critical business down situations

**Dev leads**: Contacts of Developer teams who can help upgrade the SDK and deploy changes

**PROD on-call email**: email address of a team containing dev & support contacts for incidents related to extension

**NOTE**: The name of the extension is the same for both the PROD version and the custom deployment version, as specified in [top-extensions-custom-deployment.md](top-extensions-custom-deployment.md). 

For the hosting service, the request should include the name of the extension as `<prefix>.hosting.portal.azure.net/<prefix>`. The email may also contain the extension config file, as specified in [top-extensions-cdn.md#configuring-the-extension](top-extensions-cdn.md#configuring-the-extension).

For more information and any questions about Fx coverage, reach out to 
<a href="mailto:ibiza-onboarding@microsoft.com?subject=Third%20Party Applications%20(External%20partners)">Third Party Applications</a>.

<a name="onboarding-third-party-extensions-overview-communication"></a>
### Communication

Plan ahead for all the outbound communication, blogging, and marketing work that publicizes new services during the time that they are being deployed to customers. This coordination is important, particularly when software release commitments are aligned with the Azure events and conferences. This coordination may be optional for preview releases, but the localized azure.com content and service updates plan are required for stakeholder signoff, if the extension will be deployed to GA.

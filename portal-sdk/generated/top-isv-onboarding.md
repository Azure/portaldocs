<a name="onboarding-of-isvs-to-the-azure-portal"></a>
# Onboarding of ISVs to the Azure portal

ISV extensions cannot onboard on their own. They will need a Microsoft sponsor team to onboard them to the Azure portal. If you do not have a Microsoft sponsor, please read [this doc](top-isv-prerequisites.md) to learn about the prerequisites to be a ISV extension in the Azure portal.

The sponsor team should onboard a ISV extension following instruction documented [here](top-onboarding.md#step-by-step-guide-to-portal-onboarding).

It is critical to add the "ThirdPartyExtension" flag as documented [here](top-onboarding.md#flags).

 

* **"ThirdPartyExtension"** must be used if the service is non-Microsoft. **Not using the ThirdPartyExtension for non-Microsoft services is considered as security and privacy violation** and could potentially leak user data.

* Any **services calling services outside of Microsoft and NOT using ThirdPartyExtension flag will be removed** from Azure portal.


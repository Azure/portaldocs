* [Getting started with the KeyVault picker blades](#getting-started-with-the-keyvault-picker-blades)
* [What are the KeyVault picker blades](#what-are-the-keyvault-picker-blades)
* [Downloading the PDE](#downloading-the-pde)
* [KeyVault Picker](#keyvault-picker)
    * [Inputs/Outputs](#keyvault-picker-inputs-outputs)
    * [Config](#keyvault-picker-config)
    * [Constructor](#keyvault-picker-constructor)
    * [PDL Changes](#keyvault-picker-pdl-changes)
* [Key/Secret Pickers](#key-secret-pickers)
    * [Inputs/Outputs](#key-secret-pickers-inputs-outputs-1)
    * [Config](#key-secret-pickers-config-1)
    * [Constructor](#key-secret-pickers-constructor-1)
    * [PDL Changes](#key-secret-pickers-pdl-changes-1)
    * [Secret Picker](#key-secret-pickers-secret-picker)
* [Contact](#contact)


<tags
    ms.service="portalfx"
    ms.workload="portalfx"
    ms.tgt_pltfrm="portalfx"
    ms.devlang="portalfx"
    ms.topic="keyvault-pickers-usage-doc"
    ms.date="1/31/2017"
    ms.author="karlaug"/>    

<a name="getting-started-with-the-keyvault-picker-blades"></a>
## Getting started with the KeyVault picker blades

<a name="what-are-the-keyvault-picker-blades"></a>
## What are the KeyVault picker blades

The KeyVault picker blades are a tool intended to unify KeyVault selection and/or key/secret selection scenarios across the portal. The Pickers are built using the ParameterCollection Framework v3.0. This means the blades are a "provider" and that to use it, you will need to write a "collector" which calls the blades and receives data back. An example of this can be found in the next section. To better understand the basics of how passing data with this framework works, see the examples of its usage in the Samples extension provided with the Azure SDK. 
A typical flow for partner teams to follow if they need a key identifier or secret identifier in order to initialize their resource would be:

- Vault and key selector buttons are shown, but key selector is locked.
- User opens vault selector and picks (or creates) a vault from the KeyVault picker.
- Key selector is unlocked, and user picks (or creates) a key that is then returned to the calling extension.

<a name="downloading-the-pde"></a>
## Downloading the PDE

The .pde you need to reference can be found by downloading the Microsft.Portal.Extensions.KeyVault.nuget from \\\wanuget\nugetpackages\official and extracting the contents. (the .pde will be found under /Content/_extensions/KeyVault). Please see [This link](https://msazure.visualstudio.com/One/_packaging?feedName=Official&protocolType=NuGet&packageName=microsoft.portal.extensions.keyvault&packageVersion=1.0.30&_a=view) for the latest nuget version.

<a name="keyvault-picker"></a>
## KeyVault Picker

<a name="keyvault-picker-inputs-outputs"></a>
### Inputs/Outputs
	
	export interface VaultPickerInputsOutputs {
	    id: KnockoutObservable<string>; //resourceId of the vault selected
	    name: KnockoutObservable<string>; // name of the vault selected
	    type: KnockoutObservable<string>; // Microsoft.KeyVault/vaults
	    location: KnockoutObservable<string>; // region the vault is deployed in
	    tags: KnockoutObservable<StringMap<KnockoutObservable<string>>>; // any tags associated with the vault
	    properties?: KnockoutObservable<VaultProperties>; // Any properties associated with this vault, such as access policies. ONLY INCLUDED IF THE VAULT IS CREATED ON THE BLADE.
	}
	
	export interface VaultProperties {
	    sku: KnockoutObservable<Sku>;
	    tenantId: KnockoutObservable<string>;
	    accessPolicies: KnockoutObservableArray<AccessPolicy>;
	    enabledForDeployment: KnockoutObservable<boolean>;
	    enabledForDiskEncryption: KnockoutObservable<boolean>;
	    enabledForTemplateDeployment: KnockoutObservable<boolean>;
	    vaultUri: KnockoutObservable<string>;
	}
	
	export interface Sku {
	    family: KnockoutObservable<string>;
	    name: KnockoutObservable<string>;
	}
	
	export interface AccessPolicy {
	    tenantId: KnockoutObservable<string>;
	    objectId: KnockoutObservable<string>;
	    permissions: KnockoutObservable<AccessPolicyPermission>;
	}
	
	export interface AccessPolicyPermission {
	    keys: KnockoutObservableArray<string>;
	    secrets: KnockoutObservableArray<string>;
	}

<a name="keyvault-picker-config"></a>
### Config

	export interface VaultPickerConfig {
	    subscriptionId?: string; // if supplied, only vaults from this subscription will be shown. If not, vaults in all. Subscriptions will be shown.
	    resourceGroup?: string; // only valid when subscriptionId is supplied, otherwise behavior is undefined. Name of resourceGroup to show vaults for.
	    location?: string; // if supplied, only vaults in this region/location will be shown
	    showCreateNew?: boolean; // whether the picker should display the create new button.
        createOnBlade?: boolean; // whether the vault should be created on the blade, or returned to be created later (ex. in a template deployment). This should not be false if you are using the key/secret pickers as well, since the vault needs to be created in order to select keys/secrets.
	    requiredPermissions?: string[]; // **TODO – Not implemented yet** An array of requirements for the ability for this user to select vaults. If the user doesn’t have this access the vault will be shown but displayed as disabled. Allowed values are: “keys”, and “secrets” for listing keys, and listing secrets respectively.
	}

<a name="keyvault-picker-constructor"></a>
### Constructor
	this.vaultPickerCollector = new MsPortalFx.ViewModels.ParameterCollector<VaultPickerInputsOutputs>(_container, {
	          supplyInitialData: () => {
	              return <VaultPickerInputsOutputs> {
	                  // this is where you would pass in pre selected vault, if desired
				     id: ko.observable("")
	              };
	          },
	          receiveResult: (result: VaultPickerInputsOutputs) => {
	              // this is what will happen when the user finishes selecting a vault and the blade closes.
	              this._vault(result);
	          },
	          supplyProviderConfig: () => {
	              return <VaultPickerConfig> {
	                  subscriptionId: this._subscriptionSelector.value ? this._subscriptionSelector.value().subscriptionID : null,
	                  resourceGroup: this._resourceGroupSelector.value ? this._resourceGroupSelector.value.name() : null,
	                  location: this._locationSelector.value ? this._locationSelector.value().name : null
	              };
	          }
	      });


<a name="keyvault-picker-pdl-changes"></a>
### PDL Changes

The following is an example of the PDL changes needed to use the blade. 

```xml

    <BladeAction Blade ="{BladeReference VaultPicker, ExtensionName=Microsoft_Azure_KeyVault}"
                   ParameterCollector ="vaultPickerCollector">
      </BladeAction>

```

<a name="key-secret-pickers"></a>
## Key/Secret Pickers


<a name="key-secret-pickers-inputs-outputs-1"></a>
### Inputs/Outputs
	export interface KeyPickerInputsOutputs {
	    key: KnockoutObservable<Key>; // The key that was picked, or created.
	    vaultId: KnockoutObservable<string>; // The vault id of the vault to pick from. This can be supplied here or in config. If it is supplied here it is an updateable input.
	}
	
	export interface Key {
	    kid: KnockoutObservable<string>; // base key identifier of the base key, i.e. https://myvault.vault.azure.net/keys/mykey
	    attributes: KnockoutObservable<KeyAttributes>; // Key attributes of the selected key
	    tags: KnockoutObservable<StringMap<KnockoutObservable<string>>>; // any tags associated with the key
	}
	
	export interface KeyAttributes {
	    kid: KnockoutObservable<string>; // Full key identifier of the current key version, i.e. https://myvault.vault.azure.net/keys/mykey/1d7c8dd8-f795-439c-9ebf-9510af7ec445
	    enabled: KnockoutObservable<boolean>;
	    nbf: KnockoutObservable<number>;
	    exp: KnockoutObservable<number>;
	    created: KnockoutObservable<number>;
	    updated: KnockoutObservable<number>;
	}

<a name="key-secret-pickers-config-1"></a>
### Config
	export interface KeyPickerConfig {
	    vaultId: string; // the resource id of the vault to display keys from (Optional if the id of the vault was supplied in the KeyPickerInputsOutputs)
	    showCreateNew?: boolean; // Whether the picker will give the option to create a new key.
	    requiredKeyOperations?: string[]; // Required key operations for selected keys. Supported key_ops are "sign", "verify", "wrapKey", "unwrapKey", "encrypt" & "decrypt". When a key doesn't have all required key_ops, it is readonly and cannot be selected.
	}
<a name="key-secret-pickers-constructor-1"></a>
### Constructor
	this.keyPickerCollector = new MsPortalFx.ViewModels.ParameterCollector<KeyPickerInputsOutputs>(_container, {
	          supplyInitialData: () => {
	              return <KeyPickerInputsOutputs> {
	                  vaultId: this._vaultSelector.value().id;
	                  // this is where you would pass in pre selected key, if desired
	                  key: ko.observable(<Key>{
	                      kid: ko.observable("")
	                  });
	              };
	          },
	          receiveResult: (result: KeyPickerInputsOutputs) => {
	              // this is what will happen when the user finishes selecting a key and the blade closes.
	             this._keyId(result.key().kid());
	          },
	          supplyProviderConfig: () => {
	              return <KeyPickerConfig> {
	                  vaultId: this._vaultSelector.value().id();
	              };
	          }
	      });

<a name="key-secret-pickers-pdl-changes-1"></a>
### PDL Changes
	<BladeAction Blade ="{BladeReference KeyPicker, ExtensionName=Microsoft_Azure_KeyVault}"
	                   ParameterCollector ="keyPickerCollector">
	</BladeAction>

<a name="key-secret-pickers-secret-picker"></a>
### Secret Picker

Similarly for the secret picker, the blade name is "SecretPicker".

<a name="contact"></a>
## Contact

For any questions or requests please contact azurekeyvault@microsoft.com


<a name="control-microsoft-network-publicipaddresscombo-options"></a>
# control-Microsoft.Network.PublicIpAddressCombo-options
* [control-Microsoft.Network.PublicIpAddressCombo-options](#control-microsoft-network-publicipaddresscombo-options)
    * [Definitions:](#control-microsoft-network-publicipaddresscombo-options-definitions)

<a name="control-microsoft-network-publicipaddresscombo-options-definitions"></a>
## Definitions:
<a name="control-microsoft-network-publicipaddresscombo-options-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|hideNone|False|If `options.hideNone` is set to **true**, then the option to select **None** for the public IP address is hidden. The default value is **false**.
|hideDomainNameLabel|False|If `options.hideDomainNameLabel` is set to **true**, then the text box for domain name label is hidden. The default value is **false**.
|hideExisting|False|If `options.hideExisting` is **true**, then the user isn't able to choose an existing public IP address. The default value is **false**.
|zone|False|For `zone`, only public IP addresses for the specified zone or zone resilient public IP addresses are available.
|fx.feature|False|

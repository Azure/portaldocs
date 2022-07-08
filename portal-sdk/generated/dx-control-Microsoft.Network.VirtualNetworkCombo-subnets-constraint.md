<a name="control-microsoft-network-virtualnetworkcombo-subnets-constraint"></a>
# control-Microsoft.Network.VirtualNetworkCombo-subnets-constraint
* [control-Microsoft.Network.VirtualNetworkCombo-subnets-constraint](#control-microsoft-network-virtualnetworkcombo-subnets-constraint)
    * [Definitions:](#control-microsoft-network-virtualnetworkcombo-subnets-constraint-definitions)

<a name="control-microsoft-network-virtualnetworkcombo-subnets-constraint-definitions"></a>
## Definitions:
<a name="control-microsoft-network-virtualnetworkcombo-subnets-constraint-definitions-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|minAddressPrefixSize|True|Sets the limit for subnet's address prefix size (ex. /16)
|minAddressCount|False|Sets the minimum for available subnet addresses.  Default is **0**.
|requireContiguousAddresses|False|Set to **true** to ensure available addresses are contiguous.  Default is **true**
|fx.feature|False|

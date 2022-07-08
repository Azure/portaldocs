<a name="control-ui"></a>
### Control UI
- If the user selects 'None' for public IP address, the domain name label text box is hidden.
- If the user selects an existing public IP address, the domain name label text box is disabled. Its value is the domain name label of the selected IP address.
- The domain name suffix (for example, westus.cloudapp.azure.com) updates automatically based on the selected location.
<a name="control-output"></a>
### Control output
- When `options.hideNone` is specified as **true**, `newOrExistingOrNone` will only have a value of **new** or **existing**.
- When `options.hideDomainNameLabel` is specified as **true**, `domainNameLabel` is undeclared.

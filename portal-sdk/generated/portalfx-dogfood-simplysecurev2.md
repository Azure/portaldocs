As part of the Simply Secure v2 network policies, users and services accessing the Azure Portal Dogfood environment (https://df.onecloud.azure-test.net) will need to connect from trusted IP addresses.  Connections from an untrusted IP address will fail after April 15th, 2023.  The RC, MPAC and Production Portal environments are not affected.
 
* If you are working on a Microsoft campus with a machine that is physically connected to corpnet then there should be no action required.
* Otherwise, the recommended way to connect from a trusted IP address is to use the [AzDevVPN](https://eng.ms/docs/microsoft-security/security/azure-security/security-health-analytics/network-isolation/tsgs/howtos/work-from-home-guidance/work-from-home-guidance#managed-vpn-azvpndev-access-status-jan-2023) (if you are in Brendan Burn’s org you should automatically get access to the VPN in the beginning of April).
* Some other common options include [AVD Developer VMs](https://microsoft.sharepoint.com/sites/Security_Tools_Services/SitePages/WindowsVirtualDesktop/WVD-Workstation.aspx) and [AVD VMs](https://microsoft.sharepoint.com/sites/Security_Tools_Services/SitePages/WindowsVirtualDesktop/Windows-Virtual-Desktop.aspx).
* For the full list of options, you can check the network security team’s [work from home guidance](https://eng.ms/docs/microsoft-security/security/azure-security/security-health-analytics/network-isolation/tsgs/howtos/work-from-home-guidance/work-from-home-guidance).

If you are using CloudTest to test against Portal Dogfood then you may need to [enable NAT gateways](https://eng.ms/docs/more/developer-guides/cloudtest-user-guide/cloudtest/how-tos/nat-gateway) in your pool.
If you use something else for running your tests against Portal Dogfood, please you will need to check with the owner of your test runner infrastructure for options.
Tests against production environments will not be affected.

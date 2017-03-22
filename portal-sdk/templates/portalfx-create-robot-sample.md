
# Create Robot Sample
The create robot sample demonstrates building a Marketplace create experience built using the parameter collection framework (PCv3) that creates a resource. This addesses custom deployments that don't go through ARM or the Marketplace. If your create experience relies on ARM deployments or requires a Marketplace package, please refer to the [Engine sample](portalfx-create-engine-sample.md).

The sample code is heavily documented and covers the following:
* Building a PCv3 parameter provider template blade (with the new action bar syntax).
* Instantiating form controls with the edit scope provisioned by the parameter provider.
* Using a custom provisioner to create a robot resource.
* Builds a custom provisioning part to reflect the create progress on the startboard.

## To launch the Robot sample
Add a launcher part to your startboard that launches the create experience:
1. Click on the "Settings" icon (the gear) in the top bar.
2. Click the "Debug" button at the bottom of the form.
3. Choose "Add tile" from the top.
4. Fill out the fields as follows:
    * Extension Name: SamplesExtension
    * ParType Name: CreateRobotLauncherPart
    * Model JSON: (leave it as null)
5. Click "Add tile".
6. A "Create Robot" part will be added to your startboard. Click the part to start the create flow.
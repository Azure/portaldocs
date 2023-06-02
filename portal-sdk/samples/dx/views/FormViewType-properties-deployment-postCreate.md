### Enable Post Create Customization

This flow is implemented through Form with *deployment.postCreate* action.

1. Come up with your own React postCreate blade to customize buttons, nextSteps, callout, tutorials, feedbacks, upsell
    - For creating your own React PostCreate blade, https://eng.ms/docs/products/azure-portal-framework-ibizafx/development/postcreate#build-a-deployment-overview-reactview
2. Define "postCreateBlade" in "assetType" in ResourceAsset.dx.jsonc":

    ```json
        "postCreateBlade": {
            "name": "{your own reactView name - for example: PostCreateSampleCreate.ReactView}"
        },
    ```
3. In Declarative Form, define "postCreate" property under "deployment" property.
    - "assetType", "provisioningHash" and "primaryResourceId" are optional
        * Pass primaryResourceId to create button in postCreate experience
        * Use provisioningHash to pass data to React postCreate (note. this only accepts 256 characters)
4. If assetType is incorrect or not found in extension, we fall back to default post create experience
5. If React postCreateBlade is not defined, we fall back to default post create experience
6. If React postCreateBlade exist but no "postCreate" property, we fall back to default post create experience

Sample: FormBladeCreate.Dx.jsonc


```json
      "deployment": {
        "kind": "ResourceGroup",
        "postCreate": {
          "assetType": "MyAssetType2",
          "provisioningHash": "This string is passed using provisioningHash",
          "primaryResourceId": "[concat(steps('step1').resourceScope.resourceGroup.id, '/providers/Microsoft.Network/routeTables/', steps('step1').resourceScope.resourceName)]"
        },
        "resourceGroupId": "[steps('step1').resourceScope.resourceGroup.id]",
        "parameters": {
          "name": "[steps('step1').resourceScope.resourceName]",
          "location": "centralus"
        },
        "template":
        {
          "file": "../../UiDef/DxExtensionResource/DeploymentTemplate.json"
        }
      }
```

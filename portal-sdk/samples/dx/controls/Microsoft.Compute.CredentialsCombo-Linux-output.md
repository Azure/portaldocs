##### If the user provided a password instead of an SSH public key, the control returns the following output:

```json
{
  "authenticationType": "password",
  "password": "passwordValue",
}
```
##### If the user provided an SSH public key, the control returns the following output:

```json
{
  "authenticationType": "sshPublicKey",
  /**
   * Set to true if the user opts to generate a new SSH key pair. False for all other scenarios.
   */
  "generateNewSshKey" : false,
   /**
    * The SSH Public key. Set to an empty string if the user opts to generate a new key pair.
    */
  "sshPublicKey": "<ssh-public-key>",
  /**
   * The name of the SSH key pair to be generated if the user opts to generate a new key pair.
   * Set to an empty string for all other scenarios.
   */
  "sshKeyName": "<ssh-key-name>",
}
```

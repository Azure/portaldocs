```json
{
    "name": "vnet01",
    "resourceGroup": "ManagedIdentityTest",
    "addressPrefixes": [
        "10.0.0.0/16"
    ],
    "addressPrefix": "10.0.0.0/16",
    "newOrExisting": "new",
    "subnets": {
        "subnet1": {
            "name": "subnet-1",
            "addressPrefix": "10.0.0.0/24",
            "startAddress": "10.0.0.4"
        },
        "subnet2": {
            "name": "subnet-2",
            "addressPrefix": "10.0.1.0/26",
            "startAddress": "10.0.1.4"
        }
    }
}
```

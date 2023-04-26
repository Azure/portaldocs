We can either make a GET call or POST call to a resource

1. As a full screen blade opened from a resource menu
2. As a tab in a resource overview (GetStarted view)

<a name="get-call"></a>
### GET call

Add the ARM GET request in the resource overview, fetch the values of GET call in `properties.tabs` section as seen in the Resource Overview (GetStarted) schema below

```json

{
  "$schema": "../../Definitions/dx.schema.json",
  "stringSource": "Resources/MyStrings.resjson",
  "view": {
    "kind": "GetStarted",
    "export": true,
    "parameters": [
      {
        "name": "id",
        "type": "key"
      }
    ],
    "resources": [
      {
        "id": "[parameters('id')]",
        "apiVersion": "2014-04-01"
      },
      {    
          "id": "/subscriptions/2a5aa7f9-d10a-4a12-bf51-a5f8a29cf0b4/resourceGroups/managedAppTest_rg/providers/      Microsoft.Storage/storageAccounts/e2eteststorageaccount",  
          "apiVersion": "2021-09-01",     
          "name": "storageAccount"    
      }
    ],
    "essentials": {},
    "commands": [],
    "properties": {
        "title": "title",
        "tabs": [
            {
              "displayName": "Storage account name",
              "value": "[resources('storageAccount').name]"
            }
        ]
    }
  }
}

```

<a name="post-call-with-body"></a>
### POST call with body

Add the ARM POST request in the resource overview, fetch the values of POST call in `properties.tabs` section as seen in the Resource Overview (GetStarted) schema below

```json

{
  "$schema": "../../Definitions/dx.schema.json",
  "stringSource": "Resources/MyStrings.resjson",
  "view": {
    "kind": "GetStarted",
    "export": true,
    "parameters": [
      {
        "name": "id",
        "type": "key"
      }
    ],
    "resources": [
      {
        "id": "[parameters('id')]",
        "apiVersion": "2014-04-01"
      },
      {    
        "id": "/subscriptions/2a5aa7f9-d10a-4a12-bf51-a5f8a29cf0b4/resourceGroups/managedAppTest_rg/providers/Microsoft.Storage/storageAccounts/e2eteststorageaccount",  
        "apiVersion": "2021-09-01",     
        "name": "storageAccount"    
      },
      {     
        "name": "testPOSTARG",    
        "method": "POST",     
        "id": "/providers/Microsoft.ResourceGraph/resources",    
        "apiVersion": "2018-09-01-preview",    
        "body": {      
          "subscriptions": [    
              "2a5aa7f9-d10a-4a12-bf51-a5f8a29cf0b4"      
          ],       
         "query": "where isnotnull(tags['TagForResourceGraphTest'])"       
        },       
        "condition":  "[not(empty(resources('storageAccount').id))]"   
      }
    ],
    "essentials": {},
    "commands": [],
    "properties": {
        "title": "title",
        "tabs": [
            {
              "displayName": "Storage account name",
              "value": "[resources('storageAccount').name]"
            },
            {
              "displayName": "TestPOST ARGcount",
              "value": "[resources('testPOSTARG').count]",
              "description": "Number of storage accounts with tag"
            }
        ]
    }
  }
}

```

<a name="post-call-with-condition-based-on-storageaccountid"></a>
### POST call with condition based on storageAccountId

Add the ARM POST request in the resource overview, fetch the values of POST call in `properties.tabs` section as seen in the Resource Overview (GetStarted) schema below

```json

{
  "$schema": "../../Definitions/dx.schema.json",
  "stringSource": "Resources/MyStrings.resjson",
  "view": {
    "kind": "GetStarted",
    "export": true,
    "parameters": [
      {
        "name": "id",
        "type": "key"
      }
    ],
    "resources": [
      {
        "id": "[parameters('id')]",
        "apiVersion": "2014-04-01"
      },
      {    
          "id": "/subscriptions/2a5aa7f9-d10a-4a12-bf51-a5f8a29cf0b4/resourceGroups/managedAppTest_rg/providers/      Microsoft.Storage/storageAccounts/e2eteststorageaccount",  
          "apiVersion": "2021-09-01",     
          "name": "storageAccount"    
      },
      {       
        "name": "testPOSTCondition",   
        "method": "POST",      
        "id": "[concat(resources('storageAccount').id,'/listKeys')]",    
        "condition": "[not(empty(resources('storageAccount').id))]",   
        "apiVersion": "2021-09-01"   
       }
    ],
    "essentials": {},
    "commands": [],
    "properties": {
        "title": "title",
        "tabs": [
            {
              "displayName": "Storage account name",
              "value": "[resources('storageAccount').name]"
            },
            {
              "displayName": "TestPOST listCondition",
              "value": "[resources('testPOSTCondition').keys.length]",
              "description": "Number of access keys"
            }
        ]
    }
  }
}

```

<a name="post-call-with-condition-based-on-storage-account-id"></a>
### POST call with condition based on storage account id

Add the ARM POST request in the resource overview, fetch the values of POST call in `properties.tabs` section as seen in the Resource Overview (GetStarted) schema below

```json

{
  "$schema": "../../Definitions/dx.schema.json",
  "stringSource": "Resources/MyStrings.resjson",
  "view": {
    "kind": "GetStarted",
    "export": true,
    "parameters": [
      {
        "name": "id",
        "type": "key"
      }
    ],
    "resources": [
      {
        "id": "[parameters('id')]",
        "apiVersion": "2014-04-01"
      },
      {    
          "id": "/subscriptions/2a5aa7f9-d10a-4a12-bf51-a5f8a29cf0b4/resourceGroups/managedAppTest_rg/providers/      Microsoft.Storage/storageAccounts/e2eteststorageaccount",  
          "apiVersion": "2021-09-01",     
          "name": "storageAccount"    
      },
      {       
         "name": "testPOSTList",
         "method": "POST",    
         "id": "/subscriptions/2a5aa7f9-d10a-4a12-bf51-a5f8a29cf0b4/resourceGroups/managedAppTest_rg/providers/Microsoft.Storage/storageAccounts/e2eteststorageaccount/listKeys",     
         "apiVersion": "2021-09-01",    
         "condition": "[not(empty(resources('storageAccount').id))]"     
      }
    ],
    "essentials": {},
    "commands": [],
    "properties": {
        "title": "title",
        "tabs": [
            {
              "displayName": "Storage account name",
              "value": "[resources('storageAccount').name]"
            },
            {
              "displayName": "TestPOST listcount",
              "value": "[resources('testPOSTList').keys.length]",
            }
        ]
    }
  }
}

```

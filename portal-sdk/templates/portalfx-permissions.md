{"gitdown": "contents"}

## Defining permissions and checking access

### Role-based access control (RBAC) in Azure

Azure supports 3 built-in roles today, powered by Azure Active Directory (AAD): Owner, Contributor, and Reader. Owners have full control, Contributors can do everything except manage access, and Readers have full, read-only access. These roles can be assigned at a subscription, resource group, or resource level. Access is hierarchical and additive - you can grant more permissions, but cannot revoke permissions granted at a higher level. For instance, a subscription reader can be granted contributor access to a resource group and Owner access for a resource, but a subscription owner cannot be restricted to reader or contributor access on a resource or resource group.

> [WACOM.NOTE] The legacy service admin and co-admin roles are treated as owners in the new, role-based access control (RBAC) model. The account admin role does not yet have an equivalent.

In addition to the built-in roles, AAD will soon introduce new roles to manage groups of resources. For instance, a Web Contributor will have the ability to manage all aspects of the Azure Websites service, including websites and web hosting plans. Similar roles will be included for other services. Longer term, we'll also enable customers to define custom roles, which will define specific actions customers are allowed to perform at a specific scope.

Actions are specific operations, like create a website or backup a database. Instead of checking for roles, your UI needs to check for the specific actions required by that UI element, whether it be a blade, part, command, form, or individual control. This will be especially critical when custom roles are available.

For more information, read the full [RBAC documentation](http://aka.ms/azurerbac).


<a name="principles"></a>
### Core principles

#### Fail open
In general, every element should be prepared to "fail open" in case of network failures when checking access. It's better to allow the user to try to perform an action and allow the back-end to reject it if the user doesn't have access than to deny access for a user who does have access. All built-in APIs will fail open, including `hasPermission()`.

#### Readers should be able to read _everything_ except secrets
Be granular when defining permissions. If any bit of data can be obtained via an HTTP GET call, don't require write access to access that information. When data is only exposed in a form, disable form controls to ensure readers cannot submit changes, but don't block access to _viewing_ the form.


<a name="summary"></a>
#### At a glance

Before you begin, here's a quick look at the steps you can expect to complete:

1. [Identify the required actions for each UI element](#actions)

    Before you can annotate required access, you need to know what HTTP requests are required and optional to initialize and use each element. For parts, also consider the requests the related blade requires. Once you have a list of HTTP methods and endpoints, you can translate each into a scope and an action.

    The scope is always a subscription, resource group, or resource id. Actions are composed of the resource type (e.g. Microsoft.SQL/servers/databases for a SQL database), an operation (e.g. backup), and one of the following strings based on the HTTP method: read (GET/HEAD), write (PUT/PATCH), action (POST), delete (DELETE) (e.g. Microsoft.SQL/servers/databases/backup/action).

2. [Create an alias for required permissions](#references)

    To simplify development and avoid typos, we recommend defining permissions within your asset type definition in PDL and referencing them in PDL and TypeScript for compiler-checked references to avoid errors.

    ```xml
    <AssetType Name="Robot">
      <AssetType.Permissions>
        <PermissionDefinition Name="read"         Action="Microsoft.Robotics/robots/read" />
        <PermissionDefinition Name="restart"      Action="Microsoft.Robotics/robots/restart/action" />
        <PermissionDefinition Name="readChildren" Action="Microsoft.Robotics/robots/children/read" />
      </AssetType.Permissions>
    </AssetType>
    ```

    If the resource type is dynamic and the required permission is standard across all supported resource types (e.g. read, write), you can use relative permissions by replacing the resource type with "." or "{resourceType}". For instance, if checking read access on a website, you can check for "./read", which will be evaluated as "Microsoft.Web/sites/read". For a website deployment slot, this would be evaluated as "Microsoft.Web/sites/slots/read".

3. [Annotate required permissions in PDL](#pdl)

    Every blade and part that represents an asset should already have an asset type/id associated with it. In these cases, use a simple permission reference for required permissions.

    ```xml
    <Blade AssetType="Robot" AssetIdProperty="id">
      <Blade.Permissions>
        <PermissionReference Permission="read" />
        <PermissionReference Permission="readChildren" />
      </Blade.Permissions>
    </Blade>
    ```

    If the element isn't associated with an asset or is associated with multiple assets, specify the asset type and id property within the reference.

    ```xml
    <Part>
      <Part.Permissions>
        <PermissionReference AssetType="Robot" AssetId="id" Permission="read" />
        <PermissionReference AssetType="Robot" AssetId="id" Permission="readChildren" />
      </Part.Permissions>
    </Part>
    ```

4. [Check access manually for remaining scenarios](#ts)

    For finer-grained checks and more advanced scenarios, use the `hasPermission()` function in conjunction with `container.unauthorized()` to react to limited access.

    ```ts
    MsPortalFx.Extension.hasPermission(resourceUri, [ExtensionDefinition.AssetTypes.Robot.Permissions.read])
        .then((hasAccess) => {
            if (!hasAccess) { container.unauthorized(); return; }
            /* do awesome stuff */
        });
    ```


<a name="actions"></a>
#### Determining the action

Actions are implicitly defined by the ARM resource provider (RP) API. For instance, the action for deleting a website is "Microsoft.Web/sites/delete". Use the following steps to determine the appropriate action for your API call:

1.  Start with the API call you need to make (including the HTTP verb)

    GET /subscriptions/id/resourceGroups/name/providers/Microsoft.SQL/servers/name/databases/name/usages

2.  Append the HTTP verb to the end

    ~~**GET**~~ /subscriptions/id/resourceGroups/name/providers/Microsoft.SQL/servers/name/databases/name/usages/**GET**

3.  Replace the HTTP verb with the respective permission

    | HTTP verb | Permission |
    | --------- | ---------- |
    | GET/HEAD  | read       |
    | PUT/PATCH | write      |
    | POST      | action     |
    | DELETE    | delete     |

    /subscriptions/id/resourceGroups/name/providers/Microsoft.SQL/servers/name/databases/name/usages/**read**

4.  Remove everything before the last RP namespace

    /~~**subscriptions/id/resourceGroups/name/providers**~~/Microsoft.SQL/servers/name/databases/name/usages/read

5.  Remove the instance names

    Microsoft.SQL/servers/~~**name**~~/databases/~~**name**~~/usages/read

6.  Now you have the action to check for:

    Microsoft.SQL/servers/databases/usages/read

If the resource type is dynamic and the required permission is standard across all supported resource types (e.g. read, write), you can use relative permissions by replacing the resource type with "." or "{resourceType}". For instance, if checking read access on a website, you can check for "./read", which will be evaluated as "Microsoft.Web/sites/read". For a website deployment slot, this would be evaluated as "Microsoft.Web/sites/slots/read".

### Convert your API call to an action
Use the following form to convert an API call (e.g. ``GET /subscriptions/###``) to an action (e.g. ``microsoft.resources/subscriptions/read``).

<select id="_verb" style="width:100px">
    <option value="read">GET/HEAD</option>
    <option value="write">PUT/PATCH</option>
    <option value="action">POST</option>
    <option value="delete">DELETE</option>
</select> <input id="_api" style="width:500px" />
<button style="width:100px" onclick="var slash = '/'; var msres = 'microsoft.resources'; var api = document.getElementById('_api').value.replace('https:'+slash+slash, '').replace('management.azure.com', '').replace('dogfood-resources.windows.net', ''); var prov = api.lastIndexOf(slash+'providers'+slash); if (prov >= 0) { api = api.substring(prov+11); } else { api = msres+slash+api; } if (api[0] == slash) { api = api.substring(1); } api = api.split(slash); for (var i=2; i<api.length; i+=2) { api[i] = ''; } api.push(document.getElementById('_verb').value); document.getElementById('_action').value = api.join(slash).replace(/\/+/g, slash)">Get action</button> <input id="_action" style="width:500px" />


<a name="pdl"></a>
#### Required permissions for blades, parts, and commands

Start by defining the required permissions for your blades, parts, and commands. A permission consists of an action and a scope. As covered above, actions are defined by the ARM RP API. The scope is the asset the action pertains to.

> [WACOM.NOTE] The portal uses assets instead of resources because not all entities within the portal are ARM resources. In the future, the permissions API may be expanded to support external entities.

```xml
<Part>
  <Part.Permissions>
    <Permission
        Action="Arm.Namespace/resourceType/action"
        AssetType="{AssetTypeReference Robot, Extension=Company_Suite_Component}"
        AssetId="id"/>
  </Part.Permissions>
</Part>
```

Each `Permission` supports the following properties:

| Property  | Type                         | Description |
| --------- | ---------------------------- | ----------- |
| Action    | string                       | Action the user needs access to in order to use the UI element. |
| AssetType | string / AssetTypeReference  | Optional. Asset type and extension, if external, that the user needs to have access to. Required, if not specified on the UI element. |
| AssetId   | string                       | Optional. Name of the part property that has the id for the specified AssetType. Required, if the AssetType is specified. |

If the asset type is in the current extension, use the asset type name instead of the asset type reference.

```xml
<Part>
  <Part.Permissions>
    <Permission
        Action="Arm.Namespace/resourceType/action"
        AssetType="Robot"
        AssetId="{BladeProperty id}"/>
  </Part.Permissions>
</Part>
```

If the blade/part/command is already associated with an asset type, each permission will default to that asset.

```xml
<Part AssetType="Object" AssetIdProperty="id">
  <Part.Permissions>
    <Permission Action="Arm.Namespace/resourceType/action" />
  </Part.Permissions>
</Part>
```

> [WACOM.NOTE] Do not define permissions on parts used in locked blades. Instead, render an empty part if the user doesn't have access to anything in it. This will ensure the UI doesn't render an odd "no access" message when the user simply should not see the part at all.


> [WACOM.NOTE] Adapter parts and part references do not support defining permissions. The extension that controls what data will be used should define and check access. Extensions that use an `ExtenderViewModel` will need to expose a way to allow consumers to either check access or define the actions/scopes that need to be checked.


<a name="references"></a>
#### Permission references

If your asset has commonly-used actions, create an alphanumeric alias and use a reference instead of a full permission. Permission references use predefined, compiler-checked aliases instead of action ids.

```xml
<AssetType Name="Robot">
  <AssetType.Permissions>
    <PermissionDefinition Name="alias" Action="Arm.Namespace/resourceType/action" />
  </AssetType.Permissions>
</AssetType>

<Part AssetType="Object" AssetIdProperty="id">
  <Part.Permissions>
    <PermissionReference Permission="alias" />
  </Part.Permissions>
</Part>
```

Each `PermissionDefinition` supports the following properties:

| Property   | Type                         | Description |
| ---------- | ---------------------------- | ----------- |
| Permission | string                       | Name of the PermissionDefinition defined on the related AssetType. |
| AssetType  | string / AssetTypeReference  | Optional. Asset type and extension, if external, that the user needs to have access to. Required, if not specified on the UI element. |
| AssetId    | string                       | Optional. Name of the part property that has the id for the specified AssetType. Required, if the AssetType is specified. |

Aliases are shared with PDE and can be used by dependent extensions:

```xml
<Part AssetType="Object" AssetIdProperty="id">
  <Part.Permissions>
    <Permission
        Asset="{AssetReference HubsExtension.ResourceGroups Id={BladeProperty content.resourceGroup}}"
        Type="read"/>
  </Part.Permissions>
</Part>
```


<a name="bool"></a>
#### Boolean logic

By default, all of the specified permissions are required, like an AND operation.

```xml
<Part AssetType="Object" AssetIdProperty="id">
  <Part.Permissions>
    <PermissionReference Permission="read" />
    <PermissionReference Permission="readChildren" />
  </Part.Permissions>
</Part>
```

This can also be written with a PermissionSet.

```xml
<Part AssetType="Object" AssetIdProperty="id">
  <Part.Permissions>
    <PermissionSet Require="all">
      <PermissionReference Permission="read" />
      <PermissionReference Permission="readChildren" />
    </PermissionSet>
  </Part.Permissions>
</Part>
```

Alternatively, if any one of the specified permissions is adequate, you can change the requirement to treat it as an OR operation.

```xml
<Part AssetType="Object" AssetIdProperty="id">
  <Part.Permissions>
    <PermissionSet Require="any">
      <PermissionReference Permission="read" />
      <PermissionReference Permission="readChildren" />
    </PermissionSet>
  </Part.Permissions>
</Part>
```

For more advanced scenarios, you can also nest permission sets.

```xml
<Part AssetType="Object" AssetIdProperty="id">
  <Part.Permissions>
    <PermissionSet Require="any">
      <Permission Name="read" />
      <Permission Name="readChildren" />
      <PermissionSet Require="all">
        <Permission Name="write" />
        <Permission Name="writeChildren" />
      </PermissionSet>
    </PermissionSet>
  </Part.Permissions>
</Part>
```


<a name="pickers"></a>
#### Checking permissions for pickers

To check access in pickers, add a filter that returns a lambda to obtain the resource id and the required action.

```ts
this.filters([
    new MsPortalFx.ViewModels.PickerFilter.ArmRbacFilter((item: PickersData.MyResourcePickerGridViewModel) => {
        return item.resourceId();
}, "Arm.Namespace/resourceType/action")]);
```

> [WACOM.NOTE] The filter is currently applied after you click the item, not before. When you click, the item is disabled.


<a name="ts"></a>
#### Checking permissions from TypeScript

In some cases, you may need to check access in TypeScript. A few examples include:

* Not using a predefined asset type (e.g. generic resource API)
* Asset id is not an input parameter
* Need to render elements within the part differently based on access
* Need to render an empty part on a locked blade
* Defining permissions for blade templates

To check access via PDL, call the `hasPermission()` API:

```ts
MsPortalFx.Extension.hasPermission(​
    resourceUri, ​
    [ExtensionDefinition.Assets.Robot.Permissions.read]​
).then((hasAccess) => { ​
    if (!hasAccess) { container.unauthorized(); return; }​
    /* do awesome stuff */ ​
});
```

Note that you can also reference the permission definition from TypeScript in the `ExtensionDefinition.Assets.{asset-type-name}.Permissions` module.

> **NOTE:** Always use `container.unauthorized()` when denying access to a blade, part, or command, except for parts on locked blades, which should be rendered empty.


<a name="rdfe"></a>
#### Checking RDFE/classic access

Before adding any UI that requires access to RDFE, be sure to check RDFE access (e.g. service and co-admin) by checking for "rdfe" permission. TypeScript would look like the following, as an example:

```ts
MsPortalFx.Extension.hasPermission(​resourceUri, ​["rdfe"]​).then((hasAccess) => { ​
    if (!hasAccess) { container.unauthorized(); return; }​
    /* do awesome stuff */ ​
});
```



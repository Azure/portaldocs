<a name="declarative-resource-menu-item-conditional-support"></a>
# Declarative Resource Menu Item Conditional Support

Assets using declarative menu, provide support for conditionally show/hide/replace menu items based on portal/extension flag and AFEC flags.

> **Note:**
> fx.afec support is available in SDKv2 only. [Migrate to SDKv2](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=/docs-internal/product/reactviews/migrating/migrating-to-sdkv2.md&_a=preview&version=GBdev)

* The support is provided at these schema levels
    - assetType.menu.overview,
    - assetType.menu.groups.items - apply for the entire group of items
    - assetType.menu.groups.items item - apply for each item in menu groups items
    - assetType.menu.options
* At each of these levels, it is expected to have either fx.feature or fx.afec. If both provided, fx.feature takes precedence over fx.afec
* for AFEC flags, you can apply the condition on more than one value.
* for AFEC flags, <code>"replaceWhen": "ValueEquals"</code> or <code>"replaceWhen": "ValueNotEquals"</code> do not apply as the flag states Registered/NotRegistered will always be mapped to true/false.
* When only a feature name or AFEC names is specified, the meaning defaults to <code>"includeWhen": "Enabled"</code>
* Feature flag can be portal flag or extension flag

<a name="declarative-resource-menu-item-conditional-support-includewhen"></a>
## IncludeWhen
You can include or remove the parent json object from the runtime based on the feature (portal or extension) or AFEC state. This state can be either <code>enabled</code>, <code>disabled</code>, and for feature, also be <code>valueEquals</code> or <code>valueNotEquals</code>. If you use <code>value*</code> then an additional string property <code>value</code> is required to determine if the feature state matches.

>**Note:** fx.afec schema do not have <code>valueEquals</code> or <code>valueNotEquals</code> as the flag states Registered/NotRegistered will be mapped to true/false

**fx.feature example:**
```json
"menu": {
      "overview": {
        "id": "dxOverviewId",
        "displayName": "dxOverviewDisplayName",
        "icon": "someIcon",
        "blade": {
          "name": "Overview_dx"
        },
        "fx.feature": {
          "name": "foo",
          "includeWhen": "Disabled",
        },
```

**fx.afec example:**
```json
"menu": {
      "overview": {
        "id": "dxOverviewId",
        "displayName": "dxOverviewDisplayName",
        "icon": "someIcon",
        "blade": {
          "name": "Overview_dx"
        },
        "fx.afec": {
          "names": ["bar"],
          "includeWhen": "Disabled",
        },
```

<a name="declarative-resource-menu-item-conditional-support-replacewhen"></a>
## ReplaceWhen
You can replace the parent object with the contents of the replacement field based on the feature state. This state can be either <code>enabled</code>, <code>disabled</code>, and for feature, also be <code>valueEquals</code> or <code>valueNotEquals</code>. If you use <code>value*</code> then an additional string property <code>value</code> is required to determine if the feature state matches.
The replacement field shares the same schema as the parent json object. In the example below, schema of the replacement will validate as a menu overview item.

>**Note:** fx.afec do not have/need <code>valueEquals</code> or <code>valueNotEquals</code> as the flag states Registered/NotRegistered will be mapped to true/false

**fx.feature example:**
```json
"menu": {
      "overview": {
        "id": "dxOverviewId",
        "displayName": "dxOverviewDisplayName",
        "icon": "someIcon",
        "blade": {
          "name": "Overview_dx"
        },
        "fx.feature": {
          "name": "foo",
          "replaceWhen": "ValueEquals",
          "value": "oof",
          "replacement": {
            "id": "dxOverviewId",
            "displayName": "replacedDxOverviewDisplayName",
            "icon": "replacedSomeIcon",
            "blade": {
              "name": "ReplacedOverview_dx"
            }
          }
        },
```

```json
"menu": {
      "overview": {
        "id": "dxOverviewId",
        "displayName": "dxOverviewDisplayName",
        "icon": "someIcon",
        "blade": {
          "name": "Overview_dx"
        },
        "fx.feature": {
          "name": "foo",
          "replaceWhen": "Enabled",
          "replacement": {
            "id": "dxOverviewId",
            "displayName": "replacedDxOverviewDisplayName",
            "icon": "replacedSomeIcon",
            "blade": {
              "name": "ReplacedOverview_dx"
            }
          }
        },
```

**fx.afec example:**
```json
"menu": {
      "overview": {
        "id": "dxOverviewId",
        "displayName": "dxOverviewDisplayName",
        "icon": "someIcon",
        "blade": {
          "name": "Overview_dx"
        },
        "fx.afec": {
          "names": ["bar"],
          "replaceWhen": "Disabled",
          "replacement": {
            "id": "dxOverviewId",
            "displayName": "replacedDxOverviewDisplayName",
            "icon": "replacedSomeIcon",
            "blade": {
              "name": "ReplacedOverview_dx"
            }
          }
        },
```

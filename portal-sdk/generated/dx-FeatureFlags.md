<a name="feature-flag-support-in-declarative"></a>
# Feature Flag Support in Declarative

**NOTE:** For Assets using declarative Resource Menu, we support conditional show/hide/replace menu items based on ```portal flag```, ```extension flag```, and ```AFEC flags```. Follow the link here [dx-resourceMenuItems-conditionalSupport.md](dx-resourceMenuItems-conditionalSupport.md)

Feature flags are a way to remove or replace parts of the dx json configuration. This is currently supported anywhere in a dx view.

You can change the state of these flags with the url:
<code>https://…?...&feature.{ExtensionName}_{FlagName}={bool/string}</code>
When only a feature name is specified, the meaning defaults to <code>"includeWhen": "enabled"</code>
```json
"essentials": {
    "properties": [
        {
            "displayName": "customerId",
            "value": "foo is not oof",
            "fx.feature": {
                "name": "foo",
                "replaceWhen": "ValueEquals",
                "value": "oof",
                "replacement": {
                    "displayName": "customerId",
                    "value": "foo is oof"
                }
            }
        },
```

<a name="feature-flag-support-in-declarative-includewhen"></a>
## IncludeWhen
You can include or remove the parent json object from the runtime based on the feature state. This state can be either <code>enabled</code>, <code>disabled</code>, <code>valueEquals</code> or <code>valueNotEquals</code>. If you use <code>value*</code> then an additional string property <code>value</code> is required to determine if the feature state matches.
```json
"essentials": {
    "properties": [
        {
            "displayName": "customerId",
            "value": "bar disabled",
            "fx.feature": {
                "name": "bar",
                "includeWhen": "Disabled"
            }
        },
```

<a name="feature-flag-support-in-declarative-replacewhen"></a>
## ReplaceWhen
You can replace the parent object with the contents of the replacement field based on the feature state. This state can be either <code>enabled</code>, <code>disabled</code>, <code>valueEquals</code> or <code>valueNotEquals</code>. If you use <code>value*</code> then an additional string property <code>value</code> is required to determine if the feature state matches.
The replacement field shares the same schema as the parent json object. In the example below, schema of the replacement will validate as an essentials property item.
```json
"essentials": {
    "properties": [
        {
            "displayName": "customerId",
            "value": "foo is not oof",
            "fx.feature": {
                "name": "foo",
                "replaceWhen": "ValueEquals",
                "value": "oof",
                "replacement": {
                    "displayName": "customerId",
                    "value": "foo is oof"
                }
            }
        },
```

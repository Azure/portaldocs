- If specified, `defaultValue.name` is automatically validated for uniqueness. If the storage account name isn't unique, the user must specify a different name or choose an existing storage account.
- The default value for `defaultValue.type` is **Premium_LRS**.
- Any type not specified in `constraints.allowedTypes` is hidden, and any type not specified in `constraints.excludedTypes` is shown. `constraints.allowedTypes` and `constraints.excludedTypes` are both optional, but can't be used simultaneously.
If `options.hideExisting` is **true**, the user can't choose an existing storage account. The default value is **false**.

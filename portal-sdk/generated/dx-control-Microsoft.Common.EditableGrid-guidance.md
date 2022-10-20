- The only valid controls within the columns array are the [TextBox](https://docs.microsoft.com/en-us/azure/azure-resource-manager/managed-applications/microsoft-common-textbox), [OptionsGroup](https://docs.microsoft.com/en-us/azure/azure-resource-manager/managed-applications/microsoft-common-optionsgroup), and [DropDown](https://docs.microsoft.com/en-us/azure/azure-resource-manager/managed-applications/microsoft-common-dropdown).
- The `$rowIndex` variable is only valid in expressions contained within children of the grid's columns. It's an integer that represents the element's relative row index and the count begins at one and increments by one. As shown in the schema's `"columns"`: section, the `$rowIndex` is used for validation.
- When validations are performed using the `$rowIndex` variable, it's possible to get the current row's value by combining the `last()` and `take()` commands.

For example:

`last(take(<reference_to_grid>, $rowIndex))`

- The `label` property doesn't appear as part of the control but is displayed on the final tab summary.
- The `ariaLabel` property is the accessibility label for the grid. Specify helpful text for users who use screen readers.
- The `constraints.width` property is used to set the overall width of the grid. The options are *Full*, *Medium*, *Small*. The default is *Full*.
- The `width` property on children of columns determines the column width. Widths are specified using fractional units such as *3fr*, with total space being allotted to columns proportional to their units. If no column width is specified, the default is *1fr*.

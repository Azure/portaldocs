<a name="resourceconstraints-validations"></a>
# resourceConstraints-validations
* [resourceConstraints-validations](#resourceconstraints-validations)
    * [Definitions:](#resourceconstraints-validations-definitions)
        * [Option 1](#resourceconstraints-validations-definitions-option-1)
        * [An array of items, where each item is of the type:](#resourceconstraints-validations-definitions-an-array-of-items-where-each-item-is-of-the-type)
        * [Option 2](#resourceconstraints-validations-definitions-option-2)
        * [An array of items, where each item is of the type:](#resourceconstraints-validations-definitions-an-array-of-items-where-each-item-is-of-the-type-1)

<a name="resourceconstraints-validations-definitions"></a>
## Definitions:
<a name="resourceconstraints-validations-definitions-option-1"></a>
### Option 1
<a name="resourceconstraints-validations-definitions-an-array-of-items-where-each-item-is-of-the-type"></a>
### An array of items, where each item is of the type:
<a name="resourceconstraints-validations-definitions-an-array-of-items-where-each-item-is-of-the-type-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|isValid|True|Expression to validate(can contain CreateUIDef functions).
|message|True|Message to be shown on validation failure.
|fx.feature|False|
<a name="resourceconstraints-validations-definitions-option-2"></a>
### Option 2
<a name="resourceconstraints-validations-definitions-an-array-of-items-where-each-item-is-of-the-type-1"></a>
### An array of items, where each item is of the type:
<a name="resourceconstraints-validations-definitions-an-array-of-items-where-each-item-is-of-the-type-1-an-object-with-the-following-properties-1"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|permission|True|Specify the action for which checks will be performed to see if the user has permissions to perform that action against the subscription/ resource.
|message|True|Message to be shown on validation failure.
|fx.feature|False|

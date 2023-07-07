<a name="textboxconstraints-validations"></a>
# textBoxConstraints-validations
* [textBoxConstraints-validations](#textboxconstraints-validations)
    * [Definitions:](#textboxconstraints-validations-definitions)
        * [Option 1](#textboxconstraints-validations-definitions-option-1)
        * [An array of items, where each item is of the type:](#textboxconstraints-validations-definitions-an-array-of-items-where-each-item-is-of-the-type)
        * [Option 2](#textboxconstraints-validations-definitions-option-2)
        * [An array of items, where each item is of the type:](#textboxconstraints-validations-definitions-an-array-of-items-where-each-item-is-of-the-type-1)

<a name="textboxconstraints-validations-definitions"></a>
## Definitions:
<a name="textboxconstraints-validations-definitions-option-1"></a>
### Option 1
<a name="textboxconstraints-validations-definitions-an-array-of-items-where-each-item-is-of-the-type"></a>
### An array of items, where each item is of the type:
<a name="textboxconstraints-validations-definitions-an-array-of-items-where-each-item-is-of-the-type-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|message|True|a string to display when the text box's value fails validation.
|isValid|True|contains an expression that evaluates to true or false. Within the expression, you define the condition that determines whether the text box is valid.
|await|False|await function for validation
|skip|False|skip function for validation
|fx.feature|False|
<a name="textboxconstraints-validations-definitions-option-2"></a>
### Option 2
<a name="textboxconstraints-validations-definitions-an-array-of-items-where-each-item-is-of-the-type-1"></a>
### An array of items, where each item is of the type:
<a name="textboxconstraints-validations-definitions-an-array-of-items-where-each-item-is-of-the-type-1-an-object-with-the-following-properties-1"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|message|True|A string to display when the text box's value fails validation.
|regex|True|JavaScript regular expression pattern. If specified, the text box's value must match the pattern to validate successfully. The default value is null. For more information about regex syntax, see [Regular expression quick reference](https://learn.microsoft.com/dotnet/standard/base-types/regular-expression-language-quick-reference).
|fx.feature|False|

<a name="textboxconstraints"></a>
# textBoxConstraints
* [textBoxConstraints](#textboxconstraints)
    * [Definitions:](#textboxconstraints-definitions)
        * [Option 1](#textboxconstraints-definitions-option-1)
        * [Option 2](#textboxconstraints-definitions-option-2)

<a name="textboxconstraints-definitions"></a>
## Definitions:
<a name="textboxconstraints-definitions-option-1"></a>
### Option 1
<a name="textboxconstraints-definitions-option-1-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|required|False|Value can be a boolean or an expression(string). If true, then the text box must have a value to validate successfully. The default value is false.
|regex|False|JavaScript regular expression pattern. If specified, the text box's value must match the pattern to validate successfully. The default value is null. For more information about regex syntax, see [Regular expression quick reference](https://docs.microsoft.com/en-us/dotnet/standard/base-types/regular-expression-language-quick-reference).
|validationMessage|False|A string to display when the text box's value fails validation.
|fx.feature|False|
<a name="textboxconstraints-definitions-option-2"></a>
### Option 2
<a name="textboxconstraints-definitions-option-2-an-object-with-the-following-properties-1"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|required|False|Value can be a boolean or an expression(string). If true, then the text box must have a value to validate successfully. The default value is false.
|validations|False|An array where you add conditions for checking the value provided in the text box. See [here](dx-textBoxConstraints-validations.md) for more on constraints.
|fx.feature|False|

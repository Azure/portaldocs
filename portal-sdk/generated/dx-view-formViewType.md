<a name="formviewtype"></a>
# FormViewType
* [FormViewType](#formviewtype)
    * [Sections](#formviewtype-sections)
    * [Properties Section](#formviewtype-properties-section)
        * [Option 1](#formviewtype-properties-section-option-1)
        * [Option 2](#formviewtype-properties-section-option-2)
        * [Option 3](#formviewtype-properties-section-option-3)

<a name="formviewtype-sections"></a>
## Sections
| Name | Required | Description
| ---|:--:|:--:|
|kind|True|
|export|False|
|parameters|False|
|resources|False|
|dataSources|False|
|commands|False|
|properties|True|
|outputs|False|
|fx.feature|False|
<a name="formviewtype-properties-section"></a>
## Properties Section
<a name="formviewtype-properties-section-option-1"></a>
### Option 1
<a name="formviewtype-properties-section-option-1-an-object-with-the-following-properties"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|isWizard|False|
|title|True|
|steps|True|
|deployment|True|
|fx.feature|False|
<a name="formviewtype-properties-section-option-2"></a>
### Option 2
<a name="formviewtype-properties-section-option-2-an-object-with-the-following-properties-1"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|isWizard|False|
|title|True|
|primaryButtonLabel|False|
|steps|True|
|armRequest|True|
|fx.feature|False|
<a name="formviewtype-properties-section-option-3"></a>
### Option 3
<a name="formviewtype-properties-section-option-3-an-object-with-the-following-properties-2"></a>
##### An object with the following properties
| Name | Required | Description
| ---|:--:|:--:|
|isWizard|False|
|title|True|
|primaryButtonLabel|False|
|steps|True|
|fx.feature|False|

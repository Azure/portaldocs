* [Understanding Localization](#understanding-localization)
    * [Language-detection in the portal](#understanding-localization-language-detection-in-the-portal)
    * [Language fallback](#understanding-localization-language-fallback)
    * [List of accepted languages](#understanding-localization-list-of-accepted-languages)
    * [Locale in the portal](#understanding-localization-locale-in-the-portal)
    * [Language/locale parameters](#understanding-localization-language-locale-parameters)
    * [Localizing your extension](#understanding-localization-localizing-your-extension)
    * [Localizing build](#understanding-localization-localizing-build)
    * [Number formatter](#understanding-localization-number-formatter)
    * [Date formatter](#understanding-localization-date-formatter)
    * [Important references](#understanding-localization-important-references)
* [Globalization API](#globalization-api)
    * [Implementation Details](#globalization-api-implementation-details)
    * [Number Formatter](#globalization-api-number-formatter-1)


<a name="understanding-localization"></a>
## Understanding Localization

<a name="understanding-localization-language-detection-in-the-portal"></a>
### Language-detection in the portal

Language detection in the Azure portal works similar to how most systems in place will detect language. When the user makes a request to the Portal, the language/locale of the user is given in the request. This language is then checked against our list of supported languages. If the language is supported by the portal then it is accepted and set as the user language.

All language detection occurs by the Portal and is given to the extension at the time it is loaded. All extensions will be required to support all 19 mandatory languages.

<a name="understanding-localization-language-fallback"></a>
### Language fallback

When the user's language is checked against the list of supported languages and is not supported by the portal, then we implement our language Fallback algorithm. For any given language we will try to find the best matching language that the portal supports. It is a heuristic that is open to modifications in the future if holes in the language fallback selection are found or overrides are needed.

Extensions will be given the language at the time the extension is loaded and the language will be guaranteed to be in the list of supported languages.

<a name="understanding-localization-list-of-accepted-languages"></a>
### List of accepted languages

The Azure Portal is localized in 18 languages. All extensions will be required to support all 18 mandatory languages from the language code list.

Language 				| Culture Code
-------- 				| ------------
English	 				| en
German   				| de
Spanish  				| es
French   				| fr
Indonesian				| id
Italian  				| it
Japanese 				| ja
Korean   				| ko
Portuguese (Brazil) 	| pt-BR
Russian 				| ru
Chinese (Simplified) 	| zh-Hans
Chinese (Traditional) 	| zh-Hant
Czech                   | cs
Dutch                   | nl
Hungarian               | hu
Portuguese (Portugal)   | pt-PT
Polish                  | pl
Swedish                 | sv
Turkish                 | tr

<a name="understanding-localization-locale-in-the-portal"></a>
### Locale in the portal

Learn how locale can be used and set in the portal.

<a name="understanding-localization-locale-in-the-portal-concepts"></a>
#### Concepts

**Display Language**

- This is the locale string use for text in the UI.

**Format Culture**

- This is locale string used for formatting.

**Raw Locale**

- This is a string that indicates the user's desired **display language** and **format culture**.
	- It can be a single locale or two locales delimited by '.'
		- The first is the **display language**, the second is the **format culture**
			- If only one is present, the **format culture** is the same as the **display language**
		- Eg: "en-us", "fr", "en-us.fr-fr".

**Effective Locale**

- This is a string that encodes information about the **display language** and the **format culture** used within a window/iframe context.
	- The value is encoded as two locale strings delimited by a ".". Eg. "es-es.fr-fr".
	- The **display language** part of the **effective locale** must be one of the languages supported by the application. The list of supported locales is specified in *ApplicationContext.SupportedLocales*.
	- This is exposed internally as* fx.environment.effectiveLocale*.
	- This is exposed publically through the module **"MsPortalFx/Globalization"** as
		- **displayLanguage**
		- **formatCulture**

<a name="understanding-localization-locale-in-the-portal-mechanics"></a>
#### Mechanics

**Setting the Display Language and Format Culture**

- The query string parameter 'l' is used to set the **raw locale** of the page. If the query string is not present, the *AcceptLanguage* header of the request is used as the **raw locale**.
- Setting the query string parameter does not result in any persisted cookie.
- Given the **raw locale** of the request, the framework will map that to an **effective locale**. The **effective locale** is then used to set the thread culture of the server application. It is also then emitted to the client script context through fx.environment.effectiveLocale.
- The *"x-ms-effective-locale"* header is set only by AJAX requests to indicate the **effective locale** of the request. The *AcceptLanguage* header is ignored for AJAX requests.

<a name="understanding-localization-language-locale-parameters"></a>
### Language/locale parameters

The users display language and format culture are saved to User Settings.

You can access the user's current display language and format culture using the following TypeScript:

```ts

import * as Globalization from "MsPortalFx/Globalization";
var displayLanguage = Globalization.displayLanguage;
var formatCulture = Globalization.formatCulture;

```

<a name="understanding-localization-localizing-your-extension"></a>
### Localizing your extension

Learn how to expose your extension to multiple languages and cultures

<a name="understanding-localization-localizing-build"></a>
### Localizing build

Portal Azure localization uses .NET localization as it's foundation. Please ensure that your build has .NET localization correctly setup.

<a name="understanding-localization-localizing-build-references"></a>
#### References
<a href="https://msdn.microsoft.com/en-us/library/h6270d0z(v=vs.110).aspx">Globalizing and Localizing .NET Framework Applications</a>

<a href="https://microsoft.sharepoint.com/teams/WAG/EngSys/Implement/OneBranch/Localization.aspx?a=1">Azure Engineering - Localization in Corext based on Mlp and LBA</a>

<a name="understanding-localization-localizing-build-localizing-strings"></a>
#### Localizing strings

To get ready for a localized version of the API, the samples demonstrate building an extension which is localizable.

All strings are placed inside of a standard [.NET RESX file](https://msdn.microsoft.com/en-us/library/ekyft91f.aspx), which can be found at `ClientResources.resx`. This file contains all localizable strings in the extension. You can also add multiple resx files if desired. In the csproj file, the resx is configured with a few additional properties:

```xml
<EmbeddedResource Include="Client\ClientResources.resx">
  <Generator>PublicResXFileCodeGenerator</Generator>
  <LastGenOutput>ClientResources.Designer.cs</LastGenOutput>
  <BundleId>SamplesExtension</BundleId>
  <SubType>Designer</SubType>
</EmbeddedResource>
```

`Microsoft.PortalDefinition.targets` includes the components required to generate TypeScript classes which contain typed contents of the resx file. After building the samples extension, you will find the generated TypeScript definitions for your strings in `\Client\ClientResources.d.ts`. You should not edit this file, as it is auto-generated by the build.


<a name="understanding-localization-localizing-build-using-localized-strings"></a>
#### Using localized strings

To refer to the string in TypeScript, the module for the resource must first be imported.  This allows for static typing to ensure the requested string exists at compile time:

```ts

import * as ClientResources from "ClientResources";

...

this.subtitle(ClientResources.hubsLensTitle);
```

There are many cases where you will refer to a string directly from PDL. The compiler needs to understand which module contains the string, as well as the resource key:

```xml
<Lens Name="PartsLens"
      Title="{Resource partsLensTitle, Module=ClientResources}">
```


<a name="understanding-localization-localizing-build-formatting-strings-according-to-locale"></a>
#### Formatting strings according to locale

The [Azure Portal Globalization API Formatters](portalfx-globalization.md) enables you to easily format numbers, currencies, and dates for different cultures in JavaScript.

This is exposed publically through the module "MsPortalFx/Globalization"

```ts

import * as Globalization from "MsPortalFx/Globalization";
var displayLanguage = Globalization.displayLanguage;
var formatCulture = Globalization.formatCulture;

```

<a name="understanding-localization-number-formatter"></a>
### Number formatter
**Globalization.NumberFormat.create([options])**

```ts

import * as Globalization from "MsPortalFx/Globalization";
var number = 123456.789;

// User locale is 'de-DE'
// German uses comma as decimal separator and period for thousands
console.log(Globalization.NumberFormat.create().format(number));
// → 123.456,789

```

<a name="understanding-localization-date-formatter"></a>
### Date formatter
**Globalization.DateTimeFormat.create([options])**

```ts

import * as Globalization from "MsPortalFx/Globalization";
var date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));

// British English uses day-month-year order
// User locale is 'en-GB'
console.log(Globalization.DateTimeFormat.create().format(date));
// → "20/12/2012"

```

<a name="understanding-localization-date-formatter-testing-localization"></a>
#### Testing localization

The framework supports simple pseudo-localization of client side strings. This can be used to verify that your strings are coming from .resx files, but it doesn't verify that your localization process is setup correctly.

This can be enabled by adding the following query string parameter:

```
http://localhost:12000?l=qps-ploc
```

You can force the portal to run in a specific language. This can be used to verify that the end-to-end localization process is setup correctly for a given language. Note: you may have to clear user settings for the language to switch successfully.
```
http://localhost:12000?l=en-us
```

It may be helpful at development time to use pseudo-localization to ensure that new features are properly localized.

<a name="understanding-localization-date-formatter-marketplace"></a>
#### Marketplace

Packages submitted to the Azure Marketplace must be localized as well.  For more information, read [localization in the gallery](../../gallery-sdk/generated/index-gallery.md##gallery-item-specificiations-localization).

<a name="understanding-localization-important-references"></a>
### Important references

<a href="https://msdn.microsoft.com/en-us/library/w7x1y988(v=vs.110).aspx">Best Practices for Developing World-Ready Applications</a>

<a href="https://msdn.microsoft.com/en-us/library/c6zyy3s9%28v=vs.140%29.aspx">ASP.NET Globalization and Localization</a>

<a href="https://msdn.microsoft.com/en-us/library/h6270d0z(v=vs.110).aspx">Globalizing and Localizing .NET Framework Applications</a>

<a href="https://microsoft.sharepoint.com/teams/WAG/EngSys/Implement/OneBranch/Localization.aspx?a=1">Azure Engineering - Localization in Corext based on Mlp and LBA</a>

* [Understanding Localization](#understanding-localization)
    * [Language-detection in the portal](#understanding-localization-language-detection-in-the-portal)
    * [Language fallback](#understanding-localization-language-fallback)
    * [List of accepted languages](#understanding-localization-list-of-accepted-languages)
    * [Locale in the portal](#understanding-localization-locale-in-the-portal)
    * [Language/locale parameters](#understanding-localization-language-locale-parameters)
    * [Localizing your extension](#understanding-localization-localizing-your-extension)
    * [Localizing build](#understanding-localization-localizing-build)
    * [Number formatter](#understanding-localization-number-formatter)
    * [Date formatter](#understanding-localization-date-formatter)
    * [Important references](#understanding-localization-important-references)
* [Globalization API](#globalization-api)
    * [Implementation Details](#globalization-api-implementation-details)
    * [Number Formatter](#globalization-api-number-formatter-1)


<a name="globalization-api"></a>
## Globalization API

The Globalization Formatters enables you to easily format numbers, currencies, and dates for different cultures in JavaScript.

<a name="globalization-api-implementation-details"></a>
### Implementation Details
This is exposed publically through the module "MsPortalFx/Globalization"

```ts

import * as Globalization from "MsPortalFx/Globalization";
var displayLanguage = Globalization.displayLanguage;
var formatCulture = Globalization.formatCulture;

```

The Globalization API is a wrapper for the native [Javascript library Intl](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl "Javascript library Intl").

<a name="globalization-api-number-formatter-1"></a>
### Number Formatter
**Globalization.NumberFormat.create([options])**

<a name="globalization-api-number-formatter-1-options"></a>
#### Options
Optional. An object with some or all of the following properties:

**style**

- The formatting style to use. Possible values are "decimal" for plain number formatting, "currency" for currency formatting, and "percent" for percent formatting; the default is "decimal".

**currency**

- The currency to use in currency formatting. Possible values are the ISO 4217 currency codes, such as "USD" for the US dollar, "EUR" for the euro, or "CNY" for the Chinese RMB — see the Current currency & funds code list. There is no default value; if the style is "currency", the currency property must be provided.

**currencyDisplay**

- How to display the currency in currency formatting. Possible values are "symbol" to use a localized currency symbol such as €, "code" to use the ISO currency code, "name" to use a localized currency name such as "dollar"; the default is "symbol".

**useGrouping**

- Whether to use grouping separators, such as thousands separators or thousand/lakh/crore separators. Possible values are true and false; the default is true.

> [WACOM.NOTE] The following properties fall into two groups: minimumIntegerDigits, minimumFractionDigits, and maximumFractionDigits in one group, minimumSignificantDigits and maximumSignificantDigits in the other. If at least one property from the second group is defined, then the first group is ignored.

**minimumIntegerDigits**

- The minimum number of integer digits to use. Possible values are from 1 to 21; the default is 1.

**minimumFractionDigits**

- The minimum number of fraction digits to use. Possible values are from 0 to 20; the default for plain number and percent formatting is 0; the default for currency formatting is the number of minor unit digits provided by the ISO 4217 currency code list (2 if the list doesn't provide that information).

**maximumFractionDigits**

> [WACOM.NOTE] The maximum number of fraction digits to use. Possible values are from 0 to 20; the default for plain number formatting is the larger of minimumFractionDigits and 3; the default for currency formatting is the larger of minimumFractionDigits and the number of minor unit digits provided by the ISO 4217 currency code list (2 if the list doesn't provide that information); the default for percent formatting is the larger of minimumFractionDigits and 0.

**minimumSignificantDigits**


- The minimum number of significant digits to use. Possible values are from 1 to 21; the default is 1.

**maximumSignificantDigits**

- The maximum number of significant digits to use. Possible values are from 1 to 21; the default is minimumSignificantDigits.

<a name="globalization-api-number-formatter-1-examples"></a>
#### Examples

**Example: Basic usage**

```ts

import * as Globalization from "MsPortalFx/Globalization";
var number = 123456.789;

// User locale is 'de-DE'
// German uses comma as decimal separator and period for thousands
console.log(Globalization.NumberFormat.create().format(number));
// → 123.456,789
// User locale is 'ar-EG'// Arabic in most Arabic speaking countries/regions uses real Arabic digits
console.log(Globalization.NumberFormat.create().format(number));
// → ١٢٣٤٥٦٫٧٨٩
// User locale is 'en-IN'// India uses thousands/lakh/crore separators
console.log(Globalization.NumberFormat.create().format(number));
// → 1,23,456.789
// User locale is 'zh-Hans-CN-u-nu-hanidec' with Chinese decimal numbering system// the nu extension key requests a numbering system, e.g. Chinese decimal
console.log(Globalization.NumberFormat.create().format(number));
// → 一二三,四五六.七八九

````

**Example: Using options**

```ts

import * as Globalization from "MsPortalFx/Globalization";
var number = 123456.789;

// request a currency format// User locale is 'de-DE'
console.log(Globalization.NumberFormat.create({ style: 'currency', currency: 'EUR' }).format(number));
// → 123.456,79 €
// the Japanese yen doesn't use a minor unit// User locale is 'ja-JP'
console.log(Globalization.NumberFormat.create({ style: 'currency', currency: 'JPY' }).format(number));
// → ￥123,457
// limit to three significant digits// User locale is 'en-IN'
console.log(Globalization.NumberFormat.create({ maximumSignificantDigits: 3 }).format(number));
// → 1,23,000

```


<a name="globalization-api-number-formatter-1-date-formatter-1"></a>
#### Date Formatter

**Globalization.DateTimeFormat.create([options])**

<a name="globalization-api-number-formatter-1-options-1"></a>
#### Options

Optional. An object with some or all of the following properties:

**localeMatcher**

- The locale matching algorithm to use. Possible values are "lookup" and "best fit"; the default is "best fit". For information about this option, see the Globalization page.

**timeZone**

- The time zone to use. The only value implementations must recognize is "UTC"; the default is the runtime's default time zone. Implementations may also revcognize the time zone names of the IANA time zone database, such as "Asia/Shanghai", "Asia/Kolkata", "America/New_York".

**hour12**

- Whether to use 12-hour time (as opposed to 24-hour time). Possible values are true and false; the default is locale dependent.

**formatMatcher**

- The format matching algorithm to use. Possible values are "basic" and "best fit"; the default is "best fit". See the following paragraphs for information about the use of this property.The following properties describe the date-time components to use in formatted output, and their desired representations. Implementations are required to support at least the following subsets:
	- weekday, year, month, day, hour, minute, second
	- weekday, year, month, day
	- year, month, day
	- year, month
	- month, day
	- hour, minute, second
	-  hour, minute
- Implementations may support other subsets, and requests will be negotiated against all available subset-representation combinations to find the best match. Two algorithms are available for this negotiation and selected by the formatMatcher property: A fully specified "basic" algorithm and an implementation dependent "best fit" algorithm.

	- **weekday** - The representation of the weekday. Possible values are "narrow", "short", "long".

	- **Era** - The representation of the era. Possible values are "narrow", "short", "long".

	- **Year** - The representation of the year. Possible values are "numeric", "2-digit".

	- **Month** - The representation of the month. Possible values are "numeric", "2-digit", "narrow", "short", "long".

	- **Day** - The representation of the day. Possible values are "numeric", "2-digit".

	- **Hour** - The representation of the hour. Possible values are "numeric", "2-digit".

	- **Minute** - The representation of the minute. Possible values are "numeric", "2-digit".

	- **Second** - The representation of the second. Possible values are "numeric", "2-digit".

	- **timeZoneName** - The representation of the time zone name. Possible values are "short", "long".

> [WACOM.NOTE] The default value for each date-time component property is undefined, but if all component properties are undefined, then year, month, and day are assumed to be "numeric".

<a name="globalization-api-number-formatter-1-examples-1"></a>
#### Examples
**Example: Using DateTimeFormat**


```ts

import * as Globalization from "MsPortalFx/Globalization";
var date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));

// formats below assume the local time zone of the locale;
// America/Los_Angeles for the US
// US English uses month-day-year order
// User locale is 'en-US'
console.log(Globalization.DateTimeFormat.create().format(date));
// → "12/19/2012"
// British English uses day-month-year order
// User locale is 'en-GB'
console.log(Globalization.DateTimeFormat.create().format(date));
// → "20/12/2012"
// Korean uses year-month-day order
// User locale is 'ko-KR'
console.log(Globalization.DateTimeFormat.create().format(date));
// → "2012. 12. 20."
// Arabic in most Arabic speaking countries/regions uses real Arabic digits
// User locale is 'ar-EG'
console.log(Globalization.DateTimeFormat.create().format(date));
// → "٢٠‏/١٢‏/٢٠١٢"
// for Japanese, applications may want to use the Japanese calendar,
// where 2012 was the year 24 of the Heisei era
// User locale is 'ja-JP-u-ca-japanese' using the Japanese calendar
console.log(Globalization.DateTimeFormat.create().format(date));
// → "24/12/20"

```

**Example: Using options**

```ts

import * as Globalization from "MsPortalFx/Globalization";
var date = new Date(Date.UTC(2012, 11, 20, 3, 0, 0));

// request a weekday along with a long date// User locale is 'de-DE'
var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
console.log(Globalization.DateTimeFormat.create(options).format(date));
// → "Donnerstag, 20. Dezember 2012"
// an application may want to use UTC and make that visible// User locale is 'en-US'options.timeZone = 'UTC';
options.timeZoneName = 'short';
console.log(Globalization.DateTimeFormat.create(options).format(date));
// → "Thursday, December 20, 2012, GMT"
// sometimes you want to be more precise// User locale is 'en-AU'
options = {
hour: 'numeric', minute: 'numeric', second: 'numeric',
timeZoneName: 'short'
};
console.log(Globalization.DateTimeFormat.create(options).format(date));
// → "2:00:00 pm AEDT"
// sometimes even the US needs 24-hour time// User locale is 'en-US'
options = {
year: 'numeric', month: 'numeric', day: 'numeric',
hour: 'numeric', minute: 'numeric', second: 'numeric',
hour12: false
};
console.log(date.toLocaleString(options));
// → "12/19/2012, 19:00:00"

```


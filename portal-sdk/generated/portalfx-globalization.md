* [Globalization API](#globalization-api)
    * [Implementation Details](#globalization-api-implementation-details)
    * [Number Formatter](#globalization-api-number-formatter)


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

<a name="globalization-api-number-formatter"></a>
### Number Formatter
**Globalization.NumberFormat.create([options])**

<a name="globalization-api-number-formatter-options"></a>
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

<a name="globalization-api-number-formatter-examples"></a>
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


<a name="globalization-api-number-formatter-date-formatter"></a>
#### Date Formatter

**Globalization.DateTimeFormat.create([options])**

<a name="globalization-api-number-formatter-options-1"></a>
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

<a name="globalization-api-number-formatter-examples-1"></a>
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

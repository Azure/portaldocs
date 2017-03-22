<properties title="" pageTitle="Gallery Metadata" description="" authors="adwest" />

{"gitdown": "include-file", "file": "./includes/gallery-header.md"}

# Gallery Item Metadata
Below you will find a list of all metadata that is collected with a gallery item.


## Identity Information

| Name          | Required | Type    | Constraints                            | Description                            |
| ------------- | -------- | ------- | -------------------------------------- | -------------------------------------- |
| Name          | X        | string  | [A-Za-z0-9]+                           |                                        |
| Publisher     | X        | string  | [A-Za-z0-9]+                           |    									   |
| Version       | X        | string  | [SemVer v2](http://semver.org)         |										   |



## Metadata

| Name                 | Required | Type      | Constraints                            | Description                                     |
| -------------------- | -------- | --------- | -------------------------------------- | ----------------------------------------------- |
| DisplayName          | X        | string    | recommendation 80 characters           | if longer than 80, Portal may not display your item name gracefully			|
| PublisherDisplayName | X        | string    | recommendation 30 characters		   | if longer than 30, Portal may not display your publisher name gracefully    	|
| PublisherLegalName   | X        | string    | max of 256 characters                  |																				|
| Summary              | X        | string    | 60 to 100 characters	               |																				|
| LongSummary          | X        | string    | 140 to 256 characters                  | used on hero image, will fall back to summary   								|							
| Description          | X        | [html][1] | 500 to 5000 characters                 |                                    		         							|



## Images
Below is the list of icons used in the gallery.

| Name          | Width | Height | Notes                                  |
| ------------- | ----- | ------ | -------------------------------------- |
| Hero          | 815px | 290px  | Only required if hero display is used. |
| Wide          | 255px | 115px  | Always required.                       |
| Large         | 115px | 115px  | Always required.                       |
| Medium        | 90px  | 90px   | Always required.                       |
| Small         | 40px  | 40px   | Always required.                       |
| Screenshot(s) | 533px | 324px  | Optional. Maximum of 5 allowed.        |



## Component Metadata
You can include any number of components. Components are used to primarily to specify pricing and legal data. 

| Name                 | Required | Type      | Constraints                            | Description                                             |
| -------------------- | -------- | --------- | -------------------------------------- | ------------------------------------------------------- |
| DisplayName          | X        | string    | max of 256 characters                  |                                                         |
| ComponentType        | X        | enum      | operatingsystem, software, service     |    																		                 |
| PublisherDisplayName | X        | string    | max of 256 characters                  |																				                 |
| Terms                | X        | [html][1] |                                        | The full text of the legal terms                        |
| PrivacyPolicy        | X        | [html][1] |                                        | The full text of the privacy policy                     |
| PricingDetailsUri    | X        | uri       |                                        | A URL to get more details on the price of the component |



## Categories
Each gallery item can be "tagged" with a variety of categories. The common categories in use today are:

* **appInfrastructure** - Application infrastructure
* **clientOS** - Client Operating System
* **devService** - Developer service
* **networking** - Networking
* **database** - Database
* **cache** - Cache
* **security** - Security
* **compliance** - Compliance
* **storage** - Storage
* **bigData** - Big Data
* **backup** - Backup
* **analytics** - Analytics
* **businessApplication** - Business Application
* **media** - Media
* **web** - Web
* **identity** - Identity



## Links
Each gallery item can include a variety of links to additional content. The links are specified as a list of names and urls.

| Name          | Required | Type    | Constraints                            | Description                            |
| ------------- | -------- | ------- | -------------------------------------- | -------------------------------------- |
| DisplayName   | X        | string  | max of 64 characters                   |                                        |
| Uri           | X        | uri     |                                        |    																		 |



## Additional Properities
In addition to the above metadata, gallery authors can also provide custom key/value pair data in the following form.

| Name          | Required | Type    | Constraints                            | Description                            |
| ------------- | -------- | ------- | -------------------------------------- | -------------------------------------- |
| DisplayName   | X        | string  | max of 25 characters                   |                                        |
| Value         | X        | string  | max of 30 characters                   |    																		 |



## HTML Sanitization
For any field that allows HTML the following elements and attributes are allowed.

"h1", "h2", "h3", "h4", "h5", "p", "ol", "ul", "li", "a[target|href]", "br", "strong", "em", "b", "i"

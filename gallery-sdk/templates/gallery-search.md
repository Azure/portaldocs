<properties title="" pageTitle="Marketplace Search" description="" authors="aawest" />

{"gitdown": "include-file", "file": "./includes/gallery-header.md"}

## Marketplace Search ##
While creating your gallery package, keep in mind how your item will be discovered by customers. You will need to properly curate your package into the Marketplace. More information regarding curation <a href="/documentation/articles/gallery-faq">here</a>. Your item will also need to be easily discoverable via Marketplace search.

> [WACOM.NOTE] The Marketplace leverages Azure Search to power its search functionality. [Read more.](https://azure.microsoft.com/en-us/services/search/)

Customers can search for Marketplace items in two locations:

### +New ###
![+New Search Box][New_Search_Box]

When a user searches via the +New search box, they will be taken to the Marketplace "Everything" menu which displays all possible search results.

### Marketplace Search ###
![Marketplace Search][Marketplace_Search]

Searches in Marketplace are made within the context of the current menu. If a customer navigates to the "Virtual Machines" menu and searches, only items located in that menu will be returned. The top level "Everything" menu is the only menu where all gallery items are searched.

> [WACOM.NOTE] If no results are returned within a menu, search will fallback to "Everything" and display any matching results there. 

## Gallery Package Search Metadata ##
The following fields in your package <a href="/documentation/articles/gallery-items">manifest</a> are indexed in Azure Search. They are in descending order of weight given to the field when determining search ranking. 
Marketplace also uses popularity data to rank search results. When a user selects an item from a search result, it is given a small boost to its relevancy in future searches.

- itemDisplayName
- publisherDisplayName
- summary
- description
- longSummary

Example: In general, a gallery item with display name "Azure Package" will be ranked higher than a gallery item with publisher name "Azure Package" for the query "Azure Package". However, this will not always be the case as matches in other fields can result in a higher ranking.

## Marketplace Suggest ##
Suggestions in the Marketplace search boxes only suggest item display names and publisher names. The API finds the closest matching query string and does not prioritize any titles or publishers.

## Localization ##
Marketplace is fully localized, but not all gallery items in the Marketplace are localized. To accommodate this, Marketplace will use a customer's search query to perform an English query as well as a query under the customer's current locale. If the customer's query matches the English or localized fields of a package, the localized package will be returned to the customer.

Example: A customer whose locale is set to Spanish searches for "Storage account". This query will match the English version of the Storage Account gallery package, but the Spanish version of the package will be returned to the customer.

## FAQs and Notes ##

### Search & Hide Keys ###
Hidden Marketplace items behind hide keys will behave differently when searched. See <a href="/documentation/articles/gallery-development">Testing in production</a> for more information on hidden marketplace items.
- Marketplace makes two separate requests for public and hidden items. This allows for the highest version of public and private items to be discoverable via search. 
- Hidden items will appear at the top or bottom of search results. If you do not see your hidden item, look at the bottom of the search results.
- Hidden items will NOT be suggested

### Why does my item not appear as a suggestion? ###
Often times suggest will pick the closest string to the given query. This does not mean that your item will not be deemed as relevant when the user completes their search. Hidden items will not be suggested even with a hide key present.


[New_Search_Box]: ../media/gallery-search/New_Search_Box.png
[Marketplace_Search]: ../media/gallery-search/Marketplace_Search.png
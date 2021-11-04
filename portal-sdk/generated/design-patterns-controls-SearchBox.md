# SearchBox

 
<a name="basics"></a>
### Basics
SearchBox provides an input field for searching through content, allowing users to locate specific items within the website or app.


<!-- TODO get an IMAGE to embed here -->

<!-- TODO get an SAMPLE CODE to embed here -->

 
<a name="when-to-use"></a>
### When to use
Use SearchBox to allow the user to quickly locate specific items.


 
<a name="best-practices"></a>
### Best practices

<a name="best-practices-zero-input-state"></a>
#### Zero input state
When the user has clicked into the SearchBox, but has not entered any text, there is an opportunity to display "hint text" within the input field, explaining what a user can do next. This could prompt a user to search for specific type content, or explain the scope of the search. Examples include "type to search", "try searching for <x>", "search for a place" or "type to search in <x location>".

<a name="best-practices-autocomplete-suggestions"></a>
#### Autocomplete suggestions
As the user enters a query string, they are provided with a dropdown of autocomplete suggestions or disambiguation options. This will help them expedite the input process and formulate an effective query. Recent search history, trending searches, contextual search suggestions, hints and tips are all good candidates for autocomplete content. In general, autocomplete suggestions have the user's input highlighted in some way (generally bolded) to indicate why it's being displayed. As the user enters more keystrokes, the suggestions update continuously/in real time. To see autocomplete suggestions, the user does not need to hit enter (execute a full search), as it is a lightweight way to get quick suggestions or results. If there are mixed result types within the autocomplete suggestions, provide visual indicators or grouping to help organize the information, making it easier to parse.

<a name="best-practices-full-search"></a>
#### Full search
If a user hits "enter" after entering input, a full search is executed. Full searches often go to another "results" page, or change/filter the content of the current page to show only applicable content. The results can appear in any form that best communicates the content.

As a general guideline, results should be displayed in context with the query that was typed, with immediate access to edit the query or enter a new one. One method to enable efficient access to both edit the previous query and enter a new query is to highlight the previous query when the field is reactivated. This way, any keystroke will replace the previous string, but the string is maintained so that the user can position a cursor to edit or append the previous string.

<a name="best-practices-search-scopes"></a>
#### Search scopes
Although search entry points tend to be similarly visualized, they can provide access to results that range from broad to narrow. By effectively communicating the scope of a search, you can help to ensure that the user expectation will be met by the capabilities of the search you are performing, which will reduce the possibility of frustration. The search entry point should be juxtaposed with the content being searched.

Some common search scopes include:

Global: Search across multiple sources of cloud and local content. Varied results include URLs, documents, media, actions, apps, and more.
Web: Search a web index. Results include pages, entities, and answers.
My stuff: Search across device(s), cloud, social graphs, and more. Results are varied, but are constrained by the connection to user account(s).
SearchBox with no parent container
Use a SearchBox without a parent container when it is not restricted to a certain width to accommodate other content. This search box will span the entire width of the space it's in.

<a name="best-practices-do"></a>
#### Do

* Use placeholder text in the SearchBox to describe what users can search for.
* Example: "Search"; "Search files"; "Search site"
* Once the user has clicked into the SearchBox but hasn’t entered input yet, use "hint text" to communicate search scope.
* Examples: "Try searching for a PDFs"; "Search contacts list"; "Type to find <content type>"
* Provide autocomplete suggestions to help the user search quickly. These suggestions can be from past searches or auto-completions of the user's query text.
* Provide autocomplete suggestions where there are strong matches to the user's query that the user may want to view immediately.
* Use a visual separator to define a group of a similar or conceptually aligned autocomplete suggestions.
* If possible, provide a preview (e.g. image, title, etc.) for autocomplete suggestions to help the user quickly determine if the suggested result is what they were searching for.
* Use the Underlined SearchBox for CommandBars.

<a name="best-practices-don-t"></a>
#### Don&#39;t

* Don't leave the SearchBox blank because it's too ambiguous.
* Don't have lengthy and unclear hint text. It should be used to clarify and set expectations.
* Don't provide too many autocomplete suggestions, as that will overwhelm the user.
* Don't provide inaccurate matches or bad predictions, as it will make search seem unreliable and will result in user frustration.
* Don’t provide too much information or metadata in the suggestions list; it’s intended to be lightweight.
* Don’t use an autocomplete dropdown for something that has one choice; there must be more than one item.
* Don't build a custom search control based on the default text box or any other control.
* Don't use SearchBox if you cannot reliably provide accurate results.


 
<a name="developer-tips-and-tricks"></a>
### Developer tips and tricks

* Developers must use the "update" callback option to indicate to screen readers how many search results were found. Only return an empty array from said callback when there are no results.



<a name="developer-tips-and-tricks-interactive-control-and-sample-source-code"></a>
#### Interactive control and sample source code
Go to the playground site to use the latest control and get source code for your project.  [Learn more about playground](./top-extensions-controls-playground.md).

*  <a href="https://ms.portal.azure.com/?Microsoft_Azure_Playground=true#blade/Microsoft_Azure_Playground/ControlsIndexBlade/SearchBox_create_Playground" target="_blank">SearchBox in the interactive controls playground</a>




 
<a name="related-info"></a>
### Related info

* <a href="https://www.figma.com/file/Bwn8rmUOYtnPRwA3JoQTBn/Azure-Portal-Toolkit?node-id=3492%3A393913" target="_blank">SearchBox in Azure Portal Toolkit (Figma)</a>

* [Azure design guidance](http://aka.ms/portalfx/design)



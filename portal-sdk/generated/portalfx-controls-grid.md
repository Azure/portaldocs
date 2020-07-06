
<a name="grid"></a>
## Grid

The grid control in SDK provides a rich set of features to build experiences that visualize tabular, structured data.

![Grid](../media/portalfx-controls/grid-intro.png)

From simple experiences that visualize basic lists to advanced scenarios such as virtualized hierarchical data; the grid control can be configured with different options such as multiple selection, custom formatters, grouping, filtering, sorting, paging and virtualization.

<a name="grid-getting-started"></a>
### Getting Started
The Grid API is in the MsPortalFx.ViewModels.Controls.Lists.Grid namespace.
To create a grid you will need to provide data, column definitions, plugins, and options. Some of the basic implementations are provided [here](#grid-further-resources).

[Grid Samples][GridSamples]

<a name="grid-plugins"></a>
### Plugins
There are many plugins for the grid control to add behaviors.
Grid plugins are called "extensions" in the API.
The "extension" terminology can be confusing to portal "extension" authors.
So, in this document the grid extensions will be referred to as plugins.

- [SelectableRow](#grid-selection-and-activation) - Plugin to have selectable rows.
- ResizableColumn (Docs coming soon)              - Plugin to have resizable columns.
- [SortableColumn](#grid-sorting)                 - Plugin to have sortable columns.
- [Filterable](#grid-filtering)                   - Plugin to have filterable rows.
- [ContextMenuShortcut](#grid-context-menus)      - Plugin to have a shortcut to the item context menu displayed in the row.
- [Pageable](#grid-paging)                        - Plugin to handle and display large items in sequential pages.
- [Scrollable](#grid-scrolling)                   - Plugin to display items with virtual scrolling.
- [Groupable](#grid-grouping)                     - Plugin to group rows by column value.
- [Hierarchical](#grid-hierarchical)              - Plugin to display hierarchical items.
- [EditableRow](#grid-editing)                    - Plugin to have editable rows.
- [ReorderRow](#grid-reordering)                  - Plugin to have reorder rows.
- RightClickableRow (Docs coming soon)            - Plugin to have right-clickable row.
- Hoverable (Docs coming soon)                    - Plugin to enable hover index communication with other parts.

Plugins are enabled in three ways.
- with bit flags passed to the ViewModel constructor.
- by default.
- as a dependency of an enabled plugin.

To enable a plugin you need to do two things.
First, you must set the appropriate bit flag when you construct the grid.
It is important that you combine the bit flags with the "|" or "+" operator.
*A common pitfall is to use "&" which results in no plugins.*
Second, you must provide plugin options.

The following sample shows a simple method of enabling the plugins:

```typescript

// Define the grid plugins and options.
this.grid = new Grid.ViewModel<WorkItem, WorkItem>(
    container,
    null,
    Grid.Extensions.Scrollable | Grid.Extensions.Filterable | Grid.Extensions.SortableColumn,
    {
        scrollable: <Grid.ScrollableOptions<WorkItem>>{
            dataNavigator: this._navigator,
        },
        filterable: <Grid.FilterableOptions>{
            // Server filter causes the grid to use the data navigator for filtering.
            serverFilter: ko.observable(true),
        },
        sortableColumn: <Grid.SortableColumnOptions<WorkItem>>{
        },
    });

```

Plugin compatibility:

![No-code Browse grid](../media/portalfx-controls/gridchart.png)

<a name="grid-providing-data"></a>
### Providing Data
In the basic scenario your data is provided to the grid, throw the items param as a KnockoutObservableArray&lt;T>.
The array can be one you create or more commonly it will be the items property of a QueryView.

In virtualization scenarios you will provide the data to the grid via a DataNavigator.
Navigators can support two data retrieval patterns.
- The first is sequential data access using continuation tokens.Sequential navigation can be enabled by the Pageable plugin.
- The second is using random data access aka skip-take. Random access navigation can be enabled by the Pageable or Scrollable plugins.

[Data Documentation](portalfx-data.md)

<a name="grid-defining-columns"></a>
### Defining Columns
Columns are defined by setting the columns property on the grid view model.
The header text of the column is declared with the name property.
Cell values for the column are determined by the itemKey property.
The itemKey specifies the name of the property on your data item.
For each data item the grid will use the itemKey to read the value.
There are many other column options that specify the formatting of the value or enable plugin specific behaviors.

```typescript

const columns: MsPortalFx.ViewModels.Controls.Lists.Grid.Column[] = [
    {
        itemKey: "name",
        name: ko.observable<string>(ClientResources.controlSampleName),
    },
    {
        itemKey: "ssnId",
        name: ko.observable<string>(ClientResources.controlSampleSsn),
        getCellAriaLabel: (item: Person) => {
            return ClientResources.gridCellAriaLabel.format(item.name(), item.ssnId());
        },
    },
    {
        itemKey: "bills",
        name: ko.observable<string>(ClientResources.gridBasicGridBills),
    },
];
this.basicGridViewModel.columns = ko.observableArray<MsPortalFx.ViewModels.Controls.Lists.Grid.Column>(columns);

```

<a name="grid-formatting"></a>
### Formatting
Columns are formatted using three key properties.
  - ``itemKey``: The property of your data item to display.
  - ``format``: Optional format type from the Format enumeration.
  - ``formatOptions``:  Optional formatter specific options.

By default values you specify with the column itemKey will be formated as text.
The text formatter does a simplistic toString conversion.
If you have an object or need more specific formatting for a date or number there are many built in formatters to use.

[Formatted Grid Sample][FormattedSample]

<a name="grid-formatting-dates"></a>
### Formatting Dates
Dates are formatted using the Intl API using the current locale set by the user.
The data value of the date can be a number, string, or date.
The formatters will convert to date and then use the Intl API to convert to text.
The following formatters can be used for formatting dates:
- ShortDate: 7/18/2013
- LongDate: Thursday, July 18, 2013
- MonthDay: July 18
- YearMonth: July, 2013
- ShortTime: 11:20 AM
- LongTime: 11:20:19 AM
- CustomDate: Any format possible using Intl date formatting

```typescript

{
    itemKey: "birthday",
    name: ko.observable<string>(ClientResources.controlSampleBirthday),
    format: MsPortalFx.ViewModels.Controls.Lists.Grid.Format.CustomDate,
    formatOptions: {
        dateFormat: {
            month: "long",
            day: "numeric",
        },
    },
},

```

You can create your on Intl option or use one of the predefined options from the ``Globalization.Intl`` namespace.

[Intl API DateTime][IntlAPIDateTime]
<a name="grid-formatting-numbers"></a>
### Formatting Numbers
There is a single formatter for formatting numbers called the Number formatter.
The number formatter uses the Int API and will format to the current locale the user has set in the portal.
It is capable of formatting numbers in many ways including currency.

```typescript

{
    itemKey: "pairsOfShoes",
    name: ko.observable<string>(ClientResources.controlSamplePairsOfShoes),
    format: MsPortalFx.ViewModels.Controls.Lists.Grid.Format.Number,
    formatOptions: {
        numberFormat: { minimumFractionDigits: 1 },
    },
},

```

[Intl API Number][IntlAPINumber]

<a name="grid-formatting-images"></a>
### Formatting Images
There are several formatters for displaying images in cells.
The preferred formatters are SvgIcon and SvgIconLookup.
The SvgIcon formatter allows you to display an SVG and optional text where the data value contains the SVG or an object containing the SVG and text.
The SvgIconLookup allows you to map data values to SVGs for display.
There are two other similar formatters that use image uris instead of SVGs.
However, portal SVGs are preferred because they are themed.

<a name="grid-formatting-uris"></a>
### Formatting Uris
There is a single Uri formatter that formats a data value containing a URI as a clickable link.
The data value can also be an object containing the URI, text, and target.

<a name="grid-formatting-uris-formatting-text"></a>
#### Formatting Text
The default formatter for the Grid is the Text formatter.
There is also a TextLookup formatter that uses a map to convert specific data values to text.

<a name="grid-formatting-html"></a>
### Formatting Html
The Html formatter allows you to display html.
The html is specified by your data values and can not include knockout data bindings.
If you need knockout bindings use the HtmBindings formatter.

<a name="grid-custom-formatting-htmlbindings"></a>
### Custom Formatting (HtmlBindings)
The grid only has a single way to do custom formatting.
This is done using the HtmlBindings formatter.
With the HtmlBindings formatter you can specify an html template containing knockout bindings.
The $data object bound to the template will be in the following format where value is specified by the itemKey property and settings.item is your data item:

```
{
    value: any,
    settings: {
       item: T
    }
}
```

```typescript

{
    itemKey: "name",
    name: ko.observable<string>("{0}\\{1}".format(ClientResources.controlSampleName, ClientResources.controlSampleSmartPhone)),

    format: MsPortalFx.ViewModels.Controls.Lists.Grid.Format.HtmlBindings,
    formatOptions: {
        htmlBindingsTemplate: "<span data-bind='text: value'></span>\\<span data-bind='text: settings.item.smartPhone'></span>",
    },
},

```

<a name="grid-selection-and-activation"></a>
### Selection and Activation
With the grid you can enable the SelectableRow extension that enables row selections and blade activations.
Selection and activation are separate concepts that overlap in the grid.
Activation in the grid is displaying a blade.
Selection is the selecting of items within the grid.
Depending on your settings the act of selecting may also activate a blade.
This is done by either setting the selection option activateOnSelected to true or by setting specific columns to be activatable by defining `activatable = true`.
 
Blade activations can be homogeneous or heterogeneous.
For homogeneous blade activations you use BladeAction in PDL to specify the blade to open.
For heterogeneous blade activation you use DynamicBladeAction in PDL.
You must also implement createSelection to return a DynamicBladeSelection object per item.

[Grid Selection Sample][SelectableSample]
 
<a name="grid-sorting"></a>
### Sorting
If you enable the SortableColumn plugin grid headers can be used to sort the data.
If you have a dataNavigator the sorting options will be passed to the navigator when changed and the navigator should handle the sorting -- typically by passing to the backend server as part of the query.
If you have local data in an observable items array the grid has a default sort callback that will sort the items in the array.
You can provide a custom sort for local data in the ``SortableColumnOptions sortCallback`` property.
 
For each column you can set the initial sortOrder.
You can also opt out of sorting for a column by setting ``sortable = false``;

[Grid Sorting Sample][SortableSample]
 
<a name="grid-filtering"></a>
### Filtering
The grid has a Filterable row plugin that can be used for filtering.
The plugin provides a simple search box UI that users can use to enter text.
The filtering can occur on the server or in the grid locally.
To enable filtering through the data navigator set serverFiltering to true.
Otherwise the filtering will occur in the grid on the client.

The client side filtering works as follows.
The set of properties to filter against are by default the itemkeys of all columns.
Alternatively, you can specify the set of properties to filter against using the searchableColumns option.
For every searchable property the grid looks for a column definition.
If a column definition is found the grid looks for a filterableFormat option.
If a filterableFormat is found it is used to convert the data to value to a searchable string.
If a filterableFormat is not found the grid converts value to string using JSON.stringify and the text formatter.
The grid then searches for all the search terms in the formatted property values.
If every search term is found the item is added to the filter results.

[Grid Filtering Sample][FilterableSample]

<a name="grid-editing"></a>
### Editing
The editable grid enables editing a list of data entities.
It allows for editing existing items, deleting items, and adding new items.
When a row is being edited the cells will be formatted with the ``editableFormat`` specified on the column.
When not being edited the cells are formatted with ``format`` specified in the column definition.
A row remains in the edit state until all the validators on the cells indicate the row is valid.

There are special formatters for editing that create form controls that allow data editing.
The formatters specifically for editing are
- CheckBox
- TextBox
- MultiselectDropDown
- CheckBoxRowSelection
- DropDown

[Editable Grid Sample][EditableSample]
[All Controls in a Grid Sample][AllControlsSample]

<a name="grid-paging"></a>
### Paging
The pageable plugin enables virtualization for large data sets using sequential and random access.
Alternatively, there is a scrollable plugin for random access scrolling.

For sequential data the ``type`` must be specified ``PageableType.Sequential``.
You must also supply a data navigator that supports loadByContinuationToken.
For sequential data the grid will load the first page of data and display a button for the user to load more data.

For random access data the ``type`` must be specified ``PageableType.Page``.
In addition a data navigator that supports loadBySkipTake is required.
For random access the grid will load the first page and display a pager control at the bottem that will allow the user to navigate through the data pages.

[Pageable Grid Sample][PageableSample]

<a name="grid-grouping"></a>
### Grouping
The grid groupable plugin allows you to order your data into groups of rows with a group header.
To groups are determined by using the ``groupKey`` option to read the property of your data item.
Each item having the same value for the groupKey property will be in the same group.
By default the groups will be auto-generated for each unique group.
However, if you can generate and control the groups yourself through the ``groups`` property.

[Grid Grouping Sample][GroupedSample]

<a name="grid-hierarchical"></a>
### Hierarchical
The hierarchical grid plugin allows you to display hierarchical data with expand and collapse of parent rows.
To display hierarchical data you must implement a hierarchy.
Hierarchies can be somewhat complicated to implement depending on your requirements.
Your hierarchy will supply the current items to display to the grid.
The hierarchy implementation is responsible for initializing and keeping track of the expanded states for all items.
The grid will notify the hierarchy when the user expands or collapses a row and the hierarchy must update the items.

Hierarchies may also support virtualization with the pageable or scrollable plugins.
For virtualization is common to create a custom data navigator that implements the hierarchy interface.
This is because the navigator will be outputting data items that exclude collapsed children.
Is is also important for virtual hierarchies to update the navigator ``metatdata totalItemCount`` on every expand/collapse to return the total items excluding collapsed children.
Updating the count lets the grid know the virtualization needs updating.

[Hierarchical Grid Sample (simplistic hierarchy that repeats)][HierarchicalSample]

[Pageable Hierarchical Grid Sample (also shows demand loading)][PageableHierarchicalSample]

[Scrollable Hierarchical Grid Sample (complicated structure and stream approach)][WorkitemScenarioSample]

<a name="grid-context-menus"></a>
### Context Menus
The context menu shortcut is the ellipsis at the end of each grid row.
It enables displaying the context menu by click.
The context menu shortcut plugin is enabled by default.

To customize the context menu you must supply a ``commandGroup`` property on your grid item containg the command group you wish to display.

[Context Menu Shortcut Grid Sample][ContextMenuSample]

<a name="grid-scrolling"></a>
### Scrolling
The scrollable grid plugin enables scrolling within the grid.
This is useful when the grid needs to fill an entire container and keep the headers at the top.
The container element must have a width and height or the scrolling will not display correctly.
The scrolling can be virtualized or non virtualized.

To fill a blade with the scrollable grid make the blade/part size ``FitToContainer``.
This will ensure the blade content area has a height and width set to the viewport size.
A scrollable grid fixture element directly in the blade will then work properly.

For virtualized scrolling you must supply a data navigator that supports loadBySkipTake.
For non-virtualized grids you do not supply a data navigator and just set the grid ``items`` property directly.

[Scrollable Grid Sample][ScrollableSample]

<a name="grid-reordering"></a>
### Reordering
The grid reorder row plugin allows users to reorder the items in the grid with drag drop.
The reordering can be automatic or handled by the extension using the ``reorderRow`` event.

[Reorderable Grid Sample][ReorderSample]

<a name="grid-dynamic-grid-definition"></a>
### Dynamic Grid Definition
In some cases an extension may not know grid columns or other properties in advance.
In these scenarios the extension author must define and create the grid at run-time.
There are several options for dynamic definition of a grid.

1. Create and add columns when data is available.  The columns property is an observable array and allows changes as needed.
2. Make the grid view model property on your part/blade observable. Instead of declaring `public grid: Grid.ViewModel<T>;` declare the grid as `public grid: KnockoutObservable<Grid.ViewModel<T>>;`. This makes your view model property observable so you can set it whenever you want.  You can also clear it by setting it to null. The template would be the same `<div data-bind="pcControl: grid"></div>`.
3. Use sections for layout.  If you are using sections you can add the grid to the section children dynamically.
4. CustomHtml control has an updatable inner viewmodel.
5. htmlTemplate binding allows you to dynamically specify both the view model and the template `<div data-bind="htmlTemplate: { data: viewModel, html: template }"></div>`

<a name="grid-further-resources"></a>
### Further Resources
- [All Grid Samples][GridSamples]
- [Basic Grid Sample][BasicSample]
- [Formatted Grid Sample][FormattedSample]
- [Selectable Grid Sample][SelectableSample]
- [Context Menu Shortcut Grid Sample][ContextMenuSample]
- [Grouped Grid Sample][GroupedSample]
- [Filterable Grid Sample][FilterableSample]
- [Pageable Grid Sample][pageableSample]
- [Hierarchical Grid Sample][HierarchicalSample]
- [Scrollable Grid Sample][ScrollableSample]
- [Sortable Column Grid Sample][SortableSample]
- [Reorder Grid Sample][reorderSample]
- [Resizeable Column Grid Sample][resizableSample]
- [Editable Grid Sample][EditableSample]
- [All Controls in a Grid Sample][AllControlsSample]

[GridSamples]: http://aka.ms/portalfx/samples#blade/SamplesExtension/GridInstructions/selectedItem/GridInstructions/selectedValue/GridInstructions
[BasicSample]: http://aka.ms/portalfx/samples#blade/SamplesExtension/BasicGridInstructions
[FormattedSample]: http://aka.ms/portalfx/samples#blade/SamplesExtension/FormattedGridInstructions
[SelectableSample]: http://aka.ms/portalfx/samples#blade/SamplesExtension/SelectableGridInstructions
[ContextMenuSample]: http://aka.ms/portalfx/samples#blade/SamplesExtension/ContextMenuShortcutGridInstructions
[GroupedSample]: http://aka.ms/portalfx/samples#blade/SamplesExtension/GroupedGridInstructions
[FilterableSample]: http://aka.ms/portalfx/samples#blade/SamplesExtension/FilterableGridInstructions
[PageableSample]: http://aka.ms/portalfx/samples#blade/SamplesExtension/PageableGridInstructions
[HierarchicalSample]: http://aka.ms/portalfx/samples#blade/SamplesExtension/HierarchicalGridInstructions
[ScrollableSample]: http://aka.ms/portalfx/samples#blade/SamplesExtension/ScrollableGridInstructions
[SortableSample]: http://aka.ms/portalfx/samples#blade/SamplesExtension/SortableColumnGridInstructions
[ReorderSample]: http://aka.ms/portalfx/samples#blade/SamplesExtension/ReorderGridInstructions
[ResizeableSample]: http://aka.ms/portalfx/samples#blade/SamplesExtension/ResizableColumnGridInstructions
[EditableSample]: http://aka.ms/portalfx/samples#blade/SamplesExtension/EditableGridInstructions
[AllControlsSample]: http://aka.ms/portalfx/samples#blade/SamplesExtension/AllControlsGridInstructions
[PageableHierarchicalSample]: http://aka.ms/portalfx/samples#blade/SamplesExtension/PageableHierarchicalGridInstructions
[WorkitemScenarioSample]: http://aka.ms/portalfx/samples#blade/SamplesExtension/SDKMenuBlade/scenariosworkitem
[IntlAPIDateTime] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat
[IntlAPINumber] https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat

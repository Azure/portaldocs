<a name="az-api"></a>
# Az API

The Az API offers a way of interacting with the Framework utiliting and composition APIs.

Below are a subset of the APIs available, to see the latest full set inspect the options available in `@microsoft/azureportal-reactview/Az`.

* [Az API](#az-api)
    * [Setting the view's title](#az-api-setting-the-view-s-title)
    * [Navigation](#az-api-navigation)
        * [Opening another view or blade](#az-api-navigation-opening-another-view-or-blade)
        * [Closing an opened view or blade](#az-api-navigation-closing-an-opened-view-or-blade)
        * [Navigation with a menu blade](#az-api-navigation-navigation-with-a-menu-blade)
        * [Navigating to a dashboard](#az-api-navigation-navigating-to-a-dashboard)
    * [Error Handling](#az-api-error-handling)
    * [Telemetry](#az-api-telemetry)


<a name="az-api-setting-the-view-s-title"></a>
## Setting the view&#39;s title

The view's title appears in the top-left of the view. Most view's will need a custom title, unless rendered inside of a menu.

```typescript
/**
 * Sets the title and optional subtitle of the Blade/Part.
 * Values of 'null' and 'undefined' can be supplied to subsequently clear the title/subtitle.
 * @param title A title string or an object containing title and subtitle strings.
 */
export function setTitle(title: string | { title: string; subtitle?: string } | null | undefined): void;
```

<a name="az-api-navigation"></a>
## Navigation

<a name="az-api-navigation-opening-another-view-or-blade"></a>
### Opening another view or blade

There are two common methods to open another view or blade `openBlade()` or `openContextPane()`, both can be used to open either
a view or a blade. `openBlade()` will navigate the page to another full-screen view or blade whereas `openContextPane()` will
open the new view or blade as a flyout from the right side of the screen.

```typescript
/**
 * Opens a Blade.
 * @param bladeReference A description of the Blade to be opened.
 * @param options Optional options with which to open the Blade.
 * @return A Promise that resolves with a boolean indicating if the Blade was opened.
 */
export function openBlade(bladeReference: BladeReference, options?: OpenBladeOptions): Promise<boolean>;

/**
 * Opens a Blade asynchronously.  A loading experience is displayed while the Blade to-be-opened is determined.
 * @param bladeReferencePromise A Promise that should be resolved with a BladeReference describing the Blade to be opened.
 * @param options Optional options with which to open the Blade.
 * @return A Promise that resolves with a boolean indicating if the Blade was opened.
 */
export function openBladeAsync(bladeReferencePromise: Promise<BladeReference>, options?: OpenBladeAsyncOptions): Promise<boolean>;

/**
 * Opens a Blade in the Context Pane.
 * @param bladeReference A description of the Blade to be opened.
 * @param options Optional options with which to open the Blade.
 * @return A Promise that resolves with a boolean indicating if the Blade was opened.
 */
export function openContextPane(bladeReference: BladeReference): Promise<boolean>;

/**
 * Opens a Blade asynchronously in the Context Pane.  A loading experience is displayed while the Blade to-be-opened is determined.
 * @param bladeReferencePromise A Promise that should be resolved with a BladeReference describing the Blade to be opened.
 * @return A Promise that resolves with a boolean indicating if the Blade was opened.
 */
export function openContextPaneAsync(bladeReferencePromise: Promise<BladeReference>): Promise<boolean>;
```

<a name="az-api-navigation-closing-an-opened-view-or-blade"></a>
### Closing an opened view or blade

Your user may interact with your experience in such a way it requires closing any previously opened views or blades.
This can be achieved using the below options.

```typescript
/**
 * Close any child Blade currently open.
 * @return A Promise that resolves with a boolean indicating if the Blade was closed.
 */
export function closeChildBlade(): Promise<boolean>;

/**
 * Close the Context Blade if it is currently open.
 * @return A Promise that resolves with a boolean indicating if the Blade was closed.
 */
export function closeContextBlade(): Promise<boolean>;

/**
 * Closes this Blade in which this content is hosted.
 * @param Optional data that can be returned to the caller/opener of this Blade.
 * @return A Promise that resolves with a boolean indicating if the Blade was closed.
 */
export function closeCurrentBlade(data?: ReadonlyStringMap<any>): Promise<boolean>;
```

<a name="az-api-navigation-navigation-with-a-menu-blade"></a>
### Navigation with a menu blade

When the ReactView is in the context of a menu blade, for example, when the ReactView is the child of a menu blade,
the following methods are available.

```typescript
/**
 * When this content is hosted in the content area of a MenuBlade, this 'menu' property will be populated
 * with functions to control the MenuBlade.
 */
export const menuBlade: {
    /**
     * Causes the menu blade to navigate to a different item.
     * @param id Identifier of the item to navigate to.
     */
    switchItem(id: string): void;

    /**
     * Opens a Blade in place.
     * @param bladeReference A description of the Blade to be opened.
     * @param options Optional options with which to open the Blade.
     * @return A Promise that resolves with a boolean indicating if the Blade was opened.
     */
    openBlade(bladeReference: BladeReference, options?: OpenBladeOptions): Promise<boolean>;

    /**
     * Opens a Blade in place asynchronously.  A loading experience is displayed while the Blade to-be-opened is determined.
     * @param bladeReferencePromise A Promise that should be resolved with a BladeReference describing the Blade to be opened.
     * @param options Optional options with which to open the Blade.
     * @return A Promise that resolves with a boolean indicating if the Blade was opened.
     */
    openBladeAsync(bladeReferencePromise: Promise<BladeReference>, options?: OpenBladeAsyncOptions): Promise<boolean>;

    /**
     * Sets the title and optional subtitle suffix of the containing MenuBlade.
     * Values of 'null' and 'undefined' can be supplied used to subsequently clear the title/subtitle suffix.
     * @param title A title string or an object containing title and subtitle strings.
     */
    setTitleSuffix(title: string | { title: string; subtitle?: string } | null | undefined): void;
};
```

<a name="az-api-navigation-navigating-to-a-dashboard"></a>
### Navigating to a dashboard

If you wish to navigate the user to a dashboard specifically, for example after pinning some tile, 
that can be achieved with the following method.

```typescript
/**
 * Navigates to the specified dashboard.
 *
 * @param dashboardId The id of the dashboard to which to navigate.
 */
export function navigateToDashboard(dashboardId: string): void;
```

<a name="az-api-error-handling"></a>
## Error Handling

There are various failure scenarios that your view will need to handle, the Azure Portal Framework offers a consistent
user experience with the ability to customise where needed. See the below API surface for various options.

```typescript
/**
 * Shows an error message in place of the Blade/Part content.
 * Unlike 'notFound', 'noData' and 'unauthorized', this 'fail' is not part of the Azure Portal
 * user experience.  Rather, it is logged and treated like a product bug.
 * @param message A message that will be displayed to the user.
 */
export function fail(message: ErrorOptions): void;

/**
 * Moves the Blade/Part into a 'not found' display mode, allowing for an optional custom error message.
 * @param message An optional custom error message.
 */
export function notFound(message?: ErrorOptions): void;

/**
 * Displays standard UI reflecting that there is no data to display in the Blade/Part.
 * This message will be displayed if 'message' is non-null, non-empty.
 * @param message The message to be displayed.
 */
export function noData(message: string): void;

/**
 * Moves the Blade into an 'unauthorized' display mode, allowing for an optional custom error message or notice options.
 * @param message A custom error message or notice options in place of the default.
 */
export function setBladeUnauthorized(message?: string | BladeNoticeOptions): void;
```

<a name="az-api-telemetry"></a>
## Telemetry

Throughout your view you may want to track specific user interactions or state, or your experience may encounter errors.
To log those events to the telemetry pipeline, you will need to use either;

- `Az.trace()`: for tracking user interactions or state
- `Az.log()`: for error/warning logs

```typescript
/**
 * Records telemetry events for inclusion in the next batched upload.
 * @param events The telemetry events.
 */
export function trace(events: ReadonlyArray<TelemetryEvent>): void;

/**
 * Records log entries for inclusion in the next batched upload.  Does not write to console.
 * @param entries The log entries.
 */
export function log(entries: ReadonlyArray<LogEntry>): void;
```

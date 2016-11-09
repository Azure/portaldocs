<properties title="How to handle assets that no longer exist" pageTitle="How to handle assets that no longer exist" description="How to handle assets that no longer exist" authors="adamabdelhamed" />

### Handling assets that no longer exist

Many parts represent assets such as ARM resources that can be deleted from the UI, PowerShell, or calling REST APIs directly.  A stateless UI system would handle this reality by loading only assets that exist at the time the UI starts up.  Since Ibiza holds the state for all user customizations this 'Not Found' case needs to be handled in a few specific places.

* A part that has been pinned to the startboard represents an asset that no longer exists
  * Example: The VM part
* A part that has been pinned to the startboard depends on information provided by an asset that no longer exists
  * Example: The CPU chart for a VM part

#### Automatic HTTP 404 handling

In an attempt to cover the most common scenarios Ibiza's built in data layer automatically detects HTTP 404 responses from AJAX calls.  When a part depends on data where a 404 has been detected Ibiza automatically makes the part non-interactive and displays a message of 'Not Found'.

The effect is that in most not found scenarios most users will see a more accurate 'Not found' message rather than the sad cloud UX that they see when there is an unexpected error.

This distinction also lets our telemetry system tell the difference between a part that fails to render because of bugs and a part that fails to render because the user's asset has been deleted. **Instances of 'Not Found' do not count against a part's reliability KPI**.

#### How to opt out of automatic HTTP 404 handling

We strongly encourage teams to use the default behavior of having Ibiza handle 404 responses automatically, but there may be some valid exceptions where the standard behavior may not be the best thing to do.  In those very rare cases you can opt out of automatic 404 handling by setting the showNotFoundErrors flag to false when creating your data views.

```js
this._dataView = dataContext.createView(container, { showNotFoundErrors: false });
```

If you do this then 404s will result in rejected promises as they always have and it will be up to your extension code to apply your special handling of 404 responses.

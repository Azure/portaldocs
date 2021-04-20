<a name="persistent-storage"></a>
# Persistent Storage

* [Persistent Storage](#persistent-storage)
    * [Overview](#persistent-storage-overview)
    * [Persistent Storage API](#persistent-storage-persistent-storage-api)
    * [Cache](#persistent-storage-cache)
    * [Telemetry](#persistent-storage-telemetry)
        * [Kusto query pattern:](#persistent-storage-telemetry-kusto-query-pattern)
    * [Examples](#persistent-storage-examples)
        * [React](#persistent-storage-examples-react)
        * [Knockout](#persistent-storage-examples-knockout)



<a name="persistent-storage-overview"></a>
## Overview

_Persistent Storage_ is primarily meant to provide a performant, scalable, and flexible API to store per extension per user data across browsers and devices.
It utilizes the existing settings service infrastructure and enables extension authors to store key/value string pairs in both ReactView and Knockout blades.
Extensions cannot cross reference each other's settings and, if settings aren't accessed once in 30 days, they get removed automatically.

**NOTE**: We will not serialise or deserialise when writing or reading the data.

If you and your team have an interest in _Persistent Storage_, this guide should answer most of your questions.
We rely on you to handle any thrown errors and to be mindful when interacting with the storage since accidental deletion is possible.

If you have any questions after reading this guide, reach out to the ReactView dev team via one of our [support channels](https://github.com/Azure/portaldocs/blob/master/portal-sdk/generated/react-index.md#getting-support).


<a name="persistent-storage-persistent-storage-api"></a>
## Persistent Storage API

_Persistent Storage_ supports all basic **CRUD** operations and utilizes front-end caching. There is a limit per user per extension in place and it's **10Kb** as of now.

An error might be thrown on **any** operation. Make sure you catch and handle them gracefully. Possible errors include, but not limited to:
- *KeySizeExceededError*: Thrown when attempting to set a key/value pair that has a key size that exceeds **256** characters;
- *ItemSizeExceededError*: Thrown when attempting to set a key/value pair which combined size exceeds **10kb**;
- *StorageCapacityExceededError*: Thrown when attempting to set a key/value pair which when stored would exceed **10kb** per extension storage limit.

Additionally, **read** operations provide type safety and intellisense for the returning keys, and if there are no settings stored, return an empty object, making null checks unnecessary.

Because _Persistent Storage_ is built on top of the existing settings manager, all operations are de-bounced, thus there may be some delay when updating the settings. To track the delay, returned promises can be used.

<a name="persistent-storage-cache"></a>
## Cache

_Persistent Storage_ provides a front-end in-memory cache per user per extension to reduce the number of costly database queries.
The cache is 'write through', however, we **auto-age each extension's cache every hour**, meaning that if the cached storage per extension has expired,
we sync up with the most recent data on the next call.

Every API interaction is served through the cache by default, thus if for some reason you encountered an unexpected behavior, try hard refreshing the page few times before contacting us with the issue.

<a name="persistent-storage-telemetry"></a>
## Telemetry

There is telemetry provided with _Persistent Storage_ for free. Below is a list of what's collected:
- writeSetting:
    - **extension name**, **cache and key-value sizes** on success;
    - **extension name**, **cache and key-value sizes** with an **error message** when the limit error thrown;
    - **extension name**, **duration** and **error** when SettingsManager failed on write or cache update (if expired) threw;
- readSettings:
    - **extension name**, **duration** (if not from cache), **cache size**, **number of requested keys** and **number of returning pairs** on success;
    - **extension name**, **duration** and **error** on failure;
- removeSettings:
    - **extension name**, **duration**, **number of requested keys** and **number of bytes removed** on success;
    - **extension name**, **duration** and **error** on failure;
- clear:
    - **extension name** and **number of keys removed (all)** and **number of bytes removed** on success;
    - **extension name**, **duration** and **error** on failure;
- getAllSettingsKeys:
    - **extension name**, **duration** (if not from cache) and **number of keys** on success;
    - **extension name**, **duration** and **error** on failure;

<a name="persistent-storage-telemetry-kusto-query-pattern"></a>
#### Kusto query pattern:
```sql
ClientTelemetry
| where PreciseTimeStamp >= ago(1h)
| where action in ("ReadPersistentSettings", "WritePersistentSettings", "RemovePersistentSettings", "ClearPersistentStorage", "GetAllSettingsKeys")
| summarize Occurrences = count() by action, actionModifier, name
```

<a name="persistent-storage-examples"></a>
## Examples

There are two types of blades supported: **ReactView** and **Knockout** blades. Let's see how to use the _Persistent Storage_ API:

You can start using Persistent Storage right away. It's as easy as writing a single import statement:
<a name="persistent-storage-examples-react"></a>
#### React
```typescript
    import * as PersistentStorage from "@microsoft/azureportal-reactview/PersistentStorage";
```
<a name="persistent-storage-examples-knockout"></a>
#### Knockout
```typescript
    import * as PersistentStorage from "Fx/PersistentStorage";
```

**NOTE**: For your convenience you can find the following examples in Persistent Storage [React](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FSamplesExtension%2FExtension%2FClient%2FReact%2FViews%2FStorageUse.ReactView.tsx&version=GBproduction&_a=contents) and [Knockout](https://msazure.visualstudio.com/One/_git/AzureUX-PortalFx?path=%2Fsrc%2FSDK%2FExtensions%2FInternalSamplesExtension%2FExtension%2FClient%2FPersistentStorage%2FStorageUseBlade.ts&version=GBproduction&_a=contents) sample blades.


* *writeSetting*
    > In this example given arrow functions handle controls user events and **write settings** to the storage. Pay attention to the value - we need to convert boolean to string, because *only strings are accepted*:

    ```tsx
    // React
    onChange = {(_event, checked) => {
        // unchecked - v1, checked - v2
        this.setState({ v1Selected: !checked });
        PersistentStorage.writeSetting("v1Selected", String(!checked)).catch((error) => {
            this.setState({ errorMessage: error.message, v1Selected: checked });
        });
    }}
    // Knockout
    onClick: () => {
        PersistentStorage.writeSetting("v1Selected", String(this._v1Selected())).catch((error) => this._errorMessage(error.message));
    },
    ```

* *readSettings*
    > In the next example another event handling method **reads settings** from the storage:

    ```tsx
    // React
    private _readSettings(): Promise<void> {
        return PersistentStorage.readSettings("v1Selected", "theWord").then((settings) => {
            this.setState({
                v1Selected: settings.v1Selected === "true" || false,
                theWord: settings.theWord || "",
            });
        });
    }
    // Knockout
    private _readSettings(): Promise<void> {
        return PersistentStorage.readSettings("v1Selected", "theWord").then(settings => {
            this._v1Selected(settings.v1Selected === "true" || false);
            this._wordToSave(settings.theWord || "");
        });
    }
    ```
    > Remember that we receive string pairs, thus we are making a boolean by manually checking the string value:

    ```typescript
    settings.v1Selected === "true"
    ```
    > Because settings might not exist, make sure you always have a default value for your state:

    ```typescript
    settings.theWord || "",
    ```

* *removeSettings*
    > In the following example we render the list of paragraphs and buttons per stored settings - when the button is clicked the setting is **removed**.
    > You can see once again how we interact with settings directly inside components event handlers via arrow functions.
    ```tsx
    // React
    { Object.keys(this.state.storedSettings).map(key => {
        return (
            <div key={key}>
                <p>{key}: {this.state.storedSettings[key]}</p>
                <DefaultButton text={ClientResources.Label.removeSetting} onClick={()=> {
                    PersistentStorage.removeSettings(key);
                }}/>
            </div>
        );
    }) }
    // Knockout
    this._listSection(Section.create(this._container, {
        children: Object.keys(settings).map((settingKey) => {
            return Section.create(this._container, {
                children: [
                    { htmlTemplate: `<p>${settingKey}: ${(settings as any)[settingKey]}</p>` },
                    Button.create(this._container, {
                        text: ClientResources.Label.removeSetting,
                        style: Button.Style.Secondary,
                        onClick: () => {
                            PersistentStorage.removeSettings(settingKey);
                        },
                    }),
                ],
            });
        }),
    }));
    ```

* *clear*
    >  To clear all settings, the **clear** function needs to be invoked.
    ```tsx
    // React
    <DefaultButton text={ClientResources.Label.clearAllSettings} onClick={() => {
        PersistentStorage.clear();
    } }/>
    // Knockout
    this._clearButton = Button.create(this._container, {
        text: ClientResources.Label.clearAllSettings,
        style: Button.Style.Secondary,
        onClick: () => {
            PersistentStorage.clear();
        },
    });
    ```

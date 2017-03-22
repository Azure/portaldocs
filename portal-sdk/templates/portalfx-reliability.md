{"gitdown": "contents"}

## Overview

Reliability of the Portal is one of the top pain points from a customers perspective.
As an extension author you have a duty to uphold your experience to the reliability bar at a minimum.

| Area          | Reliability Bar     | Telemetry Action/s                  | How is it measured? |
| ---------     | ------------------- | ------------------------            | ------------------- |
| Extension     | See Power BI        | InitializeExtensions/LoadExtensions | (( # of LoadExtensions starts - # of InitializeExtensions or LoadExtensions failures ) /  # of load extension starts ) * 100 |
| Blade         | See Power BI        | BladeLoaded vs BladeLoadErrored     | (( # of BladeLoaded started - # of BladeLoadErrored's) / # of BladeLoaded started) * 100 |
| Part          | See Power BI        | PartLoaded                          | (( # of PartLoaded started - # of PartLoaded canceled) / # of PartLoaded started) * 100 |

### Extension reliability

This is core to your customers experience, if the FX is unable to load your extension it will be unable to surface any of your experience.
Consequently your customers will be unable to manage/monitor their resources through the Portal.

### Blade reliability

Second to Extension reliability, Blade reliability is next level of critical reliability.
Your Blade reliability can be equated to a page loading in a website, it failing to load is a critical issue.

### Part reliability

Parts are used throughout the portal, from a blade and dashboard perspective, if a part fails to load this results in the user potentially:

1. not being able to navigate to the a blade or the next blade
1. not seeing the critical data they expected on the dashboard
1. etc...

## Assessing extension reliability

There is two methods to assess your reliability:

1. Visit the IbizaFx provided PowerBi report*
1. Run Kusto queries locally to determine your numbers

    (*) To get access to the PowerBi dashboard reference the [Telemetry onboarding guide][TelemetryOnboarding], then access the following [Extension performance/reliability report][Ext-Perf/Rel-Report]

The first method is definitely the easiest way to determine your current assessment as this is maintained on a regular basis by the Fx team.
You can, if preferred, run queries locally but ensure you are using the Fx provided Kusto functions to calculate your assessment.

## Checklist

There are a few items that the FX team advises all extensions to follow.

- [Configure CDN][portalfx-cdn]
- [Extension HomePage Caching](portalfx-extension-homepage-caching)
- [Persistent Caching of scripts across extension updates](portalfx-extension-persistent-caching-of-scripts)
- Geo-distribution, ensure you are serving your extension as close as possible to users.
The FX provides an [Extension Hosting Service](portalfx-extension-hosting-service) which handles Geo-distribution.
To assess your extensions performance by data center see the [Extension performance/reliability report][Ext-Perf/Rel-Report]
- Turning on [IIS compression](https://technet.microsoft.com/en-us/library/cc730629(v=ws.10).aspx)
- [Run portalcop to identify and resolve common performance issues](portalfx-performance-portalcop)

### Code optimisations to improve extension reliability

#### Lazy initialization of data contexts and view model factories

The setDataContext API on view model factories was designed pre-AMD support in TypeScript and slows down extension load by increasing the amount of code downloaded on extension initialization. This also increases the risk of extension load failures due to increase in network activity. By switching to the setDataContextFactory method, we reduce the amount of code downloaded to the bare minimum. And the individual data contexts are loaded if and when required (e.g. if a blade that's opened requires it).

Old code:

```javascript
this.viewModelFactories.Blades().setDataContext(new Blades.DataContext());
```

New code:

```javascript
this.viewModelFactories.Blades().setDataContextFactory<typeof Blades>(
        "./Blades/BladesArea",
        (contextModule) => var x = new contextModule.DataContext()
);
```

### Reliability Frequently Asked Questions (FAQ)

#### My Extension is below the reliability bar, what should I do

Run the following [query][kusto-extension-reliability-summary]

```txt
GetExtensionFailuresSummary(ago(1d))
| where extensionName contains "Microsoft_Azure_Compute"
```

Updating the extensionName to be your extension, and increase the time range if the last 24 hours isn't sufficient.
Address the highest impacting issues, per occurence/affected users.

The query will return a summary of all the events which your extension failed to load. 

| Field name        | Definition |
| ----------------- | ---------- |
| extensionName     | The extension the error correlates to |
| errorState        | The type of error that occurred |
| error             | The specific error that occurred |
| Occurences        | Number of occurrences |
| AffectedUsers     | Number of affected users |
| AffectedSessions  | Number of affected sessions |
| any_sessionId     | A sample of an affected session |
| any_message       | A sample message of what would normally be returned given errorState/error |

Once you have ran the query you will be shown a list of errorStates and errors, for more greater details you can use the any_sessionId 
to investigate further.

##### Error States

<table>
    <tr>
        <th>Error State</th>
        <th>Definition</th>
        <th>Action items</th>
    </tr>
    <tr>
        <td>
            FirstResponseNotReceived
        </td>
        <td>
            This error state means that the shell loaded the extension URL obtained from the config into an IFrame, however there wasn't any response from the extension
        </td>
        <td>
            <ol>
                <li>Scan the events table to see if there are any other relevant error messages during the time frame of the alert</li>
                <li>Try opening the extension URL directly in the browser - it should show the default page for the extension</li>
                <li>Open the dev tools network tab in your browser and try opening the extension URL appending the following query string parameter sessionId=testSessionId - this should open a blank page and all requests in the network tab should be 200 or 300 level responses (no failures). If there is a server error in the extension - it will print out the error and a call stack if available. In case the failures are from a CDN domain, check if the same URL is accessible from the extension domain - if so, the CDN might be corrupt/out of sync. In this case, flushing the CDN would mitigate the issue.</li>
            </ol>
        </td>
    </tr>
    <tr>
        <td>
            HomePageTimedOut
        </td>
        <td>
            The index page failed to load within the max time period 
        </td>
        <td>
            // Need steps to action on
        </td>
    </tr>
    <tr>
        <td>
            ManifestNotReceived
        </td>
        <td>
            This error state means that the bootstrap logic was completed, however the extension did not return a manifest to the shell. The shell waits for a period of time and then timed out.
        </td>
        <td>
            <ol>
                <li>
                Open the dev tools network tab in your browser and try opening the extension URL appending the following query string parameter sessionId=testSessionId - this should open a blank page and all requests in the network tab should be 200 or 300 level responses (no failures). If there is a server error in the extension - it will print out the error and a call stack if available. In case the failures are from a CDN domain, check if the same URL is accessible from the extension domain - if so, the CDN might be corrupt/out of sync. In this case, flushing the CDN would mitigate the issue.
                </li>
                <li>
                Scan the events table to see if there are any other relevant error messages during the time frame of the alert
                </li>
            </ol>
        </td>
    </tr>
    <tr>
        <td>
            InvalidExtensionName
        </td>
        <td>
            This error state means that the name of the extension specified in the extensions JSON in config doesn't match the name of the extension in the extension manifest.
        </td>
        <td>
            <ol>
                <li>
                Verify what the correct name of the extension should be, and if the name in config is incorrect, update it.
                </li>
                <li>
                If the name in the manifest is incorrect, contact the relevant extension team to update <Extension> tag in their PDL with the right extension name and recompile
                </li>
            </ol>
        </td>
    </tr>
    <tr>
        <td>
            InvalidManifest
        </td>
        <td>
            This error state means that the manifest that was received from an extension was invalid, i.e. it had validation errors
        </td>
        <td>
            Scan the error logs for all the validation errors in the extension manifest.
        </td>
    </tr>
    <tr>
        <td>
            InvalidDefinition
        </td>
        <td>
            This error state means that the definition that was received from an extension was invalid, i.e. it had validation errors
        </td>
        <td>
            Scan the error logs for all the validation errors in the extension definition.
        </td>
    </tr>
    <tr>
        <td>
            FailedToInitialize
        </td>
        <td>
            This error state means that the extension failed to initialize one or more calls to methods on the extension's entry point class failing
        </td>
        <td>
            <ol>
                <li>
                Look for the error code and if it is present the call stack in the  message to get more details.
                </li>
                <li>
                Scan the events table to get all the relevant error messages during the time frame of the alert
                </li>
                <li>
                These errors should have information about what exactly failed while trying to initialize the extension e.g. the initialize endpoint, the getDefinition endpoint, etc.
                </li>
            </ol>
        </td>
    </tr>
    <tr>
        <td>
            TooManyRefreshes
        </td>
        <td>
            This error state means that the extension try to reload itself within the IFrame multiple times. The error should specify the number of times it refreshed before the extension was disabled
        </td>
        <td>
            Scan the events table to see if there are any other relevant error messages during the time frame of the alert
        </td>
    </tr>
    <tr>
        <td>
            TooManyBootGets
        </td>
        <td>
            This error state means that the extension try to send the bootGet message to request for Fx scripts multiple times. The error should specify the number of times it refreshed before the extension was disabled
        </td>
        <td>
            Scan the events table to see if there are any other relevant error messages during the time frame of the alert
        </td>
    </tr>
    <tr>
        <td>
            TimedOut
        </td>
        <td>
            This error signifies that the extension failed to load after the predefined timeout.
        </td>
        <td>
            <ol>
                <li>
                    Scan the events table to see if there are any other relevant error messages during the time frame of the alert
                </li>
                <li>
                    Analyze the error messages to try to deduce whether the problem is on the extension side or the shell.
                </li>
                <li>
                If the issue is with the extension, look at CPU utilization of the cloud service instances. If the CPU utilization is high, it might explain why clients are timing out when requesting resources from the server.
                </li>
            </ol>
        </td>
    </tr>
    <tr>
        <td>
            MaxRetryAttemptsExceeded
        </td>
        <td>
            This a collation of the above events
        </td>
        <td>
             Inspect the sample message and follow appropriate step above
        </td>
    </tr>
</table>

#### My Blade is below the reliability bar, what should I do

Firstly, run the following [query][kusto-blade-reliabiltiy-summary], ensure you update the extension/time range.

```txt
GetBladeFailuresSummary(ago(1h))
| where extension == "Microsoft_Azure_Compute"
```

| Field name        | Definition |
| ----------------- | ---------- |
| extension         | The extension the error correlates to |
| blade             | The blade the error correlates to |
| errorReason       | The error reason associated with the failure |
| Occurences        | Number of occurrences |
| AffectedUsers     | Number of affected users |
| AffectedSessions  | Number of affected sessions |
| any_sessionId     | A sample of an affected session |
| any_details       | A sample message of what would normally be returned given extension/blade/errorReason |

Once you have that, correlate the error reasons with the below list to see the guided next steps.

<table>
    <tr>
        <th>Error reason</th>
        <th>Defintion</th>
        <th>Action items</th>
    </tr>
    <tr>
        <td>
            ErrorInitializing
        </td>
        <td>
            The FX failed to initialize the blade due to an invalid definition.
        </td>
        <td>
            <ol>
                <li>
                    Verify the PDL definition of the given blade
                </li>
                <li>
                    Verify the source opening the blade is passing the correct parameters
                </li>
                <li>
                     Reference a sample session in the ClientEvents kusto table there should be correlating events before the blade failure
                </li>
            </ol>
        </td>
    </tr>
    <tr>
        <td>
            ErrorLoadingExtension
        </td>
        <td>
            The extension failed to load and therefore the blade was unable to load.
        </td>
        <td>
            Refer to the guidance provided for extension reliability
        </td>
    </tr>
    <tr>
        <td>
            ErrorLoadingDefinition
        </td>
        <td>
            The FX was unable to retrieve the blade defintion from the Extension.
        </td>
        <td>
             Reference a sample session in the ClientEvents kusto table there should be correlating events before the blade failure
        </td>
    </tr>
    <tr>
        <td>
            ErrorLoadingExtensionAndDefinition
        </td>
        <td>
            The FX was unable to retrieve the blade defintion from the Extension.
        </td>
        <td>
            Reference a sample session in the ClientEvents kusto table there should be correlating events before the blade failure
        </td>
    </tr>
    <tr>
        <td>
            ErrorUnrecoverable
        </td>
        <td>
            The FX failed to restore the blade during journey restoration because of an unexpected error.
        </td>
        <td>
            This should not occur but if it does file a [shell bug](http://aka.ms/portalfx/shellbug).
        </td>
    </tr>
</table>

### My Part is below the reliability bar, what should I do

Firstly, run the following [query][kusto-part-reliabiltiy-summary], ensure you update the extension/time range.

```txt
GetPartFailuresSummary(ago(1h))
| where extension == "Microsoft_Azure_Compute"
```

| Field name        | Definition |
| ----------------- | ---------- |
| extension         | The extension the error correlates to |
| blade             | The blade the part is on, if blade === "Dashboard' then the part was loaded from a dashboard |
| part              | The part the error correlates to |
| errorReason       | The error reason associated with the failure |
| Occurences        | Number of occurrences |
| AffectedUsers     | Number of affected users |
| AffectedSessions  | Number of affected sessions |
| any_sessionId     | A sample of an affected session |
| any_details       | A sample message of what would normally be returned given extension/blade/part/errorReason |

Once you have that, correlate the error reasons with the below list to see the guided next steps.

<table>
    <tr>
        <th>Error reason</th>
        <th>Defintion</th>
        <th>Action items</th>
    </tr>
    <tr>
        <td>
            TransitionedToErrorState
        </td>
        <td>
            The part was unable to load and failed through its initialization or OnInputsSet
        </td>
        <td>
            Consult the any_details column, there should be sample message explaining explicitly what the issue was. Commonly this is a nullRef.
        </td>
    </tr>
    <tr>
        <td>
            ErrorLocatingPartDefinition
        </td>
        <td>
            The FX was unable to determine the part definition.
        </td>
        <td>
            The likely cause of this is the extension has removed the part entirely from the PDL, this is not the guided pattern.
            See deprecating parts for the explicit guidance. __NEED LINK__
        </td>
    </tr>
    <tr>
        <td>
            ErrorAcquiringViewModel
        </td>
        <td>
            The FX was unable to retrieve the part view model from the Extension.
        </td>
        <td> 
            You can correlate the start of thesample message with one of the below for common explanations. 
            <ul>
                <li>
                     ETIMEOUT - This may be caused by a flooding of the RPC layer.
                </li>
                <li>
                     Script error - Dependent on the exact message, this may be due to timeouts/latency issues/connection problems.
                </li>
                <li>
                     Load timeout for modules - This may be caused by a slow or loss of connection.
                </li>
                <li>
                     description: - This is generic bucket, here the message will define the issue further. For example if there were null references
                </li>
            </ul>
            For all the above if enough information was not provided via the message explore the raw events function or reference a sample session in
            the ClientEvents kusto table as there should be correlating events before the failure. 
        </td>
    </tr>
    <tr>
        <td>
            ErrorLoadingControl
        </td>
        <td>
            The FX was unable to retrieve the control module.
        </td>
        <td>
            Reach out to the FX team if you see a large amount of these issues.
        </td>
    </tr>
    <tr>
        <td>
            ErrorCreatingWidget
        </td>
        <td>
            The FX failed to create the widget.
        </td>
        <td>
            Check the sample message this is indicate the explicit reason why it failed, this was probably a ScriptError or failure to load the module.
        </td>
    </tr>
    <tr>
        <td>
            OldInputsNotHandled
        </td>
        <td>
            In this case a user has a pinned representation of a old version of the tile. The extension author has changed the inputs in a breaking fashion.
        </td>
        <td>
            If this happens you need follow the guided pattern. __NEED LINK__
        </td>
    </tr>
</table>


## Alerts

This is in progress, if you have interest in adopting reliability alerts please contact sewatson

There are 3 types of alerts we will be firing:

1. Extension reliability - this requires on-boarding please contact sewatson if you are interested
1. Blade reliability hourly 
1. Part reliability hourly 

[TelemetryOnboarding]: <portalfx-telemetry-getting-started>
[Ext-Perf/Rel-Report]: <http://aka.ms/portalfx/dashboard/extensionperf>
[portalfx-cdn]: <portalfx-cdn>
[kusto-extension-reliability-summary]: <https://azportal.kusto.windows.net:443/AzurePortal?query=H4sIAAAAAAAEAHNPLXGtKEnNK87Mz3NLzMwpLUotDi7NzU0sqtRITM%2fXMEzR1OTlqlEoz0gtSlVIhSn1S8xNVUjOzytJzMwrVlDyzUwuyi%2fOTyuJd6wCmhDvnJ9bUFqSqsTLxcsFAAXqLsliAAAA>
[kusto-blade-reliabiltiy-summary]: <https://azportal.kusto.windows.net:443/AzurePortal?query=H4sIAAAAAAAEAHNPLXHKSUxJdUvMzCktSi0OLs3NTSyq1EhMz9cwzNDU5OWqUSjPSC1KVUitKEnNK87Mz1OwtVVQ8s1MLsovzk8riXesAuqLd87PLSgtSVXi5QJBADW0cJdWAAAA>
[kusto-part-reliabiltiy-summary]: <https://azportal.kusto.windows.net:443/AzurePortal?query=H4sIAAAAAAAEAHNPLQlILCpxS8zMKS1KLQ4uzc1NLKrUSEzP1zDM0NTk5apRKM9ILUpVSK0oSc0rzszPU7C1VVDyzUwuyi%2fOTyuJd6wC6ot3zs8tKC1JVQIAAv63pU8AAAA%3d>
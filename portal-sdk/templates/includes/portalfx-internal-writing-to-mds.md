##### Writing to ETW

Now that you are receiving logs via ClientTrace, they can be written to [ETW](https://msdn.microsoft.com/en-us/library/windows/desktop/bb968803%28v=vs.85%29.aspx) and either viewed in Event Viewer, or picked up by a central logging system (which for first parties, will probably be MDS).

To write to ETW, first the Providers must be registered with ETW. We provide a utility to do this:   `EtwRelatedFilesUtility.exe`. It must be run as a startup task in your instance, before any users of ETW are run.

1. Make sure that `EtwRelatedFilesUtility.exe` is placed in the `\bin` folder of your web role.
2. Create a startup script to run the utility and capture any output (in case something goes wrong). E.g.

```
REM SetupEtw.cmd example
@ECHO OFF
EtwRelatedFilesUtility.exe >> EtwRelatedFilesUtility.log  2>> EtwRelatedFilesUtility.err
EXIT %ERRORLEVEL%
```

3. Add this startup script to your instance's definition, making sure that it is run as an elevated, "simple" task. E.g.

```xml
<Startup>
  <Task commandLine="StartupTasks\SetupEtw.cmd" executionContext="elevated" taskType="simple">
  </Task>
</Startup>
```
4. Once you deploy with this configuration, you should see new logs created in Event Viewer, similar to below:

![event-viewer-client-trace](../media/portalfx-internal/EventViewerClientTrace.png)


##### Writing to MDS

If you are a first party, you may have a requirement to write your logs to [MDS](https://microsoft.sharepoint.com/teams/WAG/EngSys/Monitor/_layouts/15/start.aspx#/AmdWiki). We support this scenario, as we use it ourselves.

_Please ensure that you have a requirement to use MDS before you start onboarding. Different teams have different requirements._

1. Make sure that the logs appear in ETW. MDS will only upload logs that appear in ETW. (See above.)
2. Onboard to MDS by following their Wiki (e.g. create an MDS account, provision storage accounts, etc.). See [here](https://microsoft.sharepoint.com/teams/WAG/EngSys/Monitor/AmdWiki/Onboarding.aspx).
2. Once you have onboarded to MDS, follow their steps to configure and deploy the Monitoring Agent. See [here](https://microsoft.sharepoint.com/teams/WAG/EngSys/Monitor/AmdWiki/Onboarding%20-%20Configuring%20and%20Deploying%20the%20Monitoring%20Agent.aspx).
3. After completing this, you should have added a startup task to your instance's definition. Make sure that this task runs **AFTER** the startup task that runs `EtwRelatedFilesUtility.exe` (that you set up above).
4. Upload your MDS schema configuration files before/at the start of deployment, as per the [MDS documentation](https://microsoft.sharepoint.com/teams/WAG/EngSys/Monitor/AmdWiki/MDS.EXE%20Command%20Reference.aspx#UploadMdsConfig). You should be able to see examples of MDS schema configuration files as part of the ETW NuGet package (`Microsoft.Portal.Tools.Etw.[version].nupkg`) under `Tools\EtwRelatedFilesUtility\MonitoringConfig`.
    * If you have your own MDS schema configuration files, you'll have to merge the portal configuration files that contain tables that you want to be part of your schema.
5. When you deploy and your instance starts, remember that it can take 5-15 minutes for ETW logs to be uploaded to MDS and show up in searches.

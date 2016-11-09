<properties title="" pageTitle="Blades" description="" authors="adamabdelhamed" />

### Introduction to AppBlades

AppBlade provides you with an IFrame where you can render your content, resulting in maximum flexibility at the expense of additional developer responsibilities.

We recommend consider using AppBlade when:

* You have an existing experience that you want to bring to Ibiza without having to re-implement it
* You want to implement user interactions and/or experiences that are not supported by the components in Ibiza framework
* You have an experience that needs to be re-hosted in several environments

When using AppBlade you are responsible for:

* **Accessibility**: you are reponsible for making your blade accessible up to Microsoft standards
* **Theming**: you are responsible for responding to theming behavior
* **Consistent Look & feel**: you are responsible for coming up with a visual design that is consistent with the rest of Ibiza
* **Controls**: since you can't use Ibiza Fx controls you need to build your own controls or use available alternatives 

#### Creating your first AppBlade

1. Add the **blade definition** to your PDL file

    ```xml
    <AppBlade Name="MicrosoftDocs"
            ViewModel="{ViewModel Name=MicrosoftDocsBladeViewModel, Module=./Summary/ViewModels/MicrosoftDocsBladeViewModel}"
            InitialDisplayState="Maximized">
    </AppBlade>
    ```

1. Create a **ViewModel** TypeScript class. The code snippet below shows the view-model for the template blade defined above. In this case, it is showing the docs.microsoft.azure.com into an AppBlade in Ibiza portal.

    ```javascript
    export class MicrosoftDocsBladeViewModel extends MsPortalFx.ViewModels.AppBlade.ViewModel {
        constructor(container: FxViewModels.ContainerContract, initialState: any, dataContext: any) {

            super(container, {
                source: 'https://docs.microsoft.com/'
            });

            this.title("docs.microsoft.com");
        }
    }
    ```

The source location for the contents of the IFrame is passed to the container using the **source** property in the **FxBlade.Options** (second parameter in the code snippet above).

#### Using the Ibiza command bar in your AppBlade

You can use the Ibiza command bar in your AppBlade and leverage the framework support while getting some consistency in the experience. In this case, you need to add a **CommandBar** to your PDL and configure it in your **ViewModel**. This is **optional**.

Using the CommandBar is the same than in any other existing scenarios. The code snippet below shows an example of setting a CommandBar in your AppBlade view-model.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/Blades/AppBlade/ViewModels/AppBladeViewModel.ts", "section": "appBlade#commandBar"}

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/Blades/AppBlade/ViewModels/AppBladeViewModel.ts", "section": "appBlade#commandBarButton"}


#### Exchanging messages between your IFrame and the Ibiza Fx

The AppBlade ViewModel is hosted in the same hidden IFrame where your extension is loaded. The contents of the AppBlade are hosted in another IFrame that is visible in the screen.

Both IFrames (your UI and your Ibiza extension) can communicate via **postMessage**.

The following sections demonstrate how to exchange messages between both IFrames

#### Sending and Receiving messages from Ibiza

##### Listen to a message

You can listen to messages using the **on** method in the **AppBlade** view-model.

The code snippet below demonstrates how to listen to a message from your IFrame in your Ibiza extension view-model.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/Blades/AppBlade/ViewModels/AppBladeViewModel.ts", "section": "appBlade#listenForMessageFromIFrame"}

#### Post a message

You can post messages to you IFrame using the **postMessage** method in the **AppBlade** view-model.

The code snippet below demonstrates how to send a message from your Ibiza extension view-model to your IFrame.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/Blades/AppBlade/ViewModels/AppBladeViewModel.ts", "section": "appBlade#postMessageToIFrame"}

#### Post theming information

When using a template blade, you are responsible for implementing theming in your IFrame. The code snippet below demonstrates how to pass the current selected theme by the user to your IFrame using **postMessage** (which is the same technique used in the section above).

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Client/Blades/AppBlade/ViewModels/AppBladeViewModel.ts", "section": "appBlade#postThemingInfo"}

#### Sending and Receiving messages from your IFrame

##### Listen to a message

You can listen to incoming messages by adding an event listener to your window, as shown in the snippet below:

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Content/SamplesExtension/appBladeSampleIFrame.html", "section": "appBlade#listenMessageFromPortal"}

Then, provide a handler for the incoming message. In the example below, the **receiveMessage** method handles three different incoming message types (including reacting to theming changes in the portal) 

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Content/SamplesExtension/appBladeSampleIFrame.html", "section": "appBlade#listenMessageFromPortalHandler"}

##### Post a message

You can post messages back to the portal using **postMessage**. There is a required message that your IFrame needs to send back to the portal to indicate that it is ready to receive messages.

The code snippet below shows how to post that first required message and also how to send another additional message.

{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Content/SamplesExtension/appBladeSampleIFrame.html", "section": "appBlade#postMessageToPortal"}

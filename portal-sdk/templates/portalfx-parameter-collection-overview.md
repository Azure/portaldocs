{"gitdown": "contents"}

{"gitdown": "include-file", "file": "portalfx-parameter-collection-related.md"}

# Introduction to Parameter Collection

The Parameter Collection Framework provides the platform and building blocks to build user experiences that collect data from the user. Those user experiences are a sequence of UI elements (forms, wizards, pickers, buttons, commands, etc.), and are referred to as parameter collection flows. The framework aims at simplifying the development of such flows and enabling extension developers to focus on their business logic rather than the internal communication between those pieces.

## Roles
There are three roles in the Parameter Collection Framework. As you build the view model for your UI element, you need to define which roles it *can* play, and provide necessary logic that will be executed when UI element is playing that role. The two primary roles are the **parameter collector** and the **parameter provider** roles. A secondary role is the **provisioner** role. A view model can play more than one role. Depending on the UI element, specific roles are either optional or mandatory.

### Collectors and Providers
Think of the parameter collection process as an interrogation process, where one entity (the collector) asks the other entity (the provider) a question and expects an answer back. The provider can also be a collector if it collects data from a third entity (another provider), and so on. Here's a diagram that illustrates this flow:

![Parameter Collectors and Providers][parameter-collectors-and-providers]

Another way to see this is to think of it as a tree. The root node is only a collector, the initial point where the interrogation starts. Inner nodes are both collectors and providers; they interrogate other providers for answers to their questions, but still have to answer back to the collector interrogating them. Leaf nodes are providers only; they just answer back to the collector.

### Provisioners
If the UI elements provisions a certain action, then its view model needs to have a provisioner role. You can either leverage the default provisioning logic provided by the framework if your provisioning action is creating resources using ARM (please refer to the Gallery Create documentation), or implement your own custom provisioning logic instead.

## Implementation
The framework provides interfaces, base classes, and blade templates to simplify your implementation. Whether you're building a form, wizard, picker, button or command, there's a base class for each of those that your view model needs to extend. The framework also ships the corresponding PDL templates for you to use in your PDL. To implement any of the roles, you need to create a class that extends the corresponding interface for that role, and pass an instance of that role implementation to the base class in your constructor.

## More details
* *Inputs and Outputs:* More details about inputs, outputs and communication between the UI elements.
* *Role Implementation:* More details about how to implement roles.
* *Base Classes:* More details about base classes and PDL templates.


[parameter-collectors-and-providers]: ../media/portalfx-parameter-collection-overview/collectorsAndProviders.png

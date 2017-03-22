<properties title="" pageTitle="Graph Control nuget" description="" authors="rickweb" />

<a name="graph"></a>
## Graph

Applications that need a stand alone graph control can use the Microsoft.Portal.Controls.Graph package. This package is published on MSNuget and should not be shared externally at this time. It contains all the Javascript and CSS files needed to render the control as well as all the definitions needed to consume it in Typescript.

Requirements:
Your web page must statically include the following scripts before your require data-main:
1. jquery
1. knockout.js 3.2.0
1. Q (version 1)
1. hammerjs (1.1.3 has been tested. If you don't include hammer, you won't get multi-touch, but everything else should work correctly.)

You then must use requirejs to load the graph control. Specify your program entry in data-main. There are 3 modules you should ever need to explicitly bring in as dependencies. 
Viva.Controls/Controls/Visualization/Graph/GraphWidget (contains the widget)
Viva.Controls/Controls/Visualization/Graph/GraphViewModel (the view model backing the widget)
Viva.Controls/Controls/Visualization/Graph/GraphEntityViewModel (defines graph node and edges classes)

An example module that consumes the control:

```ts
import Widget = require("./Viva.Controls/Controls/Visualization/Graph/GraphWidget");
import ViewModel = require("./Viva.Controls/Controls/Visualization/Graph/GraphViewModel");
import Entities = require("./Viva.Controls/Controls/Visualization/Graph/GraphEntityViewModel");

export = Main;

module Main {
    var viewModel = new ViewModel.ViewModel();
    var widget = new Widget.Widget($("#container"), viewModel);

    viewModel.editorCapabilities(ViewModel.GraphEditorCapabilities.MoveEntities);

    // Add graph nodes.
    for (var i = 0; i < 6; i++) {
        var graphNode = new Entities.GraphNode({
            x: (i % 3) * 100,
            y: Math.floor(i / 3) * 100,
            height: 40,
            width: 40
        });

        graphNode.id(i.toString());
        graphNode.extensionTemplate = "<div data-bind='text:$data,azcGraphNodeContent'></div>";
        graphNode.extensionViewModel = i.toString();

        viewModel.graphNodes.put(i.toString(), graphNode);
    }

    // Add graph edges
    for (var i = 1; i < 6; i++) {
        var start = viewModel.graphNodes.lookup((i - 1).toString());
        var end = viewModel.graphNodes.lookup(i.toString());

        viewModel.edges.put((i - 1).toString() + "-" + i.toString(), new Entities.GraphEdge(start, end));
    }
}

```

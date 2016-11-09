<properties title="" pageTitle="Forms sections" description="" authors="andrewbi" />

## Utilizing form sections

Sections are used to autogenerate the layout of multiple controls on a blade. The simpliest thing to do is to create a section view model and add all the controls you would like
displayed to the `children` observable on the section. This will lay them out one after the other on a blade. 
Follow [this link](http://aka.ms/portalfx/samples#blade/SamplesExtension/SDKMenuBlade/formsallup) and then click on 'Basic Create Form' for an example and this of what it looks like.
This is the code to create the section:

{"gitdown": "include-section", "file":"../Samples/SamplesExtension/Extension/Client/Forms/Samples/BasicCreate/ViewModels/Parts/FormsSampleBasicCreatePart.ts", "section": "forms#section"}

And the template is just binding the section into the DOM:

```
{"gitdown": "include-file", "file":"../Samples/SamplesExtension/Extension/Client/Forms/Samples/BasicCreate/Templates/FormSampleBasicCreate.html"}
```

Since it will autogenerate the layout for all of it's children.


[FormSection]: ../media/portalfx-forms-sections/forms-sections.png

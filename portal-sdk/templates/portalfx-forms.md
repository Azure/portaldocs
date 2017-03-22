{"gitdown": "contents"}

# Developing Forms

The SDK includes extensive support for displaying and managing user input. Forms are created using HTML templates, view models, and edit scopes. While developers are free to use standard HTML and Knockout to build their forms, using SDK framework includes support for:

  * Labels
  * Validation
  * Change tracking
  * Form reset
  * Persisting edits across journeys and browser sessions

![Forms Example][forms-example]

To get started using forms, pick from one of the following topics:

* [Layouting out UI](portalfx-forms-sections.md)
* [Building a form](portalfx-forms-construction.md)
* [Validation](portalfx-forms-field-validation.md)
* [Edit Scopes](portalfx-forms-working-with-edit-scopes.md)
* [Command integration](portalfx-forms-integrating-with-commands.md)

[forms-example]: ../media/portalfx-forms/forms.png

{"gitdown": "include-file", "file": "../templates/portalfx-forms-construction.md"}
{"gitdown": "include-file", "file": "../templates/portalfx-forms-sections.md"}
{"gitdown": "include-file", "file": "../templates/portalfx-forms-field-validation.md"}
{"gitdown": "include-file", "file": "../templates/portalfx-forms-working-with-edit-scopes.md"}
{"gitdown": "include-file", "file": "../templates/portalfx-forms-integrating-with-commands.md"}

## FAQ

### Should I use an action bar or a commands toolbar on my form?

It depends on the UX scenario you're building:
* If you're building a form to capture some data from the user and expect the blade to be closed after submitting the changes, then use an action bar. The action bar will have one button that says something like "OK", "Create", or "Submit". The blade should be immediately closed automatically once the action bar button is clicked. Users can abandon the form by manually closing it by clicking the close button (the top-right 'x' button). You probably want to use a parameter provider to simplify your code; it takes care of provisioning the edit scope and closing the blade based on action bar clicks. Also alternatively, you can use an action bar with two buttons (like "OK/Cancel"), but that requires further configuration of the action bar. That's not recommended though because all the "Cancel" button will do is already there in close button, which makes it redundant.
* If you're building a form to edit/update some data and expect the user to make multiple changes before the blade is closed, then use commands. You would normally have two commands at the top of the blade: "Save" and "Discard". The user can make edits and click "Save" to commit their changes. The blade should show the appropriate UX for saving the data and will stay on the screen after the data has been saved. The user can make further changes and click "Save" again. The user can also discard their changes by clicking "Discard". Once the user is satisfied with the changes, they can close theblade manually.

{"gitdown": "include-file", "file": "../templates/portalfx-forms-edit-scope-faq.md"}

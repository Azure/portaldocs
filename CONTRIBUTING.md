
# Contribute to the documentation

## Prerequisite installs

1. Install [nodejs LTS ](https://nodejs.org/en/download/)
1. Install latest version of npm

   ```ts
   $> npm install npm@latest -g
   ```
1. Install [gulp] by running
    ```ts
    $> npm install gulp -g
    ```

## Authoring a document

Author or update the document within the portal-sdk/templates or gallery-sdk/templates folder using [markdown](http://daringfireball.net/projects/markdown/).

### Where to add the document

Add the document under the path `/[portal-sdk|gallery-sdk]/templates/*.md`

The `/templates` folder for a given SDK contains the articles formatted as markdown files and *.md* extension and makes use of [gitdown](https://www.npmjs.com/package/gitdown) for document composition, code snippet injection, and table of contents generation.

* **template filenames:** By default all documents are to be prefixed with the service name (such as *portalfx*, *portalfx-ux*, *gallery*, *resource-provider*). Use all lowercase letters and dashes (-) to separate the words. If the document is referenced in the root level `/README.md` then it should be prefixed with `top-`and needs approval by aliases `adamab;skhu`.

* **Media subfolders:** media is to be added to the relevant `/[portal-sdk|gallery-sdk]/media` folder. Within the media folder content is organized into subfolders by document name.

Note: `/[portal-sdk|gallery-sdk]/generated` The  **/generated** folder is auto-generated, **do not** contribute any additional content here, it will be lost and is also ignored via .gitignore, instead use the *\templates* folder.

### Code sample freshness with code snippet injection

To ensure all code samples remain up to date and compile successfully when used by partners use them i've extended gitdown syntax to support code fragment injection.

To reference source code in your document directly from a *.ts, *.cs, *.pdl or *.config file use the include-section extension.

    For example,

    <!-- gitdown: off -->

        ```
        //injects the code snippet in between two comments `//config#configurationsettings` from `../Samples/SamplesExtension/Extension/Configuration/ArmConfiguration.cs` directly inline
        {"gitdown": "include-section", "file": "../../../src/SDK/Extensions/SamplesExtension/Extension/Configuration/ArmConfiguration.cs", "section": "config#configurationsettings"}
        ```

    <!-- gitdown: on -->


### Composing documents

Occasionally you will want to include the whole contents of a file into a document rather then just a fragment. Two common scenarios:
- including a full sourcefile within a markdown document
- to improve maintainability where text needs to appear in multiple documents you can composing a markdown document from other markdown documents.

Using [gitdown](https://www.npmjs.com/package/gitdown) include-file for document composition you can inject the full content of a sourcefile or other markdown document using [gitdown syntax](https://github.com/gajus/gitdown).

    <!-- gitdown: off -->

        ```
        //inject the entire portalfx-howitworks.md inline where you use the following gitdown include
        {"gitdown": "include-file", "file": "../templates/portalfx-howitworks.md"}
        ```

    <!-- gitdown: on -->


## Generating documents for Github

### Portal Team

To generate documents as they would appear on github.com/azure/portaldocs:

```ts
$> cd AzureUx-PortalFx\docs
$> npm install --no-optional
$> npm run docs
```

Note: If you have added new links that internal, require auth or dummy then you can exclude checks for them by including them in urlsToSkip array in ./gulpcommon.js.

### Partner Teams

#### Gallery Team

To generate github content for **gallery**:

```ts
$> cd AzureUx-PortalFx\docs
$> npm install --no-optional
$> npm run gallery
```

## Previewing the changes

Preview the generated markdown in \\generated\\*.md using a tool like [Visual Studio Code](https://code.visualstudio.com/) and its [Markdown preview](https://code.visualstudio.com/Docs/languages/markdown#_markdown-preview) hotkey combo `Ctl+K V`

## Code of Conduct
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

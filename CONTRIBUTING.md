
# Contribute to the documentation

## Prerequisite

1. Verify that npm version is 3.10.6 or greater:
	```ts
	$>npm -v 
	```
   To update npm version use
   ```ts 
   $>npm install npm -g
   ```
1. Install [gulp] by running 
	```ts
	$>npm install gulp -g
	```
1. To generate documents for Github:
	- For AzureUx-PortalFx / framework repo, execute following command from docs directory:
		```ts
		$>cd AzureUx-PortalFx\docs
		$>npm install --no-optional
		```
	- For github repo,  execute following command from root directory
		```ts
		$>npm install --no-optional
		```
1. Understanding Repository organization

	- \articles and \[portal_sdk|gallery_sdk]\generated
	

	The **\articles** and ***\generated** is now auto-generated, **do not** contribute any additional content here, instead use the *\templates* folder.
	
	- \[portal_sdk|gallery_sdk]\templates
	
	The *\templates* folder for a given SDK contains the articles formatted as markdown files and *.md* extension and makes use of [gitdown](https://www.npmjs.com/package/gitdown) for document composition, code snippet injection, and table of contents generation.

	* **template filenames:** Begin with the service name (such as *portalfx*, *portalfx-ux*, *gallery*, *resource-provider*). Use all lowercase letters and dashes (-) to separate the words. 
	* **Media subfolders:** The *\templates* folder contains the *\media* folder, inside which are subfolders with the images for each article. The article image folders are named identically to the article file, minus the *.md* file extension.

## Authoring a document

1. Write the document within the \templates folder using [markdown](http://daringfireball.net/projects/markdown/). You can use portalfx-creating-extensions as a template.
1. For document composition you can use [gitdown](https://www.npmjs.com/package/gitdown).  For example `\templates\README.md` is composed of multiple documents  

	Inject content from samples or other documents using [gitdown syntax](https://github.com/gajus/gitdown).  E.g
	
	<!-- gitdown: off -->
	
		```
		//inject the entire portalfx-howitworks.md inline where you use the following gitdown include
		{"gitdown": "include-file", "file": "../templates/portalfx-howitworks.md"}
		```
		
	<!-- gitdown: on -->
1. To ensure all code samples remain up to date we extended gitdown syntax to support code fragment injection. To reference source code in your document directly from a *.ts, *.cs, *.pdl or *.config file use the include-section extension.
	For example,
	
	<!-- gitdown: off -->
	
		```
		//injects the code snippet in between two comments `//config#configurationsettings` from `../Samples/SamplesExtension/Extension/Configuration/ArmConfiguration.cs` directly inline
		{"gitdown": "include-section", "file": "../Samples/SamplesExtension/Extension/Configuration/ArmConfiguration.cs", "section": "config#configurationsettings"}
		```
		
	<!-- gitdown: on -->

## Generating documents for Github 

### Partner Teams

#### Gallery
To generate github content for **gallery**:
```
$>npm run gallery
```

### Portal Team

To generate auxdocs classic content and new github content run.  
**Note**: First run must be done as `Administrator` to generate symlink to SamplesExtension to allow for shorter reference paths for snippet injection
	
```
$>npm run docs
```

To verify all links work use
```
$>npm run docs -- --verify
```

Preview the generated markdown in both \*-index.md and \articles\*.md using a tool like [Visual Studio Code](https://code.visualstudio.com/) and its [Markdown preview](https://code.visualstudio.com/Docs/languages/markdown#_markdown-preview)

## Code of Conduct
This project has adopted the [Microsoft Open Source Code of Conduct](https://opensource.microsoft.com/codeofconduct/). For more information see the [Code of Conduct FAQ](https://opensource.microsoft.com/codeofconduct/faq/) or contact [opencode@microsoft.com](mailto:opencode@microsoft.com) with any additional questions or comments.

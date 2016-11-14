//------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//------------------------------------------------------------

//workaround no support for Visual Studio Online url format
var fs = require('fs');
var utilFilePath = process.cwd() + '\\node_modules\\gitinfo\\dist\\utils.js';
if(fs.existsSync(utilFilePath)) {
    var utilContent = fs.readFileSync(utilFilePath, { 'encoding': 'utf8' });
    var result = utilContent.replace(/url.length !== 2/g, 'url.length < 2');
    fs.writeFileSync(utilFilePath, result, { 'encoding': 'utf8' });
}

var gitdownIncludeHelper = require('gitdown/dist/helpers/include.js');
var fs = require('fs');
var gitdown = require('gitdown');
var path = require('path');
var Q = require('q');
var util = require('util');
var deadlink = require('deadlink');
var chalk = require('chalk');
var urlExt = require('url-extractor');
var findup = require('findup');
var gitPath = findup.sync(process.cwd(), '.git\\HEAD');

var self = module.exports = {
    /**
     * Generates gitdown output for all files in the inputDir that have a path that match the fileMatchPattern.
     * the resulting output is written to outputDir.  Does not recurse directories for content.
     */
    processDirectory: function(inputDir, outputDir, fileMatchPattern) {
        const fileRegEx = new RegExp(fileMatchPattern, "i");
        var processFilePromises = [];
        
        if (!fs.existsSync(outputDir)){            
            fs.mkdirSync(outputDir);
        }

        return Q.ninvoke(fs, "readdir", inputDir)
            .then(function (files) {
                files.forEach(function (file, index, array) {
                    if (fileRegEx.exec(file)) {
                        processFilePromises.push(self.processFile(path.resolve(inputDir, file), path.resolve(outputDir), { headingNesting: { enabled: false } }));
                    }
                });
            }).then(function () {
                return Q.allSettled(processFilePromises)
            });
    },
    /**
     * Processes the inputFile using gitdown and the custom include-section gitdown helper using the specified gitdown config.  
     * Resulting output is written to outDir
     */
    processFile: function (inputFile, outDir, config, relativeLinkToHash) {
        console.log("processing: " + inputFile);
        var gd = gitdown.readFile(path.resolve(inputFile));
        config.gitinfo = config.gitinfo || { gitPath: gitPath};
        gd.setConfig(config);

        //register a custom helper that injects h1 anchor tags per document
        gd.registerHelper('include-file',{
            weight:20,
            compile: !!relativeLinkToHash ? self.includeFile : gitdownIncludeHelper.compile
        });

        //register custom helper include-section to inject sections from a file into the docs
        gd.registerHelper('include-section', {
            weight: 10,
            compile: self.includeSection
        });
        return gd.writeFile(path.resolve(outDir, path.basename(inputFile)));
    },
    /**
     * Extending gitdown to provide code snippet injection. 
     * The code snippet snippet section with label config.section from within config.file will be extracted
     * and injected into the reference document
     */
    includeSection: function (config, context) {
        if (!config.file) {
            throw new Error('config.file must be provided');
        }

        if (!config.section) {
            throw new Error('config.section must be provided');
        }

        config.file = path.resolve(context.gitdown.getConfig().baseDirectory, config.file);

        if (!fs.existsSync(config.file)) {
            throw new Error('Input file does not exist: ' + config.file);
        }

        var content = fs.readFileSync(config.file, {
            encoding: 'utf8'
        });

        const xmlCommentRegEx = "<!--[ ]?%s[ ]?-->([^]+?)<!--[ ]%s[ ]-->";
        const codeCommentRegEx = "\\/\\/%s([^]+?)\\/\\/%s";
        const xmlSnippetTemplate = "```xml\n%s\n```";
        const extRegEx = {
            ".config": { regEx: xmlCommentRegEx, template: xmlSnippetTemplate },
            ".pdl": { regEx: xmlCommentRegEx, template: xmlSnippetTemplate },
            ".html": { regEx: xmlCommentRegEx, template: xmlSnippetTemplate },
            ".cs": { regEx: codeCommentRegEx, template: "```csharp\n%s\n```" },
            ".ts": { regEx: codeCommentRegEx, template: "```typescript\n%s\n```" }
        };
        const fileExtension = path.extname(config.file);
        const sectionPattern = util.format(extRegEx[fileExtension].regEx, config.section, config.section);
        const sectionRegEx = new RegExp(sectionPattern, "gmi");
        const sectionContentMatches = sectionRegEx.exec(content);

        if (sectionContentMatches && sectionContentMatches.length > 0) {
            var sectionContent = sectionContentMatches.pop();
            const firstLineWhiteSpaceRegEx = new RegExp("^[ \t]+", "gm");
            const firstLineWhiteSpace = firstLineWhiteSpaceRegEx.exec(sectionContent);
            if(firstLineWhiteSpace && firstLineWhiteSpace.length > 0) {
                const regExMatchWhiteSpaceMultiLine = new RegExp(util.format("^[ \t]{%s}", firstLineWhiteSpace.pop().length ), "gm");
                sectionContent = sectionContent.replace(regExMatchWhiteSpaceMultiLine, '');
            }

            return util.format(extRegEx[fileExtension].template, sectionContent);
        } else {
            throw new Error("could not find section: " + sectionPattern + " in " + config.file);
        }
    },
    /**
     * Wrap the gitdown include function to inject custom headers for nav within the document.
     * required until we deprecate auxdocs after which we can just have relative references to the docs on github.
     */
    includeFile: function (config, context) {
        if (!config.file) {
            throw new Error('config.file must be provided.');
        }

        const extName = path.extname(config.file).toLowerCase();
        const originalContent = gitdownIncludeHelper.compile(config, context);
        
        //if file extension is .md then inject the headers for nav. else use original    
        if(extName === ".md") {
            //fix all relative paths to navigate within the document to anchor e.g
            //  [something](/documentation/articles/foo.md)  is converted to [something](#foo)
            //  <a href="/documentation/articles/foo.md">something</a> is converted to <a href="#foo">something</a>
            var relativeRegEx = /(["|\(])(\/documentation\/articles\/)([^?#)"]+)([^")]*)/gmi;
            var contentCleanedLinks = originalContent.replace(relativeRegEx, '$1#$3');

            // inject a h1 anchor for each document as it is injected using the include-file gitdown extension.
            return `<!-- gitdown: off --> <h1 name="${path.basename(config.file, '.md')}"></h1><!-- gitdown: on -->\n ${contentCleanedLinks}`;
        } else {
            console.log(extName);
            return originalContent;
        }
    },
    /**
     * Creates a symlink to SamplesExtension to both flatten the required path depth in 
     * gitdown references that provide code snippet injection into docs and also to maintain the same folder structure that
     * will be present on github
     */
     createSymlink: function(fromDir, toDir) {
        // alternative is to use environmental variable but gitdown does not support that resolution of env var in path.  
        // so would need to do that for both regular gitdown references and for include sections
        const resolvedFromDir = path.resolve(__dirname, fromDir);
        const resolvedToDir = path.resolve(toDir);
        if (!fs.existsSync(resolvedToDir)) {
            console.log("Can't create symlink to " + resolvedToDir + "as it does not exist");
        }

        if (!fs.existsSync(resolvedFromDir)) {
            console.log("Run as elevated to Create Sym link from: " + resolvedFromDir + " to " + resolvedToDir);
            fs.symlinkSync(resolvedToDir, resolvedFromDir, 'dir');
        }
    },
    /**
     * Validates the links within a given file includes those that start with #, ., / and http
     */
    checkLinks: function(inputFile) {
        var links = [];
        return Q.ninvoke(fs, 'readFile', inputFile,'utf8').then(function (result){
            console.log("checking links in " + inputFile);
            var urls = urlExt.extractUrls(result, urlExt.SOURCE_TYPE_MARKDOWN);
            var count = 0;
            urls.forEach((url) => {
                switch (url[0]) {
                    case "#": 
                        if (!result.includes("name=\"" + url.substr(1) + "\"")) {
                           console.log(chalk.red("\tHyperlink " + url  + " does not refer to a valid link in the document."));
                           count++;
                        }
                        break;
                    case ".":
                        var file = path.resolve(path.dirname(inputFile), url);
                        if (!fs.existsSync(file)) {
                           console.log(chalk.red("\tLink : " + url + " does not resolve to valid path. Resolved path " + file + "does not exist. "));
                           count++;
                        }
                        break;
                    case "/":
                        var sanitizedPath = url.substr(0, url.indexOf("#") > 0 ? url.indexOf("#") : url.length).replace(/\//gm, "\\");
                        var file = __dirname + sanitizedPath + (!path.extname(sanitizedPath) ? '.md' : '');
                        if (!fs.existsSync(file)) {
                           console.log(chalk.red("\tLink : " + url + " does not resolve to valid path. Resolved path " + file + "does not exist. "));
                           count++;
                        }
                        break;
                    case "h":
                        links.push(url);
                        break;
                }
            });
            console.log("\t" + count + " broken links found");
        }).then(() => {
            var dl = deadlink();
	    var promises = dl.resolve(links);
            console.log("\tchecking " + links.length + " urls");
            return Q.all(promises).then(console.log("\t\tall good"));
        });
    }
}
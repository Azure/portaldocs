//------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//------------------------------------------------------------

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
var MarkdownContents = require('markdown-contents');

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
        
        gd.registerHelper('include-headings', {
            weight: 30,
            compile: self.includeHeadings
        });
        return gd.writeFile(path.resolve(outDir, path.basename(inputFile)));
    },
    includeHeadings: function (config, context) {
        if (!config.file) {
            throw new Error('config.file must be provided');
        }
        try {
            config.maxLevel = config.maxLevel || 2;
            
            var fullFilePath = path.resolve(context.gitdown.getConfig().baseDirectory, config.file);
            var relativeFilePath = fullFilePath.replace(context.gitdown.getConfig().baseDirectory, "");
            
            if (!fs.existsSync(fullFilePath)) {
                throw new Error('Input file does not exist: ' + config.file);
            }
            
            var content = fs.readFileSync(fullFilePath, {
                encoding: 'utf8'
            });

            var tree = MarkdownContents(content).tree();

            // Set the max level
            tree = self.maxLevel(tree, config.maxLevel);

            var output = MarkdownContents.treeToMarkdown(tree);

            output = self.appendFilepathsToLinks(output, relativeFilePath);
        } catch (err) {
            console.log ("An error occured while trying to include headings: " + err);
        }

        return output;
    },
    /**
     * Appends the given filepath to links in the given markdown file that don't already have links setup.
     * Used for fixing up links to point to external files when using the custom "include-headings" gitdown helper
     * @private
     */
    appendFilepathsToLinks: function (markdown, filePath) {
        if (filePath.startsWith('\\')) {
            filePath = filePath.substring(1, filePath.length);
        }
        var regex = new RegExp(']\\(#', 'g');
        markdown = markdown.replace(regex, '](' + filePath + '#');
        return markdown;
    },
    /**
     * Removes tree descendants with level greater than maxLevel.
     * Copied from gitdown's contents.js helper file since their implementation is private
     *
     * @private
     */
   maxLevel: function (tree) {
      var maxLevel = arguments.length <= 1 || arguments[1] === undefined ? 1 : arguments[1];

      tree.forEach((article, index) => {
        if (article.level > maxLevel) {
          delete tree[index];
        } else {
          article.descendants = self.maxLevel(article.descendants, maxLevel);
        }
      });

      return tree;
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

        const originalContent = gitdownIncludeHelper.compile(config, context);
        
        return originalContent;
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
        var docs = [];
        var brokenLinks = [];
        return Q.ninvoke(fs, 'readFile', inputFile,'utf8').then(function (result){
            console.log("checking links in " + inputFile);
            var urls = urlExt.extractUrls(result, urlExt.SOURCE_TYPE_MARKDOWN);
            
            var urlsToSkip = [
                            "aka.ms/portalfx/samples",
                            "aka.ms/portalfx/create",
                            "df.onecloud.azure-test.net",
                            "github.com/Azure/azure-marketplace/wiki",
                            "github.com/Azure/msportalfx-test",
                            "idwebelements",
                            "igroup",
                            "kusto.azurewebsites.net",
                            "mailto:",
                            "management.azure.com",
                            "microsoft.sharepoint.com",
                            "msazure.pkgs.visualstudio.com",
                            "msblox.pkgs.visualstudio.com",
                            "msdn.microsoft.com",
                            "portal.azure.com", 
                            "production.diagnostics.monitoring.core.windows.net",
                            "technet.microsoft.com",
                            "wanuget",
                            "www.visualstudio.com/en-us/docs"
                        ];
            
            var count = 0;
            urls.forEach(function(url) {
                // Trim the http:// or https://
                var trimmedUrl = url.replace("/(?i:^HTTPS://|HTTP://)/","");
                        
                if (urlsToSkip.some(function(s) { return trimmedUrl.toUpperCase().indexOf(s.toUpperCase()) >= 0;})) {
                    console.log(chalk.yellow("Skipping check for url: " + url));
                    return;
                }
                
                switch (url[0]) {
                    case "#": 
                        if (!result.includes("name=\"" + url.substr(1) + "\"")) {
                           //console.log(chalk.red("\tHyperlink " + url  + " does not refer to a valid link in the document.  Input file: " + inputFile));
                           brokenLinks.push({ "url":url, "inputFile":inputFile });
                           count++;
                        }
                        break;
                    case "/":
                        var sanitizedPath = url.substr(0, url.indexOf("#") > 0 ? url.indexOf("#") : url.length).replace(/\//gm, "\\");
                        var file = __dirname + sanitizedPath + (!path.extname(sanitizedPath) ? '.md' : '');
                        if (!fs.existsSync(file)) {
                           //console.log(chalk.red("\tLink : " + url + " does not resolve to valid path. Resolved path " + file + "does not exist. Input file: " + inputFile));
                           brokenLinks.push({ "url":url, "inputFile":inputFile });
                           count++;
                        }
                        break;
                    case "h":
                        if (urlsToSkip.some(function(s) { return trimmedUrl.toUpperCase().indexOf(s.toUpperCase()) >= 0;})) {
                            console.log(chalk.yellow("Skipping check for url: " + url + " in " + inputFile));
                        }
                        else {
                            links.push(url);
                        }
                        break;
                    case ".":
                    default:
                        var sanitizedPath = url.substr(0, url.indexOf("#") > 0 ? url.indexOf("#") : url.length).replace(/\//gm, "\\");
                        var file = path.resolve(path.dirname(inputFile), sanitizedPath);
                        if (!fs.existsSync(file)) {
                           //console.log(chalk.red("\tLink : " + url + " does not resolve to valid path. Resolved path " + file + "does not exist. Input file: " + inputFile));
                           brokenLinks.push({ "url":url, "inputFile":inputFile });
                           count++;
                        }
                        break;
                }
            });
        }).then(function() {
            try {
                var dl = deadlink();
                var promises = dl.resolve(links);
                
                return Q.all(promises).then(function(resolutions) {
                    
                    resolutions.forEach(function (resolution) {
                        if (resolution.error) {
                            brokenLinks.push({ "url":resolution.url, "inputFile":"unknown" });
                        }
                    });
                    
                })
            }
            catch (err) {
                console.log(chalk.red("Error in checking links: " + err));
                return Q.all(promises);
            }
        }).then(function() {
            if (brokenLinks.length > 0)
            {
                //console.log(chalk.red(brokenLinks.length + " broken links/fragments found.  Please fix them!"));
                brokenLinks.forEach(function(l) {
                    console.log(chalk.bgRed("Broken link/fragment found in " + l.inputFile + " for url: " + l.url));
                });
            }
        });
    }
}
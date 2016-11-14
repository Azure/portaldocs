//------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//------------------------------------------------------------

var gulpCommon = require('../gulpcommon.js');
var fs = require('fs');
var Q = require('q');
var gulp = require('gulp');
var path = require('path');
var ncp = require('ncp');

//directories have to work within both AzureUx-PortalFx and portalfx-docs-pr repos.
const sdkDir = __dirname;
const generatedDir = path.resolve(sdkDir, 'generated');
const templatesDir = path.resolve(sdkDir, 'templates');
const articlesDir = path.resolve(process.cwd(), 'articles');
const mediaSourceDir = path.resolve(sdkDir, 'media');
const mediaAuxDocsLegacyDir = path.resolve(articlesDir, 'media');

/**  
 * generates docs for gallery team
 */
gulp.task('gallery', function () {
    return gulpCommon.processDirectory(templatesDir, articlesDir, "^gallery.+\.md").then(function () {
        if (!fs.existsSync(generatedDir)){
            fs.mkdirSync(generatedDir);
        }
        return gulpCommon.processFile(path.resolve(templatesDir, "index-gallery.md"), generatedDir, {}, true);
    }).then(function () {
        //DPS does not support ref to media folder in the root, so until we deprecate auxdocs.azurewebsites.net media folder has to be dulplicated to /root        
        return ncp(mediaSourceDir, mediaAuxDocsLegacyDir);
    }).then(function () {
        if(process.argv.indexOf("--verify") > 0) {
            return gulpCommon.checkLinks(path.resolve(generatedDir, "index-gallery.md"));
        }
    });
});
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
const mediaSourceDir = path.resolve(sdkDir, 'media');

/**  
 * generates docs for gallery team
 */
gulp.task('gallery', function () {
    if (!fs.existsSync(generatedDir)) {
        fs.mkdirSync(generatedDir);
    }
    return gulpCommon.processFile(path.resolve(templatesDir, "index-gallery.md"), generatedDir, {}, true).then(function () {
        if (process.argv.indexOf("--verify") > 0) {
            return gulpCommon.checkLinks(path.resolve(generatedDir, "index-gallery.md"));
        }
    });
});
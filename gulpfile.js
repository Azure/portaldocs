//------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//------------------------------------------------------------

/**
 * top level gulp that can be used to aggregate tasks across N SDK gulp files
 */
var gulp = require('gulp');
var gulpFile = require('./portal-sdk/gulpfile.js');
var gulpFile = require('./gallery-sdk/gulpfile.js');

//default gulp task to run both new and old legacy content
gulp.task('default', ['portal']);

gulp.task('docs', ['portal', 'gallery']);
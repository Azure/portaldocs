//------------------------------------------------------------
// Copyright (c) Microsoft Corporation.  All rights reserved.
//------------------------------------------------------------

var gulpCommon = require('../gulpcommon.js');
var fs = require('fs');
var storage = require('azure-storage');
var Q = require('q');
var gulp = require('gulp');
var path = require('path');
var util = require('util');
var ncp = require('ncp');
var dir = require('node-dir');

//directories have to work within both AzureUx-PortalFx and portalfx-docs-pr repos.
const sdkDir = __dirname;
const generatedDir = path.resolve(sdkDir, 'generated');
const templatesDir = path.resolve(sdkDir, 'templates');
const mediaSourceDir = path.resolve(sdkDir, 'media');
const fourMonthsAgo = new Date(new Date().setMonth(new Date().getMonth() - 4));

/**  
 * generates docs for ux design team
 */
gulp.task('ux', function () {
    if (!fs.existsSync(generatedDir)) {
        fs.mkdirSync(generatedDir);
    }
    return gulpCommon.processFile(path.resolve(templatesDir, "index-portalfx-ux.md"), generatedDir, {}, true);
});

/**  
 * generates all documentation for both legacy auxdocs.azurewebsites.net and new github documentation
 */
gulp.task('portal', function () {
    //required for short path to SamplesExtension
    gulpCommon.createSymlink("portal-sdk/samples/SamplesExtension", "../src/SDK/AcceptanceTests/Extensions/SamplesExtension");
    gulpCommon.createSymlink("portal-sdk/samples/InternalSamplesExtension", "../src/SDK/AcceptanceTests/Extensions/InternalSamplesExtension");

    if (!fs.existsSync(generatedDir)) {
        fs.mkdirSync(generatedDir);
    }

    console.log("templates Dir " + templatesDir);

    return Q.ninvoke(dir, "paths", templatesDir, true).then(function(paths) {
        try {
            var filePromises = [Q()];
            
            var dirs = paths.filter(function (file) {
                return file.endsWith(".md");
            });

            filePromises = dirs.map(function (f) {
                var relativePath = f.replace(templatesDir, "");
                var newGeneratedDir = path.join(generatedDir, path.dirname(relativePath));

                if (!fs.existsSync(newGeneratedDir)) {
                    fs.mkdirSync(newGeneratedDir);
                }

                // return gulpCommon.processFile(f, newGeneratedDir, { headingNesting: { enabled: false } }, true);
                return gulpCommon.processFile(f, newGeneratedDir, {}, true);
            });

            return Q.all(filePromises);
        }
        catch (err) {
           console.log("An error occured: " + err);

           throw err;
        }
    }).then(function () {
        try {
            var checkLinkPromises = [Q()];
                if (process.argv.indexOf("--verify") > 0) {
                    Q.ninvoke(dir, "paths", generatedDir, true).then(function(generatedFiles){
                        checkLinkPromises  = generatedFiles.map(function (fileName) {
                        console.log("generated file is " + fileName);
                        return gulpCommon.checkLinks(path.resolve(generatedDir, fileName));
                    });
                });
            }

           return Q.all(checkLinkPromises);
        }
        catch (err) {
           console.log("An error occured: " + err);

           throw err;
        }
    });
});

//gulp task to generate auxdocs website content that was dynamic to static markdown docs 
gulp.task('dynamicdocs', function () {
    var query = new storage.TableQuery()
        .where("InProductionDate ge datetime?", fourMonthsAgo.toISOString())
        .and("InProduction eq ?", true)
        .and("Type ne ?", "Commit");
    console.log("querying portalfx commit logs");
    return queryPortalFxLogs(query, null, null)
        .then(function (results) {
            console.log("generating docs for %s commit logs", results.length);
            return generateDynamicDocs(results, generatedDir);
        });
});

/**
 * Generates breaking-changes.md document from content written table storage from the SDK pipeline tools.
 * will recursively follow continuation tokens until all breaking changes are merged into mergedResults
 */
function queryPortalFxLogs(query, continuationToken, mergedResults) {
    mergedResults = mergedResults || [];
    //table service uses environmental var AZURE_STORAGE_CONNECTION_STRING
    if (process.env.AZURE_STORAGE_CONNECTION_STRING) {
        var tableSvc = storage.createTableService().withFilter(new storage.ExponentialRetryPolicyFilter());
        return Q.ninvoke(tableSvc, "queryEntities", "PortalFxChangeLog", query, continuationToken)
            .then(function (result) {
                var body = result[0];
                mergedResults = mergedResults.concat(body.entries);

                if (body.continuationToken) {
                    //recurse continuation token 
                    return queryPortalFxLogs(query, body.continuationToken, mergedResults);
                } else {
                    return Q.resolve(mergedResults);
                }
            });
    } else {
        return Q.reject("environmental var AZURE_STORAGE_CONNECTION_STRING required to generate breaking-changes.md document");
    }
}

/** 
 * Generates release-notes.md, breaking-changes.md and downloads.md docs given an array of portalFxLogs
 */
function generateDynamicDocs(portalFxLogs, outputDir) {
    var blobSvc = storage.createBlobService();
    var previousRNVersion, previousBCVersion;
    var downloadUrlPromises = [];
    var aggregate = {};

    const releaseNoteRowTemplate = "<tr><td><a href='http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=%s'>%s</a></td><td>%s</td><td>%s</td></tr>";
    const breakingChangeRowTemplate = "<tr><td><a href='http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=%s'>%s</a></td><td><a href='http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=%s'>%s</a><p>%s</p></td></tr>";
    var startDate = new Date();
    var expiryDate = new Date(startDate);
    expiryDate.setMonth(startDate.getMonth() + 1);
    startDate.setMinutes(startDate.getMinutes() - 10); //avoid clock skew

    var sasPolicy = {
        AccessPolicy: {
            Permissions: storage.BlobUtilities.SharedAccessPermissions.READ,
            Start: startDate,
            Expiry: expiryDate
        },
    };
    var rnRows = "", bcRows = "";

    //iterate in reverse to preserve order descending version order from storage. aggregate content by version for the three docs
    for (var i = portalFxLogs.length - 1; i >= 0; i--) {
        var entity = portalFxLogs[i];
        var changeType = entity.Type._;
        var sdkVersion = entity.PartitionKey._;
        var isBreakingChange = entity.IsBreakingChange._;
        var title = entity.Title ? entity.Title._ : "";
        aggregate[sdkVersion] = aggregate[sdkVersion] || { breakingCount: 0, featureCount: 0, bugFixCount: 0, downloadUrl: "", dateInProd: entity.Date._, breakingChanges: { rows: "", titles: [] } };

        if (previousRNVersion !== sdkVersion) {
            if (previousRNVersion) {
                aggregate[previousRNVersion].releaseNotes = rnRows;
                rnRows = "";
            }

            //removing sas generation and linking to auxdocs for auth download
            downloadUrlPromises.push(getBlobDownloadUrl(blobSvc, "daily", util.format("%s/Portal-%s.msi", sdkVersion, sdkVersion), sdkVersion).then(function (result) {
                aggregate[result.version].downloadUrl = result.downloadUrl;
            }));

            previousRNVersion = sdkVersion;
        }

        //add row to release notes        
        rnRows = rnRows.concat(util.format(releaseNoteRowTemplate,
            entity.RowKey._,
            entity.RowKey._,
            getPrettyChangeType(isBreakingChange, changeType),
            title));

        //add row to breaking changes
        if (isBreakingChange) {
            if (previousBCVersion !== sdkVersion) {
                if (previousBCVersion) {
                    aggregate[previousBCVersion].breakingChanges.rows = bcRows;
                    bcRows = "";
                }
                previousBCVersion = sdkVersion;
            }

            aggregate[sdkVersion].breakingChanges.titles.push(title);
            bcRows = bcRows.concat(util.format(breakingChangeRowTemplate,
                entity.RowKey._,
                entity.RowKey._,
                entity.RowKey._,
                title,
                entity.BreakingChangeDescription ? entity.BreakingChangeDescription._ : "No description available for this breaking change."));

            if (entity.BreakingChangeDescription && !entity.BreakingChangeDescription._) {
                console.error(util.format("*** The following breaking change has no description http://vstfrd:8080/Azure/RD/_workitems#_a=edit&id=%s", entity.BreakingChangeDescription._));
            }
        }

        updateAggregate(aggregate[sdkVersion], isBreakingChange, changeType);
    }
    aggregate[previousRNVersion].releaseNotes = rnRows;
    if (previousBCVersion) {
        aggregate[previousBCVersion].breakingChanges.rows = bcRows;
    }

    return Q.allSettled(downloadUrlPromises).then(function (results) {
        writeDocsToFile(aggregate, outputDir);
    });
}

/**
 * Takes the aggregate content for all versions and writes it to release-notes.md, breaking-changes.md and downloads.md
 */
function writeDocsToFile(aggregate, outputDir) {
    var releaseNotesFile = fs.createWriteStream(path.resolve(outputDir, "release-notes.md"));
    var breakingChangesFile = fs.createWriteStream(path.resolve(outputDir, "breaking-changes.md"));
    var downloadsDoc = fs.createWriteStream(path.resolve(outputDir, "downloads.md"));
    const latestSdkVersion = Object.keys(aggregate)[0];

    releaseNotesFile.write(util.format("# Release Notes since %s", fourMonthsAgo.toLocaleDateString("en-US")));
    breakingChangesFile.write(util.format("# Breaking Changes since %s \n* Additional Q&A about breaking changes can be found [here](./breaking-changes.md) \n* To ask a question about breaking changes [use this](https://aka.ms/ask/ibiza-breaking-change)  \n", fourMonthsAgo.toLocaleDateString("en-US")));
    downloadsDoc.write(util.format("# Download Portal SDK \n Download Latest Release: <a href=\"%s\">%s</a>\n<table><tr><th>Download</th><th>Detail</th><th>Breaking Changes</th></tr>", aggregate[latestSdkVersion].downloadUrl, latestSdkVersion));

    Object.keys(aggregate).forEach(function (version) {
        var result = aggregate[version]
        var versionFragment = version.replace(/\./g, '');

        console.log("Version: " + version);
        releaseNotesFile.write(util.format("\n\n## %s\n%d Breaking Changes, %d Features added and %d Bugs Fixed\n<table>%s</table>",
            version,
            result.breakingCount,
            result.featureCount,
            result.bugFixCount,
            result.releaseNotes));

        if (result.breakingCount > 0) {
            breakingChangesFile.write(util.format("\n\n## %s\n<table>%s</table>",
                version,
                result.breakingChanges.rows));
        }

        downloadsDoc.write(util.format("<tr><td name=\"%s\">%s<br/>%s</td><td>%s<br/>%s</td><td>%s</td></tr>",
            versionFragment,
            result.downloadUrl
                ? util.format("<a href=\"%s\">%s</a>", result.downloadUrl, version)
                : version,
            result.dateInProd.toLocaleDateString("en-US"),
            util.format("%d Breaking Changes, %d Features added and %d Bugs Fixed", result.breakingCount, result.featureCount, result.bugFixCount),
            util.format("<a href=\"./release-notes.md#%s\">more details...</a>", versionFragment),
            result.breakingChanges.titles.length > 0
                ? result.breakingChanges.titles.reduce(function (content, item) {
                    return content.concat(util.format("%s", item));
                }).concat(util.format("<br/><a href='./breaking-changes.md#%s'>more details...</a>", versionFragment)) : ""
        ));
    });
    //write results to release-notes.md, breaking-changes.md and downloads.md
    releaseNotesFile.end("");
    breakingChangesFile.end("");
    downloadsDoc.end("</table>");
}

/**
 * updates versionAggregate the # of breaking changes, tasks and bugs
 */
function updateAggregate(versionAggregate, isBreakingChange, changeType) {

    if (isBreakingChange) {
        versionAggregate.breakingCount += 1;
    } else if (changeType === "RDTask") {
        versionAggregate.featureCount += 1;

    } else if (changeType === "RDBug") {
        versionAggregate.bugFixCount += 1;
    }

    return versionAggregate;
};

/**
 * Check if the blob exists.
 */
function getBlobDownloadUrl(blobSvc, container, blobName, sdkVersion) {
    var result = { version: sdkVersion };
    return Q.ninvoke(blobSvc, "doesBlobExist", container, blobName).then(function (existResult) {
        result.downloadUrl = (existResult && existResult[0].exists) ? util.format("https://auxdocs.azurewebsites.net/en-us/Downloads/Download/%s", sdkVersion.replace(/\./g, '_')) : "";
        return result;
    });
}

/**
 * returns pretty string for breaking changes, features and bugs
 */
function getPrettyChangeType(isBreaking, changeType) {
    if (isBreaking) {
        return "<strong>Break</strong>";
    } else if (changeType === "RDTask") {
        return "Feature";
    } else if (changeType === "RDBug") {
        return "Bug Fix";
    } else {
        return changeType;
    }
}

#!/usr/bin/env node

var fs = require("fs");
var path = require("path");
var exec = require("child_process").exec;
// This file will be linked as the githooks in order to split them, so we need
// to know who called us, and where from (should always be the same place, but
// this way is reliable).
var callingFile = path.basename(__filename);
var hooksDir = path.dirname(__filename);

// We call local hooks first. We're doing this because we want our shared hooks
// to (probably) validate against styleguides etc. - no use if a local hook can
// change stuff *after* we've checked it.
var localHook = path.join(hooksDir, "local", callingFile);
fs.stat(localHook, function(err, stats) {
  if (stats.isFile()) {
    exec(localHook, function(error, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
        console.log(error.code);
      }
    });
  }
});

var sharedHook = path.join(hooksDir, "shared", callingFile);
fs.stat(sharedHook, function(err, stats) {
  if (stats.isFile()) {
    exec(sharedHook, function(error, stdout, stderr) {
      console.log(stdout);
      console.log(stderr);
      if (error !== null) {
        console.log("Error:", error);
      }
    });
  }
});

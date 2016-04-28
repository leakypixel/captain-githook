#!/usr/bin/env node

var fs = require("fs-extra");
var path = require("path");
var appRoot = require('app-root-path').path;
var gitHooksDir = path.join(appRoot, ".git", "hooks");
var localHooksDir = path.join(gitHooksDir, "local");
var hooks = ["applypatch-msg", "commit-msg", "post-commit", "post-receive", "post-update", "pre-applypatch", "pre-commit", "prepare-commit-msg", "pre-rebase", "update"];
var gitHooksTempDir = path.join(appRoot, ".git", "local");

function removeHookLinks() {
  hooks.forEach(function(hook) {
    var hookPath = path.join(gitHooksDir, hook);
    fs.unlinkSync(hookPath);
  });
  fs.move(localHooksDir, gitHooksTempDir, function(err) {
    if (err) {
      console.log(err);
    };
    fs.removeSync(gitHooksDir);
    fs.move(gitHooksTempDir, gitHooksDir, function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Uninstall finished. .githooks has not been removed, it's up to you to do this.");
      };
    });
  });
}

fs.stat(localHooksDir, function(err, stats) {
  if (err && err.code === 'ENOENT') {
    console.log("Linked hooks don't seem to be installed. Either they weren't installed correctly or something went wrong.");
  } else {
    console.log("Removing links and resetting .git/hooks/");
    removeHookLinks();
  }
});

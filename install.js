#!/usr/bin/env node

var fs = require("fs-extra");
var path = require("path");
var moduleDir = path.dirname(require.main.filename);
var appRoot = require('app-root-path').path;
var gitHooksDir = path.join(appRoot, ".git", "hooks");
var gitHooksTempDir = path.join(appRoot, ".git", "local");
var localHooksDir = path.join(gitHooksDir, "local");
var projectHooksDir = path.join(appRoot, ".githooks");

function setLinks() {
  fs.mkdirp(projectHooksDir, function(err) {
    fs.move(gitHooksDir, gitHooksTempDir, function(err) {
      fs.mkdirSync(gitHooksDir);
      fs.move(gitHooksTempDir, localHooksDir, function(err) {
        fs.symlinkSync(projectHooksDir, path.join(gitHooksDir, "shared"));
        linkHooks();
      });
    });
  });
}
function linkHooks() {
  var hooks = ["applypatch-msg", "commit-msg", "post-commit", "post-receive", "post-update", "pre-applypatch", "pre-commit", "prepare-commit-msg", "pre-rebase", "update"];
  var hookSplitter = path.join(moduleDir, "split-hook.js");
  // Make the hooksplitter executable. I'd prefer this to be a "+x", but this
  // implementation doesn't seem to support it. I could be wrong.
  fs.chmodSync(hookSplitter, "755");

  // Map the hooks to our splitter, using hardlinks.
  hooks.forEach(function(hook) {
    var hookPath = path.join(gitHooksDir, hook);
    fs.linkSync(hookSplitter, hookPath);
    fs.chmodSync(hookPath, "755");
  });
}

setLinks();

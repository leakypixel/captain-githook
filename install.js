#!/usr/bin/env node

var fs = require("fs-extra");
var path = require("path");
var moduleDir = path.dirname(require.main.filename);
var appRoot = require('app-root-path').path;
var gitHooksDir = path.join(appRoot, ".git", "hooks");
var gitHooksTempDir = path.join(appRoot, ".git", "local");
var localHooksDir = path.join(gitHooksDir, "local");
var projectHooksDir = path.join(appRoot, ".githooks");
var hooks = [
  "applypatch-msg",
  "commit-msg",
  "post-applypatch",
  "post-checkout",
  "post-commit",
  "post-merge",
  "post-receive",
  "post-rewrite",
  "post-update",
  "pre-applypatch",
  "pre-auto-gc",
  "pre-commit",
  "prepare-commit-msg",
  "pre-push",
  "pre-rebase",
  "pre-receive",
  "push-to-checkout",
  "update"
];

function cleanInstall() {
  fs.mkdirp(projectHooksDir, function(err) {
    fs.move(gitHooksDir, gitHooksTempDir, function(err) {
      fs.mkdirSync(gitHooksDir);
      fs.move(gitHooksTempDir, localHooksDir, function(err) {
        if (err && err.code === 'ENOENT') {
          fs.mkdirSync(localHooksDir);
        }
        fs.symlinkSync(projectHooksDir, path.join(gitHooksDir, "shared"), 'junction');
        linkHooks();
      });
    });
  });
}

function removeIfExists(path) {
  try {
    fs.accessSync(path, fs.F_OK);
    fs.unlinkSync(path);
  } catch (e) {
    // File doesn't exist, no need to remove.
  }
}


function rebuildHookLinks() {
  hooks.forEach(function(hook) {
    var hookPath = path.join(gitHooksDir, hook);
    removeIfExists(hookPath);
  });
  linkHooks();
}

function linkHooks() {
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
fs.stat(localHooksDir, function(err, stats) {
  // Check if folder exists - if not, assume we're safe and run the install.
  if (err && err.code === 'ENOENT') {
    cleanInstall();
  } else {
    rebuildHookLinks();
  }
});

# captain-githook
An NPM module to allow managing git hooks with source control.

Upon install, this module will run a postinstall hook. This moves any existing
hooks you may have into .git/hooks/local, and creates a symlinked
.git/hooks/shared to .githooks. Git hooks are then created pointing to the
split-hook.js, which when called will look first for the name of the called hook
in local and run if present, and then do the same for a shared hook.

It's probably quite distasteful to some people, and useful to others.

# captain-githook

Stop spending time in code reviews picking up formatting and code style errors,
and let the machines do it before it gets there.


## Usage
Install this module to your repository, and put any repository-wide hooks in
`./.githooks`. You'll now be able to commit and share these hooks. Each of the
hooks in `./.githooks` must be executable and may only be a file with no
extension, named after the hook it should run on. These can be used to run
multiple other scripts or not, the choice is yours.

## How?
Upon install, this module will run a postinstall hook. This moves any existing
hooks you may have into `.git/hooks/local`, and symlinks `.git/hooks/shared` to
`./.githooks`. Git hook hardlinks are then created pointing to `split-hook.js`,
which when called will look first for the name of the called hook in local and
run if present, and then do the same for a shared hook.

## Why?
Initially created for my own pre-commit linting, but found to be useful in
bigger teams to enforce code guidelines before any code makes it up to the
repository.

## Uninstall
There is an uninstall task which can be run, this clears up the `.git/hooks`
directory, but leaves the `./.githooks` directory intact. This allows you to
easily switch to another githook management tool without clearing up manually.

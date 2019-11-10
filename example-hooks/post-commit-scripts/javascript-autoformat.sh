#!/usr/bin/env bash
echo "Running post commit hook"
# Get the JS files that were just changed
js_files=$(git diff-tree --no-commit-id --name-only -r HEAD | grep '\.js$')
# If we have some, then
if [ -n "$js_files" ]; then
  # get the local install of prettier-eslint
  prettier="$(npm bin)/prettier"
  eslint="$(npm bin)/eslint"

  # for each of the changed files, run them through prettier_eslint
  for file in $js_files; do
    $prettier --write "$file"
    $eslint --fix "$file"
    # then detect if they've changed.
    if [ -n "$(git diff --name-only --diff-filter=M $file)" ]; then
      # If they have, we know they weren't formatted correctly
      js_dirty=true
    fi
  done

  # if there were files that weren't formatted correctly, exit with an error
  # code and display the following message
  if [ "$js_dirty" = true ]; then
    tput setaf 1
    echo -e "Changed JavaScript files did not adhere to formatting rules and so have been
reformatted automatically. Please review these changes and then add them to
your previous commit with:"
    tput bold
    echo -e "git commit --amend --no-edit"
    tput sgr0
    exit 1
  fi
fi

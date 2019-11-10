#!/usr/bin/env bash

dirty_status=0

files_to_lint=$(git diff --cached --name-only --diff-filter=ACM | grep "\.js$")
if [ -n "$files_to_lint" ]; then
  eslint="$(npm bin)/eslint"

  for file in $files_to_lint; do
    echo "Linting $file..."
    $eslint --fix "$file"
    # Capture the return code of eslint, so we can exit with the proper code
    # after we've linted all the files.
    return_code=$?
    if [[ $return_code != 0 ]]; then
      dirty_status=1
    fi
  done
  exit $dirty_status
fi

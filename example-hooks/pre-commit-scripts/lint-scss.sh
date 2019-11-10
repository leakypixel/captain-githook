#!/usr/bin/env bash

dirty_status=0
echo "Ran"
files_to_lint=$(git diff --cached --name-only --diff-filter=ACM | grep "\.scss$")
if [ -n "$files_to_lint" ]; then
  stylelint="$(npm bin)/stylelint"

  for file in $files_to_lint; do
    echo "Creating linting report for $file..."
    $stylelint --syntax scss $file
    # Capture the return code of stylelint, so we can exit with the proper code
    # after we've linted all the files.
    return_code=$?
    echo "Exited with code $return_code"
    if [[ $return_code != 0 ]]; then
      dirty_status=1
    fi
  done
  exit $dirty_status
fi

#!/bin/sh
# Claude Code Stop hook: when a turn ends with uncommitted changes, commit them all.
# The git post-commit hook then pushes to GitHub.
cd "$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0
[ -n "$(git status --porcelain)" ] || exit 0
g=$(git rev-parse --git-dir)
[ -d "$g/rebase-merge" ] || [ -d "$g/rebase-apply" ] || [ -f "$g/MERGE_HEAD" ] && exit 0
git add -A
files=$(git diff --cached --name-only | sed 's#.*/##' | head -5 | paste -sd, - | sed 's/,/, /g')
n=$(git diff --cached --name-only | wc -l | tr -d ' ')
[ "$n" -gt 5 ] && files="$files and $((n - 5)) more"
git commit -q -m "update: $files" -m "Auto-committed at the end of a Claude Code turn." && \
  echo "{\"systemMessage\": \"Committed and pushing to GitHub: $files\"}"

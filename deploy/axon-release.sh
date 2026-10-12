#!/bin/bash
# Runs ON the axon EC2: pull main from GitHub, build, publish as a new release, switch "current".
# Called by deploy.sh on the Mini (ssh axon bash /srv/askjoey/repo/deploy/axon-release.sh), or by hand.
#   axon-release.sh            pull + build + switch
#   axon-release.sh rollback   point "current" back at the previous release
set -euo pipefail
ROOT=/srv/askjoey
REPO=$ROOT/repo
cd "$ROOT"

if [ "${1:-}" = rollback ]; then
  prev=$(ls -1d releases/* | sort | tail -2 | head -1); cur=$(readlink current)
  [ "$prev" != "$cur" ] || { echo "no earlier release"; exit 1; }
  ln -sfn "$prev" current.tmp && mv -T current.tmp current
  echo "live: $prev"; exit 0
fi

git -C "$REPO" fetch -q origin main
git -C "$REPO" reset -q --hard origin/main   # the server copy never carries its own edits
sha=$(git -C "$REPO" rev-parse --short HEAD)
cd "$REPO/site"
# reinstall only when the lockfile changed
lock=$(sha256sum package-lock.json | cut -c1-16)
if [ ! -d node_modules ] || [ "$(cat node_modules/.lock-sha 2>/dev/null)" != "$lock" ]; then
  npm ci --no-audit --no-fund --loglevel=error && echo "$lock" > node_modules/.lock-sha
fi
npm run build --silent > "$ROOT/build.log" 2>&1 || { tail -30 "$ROOT/build.log"; exit 1; }
test -f dist/index.html && test -f dist/new-casa-suites/index.html

rel="releases/$(date +%Y%m%d-%H%M%S)-$sha"
cd "$ROOT"
cp -a "$REPO/site/dist" "$rel"
ln -sfn "$rel" current.tmp && mv -T current.tmp current
ls -1d releases/* | sort | head -n -5 | xargs -r rm -rf
echo "live: $rel"

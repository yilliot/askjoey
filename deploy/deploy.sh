#!/bin/bash
# Put the site live on axon (https://askjoey.axon.commun.cloud) through git:
# the Mini pushes main to GitHub (yilliot/askjoey), axon pulls it, builds and switches releases.
#   bash deploy/deploy.sh            push + release on axon + check
#   bash deploy/deploy.sh rollback   axon points "current" back at the previous release
set -euo pipefail
cd "$(dirname "$0")/.."
HOST=axon
URL=https://askjoey.axon.commun.cloud

if [ "${1:-}" = rollback ]; then
  ssh -o BatchMode=yes $HOST bash /srv/askjoey/repo/deploy/axon-release.sh rollback
  exit 0
fi

[ -z "$(git status --porcelain)" ] || { echo "commit first: the release is built from what is on GitHub"; git status --short | head; exit 1; }
git push -q origin main
ssh -o BatchMode=yes $HOST 'git -C /srv/askjoey/repo fetch -q origin main && git -C /srv/askjoey/repo reset -q --hard origin/main && bash /srv/askjoey/repo/deploy/axon-release.sh'

for path in / /new-casa-suites/ /causewayz-square/; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$URL$path?v=$(git rev-parse --short HEAD)")
  echo "$code $URL$path"
  [ "$code" = 200 ] || { echo "check failed"; exit 1; }
done

#!/bin/bash
# Build the site on the Mini and put it live on axon: https://askjoey.axon.commun.cloud
#   bash deploy/deploy.sh            build + ship + switch + check
#   bash deploy/deploy.sh rollback   point "current" back at the previous release
# Each deploy is a new folder in /srv/askjoey/releases; "current" is swapped atomically; the last 5 are kept.
set -euo pipefail
cd "$(dirname "$0")/.."
HOST=axon
URL=https://askjoey.axon.commun.cloud
NODE_BIN="$HOME/Library/Application Support/Herd/config/nvm/versions/node/v24.21.0/bin"
[ -x "$NODE_BIN/node" ] && export PATH="$NODE_BIN:$PATH"

if [ "${1:-}" = rollback ]; then
  ssh -o BatchMode=yes $HOST 'set -e; cd /srv/askjoey; prev=$(ls -1d releases/* | sort | tail -2 | head -1); cur=$(readlink current);
    [ "$prev" != "$cur" ] || { echo "no earlier release"; exit 1; }; ln -sfn "$prev" current.tmp && mv -T current.tmp current; echo "now: $prev"'
  exit 0
fi

(cd site && npm run build --silent)
test -f site/dist/index.html && test -f site/dist/new-casa-suites/index.html

stamp=$(date +%Y%m%d-%H%M%S)
rsync -az --delete --link-dest=/srv/askjoey/current/ site/dist/ "$HOST:/srv/askjoey/releases/$stamp/"
ssh -o BatchMode=yes $HOST "set -e; cd /srv/askjoey; ln -sfn releases/$stamp current.tmp && mv -T current.tmp current;
  ls -1d releases/* | sort | head -n -5 | xargs -r rm -rf; echo live: \$(readlink current)"

for path in / /new-casa-suites/; do
  code=$(curl -s -o /dev/null -w '%{http_code}' "$URL$path?v=$stamp")
  echo "$code $URL$path"
  [ "$code" = 200 ] || { echo "check failed"; exit 1; }
done

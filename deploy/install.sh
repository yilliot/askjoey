#!/bin/sh
# One-time (idempotent) setup on the axon EC2: web root + nginx site for askjoey.axon.commun.cloud.
#   scp the deploy/ folder over, then: sudo sh install.sh
# Undo: sudo rm /etc/nginx/sites-enabled/askjoey.axon.commun.cloud /etc/nginx/sites-available/askjoey.axon.commun.cloud \
#       && sudo nginx -t && sudo systemctl reload nginx && sudo rm -rf /srv/askjoey
set -eu
here=$(cd "$(dirname "$0")" && pwd)
site=askjoey.axon.commun.cloud
install -d -o ubuntu -g ubuntu -m 755 /srv/askjoey /srv/askjoey/releases
if [ -f /etc/nginx/sites-available/$site ] && ! cmp -s "$here/$site.conf" /etc/nginx/sites-available/$site; then
  cp /etc/nginx/sites-available/$site /etc/nginx/sites-available/.$site.bak-$(date +%Y%m%d%H%M%S)
fi
install -o root -g root -m 644 "$here/$site.conf" /etc/nginx/sites-available/$site
ln -sfn /etc/nginx/sites-available/$site /etc/nginx/sites-enabled/$site
nginx -t
systemctl reload nginx
echo "installed $site"

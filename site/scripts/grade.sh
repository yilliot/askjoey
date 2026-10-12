#!/bin/bash
# Graded master images for the site, from the developers' material in ../materials.
# Astro (<Picture>) makes the AVIF/WebP sizes from these at build time.
#   bash scripts/grade.sh            # all
#   bash scripts/grade.sh rf|exsim   # one project
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT=$(cd .. && pwd)
OUT=src/assets/img

# "Warm editorial" grade (proposal v2): softer saturation, warm mids, lifted blacks
G="eq=saturation=0.78:contrast=0.95:brightness=0.01,colorbalance=rs=0.035:gs=0.01:bs=-0.045:rm=0.03:gm=0.005:bm=-0.03:rh=0.02:gh=0.01:bh=-0.02,curves=all='0/0.04 0.5/0.51 1/0.97'"
# Floor plans: quiet the pastel fills
P="eq=saturation=0.35:contrast=1.04"

mk(){ # out src crop(w:h:x:y|-) maxwidth filter(-|ffmpeg filter)
  local out=$1 src=$2 crop=$3 w=$4 flt=$5 vf=""
  [ "$crop" != "-" ] && vf="crop=$crop,"
  vf="${vf}scale='min($w,iw)':-2:flags=lanczos"
  [ "$flt" != "-" ] && vf="$vf,$flt"
  mkdir -p "$(dirname "$OUT/$out")"
  ffmpeg -loglevel error -y -i "$src" -vf "$vf" -q:v 2 "$OUT/$out"
}

rf(){
  local M=$ROOT/materials/rf-princess-cove-phase-3/images
  local R=$M/renders L=$M/lifestyle FA=$M/facilities FP=$M/floor-plans
  mk rf/hero.jpg          $R/tower-dusk-landscape.jpg 2560:1640:0:203 2560 "$G"
  mk rf/hero-portrait.jpg $R/tower-dusk-portrait.jpg  2100:2801:262:0 1600 "$G"
  mk rf/day.jpg           $R/tower-day-street.jpg     -               2560 "$G"
  mk rf/aerial.jpg        $R/causeway-aerial-panorama.jpg -           3000 "$G"
  mk rf/night.jpg         $R/aerial-night.jpg         2560:1600:0:243 2560 "$G"
  mk rf/pool.jpg          $R/pool-wide.jpg            1600:720:0:80   1600 "$G"
  mk rf/skypark.jpg       $R/sky-park-garden.jpg      -               755  "$G"
  mk rf/walkway.jpg       $R/covered-walkway.jpg      -               754  "$G"
  mk rf/bridge-mall.jpg   $R/link-bridge-to-mall.jpg  -               744  "$G"
  mk rf/rts.jpg           $R/rts-station.png          -               1029 "$G"
  mk rf/masterplan.jpg    $R/masterplan-stage-a.jpg   -               2400 "$G"
  mk rf/family.jpg        $L/family-snooker.jpg       -               2000 "$G"
  mk rf/tennis.jpg        $L/tennis-couple.jpg        -               2000 "$G"
  mk rf/basketball.jpg    $L/basketball.jpg           -               2000 "$G"
  mk rf/gym.jpg           $FA/gym-1.jpg               -               1343 "$G"
  mk rf/gym-2.jpg         $FA/gym-2.jpg               -               1342 "$G"
  mk rf/yoga.jpg          $FA/yoga-room.jpg           -               1342 "$G"
  mk rf/childcare.jpg     $FA/childcare-centre.jpg    -               1342 "$G"
  mk rf/badminton.jpg     $FA/badminton-hall.jpg      -               1342 "$G"
  mk rf/snooker.jpg       $FA/snooker-room.jpg        -               1342 "$G"
  # floor plans: the drawing only (title, key plan and text are on the page itself)
  python3 -I scripts/planbox.py "$FP" | while read -r f w h x y; do
    t=${f#*-type-}; t=${t%.jpg}
    mk "rf/plans/$t.jpg" "$FP/$f" "$w:$h:$x:$y" 1400 "$P" </dev/null
  done
  mkdir -p $OUT/rf && cp "$M/brand/rf-group-princess-cove-logo-bronze.png" $OUT/rf/logo.png
}

case "${1:-all}" in
  rf) rf ;;
  exsim) bash scripts/grade-exsim.sh ;;
  all) rf; [ -f scripts/grade-exsim.sh ] && bash scripts/grade-exsim.sh || true ;;
esac
du -sh $OUT/* 2>/dev/null

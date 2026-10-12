#!/bin/bash
# Graded masters for Causewayz Square @ JBCC (EXSIM), from ../materials/exsim-causewayz-square.
# Called by grade.sh (bash scripts/grade.sh exsim).
set -euo pipefail
cd "$(dirname "$0")/.."
ROOT=$(cd .. && pwd)
M=$ROOT/materials/exsim-causewayz-square
OUT=src/assets/img/exsim
R=$M/images/renders F=$M/images/facilities
mkdir -p $OUT/plans

# Same warm editorial grade as R&F, a touch gentler: EXSIM's renders are already warm at dusk.
G="eq=saturation=0.82:contrast=0.96:brightness=0.01,colorbalance=rs=0.025:gs=0.008:bs=-0.035:rm=0.02:bm=-0.02,curves=all='0/0.035 0.5/0.505 1/0.975'"

mk(){ # out src crop(w:h:x:y|-) maxwidth
  local out=$1 src=$2 crop=$3 w=$4 vf=""
  [ "$crop" != "-" ] && vf="crop=$crop,"
  ffmpeg -loglevel error -y -i "$src" -vf "${vf}scale='min($w,iw)':-2:flags=lanczos,$G" -q:v 2 "$OUT/$out"
}

mk hero.jpg          $R/03-towers-roadside-day.jpg                   1650:1030:0:40  1650
mk hero-portrait.jpg $R/01-four-towers-dusk-causewayz-podium.jpg     -               1320
mk card.jpg          $R/04-causewayz-podium-signage-low-angle-dusk.jpg 1650:1238:0:120 1650
mk axis.jpg          $R/02-axis-tower-facade-street-dusk.jpg         -               1650
mk brixton.jpg       $R/05-brixton-tower-drop-off-low-angle.jpg      -               1650
mk dover.jpg         $R/06-dover-tower-facade-with-viaduct.jpg       -               1320
mk aerial.jpg        $R/07-aerial-dusk-superimpose-causeway.jpg      1728:1000:0:520 1728
mk rooftop.jpg       $R/08-axis-rooftop-pool-crown-dusk.jpg          -               1650
mk bridge.jpg        $R/09-link-bridge-street.jpg                    -               1650
mk retail-street.jpg $R/10-retail-podium-link-bridge-street.jpg      -               1650
mk entrance.jpg      $R/11-grand-entrance-drop-off-retail.jpg        -               1650
mk retail.jpg        "$(ls $R/14-*.jpg | head -1)"                   -               1650
mk lobby.jpg         $F/axis-grand-lobby.jpg                         -               1650
mk infinity.jpg      $F/axis-l60-wavescape-infinity-pool.jpg         -               1650
mk jacuzzi.jpg       $F/axis-l60-jacuzzi-lounge-sunset.jpg           -               1650
mk sky-gym.jpg       $F/axis-power-studio-sky-gym.jpg                -               1650
mk gym.jpg           $F/brixton-gymnasium.jpg                        -               1650
mk sky-bbq.jpg       $F/l57-glowing-sky-bbq-hammock-garden.jpg       -               1650
mk coral-pool.jpg    $F/l12-coral-dreamer-pool.jpg                   -               1650
mk kids.jpg          $F/l12-kids-water-play.jpg                      -               1000
mk forest.jpg        $F/l12-luminescence-forest.jpg                  -               1650

# Floor plans: re-rendered from the brochure PDFs at 300 dpi (they are vector), drawing only,
# brochure paper whitened. The 12 Jun 2026 Brixton & Dover brochure is the one with all of C–F2.
T=$(mktemp -d); trap 'rm -rf "$T"' EXIT
BD=$M/brochures/Causewayz-Brixton-Dover-Brochure_2026-06-12_goprop-own-stay.pdf
AX=$M/brochures/Causewayz-Axis-Tower-Brochure.pdf
pdftoppm -r 300 -f 17 -l 20 -png "$BD" "$T/b"
pdftoppm -r 300 -f 16 -l 17 -png "$AX" "$T/a"
plan(){ # out page half(0|1|axis)
  local out=$1 pg=$2 half=$3 box lv="colorlevels=rimax=0.94:gimax=0.92:bimax=0.85"
  if [ "$half" = axis ]; then
    box=$(python3 -I scripts/bbox.py "$pg" 1650 120 1700 2280 120 40)
    lv="colorlevels=rimin=0.04:gimin=0.04:bimin=0.04:rimax=0.84:gimax=0.83:bimax=0.80"  # Axis pages are printed on marble
  else box=$(python3 -I scripts/bbox.py "$pg" $((half*2480+300)) 842 1980 1610 150 40); fi
  ffmpeg -loglevel error -y -i "$pg" -vf "crop=$box,scale='min(1400,iw)':-2:flags=lanczos,$lv,eq=saturation=0.75" -q:v 2 "$OUT/plans/$out.jpg"
}
plan C  "$T/b-17.png" 1
plan D1 "$T/b-18.png" 0
plan D2 "$T/b-18.png" 1
plan E1 "$T/b-19.png" 0
plan E2 "$T/b-19.png" 1
plan F1 "$T/b-20.png" 0
plan F2 "$T/b-20.png" 1
plan A  "$T/a-16.png" axis
plan B  "$T/a-17.png" axis

cp "$M/images/brand/causewayz-square-jbcc-logo_copper_transparent.png" $OUT/logo-causewayz.png
cp "$M/images/brand/exsim-logo-tagline_transparent.png" $OUT/logo-exsim.png

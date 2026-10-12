#!/bin/bash
# Build graded, web-sized webp assets for the proposal page.
set -e
M=/Users/el/lab/askjoey/materials/rf-princess-cove-phase-3/images
O="$(cd "$(dirname "$0")" && pwd)/../.assets"
mkdir -p "$O"; rm -f "$O"/*

# "Warm editorial" grade (recommended): softer saturation, warm mids, lifted blacks
G="eq=saturation=0.78:contrast=0.95:brightness=0.01,colorbalance=rs=0.035:gs=0.01:bs=-0.045:rm=0.03:gm=0.005:bm=-0.03:rh=0.02:gh=0.01:bh=-0.02,curves=all='0/0.04 0.5/0.51 1/0.97'"
# "Noir" grade (direction B)
N="eq=saturation=0.5:contrast=1.06:brightness=-0.04,colorbalance=rs=0.02:bs=-0.02,curves=all='0/0.03 0.6/0.55 1/0.9'"
# "Fresh" grade (direction C): near-original, a touch brighter
F="eq=saturation=0.92:brightness=0.025:contrast=0.98"
# Floor plans: quiet the pastel fills
P="eq=saturation=0.35:contrast=1.04"

mk(){ # name src crop width filter quality
  local name=$1 src=$2 crop=$3 w=$4 flt=$5 q=$6 vf=""
  [ "$crop" != "-" ] && vf="crop=$crop,"
  vf="${vf}scale=$w:-2:flags=lanczos"
  [ "$flt" != "-" ] && vf="$vf,$flt"
  ffmpeg -loglevel error -y -i "$src" -vf "$vf" "$O/$name.png"
  cwebp -quiet -q "$q" -m 6 "$O/$name.png" -o "$O/$name.webp"
  rm "$O/$name.png"
}

R=$M/renders; L=$M/lifestyle; FA=$M/facilities; FP=$M/floor-plans
mk hero      $R/tower-dusk-landscape.jpg 2560:1640:0:203 1600 "$G" 62
mk hero_raw  $R/tower-dusk-landscape.jpg 2560:1640:0:203 640 -    70
mk hero_g    $R/tower-dusk-landscape.jpg 2560:1640:0:203 640 "$G" 70
mk hero_n    $R/tower-dusk-landscape.jpg 2560:1640:0:203 640 "$N" 70
mk hero_p    $R/tower-dusk-portrait.jpg  2100:2801:262:0 760 "$G" 62
mk hero_pn   $R/tower-dusk-portrait.jpg  2100:2801:262:0 520 "$N" 64
mk day       $R/tower-day-street.jpg     -               1400 "$G" 60
mk day_c     $R/tower-day-street.jpg     -               640 "$F" 68
mk day_cp    $R/tower-day-street.jpg     1300:1843:800:0 520 "$F" 66
mk aerial    $R/causeway-aerial-panorama.jpg -           1600 "$G" 60
mk night     $R/aerial-night.jpg         2560:1600:0:243 1100 "$G" 60
mk pool      $R/pool-wide.jpg            1600:720:0:80   1200 "$G" 62
mk skypark   $R/sky-park-garden.jpg      -               755 "$G" 66
mk walkway   $R/covered-walkway.jpg      -               754 "$G" 66
mk rts       $R/rts-station.png          -               900 "$G" 62
mk family    $L/family-snooker.jpg       -               1000 "$G" 62
mk tennis    $L/tennis-couple.jpg        -               900 "$G" 62
mk gym       $FA/gym-1.jpg               1100:480:0:105  900 "$G" 64
mk yoga      $FA/yoga-room.jpg           1100:480:0:105  900 "$G" 64
mk childcare $FA/childcare-centre.jpg    1100:480:0:105  900 "$G" 64
mk badminton $FA/badminton-hall.jpg      1100:480:0:105  900 "$G" 64
mk plan_A    $FP/01-type-A.jpg           1310:1420:250:420 520 "$P" 72
mk plan_B1   $FP/06-type-B1.jpg          1310:1420:250:420 520 "$P" 72
mk plan_C    $FP/09-type-C.jpg           1310:1420:250:420 520 "$P" 72
mk plan_D1   $FP/18-type-D1.jpg          1310:1420:250:420 520 "$P" 72
mk plan_E    $FP/21-type-E.jpg           1310:1420:250:420 520 "$P" 72
ffmpeg -loglevel error -y -i $M/brand/rf-group-princess-cove-logo-bronze.png -vf "scale=420:-2:flags=lanczos" "$O/logo.png"
cwebp -quiet -q 90 -alpha_q 100 "$O/logo.png" -o "$O/logo.webp"; rm "$O/logo.png"
ls -la "$O" | awk '{s+=$5; print $5, $9} END {print "TOTAL", s}'

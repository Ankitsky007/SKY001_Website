#!/usr/bin/env bash
# Builds v6 TypeSafe as one shareable Claude artifact in apps/v6-typesafe/dist-artifact.
# The artifact viewer only loads files published with the page, so the showcase media the site
# normally streams from the research bucket is copied in, and the 22 MB jaguar frame strip is
# split in two (artifact files are capped at 15 MB). The two pages swap in place, the 3D
# explorer opens in a new tab (other sites can't be embedded).
set -euo pipefail
cd "$(dirname "$0")/../apps/v6-typesafe"
BUCKET=https://pub-911937f44c474bb0bbc394f23b6bce46.r2.dev/apple
rm -rf dist-artifact
VITE_ROUTER=memory VITE_EXPLORER_EXTERNAL=1 VITE_MEDIA_BASE=./media VITE_EXPLORER_BASE=$BUCKET \
  npx vite build --base ./ --outDir dist-artifact
M=dist-artifact/media
mkdir -p $M/reel $M/seq $M/img
for id in jaguar jet arcmate tractor; do
  curl -sf -o $M/reel/$id.mp4 $BUCKET/reel/$id.mp4
  curl -sf -o $M/seq/${id}_poster.webp $BUCKET/seq/${id}_poster.webp
  curl -sf -o $M/seq/${id}_final.webp $BUCKET/seq/${id}_final.webp
  curl -sf -o $M/img/in_$id.webp $BUCKET/img/in_$id.webp
done
curl -sf -o $M/seq/jaguar.json $BUCKET/seq/jaguar.json
curl -sf -o $M/seq/jaguar.full $BUCKET/seq/jaguar.bin
python3 - <<'PY'
import json
d = 'dist-artifact/media/seq'
data = open(f'{d}/jaguar.full', 'rb').read()
half = len(data) // 2
# .webp names because the viewer only serves web media types; the loader reads raw bytes
open(f'{d}/jaguar.part0.webp', 'wb').write(data[:half])
open(f'{d}/jaguar.part1.webp', 'wb').write(data[half:])
meta = json.load(open(f'{d}/jaguar.json'))
meta['parts'] = ['jaguar.part0.webp', 'jaguar.part1.webp']
json.dump(meta, open(f'{d}/jaguar.json', 'w'))
PY
rm $M/seq/jaguar.full
echo "Built apps/v6-typesafe/dist-artifact"

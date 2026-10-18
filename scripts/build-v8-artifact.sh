#!/usr/bin/env bash
# Builds the v8 Rewrite site as one shareable Claude artifact in apps/v8-rewrite/dist-artifact.
# The artifact viewer only loads files published with the page, so the showcase media the site
# normally streams from the research bucket is copied in. Pages switch on #home / #sky-001 / #blog,
# and the forms pretend to send.
set -euo pipefail
cd "$(dirname "$0")/../apps/v8-rewrite"
BUCKET=https://pub-911937f44c474bb0bbc394f23b6bce46.r2.dev/apple
rm -rf dist-artifact
VITE_HASH_ROUTES=1 VITE_FORMS_DEMO=1 VITE_MEDIA_BASE=./media \
  npx vite build --base ./ --outDir dist-artifact
M=dist-artifact/media
mkdir -p $M/reel $M/seq $M/img
for id in jaguar jet arcmate tractor; do
  curl -sf -o $M/reel/$id.mp4 $BUCKET/reel/$id.mp4
  curl -sf -o $M/seq/${id}_poster.webp $BUCKET/seq/${id}_poster.webp
  curl -sf -o $M/seq/${id}_final.webp $BUCKET/seq/${id}_final.webp
  curl -sf -o $M/img/in_$id.webp $BUCKET/img/in_$id.webp
done
echo "Built apps/v8-rewrite/dist-artifact"

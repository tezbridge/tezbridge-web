rm -rf docs
rm -rf .cache

NODE_ENV=browser \
parcel build \
  src/pages/index.html \
  src/pages/playground.html \
  src/pages/plugin.js \
  src/pages/protocols/PsddFKi3.js \
  src/pages/protocols/Pt24m4xi.js \
  --no-source-maps --out-dir docs

cp src/CNAME docs/

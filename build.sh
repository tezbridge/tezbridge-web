rm -rf docs
rm -rf .cache

BROWSER_OPT=true \
parcel build \
  src/pages/index.html \
  src/pages/plugin.js \
  src/pages/protocols/PsCARTHA.js \
  src/pages/protocols/PsBabyM1.js \
  --no-source-maps --out-dir docs

cp src/CNAME docs/
cp src/.nojekyll docs/
# cp -r src/pages/legacy docs/

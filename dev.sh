rm -rf .cache
rm -rf dist

BROWSER_OPT=true \
parcel \
  src/pages/index.html \
  src/pages/playground.html \
  src/pages/plugin.js \
  src/pages/protocols/PsBabyM1.js \
  --target browser --https

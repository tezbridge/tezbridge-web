rm -rf .cache
rm -rf dist

BROWSER_OPT=true \
parcel \
  src/pages/index.html \
  src/pages/playground.html \
  src/pages/plugin.js \
  src/pages/protocols/PsCARTHA.js \
  src/pages/protocols/PsDELPH1.js \
  --target browser --https

#!/bin/bash
npm update && npm prune && npm dedupe
find docs/ -not -name CNAME -not -name docs -delete 
parcel build --no-minify --out-dir docs index.html view/index.html edit/index.html
git add -A
git commit -m 'publish'
git push

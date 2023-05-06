#!/bin/bash

VERSION=$(npx -c 'echo "$npm_package_version"')
echo "$VERSION"

docker build . -t teemukoivumaa/financial-viewer-back:$VERSION 
docker push teemukoivumaa/financial-viewer-back:$VERSION
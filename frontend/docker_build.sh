#!/bin/bash

VERSION=$(npx -c 'echo "$npm_package_version"')
echo "$VERSION"

docker build . -t teemukoivumaa/financial-viewer-front:$VERSION 
docker push teemukoivumaa/financial-viewer-front:$VERSION
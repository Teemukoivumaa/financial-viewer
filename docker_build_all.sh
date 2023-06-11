#!/bin/bash

cd /home/teemukoivumaa/financial-viewer/frontend
VERSION=$(npx -c 'echo "$npm_package_version"')
echo "Frontend version: $VERSION"

docker build . -t teemukoivumaa/financial-viewer-front:$VERSION 
docker push teemukoivumaa/financial-viewer-front:$VERSION

cd /home/teemukoivumaa/financial-viewer/backend
VERSION=$(npx -c 'echo "$npm_package_version"')
echo "Backend version: $VERSION"

docker build . -t teemukoivumaa/financial-viewer-back:$VERSION 
docker push teemukoivumaa/financial-viewer-back:$VERSION

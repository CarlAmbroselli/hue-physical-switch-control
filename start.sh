#!/bin/bash

set -eou
source $HOME/.profile

cd "$(dirname "$0")"

SECRET_FILE=./config.yaml
if [ ! -f "$SECRET_FILE" ]; then
    echo "Error. Please initialize $SECRET_FILE first using the template."
    exit 1
fi

VERSION=$(git rev-list --count main)
TAG=$(basename $(pwd))

if [[ "$(docker images -q $TAG:$VERSION 2> /dev/null)" == "" ]]; then
  docker build -t $TAG:$VERSION .
fi

docker run -p 10080:10080 --detached --restart=always --name "hue-physical-switch-control" $TAG:$VERSION

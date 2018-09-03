#!/bin/bash
REPO=docker-reg.emotibot.com.cn:55688
CONTAINER=general-node-base
DATE=`date +%Y%m%d`
GIT_HEAD="$(git rev-parse --short HEAD)"
TAG="$DATE-$GIT_HEAD"

DOCKER_IMAGE=$REPO/$CONTAINER:$TAG
echo "TAG: $TAG"
echo "DOCKER_IMAGE: $DOCKER_IMAGE"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BUILDROOT=$DIR/../

# Build docker
cmd="docker build \
  -t $DOCKER_IMAGE \
  -f $DIR/DockerfileBase $BUILDROOT"
echo $cmd
eval $cmd
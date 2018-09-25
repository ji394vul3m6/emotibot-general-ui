#!/bin/bash
REPO=docker-reg.emotibot.com.cn:55688
CONTAINER=admin-ui
LAST_RELEASE_TAG="20171208-e04c85e"
DATE=`date +%Y%m%d`
GIT_HEAD="$(git rev-parse --short=7 HEAD)"

TAG=$1
if [ "$TAG" == "" ]; then
    TAG="$DATE-$GIT_HEAD"
elif [ "$TAG" == "LR" ]; then
    TAG=$LAST_RELEASE_TAG
fi

DOCKER_IMAGE=$REPO/$CONTAINER:$TAG
echo "TAG: $TAG"
echo "DOCKER_IMAGE: $DOCKER_IMAGE"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
BUILDROOT=$DIR/../

# Build docker
cmd="docker build \
  -t $DOCKER_IMAGE \
  --build-arg GITTAG=$TAG \
  -f $DIR/Dockerfile $BUILDROOT"
echo $cmd
eval $cmd
cmd="docker tag $DOCKER_IMAGE $REPO/$CONTAINER:latest"
echo $cmd
eval $cmd

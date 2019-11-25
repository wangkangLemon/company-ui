#!/usr/bin/env bash

set -e

BASE_NAME="yst-company-ui-probase"

docker build -t hub.docker.vodjk.com:5000/yst/company-ui:probase ./base/
if [[ ! -z "$(docker ps -a|grep $BASE_NAME)" ]]; then
    docker rm -f $BASE_NAME
fi
docker create --name $BASE_NAME hub.docker.vodjk.com:5000/yst/company-ui:probase
docker cp $BASE_NAME:/node/src/git.vodjk.com/yst/company-ui .

tag=`git rev-parse --short=12 HEAD`

docker build -t hub.docker.vodjk.com:5000/yst/company-ui:pro_${tag} .
docker tag hub.docker.vodjk.com:5000/yst/company-ui:pro_${tag} hub.docker.vodjk.com:5000/yst/company-ui:pro
docker push hub.docker.vodjk.com:5000/yst/company-ui:pro_${tag}
docker push hub.docker.vodjk.com:5000/yst/company-ui:pro

rm -fR company-ui
docker rm $BASE_NAME
docker rmi hub.docker.vodjk.com:5000/yst/company-ui:pro
docker rmi hub.docker.vodjk.com:5000/yst/company-ui:pro_${tag}

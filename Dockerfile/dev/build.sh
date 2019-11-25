#!/usr/bin/env bash

set -e

docker build -t hub.docker.vodjk.com:5000/yst/company-ui:dev .
docker push hub.docker.vodjk.com:5000/yst/company-ui:dev

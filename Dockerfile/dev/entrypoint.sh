#!/usr/bin/env bash

set -e

export BRANCH=$1
if [[ $BRANCH == "" ]]; then export BRANCH=develop; fi

cd /node/src/git.vodjk.com/yst/company-ui
git pull origin $BRANCH
cd /node/src/git.vodjk.com/yst/company-ui/assets
cp -f config/config.js.default config/config.js
yarn run build
cd /node/src/git.vodjk.com/yst/company-ui
npm run start

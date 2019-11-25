FROM hub.docker.vodjk.com:5000/node/common
MAINTAINER coldstar yanghf@vodjk.com

WORKDIR /node/src/

RUN mkdir -p /node/src/git.vodjk.com/yst \
    && cd git.vodjk.com/yst/ \
    && git clone ssh://git@git.vodjk.com:10022/yst/company-ui.git

ADD "http://git.vodjk.com:10080/yst/company-ui.atom?private_token=7XxYJqdG_LGy7poftisV" git.vodjk.com/yst/

RUN cd /node/src/git.vodjk.com/yst/company-ui/ \
    && git checkout master \
    && git pull origin master \
    && yarn install

RUN cd /node/src/git.vodjk.com/yst/company-ui/assets \
    && cp config/config.js.default config/config.js \
    && npm link node-sass \
    && yarn install \
    && yarn run build \
    && rm -fR node_modules

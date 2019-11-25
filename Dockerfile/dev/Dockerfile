FROM hub.docker.vodjk.com:5000/node/common
MAINTAINER jingziming fenghk@vodjk.com

WORKDIR /node/src/

# 指定dev编译环境，调用dev接口域名
ENV RUN_ENV dev

RUN mkdir -p /node/src/git.vodjk.com/yst \
    && cd git.vodjk.com/yst/ \
    && git clone ssh://git@git.vodjk.com:10022/yst/company-ui.git

ADD "http://git.vodjk.com:10080/yst/company-ui.atom?private_token=7XxYJqdG_LGy7poftisV" git.vodjk.com/yst/

RUN cd /node/src/git.vodjk.com/yst/company-ui \
    && git checkout develop \
    && git pull origin develop \
    && yarn install

RUN cd /node/src/git.vodjk.com/yst/company-ui/assets \
    && cp config/config.js.default config/config.js \
    && npm link node-sass \
    && yarn install

ADD entrypoint.sh /

EXPOSE 80

CMD ["/entrypoint.sh"]
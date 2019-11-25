FROM hub.docker.vodjk.com:5000/node:8.9-alpine

ENV NODE_ENV production
ENV PORT 80

RUN mkdir -p /usr/local/server/yst/company-ui

WORKDIR /usr/local/server/yst/company-ui

ADD company-ui/bin ./bin/
ADD company-ui/node_modules ./node_modules/
ADD company-ui/public ./public/
ADD company-ui/routes ./routes/
ADD company-ui/views ./views/
ADD company-ui/app.js .
ADD company-ui/package.json .

ADD entrypoint.sh /

EXPOSE 80

CMD ["/entrypoint.sh"]
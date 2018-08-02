FROM docker-reg.emotibot.com.cn:55688/general-node-base:20180530-d11d8a1 AS build-env

# ADD . build
ADD build build/build
ADD config build/config
ADD static build/static
ADD src build/src
ADD .babelrc .postcssrc.js .eslintrc.js .eslintignore login.html index.html version.html package.json build/
RUN cd build && npm install --production && npm run build

FROM docker-reg.emotibot.com.cn:55688/token-auth:20180802-f992c08 AS authentication
FROM docker-reg.emotibot.com.cn:55688/admin-api:20180802-a0e13a8 AS api-server

FROM nginx:1.13-alpine

COPY docker/conf/nginx.conf.template /etc/nginx/nginx.conf.template

COPY --from=api-server /usr/local/bin /api
COPY --from=build-env /build/dist/index.html /build/dist/
COPY --from=build-env /build/dist/login.html /build/dist/
COPY --from=build-env /build/dist/version.html /build/dist/
COPY --from=build-env /build/dist/static /build/dist/static
COPY --from=authentication /usr/local/bin /auth
WORKDIR /build/dist

ARG GITTAG
RUN echo $GITTAG > /build/dist/uiversion.html

COPY docker/file_init.sh file_init.shㄌ
COPY docker/entrypoint.sh entrypoint.sh
RUN rm -rf /build/dist/Files
ENTRYPOINT ["./entrypoint.sh"]

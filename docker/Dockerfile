FROM docker-reg.emotibot.com.cn:55688/general-node-base:20180903-ed1b4bf7 AS build-env

# ADD . build
ADD build build/build
ADD config build/config
ADD static build/static
ADD src build/src
ADD .babelrc .postcssrc.js .eslintrc.js .eslintignore login.html index.html version.html package.json build/
RUN cd build && npm install --production && npm run build

FROM docker-reg.emotibot.com.cn:55688/token-auth:20180907-223eb835 AS authentication
FROM docker-reg.emotibot.com.cn:55688/admin-api:b605cb09_20180911-1030 AS api-server

FROM nginx:1.13-alpine
RUN echo http://mirrors.ustc.edu.cn/alpine/v3.7/main > /etc/apk/repositories; \
echo http://mirrors.ustc.edu.cn/alpine/v3.7/community >> /etc/apk/repositories
RUN apk add --no-cache tzdata
COPY docker/conf/nginx.conf.template /etc/nginx/nginx.conf.template

COPY --from=api-server /usr/bin/app /api
COPY --from=build-env /build/dist/index.html /build/dist/
COPY --from=build-env /build/dist/login.html /build/dist/
COPY --from=build-env /build/dist/version.html /build/dist/
COPY --from=build-env /build/dist/static /build/dist/static
COPY --from=authentication /usr/local/bin /auth
WORKDIR /build/dist

ARG GITTAG
RUN echo $GITTAG > /build/dist/uiversion.html

COPY docker/file_init.sh file_init.sh
COPY docker/entrypoint.sh entrypoint.sh
RUN rm -rf /build/dist/Files
ENTRYPOINT ["./entrypoint.sh"]

FROM docker-reg.emotibot.com.cn:55688/general-node-base:20180530-d11d8a1 AS build-env

# ADD . build
ADD build build/build
ADD config build/config
ADD static build/static
ADD src build/src
ADD .babelrc .postcssrc.js .eslintrc.js .eslintignore login.html index.html package.json build/
RUN cd build && npm install --production && npm run build

FROM docker-reg.emotibot.com.cn:55688/houta:effd385_vipshop AS houta-code
FROM docker-reg.emotibot.com.cn:55688/token-auth:20180622-1405d6d AS authentication
FROM docker-reg.emotibot.com.cn:55688/admin-api:20180622-a8752aa AS api-server

FROM nginx:1.13-alpine

RUN apk update --no-cache \
  && apk add tzdata openrc php5 php5-fpm php5-opcache php5-gd php5-mysqli php5-zlib php5-curl php5-json php5-zip php5-xml curl \
  && rc-update add php-fpm default

# FIXME: since chroot cause basic cli not found, copy one of them to make command work.
RUN mkdir -p /php/lib /php/usr/lib /php/bin /php/usr/bin /php/dev
WORKDIR /php
RUN for n in `ls -L /lib` ; do if [ ! -d /lib/$n ]; then cp /lib/$n /php/lib/ ; fi ;  done
RUN for n in `ls -L /usr/lib` ; do if [ ! -d /usr/lib/$n ]; then cp /usr/lib/$n /php/usr/lib/ ; fi ;  done
RUN for n in `ls -L /bin` ; do if [ ! -d /bin/$n ]; then cp /bin/$n /php/bin/ ; fi ;  done
RUN for n in `ls -L /usr/bin` ; do if [ ! -d /usr/bin/$n ]; then cp /usr/bin/$n /php/usr/bin/ ; fi ;  done
RUN cp -a /dev/zero /dev/urandom /dev/null /php/dev/

COPY docker/conf/nginx.conf.template /etc/nginx/nginx.conf.template
COPY docker/conf/www.conf /etc/php5/fpm.d/www.conf
COPY docker/conf/php.ini /etc/php5/php.ini

COPY --from=houta-code /var/www/html /build/dist
COPY --from=houta-code /var/www/html /php
COPY --from=api-server /usr/local/bin /api
COPY --from=build-env /build/dist/index.html /build/dist/
COPY --from=build-env /build/dist/login.html /build/dist/
COPY --from=build-env /build/dist/static /build/dist/static
COPY --from=authentication /usr/local/bin /auth
WORKDIR /build/dist

ARG GITTAG
RUN echo $GITTAG > /build/dist/uiversion.html

COPY docker/file_init.sh file_init.sh
COPY docker/entrypoint.sh entrypoint.sh
RUN rm -rf /build/dist/Files
ENTRYPOINT ["./entrypoint.sh"]

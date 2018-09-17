ARG ARG_build_env
ARG ARG_admin_api
ARG ARG_token_auth
FROM docker-reg.emotibot.com.cn:55688/general-ui-build:${ARG_build_env} AS build-env
FROM docker-reg.emotibot.com.cn:55688/token-auth:${ARG_token_auth} AS authentication
FROM docker-reg.emotibot.com.cn:55688/admin-api:${ARG_admin_api} AS api-server

FROM centos:centos7.4.1708
RUN yum update -y \
    && yum install -y epel-release \
    && yum install -y nginx \
    && yum clean all

RUN curl -L https://github.com/a8m/envsubst/releases/download/v1.0.0/envsubst-`uname -s`-`uname -m` -o envsubst \
    && chmod +x envsubst \
    && mv envsubst /usr/bin


COPY ./conf/nginx.conf.template /etc/nginx/nginx.conf.template

COPY --from=api-server /usr/bin/app /api
COPY --from=build-env /build/dist/index.html /build/dist/
COPY --from=build-env /build/dist/login.html /build/dist/
COPY --from=build-env /build/dist/version.html /build/dist/
COPY --from=build-env /build/dist/static /build/dist/static
COPY --from=authentication /usr/local/bin /auth
WORKDIR /build/dist

COPY ./file_init.sh file_init.sh
COPY ./entrypoint.sh entrypoint.sh

ARG ARG_GIT_TAG
RUN echo ${ARG_GIT_TAG} > /build/dist/uiversion.html

ENTRYPOINT ["./entrypoint.sh"]

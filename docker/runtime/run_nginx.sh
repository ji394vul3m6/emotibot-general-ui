#!/bin/sh
cd /etc/nginx
rm nginx.conf
envsubst '
$$NAMESERVER
$$ADMIN_BF_SERVER_URL
$$ADMIN_IM_SERVER_URL
$$ADMIN_IM_MSG_KF_URL
$$ADMIN_IM_WEB_AGENT
$$ADMIN_STAT_SERVER_URL
$$ADMIN_ELK_STAT_SERVER_URL
$$ADMIN_SSO_SERVER' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
nginx -g "daemon off;"

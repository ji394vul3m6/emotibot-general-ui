#!/bin/sh

NAMESERVER=`cat /etc/resolv.conf | grep "nameserver" | awk '{print $2}' | tr '\n' ' '`

# start crond
crond -f &

#decrypt password
if ! [[ -z "$DECRYPTION_SERVICE" ]]; then
    MYSQL_PASSWORD=$(/api/desEncrypt -t $ADMIN_AUTH_MYSQL_PASS)
    if [[ $? -ne 0 ]]; then
      exit 1
    fi
    export ADMIN_AUTH_MYSQL_PASS=$MYSQL_PASSWORD
fi
# start authentication 
/auth/token-auth &

# start api
cd /api && ./files_init.sh && ./entrypoint.sh &

cd /etc/nginx
rm nginx.conf
while read line
do 
  echo $line \
    | sed -e "s/\${ADMIN_STAT_SERVER_URL}/$ADMIN_STAT_SERVER_URL/g" \
    | sed -e "s/\${ADMIN_ELK_STAT_SERVER_URL}/$ADMIN_ELK_STAT_SERVER_URL/g" \
    | sed -e "s/\${ADMIN_IM_SERVER_URL}/$ADMIN_IM_SERVER_URL/g" \
    | sed -e "s/\${ADMIN_BF_SERVER_URL}/$ADMIN_BF_SERVER_URL/g" \
    | sed -e "s/\${NAMESERVER}/$NAMESERVER/g" >> nginx.conf
done < nginx.conf.template
nginx -g "daemon off;"

#!/bin/sh

#decrypt password for php
if ! [[ -z "$DECRYPTION_SERVICE" ]]; then
    MYSQL_PASSWORD=$(/api/desEncrypt -t $ADMIN_HT_DB_PASSWORD)
    if [[ $? -ne 0 ]]; then
      exit 1
    fi
    export ADMIN_HT_DB_PASSWORD=$MYSQL_PASSWORD
    
    MYSQL_PASSWORD=$(/api/desEncrypt -t $ADMIN_HT_AUDIT_DB_PASSWORD)
    if [[ $? -ne 0 ]]; then
      exit 1
    fi
    export ADMIN_HT_AUDIT_DB_PASSWORD=$MYSQL_PASSWORD
fi

# add env to php-fpm config
env | grep ADMIN_HT | sed -e "s/^ADMIN_//" | sed -e "s/^\([A-Z_a-z0-9]*\)=\"\{0,1\}\([^\"]*\)\"\{0,1\}/env[\1] = \"\2\"/g" >> /etc/php5/fpm.d/www.conf
php-fpm -R

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
cd /api && ./files_init.sh && ./entrypoint.sh env.template &

# Add tmp dir for fastcgi php usage, used for uploaded file
mkdir /build/dist/tmp && chmod 777 /build/dist/tmp

echo "Fix chroot issue"
mkdir /build/dist/etc
for n in `ls -L /etc` ; do if [ ! -d /etc/$n ]; then cp /etc/$n /build/dist/etc/ ; fi ;  done

cd /etc/nginx
rm nginx.conf
while read line
do 
  echo $line | sed -e "s/\${ADMIN_STAT_SERVER_URL}/$ADMIN_STAT_SERVER_URL/g" | sed -e "s/\${ADMIN_BF_SERVER_URL}/$ADMIN_BF_SERVER_URL/g" >> nginx.conf
done < nginx.conf.template
nginx -g "daemon off;"

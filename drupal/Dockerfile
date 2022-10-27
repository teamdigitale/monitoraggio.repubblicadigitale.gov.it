FROM php:8.1.11-apache-buster

ENV ThemeBuildCommand=build

ENV APACHE_RUN_USER=www-data
ENV APACHE_RUN_GROUP=www-data

RUN cd /etc && rm localtime && ln -s /usr/share/zoneinfo/Europe/Rome localtime

RUN apt-get update && apt-get upgrade -y

RUN php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');" && php composer-setup.php
RUN php -r "unlink('composer-setup.php');"
RUN mv composer.phar /usr/bin/composer

RUN apt-get install nano -y
RUN apt-get install git -y
RUN apt-get install zlib1g-dev -y
RUN apt-get install libzip-dev -y
RUN apt-get install libpng-dev -y
RUN apt-get install zip -y
RUN apt-get install npm -y
RUN apt-get install mysql\* -y
RUN apt-get install cron -y

RUN npm install -g n
RUN n lts

RUN docker-php-ext-install mysqli && docker-php-ext-enable mysqli
RUN docker-php-ext-install pdo pdo_mysql && docker-php-ext-enable pdo pdo_mysql
RUN docker-php-ext-install gd && docker-php-ext-enable gd
RUN docker-php-ext-install zip && docker-php-ext-enable zip
RUN docker-php-ext-install opcache && docker-php-ext-enable opcache
RUN pecl install redis && docker-php-ext-enable redis
RUN apt-get install libldap2-dev -y
RUN docker-php-ext-install ldap  && docker-php-ext-enable ldap
RUN apt-get install memcached libmemcached-tools libmemcached-dev -y
RUN pecl install memcached   && docker-php-ext-enable memcached

RUN echo 'memory_limit = 256M' >> /usr/local/etc/php/conf.d/docker-php-memlimit.ini

RUN a2enmod rewrite

COPY ./deploy/000-default.conf /etc/apache2/sites-available/000-default.conf
COPY ./deploy/ports.conf /etc/apache2/ports.conf

RUN rm -rf /var/www/html/
ADD ./ /var/www/html
RUN chown -R www-data:www-data /var/www

RUN chsh -s /bin/bash www-data

RUN mkdir /var/log/cron/
RUN chown -R www-data:www-data /var/log/cron/

USER ${APACHE_RUN_USER}:

RUN (cd /var/www/html/ && composer install -v)

RUN (crontab -u $(whoami) -l; echo "0 * * * * /usr/local/bin/php /var/www/html/vendor/bin/drush cron > /var/log/cron/drupal.log" ) | crontab -u $(whoami) -

USER root:

CMD service cron restart && /usr/sbin/apache2ctl -D FOREGROUND

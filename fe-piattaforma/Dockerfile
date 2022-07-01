FROM nginx:alpine as builder

RUN apk --update add nginx

RUN rm -rf /usr/share/nginx/html/*

COPY fe-piattaforma.nginx.conf /etc/nginx/conf.d/

COPY build /usr/share/nginx/html

EXPOSE 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]

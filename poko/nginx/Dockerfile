FROM nginx:latest
RUN rm /etc/nginx/conf.d/default.conf

ARG NGINX_CONF=nginx.conf
COPY $NGINX_CONF /etc/nginx/conf.d/nginx.conf

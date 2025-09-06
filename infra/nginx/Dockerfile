FROM nginx:alpine
RUN apk add --no-cache gettext
COPY templates/conf.template* /etc/nginx/templates/
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 443
ENTRYPOINT ["/entrypoint.sh"]
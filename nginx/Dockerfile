FROM nginx:alpine
RUN apk add --no-cache gettext
COPY nginx/templates/conf.template* /etc/nginx/templates/
COPY nginx/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80 443
ENTRYPOINT ["/entrypoint.sh"]
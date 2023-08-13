FROM nginx
WORKDIR /etc
COPY ./default.conf ./nginx/conf.d/
COPY ./build/ /usr/share/nginx/html/
EXPOSE 8100

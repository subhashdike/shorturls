# https://hub.docker.com/_/nginx/
FROM nginx:1.18.0-alpine

# copy the app code into the container.
#  NOTICE: check the .dockerignore file for items that are *excluded*.
COPY entrypoint.sh /
COPY . /app/
ARG BACKEND_PORT
ARG BACKEND_HOST_NAME

COPY default.conf /etc/nginx/conf.d/default.conf

WORKDIR /app

RUN apk add --no-cache                                                  \
    bash nodejs npm                                                     \
  && chmod u+x /entrypoint.sh                                           \
  && npm install          

WORKDIR /app

# Build the app with npm to produce the static html code needed for app.
# NOTE: build is needed in entrypoint so we can use DEPLOY_ENV.
RUN REACT_APP_BACKENDURL=http://${BACKEND_HOST_NAME}:${BACKEND_PORT} npm run build
# After building the generated site is in /app/build dir, move this to
#  the nginx site dir and delete the /app data
RUN rm -rf /usr/share/nginx/html
RUN mv /app/build /usr/share/nginx/html
RUN rm -rf /app
RUN apk del nodejs
RUN rm -rf /root/.npm/
RUN rm -rf /var/cache/apk


WORKDIR /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT [ "/entrypoint.sh" ]

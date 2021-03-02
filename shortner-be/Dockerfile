# https://hub.docker.com/_/node/
FROM node:14.11.0-alpine

# copy the app code into the container.
COPY . /app/
COPY entrypoint.sh /entrypoint.sh
WORKDIR /app

RUN chmod u+x /entrypoint.sh        

RUN apk add --no-cache bash

RUN echo "Installing typescript"                                       \
  && npm install -g typescript
RUN echo "Installing package.json dependencies"                        \
  && npm install
                                                         
RUN echo "Building application"                                         \
&& npm run build
    
RUN echo 'Cleaning up source'                                           \
&& rm -rf /src                                                          \
&& echo "Done - Removing the source"

EXPOSE 5000
ENTRYPOINT [ "/entrypoint.sh" ]

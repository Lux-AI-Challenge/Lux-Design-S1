FROM node:12.18.4-alpine3.11

RUN apk update

RUN apk --no-cache add docker-cli

RUN apk add --no-cache bash

RUN mkdir /server

COPY ./package.json ./package-lock.json ./server.ts ./tsconfig.json ./copy_keys.sh ./start.sh ./.env /server/

COPY ./keys server/keys

WORKDIR /server

RUN npm i
RUN npm run build

# CMD [ "node", "lib/server.js" ]
CMD [ "sh", "/server/start.sh" ]
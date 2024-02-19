FROM node:14.17-alpine

ARG NODE_ENV


WORKDIR /usr/src/app
COPY . .

ENV NODE_ENV $NODE_ENV

RUN yarn install --frozen-lockfile
RUN yarn build:$NODE_ENV
EXPOSE 3000
CMD yarn start:$NODE_ENV


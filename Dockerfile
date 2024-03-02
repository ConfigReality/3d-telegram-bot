FROM node:20-alpine as base

WORKDIR /app

COPY package.json /app

RUN npm i

COPY . .

FROM base as production

ENV NODE_PATH=./dist

RUN npm run build

COPY .env /app

COPY dist /app/dist
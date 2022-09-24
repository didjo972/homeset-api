FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN rm -rf node_modules && npm ci

COPY ormconfig.ts ./
COPY swaggerconfig.json ./
COPY src ./src
COPY tsconfig.json ./
COPY tslint.json ./

RUN rm -rf test

ENV NODE_APP="Homeset-api"
ENV NODE_ENV=production

RUN npm run build

WORKDIR /app/dist

COPY .env-prod .env

RUN npm install pm2 -g

CMD ["pm2-runtime","src/index.js"]

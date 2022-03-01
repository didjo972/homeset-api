
   
# test using the latest node container
FROM node:latest AS ci

# mark it with a label, so we can remove dangling images
LABEL cicd="homeset-api"

WORKDIR /app
COPY package.json .
COPY src ./src
COPY test ./test
RUN npm ci --development

# test
# RUN npm test

# get production modules
RUN rm -rf node_modules && npm ci --production

# This is our runtime container that will end up
# running on the device.
FROM node:alpine

# mark it with a label, so we can remove dangling images
LABEL cicd="homeset-api"

WORKDIR /app
COPY package.json ./

RUN npm ci --production

COPY dist ./dist

# Launch our App.
CMD ["node", "dist/src/index.js"]
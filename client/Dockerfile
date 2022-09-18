# syntax=docker/dockerfile:1

# To run server:
# sudo docker build --tag client .
# sudo docker run --publish 3000:3000 client

# See https://github.com/nodejs/docker-node/blob/main/README.md#how-to-use-this-image
FROM node:lts

# ENV NODE_ENV=production

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --legacy-peer-deps

COPY . .

CMD [ "npm", "start" ]
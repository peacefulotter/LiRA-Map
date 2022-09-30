# syntax=docker/dockerfile:1

# To run server:
# sudo docker build --tag client .
# sudo docker run -d -p 3000:3000 client

# See https://github.com/nodejs/docker-node/blob/main/README.md#how-to-use-this-image
FROM node:lts

# The base node image sets a very verbose log level.
#ENV NPM_CONFIG_LOGLEVEL warn

COPY . .

# Build for production.
RUN npm install --legacy-peer-deps
RUN npm run build --production

# Install `serve` to run the application.
RUN npm install -g serve

COPY . .

# Set the command to start the node server.
CMD serve -p 80 -s build

# Tell Docker about the port we'll run on.
# virker ikke
EXPOSE 80
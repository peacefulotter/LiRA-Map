# syntax=docker/dockerfile:1

# To run server:
# sudo docker build --tag client .
# sudo docker run -d -p 3000:3000 client

# See https://github.com/nodejs/docker-node/blob/main/README.md#how-to-use-this-image
FROM node:lts

COPY . .

# Build for production.
RUN npm install --legacy-peer-deps
RUN npm run build --production

# Install `serve` to run the application.
RUN npm install -g serve

COPY . .

# Set the command to start the node server.
CMD serve -p 8080 -s build
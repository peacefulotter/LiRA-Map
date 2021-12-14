FROM node:16

WORKDIR /app-client

COPY package.json /app-client/package.json

ADD . /app-client

EXPOSE 3000

RUN npm i

CMD ["npm", "start"]

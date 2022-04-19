FROM node:16

WORKDIR /app

COPY package.json /app/package.json

ADD . /app

EXPOSE 3001

RUN npm i

CMD ["npm", "start"]

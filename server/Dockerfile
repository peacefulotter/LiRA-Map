FROM node:alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY ./ ./

EXPOSE 3001

RUN npm i

CMD ["npm", "run", "start"]


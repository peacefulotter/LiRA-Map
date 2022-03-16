# LiRA-Map

## Development
#### Client
 - cd client
 - npm i
 - npm start

#### Server
 - cd server
 - npm i
 - npm start
 
## Production
 - `npm i -g pm2`
 - `npm i -g serve`

#### Client
 - cd client
 - npm i
 - npm run build
 - pm2 serve build 3000 --spa

#### Server
 - cd server
 - npm i
 - npm run build
 - pm2 serve dist 3001 --spa

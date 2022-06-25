
# Instructions to connect to the lirase2 VM and start the LiRA-Map web app

## 1. SSH connection

(replace `<USER>` with your user name)
```console
$ ssh <USER>@lirase2.compute.dtu.dk
```

## 2. Install global libraries

```console
$ npm install -g serve pm2
```

## 3. Clone the LiRA-Map repo
```console
$ git clone https://github.com/PeacefulOtter/LiRA-Map.git
$ cd LiRA-Map
```

## 4. Start the Client 
```console
LiRA-Map$ cd client
LiRA-Map/client$ npm install
LiRA-Map/client$ npm run build
LiRA-Map/client$ pm2 serve build 3000 --spa --name client
```

## 5. Setup the Server (.env file)

```console
LiRA-Map$ cd server-nest
LiRA-Map/server-nest$ nano .env
```

### The .env file must follow the format:
```md
DB_USER=<LIRA-CAR-DB-USER>
DB_PASSWORD=<LIRA-CAR-DB-PWD>
DB_USER_VIS=<SERGI-DB-USER>
DB_PASSWORD_VIS=<SERGI-DB-PWD>
DB_USER_POSTGIS=<JUN-DB-USER>
DB_PWD_POSTGIS=<JUN-DB-USER>
```

## 6. Start the Server
```console
LiRA-Map/server-nest$ npm install
LiRA-Map/server-nest$ npm run build
LiRA-Map/server-nest$ pm2 start dist/main.js --name server
```


# Instructions to connect to the lirase2 VM and start the LiRA-Map web app

## 1. SSH connection

(replace `<USER>` with your user name)
```console
$ ssh <USER>@lirase2.compute.dtu.dk
```

## 2. Install global libraries

```console
user@lirase2:~$ npm install -g serve pm2
```

## 3. Clone the LiRA-Map repo
```console
user@lirase2:~$ git clone https://github.com/PeacefulOtter/LiRA-Map.git
user@lirase2:~$ cd LiRA-Map
```

## 4. Start the Client 
```console
user@lirase2:~/LiRA-Map$ cd client
user@lirase2:~/LiRA-Map/client$ npm install
user@lirase2:~/LiRA-Map/client$ npm run build
user@lirase2:~/LiRA-Map/client$ pm2 serve build 3000 --spa --name client
```

## 5. Setup the Server (.env file)

```console
user@lirase2:~/LiRA-Map$ cd server-nest
user@lirase2:~/LiRA-Map/server-nest$ nano .env
```

### The .env file must follow the format:
```
DB_USER=<LIRA-CAR-DB-USER>
DB_PASSWORD=<LIRA-CAR-DB-PWD>
DB_USER_VIS=<SERGI-DB-USER>
DB_PASSWORD_VIS=<SERGI-DB-PWD>
DB_USER_POSTGIS=<JUN-DB-USER>
DB_PWD_POSTGIS=<JUN-DB-USER>
```

## 6. Start the Server
```console
user@lirase2:~/LiRA-Map/server-nest$ npm install
user@lirase2:~/LiRA-Map/server-nest$ npm run build
user@lirase2:~/LiRA-Map/server-nest$ pm2 start dist/main.js --name server
```

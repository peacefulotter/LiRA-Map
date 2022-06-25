
# Instructions to connect to the lirase2 VM and start the LiRA-Map web app

## 1. SSH connection

(replace `<USER>` with your user name)
```console
$ ssh <USER>@lirase2.compute.dtu.dk
```

## 2. Install global libraries

```console
<USER>@lirase2:~$ npm install -g serve pm2
```

## 3. Clone the LiRA-Map repo
```console
<USER>@lirase2:~$ git clone https://github.com/PeacefulOtter/LiRA-Map.git
<USER>@lirase2:~$ cd LiRA-Map
```

## 4. Start the Client 
```console
<USER>@lirase2:~/LiRA-Map$ cd client
<USER>@lirase2:~/LiRA-Map/client$ npm install
<USER>@lirase2:~/LiRA-Map/client$ npm run build
<USER>@lirase2:~/LiRA-Map/client$ pm2 serve build 3000 --spa --name client
```

## 5. Setup the Server (.env file)

```console
<USER>@lirase2:~/LiRA-Map$ cd server-nest
<USER>@lirase2:~/LiRA-Map/server-nest$ nano .env
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
<USER>@lirase2:~/LiRA-Map/server-nest$ npm install
<USER>@lirase2:~/LiRA-Map/server-nest$ npm run build
<USER>@lirase2:~/LiRA-Map/server-nest$ pm2 start dist/main.js --name server
```

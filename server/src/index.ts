
import express from "express";
import { RoadSegments, RideMeta, Ride, RoadCondition, RidesModel, MeasurementsModel } from './models'

import { Pool, Client, PoolClient, QueryResult } from 'pg';
import { Client as SSH, ClientChannel } from 'ssh2'

import * as tunnel from 'tunnel-ssh';
import knex from 'knex'

import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' });

const env = process.env;

const { SSH_USERNAME, SSH_PASSWORD, DB_USER, DB_PASSWORD } = env;
const SSH_HOSTNAME = "thinlinc.compute.dtu.dk";
const DB_NAME = "postgres";
const SSH_PORT = 22;
const DB_HOST = "liradbdev.compute.dtu.dk";
const DB_PORT = 5432;

const CLIENT_CONFIG = {
	host: DB_HOST,
	port: DB_PORT,
	database: DB_NAME,
	user: DB_USER,
	password: DB_PASSWORD
}

const ssh = new SSH();
const client = new Client(CLIENT_CONFIG);


const sshConfig = {
	host: SSH_HOSTNAME,
	port: SSH_PORT,
	username: SSH_USERNAME,
	password: SSH_PASSWORD,
	keepaliveInterval: 60000,
	keepAlive: true,
	dstHost: DB_HOST,
	dstPort: DB_PORT,
	localHost: 'localhost',
	localPort: 8000
};

const tnl = tunnel.default(sshConfig, async (err: any, server: any) => {
	if (err) {
		throw err;
	}
	console.log(server);

	const database = knex({
		client: 'postgres',
		connection: {
		  host : DB_HOST,
		  user : DB_USER,
		  password : DB_PASSWORD,
		  database : DB_NAME
		}
	  });

	console.log(database);

	// need to use await database.select... but throws EHOSTUNREACH
	//'SELECT * FROM public."Measurements" where "FK_Trip" = \'7f67425e-26e6-4af3-9a6f-f72ff35a7b1a\' and "FK_MeasurementType" = \'a69d9fe0-7896-49e2-9e8d-e36f0d54f286\'',
	const res = database.select('*').from('public."Measurements"').where('"FK_Trip" = \'7f67425e-26e6-4af3-9a6f-f72ff35a7b1a\' and "FK_MeasurementType" = \'a69d9fe0-7896-49e2-9e8d-e36f0d54f286\'');
	res.then(a => console.log(a)).catch(err => console.log(err))
	console.log(res);

	
	tnl.close();
});




/*
ssh.on('ready', () =>  {
	console.log("ready");
	ssh.forwardOut(SSH_HOSTNAME, SSH_PORT, DB_HOST, DB_PORT, async (err, stream) => {
		stream.on('close', () => {
			console.log('TCP :: CLOSED');
			ssh.end();
		})
		// const pool = new Pool({
		// 	host: dbHost,
		// 	port: 5432,
		// 	database: dbName,
		// 	user: dbUser,
		// 	password: dbPwd,
		// })


		// for (let nRetry = 1; ; nRetry++) {
		// 	try {
		// 		const client = await pool.connect();
		// 		if (nRetry > 1) {
		// 			console.info('Now successfully connected to Postgres');
		// 		}
		// 		return client;
		// 	} catch (e) {
		// 		if (e.toString().includes('ECONNREFUSED') && nRetry < 5) {
		// 			console.info('ECONNREFUSED connecting to Postgres, ' +
		// 				'maybe container is not ready yet, will retry ' + nRetry);
		// 			// Wait 1 second
		// 			await new Promise(resolve => setTimeout(resolve, 1000));
		// 		} else {
		// 			throw e;
		// 		}
		// 	}
		// }

		// pool.connect( (errConn: Error, client: PoolClient, done: (release?: any) => void) =>  {
		// 	if (errConn) {console.log("pool connect error: ", errConn)}
		// 	else {
		// 		console.log('connectedd...');
		// 		console.log(client);
		// 		console.log(done);
		// 		pool.query(
		// 			'SELECT * FROM public."Measurements" where "FK_Trip" = \'7f67425e-26e6-4af3-9a6f-f72ff35a7b1a\' and "FK_MeasurementType" = \'a69d9fe0-7896-49e2-9e8d-e36f0d54f286\'',
		// 			(errQuery: Error, resQuery: QueryResult<any>) => {
		// 				console.log("pool query error: ", errQuery);
		// 				console.log("res query: ", resQuery);
		// 				pool.end();
		// 		})

		// 	}
		// });


		client.connect(errr => {
			if (errr) {
			  console.error('connection error',errr, errr.stack)
			} else {
			  console.log('connected')
			}})
        // pool.connect( (errCon, c: PoolClient, done: (release?: any) => void) => {
        //     if (errCon) {console.log(errCon)}
        //     else {console.log('connected...', c)}
        // });
        // client.end();
    })
})
.connect({
    host: SSH_HOSTNAME,
    port: SSH_PORT,
    username: SSH_USERNAME,
    password: SSH_PASSWORD
});
*/


const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json({
  type: ['application/json', 'text/plain']
}))



const firstSegments: RoadSegments = [
  { path: [
    { lat: 57.74, lng: 12 },
    { lat: 57.6792, lng: 12 }
  ],
    condition: RoadCondition.Good
  },

  { path: [
    { lat: 57.6792, lng: 12 },
    { lat: 57.70, lng: 12.04 }
  ],
    condition: RoadCondition.Correct
  },
]
const firstMeta: RideMeta = { time: 20, distance: 20,
  start_time: new Date(2018, 0O5, 0O5, 17, 23, 42, 11).toLocaleString(),
  end_time: new Date(2018, 0O5, 0O5, 17, 55, 12, 11).toLocaleString(),
  source: 'Lundtofteparken', destination: 'Norreport'}
const firstRide: Ride = { meta: firstMeta, segments: firstSegments }

const secondSegments: RoadSegments = [
  { path: [
    { lat: 57.74, lng: 11.94 },
    { lat: 57.6792, lng: 11.949 }
  ],
    condition: RoadCondition.Bad
  },
]
const secondMeta: RideMeta = { time: 10, distance: 10,
  start_time: new Date(2019, 0O6, 0O5, 14, 13, 42, 11).toLocaleString(),
  end_time: new Date(2019, 0O6, 0O5, 15, 55, 16, 11).toLocaleString(),
  source: 'Gentofte', destination: 'Ballerup'}
const secondRide: Ride = { meta: secondMeta, segments: secondSegments }



app.get("/measurements", (req, res) => {
  const data: MeasurementsModel = [ "Track Position","Interpolation","Map Matching" ]
  // tslint:disable-next-line:no-console
  console.log(data);

  res.json(data);
});



app.post("/login",(req,res) => {
  const body = req.body;
  const user = body.username;
  const email = body.email;
  const pass = body.password;

  // do something with the credentials

  res.json( { status: "ok" } );
});



app.get("/rides", (req, res) => {
  const data: RidesModel = [ firstRide, secondRide ]
  console.log(data);

  res.json(data);
});


app.listen(PORT, () => {
   // tslint:disable-next-line:no-console
  console.log(`Server listening on ${PORT}`);
});

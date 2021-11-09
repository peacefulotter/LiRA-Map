
import express from "express";
import { RoadSegments, RideMeta, Ride, RoadCondition, RidesModel, MeasurementsModel } from './models'

import { Pool, Client, PoolClient, QueryResult } from 'pg';
import { Client as SSH, ClientChannel } from 'ssh2'

import * as tunnel from 'tunnel-ssh';
import knex from 'knex'

import * as dotenv from "dotenv";
dotenv.config({ path: __dirname+'/.env' });


import * as sql from 'mssql'


const env = process.env;

const { SSH_USERNAME, SSH_PASSWORD, DB_USER, DB_PASSWORD } = env;

const SSH_HOSTNAME = "thinlinc.compute.dtu.dk";
const SSH_DB_PORT = 22;

const DB_NAME = "postgres";
const DB_HOST = "liradbdev.compute.dtu.dk";
const DB_PORT = 5432;


const launchClient = () => {
	const CLIENT_CONFIG = {
		host: DB_HOST,
		port: DB_PORT,
		database: DB_NAME,
		user: DB_USER,
		password: DB_PASSWORD,
		ssl: true,
		// connectionString: `${DB_NAME}://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/database?ssl=true`
	};

	const client = new Client(CLIENT_CONFIG);

	client.connect(errr => {
		if (errr) {
			console.error('connection error', errr)
		} else {
		  	console.log('connected')
		}
	})
}
// launchClient()



const ssh = new SSH();


const sshConfig = {
	host: SSH_HOSTNAME,
	port: 22,
	username: SSH_USERNAME,
	password: SSH_PASSWORD,
	keepaliveInterval: 60000,
	keepAlive: true,
	dstHost: DB_HOST,
	dstPort: DB_PORT,
	localHost: "127.0.0.1",
	localPort: 3333
};


const tnl = tunnel.default(sshConfig, async (err: any, server: any) => {
	if (err) {
		console.error("tudozdjiaojdijazdnnel", err);
	}
	console.log("serverrrr", server);

	const database = knex({
		client: 'postgres',
		connection: {
		  	host : "127.0.0.1",
		  	port: 3333,
		  	user : DB_USER,
		  	password : DB_PASSWORD,
		  	database : DB_NAME,
		}
	});


	console.log("databaseeeeeee", database);

	const res = database.select('*').from('public."Measurements"').where({"FK_Trip": '7f67425e-26e6-4af3-9a6f-f72ff35a7b1a', "FK_MeasurementType": 'a69d9fe0-7896-49e2-9e8d-e36f0d54f286'});
	res.then(a => console.log(a)).catch(errr => console.log("errr", errr))
	console.log(res);

	// const pool = new Pool({
	// 		host: DB_HOST,
	// 		port: DB_PORT,
	// 		database: DB_NAME,
	// 		user: DB_USER,
	// 		password: DB_PASSWORD,
	// 	})

	// console.log("poool", pool);


	// pool.connect((errr, c, release) => {
	// 	if (errr) {
	// 		return console.error('Error acquiring client', errr)
	// 	}
	// 	console.log("client connect", c);

	// 	c.query(
	// 		'SELECT * FROM public."Measurements" where "FK_Trip" = \'7f67425e-26e6-4af3-9a6f-f72ff35a7b1a\' and "FK_MeasurementType" = \'a69d9fe0-7896-49e2-9e8d-e36f0d54f286\'',
	// 		(errQuery: Error, resQuery: QueryResult<any>) => {
	// 		console.log("pool query error: ", errQuery);
	// 		console.log("res query: ", resQuery);
	// 		pool.end();
	// 	})
	// })
})






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
  	console.log(`Server listening on ${PORT}`);
});

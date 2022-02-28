
import express from 'express';
import * as http from 'http';
import fs from 'fs'

import databaseQuery from './database'
import osrmQuery from './osrm';

import { RideData, RideMeta } from "./models";
import { getRides, getTest, getMeasurementData } from './queries'

import initWebsockets from './websockets';
import measurements from './measurements.json';
import { writeJsonFile } from './file';



const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.urlencoded({
	extended: true
}))

app.use(express.json({
	type: ['application/json', 'text/plain'],
	limit: '200mb'
}))


app.post('/push_file', async (req: any, res: any) => {
	const { filename, content } = req.body;
	await writeJsonFile(filename, content);
	res.json({status: 'ok'})
})


// test
app.get('/a', async (req: any, res: any) => {
	const r = await databaseQuery<any>( async (db: any, args: any) => {
		const tripid = '2857262b-71db-49df-8db6-a042987bf0eb'

		const sql = db
		.select( [ 'T', 'lat', 'lon', 'message' ] )
		.from( { public: 'Measurements' } )
		.where( { 'FK_Trip': tripid, 'T': ['acc.xyz', 'track.pos'] } )
		.toString()

		console.log(sql);

		const q = await db
		.select( [ 'T', 'lat', 'lon', 'message' ] )
		.from( { public: 'Measurements' } )
		.where( { 'FK_Trip': tripid, 'T': ['acc.xyz', 'track.pos'] } )

		return q;
	})

	res.json(r)
})


app.get('/measurements', async (req: any, res: any) => {
	console.log("[GET /measurements]" );
	res.json( measurements );
} )

app.put('/addmeasurement', async (req: any, res: any) => {
	const measurement = req.body.params;
	const updatedFile = [...measurements, measurement]
	fs.writeFile('./src/measurements.json', JSON.stringify(updatedFile, null, 4), 'utf8',
		() => console.log('[PUT /addmeasurement] Added Measurement to the json file')
	);
	res.json()
})

app.put('/editmeasurement', async (req: any, res: any) => {
	const params = req.body.params;
	const updatedFile = [...measurements]
	updatedFile[params.index] = params.measurement
	fs.writeFile('./src/measurements.json', JSON.stringify(updatedFile, null, 4), 'utf8',
		() => console.log('[PUT /editmeasurement] Edtited Measurement to the json file')
	);
	res.json()
})

app.get("/map_match", async (req: any, res: any) => {
	const tripID = req.query.tripID;
	const path: RideData = await databaseQuery<RideData>(getMeasurementData, tripID, 'track.pos')
	console.log("[GET /map_match] Requested ride", tripID, "path ", path);
	const data: any = await osrmQuery(path);
	res.json( data );
} )

app.get("/trip_measurement", async (req: any, res: any) => {
	const tripID = req.query.tripID
	const measurement = req.query.measurement
	console.log("[GET /trip_measurement] Requested measurement ", measurement, " for id", tripID);
	const data: RideData = await databaseQuery<RideData>(getMeasurementData, tripID, measurement)
	res.json( data );
} )

app.get("/rides", async (req: any, res: any) => {
	console.log("[GET /rides]");
	const data: RideMeta[] = await databaseQuery<RideMeta[]>(getRides, '')
	res.json( data )
} )

app.get("/test", async (req: any, res: any) => {
	console.log("[GET /test]");
	const data: any[] = await databaseQuery<any[]>(getTest, '')
	res.json( data )
} )


app.get("/login",(req,res) => {
	console.log("[GET /login]");
	const body = req.query;
	const user = body.username;
	const email = body.email;
	const pass = body.password;
	// do something with the credentials
	res.json( { status: "ok" } );
});


const server = http.createServer(app);

// start our server
server.listen( PORT, () => {
	console.log(`Server listening on ${PORT}`);
	initWebsockets(server)
});
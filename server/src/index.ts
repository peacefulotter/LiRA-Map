
import express, { Express } from "express";

import databaseQuery from './database'
import osrmQuery from './osrm';

import { RideData, RideMeta } from "./models";
import { getRides, getTest, getMeasurementData } from './queries'

import measurements from './measurements.json';

const PORT = process.env.PORT || 3001;

const app: Express = express();

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json({
  type: ['application/json', 'text/plain']
}))


app.get('/measurements', async (req: any, res: any) => {
	console.log("[GET /measurements]" );
    res.json( measurements );
} )

app.put('/measurements', async (req: any, res: any) => {
	const measurement = req.body.params;
	console.log("[PUT /measurements]", measurement );
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


app.listen(PORT, () => {
  	console.log(`Server listening on ${PORT}`);
});
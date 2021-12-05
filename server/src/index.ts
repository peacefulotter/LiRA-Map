
import express, { Express } from "express";

import databaseQuery from './database'
import osrmQuery from './osrm';

import { PointData, RideData, RideMeta } from "./models";
import { getRides, getTrackPositions, getInterpolatedData, getRPMS, getTest, getMeasurementData } from './queries'

const PORT = process.env.PORT || 3001;

const app: Express = express();

app.use(express.urlencoded({
    extended: true
}))

app.use(express.json({
  type: ['application/json', 'text/plain']
}))


// RIDE-DATA
app.post("/trackpos", async (req: any, res: any) => {
    const tripID = req.body.tripID; // '7f67425e-26e6-4af3-9a6f-f72ff35a7b1a';
    console.log("[POST /trackpos] Requested ride ", tripID);
    const data: RideData = await databaseQuery<RideData>(getTrackPositions, tripID)
    res.json( data );
} )

app.post("/interpolation", async (req: any, res: any) => {
    const tripID = req.body.tripID;
    console.log("[POST /interpolation] Requested ride ", tripID);
    const data: RideData = await databaseQuery<RideData>(getInterpolatedData, tripID)
    res.json( data );
} )

app.post("/map_match", async (req: any, res: any) => {
	const tripID = req.body.tripID;
	const path: RideData = await databaseQuery<RideData>(getInterpolatedData, tripID)
    console.log("[POST /map_match] Requested ride", tripID, "path ", path);
    const data: any = await osrmQuery(path);
    res.json( data );
} )

app.post("/rpms", async (req: any, res: any) => {
  const tripID = req.body.tripID;
  console.log("[POST /rpms] Requested ride ", tripID);
  const data: RideData = await databaseQuery<RideData>(getRPMS, tripID)
  res.json( data );
} )

app.post("/trip_data", async (req: any, res: any) => {
  const tripID = req.body.tripID
  const measurement = req.body.measurement
  console.log("[POST /trip_data] Requested measurement ", measurement, " for id", tripID);
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


app.post("/login",(req,res) => {
  const body = req.body;
  const user = body.username;
  const email = body.email;
  const pass = body.password;
  // do something with the credentials
  res.json( { status: "ok" } );
});


app.listen(PORT, () => {
  	console.log(`Server listening on ${PORT}`);
});
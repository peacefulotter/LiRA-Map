
import express from "express";
import { RoadSegments, RideMeta, Ride, RoadCondition, RidesModel, MeasurementsModel } from './models'

import {db} from './database'

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


db(app);



app.post("/login",(req,res) => {
  const body = req.body;
  const user = body.username;
  const email = body.email;
  const pass = body.password;

  // do something with the credentials

  res.json( { status: "ok" } );
});



app.get("/gg", (req, res) => {
  const data: RidesModel = [ firstRide, secondRide ]
  console.log(data);

  res.json(data);
});


app.listen(PORT, () => {
  	console.log(`Server listening on ${PORT}`);
});

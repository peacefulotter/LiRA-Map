
import express from "express";
import { RoadSegments, RideMeta, Ride, RoadCondition, RidesModel } from './models'

const PORT = process.env.PORT || 3001;

const app = express();





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
const firstMeta: RideMeta = { time: 20, distance: 20 }
const firstRide: Ride = { meta: firstMeta, segments: firstSegments }

const secondSegments: RoadSegments = [
  { path: [
    { lat: 57.74, lng: 11.94 },
    { lat: 57.6792, lng: 11.949 }
  ],
    condition: RoadCondition.Bad
  },
]
const secondMeta: RideMeta = { time: 10, distance: 10 }
const secondRide: Ride = { meta: secondMeta, segments: secondSegments }





app.get("/rides", (req, res) => {
  const data: RidesModel = [ firstRide, secondRide ]
  // tslint:disable-next-line:no-console
  console.log(data);

  res.json(data);
});


app.listen(PORT, () => {
   // tslint:disable-next-line:no-console
  console.log(`Server listening on ${PORT}`);
});
